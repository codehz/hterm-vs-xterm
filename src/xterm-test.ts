import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { WebglAddon } from "xterm-addon-webgl"

import { Connection, rendererType, fontFamily, fontSize } from "./utils"

import "xterm/css/xterm.css"
const term = new Terminal({
  rendererType: rendererType === "webgl" ? undefined : rendererType,
  cursorBlink: true,
  fontFamily: fontFamily ?? "monospace",
  fontSize
})

if (rendererType === "webgl") {
  const gl = new WebglAddon()
  term.loadAddon(gl)
}

const fit = new FitAddon()
term.loadAddon(fit)

requestAnimationFrame(() => fit.fit())

term.open(document.querySelector("#terminal"))

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
  con.resize(term.cols, term.rows)
  term.focus()
}, data => term.write(new Uint8Array(data)), () => {
  term.dispose()
})

window.onresize = () => {
  fit.fit()
}