FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies
COPY package.json ./
COPY package-lock.json ./

# Disable husky hooks in CI environment
RUN npm pkg delete scripts.prepare

# Clean install for production
RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run server
FROM node:18-alpine AS runner
WORKDIR /app

# Set the environment to production
ENV NODE_ENV production

# Create a group and user to run our app
RUN addgroup --system app && adduser --system --ingroup app app

# Copy the build output to replace the default public folder
COPY --from=builder /app/build ./build

# Copy the package.json and node_modules to install production dependencies
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules

# Change ownership of the /app directory
RUN chown -R app:app /app

# Expose the port the app runs on
EXPOSE 5000

# Set the user to use when running this image
USER app

# Run the server
CMD ["npm", "run", "prod"]