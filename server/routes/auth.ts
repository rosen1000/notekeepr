import argon2 from '@node-rs/argon2';
import db from '../database';
import { app as main } from '..';
import { z } from 'zod';
import { JwtPayload } from '../@types';
import hasher from '../hasher';

export default (app: typeof main) => {
	app.post(
		'/login',
		{ schema: { body: z.object({ username: z.string(), password: z.string() }) } },
		async (req, res) => {
			const user = await db.user.findUnique({ where: { username: req.body.username } });
			if (!user || !argon2.verify(user.password, req.body.password)) {
				return res.status(401).send('Invalid credentials');
			}

			const id = hasher.encode(user.id);
			const token = app.jwt.sign({ id, username: user.username });
			res.setCookie('Authorization', token, { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
			return res.status(200).send();
		}
	);

	app.post(
		'/register',
		{ schema: { body: z.object({ username: z.string(), password: z.string() }) } },
		async (req, res) => {
			let user = await db.user.findUnique({ where: { username: req.body.username } });
			if (user) return res.status(409).send('Username already exists');

			const hashedPassword = await argon2.hash(req.body.password);
			user = await db.user.create({
				data: {
					username: req.body.username,
					password: hashedPassword,
				},
			});

			const id = hasher.encode(user.id);
			const token = app.jwt.sign({ id, username: req.body.username });
			res.setCookie('Authorization', token, { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
			return res.status(201).send();
		}
	);

	app.post('/logout', async (_req, res) => {
		res.clearCookie('Authorization');
	});

	app.get('/me', async (req) => {
		try {
			const jwt = (await req.jwtVerify()) as JwtPayload;
			const user = db.user.findFirst({
				where: { username: jwt.username },
				omit: { password: true },
			});
			return user;
		} catch (e) {
			app.log.error(e);
			return 'error';
		}
	});
};
