/* eslint-disable no-trailing-spaces */
/**
 * Created by viktor on 1/6/17.
 */

import DB_ATTRIBUTES from '../Mapper/LocalDB'
import {AUTH_ENTITIES} from '../Mapper/Auth'
var moment = require('moment')

const priceFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2})

const floatPriceFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})

export const formatPrice = (n) => {
  return priceFormat.format(n)
}

export const formatFloatPrice = (n) => {
  return floatPriceFormat.format(n)
}

export const formatBirthDate = (i) => {
  let j = i % 10
  let k = i % 100

  if (j === 1 && k !== 11) {
    return i + 'st'
  }
  if (j === 2 && k !== 12) {
    return i + 'nd'
  }
  if (j === 3 && k !== 13) {
    return i + 'rd'
  }
  return i + 'th'
}

export const limitText = (str, limit) => {
  if (!str) return ''
  let result = str
  if (str.length > limit) {
    result = str.substring(0, limit - 2).concat('...')
  }

  return result
}

export const stringifyUserStore = (username, passcode) => {
  return JSON.stringify({
    [DB_ATTRIBUTES.USERNAME]: username,
    [DB_ATTRIBUTES.PASSCODE]: passcode
  })
}

export const parseUserStore = (data) => {
  return JSON.parse(data)
}

export const encodePasscode = (username, passcode) => {
  let result = JSON.stringify({
    [DB_ATTRIBUTES.USERNAME]: username,
    [DB_ATTRIBUTES.PASSCODE]: passcode
  })
  return result
}

/*
  return value :
  {
    USERNAME: ...,
    PASSCODE: ...
  }

  returns value only if passcode is
  present and satisfies the constraint
 */
export const decodePasscode = (data) => {
  try {
    let result = JSON.parse(data)
    let passcode = result[DB_ATTRIBUTES.PASSCODE]
    if (passcode && (typeof passcode === 'string') && passcode.length === 4) {
      return result
    } else {
      return undefined
    }
  } catch (err) {
    console.log('error in decoding passcode : ', err, data)
    return undefined
  }
}

export const encodeOnboardingKey = (username) => {
  return username + '_onboarding'
}

export const encodeOnboarding = (isOnboarding, screen, props) => {
  let result = JSON.stringify({
    [DB_ATTRIBUTES.IS_ONBOARDING]: isOnboarding,
    [DB_ATTRIBUTES.CURRENT_ONBOARDING_SCREEN]: screen,
    [DB_ATTRIBUTES.CURRENT_ONBOARDING_SCREEN_PROPS]: props
  })
  return result
}

export const decodeOnboarding = (data) => {
  try {
    let result = JSON.parse(data)
    if (result[DB_ATTRIBUTES.IS_ONBOARDING] && result[DB_ATTRIBUTES.CURRENT_ONBOARDING_SCREEN]) {
      return result
    } else {
      return undefined
    }
  } catch (err) {
    console.log('error in decoding onboarding process : ', err, data)
    return undefined
  }
}

export const encodeCredentials = (username, password) => {
  let result = JSON.stringify({
    [AUTH_ENTITIES.EMAIL]: username,
    [AUTH_ENTITIES.PASSWORD]: password
  })
  return result
}

export const decodeCredentials = (data) => {
  try {
    let result = JSON.parse(data)
    if (result[AUTH_ENTITIES.EMAIL] && result[AUTH_ENTITIES.PASSWORD]) {
      return result
    } else {
      return undefined
    }
  } catch (err) {
    console.log('error in decoding credentials : ', err)
    return undefined
  }
}

export const getCredentialLocalKey = (username) => {
  return username + '_credentials'
}

export const convertDateToRequestFormat = (date) => {
  if (date) {
    let d = moment(date, 'MM/DD/YYYY')
    let month = '' + d.format('MM')
    let day = '' + d.format('DD')
    let year = d.format('YYYY')
    return [year, month, day].join('-')
  }
  return undefined
}

export const convertDateStringToRequestFormat = (date) => {
  if (date) {
    let d = moment(date)
    let month = '' + d.format('MM')
    let day = '' + d.format('DD')
    let year = d.format('YYYY')
    return [year, month, day].join('-')
  }
  return undefined
}

export const convertDateStringToUSFormat = (date) => {
  if (date) {
    let d = moment(date)
    let month = '' + d.format('MM')
    let day = '' + d.format('DD')
    let year = d.format('YYYY')
    return [month, day, year].join('-')
  }
  return undefined
}
export const convertDateStringToMonthDay = (date) => {
  if (date) {
    let d = moment(date)
    let month = '' + d.format('MMM')
    let day = '' + d.format('DD')
    return [month, day].join(' ')
  }
  return undefined
}

export const convertTextToNumber = (text) => {
  return text.replace(/[^0-9]/g, '')
}
