# syntax=docker/dockerfile:1.7
FROM alpine:3.22 AS base

# Next.js app lives here
WORKDIR /app

ARG WEB_URL
ARG API_URL

ENV WEB_URL=${WEB_URL}
ENV API_URL=${API_URL}

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apk -U add --no-cache build-base gyp pkgconfig python3 nodejs npm

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci --force

# Copy application code (see .dockerignore — .env is deliberately excluded)
COPY --link . .

# Prerendering calls the API, so the build needs API_URL/API_KEY. They arrive
# as a BuildKit secret rather than a COPY'd file: a secret mount exists only
# for the duration of this RUN and never becomes part of a layer, so the key
# stays out of the image and out of the `cache-to: mode=max` GHA build cache.
RUN --mount=type=secret,id=dotenv,target=/app/.env \
    npm run build

# Remove development dependencies
RUN npm prune --omit=dev --force

FROM base AS run

# Set production environment
ENV NODE_ENV="production"

# Install node.js
RUN apk add --no-cache nodejs

# The standalone server needs no write access to its own files, so run it as an
# unprivileged user rather than root.
RUN addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S nextjs -G nodejs

# Copy standalone app
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone /app
COPY --from=build --chown=nextjs:nodejs /app/.next/static /app/.next/static
# Omit me if you don't have static files in your public folder yet
COPY --from=build --chown=nextjs:nodejs /app/public /app/public

USER nextjs

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Run the app
CMD [ "node", "server.js" ]
