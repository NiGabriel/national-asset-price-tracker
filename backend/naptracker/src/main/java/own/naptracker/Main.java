package own.naptracker;

import own.naptracker.model.Asset;
import own.naptracker.repository.AssetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }

    @Bean
    CommandLineRunner testDbConnection(AssetRepository assetRepository) {
        return args -> {
            List<Asset> assets = assetRepository.findAll();
            System.out.println("=== Assets in DB ===");
            assets.forEach(asset -> System.out.println(asset.getId() + ": " + asset.getName() + " - " + asset.getPrice()));
        };
    }
}
