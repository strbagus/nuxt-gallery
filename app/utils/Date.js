export const formatDate = (isoString) => {
  if (!isoString) return '-'

  try {
    const date = new Date(isoString)

    if (isNaN(date.getTime())) {
      return 'Date Not Valid'
    }

    return new Intl.DateTimeFormat('en-EN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch (error) {
    return 'Date Not Valid'
  }
}
