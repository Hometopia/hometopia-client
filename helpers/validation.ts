import { EMAIL_REG, PASSWORD_REG } from "@/constants/regex";

const isValidEmail = (value: string): boolean => {
  return EMAIL_REG.test(value)
}
const isValidPassword = (value: string): boolean => {
  return PASSWORD_REG.test(value)
}

export {
  isValidEmail,
  isValidPassword
}