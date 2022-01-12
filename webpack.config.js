const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: path.join(__dirname, "src/js", "index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "src/dist"),
  },
  devtool: "source-map",
  resolve: {
    fallback: {
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      http: require.resolve("stream-http"),
      crypto: false,
      assert: false,
      url: false,
      https: false,
      os: false,
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};