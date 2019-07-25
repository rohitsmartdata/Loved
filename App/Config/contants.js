/* eslint-disable key-spacing,no-trailing-spaces */
/**
 * Created by viktor on 31/5/17.
 */

export const ENVIRONMENT = {
  DEV1: 'DEV1',
  UAT1: 'UAT1',
  UAT2: 'UAT2',
  TEST1: 'TEST1',
  TEST2: 'TEST2',
  TEST3: 'TEST3',
  PROD: 'PROD'
}

export const getEnvironmentFile = (env) => {
  switch (env) {
    case ENVIRONMENT.DEV1: return require('../../config/dev1.env.json')
    case ENVIRONMENT.UAT2: return require('../../config/uat2.env.json')
    case ENVIRONMENT.UAT1: return require('../../config/uat1.env.json')
    case ENVIRONMENT.PROD: return require('../../config/prod.env.json')
    case ENVIRONMENT.TEST1: return require('../../config/test1.env.json')
    case ENVIRONMENT.TEST2: return require('../../config/test2.env.json')
    case ENVIRONMENT.TEST3: return require('../../config/test3.env.json')
    default: return require('../../config/uat2.env.json')
  }
}

export const isProd = (env) => {
  if (env === 'PROD') {
    return true
  }
  return false
}

export const GOAL_TYPES = {
  EDUCATION   : 'EDUCATION',
  HOME_DEPOSIT: 'HOME_DEPOSIT',
  BIRTHDAY    : 'BIRTHDAY',
  CHRISTMAS   : 'CHRISTMAS',
  CUSTOM      : 'CUSTOM'
}

export const API_TYPES = {
  FUNDING_API: 'FUNDING_API',
  ACCOUNT_API: 'ACCOUNT_API',
  TRANSFERS_API: 'TRANSFERS_API',
  LW_READ: 'LW_READ',
  LW_WRITE: 'LW_WRITE',
  USER_POOL_ID: 'USER_POOL_ID',
  CLIENT_ID: 'CLIENT_ID',
  DETAIL_API: 'DETAIL_API',
  STATEMENTS: 'STATEMENTS',
  CONFIRMATIONS: 'CONFIRMATIONS',
  TRANSFER_NOW: 'TRANSFER_NOW',
  PERFORMANCE_API: 'PERFORMANCE_API'
}

// constants used for form types
// in presentation components
export const FORM_TYPES = {
  // used in 'GoalType' & 'AddGoal' component
  ADD_GOAL    : 'ADD_GOAL',

  // withdraw form
  WITHDRAW: 'WITHDRAW',

  // add investment
  ADD_INVESTMENT: 'ADD_INVESTMENT',

  // used in 'EditGoal' component
  EDIT_GOAL   : 'EDIT_GOAL',

  // edit recurring amount
  EDIT_RECURRING: 'EDIT_RECURRING',

  // used in 'AddChild'
  ADD_CHILD   : 'ADD_CHILD',

  // auth
  AUTH       : 'AUTH',

  // user in User Input screens
  ADD_USER    : 'ADD_USER',

  RESET_PASSWORD: 'RESET_PASSWORD',

  EDIT_PROFILE: 'EDIT_PROFILE',

  FORGOT_PASSWORD: 'FORGOT_PASSWORD',

  BANK_DETAILS: 'BANK_DETAILS',

  BANK_VERIFICATION_DETAILS: 'BANK_VERIFICATION_DETAILS'
}

export const SEGMENT_ACTIONS = {
  USER_SIGNED_UP: 'User Signed Up',
  USER_LOGIN_COGNITO_SUCCESS: 'User Login Cognito Success',
  USER_FETCH_SUCCESS: 'User Fetch Success',
  USER_DETAIL_FETCH_SUCCESS: 'User Detail Fetch Success',

  TERMS_CONDITIONS_ACCEPTED: 'Terms & Condition Accepted',
  PUSH_NOTIFICATION_CONFIRMED: 'Push Notification Confirmed',

  CHILD_ADDED: 'Child Added',
  GOAL_ADDED: 'Goal Added',

  PLAID_CONNECT_SUCCESSFUL: 'Plaid Connect Successful',
  TRANSFER_SUCCESS: 'Transfer Success',
  FUNDING_SOURCE_CONNECTED: 'Funding Source Connected',

  ADDING_CHILD: 'Adding Child',
  ADD_CHILD_RESPONSE : 'Add Child Response',
  ADDING_CHILD_ACCOUNT: 'Adding Child Account',
  ADDING_CHILD_ACCOUNT_RESPONSE: 'Adding Child Account Response',

  ADD_CHILD_ERROR : 'Add Child Error',
  ADD_CHILD_ACCOUNT_ERROR: 'Add child account error'
}

export const ANALYTIC_PROPERTIES = {
  EVENT_TYPE: 'event type',
  TPT_ACCOUNT_TYPE: 'TPT account type'
}
