package com.example.ai.java_backend.version;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

@DataJpaTest
class ReleaseJpaRepositoryTest {
  @Autowired
  private ReleaseJpaRepository releaseJpaRepository;

  @Test
  void findsSeededLocalReleaseByLabel() {
    var release = releaseJpaRepository.findByReleaseLabel("local");

    assertThat(release).isPresent().get()
        .extracting(ReleaseEntity::getVersion)
        .isEqualTo("1.0.1");
  }
}
