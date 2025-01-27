const getWxml = function (info) {
  return `
    <view class="container">
      <view class="main">
        <image class="img" src="${info.photo}"></image>
        <view class="content">
          <view class="row"><text class="text">身高：${info.height}(CM)</text></view>
          <view class="row"><text class="text">体重：${info.weight}(KG)</text></view>
          <view class="row"><text class="text">左眼视力：${info.leftEyes}</text></view>
          <view class="row"><text class="text">右眼视力：${info.rightEyes}</text></view>
          <view class="row"><text>更新时间：${info.updateTime}</text></view>
        </view>
      </view>
      <text class="share">微信搜索【仇氏点读】小程序</text>
    </view>
  `;
};

const getStyle = function (res) {
  const [rect] = res;
  console.log(rect);
  const rootWidth = rect.width;
  const rootHeight = rect.height;

  const style = {
    container: {
      position: 'relative',
      textAlign: 'center',
      padding: 32,
      width: rootWidth,
      height: rootHeight
    },
    img: {
      width: 100,
      height: 100
    },
    content: {
      marginBottom: 10,
      marginTop: 10,
      width: 240,
      height: 100,
      backgroundColor: 'red'
    },
    row: {
      width: 240,
      height: 20
    },
    text: {
      fontSize: 14,
      color: '#333',
      height: 20,
      lineHeight: 20,
      width: 240
    },
    share: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: rect.width,
      height: 20,
      textAlign: 'center',
      fontSize: 12,
      color: '#999',
      textUnderlineWidth: 0,
      textUnderlineColor: 'transparent'
    }
  };

  return {
    canvasWidth: rootWidth,
    canvasHeight: rootHeight,
    style
  };
};

module.exports = {
  getWxml,
  getStyle
};
