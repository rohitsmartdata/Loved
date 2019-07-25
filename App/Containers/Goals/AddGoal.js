/* eslint-disable no-unused-vars,no-multi-spaces,no-trailing-spaces,key-spacing */
/**
 * Created by viktor on 31/5/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Goals/AddGoal'
import {GoalActions, isGoalProcessing as isProcessing}
  from '../../Redux/Reducers/GoalReducer'
import {getFirstName}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {GOAL_ENTITIES} from '../../Utility/Mapper/Goal'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {

    case localActions.ADD_GOAL:
      dispatch(GoalActions.addCustomGoal(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[GOAL_ENTITIES.NAME], action[CHILD_ENTITIES.FIRST_NAME], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [ADD_GOAL] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  ADD_GOAL: 'ADD_GOAL'
}

const mapStateToProps = (state, props) => {
  const processing = isProcessing(state.root.goals)

  // get child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]

  const userID = getUserID(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // Child's first name
    firstName : getFirstName(state.root.children, childID),

    // is add goal processing,
    isProcessing: processing,

    [CHILD_ENTITIES.CHILD_ID]: childID,

    userID: userID
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
