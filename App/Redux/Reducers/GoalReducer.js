/* eslint-disable comma-dangle,comma-dangle,key-spacing,no-trailing-spaces,no-multi-spaces,no-unused-vars */
/**
 * Created by victorchoudhary on 15/05/17.
 */

// ========================================================
// Import packages
// ========================================================

import {Alert}
  from 'react-native'
import { createReducer, createActions }
  from 'reduxsauce'
import Immutable
  from 'seamless-immutable'
import {processingIndicators, SEGMENT_ACTIONS}
  from '../../Config/contants'
import PARAMETERS
  from '../ActionParameters'
import {GOAL_ENTITIES, path}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {UserTypes}
  from './UserReducer'
import {SettingTypes}
  from './SettingReducer'
import PHANTOM
  from '../../Utility/Phantom'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import {Sentry}
  from 'react-native-sentry'
import {events, errorKeywords}
  from '../../Utility/Mapper/Tracking'

// ========================================================
// Types & Action Creators
// ========================================================

const {Types, Creators} = createActions({
  startAddingGoal : null,
  showInvest: PARAMETERS.SHOW_INVEST,
  hideInvest: PARAMETERS.HIDE_INVEST,
  goalTypeSelected: PARAMETERS.GOAL_TYPE_SELECTED,
  goalDurationSelected: PARAMETERS.GOAL_DURATION_SELECTED,
  goalDurationSelectionNeeded: PARAMETERS.GOAL_DURATION_SELECTION_NEEDED,
  goalAmountSelected: PARAMETERS.GOAL_AMOUNT_SELECTED,
  recurringAmountSelected: null,

  // add a new goal for Sprout
  addCustomGoal   : PARAMETERS.ADD_CUSTOM_GOAL,
  // Success in Adding Goal
  addCustomGoalSuccess: PARAMETERS.ADD_CUSTOM_GOAL_SUCCESS,
  // Failure in Adding Goal
  addCustomGoalFailure: PARAMETERS.ADD_CUSTOM_GOAL_FAILURE,

  goalSelected: PARAMETERS.GOAL_SELECTED,

  makeGoal : PARAMETERS.MAKE_GOAL,
  addGoalSuccess: PARAMETERS.ADD_GOAL_SUCCESS,
  addGoalFailure: PARAMETERS.ADD_GOAL_FAILURE,

  notifyRiskAssessment: PARAMETERS.NOTIFY_RISK_ASSESSMENT,

  skipGoal: PARAMETERS.SKIP_GOAL,

  customizePortfolio: PARAMETERS.CUSTOMIZE_PORTFOLIO,

  fetchGoalDetail: PARAMETERS.FETCH_GOAL_DETAIL,
  fetchGoalDetailSuccess: PARAMETERS.FETCH_GOAL_DETAIL_SUCCESS,
  fetchGoalDetailFailure: PARAMETERS.FETCH_GOAL_DETAIL_FAILURE,

  fetchGoalChartData: PARAMETERS.FETCH_GOAL_CHART_DATA,
  fetchGoalChartDataSuccess: PARAMETERS.FETCH_GOAL_CHART_DATA_SUCCESS,
  fetchGoalChartDataFailure: PARAMETERS.FETCH_GOAL_CHART_DATA_FAILURE,

  updateCompleteGoal: PARAMETERS.UPDATE_COMPLETE_GOAL,
  updatePartialGoal: PARAMETERS.UPDATE_PARTIAL_GOAL,
  updateGoalSuccess: PARAMETERS.UPDATE_GOAL_SUCCESS,
  updateGoalFailure: PARAMETERS.UPDATE_GOAL_FAILURE,

  navigateToTransferScreen: PARAMETERS.NAVIGATE_TO_TRANSFER_SCREEN,
  transfer: PARAMETERS.TRANSFER,
  transferSuccess: PARAMETERS.TRANSFER_SUCCESS,
  transferFailure: ['error'],

  navigateToEditRecurringAmount: PARAMETERS.NAVIGATE_TO_EDIT_RECURRING_AMOUNT,

  fetchPerformanceData: PARAMETERS.FETCH_PERFORMANCE_DATA,
  fetchPerformanceDataSuccess: PARAMETERS.FETCH_PERFORMANCE_DATA_SUCCESS,
  fetchPerformanceDataFailure: PARAMETERS.FETCH_PERFORMANCE_DATA_FAILURE,

  fetchInvestChartData: PARAMETERS.FETCH_INVEST_CHART_DATA,
  fetchInvestChartDataSuccess: PARAMETERS.FETCH_INVEST_CHART_DATA_SUCCESS,
  fetchInvestChartDataFailure: PARAMETERS.FETCH_INVEST_CHART_DATA_FAILURE,
  flushInvestChartData: PARAMETERS.FLUSH_INVEST_CHART_DATA,

  // select the portfolio risk
  costExpectedSelected: PARAMETERS.COST_EXPECTED_SELECTED,
  selectRisk      : PARAMETERS.SELECT_RISK,
  addRisk         : PARAMETERS.ADD_RISK,
  hideRisk        : PARAMETERS.HIDE_RISK,

  // view selected goal in VIEW_GOAL Screen
  viewGoal        : ['payload'],
  // invest on goal
  investOnGoal    : PARAMETERS.INVEST_ON_GOAL,
  navigateToHomepage: PARAMETERS.NAVIGATE_TO_HOMEPAGE,

  // navigate to action screen
  navigateToActionScreen: PARAMETERS.NAVIGATE_TO_ACTION_SCREEN,

  // navigate to edit goal screen,
  // payload would contain GID and CID
  navigateToEditGoal : PARAMETERS.NAVIGATE_TO_EDIT_GOAL,

  // edit selected goal
  editGoal        : PARAMETERS.EDIT_GOAL,
  // Success in editing goal
  editGoalSuccess : ['payload'],
  // Failure in editing goal
  editGoalFailure : ['payload'],

  // navigate to withdraw screen
  navigateToWithdraw: PARAMETERS.NAVIGATE_TO_WITHDRAW,

  withdraw: PARAMETERS.WITHDRAW,
  withdrawSuccess: PARAMETERS.WITHDRAW_SUCCESS,
  withdrawFailure: PARAMETERS.WITHDRAW_FAILURE,

  // confirm bank connect
  confirmBankConnection   : PARAMETERS.CONFIRM_BANK_CONNECTION,
  // confirm if you want to skip bank connection
  skipBankConnection: PARAMETERS.SKIP_BANK_CONNECTION,
  // pop screen
  popScreen: PARAMETERS.POP_SCREEN,

  // show disclaimer
  showDisclaimer: PARAMETERS.SHOW_DISCLAIMER,

  // select goal
  selectGoal: PARAMETERS.SELECT_GOAL,
  selectGoalAmount: PARAMETERS.SELECT_GOAL,
  selectGoalDuration: PARAMETERS.SELECT_GOAL,
  selectGoalPortfolio: PARAMETERS.SELECT_GOAL,
  selectGoalFund: PARAMETERS.SELECT_GOAL,
  selectStartInvesting: PARAMETERS.SELECT_GOAL,
  prepareInvestment: PARAMETERS.SELECT_GOAL,

  confirmGoal: PARAMETERS.CONFIRM_GOAL
})

export const GoalTypes      = Types
export const GoalActions    = Creators

// ========================================================
// Initial State
// ========================================================

/*
  Initial State of the Goal reducer.

  goal : {

    // mapping of child to their goals
    CHILD_MAP : {
      'CIDx' : [ 'GIDx', 'GIDx', ... ],
      'CIDxx': [ ... ]
    },

    // sanity of the goal module
    SANITY : {
      OK : true,
      ERROR : undefined,
      PROCESSING : {
        ADD_GOAL_PROCESSING : false
      }
    },

    // mapping of each goal with its
    // concerned data
    'GIDx' : { },
    'GIDxx': { },
    ...
  }

 */
export var INITIAL_STATE = Immutable({})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.CHILD_MAP)(), {})
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.IS_OK)(), true)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.ERROR)(), undefined)
INITIAL_STATE = PHANTOM.setIn(INITIAL_STATE, path(GOAL_ENTITIES.PROCESSING)(), undefined)

// ========================================================
// Handler Functions
// ========================================================

const resetStoreHandler = (state) => {
  return INITIAL_STATE
}

const refreshHealthHandler = (state) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
  return s
}

/*
  Add Goal.
  This function is called when Add Goal is initiated.

  Store modification :-
  1. Set { sanity : {processing : {'addingGoal' : true} } }
 */
const addCustomGoalHandler = (state, payload) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.ADD_CUSTOM_GOAL_PROCESSING)

/*
  Add Goal Success.
  This function is called when addGoal is successful.

  Store modification :-
  1. Set {'GID' : payload}
  2. Set { sanity : {ok : true} }
  3. Set { sanity : {error : undefined} }
  4. Set { sanity : {processing : {'addingGoal' : false} } }
 */
const addCustomGoalSuccessHandler = (state, action) => {
  try {
    let payload = PHANTOM.assertAndPackActionPayload(action)

    let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
    // set goal id to payload in store
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GID_INDEX)(payload[GOAL_ENTITIES.GID]), payload)

    let arr = PHANTOM.getIn(s, path(GOAL_ENTITIES.CID_INDEX)(payload[GOAL_ENTITIES.CID]))
    if (!arr) {
      arr = []
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.CID_INDEX)(payload[GOAL_ENTITIES.CID]), arr)
    }
    arr = arr.concat(payload[GOAL_ENTITIES.GID])
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.CID_INDEX)(payload[GOAL_ENTITIES.CID]), arr)
    return s
  } catch (error) {
    // console.warn('GOAL REDUCER ERROR [ADD_CUSTOM_GOAL_SUCCESS] : ', error)
    return state
  }
}

/*
  Add Goal Failure.
  This function is called when Add Goal is not successful.

  Store modification :-
  1. Set { sanity : {ok : false} }
  2. Set { sanity : {error : object} }
  3. Set { sanity : {processing : {'addingGoal' : false} } }
 */
const addCustomGoalFailureHandler = (state, {error}) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), false)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), error)
  return s
}

const addGoalHandler = (state, payload) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.ADD_CUSTOM_GOAL_PROCESSING)

const addGoalSuccessHandler = (state, action) => {
  try {
    let childID = action[CHILD_ENTITIES.CHILD_ID]
    let goalID = action[GOAL_ENTITIES.GID]
    let userID = action[USER_ENTITIES.USER_ID]

    let goalData = action[GOAL_ENTITIES.GOAL_DATA]
    let goalTarget = goalData['target'] || 0        // dereference early to avoid parsing error

    let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)

    // set goal id to payload in store
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GID)(goalID), goalID)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.NAME)(goalID), goalData['name'])
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_AMOUNT)(goalID), parseFloat(goalTarget))
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PORTFOLIO_RISK)(goalID), goalData['current_portfolio_id'])
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.END_DATE)(goalID), goalData['end_date'])

    // map it to child
    // check if child entry is already there
    let arr = PHANTOM.getIn(s, path(GOAL_ENTITIES.CID_INDEX)(childID))
    if (!arr) {
      arr = []
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.CID_INDEX)(childID), arr)
    }
    arr = arr.concat(goalID)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.CID_INDEX)(childID), arr)

    return s
  } catch (error) {
    return state
  }
}

const addGoalFailureHandler = (state, error) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), error)
  return s
}

const updateGoalSuccessHandler = (state, action) => {
  try {
    let payload = PHANTOM.assertAndPackActionPayload(action)

    let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)

    let goalID = action[GOAL_ENTITIES.GID]
    let goalData = action[GOAL_ENTITIES.GOAL_DATA]

    let goalAmount = goalData['target']
    goalAmount || (goalAmount = 10000)
    let recurringAmount = goalData['recurringinvestmentamount']
    let recurringFrequency = goalData['recurringinvestmentfrequency']
    let firstTransferDate = goalData['initialtransferdate']

    goalAmount && (goalAmount !== null) && (s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_AMOUNT)(goalID), goalAmount))
    goalAmount && (goalAmount != null) && (s = PHANTOM.setIn(s, path(GOAL_ENTITIES.BALANCE)(goalID), parseFloat(goalAmount) / 3))
    recurringAmount && (recurringAmount !== null) && (s = PHANTOM.setIn(s, path(GOAL_ENTITIES.RECURRING_AMOUNT)(goalID), recurringAmount))
    recurringFrequency && (recurringFrequency !== null) && (s = PHANTOM.setIn(s, path(GOAL_ENTITIES.RECURRING_FREQUENCY)(goalID), recurringFrequency))
    firstTransferDate && (firstTransferDate !== null) && (s = PHANTOM.setIn(s, path(GOAL_ENTITIES.FIRST_TRANSFER_DATE)(goalID), firstTransferDate))

    return s
  } catch (error) {
    // console.warn('GOAL REDUCER ERROR [UPDATE_GOAL_SUCCESS] : ', error)
    return state
  }
}

const updateGoalFailureHandler = (state, {error}) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), false)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), error)
  return s
}

const fetchUserDetailSuccessHandler = (state, action) => {
  try {
    // set state of goal data as OK
    let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)

    // de-refer user detail data
    let sprouts = action[USER_ENTITIES.USER_DETAIL]['sprouts']

    sprouts.map(sprout => {
      let childID = sprout['sprout_id']
      let goals = sprout['goals']

      // map goals to children
      let arr = []
      goals && goals.map(goal => {
        const isGoal = (goal['path_id'] === null)
        const goalID = goal['goal_id']
        if (isGoal && goalID) {
          arr = arr.concat(goalID)
        }
      })
      let prevArr = PHANTOM.getIn(state, path(GOAL_ENTITIES.CID_INDEX)(childID)) || []
      let unique = [...new Set([...arr, ...prevArr])]
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.CID_INDEX)(childID), unique)

      // add goal information to goal index
      goals && goals.map(goal => {
        try {
          const isGoal = (goal['path_id'] === null)
          let goalID = goal['goal_id']
          if (isGoal && goalID) {
            let balance = goal['available_value']
            let totalContribution = goal['total_contributions']
            let growthValue = goal['growth_in_value']
            let growthPercentage = goal['growth_in_percentage']
            let currentValue = goal['current_value']
            let pendingTransfer = goal['pending_transfer_amount']
            let pendingWithdrawal = goal['pending_withdrawal_amount']

            // s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GID_INDEX)(goalID), goalID)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GID)(goalID), goalID)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.BALANCE)(goalID), (balance && parseFloat(balance).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.CURRENT_VALUE)(goalID), (currentValue && parseFloat(currentValue).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PENDING_TRANSFER_AMOUNT)(goalID), (pendingTransfer && parseFloat(pendingTransfer).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PENDING_WITHDRAWAL_AMOUNT)(goalID), (pendingWithdrawal && parseFloat(pendingWithdrawal).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TOTAL_CONTRIBUTIONS)(goalID), (totalContribution && parseFloat(totalContribution).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GROWTH_IN_VALUE)(goalID), (growthValue && parseFloat(growthValue).toFixed(2)) || 0)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GROWTH_IN_PERCENTAGE)(goalID), (growthPercentage && parseFloat(growthPercentage).toFixed(2)) || 0)
          }
        } catch (err) {
          console.log('*** goal entities missing *** ', goal, err)
        }
      })
    })

    let instructions = action[USER_ENTITIES.USER_DETAIL]['instructions']

    instructions && instructions.map(i => {
      let goalID = i['instruction_goal_id']
      let isPresent = PHANTOM.getIn(s, path(GOAL_ENTITIES.GID)(goalID))

      if (isPresent) {
        let instructionID = i['instruction_reference']
        let instructionAmount = i['instruction_amount']
        let instructionFrequency = i['instruction_freqeuncy']
        let instructionInitialDate = i['instruction_initial_date']
        let instructionNextDate = i['instruction_next_activity_date']
        let instructionType = i['instruction_type']
        let instructionStatus = i['instruction_status']

        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_ID)(goalID, instructionID), instructionID)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_AMOUNT)(goalID, instructionID), instructionAmount)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_FREQUENCY)(goalID, instructionID), instructionFrequency)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE)(goalID, instructionID), instructionInitialDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE)(goalID, instructionID), instructionNextDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_TYPE)(goalID, instructionID), instructionType)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_STATUS)(goalID, instructionID), instructionStatus)

        if (instructionFrequency !== 'once' && instructionStatus  && instructionStatus.toLowerCase() !== 'stopped') {
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_ID)(goalID), instructionID)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_AMOUNT)(goalID), instructionAmount)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY)(goalID), instructionFrequency)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE)(goalID), instructionNextDate)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_STATUS)(goalID), instructionStatus)
        }
      }
    })

    let transactions = action[USER_ENTITIES.USER_DETAIL]['transactions']
    transactions && transactions.map(i => {
      let goalID = i['transaction_goal_id']
      let isPresent = PHANTOM.getIn(s, path(GOAL_ENTITIES.GID)(goalID))

      if (isPresent) {
        let transactionID = i['transaction_reference_id']
        let transactionAmount = i['transaction_amount']
        let transactionStatus = i['transaction_status']
        let transactionType = i['transaction_type']
        let transactionTime = i['transaction_time']

        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_ID)(goalID, transactionID), transactionID)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_AMOUNT)(goalID, transactionID), transactionAmount)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_STATUS)(goalID, transactionID), transactionStatus)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_TYPE)(goalID, transactionID), transactionType)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_TIME)(goalID, transactionID), transactionTime)
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
    let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)

    // de-refer user detail data
    let u = action[USER_ENTITIES.USER_DATA]['user'][0]
    let sprouts = (u && u['sprout']) || []

    sprouts.map(sprout => {
      let childID = sprout['sprout_id']
      let goals = sprout['goal']

      // map goals to children
      let arr = []
      goals && goals.map(goal => {
        const isGoal = (goal['path_id'] === null)
        const goalID = goal['goal_id']
        if (isGoal && goalID) {
          arr = arr.concat(goalID)
        }
      })
      let prevArr = PHANTOM.getIn(state, path(GOAL_ENTITIES.CID_INDEX)(childID)) || []
      let unique = [...new Set([...arr, ...prevArr])]
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.CID_INDEX)(childID), unique)

      // add goal information to goal index
      goals && goals.map(goal => {
        try {
          const isGoal = (goal['path_id'] === null)
          let goalID = goal['goal_id']
          if (isGoal && goalID) {
            let name = goal['name']
            let goalAmount = goal['target']
            let riskID = goal['current_portfolio_id']
            let endDate = goal['end_date']

            // s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GID_INDEX)(goalID), goalID)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GID)(goalID), goalID)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.NAME)(goalID), name)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PORTFOLIO_RISK)(goalID), riskID)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.END_DATE)(goalID), endDate)
            s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_AMOUNT)(goalID), (goalAmount && parseFloat(goalAmount).toFixed(2)) || 0)
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

const editGoal = (state, payload) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.EDIT_GOAL_PROCESSING)

const editGoalSuccess = (state, {payload}) => {
  const goalID = payload['goal']['goal_id']
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.NAME)(goalID), payload['goal']['name'])
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_AMOUNT)(goalID), payload['goal']['target'])
  return s
}

const editGoalFailure = (state, {error}) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  return s
}

const withdraw = (state) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.PROCESSING_WITHDRAW)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.LATEST_TRANSFER)(), undefined)
  return s
}
const withdrawSuccess = (state, action) => {
  try {
    let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)

    let instructionData = action[GOAL_ENTITIES.INSTRUCTION_DATA]
    let instructions = instructionData['goal_instructions']
    let transferID = instructionData && instructionData['withdrawal_instruction_id']

    instructions.map(i => {
      let goalID = i['goal_id']
      let isPresent = PHANTOM.getIn(state, path(GOAL_ENTITIES.GID)(goalID))
      let instructionID = i['instruction_id']
      if (transferID === instructionID) {
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.LATEST_TRANSFER)(transferID), i)
      }

      if (isPresent) {
        let instructionAmount = i['instruction_amount']
        let instructionFrequency = i['instruction_frequency']
        let instructionInitialDate = i['instruction_initial_date']
        let instructionNextDate = i['instruction_next_date']
        let instructionType = i['instruction_type']
        let instructionStatus = i['instruction_status']

        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_ID)(goalID, instructionID), instructionID)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_AMOUNT)(goalID, instructionID), instructionAmount)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_FREQUENCY)(goalID, instructionID), instructionFrequency)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE)(goalID, instructionID), instructionInitialDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE)(goalID, instructionID), instructionNextDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_TYPE)(goalID, instructionID), instructionType)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_STATUS)(goalID, instructionID), instructionStatus)

        // if (instructionFrequency !== 'once') {
        //   s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_ID)(goalID), instructionID)
        //   s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_AMOUNT)(goalID), instructionAmount)
        //   s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY)(goalID), instructionFrequency)
        //   s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE)(goalID), instructionNextDate)
        //   s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_STATUS)(goalID), instructionStatus)
        // }
      }
    })

    return s
  } catch (error) {
    return state
  }
}
const withdrawFailure = (state, error) => {
  try {
    let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), false)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), error)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
    return s
  } catch (error) {
    return state
  }
}

const updatePartialGoalHandler = (state, action) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.UPDATE_PARTIAL_GOAL_PROCESSING)
const updateCompleteGoalHandler = (state, action) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.UPDATE_COMPLETE_GOAL_PROCESSING)

const fetchGoalDetailHandler = (state, action) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.FETCH_GOAL_DETAIL_PROCESSING)
const fetchGoalDetailSuccessHandler = (state, action) => {
  let goalData = action[GOAL_ENTITIES.GOAL_DATA]
  let goalID = goalData['goal_id']

  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)

  let isPresent = PHANTOM.getIn(s, path(GOAL_ENTITIES.GID)(goalID))
  if (isPresent) {
    // inject stocks if available
    let stocks = goalData['stocks']
    let sArr = []
    if (stocks) {
      stocks.map(stock => {
        let obj = {}

        obj[GOAL_ENTITIES.STOCK_TICKER] = stock['stock_ticker']
        obj[GOAL_ENTITIES.STOCK_NAME] = stock['stock_name']
        obj[GOAL_ENTITIES.STOCK_CURRENT_VALUE] = stock['stock_current_value']
        obj[GOAL_ENTITIES.STOCK_UNIT_PRICE] = stock['stock_unit_price']
        obj[GOAL_ENTITIES.STOCK_UNITS] = stock['stock_units']
        obj[GOAL_ENTITIES.STOCK_AVAILABLE_UNITS] = stock['stock_available_units']
        obj[GOAL_ENTITIES.STOCK_INVESTED_AMOUNT] = stock['stock_invested_amount']
        sArr.push(obj)
      })
    }
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.STOCKS)(goalID), sArr)
  }

  return s
}
const fetchGoalDetailFailureHandler = (state, {error}) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), error)
  return s
}

const fetchGoalChartDataHandler = (state, action) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.FETCH_GOAL_CHART_DATA_PROCESSING)
const fetchGoalChartDataSuccessHandler = (state, action) => {
  let goalID = action[GOAL_ENTITIES.GID]
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.CHART_DATA)(goalID), action[GOAL_ENTITIES.CHART_DATA])
  return s
}

const fetchTransferSuccessHandler = (state, action) => {
  try {
    let transactions = action[USER_ENTITIES.USER_DATA]['user_transfers']
    let s = state
    transactions.map(transaction => {
      let goalID = transaction['goal_id']
      let transactionID = transaction['transfer_reference_id']
      let transactionAmount = transaction['amount']
      let transactionStatus = transaction['transfer_status']
      let transactionFrequency = transaction['frequency']
      let transactionNextTransferDate = transaction['next_transfer_date']

      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_REFERENCE_ID)(goalID, transactionID), transactionID)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_AMOUNT)(goalID, transactionID), transactionAmount)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_STATUS)(goalID, transactionID), transactionStatus)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_FREQUENCY)(goalID, transactionID), transactionFrequency)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_NEXT_TRANSFER_DATE)(goalID, transactionID), transactionNextTransferDate)
    })
    return s
  } catch (err) {
    return state
  }
}

const fetchPerformanceDataHandler = (state, action) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.FETCH_PERFORMANCE_DATA_PROCESSING)

const fetchPerformanceDataSuccessHandler = (state, action) => {
  let performanceData = action[GOAL_ENTITIES.PERFORMANCE_DATA]

  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
  try {
    let ticker = performanceData['tickers'][0]
    if (ticker) {
      let TC = ticker['ticker']

      let one = ticker['1_year_change_percent']
      let onePerc = isNaN(Math.floor(one)) ? '--' : (one && (Math.floor(one) + '% p.a.'))
      let three = ticker['3_year_change_percent']
      let threePerc = isNaN(Math.floor(three)) ? '--' : (three && (Math.floor(three) + '% p.a.'))
      let five = ticker['5_year_change_percent']
      let fivePerc = isNaN(Math.floor(five)) ? '--' : (five && (Math.floor(five) + '% p.a.'))
      let all = ticker['10_year_change_percent']
      let allPerc = isNaN(Math.floor(all)) ? '--' : (all && (Math.floor(all) + '% p.a.'))

      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_NAME)(TC), TC)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_WHAT_LEARN)(TC), ticker['what_will_they_learn'])
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_WHAT_INVESTMENT)(TC), ticker['what_is_the_investment'])
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_DESCRIPTION)(TC), ticker['description'] || '')
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_UNDERLYING)(TC), ticker['underlying'] || undefined)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_LAST_PRICE)(TC), ticker['last_price'] || 0)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_EXPENSES)(TC), ticker['expenses'] || 0)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_STANDARD_DEVIATION)(TC), ticker['standard_deviation'] || 0)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_DIVIDEND_YIELD)(TC), ticker['dividend_yield'] || 0)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_1_YEAR_CHANGE)(TC), onePerc)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_3_YEAR_CHANGE)(TC), threePerc)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_5_YEAR_CHANGE)(TC), fivePerc)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_OVERALL_CHANGE)(TC), allPerc)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_URL)(TC), ticker['url'])
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_HOLDINGS)(TC), ticker['holdings'] || 0)
      s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TICKER_SHOW_CHART)(TC), ticker['show_chart'] || false)
    }
  } catch (err) {
    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (performanceData && JSON.stringify(performanceData))
    let performanceDataErrorMessage = errorKeywords.PERFORMANCE_DATA_FETCH_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(performanceDataErrorMessage)   // capture & send message to sentry
  }

  return s
}

const fetchPerformanceDataFailureHandler = (state, action) => {
  return state
}

const fetchInvestChartDataHandler = (state, action) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.FETCH_INVEST_CHART_DATA_PROCESSING)

const fetchInvestChartDataSuccessHandler = (state, action) => {
  let investChartData = action[GOAL_ENTITIES.INVEST_CHART_DATA]
  let tickerName = action[GOAL_ENTITIES.TICKER_NAME]
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INVEST_CHART_DATA)(tickerName), [])

  try {
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INVEST_CHART_DATA)(tickerName), investChartData)
  } catch (err) {
    // the following parameters are used for
    // sentry message building
    let errorResponseString = err.message + (investChartData && JSON.stringify(investChartData))
    let performanceDataErrorMessage = errorKeywords.INVEST_CHART_DATA_FETCH_ERROR + ' [ERROR] -> ' + errorResponseString
    Sentry.captureMessage(performanceDataErrorMessage)   // capture & send message to sentry
  }
  return s
}

const flushInvestChartData = (state, action) => {
  let tickerName = action && action[GOAL_ENTITIES.TICKER_NAME]
  return PHANTOM.setIn(state, path(GOAL_ENTITIES.INVEST_CHART_DATA)(tickerName), undefined)
}

const fetchInvestChartDataFailureHandler = (state, error, tickerName) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), error)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INVEST_CHART_DATA)(tickerName), [])
  return state
}

const transferHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.PROCESSING)(), GOAL_ENTITIES.PROCESSING_TRANSFER)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.LATEST_TRANSFER)(), undefined)
  return s
}
const transferSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)

  try {
    let instructionData = action[GOAL_ENTITIES.INSTRUCTION_DATA]
    let instructions = instructionData['goal_instructions']
    let transferID = instructionData && instructionData['transfer_id']

    instructions.map(i => {
      let goalID = i['goal_id']
      let isPresent = PHANTOM.getIn(state, path(GOAL_ENTITIES.GID)(goalID))
      let instructionID = i['instruction_id']

      if (transferID === instructionID) {
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.LATEST_TRANSFER)(transferID), i)
      }

      if (isPresent) {
        let instructionAmount = i['instruction_amount']
        let instructionFrequency = i['instruction_frequency']
        let instructionInitialDate = i['instruction_initial_date']
        let instructionNextDate = i['instruction_next_date']
        let instructionType = i['instruction_type']
        let instructionStatus = i['instruction_status']

        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_ID)(goalID, instructionID), instructionID)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_AMOUNT)(goalID, instructionID), instructionAmount)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_FREQUENCY)(goalID, instructionID), instructionFrequency)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE)(goalID, instructionID), instructionInitialDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE)(goalID, instructionID), instructionNextDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_TYPE)(goalID, instructionID), instructionType)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_STATUS)(goalID, instructionID), instructionStatus)

        if (instructionFrequency !== 'once' && instructionStatus  && instructionStatus.toLowerCase() !== 'stopped') {
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_ID)(goalID), instructionID)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_AMOUNT)(goalID), instructionAmount)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY)(goalID), instructionFrequency)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE)(goalID), instructionNextDate)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_STATUS)(goalID), instructionStatus)
        }
      }
    })
  } catch (err) {
    console.warn('----- transfer success error ---- :: ', err)
  }

  return s
}
const transferFailureHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), false)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), 'plaid linking error')
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)
  return s
}

const fetchUserInstructionsSuccessHandler = (state, action) => {
  try {
    let instructions = action[USER_ENTITIES.USER_DATA]['user_instructions']
    let s = state

    instructions.map(i => {
      let goalID = i['goal_id']
      let isPresent = PHANTOM.getIn(state, path(GOAL_ENTITIES.GID)(goalID))

      if (isPresent) {
        let instructionID = i['instruction_id']
        let instructionAmount = i['instruction_amount']
        let instructionFrequency = i['instruction_frequency']
        let instructionInitialDate = i['instruction_initial_date']
        let instructionNextDate = i['instruction_next_date']
        let instructionType = i['instruction_type']
        let instructionStatus = i['instruction_status']

        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_ID)(goalID, instructionID), instructionID)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_AMOUNT)(goalID, instructionID), instructionAmount)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_FREQUENCY)(goalID, instructionID), instructionFrequency)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE)(goalID, instructionID), instructionInitialDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE)(goalID, instructionID), instructionNextDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_TYPE)(goalID, instructionID), instructionType)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_STATUS)(goalID, instructionID), instructionStatus)
      }
    })

    return s
  } catch (err) {
    return state
  }
}

export const modifyUserInstructionSuccessHandler = (state, action) => {
  let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
  s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)

  try {
    let instructionData = action[GOAL_ENTITIES.INSTRUCTION_DATA]
    let instructions = instructionData['goal_instructions']

    instructions.map(i => {
      let goalID = i['goal_id']
      let isPresent = PHANTOM.getIn(state, path(GOAL_ENTITIES.GID)(goalID))

      if (isPresent) {
        let instructionID = i['instruction_id']
        let instructionAmount = i['instruction_amount']
        let instructionFrequency = i['instruction_frequency']
        let instructionInitialDate = i['instruction_initial_date']
        let instructionNextDate = i['instruction_next_date']
        let instructionType = i['instruction_type']
        let instructionStatus = i['instruction_status']

        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_ID)(goalID, instructionID), instructionID)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_AMOUNT)(goalID, instructionID), instructionAmount)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_FREQUENCY)(goalID, instructionID), instructionFrequency)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_INITIAL_REQUEST_DATE)(goalID, instructionID), instructionInitialDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_NEXT_TRANSFER_DATE)(goalID, instructionID), instructionNextDate)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_TYPE)(goalID, instructionID), instructionType)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.INSTRUCTION_STATUS)(goalID, instructionID), instructionStatus)

        let globalGoalRecurringID = PHANTOM.getIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_ID)(goalID))
        if (globalGoalRecurringID === instructionID) {
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_ID)(goalID), undefined)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_AMOUNT)(goalID), undefined)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY)(goalID), undefined)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE)(goalID), undefined)
          s = PHANTOM.setIn(s, path(GOAL_ENTITIES.GOAL_RECURRING_STATUS)(goalID), undefined)
        }
      }
    })

    return s
  } catch (error) {
    console.log('[[[[ GOAL REDUCER ERROR: MODIFY USER INSTRUCTION :: ', error)
    return s
  }
}

const fetchUserTransactionsSuccessHandler = (state, action) => {
  try {
    let transactions = action[USER_ENTITIES.USER_DETAIL]['transactions']
    let s = state

    transactions.map(i => {
      let goalID = i['transaction_goal_id']
      let isPresent = PHANTOM.getIn(state, path(GOAL_ENTITIES.GID)(goalID))
      if (isPresent) {
        let transactionID = i['transaction_reference_id']
        let transactionAmount = i['transaction_amount']
        let transactionStatus = i['transaction_status']
        let transactionType = i['transaction_type']
        let transactionTime = i['transaction_time']
        let transactionStocks = i['transaction_stocks']

        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_ID)(goalID, transactionID), transactionID)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_AMOUNT)(goalID, transactionID), transactionAmount)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_STATUS)(goalID, transactionID), transactionStatus)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_TYPE)(goalID, transactionID), transactionType)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_TIME)(goalID, transactionID), transactionTime)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.TRANSACTION_STOCKS)(goalID, transactionID), transactionStocks)
      }
    })

    return s
  } catch (err) {
    return state
  }
}

const fetchProductsSuccessHandler = (state, action) => {
  try {
    let s = PHANTOM.setIn(state, path(GOAL_ENTITIES.IS_OK)(), true)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.ERROR)(), undefined)
    s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PROCESSING)(), undefined)

    let products = action['products']

    products.map(p => {
      let isDream = p['is_dream']
      let productType = p['types']
      if (isDream !== undefined && isDream === false) {
        let productTicker = p['ticker']
        let productPortfolioID = p['portfolio_id']
        let productName = p['name']
        let productWhat = p['what_is_the_investment']
        let productDescription = p['description']
        let productBackdropImage = p['backdrop_image']
        let productImage = p['image']
        let productShowChart = p['show_chart']

        let images = {
          [GOAL_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL]: productBackdropImage,
          [GOAL_ENTITIES.PRODUCT_IMAGE_URL]: productImage
        }
        let description = ''
        if (productDescription) {
          description = productDescription.charAt(0).toUpperCase() + productDescription.slice(1)
          description = description.charAt(description.length - 1) === '.' ? description : description + '.'
        }

        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_IMAGE)(productName), images)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_TICKER)(productType, productTicker), productTicker)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_PORTFOLIO_ID)(productType, productTicker), productPortfolioID)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_TYPE)(productType, productTicker), productType)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_NAME)(productType, productTicker), productName)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_WHAT_IS_INVESTMENT)(productType, productTicker), productWhat)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_DESCRIPTION)(productType, productTicker), description)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL)(productType, productTicker), productBackdropImage)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_IMAGE_URL)(productType, productTicker), productImage)
        s = PHANTOM.setIn(s, path(GOAL_ENTITIES.PRODUCT_SHOW_CHART)(productType, productTicker), productShowChart)
      }
    })

    // products =  _.groupBy(products, 'type')
    // load products
    // s = PHANTOM.setIn(s, path(INVESTMENT_ENTITIES.PRODUCTS)(), products)

    return s
  } catch (error) {
    return state
  }
}

const flushProductsHandler = (state) => PHANTOM.setIn(state, path(GOAL_ENTITIES.PRODUCTS)(), undefined)

// ========================================================
// Reducer Formation & Exports
// ========================================================

export const HANDLERS = {

  [UserTypes.RESET_STORE]: resetStoreHandler,
  [UserTypes.REFRESH_HEALTH]: refreshHealthHandler,

  // modify as per new scheme
  [Types.ADD_CUSTOM_GOAL]              : addCustomGoalHandler,
  [Types.ADD_CUSTOM_GOAL_SUCCESS]      : addCustomGoalSuccessHandler,
  [Types.ADD_CUSTOM_GOAL_FAILURE]      : addCustomGoalFailureHandler,

  [Types.ADD_GOAL]: addGoalHandler,
  [Types.MAKE_GOAL]: addGoalHandler,
  [Types.ADD_GOAL_SUCCESS]: addGoalSuccessHandler,
  [Types.ADD_GOAL_FAILURE]: addGoalFailureHandler,

  [Types.UPDATE_PARTIAL_GOAL]          : updatePartialGoalHandler,
  [Types.UPDATE_COMPLETE_GOAL]         : updateCompleteGoalHandler,
  [Types.UPDATE_GOAL_SUCCESS]          : updateGoalSuccessHandler,
  [Types.UPDATE_GOAL_FAILURE]          : updateGoalFailureHandler,

  // used for updating store with goals
  // when the store is refreshed
  [UserTypes.FETCH_USER_DETAIL_SUCCESS]: fetchUserDetailSuccessHandler,

  [UserTypes.MODIFY_USER_INSTRUCTION_SUCCESS]: modifyUserInstructionSuccessHandler,

  [UserTypes.FETCH_USER_SUCCESS]: fetchUserSuccessHandler,

  [UserTypes.FETCH_USER_INSTRUCTIONS_SUCCESS]: fetchUserInstructionsSuccessHandler,

  [SettingTypes.VIEW_TRANSFERS_SUCCESS]: fetchTransferSuccessHandler,

  [Types.EDIT_GOAL]             : editGoal,
  [Types.EDIT_GOAL_SUCCESS]     : editGoalSuccess,
  [Types.EDIT_GOAL_FAILURE]     : editGoalFailure,

  [Types.TRANSFER]        : transferHandler,
  [Types.TRANSFER_SUCCESS]: transferSuccessHandler,
  [Types.TRANSFER_FAILURE]: transferFailureHandler,

  [Types.WITHDRAW]        : withdraw,
  [Types.WITHDRAW_SUCCESS]: withdrawSuccess,
  [Types.WITHDRAW_FAILURE]: withdrawFailure,

  'FETCH_PRODUCTS_SUCCESS': fetchProductsSuccessHandler,

  'FLUSH_PRODUCTS': flushProductsHandler,

  [SettingTypes.FETCH_USER_TRANSACTIONS_SUCCESS]: fetchUserTransactionsSuccessHandler,

  [Types.FETCH_GOAL_DETAIL]               : fetchGoalDetailHandler,
  [Types.FETCH_GOAL_DETAIL_SUCCESS]       : fetchGoalDetailSuccessHandler,
  [Types.FETCH_GOAL_DETAIL_FAILURE]       : fetchGoalDetailFailureHandler,

  [Types.FETCH_GOAL_CHART_DATA]           : fetchGoalChartDataHandler,
  [Types.FETCH_GOAL_CHART_DATA_SUCCESS]   : fetchGoalChartDataSuccessHandler,

  [Types.FETCH_PERFORMANCE_DATA]          : fetchPerformanceDataHandler,
  [Types.FETCH_PERFORMANCE_DATA_SUCCESS]  : fetchPerformanceDataSuccessHandler,
  [Types.FETCH_PERFORMANCE_DATA_FAILURE]  : fetchPerformanceDataFailureHandler,
  [Types.FETCH_INVEST_CHART_DATA]         : fetchInvestChartDataHandler,
  [Types.FETCH_INVEST_CHART_DATA_SUCCESS] : fetchInvestChartDataSuccessHandler,
  [Types.FETCH_INVEST_CHART_DATA_FAILURE] : fetchInvestChartDataFailureHandler,
  [Types.FLUSH_INVEST_CHART_DATA]: flushInvestChartData
}

export const reducer = createReducer(INITIAL_STATE, HANDLERS)

// ========================================================
// Selectors
// ========================================================

export const isGoalProcessing  = (state) => {
  return PHANTOM.getIn(state, path(GOAL_ENTITIES.PROCESSING)()) === GOAL_ENTITIES.ADD_CUSTOM_GOAL_PROCESSING
}

export const getProducts = (state) => PHANTOM.getIn(state, path(GOAL_ENTITIES.PRODUCTS)())

export const getInvestChartData = (state, tickerName) => PHANTOM.getIn(state, path(GOAL_ENTITIES.INVEST_CHART_DATA)(tickerName))

export const getGoals = (state, CID) => {
  let arr = PHANTOM.getIn(state, path(GOAL_ENTITIES.CID_INDEX)(CID))
  var result = []
  for (var k in arr) {
    result.push(PHANTOM.getIn(state, path(GOAL_ENTITIES.GID_INDEX)(arr[k])))
  }
  return result
}

export const doWeHaveGoals = (state) => {
  let childMap = PHANTOM.getIn(state, path(GOAL_ENTITIES.CHILD_MAP)())
  let values = childMap && Object.values(childMap)
  let haveGoals = false
  values && values.map(v => {
    if (v && v.length > 0) {
      haveGoals = true
    }
  })
  return haveGoals
}

export const getGoal = (state, GID) => PHANTOM.getIn(state, path(GOAL_ENTITIES.GID_INDEX)(GID))

export const getGoalName = (state, GID) => PHANTOM.getIn(state, path(GOAL_ENTITIES.NAME)(GID))

export const getGoalBalance = (state, GID) => PHANTOM.getIn(state, path(GOAL_ENTITIES.BALANCE)(GID))

export const getTotalGoalAmount = (state, GID) => PHANTOM.getIn(state, path(GOAL_ENTITIES.GOAL_AMOUNT)(GID))

export const isFetchGoalDetailProcessing = (state) => {
  let processing = PHANTOM.getIn(state, path(GOAL_ENTITIES.PROCESSING)())
  if (processing && processing === GOAL_ENTITIES.FETCH_GOAL_DETAIL_PROCESSING) {
    return true
  } else {
    return false
  }
}

export const isWithdrawProcessing = (state) => PHANTOM.getIn(state, path(GOAL_ENTITIES.PROCESSING)()) === GOAL_ENTITIES.PROCESSING_WITHDRAW

export const getGrowth = (state, GID) => {
  let percentage = PHANTOM.getIn(state, path(GOAL_ENTITIES.GROWTH_IN_PERCENTAGE)(GID))
  let value = PHANTOM.getIn(state, path(GOAL_ENTITIES.GROWTH_IN_VALUE)(GID))
  return {
    percentage: percentage,
    value: value
  }
}

export const getGoalImage = (state, name) => PHANTOM.getIn(state, path(GOAL_ENTITIES.PRODUCT_IMAGE)(name))

export const getTransferInstructions = (state) => {
  const goals = PHANTOM.getIn(state, path(GOAL_ENTITIES.GOALS)())
  const transferIns = []
  Object.values(goals).map(goal => {
    let inst = goal[GOAL_ENTITIES.INSTRUCTIONS]
    inst.map(i => transferIns.push(i))
  })
  return transferIns
}

export const getTransactions = (state, GID) => PHANTOM.getIn(state, path(GOAL_ENTITIES.TRANSACTIONS)(GID))

export const getDesireTransactionStocks = (state, IID, TID) => PHANTOM.getIn(state, path(GOAL_ENTITIES.TRANSACTION_STOCKS)(IID, TID))

export const isPerformanceFetchProcessing = (state) => {
  let processing = PHANTOM.getIn(state, path(GOAL_ENTITIES.PROCESSING)())
  if (processing && processing === GOAL_ENTITIES.FETCH_PERFORMANCE_DATA_PROCESSING) {
    return true
  } else {
    return false
  }
}

export const isGraphFetchProcessing = (state) => PHANTOM.getIn(state, path(GOAL_ENTITIES.PROCESSING)()) === GOAL_ENTITIES.FETCH_INVEST_CHART_DATA_PROCESSING

export const getTickerDetail = (state, tickerName) => PHANTOM.getIn(state, path(GOAL_ENTITIES.TICKER_DATA)(tickerName))

export const getStocks = (state, goalID) => PHANTOM.getIn(state, path(GOAL_ENTITIES.STOCKS)(goalID))

export const isTransferProcessing = (state) => PHANTOM.getIn(state, path(GOAL_ENTITIES.PROCESSING)()) === GOAL_ENTITIES.PROCESSING_TRANSFER

export const getGoalRecurringValues = (state, goalID) => {
  let amount = PHANTOM.getIn(state, path(GOAL_ENTITIES.GOAL_RECURRING_AMOUNT)(goalID))
  let frequency = PHANTOM.getIn(state, path(GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY)(goalID))
  return {
    [GOAL_ENTITIES.GOAL_RECURRING_AMOUNT]: amount,
    [GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY]: frequency
  }
}

export const getUserDesireTransactions = (state, goalID) => PHANTOM.getIn(state, path(GOAL_ENTITIES.TRANSACTIONS)(goalID))

export const getLatestTransfer = (state) => PHANTOM.getIn(state, path(GOAL_ENTITIES.LATEST_TRANSFER)())
