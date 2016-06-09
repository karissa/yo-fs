var relative = require('relative-date')
var pretty = require('prettier-bytes')
var path = require('path')
var yo = require('yo-yo')

module.exports = Tree

function Tree (root, entries, onclick) {
  var visible = []
  var roots = split(root)
  entries.forEach(function (entry) {
    var paths = split(entry.name)
    if (paths.length === (roots.length + 1)) {
      var isChild = true
      for (var i = 0; i < roots.length && isChild === true; i++) {
        isChild = (paths[i] === roots[i])
      }
      if (isChild === true) visible.push(entry)
    }
  })


  var el = yo`<div id="yo-fs">
    <ul id="file-widget">
      ${backRow()}
      ${visible.map(function (entry) {
        return row(entry)
      })}
      </ul>
  </div>`

  function backButton (ev) {
    var entry = {
      name: path.dirname(root),
      type: 'directory'
    }
    onclick(ev, entry)
    yo.update(el, Tree(entry.name, entries, onclick))
  }
  function backRow () {
    if (root === '/') return
    return yo`<li class='entry-back' onclick=${backButton}>
      <a href='javascript:void(0)'>
        <span class="name">..</span>
      </a>
    </li>`
  }
  return el

  function row (entry) {
    function click (e) {
      onclick(e, entry)
      if (entry.type === 'directory') yo.update(el, Tree(entry.name, entries, onclick))
    }
    return yo`<li class='entry ${entry.type}' onclick=${click}>
      <a href="javascript:void(0)">
        <span class="name">${path.basename(entry.name)}</span>
        <span class="modified">${entry.mtime ? relative(entry.mtime) : ''}</span>
        <span class="size">${pretty(entry.length)}</span>
      </a>
    </li>`
  }
}


function split (pathName) {
  var fileArray = pathName.split('/')
  while (fileArray[0] === '' || fileArray[0] === '.') {
    fileArray.shift() // remove empty items from the beginning
  }
  while (fileArray[fileArray.length - 1] === '') {
    fileArray.pop() // remove empty items from the end
  }
  return fileArray
}
