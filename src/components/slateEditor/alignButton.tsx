import { useCallback } from "react"
import { useSlate } from "slate-react"
import { disableFormat, enableFormat } from "./toolbar"

interface BlockButtonProps {
  active?: boolean;
  value: string;
  icon?: React.ReactNode;
}

const BlockButton = ({ value, icon }: BlockButtonProps) => {
  const editor = useSlate()

  const handleClick = useCallback((e: any) => {
    e.preventDefault()

    enableFormat(editor, value)
  }, [editor, value])

  return (
    <span onMouseDown={handleClick}>
      {icon}
    </span>
  )
}

export default BlockButton