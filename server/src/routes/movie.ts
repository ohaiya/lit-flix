import express from 'express';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  addNote,
  deleteNote,
} from '../controllers/movieController';
import {
  createMovieValidator,
  updateMovieValidator,
  getMoviesValidator,
  getMovieValidator,
  deleteMovieValidator,
  addNoteValidator,
  deleteNoteValidator,
} from '../middlewares/validators/movieValidators';

const router = express.Router();

// 公开路由
router.get('/', getMoviesValidator, validate, getMovies);
router.get('/:id', getMovieValidator, validate, getMovie);

// 需要认证的路由
router.post('/', auth, createMovieValidator, validate, createMovie);
router.put('/:id', auth, updateMovieValidator, validate, updateMovie);
router.delete('/:id', auth, deleteMovieValidator, validate, deleteMovie);

// 笔记相关路由
router.post('/:id/notes', auth, addNoteValidator, validate, addNote);
router.delete('/:id/notes/:noteId', auth, deleteNoteValidator, validate, deleteNote);

export default router; 