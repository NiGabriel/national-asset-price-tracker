package own.naptracker.controller;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import org.springframework.data.redis.core.StringRedisTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import own.naptracker.config.TokenBlacklist;
import own.naptracker.model.User;
import own.naptracker.repository.UserRepository;
import own.naptracker.config.JwtUtil;
import own.naptracker.service.EmailService;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static java.lang.System.currentTimeMillis;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklist tokenBlacklist;


    @Autowired
    private StringRedisTemplate redisTemplate;


    @Autowired
    private EmailService emailService;


    @Value("${app.reset.base-url}")
    private String resetBaseUrl;


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam String username, @RequestParam String password, @RequestParam int code) {
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }

        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        if (!gAuth.authorize(userOpt.get().getTotpSecret(), code)) {
            return ResponseEntity.status(403).body(Map.of("error", "Invalid 2FA code"));
        }

        String token = jwtUtil.generateToken(username);


        return ResponseEntity.ok().body(Map.of("token", token));
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            long expiryMillis = jwtUtil.getExpiration(token).getTime() - System.currentTimeMillis();
            tokenBlacklist.blacklistToken(token, expiryMillis);
            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
        }

        return ResponseEntity.badRequest().body("No token found in request");
    }


    @PostMapping("/request-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("No user  found with that email!");
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set("reset:" + token, user.getUsername(), Duration.ofMinutes(15));

        String resetUrl = resetBaseUrl + "?token=" + token;

        emailService.sendResetEmail(user.getEmail(), resetUrl);

        return ResponseEntity.ok("Password reset token issued. Use this URL: " + resetUrl);

    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        String username = redisTemplate.opsForValue().get("reset:" + token);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        User user = userRepository.findByUsername(username).orElseThrow();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        redisTemplate.delete("reset:" + token);
        return ResponseEntity.ok("Password reset successful");
    }


    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestParam String username,
                                                        @RequestParam String email,
                                                        @RequestParam String password,
                                                        @RequestParam String role) {

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("Notice", "Username already exists!"));
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);

        GoogleAuthenticator gAuth = new GoogleAuthenticator();
        GoogleAuthenticatorKey key = gAuth.createCredentials();

        String secret = key.getKey();  // Save this in DB for the user
        String otpAuthUrl = String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s",
                "NAPTracker", username, secret, "NAPTracker"
        );

        // URL-encode the full otpauth URL
        String encoded = URLEncoder.encode(otpAuthUrl, StandardCharsets.UTF_8);
        String qrUrl = "https://api.qrserver.com/v1/create-qr-code/?data=" + encoded + "&size=300x300";


        user.setTotpSecret(key.getKey());

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered");
        response.put("totpSecret", secret);
        response.put("qrUrl", qrUrl);

        return ResponseEntity.ok(response);
    }
}