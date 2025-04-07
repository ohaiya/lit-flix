import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  _id: Schema.Types.ObjectId;
  title: string;
  content: string;
  date: string;
}

export interface IBook extends Document {
  title: string;
  subtitle?: string;
  cover?: string;
  author: string;
  publisher?: string;
  rating?: number;
  status: 'wishlist' | 'reading' | 'finished';
  isFavorite: boolean;
  notes: INote[];
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: true });

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, '书籍标题是必需的'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    cover: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      required: [true, '作者是必需的'],
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: [0, '评分不能小于0'],
      max: [5, '评分不能大于5'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['wishlist', 'reading', 'finished'],
      required: [true, '状态是必需的'],
      default: 'wishlist',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

// 添加索引
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ isFavorite: 1 });

export const Book = mongoose.model<IBook>('Book', bookSchema); 