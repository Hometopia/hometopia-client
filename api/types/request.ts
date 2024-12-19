//#region Auth
type LoginForm = {
  username: string, // username or email
  password: string,
}

type RegisterForm = {
  "username": string,
  "firstName": string,
  "lastName": string,
  "email": string,
  "password": string,
  "address": {
    "line": string,
    "provinceId": number,
    "districtId": number,
    "wardId": number
  }
}
//#endregion

//#region Category
type CategoryType = {
  name: string,
  description: string,
  subCategories: CategoryType[]
}
type CategoryUpdateType = {
  name: string,
  description: string,
  parentId: string,
  subCategoryIds: string[]
}
//#endregion

export {
  LoginForm,
  RegisterForm,
  CategoryType,
  CategoryUpdateType,
}