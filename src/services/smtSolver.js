var fs = require('fs-extra')
var os = require('os')
var child_process = require('child_process')

// TODO cleanup, also in error case

module.exports = {
  query: function (args, cb) {
    if (args['SMTLIB2'] === undefined) {
      cb('Unsupported query type.')
    }
    fs.mkdtemp(os.tmpdir() + '/smtquery-', (err, dir) => {
      if (err) {
        cb(err)
        return
      }
      var file = dir + '/query.smt2'
      fs.outputFile(file, args['SMTLIB2'], (err) => {
        if (err) {
          cb(err)
          return
        }
        child_process.exec('z3 -smt2 "' + file + '"', (err, stdout, stderr) => {
          // z3 crashes a lot, ignore errors as long as we have some output
          if (stdout) {
            cb(null, stdout)
          }
          // now the regular handler
          if (err) {
            cb(err)
            return
          } else if (stderr) {
             cb(stderr)
          } else {
            cb(null, stdout)
          }
        })
      })
    })
  }
}