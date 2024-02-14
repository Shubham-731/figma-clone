import CursorSVG from "@/public/assets/CursorSVG"

type Props = {
  x: number
  y: number
  color: string
  message: string
}

const Cursor = ({ x, y, color, message }: Props) => {
  return (
    <div
      className="absolute top-0 left-0 pointer-events-none"
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
    >
      <CursorSVG color={color} />

      {message && (
        <div
          className="absolute top-5 left-2 px-4 py-2 rounded-3xl"
          style={{ backgroundColor: color }}
        >
          <p className="text-white whitespace-nowrap leading-relaxed text-sm">
            {message}
          </p>
        </div>
      )}
    </div>
  )
}

export default Cursor
