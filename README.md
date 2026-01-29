# Minecraft Blacklist API

Simple Node.js/Express API for managing a global blacklist across multiple Minecraft servers.

## Setup

1. **Install Node.js** from https://nodejs.org/ (LTS version recommended)

2. **Install dependencies**:
```bash
cd api
npm install
```

3. **Start the API**:
```bash
npm start
```

The API will run on `http://localhost:3000` by default.

## Environment Variables

You can customize the API using environment variables:

```bash
set PORT=3000
set API_KEY=204r8382394
npm start
```

Or on Linux/Mac:
```bash
export PORT=3000
export API_KEY=204r8382394
npm start
```

## API Endpoints

### Check if player is blacklisted
```
GET /blacklist/:uuid
Authorization: Bearer <API_KEY>
```

**Response (Blacklisted)**:
```json
{
  "blacklisted": true,
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "username": "PlayerName",
    "reason": "Hacking",
    "expires": "permanent",
    "addedAt": "2026-01-29T10:30:00.000Z"
  }
}
```

### Add player to blacklist
```
POST /blacklist
Authorization: Bearer <API_KEY>
Content-Type: application/json

{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "username": "PlayerName",
  "reason": "Hacking",
  "expires": "permanent"
}
```

**Response**:
```json
{
  "success": true,
  "message": "PlayerName has been blacklisted",
  "data": { ... }
}
```

### Remove player from blacklist
```
DELETE /blacklist/:uuid
Authorization: Bearer <API_KEY>
```

**Response**:
```json
{
  "success": true,
  "message": "PlayerName has been removed from blacklist",
  "data": { ... }
}
```

### Get all blacklisted players
```
GET /blacklist
Authorization: Bearer <API_KEY>
```

**Response**:
```json
{
  "total": 5,
  "players": { ... }
}
```

### Health check
```
GET /health
```

## Data Storage

The blacklist is stored in `blacklist.json` in the API directory. This file is created automatically.

Example `blacklist.json`:
```json
{
  "550e8400-e29b-41d4-a716-446655440000": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "username": "PlayerName",
    "reason": "Hacking",
    "expires": "permanent",
    "addedAt": "2026-01-29T10:30:00.000Z",
    "addedBy": "OpName"
  }
}
```

## Using with the Minecraft Plugin

Update your `config.yml` in the plugin:

```yaml
api-url: "http://localhost:3000"
api-key: "204r8382394"
```

If running the API on a different server:

```yaml
api-url: "http://your-api-server.com:3000"
api-key: "your-api-key"
```

## Development

For development with auto-reload:

```bash
npm install --save-dev nodemon
npm run dev
```

## License

MIT
