/* eslint-disable no-useless-escape,no-trailing-spaces */
/**
 * Created by viktor on 20/7/17.
 */

// ------------------------------------------------------------------
// Validator file
// ------------------------------------------------------------------

var validate = require('validate.js')
var moment = require('moment')

// ------------------------------------------------------------------
// Core functions
// ------------------------------------------------------------------

// Before using it we must add the parse and format functions
// Here is a sample implementation using moment.js
validate.extend(validate.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse: function (value, options) {
    return +moment.utc(value)
  },
  // Input is a unix timestamp
  format: function (value, options) {
    var format = options.dateOnly ? 'MM-DD-YYYY' : 'YYYY-MM-DD hh:mm:ss'
    return moment.utc(value).format(format)
  }
})

let phonePattern = /^\( ?([0-9]{3} )\) ?[-. ]?([0-9]{3}) [-. ] ?([0-9]{4})$/

let datePattern = /^(0[1-9]|1[0-2]) \/ (0[1-9]|1\d|2\d|3[01]) \/ (19|20)\d{2}$/

let emailConstraint = {
  emailID: {
    presence: true,
    email: true,
    length: {
      maximum: 39
    }
  }
}

// ------------------------------------------------------------------
// Validator file
// ------------------------------------------------------------------

export const validateEmail = (emailID) => {
  let v = validate({emailID: emailID}, emailConstraint)
  return v
}

export const validateDate = (dateValue) => {
  if (!dateValue) {
    return 'DOB required'
  }
  let v = validate({dateValue: dateValue}, {dateValue: {format: datePattern}})
  return v
}

export const validatePassword = (password) => {
  if (password && password.length >= 8) {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()<>[\]{}|_+-=])[A-Za-z\d!@#$%^&*()<>[\]{}|_+-=]{8,}$/.test(password)) {
      return undefined
    } else {
      return 'Sorry, your password is incorrect.'
    }
  } else {
    return 'Sorry, your password must be at least 10 characters long.'
  }
}

export const validatePhone = (phone) => {
  if (!phone) {
    return 'Phone Required'
  }
  let v = validate({phoneValue: phone}, {phoneValue: {format: phonePattern}})
  return v
}

export const validateSSN = (ssn) => {
  if (!ssn) {
    return 'SSN Required'
  }
  // https://www.codeproject.com/Articles/651609/Validating-Social-Security-Numbers-through-Regular
  const expression = /^((?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4})|((?!219 09 9999|078 05 1120)(?!666|000|9\d{2})\d{3} (?!00)\d{2} (?!0{4})\d{4})|((?!219099999|078051120)(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4})$/
  let v = validate({ssnValue: ssn}, {ssnValue: {format: expression}})
  return v
}

export const validateRoutingNumber = (routingNumber) => {
  if (routingNumber.length !== 9) {
    console.log('Invalid bank routing number, it should be of 9 digits')
    return false
  }
  if (routingNumber === '000000000') {
    return false
  }
  let totalSum = 0
  for (let i = 0; i < routingNumber.length; i += 3) { // total the sums
    totalSum += parseInt(routingNumber.charAt(i), 10) * 3 + parseInt(routingNumber.charAt(i + 1), 10) * 7 + parseInt(routingNumber.charAt(i + 2), 10)
  }
  if (totalSum % 10 !== 0) {
    console.log('Invalid bank routing number')
    return false
  }
  return true
  // if (!n) {
  //   return 'Routing Number Required'
  // }
  // n = n ? n.match(/\d/g).join('') : 0 // get just digits
  // let c = 0
  // let isValid = false
  //
  // if (n && n.length === 9) { // don't waste energy totalling if its not 9 digits
  //   for (var i = 0; i < n.length; i += 3) { // total the sums
  //     c += parseInt(n.charAt(i), 10) * 3 + parseInt(n.charAt(i + 1), 10) * 7 + parseInt(n.charAt(i + 2), 10)
  //   }
  //   isValid = c !== 0 && c % 10 === 0 // check if multiple of 10
  // }
  // return { // return an object telling whether its valid and if not, why.
  //   isValid: isValid,
  //   errorMsg: n.length !== 9 ? 'Rounting number must be 9 digits' : (!isValid ? 'Invalid bank routing number.' : '') // determine the error message
  // }
}

export const validatePasswordSchema = (pass) => {
  let characterRule = false
  let lowercaseRule = false
  let uppercaseRule = false
  let numberRule = false

  if (pass) {
    characterRule = pass.length >= 8
    try {
      for (let i = 0; i < pass.length; i++) {
        let c = pass.charAt(i)
        if (!isNaN(parseInt(c))) {
          numberRule = true
        } else if (c === c.toLowerCase()) {
          lowercaseRule = true
        } else if (c === c.toUpperCase()) {
          uppercaseRule = true
        }
      }
    } catch (err) {
      console.log('error in password check :: ', err)
    }
  }

  return {
    characterRule: characterRule,
    lowercaseRule: lowercaseRule,
    uppercaseRule: uppercaseRule,
    numberRule: numberRule
  }
}
