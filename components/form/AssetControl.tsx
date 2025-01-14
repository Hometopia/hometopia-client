import { View, Text } from 'react-native'
import React, { useState } from 'react'
import useFormControl from '@/hooks/useFormControl'
import { AssetResponseType } from '@/api/types/response'
import { formatNumber } from '@/helpers/currency'
import { FileInfoType } from '@/api/types/common'

export function AssetControl(data: AssetResponseType) {

  const nameControl = useFormControl(data.name, (value): boolean => {
    return value !== ""
  })
  const categoryControl = useFormControl(data.category.id, (value): boolean => {
    return value !== ""
  })
  const descontrol = useFormControl(data.description, (value): boolean => {
    return true
  })
  const [imgInfo, setImgInfo] = useState<FileInfoType>(data.images[0])
  //
  const purchaseDateControl = useFormControl(data.purchaseDate, (value): boolean => {
    return value !== ""
  })
  const purchasePlaceControl = useFormControl(data.purchasePlace, (value): boolean => {
    return value !== ""
  })
  const purchasePriceControl = useFormControl(formatNumber(data.purchasePrice.toString()), (value): boolean => {
    return value !== ""
  })
  const vendorControl = useFormControl(data.vendor, (value): boolean => {
    return value !== ""
  })
  const serialNumberControl = useFormControl(data.serialNumber, (value): boolean => {
    return value !== ""
  })
  //
  const statusControl = useFormControl(data.status, (value): boolean => {
    return value !== ""
  })
  const locationControl = useFormControl(data.location, (value): boolean => {
    return value !== ""
  })
  //
  const warrantyExpiryDateControl = useFormControl(data.warrantyExpiryDate, (value): boolean => {
    return value !== ""
  })
  const [docInfo, setDocInfo] = useState<FileInfoType[]>(data.documents)
  return {
    nameControl,
    categoryControl,
    descontrol,
    imgInfo, setImgInfo,
    purchaseDateControl,
    purchasePlaceControl,
    purchasePriceControl,
    vendorControl,
    serialNumberControl,
    statusControl,
    locationControl,
    warrantyExpiryDateControl,
    docInfo, setDocInfo
  }
}