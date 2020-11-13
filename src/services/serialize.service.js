const xss = require('xss');

const SerializeService = {
  serializeSomething(thing) {
    return {
      thing_name: xss(thing.thing_name),
      description: xss(thing.description)
    };
  },

  serializeData(table, data) {
    switch (table) {
      case 'something':
        return data.map(this.serializeSomething);

      default:
        return { message: 'Serialization failed' };
    }
  }
};

module.exports = SerializeService;
