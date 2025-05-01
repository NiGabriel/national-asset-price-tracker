package own.naptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import own.naptracker.model.User;
import own.naptracker.repository.UserRepository;
import own.naptracker.config.JwtUtil;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam String username, @RequestParam String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error","Invalid username or password"));
        }

        String token = jwtUtil.generateToken(username);


        return ResponseEntity.ok().body(Map.of("token", token));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String username,
                                           @RequestParam String email,
                                           @RequestParam String password,
                                           @RequestParam String role) {

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}