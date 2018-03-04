var h = require('hyperscript')
var rawJSON = require('./json')
var isMsg = require('ssb-ref').isMsg
exports.needs = {
  sbot: { get: 'first' },
  identity: { unbox: 'first' }
}

exports.gives = {
  app: { view: true },
  message: { action: true }
}

exports.create = function (api) {
  console.log('CREATE RAW VIEW')
  return { app: { view: function (src) {
      console.log("RAW?", src)
      if(src.substring(0,4) !== 'raw/') return
      var id = src.substring(4)
      if(!isMsg(id)) return
      var wrapper = h('span')
      api.sbot.get(id, function (err, msg) {
        wrapper.appendChild(h('pre', rawJSON(err || api.identity.unbox({key: id, value: msg}))))
      })

      wrapper.id = src
      return wrapper
    }},
    message: { action: function (msg) {
      return h('a', {href: 'raw/'+msg.key}, 'raw')
    }}
  }
}












