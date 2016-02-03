var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin')
var path = require('path');

var config = {
	entry: './src/index.js',
	output: {
		path: './dist/',
		filename: 'index.js'
	},
	module: {
		loaders: [{
			test: /\.scss$/,
			loader: 'style!css!sass?sourceMap'
		}, {
			test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
			loader: "url?limit=10000&mimetype=application/font-woff"
		}, {
			test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
			loader: "url?limit=10000&mimetype=application/font-woff"
		}, {
			test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
			loader: "url?limit=10000&mimetype=application/octet-stream"
		}, {
			test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
			loader: "file"
		}, {
			test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			loader: "url?limit=10000&mimetype=image/svg+xml"
		}, {
			test: /\.html$/,
			loader: 'html?sourceMap'
		}, {
			test: /\.json$/,
			loader: 'json?sourceMap'
		}]
	},
	plugins: [
		new CopyWebpackPlugin([
			{from: 'src/index.html'},
		]),
		new CleanWebpackPlugin(['dist'], {
			verbose: true,
			dry: false
		})
	]
};

module.exports = config;