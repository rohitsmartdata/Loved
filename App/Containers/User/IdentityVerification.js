/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 24/11/17.
 */

// ========================================================
// Import Packages
// ========================================================

import { connect } from 'react-redux'
import Screen from '../../Components/User/IdentityVerification'
import { SPROUT } from '../../Utility/Mapper/Screens'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { OnboardingActions } from '../../Redux/Reducers/OnboardingReducer'
import { UserActions, getUserID, getUserEmail } from '../../Redux/Reducers/UserReducer'
import { ChildActions } from '../../Redux/Reducers/ChildReducer'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const { type } = action

  switch (type) {
    case localActions.NAVIGATE_TO_NEXT_SCREEN:
      // dispatch(OnboardingActions.markCurrentOnboardingScreen(action[USER_ENTITIES.USER_ID], action[COMMON_ENTITIES.SCREEN_TYPE]))
      dispatch(ChildActions.navigateToIdentityAddressScreen(action[CHILD_ENTITIES.CHILD_ID], action[CHILD_ENTITIES.IS_ADDING_DESIRE], action[CHILD_ENTITIES.IS_ADDING_DESIRE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.UPDATE_CURRENT_ONBOARDING:
      dispatch(OnboardingActions.updateCurrentOnboarding(action[USER_ENTITIES.EMAIL_ID], SPROUT.IDENTITY_VERIFICATION))
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
  UPDATE_CURRENT_ONBOARDING: 'updateCurrentOnboarding'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  let emailID = getUserEmail(state.root.u)
  // get user's unique ID
  const childID = props[CHILD_ENTITIES.CHILD_ID]
  // is adding desire
  const isAddingDesire = props[CHILD_ENTITIES.IS_ADDING_DESIRE]
  // is adding dream
  const isAddingDream = props[CHILD_ENTITIES.IS_ADDING_DREAM]

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // next screen to navigate
    nextScreen: SPROUT.USER_INPUT_DETAIL_3,

    userID: userID,

    // email ID
    emailID,

    // child id
    childID,

    // is adding dream
    isAddingDream,

    // is adding desire
    isAddingDesire
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
