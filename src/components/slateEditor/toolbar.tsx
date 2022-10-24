import React, { ForwardedRef, PropsWithChildren, useCallback, useMemo, useRef } from "react";
import { ToggleButton, ToggleButtonGroup, Toolbar, ToolbarPropsVariantOverrides } from "@mui/material";
import {
	Editor,
	Transforms,
	Element as SlateElement,
} from "slate";
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
import { CustomText } from "types/Slate";
import { useSlate } from "slate-react";

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

interface ToolbarProps extends ToolbarPropsVariantOverrides {
	className?: string;
	children?: React.ReactElement[]
}

export interface ToolbarRef extends ToolbarProps {
	setFormats?: (format: string[]) => void
}

const SlateToolbar = React.forwardRef<ToolbarRef, ToolbarProps>((props, ref) => {
	const editor = useSlate()
	const toolbarRef = useRef<HTMLDivElement | null>(null)

	const formatsRef = useRef<string[]>([])
	const [formats, setFormats] = React.useState(() => ([] as string[]));

	const handleFormat = useCallback((e: any, newFormats: string[]) => {
		setFormats(newFormats)
	}, [])

	// useMemo(() => {
	// 	const appliedFormats = formatsRef.current
	// 	const newFormats = formats.filter((format) => !appliedFormats.includes(format))
	// 	const removedFormats = appliedFormats.filter((format) => !formats.includes(format))

	// 	for (const format of newFormats) {
	// 		if (LIST_TYPES.includes(format) || TEXT_ALIGN_TYPES.includes(format)) {
	// 			enableBlock(editor, format)
	// 		} else {
	// 			enableMark(editor, format)
	// 		}
	// 	}

	// 	for (const format of removedFormats) {
	// 		if (LIST_TYPES.includes(format) || TEXT_ALIGN_TYPES.includes(format)) {
	// 			disableBlock(editor, format)
	// 		} else {
	// 			disableMark(editor, format)
	// 		}
	// 	}
	// }, [formats])

	const children = useMemo(() => {
		return React.Children.map(props.children, (child) => {
			if (React.isValidElement(child)) {
				const props = child.props as any
				return React.createElement(ToggleButton, {
					size: "small",
					value: props.value,
					onMouseDown: (e) => (e.preventDefault()),
				}, child)

			}
			return child
		})
	}, [props.children])

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
			<ToggleButtonGroup size="small" value={formats} onChange={handleFormat}>
				{children}
			</ToggleButtonGroup>
		</Toolbar>
	)
})

export const getActiveBlocks = (editor: Editor) => {
	const blocks = [] as string[]
	const { selection } = editor
	if (!selection) return blocks

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: (n: { [key: string]: any }) => {
				const type = n['align']
				const align = n['type']
				return !Editor.isEditor(n) &&
					SlateElement.isElement(n) &&
					(type || align)
			}
		})
	)

	return blocks
}
export const getActiveMarks = (editor: Editor) => {
	return Object.keys(Editor.marks(editor) || {}) as string[]
}

const isBlockActive = (editor: Editor, format: string, blockType: string = 'type') => {
	const { selection } = editor
	if (!selection) return false

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: (n: { [key: string]: any }) => {
				const type = n[blockType]
				return !Editor.isEditor(n) &&
					SlateElement.isElement(n) &&
					type === format
			}
		})
	)

	return !!match
}

const isMarkActive = (editor: Editor, format: string) => {
	const marks = Editor.marks(editor) as any
	return marks ? marks[format] === true : false
}

const enableBlock = (editor: Editor, format: string) => {
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

const disableBlock = (editor: Editor, format: string) => {
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

const enableMark = (editor: Editor, format: string) => {
	const isActive = isMarkActive(editor, format)
	if (isActive) { return }

	Editor.addMark(editor, format, true)
}

const disableMark = (editor: Editor, format: string) => {
	const isActive = isMarkActive(editor, format)
	if (!isActive) { return }

	Editor.removeMark(editor, format)
}

const applyFormats = (editor: Editor, formats: string[]) => {
	for (const format of formats) {
		if (LIST_TYPES.includes(format)) {
			enableBlock(editor, format)
		} else if (TEXT_ALIGN_TYPES.includes(format)) {
			enableBlock(editor, format)
		} else {
			enableMark(editor, format)
		}
	}
}

const removeFormats = (editor: Editor, formats: string[]) => {
	for (const format of formats) {
		if (LIST_TYPES.includes(format)) {
			disableBlock(editor, format)
		} else if (TEXT_ALIGN_TYPES.includes(format)) {
			disableBlock(editor, format)
		} else {
			disableMark(editor, format)
		}
	}
}

export default SlateToolbar;