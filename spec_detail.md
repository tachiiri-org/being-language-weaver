# being-language-weaver – Front Specification (Phase 0: Single User)

## 0. 目的

本ツールは、概念（存在）とその関係性を
定義・構造化・可視化するための Web アプリである。

最重要原則：

- JSONが唯一の真実（Single Source of Truth）
- React Flowは投影ビュー
- フォームはJSON Schemaに従う
- まず動くことを優先する

現在は単一ユーザー・認証なし。
ただし将来 multi-user に拡張可能な構造にする。

---

## 1. 全体構成

システム全体は

front → BFF → gateway → adapter

構成だが、Phase 0では front 単体で完結する。

- データ保存：ローカル（localStorage または mock API）
- 認証：なし
- BFF：未接続
- ただしAPI契約前提の構造を維持する

フロントは Cloudflare Pages で公開予定。

---

## 2. 技術スタック

- React + TypeScript
- React Flow
- RJSF（react-jsonschema-form）
- Zustand または useState（状態管理）
- 保存：ローカルJSON

---

## 3. データ構造（論理モデル）

```json
{
  "meta": {
    "version": 1,
    "updatedAt": "ISO8601"
  },
  "vocab": {
    "relationTypes": ["parent", "refines", "dependsOn"],
    "statusOptions": ["draft", "active"]
  },
  "graph": {
    "nodes": [
      {
        "id": "existence",
        "label": "存在",
        "position": { "x": 0, "y": 0 }
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "existence",
        "target": "perception",
        "type": "refines"
      }
    ]
  },
  "concepts": {
    "existence": {
      "status": "active",
      "fields": {},
      "definitionBlocks": [
        {
          "kind": "text",
          "title": "定義",
          "value": "存在とは全てである"
        }
      ]
    }
  }
}
```

---

## 4. UI構成

```
--------------------------------------------------
| Left: Definition Editor | Right: Graph View  |
--------------------------------------------------
```

---

## 5. 右ペイン（React Flow）

- graph.nodes / graph.edges を描画
- ノード選択で左が切り替わる
- ノード移動で position 更新
- エッジ追加・削除可能

Flowは projection で生成：

```ts
buildFlowGraph(doc);
```

Flowは保存データを直接持たない。

---

## 6. 左ペイン（RJSF）

編集対象：

```
concepts[selectedNodeId]
```

編集可能項目：

- status（vocab.statusOptionsからselect）
- fields（key-value editor）
- definitionBlocks（配列編集）

definitionBlocksの型：

- text
- bullets
- links（node id参照）

---

## 7. 状態管理

アプリは単一の `doc` オブジェクトを持つ。

```
const [doc, setDoc] = useState<Doc>()
```

更新原則：

- 左も右も必ず doc を更新する
- React Flowは doc から再生成

将来multi-user化時は、このdoc更新をAPI通信に置き換えるだけにする。

---

## 8. 永続化（Phase 0）

- localStorageに保存
- 初期データは seed JSON
- Saveボタンで明示保存

将来：

- R2
- Durable Object
- API経由保存

へ差し替え可能な設計にする。

---

## 9. OpenAPIへの布石

将来BFF実装を見据え、
以下APIを想定しておく：

- GET /workspace
- PUT /workspace

今は未実装だが、
docの入出力構造はAPI前提で固定する。

---

## 10. 初期seedデータ（哲学モデル）

ノード：

- 存在
- 知覚
- 開示
- 投企
- 自己同一性
- 世界観
- 言語
- 世界

有向エッジで関係定義する。

---

## 11. 設計原則

1. JSONが真実
2. Graphは派生ビュー
3. vocabはノード化しない
4. fieldsのみ自由キー
5. 過度な抽象化はしない

---

## 12. 将来拡張余地

この構造は以下へ拡張可能：

- multi-user
- 認証
- version管理
- concept単位保存
- CRDT導入

ただし今は実装しない。

---

## 13. Phase 0のゴール

- ノード作成・削除
- エッジ作成・削除
- 定義編集
- 保存/読み込み
- JSON構造が安定している

それ以上はやらない。
