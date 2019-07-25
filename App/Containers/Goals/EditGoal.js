/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 19/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/EditGoal'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {getGoal, GoalActions, isGoalProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.EDIT_GOAL:
      dispatch(GoalActions.editGoal(action[USER_ENTITIES.USER_ID], action[GOAL_ENTITIES.GID],
        action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.NAME],
        action[GOAL_ENTITIES.GOAL_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR]
      ))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----, ', action)
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  EDIT_GOAL: 'EDIT_GOAL'
}

const mapStateToProps = (state, props) => {
  // goal id
  let goalID = props[GOAL_ENTITIES.GID]
  // child id
  let childID = props[CHILD_ENTITIES.CHILD_ID]
  // firstname
  let firstname = getFirstName(state.root.children, childID)
  // goal's
  let goal = getGoal(state.root.goals, goalID)
  // goal name
  let goalname = goal && goal[GOAL_ENTITIES.NAME]

  const userID = getUserID(state.root.u)

  const isProcessing = isGoalProcessing(state.root.goals)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    goalID,

    childID,

    firstname,

    goal,

    goalname,

    userID,

    isProcessing

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
