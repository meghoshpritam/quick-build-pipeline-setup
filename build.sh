#!/bin/bash

git pull origin main

nvm use $(cat .nvmrc)

npx pnpm install --frozen-lockfile --prefer-frozen-lockfile --prod -y

npx pnpm run build
