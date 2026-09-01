package com.example.ai.java_backend.version;

import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class JpaReleaseRepository implements ReleaseRepository {
  private final ReleaseJpaRepository releaseJpaRepository;

  // 构造函数注入 ReleaseJpaRepository 实例
  public JpaReleaseRepository(ReleaseJpaRepository releaseJpaRepository) {
    this.releaseJpaRepository = releaseJpaRepository;
  }

  // findByReleaseLabel 方法用于根据版本标签查找版本信息
  @Override
  public Optional<VersionResponse> findByReleaseLabel(String releaseLabel) {
    return releaseJpaRepository.findByReleaseLabel(releaseLabel)
        .map(entity -> new VersionResponse(entity.getVersion()));
  }
}
