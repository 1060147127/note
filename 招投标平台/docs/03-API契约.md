# API 契约（MVP）

Base：同源 `/api`。认证：Cookie Session（`bid_session`）。

## Auth

| Method | Path | 说明 |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` → 设置 session |
| POST | `/api/auth/logout` | 清除 session |
| GET | `/api/auth/me` | 当前用户 |

## Admin

| Method | Path | 说明 |
|---|---|---|
| GET | `/api/admin/users` | 用户列表 |
| POST | `/api/admin/users` | `{ email, password, role, orgName }` 创建 buyer/bidder |

## Projects（招标）

| Method | Path | 说明 |
|---|---|---|
| GET | `/api/projects` | 列表（按角色过滤） |
| POST | `/api/projects` | 创建草稿 |
| GET | `/api/projects/:id` | 详情（含惰性截止） |
| PATCH | `/api/projects/:id` | 更新草稿 |
| POST | `/api/projects/:id/files` | multipart 上传招标文件 |
| POST | `/api/projects/:id/publish` | 发布 → BIDDING |
| POST | `/api/projects/:id/open` | 开标 → OPENED + 快照 |
| POST | `/api/projects/:id/evaluate` | `{ evaluations: [{ bidId, score, comment, isWinner }] }` |
| POST | `/api/projects/:id/announce` | `{ content }` → ANNOUNCED |
| GET | `/api/projects/:id/files/:fileId/download` | 鉴权下载 |

## Bids（投标）

| Method | Path | 说明 |
|---|---|---|
| GET | `/api/bids/mine` | 我的投标 |
| POST | `/api/projects/:id/bids` | 创建/提交投标（multipart） |
| POST | `/api/bids/:id/withdraw` | 撤回 |
| GET | `/api/bids/:id/files/:fileId/download` | 鉴权下载（开标后招标人可下） |
