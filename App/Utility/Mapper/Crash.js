/* eslint-disable no-trailing-spaces */
/**
 * Created by demon on 18/6/18.
 */

export const CRASH_CONSTANTS = {

  // ------------------------------------------------------------
  // Sign-up Flow
  SIGNUP_REQUEST_ATTEMPT: 'signup_request_ATTEMPT',     // attempting to send signup request
  SIGNUP_REQUEST_SUCCESS: 'signup_request_SUCCESS',     // signup request to cognito is successful

  // ------------------------------------------------------------
  // Login Flow
  LOGIN_REQUEST_ATTEMPT: 'login_request_ATTEMPT',       // attempting to send login request
  LOGIN_REQUEST_SUCCESS: 'login_request_SUCCESS',       // login request is successful

  // ------------------------------------------------------------
  // on boarding flow
  ONBOARDING_SCREEN_USER_DETAIL: 'screen::onboarding_user_detail',
  ONBOARDING_SCREEN_DOB: 'screen::onboarding_date_of_birth',
  ONBOARDING_SCREEN_ADDRESS: 'screen::onboarding_address',
  ONBOARDING_SCREEN_SELECT_RESIDENCY: 'screen::onboarding_select_residency',
  ONBOARDING_SCREEN_SSN: 'screen::onboarding_ssn',
  ONBOARDING_SCREEN_BORN_COUNTRY: 'screen::onboarding_born_country',
  ONBOARDING_SCREEN_CITIZENSHIP_COUNTRY: 'screen::onboarding_citizenship_country',
  ONBOARDING_SCREEN_SELECT_VISA: 'screen::onboarding_select_visa',
  ONBOARDING_SCREEN_VISA_EXPIRY: 'screen::onboarding_visa_expiry',
  ONBOARDING_SCREEN_EMPLOYMENT_TYPE: 'screen::onboarding_employment_type',
  ONBOARDING_SCREEN_ANNUAL_INCOME: 'screen::onboarding_annual_income',
  ONBOARDING_SCREEN_TOTAL_WORTH: 'screen::onboarding_total_worth',
  ONBOARDING_SCREEN_RISK_TYPE: 'screen::onboarding_risk_type',
  ONBOARDING_SCREEN_COMPLIANCE_QUESTIONS: 'screen::onboarding_compliance_question',

  TERMS_CONDITIONS_SCREEN: 'screen::accept_terms_conditions',
  TERMS_ACCEPTED: 'terms_accepted',
  TERMS_ACCEPTED_USER_DATA_CAPTURED_ON_COMPLETION: 'terms_accepted_user_data_captured_on_completion',     // whether or not the capturing on user data from form into reducer is successful

  CONFIRM_NOTIFICATION_SCREEN: 'screen::confirm_notification',

  PASSCODE_SCREEN: 'screen::passcode',

  // ------------------------------------------------------------
  // Child Flow
  ADD_CHILD_REQUEST_ATTEMPT: 'add_child_request_ATTEMPT',
  ADD_CHILD_REQUEST_SUCCESS: 'add_child_request_SUCCESS',

  ADD_CHILD_TPT_CREATE_ACCOUNT_ATTEMPT: 'add_child_tpt_create_account_attempt',
  ADD_CHILD_TPT_CREATE_ACCOUNT_SUCCESS: 'add_child_tpt_create_account_success'
}
