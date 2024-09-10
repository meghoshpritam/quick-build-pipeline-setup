#!/bin/bash

git pull origin main

nvm use $(cat .nvmrc)

npx pnpm install --frozen-lockfile --prefer-frozen-lockfile --prod --no-optional --no-save

npx pnpm run build
