---
title: エージェント
---

# エージェント

ran プラグインは design、ranui、ranuts の三つのスキルで設計、コンポーネント、ツール選択を支援します。

目の前の判断でスキルを選びます。

- **design** — レイアウト、操作、モーション、または画面が受け入れ基準を満たすか
- **ranui** — どの `<r-*>` を使うか、その属性、またはテーマトークン
- **ranuts** — どのヘルパーを import するか、問題がどのエントリポイントに属するか

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

GitHub からプラグインをインストールします。

## Codex

```sh
codex plugin marketplace add chaxus/ran
codex plugin add ran@ran
```

## Claude Code

```sh
claude plugin marketplace add chaxus/ran
claude plugin install ran@ran
```

新しいセッションで、Codex は `$design`、`$ranui`、`$ranuts`、Claude Code は `/ran:design`、`/ran:ranui`、`/ran:ranuts` を使用します。

ローカルのチェックアウトを試す場合は、リポジトリのルートで `chaxus/ran` を `.` に置き換えて市場コマンドを実行します。

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
