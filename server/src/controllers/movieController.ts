import { Request, Response } from 'express';
import { Movie } from '../models/Movie';
import { ResponseUtil } from '../utils/response';

// 获取所有电影
export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      current = 1, 
      pageSize = 10,
      title,
      year,
      region,
      rating,
      status,
      isFavorite
    } = req.query;

    const query: any = {};

    // 添加模糊搜索条件
    if (title) query.title = { $regex: title as string, $options: 'i' };
    if (year) query.year = year;
    if (region) query.region = { $regex: region as string, $options: 'i' };
    
    // 添加评分条件
    if (rating) query.rating = { $gte: Number(rating) };
    
    // 添加状态条件
    if (status) query.status = status;
    
    // 添加收藏条件
    if (isFavorite !== undefined && isFavorite !== '') {
      query.isFavorite = isFavorite === 'true';
    }

    console.log('查询条件:', query);

    // 计算分页
    const skip = (Number(current) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    // 获取总数
    const total = await Movie.countDocuments(query);

    // 获取分页数据
    const movies = await Movie.find(query)
      .sort({ updatedAt: -1 }) // 按更新时间倒序排序
      .skip(skip)
      .limit(limit);

    console.log('查询结果数量:', movies.length);
    ResponseUtil.success(res, {
      list: movies,
      total,
      current: Number(current),
      pageSize: Number(pageSize)
    }, '获取电影列表成功');
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

    const noteIndex = movie.notes.findIndex(note => note._id.toString() === req.params.noteId);
    if (noteIndex === -1) {
      ResponseUtil.notFound(res, '笔记不存在');
      return;
    }

    movie.notes.splice(noteIndex, 1);
    await movie.save();

    ResponseUtil.success(res, null, '删除笔记成功');
  } catch (error) {
    console.error('删除笔记失败:', error);
    ResponseUtil.error(res, '删除笔记失败');
  }
};

// 更新笔记
export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      ResponseUtil.notFound(res, '电影不存在');
      return;
    }

    const noteIndex = movie.notes.findIndex(note => note._id.toString() === req.params.noteId);
    if (noteIndex === -1) {
      ResponseUtil.notFound(res, '笔记不存在');
      return;
    }

    // 更新笔记内容
    movie.notes[noteIndex] = {
      ...movie.notes[noteIndex].toObject(),
      ...req.body,
      _id: movie.notes[noteIndex]._id // 保持原有的_id
    };
    
    await movie.save();
    ResponseUtil.success(res, movie.notes[noteIndex], '更新笔记成功');
  } catch (error) {
    console.error('更新笔记失败:', error);
    if (error.name === 'ValidationError') {
      ResponseUtil.validationError(res, error.message);
    } else {
      ResponseUtil.error(res, '更新笔记失败');
    }
  }
};

// 获取电影的所有笔记
export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      ResponseUtil.notFound(res, '电影不存在');
      return;
    }

    ResponseUtil.success(res, movie.notes || [], '获取笔记列表成功');
  } catch (error) {
    console.error('获取笔记列表失败:', error);
    ResponseUtil.error(res, '获取笔记列表失败');
  }
}; 