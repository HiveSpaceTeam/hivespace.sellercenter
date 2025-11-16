declare module 'quill-image-uploader' {
  import type Quill from 'quill'

  interface ImageUploaderOptions {
    upload: (file: File) => Promise<string>
  }

  class ImageUploader {
    constructor(quill: Quill, options: ImageUploaderOptions)
  }

  export = ImageUploader
}
