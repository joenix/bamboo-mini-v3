{
  /* <image class="img" width="100px" height="100px" src="${info.photo}" mode="aspectFill"></image> */
}
const getWxml = function (info) {
  return `
    <view class="container">
      <view class="main">
        <view class="content">
          <view class="row"><text class="text">身高：${info.height}(CM)</text></view>
          <view class="row"><text class="text">体重：${info.weight}(KG)</text></view>
          <view class="row"><text class="text">左眼视力：${info.leftEyes}</text></view>
          <view class="row"><text class="text">右眼视力：${info.rightEyes}</text></view>
          <view class="row"><text class="text">更新时间：${info.updateTime}</text></view>
          <text class="share">微信搜索【仇氏点读】小程序</text>
        </view>
        <view class="imgBox">
          <image class="img" src="${info.photo}" mode="aspectFill"></image>
        </view>
      </view>
    </view>
  `;
};

const getStyle = function (res) {
  const [rect] = res;

  const rootWidth = rect.width;
  const rootHeight = rect.height;

  const style = {
    container: {
      position: 'relative',
      height: rootHeight + 20,
      backgroundColor: '#FFF',
      paddingTop: 16,
      paddingBottom: 16,
      width: rootWidth
    },
    imgBox: {
      width: 100,
      height: 100,
      backgroundColor: '#F00',
      marginLeft: 70
    },
    img: {
      width: 100,
      height: 100
    },
    content: {
      position: 'absolute',
      left: 0,
      top: 110,
      width: rootWidth,
      textAlign: 'center'
    },
    text: {
      fontSize: 14,
      color: '#333',
      height: 24,
      lineHeight: 24,
      textUnderlineColor: 'transparent'
    },
    share: {
      marginTop: 16,
      width: rect.width,
      height: 20,
      textAlign: 'center',
      fontSize: 10,
      color: '#999',
      textUnderlineWidth: 0,
      textUnderlineColor: 'transparent'
    }
  };

  return {
    canvasWidth: rootWidth,
    canvasHeight: rootHeight + 20,
    style
  };
};

module.exports = {
  getWxml,
  getStyle
};
