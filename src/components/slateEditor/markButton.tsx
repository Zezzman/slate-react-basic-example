import { useCallback } from "react"
import { Editor } from "slate"
import { useSlate } from "slate-react"

interface MarkButtonProps {
  active?: boolean;
  value: string;
  icon?: React.ReactNode;
}

const MarkButton = ({ active, value, icon }: MarkButtonProps) => {
  const editor = useSlate()

  const handleClick = useCallback((e: any) => {
    e.preventDefault()
    if (active) {
      Editor.removeMark(editor, value)
    } else {
      Editor.addMark(editor, value, true)
    }
  }, [editor, active, value])

  return (
    <span onMouseDown={handleClick}>
      {icon}
    </span>
  )
}

export default MarkButton