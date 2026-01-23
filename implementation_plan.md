# Omnibus LP Business Content Update Plan

## Goal
Update the "Business Guide" / "Service" section of the Omnibus LP (`index.html`) to align with the [Yamato DX](https://digital-yamato-dx.jp/) offerings.
The new content will feature three core pillars:
1.  **Work Improvement (業務改善)**
2.  **IT Tool Implementation (ITツール導入)**
3.  **AI Utilization (生成AI活用)**

## Proposed Changes

### [Omnibus LP]
#### [MODIFY] [index.html](file:///c:/Users/kiham/Developer/omnibus-lp/index.html)
- **Section**: Business Guide / Services (currently containing "Tour", "QR", "DX").
- **Change**: Replace current 3 items with the Yamato DX items.
- **Content**:
    - **Header**: "Our DX Support" (or "Service Lineup")
    - **Item 1**: 業務改善・業務自動化
        *   Desc: Excel業務の整理・自動化 / 手作業フローの見直し / 定型作業の自動処理設計
        *   Icon: Existing "Streamline" or new "Settings/Cog" icon.
    - **Item 2**: IT・ツール導入支援
        *   Desc: クラウドツール導入サポート / 小規模システム開発 / API連携・データ活用
        *   Icon: "Computer" or "Cloud" icon.
    - **Item 3**: AI・生成AI活用
        *   Desc: ChatGPTなど生成AIの業務活用 / 社内利用を前提とした設計支援 / 実務に使える形への落とし込み
        *   Icon: "Sparkles" or "Brain" icon.

## Verification Plan
### Manual Verification
- **Visual Check**: Open `http://localhost:5173` and verify the Business/Service section now shows the 3 Yamato DX items with correct text and icons.
- **Mobile Check**: Ensure the new cards stack correctly on mobile.

## Claude Code Execution Plan
Since the user requested to use Claude Code via terminal:
1.  I will construct a prompt containing the HTML context and the new content requirements.
2.  I will execute `claude` (assuming standard command) via `run_command` / `send_command_input`.
    *   *Note*: If `claude` command fails, I will notify the user to run it manually with the provided prompt.
