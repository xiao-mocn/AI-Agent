package com.example.ai.java_backend.version;

import java.util.Optional;

public interface ReleaseRepository {
  // findByReleaseLabel 方法用于根据版本标签查找版本信息
  Optional<VersionResponse> findByReleaseLabel(String releaseLabel);
}
