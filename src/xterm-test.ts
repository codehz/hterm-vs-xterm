import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { WebglAddon } from "xterm-addon-webgl"

import { Connection, rendererType, fontFamily, fontSize } from "./utils"

import "xterm/css/xterm.css"
const term = new Terminal({
  rendererType: rendererType === "webgl" ? "canvas" : rendererType,
  cursorBlink: true,
  fontFamily: fontFamily ?? "monospace",
  fontSize
})

document.title = `xterm(${rendererType})`

term.open(document.querySelector("#terminal"))

if (rendererType === "webgl") {
  const gl = new WebglAddon()
  term.loadAddon(gl)
}

const fit = new FitAddon()
term.loadAddon(fit)
fit.fit()

new Connection(con => {
  term.onData(data => {
    con.sendString(data)
  })
  term.onBinary(data => {
    con.sendString(data)
  })
  term.onResize(({cols, rows}) => {
    con.resize(cols, rows)
  })
  term.onTitleChange(title => {
    document.title = `xterm(${rendererType}) - ${title}`
  })
  con.resize(term.cols, term.rows)
  term.focus()
}, data => term.write(new Uint8Array(data)), () => {
  term.dispose()
})

window.onresize = () => {
  fit.fit()
}