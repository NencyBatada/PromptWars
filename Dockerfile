# Stage 1: Build Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-slim
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./
# Copy built frontend from Stage 1
COPY --from=frontend-build /app/frontend/dist ./frontend-dist

EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "server.js"]
