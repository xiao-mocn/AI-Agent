package com.example.ai.java_backend.version;

public class ReleaseNotFoundException extends RuntimeException {
  public ReleaseNotFoundException(String releaseLabel) {
    super("找不到发布标签：" + releaseLabel);
  }
}
