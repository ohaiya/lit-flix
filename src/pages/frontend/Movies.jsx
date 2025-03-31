import React, { useState, useEffect } from 'react';
import { Dialog, MessagePlugin } from 'tdesign-react';
import { 
  CheckCircleIcon, 
  MovieClapperIcon, 
  PlayCircleStrokeAddIcon,
  StarIcon
} from 'tdesign-icons-react';
import MovieGroup from './components/movies/MovieGroup';
import MovieDetail from './components/movies/MovieDetail';
import request from '../../utils/request';
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
    isFavorite: true
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
    isFavorite: true
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: true
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
    isFavorite: false
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
    isFavorite: false
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
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [movieNotes, setMovieNotes] = useState({});

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // 获取所有影视
        const response = await request.get('/movies', {
          params: {
            pageSize: 1000 // 设置较大的数值以获取所有数据
          }
        });
        
        // 分离电影和电视剧
        const { list } = response;
        const moviesData = list.filter(item => item.type === 'movie');
        const tvShowsData = list.filter(item => item.type === 'tv');
        
        setMovies(moviesData);
        setTvShows(tvShowsData);
      } catch (error) {
        console.error('获取影视列表失败:', error);
        MessagePlugin.error('获取影视列表失败');
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = async (movie) => {
    try {
      // 获取电影详情（包含笔记）
      const data = await request.get(`/movies/${movie._id}`);
      const notes = data.notes || [];
      
      // 更新笔记数据
      setMovieNotes(prev => ({
        ...prev,
        [movie._id]: notes
      }));
      
      setSelectedMovie(movie);
      setExpandedNoteIndex(0);
    } catch (error) {
      console.error('获取影视详情失败:', error);
      MessagePlugin.error('获取影视详情失败');
    }
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
            notes={getMovieNotes(selectedMovie._id)}
            expandedNoteIndex={expandedNoteIndex}
            onNoteClick={handleNoteClick}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Movies; 