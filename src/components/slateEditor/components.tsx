import { Button, Toolbar } from '@mui/material'
import React, { Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'

interface BaseProps {
	className: string
	[key: string]: unknown
}
type OrNull<T> = T | null

export const SlateButton = React.forwardRef(
	(
		{
			className,
			active,
			reversed,
			...props
		}: PropsWithChildren<
			{
				active: boolean
				reversed: boolean
			} & BaseProps
		>,
		ref: Ref<OrNull<HTMLSpanElement>>
	) => (
		<span
			{...props}
			ref={ref as any}
			className={className}
		/>
	)
)

export const EditorValue = React.forwardRef(
	(
		{
			className,
			value,
			...props
		}: PropsWithChildren<
			{
				value: any
			} & BaseProps
		>,
		ref: Ref<OrNull<null>>
	) => {
		const textLines = value.document.nodes
			.map((node: any) => node.text)
			.toArray()
			.join('\n')
		return (
			<div
				ref={ref as any}
				{...props}
				className={className}
			>
				<div
					className={className}
				>
					Slate's value as text
				</div>
				<div
					className={className}
				>
					{textLines}
				</div>
			</div>
		)
	}
)

export const Icon = React.forwardRef(
	(
		{ className, ...props }: PropsWithChildren<BaseProps>,
		ref: Ref<OrNull<HTMLSpanElement>>
	) => (
		<span
			{...props}
			ref={ref as any}
			className={className}
		/>
	)
)

export const Instruction = React.forwardRef(
	(
		{ className, ...props }: PropsWithChildren<BaseProps>,
		ref: Ref<OrNull<HTMLDivElement>>
	) => (
		<div
			{...props}
			ref={ref as any}
			className={className}
		/>
	)
)

export const Menu = React.forwardRef(
	(
		{ className, ...props }: PropsWithChildren<BaseProps>,
		ref: Ref<OrNull<HTMLDivElement>>
	) => (
		<div
			{...props}
			ref={ref as any}
			className={className}
		/>
	)
)

export const SlateToolbar = React.forwardRef(
	(
		{ className, ...props }: PropsWithChildren<BaseProps>,
		ref: Ref<OrNull<HTMLDivElement>>
	) => (
		<Toolbar variant='dense'
			{...props}
			ref={ref as any}
			className={className} />
	)
)