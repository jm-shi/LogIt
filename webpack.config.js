var path = require('path');

module.exports = {
  entry: ['./public/js/main.js', './public/js/app.js', './public/js/sw.js'],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  mode: 'development'
};
