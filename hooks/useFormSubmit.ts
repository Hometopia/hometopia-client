import React from "react";

const useFormSubmit = (validateAllFn: () => void, onSubmit: () => void) => {

  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const submitAndSetSubmitted = () => {
    onSubmit()
    setIsSubmitted(prev => prev = false)
  }

  const handleSubmit = () => {
    validateAllFn()
    setIsSubmitted(prev => prev = true)
  }

  React.useEffect(() => {
    if (isSubmitted)
      submitAndSetSubmitted()
  }, [isSubmitted])

  return { handleSubmit }

}

export default useFormSubmit