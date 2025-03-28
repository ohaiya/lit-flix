import React, { useState } from 'react';
import { Dialog } from 'tdesign-react';
import { 
  CheckCircleIcon, 
  MovieClapperIcon, 
  PlayCircleStrokeAddIcon,
  StarIcon
} from 'tdesign-icons-react';
import MovieGroup from './components/movies/MovieGroup';
import MovieDetail from './components/movies/MovieDetail';
import './Movies.less';

// 示例数据
const movies = [
  {
    id: 1,
    title: '盗梦空间',
    cover: 'https://public.readdy.ai/ai/img_res/d06f75d3d6c20cb238fd0dd888bb918c.jpg',
    year: '2010',
    region: '美国',
    rating: 4.5,
    status: 'finished',
    progress: 100,
    isFavorite: true,
    notes: [
      {
        id: 1,
        title: '第一次观看',
        date: '2024-01-15',
        content: '这是一部非常经典的科幻电影，诺兰的想象力令人惊叹。梦境层次的设定非常巧妙，演员的表演也很出色。',
      },
      {
        id: 2,
        title: '第二次观看',
        date: '2024-02-01',
        content: '重看时发现了很多细节，比如柯布手上的戒指、陀螺的旋转等。结局的解读也很有意思。',
      },
    ],
  },
  {
    id: 2,
    title: '星际穿越',
    cover: 'https://public.readdy.ai/ai/img_res/4d7eed46ebee84f3b03dcae0ea7a0473.jpg',
    year: '2014',
    region: '美国',
    rating: 4.8,
    status: 'finished',
    progress: 100,
    isFavorite: true,
    notes: [
      {
        id: 3,
        title: '第一次观看',
        date: '2024-01-20',
        content: '诺兰的又一部科幻巨作，将亲情与科幻完美结合。配乐非常震撼，视觉效果也很出色。',
      },
    ],
  },
  {
    id: 3,
    title: '奥本海默',
    cover: 'https://public.readdy.ai/ai/img_res/5833988f44c2b4a911d07c5f17ee816a.jpg',
    year: '2023',
    region: '美国',
    rating: 4.2,
    status: 'watching',
    progress: 60,
    isFavorite: false,
    notes: [
      {
        id: 4,
        title: '观看中',
        date: '2024-02-10',
        content: '诺兰的新作，黑白与彩色画面的切换很有意思。基里安·墨菲的表演非常出色。',
      },
    ],
  },
  {
    id: 4,
    title: '沙丘2',
    cover: 'https://public.readdy.ai/ai/img_res/2aa7e4773fdf4ad02b9b2865bdb1a179.jpg',
    year: '2024',
    region: '美国',
    rating: 0,
    status: 'wishlist',
    progress: 0,
    isFavorite: false,
    notes: [],
  },
];

const tvShows = [
  {
    id: 5,
    title: '真探 第四季',
    cover: 'https://public.readdy.ai/ai/img_res/cddd77844d7a5cb0325a1361be6b5f1c.jpg',
    year: '2024',
    region: '美国',
    rating: 4.7,
    status: 'finished',
    progress: 100,
    isFavorite: true,
    notes: [
      {
        id: 5,
        title: '第一集',
        date: '2024-01-25',
        content: '新一季的故事发生在阿拉斯加，氛围非常阴郁。主演的表演很出色。',
      },
      {
        id: 6,
        title: '第二集',
        date: '2024-02-01',
        content: '剧情逐渐展开，悬疑感很强。配乐和摄影都很出色。',
      },
    ],
  },
  {
    id: 6,
    title: '继承之战 第四季',
    cover: 'https://public.readdy.ai/ai/img_res/84f1bf2af01963751e7114e4ab0037d3.jpg',
    year: '2023',
    region: '美国',
    rating: 4.6,
    status: 'watching',
    progress: 40,
    isFavorite: false,
    notes: [
      {
        id: 7,
        title: '观看中',
        date: '2024-02-05',
        content: '最终季，剧情更加紧张。每个角色都在为自己的利益而战。',
      },
    ],
  },
  {
    id: 7,
    title: '白莲花度假村 第三季',
    cover: 'https://public.readdy.ai/ai/img_res/633b552098b8700e92868056a9618e71.jpg',
    year: '2024',
    region: '美国',
    rating: 0,
    status: 'wishlist',
    progress: 0,
    isFavorite: false,
    notes: [],
  },
];

// 观看笔记数据
const movieNotes = {
  1: [
    {
      title: '关于梦境的思考',
      content: '诺兰通过梦境这个主题，探讨了现实与虚幻的界限。电影中的多层梦境结构令人印象深刻，每一层都有其独特的规则和时间流速。',
      date: '2024-03-25 14:30',
    },
    {
      title: '人物塑造',
      content: '莱昂纳多饰演的柯布形象立体，他的内心挣扎和对亡妻的愧疚贯穿始终，为科幻片增添了人文关怀。',
      date: '2024-03-20 20:15',
    },
  ],
  2: [
    {
      title: '科幻与亲情的结合',
      content: '诺兰将宏大的科幻概念与父女亲情完美结合，让观众在惊叹于宇宙奥秘的同时，也被亲情所打动。',
      date: '2024-03-26 09:45',
    },
  ],
  3: [
    {
      title: '经典爱情故事',
      content: '卡梅隆通过泰坦尼克号这个历史事件，讲述了一个跨越阶级的爱情故事。杰克和露丝的爱情虽然短暂，却永恒。',
      date: '2024-03-22 16:20',
    },
  ],
  5: [
    {
      title: '人性的复杂',
      content: '老白从一个普通化学老师到毒品制造者的转变，展现了人性的复杂。他的每一步选择都有其合理性，却又不可避免地走向悲剧。',
      date: '2024-03-18 21:30',
    },
    {
      title: '叙事结构',
      content: '剧集采用非线性叙事，通过闪回和闪前，让观众逐渐理解人物关系和事件发展，非常吸引人。',
      date: '2024-03-10 18:45',
    },
  ],
  6: [
    {
      title: '权力的游戏',
      content: '这部剧通过复杂的权力斗争，展现了人性的残酷。每个角色都有其独特的性格和动机，让观众难以预测剧情发展。',
      date: '2024-03-24 11:15',
    },
  ],
};

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [expandedNoteIndex, setExpandedNoteIndex] = useState(0);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setExpandedNoteIndex(0);
  };

  const handleNoteClick = (index) => {
    setExpandedNoteIndex(expandedNoteIndex === index ? null : index);
  };

  const handleClose = () => {
    setSelectedMovie(null);
    setExpandedNoteIndex(0);
  };

  // 获取影视的观看笔记
  const getMovieNotes = (movieId) => {
    return movieNotes[movieId] || [];
  };

  return (
    <div className="movies">
      <MovieGroup
        title="电影"
        movies={movies}
        onMovieClick={handleMovieClick}
      />
      <MovieGroup
        title="电视剧"
        movies={tvShows}
        onMovieClick={handleMovieClick}
      />

      <Dialog
        visible={!!selectedMovie}
        onClose={handleClose}
        width={800}
        footer={false}
        header={false}
      >
        {selectedMovie && (
          <MovieDetail
            movie={selectedMovie}
            notes={getMovieNotes(selectedMovie.id)}
            expandedNoteIndex={expandedNoteIndex}
            onNoteClick={handleNoteClick}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Movies; 