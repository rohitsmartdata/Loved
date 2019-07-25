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
  from '../../Components/Invest/InvestAmount'
import {FORM_TYPES}
  from '../../Config/contants'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {InvestmentActions}
  from '../../Redux/Reducers/InvestmentReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
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
    case localActions.UPDATE_INVESTMENT_AMOUNT:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break

    case localActions.INVESTMENT_AMOUNT_SELECTED:
      dispatch(InvestmentActions.investmentAmountSelected(action[CHILD_ENTITIES.CHILD_ID], action[INVESTMENT_ENTITIES.INVESTMENT_NAME], action[COMMON_ENTITIES.NAVIGATOR], action[GOAL_ENTITIES.IS_ADD_RECURRING], action[INVESTMENT_ENTITIES.PRODUCT]))
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
  INITIALIZE: 'initialze',
  UPDATE_INVESTMENT_AMOUNT: 'updateInvestmentAmount',
  INVESTMENT_AMOUNT_SELECTED: 'investmentAmountSelected',
  SKIP: 'SKIP'
}

const mapStateToProps = (state, props) => {
  // get user id
  const userID = getUserID(state.root.u)
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // firstname
  const firstName = getFirstName(state.root.children, childID)
  // are form values present ?
  let valuesPresent = state.form[FORM_TYPES.ADD_INVESTMENT] && state.form[FORM_TYPES.ADD_INVESTMENT].values
  // investment name
  let investmentName = props[INVESTMENT_ENTITIES.INVESTMENT_NAME] || (valuesPresent && (state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_NAME])) || ''
  let isAddRecurring = props[GOAL_ENTITIES.IS_ADD_RECURRING]

  let product = props[INVESTMENT_ENTITIES.PRODUCT]
  let productPrice = props[INVESTMENT_ENTITIES.PRODUCT] && props[INVESTMENT_ENTITIES.PRODUCT][INVESTMENT_ENTITIES.PRODUCT_BOOST_AMOUNT] || '$20'
  // goal name
  let investmentAmount = (valuesPresent && (state.form[FORM_TYPES.ADD_INVESTMENT].values[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT])) || productPrice.substr(1)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    userID: userID,

    childID: childID,

    firstName,

    // investment amount selected
    investmentAmount,

    // name of investment
    investmentName,

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
