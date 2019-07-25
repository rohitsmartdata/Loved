/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 24/8/18.
 */

// ========================================================
// Import Packages
// ========================================================

import { connect }
  from 'react-redux'
import Screen
  from '../../Components/Sprout/BankVerification'
import { ChildActions, isCreatingChildAccount, isSSNAdded, getFirstName as getChildsFirstName, isChildSSNRequested }
  from '../../Redux/Reducers/ChildReducer'
import {
  getUserID,
  getFirstName,
  getUserEmail,
  getFundingSourceAccount,
  UserActions,
  getFundingSourceReferenceID,
  isStoreUserSSNProcessing,
  isVerifyFundingProcessing
}
  from '../../Redux/Reducers/UserReducer'
import { COMMON_ENTITIES }
  from '../../Utility/Mapper/Common'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const { type } = action
  switch (type) {
    case localActions.VERIFY_FUNDING_AMOUNT:
      dispatch(UserActions.verifyFundingAmount(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[USER_ENTITIES.SOURCE_REFERENCE_ID], action[USER_ENTITIES.FIRST_AMOUNT], action[USER_ENTITIES.SECOND_AMOUNT], action[COMMON_ENTITIES.CALLBACK_FUCTION], action[COMMON_ENTITIES.NAVIGATOR]))
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  VERIFY_FUNDING_AMOUNT: 'VERIFY_FUNDING_AMOUNT'
}

const mapStateToProps = (state, props) => {
  // user id
  const userID = getUserID(state.root.u)
  // child id
  const childID = props[CHILD_ENTITIES.CHILD_ID]

  const isProcessing = isVerifyFundingProcessing(state.root.u)

  const fundingSourceReferenceID = getFundingSourceReferenceID(state.root.u)

  const fundingSourceAccount = getFundingSourceAccount(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // user id
    userID,

    // childID
    childID,

    // is processing
    isProcessing: isProcessing,

    fundingSourceReferenceID,

    fundingSourceAccount
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
