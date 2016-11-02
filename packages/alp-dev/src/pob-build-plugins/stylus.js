import { dirname, basename } from 'path';
import stylus from 'stylus';
import postcss from 'postcss';
import postcssModules from 'postcss-modules';

module.exports = {
  extension: 'styl',
  // destExtension: 'css',
  destExtension: 'styl.js',

  transform(content, { src, relative }) {
    const fileName = basename(relative);
    if (fileName.startsWith('_')) return;
    return new Promise((resolve, reject) => {
      stylus(content.toString())
        .set('filename', src)
        .set('paths', [dirname(src), 'node_modules'])
        .set('sourcemap', { comment: true })
        .render((err, css) => {
          if (err) return reject(err);

          postcss([
            postcssModules({
              generateScopedName: '[name]__[local]___[hash:base64:5]',
              getJSON(cssFileName, json) {
                resolve({ code: `module.exports = ${JSON.stringify(json)}` });
              },
            }),
          ]).process(css, { from: src })
            .catch(err => reject(err));
        });
    });
  },
};


// const style = stylus(content.toString())
//   .set('filename', src)
//   .set('sourcemap', { comment: true });
//
// style.render((err, css) => {
//   if (err) return reject(err);
//
//   resolve({ code: css, map: style.sourcemap });
// });
