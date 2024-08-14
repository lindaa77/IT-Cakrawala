import { Note } from '../../../../models';

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  switch (method) {
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


