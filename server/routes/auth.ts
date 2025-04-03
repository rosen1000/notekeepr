import argon2 from '@node-rs/argon2';
import db from '../database';
import { app as main } from '..';
import { z } from 'zod';

export default (app: typeof main) => {
	app.post(
		'/login',
		{ schema: { body: z.object({ username: z.string(), password: z.string() }) } },
		async (req, res) => {
			const user = await db.user.findUnique({
				where: { username: req.body.username },
			});
			if (!user || !argon2.verify(user.password, req.body.password)) {
				return res.status(401).send('Invalid credentials');
			}

			const token = app.jwt.sign({ username: user.username });
			return res.status(200).send(token);
		}
	);

	app.post(
		'/register',
		{
			schema: {
				body: z.object({
					username: z.string(),
					password: z.string(),
				}),
			},
		},
		async (req, res) => {
			const user = await db.user.findUnique({
				where: { username: req.body.username },
			});
			if (user) {
				return res.status(409).send('Username already exists');
			}
			const hashedPassword = await argon2.hash(req.body.password);
			await db.user.create({
				data: {
					username: req.body.username,
					password: hashedPassword,
				},
			});
			const token = app.jwt.sign({ username: req.body.username });
			return res.status(201).send(token);
		}
	);
};
