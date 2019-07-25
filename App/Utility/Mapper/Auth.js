/* eslint-disable no-multiple-empty-lines,key-spacing,no-trailing-spaces */
/**
 * Created by viktor on 12/7/17.
 */

// ========================================================
// Auth Entities
// ========================================================

export const AUTH_ENTITIES = {

  // ----- BUSINESS entities -----

  // type of authentication
  AUTH_TYPE : 'TYPE',
  // login type
  LOGIN     : 'LOGIN',
  // signup type
  SIGNUP    : 'SIGNUP',
  // is login helping signup
  HELPING_SIGNUP: 'HELPING_SIGNUP',
  // is passcode login
  IS_PASSCODE_LOGIN: 'IS_PASSCODE_LOGIN',

  // Email of the user
  EMAIL     : 'EMAIL',
  // confirm email
  EMAIL_CONFIRM: 'EMAIL_CONFIRM',
  // Password of the user
  PASSWORD  : 'PASSWORD',
  // new password; for changing password
  NEW_PASSWORD: 'NEW_PASSWORD',
  // confirm new password
  CONFIRM_NEW_PASSWORD: 'CONFIRM_NEW_PASSWORD',

  ACCESS_TOKEN: 'ACCESS_TOKEN',

  ID_TOKEN: 'ID_TOKEN',
  ID_TOKEN_EXPIRY: 'ID_TOKEN_EXPIRY',
  REFRESH_TOKEN:'REFRESH_TOKEN',

  PIN       : 'PIN',

  // ----- Store specific entities -----
  IS_PASSCODE_LOGOUT: 'IS_PASSCODE_LOGOUT',

  // ----- UTILITY entities -----

  IS_OK     : 'OK',
  // error related to goal module
  ERROR     : 'ERROR',
  // show error
  SHOW_ERROR: 'SHOW_ERROR',
  // processing index tag
  PROCESSING: 'PROCESSING',
  // system is processing login
  PROCESSING_LOGIN: 'PROCESSING_LOGIN',
  // processing logout
  PROCESSING_LOGOUT: 'processingLogout',
  // processing signup
  PROCESSING_SIGNUP: 'PROCESSING_SIGNUP',
  // processing fetch ping
  PROCESSING_FETCH_PIN: 'PROCESSING_FETCH_PIN',

  PIN_COMPONENT_TYPE: 'pinComponentType',
  PIN_ACTION_TYPE: 'pinActionType',
  GO_TO_HOMEPAGE: 'goToHomepage',
  IS_PASSCODE_MODAL: 'IS_PASSCODE_MODAL'
}

export function path (ENTITIY) {
  switch (ENTITIY) {

    // ----- Business entity paths -----

    case AUTH_ENTITIES.PIN:
      return () => [AUTH_ENTITIES.PIN]

    case AUTH_ENTITIES.ID_TOKEN:
      return () => [AUTH_ENTITIES.ID_TOKEN]

    // ----- Store specific entity paths-----

    // ----- Utility paths -----
    case AUTH_ENTITIES.IS_OK:
      return () => ['sanity', AUTH_ENTITIES.IS_OK]
    case AUTH_ENTITIES.ERROR:
      return () => ['sanity', AUTH_ENTITIES.ERROR]
    case AUTH_ENTITIES.SHOW_ERROR:
      return () => ['sanity', AUTH_ENTITIES.SHOW_ERROR]
    case AUTH_ENTITIES.PROCESSING:
      return () => ['sanity', AUTH_ENTITIES.PROCESSING]
  }
}

export const PIN_COMPONENT_TYPE = {
  VERIFY  : 'verify',
  CREATE  : 'create',
  CONFIRM : 'confirm'
}

export const PIN_ACTION_TYPE = {
  // login type of verification,
  // navigator should go to homepage
  LOGIN: 'login',

  // type: resetPassword
  RESET_PASSWORD: 'resetPassword',

  // on boarding process
  ON_BOARDING: 'onBoarding',

  // set new pin
  SET_NEW_PIN: 'setNewPin'
}
