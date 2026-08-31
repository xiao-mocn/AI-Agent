package com.example.ai.java_backend.version;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VersionController {
  // 版本服务组件，用于处理版本相关的业务逻辑
  private final VersionService versionService;

  // 构造函数，用于创建控制器实例
  public VersionController(VersionService versionService) {
    this.versionService = versionService;
  }

  @GetMapping("/version")
  // version 方法用于获取当前版本信息
  public VersionResponse version() {
    return versionService.currentVersion();
  }

  @GetMapping("/versions/{releaseLabel}")
  // findVersion 方法用于根据版本标签查找版本信息
  VersionResponse findVersion(@PathVariable String releaseLabel) {
    return versionService.findForReleaseLabel(releaseLabel);
  }
}
