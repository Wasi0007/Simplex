# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --production --force  # Use 'npm ci' for faster and clean installs

# Copy the rest of your application code
COPY . .

# Build the Next.js application (compiles to `.next` by default or `out` for static exports)
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Install only the production dependencies
COPY package.json package-lock.json ./
RUN npm ci --production --force  # Clean install for production dependencies

# Copy the compiled `.next` or `out` directory from the builder stage
COPY --from=builder /app/.next /app/.next

# If you used static export, copy the `out` directory
# COPY --from=builder /app/out /app/out

# Copy public static assets
COPY --from=builder /app/public /app/public

# Expose port 3000 for Next.js
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
