import { Request, Response } from 'express';
import { Book } from '../models/Book';
import { ResponseUtil } from '../utils/response';

// 获取所有书籍
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      current = 1, 
      pageSize = 10,
      title,
      subtitle,
      author,
      publisher,
      rating,
      status,
      isFavorite
    } = req.query;

    const query: any = {};

    // 添加模糊搜索条件
    if (title) query.title = { $regex: title as string, $options: 'i' };
    if (subtitle) query.subtitle = { $regex: subtitle as string, $options: 'i' };
    if (author) query.author = { $regex: author as string, $options: 'i' };
    if (publisher) query.publisher = { $regex: publisher as string, $options: 'i' };
    
    // 添加评分条件
    if (rating) query.rating = { $gte: Number(rating) };
    
    // 添加状态条件
    if (status) query.status = status;
    
    // 添加收藏条件
    if (isFavorite !== undefined) query.isFavorite = isFavorite === 'true';

    console.log('查询条件:', query);

    // 计算分页
    const skip = (Number(current) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    // 获取总数
    const total = await Book.countDocuments(query);

    // 获取分页数据
    const books = await Book.find(query)
      .sort({ updatedAt: -1 }) // 按更新时间倒序排序
      .skip(skip)
      .limit(limit);

    console.log('查询结果数量:', books.length);
    ResponseUtil.success(res, {
      list: books,
      total,
      current: Number(current),
      pageSize: Number(pageSize)
    }, '获取书籍列表成功');
  } catch (error) {
    console.error('获取书籍列表失败:', error);
    ResponseUtil.error(res, '获取书籍列表失败');
  }
};

// 获取单本书籍
export const getBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      ResponseUtil.notFound(res, '书籍不存在');
      return;
    }
    ResponseUtil.success(res, book, '获取书籍详情成功');
  } catch (error) {
    console.error('获取书籍详情失败:', error);
    ResponseUtil.error(res, '获取书籍详情失败');
  }
};

// 创建书籍
export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('创建书籍请求数据:', req.body);
    const book = new Book(req.body);
    await book.save();
    ResponseUtil.success(res, book, '创建书籍成功');
  } catch (error) {
    console.error('创建书籍失败:', error);
    if (error.name === 'ValidationError') {
      ResponseUtil.validationError(res, error.message);
    } else {
      ResponseUtil.error(res, '创建书籍失败');
    }
  }
};

// 更新书籍
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('更新书籍请求数据:', req.body);
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      ResponseUtil.notFound(res, '书籍不存在');
      return;
    }
    ResponseUtil.success(res, book, '更新书籍成功');
  } catch (error) {
    console.error('更新书籍失败:', error);
    if (error.name === 'ValidationError') {
      ResponseUtil.validationError(res, error.message);
    } else {
      ResponseUtil.error(res, '更新书籍失败');
    }
  }
};

// 删除书籍
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      ResponseUtil.notFound(res, '书籍不存在');
      return;
    }
    ResponseUtil.success(res, null, '删除书籍成功');
  } catch (error) {
    console.error('删除书籍失败:', error);
    ResponseUtil.error(res, '删除书籍失败');
  }
};

// 添加笔记
export const addNote = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('添加笔记请求数据:', req.body);
    const book = await Book.findById(req.params.id);
    if (!book) {
      ResponseUtil.notFound(res, '书籍不存在');
      return;
    }

    book.notes = book.notes || [];
    book.notes.push(req.body);
    await book.save();

    ResponseUtil.success(res, book, '添加笔记成功');
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
    const book = await Book.findById(req.params.id);
    if (!book) {
      ResponseUtil.notFound(res, '书籍不存在');
      return;
    }

    const noteIndex = book.notes.findIndex(
      note => note._id.toString() === req.params.noteId
    );

    if (noteIndex === -1) {
      ResponseUtil.notFound(res, '笔记不存在');
      return;
    }

    book.notes.splice(noteIndex, 1);
    await book.save();

    ResponseUtil.success(res, book, '删除笔记成功');
  } catch (error) {
    console.error('删除笔记失败:', error);
    ResponseUtil.error(res, '删除笔记失败');
  }
}; 