import express from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  addNote,
  deleteNote,
} from '../controllers/bookController';
import {
  createBookValidator,
  updateBookValidator,
  getBooksValidator,
  getBookValidator,
  deleteBookValidator,
  addNoteValidator,
  deleteNoteValidator,
} from '../middlewares/validators/bookValidators';

const router = express.Router();

// 公开路由
router.get('/', getBooksValidator, validate, getBooks);
router.get('/:id', getBookValidator, validate, getBook);

// 需要认证的路由
router.post('/', auth, createBookValidator, validate, createBook);
router.put('/:id', auth, updateBookValidator, validate, updateBook);
router.delete('/:id', auth, deleteBookValidator, validate, deleteBook);

// 笔记相关路由
router.post('/:id/notes', auth, addNoteValidator, validate, addNote);
router.delete('/:id/notes/:noteId', auth, deleteNoteValidator, validate, deleteNote);

export default router; 