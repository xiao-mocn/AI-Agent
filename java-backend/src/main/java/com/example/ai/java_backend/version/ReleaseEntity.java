package com.example.ai.java_backend.version;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "releases")
public class ReleaseEntity {
  // 主键
  @Id
  // 自增策略
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  // 列名
  private Long id;
  // 版本标签，不能为空且唯一
  @Column(name = "release_label", nullable = false, unique = true)
  private String releaseLabel;
  // 版本号，不能为空
  @Column(nullable = false)
  private String version;

  // 构造函数，用于创建实体实例
  protected ReleaseEntity() {
  }

  // 构造函数，用于创建实体实例
  public ReleaseEntity(String releaseLabel, String version) {
    this.releaseLabel = releaseLabel;
    this.version = version;
  }

  // 获取主键
  public Long getId() {
    return id;
  }

  // 获取版本标签
  public String getReleaseLabel() {
    return releaseLabel;
  }

  // 获取版本号
  public String getVersion() {
    return version;
  }
}
