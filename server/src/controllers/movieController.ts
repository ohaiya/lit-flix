import { Request, Response } from 'express';
import { Movie } from '../models/Movie';
import { ResponseUtil } from '../utils/response';

// 获取所有电影
export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, isFavorite } = req.query;
    const query: any = {};

    // 添加过滤条件
    if (status) query.status = status;
    if (isFavorite !== undefined) query.isFavorite = isFavorite === 'true';

    console.log('查询条件:', query);
    const movies = await Movie.find(query).sort({ createdAt: -1 });
    console.log('查询结果数量:', movies.length);
    ResponseUtil.success(res, movies, '获取电影列表成功');
  } catch (error) {
    console.error('获取电影列表失败:', error);
    ResponseUtil.error(res, '获取电影列表失败');
  }
};

// 获取单个电影
export const getMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      ResponseUtil.notFound(res, '电影不存在');
      return;
    }
    ResponseUtil.success(res, movie, '获取电影详情成功');
  } catch (error) {
    console.error('获取电影详情失败:', error);
    ResponseUtil.error(res, '获取电影详情失败');
  }
};

// 创建电影
export const createMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('创建电影请求数据:', req.body);
    const movie = new Movie(req.body);
    await movie.save();
    ResponseUtil.success(res, movie, '创建电影成功');
  } catch (error) {
    console.error('创建电影失败:', error);
    if (error.name === 'ValidationError') {
      ResponseUtil.validationError(res, error.message);
    } else {
      ResponseUtil.error(res, '创建电影失败');
    }
  }
};

// 更新电影
export const updateMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('更新电影请求数据:', req.body);
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) {
      ResponseUtil.notFound(res, '电影不存在');
      return;
    }
    ResponseUtil.success(res, movie, '更新电影成功');
  } catch (error) {
    console.error('更新电影失败:', error);
    if (error.name === 'ValidationError') {
      ResponseUtil.validationError(res, error.message);
    } else {
      ResponseUtil.error(res, '更新电影失败');
    }
  }
};

// 删除电影
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      ResponseUtil.notFound(res, '电影不存在');
      return;
    }
    ResponseUtil.success(res, null, '删除电影成功');
  } catch (error) {
    console.error('删除电影失败:', error);
    ResponseUtil.error(res, '删除电影失败');
  }
};

// 添加笔记
export const addNote = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('添加笔记请求数据:', req.body);
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      ResponseUtil.notFound(res, '电影不存在');
      return;
    }

    movie.notes = movie.notes || [];
    movie.notes.push(req.body);
    await movie.save();

    ResponseUtil.success(res, movie, '添加笔记成功');
  } catch (error) {
    console.error('添加笔记失败:', error);
    if (error.name === 'ValidationError') {
      ResponseUtil.validationError(res, error.message);
    } else {
      ResponseUtil.error(res, '添加笔记失败');
    }
  }
};

// 删除笔记
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      ResponseUtil.notFound(res, '电影不存在');
      return;
    }

    const noteIndex = movie.notes.findIndex(
      note => note._id.toString() === req.params.noteId
    );

    if (noteIndex === -1) {
      ResponseUtil.notFound(res, '笔记不存在');
      return;
    }

    movie.notes.splice(noteIndex, 1);
    await movie.save();

    ResponseUtil.success(res, movie, '删除笔记成功');
  } catch (error) {
    console.error('删除笔记失败:', error);
    ResponseUtil.error(res, '删除笔记失败');
  }
}; 