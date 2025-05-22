import db from '../database';
import z from 'zod';
import { app as main } from '..';
import hasher from '../hasher';
import type { JwtPayload } from '../@types';

export default (app: typeof main) => {
	app.post(
		'/new',
		{ schema: { body: z.object({ title: z.string(), content: z.string(), path: z.string().default('/') }) } },
		async (req, res) => {
			const token = (await req.jwtVerify()) as JwtPayload;
			const userId = hasher.decode(token.id)[0] as number;
			const { title, content, path } = req.body;
			try {
				await db.note.create({
					data: {
						title,
						content,
						userId,
						path,
					},
				});
			} catch (e) {
				console.log(e);
				return res.status(500).send('Something went wrong.');
			}
		}
	);

	app.get('/all', async (req, res) => {
		const token = (await req.jwtVerify()) as JwtPayload;
		const userId = hasher.decode(token.id)[0] as number;
		const notes = await db.note.findMany({
			select: { id: true, title: true, path: true, tags: true },
			where: { userId },
		});
		const paths = (
			await db.note.groupBy({
				where: { userId },
				by: ['path'],
			})
		).map((group) => group.path);
		res.send({ notes, paths });
	});

	app.get('/paths', async (req, res) => {
		const token = (await req.jwtVerify()) as JwtPayload;
		const userId = hasher.decode(token.id)[0] as number;
		const paths = (
			await db.note.groupBy({
				where: { userId },
				by: ['path'],
			})
		).map((group) => group.path);
		res.send(paths);
	});

	app.get('/:id(\\d+)', { schema: { params: z.object({ id: z.number({ coerce: true }) }) } }, async (req, res) => {
		const token = (await req.jwtVerify()) as JwtPayload;
		const userId = hasher.decode(token.id)[0] as number;
		const note = await db.note.findUnique({
			where: { id: req.params.id, userId: userId },
			include: { Share: { select: { link: true } } },
		});
		if (!note) return res.status(404).send('Note not found.');
		res.send(note);
	});

	app.patch(
		'/:id(\\d+)',
		{
			schema: {
				body: z.object({
					title: z.string().nonempty(),
					content: z.string().nonempty(),
					path: z.string().nonempty().startsWith('/'),
				}),
				params: z.object({ id: z.number({ coerce: true }) }),
			},
		},
		async (req) => {
			await req.jwtVerify();
			await db.note.update({ where: { id: req.params.id }, data: req.body });
		}
	);

	app.delete('/:id(\\d+)', { schema: { params: z.object({ id: z.number({ coerce: true }) }) } }, async (req) => {
		const token = (await req.jwtVerify()) as JwtPayload;
		const userId = hasher.decode(token.id)[0] as number;
		const result = await db.note.delete({ where: { id: req.params.id, userId } });
		return result;
	});
};
