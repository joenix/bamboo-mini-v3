Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    description: {
      type: String,
      value: '暂无数据'
    },
    image: {
      type: String,
      value: ''
    }
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    // 这里是一个自定义方法
    customMethod() {}
  }
});
