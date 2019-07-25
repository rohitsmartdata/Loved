/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 22/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Settings/Confirmations'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {getImage, getImageUrl, isProcessing as isConfirmationsProcessing, getFirstName, getDOB, getChildren, getConfirmations}
  from '../../Redux/Reducers/ChildReducer'
import {getUserID}
  from '../../Redux/Reducers/UserReducer'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import moment
  from 'moment'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.SHOW_URL:
      dispatch(SettingActions.showWebWindow(action[SETTINGS_ENTITIES.URL], action[SETTINGS_ENTITIES.HEADING], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  SHOW_URL: 'showUrl'
}

const mapStateToProps = (state, props) => {
  // children objects
  let children = getChildren(state.root.children)
  // child id array
  let childIDs = (children && Object.keys(children)) || []
  // user unique id
  let userID = getUserID(state.root.u)
  // is processing
  let isProcessing = isConfirmationsProcessing(state.root.children)

  let confirmations = {}
  for (var i = 0; i < childIDs.length; i++) {
    confirmations[childIDs[i]] = getConfirmations(state.root.children, childIDs[i])
  }

  let childArr = []
  childIDs.map(id => {
    let firstName = getFirstName(state.root.children, id)
    const childDOB = getDOB(state.root.children, id)
    let childImageUrl = getImageUrl(state.root.children, id)
    let childImage = getImage(state.root.children, id)
    let age = 0
    if (childDOB) {
      let birthDate = moment(childDOB, 'YYYY-MM-DD')
      let currentDate = moment()
      age = currentDate.diff(birthDate, 'y')
    }
    childArr.push({childID: id, firstname: firstName, age: age, imageUrl: childImageUrl, childImage: childImage})
  })

  // default index the picker will point to
  const defaultIndex = 0

  // selected child using default index
  let selectedChild = (childArr[defaultIndex])

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,
    // children objects
    children: children,
    // child id array
    childIDs: childIDs,
    // user id
    userID: userID,
    // confirmations
    confirmations: confirmations,
    // child array
    childArr,
    // default index
    defaultIndex,
    // selected child
    selectedChild,
    // is processing
    isProcessing
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
