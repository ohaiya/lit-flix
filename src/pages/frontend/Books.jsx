import { useState } from 'react';
import { Dialog } from 'tdesign-react';
import BookGroup from './components/books/BookGroup';
import BookDetail from './components/books/BookDetail';
import './Books.less';

const Books = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [visible, setVisible] = useState(false);
  const [expandedNoteIndex, setExpandedNoteIndex] = useState(0);

  // 分离读书笔记数据
  const bookNotes = {
    1: [
      {
        title: '关于幸福的思考',
        content: '叔本华认为幸福是相对的，是痛苦的暂时消除。这一观点让我重新思考了自己对幸福的定义。我们总是在追求更多，却忽略了已经拥有的。正如书中所说，"人类永远在痛苦与无聊之间摇摆"，这句话深深触动了我。',
        date: '2025-03-25 14:30',
      },
      {
        title: '关于孤独的价值',
        content: '叔本华对孤独的讨论非常有启发性。他认为高质量的孤独是智慧的前提，只有在独处时，我们才能真正与自己的思想对话。这让我想起了平时总是被社交媒体和各种信息干扰的生活状态，确实需要更多的独处时间来整理思绪。',
        date: '2025-03-20 20:15',
      },
    ],
    2: [
      {
        title: '人工智能的伦理思考',
        content: '赫拉利对未来科技发展的预测令人深思。特别是关于人工智能可能超越人类智能的讨论，引发了我对技术伦理的思考。如果AI真的获得了自主意识，我们应该如何定义它们的权利和地位？这是一个哲学问题，也是一个即将面临的现实问题。',
        date: '2025-03-26 09:45',
      },
    ],
    3: [
      {
        title: '存在主义的荒诞感',
        content: '默尔索的冷漠和对生活的疏离感，反映了加缪对存在主义的独特诠释。"今天妈妈死了，也许是昨天，我不知道"这句开场白直接展现了主角对生活的态度。读完全书后，我理解了加缪所说的"荒诞"不仅是一种哲学观点，更是一种面对生活的态度。',
        date: '2025-03-22 16:20',
      },
    ],
    4: [
      {
        title: '时间与记忆的魔幻',
        content: '马孔多的百年历史就像一个巨大的隐喻，讲述着拉丁美洲的命运，也讲述着人类的命运。布恩迪亚家族的七代人，重复着相似的名字和相似的命运，仿佛时间是一个循环。这种魔幻现实主义的叙事方式让我着迷，也让我思考历史的重复性和必然性。',
        date: '2025-03-18 21:30',
      },
      {
        title: '孤独的本质',
        content: '书中反复出现的"孤独"主题令人深思。每个角色都以自己的方式经历着孤独，无论是何塞·阿卡迪奥的固执，还是乌尔苏拉的坚韧，或是奥雷里亚诺的天才。马尔克斯似乎在告诉我们，孤独是人类无法逃避的命运，即使在最亲密的关系中也存在。',
        date: '2025-03-10 18:45',
      },
    ],
    5: [
      {
        title: '生命的韧性',
        content: '福贵的一生充满了苦难，但他依然坚强地活着。余华以平实的语言描述了这种坚韧，没有过多的煽情，却让人深受触动。特别是福贵面对家人一个个离去时的态度，既有痛苦，也有一种超越痛苦的平静。这让我明白，活着本身就是一种意义。',
        date: '2025-03-24 11:15',
      },
    ],
    9: [
      {
        title: '认知革命的意义',
        content: '赫拉利对人类认知革命的描述令人印象深刻。他认为语言和虚构能力是人类区别于其他物种的关键，这种能力让我们能够进行大规模协作，创造文明。',
        date: '2025-03-28 15:20',
      },
    ],
    10: [
      {
        title: '宇宙的起源',
        content: '霍金以通俗易懂的语言解释了宇宙的起源和演化。特别是关于黑洞的理论，让我对宇宙有了全新的认识。',
        date: '2025-03-29 10:30',
      },
    ],
    11: [
      {
        title: '系统1与系统2',
        content: '卡尼曼提出的双系统思维模型非常有趣。系统1是快速、直觉的，而系统2是缓慢、理性的。理解这个模型对提高决策质量很有帮助。',
        date: '2025-03-30 14:15',
      },
    ],
    12: [
      {
        title: '建立原则的重要性',
        content: '达利欧强调建立原则的重要性，这些原则可以帮助我们在生活和工作中做出更好的决策。',
        date: '2025-03-31 09:45',
      },
    ],
    13: [
      {
        title: '多元思维模型',
        content: '芒格提倡使用多元思维模型来分析和解决问题，这种思维方式非常实用。',
        date: '2025-04-01 16:20',
      },
    ],
    14: [
      {
        title: '黑天鹅事件的影响',
        content: '塔勒布对黑天鹅事件的论述非常深刻，提醒我们要警惕那些看似不可能但影响巨大的事件。',
        date: '2025-04-02 11:30',
      },
    ],
    15: [
      {
        title: '反脆弱性思维',
        content: '塔勒布提出的反脆弱性概念很有启发性，教会我们如何在不确定性中成长。',
        date: '2025-04-03 15:45',
      },
    ],
    16: [
      {
        title: '地理环境的影响',
        content: '戴蒙德从地理环境的角度解释人类文明的发展，这个视角非常独特。',
        date: '2025-04-04 10:15',
      },
    ],
    17: [
      {
        title: '人性的考验',
        content: '在瘟疫面前，人性的善恶被放大。加缪通过这个故事展现了人类面对灾难时的不同选择。',
        date: '2025-04-05 14:30',
      },
    ],
    18: [
      {
        title: '荒诞与反抗',
        content: '西西弗推石上山的神话象征着人类永恒的困境，但加缪认为，正是在这种反抗中，我们找到了生命的意义。',
        date: '2025-04-06 16:45',
      },
    ],
    19: [
      {
        title: '权力的疯狂',
        content: '通过罗马皇帝卡利古拉的故事，加缪探讨了权力对人性的腐蚀。',
        date: '2025-04-07 09:20',
      },
    ],
    20: [
      {
        title: '道德的困境',
        content: '这部作品通过一个律师的独白，探讨了现代社会中道德的困境。',
        date: '2025-04-08 11:15',
      },
    ],
    21: [
      {
        title: '成长的记忆',
        content: '这是加缪未完成的自传体小说，展现了他早年在阿尔及利亚的生活。',
        date: '2025-04-09 15:30',
      },
    ],
    22: [
      {
        title: '短篇的力量',
        content: '这些短篇小说展现了加缪对人性深刻的洞察力。',
        date: '2025-04-10 13:45',
      },
    ],
    23: [
      {
        title: '反抗的意义',
        content: '在这部哲学论著中，加缪探讨了反抗的本质和意义。',
        date: '2025-04-11 10:20',
      },
    ],
    24: [
      {
        title: '散文的魅力',
        content: '这些散文展现了加缪对生活的热爱和对美的追求。',
        date: '2025-04-12 14:15',
      },
    ],
    25: [
      {
        title: '命运的捉弄',
        content: '这部戏剧探讨了命运和误会的关系，展现了人性的复杂。',
        date: '2025-04-13 16:30',
      },
    ],
    26: [
      {
        title: '爱情的本质',
        content: '这部小说展现了爱情的各种形态，从年轻时的激情到老年时的平静，从理想主义到现实主义。',
        date: '2025-04-14 09:30',
      },
    ],
    27: [
      {
        title: '父爱的伟大',
        content: '许三观通过卖血来维持家庭，这种牺牲精神令人感动。余华用朴实的语言描绘了一个普通父亲的伟大。',
        date: '2025-04-15 11:45',
      },
    ],
    28: [
      {
        title: '时代的变迁',
        content: '通过两兄弟的故事，余华展现了中国社会的巨大变迁，以及人性在时代洪流中的挣扎。',
        date: '2025-04-16 14:20',
      },
    ],
    29: [
      {
        title: '死后的世界',
        content: '余华用魔幻现实主义的手法描绘了一个死后的世界，探讨了生死、亲情等永恒的主题。',
        date: '2025-04-17 16:15',
      },
    ],
    30: [
      {
        title: '寻找的意义',
        content: '这部小说讲述了一个寻找的故事，探讨了执着与放弃、理想与现实的关系。',
        date: '2025-04-18 10:30',
      },
    ],
    31: [
      {
        title: '命运的无常',
        content: '这部小说通过一桩凶杀案，展现了命运的无常和人性的复杂。',
        date: '2025-04-19 13:20',
      },
    ],
    32: [
      {
        title: '初露锋芒',
        content: '这是马尔克斯的第一部小说，虽然还不够成熟，但已经展现了他独特的叙事风格。',
        date: '2025-04-20 15:45',
      },
    ],
    33: [
      {
        title: '短篇的魅力',
        content: '这些短篇小说展现了马尔克斯对人性深刻的洞察力。',
        date: '2025-04-21 09:15',
      },
    ],
  };

  const bookGroups = [
    {
      id: 'favorite',
      title: '收藏',
      books: [
        {
          id: 1,
          title: '人生的智慧',
          subtitle: '叔本华的哲学启示',
          author: '叔本华',
          publisher: '上海三联书店',
          cover: 'https://public.readdy.ai/ai/img_res/d06f75d3d6c20cb238fd0dd888bb918c.jpg',
          rating: 4.8,
        },
        {
          id: 2,
          title: '未来简史',
          subtitle: '从智人到智神',
          author: '尤瓦尔·赫拉利',
          publisher: '中信出版社',
          cover: 'https://public.readdy.ai/ai/img_res/4d7eed46ebee84f3b03dcae0ea7a0473.jpg',
          rating: 4.7,
        },
        {
          id: 9,
          title: '人类简史',
          subtitle: '从动物到上帝',
          author: '尤瓦尔·赫拉利',
          publisher: '中信出版社',
          cover: 'https://public.readdy.ai/ai/img_res/4d7eed46ebee84f3b03dcae0ea7a0473.jpg',
          rating: 4.8,
        },
        {
          id: 10,
          title: '时间简史',
          subtitle: '从大爆炸到黑洞',
          author: '史蒂芬·霍金',
          publisher: '湖南科技出版社',
          cover: 'https://public.readdy.ai/ai/img_res/d06f75d3d6c20cb238fd0dd888bb918c.jpg',
          rating: 4.9,
        },
        {
          id: 11,
          title: '思考，快与慢',
          subtitle: '诺贝尔经济学奖得主丹尼尔·卡尼曼代表作',
          author: '丹尼尔·卡尼曼',
          publisher: '中信出版社',
          cover: 'https://public.readdy.ai/ai/img_res/5833988f44c2b4a911d07c5f17ee816a.jpg',
          rating: 4.7,
        },
        {
          id: 12,
          title: '原则',
          subtitle: '生活和工作',
          author: '瑞·达利欧',
          publisher: '中信出版社',
          cover: 'https://public.readdy.ai/ai/img_res/2aa7e4773fdf4ad02b9b2865bdb1a179.jpg',
          rating: 4.8,
        },
        {
          id: 13,
          title: '穷查理宝典',
          subtitle: '查理·芒格的智慧箴言',
          author: '查理·芒格',
          publisher: '中信出版社',
          cover: 'https://public.readdy.ai/ai/img_res/cddd77844d7a5cb0325a1361be6b5f1c.jpg',
          rating: 4.9,
        },
        {
          id: 14,
          title: '黑天鹅',
          subtitle: '如何应对不可预知的未来',
          author: '纳西姆·塔勒布',
          publisher: '中信出版社',
          cover: 'https://public.readdy.ai/ai/img_res/84f1bf2af01963751e7114e4ab0037d3.jpg',
          rating: 4.6,
        },
        {
          id: 15,
          title: '反脆弱',
          subtitle: '从不确定性中获益',
          author: '纳西姆·塔勒布',
          publisher: '中信出版社',
          cover: 'https://public.readdy.ai/ai/img_res/633b552098b8700e92868056a9618e71.jpg',
          rating: 4.7,
        },
        {
          id: 16,
          title: '枪炮、病菌与钢铁',
          subtitle: '人类社会的命运',
          author: '贾雷德·戴蒙德',
          publisher: '中信出版社',
          cover: 'https://public.readdy.ai/ai/img_res/cc1303a206cc87476e7161b559cee7cc.jpg',
          rating: 4.8,
        },
      ],
    },
    {
      id: 'reading',
      title: '正在看',
      books: [
        {
          id: 3,
          title: '局外人',
          subtitle: '加缪代表作',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/5833988f44c2b4a911d07c5f17ee816a.jpg',
          rating: 4.9,
        },
        {
          id: 17,
          title: '鼠疫',
          subtitle: '加缪代表作',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/d06f75d3d6c20cb238fd0dd888bb918c.jpg',
          rating: 4.8,
        },
        {
          id: 18,
          title: '西西弗神话',
          subtitle: '加缪哲学随笔',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/4d7eed46ebee84f3b03dcae0ea7a0473.jpg',
          rating: 4.7,
        },
        {
          id: 19,
          title: '卡利古拉',
          subtitle: '加缪戏剧作品',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/5833988f44c2b4a911d07c5f17ee816a.jpg',
          rating: 4.6,
        },
        {
          id: 20,
          title: '堕落',
          subtitle: '加缪后期作品',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/2aa7e4773fdf4ad02b9b2865bdb1a179.jpg',
          rating: 4.7,
        },
        {
          id: 21,
          title: '第一个人',
          subtitle: '加缪自传体小说',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/cddd77844d7a5cb0325a1361be6b5f1c.jpg',
          rating: 4.8,
        },
        {
          id: 22,
          title: '流放与王国',
          subtitle: '加缪短篇小说集',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/84f1bf2af01963751e7114e4ab0037d3.jpg',
          rating: 4.6,
        },
        {
          id: 23,
          title: '反抗者',
          subtitle: '加缪哲学论著',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/633b552098b8700e92868056a9618e71.jpg',
          rating: 4.7,
        },
        {
          id: 24,
          title: '婚礼集',
          subtitle: '加缪散文集',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/cc1303a206cc87476e7161b559cee7cc.jpg',
          rating: 4.5,
        },
        {
          id: 25,
          title: '误会',
          subtitle: '加缪戏剧作品',
          author: '阿尔贝·加缪',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/d06f75d3d6c20cb238fd0dd888bb918c.jpg',
          rating: 4.6,
        },
      ],
    },
    {
      id: 'finished',
      title: '已看完',
      books: [
        {
          id: 4,
          title: '百年孤独',
          subtitle: '魔幻现实主义经典',
          author: '加西亚·马尔克斯',
          publisher: '南海出版公司',
          cover: 'https://public.readdy.ai/ai/img_res/2aa7e4773fdf4ad02b9b2865bdb1a179.jpg',
          rating: 4.9,
        },
        {
          id: 5,
          title: '活着',
          subtitle: '',
          author: '余华',
          publisher: '作家出版社',
          cover: 'https://public.readdy.ai/ai/img_res/cddd77844d7a5cb0325a1361be6b5f1c.jpg',
          rating: 4.9,
        },
        {
          id: 26,
          title: '霍乱时期的爱情',
          subtitle: '马尔克斯代表作',
          author: '加西亚·马尔克斯',
          publisher: '南海出版公司',
          cover: 'https://public.readdy.ai/ai/img_res/4d7eed46ebee84f3b03dcae0ea7a0473.jpg',
          rating: 4.8,
        },
        {
          id: 27,
          title: '许三观卖血记',
          subtitle: '余华代表作',
          author: '余华',
          publisher: '作家出版社',
          cover: 'https://public.readdy.ai/ai/img_res/5833988f44c2b4a911d07c5f17ee816a.jpg',
          rating: 4.7,
        },
        {
          id: 28,
          title: '兄弟',
          subtitle: '余华长篇小说',
          author: '余华',
          publisher: '作家出版社',
          cover: 'https://public.readdy.ai/ai/img_res/2aa7e4773fdf4ad02b9b2865bdb1a179.jpg',
          rating: 4.6,
        },
        {
          id: 29,
          title: '第七天',
          subtitle: '余华新作',
          author: '余华',
          publisher: '作家出版社',
          cover: 'https://public.readdy.ai/ai/img_res/cddd77844d7a5cb0325a1361be6b5f1c.jpg',
          rating: 4.5,
        },
        {
          id: 30,
          title: '文城',
          subtitle: '余华新作',
          author: '余华',
          publisher: '作家出版社',
          cover: 'https://public.readdy.ai/ai/img_res/84f1bf2af01963751e7114e4ab0037d3.jpg',
          rating: 4.7,
        },
        {
          id: 31,
          title: '一桩事先张扬的凶杀案',
          subtitle: '马尔克斯代表作',
          author: '加西亚·马尔克斯',
          publisher: '南海出版公司',
          cover: 'https://public.readdy.ai/ai/img_res/633b552098b8700e92868056a9618e71.jpg',
          rating: 4.8,
        },
        {
          id: 32,
          title: '枯枝败叶',
          subtitle: '马尔克斯处女作',
          author: '加西亚·马尔克斯',
          publisher: '南海出版公司',
          cover: 'https://public.readdy.ai/ai/img_res/cc1303a206cc87476e7161b559cee7cc.jpg',
          rating: 4.6,
        },
        {
          id: 33,
          title: '恶时辰',
          subtitle: '马尔克斯短篇小说集',
          author: '加西亚·马尔克斯',
          publisher: '南海出版公司',
          cover: 'https://public.readdy.ai/ai/img_res/d06f75d3d6c20cb238fd0dd888bb918c.jpg',
          rating: 4.7,
        },
      ],
    },
    {
      id: 'wishlist',
      title: '想看',
      books: [
        {
          id: 6,
          title: '解忧杂货店',
          subtitle: '东野圭吾温情小说',
          author: '东野圭吾',
          publisher: '南海出版公司',
          cover: 'https://public.readdy.ai/ai/img_res/84f1bf2af01963751e7114e4ab0037d3.jpg',
          rating: 4.7,
        },
        {
          id: 7,
          title: '围城',
          subtitle: '',
          author: '钱钟书',
          publisher: '人民文学出版社',
          cover: 'https://public.readdy.ai/ai/img_res/633b552098b8700e92868056a9618e71.jpg',
          rating: 4.8,
        },
        {
          id: 8,
          title: '三体',
          subtitle: '中国科幻代表作',
          author: '刘慈欣',
          publisher: '重庆出版社',
          cover: 'https://public.readdy.ai/ai/img_res/cc1303a206cc87476e7161b559cee7cc.jpg',
          rating: 4.9,
        },
        {
          id: 34,
          title: '白夜行',
          subtitle: '东野圭吾代表作',
          author: '东野圭吾',
          publisher: '南海出版公司',
          cover: 'https://public.readdy.ai/ai/img_res/d06f75d3d6c20cb238fd0dd888bb918c.jpg',
          rating: 4.8,
        },
        {
          id: 35,
          title: '嫌疑人X的献身',
          subtitle: '东野圭吾代表作',
          author: '东野圭吾',
          publisher: '南海出版公司',
          cover: 'https://public.readdy.ai/ai/img_res/4d7eed46ebee84f3b03dcae0ea7a0473.jpg',
          rating: 4.9,
        },
        {
          id: 36,
          title: '人间失格',
          subtitle: '太宰治代表作',
          author: '太宰治',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/5833988f44c2b4a911d07c5f17ee816a.jpg',
          rating: 4.7,
        },
        {
          id: 37,
          title: '挪威的森林',
          subtitle: '村上春树代表作',
          author: '村上春树',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/2aa7e4773fdf4ad02b9b2865bdb1a179.jpg',
          rating: 4.8,
        },
        {
          id: 38,
          title: '海边的卡夫卡',
          subtitle: '村上春树代表作',
          author: '村上春树',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/cddd77844d7a5cb0325a1361be6b5f1c.jpg',
          rating: 4.7,
        },
        {
          id: 39,
          title: '1Q84',
          subtitle: '村上春树代表作',
          author: '村上春树',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/84f1bf2af01963751e7114e4ab0037d3.jpg',
          rating: 4.8,
        },
        {
          id: 40,
          title: '且听风吟',
          subtitle: '村上春树处女作',
          author: '村上春树',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/633b552098b8700e92868056a9618e71.jpg',
          rating: 4.6,
        },
        {
          id: 41,
          title: '刺杀骑士团长',
          subtitle: '村上春树新作',
          author: '村上春树',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/cc1303a206cc87476e7161b559cee7cc.jpg',
          rating: 4.7,
        },
        {
          id: 42,
          title: '舞！舞！舞！',
          subtitle: '村上春树代表作',
          author: '村上春树',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/d06f75d3d6c20cb238fd0dd888bb918c.jpg',
          rating: 4.6,
        },
        {
          id: 43,
          title: '奇鸟行状录',
          subtitle: '村上春树代表作',
          author: '村上春树',
          publisher: '上海译文出版社',
          cover: 'https://public.readdy.ai/ai/img_res/4d7eed46ebee84f3b03dcae0ea7a0473.jpg',
          rating: 4.7,
        },
      ],
    },
  ];

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setVisible(true);
    setExpandedNoteIndex(0);
  };

  const handleNoteClick = (index) => {
    setExpandedNoteIndex(index);
  };

  // 获取书籍的读书笔记
  const getBookNotes = (bookId) => {
    return bookNotes[bookId] || [];
  };

  return (
    <div className="books">
      {bookGroups.map((group) => (
        <BookGroup
          key={group.id}
          title={group.title}
          books={group.books}
          onBookClick={handleBookClick}
        />
      ))}

      <Dialog
        visible={visible}
        onClose={() => setVisible(false)}
        width={600}
        footer={false}
      >
        {selectedBook && (
          <BookDetail
            book={selectedBook}
            notes={getBookNotes(selectedBook.id)}
            expandedNoteIndex={expandedNoteIndex}
            onNoteClick={handleNoteClick}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Books; 