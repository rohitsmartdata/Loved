/**
 * Created by demon on 27/10/17.
 */

const injectCharacter = (text, position, character) => {
  let l = text.length
  if (text && l >= position) {
    let a = text.slice(0, position)
    let b = text.slice(position)
    let result = [a, character, b].join('')
    return result
  }
}

const trimCharacter = (text) => {
  let l = text.length
  if (text && l >= 0) {
    return text.substring(0, l - 1)
  }
}

export const formatUserSSN = (ssn) => {
  let length = ssn && ssn.length
  if (length > 5) {
    let tempSSN = injectCharacter(ssn, 3, '-')
    return injectCharacter(tempSSN, 6, '-')
  } else if (length > 3) {
    return injectCharacter(ssn, 3, '-')
  }
  return ssn
}

export const formatSSN = (ssn) => {
  let length = ssn && ssn.length
  switch (length) {
    case 4:
      if (ssn.charAt(3) === '-') {
        return trimCharacter(ssn)
      } else {
        return injectCharacter(ssn, 3, '-')
      }
    case 7:
      if (ssn.charAt(6) === '-') {
        return trimCharacter(ssn)
      } else {
        return injectCharacter(ssn, 6, '-')
      }
    default:
      return ssn
  }
}

export const formatDOB = (DOB) => {
  let length = DOB && DOB.length
  switch (length) {
    case 3:
      return injectCharacter(DOB, 2, ' / ')
    case 5:
      return DOB.substring(0, 2)
    case 8:
      return injectCharacter(DOB, 7, ' / ')
    case 10:
      return DOB.substring(0, 7)
    default: return DOB
  }
}

export const formatPhone = (phone) => {
  let length = phone && phone.length
  switch (length) {
    case 1: return injectCharacter(phone, 0, '( ')
    case 2: return ''
    case 5: return phone + ' ) '
    case 8: return phone.substring(0, 5)
    case 12: return injectCharacter(phone, 11, ' - ')
    case 14: return phone.substring(0, 11)
    default: return phone
  }
}
