package own.naptracker.controller;

import org.springframework.http.ResponseEntity;
import own.naptracker.dto.AssetDTO;
import own.naptracker.model.Asset;
import own.naptracker.model.Log;
import own.naptracker.model.User;
import own.naptracker.repository.AssetRepository;
import org.springframework.web.bind.annotation.*;
import own.naptracker.repository.CategoryRepository;
import own.naptracker.model.Category;
import own.naptracker.repository.LogRepository;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    private final AssetRepository assetRepository;

    private final CategoryRepository categoryRepository;

    private final LogRepository logRepository;


    public AssetController(AssetRepository assetRepository, CategoryRepository categoryRepository, LogRepository logRepository) {
        this.assetRepository = assetRepository;
        this.categoryRepository = categoryRepository;
        this.logRepository = logRepository;
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
    public Asset getAssetById(@PathVariable Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(("Asset not found with ID: ") + id));
    }


    @PostMapping
    public ResponseEntity<String> addAsset(@RequestBody AssetDTO assetDTO) {
        Category category = categoryRepository.findById(assetDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categroy not found"));

        Asset asset = new Asset();
        asset.setName(assetDTO.getName());
        asset.setPrice(assetDTO.getPrice());
        asset.setCategory(category);
        asset.setUpdateAt(assetDTO.getUpdatedAt());

        //save
        assetRepository.save(asset);

        Log log = new Log();

        log.setAction("create");
        log.setDescription("created asset: " + asset.getName());
        log.setAsset(asset);

        //Temporary mock user
        User user = new User();
        user.setId(3L);
        log.setUser(user);

        //save the log
        logRepository.save(log);

        return ResponseEntity.ok("Asset created successfully!!");
    }


    //Updating
    @PutMapping("/{id}")
    public ResponseEntity<String> updateAsset(@PathVariable Long id, @RequestBody AssetDTO assetDTO) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        Category category = categoryRepository.findById(assetDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        asset.setName(assetDTO.getName());
        asset.setPrice(assetDTO.getPrice());
        asset.setCategory(category);
        asset.setUpdateAt(assetDTO.getUpdatedAt());

        assetRepository.save(asset);

        Log log = new Log();
        log.setAction("update");
        log.setDescription("updated asset: " + asset.getName());
        log.setAsset(asset);

        User user = new User();
        user.setId(3L);
        log.setUser(user);

        logRepository.save(log);


        return ResponseEntity.ok("Asset update successfully");
    }


    //Deleting
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAsset(@PathVariable Long id) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        if (!assetRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        Log log = new Log();
        log.setAction("delete");
        log.setDescription("deleted asset: " + asset.getName());
        log.setAsset(asset);

        User user = new User();
        user.setId(3L);
        log.setUser(user);

        logRepository.save(log);

        assetRepository.deleteById(id);

        return ResponseEntity.ok("Asset deleted successfully!");
    }
}
