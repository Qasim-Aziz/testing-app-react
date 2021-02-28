/* eslint-disable no-else-return */
/* eslint-disable prefer-template */
import moment from 'moment'

function arrayNotNull(array) {
  if (array !== undefined && array !== null && Array.isArray(array) && array.length > 0) {
    return true
  }
  return false
}

function notNull(data) {
  if (data !== undefined && data !== null && data !== '') {
    return true
  }
  return false
}

function dateTimeToUtc(dateTime) {
  return moment(dateTime)
    .local()
    .utc()
    .format('YYYY-MM-DDTHH:mm:ssZ')
}

function timeToUtc(time) {
  return moment(time)
    .local()
    .utc()
    .format('hh:mm a')
}

function dateTimeToDate(dateTime) {
  return moment(dateTime)
    .local()
    .utc()
    .format('YYYY-MM-DD')
}

function capitalize(string) {
  // let finalString = ''
  if (typeof string !== 'string') return ''
  else {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }
  // return finalString
}

function combineDateAndTime(date, time) {
  const dateText = moment(date)
    .local()
    .utc()
    .format('YYYY-MM-DD')
  const timeText = moment(time)
    .local()
    .utc()
    .format('HH:mm:ssZ')
  return `${dateText}T${timeText}`
}

function calculateAge(birthday) { // birthday is a date
  const a = moment();
  const b = moment(birthday)
  const years = a.diff(b, 'year');
  b.add(years, 'years');
  const months = a.diff(b, 'months');
  b.add(months, 'months');
  const days = a.diff(b, 'days');
  return years + ' years ' + months + ' months'
}

export {
  arrayNotNull,
  notNull,
  dateTimeToUtc,
  timeToUtc,
  capitalize,
  dateTimeToDate,
  combineDateAndTime,
  calculateAge,
}
