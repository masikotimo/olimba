export const dateFormatter = (date) => {
    const parsedDate = new Date(date)
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return parsedDate.toLocaleDateString('en-us', options)
}

export const monthFormatter = (date) => {
    const parsedDate = new Date(date)
    const options = { year: 'numeric', month: 'short' };
    return parsedDate.toLocaleDateString('en-us', options)
}