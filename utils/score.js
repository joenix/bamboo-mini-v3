import { post, api } from './util';

export const UpdateType = {
  Login: 'Login',
  Read: 'Read',
  Sign: 'Sign'
};

const ScoreType = {
  [UpdateType.Login]: { content: '登录', credit: 5 },
  [UpdateType.Read]: { content: '点读', credit: 20 },
  [UpdateType.Sign]: { content: '签到', credit: 10 }
};

export default updateScoreAction = async (type) => {
  const userInfo = wx.getStorageSync('userInfo');
  await post(api.User.updateScore, {
    userid: userInfo.id,
    ...ScoreType[type]
  });
};
