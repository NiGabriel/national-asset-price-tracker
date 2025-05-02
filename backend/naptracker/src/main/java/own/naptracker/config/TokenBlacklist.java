package own.naptracker.config;

import org.springframework.stereotype.Component;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.concurrent.TimeUnit;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklist {

    private final StringRedisTemplate redisTemplate;


    public TokenBlacklist(StringRedisTemplate redisTemplate){
        this.redisTemplate = redisTemplate;
    }

    public void blacklistToken(String token, long expirationMillis){
        redisTemplate.opsForValue().set(token, "blacklisted", expirationMillis, TimeUnit.MILLISECONDS);
    }

    public boolean isTokenBlacklisted(String token){
        return Boolean.TRUE.equals(redisTemplate.hasKey(token));
    }
}
