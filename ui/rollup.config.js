import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import { config } from "dotenv";
import replace from "@rollup/plugin-replace";
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    replace({
      preventAssignment: true,
      // stringify the object
      __myapp: JSON.stringify({
        env: {
          isProd: production,
          ...config().parsed,
          API: process.env.API,
          API2: process.env.API2,
          MAX_SCAN_SIZE: process.env.MAX_SCAN_SIZE,
          DEPLOYMENTS_URL: process.env.DEPLOYMENTS_URL
        },
      }),
    }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
      preprocess: autoPreprocess(),
    }),
    css({ output: 'bundle.css' }),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        "./node_modules/export-to-csv/build/index.js": ["ExportToCsv"],
      },
    }),
    copy({
      targets: [
        { src: './node_modules/@fortawesome/fontawesome-free/webfonts/**/*', dest: 'public/build/webfonts' },
      ]
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload({
      watch: 'public',
      delay: 300
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        });
      }
    },
  };
}
