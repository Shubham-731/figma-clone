"use client"

import { fabric } from "fabric"
import LeftSidebar from "@/components/LeftSidebar"
import Live from "@/components/Live"
import Navbar from "@/components/Navbar"
import RightSidebar from "@/components/RightSidebar"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
} from "@/lib/canvas"
import { ActiveElement } from "@/types/type"

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const isDrawing = useRef(false)
  const shapeRef = useRef<fabric.Object | null>(null)
  const selectedShapeRef = useRef<string | null>(null)

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  })

  const handleActiveElement = useCallback((elem: ActiveElement) => {
    setActiveElement(elem)

    selectedShapeRef.current = elem?.value as string
  }, [])

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef })

    canvas.on("mouse:down", (options) =>
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      })
    )

    window.addEventListener("resize", () => {
      handleResize({ canvas: fabricRef })
    })
  }, [])

  return (
    <main className="h-screen overflow-hidden">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
      />

      <section className="flex h-full flex-row">
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
    </main>
  )
}
