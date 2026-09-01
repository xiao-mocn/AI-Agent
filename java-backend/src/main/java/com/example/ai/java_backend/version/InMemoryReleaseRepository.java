package com.example.ai.java_backend.version;

import java.util.Map;
import java.util.Optional;

public class InMemoryReleaseRepository implements ReleaseRepository {
  // 版本信息存储在内存中的映射表
  private final Map<String, VersionResponse> versions = Map.of(
      "local", new VersionResponse("1.0.1"));

  // @Override 注解用于表示该方法是实现接口方法的具体实现
  @Override
  // findByReleaseLabel 方法用于根据版本标签查找版本信息
  public Optional<VersionResponse> findByReleaseLabel(String releaseLabel) {
    return Optional.ofNullable(versions.get(releaseLabel));
  }
}
