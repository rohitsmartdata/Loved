/* eslint-disable no-trailing-spaces */
/**
 * Created by viktor on 7/6/17.
 */

export const ERROR_TYPE = {
  // parameter of a function is missing
  PARAMETER_NOT_PROVIDED: 'PARAMETER_NOT_PROVIDED',

  // property of an object is missing
  OBJECT_PROPERTY_MISSING: 'OBJECT_PROPERTY_MISSING',

  // internal processing error
  INTERNAL_ERROR: 'INTERNAL_ERROR'
}

// ------------------------------------------------
// PARAMETER_NOT_PROVIDED

export function ParameterNotProvided (message) {
  this.name = ERROR_TYPE.PARAMETER_NOT_PROVIDED
  this.message = (message || '')
}
ParameterNotProvided.prototype = Error.prototype

// ------------------------------------------------
// OBJECT_PROPERTY_MISSING

export function ObjectPropertyMissing (message) {
  this.name = ERROR_TYPE.OBJECT_PROPERTY_MISSING
  this.message = (message || '')
}
ObjectPropertyMissing.prototype = Error.prototype

// ------------------------------------------------
// INTERNAL_ERROR

export function InternalError (message) {
  this.name = ERROR_TYPE.INTERNAL_ERROR
  this.message = (message || '')
}
InternalError.prototype = Error.prototype
