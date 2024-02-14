import { useCallback, useEffect, useState } from "react"
import LiveCursors from "./cursor/LiveCursors"
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@/liveblocks.config"
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type"
import CursorChat from "./cursor/CursorChat"
import ReactionSelector from "./reaction/ReactionButton"
import FlyingReaction from "./reaction/FlyingReactions"
import useInterval from "@/hooks/useInterval"

const Live = () => {
  const others = useOthers()
  const [{ cursor }, updateMyPresence] = useMyPresence() as any

  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  })

  // Handle reactions
  const [reaction, setReaction] = useState<Reaction[]>([])

  const broadcast = useBroadcastEvent()

  // Clear the reaction as they get hidden
  useInterval(() => {
    setReaction((rxn) => rxn.filter((r) => r.timestamp > Date.now() - 4000))
  }, 1000)

  useInterval(() => {
    if (
      cursor &&
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed
    ) {
      setReaction((prev) =>
        prev.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      )

      // Broadcast the reaction
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      })
    }
  }, 250)

  // Listen for reactions
  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent

    setReaction((prev) =>
      prev.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    )
  })

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault()

      if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y

        updateMyPresence({ cursor: { x, y } })
      }
    },
    [updateMyPresence, cursor, cursorState.mode]
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

      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      )
    },
    [updateMyPresence, cursorState.mode]
  )

  const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction
        ? { ...state, isPressed: true }
        : state
    )
  }, [cursorState.mode])

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
      } else if (event.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector })
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

  const setReactions = useCallback(
    (reaction: string) =>
      setCursorState({
        mode: CursorMode.Reaction,
        reaction,
        isPressed: false,
      }),
    []
  )

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="border-solid w-full h-[100vh] flex items-center justify-center text-center"
    >
      <p className="text-3xl text-white">Figma clone</p>

      {reaction.map((r) => (
        <FlyingReaction
          key={r.timestamp.toString()}
          x={r.point.x}
          y={r.point.y}
          timestamp={r.timestamp}
          value={r.value}
        />
      ))}

      <LiveCursors others={others} />

      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}

      {/* Reactions */}
      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector setReaction={setReactions} />
      )}
    </div>
  )
}

export default Live
