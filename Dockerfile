# --- Frontend build ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_SIGNALING_SERVERS=ws://localhost:4444
ENV VITE_SIGNALING_SERVERS=$VITE_SIGNALING_SERVERS
RUN npm run build

# --- Production stage ---
FROM node:18-alpine AS prod
WORKDIR /app

# Copy necessary files for production
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Install production dependencies only
RUN npm ci --omit=dev

# Expose the port the app runs on
EXPOSE 3000

# Start the app using the production server
CMD ["node", "build/index.js"]
