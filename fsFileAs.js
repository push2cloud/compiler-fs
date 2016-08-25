const _ = require('lodash');
const path = require('path');
const exec = require('shelljs').exec;
const debug = require('debug')('push2cloud-compiler-fs:fsFileAs');

const debugCb = (debugFn, cb) => {
  return (err, result) => {
    if (err) {
      debugFn('error', `Errorcode: ${err}`, result);
    } else {
      debugFn('success', result);
    }
    return cb(err, result);
  };
};


const cmd = (
  sourceFile
, targetFile
) => (
  `cp ${sourceFile} ${targetFile}`
);

const fsFile = _.curry((
  ctx
, cb
) => {
  const targetFile = ctx.targetFile || ctx.file;
  const sourceFile = path.join(!path.isAbsolute(ctx.url || '') ? ctx.rootDir || '' : '', ctx.url || '', ctx.file);
  const command = cmd(sourceFile, targetFile);
  debug('starting command', command);
  exec(command, {silent: false, async: true}, debugCb(debug, cb));
});

module.exports = fsFile;
