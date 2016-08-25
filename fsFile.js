const _ = require('lodash');
const exec = require('shelljs').exec;
const path = require('path');
const debug = require('debug')('push2cloud-compiler-fs:fsFile');

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
, targetDir
, file
) => (
  `if [ ! -d ${targetDir}/$( dirname ${file} ) ];
    then
    mkdir -p ${targetDir}/$( dirname ${file} );
  fi;
  cp ${sourceFile} ${targetDir}/$( dirname ${file} )/`
);

const fsFile = _.curry((
  ctx
, cb
) => {
  const targetDir = ctx.target;
  const sourceFile = path.join(!path.isAbsolute(ctx.url || '') ? ctx.rootDir || '' : '', ctx.url || '', ctx.file);
  const command = cmd(sourceFile, targetDir, ctx.file);
  debug('starting command', command);
  exec(command, {silent: false, async: true}, debugCb(debug, cb));
});

module.exports = fsFile;
