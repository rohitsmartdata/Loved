/* eslint-disable no-trailing-spaces */
/**
 * Created by demon on 5/7/18.
 */

export const screens = {

  // launch screens
  LAUNCH_SCREEN: 'Pre Signup',
  PASSCODE: 'passcode',

  // authentication screens
  LOGIN: 'Login',
  SIGNUP: 'Collect Email Password',

  // onBoarding screens
  USER_DETAIL: 'User Name Detail',
  USER_DOB: 'User Date of birth',
  USER_PHONE_NUMBER: 'User Phone Number',
  // USER_ADDRESS: 'User Address',
  // USER_VERIFY_ID: 'User Verify ID',
  USER_RESIDENCY_TYPE: 'User Select Residency',
  USER_SSN: 'User SSN',
  USER_COUNTRY_BORN: 'User Country Born',
  USER_COUNTRY_CITIZENSHIP: 'User Country Citizenship',
  USER_EMPLOYEMENT_TYPE: 'User Employment Type',
  USER_ANNUAL_INCOME: 'User Annual Income',
  USER_ASSETS: 'User Assets',
  USER_RISK_PREFERENCE: 'User Risk Preference',
  USER_DECLARATIONS: 'User Declarations',

  ACCEPT_TERMS_CONDITIONS: 'Accept Terms',
  NOTIFICATIONS: 'Notifications',
  SET_PASSCODE: 'Set Passcode',

  // child flow
  CREATE_CHILD_NOTIFICATION: 'Create Child Notification',
  ENTER_CHILD_DETAIL: 'Enter Child Detail',
  ENTER_CHILD_DOB: 'Enter Child DOB',
  ENTER_USER_SSN: 'Enter User SSN',
  SKIP_USER_SSN: 'SKIP USER SSN',
  ENTER_CHILD_SSN: 'Enter Child SSN',
  SKIP_CHILD_SSN: 'SKIP CHILD SSN',
  REQUEST_CHILD_SSN: 'REQUEST_CHILD_SSN',
  BANK_VERIFICATION: 'BANK_VERIFICATION',

  // goal screens
  SELECT_GOAL_SCREEN: 'Select Goal',
  // SELECT_GOAL_AMOUNT: 'Select Goal Amount',
  SELECT_GOAL_DURATION: 'Select Goal Duration',
  SELECT_GOAL_PORTFOLIO: 'Select Goal Portfolio',
  SELECT_GOAL_FUND: 'Select Goal Fund',
  GOAL_CONFIRM: 'Goal Confirm',
  START_GOAL_INVESTING_SCREEN: 'Start Goal Investing',
  PREPARING_PORTFOLIO_SCREEN: 'Preparing portfolio',

  // investment screens
  SELECT_INVESTMENT_SCREEN: 'Select Investment',
  INVESTMENT_DETAIL_SCREEN: 'Investment Detail',
  // INVESTMENT_FUND_SCREEN: 'Investment Fund',
  // CONFIRM_INVESTMENT: 'Confirm Investment',

  BUY_INVESTMENT: 'Buy Investment',
  SELL_INVESTMENT: 'Sell Investment',

  // dream flow
  DREAM: 'Dream',
  DREAM_DETAIL: 'Dream description',
  DREAM_AMOUNT: 'Dream Amount',
  DREAM_FREQUENCY: 'Dream Frequency',

  // desire flow
  DESIRE: 'Desire',
  DESIRE_AMOUNT: 'Desire Amount',

  // invest flow
  CONNECT_BANK: 'CONNECT BANK',
  TRANSFER_UNDERWAY: 'transfer underway',
  SELECT_ACCOUNT_TYPE: 'Select Account Type',
  ENTER_ROUTING_NUMBER: 'Enter Routing Number',
  NOTIFY_MICRO_DEPOSIT_STATUS: 'Notify Micro Deposit Status',
  ENTER_ACCOUNT_NUMBER: 'Enter Account Number'
}

export const events = {

  // launch events
  OPEN_APP: 'open app',

  // authentication
  LOGIN: 'Sign in',
  LOGOUT: 'Log out',
  SIGNUP: 'Sign up finished',
  SIGNUP_PIN: 'Sign up pin',
  SIGNUP_RE_ENTER_PIN: 'Sign up re-enter pin',
  PASSWORD_RECOVERED: 'Password recovered',

  // onBoarding events
  ACCEPTED_TERMS: 'Sign up T&C accepted',
  REJECTED_TERMS: 'Rejected Terms Conditions',
  CHECKED_THIRD_PARTY_TERMS: 'Checked Third Party terms conditions',
  CHECKED_APEX_TERMS: 'Checked Apex Terms',

  PROFILE_QUESTION_1_ANSWERED: 'Question 1 answered',
  PROFILE_QUESTION_2_ANSWERED: 'Question 2 answered',
  PROFILE_QUESTION_3_ANSWERED: 'Question 3 answered',
  PROFILE_QUESTION_4_ANSWERED: 'Question 4 answered',
  COMPLIANCE_QUESTION_ANSWERED: 'Compliance question answered',

  ACCOUNT_KYC_START: 'Account KYC start',
  ACCOUNT_KYC_CHILD_NAME: 'Account KYC child name',
  ACCOUNT_KYC_DATE_OF_BIRTH: 'Account KYC date of birth',

  USER_ENTERED_SSN: 'Account KYC SSN',
  USER_ENTERED_CHILD_SSN: 'Account KYC kid SSN',

  SIGNUP_DATE_OF_BIRTH: 'Signup date of birth',
  SIGNUP_PHONE_NUMBER: 'Signup phone number',

  SIGNUP_EMAIL: 'Signup email',
  SIGNUP_PASSWORD: 'Signup password',

  USER_FILLED_ADDRESS: 'Account KYC address',

  ENABLED_NOTIFICATION: 'Enabled notification',
  CUSTODIAN_INFORMATION_STORED: 'Custodian information stored',
  DISABLED_NOTIFICATION: 'Disabled notification',
  NOTIFICATION_SETTING: 'Notifications settings set',

  // child flow
  SKIPPED_CHILD_NOTIFICATION_SCREEN: 'Skipped Child Notification',
  CHILD_ADDED: 'Account create click',
  ACCOUNT_CREATED: 'account created',
  SSN_INFORMATION_ADDED: 'ssn information added',
  VIEWED_WHAT_IS_CUSTODIAL_ACCOUNT: 'What is custodial account',

  SSN_REQUESTED: 'ssn requested',
  USER_SSN_STORED: 'user ssn stored',
  USER_SSN_STORED_SUCCESS: 'user ssn stored success',

  INVEST_WITH_GOAL: 'Invest with goal clicked',
  INVEST_WITH_PORTFOLIO: 'Invest with portfolio clicked',

  INVEST_OVERVIEW_VIEWED: 'Invest overview viewed',
  INVEST_PERFORMANCE_VIEWED: 'Invest performance viewed',

  // dream flow
  DREAM_CREATED: 'Investment instruction confirmed',
  DREAM_SKIPPED: 'Dream skipped',
  INVESTMENT_SELECTED: 'Investment selected',

  GOAL_VIEW: 'Goal view',
  GOAL_OPENED: 'Goal opened',
  GOAL_TOPUP_CLICK: 'Goal topup click',
  GOAL_WITHDRAW_CLICK: 'Goal withdraw click',
  GOAL_TOPUP_INSTRUCTION_CONFIRMED: 'Goal topup instruction confirmed',
  WITHDRAWAL_INSTRUCTION_CONFIRMED: 'Withdrawal instruction confirmed',

  // desire flow
  DESIRE_CREATED: 'Desire created',
  GOAL_CREATE_START: 'Goal create start',
  GOAL_CREATE_FUND: 'Goal create fund',
  GOAL_CREATE_AGE: 'Goal create age',
  GOAL_CREATE_PORTFOLIO: 'Goal create portfolio',
  GOAL_CREATE_TOPUP: 'Goal create topup',
  GOAL_CREATION_CONFIRMED: 'Goal creation confirmed',

  // transaction flow
  BUY: 'buy',
  SELL: 'sell',

  // invest flow
  PLAID_INITIATED: 'Bank setup started',
  BANK_SETUP_ERROR: 'Bank setup error',
  SKIPPED_BANK: 'Skipped Bank',
  FUNDING_SOURCE_LINKED: 'Bank setup success',
  FUNDING_AMOUNT_VERIFY: 'funding amount verify',
  MICRO_DEPOSIT_INTIATED: 'Micro Deposit initiated',
  MICRO_DEPOSIT_REQUESTED: 'Micro Deposit Requested',
  RE_AUTHENTICATE_BANK_ACCOUNT: 're-authenticate bank account'
}

export const errorKeywords = {

  // child loop errors
  TPT_ACCOUNT_ERROR: 'TPT Account Creation Error : ',
  ADD_CHILD_ERROR: 'Add Child Error : ',

  // desire loop errors
  ADD_DESIRE_ERROR: 'Add Desire Error : ',

  // dream loop error
  ADD_DREAM_ERROR: 'Add Dream Error : ',
  PERFORMANCE_DATA_FETCH_ERROR: 'Performance Data Fetch Error : ',
  INVEST_CHART_DATA_FETCH_ERROR: 'Investment chart Data Fetch Error : ',

  // learning loop error
  FETCH_LEARNING_ERROR: 'Fetch Learning Module Error : ',

  // common loop
  PRODUCT_FETCH_ERROR: 'Product Fetch Error : ',
  DETAIL_FETCH_ERROR: 'Detail Fetch Error : ',
  USER_FETCH_ERROR: 'User Fetch Error : ',
  TRANSFER_ERROR: 'Transfer Error : ',
  WITHDRAW_ERROR: 'WITHDRAW Error : ',
  PLAID_LINK_ERROR: 'Plaid Link Error : ',
  VERIFY_FUNDING_AMOUNT: 'Verify Funding Amount Error : ',
  RE_AUTHENTICATE_BANK_ACCOUNT: 'Re-Authenticate Bank Account Error : ',
  MODIFY_RECURRING_INSTRUCTION: 'Modify Recurring Instruction : ',
  MODIFY_RECURRING_AMOUNT: 'Modify Recurring Amount : ',
  FETCH_USER_INSTRUCTION_ERROR: 'Fetch User Instruction Error : ',
  FETCH_USER_TRANSACTIONS_ERROR: 'Fetch User Transactions Error : ',

  // signup loop
  SIGNUP_ERROR: 'Signup Error : ',
  LOGIN_ERROR: 'Login Error : '
}
