# Implementation Trace: Release Please

Date: 2026-08-20
Source: 用户请求“集成 Release Please，当前版本定为 0.1.0”
Language: 中文

## Entries

### 1. 将 0.1.0 作为当前发布基线

Type: interpretation

Context:
请求没有说明 0.1.0 是当前基线，还是下一次 Release PR 应提出的版本。

Decision:
将 package.json 和 manifest 都设为 0.1.0，并以集成前的 HEAD 作为 bootstrap-sha。

Reason:
这把 0.1.0 视为当前版本，后续只根据集成后的 Conventional Commits 递增，避免把既有历史写入首个 changelog。

Follow-up:
None.

### 2. 使用 PAT 触发 Release PR 的 CI

Type: tradeoff

Context:
默认 GITHUB_TOKEN 创建的 PR 不会触发后续 GitHub Actions，现有 CI 因此不会检查 Release PR。

Decision:
workflow 优先使用 RELEASE_PLEASE_TOKEN secret，未配置时回退到内置 github.token。

Reason:
保持 Release PR 与普通 PR 相同的 CI 门禁。

Follow-up:
若要求 Release PR 自动运行 CI，在 GitHub 仓库中配置 RELEASE_PLEASE_TOKEN，并允许 GitHub Actions 创建 pull request。
