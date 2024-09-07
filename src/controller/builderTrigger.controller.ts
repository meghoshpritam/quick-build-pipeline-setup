import { FastifyReply, FastifyRequest } from 'fastify';
import dotenv from 'dotenv';

export const buildTrigger = async (request: FastifyRequest, reply: FastifyReply) => {
  dotenv.config();
  console.log('📢[builderTrigger.controller.ts:5]: request: ', request.body);
  return { message: 'Hello from a separate controller file!' };
};
