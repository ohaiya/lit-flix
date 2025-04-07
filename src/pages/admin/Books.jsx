import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
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
  Textarea,
  Rate,
  Popconfirm,
  Link,
  Card,
  Collapse,
  DatePicker,
} from 'tdesign-react';
import { AddIcon, RefreshIcon, ChevronRightIcon, ChevronDownIcon, FileIcon } from 'tdesign-icons-react';
import request from '../../utils/request';
import './Books.less';

const { FormItem } = Form;

const statusOptions = [
  { label: '想看', value: 'wishlist' },
  { label: '正在看', value: 'reading' },
  { label: '已看完', value: 'finished' }
];

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentBook, setCurrentBook] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchForm] = Form.useForm();
  const [expanded, setExpanded] = useState(true);
  
  // 笔记管理相关状态
  const [notesVisible, setNotesVisible] = useState(false);
  const [noteFormVisible, setNoteFormVisible] = useState(false);
  const [noteForm] = Form.useForm();
  const [currentNote, setCurrentNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteDate, setNoteDate] = useState('');
  const [noteDetailVisible, setNoteDetailVisible] = useState(false);

  const columns = [
    {
      title: '书名',
      colKey: 'title',
      width: 200,
      fixed: 'left',
    },
    {
      title: '副标题',
      colKey: 'subtitle',
      width: 200,
    },
    {
      title: '作者',
      colKey: 'author',
      width: 120,
    },
    {
      title: '出版社',
      colKey: 'publisher',
      width: 150,
    },
    {
      title: '评分',
      colKey: 'rating',
      width: 80,
      cell: ({ row }) => row.rating === 0 ? '未评分' : row.rating,
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
      width: 180,
      fixed: 'right',
      cell: ({ row }) => (
        <Space size="small">
          <Link 
            theme="primary" 
            hover="color" 
            onClick={() => handleEdit(row)}
            disabled={editingId === row._id}
          >
            编辑
          </Link>
          <Link
            theme="primary"
            hover="color"
            onClick={() => handleNotes(row)}
          >
            笔记管理
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

  const fetchBooks = async (params) => {
    setLoading(true);
    try {
      const response = await request.get('/books', {
        params
      });
      const { list, total } = response;
      setBooks(list);
      setTotal(total);
    } catch (error) {
      console.error('获取书籍列表失败:', error);
      console.error('错误详情:', error.response?.data);
      MessagePlugin.error('获取书籍列表失败');
      setBooks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      await fetchBooks({
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
    await fetchBooks({
      current: newCurrent,
      pageSize: newPageSize
    });
  };

  const handleAdd = () => {
    setCurrentBook(null);
    form.reset();
    setVisible(true);
  };

  const handleEdit = async (book) => {
    setEditingId(book._id);
    const startTime = Date.now();
    try {
      const data = await request.get(`/books/${book._id}`);
      const endTime = Date.now();
      const timeElapsed = endTime - startTime;
      if (timeElapsed < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - timeElapsed));
      }
      setCurrentBook(data);
      form.setFieldsValue(data);
      setVisible(true);
    } catch (error) {
      console.error('获取书籍详情失败:', error);
      console.error('错误详情:', error.response?.data);
      MessagePlugin.error('获取书籍详情失败');
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (row) => {
    try {
      await request.delete(`/books/${row._id}`);
      MessagePlugin.success('删除成功');
      fetchBooks({ current, pageSize });
    } catch (error) {
      console.error('删除书籍失败:', error);
      console.error('错误详情:', error.response?.data);
      MessagePlugin.error('删除书籍失败');
    }
  };

  const handleSubmit = async (e) => {
    if (e.validateResult === true) {
      try {
        const data = e.fields;
        console.log('提交的数据:', data);
        if (currentBook) {
          await request.put(`/books/${currentBook._id}`, data);
          MessagePlugin.success('更新成功');
        } else {
          await request.post('/books', data);
          MessagePlugin.success('添加成功');
        }
        setVisible(false);
        fetchBooks({ current, pageSize });
      } catch (error) {
        console.error('保存书籍失败:', error);
        console.error('错误详情:', error.response?.data);
        console.error('提交的数据:', e.fields);
        MessagePlugin.error('保存书籍失败');
      }
    }
  };

  const handleSearch = async (e) => {
    if (e.validateResult === true) {
      const { title, subtitle, author, publisher, rating, status, isFavorite } = e.fields;
      setCurrent(1); // 重置页码到第一页
      await fetchBooks({
        current: 1,
        pageSize,
        title,
        subtitle,
        author,
        publisher,
        rating,
        status,
        isFavorite
      });
    }
  };

  const handleReset = async () => {
    searchForm.reset();
    setCurrent(1);
    await fetchBooks({
      current: 1,
      pageSize
    });
  };

  const handleNotes = async (book) => {
    setCurrentBook(book);
    setNotesVisible(true);
    try {
      const response = await request.get(`/books/${book._id}`);
      setNotes(response.notes || []);
    } catch (error) {
      console.error('获取笔记列表失败:', error);
      MessagePlugin.error('获取笔记列表失败');
    }
  };

  const handleAddNote = () => {
    setCurrentNote(null);
    const today = dayjs().format('YYYY-MM-DD');
    setNoteDate(today);
    noteForm.setFieldsValue({
      date: today
    });
    setNoteFormVisible(true);
  };

  const handleEditNote = async (note) => {
    try {
      const noteDetail = await request.get(`/books/${currentBook._id}/notes/${note._id}`);
      setCurrentNote(noteDetail);
      const date = noteDetail.date || dayjs().format('YYYY-MM-DD');
      setNoteDate(date);
      noteForm.setFieldsValue({
        title: noteDetail.title,
        content: noteDetail.content,
        date: date
      });
      setNoteFormVisible(true);
    } catch (error) {
      console.error('获取笔记详情失败:', error);
      MessagePlugin.error('获取笔记详情失败');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await request.delete(`/books/${currentBook._id}/notes/${noteId}`);
      MessagePlugin.success('删除笔记成功');
      // 刷新笔记列表
      const response = await request.get(`/books/${currentBook._id}`);
      setNotes(response.notes || []);
    } catch (error) {
      console.error('删除笔记失败:', error);
      MessagePlugin.error('删除笔记失败');
    }
  };

  const handleNoteSubmit = async (e) => {
    if (e.validateResult === true) {
      try {
        const data = {
          ...e.fields,
          date: noteDate // DatePicker已经返回格式化的日期字符串，不需要再次格式化
        };
        if (currentNote) {
          await request.put(`/books/${currentBook._id}/notes/${currentNote._id}`, data);
          MessagePlugin.success('更新笔记成功');
        } else {
          await request.post(`/books/${currentBook._id}/notes`, data);
          MessagePlugin.success('添加笔记成功');
        }
        setNoteFormVisible(false);
        const response = await request.get(`/books/${currentBook._id}`);
        setNotes(response.notes || []);
      } catch (error) {
        console.error('保存笔记失败:', error);
        MessagePlugin.error('保存笔记失败');
      }
    }
  };

  return (
    <div className="admin-books">
      <div className="header-container">
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <h3>书籍管理</h3>
          </Col>
          <Col>
            <Space>
              <Button icon={<RefreshIcon />} onClick={() => fetchBooks({ current, pageSize })}>
                刷新
              </Button>
              <Button icon={<AddIcon />} theme="primary" onClick={handleAdd}>
                添加书籍
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
              <FormItem label="书名" name="title">
                <Input placeholder="请输入书名" style={{ width: '200px' }} />
              </FormItem>
              <FormItem label="副标题" name="subtitle">
                <Input placeholder="请输入副标题" style={{ width: '200px' }} />
              </FormItem>
              <FormItem label="作者" name="author">
                <Input placeholder="请输入作者" style={{ width: '200px' }} />
              </FormItem>
              <FormItem label="出版社" name="publisher">
                <Input placeholder="请输入出版社" style={{ width: '200px' }} />
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
        data={books}
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
        header={currentBook ? '编辑书籍' : '添加书籍'}
        visible={visible}
        onClose={() => {
          setVisible(false);
          setCurrentBook(null);
          form.reset();
        }}
        destroyOnClose
        onOpened={() => {
          if (currentBook) {
            form.setFieldsValue(currentBook);
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
            label="书名"
            name="title"
            rules={[{ required: true, message: '请输入书名' }]}
          >
            <Input placeholder="请输入书名" />
          </FormItem>
          <FormItem label="副标题" name="subtitle">
            <Input placeholder="请输入副标题" />
          </FormItem>
          <FormItem
            label="作者"
            name="author"
            rules={[{ required: true, message: '请输入作者' }]}
          >
            <Input placeholder="请输入作者" />
          </FormItem>
          <FormItem label="出版社" name="publisher">
            <Input placeholder="请输入出版社" />
          </FormItem>
          <FormItem 
            label="封面" 
            name="cover"
          >
            <Input placeholder="请输入封面图片URL" />
          </FormItem>
          <FormItem label="评分" name="rating">
            <div>
              <Rate allowHalf clearable />
              <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>（评分后再次点击可清除评分）</div>
            </div>
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

      {/* 笔记列表弹窗 */}
      <Dialog
        header={`${currentBook?.title} - 笔记管理`}
        visible={notesVisible}
        onClose={() => {
          setNotesVisible(false);
          setCurrentBook(null);
          setNotes([]);
        }}
        width={800}
        footer={false}
      >
        <div style={{ marginBottom: '16px' }}>
          <Button theme="primary" onClick={handleAddNote}>
            添加笔记
          </Button>
        </div>
        <Table
          data={notes}
          columns={[
            {
              title: '标题',
              colKey: 'title',
              width: 300,
            },
            {
              title: '日期',
              colKey: 'date',
              width: 180,
              cell: ({ row }) => row.date || '-',
            },
            {
              title: '操作',
              colKey: 'operation',
              width: 200,
              cell: ({ row }) => (
                <Space size="small">
                  <Link theme="primary" hover="color" onClick={() => {
                    setCurrentNote(row);
                    setNoteDetailVisible(true);
                  }}>
                    查看内容
                  </Link>
                  <Link theme="primary" hover="color" onClick={() => handleEditNote(row)}>
                    编辑
                  </Link>
                  <Popconfirm content="确定要删除这条笔记吗？" onConfirm={() => handleDeleteNote(row._id)}>
                    <Link theme="danger" hover="color">
                      删除
                    </Link>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
          rowKey="_id"
          pagination={false}
          bordered
        />
      </Dialog>

      {/* 笔记详情弹窗 */}
      <Dialog
        header="笔记详情"
        visible={noteDetailVisible}
        onClose={() => {
          setNoteDetailVisible(false);
          setCurrentNote(null);
        }}
        width={600}
        footer={false}
      >
        {currentNote && (
          <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>标题</div>
              <div>{currentNote.title}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>内容</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{currentNote.content}</div>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>日期</div>
              <div>{currentNote.date}</div>
            </div>
          </div>
        )}
      </Dialog>

      {/* 笔记表单弹窗 */}
      <Dialog
        header={currentNote ? '编辑笔记' : '添加笔记'}
        visible={noteFormVisible}
        onClose={() => {
          setNoteFormVisible(false);
          setCurrentNote(null);
          noteForm.reset();
          const today = dayjs().format('YYYY-MM-DD');
          setNoteDate(today);
          noteForm.setFieldsValue({
            date: today
          });
        }}
        onOpened={() => {
          if (currentNote) {
            const date = currentNote.date || dayjs().format('YYYY-MM-DD');
            setNoteDate(date);
            noteForm.setFieldsValue({
              title: currentNote.title,
              content: currentNote.content,
              date: date
            });
          }
        }}
        width={600}
        footer={false}
      >
        <Form
          form={noteForm}
          onSubmit={handleNoteSubmit}
          labelWidth={80}
          labelAlign="right"
        >
          <FormItem
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入笔记标题' }]}
          >
            <Input placeholder="请输入笔记标题" />
          </FormItem>
          <FormItem
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入笔记内容' }]}
          >
            <Textarea placeholder="请输入笔记内容" rows={6} />
          </FormItem>
          <FormItem
            label="日期"
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <div>
              <DatePicker
                value={noteDate}
                onChange={(value) => {
                  setNoteDate(value);
                  noteForm.setFieldsValue({ date: value });
                }}
                format="YYYY-MM-DD"
              />
            </div>
          </FormItem>
          <FormItem>
            <Button theme="primary" type="submit" block>
              确定
            </Button>
          </FormItem>
        </Form>
      </Dialog>
    </div>
  );
};

export default Books; 