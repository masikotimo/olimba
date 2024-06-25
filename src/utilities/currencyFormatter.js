const defaultOptions = {
    significantDigits: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    symbol: 'UGX'
  }
  
export const currencyFormatter = (value) => {
    if (typeof value !== 'number') value = 0.0
    value = value.toFixed(defaultOptions.significantDigits)
  
    const [currency, decimal] = value.split('.')
    if(defaultOptions.significantDigits > 0){
        return `${defaultOptions.symbol} ${currency.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        defaultOptions.thousandsSeparator
        )}${defaultOptions.decimalSeparator}${decimal}`
    } else {
        return `${defaultOptions.symbol} ${currency.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            defaultOptions.thousandsSeparator
            )}`
    }
}