import { basename, join, sep as segmentSeparator } from 'path';
import stylus from 'stylus';
import postcss from 'postcss';
import postcssModules from 'postcss-modules';

const stylesPath = `styles${segmentSeparator}`;

module.exports = {
  extension: 'styl',
  // destExtension: 'css',
  destExtension: 'styl.js',

  transform(content, { src, relative, cwd }) {
    const fileName = basename(relative);
    if (fileName.startsWith('_')) return;

    if (relative.startsWith(stylesPath)) {
      if (relative.substr(stylesPath.length).includes(segmentSeparator)) return;

      return new Promise((resolve, reject) => {
        const style = stylus(content.toString())
          .set('filename', src)
          .set('paths', [join(cwd, 'node_modules')])
          .set('sourcemap', { comment: true });

        style.render((err, css) => {
          if (err) return reject(err);

          resolve({ code: css, map: style.sourcemap });
        });
      });
    }

    return new Promise((resolve, reject) => {
      const stylesPath = join(cwd, 'src', 'styles');
      stylus(content.toString())
        .set('filename', src)
        .set('paths', [stylesPath, join(cwd, 'node_modules')])
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

