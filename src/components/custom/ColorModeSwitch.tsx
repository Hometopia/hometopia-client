import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from '../ui/icon'
import { MoonIcon, SunIcon } from 'lucide-react-native'


export default function ColorModeSwitch({
  mode, onChange
}: {
  mode: "light" | "dark" | "system",
  onChange: Function
}) {

  return (
    <TouchableOpacity
      className={mode === 'dark' ?
        'rounded-full p-4 bg-info-400/10' :
        'rounded-full p-4 bg-warning-300/10'
      }
      onPress={() => onChange(mode === 'light' ? 'dark' : 'light')}
    >
      <Icon
        className={mode === 'dark' ? 'text-info-400 w-6 h-6' : 'text-warning-300 w-6 h-6'}
        as={mode === 'dark' ? MoonIcon : SunIcon}
      />
    </TouchableOpacity>
  )
}