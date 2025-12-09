# Build stage for frontend
FROM node:22-alpine AS frontend-builder

# Accept base path as build argument (defaults to /app)
ARG VITE_BASE_PATH=/app
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Build stage for backend
FROM node:22-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend ./
COPY --from=frontend-builder /app/frontend/dist ./dist
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy only production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./dist

EXPOSE 7137

CMD ["npm", "run", "start"]
