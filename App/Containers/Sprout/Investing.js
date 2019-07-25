/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 23/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import { connect }
  from 'react-redux'
import Screen
  from '../../Components/Sprout/Investing'
import { getUserID, getUserEmail }
  from '../../Redux/Reducers/UserReducer'
import { ChildActions, getSingularChildID, getFirstName }
  from '../../Redux/Reducers/ChildReducer'
import { GoalActions }
  from '../../Redux/Reducers/GoalReducer'
import { InvestmentActions }
  from '../../Redux/Reducers/InvestmentReducer'
import { COMMON_ENTITIES }
  from '../../Utility/Mapper/Common'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import { SPROUT }
  from '../../Utility/Mapper/Screens'
import { OnboardingActions }
  from '../../Redux/Reducers/OnboardingReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const { type } = action

  switch (type) {
    case localActions.SKIP:
      dispatch(GoalActions.skipGoal(action[COMMON_ENTITIES.NAVIGATOR]))
      dispatch(OnboardingActions.onboardingCompleted(action[USER_ENTITIES.EMAIL_ID]))
      break
    case localActions.SELECT_INVESTMENT:
      dispatch(InvestmentActions.selectInvestment(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SELECT_GOAL:
      dispatch(GoalActions.selectGoal(action[CHILD_ENTITIES.CHILD_ID], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.CHILD_INVESTING))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SKIP: 'skip',
  SELECT_INVESTMENT: 'selectInvestment',
  SELECT_GOAL: 'selectGoal',
  UPDATE_CURRENT_ONBOARDING: 'UPDATE_CURRENT_ONBOARDING'
}

const mapStateToProps = (state, props) => {
  // email id
  const emailID = getUserEmail(state.root.u)
  // get user's unique ID
  const userID = getUserID(state.root.u)
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID] || getSingularChildID(state.root.children)
  // first name
  const firstname = getFirstName(state.root.children, childID)
  // is onboarding flow
  let isOnboardingFlow = props[COMMON_ENTITIES.IS_ONBOARDING_FLOW]

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // user id
    userID: userID,
    // child id
    childID: childID,
    // user email
    emailID,
    // is onboarding flow
    isOnboardingFlow,
    // first name
    firstname
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleLocalAction: (actionType, navigation) => handleLocalAction(dispatch, actionType, navigation)
  }
}

// ========================================================
// Connect & Export
// ========================================================

export default connect(mapStateToProps, mapDispatchToProps)(Screen)
