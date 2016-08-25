const _ = require('lodash');
const fsClone = _.curry(require('./fsClone'), 2);
const fsFile = _.curry(require('./fsFile'), 2);
const fsFileAs = _.curry(require('./fsFileAs'), 2);

const fsPlugin = {
  type: 'fs',

  scriptHashes: [],

  getFile(ctx) {
    return fsFile(ctx);
  },

  getFileAs(ctx) {
    return fsFileAs(ctx);
  },

  getSource(app, target) {
    return fsClone(
      { url: app.source.url
      , target: target
      }
    );
  },

  postAction(source, rootDir, repoHash, deployConfig, tools) {
    if (!source.postClone) return tools.executeScript(null);

    const script = `cd ${rootDir}; ${_.template(source.postClone)({ rootDir: rootDir })}`;

    if (_.includes(fsPlugin.scriptHashes, script.toString())) return (next) => next();

    fsPlugin.scriptHashes.push(script.toString());
    return tools.executeScript(script);
  }
};

module.exports = fsPlugin;
