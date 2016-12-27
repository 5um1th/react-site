const fs = require('fs')
const matter = require('gray-matter')

var filename = process.env.FILEPATH
var raw = fs.readFileSync(filename, 'utf-8')
var content
try {
  content = require(filename)
} catch (e) {
  content = raw
}
var ext = filename.split('.').slice(-1)[0]

var meta = {
  filename: filename,
  pathname: process.env.PATHNAME
}

var contentpath = process.env.CONTENTPATH

switch (ext) {
  case 'txt':
  case 'html':
  case 'md':
  case 'markdown':
    var p
    try {
      p = matter(content)
    } catch (e) {
      p = {content: '', data: {}}
    }
    console.log(JSON.stringify(Object.assign(meta, p.data)))
    fs.writeFileSync(contentpath, `module.exports = ${JSON.stringify(p.content)}`, 'utf-8')
    break
  case 'js':
  case 'es':
  case 'es6':
  case 'jsx':
  case 'react':
    console.log(JSON.stringify(Object.assign(meta, content.meta)))
    fs.writeFileSync(contentpath, raw, 'utf-8')
    break
  default:
    console.log(JSON.stringify(meta))
    fs.writeFileSync(contentpath, `module.exports = ${JSON.stringify(raw)}`, 'utf-8')
}
