# Use Puppeteer's official image with Chromium and dependencies pre-installed
FROM ghcr.io/puppeteer/puppeteer:latest

# Create app directory inside container
WORKDIR /app

# Switch to root to ensure permissions are handled correctly for installation
USER root

# Copy dependency files and adjust ownership
COPY package*.json ./
RUN chown -R pptruser:pptruser /app

# Switch back to pptruser for security and dependency management
USER pptruser

# Install all dependencies (including devDependencies for build step)
RUN npm install --include=dev

# Copy the rest of the application code
COPY --chown=pptruser:pptruser . .

# Build the TypeScript project (compiles src/ to dist/)
RUN npm run build

# Environmental defaults
ENV NODE_ENV=production
ENV PORT=4000

# Expose backend port
EXPOSE 4000

# Note: Google Cloud credentials should be mounted at runtime, not baked into the image
# Example: docker run -v /path/to/careerforge-secretkey.json:/app/careerforge-secretkey.json \
#          -e GOOGLE_APPLICATION_CREDENTIALS=/app/careerforge-secretkey.json your-image
# Or use Docker secrets in production: docker run --secret source=gcp-key,target=/app/careerforge-secretkey.json

# Start the Node.js application from the compiled entry point
# We use node directly on the dist/server.js file defined in package.json
CMD ["node", "dist/server.js"]

