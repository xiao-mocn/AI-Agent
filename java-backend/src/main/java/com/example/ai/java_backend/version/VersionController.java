package com.example.ai.java_backend.version;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VersionController {
  private final VersionService versionService;

  public VersionController(VersionService versionService) {
    this.versionService = versionService;
  }

  @GetMapping("/version")
  VersionResponse version() {
    return versionService.currentVersion();
  }

  @GetMapping("/versions/{releaseLabel}")
  VersionResponse findVersion(@PathVariable String releaseLabel) {
    return versionService.findForReleaseLabel(releaseLabel);
  }
}
