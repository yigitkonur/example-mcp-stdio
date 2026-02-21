FROM node:22-slim AS builder

WORKDIR /app
COPY package*.json ./
COPY vendor ./vendor
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app
COPY package*.json ./
COPY vendor ./vendor
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

USER node
CMD ["node", "dist/index.js", "serve"]
