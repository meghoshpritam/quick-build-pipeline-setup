import { FastifyReply, FastifyRequest } from 'fastify';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import yaml from 'yaml';
import fs from 'fs';

interface ConfigTypes {
  id: string;
  path: string;
}

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
    reply.code(401).send({ message: 'Unauthorized' });
    return;
  }

  const projectId = request.body.project;

  if (!projectId) {
    reply.code(400).send({ message: 'Project ID is required' });
    return;
  }

  const configurations = getProjectConfigurations();
  const projectConfig = configurations[projectId];

  if (!projectConfig) {
    reply.code(404).send({ message: 'Project not found' });
    return;
  }

  return { message: 'der!' };
};
