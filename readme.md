# Quick Build Pipeline REST API Setup

This document provides a quick guide to setting up the REST API for you server build scripts.

## Prerequisites

- Node.js installed on the server
- NPM installed on the server
- Git installed on the server

## Quick Start

1. Clone the repository to your server

```bash
git clone git@github.com:meghoshpritam/quick-build-pipeline-setup.git
cd quick-build-pipeline-setup
```

2. Install the dependencies

```bash
npx pnpm install
```

3. Add Environment Variables

Create a `.env` file in the root of the project. The example env file is available in the repository as `example.env`. Copy the contents of the `example.env` file to the `.env` file and update the values as per your requirements.

```bash
cp example.env .env
```

4. Setup your static access token

Write your password in `password.txt` file. This password will be used to authenticate the requests to the API. Your password will be stored in the `.env` file and the given password will be cleared from the `password.txt` file.

```bash
echo "your-password" > password.txt
npm run build:password
```

5. Add the project configurations in the `projects.yml` file.

The example projects file is available in the repository as `example.projects.yml`. Copy the contents of the `example.projects.yml` file to the `projects.yml` file and update the values as per your requirements.

```bash
cp example.projects.yml projects.yml
```