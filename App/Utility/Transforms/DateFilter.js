/**
 * Created by viktor on 11/7/17.
 */

import moment from 'moment'

export const filter = (data, start, end, valueType) => {
  let result = []
  for (var item in data) {
    if (moment(data[item].Date, 'DD-MM-YYYY').isBetween(moment(start, 'MM-DD-YYYY'), moment(end, 'MM-DD-YYYY'))) {
      result.push({'x': moment(data[item].Date, 'DD-MM-YYYY').toDate(), 'y': data[item][valueType]})
    }
  }
  return result
}

export const filterList = (data, str) => {
  const result = []
  if (data && data instanceof Array) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].name && typeof data[i].name === 'string' && data[i].name.toLowerCase().startsWith(str.toLowerCase())) {
        result.push(data[i])
      }
    }
  }
  return result
}
