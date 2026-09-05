# Implementation Trace: 上传素材前更新 submodules

Date: 2026-09-05
Source: 用户要求先更新当前所有 submodule 的版本，再上传静态素材。
Language: 简体中文

## Entries

### 1. 嵌套仓库分别跟随各自的上游默认分支

Type: interpretation

Context:
PokeAPI 内包含 sprites 和 cries 两个嵌套 submodule。PokeAPI 最新提交固定的嵌套版本落后于这两个仓库各自的默认分支，用户未指定使用哪一种版本口径。

Decision:
以各仓库远端 HEAD 为此次更新目标：

| 仓库 | 更新前本地提交 | 此次目标提交 |
| --- | --- | --- |
| PokeAPI/pokeapi | `6629d1506a5ae659bb75d33e8e3ea143f2833642` | `d4f9a4af58ade123fbc0558f68b1c69daa97d9e4` |
| PokeAPI/sprites | `d8eba5657870d202c17905a3d9c412a758164b66`（本地缺少实际对象） | `da7052d875de0566a657cf78a823f034385971c2` |
| PokeAPI/cries | `8584048df8f55ee1c436da23b378316e9d416a9b` | `ef687b18f0ce17169b4b4c09175819f7ade92f0f` |

保留 PokeAPI 官方提交，不在第三方仓库创建无法从官方远端获取的本地提交。嵌套 gitlink 因而会显示修改状态；只提交主项目的 PokeAPI gitlink 不能固定这两个嵌套更新。

Reason:
这符合上传前使用各素材仓库最新版本的要求，同时保持 PokeAPI 代码来自可获取的官方提交。

Follow-up:
上传流程使用上表的完整素材提交号固定来源。重新执行普通递归 submodule update 会恢复 PokeAPI 自身锁定的旧素材版本，不能用于复现此次素材更新。

### 2. sprites 使用按需获取及稀疏检出

Type: tradeoff

Context:
sprites 本地目录只有 Git 占位信息，没有可用提交对象和素材。首次浅层全量获取已传输约 390 MB 仍未结束；应用当前需要正面、背面和道具图片。

Decision:
使用 `--filter=blob:none --depth=1` 获取目标提交，配置 origin 为官方 sprites 仓库。稀疏检出顶层文件、`sprites/` 直属文件、`sprites/pokemon/` 与 `sprites/pokemon/back/` 的直属文件，以及完整 `sprites/items/` 目录（包括世代子目录）。

Reason:
更新完整提交身份，并提供此次图片迁移所需目录，避免首次下载不使用的动画和其他图片集。

Follow-up:
以后需要其他图片目录时扩展 sparse-checkout 范围；稀疏检出设置属于本地 Git 配置，不会由主项目 gitlink 自动传递。
