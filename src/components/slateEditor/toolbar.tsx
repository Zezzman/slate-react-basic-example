import React, { useCallback, useMemo, useRef } from "react";
import { ToggleButton, ToggleButtonGroup, Toolbar, ToolbarPropsVariantOverrides } from "@mui/material";
import {
  Editor,
  Transforms,
  Element as SlateElement,
} from "slate";
import { useSlate } from "slate-react";
import { CustomText } from "types/Slate";

const FORMAT_TYPES: { [key: string]: { [key: string]: string } } = {
  bold: {
    mark: "bold"
  },
  italic: {
    mark: "italic"
  },
  underline: {
    mark: "underline"
  },
  code: {
    mark: "code"
  },
  "heading-one": {
    block: "heading-one"
  },
  "heading-two": {
    block: "heading-two"
  },
  "block-quote": {
    block: "block-quote"
  },
  numbered: {
    list: "numbered"
  },
  bulleted: {
    list: "bulleted"
  },
  left: {
    align: "left"
  },
  center: {
    align: "center"
  },
  right: {
    align: "right"
  },
  justify: {
    align: "justify"
  },
}

interface ToolbarProps extends ToolbarPropsVariantOverrides {
  className?: string;
  children?: React.ReactElement | React.ReactElement[]
}

export interface ToolbarRef extends ToolbarProps {
  setFormats: (format: string[]) => void
}

const SlateToolbar = React.forwardRef<ToolbarRef, ToolbarProps>((props, ref) => {
  const editor = useSlate()
  const toolbarRef = useRef<HTMLDivElement | null>(null)

  const [formats, setFormats] = React.useState(() => ([] as string[]));

  const handleClick = useCallback(() => {
    setFormats(getActiveFormats(editor))
  }, [editor, setFormats])

  const children = useMemo(() => {
    return React.Children.map(props.children, (child) => {
      if (React.isValidElement(child)) {
        const props = child.props as any
        return React.createElement(ToggleButton, {
          size: "small",
          value: props.value,
          onMouseDown: (e) => (e.preventDefault()),
          onClick: handleClick
        }, React.cloneElement<any>(child, {
          ...props,
          active: formats.includes(props.value),
        }))
      }
      return child
    })
  }, [formats, props.children, handleClick])

  return (
    <Toolbar ref={element => {
      toolbarRef.current = element
      if (typeof ref === 'function') {
        ref(element as any);
      } else if (ref) {
        ref.current = (element as any);
        ref.current && (ref.current.setFormats = setFormats);
      }
    }} className="slate-toolbar" variant="dense">
      <ToggleButtonGroup size="small" value={formats}>
        {children}
      </ToggleButtonGroup>
    </Toolbar>
  )
})

export const getActiveFormats = (editor: Editor) => {
  const { selection } = editor
  const marks = getActiveMarks(editor)
  const blocks = marks
  if (!selection) { return blocks }

  Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: { [key: string]: any }) => {
        if (Editor.isEditor(n)) { return false }

        console.log(n)
        const properties = Object.entries(n)

        // Get block types from the element nodes
        if (SlateElement.isElement(n)) {
          const align = (n.align && FORMAT_TYPES[n.align]) || {}
          if (align.align && !blocks.includes(align.align)
            && FORMAT_TYPES.hasOwnProperty(align.align)) {
            blocks.push(align.align)
          }

          const type = (n.type && FORMAT_TYPES[n.type]) || {}
          if (type.block && !blocks.includes(type.block)
            && FORMAT_TYPES.hasOwnProperty(type.block)) {
            blocks.push(type.block)
          }
          return true
        }

        // Get marks on text nodes
        properties.forEach(([key, value]) => {
          if (!value) { return }
          const mark = FORMAT_TYPES[key] || {}
          if (mark.mark && !blocks.includes(key)) {
            blocks.push(key)
          }
        })

        return true
      }
    })
  )

  return blocks
}

const getActiveMarks = (editor: Editor) => {
  return Object.keys(Editor.marks(editor) || {}) as string[]
}

export const formatIsActive = (editor: Editor, format: string) => {
  const formats = getActiveFormats(editor)
  return formats.includes(format)
}

export const enableFormat = (editor: Editor, format: string) => {
  const isActive = formatIsActive(editor, format)
  const isList = FORMAT_TYPES[format]?.list ? true : false
  const isAlignment = FORMAT_TYPES[format]?.align ? true : false

  if (isActive) { return }

  Transforms.unwrapNodes(editor, {
    match: (n) => {
      const isList = (SlateElement.isElement(n) && FORMAT_TYPES[n.type]?.list) ? true : false
      return !Editor.isEditor(n)
        && isList
        && !isAlignment
    },
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (isAlignment) {
    newProperties = {
      align: format as any,
    }
  } else {
    newProperties = {
      type: (isList ? 'list-item' : format) as any,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (isList) {
    const block = { type: format as any, children: [] as CustomText[] }
    Transforms.wrapNodes(editor, block)
  }
}

export const disableFormat = (editor: Editor, format: string) => {
  const isActive = formatIsActive(editor, format)
  const isAlignment = FORMAT_TYPES[format]?.align ? true : false

  if (!isActive) { return }

  Transforms.unwrapNodes(editor, {
    match: (n) => {
      const isList = (SlateElement.isElement(n) && FORMAT_TYPES[n.type]?.list) ? true : false
      return !Editor.isEditor(n)
        && isList
        && !isAlignment
    },
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (isAlignment) {
    newProperties = {
      align: undefined,
    }
  } else {
    newProperties = {
      type: 'paragraph' as any,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)
}

export default SlateToolbar;