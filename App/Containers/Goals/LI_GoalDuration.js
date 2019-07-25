/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 14/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change, reset}
  from 'redux-form'
import Screen
  from '../../Components/Goals/LI_GoalDuration'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import { getDOB, getFirstName }
  from '../../Redux/Reducers/ChildReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {FORM_TYPES}
  from '../../Config/contants'
import moment from 'moment'
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
    case localActions.UPDATE_GOAL_MATURITY_AGE:
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
    case localActions.CONTINUE:
      const pFunc = action['pushFunc']
      pFunc({[CHILD_ENTITIES.CHILD_ID]: action[CHILD_ENTITIES.CHILD_ID], [GOAL_ENTITIES.NAME]: action[GOAL_ENTITIES.NAME]})
      break
    case localActions.CONTINUE_PREPAREATION:
      dispatch(GoalActions.selectGoalPortfolio(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.track({
        userId: action[USER_ENTITIES.USER_ID],
        event: events.GOAL_CREATE_AGE,
        properties: {
          goal_name: action[GOAL_ENTITIES.NAME],
          goal_fund: action[GOAL_ENTITIES.GOAL_AMOUNT],
          goal_age: action[GOAL_ENTITIES.GOAL_MATURITY_AGE]
        }
      })
      // *********** Log Analytics ***********
      break
    case localActions.SELECT_GOAL_PORTFOLIO:
      dispatch(GoalActions.prepareInvestment(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
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
  UPDATE_GOAL_MATURITY_AGE: 'updateGoalMaturityAge',
  // continue
  CONTINUE: 'CONTINUE',
  CONTINUE_PREPAREATION: 'CONTINUE_PREPAREATION',
  // select goal duration
  SELECT_GOAL_PORTFOLIO: 'SELECT_GOAL_PORTFOLIO'
}

const mapStateToProps = (state, props) => {
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // child first name
  let firstname = getFirstName(state.root.children, childID)
  // child dob
  let dob = getDOB(state.root.children, childID)
  const minAgeValue = dob ? moment().diff(dob, 'y') + 1 : 1
  let expectedGoalMaturityAge = minAgeValue > 18 ? minAgeValue : 18
  // user id
  let userID = getUserID(state.root.u)

  let valuesPresent = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values
  // goal name
  let goalName = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.NAME])
  // goal amount
  let goalAmount = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_AMOUNT]) || 0
  // tentating child target age
  let goalMaturityAge = (valuesPresent && state.form[FORM_TYPES.ADD_GOAL].values[GOAL_ENTITIES.GOAL_MATURITY_AGE]) || expectedGoalMaturityAge

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

    // is modal
    isModal,

    // user id
    userID,

    // child name
    firstName: firstname,

    // child minimum
    minAgeValue,

    // goal amount
    goalAmount: parseInt(goalAmount),

    // goal maturity age
    goalMaturityAge
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
