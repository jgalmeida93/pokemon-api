FROM node:18-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expose API port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/dev.db

# Create directory for SQLite database
RUN mkdir -p /app/data

# Run migrations and start app
CMD npx prisma migrate deploy && node dist/index.js
