import React from "react"

type Props = {
  setReaction: (reaction: string) => void
}

export default function ReactionSelector({ setReaction }: Props) {
  return (
    <div
      className="absolute bottom-20 left-0 right-0 bg-white px-2 w-fit mx-auto rounded-full transform"
      onPointerMove={(e) => e.stopPropagation()}
    >
      <ReactionButton reaction="👍" onSelect={setReaction} />
      <ReactionButton reaction="🔥" onSelect={setReaction} />
      <ReactionButton reaction="😍" onSelect={setReaction} />
      <ReactionButton reaction="👀" onSelect={setReaction} />
      <ReactionButton reaction="😱" onSelect={setReaction} />
      <ReactionButton reaction="🙁" onSelect={setReaction} />
    </div>
  )
}

function ReactionButton({
  reaction,
  onSelect,
}: {
  reaction: string
  onSelect: (reaction: string) => void
}) {
  return (
    <button
      className="transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none"
      onPointerDown={() => onSelect(reaction)}
    >
      {reaction}
    </button>
  )
}
