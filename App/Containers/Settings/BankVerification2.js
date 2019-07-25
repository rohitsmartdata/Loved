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
  from '../../Components/Settings/BankVerification2'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import { ChildActions, getChildren, getDOB, getFirstName as getChildFirstname, getImage, getImageUrl }
  from '../../Redux/Reducers/ChildReducer'
import { getFundingSourceReferenceID, getSelectedChild, getUserID, isFundingSourceLinked, UserActions, getFundingSourceAccount }
  from '../../Redux/Reducers/UserReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import moment from 'moment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.VERIFY_FUNDING_AMOUNT:
      dispatch(UserActions.verifyFundingAmount(action[USER_ENTITIES.USER_ID], action[CHILD_ENTITIES.CHILD_ID], action[USER_ENTITIES.SOURCE_REFERENCE_ID], action[USER_ENTITIES.FIRST_AMOUNT], action[USER_ENTITIES.SECOND_AMOUNT], action[COMMON_ENTITIES.NAVIGATOR]))
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
  let userID = getUserID(state.root.u)

  let children = getChildren(state.root.children)
  let childIDs = (children && Object.keys(children)) || []
  // selected child
  let selectedID = getSelectedChild(state.root.u)
  let childArr = {}
  if (childIDs.length > 1) {
    childArr['all'] = {childID: 'all', firstname: 'All', age: undefined, imageUrl: undefined, childImage: undefined}
  }
  childIDs && childIDs.map(id => {
    let childFirstname = getChildFirstname(state.root.children, id)
    let childImageUrl = getImageUrl(state.root.children, id)
    let childImage = getImage(state.root.children, id)
    const childDOB = getDOB(state.root.children, id)
    let age = 0
    if (childDOB) {
      let birthDate = moment(childDOB, 'YYYY-MM-DD')
      let currentDate = moment()
      age = currentDate.diff(birthDate, 'y')
    }

    let childPointer = children[id]
    const portolio = childPointer && childPointer[CHILD_ENTITIES.PORTFOLIO]
    childArr[id] = {
      childID: id,
      firstname: childFirstname,
      age: age,
      [CHILD_ENTITIES.GROWTH_IN_VALUE]: (portolio && portolio[CHILD_ENTITIES.GROWTH_IN_VALUE]) || 0,
      [CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]: (portolio && portolio[CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]) || 0,
      [CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]: (portolio && portolio[CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]) || 0,
      [CHILD_ENTITIES.CURRENT_VALUE]: (portolio && portolio[CHILD_ENTITIES.CURRENT_VALUE]) || 0,
      [CHILD_ENTITIES.AVAILABLE_VALUE]: (portolio && portolio[CHILD_ENTITIES.AVAILABLE_VALUE]) || 0,
      [CHILD_ENTITIES.PENDING_TRANSFER_AMOUNT]: (portolio && portolio[CHILD_ENTITIES.PENDING_TRANSFER_AMOUNT]) || 0,
      [CHILD_ENTITIES.PENDING_WITHDRAWAL_AMOUNT]: (portolio && portolio[CHILD_ENTITIES.PENDING_WITHDRAWAL_AMOUNT]) || 0,
      imageUrl: childImageUrl,
      childImage}
  })

  // default index the picker will point to
  const defaultIndex = 0

  // selected child using default index
  let childObjects = Object.values(childArr)
  let selectedChild = (selectedID && childArr[selectedID]) || (childObjects && childObjects[defaultIndex])

  const fundingSourceReferenceID = getFundingSourceReferenceID(state.root.u)

  const fundingSourceAccount = getFundingSourceAccount(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    userID: userID,

    selectedChild,

    fundingSourceReferenceID,

    fundingSourceAccount
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
