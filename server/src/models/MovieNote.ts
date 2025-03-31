import mongoose, { Document, Schema } from 'mongoose';

export interface IMovieNote extends Document {
  movieId: Schema.Types.ObjectId;
  title: string;
  content: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const movieNoteSchema = new Schema<IMovieNote>(
  {
    movieId: {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, '电影ID是必需的'],
    },
    title: {
      type: String,
      required: [true, '笔记标题是必需的'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, '笔记内容是必需的'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, '日期是必需的'],
    }
  },
  {
    timestamps: true,
  }
);

// 添加索引
movieNoteSchema.index({ movieId: 1 });
movieNoteSchema.index({ date: -1 });

export const MovieNote = mongoose.model<IMovieNote>('MovieNote', movieNoteSchema); 