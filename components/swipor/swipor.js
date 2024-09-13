Component({
  properties: {
    // 这里可以定义一些传入的参数，比如自定义内容
    content: {
      type: Array,
      value: [],
      observer(value) {
        console.log(333, value);
      }
    }
  },
  data: {
    // Code by Joenix
    current: 1,
    link: null
  },
  methods: {
    onSwiporChange(e) {
      const { current } = e.detail;

      this.setData({
        current,
        link: this.data.content[current]
      });
    },

    onSwiporTransition(e) {}
  }
});
