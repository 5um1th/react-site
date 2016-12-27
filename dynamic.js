var React = require('react')
var render = require('react-dom').render
var e = React.createElement
var createHistory = require('history').createBrowserHistory
var amd = require('micro-amd')()
var catchLinks = require('catch-links')

window.define = amd.define.bind(amd)
window.define.amd = true

var allpages = JSON.parse(process.env.ALLPAGESMETA)

function standaloneURL (location) {
  if (location.pathname === '/') {
    return '/index.js'
  } else {
    return location.pathname.slice(0, -1) + '.js'
  }
}

var history = createHistory({
  basename: ''
})

var Main = React.createClass({
  displayName: 'ReactSiteMain',

  getInitialState () {
    return {
      location: {
        pathname: this.props.pathname,
        search: ''
      },
      page: this.props.page
    }
  },

  componentDidMount () {
    var self = this

    history.listen(function (location) {
      console.log('> navigating', location.pathname)
      amd.require([standaloneURL(location)], function (page) {
        self.setState({
          location: location,
          page: page,
          meta: page.meta,
          pages: allpages
        })
      })
    })

    catchLinks(document.body, function (href) {
      history.push(href)
    })
  },

  render () {
    var Body = require(process.env.BODY)
    var makeHelmet = require(process.env.HELMET)

    return e(Body, {
      location: this.props.location
    },
      makeHelmet(this.state),
      e(this.state.page, this.state)
    )
  }
})

amd.require([standaloneURL(window.location)], function (page) {
  render(React.createElement(Main, {
    page: page,
    meta: page.meta,
    pages: allpages,
    pathname: window.location.pathname
  }), document.getElementById('react-mount'))
})
