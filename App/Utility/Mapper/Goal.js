/* eslint-disable key-spacing,no-trailing-spaces,no-multiple-empty-lines */
/**
 * Created by viktor on 4/6/17.
 */

// ========================================================
// ADD_GOAL Component
// ========================================================

// Entities
export const GOAL_ENTITIES = {

  GOALS: 'goals',
  TYPE: 'type',
  // ----- BUSINESS entities -----

  // CHILD ID, for whom this goal belongs
  USER_ID : 'userID',

  CID     : 'childID',
  // GOAL ID,
  GID     : 'goalID',

  // Name of the goal
  NAME    : 'name',

  // IMAGE URL
  IMAGE_URL : 'imageUrl',

  // goal image
  GOAL_IMAGE : 'goalImage',

  // goal custom name
  CUSTOM_NAME: 'customName',

  // total value of the goal
  GOAL_AMOUNT     : 'totalAmount',

  // cost expected
  COST_EXPECTED: 'costExpected',

  // goal's current balance
  BALANCE         : 'balance',

  // total contributions made
  TOTAL_CONTRIBUTIONS: 'totalContributions',

  // one of investment
  ONE_OFF_INVESTMENT: 'oneOffInvestment',

  // recurring amount of the goal
  RECURRING_AMOUNT: 'recurringAmount',

  // recurring frequency of the goal
  RECURRING_FREQUENCY: 'recurringFrequency',

  // current value
  CURRENT_VALUE: 'currentValue',

  // pending transfers
  PENDING_TRANSFER_AMOUNT: 'pendingTransferAmount',

  // pending withdrawal
  PENDING_WITHDRAWAL_AMOUNT: 'pendingWithdrawalAmount',

  // growth in percentage of goal amount
  GROWTH_IN_PERCENTAGE: 'growthInPercentage',

  // growth in value of goal amount
  GROWTH_IN_VALUE: 'growthInValue',

  TENTATIVE_GOAL_AMOUNT: 'tentativeGoalAmount',

  RETURNS: 'returns',

  // first transfer date of the recurring amount
  FIRST_TRANSFER_DATE: 'firstTransferDate',

  // transfer amount
  TRANSFER_AMOUNT: 'transferAmount',

  // goal duration type
  GOAL_DURATION_TYPE: 'goalDurationType',

  // at what age of child does the goal mature
  GOAL_MATURITY_AGE: 'goalMaturityAge',

  // goal amount forecast
  GOAL_AMOUNT_FORECAST: 'goalAmountForecast',

  // duration of goal
  DURATION: 'duration',

  // is goal recurring payment set
  IS_RECURRING: 'isRecurring',

  TICKER_NAME: 'tickerName',

  PERFORMANCE_DATA: 'performanceData',
  INVEST_CHART_DATA: 'investChartData',

  WITHDRAW_AMOUNT: 'withdrawAmount',
  WITHDRAW_DISPLAY_AMOUNT: 'withdrawDisplayAmount',

  SUGGESTED_RISK: 'suggestedRisk',

  // initial deposit for the goal
  INITIAL_DEPOSIT : 'initialDeposit',
  // Month
  MM      : 'MM',
  // Date
  DD      : 'DD',
  // Year
  YYYY    : 'YYYY',
  // Due date ( calculated by combining MM:DD:YYY
  DUE_DATE : 'dueDate',

  // Portfolio risk attached to goal
  PORTFOLIO_RISK: 'portfolioRisk',

  CHART_DATA: 'chartData',

  END_DATE: 'endDate',

  LAST_UPDATED_TIME: 'lastUpdatedTime',

  // transfer instructions over goal
  INSTRUCTIONS: 'instructions',
  // instruction ID
  INSTRUCTION_ID: 'instructionID',
  // amount to be transferred
  INSTRUCTION_AMOUNT: 'instructionAmount',
  // frequency of amount to be transferred
  INSTRUCTION_FREQUENCY: 'instructionFrequency',
  // initial request time of instruction
  INSTRUCTION_INITIAL_REQUEST_DATE: 'instructionInitialRequestDate',
  // next transfer date of instruction
  INSTRUCTION_NEXT_TRANSFER_DATE: 'instructionNextTransferDate',
  // status of instructino
  INSTRUCTION_STATUS: 'instructionStatus',
  // instruction type
  INSTRUCTION_TYPE: 'instructionType',
  // action to be performed
  INSTRUCTION_ACTION: 'instructionAction',

  GOAL_RECURRING_ID: 'goalRecurringID',
  GOAL_RECURRING_AMOUNT: 'goalRecurringAmount',
  GOAL_RECURRING_FREQUENCY: 'goalRecurringFrequency',
  GOAL_RECURRING_NEXT_DATE: 'goalRecurringNextDate',
  GOAL_RECURRING_STATUS: 'goalRecurringStatus',

  // transfers detail
  TRANSACTIONS: 'transactions',
  // single transaction object
  TRANSACTION: 'transaction',

  TRANSACTION_ID: 'transactionID',
  TRANSACTION_AMOUNT: 'transactionAmount',
  TRANSACTION_STATUS: 'transactionStatus',
  TRANSACTION_TYPE: 'transactionType',
  TRANSACTION_TIME: 'transactionTime',
  TRANSACTION_STOCKS: 'transactionStocks',
  TRANSACTION_STOCK_NAME: 'transactionStockName',
  TRANSACTION_STOCK_UNITS: 'transactionStockUnits',

  // transfers detail
  DUMMY_TRANSACTIONS: 'dummyTransactions',
  // single transaction object
  DUMMY_TRANSACTION: 'dummyTransaction',

  DUMMY_TRANSACTION_REFERENCE_ID: 'dummyTransactionReferenceID',
  DUMMY_TRANSACTION_AMOUNT: 'dummyTransactionAmount',
  DUMMY_TRANSACTION_STATUS: 'dummyTransactionStatus',
  DUMMY_TRANSACTION_TIME: 'dummyTransactionTime',

  STOCKS: 'stocks',
  STOCK_NAME: 'stockName',
  STOCK_TICKER: 'stockTicker',
  STOCK_AMOUNT: 'stockAmount',
  STOCK_UNIT_PRICE: 'stockUnitPrice',
  STOCK_UNITS: 'stockUnits',
  STOCK_CURRENT_VALUE: 'stockCurrentValue',
  STOCK_GROWTH_IN_PERCENTAGE: 'stockGrowthInPercentage',
  STOCK_GROWTH_IN_VALUE: 'stockGrowthInValue',
  STOCK_AVAILABLE_UNITS: 'stockAvailableUnits',
  STOCK_INVESTED_AMOUNT: 'stockInvestedAmount',

  FUNDING_SOURCE_ID: 'fundingSourceID',
  TRANSFER_ID: 'transferID',

  PRODUCTS: 'products',
  PRODUCT_TICKER: 'productTicker',
  PRODUCT_PORTFOLIO_ID: 'productPortfolioID',
  PRODUCT_TYPE: 'productType',
  PRODUCT_NAME: 'productName',
  PRODUCT_WHAT_IS_INVESTMENT: 'productWhatIsTheInvestment',
  PRODUCT_DESCRIPTION: 'productDescription',
  PRODUCT_BACKDROP_IMAGE_URL: 'productBackdropImageURL',
  PRODUCT_IMAGE_URL: 'productImageURL',
  PRODUCT_SHOW_CHART: 'productShowChart',

  PRODUCT_IMAGES: 'images',
  PRODUCT_IMAGE: 'image',

  IS_WITHDRAW: 'isWithdraw',

  // ----- Store specific entities -----
  GID_INDEX : 'GID_INDEX',
  CID_INDEX : 'CID_INDEX',
  CHILD_MAP : 'CHILD_MAP',
  GOAL_DATA : 'GOAL_DATA',

  LATEST_TRANSFER: 'latestTransfer',

  RISK_SELECTED: 'riskSelected',

  // temporary variable for carrying
  // invest data locally
  INVEST_DATA: 'investData',

  INSTRUCTION_DATA: 'instructionData',

  TICKER_DATA: 'tickerData',
  TICKER_CODE: 'tickerCode',
  TICKER_WHAT_LEARN: 'tickerWhatLearn',
  TICKER_WHAT_INVESTMENT: 'tickerWhatInvestment',
  TICKER_DESCRIPTION: 'tickerDescription',
  TICKER_UNDERLYING: 'tickerUnderlying',
  TICKER_DIVIDEND_YIELD: 'tickerDividendYield',
  TICKER_LAST_PRICE: 'tickerLastPrice',
  TICKER_EXPENSES: 'tickerExpenses',
  TICKER_STANDARD_DEVIATION: 'tickerStandardDeviation',
  TICKER_1_YEAR_CHANGE: 'ticker1YearChange',
  TICKER_3_YEAR_CHANGE: 'ticker3YearChange',
  TICKER_5_YEAR_CHANGE: 'ticker5YearChange',
  TICKER_OVERALL_CHANGE: 'tickerOverallChange',
  TICKER_HOLDINGS: 'tickerHoldings',
  TICKER_SHOW_CHART: 'tickerShowChart',
  TICKER_URL: 'tickerURL',

  // ----- UTILITY entities -----

  // are there any error's in goal module functioining
  IS_OK     : 'OK',
  // error related to goal module
  ERROR     : 'ERROR',
  // processing index tag
  PROCESSING: 'PROCESSING',
  // processing related tags
  ADD_CUSTOM_GOAL_PROCESSING : 'ADD_GOAL_PROCESSING',
  EDIT_GOAL_PROCESSING: 'EDIT_GOAL_PROCESSING',

  UPDATE_PARTIAL_GOAL_PROCESSING: 'UPDATE_PARTIAL_GOAL_PROCESSING',
  UPDATE_COMPLETE_GOAL_PROCESSING: 'UPDATE_COMPLETE_GOAL_PROCESSING',
  FETCH_GOAL_DETAIL_PROCESSING: 'FETCH_GOAL_DETAIL_PROCESSING',
  FETCH_GOAL_CHART_DATA_PROCESSING: 'FETCH_GOAL_CHART_DATA_PROCESSING',
  FETCH_TRANSFERS_HANDLER: 'FETCH_TRANSFERS_HANDLER',

  FETCH_PERFORMANCE_DATA_PROCESSING: 'FETCH_PERFORMANCE_DATA_PROCESSING',
  FETCH_INVEST_CHART_DATA_PROCESSING: 'FETCH_INVEST_CHART_DATA_PROCESSING',
  PROCESSING_TRANSFER: 'PROCESSING_TRANSFER',
  PROCESSING_WITHDRAW: 'PROCESSING_WITHDRAW',

  IS_ONE_OFF_INVESTMENT_ONLY: 'isOneOffInvestmentOnly',
  IS_ADD_RECURRING: 'IS_ADD_RECURRING'
}

// --------------------------------------------------------------------------------
// Path of Entities in STORE

export function path (ENTITIY) {
  switch (ENTITIY) {

    case GOAL_ENTITIES.GOALS:
      return () => [GOAL_ENTITIES.GOALS]

    case GOAL_ENTITIES.PRODUCTS:
      return () => [GOAL_ENTITIES.PRODUCTS]

    case GOAL_ENTITIES.LATEST_TRANSFER:
      return () => [GOAL_ENTITIES.LATEST_TRANSFER]

    case GOAL_ENTITIES.PRODUCT_IMAGE:
      return (ticker) => [GOAL_ENTITIES.PRODUCT_IMAGES, ticker]

    case GOAL_ENTITIES.PRODUCT_TICKER:
      return (type, ticker) => [GOAL_ENTITIES.PRODUCTS, type, ticker, GOAL_ENTITIES.PRODUCT_TICKER]

    case GOAL_ENTITIES.PRODUCT_PORTFOLIO_ID:
      return (type, ticker) => [GOAL_ENTITIES.PRODUCTS, type, ticker, GOAL_ENTITIES.PRODUCT_PORTFOLIO_ID]

    case GOAL_ENTITIES.PRODUCT_TYPE:
      return (type, ticker) => [GOAL_ENTITIES.PRODUCTS, type, ticker, GOAL_ENTITIES.PRODUCT_TYPE]

    case GOAL_ENTITIES.PRODUCT_NAME:
      return (type, ticker) => [GOAL_ENTITIES.PRODUCTS, type, ticker, GOAL_ENTITIES.PRODUCT_NAME]

    case GOAL_ENTITIES.PRODUCT_WHAT_IS_INVESTMENT:
      return (type, ticker) => [GOAL_ENTITIES.PRODUCTS, type, ticker, GOAL_ENTITIES.PRODUCT_WHAT_IS_INVESTMENT]

    case GOAL_ENTITIES.PRODUCT_DESCRIPTION:
      return (type, ticker) => [GOAL_ENTITIES.PRODUCTS, type, ticker, GOAL_ENTITIES.PRODUCT_DESCRIPTION]

    case GOAL_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL:
      return (type, ticker) => [GOAL_ENTITIES.PRODUCTS, type, ticker, GOAL_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL]

    case GOAL_ENTITIES.PRODUCT_IMAGE_URL:
      return (type, ticker) => [GOAL_ENTITIES.PRODUCTS, type, ticker, GOAL_ENTITIES.PRODUCT_IMAGE_URL]

    case GOAL_ENTITIES.PRODUCT_SHOW_CHART:
      return (type, ticker) => [GOAL_ENTITIES.PRODUCTS, type, ticker, GOAL_ENTITIES.PRODUCT_SHOW_CHART]

    case GOAL_ENTITIES.TYPE:
      return () => [GOAL_ENTITIES.TYPE]

    case GOAL_ENTITIES.GID_INDEX :
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`]

    case GOAL_ENTITIES.CID_INDEX :
      return (CID) => [GOAL_ENTITIES.CHILD_MAP, `${CID}`]

    case GOAL_ENTITIES.CHILD_MAP:
      return () => [GOAL_ENTITIES.CHILD_MAP]

    case GOAL_ENTITIES.GID :
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GID]

    case GOAL_ENTITIES.CID :
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.CID]

    case GOAL_ENTITIES.NAME :
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.NAME]

    case GOAL_ENTITIES.GOAL_AMOUNT:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GOAL_AMOUNT]

    case GOAL_ENTITIES.PORTFOLIO_RISK:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.PORTFOLIO_RISK]

    case GOAL_ENTITIES.TOTAL_CONTRIBUTIONS:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.TOTAL_CONTRIBUTIONS]

    case GOAL_ENTITIES.END_DATE:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.END_DATE]

    case GOAL_ENTITIES.LAST_UPDATED_TIME:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.LAST_UPDATED_TIME]

    case GOAL_ENTITIES.RECURRING_AMOUNT:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.RECURRING_AMOUNT]

    case GOAL_ENTITIES.RECURRING_FREQUENCY:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.RECURRING_FREQUENCY]

    case GOAL_ENTITIES.FIRST_TRANSFER_DATE:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.FIRST_TRANSFER_DATE]

    case GOAL_ENTITIES.BALANCE:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.BALANCE]

    case GOAL_ENTITIES.CURRENT_VALUE:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.CURRENT_VALUE]

    case GOAL_ENTITIES.PENDING_TRANSFER_AMOUNT:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.PENDING_TRANSFER_AMOUNT]

    case GOAL_ENTITIES.PENDING_WITHDRAWAL_AMOUNT:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.PENDING_WITHDRAWAL_AMOUNT]

    case GOAL_ENTITIES.GROWTH_IN_PERCENTAGE:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GROWTH_IN_PERCENTAGE]

    case GOAL_ENTITIES.GROWTH_IN_VALUE:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GROWTH_IN_VALUE]

    case GOAL_ENTITIES.GOAL_RECURRING_ID:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GOAL_RECURRING_ID]

    case GOAL_ENTITIES.GOAL_RECURRING_AMOUNT:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GOAL_RECURRING_AMOUNT]

    case GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY]

    case GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE]

    case GOAL_ENTITIES.GOAL_RECURRING_STATUS:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GOAL_RECURRING_STATUS]

    case GOAL_ENTITIES.STOCKS:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.STOCKS]

    case GOAL_ENTITIES.INITIAL_DEPOSIT:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.INITIAL_DEPOSIT]

    case GOAL_ENTITIES.CHART_DATA:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.CHART_DATA]

    case GOAL_ENTITIES.MM:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.MM]

    case GOAL_ENTITIES.DD:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.DD]

    case GOAL_ENTITIES.YYYY:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.YYYY]

    case GOAL_ENTITIES.DUE_DATE:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.DUE_DATE]

    case GOAL_ENTITIES.IMAGE_URL:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.IMAGE_URL]

    case GOAL_ENTITIES.GOAL_IMAGE:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.GOAL_IMAGE]

    case GOAL_ENTITIES.INSTRUCTIONS:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.INSTRUCTIONS]
    case GOAL_ENTITIES.INSTRUCTION_ID:
      return (GID, IID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.INSTRUCTIONS, `${IID}`, GOAL_ENTITIES.INSTRUCTION_ID]
    case GOAL_ENTITIES.INSTRUCTION_AMOUNT:
      return (GID, IID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.INSTRUCTIONS, `${IID}`, GOAL_ENTITIES.INSTRUCTION_AMOUNT]
    case GOAL_ENTITIES.INSTRUCTION_FREQUENCY:
      return (GID, IID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.INSTRUCTIONS, `${IID}`, GOAL_ENTITIES.INSTRUCTION_FREQUENCY]
    case GOAL_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE:
      return (GID, IID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.INSTRUCTIONS, `${IID}`, GOAL_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE]
    case GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE:
      return (GID, IID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.INSTRUCTIONS, `${IID}`, GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE]
    case GOAL_ENTITIES.INSTRUCTION_TYPE:
      return (GID, IID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.INSTRUCTIONS, `${IID}`, GOAL_ENTITIES.INSTRUCTION_TYPE]
    case GOAL_ENTITIES.INSTRUCTION_STATUS:
      return (GID, IID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.INSTRUCTIONS, `${IID}`, GOAL_ENTITIES.INSTRUCTION_STATUS]

    case GOAL_ENTITIES.TRANSACTIONS:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.TRANSACTIONS]

    case GOAL_ENTITIES.TRANSACTION:
      return (GID, tID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.TRANSACTIONS, `${tID}`]

    case GOAL_ENTITIES.TRANSACTION_ID:
      return (GID, tID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.TRANSACTIONS, `${tID}`, GOAL_ENTITIES.TRANSACTION_ID]

    case GOAL_ENTITIES.TRANSACTION_AMOUNT:
      return (GID, tID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.TRANSACTIONS, `${tID}`, GOAL_ENTITIES.TRANSACTION_AMOUNT]

    case GOAL_ENTITIES.TRANSACTION_STATUS:
      return (GID, tID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.TRANSACTIONS, `${tID}`, GOAL_ENTITIES.TRANSACTION_STATUS]

    case GOAL_ENTITIES.TRANSACTION_TYPE:
      return (GID, tID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.TRANSACTIONS, `${tID}`, GOAL_ENTITIES.TRANSACTION_TYPE]

    case GOAL_ENTITIES.TRANSACTION_TIME:
      return (GID, tID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.TRANSACTIONS, `${tID}`, GOAL_ENTITIES.TRANSACTION_TIME]

    case GOAL_ENTITIES.TRANSACTION_STOCKS:
      return (GID, tID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.TRANSACTIONS, `${tID}`, GOAL_ENTITIES.TRANSACTION_STOCKS]

    case GOAL_ENTITIES.DUMMY_TRANSACTIONS:
      return (GID) => [GOAL_ENTITIES.GOALS, `${GID}`, GOAL_ENTITIES.DUMMY_TRANSACTIONS]

    case GOAL_ENTITIES.PERFORMANCE_DATA:
      return () => [GOAL_ENTITIES.PERFORMANCE_DATA]

    case GOAL_ENTITIES.INVEST_CHART_DATA:
      return (tickerName) => [GOAL_ENTITIES.INVEST_CHART_DATA, tickerName]

    case GOAL_ENTITIES.TICKER_DATA:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode]

    case GOAL_ENTITIES.TICKER_NAME:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_NAME]

    case GOAL_ENTITIES.TICKER_WHAT_LEARN:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_WHAT_LEARN]

    case GOAL_ENTITIES.TICKER_WHAT_INVESTMENT:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_WHAT_INVESTMENT]

    case GOAL_ENTITIES.TICKER_DESCRIPTION:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_DESCRIPTION]

    case GOAL_ENTITIES.TICKER_UNDERLYING:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_UNDERLYING]

    case GOAL_ENTITIES.TICKER_DIVIDEND_YIELD:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_DIVIDEND_YIELD]

    case GOAL_ENTITIES.TICKER_LAST_PRICE:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_LAST_PRICE]

    case GOAL_ENTITIES.TICKER_EXPENSES:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_EXPENSES]

    case GOAL_ENTITIES.TICKER_STANDARD_DEVIATION:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_STANDARD_DEVIATION]

    case GOAL_ENTITIES.TICKER_1_YEAR_CHANGE:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_1_YEAR_CHANGE]

    case GOAL_ENTITIES.TICKER_3_YEAR_CHANGE:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_3_YEAR_CHANGE]

    case GOAL_ENTITIES.TICKER_5_YEAR_CHANGE:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_5_YEAR_CHANGE]

    case GOAL_ENTITIES.TICKER_OVERALL_CHANGE:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_OVERALL_CHANGE]

    case GOAL_ENTITIES.TICKER_HOLDINGS:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_HOLDINGS]

    case GOAL_ENTITIES.TICKER_SHOW_CHART:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_SHOW_CHART]

    case GOAL_ENTITIES.TICKER_URL:
      return (tickerCode) => [GOAL_ENTITIES.PERFORMANCE_DATA, tickerCode, GOAL_ENTITIES.TICKER_URL]

    case GOAL_ENTITIES.IS_OK:
      return () => ['sanity', GOAL_ENTITIES.IS_OK]

    case GOAL_ENTITIES.ERROR:
      return () => ['sanity', GOAL_ENTITIES.ERROR]

    case GOAL_ENTITIES.PROCESSING:
      return () => ['sanity', GOAL_ENTITIES.PROCESSING]
  }
}


// --------------------------------------------------------------------------------

/*
  Path of Add Goal Entities
  {
    name,
    totalValue,
    initialDeposit,
    MM,
    DD,
    YYYY
  }
 */
export const ADD_GOAL_PATH = {}
ADD_GOAL_PATH[GOAL_ENTITIES.CID] = 'CID'
ADD_GOAL_PATH[GOAL_ENTITIES.NAME] = 'name'
ADD_GOAL_PATH[GOAL_ENTITIES.GOAL_AMOUNT] = 'totalValue'
ADD_GOAL_PATH[GOAL_ENTITIES.INITIAL_DEPOSIT] = 'initialDeposit'
ADD_GOAL_PATH[GOAL_ENTITIES.MM] = 'MM'
ADD_GOAL_PATH[GOAL_ENTITIES.DD] = 'DD'
ADD_GOAL_PATH[GOAL_ENTITIES.YYYY] = 'YYYY'

/*
  Path for Add Goal API Request
  {
    name,
    totalValue,
    initialDeposit,
    dueDate
  }
 */
export const ADD_GOAL_REQUEST_PATH = {}
ADD_GOAL_REQUEST_PATH[GOAL_ENTITIES.CID] = 'CID'
ADD_GOAL_REQUEST_PATH[GOAL_ENTITIES.NAME] = 'name'
ADD_GOAL_REQUEST_PATH[GOAL_ENTITIES.GOAL_AMOUNT] = 'totalValue'
ADD_GOAL_REQUEST_PATH[GOAL_ENTITIES.INITIAL_DEPOSIT] = 'initialDeposit'
ADD_GOAL_REQUEST_PATH[GOAL_ENTITIES.DUE_DATE] = 'dueDate'

export const ADD_GOAL_RESPONSE_PATH = {}
ADD_GOAL_RESPONSE_PATH[GOAL_ENTITIES.NAME] = 'name'
ADD_GOAL_RESPONSE_PATH[GOAL_ENTITIES.GOAL_AMOUNT] = 'totalValue'
ADD_GOAL_RESPONSE_PATH[GOAL_ENTITIES.INITIAL_DEPOSIT] = 'initialDeposit'
ADD_GOAL_RESPONSE_PATH[GOAL_ENTITIES.DUE_DATE] = 'dueDate'
ADD_GOAL_RESPONSE_PATH[GOAL_ENTITIES.CID] = 'CID'
ADD_GOAL_RESPONSE_PATH[GOAL_ENTITIES.GID] = 'GID'

export const VIEW_GOAL_PATH = {}
VIEW_GOAL_PATH[GOAL_ENTITIES.GID] = 'GID'
VIEW_GOAL_PATH[GOAL_ENTITIES.CID] = 'CID'

export const NAVIGATE_TO_EDIT_GOAL = {}
NAVIGATE_TO_EDIT_GOAL[GOAL_ENTITIES.GID] = 'GID'
NAVIGATE_TO_EDIT_GOAL[GOAL_ENTITIES.CID] = 'CID'

export const EDIT_GOAL_PATH = {}
EDIT_GOAL_PATH[GOAL_ENTITIES.CID] = 'CID'
EDIT_GOAL_PATH[GOAL_ENTITIES.GID] = 'GID'
EDIT_GOAL_PATH[GOAL_ENTITIES.NAME] = 'name'
EDIT_GOAL_PATH[GOAL_ENTITIES.GOAL_AMOUNT] = 'totalValue'
EDIT_GOAL_PATH[GOAL_ENTITIES.INITIAL_DEPOSIT] = 'initialDeposit'
EDIT_GOAL_PATH[GOAL_ENTITIES.MM] = 'MM'
EDIT_GOAL_PATH[GOAL_ENTITIES.DD] = 'DD'
EDIT_GOAL_PATH[GOAL_ENTITIES.YYYY] = 'YYYY'

export const EDIT_GOAL_REQUEST_PATH = {}
EDIT_GOAL_REQUEST_PATH[GOAL_ENTITIES.CID] = 'CID'
EDIT_GOAL_REQUEST_PATH[GOAL_ENTITIES.GID] = 'GID'
EDIT_GOAL_REQUEST_PATH[GOAL_ENTITIES.NAME] = 'name'
EDIT_GOAL_REQUEST_PATH[GOAL_ENTITIES.GOAL_AMOUNT] = 'totalValue'
EDIT_GOAL_REQUEST_PATH[GOAL_ENTITIES.INITIAL_DEPOSIT] = 'initialDeposit'
EDIT_GOAL_REQUEST_PATH[GOAL_ENTITIES.DUE_DATE] = 'dueDate'

export const EDIT_GOAL_RESPONSE_PATH = {}
EDIT_GOAL_RESPONSE_PATH[GOAL_ENTITIES.CID] = 'CID'
EDIT_GOAL_RESPONSE_PATH[GOAL_ENTITIES.GID] = 'GID'
EDIT_GOAL_RESPONSE_PATH[GOAL_ENTITIES.NAME] = 'name'
EDIT_GOAL_RESPONSE_PATH[GOAL_ENTITIES.GOAL_AMOUNT] = 'totalValue'
EDIT_GOAL_RESPONSE_PATH[GOAL_ENTITIES.INITIAL_DEPOSIT] = 'initialDeposit'
EDIT_GOAL_RESPONSE_PATH[GOAL_ENTITIES.DUE_DATE] = 'dueDate'
