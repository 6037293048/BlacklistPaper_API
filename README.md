# Blacklist API (Render)

Minimal API for the Blacklist Paper plugin.

## Endpoints

- `GET /ban/:uuid` -> 200 if banned, 404 if not
- `POST /ban` with JSON `{ "uuid": "...", "reason": "..." }`
- `DELETE /ban/:uuid`

All endpoints require the `Authorization` header to match `API_KEY`.

## Render deploy (GitHub)

1. Create a new GitHub repo and push this folder.
2. In Render, create a **Web Service** from the repo.
3. Set env vars:
   - `API_KEY` = your secret key
   - `DATABASE_PATH` = `/data/blacklist.db`
4. (Recommended) Add a **Disk** in Render and mount it at `/data`.
5. Deploy. Your API base URL will look like `https://your-service.onrender.com`.

## Plugin config

Set your Paper plugin config:

```yaml
api-url: "https://your-service.onrender.com"
api-key: "<API_KEY>"
```

## Local test

```bash
npm install
API_KEY=test node src/index.js
```

```bash
curl -H "Authorization: test" http://localhost:3000/health
```
