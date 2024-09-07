import { fastify } from 'fastify';
import pino from 'pino';
import routes from './routes/index';
import dotenv from 'dotenv';

dotenv.config();

const server = fastify({
  logger: pino({ level: 'info' }),
});

server.register(routes);

const start = async () => {
  try {
    await server.listen(process.env.PORT ?? 4125);
    console.log('Server started successfully');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
