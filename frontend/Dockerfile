# Build arguments
ARG NODE_VERSION=20
ARG NGINX_VERSION=1.27

# --- Build stage ---
FROM node:${NODE_VERSION}-alpine AS build

# Accept build argument for API URL
ARG REACT_APP_API_BASE_URL=http://localhost:8080
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json ./
# Install the frontend dependencies
RUN npm ci --legacy-peer-deps

# Copy the source code and build the frontend app
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM nginx:${NGINX_VERSION}-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the previous stage to Nginx's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the app will run on
EXPOSE 80

# Healthcheck to verify if the app is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -q -O - http://localhost/ || exit 1

# Command to run Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]