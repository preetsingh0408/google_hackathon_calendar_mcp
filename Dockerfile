FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .

RUN bun run build

ENV PORT=8787
EXPOSE 8787

CMD ["bun", "run", "build/server.js"]