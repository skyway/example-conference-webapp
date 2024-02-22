/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { dependencies } = require("./package");

const webpack = require("webpack");
const dotenv = require("dotenv-flow");
const env = dotenv.config().parsed;

const rootPath = path.resolve(".");

const config = {
  mode: "development",
  devtool: false,
  context: rootPath,
  entry: {
    index: "./src/index/main.tsx",
    conf: "./src/conf/main.tsx",
  },
  output: {
    path: `${rootPath}/docs`,
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
      directory: `${rootPath}/docs`,
      watch: true,
    },
    host: "0.0.0.0",
    port: 9000,
  },
};

module.exports = config;
