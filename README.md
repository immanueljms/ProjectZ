## P2PC – Peer-to-Peer Cloud Gaming (Monorepo)

P2PC is a peer-to-peer cloud gaming platform.

- Backend: Node.js + Express.js (TypeScript)
- Realtime: WebRTC (peer video) + WebSockets (signaling/control)
- Database: PostgreSQL (structured data), Redis (session/matchmaking cache)
- Auth: JWT + OAuth (Google/Discord) stubs
- Payments: Stripe integration (server-side stubs)
- Infra: Signaling server and TURN/STUN via coturn
- Desktop frontend: Electron (Windows) – TypeScript + React
- Mobile frontend: React Native (Expo) – TypeScript

### Monorepo Structure

```
/server        # Node/Express API + signaling (TypeScript)
/desktop       # Electron app (TypeScript + React)
/mobile        # React Native app (Expo + TypeScript)
docker-compose.yml
.env.example
```

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Docker + Docker Compose (for Postgres, Redis, coturn)
- Stripe account (for payments)
- Google/Discord OAuth apps (optional until enabling OAuth)

### Quick Start

1) Copy envs and adjust values:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

2) Start infrastructure (Postgres, Redis, coturn):

```bash
docker compose up -d
```

3) Install deps (workspace):

```bash
pnpm install
```

4) Run the backend:

```bash
pnpm --filter server dev
```

5) Run the desktop app (Windows):

```bash
pnpm --filter desktop dev
```

6) Run the mobile app (Expo):

```bash
pnpm --filter mobile start
```

---

## Server (Express + WebSockets)

Location: `server/`

Scripts:

```bash
pnpm --filter server dev      # dev with nodemon
pnpm --filter server build    # tsc build
pnpm --filter server start    # run built server
```

Features:

- JWT auth (`/api/auth/register`, `/api/auth/login`)
- OAuth stubs (`/api/auth/google`, `/api/auth/discord`)
- Matchmaking (`/api/matchmaking/find`, `/api/matchmaking/cancel`)
- Payments (Stripe) (`/api/payments/create-checkout-session`, `/api/payments/webhook`)
- Signaling over WebSockets at `ws://HOST:PORT/ws`

Environment (`server/.env`):

```
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/p2pc
REDIS_URL=redis://localhost:6379
JWT_SECRET=change_me
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
TURN_API_KEY=change_me
TURN_URIS=turn:localhost:3478?transport=udp,turn:localhost:3478?transport=tcp,stun:stun.l.google.com:19302
```

---

## Desktop (Electron + React + TypeScript)

Location: `desktop/`

Scripts:

```bash
pnpm --filter desktop dev      # start dev (renderer via Vite + Electron)
pnpm --filter desktop build    # build renderer & package electron app
pnpm --filter desktop lint
```

Features:

- Login UI
- Connect to a host (freeholder) PC
- WebRTC video player (placeholder wiring)

Configure signaling server URL and TURN/STUN in `desktop/src/renderer/config.ts`.

---

## Mobile (React Native + Expo + TypeScript)

Location: `mobile/`

Scripts:

```bash
pnpm --filter mobile start     # start Expo dev server
pnpm --filter mobile android   # run on Android
pnpm --filter mobile ios       # run on iOS (macOS required)
```

Notes:

- WebRTC: use `react-native-webrtc`. With Expo, you need a dev client or prebuild. The scaffold includes placeholders and notes.
- Configure signaling server URL and TURN/STUN in `mobile/src/config.ts`.

---

## Docker Compose (Postgres, Redis, coturn)

`docker-compose.yml` includes:

- Postgres (port 5432)
- Redis (port 6379)
- coturn (port 3478, 5349)

Update `turnserver.conf` and secrets before exposing publicly.

---

## Security & Next Steps

- Replace all placeholder secrets.
- Add HTTPS/TLS, host firewall, and rate limiting.
- Implement production OAuth flows and persistent user store.
- Harden Stripe webhook endpoint with verified signature.
- Implement actual matchmaking logic and session lifecycle.
- Add E2E encryption policies for WebRTC as needed.

# ProjectZ

P2P Cloud gaming software 
