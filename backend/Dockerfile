FROM node:24

WORKDIR /src

COPY package*.json pnpm-lock.yaml ./

RUN corepack enable \
 && corepack prepare pnpm@9.15.9 --activate

RUN pnpm install

COPY ./ ./

RUN npx prisma generate 

CMD ["pnpm", "run", "start:dev"]
