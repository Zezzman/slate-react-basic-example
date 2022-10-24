// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

type BaseElement = {
  type: string
  children: BaseText[]
  align?: 'left' | 'center' | 'right' | 'justify'
}

export type ParagraphElement = BaseElement & {
  type: 'paragraph'
}

export type HeadingElement = BaseElement & {
  type: 'heading'
  level: number
}

export type BlockQuoteElement = BaseElement & {
  type: 'block-quote'
}

export type CustomElement = ParagraphElement | HeadingElement | BlockQuoteElement

type BaseText = {
  text: string;
  italic?: boolean
  code?: boolean
  bold?: boolean
}

export type FormattedText = {
  text: string;
}

export type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor /* & HistoryEditor */
    Element: CustomElement
    Text: CustomText
  }
}