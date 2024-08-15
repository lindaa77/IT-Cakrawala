import { Note } from '../../../../models';

export default async function handler(req, res) {
  const { method, query: { id }, body } = req;

  switch (method) {
    case 'PUT':
      try {
        const note = await Note.findByPk(id);
        if (!note) return res.status(404).json({ error: 'Note not found' });

        // Update note dengan data dari request body
        await note.update(body);

        res.status(200).json(note);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const note = await Note.findByPk(id);
        if (!note) return res.status(404).json({ error: 'Note not found' });
        await note.destroy();
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
