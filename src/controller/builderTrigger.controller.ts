import { FastifyReply, FastifyRequest } from 'fastify';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import yaml from 'yaml';
import fs from 'fs';
import { exec } from 'child_process';

interface ConfigTypes {
  id: string;
  path: string;
  buildScript: string;
  gitPull: boolean;
}

const replayWithErrorMessage = (reply: FastifyReply, message: string, code: number) => {
  reply.code(code).send({ message });
};

const checkAuth = (authHeader: string) => {
  if (!authHeader) {
    return false;
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !bcrypt.compareSync(token, process.env.SECRET || '')) {
    return false;
  }

  return true;
};

const getProjectConfigurations = () => {
  const configurationText = fs.readFileSync('projects.yml', 'utf-8');

  const configurations = yaml.parse(configurationText);

  return configurations.reduce(
    (
      acc: {
        [key: string]: ConfigTypes;
      },
      config: ConfigTypes,
    ) => {
      acc[config.id] = config;
      return acc;
    },
    {},
  );
};

export const buildTrigger = async (request: FastifyRequest<{ Body: { project: string } }>, reply: FastifyReply) => {
  dotenv.config();

  const authHeader = request.headers.authorization ?? '';

  if (!checkAuth(authHeader)) {
    return replayWithErrorMessage(reply, 'Unauthorized', 401);
  }

  const projectId = request.body.project;

  if (!projectId) {
    return replayWithErrorMessage(reply, 'Project ID is required', 400);
  }

  const configurations = getProjectConfigurations();
  const projectConfig = configurations[projectId];

  if (!projectConfig) {
    return replayWithErrorMessage(reply, 'Project not found', 404);
  }

  reply.raw.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
  });

  if (projectConfig.gitPull) {
    const pullCommand = exec(`cd ${projectConfig.path} && git pull`);

    pullCommand?.stdout?.on('data', (data) => {
      reply.raw.write(data);
    });

    let hasError = false;
    pullCommand?.stderr?.on('data', (data) => {
      hasError = true;
      reply.raw.write(`Error: ${data}`);
    });

    pullCommand.on('close', (code) => {
      if (hasError) {
        return reply.raw.end(`\nProcess terminated with status code: ${code}`);
      }
    });
  }

  const buildCommand = exec(`cd ${projectConfig.path} && ${projectConfig.buildScript}`);

  buildCommand?.stdout?.on('data', (data) => {
    reply.raw.write(data);
  });

  buildCommand?.stderr?.on('data', (data) => {
    reply.raw.write(`Error: ${data}`);
  });

  buildCommand.on('close', (code) => {
    reply.raw.end(`\nProcess end with status code: ${code}`);
  });
};
