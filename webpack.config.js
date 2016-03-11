'use strict';

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');

function factory(version) {
	return {
		entry: './src/livedate.js',
		output: {
			path: path.join(__dirname, 'build'),
			filename: 'livedate.js',
			library: 'livedate',
			libraryTarget: 'umd' //var/umd
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader'
				}
			]
		},
		plugins: (function() {
			var plugins = [];
				plugins.push(new webpack.optimize.DedupePlugin());
				plugins.push(new webpack.optimize.UglifyJsPlugin({
					sourcemap: true,
					compress: {
						unsafe: true,
						warnings: false
					},
					mangler: {
						screw_ie8: true
					}
				}));
			
			plugins.push(function() {
				this.plugin('done', function(stats) {
					fs.writeFileSync(
						path.join(__dirname, 'build', filename + '.js.stats.json'),
						JSON.stringify(stats.toJson()));
				});
			});
			return plugins;
		})(),
		devtool: 'module-source-map'
	}
}

module.exports = [
	factory('full'),
];
