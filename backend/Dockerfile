# -------- Build stage --------
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# -------- Production stage --------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Copy backend runtime files
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/app.js ./app.js
COPY --from=build /app/routes ./routes
COPY --from=build /app/controllers ./controllers
COPY --from=build /app/services ./services
COPY --from=build /app/models ./models
COPY --from=build /app/middleware ./middleware
COPY --from=build /app/config ./config
COPY --from=build /app/uploads ./uploads

EXPOSE 5000
CMD ["node", "server.js"]
