/* eslint-disable no-trailing-spaces,no-multiple-empty-lines */
/**
 * Created by viktor on 5/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change} from 'redux-form'
import Screen
  from '../../Components/Goals/RecurringAmount'
import {GoalActions, isGoalProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {getChildren}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID, isUserProcessing, isFundingSourceLinked}
  from '../../Redux/Reducers/UserReducer'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {

    case localActions.UPDATE_ONE_OFF_INVESTMENT:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break

    case localActions.SHOW_INVEST:
      // send transfer instruction first
      dispatch(GoalActions.transfer(
        action[USER_ENTITIES.USER_ID],
        action[CHILD_ENTITIES.CHILD_ID],
        action[GOAL_ENTITIES.GID],
        undefined,
        undefined,
        action[GOAL_ENTITIES.ONE_OFF_INVESTMENT]
      ))
      // navigate to next screen as per plaid linked or not
      const isPlaidLinked = action[USER_ENTITIES.PLAID_LINKED]
      if (isPlaidLinked) {
        dispatch(GoalActions.navigateToTransferScreen(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[GOAL_ENTITIES.NAME], action[GOAL_ENTITIES.ONE_OFF_INVESTMENT], action[COMMON_ENTITIES.NAVIGATOR], false))
      } else {
        dispatch(GoalActions.confirmBankConnection(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[GOAL_ENTITIES.NAME], action[GOAL_ENTITIES.ONE_OFF_INVESTMENT], action[COMMON_ENTITIES.NAVIGATOR], false))
      }
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {

  SHOW_INVEST: 'SHOW_INVEST',

  UPDATE_ONE_OFF_INVESTMENT: 'UPDATE_ONE_OFF_INVESTMENT'
}

const mapStateToProps = (state, props) => {
  // get CHILD id
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // get goalID
  const goalID = props[GOAL_ENTITIES.GID]
  // goal name
  const goalName = props[GOAL_ENTITIES.NAME]

  // user id
  const userID = getUserID(state.root.u)
  // is user processing something
  const isProcessing = isGoalProcessing(state.root.goals)

  // is plaid processing
  const isPlaidProcessing = isUserProcessing(state.root.u)
  // is plaid already linked
  const isPlaidLinked = isFundingSourceLinked(state.root.u)
  // children object
  const children = getChildren(state.root.children)
  // child id's array (for detail fetch)
  const childIDs = (children && Object.keys(children)) || []

  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  let oneOffInvestment = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.ONE_OFF_INVESTMENT]) || 20

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    isProcessing: isProcessing,

    isPlaidLinked: isPlaidLinked,

    userID: userID,
    childID: childID,
    goalID: goalID,
    goalName,

    childIDs: childIDs,

    oneOffInvestment: oneOffInvestment,

    isPlaidProcessing: isPlaidProcessing
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
