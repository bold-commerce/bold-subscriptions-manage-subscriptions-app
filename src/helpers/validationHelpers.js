import moment from 'moment/moment';

export function getQuantity(quantity) {
  return quantity > 0 ? quantity : 0;
}

export function isDateInPast(date) {
  return date && date.isBefore(moment().startOf('day'));
}

export function safeParseJson(string) {
  let jsonString = false;
  try {
    jsonString = JSON.parse(string);
  } catch (e) {
    return false;
  }
  return jsonString;
}
