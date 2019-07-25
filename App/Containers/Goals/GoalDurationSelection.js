/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 19/2/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change}
  from 'redux-form'
import Screen
  from '../../Components/Goals/GoalDurationSelection'
import {GoalActions, getGoalName}
  from '../../Redux/Reducers/GoalReducer'
import {getDOB, getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import moment
  from 'moment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {

    case localActions.TOGGLE_DURATION:
      dispatch(change(payload['form'], payload['field'], payload['duration']))
      break

    case localActions.SET_DURATION:
      const duration = action[GOAL_ENTITIES.DURATION]
      dispatch(change(action['form'], GOAL_ENTITIES.DURATION, action[GOAL_ENTITIES.DURATION]))
      dispatch(GoalActions.goalDurationSelected(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR], action[COMMON_ENTITIES.NAVIGATOR_TITLE]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  TOGGLE_DURATION: 'TOGGLE_DURATION',
  SET_DURATION: 'SET_DURATION'
}

const mapStateToProps = (state, props) => {
  // let duration = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values && state.form[FORM_TYPES.ADD_GOAL].values.duration

  // get childID
  const childID = props[GOAL_ENTITIES.CID]
  // get goalID
  const goalID = props[GOAL_ENTITIES.GID]
  // goal name
  const goalName = getGoalName(state.root.goals, goalID)
  // first name
  const firstName = getFirstName(state.root.children, childID)
  // child's DOB
  const DOB = getDOB(state.root.children, childID)

  let age = 0
  if (DOB) {
    let birthDate = moment(DOB, 'YYYY-MM-DD')
    let currentDate = moment()
    age = currentDate.diff(birthDate, 'y')
  }

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    childID: childID,

    goalID: goalID,

    goalName: goalName,

    firstName: firstName,

    age: age,

    navigatorTitle: props[COMMON_ENTITIES.NAVIGATOR_TITLE]
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
