/* eslint-disable no-unused-vars */
/**
 * Created by demon on 10/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Grow/Article'
import {UserActions}
  from '../../Redux/Reducers/UserReducer'
import {SettingActions}
  from '../../Redux/Reducers/SettingReducer'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {LEARN_ENTITIES}
  from '../../Utility/Mapper/Learn'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.CLOSE_ARTICLE:
      dispatch(UserActions.closeArticle(action[COMMON_ENTITIES.NAVIGATOR]))
      break
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
  HIDE_RISK: 'HIDE_RISK',
  CLOSE_ARTICLE: 'CLOSE_ARTICLE',
  SHOW_URL: 'SHOW_URL'
}

const mapStateToProps = (state, props) => {
  const module = props[LEARN_ENTITIES.MODULE]
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions
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
