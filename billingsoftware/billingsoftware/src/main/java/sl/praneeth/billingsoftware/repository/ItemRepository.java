package sl.praneeth.billingsoftware.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sl.praneeth.billingsoftware.entity.ItemEntity;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<ItemEntity, Long> {

    Optional<ItemEntity> findByItemId(String id);

    Integer countByCategoryId(Long id);
}
