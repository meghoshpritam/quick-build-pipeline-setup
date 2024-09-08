#!/bin/bash

git pull origin main

nvm use $(cat .nvmrc)

npx pnpm install --frozen-lockfile --prefer-frozen-lockfile --prod --no-optional --no-audit --no-fund --no-save --no-interactive

npx pnpm run build
