import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: "./src/index.js", // Entry point for the application
  output: {
    filename: "main.js", // Output file name
    path: path.resolve("dist"), // Output directory
    clean: true, // Clean the output directory before building
  },
  devtool: "inline-source-map", // Source maps for easier debugging
  devServer: {
    static: "./dist", // Serve files from the "dist" directory
    open: true, // Automatically open the browser
    hot: true, // Enable hot module replacement
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i, // Process CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Process image files
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Use the existing HTML file as a template
      filename: "index.html", // Output HTML file name
    }),
  ],
  mode: "development", // Default mode
};
