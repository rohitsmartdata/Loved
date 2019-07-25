/**
 * Created by demon on 20/2/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Common/NavigationBar'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import {UserActions} from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
    case localActions.POP_SCREEN:
      let extraFoo = action['extraFoo']
      extraFoo && dispatch(extraFoo)
      dispatch(UserActions.popScreen(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.CLOSE_MODAL:
      dispatch(UserActions.closeArticle(action[COMMON_ENTITIES.NAVIGATOR]))
      break
    case localActions.RIGHT_FOO:
      dispatch(action['rightButtonFoo'](action[COMMON_ENTITIES.NAVIGATOR]))
      break
    default:
      break
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  POP_SCREEN: 'pop',
  CLOSE_MODAL: 'closeModal',
  RIGHT_FOO: 'rightFoo'
}

const mapStateToProps = (state, props) => {
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

