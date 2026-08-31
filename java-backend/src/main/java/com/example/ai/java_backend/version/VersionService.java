package com.example.ai.java_backend.version;

import org.springframework.stereotype.Service;

@Service
public class VersionService {
  // 应用属性组件，用于获取应用配置信息
  private final ReleaseRepository releaseRepository;

  // 发布仓库组件，用于存储和检索版本信息
  public VersionService(ReleaseRepository releaseRepository) {
    this.releaseRepository = releaseRepository;
  }

  // 获取当前版本信息
  public VersionResponse currentVersion() {
    return findForReleaseLabel("local");
  }

  // 根据版本标签查找版本信息
  public VersionResponse findForReleaseLabel(String releaseLabel) {
    return releaseRepository.findByReleaseLabel(releaseLabel)
        .orElseThrow(() -> new ReleaseNotFoundException(releaseLabel));
  }
}
