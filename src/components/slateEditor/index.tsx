import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import {
  createEditor,
  Descendant,
} from 'slate'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  LooksOne,
  LooksTwo,
  FormatQuote,
  FormatListNumbered,
  FormatListBulleted,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify
} from "@mui/icons-material"
import { withHistory } from 'slate-history'
import SlateToolbar, { getActiveFormats, ToolbarRef } from './toolbar'
import Helper from 'helpers'
import MarkButton from './markButton'
import BlockButton from './blockButton'
import Element from './element'
import Leaf from './leaf'
import "scss/slateEditor.scss"
import AlignButton from './alignButton'

const SlateEditor = (props: any) => {
  const { name, value, className, ...other } = props

  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const toolbarRef = React.useRef<ToolbarRef>(null)

  const classNames = [
    'slate-editor',
    className,
  ]

  const handleClick = useCallback((e: any) => {
    Helper.bounce('editor-change', 1, () => {
      toolbarRef.current?.setFormats(getActiveFormats(editor))
    })
  }, [editor])

  const handleKeyDown = useCallback((e: any) => {
    Helper.bounce('editor-change', 1, () => {
      toolbarRef.current?.setFormats(getActiveFormats(editor))
    })
  }, [editor])

  return (
    <div className={classNames.join(' ')} {...other}>
      <Slate editor={editor} value={initialValue}>
        <SlateToolbar ref={toolbarRef} className="slate-toolbar">
          <MarkButton value="bold" icon={<FormatBold fontSize="small" />} />
          <MarkButton value="italic" icon={<FormatItalic fontSize="small" />} />
          <MarkButton value="underline" icon={<FormatUnderlined fontSize="small" />} />
          <MarkButton value="code" icon={<Code fontSize="small" />} />
          <BlockButton value="heading-one" icon={<LooksOne fontSize="small" />} />
          <BlockButton value="heading-two" icon={<LooksTwo fontSize="small" />} />
          <BlockButton value="block-quote" icon={<FormatQuote fontSize="small" />} />
          <BlockButton value="numbered-list" icon={<FormatListNumbered fontSize="small" />} />
          <BlockButton value="bulleted-list" icon={<FormatListBulleted fontSize="small" />} />
          <AlignButton value="left" icon={<FormatAlignLeft fontSize="small" />} />
          <AlignButton value="center" icon={<FormatAlignCenter fontSize="small" />} />
          <AlignButton value="right" icon={<FormatAlignRight fontSize="small" />} />
          <AlignButton value="justify" icon={<FormatAlignJustify fontSize="small" />} />
        </SlateToolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        />
      </Slate>
    </div>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text:
          ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

export default SlateEditor