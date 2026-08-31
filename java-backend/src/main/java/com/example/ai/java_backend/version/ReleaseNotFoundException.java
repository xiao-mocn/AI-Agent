package com.example.ai.java_backend.version;

public class ReleaseNotFoundException extends RuntimeException {
  // 构造函数，用于创建异常实例
  public ReleaseNotFoundException(String releaseLabel) {
    super("找不到发布标签：" + releaseLabel);
  }
}
