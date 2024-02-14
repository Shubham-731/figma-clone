import { useCallback, useEffect, useState } from "react"
import LiveCursors from "./cursor/LiveCursors"
import { useMyPresence, useOthers } from "@/liveblocks.config"
import { CursorMode } from "@/types/type"
import CursorChat from "./cursor/CursorChat"

const Live = () => {
  const others = useOthers()
  const [{ cursor }, updateMyPresence] = useMyPresence() as any

  const [cursorState, setCursorState] = useState({
    mode: CursorMode.Hidden,
  })

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault()

      const x = event.clientX - event.currentTarget.getBoundingClientRect().x
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y

      updateMyPresence({ cursor: { x, y } })
    },
    [updateMyPresence]
  )

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent) => {
      setCursorState({ mode: CursorMode.Hidden })

      updateMyPresence({ cursor: null, message: null })
    },
    [updateMyPresence]
  )

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y

      updateMyPresence({ cursor: { x, y } })
    },
    [updateMyPresence]
  )

  // Listen for keyboard events
  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        })
      } else if (event.key === "Escape") {
        updateMyPresence({ message: "" })
        setCursorState({ mode: CursorMode.Hidden })
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault()
      }
    }

    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [updateMyPresence])

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="border-solid w-full h-[100vh] flex items-center justify-center text-center"
    >
      <LiveCursors others={others} />

      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      <p className="text-3xl text-white">Figma clone</p>
    </div>
  )
}

export default Live
