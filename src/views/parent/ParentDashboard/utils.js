const moment = require('moment')

export default function timeBack(ago = 'week') {
  switch (ago) {
    case 'week':
      return moment()
        .subtract(7, 'days')
        .format('YYYY-MM-DD')
    case 'month':
      return moment()
        .subtract(30, 'days')
        .format('YYYY-MM-DD')
    case 'year':
      return moment()
        .subtract(365, 'days')
        .format('YYYY-MM-DD')
    default:
      return moment()
        .subtract(7, 'days')
        .format('YYYY-MM-DD')
  }
}
