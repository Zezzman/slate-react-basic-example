import React, { createRef, useCallback, useMemo, useRef } from "react"
import { Editable, withReact, Slate } from 'slate-react'
import {
	Editor,
	createEditor,
	Descendant,
	Element as SlateElement,
} from 'slate'
import SlateToolbar, { getActiveBlocks, getActiveMarks, ToolbarRef } from "./toolbar"
import "scss/slateEditor.scss"

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string
	value?: string
}

export default function SlateEditor(props: EditorProps) {
	const editor = useMemo(() => withReact(createEditor()), [])
	const { name, value, ...other } = props
	const toolbarRef = useRef<ToolbarRef>(null)
	// const initialValue: CustomElement[] = useMemo(() => {
	// 	return ([
	// 		{
	// 			type: 'paragraph',
	// 			children: value ? deserializeHTML(value) : [{ text: '' }],
	// 		},
	// 	])
	// }, [value])

	const renderElement = useCallback((props: any) => <Element {...props} />, [])
	const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

	const matchCurrentSelection = useCallback(() => {
		const { selection } = editor
		if (!selection) return

		const blocks = getActiveBlocks(editor)
		const marks = getActiveMarks(editor)
		const formats = [...blocks, ...marks]
		// toolbarRef.current?.setFormats?.(formats)
	}, [editor])

	return (
		<div {...other}>
			<Slate editor={editor} value={initialValue}>
				<SlateToolbar ref={toolbarRef} />
				<Editable
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					placeholder="Enter your message here..."
					spellCheck
					onSelect={matchCurrentSelection}
				/>
			</Slate>
		</div>
	)
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