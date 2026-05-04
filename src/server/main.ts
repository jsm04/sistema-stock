import { serve } from 'bun';
import index from '../assets/index.html';
import { userService } from './useCases/userService';
import { logger } from './utils/logger';

// Base de datos simulada en memoria
const savedRecords: Record<string, unknown>[] = [];

const server = serve({
	routes: {
		// Serve index.html for all unmatched routes.
		'/*': index,
		'/api/login': {
			async POST(req) {
				try {
					const body = await req.json();

					const result = await userService().login({
						username: body.username,
						password: body.password,
					});

					logger.info(`Login exitoso para el usuario: ${body.username}`);
					return Response.json(result, { status: 200 });
				} catch (err: any) {
					logger.error(`Error en login: ${err.message}`);
					// Normalizar errores del servicio
					if (err.message === 'Invalid credentials') {
						return Response.json(
							{ error: 'Invalid credentials' },
							{ status: 401 },
						);
					}

					if (err.message === 'Validation error') {
						return Response.json({ error: 'Invalid input' }, { status: 400 });
					}

					return Response.json(
						{ error: 'Internal server error' },
						{ status: 500 },
					);
				}
			},
		},
		'/api/register': {
			async POST(req: Request) {
				try {
					const body = await req.json();

					const result = await userService().createUser({
						username: body.username,
						password: body.password,
						role: 'operador', // opcional
					});

					logger.info(`Usuario registrado: ${body.username}`);
					return Response.json(result, { status: 201 });
				} catch (err: any) {
					logger.error(`Error en registro: ${err.message}`);
					if (err.message === 'Username already exists') {
						return Response.json(
							{ error: 'Username already exists' },
							{ status: 409 },
						);
					}

					if (err.message === 'Validation error') {
						return Response.json({ error: 'Invalid input' }, { status: 400 });
					}

					return Response.json(
						{ error: 'Internal server error' },
						{ status: 500 },
					);
				}
			},
		},
		'/status/200': {
			GET() {
				logger.info('Solicitud GET /status/200');
				return new Response('hola mundo', { status: 200 });
			},
		},
		'/status/500': {
			GET() {
				logger.info('Solicitud GET /status/500');
				return new Response('internal server error', { status: 500 });
			},
		},
		'/status/429': {
			GET() {
				logger.info('Solicitud GET /status/429');
				return new Response('too many requests', { status: 429 });
			},
		},
		'/status/save': {
			async POST(req: Request) {
				try {
					logger.info('Solicitud POST /status/save');
					const body = await req.json();
					savedRecords.push(body);

					// Probabilidad del 50% de error 500
					if (Math.random() < 0.5) {
						logger.error('Error simulado al guardar en la base de datos');
						return new Response('internal server error', { status: 500 });
					}

					logger.info('Registro guardado exitosamente');
					return Response.json({ message: 'Saved successfully' }, { status: 201 });
				} catch (err: any) {
					logger.error(`Error en POST /status/save: ${err.message}`);
					return new Response('internal server error', { status: 500 });
				}
			},
			GET() {
				logger.info('Solicitud GET /status/save');
				return Response.json(savedRecords, { status: 200 });
			},
		},
	},

	development: process.env.NODE_ENV !== 'production' && {
		hmr: true,
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);
