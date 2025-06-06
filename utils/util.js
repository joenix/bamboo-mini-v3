import dayjs from 'dayjs';

// Use UTC from DayJS
import utc from './dayjs_utc';
// Use Timezone from DayJS
import timezone from './dayjs_timezone';

import { host, api } from './api';
import lunar from './lunar';

// Add Extension for DayJS
dayjs.extend(utc);
dayjs.extend(timezone);

const formatTime = (date, template) => dayjs(date).format(template);
const utcFormatTime = (date, template) => dayjs(date).utc(0).format(template);

/**
 * 格式化价格数额为字符串
 * 可对小数部分进行填充，默认不填充
 * @param price 价格数额，以分为单位!
 * @param fill 是否填充小数部分 0-不填充 1-填充第一位小数 2-填充两位小数
 */
function priceFormat(price, fill = 0) {
  if (isNaN(price) || price === null || price === Infinity) {
    return price;
  }

  let priceFormatValue = Math.round(parseFloat(`${price}`) * 10 ** 8) / 10 ** 8; // 恢复精度丢失
  priceFormatValue = `${Math.ceil(priceFormatValue) / 100}`; // 向上取整，单位转换为元，转换为字符串
  if (fill > 0) {
    // 补充小数位数
    if (priceFormatValue.indexOf('.') === -1) {
      priceFormatValue = `${priceFormatValue}.`;
    }
    const n = fill - priceFormatValue.split('.')[1]?.length;
    for (let i = 0; i < n; i++) {
      priceFormatValue = `${priceFormatValue}0`;
    }
  }
  return priceFormatValue;
}

/**
 * 获取cdn裁剪后链接
 *
 * @param {string} url 基础链接
 * @param {number} width 宽度，单位px
 * @param {number} [height] 可选，高度，不填时与width同值
 */
const cosThumb = (url, width, height = width) => {
  if (url.indexOf('?') > -1) {
    return url;
  }

  if (url.indexOf('http://') === 0) {
    url = url.replace('http://', 'https://');
  }

  return `${url}?imageMogr2/thumbnail/${~~width}x${~~height}`;
};

let systemWidth = 0;
/** 获取系统宽度，为了减少启动消耗所以在函数里边做初始化 */
export const loadSystemWidth = () => {
  if (systemWidth) {
    return systemWidth;
  }

  try {
    ({ screenWidth: systemWidth, pixelRatio } = wx.getSystemInfoSync());
  } catch (e) {
    systemWidth = 0;
  }
  return systemWidth;
};

/**
 * 转换rpx为px
 *
 * @description
 * 什么时候用？
 * - 布局(width: 172rpx)已经写好, 某些组件只接受px作为style或者prop指定
 *
 */
const rpx2px = (rpx, round = false) => {
  loadSystemWidth();

  // px / systemWidth = rpx / 750
  const result = (rpx * systemWidth) / 750;

  if (round) {
    return Math.floor(result);
  }

  return result;
};

/**
 * 手机号码*加密函数
 * @param {string} phone 电话号
 * @returns
 */
const phoneEncryption = (phone) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 内置手机号正则字符串
const innerPhoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';

/**
 * 手机号正则校验
 * @param phone 手机号
 * @param phoneReg 正则字符串
 * @returns true - 校验通过 false - 校验失败
 */
const phoneRegCheck = (phone) => {
  const phoneRegExp = new RegExp(innerPhoneReg);
  return phoneRegExp.test(phone);
};

/**
 * HTTP Request
 * ====== ====== ======
 */
const get = (url, data = {}, options = {}) => {
  const token = wx.getStorageSync('token');

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${host}${url}`,
      method: 'GET',
      data,
      header: options.header || {
        'Content-Type': 'application/json',
        token
      },
      success: (res) => {
        const data = res.data;
        const status = res.status || res.statusCode;

        if (status === 401) {
          // wx.navigateTo({
          //   url: '/pages/login/login'
          // });
          return reject(data.error);
        }
        return status === 200 ? resolve(data.msg || data) : reject(data);
      },
      fail: (error) => reject(error)
    });
  });
};

const post = async (url, data = {}, options = {}) => {
  const token = wx.getStorageSync('token');

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${host}${url}`,
      method: 'POST',
      data,
      header: options.header || {
        'Content-Type': 'application/json',
        token
      },
      success: (res) => {
        const data = res.data;
        const status = res.status || res.statusCode;

        if (status === 401) {
          // wx.navigateTo({
          //   url: '/pages/login/login'
          // });
          return reject(data.error);
        }
        return status === 200 ? resolve(data.msg || data) : reject(data);
      },
      fail: (error) => reject(error)
    });
  });
};

const link2 = async (page, param = {}) => {
  const query = Object.entries(param)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  wx.navigateTo({
    url: `${page}?${query}`
  });
};

const checkToken = () => {
  return wx.getStorageSync('token');
};

// 1. 检测本地存储是否可提交积分
const checkStorageCanScore = () => {
  const { date, ...cans } = wx.getStorageSync('cacheStorage') || {};

  const today = dayjs().format('YYYY-MM-DD');

  if (date !== today) {
    wx.removeStorageSync('cacheStorage');
    wx.setStorageSync('cacheStorage', { date: today });

    // 置空可提交项
    return {};
  }

  return cans || {};
};

// 2. 存储提交数据
const saveStorageScore = (key) => {
  const cacheStorage = wx.getStorageSync('cacheStorage') || {};

  cacheStorage[key] = true;
  wx.setStorageSync('cacheStorage', cacheStorage);
};

const wait = async (time) => {
  return new Promise((resolve) => {
    const out = setTimeout(() => {
      resolve(), clearTimeout(out);
    }, time);
  });
};

const day1 = 1000 * 60 * 60 * 24;
const stream1 = new Date().getTime();

module.exports = {
  dayjs,
  formatTime,
  utcFormatTime,
  lunar,

  priceFormat,
  cosThumb,
  rpx2px,
  phoneEncryption,
  phoneRegCheck,

  host,
  api,

  get,
  post,
  link2,

  checkToken,
  wait,

  day1,
  stream1,

  checkStorageCanScore,
  saveStorageScore
};
