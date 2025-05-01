package own.naptracker.controller;

import own.naptracker.model.Asset;
import own.naptracker.repository.AssetRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    private final AssetRepository assetRepository;

    public AssetController(AssetRepository assetRepository){
        this.assetRepository = assetRepository;
    }

    @GetMapping
    public List<Asset> getAllAssets(){
        return assetRepository.findAll();
    }


    @GetMapping("/{id}")
    public Asset getAssetById(@PathVariable Long id){
        return assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(("Asset not found with ID: ") + id));
    }
}
