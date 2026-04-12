# Stage 1: Build the Vite (React) Frontend
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package descriptors first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (ignoring scripts for speed/security)
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the production optimized bundle
# We pass heavily requested environment variables needed at build time
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine as production-stage

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the first stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the custom Nginx routing configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run default port requirement)
EXPOSE 8080

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
