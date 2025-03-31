import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Dialog,
  Form,
  Input,
  MessagePlugin,
  Select,
  Space,
  InputNumber,
  Row,
  Col,
  Rate,
  Popconfirm,
  Link,
  Card,
} from 'tdesign-react';
import { AddIcon, RefreshIcon, ChevronDownIcon } from 'tdesign-icons-react';
import request from '../../utils/request';
import './Movies.less';

const { FormItem } = Form;

const statusOptions = [
  { label: '想看', value: 'wishlist' },
  { label: '正在看', value: 'watching' },
  { label: '已看完', value: 'finished' }
];

const typeOptions = [
  { label: '电影', value: 'movie' },
  { label: '电视剧', value: 'tv' }
];

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentMovie, setCurrentMovie] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchForm] = Form.useForm();
  const [expanded, setExpanded] = useState(true);

  const columns = [
    {
      title: '标题',
      colKey: 'title',
      width: 200,
      fixed: 'left',
    },
    {
      title: '类型',
      colKey: 'type',
      width: 80,
      cell: ({ row }) => {
        const option = typeOptions.find(opt => opt.value === row.type);
        return option ? option.label : '-';
      },
    },
    {
      title: '年份',
      colKey: 'year',
      width: 100,
    },
    {
      title: '地区',
      colKey: 'region',
      width: 120,
    },
    {
      title: '评分',
      colKey: 'rating',
      width: 80,
    },
    {
      title: '进度',
      colKey: 'progress',
      width: 80,
      cell: ({ row }) => `${row.progress}%`,
    },
    {
      title: '状态',
      colKey: 'status',
      width: 80,
      cell: ({ row }) => {
        const option = statusOptions.find(opt => opt.value === row.status);
        return option ? option.label : '-';
      },
    },
    {
      title: '收藏',
      colKey: 'isFavorite',
      width: 60,
      cell: ({ row }) => row.isFavorite === true ? '是' : '否',
    },
    {
      title: '操作',
      colKey: 'operation',
      width: 120,
      fixed: 'right',
      cell: ({ row }) => (
        <Space size="small">
          <Link 
            theme="primary" 
            hover="color" 
            onClick={() => handleEdit(row)}
            {...(editingId === row._id ? { loading: true } : {})}
            disabled={editingId === row._id}
          >
            编辑
          </Link>
          <Popconfirm content={`确定要删除《${row.title}》吗？此操作不可恢复。`} onConfirm={() => handleDelete(row)}>
            <Link theme="danger" hover="color">
              删除
            </Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchMovies = async (params) => {
    setLoading(true);
    try {
      const response = await request.get('/movies', {
        params
      });
      console.log('获取到的数据:', response);
      const { list, total } = response;
      setMovies(list);
      setTotal(total);
    } catch (error) {
      console.error('获取电影列表失败:', error);
      console.error('错误详情:', error.response?.data);
      MessagePlugin.error('获取电影列表失败');
      setMovies([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      await fetchMovies({
        current,
        pageSize
      });
    };
    initFetch();
  }, []);

  const rehandleChange = async (pageInfo) => {
    const { current: newCurrent, pageSize: newPageSize } = pageInfo;
    setCurrent(newCurrent);
    setPageSize(newPageSize);
    await fetchMovies({
      current: newCurrent,
      pageSize: newPageSize
    });
  };

  const handleAdd = () => {
    setCurrentMovie(null);
    form.reset();
    setVisible(true);
  };

  const handleEdit = async (movie) => {
    setEditingId(movie._id);
    const startTime = Date.now();
    try {
      const data = await request.get(`/movies/${movie._id}`);
      const endTime = Date.now();
      const timeElapsed = endTime - startTime;
      if (timeElapsed < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - timeElapsed));
      }
      setCurrentMovie(data);
      form.setFieldsValue(data);
      setVisible(true);
    } catch (error) {
      console.error('获取电影详情失败:', error);
      console.error('错误详情:', error.response?.data);
      MessagePlugin.error('获取电影详情失败');
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (row) => {
    try {
      await request.delete(`/movies/${row._id}`);
      MessagePlugin.success('删除成功');
      fetchMovies({ current, pageSize });
    } catch (error) {
      console.error('删除电影失败:', error);
      console.error('错误详情:', error.response?.data);
      MessagePlugin.error('删除电影失败');
    }
  };

  const handleSubmit = async (e) => {
    if (e.validateResult === true) {
      try {
        const data = e.fields;
        console.log('提交的数据:', data);
        if (currentMovie) {
          await request.put(`/movies/${currentMovie._id}`, data);
          MessagePlugin.success('更新成功');
        } else {
          await request.post('/movies', data);
          MessagePlugin.success('添加成功');
        }
        setVisible(false);
        fetchMovies({ current, pageSize });
      } catch (error) {
        console.error('保存电影失败:', error);
        console.error('错误详情:', error.response?.data);
        console.error('提交的数据:', e.fields);
        MessagePlugin.error('保存电影失败');
      }
    }
  };

  const handleSearch = async (e) => {
    if (e.validateResult === true) {
      const { title, year, region, rating, status, isFavorite, type } = e.fields;
      setCurrent(1); // 重置页码到第一页
      await fetchMovies({
        current: 1,
        pageSize,
        title,
        year,
        region,
        rating,
        status,
        isFavorite,
        type
      });
    }
  };

  const handleReset = async () => {
    searchForm.reset();
    setCurrent(1);
    await fetchMovies({
      current: 1,
      pageSize
    });
  };

  return (
    <div className="admin-movies">
      <div className="header-container">
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <h3>影视管理</h3>
          </Col>
          <Col>
            <Space>
              <Button icon={<RefreshIcon />} onClick={() => fetchMovies({ current, pageSize })}>
                刷新
              </Button>
              <Button icon={<AddIcon />} theme="primary" onClick={handleAdd}>
                添加影视
              </Button>
            </Space>
          </Col>
        </Row>

        <Card
          title="搜索条件"
          bordered
          actions={
            <ChevronDownIcon
              style={{
                cursor: 'pointer',
                transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.3s'
              }}
              onClick={() => setExpanded(!expanded)}
            />
          }
          style={{ marginBottom: expanded ? '16px' : 0 }}
        >
          {expanded && (
            <Form
              form={searchForm}
              onSubmit={handleSearch}
              labelWidth={80}
              layout="inline"
            >
              <FormItem label="标题" name="title">
                <Input placeholder="请输入标题" style={{ width: '200px' }} />
              </FormItem>
              <FormItem label="类型" name="type">
                <Select options={typeOptions} placeholder="请选择类型" clearable style={{ width: '200px' }} />
              </FormItem>
              <FormItem label="年份" name="year">
                <Input placeholder="请输入年份" style={{ width: '200px' }} />
              </FormItem>
              <FormItem label="地区" name="region">
                <Input placeholder="请输入地区" style={{ width: '200px' }} />
              </FormItem>
              <FormItem label="评分" name="rating">
                <InputNumber placeholder="最低评分" min={0} max={5} style={{ width: '200px' }} />
              </FormItem>
              <FormItem label="状态" name="status">
                <Select options={statusOptions} placeholder="请选择状态" clearable style={{ width: '200px' }} />
              </FormItem>
              <FormItem label="收藏" name="isFavorite">
                <Select
                  options={[
                    { label: '是', value: true },
                    { label: '否', value: false }
                  ]}
                  placeholder="请选择"
                  clearable
                  style={{ width: '200px' }}
                />
              </FormItem>
              <FormItem>
                <Space>
                  <Button theme="primary" type="submit">
                    搜索
                  </Button>
                  <Button onClick={handleReset}>
                    重置
                  </Button>
                </Space>
              </FormItem>
            </Form>
          )}
        </Card>
      </div>

      <Table
        data={movies}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{
          current,
          pageSize,
          total,
          showJumper: true,
          selectProps: {},
          onChange: rehandleChange,
        }}
        tableLayout="auto"
        bordered
      />

      <Dialog
        header={currentMovie ? '编辑影视' : '添加影视'}
        visible={visible}
        onClose={() => {
          setVisible(false);
          setCurrentMovie(null);
          form.reset();
        }}
        destroyOnClose
        onOpened={() => {
          if (currentMovie) {
            form.setFieldsValue(currentMovie);
          }
        }}
        width={600}
        footer={false}
      >
        <Form
          form={form}
          onSubmit={handleSubmit}
          labelWidth={80}
          labelAlign="right"
          statusIcon={true}
        >
          <FormItem
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </FormItem>
          <FormItem
            label="类型"
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select options={typeOptions} placeholder="请选择类型" />
          </FormItem>
          <FormItem
            label="年份"
            name="year"
            rules={[{ required: true, message: '请输入年份' }]}
          >
            <Input placeholder="请输入年份" />
          </FormItem>
          <FormItem
            label="地区"
            name="region"
            rules={[{ required: true, message: '请输入地区' }]}
          >
            <Input placeholder="请输入地区" />
          </FormItem>
          <FormItem
            label="封面"
            name="cover"
            rules={[{ required: true, message: '请输入封面图片URL' }]}
          >
            <Input placeholder="请输入封面图片URL" />
          </FormItem>
          <FormItem label="评分" name="rating">
            <Rate allowHalf />
          </FormItem>
          <FormItem
            label="进度"
            name="progress"
            rules={[{ required: true, message: '请输入观看进度' }]}
          >
            <InputNumber min={0} max={100} placeholder="请输入观看进度" />
          </FormItem>
          <FormItem 
            label="状态" 
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select options={statusOptions} />
          </FormItem>
          <FormItem label="收藏" name="isFavorite">
            <Select options={[
              { label: '是', value: true },
              { label: '否', value: false }
            ]} />
          </FormItem>
          <FormItem statusIcon={false}>
            <Button theme="primary" type="submit" block>
              确定
            </Button>
          </FormItem>
        </Form>
      </Dialog>
    </div>
  );
};

export default Movies; 