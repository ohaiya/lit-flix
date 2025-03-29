import mongoose, { Document, Schema } from 'mongoose';

export interface INote {
  _id: Schema.Types.ObjectId;
  title: string;
  content: string;
  date: string;
}

export interface IMovie extends Document {
  title: string;
  cover: string;
  year: number;
  region: string;
  rating: number;
  status: 'watching' | 'completed' | 'planning';
  progress: number;
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

const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, '电影标题是必需的'],
      trim: true,
    },
    cover: {
      type: String,
      required: [true, '封面图片是必需的'],
    },
    year: {
      type: Number,
      required: [true, '年份是必需的'],
    },
    region: {
      type: String,
      required: [true, '地区是必需的'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, '评分是必需的'],
      min: [0, '评分不能小于0'],
      max: [5, '评分不能大于5'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['watching', 'completed', 'planning'],
      required: [true, '状态是必需的'],
      default: 'planning',
    },
    progress: {
      type: Number,
      min: [0, '进度不能小于0'],
      max: [100, '进度不能大于100'],
      default: 0,
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
movieSchema.index({ title: 1 });
movieSchema.index({ status: 1 });
movieSchema.index({ isFavorite: 1 });

export const Movie = mongoose.model<IMovie>('Movie', movieSchema); 