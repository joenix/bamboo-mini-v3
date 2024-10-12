Component({
  properties: {
    name: {
      type: String,
      value: ''
    },
    content: {
      type: Array,
      value: []
    }
  },

  lifetimes: {
    created() {
      // console.log('on created');
    },
    attached() {
      console.log('on attached');
    },
    ready() {
      const { name, content } = this.data;

      content.forEach((item, index) => {
        this.triggerEvent('sync', { name, item, index });
      });
    }
  }
});
