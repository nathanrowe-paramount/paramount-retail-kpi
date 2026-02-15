'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface PhotoUploadProps {
  onUploadComplete: (urls: { url: string; path: string; caption?: string; photoType?: string }[]) => void
  maxFiles?: number
  photoType?: string
}

export function PhotoUpload({ onUploadComplete, maxFiles = 5, photoType = 'GENERAL' }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string; path: string; caption: string }[]>([])

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    if (uploadedPhotos.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} photos allowed`)
      return
    }

    setUploading(true)

    const newPhotos: { url: string; path: string; caption: string }[] = []

    for (const file of Array.from(files)) {
      try {
        // Get signed URL from API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        })

        if (!response.ok) throw new Error('Failed to get upload URL')

        const { signedUrl, path, publicUrl } = await response.json()

        // Upload file to Supabase
        const uploadResponse = await fetch(signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })

        if (!uploadResponse.ok) throw new Error('Failed to upload file')

        newPhotos.push({
          url: publicUrl,
          path,
          caption: '',
        })

      } catch (error) {
        console.error('Upload error:', error)
        alert(`Failed to upload ${file.name}`)
      }
    }

    const updatedPhotos = [...uploadedPhotos, ...newPhotos]
    setUploadedPhotos(updatedPhotos)
    onUploadComplete(updatedPhotos.map(p => ({ ...p, photoType })))
    setUploading(false)

  }, [uploadedPhotos, maxFiles, onUploadComplete, photoType])

  const updateCaption = (index: number, caption: string) => {
    const updated = [...uploadedPhotos]
    updated[index].caption = caption
    setUploadedPhotos(updated)
    onUploadComplete(updated.map(p => ({ ...p, photoType })))
  }

  const removePhoto = (index: number) => {
    const updated = uploadedPhotos.filter((_, i) => i !== index)
    setUploadedPhotos(updated)
    onUploadComplete(updated.map(p => ({ ...p, photoType })))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading || uploadedPhotos.length >= maxFiles}
          />
          <Button type="button" variant="outline" disabled={uploading || uploadedPhotos.length >= maxFiles}>
            {uploading ? 'Uploading...' : `Add Photo (${uploadedPhotos.length}/${maxFiles})`}
          </Button>
        </label>
        <span className="text-sm text-slate-500">
          {photoType === 'PROMO_DISPLAY' && 'Promotional display photos'}
          {photoType === 'PLANogram' && 'Planogram compliance photos'}
          {photoType === 'COMPLIANCE' && 'Compliance evidence'}
          {photoType === 'GENERAL' && 'General store photos'}
        </span>
      </div>

      {uploadedPhotos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedPhotos.map((photo, index) => (
            <div key={index} className="relative border rounded-lg p-2">
              <img
                src={photo.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
              <input
                type="text"
                placeholder="Add caption..."
                value={photo.caption}
                onChange={(e) => updateCaption(index, e.target.value)}
                className="mt-2 w-full text-sm px-2 py-1 border rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
