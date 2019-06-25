import React, { useState, useRef, useMemo } from 'react'
import ReactQuill, { Quill } from 'react-quill'
// @ts-ignore
import debounce from 'lodash/debounce'
import { Breadcrumbs, Typography, CircularProgress } from '@material-ui/core'
import { fileToBase64 } from './utils'
import 'quill-drag-and-drop-module'
import './index.css'
import 'react-quill/dist/quill.bubble.css'

type Props = {
  initialText: string
  onChange: (a: string) => void
  onImageUpload?: (a: File) => Promise<string>
  counter?: boolean
  delay?: number
  disableLists?: boolean
}

const draggables = [
  {
    content_type_pattern: '^image/',
    tag: 'img',
    attr: 'src',
  },
]

const WealthyEditor = ({
  initialText = '',
  onChange,
  delay = 700,
  onImageUpload,
  disableLists,
  counter,
}: Props) => {
  const [text, setText] = useState(initialText)
  const [uploading, setUploading] = useState()
  const [count, setCount] = useState(0)
  const editor: React.MutableRefObject<Editor | null> = useRef(null)
  const fileInput: React.MutableRefObject<HTMLInputElement | null> = useRef(
    null,
  )

  const debouncedChange = useMemo(
    () => (delay ? debounce(onChange, delay) : onChange),
    [delay],
  )

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: 1 }, { header: 2 }],
          ['bold', 'italic', 'underline', 'blockquote'],
          disableLists ? [] : [{ list: 'ordered' }, { list: 'bullet' }],
          onImageUpload ? ['link', 'image'] : ['link'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      dragAndDrop: {
        draggables,
        onDrop: uploadImage,
      },
    }),
    [disableLists],
  )

  return (
    <div className="wealthy-editor">
      <ReactQuill
        ref={editor}
        theme="bubble"
        value={text}
        onChange={textChanged}
        modules={modules}
      />
      <div className="wealthy-controls">
        {uploading && (
          <div className="wealthy-upload">
            <CircularProgress
              color="secondary"
              className="wealthy-loading"
              size={20}
            />
            <img
              src={uploading}
              alt="Uploading"
              className="wealthy-uploading-img"
            />
          </div>
        )}
        {counter && (
          <Breadcrumbs>
            <Typography variant="caption">{count}</Typography>
          </Breadcrumbs>
        )}
      </div>
      <input
        ref={fileInput}
        name="images"
        type="file"
        accept="image/*"
        onChange={onUpload}
        style={{ display: 'none' }}
      />
    </div>
  )

  async function onUpload(): Promise<void> {
    const quill = getEditor()
    if (quill && fileInput.current) {
      const { files } = fileInput.current
      if (files !== null && files[0] !== null) {
        const [file] = files
        const range = quill.getSelection(true)
        const index = range.index + range.length
        const imageUrl = await uploadImage(file)
        quill.insertEmbed(index, 'image', imageUrl, 'user')
      }
    }
  }

  async function uploadImage(file: File): Promise<string | ArrayBuffer | null> {
    const fileString = await fileToBase64(file)
    if (onImageUpload) {
      setUploading(fileString)
      const imageUrl = await onImageUpload(file)
      setUploading(null)
      return imageUrl
    }
    return fileString
  }

  function imageHandler() {
    if (fileInput.current) {
      fileInput.current.click()
    }
  }

  function getEditor(): Quill | null {
    if (editor.current) {
      const result = editor.current.getEditor()
      return result
    }
    return null
  }

  function getFullEditor(): FullEditor | null {
    const quill = getEditor()
    if (editor.current && quill) {
      const fullEditor = editor.current.makeUnprivilegedEditor(quill)
      return fullEditor
    }
    return null
  }

  function textChanged(text: string) {
    setText(text)
    debouncedChange(text)
    const editorObject = getFullEditor()
    if (editorObject) {
      const length = editorObject.getLength()
      setCount(length - 1)
    }
  }
}

interface FullEditor {
  getLength: () => number
}

interface Editor extends ReactQuill {
  makeUnprivilegedEditor: (t: Quill) => FullEditor
}

export default WealthyEditor
