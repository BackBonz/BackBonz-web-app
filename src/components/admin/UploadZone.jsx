import { useCallback, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { validateFile } from '../../lib/uploads/documentsRepo'

const ACCEPT = '.md,.pdf,.docx'

export function UploadZone({ onUpload, uploading }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (files) => {
      setError(null)
      const file = files[0]
      if (!file) return

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      onUpload(file)
    },
    [onUpload]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true)  }
  const onDragLeave = ()  => setDragOver(false)

  const onInputChange = (e) => handleFiles(e.target.files)

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        disabled={uploading}
        aria-label="Upload document"
        className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer
          ${dragOver ? 'border-denim bg-denim/5' : 'border-divider bg-white hover:border-denim/50 hover:bg-background'}
          ${uploading ? 'opacity-60 pointer-events-none' : ''}
        `}
      >
        <UploadCloud
          size={36}
          className={`transition-colors ${dragOver ? 'text-denim' : 'text-foreground-muted'}`}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {uploading ? 'Uploading…' : 'Drop a file here, or click to browse'}
          </p>
          <p className="text-xs text-foreground-muted mt-0.5">
            .md, .pdf, .docx — max 10 MB
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={onInputChange}
        disabled={uploading}
        tabIndex={-1}
      />

      {error && (
        <p role="alert" className="mt-2 text-sm text-cherry-red">
          {error}
        </p>
      )}
    </div>
  )
}
