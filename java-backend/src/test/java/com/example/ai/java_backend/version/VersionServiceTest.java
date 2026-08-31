package com.example.ai.java_backend.version;

import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class VersionServiceTest {
  @Mock
  ReleaseRepository releaseRepository;

  VersionService versionService;

  @BeforeEach
  void setUp() {
    versionService = new VersionService(releaseRepository);
  }

  @Test
  void returnsVersionProvidedByRepository() {
    given(releaseRepository.findByReleaseLabel("local"))
        .willReturn(Optional.of(new VersionResponse("1.0.1")));

    assertThat(versionService.findForReleaseLabel("local").version())
        .isEqualTo("1.0.1");
  }

  @Test
  void throwsBusinessExceptionWhenRepositoryHasNoRelease() {
    given(releaseRepository.findByReleaseLabel("missing"))
        .willReturn(Optional.empty());

    assertThatThrownBy(() -> versionService.findForReleaseLabel("missing"))
        .isInstanceOf(ReleaseNotFoundException.class)
        .hasMessage("找不到发布标签：missing");
  }
}