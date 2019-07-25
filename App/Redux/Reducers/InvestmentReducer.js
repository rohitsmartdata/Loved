/* eslint-disable no-unused-vars,no-multi-spaces,key-spacing,no-trailing-spaces */
/**
 * Created by demon on 26/4/18.
 */

// ========================================================
// Import packages
// ========================================================

import { createReducer, createActions }
  from 'reduxsauce'
import {Alert} from 'react-native'
import Immutable
  from 'seamless-immutable'
import PARAMETERS
  from '../ActionParameters'
import {INVESTMENT_ENTITIES, path}
  from '../../Utility/Mapper/Investment'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {UserTypes}
  from './UserReducer'
import {GoalTypes}
  from './GoalReducer'
import {SettingTypes}
  from './SettingReducer'
import PHANTOM
  from '../../Utility/Phantom'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

import _ from 'lodash'

// ========================================================
// Types & Action Creators
// ========================================================

const {Types, Creators} = createActions({

  addNewInvestment      : PARAMETERS.ADD_NEW_INVESTMENT,

  addInvestment         : PARAMETERS.ADD_INVESTMENT,
  addInvestmentSuccess  : PARAMETERS.ADD_INVESTMENT_SUCCESS,
  addInvestmentFailure  : PARAMETERS.ADD_INVESTMENT_FAILURE,

  investmentConfirm  : PARAMETERS.INVESTMENT_CONFIRM,

  fetchProducts         : PARAMETERS.FETCH_PRODUCTS,
  fetchProductsSuccess  : PARAMETERS.FETCH_PRODUCTS_SUCCESS,
  fetchProductsFailure  : PARAMETERS.FETCH_PRODUCTS_FAILURE,

  investmentSelected      : PARAMETERS.INVESTMENT_SELECTED,
  investmentAmountSelected: PARAMETERS.INVESTMENT_AMOUNT_SELECTED,

  flushProducts: null,

  buyInvestment: PARAMETERS.BUY_INVESTMENT,
  sellInvestment: PARAMETERS.SELL_INVESTMENT,
  investmentCompleted: PARAMETERS.INVESTMENT_COMPLETED,
  updateRecurring: PARAMETERS.BUY_INVESTMENT,
  updateGoal: PARAMETERS.BUY_INVESTMENT,

  showInvestment: PARAMETERS.SHOW_INVESTMENT,
  selectInvestmentAmount: PARAMETERS.SELECT_INVESTMENT_AMOUNT,

  // --------
  selectInvestment: PARAMETERS.SELECT_INVESTMENT,
  showInvestmentDetail: PARAMETERS.SHOW_INVESTMENT_DETAIL,
  showInvestmentFund: PARAMETERS.SHOW_INVESTMENT_FUND
})

export const InvestmentTypes      = Types
export const InvestmentActions    = Creators

// ========================================================
// Initial State
// ========================================================

export var INITIAL_STATE = Immutable({})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(INVESTMENT_ENTITIES.CHILD_MAP)(), {})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(INVESTMENT_ENTITIES.IS_OK)(), true)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(INVESTMENT_ENTITIES.ERROR)(), undefined)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)

// ========================================================
// Handler Functions
// ========================================================

const resetStoreHandler = (state) => {
  return INITIAL_STATE
}

const refreshHealthHandler = (state) => {
  let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)
  return s
}

const addInvestmentHandler = (state) => PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.PROCESSING)(), INVESTMENT_ENTITIES.PROCESSING_ADD_INVESTMENT)

const addInvestmentSuccessHandler = (state, action) => {
  try {
    let childID = action[CHILD_ENTITIES.CHILD_ID]
    let investmentID = action[INVESTMENT_ENTITIES.INVESTMENT_ID]

    let investmentData = action[INVESTMENT_ENTITIES.INVESTMENT_DATA]

    let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)

    // set goal id to payload in store
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(investmentID), investmentID)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_NAME)(investmentID), investmentData['name'])
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RISK_ID)(investmentID), investmentData['current_portfolio_id'])
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_PATH_ID)(investmentID), investmentData['path_id'])

    // map it to child
    // check if child entry is already there
    let arr = PHANTOM.getIn(s, path(INVESTMENT_ENTITIES.CID_INDEX)(childID))
    if (!arr) {
      arr = []
      s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.CID_INDEX)(childID), arr)
    }
    arr = arr.concat(investmentID)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.CID_INDEX)(childID), arr)

    return s
  } catch (error) {
    return state
  }
}

const addInvestmentFailureHandler = (state, error) => {
  try {
    let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), false)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), error)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)
    return s
  } catch (error) {
    return state
  }
}

const fetchProductsHandler = (state) => PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.PROCESSING)(), INVESTMENT_ENTITIES.PROCESSING_FETCH_PRODUCTS)

const fetchProductsSuccessHandler = (state, action) => {
  try {
    let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)

    let products = action[INVESTMENT_ENTITIES.PRODUCTS]
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.NATIVE_PRODUCTS)(), products)

    products.map(p => {
      let isDream = p['is_dream']
      let productType = p['types']

      if (isDream && productType !== 'Mix' && productType !== 'mix') {
        let productTicker = p['ticker']
        let productPortfolioID = p['portfolio_id']
        let productName = p['name']
        let productWhat = p['what_is_the_investment']
        let productDescription = p['description']
        let productBackdropImage = p['backdrop_image']
        let productImage = p['image']
        let showChart = p['show_chart']

        let images = {
          [INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL]: productBackdropImage,
          [INVESTMENT_ENTITIES.PRODUCT_IMAGE_URL]: productImage
        }
        let description = ''
        if (productDescription) {
          description = productDescription.charAt(0).toUpperCase() + productDescription.slice(1)
          description = description.charAt(description.length - 1) === '.' ? description : description + '.'
        }

        productType && Array.isArray(productType) && productType.map(type => {
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_IMAGE)(productTicker), images)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_TICKER)(type, productTicker), productTicker)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_PORTFOLIO_ID)(type, productTicker), productPortfolioID)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_TYPE)(type, productTicker), type)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_NAME)(type, productTicker), productName)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_WHAT_IS_INVESTMENT)(type, productTicker), productWhat)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_DESCRIPTION)(type, productTicker), description)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL)(type, productTicker), productBackdropImage)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_IMAGE_URL)(type, productTicker), productImage)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCT_SHOW_CHART)(type, productTicker), showChart)
        })
      }
    })
    s = injectTypes(s, action)
    return s
  } catch (error) {
    return state
  }
}

const injectTypes = (state, action) => {
  try {
    let types = action[INVESTMENT_ENTITIES.TYPES] || []

    let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), true)

    types.map(type => {
      let t = type['name']
      let p = type['display_order']
      s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TYPE)(t), t)
      s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRIORITY)(t), p)
    })
    return s
  } catch (err) {
    return state
  }
}

const flushProductsHandler = (state) => PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.PRODUCTS)(), undefined)

const fetchProductsFailureHandler = (state, error) => {
  try {
    let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), false)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), error)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)
    return s
  } catch (error) {
    return state
  }
}

const fetchUserDetailSuccessHandler = (state, action) => {
  try {
    // set state of goal data as OK
    let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)

    // de-refer user detail data
    let sprouts = action[USER_ENTITIES.USER_DETAIL]['sprouts']

    sprouts.map(sprout => {
      let childID = sprout['sprout_id']
      let goals = sprout['goals']

      // map goals to children
      let arr = []
      goals && goals.map(goal => {
        const isInstruction = (goal['path_id'] !== null)
        const goalID = goal['goal_id']
        if (isInstruction && goalID) {
          arr = arr.concat(goalID)
        }
      })
      let prevArr = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.CID_INDEX)(childID)) || []
      let unique = [...new Set([...arr, ...prevArr])]
      s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.CID_INDEX)(childID), unique)

      // add goal information to goal index
      goals && goals.map(goal => {
        try {
          const isInvestment = (goal['path_id'] !== null)
          let goalID = goal['goal_id']
          if (isInvestment && goalID) {
            let balance = goal['available_value']
            let totalContribution = goal['total_contributions']
            let growthValue = goal['growth_in_value']
            let growthPercentage = goal['growth_in_percentage']
            let currentValue = goal['current_value']
            let pendingTransfer = goal['pending_transfer_amount']
            let pendingWithdrawal = goal['pending_withdrawal_amount']
            let tickerName = goal['ticker_name']

            // s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_INDEX)(goalID), goalID)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(goalID), goalID)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_TICKER_NAME)(goalID), tickerName)

            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_BALANCE)(goalID), (balance && parseFloat(balance).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.CURRENT_VALUE)(goalID), (currentValue && parseFloat(currentValue).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PENDING_TRANSFER_AMOUNT)(goalID), (pendingTransfer && parseFloat(pendingTransfer).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PENDING_WITHDRAWAL_AMOUNT)(goalID), (pendingWithdrawal && parseFloat(pendingWithdrawal).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_TOTAL_CONTRIBUTION)(goalID), (totalContribution && parseFloat(totalContribution).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.GROWTH_IN_VALUE)(goalID), (growthValue && parseFloat(growthValue).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.GROWTH_IN_PERCENTAGE)(goalID), (growthPercentage && parseFloat(growthPercentage).toFixed(2)) || 0)
          }
        } catch (err) {
          console.log('*** goal entites missing *** ', goal, err)
        }
      })
    })

    let instructions = action[USER_ENTITIES.USER_DETAIL]['instructions']

    instructions && instructions.map(i => {
      let investmentID = i['instruction_goal_id']
      let isPresent = PHANTOM.getIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(investmentID))

      if (isPresent) {
        let instructionID = i['instruction_reference']
        let instructionAmount = i['instruction_amount']
        let instructionFrequency = i['instruction_freqeuncy']
        let instructionInitialDate = i['instruction_initial_date']
        let instructionNextDate = i['instruction_next_activity_date']
        let instructionType = i['instruction_type']
        let instructionStatus = i['instruction_status']

        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_ID)(investmentID, instructionID), instructionID)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_AMOUNT)(investmentID, instructionID), instructionAmount)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_FREQUENCY)(investmentID, instructionID), instructionFrequency)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE)(investmentID, instructionID), instructionInitialDate)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE)(investmentID, instructionID), instructionNextDate)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_TYPE)(investmentID, instructionID), instructionType)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_STATUS)(investmentID, instructionID), instructionStatus)

        if (instructionFrequency !== 'once' && instructionStatus  && instructionStatus.toLowerCase() !== 'stopped') {
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_ID)(investmentID), instructionID)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT)(investmentID), instructionAmount)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY)(investmentID), instructionFrequency)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_NEXT_DATE)(investmentID), instructionNextDate)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_STATUS)(investmentID), instructionStatus)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_TYPE)(investmentID), instructionType)
        }
      }
    })

    let transactions = action[USER_ENTITIES.USER_DETAIL]['transactions']
    transactions && transactions.map(i => {
      let investmentID = i['transaction_goal_id']
      let isPresent = PHANTOM.getIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(investmentID))

      if (isPresent) {
        let transactionID = i['transaction_reference_id']
        let transactionAmount = i['transaction_amount']
        let transactionStatus = i['transaction_status']
        let transactionType = i['transaction_type']
        let transactionTime = i['transaction_time']

        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_ID)(investmentID, transactionID), transactionID)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_AMOUNT)(investmentID, transactionID), transactionAmount)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_STATUS)(investmentID, transactionID), transactionStatus)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_TYPE)(investmentID, transactionID), transactionType)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_TIME)(investmentID, transactionID), transactionTime)
      }
    })

    return s
  } catch (err) {
    return state
  }
}

const fetchUserSuccessHandler = (state, action) => {
  try {
    // set state of goal data as OK
    let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)

    // de-refer user detail data
    let u = action[USER_ENTITIES.USER_DATA]['user'][0]
    let sprouts = (u && u['sprout']) || []

    sprouts.map(sprout => {
      let childID = sprout['sprout_id']
      let goals = sprout['goal']

      // map goals to children
      let arr = []
      goals && goals.map(goal => {
        const isInstruction = (goal['path_id'] !== null)
        const goalID = goal['goal_id']
        if (isInstruction && goalID) {
          arr = arr.concat(goalID)
        }
      })
      let prevArr = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.CID_INDEX)(childID)) || []
      let unique = [...new Set([...arr, ...prevArr])]
      s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.CID_INDEX)(childID), unique)

      // add goal information to goal index
      goals && goals.map(goal => {
        try {
          const isInvestment = (goal['path_id'] !== null)
          let goalID = goal['goal_id']
          if (isInvestment && goalID) {
            let name = goal['name']
            let riskID = goal['current_portfolio_id']

            // s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_INDEX)(goalID), goalID)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(goalID), goalID)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_NAME)(goalID), name)
            s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RISK_ID)(goalID), riskID)
          }
        } catch (err) {
          console.log('*** goal entites missing *** ', goal, err)
        }
      })
    })

    return s
  } catch (err) {
    return state
  }
}

const fetchGoalDetailSuccessHandler = (state, action) => {
  let investmentData = action[GOAL_ENTITIES.GOAL_DATA]
  let investmentID = investmentData['goal_id']

  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)

  let isPresent = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(investmentID))
  if (isPresent) {
    // inject stocks if available
    let stocks = investmentData['stocks']
    let sArr = []
    if (stocks) {
      stocks.map(stock => {
        let obj = {}
        obj[INVESTMENT_ENTITIES.STOCK_TICKER] = stock['stock_ticker']
        obj[INVESTMENT_ENTITIES.STOCK_NAME] = stock['stock_name']
        obj[INVESTMENT_ENTITIES.STOCK_CURRENT_VALUE] = stock['stock_current_value']
        obj[INVESTMENT_ENTITIES.STOCK_UNIT_PRICE] = stock['stock_unit_price']
        obj[INVESTMENT_ENTITIES.STOCK_UNITS] = stock['stock_units']
        obj[INVESTMENT_ENTITIES.STOCK_AVAILABLE_UNITS] = stock['stock_available_units']
        obj[INVESTMENT_ENTITIES.STOCK_INVESTED_AMOUNT] = stock['stock_invested_amount']
        sArr.push(obj)
      })
    }
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.STOCKS)(investmentID), sArr)
  }

  return s
}

const fetchUserInstructionsHandler = (state, action) => PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.PROCESSING)(), INVESTMENT_ENTITIES.PROCESSING_FETCH_USER_INSTRUCTIONS)

const fetchUserInstructionsSuccessHandler = (state, action) => {
  try {
    let instructions = action[USER_ENTITIES.USER_DATA]['user_instructions']
    let s = state
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)

    instructions.map(i => {
      let goalID = i['goal_id']
      let isPresent = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(goalID))

      if (isPresent) {
        let instructionID = i['instruction_id']
        let instructionAmount = i['instruction_amount']
        let instructionFrequency = i['instruction_frequency']
        let instructionInitialDate = i['instruction_initial_date']
        let instructionNextDate = i['instruction_next_date']
        let instructionType = i['instruction_type']
        let instructionStatus = i['instruction_status']

        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_ID)(goalID, instructionID), instructionID)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_AMOUNT)(goalID, instructionID), instructionAmount)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_FREQUENCY)(goalID, instructionID), instructionFrequency)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE)(goalID, instructionID), instructionInitialDate)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE)(goalID, instructionID), instructionNextDate)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_TYPE)(goalID, instructionID), instructionType)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_STATUS)(goalID, instructionID), instructionStatus)
      }
    })

    return s
  } catch (err) {
    return state
  }
}

const transferSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)

  try {
    let instructionData = action[GOAL_ENTITIES.INSTRUCTION_DATA]
    let instructions = instructionData['goal_instructions']

    instructions.map(i => {
      let goalID = i['goal_id']
      let isPresent = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(goalID))

      if (isPresent) {
        let instructionID = i['instruction_id']
        let instructionAmount = i['instruction_amount']
        let instructionFrequency = i['instruction_frequency']
        let instructionInitialDate = i['instruction_initial_date']
        let instructionNextDate = i['instruction_next_date']
        let instructionType = i['instruction_type']
        let instructionStatus = i['instruction_status']

        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_ID)(goalID, instructionID), instructionID)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_AMOUNT)(goalID, instructionID), instructionAmount)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_FREQUENCY)(goalID, instructionID), instructionFrequency)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE)(goalID, instructionID), instructionInitialDate)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE)(goalID, instructionID), instructionNextDate)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_TYPE)(goalID, instructionID), instructionType)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_STATUS)(goalID, instructionID), instructionStatus)

        if (instructionFrequency !== 'once' && instructionStatus  && instructionStatus.toLowerCase() !== 'stopped') {
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_ID)(goalID), instructionID)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT)(goalID), instructionAmount)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY)(goalID), instructionFrequency)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_NEXT_DATE)(goalID), instructionNextDate)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_STATUS)(goalID), instructionStatus)
        }
      }
    })
  } catch (err) {

  }

  return s
}

export const modifyUserInstructionSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(INVESTMENT_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PROCESSING)(), undefined)

  try {
    let instructionData = action[GOAL_ENTITIES.INSTRUCTION_DATA]
    let instructions = instructionData['goal_instructions']

    instructions.map(i => {
      let goalID = i['goal_id']
      let isPresent = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(goalID))

      if (isPresent) {
        let instructionID = i['instruction_id']
        let instructionAmount = i['instruction_amount']
        let instructionFrequency = i['instruction_frequency']
        let instructionInitialDate = i['instruction_initial_date']
        let instructionNextDate = i['instruction_next_date']
        let instructionType = i['instruction_type']
        let instructionStatus = i['instruction_status']

        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_ID)(goalID, instructionID), instructionID)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_AMOUNT)(goalID, instructionID), instructionAmount)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_FREQUENCY)(goalID, instructionID), instructionFrequency)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE)(goalID, instructionID), instructionInitialDate)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE)(goalID, instructionID), instructionNextDate)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_TYPE)(goalID, instructionID), instructionType)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INSTRUCTION_STATUS)(goalID, instructionID), instructionStatus)

        let globalGoalRecurringID = PHANTOM.getIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_ID)(goalID))

        if (globalGoalRecurringID === instructionID) {
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_ID)(goalID), undefined)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT)(goalID), undefined)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY)(goalID), undefined)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_NEXT_DATE)(goalID), undefined)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_STATUS)(goalID), undefined)
          s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_TYPE)(goalID), undefined)
        }
      }
    })
  } catch (error) {
    console.log('[[[INVESTMENT REDUCER ERROR: modify user instruction ]]]] :: ', error)
  }

  return s
}

const fetchUserTransactionsSuccessHandler = (state, action) => {
  try {
    let transactions = action[USER_ENTITIES.USER_DETAIL]['transactions']
    let s = state

    transactions.map(i => {
      let investmentID = i['transaction_goal_id']
      let isPresent = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_ID)(investmentID))

      if (isPresent) {
        let transactionID = i['transaction_reference_id']
        let transactionAmount = i['transaction_amount']
        let transactionStatus = i['transaction_status']
        let transactionType = i['transaction_type']
        let transactionTime = i['transaction_time']
        let transactionStocks = i['transaction_stocks']

        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_ID)(investmentID, transactionID), transactionID)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_AMOUNT)(investmentID, transactionID), transactionAmount)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_STOCKS)(investmentID, transactionID), transactionStocks)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_STATUS)(investmentID, transactionID), transactionStatus)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_TYPE)(investmentID, transactionID), transactionType)
        s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.TRANSACTION_TIME)(investmentID, transactionID), transactionTime)
      }
    })

    return s
  } catch (err) {
    return state
  }
}

// ========================================================
// Reducer Formation & Exports
// ========================================================

export const HANDLERS = {

  [UserTypes.RESET_STORE]: resetStoreHandler,
  [UserTypes.REFRESH_HEALTH]: refreshHealthHandler,

  // modify as per new scheme
  [Types.ADD_INVESTMENT]: addInvestmentHandler,
  [Types.ADD_INVESTMENT_SUCCESS]: addInvestmentSuccessHandler,
  [Types.ADD_INVESTMENT_FAILURE]: addInvestmentFailureHandler,

  [Types.FETCH_PRODUCTS]: fetchProductsHandler,
  [Types.FETCH_PRODUCTS_SUCCESS]: fetchProductsSuccessHandler,
  [Types.FETCH_PRODUCTS_FAILURE]: fetchProductsFailureHandler,

  [Types.FLUSH_PRODUCTS]: flushProductsHandler,

  [UserTypes.MODIFY_USER_INSTRUCTION_SUCCESS]: modifyUserInstructionSuccessHandler,

  [GoalTypes.FETCH_GOAL_DETAIL_SUCCESS]: fetchGoalDetailSuccessHandler,
  [GoalTypes.TRANSFER_SUCCESS]: transferSuccessHandler,
  [UserTypes.FETCH_USER_SUCCESS]: fetchUserSuccessHandler,
  [UserTypes.FETCH_USER_DETAIL_SUCCESS]: fetchUserDetailSuccessHandler,

  [UserTypes.FETCH_USER_INSTRUCTIONS]: fetchUserInstructionsHandler,
  [UserTypes.FETCH_USER_INSTRUCTIONS_SUCCESS]: fetchUserInstructionsSuccessHandler,

  [GoalTypes.FETCH_GOAL_DETAIL_SUCCESS]: fetchGoalDetailSuccessHandler,

  [SettingTypes.FETCH_USER_TRANSACTIONS_SUCCESS]: fetchUserTransactionsSuccessHandler
}

export const reducer = createReducer(INITIAL_STATE, HANDLERS)

// ========================================================
// Selectors
// ========================================================

export const getProduct = (state, type, ticker) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.PRODUCT)(type, ticker))

export const getInvestments = (state, CID) => {
  let arr = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.CID_INDEX)(CID))
  var result = []
  for (var k in arr) {
    result.push(PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_INDEX)(arr[k])))
  }
  return result
}

export const doWeHaveInvestments = (state) => {
  let childMap = PHANTOM.getIn(state, path(GOAL_ENTITIES.CHILD_MAP)())
  let values = childMap && Object.values(childMap)
  let haveInvestments = false
  values && values.map(v => {
    if (v && v.length > 0) {
      haveInvestments = true
    }
  })
  return haveInvestments
}

export const getTypePriority = (state, type) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.PRIORITY)(type))

export const getTypes = (state) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.TYPES)())

export const getInvestmentName = (state, GID) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_NAME)(GID))

export const getInvestmentImage = (state, ticker) => PHANTOM.getIn(state, path(GOAL_ENTITIES.PRODUCT_IMAGE)(ticker))

export const getInvestmentBalance = (state, GID) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_BALANCE)(GID))

export const getDreamTransactionStocks = (state, IID, TID) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.TRANSACTION_STOCKS)(IID, TID))

export const getInvestment = (state, IID) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_INDEX)(IID))

export const getInvestmentGrowth = (state, IID) => {
  let percentage = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.GROWTH_IN_PERCENTAGE)(IID))
  let value = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.GROWTH_IN_VALUE)(IID))
  return {
    percentage: percentage,
    value: value
  }
}

export const isProcessing = (state) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.PROCESSING)()) === INVESTMENT_ENTITIES.PROCESSING_ADD_INVESTMENT

export const isProcessingProducts = (state) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.PROCESSING)()) === INVESTMENT_ENTITIES.PROCESSING_FETCH_PRODUCTS

export const getInvestmentRecurringValues = (state, investmentID) => {
  let amount = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT)(investmentID))
  let frequency = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY)(investmentID))
  return {
    [INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT]: amount,
    [INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY]: frequency
  }
}

export const getUserDreamsTransactions = (state, investmentID) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.TRANSACTIONS)(investmentID))

export const getProducts = (state) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.PRODUCTS)())

export const getNativeProducts = (state) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.NATIVE_PRODUCTS)())

export const isFetchUserInstructionsProcessing = (state) => PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.PROCESSING)()) === INVESTMENT_ENTITIES.PROCESSING_FETCH_USER_INSTRUCTIONS

export const getStockInfo = (state, investmentID) => {
  let stocks = PHANTOM.getIn(state, path(INVESTMENT_ENTITIES.STOCKS)(investmentID))
  return (stocks && stocks[0])
}
