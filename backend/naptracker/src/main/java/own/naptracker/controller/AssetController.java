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

        return ResponseEntity.ok(Map.of(
                "asset", asset,
                "latestHistory", history.isEmpty() ? null : history.get(0)
        ));
    }


    @PostMapping
    public ResponseEntity<String> addAsset(@RequestBody AssetDTO assetDTO, Authentication authentication) {
        Category category = categoryRepository.findById(assetDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categroy not found"));

        Asset asset = new Asset();
        asset.setName(assetDTO.getName());
        asset.setPrice(assetDTO.getPrice());
        asset.setCategory(category);
        asset.setUpdateAt(assetDTO.getUpdatedAt());

        //save
        assetRepository.save(asset);

        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setAsset(asset);
        priceHistory.setPrice(asset.getPrice());
        priceHistory.setRecordedAt(LocalDateTime.now());

        priceHistoryRepository.save(priceHistory);


        //Temporary mock user
        User user = (User) authentication.getPrincipal();

        Log log = new Log();
        log.setAction("create");
        log.setDescription("created asset: " + asset.getName());
        log.setRecordId(asset.getId());
        log.setRecordType("asset");
        log.setUser(user);

        //save the log
        logRepository.save(log);

        return ResponseEntity.ok("Asset created successfully!!");
    }


    //Updating
    @PutMapping("/{id}")
    public ResponseEntity<String> updateAsset(@PathVariable Long id, @RequestBody AssetDTO assetDTO,Authentication authentication) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        Category category = categoryRepository.findById(assetDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        asset.setName(assetDTO.getName());
        asset.setPrice(assetDTO.getPrice());
        asset.setCategory(category);
        asset.setUpdateAt(assetDTO.getUpdatedAt());

        assetRepository.save(asset);

        // Save price history
        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setAsset(asset);
        priceHistory.setPrice(asset.getPrice());
        priceHistory.setRecordedAt(LocalDateTime.now());

        priceHistoryRepository.save(priceHistory);


        User user = (User) authentication.getPrincipal();

        Log log = new Log();
        log.setAction("update");
        log.setDescription("updated asset: " + asset.getName());
        log.setRecordId(asset.getId());
        log.setRecordType("asset");
        log.setUser(user);


        logRepository.save(log);


        return ResponseEntity.ok("Asset update successfully");
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
