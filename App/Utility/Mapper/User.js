/* eslint-disable key-spacing,no-trailing-spaces */
/**
 * Created by viktor on 14/7/17.
 */

// ========================================================
// User Entities
// ========================================================

export const USER_ENTITIES = {

  // ----- BUSINESS entities -----

  // USER ID
  USER_ID   : 'userID',
  // Full name of user
  FULL_NAME: 'fullName',
  // user's legal first name
  FIRST_NAME: 'firstName',
  // user's legal last name
  LAST_NAME: 'lastName',
  // middle initial
  MIDDLE_INITIAL: 'middleInitial',
  // user's Date of Birth
  DOB: 'DOB',
  // user's email ID
  EMAIL_ID: 'emailID',
  // risk score
  RISK_SCORE: 'riskScore',

  // user's phone number
  PHONE_NUMBER: 'phoneNumber',
  // user's ADDRESS
  ADDRESS_LINE_1: 'addressLine1',
  ADDRESS_LINE_2: 'addressLine2',
  CITY: 'city',
  STATE: 'state',
  ZIP_CODE: 'zipCode',
  LOCATION: 'location',
  FULL_ADDRESS: 'fullAddress',

  // USER'S SSN
  SSN : 'userSSN',

  // image url from the api
  IMAGE_URL: 'imageUrl',
  // store the actual image
  USER_IMAGE: 'userImage',

  // upload user image processing
  UPDATE_USER_IMAGE_PROCESSING: 'updateUserImageProcessing',
  // selected child
  SELECTED_CHILD: 'selectedChild',

  // employment type
  EMPLOYMENT_TYPE: 'employementType',
  // salary per year
  SALARY_PER_YEAR: 'salaryPerYear',
  // user's total value
  USER_TOTAL_VALUE: 'userTotalValue',
  // user investor type
  INVESTOR_TYPE: 'investorType',
  // residency type
  RESIDENCY_TYPE: 'residencyType',
  // residency type = US Citizen
  CITIZEN: 'citizen',
  // residency type = Greencard
  GREENCARD: 'greencard',
  // residency type = Visa
  VISA: 'visa',
  // other type of residency except visa, greencard, citizen
  OTHER_RESIDENCY: 'otherResidency',
  // no residency
  // used when accessing user onboarding screen's without signup
  NO_RESIDENCY: 'noResidency',
  // in which country user was born
  COUNTRY_BORN: 'countryBorn',
  // which country does he hold citizenship
  COUNTRY_CITIZENSHIP: 'countryCitizenship',
  // user visa type
  VISA_TYPE: 'visaType',
  // expiry date of visa
  VISA_EXPIRY: 'visaExpiry',

  // has family member in another brokerage
  FAMILY_BROKERAGE_FLAG: 'familyBrokerageFlag',
  // stock ticker relate to another brokerage firm
  STOCK_TICKER: 'stockTicker',

  // any member of family associated with politics
  FAMILY_POLITICAL_FLAG: 'familyPoliticalFlag',
  // name of political organisation
  POLITICAL_ORGANISATION: 'politicalOrganisation',
  // name of associated person
  POLITICAL_ASSOCIATED_RELATIVE: 'politicalAssociatedRelative',

  // any member part of another brokerage firm stakeholder
  STOCK_OWNER_FLAG: 'stockOwnerFlag',
  // name of the brokerage firm
  STOCK_BROKERAGE_FIRM: 'stockBrokerageFirm',

  // plaid account id
  PLAID_ACCOUNT_ID: 'plaidAccountID',
  // plaid account public token
  PLAID_PUBLIC_TOKEN: 'plaidPublicToken',
  // funding source id
  CURRENT_FUNDING_SOURCE_ID: 'current_funding_source_id',
  // status of funding source
  CURRENT_FUNDING_SOURCE_STATUS: 'current_funding_source_status',
  // account number of funding source
  CURRENT_FUNDING_SOURCE_ACCOUNT: 'current_funding_source_account',
  // funding status of user
  FUNDING_STATUS: 'funding_status',
  // account number of funding source
  SOURCE_REFERENCE_ID: 'source_reference_id',
  // is plaid linked
  PLAID_LINKED: 'plaidLinked',

  AVAILABLE_VALUE: 'availableValue',
  CURRENT_VALUE: 'currentValue',
  TOTAL_CONTRIBUTIONS: 'totalContribution',
  GROWTH_IN_VALUE: 'growthInValue',
  GROWTH_IN_PERCENTAGE: 'growthInPercentage',
  PENDING_TRANSFER_AMOUNT: 'pendingTransferAmount',
  PENDING_WITHDRAWAL_AMOUNT: 'pendingWithdrawalAmount',

  LAST_UPDATED_TIME: 'lastUpdatedTime',

  CROSSED_CHILD_SSN: 'crossedChildSSN',

  NAV_TAB: 'navTab',
  TAB: 'tab',
  TAB_IS_GOAL: 'tabIsGoal',

  // tpt account id
  ACCOUNT_ID: 'accountID',

  IS_PLAID_LINKED: 'isPlaidLinked',

  IS_SSN_ADDED: 'isSSNAdded',

  IS_BANK_ADDED: 'isBankAdded',

  SHOW_BANK_DISCONNECT_NOTIFICATION: 'showBankDisconnectNotification',

  DEBUG_MODE: 'debugMode',

  INTERNET_CONNECTED: 'internetConnected',

  SHOULD_REFRESH: 'shouldRefresh',

  STOCKS: 'stocks',

  // ----- Store specific entities -----

  // entity representing data fetched from server
  USER_DATA : 'USER_DATA',
  // identity check data
  IDENTITY_DATA: 'identityData',
  // user detail
  USER_DETAIL: 'USER_DETAIL',

  DUMMY_DATA: 'DUMMY_DATA',

  TODO_LIST: 'todoList',

  TODO_PENDING: 'pending',
  TODO_COMPLETE: 'complete',

  DEBUG_DATA: 'debugData',
  LATEST_USER_DETAIL_ID: 'latestUserDetailID',

  GLOSSARY: 'glossary',
  GLOSSARY_HEADER: 'header',
  GLOSSARY_BODY: 'body',
  GLOSSARY_SCREEN_DASHBOARD: 'Get Started with Loved',
  GLOSSARY_KEYWORD_INVESTED: 'Invested',
  GLOSSARY_KEYWORD_EARNINGS: 'Earnings',
  GLOSSARY_KEYWORD_PENDING_BALANCE: 'Pending Balance',

  GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_INVESTMENT: 'What is investment',
  GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_COULD_YOU_LEARN_FROM_IT: 'What could you learn from it',
  GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_INVESTMENT_RISK: 'What is the investment risk',
  GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_PRICE: 'What is its price',
  GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_DOES_STOCK_REPRESENT: 'What does the stock represent',
  GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_DIVIDEND: 'Portfolio Detail dividend',
  GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_EXPENSES: 'Portfolio Detail expenses',
  GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_ANNUAL_GROWTH: 'Portfolio Detail annual growth',
  GLOSSARY_KEYWORD_GOAL_AMOUNT_WHY_RISK_MATTERS: 'Goal Amount - Why Risk matters',
  GLOSSARY_KEYWORD_UNITS_OF_STOCK_YOU_OWN: 'Units of stock you own ?',
  GLOSSARY_KEYWORD_VALUE_OF_STOCK_YOU_OWN: 'Value of stock you own ?',

  // ----- UTILITY entities -----

  IS_OK     : 'OK',
  // error related to goal module
  ERROR     : 'ERROR',
  // processing index tag
  PROCESSING: 'PROCESSING',
  // fetching user data from server
  PROCESSING_FETCH_USER: 'PROCESSING_FETCH_USER',
  // plaid linking in progress
  PROCESSING_PLAID_LINKING: 'PROCESSING_PLAID_LINKING',
  // processing user detail fetch
  PROCESSING_USER_DETAIL_FETCH: 'PROCESSING_USER_DETAIL_FETCH',
  // processing query account api
  PROCESSING_QUERY_ACCOUNT_API: 'PROCESSING_QUERY_ACCOUNT_API',
  // Processing linking funding source
  PROCESSING_LINK_FUNDING_SOURCE: 'PROCESSING_LINK_FUNDING_SOURCE',
  // Processing verifing funding source
  PROCESSING_VERIFY_FUNDING_SOURCE: 'PROCESSING_VERIFY_FUNDING_SOURCE',
  // processing user instructions fetch
  PROCESSING_FETCH_USER_INSTRUCTIONS: 'PROCESSING_FETCH_USER_INSTRUCTIONS',
  // processing modify user instructino
  PROCESSING_MODIFY_USER_INSTRUCTION: 'PROCESSING_MODIFY_USER_INSTRUCTION',
  // processing fetch glossary
  PROCESSING_USER_GLOSSARY: 'PROCESSING_USER_GLOSSARY',
  // processing storage of user ssn
  PROCESSING_STORE_USER_SSN: 'PROCESSING_STORE_USER_SSN',
  // processing delete account
  PROCESSING_DELETE_ACCOUNT: 'PROCESSING_DELETE_ACCOUNT',
  // processing disconnect bank
  PROCESSING_DISCONNECT_BANK: 'PROCESSING_DISCONNECT_BANK',

  // user completeness  step identifier
  INPUT_USER_DETAIL_SCREEN: 'INPUT_USER_DETAIL_SCREEN',

  // Bank details
  BANK_ROUTING_NUMBER: 'BANK_ROUTING_NUMBER',
  BANK_ACCOUNT_TYPE: 'BANK_ACCOUNT_TYPE',
  BANK_ACCOUNT_NUMBER: 'BANK_ACCOUNT_NUMBER',
  BANK_PIN: 'BANK_PIN',
  CONFIRM_BANK_ACCOUNT_NUMBER: 'CONFIRM_BANK_ACCOUNT_NUMBER',
  FIRST_AMOUNT: 'amount1',
  SECOND_AMOUNT: 'amount2',
  FIRST_AMOUNT_NEXT: 'verifyAmount1',
  SECOND_AMOUNT_NEXT: 'verifyAmount2'
}

export function path (ENTITIY) {
  switch (ENTITIY) {

    // ----- Business entity paths -----
    case USER_ENTITIES.USER_ID:
      return () => ['info', USER_ENTITIES.USER_ID]

    case USER_ENTITIES.FIRST_NAME:
      return () => ['info', USER_ENTITIES.FIRST_NAME]

    case USER_ENTITIES.MIDDLE_INITIAL:
      return () => ['info', USER_ENTITIES.MIDDLE_INITIAL]

    case USER_ENTITIES.LAST_NAME:
      return () => ['info', USER_ENTITIES.LAST_NAME]

    case USER_ENTITIES.EMAIL_ID:
      return () => ['info', USER_ENTITIES.EMAIL_ID]

    case USER_ENTITIES.PHONE_NUMBER:
      return () => ['info', USER_ENTITIES.PHONE_NUMBER]

    case USER_ENTITIES.RISK_SCORE:
      return () => ['info', USER_ENTITIES.RISK_SCORE]

    case USER_ENTITIES.ACCOUNT_ID:
      return () => ['info', USER_ENTITIES.ACCOUNT_ID]

    case USER_ENTITIES.DEBUG_MODE:
      return () => ['info', USER_ENTITIES.DEBUG_MODE]

    case USER_ENTITIES.CROSSED_CHILD_SSN:
      return () => ['info', USER_ENTITIES.CROSSED_CHILD_SSN]

    case USER_ENTITIES.INTERNET_CONNECTED:
      return () => [USER_ENTITIES.INTERNET_CONNECTED]

    case USER_ENTITIES.CURRENT_FUNDING_SOURCE_ID:
      return () => ['info', USER_ENTITIES.CURRENT_FUNDING_SOURCE_ID]

    case USER_ENTITIES.CURRENT_FUNDING_SOURCE_STATUS:
      return () => ['info', USER_ENTITIES.CURRENT_FUNDING_SOURCE_STATUS]

    case USER_ENTITIES.CURRENT_FUNDING_SOURCE_ACCOUNT:
      return () => ['info', USER_ENTITIES.CURRENT_FUNDING_SOURCE_ACCOUNT]

    case USER_ENTITIES.IS_BANK_ADDED:
      return () => ['info', USER_ENTITIES.IS_BANK_ADDED]

    case USER_ENTITIES.FUNDING_STATUS:
      return () => ['info', USER_ENTITIES.FUNDING_STATUS]

    case USER_ENTITIES.CURRENT_VALUE:
      return () => ['info', USER_ENTITIES.CURRENT_VALUE]

    case USER_ENTITIES.AVAILABLE_VALUE:
      return () => ['info', USER_ENTITIES.AVAILABLE_VALUE]

    case USER_ENTITIES.PENDING_TRANSFER_AMOUNT:
      return () => ['info', USER_ENTITIES.PENDING_TRANSFER_AMOUNT]

    case USER_ENTITIES.PENDING_WITHDRAWAL_AMOUNT:
      return () => ['info', USER_ENTITIES.PENDING_WITHDRAWAL_AMOUNT]

    case USER_ENTITIES.TOTAL_CONTRIBUTIONS:
      return () => ['info', USER_ENTITIES.TOTAL_CONTRIBUTIONS]

    case USER_ENTITIES.GROWTH_IN_VALUE:
      return () => ['info', USER_ENTITIES.GROWTH_IN_VALUE]

    case USER_ENTITIES.GROWTH_IN_PERCENTAGE:
      return () => ['info', USER_ENTITIES.GROWTH_IN_PERCENTAGE]

    case USER_ENTITIES.LAST_UPDATED_TIME:
      return () => ['info', USER_ENTITIES.LAST_UPDATED_TIME]

    case USER_ENTITIES.INPUT_USER_DETAIL_SCREEN:
      return () => ['info', USER_ENTITIES.INPUT_USER_DETAIL_SCREEN]

    case USER_ENTITIES.TODO_LIST:
      return () => [USER_ENTITIES.TODO_LIST]

    case USER_ENTITIES.IS_PLAID_LINKED:
      return () => ['info', USER_ENTITIES.IS_PLAID_LINKED]

    case USER_ENTITIES.SOURCE_REFERENCE_ID:
      return () => ['info', USER_ENTITIES.SOURCE_REFERENCE_ID]

    case USER_ENTITIES.IS_SSN_ADDED:
      return () => ['info', USER_ENTITIES.IS_SSN_ADDED]

    case USER_ENTITIES.SHOW_BANK_DISCONNECT_NOTIFICATION:
      return () => ['info', USER_ENTITIES.SHOW_BANK_DISCONNECT_NOTIFICATION]

    case USER_ENTITIES.IMAGE_URL:
      return () => ['info', USER_ENTITIES.IMAGE_URL]

    case USER_ENTITIES.UPDATE_USER_IMAGE_PROCESSING:
      return () => ['info', USER_ENTITIES.UPDATE_USER_IMAGE_PROCESSING]

    case USER_ENTITIES.USER_IMAGE:
      return () => ['info', USER_ENTITIES.USER_IMAGE]

    case USER_ENTITIES.STOCKS:
      return () => ['info', USER_ENTITIES.STOCKS]

    case USER_ENTITIES.TAB:
      return () => [USER_ENTITIES.NAV_TAB, USER_ENTITIES.TAB]

    case USER_ENTITIES.TAB_IS_GOAL:
      return () => [USER_ENTITIES.NAV_TAB, USER_ENTITIES.TAB_IS_GOAL]

    case USER_ENTITIES.GLOSSARY:
      return () => [USER_ENTITIES.GLOSSARY]

    case USER_ENTITIES.GLOSSARY_SCREEN_DASHBOARD:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_SCREEN_DASHBOARD]
    case USER_ENTITIES.GLOSSARY_KEYWORD_INVESTED:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_INVESTED]
    case USER_ENTITIES.GLOSSARY_KEYWORD_EARNINGS:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_EARNINGS]
    case USER_ENTITIES.GLOSSARY_KEYWORD_PENDING_BALANCE:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_PENDING_BALANCE]
    case USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_INVESTMENT:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_INVESTMENT]
    case USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_COULD_YOU_LEARN_FROM_IT:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_COULD_YOU_LEARN_FROM_IT]
    case USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_INVESTMENT_RISK:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_INVESTMENT_RISK]
    case USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_PRICE:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_IS_PRICE]
    case USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_DOES_STOCK_REPRESENT:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_WHAT_DOES_STOCK_REPRESENT]
    case USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_DIVIDEND:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_DIVIDEND]
    case USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_EXPENSES:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_EXPENSES]
    case USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_ANNUAL_GROWTH:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_PORTFOLIO_DETAIL_ANNUAL_GROWTH]
    case USER_ENTITIES.GLOSSARY_KEYWORD_GOAL_AMOUNT_WHY_RISK_MATTERS:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_GOAL_AMOUNT_WHY_RISK_MATTERS]
    case USER_ENTITIES.GLOSSARY_KEYWORD_UNITS_OF_STOCK_YOU_OWN:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_UNITS_OF_STOCK_YOU_OWN]
    case USER_ENTITIES.GLOSSARY_KEYWORD_VALUE_OF_STOCK_YOU_OWN:
      return () => [USER_ENTITIES.GLOSSARY, USER_ENTITIES.GLOSSARY_KEYWORD_VALUE_OF_STOCK_YOU_OWN]

    // ----- Store specific entity paths-----
    case USER_ENTITIES.IDENTITY_DATA:
      return () => [USER_ENTITIES.IDENTITY_DATA]

    case USER_ENTITIES.SELECTED_CHILD:
      return () => [USER_ENTITIES.SELECTED_CHILD]

    case USER_ENTITIES.LATEST_USER_DETAIL_ID:
      return () => [USER_ENTITIES.DEBUG_DATA, USER_ENTITIES.LATEST_USER_DETAIL_ID]

    // ----- Utility paths -----
    case USER_ENTITIES.IS_OK:
      return () => ['sanity', USER_ENTITIES.IS_OK]
    case USER_ENTITIES.ERROR:
      return () => ['sanity', USER_ENTITIES.ERROR]
    case USER_ENTITIES.PROCESSING:
      return () => ['sanity', USER_ENTITIES.PROCESSING]
  }
}
