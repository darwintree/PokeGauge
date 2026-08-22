# Implementation Trace: 远程 Submodule Checkout

Date: 2026-08-22
Source: 用户请求修改远程测试和构建行为
Language: zh-CN

## Entries

### 1. 构建与测试采用不同的 Submodule 策略

Type: unresolved-implementation-decision

Context:
用户要求修改远程测试和构建行为，但没有规定如何同时让 Cloudflare 跳过部署不需要的 PokeAPI，并让 GitHub Actions 测试继续取得 PokeAPI CSV。PokeAPI 内还有体积很大的递归 Submodule。

Decision:
将 PokeAPI 的默认更新策略设为 `none`，让 Cloudflare checkout 跳过它；GitHub Actions 在测试前显式以 depth 1 checkout 顶层 `PokeAPI/pokeapi`，不使用递归更新。

Reason:
生产构建消费已提交的生成资源，不需要 PokeAPI；测试需要顶层仓库中的 CSV，但不需要 `sprites` 和 `cries`。分开策略可以保留远程测试覆盖，同时消除 Cloudflare 的大型递归 checkout。

Follow-up:
None.
