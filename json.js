var h = require('hyperscript')
var ref = require('ssb-ref')
module.exports = function rawJSON (obj) {
  return JSON.stringify(obj, null, 2)
      .split(/([%@&][a-zA-Z0-9\/\+]{43}=*\.[\w]+)/)
      .map(function (e) {
        if(ref.isMsg(e) || ref.isFeed(e) || ref.isBlob(e)) {
          return h('a', {href: e}, e)
        }
        return e
      })
}









