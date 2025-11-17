"use client"

import * as React from "react"
import { Upload, X, Image as ImageIcon, FileImage, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ImageUploadProps {
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  onUpload?: (file: File) => Promise<string>
  multiple?: boolean
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
  className?: string
  disabled?: boolean
}

interface UploadedFile {
  id: string
  url: string
  name: string
  size: number
  progress?: number
  error?: string
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 5,
  accept = "image/*",
  className,
  disabled = false,
}: ImageUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Initialize files from value
  React.useEffect(() => {
    if (value) {
      const urls = Array.isArray(value) ? value : [value]
      const initialFiles: UploadedFile[] = urls.map((url, index) => ({
        id: `${index}-${Date.now()}`,
        url,
        name: url.split("/").pop() || `image-${index}`,
        size: 0,
      }))
      setFiles(initialFiles)
    }
  }, [])

  const handleFileChange = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const newFiles = Array.from(selectedFiles)

    // Validate file count
    if (!multiple && files.length > 0) {
      return
    }

    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} fichiers autorisés`)
      return
    }

    // Validate file size
    const oversizedFiles = newFiles.filter((file) => file.size > maxSizeMB * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(`Taille maximale: ${maxSizeMB}MB`)
      return
    }

    setUploading(true)

    // Create preview files
    const uploadedFiles: UploadedFile[] = []

    for (const file of newFiles) {
      const fileId = `${file.name}-${Date.now()}-${Math.random()}`

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)

      const uploadedFile: UploadedFile = {
        id: fileId,
        url: previewUrl,
        name: file.name,
        size: file.size,
        progress: 0,
      }

      uploadedFiles.push(uploadedFile)
      setFiles((prev) => [...prev, uploadedFile])

      // Upload if handler provided
      if (onUpload) {
        try {
          // Simulate progress
          let progress = 0
          const progressInterval = setInterval(() => {
            progress += 10
            if (progress <= 90) {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileId ? { ...f, progress } : f
                )
              )
            }
          }, 200)

          const uploadedUrl = await onUpload(file)

          clearInterval(progressInterval)

          // Update with uploaded URL
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, url: uploadedUrl, progress: 100 }
                : f
            )
          )

          uploadedFiles.push({ ...uploadedFile, url: uploadedUrl })
        } catch (error) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, error: "Échec de l'upload" }
                : f
            )
          )
        }
      }
    }

    setUploading(false)

    // Call onChange with URLs
    if (onChange) {
      const urls = [...files, ...uploadedFiles].map((f) => f.url)
      onChange(multiple ? urls : urls[0])
    }
  }

  const removeFile = (fileId: string) => {
    const newFiles = files.filter((f) => f.id !== fileId)
    setFiles(newFiles)

    if (onChange) {
      const urls = newFiles.map((f) => f.url)
      onChange(multiple ? urls : urls[0] || "")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChange(e.dataTransfer.files)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Zone */}
      {(multiple || files.length === 0) && (
        <Card
          className={cn(
            "relative border-2 border-dashed p-8 text-center transition-all",
            isDragging && "border-primary bg-primary/5",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "cursor-pointer hover:border-primary/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            disabled={disabled}
          />

          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
            <div className="text-sm">
              <span className="font-medium text-primary">Cliquez pour uploader</span>
              <span className="text-muted-foreground"> ou glissez-déposez</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {accept.includes("image") ? "PNG, JPG, GIF" : "Fichiers"} jusqu'à {maxSizeMB}MB
            </p>
          </div>
        </Card>
      )}

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="relative group overflow-hidden p-2">
              <div className="aspect-square relative rounded-md overflow-hidden bg-muted">
                {file.url ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Remove button */}
                {!disabled && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                {/* Upload progress */}
                {file.progress !== undefined && file.progress < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2">
                    <Progress value={file.progress} className="h-1" />
                  </div>
                )}

                {/* Error overlay */}
                {file.error && (
                  <div className="absolute inset-0 bg-destructive/90 flex items-center justify-center">
                    <p className="text-xs text-destructive-foreground px-2 text-center">
                      {file.error}
                    </p>
                  </div>
                )}
              </div>

              {/* File name */}
              <p className="text-xs text-muted-foreground mt-2 truncate" title={file.name}>
                {file.name}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
