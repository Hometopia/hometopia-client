import { View, Text } from 'react-native'
import React from 'react'
import { Box } from '../ui/box'
import { adjustHexAlpha, getColorByIndex } from '@/helpers/linear-interpolation-color'

const { startColor, endColor } = { startColor: '#00DC63', endColor: "#D9371A" }
export default function StatusBadge({
  length,
  index,
  label
}: {
  length: number,
  index: number,
  label: string
}) {

  const mainColor = getColorByIndex(index, length, startColor, endColor)
  const bgColor = adjustHexAlpha(mainColor, 0.2)

  return (
    <Box style={{ backgroundColor: bgColor }} className='rounded-full py-2 px-4 shrink'>
      <Text style={{ color: mainColor }}>{label}</Text>
    </Box>
  )
}