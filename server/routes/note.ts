import { app as main } from '..';
import db from '../database';
import z from 'zod';

export default (app: typeof main) => {
	app.post('/new', { schema: { body: z.object({ title: z.string(), content: z.string() }) } }, async (req, res) => {
		const user = (await req.jwtVerify()) as JwtPayload;
		const { title, content } = req.body;
		try {
			await db.note.create({
				data: {
					title,
					content,
					// TODO: hash id
					userId: 1,
					path: '/',
				},
			});
		} catch (e) {
			console.log(e);
			return res.status(500).send('Something went wrong.');
		}
		return user;
	});
};
