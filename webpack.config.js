const path = require('path');

module.exports = {
  entry: './dist/map.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/javascripts/')
  }
};
