/* eslint-disable no-unused-vars */
/**
 * Created by demon on 9/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/BankAccountPending'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import { ChildActions, getChildren, getDOB, getFirstName as getChildFirstname, getImage, getImageUrl }
  from '../../Redux/Reducers/ChildReducer'
import { getFundingSourceReferenceID, getSelectedChild, getUserEmail, getUserID, isFundingSourceLinked, UserActions }
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import moment from 'moment'
import { GoalActions } from '../../Redux/Reducers/GoalReducer'
import { OnboardingActions } from '../../Redux/Reducers/OnboardingReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.VERIFY_FUNDING_AMOUNT:
      dispatch(UserActions.verifyFundingAmount(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[USER_ENTITIES.SOURCE_REFERENCE_ID], action[USER_ENTITIES.FIRST_AMOUNT], action[USER_ENTITIES.SECOND_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.NAVIGATE_TO_HOMEPAGE:
      dispatch(GoalActions.navigateToHomepage(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.COMPLETE_ONBOARDING:
      dispatch(OnboardingActions.onboardingCompleted(action[USER_ENTITIES.EMAIL_ID]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  COMPLETE_ONBOARDING: 'COMPLETE_ONBOARDING',
  NAVIGATE_TO_HOMEPAGE: 'NAVIGATE_TO_HOMEPAGE'
}

const mapStateToProps = (state, props) => {
  // user id
  let userID = getUserID(state.root.u)
  // email id
  const emailID = getUserEmail(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // email id
    emailID,
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
