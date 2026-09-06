# ran — Web Components UI ライブラリ（ranui）と TypeScript ユーティリティ（ranuts）

<p align="center">
  <a href="https://ran.chaxus.com/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://ran.chaxus.com/icon.png" alt="ran logo">
  </a>
</p>

<p align="center">
  <strong>ネイティブの custom elements の上に組み立てた、フレームワークに依存しない Web Components UI ライブラリ（ranui）と、tree-shaking の効く TypeScript ユーティリティライブラリ（ranuts）。その周辺のツールと英中バイリンガルのドキュメントも含みます。</strong>
</p>

<p align="center">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status">
  </a>
  <img src="https://badgen.net/npm/types/ranui" alt="Types Included">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/forks/chaxus/ran" alt="forks">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/stars/chaxus/ran" alt="stars">
  </a>
</p>

<p align="center">
  <a href="#-特徴">特徴</a> •
  <a href="#-パッケージ">パッケージ</a> •
  <a href="#-クイックスタート">クイックスタート</a> •
  <a href="#-ドキュメント">ドキュメント</a> •
  <a href="#-コントリビュート">コントリビュート</a>
</p>

---

[English](./README.md) | [中文](./README.zh-CN.md) | **日本語** | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## ✨ 特徴

- 🎨 **UI ライブラリ**: Web Components
- 🛠️ **ユーティリティライブラリ**: TypeScript のユーティリティ関数
- 🤖 **機械学習**: 基本的な ML ツールと実験
- 📱 **Web アプリケーション**: IM チャットアプリ（プロトタイプ）
- 🔧 **開発ツール**: ビルドツールとデバッグ用ユーティリティ
- 🌐 **Web3**: スマートコントラクトの実験
- 🎯 **ビジュアルツール**: データ可視化の実験

## 📦 パッケージ

このモノレポにはさまざまな実験的パッケージが入っています。

### コアライブラリ（アルファ段階）

| パッケージ                | バージョン                                                                                           | ダウンロード数                                                                             | 説明                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------- |
| [ranui](packages/ranui)   | [![ranui version](https://img.shields.io/npm/v/ranui.svg?label=%20)](packages/ranui/README.ja.md)    | [![npm-d](https://img.shields.io/npm/dt/ranui.svg)](https://www.npmjs.com/package/ranui)   | Web Components ライブラリ |
| [ranuts](packages/ranuts) | [![ranuts version](https://img.shields.io/npm/v/ranuts.svg?label=%20)](packages/ranuts/README.ja.md) | [![npm-d](https://img.shields.io/npm/dt/ranuts.svg)](https://www.npmjs.com/package/ranuts) | ユーティリティライブラリ  |

### 実験的プロジェクト

| パッケージ                              | 説明                         |
| --------------------------------------- | ---------------------------- |
| [im](packages/im)                       | チャットアプリのプロトタイプ |
| [visual](packages/visual)               | データ可視化の実験           |
| [ranite](packages/ranite)               | 開発ツールの実験             |
| [debug](packages/debug)                 | デバッグ用ユーティリティ     |
| [image-process](packages/image-process) | 画像処理の実験               |
| [cpro](packages/cpro)                   | C/C++ の学習と実験           |
| [rust](packages/rust)                   | Rust の学習と実験            |

CI が実際にどのパッケージを検査するかは [packages/manifest.json](packages/manifest.json) に宣言されています。このファイルは説明ではなく実行されるものです。`bin/run-checks.mjs` はある検査を宣言したパッケージすべてに対してそれを走らせるので、そこで「検査される」と書かれたパッケージは本当に検査され、されないものはその理由が書かれています。`packages/` の下にマニフェストへ載っていないディレクトリがあると `pnpm run verify:packages` は失敗します。つまり、検査するかどうかを誰かが決めないまま新しいパッケージが増えることはありません。

## 🚀 クイックスタート

### インストール

```bash
# リポジトリをクローンする
git clone https://github.com/chaxus/ran.git
cd ran

# 依存関係をインストールする
pnpm install

# すべてのパッケージをビルドする
pnpm build
```

### コアパッケージを使う

```bash
# ranui（Web Components）をインストールする
npm install ranui

# ユーティリティをインストールする
npm install ranuts
```

### 開発

```bash
# 開発サーバーを起動する
pnpm dev

# テストを実行する
pnpm test

# 特定のパッケージをビルドする
pnpm --filter ranui build
```

## 📚 ドキュメント

- **📖 ブログと記事**: [Web ドキュメントプレビュー](https://ran.chaxus.com/src/article/doc_preview)
- **🎨 RanUI のドキュメント**: [UI ライブラリガイド](https://ran.chaxus.com/src/ranui/)
- **🛠️ RanUTS のドキュメント**: [ユーティリティライブラリガイド](https://ran.chaxus.com/src/ranuts/)
- **📝 プロジェクトのドキュメント**: [docs](packages/docs)

## 🤖 AI / Claude Code

このリポジトリは Claude Code のプラグイン marketplace を同梱しています。AI アシスタントがソースを掘り返さずにライブラリを読んで使えるようにするためのものです。marketplace を追加してから、使うライブラリを入れてください。

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran      # ranui — Web Components
/plugin install ranuts@ran     # ranuts — ユーティリティ
```

各 skill は import map、一覧、使用例、規約を扱い、そのパッケージに同梱された API リファレンスを指し示します。詳しくは各ライブラリの節を参照してください：[ranui](packages/ranui/README.ja.md)、[ranuts](packages/ranuts/README.ja.md)。

## ⚠️ 重要なお知らせ

これは初期開発段階にある**技術探求と学習のためのプロジェクト**です。ほとんどのパッケージはアルファ段階か実験段階にあります。

**要点：**

- 🚧 **初期開発**: ほとんどの機能はまだ作っている途中です
- 🧪 **実験的**: API は頻繁に変わる可能性があります
- 📚 **学習が主眼**: 主に学習と実験のためのものです

## 🤝 コントリビュート

学習者にも開発者にも参加してほしいと思っています。手伝い方は次のとおりです。

1. リポジトリを **Fork** する
2. 機能ブランチを **作成** する（`git checkout -b feature/amazing-feature`）
3. 変更を **コミット** する（`git commit -m 'Add amazing feature'`）
4. ブランチへ **プッシュ** する（`git push origin feature/amazing-feature`）
5. プルリクエストを **開く**

### 開発の指針

- 既存のコードスタイルに合わせる
- 可能なら新機能にテストを添える
- 必要に応じてドキュメントを更新する
- 実験的な機能には気長に付き合う

## 🌟 なぜオープンソースにするのか

オープンソースには学習と革新を加速する力があると考えています。開発者としての道のりで、私は数えきれないほどのオープンソースプロジェクトに助けられてきました。この実験的なコードを公開することで、次のことを願っています。

- 学びの経験をコミュニティと分かち合うこと
- ほかの人がこのコードから学び、試せるようにすること
- 協働と知識の共有を促すこと
- 学び続け、良くし続けるための場をつくること

## 📊 プロジェクトの統計

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" alt="Contributors" />
</a>

![](http://profile-counter.glitch.me/chaxus-ran/count.svg)

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳しくは [LICENSE](LICENSE) を参照してください。

---

<div align="center">
  <p>Ran コミュニティが ❤️ を込めて作りました</p>
  <p>学習の役に立ったら、⭐️ をいただけると嬉しいです</p>
</div>
