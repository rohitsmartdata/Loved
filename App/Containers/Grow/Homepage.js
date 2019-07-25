/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 9/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Grow/Homepage'
import {UserActions, getUserID}
  from '../../Redux/Reducers/UserReducer'
import {LearnActions, getModules}
  from '../../Redux/Reducers/LearnReducer'
import {getChildren, getFirstName, getImageUrl, getImage}
  from '../../Redux/Reducers/ChildReducer'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {LEARN_ENTITIES}
  from '../../Utility/Mapper/Learn'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.OPEN_ARTICLE:
      dispatch(UserActions.openArticle(action[LEARN_ENTITIES.MODULE], action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.SHOW_SETTINGS:
      dispatch(SettingActions.showSettings(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.FETCH_MODULES:
      dispatch(LearnActions.fetchLearnModules())
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  OPEN_ARTICLE: 'OPEN_ARTICLE',
  BACK: 'BACK',
  SHOW_SETTINGS: 'SHOW_SETTINGS',
  FETCH_MODULES: 'FETCH_MODULES'
}

const mapStateToProps = (state, props) => {
  let userID = getUserID(state.root.u)
  // get children
  let children = getChildren(state.root.children)
  let childIDs = (children && Object.keys(children)) || []

  let childArr = []
  childIDs.map(id => {
    let childFirstname = getFirstName(state.root.children, id)
    let childImageUrl = getImageUrl(state.root.children, id)
    let childImage = getImage(state.root.children, id)
    childArr.push({
      childID: id,
      firstname: childFirstname,
      imageUrl: childImageUrl,
      childImage})
  })
  // default index the picker will point to
  const defaultIndex = 0
  // selected child using default index
  let selectedChild = (childArr[defaultIndex])

  // modules
  let modules = getModules(state.root.learn)

  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    userID: userID,

    modules,

    childArr,
    defaultIndex,
    selectedChild
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
