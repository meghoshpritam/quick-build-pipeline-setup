import { FastifyInstance } from 'fastify';
import { buildTrigger } from '../controller/builderTrigger.controller';

async function routes(fastify: FastifyInstance) {
  fastify.post('/v1/build', buildTrigger);
}

export default routes;
