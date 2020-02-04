const params = new URLSearchParams(location.search)

const ssl = params.get("ssl") === "true"
const host = params.get("host")
const port = +params.get("port")
const path = params.get("path")
export const fontFamily = ((x) => x == "" ? undefined : x)(params.get("font-family"))
export const fontSize = +params.get("font-size")

export const url = `${ssl ? "wss" : "ws"}://${host}:${port}/${path}`;

export const rendererType: "dom" | "webgl" | "canvas" = params.get("dom") === ""
  ? "dom"
  : params.get("webgl")
  ? "webgl"
  : "canvas"

const encoder = new TextEncoder()

export class Connection {
  ws = new WebSocket(url)
  constructor(onOpen: (con: Connection) => void,onData: (data: ArrayBuffer) => void, onClose: () => void) {
    this.ws.binaryType = "arraybuffer";
    this.ws.onerror = () => {
      alert(`Failed to connect to ${url}`)
    }
    this.ws.onclose = () => {
      onClose()
      if (confirm("connection closed, close the window?"))
        window.close()
    }
    this.ws.onmessage = ev => {
      if (ev.data instanceof ArrayBuffer) {
        onData(ev.data)
      } else {
        console.error("unknown message: %o", ev)
      }
    }
    this.ws.onopen = () => {
      onOpen(this)
    }
  }

  resize(cols: number, rows: number) {
    this.ws.send(JSON.stringify({ resize: { cols, rows } }))
  }

  send(data: ArrayBuffer) {
    this.ws.send(data)
  }

  sendString(data: string) {
    this.send(encoder.encode(data))
  }
}