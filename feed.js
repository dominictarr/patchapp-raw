var pull = require('pull-stream')
var ref = require('ssb-ref')
var More = require('pull-more')
var HyperMoreStream = require('hyperloadmore/stream')

exports.needs = {
  sbot: { createLogStream: 'first' },
}

exports.gives = {
  app: { menu: true, view: true }
}

var rawJSON = require('./json')

exports.create = function (api) {
  return {
    app: {
      view: function (src) {
        if(src !== 'raw') return

        var content = document.createElement('div')
        content.classname = 'content'

        function createStream (opts) {
          return pull(
            More(api.sbot.createLogStream, opts),
            pull.filter(function (data) {
              return 'string' === typeof data.value.content.text
            }),
            pull.map(function (msg) {
              var pre = document.createElement('pre')
              pre.classname = 'raw__json'
              pre.textContent = rawJSON(msg)
              return pre
            })
          )
        }

        pull(
          createStream({old: false, limit: 10}),
          HyperMoreStream.top(content)
        )

        pull(
          createStream({reverse: true, live: false, limit: 10}),
          HyperMoreStream.bottom(content)
        )

        return content

      },
      menu: function () {
        return 'raw'
      }
    }
  }
}



