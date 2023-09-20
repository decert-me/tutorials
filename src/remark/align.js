const visit = require('unist-util-visit');

const plugin = (options) => {
  const transformer = async (ast) => {
    visit(ast, 'math', (node) => {
        let value = node.value.replace(/eqnarray\*/g, "matrix");
        value = node.value.replace(/eqnarray/g, "matrix");
        value = node.value.replace(/align\*/g, "matrix");
        value = node.value.replace(/align/g, "matrix");
        node.data.hChildren[0].value = value;
        node.value = value;
    });
  };
  return transformer;
};

module.exports = plugin;