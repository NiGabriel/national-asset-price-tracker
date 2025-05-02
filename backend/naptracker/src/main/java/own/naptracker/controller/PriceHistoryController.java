package own.naptracker.controller;

import own.naptracker.model.Asset;
import own.naptracker.model.Log;
import own.naptracker.model.PriceHistory;
import own.naptracker.model.User;
import own.naptracker.repository.AssetRepository;
import own.naptracker.repository.LogRepository;
import own.naptracker.repository.PriceHistoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/price-history")
@CrossOrigin(origins = "*")
public class PriceHistoryController {

    private final PriceHistoryRepository priceHistoryRepository;
    private final AssetRepository assetRepository;
    private final LogRepository logRepository;

    public PriceHistoryController(PriceHistoryRepository priceHistoryRepository, AssetRepository assetRepository, LogRepository logRepository) {
        this.priceHistoryRepository = priceHistoryRepository;
        this.assetRepository = assetRepository;
        this.logRepository = logRepository;
    }

    @GetMapping
    public List<PriceHistory> getAllPriceHistories(@RequestParam(required = false) Long assetId) {
        if (assetId != null) {
            return priceHistoryRepository.findByAssetId(assetId);
        }
        return priceHistoryRepository.findAll();
    }


    @GetMapping("/{assetId}")
    public List<PriceHistory> getHistoryByAsset(@PathVariable Long assetId) {
        return priceHistoryRepository.findByAssetIdOrderByRecordedAtDesc(assetId);
    }

    @PostMapping
    public ResponseEntity<String> addPriceHistory(@RequestParam Long assetId,
                                                  @RequestParam BigDecimal price,
                                                  Authentication authentication) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        PriceHistory history = new PriceHistory();
        history.setAsset(asset);
        history.setPrice(price);
        history.setRecordedAt(LocalDateTime.now());
        priceHistoryRepository.save(history);

        // Log the manual price history update
        User user = (User) authentication.getPrincipal();
        Log log = new Log();
        log.setAction("create");
        log.setDescription("Added price history for: " + asset.getName() + " - " + price);
        log.setUser(user);
        log.setRecordId(asset.getId());
        log.setRecordType("price_history");
        logRepository.save(log);

        return ResponseEntity.ok("Price history added.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePriceHistory(@PathVariable Long id,
                                                     @RequestParam BigDecimal price,
                                                     Authentication authentication) {
        PriceHistory history = priceHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Price history not found"));

        history.setPrice(price);
        history.setRecordedAt(LocalDateTime.now());
        priceHistoryRepository.save(history);

        // Log update
        User user = (User) authentication.getPrincipal();
        Log log = new Log();
        log.setAction("update");
        log.setDescription("Updated price history for asset: " + history.getAsset().getName() + " to " + price);
        log.setUser(user);
        log.setRecordId(history.getAsset().getId());
        log.setRecordType("price_history");
        logRepository.save(log);

        return ResponseEntity.ok("Price history updated.");
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePriceHistory(@PathVariable Long id, Authentication authentication) {
        PriceHistory history = priceHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Price history not found"));

        priceHistoryRepository.deleteById(id);

        // Log delete
        User user = (User) authentication.getPrincipal();
        Log log = new Log();
        log.setAction("delete");
        log.setDescription("Deleted price history for asset: " + history.getAsset().getName());
        log.setUser(user);
        log.setRecordId(history.getAsset().getId());
        log.setRecordType("price_history");
        logRepository.save(log);

        return ResponseEntity.ok("Price history deleted.");
    }
}