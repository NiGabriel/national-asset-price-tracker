package own.naptracker.repository;

import own.naptracker.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LogRepository extends JpaRepository<Log, Long> {
}
