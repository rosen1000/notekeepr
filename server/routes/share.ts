import db from '../database';
import z from 'zod';
import { app as main } from '..';
import hasher from '../hasher';
import type { JwtPayload } from '../@types';

export default (app: typeof main) => {
	app.post('/', { schema: { body: z.object({ id: z.number() }) } }, async (req, res) => {
		const token = (await req.jwtVerify()) as JwtPayload;
		const userId = hasher.decode(token.id)[0] as number;
		const note = await db.note.findUnique({ where: { id: req.body.id } });
		if (!note) return res.status(404).send('Note not found.');
		if (userId != note.userId) {
			return res.status(403).send('You are not allowed to share this note.');
		}
		const link = hasher.encode([userId, note.id]);
		await db.share.create({
			data: { userId, noteId: req.body.id, link },
		});
		res.send(link);
	});

	app.get('/:link', { schema: { params: z.object({ link: z.string() }) } }, async (req, res) => {
		const share = await db.share.findFirst({ where: { link: req.params.link } });
		if (!share) return res.status(404).send('Share not found.');
		const note = await db.note.findUnique({ where: { id: share.noteId } });
		if (!note) return res.status(404).send('Note not found.');
		res.send(note);
	});

	app.delete('/:link', { schema: { params: z.object({ link: z.string() }) } }, async (req, res) => {
		const token = (await req.jwtVerify()) as JwtPayload;
		const userId = hasher.decode(token.id)[0] as number;
		const [uId, noteId] = hasher.decode(req.params.link) as number[];
		if (uId != userId) return res.status(403).send('You are not allowed to delete this share.');
		const { count } = await db.share.deleteMany({ where: { userId, noteId, link: req.params.link } });
		if (count == 0) return res.status(404).send('Share not found.');
		res.send('Share deleted.');
	});
};
