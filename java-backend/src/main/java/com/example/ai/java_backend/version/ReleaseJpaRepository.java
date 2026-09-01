package com.example.ai.java_backend.version;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReleaseJpaRepository extends JpaRepository<ReleaseEntity, Long> {
  // findByReleaseLabel 方法用于根据版本标签查找版本信息
  Optional<ReleaseEntity> findByReleaseLabel(String releaseLabel);

}
