import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { serializerCompiler, validatorCompiler } from 'fastify-zod-openapi';
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';

export const app = (() => {
	let _app = fastify({ logger: { transport: { target: 'fastify-pino-pretty' } } });
	_app.setSerializerCompiler(serializerCompiler);
	_app.setValidatorCompiler(validatorCompiler);
	return _app.withTypeProvider<FastifyZodOpenApiTypeProvider>();
})();

app.register(fastifyJwt, { secret: process.env.JWT_SECRET! });

app.register(import('./routes/auth'), { prefix: 'api/auth' });

app.listen({ port: 3000 });
