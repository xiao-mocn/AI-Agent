package com.example.ai.java_backend.version;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VersionController {
  @GetMapping("/version")
  VersionResponse version() {
    return new VersionResponse("1.0.0");
  }
}
