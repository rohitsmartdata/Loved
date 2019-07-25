/* eslint-disable no-unused-vars */
/**
 * Created by demon on 8/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Sprout/SSNConfirm'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {getProfileData}
  from '../../Redux/Reducers/OnboardingReducer'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {ChildActions, isProcessing}
  from '../../Redux/Reducers/ChildReducer'
import {getUserEmail}
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.CONFIRM:
      dispatch(ChildActions.navigateToChildSsn(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.FIRST_NAME], action[CHILD_ENTITIES.LAST_NAME], action[CHILD_ENTITIES.DOB], action[USER_ENTITIES.IDENTITY_DATA], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SKIP:
      dispatch(ChildActions.addChild(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.FIRST_NAME], action[CHILD_ENTITIES.LAST_NAME], action[CHILD_ENTITIES.DOB], undefined, action[USER_ENTITIES.EMAIL_ID], action[COMMON_ENTITIES.NAVIGATOR], action[USER_ENTITIES.IDENTITY_DATA]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  CONFIRM: 'CONFIRM',
  SKIP: 'SKIP'
}

const mapStateToProps = (state, props) => {
  // get user's unique ID
  const userID = props[USER_ENTITIES.USER_ID]
  // get user's on-boarding identity data
  let identityData = getProfileData(state.onboard, userID)
  // get child's firstname
  const firstName = props[CHILD_ENTITIES.FIRST_NAME]
  // get child's lastname
  const lastName = props[CHILD_ENTITIES.LAST_NAME]
  // get child's DOB
  const DOB = props[CHILD_ENTITIES.DOB]
  // user email address
  const email = getUserEmail(state.root.u)
  // get whether add child is processing or not
  const processing = isProcessing(state.root.children)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    firstName: firstName,
    lastName: lastName,
    DOB: DOB,
    userID: userID,
    identityData: identityData,
    emailID: email,
    isProcessing: processing
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
