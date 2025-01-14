export type FileInfoType = {
  originalFileName: string,
  fileName: string,
  fileExtension: string,
  mimeType: string,
  bucket: string,
  path: string,
}

export type VendorType = {
  link: string,
  name: string,
  address: string,
  website: string,
  phoneNumber: string
}

export type NotificationType = {
  id: string,
  title: string,
  message: string,
  isRead: boolean,
  hyperLink: {
    id: string,
    entity: string
  }
}