import { FastifyReply, FastifyRequest } from 'fastify';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import yaml from 'yaml';
import fs from 'fs';

interface ConfigTypes {
  id: string;
  path: string;
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
  const configurationText = fs.readFileSync('config.yml', 'utf-8');

  const configurations = yaml.parse(configurationText).projects;

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

  return { message: 'der!' };
};
