import TypingAnimation from "@/components/ui/typingAnimation";

const TypingIndicator = () => {
  return (
    <span className="flex gap-1 items-end text-gray-500 text-xs ml-1 mb-1">
      Typing
      <TypingAnimation className="bg-gray-500"/>
    </span>
  )
}

export default TypingIndicator
