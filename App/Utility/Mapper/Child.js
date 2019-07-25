/* eslint-disable no-trailing-spaces,key-spacing,no-multiple-empty-lines */
/**
 * Created by viktor on 21/6/17.
 */

// ========================================================
// CHILD Object
// ========================================================

// Entities
export const CHILD_ENTITIES = {

  // ----- BUSINESS entities -----

  // child's photo
  AVATAR : 'avatar',

  USER_ID     : 'userID',

  CHILD_ID    : 'childID',

  CHILD_IDs   : 'childIDs',

  // child's Social Security number
  SSN: 'SSN',
  // Child's First Name
  FIRST_NAME  : 'firstName',
  // Child's Last Name
  LAST_NAME   : 'lastName',
  // Date of Birth
  DOB         : 'DOB',
  // child's emailID,
  EMAIL_ID    : 'emailID',

  // image url
  IMAGE_URL  : 'imageUrl',
  // store image here
  CHILD_IMAGE : 'childImage',

  // is ssn added for the child
  IS_SSN_ADDED: 'isSSNAdded',

  // is bank added for the child
  IS_BANK_ADDED: 'isBankAdded',

  // citizenship of child
  CITIZENSHIP: 'citizenship',
  // employement status
  EMPLOYMENT_STATUS: 'employmentStatus',
  // phone number of child
  PHONE_NUMBER: 'phoneNumber',
  // address line 1
  ADDRESS_LINE_1: 'addressLine1',
  // city
  CITY: 'city',
  // state
  STATE: 'state',
  // postal code
  ZIP_CODE: 'zipCode',

  // document statements
  STATEMENTS: 'statements',
  // transfer confirmations
  CONFIRMATIONS: 'confirmations',

  // portfolio of child account
  PORTFOLIO: 'portfolio',
  // current value of child's portfolio
  CURRENT_VALUE: 'currentValue',
  // available value
  AVAILABLE_VALUE: 'availableValue',
  // pendingTransfer
  PENDING_TRANSFER_AMOUNT: 'pendingTransferAmount',
  // pending withdrawal amount
  PENDING_WITHDRAWAL_AMOUNT: 'pendingWithdrawalAmount',
  // current growth of child's portfolio in %
  GROWTH_IN_PERCENTAGE: 'growthInPercentage',
  // current growth of child's portfolio in number
  GROWTH_IN_VALUE: 'growthInValue',
  // total contributions over child portfolio
  TOTAL_CONTRIBUTIONS: 'totalContributions',

  LAST_UPDATED_TIME: 'lastUpdatedTime',

  STOCK_PERFORMANCE: 'stockPerformance',
  STOCK_PERFORMANCE_AGE: 'age',
  STOCK_PERFORMANCE_INVESTED_AMOUNT: 'investedAmount',
  STOCK_PERFORMANCE_MARKET_VALUE: 'marketValue',

  // ----- Store specific entities -----
  CHILD_ID_INDEX: 'CHILD_ID_INDEX',

  STOCK_PERFORMANCE_DATA: 'STOCK_PERFORMANCE_DATA',

  LIST_INDEX: 'LIST_INDEX',

  CHART_DATA: 'CHART_DATA',

  CHILD_DETAIL_DATA: 'CHILD_DETAIL_DATA',

  BD_ACCOUNT_ID: 'BD_ACCOUNT_ID',
  BD_ACCOUNT_STATUS: 'BD_ACCOUNT_STATUS',
  BROKER_DEALER_DATA: 'BROKER_DEALER_DATA',
  SPROUT_FUNDING_STATUS: 'sprout_funding_status',
  SPROUT_ACCOUNT_STATUS: 'sprout_account_status',

  // stocks
  STOCKS: 'stocks',
  STOCK_NAME: 'stockName',
  STOCK_TICKER: 'stockTicker',
  STOCK_AMOUNT: 'stockAmount',
  STOCK_UNIT_PRICE: 'stockUnitPrice',
  STOCK_UNITS: 'stockUnits',
  STOCK_CURRENT_VALUE: 'stockCurrentValue',
  STOCK_GROWTH_IN_PERCENTAGE: 'stockGrowthInPercentage',
  STOCK_GROWTH_IN_VALUE: 'stockGrowthInValue',

  IS_ADDING_DREAM: 'isAddingDream',
  IS_ADDING_DESIRE: 'isAddingDesire',
  SHOULD_UPDATE_ONBOARDING: 'shouldUpdateOnboarding',
  IS_ADDING_NEW_DREAM: 'isAddingNewDream',


  DEBUG_LOG: 'debugLog',
  NUMBER_OF_CHILDREN_AT_START: 'numberOfChildrenAtStart',

  MARK_REQUEST_SSN: 'MARK_REQUEST_SSN',

  UNIQUE_CODE: 'UNIQUE_CODE',

  UNIQUE_URL: 'UNIQUE_URL',

  SSN_REQUEST_PHONE_NUMBER: 'SSN_REQUEST_PHONE_NUMBER',

  SHOULD_STORE_USER_SSN: 'SHOULD_STORE_USER_SSN',

  // ----- UTILITY entities -----

  // are there any error's in child object functioining
  IS_OK     : 'OK',
  // error related to goal module
  ERROR     : 'ERROR',
  // processing index tag
  PROCESSING: 'PROCESSING',

  // processing add child
  ADD_CHILD_PROCESSING: 'add child processing',

  PROCESSING_CREATE_CHILD_ACCOUNT: 'processingCreateChildAccount',

  PROCESSING_FETCH_STOCK_PERFORMANCE_DATA: 'processingFetchStockPerformanceData',

  FETCH_CHART_DATA_PROCESSING: 'processingFetchChartData',

  PROCESSING_SHOW_DOCUMENTS: 'processingShowDocuments',

  PROCESSING_SHOW_CONFIRMATIONS: 'processingShowConfirmations',

  SHOW_BROKER_DEALER_CHILD_INFO: 'SHOW_BROKER_DEALER_CHILD_INFO',

  IS_UPDATING_CHILD_IMAGE: 'isUpdatingChildImage',

  IMAGE_META_DATA: 'imageMetadata'
}

/*
  children : {

    sanity : {
      OK,
      ERROR,
      PROCESSING
    },

    [CHILD_ID] : {
      info : { }
    }
  }
 */
export function path (ENTITIY) {
  switch (ENTITIY) {

    // ----- Business entity paths -----

    case CHILD_ENTITIES.AVATAR:
      return (childID) => {
        // when childID not present, simply return avatar
        // from non childID specific path
        return childID ? [CHILD_ENTITIES.LIST_INDEX, [childID], CHILD_ENTITIES.AVATAR] : [CHILD_ENTITIES.AVATAR]
      }

    case CHILD_ENTITIES.CHILD_ID_INDEX:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID]]

    case CHILD_ENTITIES.LIST_INDEX:
      return () => [CHILD_ENTITIES.LIST_INDEX]

    case CHILD_ENTITIES.CHILD_ID:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, [childID], CHILD_ENTITIES.CHILD_ID]

    case CHILD_ENTITIES.LAST_UPDATED_TIME:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, [childID], CHILD_ENTITIES.LAST_UPDATED_TIME]

    case CHILD_ENTITIES.FIRST_NAME:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.FIRST_NAME]

    case CHILD_ENTITIES.LAST_NAME:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.LAST_NAME]

    case CHILD_ENTITIES.DOB:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.DOB]

    case CHILD_ENTITIES.IS_SSN_ADDED:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.IS_SSN_ADDED]

    case CHILD_ENTITIES.IS_BANK_ADDED:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.IS_BANK_ADDED]

    case CHILD_ENTITIES.BD_ACCOUNT_ID:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.BD_ACCOUNT_ID]

    case CHILD_ENTITIES.BD_ACCOUNT_STATUS:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.BD_ACCOUNT_STATUS]

    case CHILD_ENTITIES.SPROUT_FUNDING_STATUS:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.SPROUT_FUNDING_STATUS]

    case CHILD_ENTITIES.SPROUT_ACCOUNT_STATUS:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.SPROUT_ACCOUNT_STATUS]

    case CHILD_ENTITIES.BROKER_DEALER_DATA:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.BROKER_DEALER_DATA]

    case CHILD_ENTITIES.STATEMENTS:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.STATEMENTS]

    case CHILD_ENTITIES.CONFIRMATIONS:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.CONFIRMATIONS]

    case CHILD_ENTITIES.PORTFOLIO:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.PORTFOLIO]

    case CHILD_ENTITIES.STOCKS:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.STOCKS]

    case CHILD_ENTITIES.STOCK_PERFORMANCE:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.STOCK_PERFORMANCE]

    case CHILD_ENTITIES.STOCK_PERFORMANCE_AGE:
      return (childID, age) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.STOCK_PERFORMANCE, age, CHILD_ENTITIES.STOCK_PERFORMANCE_AGE]

    case CHILD_ENTITIES.STOCK_PERFORMANCE_INVESTED_AMOUNT:
      return (childID, age) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.STOCK_PERFORMANCE, age, CHILD_ENTITIES.STOCK_PERFORMANCE_INVESTED_AMOUNT]

    case CHILD_ENTITIES.STOCK_PERFORMANCE_MARKET_VALUE:
      return (childID, age) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.STOCK_PERFORMANCE, age, CHILD_ENTITIES.STOCK_PERFORMANCE_MARKET_VALUE]

    case CHILD_ENTITIES.CURRENT_VALUE:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.PORTFOLIO, CHILD_ENTITIES.CURRENT_VALUE]
    case CHILD_ENTITIES.AVAILABLE_VALUE:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.PORTFOLIO, CHILD_ENTITIES.AVAILABLE_VALUE]
    case CHILD_ENTITIES.PENDING_TRANSFER_AMOUNT:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.PORTFOLIO, CHILD_ENTITIES.PENDING_TRANSFER_AMOUNT]
    case CHILD_ENTITIES.PENDING_WITHDRAWAL_AMOUNT:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.PORTFOLIO, CHILD_ENTITIES.PENDING_WITHDRAWAL_AMOUNT]
    case CHILD_ENTITIES.GROWTH_IN_PERCENTAGE:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.PORTFOLIO, CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]
    case CHILD_ENTITIES.GROWTH_IN_VALUE:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.PORTFOLIO, CHILD_ENTITIES.GROWTH_IN_VALUE]
    case CHILD_ENTITIES.TOTAL_CONTRIBUTIONS:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.PORTFOLIO, CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]

    case CHILD_ENTITIES.CHART_DATA:
      return (CHILD_ID) => [CHILD_ENTITIES.LIST_INDEX, [CHILD_ID], CHILD_ENTITIES.CHART_DATA]

    case CHILD_ENTITIES.IMAGE_URL:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.IMAGE_URL]

    case CHILD_ENTITIES.CHILD_IMAGE:
      return (childID) => [CHILD_ENTITIES.LIST_INDEX, childID, CHILD_ENTITIES.CHILD_IMAGE]

    // ----- Store specific entity paths-----

    case CHILD_ENTITIES.NUMBER_OF_CHILDREN_AT_START:
      return () => [CHILD_ENTITIES.DEBUG_LOG, CHILD_ENTITIES.NUMBER_OF_CHILDREN_AT_START]

    // ----- Utility paths -----
    case CHILD_ENTITIES.IS_OK:
      return () => ['sanity', CHILD_ENTITIES.IS_OK]
    case CHILD_ENTITIES.ERROR:
      return () => ['sanity', CHILD_ENTITIES.ERROR]
    case CHILD_ENTITIES.PROCESSING:
      return () => ['sanity', CHILD_ENTITIES.PROCESSING]
    case CHILD_ENTITIES.IS_UPDATING_CHILD_IMAGE:
      return () => [CHILD_ENTITIES.IS_UPDATING_CHILD_IMAGE]
  }
}
