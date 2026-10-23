---
title: エージェント
---

# エージェント

ran プラグインは design、ranui、ranuts の三つのスキルで設計、コンポーネント、ツール選択を支援します。

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

リポジトリのルートから、このチェックアウトを登録してプラグインをインストールします。

## Codex

```sh
codex plugin marketplace add .
codex plugin add ran@ran
```

## Claude Code

```sh
claude plugin marketplace add .
claude plugin install ran@ran
```

新しいセッションで、Codex は `$design`、`$ranui`、`$ranuts`、Claude Code は `/ran:design`、`/ran:ranui`、`/ran:ranuts` を使用します。

公開後は市場コマンドの `.` を `chaxus/ran` に置き換えます。以下のリンクはマージ後の main 上の正式な場所を示します。

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
