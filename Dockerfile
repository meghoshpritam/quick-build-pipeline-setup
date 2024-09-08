FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

COPY package*.json ./

# Cache dependencies for production build
FROM base AS prod-deps
RUN mkdir -p /pnpm/store
COPY --from=base /app/package*.json /app/
RUN pnpm install --prod --frozen-lockfile

# Build the application
FROM base AS build
RUN mkdir -p /pnpm/store
COPY --from=base /app/package*.json /app/
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Final image
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/example.env /app/.env

EXPOSE 4125

CMD ["npm", "start"]
