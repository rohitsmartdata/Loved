/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 19/2/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import {change} from 'redux-form'
import Screen
  from '../../Components/Goals/CostExpected'
import {GoalActions, getGoalName}
  from '../../Redux/Reducers/GoalReducer'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type, payload} = action

  switch (type) {
    case localActions.UPDATE_FIELD:
      dispatch(change(payload['form'], payload['field'], payload['value']))
      break
    case localActions.COST_EXPECTED_SELECTED:
      dispatch(GoalActions.costExpectedSelected(action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.GID], action[COMMON_ENTITIES.NAVIGATOR_TITLE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  UPDATE_FIELD: 'updateField',
  COST_EXPECTED_SELECTED: 'costExpectedSelected'
}

const mapStateToProps = (state, props) => {
  // get user id
  let userID = getUserID(state.root.u)
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // get goalID
  const goalID = props[GOAL_ENTITIES.GID]
  // goal name
  const goalName = getGoalName(state.root.goals, goalID)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    userID: userID,
    childID: childID,
    goalID: goalID,
    goalName: goalName
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
