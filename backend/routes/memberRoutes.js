import express from 'express';
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  updateLog,
  addNote,
  deleteNote,
} from '../controllers/memberController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with auth middleware
router.use(auth);

// Member CRUD
router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

// Logs
router.put('/:id/log', updateLog);

// Notes
router.post('/:id/notes', addNote);
router.delete('/:id/notes/:noteId', deleteNote);

export default router;
