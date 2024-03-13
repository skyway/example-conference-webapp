/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { dependencies } = require("./package");

const webpack = require("webpack");
const dotenv = require("dotenv-flow");
const env = dotenv.config().parsed;

const rootPath = path.resolve(".");

const copyPlugin = require("copy-webpack-plugin");

const config = {
  mode: "development",
  devtool: false,
  context: rootPath,
  entry: {
    index: "./src/index/main.tsx",
    conference: "./src/conference/main.tsx",
  },
  output: {
    path: `${rootPath}/dist`,
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".json", ".js", ".ts", ".tsx"],
  },
  plugins: [
    // .envの設定値はbuild時に埋め込まれるので、アプリケーションのシークレットキーなどを.envに記載する際は注意
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(env),
    }),
    new copyPlugin({
      patterns: [{ from: `${rootPath}/public`, to: `${rootPath}/dist` }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: ["babel-loader"],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: new RegExp(Object.keys(dependencies).join("|")),
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  devServer: {
    static: {
      directory: `${rootPath}/public`,
      watch: true,
    },
    host: "0.0.0.0",
    port: 9000,
  },
};

module.exports = config;
