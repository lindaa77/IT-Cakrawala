import { Note } from '../../../../models';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('GET REQUEST...');
      const notes = await Note.findAll();
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else if (req.method === 'POST') {
    try {
      const { title, body } = req.body;
      const newNote = await Note.create({ title, body });
      res.status(201).json(newNote);
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
