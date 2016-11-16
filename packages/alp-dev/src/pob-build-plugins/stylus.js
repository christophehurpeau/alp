import readFile from 'pob-babel/lib/utils/readFile';
import writeFile from 'pob-babel/lib/utils/writeFile';
import { basename, join, sep as segmentSeparator } from 'path';
import glob from 'glob';
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
        glob('src/styles/!(_)*.styl', (err, matches) => {
          if (err) return reject(err);

          Promise.all(matches.map((match) => (
            readFile(match).then((content) => {
              if (err) return reject(err);

              const style = stylus(content.toString())
                .set('filename', src)
                .set('paths', ['node_modules'])
                .set('sourcemap', { comment: true });

              style.render((err, css) => {
                if (err) return reject(err);

                const cssPath = `public/${match.slice('src/styles/'.length, -'styl'.length)}css`;

                Promise.all([
                  writeFile(cssPath, css),
                  writeFile(`${cssPath}.map`, style.sourcemap),
                ]).then(resolve).catch(reject);
              });
            })
          ))).then(resolve).catch(reject);
        });
      });
    }

    return new Promise((resolve, reject) => {
      const stylesPath = join(cwd, 'src', 'styles');
      stylus(content.toString())
        .set('filename', src)
        .set('paths', [stylesPath, 'node_modules'])
        .set('sourcemap', { comment: true })
        .render((err, css) => {
          if (err) return reject(err);

          postcss([
            postcssModules({
              generateScopedName: '[name]__[local]__[hash:base64:5]',
              getJSON(cssFileName, json) {
                resolve({
                  code: `module.exports = ${JSON.stringify(json)}`,
                    // + `/*\n${css.replace(/\*\//g, '*-/')}*/`,
                });
              },
            }),
          ]).process(css, { from: src })
            .catch(err => reject(err));
        });
    });
  },
};

