package com.example.ai.java_backend.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.example.ai.java_backend.version.ReleaseNotFoundException;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(ReleaseNotFoundException.class)
  ResponseEntity<ApiError> handleReleaseNotFound(ReleaseNotFoundException exception) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ApiError("RELEASE_NOT_FOUND", exception.getMessage()));
  }
}
