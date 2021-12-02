import { useEffect, useState } from "react"
import io from "socket.io-client"

interface TimerHandler {
  start: (interval: number) => void
}
interface Response {
  date: number,
  interval: number
}

class Timer {
  serverDate: number
  interval: number
  serverDrift: number
  expected: number = 0

  constructor(serverDate: number, interval: number) {
    this.serverDate = serverDate
    this.interval = interval
    this.serverDrift = Date.now() - serverDate
  }

  start(callback: () => void) {
    this.expected = Date.now() + this.interval - this.serverDrift
    window.setTimeout(this.tick.bind(this, callback), this.interval)
  }

  tick(callback: () => void) {
    callback()
    const drift = Date.now() - this.expected
    console.log(drift)
    this.expected += this.interval
    window.setTimeout(this.tick.bind(this, callback), this.interval - drift)
  }
}

export default function useTimer(url: string, callback: () => void) {
  const [handler, setHandler] = useState<TimerHandler | null>(null)

  useEffect(() => {
    const socket = io(url)
    socket.on("connect", () => {
      console.log("Connected!")
      setHandler({
        start: payload => socket.emit("sync_req", payload)
      })
    })
    socket.on("sync", (response: Response) => {
      new Timer(response.date, response.interval).start(callback)
    })
    return () => { socket.close() }
  }, [url, callback])

  return handler
}
