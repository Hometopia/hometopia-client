import { View, Text } from 'react-native'
import React from 'react'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from '../ui/form-control'
import { Input, InputField } from '../ui/input'
import { AlertCircleIcon } from 'lucide-react-native'

export default function ControllableInput({
  control,
  label,
  errorText,
  input,
  isRequired = true
}: {
  control: any,
  label: string,
  errorText: string,
  input: any,
  isRequired?: boolean

}) {
  return (
    <FormControl
      isRequired={isRequired}
      isInvalid={!control.isValid}
    >
      <FormControlLabel>
        <FormControlLabelText className="text-md text-typography-500">
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      {input}
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>
          {errorText}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}