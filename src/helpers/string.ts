const manualTruncate = (str: string, lenght: number) => {
  if (str.length > lenght) {
    return str.slice(0, lenght) + '...'
  }
  return str
}
const removeSpecialCharacters = (input: string) => {
  return input.replace(/[^a-zA-Z0-9_\s]/g, '');
};

const formatTimePartical = (time: number) => {
  return time < 10 ? new String(`0${time}`) : time
}
export { manualTruncate, removeSpecialCharacters, formatTimePartical }