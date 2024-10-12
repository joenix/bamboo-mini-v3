Component({
  properties: {
    count: {
      type: Number,
      value: 2
    },
    color: {
      type: Number,
      value: 444
    }
  },
  observers: {
    count(value) {
      console.log('属性变化：', value);
    }
  }
});
