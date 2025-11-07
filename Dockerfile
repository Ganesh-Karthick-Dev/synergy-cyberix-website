# ---- Base image ----
    FROM node:18-alpine AS base
    WORKDIR /app
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy all source
    COPY . .
    
    # Build Next.js app
    RUN npm run build
    
    # ---- Runtime ----
    FROM node:18-alpine
    WORKDIR /app
    
    # Copy built app from previous stage
    COPY --from=base /app/.next ./.next
    COPY --from=base /app/public ./public
    COPY --from=base /app/node_modules ./node_modules
    COPY --from=base /app/package.json ./package.json
    
    EXPOSE 3001
    ENV PORT=3001
    ENV HOSTNAME=0.0.0.0
    CMD ["npm", "start"]    