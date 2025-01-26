const getWxml = function (conetnt) {
  return `
    <view class="container" >
      <view class="main">
        <image class="img1" src="https://oss.lhdd.club/ui/split1.png"></image>
        <text class="content">${conetnt}</text>
        <image class="img2" src="https://oss.lhdd.club/ui/tips-detail.png"></image>
        <text class="share">微信搜索【仇氏点读】小程序</text>
      </view>
    </view>
  `;
};

const getStyle = function (res) {
  const [rect] = res;

  const mainPaddingX = 24;
  const mainPaddingTop = 56;
  const mainPaddingBottom = 212;
  const mainHeight = mainPaddingTop + rect.height + mainPaddingBottom;
  const mainWidth = rect.width + mainPaddingX * 2;
  const rootWidth = mainWidth + 12;
  const rootHeight = mainHeight + 12;

  const style = {
    container: {
      width: mainWidth + 2,
      height: mainHeight + 2,
      backgroundColor: '#E1D5BD',
      padding: 1,
      borderRadius: 2
    },
    main: {
      position: 'relative',
      width: mainWidth,
      height: mainHeight,
      backgroundColor: '#FAF8F4',
      paddingLeft: mainPaddingX,
      paddingRight: mainPaddingX,
      paddingTop: mainPaddingTop,
      paddingBottom: mainPaddingBottom
    },
    content: {
      width: rect.width,
      height: rect.height,
      lineHeight: '2.857em',
      color: '#373737',
      fontSize: 14,
      textUnderlineColor: '#DFCAA9',
      textUnderlineWidth: 2
    },
    img1: {
      position: 'absolute',
      width: rect.width,
      height: 8,
      left: mainPaddingX,
      top: (mainPaddingTop - 8) / 2
    },
    img2: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 205,
      height: 195
    },
    share: {
      position: 'absolute',
      bottom: 0,
      left: mainPaddingX,
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
