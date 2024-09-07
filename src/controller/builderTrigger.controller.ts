import { FastifyReply, FastifyRequest } from 'fastify';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

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

export const buildTrigger = async (request: FastifyRequest, reply: FastifyReply) => {
  dotenv.config();

  const authHeader = request.headers.authorization ?? '';

  if (!checkAuth(authHeader)) {
    reply.code(401).send({ message: 'Unauthorized' });
    return;
  }

  return { message: 'der!' };
};
