import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { serializerCompiler, validatorCompiler } from 'fastify-zod-openapi';
import type { FastifyZodOpenApiTypeProvider } from 'fastify-zod-openapi';

export const app = (() => {
	const _app = fastify({ logger: { transport: { target: 'fastify-pino-pretty' } } });
	_app.setSerializerCompiler(serializerCompiler);
	_app.setValidatorCompiler(validatorCompiler);
	return _app.withTypeProvider<FastifyZodOpenApiTypeProvider>();
})();

app.register(fastifyCookie, { secret: process.env.COOKIE_SECRET!, hook: 'onRequest' });
app.register(fastifyCors, { origin: 'http://localhost:8080', credentials: true });
app.register(fastifyJwt, { secret: process.env.JWT_SECRET!, cookie: { cookieName: 'Authorization', signed: false } });

app.register(import('./routes/auth'), { prefix: 'api/auth' });
app.register(import('./routes/note'), { prefix: 'api/note' });

app.listen({ port: 3000 });
