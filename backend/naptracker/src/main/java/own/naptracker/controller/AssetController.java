package own.naptracker.controller;

import org.springframework.http.ResponseEntity;
import own.naptracker.dto.AssetDTO;
import own.naptracker.model.*;
import own.naptracker.repository.AssetRepository;
import org.springframework.web.bind.annotation.*;
import own.naptracker.repository.CategoryRepository;
import own.naptracker.repository.LogRepository;
import org.springframework.security.core.Authentication;
import own.naptracker.repository.PriceHistoryRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    private final AssetRepository assetRepository;

    private final CategoryRepository categoryRepository;

    private final LogRepository logRepository;

    private final PriceHistoryRepository priceHistoryRepository;


    public AssetController(AssetRepository assetRepository, CategoryRepository categoryRepository, LogRepository logRepository, PriceHistoryRepository priceHistoryRepository) {
        this.assetRepository = assetRepository;
        this.categoryRepository = categoryRepository;
        this.logRepository = logRepository;
        this.priceHistoryRepository = priceHistoryRepository;
    }

    @GetMapping
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }


    @GetMapping("/me")
    public ResponseEntity<?> getLoggedInUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal(); // Cast to your custom User class
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssetById(@PathVariable Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        List<PriceHistory> history = priceHistoryRepository.findByAssetIdOrderByRecordedAtDesc(id);

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("asset", asset);
        if (!history.isEmpty()) {
            response.put("latestHistory", history.get(0));
        }

        return ResponseEntity.ok(response);
    }



    @PostMapping
    public ResponseEntity<String> addAsset(@RequestBody AssetDTO assetDTO, Authentication authentication) {
        Category category = categoryRepository.findById(assetDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Determine trend
//        List<Asset> previousAssets = assetRepository.findByCategoryIdOrderByUpdateAtDesc(category.getId());
        String trend = "Stable";
//        if (!previousAssets.isEmpty()) {
//            Asset latest = previousAssets.get(0);
//            if (assetDTO.getPrice().compareTo(latest.getPrice()) > 0) {
//                trend = "Rising";
//            } else if (assetDTO.getPrice().compareTo(latest.getPrice()) < 0) {
//                trend = "Falling";
//            } else {
//                trend = latest.getTrend();  // keep the previous trend
//            }
//        }

        Asset asset = new Asset();
        asset.setName(assetDTO.getName());
        asset.setPrice(assetDTO.getPrice());
        asset.setCategory(category);
        asset.setUpdateAt(assetDTO.getUpdatedAt());
        asset.setDescription(assetDTO.getDescription());
        asset.setImageUrl(assetDTO.getImageUrl());
        asset.setTrend(trend);

        assetRepository.save(asset);

        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setAsset(asset);
        priceHistory.setPrice(asset.getPrice());
        priceHistory.setRecordedAt(LocalDateTime.now());
        priceHistoryRepository.save(priceHistory);

        User user = (User) authentication.getPrincipal();
        Log log = new Log();
        log.setAction("create");
        log.setDescription("Created asset: " + asset.getName());
        log.setRecordId(asset.getId());
        log.setRecordType("asset");
        log.setUser(user);
        logRepository.save(log);

        return ResponseEntity.ok("Asset created successfully!!");
    }



    //Updating
    @PutMapping("/{id}")
    public ResponseEntity<String> updateAsset(@PathVariable Long id,
                                              @RequestBody AssetDTO assetDTO,
                                              Authentication authentication) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        Category category = categoryRepository.findById(assetDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Compare with previous price to determine trend
        BigDecimal previousPrice = asset.getPrice();
        BigDecimal newPrice = assetDTO.getPrice();

        String newTrend;
        int comparison = newPrice.compareTo(previousPrice);

        if (comparison > 0) {
            newTrend = "Rising";
        } else if (comparison < 0) {
            newTrend = "Falling";
        } else {
            newTrend = asset.getTrend(); // keep previous trend
        }

        // Update asset fields
        asset.setName(assetDTO.getName());
        asset.setPrice(newPrice);
        asset.setCategory(category);
        asset.setUpdateAt(assetDTO.getUpdatedAt());
        asset.setDescription(assetDTO.getDescription());
        asset.setImageUrl(assetDTO.getImageUrl());
        asset.setTrend(newTrend);  // update trend

        assetRepository.save(asset);

        // Save price history
        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setAsset(asset);
        priceHistory.setPrice(asset.getPrice());
        priceHistory.setRecordedAt(LocalDateTime.now());

        priceHistoryRepository.save(priceHistory);

        // Logging
        User user = (User) authentication.getPrincipal();

        Log log = new Log();
        log.setAction("update");
        log.setDescription("updated asset: " + asset.getName());
        log.setRecordId(asset.getId());
        log.setRecordType("asset");
        log.setUser(user);

        logRepository.save(log);

        return ResponseEntity.ok("Asset updated successfully");
    }



    //Deleting
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAsset(@PathVariable Long id,Authentication authentication) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if (!assetRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        User user = (User) authentication.getPrincipal();

        Log log = new Log();
        log.setAction("delete");
        log.setDescription("deleted asset: " + asset.getName());
        log.setRecordId(asset.getId());
        log.setRecordType("asset");

        log.setUser(user);

        logRepository.save(log);

        assetRepository.deleteById(id);

        return ResponseEntity.ok("Asset deleted successfully!");
    }
}
