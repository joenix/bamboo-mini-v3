// Host
export const host = 'https://api.lhdd.club';

// Api
export const api = {
  // 用户
  User: {
    registry: '/users/regist',
    getall: '/users/get_all',
    info: '/users/get_info',
    data: '/users/get_user_info_item',
    login: '/users/login',
    wx_login: '/users/wx_login',
    update: '/users/update',
    // updateInfo: '/users/update_user_info'
    updateInfo: '/users/set_user_info',
    report: '/users/get_user_report',
    getScore: '/users/get_credit_his',
    updateScore: '/users/update_crtedit',
    getReadMark: '/users/get_read_mark'
  },
  // 学分兑换
  Creditshop: {
    getGiftList: '/creditshop/get_all',
    confirmAddress: '/creditshop/buycreditshop'
  },
  // 通用
  Public: {
    upload: '/public/upload',
    get: '/public/download'
  },
  // 权限
  Permission: {
    create: '/permission/create',
    update: '/permission/update',
    getall: '/permission/get_all'
  },
  // 角色
  Role: {
    create: '/role/create',
    update: '/role/update',
    getall: '/role/get_all'
  },
  // 咨询
  Information: {
    create: '/infomation/create',
    update: '/infomation/update',
    getall: '/infomation/get_all',
    detail: '/infomation/get_id'
  },
  // 图书
  Book: {
    create: '/book/create',
    update: '/book/update',
    getall: '/book/get_all',
    getBookInfo: '/book/get_book_info',
    getBookExp: '/book/get_all_exp'
  },
  // 导航
  Banner: {
    create: '/banner/create',
    update: '/banner/update',
    getall: '/banner/get_all'
  },
  // 着陆页
  Landing: {
    create: '/landing/create',
    update: '/landing/update',
    getall: '/landing/get_all'
  },
  // 师资
  Teach: {
    create: '/teach/create',
    update: '/teach/update',
    getall: '/teach/get_all'
  },
  // 机构
  School: {
    create: '/school/create',
    update: '/school/update',
    getall: '/school/get_all'
  },
  // 激活码
  Code: {
    create: '/code/create',
    update: '/code/update',
    getall: '/code/get_all'
  },
  // 物料
  Material: {
    create: '/material/create',
    update: '/material/update',
    getall: '/material/get_all'
  },
  // 贴士
  Tips: {
    create: '/tips/create',
    update: '/tips/update',
    getall: '/tips/get_all'
  },
  // 点读
  Read: {
    books: '/book/wx_get_books',
    avtiveBook: '/code/active',
    records: '/book/get_all_records',
    submit: '/book/book_his'
  },
  // 点读排行
  Rank: {
    getTodayList: '/book/wx_ranks_today',
    getHistoryList: '/book/wx_ranks'
  }
};
