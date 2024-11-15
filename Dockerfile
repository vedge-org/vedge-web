FROM node:20.10.0-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build app
RUN pnpm run build

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV ORIGIN=https://your-domain.com

# Run app
CMD ["pnpm", "start"]