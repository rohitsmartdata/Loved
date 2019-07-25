/* eslint-disable no-unused-vars */
/**
 * Created by demon on 24/11/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Sprout/CreateChildNotification'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {ChildActions}
  from '../../Redux/Reducers/ChildReducer'
import {OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import {GoalActions}
  from '../../Redux/Reducers/GoalReducer'
import {getUserID, getUserEmail}
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NEXT:
      dispatch(ChildActions.addNewChild(action[COMMON_ENTITIES.NAVIGATOR], false, false, true, action[COMMON_ENTITIES.IS_ONBOARDING_FLOW]))
      break
    case localActions.SKIP:
      dispatch(OnboardingActions.onboardingCompleted(action[USER_ENTITIES.EMAIL_ID]))
      dispatch(GoalActions.skipGoal(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.CREATE_CHILD_NOTIFICATION))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NEXT: 'NEXT',
  SKIP: 'SKIP'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  let emailID = getUserEmail(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    userID: userID,

    emailID
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
