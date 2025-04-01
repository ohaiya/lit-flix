import { Card, Row, Col, Statistic, List } from 'tdesign-react';
import { BookIcon, VideoIcon, StarIcon, TimeIcon } from 'tdesign-icons-react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import request from '../../utils/request';
import './Dashboard.less';

const { ListItem } = List;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMovies: 0,
    favoriteBooks: 0,
    favoriteMovies: 0,
    recentBooks: [],
    recentMovies: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksResponse, moviesResponse] = await Promise.all([
          request.get('/books', {
            params: {
              current: 1,
              pageSize: 20 // 获取第一页数据即可
            }
          }),
          request.get('/movies', {
            params: {
              current: 1,
              pageSize: 20 // 获取第一页数据即可
            }
          })
        ]);

        const books = booksResponse.list || [];
        const movies = moviesResponse.list || [];

        const totalBooks = booksResponse.total || 0;
        const totalMovies = moviesResponse.total || 0;
        const favoriteBooks = books.filter(book => book.isFavorite).length;
        const favoriteMovies = movies.filter(movie => movie.isFavorite).length;
        const recentBooks = books
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 3);
        const recentMovies = movies
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 3);

        setStats({
          totalBooks,
          totalMovies,
          favoriteBooks,
          favoriteMovies,
          recentBooks,
          recentMovies
        });
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>仪表盘</h2>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总书籍数"
              value={stats.totalBooks}
              prefix={<BookIcon />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总影视数"
              value={stats.totalMovies}
              prefix={<VideoIcon />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="收藏书籍"
              value={stats.favoriteBooks}
              prefix={<StarIcon />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="收藏影视"
              value={stats.favoriteMovies}
              prefix={<StarIcon />}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="最近更新的书籍">
            <List>
              {stats.recentBooks.map(book => (
                <ListItem key={book._id}>
                  <div className="recent-item">
                    <img src={book.cover || 'https://via.placeholder.com/160x200'} alt={book.title} className="cover" />
                    <div className="info">
                      <div className="title">{book.title}</div>
                      <div className="meta">
                        <span>{book.author}</span>
                        <span>{moment(book.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                      </div>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="最近更新的影视">
            <List>
              {stats.recentMovies.map(movie => (
                <ListItem key={movie._id}>
                  <div className="recent-item">
                    <img src={movie.cover || 'https://via.placeholder.com/160x200'} alt={movie.title} className="cover" />
                    <div className="info">
                      <div className="title">{movie.title}</div>
                      <div className="meta">
                        <span>{movie.year}</span>
                        <span>{movie.region}</span>
                        <span>{moment(movie.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                      </div>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 