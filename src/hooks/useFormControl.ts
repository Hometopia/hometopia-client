import React from "react";

const useFormControl = (initialValue: string = "", validateFn: (value: string) => boolean) => {
  const [value, setValue] = React.useState(initialValue)
  const [isValid, setIsValid] = React.useState(true)

  const onChange = (newValue: string) => {
    setValue(newValue)
    // setIsValid(validateFn(newValue))
  };

  const validate = () => {
    setIsValid(prev => prev = validateFn(value))
  }

  const reset = () => {
    setValue(initialValue)
  }

  return {
    value,
    isValid,
    onChange,
    validate,
    reset
  }
}

export default useFormControl