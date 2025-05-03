package own.naptracker.repository;

import own.naptracker.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByCategoryIdOrderByUpdateAtDesc(Long categoryId);

}
