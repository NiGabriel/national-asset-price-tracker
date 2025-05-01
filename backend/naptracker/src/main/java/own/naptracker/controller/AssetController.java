package own.naptracker.controller;

import org.springframework.http.ResponseEntity;
import own.naptracker.dto.AssetDTO;
import own.naptracker.model.Asset;
import own.naptracker.repository.AssetRepository;
import org.springframework.web.bind.annotation.*;
import own.naptracker.repository.CategoryRepository;
import own.naptracker.model.Category;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    private final AssetRepository assetRepository;

    private final CategoryRepository categoryRepository;

    public AssetController(AssetRepository assetRepository, CategoryRepository categoryRepository) {
        this.assetRepository = assetRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
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

        return ResponseEntity.ok("Asset created successfully!!");
    }



    //Updating
    @PutMapping("/{id}")
    public ResponseEntity<String> updateAsset(@PathVariable Long id, @RequestBody AssetDTO assetDTO){
        Asset asset = assetRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Asset not found"));

        Category category = categoryRepository.findById(assetDTO.getCategoryId())
                .orElseThrow(()-> new RuntimeException("Category not found"));

        asset.setName(assetDTO.getName());
        asset.setPrice(assetDTO.getPrice());
        asset.setCategory(category);
        asset.setUpdateAt(assetDTO.getUpdatedAt());

        assetRepository.save(asset);

        return ResponseEntity.ok("Asset update successfully");
    }


    //Deleting
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAsset(@PathVariable Long id){
        if(!assetRepository.existsById(id)){
            return ResponseEntity.notFound().build();
        }

        assetRepository.deleteById(id);

        return ResponseEntity.ok("Asset deleted successfully!");
    }
}
