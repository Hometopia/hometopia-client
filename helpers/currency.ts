const currencyFormatter = (currency: string = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  })
}
const formatNumber = (numericText: string) => {
  return numericText.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
};
const deformatNumber = (formattedText: string): string => {
  return formattedText.replace(/\./g, '');
};

export { currencyFormatter, formatNumber, deformatNumber }