import { lib, hterm } from "hterm-esm"
import { Connection, fontFamily, fontSize } from "./utils"

lib.init(() => {
  hterm.defaultStorage = new lib.Storage.Memory()

  const term = new hterm.Terminal()
  fontFamily && term.getPrefs().set("font-family", fontFamily)
  term.getPrefs().set("font-size", fontSize)
  term.decorate(document.querySelector("#terminal"));
  term.installKeyboard();
  term.setWindowTitle = (title) => {
    document.title = `hterm - ${title}`
  }

  new Connection(con => {
    console.log("!")
    const io = term.io.push();
    io.onVTKeystroke = io.sendString = data => con.sendString(data)
    io.onTerminalResize = (cols, rows) => con.resize(cols, rows)
    con.resize(term.screenSize.width, term.screenSize.height)
  }, data => term.io.writeUTF8(data), () => {
    term.io.pop()
  })
}, str => console.log(str));