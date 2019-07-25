/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 26/4/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change, reset}
  from 'redux-form'
import Screen
  from '../../Components/Invest/InvestFrequency'
import {FORM_TYPES}
  from '../../Config/contants'
import {ChildActions, isChildSSNAdded}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID, isFundingSourceLinked}
  from '../../Redux/Reducers/UserReducer'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {InvestmentActions, isProcessing}
  from '../../Redux/Reducers/InvestmentReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { analytics } from '../../Config/AppConfig'
import {events} from '../../Utility/Mapper/Tracking'
import { GOAL_ENTITIES } from '../../Utility/Mapper/Goal'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action) => {
  const {type, payload} = action
  switch (type) {
    case localActions.ADD_INVESTMENT:
      const isSSNAdded = action[CHILD_ENTITIES.IS_SSN_ADDED]
      dispatch(change(FORM_TYPES.ADD_INVESTMENT, INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY, action[INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY]))
      if (isSSNAdded) {
        dispatch(InvestmentActions.addInvestment(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[INVESTMENT_ENTITIES.INVESTMENT_NAME], action[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID], '4edb157c-a321-4f77-adfb-544c0f208a43', action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT], action[INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY], action[USER_ENTITIES.IS_PLAID_LINKED], action[COMMON_ENTITIES.NAVIGATOR]))
      } else {
        dispatch(ChildActions.askSsn(
          action[CHILD_ENTITIES.CHILD_ID],
          {
            [USER_ENTITIES.USER_ID]: action[USER_ENTITIES.USER_ID],
            [CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID],
            [INVESTMENT_ENTITIES.INVESTMENT_NAME]: action[INVESTMENT_ENTITIES.INVESTMENT_NAME],
            [INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]: action[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID],
            [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: action[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT],
            [INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY]: action[INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY],
            [USER_ENTITIES.IS_PLAID_LINKED]: action[USER_ENTITIES.IS_PLAID_LINKED]
          },
          true, // is investment
          action[COMMON_ENTITIES.NAVIGATOR]
          ))
      }
      break

    case localActions.SKIP:
      dispatch(reset(FORM_TYPES.ADD_INVESTMENT))
      dispatch(GoalActions.skipGoal(action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.DREAM_SKIPPED,
        properties: {
          dream: action[INVESTMENT_ENTITIES.INVESTMENT_NAME]
        }
      })
      // *********** Log Analytics ***********
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  ADD_INVESTMENT: 'addInvestment',
  SKIP: 'skip'
}

const mapStateToProps = (state, props) => {
  // get user id
  const userID = getUserID(state.root.u)
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // is plaid already linked
  const isPlaidLinked = isFundingSourceLinked(state.root.u)
  // is add investment processing
  const processing = isProcessing(state.root.investments)

  // are form values present ?
  let valuesPresent = state.form[FORM_TYPES.ADD_INVESTMENT] && state.form[FORM_TYPES.ADD_INVESTMENT].values
  // investment name
  let investmentName = (valuesPresent && (state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_NAME]))
  // investment amount
  let investmentAmount = (valuesPresent && (state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]))
  // portfolio id
  let investmentPortfolioID = (valuesPresent && (state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]))

  // is child ssn added
  let childSSNAdded = isChildSSNAdded(state.root.children, childID)
  let isAddRecurring = props[GOAL_ENTITIES.IS_ADD_RECURRING]

  let product = props[INVESTMENT_ENTITIES.PRODUCT]
  console.log('[[[[ is child ssn added ]]]] ---> ', childSSNAdded)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID: userID,

    // child id
    childID: childID,

    // is add investment processing
    processing: processing,

    // is plaid linked
    isPlaidLinked: isPlaidLinked,

    // investment amount selected
    investmentAmount,

    // investment portfolio id
    investmentPortfolioID,

    // name of investment
    investmentName,

    isChildSSNAdded: childSSNAdded,

    isAddRecurring,

    product
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleLocalAction: (actionType, navigation) => handleLocalAction(dispatch, actionType, navigation)
  }
}

// ========================================================
// Connect & Export
// ========================================================

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
