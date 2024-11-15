FROM node:20.10.0-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 80
ENV PORT=80
ENV NODE_ENV=production
ENV ORIGIN=https://your-domain.com

CMD ["node", "build"]