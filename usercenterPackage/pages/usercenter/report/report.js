// pages/usercenter/suggest/suggest.js
import Message from 'tdesign-miniprogram/message/index';
import dayjs from 'dayjs';
import { post, api } from '../../../../utils/util';
import * as echarts from '../../../../components/ec-canvas/echarts';

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    isDisposed: false,
    // profileData: []
    marks: []
  },
  async getUserReport() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const data = await post(api.User.report, {
        id: userInfo.id,
        day: 30
      });
      this.initChart(data);
    } catch (error) {
      console.log(error);
      this.showMessage('error', '获取数据失败');
    } finally {
      wx.hideLoading();
    }
  },
  initChart(data) {
    // 获取组件
    let ecComponent = null;
    do {
      ecComponent = this.selectComponent('#mychart-dom-line');
    } while (!ecComponent);
    ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });

      this.setData({
        isDisposed: false
      });

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等

      this.setOption(chart, data);

      return chart;
    });
  },
  setOption(chart, data) {
    const xAxisData = data.map((v) => dayjs(v.updatedAt).format('YYYY/MM/DD'));

    const legend = [
      {
        key: 'leftEyes',
        name: '左眼'
      },
      {
        key: 'rightEyes',
        name: '右眼'
      },
      {
        key: 'height',
        name: '身高(cm)'
      },
      {
        key: 'weight',
        name: '体重(kg)'
      }
    ];

    const series = legend.map((v) => {
      return {
        name: v.name,
        type: 'line',
        smooth: true,
        data: data.map((d) => +d[v.key])
      };
    });

    var option = {
      legend: {
        data: legend.map((v) => v.name),
        top: 10,
        left: 'center'
      },
      grid: {
        containLabel: true,
        left: 10,
        right: 10,
        bottom: 50
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series
    };

    chart.setOption(option);
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content
    });
  },
  onLoad() {
    this.getReadMark();
  },
  onHide() {
    if (this.chart) {
      this.chart.dispose();
    }
    this.setData({
      isDisposed: true
    });
  },
  onTabsChange(event) {
    const tab = event.detail.value;
    if (tab === '1') {
      this.getUserReport();
    } else {
      this.getReadMark();
    }
  },
  async getReadMark() {
    const userInfo = wx.getStorageSync('userInfo');
    const data = await post(api.Book.getBookExp, {
      userid: userInfo.id
    });
    console.log(data);
    this.setData({ marks: data });
  }
});
