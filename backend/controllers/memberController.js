import { Member } from '../models/Member.js';

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find({ userId: req.user.userId });
    res.status(200).json({ members });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member || member.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({ member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const { name, displayName, spheres } = req.body;

    if (!name || !displayName) {
      return res.status(400).json({ message: 'Name and displayName are required' });
    }

    // Check if member already exists
    const existingMember = await Member.findOne({ userId: req.user.userId, name });
    if (existingMember) {
      return res.status(409).json({ message: 'Member already exists' });
    }

    const member = new Member({
      userId: req.user.userId,
      name,
      displayName,
      spheres: spheres || [],
      logs: new Map(),
      notes: [],
      setupDone: false,
    });

    await member.save();
    res.status(201).json({ message: 'Member created', member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { spheres, logs, notes, setupDone } = req.body;

    const member = await Member.findById(id);

    if (!member || member.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (spheres) member.spheres = spheres;
    if (logs) member.logs = new Map(Object.entries(logs));
    if (notes) member.notes = notes;
    if (setupDone !== undefined) member.setupDone = setupDone;

    await member.save();
    res.status(200).json({ message: 'Member updated', member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);

    if (!member || member.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await Member.findByIdAndDelete(id);
    res.status(200).json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, sphereId, completed } = req.body;

    if (!date || !sphereId || completed === undefined) {
      return res.status(400).json({ message: 'Date, sphereId, and completed are required' });
    }

    const member = await Member.findById(id);

    if (!member || member.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const logKey = `${date}_${sphereId}`;
    member.logs.set(logKey, completed);

    await member.save();
    res.status(200).json({ message: 'Log updated', member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, date, sphereId } = req.body;

    if (!content || !date) {
      return res.status(400).json({ message: 'Content and date are required' });
    }

    const member = await Member.findById(id);

    if (!member || member.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const note = {
      id: `note_${Date.now()}`,
      date,
      content,
      sphereId: sphereId || null,
    };

    member.notes.push(note);
    await member.save();

    res.status(201).json({ message: 'Note added', note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;

    const member = await Member.findById(id);

    if (!member || member.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.notes = member.notes.filter(note => note.id !== noteId);
    await member.save();

    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
