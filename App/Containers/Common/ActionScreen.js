/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 19/2/19.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Common/ActionScreen'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {InvestmentActions}
  from '../../Redux/Reducers/InvestmentReducer'
import {ChildActions}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID, UserActions}
  from '../../Redux/Reducers/UserReducer'
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
    case localActions.NAVIGATE_TO_DASHBOARD:
      dispatch(GoalActions.navigateToHomepage(action[COMMON_ENTITIES.NAVIGATOR], action[CHILD_ENTITIES.CHILD_ID]))
      break
    case localActions.ADD_NEW_ACCOUNT:
      dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.ADD_INVESTMENT:
      dispatch(InvestmentActions.addNewInvestment(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.ADD_GOAL:
      dispatch(ChildActions.addNewGoal(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.FETCH_USER:
      dispatch(UserActions.fetchUser(action[USER_ENTITIES.USER_ID]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [GOAL_TYPE] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NAVIGATE_TO_DASHBOARD: 'navigateToDashboard',
  ADD_NEW_ACCOUNT: 'addNewAccount',
  ADD_INVESTMENT: 'addInvestment',
  ADD_GOAL: 'addGoal',
  FETCH_USER: 'fetchUser'
}

const mapStateToProps = (state, props) => {
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  let userID = getUserID(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // child id
    childID,

    // user id
    userID
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
