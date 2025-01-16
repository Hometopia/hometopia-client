import { DepreciationTableItem } from "@/constants/types"

const depreciationAlgorithm = {
  linear: (initialValue: number, years: number, currentYear: number) => {
    return initialValue - (initialValue / years) * currentYear
  },
  doubleDeclining: (initialValue: number, years: number, currentYear: number) => {
    return initialValue * (2 / years)
  }
}
const calcCurrentValue = (initialValue: number, years: number, currentYear: number) => {
  if (currentYear > years) currentYear = years
  return depreciationAlgorithm.linear(initialValue, years, currentYear)
}
const getDepreciationTable = (initialValue: number, years: number, currentYear: number) => {
  // if (currentYear > years) currentYear = years
  const table: DepreciationTableItem[] = []

  for (let i = 0; i <= currentYear; i++) {
    table.push({
      value: calcCurrentValue(initialValue, years, i),
      year: i
    })
  }
  return table
}

export { calcCurrentValue, getDepreciationTable }