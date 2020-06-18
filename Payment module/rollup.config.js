import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import autoPreprocess from 'svelte-preprocess';
import copy from 'rollup-plugin-copy';
import autoprefixer from 'autoprefixer';

//Less has to be version 3.9.0 to work correctly

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/svelte-module.js'
	},
	plugins: [
		svelte({
			dev: !production,
			preprocess: autoPreprocess({
				less: true,
				postcss: {
					plugins: [autoprefixer()]
				}
			}),
			css: css => {
				css.write('public/svelte-module.css');
			}
		}),
		resolve({ browser: true }),
		commonjs(),
		!production && livereload('public'),
		production && terser(),
		copy({
			targets: [{
					src: 'public/svelte-module.css',
					dest: '../CCA-G/styles'
				},
				{
					src: 'public/svelte-module.js',
					dest: '../CCA-G/scripts'
				}
			],
			hook: 'writeBundle'
		})
	],
	watch: {
		clearScreen: false
	}
};
