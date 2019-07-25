/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * User Input detail 2
 * - Date of birth
 *
 * Created by viktor on 21/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/User/InputDetail_2'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {UserActions, getUserID, getUserEmail}
  from '../../Redux/Reducers/UserReducer'
import {getChildren, ChildActions}
  from '../../Redux/Reducers/ChildReducer'
import {OnboardingActions}
  from '../../Redux/Reducers/OnboardingReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import { analytics }
  from '../../Config/AppConfig'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.NAVIGATE_TO_NEXT_SCREEN:
      dispatch(OnboardingActions.markCurrentOnboardingScreen(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.SCREEN_TYPE]))
      dispatch(UserActions.navigateUserDetailInput(action[COMMON_ENTITIES.SCREEN_TYPE], action[COMMON_ENTITIES.NAVIGATOR]))
      // *********** Log Analytics ***********
      analytics.identify({
        userId: action[USER_ENTITIES.USER_ID],
        traits: {
          date_of_birth: action[USER_ENTITIES.DOB]
        }
      })
      // *********** Log Analytics ***********
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.USER_INPUT_DETAIL_2))
      break
    case localActions.LOG_NUMBER_OF_CHILDREN_AT_START:
      dispatch(ChildActions.logNumberOfChildrenAtStart(action[CHILD_ENTITIES.NUMBER_OF_CHILDREN_AT_START]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  NAVIGATE_TO_NEXT_SCREEN: 'NAVIGATE_TO_NEXT_SCREEN',
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding',
  LOG_NUMBER_OF_CHILDREN_AT_START: 'LOG_NUMBER_OF_CHILDREN_AT_START'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  let emailID = getUserEmail(state.root.u)
  let children = getChildren(state.root.children)
  let childIDs = (children && Object.keys(children)) || []

  let numberOfChildren = childIDs.length
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    nextScreen: SPROUT.USER_INPUT_PHONE_NUMBER,

    // user id
    userID: userID,

    // email id
    emailID: emailID,

    // number of children
    numberOfChildren
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
