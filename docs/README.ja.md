# keymapgen

エディタ間でキーマップを統一するためのCLIツールです。統一されたYAML形式でキーマップを定義し、各エディタ専用の設定ファイルに変換します。

📖 **[English README](../README.md)**

## 特徴

- ✨ **統一フォーマット**: YAML形式で一度定義するだけ
- 🔄 **マルチエディタ対応**: 様々なエディタ形式に変換可能
- 🛠️ **CLIツール**: 使いやすいコマンドラインインターフェース
- 📝 **型安全**: TypeScriptで構築され、優れた開発体験を提供
- ⚡ **高速**: 最新のツール（Bun、TypeScript）でパワフル

## クイックスタート

### インストール

```bash
npm install
npm run build
npm link  # CLIとしてグローバルインストール
```

### CLI使用方法

YAMLキーマップをエディタ専用形式に変換:

```bash
keymapgen --editor vscode sample-keymap.yml output/keybindings.json
```

サポートされているエディタ一覧を表示:

```bash
keymapgen list-editors
```

### YAML形式

```yaml
name: "マイカスタムキーマップ"
description: "個人用キーマップ設定"

keymaps:
  file.new: "Ctrl+N"
  file.open: "Ctrl+O"
  file.save: "Ctrl+S"
  edit.copy: "Ctrl+C"
  edit.paste: "Ctrl+V"
  # ... その他のマッピング
```


## サポートエディタ

| エディタ | ステータス | フォーマット |
|----------|------------|--------------|
| VS Code | ✅ | `keybindings.json` |
| IntelliJ IDEA | ✅ | `keymap.xml` |
| Visual Studio | ✅ | `keybindings.vssettings` |

## 開発

### 必要な環境

- Node.js（LTS版）
- Bun（推奨）またはnpm

### セットアップ

```bash
# 依存関係をインストール
bun install
# または
npm install
```

### 開発ワークフロー

#### 開発中のCLIテスト

Bunを使用（推奨）:
```bash
# TypeScriptで直接CLIをテスト
bun run src/cli.ts --editor vscode sample-keymap.yml output.json

# npmスクリプト経由
npm run dev:cli -- --editor vscode sample-keymap.yml output.json
```


#### その他のコマンド

```bash
# TypeScriptビルド
npm run build

# 型チェック
npm run typecheck

# リンティング
npm run lint

# テスト実行
npm test
```

## コントリビューション

1. リポジトリをフォーク
2. フィーチャーブランチを作成（`git checkout -b feature/amazing-feature`）
3. 変更をコミット（`git commit -m 'Add some amazing feature'`）
4. ブランチにプッシュ（`git push origin feature/amazing-feature`）
5. プルリクエストを作成

## ライセンス

MIT License - 詳細は[LICENSE](../LICENSE)ファイルをご覧ください。