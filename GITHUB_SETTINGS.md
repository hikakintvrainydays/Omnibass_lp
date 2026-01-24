# GitHub Repository 設定手順

## 1. yamatoGH に全権限を与える手順

### 既にCollaboratorとして追加されている場合（現在の状況）：

1. GitHubリポジトリページを開く
   - https://github.com/hikakintvrainydays/Omnibass_lp

2. **Settings** タブをクリック

3. 左サイドバーから **Collaborators and teams** をクリック

4. **Manage access** セクションで、YamatoGH の名前の横にある **Type** ドロップダウンをクリック
   - 現在「Collaborator」と表示されている部分

5. 権限レベルを選択：
   - **Admin** を選択（全権限）
   - または **Write** （プッシュ権限）
   - または **Maintain** （プッシュ + 一部設定権限）

6. 選択すると自動的に保存されます

---

### 新しくCollaboratorを追加する場合：

1. **Add people** ボタンをクリック

2. 検索欄にユーザー名を入力

3. 権限レベルを選択して招待を送信

---

## 2. リポジトリを Public → Private に変更する手順

### ステップ：
1. GitHubリポジトリページを開く
   - https://github.com/hikakintvrainydays/Omnibass_lp

2. **Settings** タブをクリック

3. 一番下までスクロール → **Danger Zone** セクションを探す

4. **Change repository visibility** をクリック

5. **Change visibility** ボタンをクリック

6. **Make private** を選択

7. リポジトリ名の確認を求められるので `hikakintvrainydays/Omnibass_lp` を入力

8. **I understand, change repository visibility** をクリック

---

## ⚠️ 注意事項

### Private化すると：
- 一般公開されなくなる
- アクセス権限のあるユーザーのみ閲覧可能
- GitHub Pagesは無効化される（Proプランが必要）
- Collaboratorsは引き続きアクセス可能

### Admin権限の内容：
- プッシュ権限
- ブランチ保護設定の変更
- コラボレーターの追加/削除
- リポジトリ設定の変更
- リポジトリの削除権限
