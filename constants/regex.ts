// RFC 5322
const EMAIL_REG = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const PASSWORD_REG = /^\S{6,}$/

export {
  EMAIL_REG,
  PASSWORD_REG
}