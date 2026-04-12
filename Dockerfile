# Stage 1: Build Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Build production assets
RUN npm run build

# Stage 2: Production Server
FROM node:20-slim
WORKDIR /app

# Install production dependencies for backend
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/ ./

# Copy built frontend assets from Stage 1 into a specific folder
# We change the destination to match what the server expects
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Cloud Run uses the PORT environment variable
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Run the server
CMD ["node", "server.js"]
