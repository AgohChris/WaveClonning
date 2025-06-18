# Build stage
FROM node:20.11.1-bullseye-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .nvmrc ./

# Install ALL dependencies with retry logic
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retry-mintimeout 100000 && \
    npm config set fetch-retries 5 && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set strict-ssl false && \
    npm ci --verbose || npm ci --verbose || npm ci --verbose

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM nginx:1.25.4-alpine-slim

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Set proper permissions and use non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 