package own.naptracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import own.naptracker.model.PriceHistory;

import java.util.List;
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long>{
    List<PriceHistory> findByAssetIdOrderByRecordedAtDesc(Long assetId);
    List<PriceHistory> findByAssetId(Long assetId);
}
