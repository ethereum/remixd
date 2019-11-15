const fs = require('fs-extra')
const path = require('path')
const isbinaryfile = require('isbinaryfile')
const pathModule = require('path')

module.exports = {
  absolutePath: absolutePath,
  relativePath: relativePath,
  walkSync: walkSync,
  resolveDirectory: resolveDirectory,
  validateRequest,
  validateCommand,
  isRealPath,
  message
}

/**
 * Validate that command can be run by service
 * @param cmd
 * @param regex
 */
function validateCommand (cmd, regex) {
  if (!cmd.match(regex)) { //git then space and then everything else
    throw new Error('Invalid command for service!')
  }
}

/**
 * Origin has to be in the list of whitelisted!
 * @param request
 */
function validateRequest (request) {
  if (process.env.ORIGINS.indexOf(request.headers.origin) === -1) {
    throw new Error('CORS invalid!')
  }
}

/**
 * returns the absolute path of the given @arg path
 *
 * @param {String} path - relative path (Unix style which is the one used by Remix IDE)
 * @param {String} sharedFolder - absolute shared path. platform dependent representation.
 * @return {String} platform dependent absolute path (/home/user1/.../... for unix, c:\user\...\... for windows)
 */
function absolutePath (path, sharedFolder) {
  path = normalizePath(path)
  if (path.indexOf(sharedFolder) !== 0) {
    path = pathModule.resolve(sharedFolder, path)
  }
  return path
}

/**
 * return the relative path of the given @arg path
 *
 * @param {String} path - absolute platform dependent path
 * @param {String} sharedFolder - absolute shared path. platform dependent representation
 * @return {String} relative path (Unix style which is the one used by Remix IDE)
 */
function relativePath (path, sharedFolder) {
  let relative = pathModule.relative(sharedFolder, path)
  return normalizePath(relative)
}

function normalizePath (path) {
  if (process.platform === 'win32') {
    return path.replace(/\\/g, '/')
  }
  return path
}

function walkSync (dir, filelist, sharedFolder) {
  let files = fs.readdirSync(dir)
  filelist = filelist || {}
  files.forEach(function (file) {
    let subElement = path.join(dir, file)
    if (!fs.lstatSync(subElement).isSymbolicLink()) {
      if (fs.statSync(subElement).isDirectory()) {
        filelist = walkSync(subElement, filelist, sharedFolder)
      } else {
        let relative = relativePath(subElement, sharedFolder)
        filelist[relative] = isbinaryfile.sync(subElement)
      }
    }
  })
  return filelist
}

function resolveDirectory (dir, sharedFolder) {
  let ret = {}
  let files = fs.readdirSync(dir)
  files.forEach(function (file) {
    let subElement = path.join(dir, file)
    if (!fs.lstatSync(subElement).isSymbolicLink()) {
      let relative = relativePath(subElement, sharedFolder)
      ret[relative] = { isDirectory: fs.statSync(subElement).isDirectory() }
    }
  })
  return ret
}

function isRealPath (path, cb) {
  let realPath = fs.realpathSync(path)
  let isRealPath = path === realPath
  let mes = '[WARN] Symbolic link modification not allowed : ' + path + ' | ' + realPath
  if (!isRealPath) {
    console.log('\x1b[33m%s\x1b[0m', mes)
  }
  if (cb && !isRealPath) cb(mes)
  return isRealPath
}

function message (name, value) {
  return JSON.stringify({type: 'notification', scope: 'sharedfolder', name: name, value: value})
}
