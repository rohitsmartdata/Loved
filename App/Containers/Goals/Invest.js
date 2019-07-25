/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by viktor on 17/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change} from 'redux-form'
import Screen
  from '../../Components/Goals/Invest'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {getChildren}
  from '../../Redux/Reducers/ChildReducer'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {

    case localActions.UPDATE_FIRST_TRANSFER_DATE:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break

    case localActions.SUBMIT_RECURRING_AMOUNT:
      let amount = action['patch'][GOAL_ENTITIES.RECURRING_AMOUNT]
      let frequency = action['patch'][GOAL_ENTITIES.RECURRING_FREQUENCY]
      dispatch(GoalActions.transfer(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], amount.toString(), frequency.toString(), action[COMMON_ENTITIES.NAVIGATOR], action[CHILD_ENTITIES.CHILD_IDs]))
      break

    case localActions.CANCEL:
      dispatch(GoalActions.hideInvest(action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {

  // update the first transfer date on
  // which recurring payment would be made
  UPDATE_FIRST_TRANSFER_DATE: 'UPDATE_FIRST_TRANSFER_DATE',

  // disappear invest modal
  CANCEL: 'CANCEL',

  // submit the recurring amount
  SUBMIT_RECURRING_AMOUNT: 'SUBMIT_RECURRING_AMOUNT'
}

const mapStateToProps = (state, props) => {
  // get childID
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // get goalID
  const goalID = props[GOAL_ENTITIES.GID]
  // is it operationally stale
  const userID = props[USER_ENTITIES.USER_ID]
  // recurring amount
  const recurringAmount = props[GOAL_ENTITIES.RECURRING_AMOUNT]
  // recurring frequency
  const recurringFrequency = props[GOAL_ENTITIES.RECURRING_FREQUENCY]

  const children = getChildren(state.root.children)
  const childIDs = Object.keys(children)
  const isStale = props[COMMON_ENTITIES.IS_STALE] || false

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    userID: userID,

    childIDs: childIDs,

    childID: childID,

    goalID: goalID,

    isStale: isStale,

    // recurring amount
    recurringAmount: recurringAmount,

    recurringFrequency: recurringFrequency,

    parentNavigator: props[COMMON_ENTITIES.PARENT_NAVIGATOR]
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
