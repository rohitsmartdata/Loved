/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by viktor on 26/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change} from 'redux-form'
import Screen
  from '../../Components/Goals/GoalDuration'
import {GoalActions, getGoalName}
  from '../../Redux/Reducers/GoalReducer'
import {FORM_TYPES}
  from '../../Config/contants'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

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
      dispatch(GoalActions.goalDurationSelected(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR], action[COMMON_ENTITIES.NAVIGATOR_TITLE]))
      break

    case localActions.GOAL_DURATION_SELECTION_NEEDED:
      dispatch(GoalActions.goalDurationSelectionNeeded(action[GOAL_ENTITIES.GOAL_DURATION_TYPE], action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR_TITLE], action[COMMON_ENTITIES.NAVIGATOR]))
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
  SET_DURATION: 'SET_DURATION',
  GOAL_DURATION_SELECTION_NEEDED: 'goalDurationSelectionNeeded'
}

const mapStateToProps = (state, props) => {
  let age = 4
  let duration = state.form[FORM_TYPES.ADD_GOAL] && state.form[FORM_TYPES.ADD_GOAL].values && state.form[FORM_TYPES.ADD_GOAL].values.duration

  // get childID
  const childID = props[GOAL_ENTITIES.CID]
  // get goalID
  const goalID = props[GOAL_ENTITIES.GID]
  // goal name
  const goalName = getGoalName(state.root.goals, goalID)
  // first name
  const firstName = getFirstName(state.root.children, childID)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    age: age,

    // duration of goal
    duration: duration || 15,

    // temp variable to inject birthdays
    birthdays: Array.from(Array(51).keys()).slice(age + 1),

    childID: childID,
    goalID: goalID,
    goalName: goalName,
    firstName: firstName,
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
