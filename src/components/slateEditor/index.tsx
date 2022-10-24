import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
	Editor,
	Transforms,
	createEditor,
	Descendant,
	Element as SlateElement,
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
import { CustomText } from 'types/Slate'
import { SlateButton, Icon } from './components'
import { withHistory } from 'slate-history'

import "scss/slateEditor.scss"
import SlateToolbar from './toolbar'

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const SlateEditor = (props: any) => {
	const { name, value, ...other } = props

	const renderElement = useCallback((props: any) => <Element {...props} />, [])
	const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])
	const editor = useMemo(() => withHistory(withReact(createEditor())), [])

	return (
		<div {...other}>
			<Slate editor={editor} value={initialValue}>
				<SlateToolbar className="slate-toolbar">
					<MarkButton value="bold" icon={<FormatBold fontSize="small" />} />
					<MarkButton value="italic" icon={<FormatItalic fontSize="small" />} />
					<MarkButton value="underline" icon={<FormatUnderlined fontSize="small" />} />
					<MarkButton value="code" icon={<Code fontSize="small" />} />
					<BlockButton value="heading-one" icon={<LooksOne fontSize="small" />} />
					<BlockButton value="heading-two" icon={<LooksTwo fontSize="small" />} />
					<BlockButton value="block-quote" icon={<FormatQuote fontSize="small" />} />
					<BlockButton value="numbered-list" icon={<FormatListNumbered fontSize="small" />} />
					<BlockButton value="bulleted-list" icon={<FormatListBulleted fontSize="small" />} />
					<BlockButton value="left" icon={<FormatAlignLeft fontSize="small" />} />
					<BlockButton value="center" icon={<FormatAlignCenter fontSize="small" />} />
					<BlockButton value="right" icon={<FormatAlignRight fontSize="small" />} />
					<BlockButton value="justify" icon={<FormatAlignJustify fontSize="small" />} />
				</SlateToolbar>
				<Editable
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					placeholder="Enter some rich text…"
					spellCheck
					autoFocus
				/>
			</Slate>
		</div>
	)
}

const toggleBlock = (editor: Editor, format: string) => {
	const isActive = isBlockActive(
		editor,
		format,
		TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
	)
	const isList = LIST_TYPES.includes(format)

	Transforms.unwrapNodes(editor, {
		match: n =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			LIST_TYPES.includes(n.type) &&
			!TEXT_ALIGN_TYPES.includes(format),
		split: true,
	})
	let newProperties: Partial<SlateElement>
	if (TEXT_ALIGN_TYPES.includes(format)) {
		newProperties = {
			align: (isActive ? undefined : format) as any,
		}
	} else {
		newProperties = {
			type: (isActive ? 'paragraph' : isList ? 'list-item' : format) as any,
		}
	}
	Transforms.setNodes<SlateElement>(editor, newProperties)

	if (!isActive && isList) {
		const block = { type: format as any, children: [] as CustomText[] }
		Transforms.wrapNodes(editor, block)
	}
}

const toggleMark = (editor: Editor, format: string) => {
	const isActive = isMarkActive(editor, format)

	if (isActive) {
		Editor.removeMark(editor, format)
	} else {
		Editor.addMark(editor, format, true)
	}
}

const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
	const { selection } = editor
	if (!selection) return false

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: (n: { [key: string]: any }) => {
				const property = n[blockType]
				return (
					!Editor.isEditor(n) &&
					SlateElement.isElement(n) &&
					property === format
				)
			}
		})
	)

	return !!match
}

const isMarkActive = (editor: Editor, format: string) => {
	const marks = Editor.marks(editor) as { [key: string]: boolean }
	return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }: any) => {
	const style = { textAlign: element.align }
	switch (element.type) {
		case 'block-quote':
			return (
				<blockquote style={style} {...attributes}>
					{children}
				</blockquote>
			)
		case 'bulleted-list':
			return (
				<ul style={style} {...attributes}>
					{children}
				</ul>
			)
		case 'heading-one':
			return (
				<h1 style={style} {...attributes}>
					{children}
				</h1>
			)
		case 'heading-two':
			return (
				<h2 style={style} {...attributes}>
					{children}
				</h2>
			)
		case 'list-item':
			return (
				<li style={style} {...attributes}>
					{children}
				</li>
			)
		case 'numbered-list':
			return (
				<ol style={style} {...attributes}>
					{children}
				</ol>
			)
		default:
			return (
				<p style={style} {...attributes}>
					{children}
				</p>
			)
	}
}

const Leaf = ({ attributes, children, leaf }: any) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>
	}

	if (leaf.code) {
		children = <code>{children}</code>
	}

	if (leaf.italic) {
		children = <em>{children}</em>
	}

	if (leaf.underline) {
		children = <u>{children}</u>
	}

	return <span {...attributes}>{children}</span>
}

const BlockButton = ({ value: format, icon }: any) => {
	const editor = useSlate()
	return (
		<SlateButton
			active={isBlockActive(
				editor,
				format,
				TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
			)}
			onMouseDown={(event: any) => {
				event.preventDefault()
				toggleBlock(editor, format)
			}}
		>
			{icon}
		</SlateButton>
	)
}

const MarkButton = ({ value: format, icon }: any) => {
	const editor = useSlate()
	return (
		<SlateButton
			active={isMarkActive(editor, format)}
			onMouseDown={(event: any) => {
				event.preventDefault()
				toggleMark(editor, format)
			}}
		>
			{icon}
		</SlateButton>
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