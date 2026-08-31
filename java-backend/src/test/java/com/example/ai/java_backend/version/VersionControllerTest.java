package com.example.ai.java_backend.version;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VersionController.class)
class VersionControllerTest {
  @Autowired
  MockMvc mvc;

  @MockitoBean
  VersionService versionService;

  @Test
  void versionMatchesContract() throws Exception {
    given(versionService.currentVersion()).willReturn(new VersionResponse("1.0.0"));

    mvc.perform(get("/version"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.version").value("1.0.0"));
  }

  @Test
  void missingReleaseReturnsStable404Json() throws Exception {
    given(versionService.findForReleaseLabel("missing"))
        .willThrow(new ReleaseNotFoundException("missing"));

    mvc.perform(get("/versions/missing"))
        .andExpect(status().isNotFound())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.code").value("RELEASE_NOT_FOUND"))
        .andExpect(jsonPath("$.message").value("找不到发布标签：missing"));
  }
}