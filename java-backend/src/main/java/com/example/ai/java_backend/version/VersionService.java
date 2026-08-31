package com.example.ai.java_backend.version;

import com.example.ai.java_backend.config.AppProperties;
import org.springframework.stereotype.Service;

@Service
public class VersionService {
  private final AppProperties appProperties;

  public VersionService(AppProperties appProperties) {
    this.appProperties = appProperties;
  }

  public VersionResponse currentVersion() {
    return new VersionResponse("1.0.1");
  }

  public VersionResponse findForReleaseLabel(String releaseLabel) {
    if (!appProperties.releaseLabel().equals(releaseLabel)) {
      throw new ReleaseNotFoundException(releaseLabel);
    }
    return currentVersion();
  }
}
