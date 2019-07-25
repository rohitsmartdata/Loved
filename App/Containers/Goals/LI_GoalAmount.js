/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 14/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/LI_GoalAmount'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {FORM_TYPES}
  from '../../Config/contants'
import {change, reset}
  from 'redux-form'
import {events, errorKeywords}
  from '../../Utility/Mapper/Tracking'
import { analytics }
  from '../../Config/AppConfig'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {
    case localActions.CONTINUE:
      const pFunc = action['pushFunc']
      pFunc({[CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID], [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME]})
      break
    case localActions.UPDATE_GOAL_AMOUNT:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break
    case localActions.POP:
      const popFunc = action['popFunc']
      popFunc()
      break
    case localActions.PUSH:
      const pushFunc = action['pushFunc']
      pushFunc()
      break
    case localActions.SELECT_GOAL_DURATION:
      dispatch(GoalActions.selectGoalDuration(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.GOAL_CREATE_FUND,
        properties: {
          goal_name: action[GOAL_ENTITIES.NAME],
          goal_fund: action[GOAL_ENTITIES.GOAL_AMOUNT]
        }
      })
      // *********** Log Analytics ***********
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  // pop screen
  POP: 'pop',
  // push screen
  PUSH: 'push',
  // update goal amount
  UPDATE_GOAL_AMOUNT: 'UPDATE_GOAL_AMOUNT',
  // continue
  CONTINUE: 'CONTINUE',
  // navigate to select goal amount screen
  SELECT_GOAL_DURATION: 'SELECT_GOAL_DURATION'
}

const mapStateToProps = (state, props) => {
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // child first name
  let firstname = getFirstName(state.root.children, childID)
  // user id
  let userID = getUserID(state.root.u)

  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  // goal name
  let goalName = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.NAME])
  // goal amount
  let goalAmount = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_AMOUNT]) || 40000
  // is modal or screen
  let pushFunc = props['pushFunc']
  // is modal
  let isModal = pushFunc !== undefined

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // goal name
    goalName,

    // child id
    childID,

    // user id
    userID,

    // is modal
    isModal,

    // child name
    firstName: firstname,

    // goal amount
    goalAmount: parseInt(goalAmount)
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
