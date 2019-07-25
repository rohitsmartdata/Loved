/* eslint-disable no-trailing-spaces */
/**
 * Created by viktor on 30/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import { connect } from 'react-redux'
import Screen from '../../Components/Utility/Avatar'
import { getIDToken } from '../../Redux/Reducers/AuthReducer'
import { SettingActions } from '../../Redux/Reducers/SettingReducer'
import { getUserEmail } from '../../Redux/Reducers/UserReducer'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { GOAL_ENTITIES } from '../../Utility/Mapper/Goal'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const { type } = action
  switch (type) {
    case localActions.UPLOAD_PHOTO:
      dispatch(
        SettingActions.uploadPhoto(
          action[SETTINGS_ENTITIES.IMAGE_METADATA],
          action[SETTINGS_ENTITIES.IMAGE_TYPE],
          action[AUTH_ENTITIES.EMAIL],
          action[AUTH_ENTITIES.ID_TOKEN],
          action[USER_ENTITIES.USER_ID],
          action[CHILD_ENTITIES.CHILD_ID],
          action[GOAL_ENTITIES.GID],
          action[CHILD_ENTITIES.IS_UPDATING_CHILD_IMAGE],
          dispatch
        )
      )
      break
    case localActions.GET_PHOTO:
      dispatch(
        SettingActions.getPhoto(
          action[SETTINGS_ENTITIES.IMAGE_KEY],
          action[SETTINGS_ENTITIES.IMAGE_TYPE],
          action[AUTH_ENTITIES.EMAIL],
          action[AUTH_ENTITIES.ID_TOKEN],
          action[USER_ENTITIES.USER_ID],
          action[CHILD_ENTITIES.CHILD_ID],
          action[GOAL_ENTITIES.GID],
          dispatch
        )
      )
      break
    case localActions.SET_IMAGE_METADATA:
      dispatch(
        SettingActions.setImageMetadata(
          action[SETTINGS_ENTITIES.IMAGE_METADATA],
          dispatch
        )
      )
      break

    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  UPLOAD_PHOTO: 'UPLOAD_PHOTO',
  GET_PHOTO: 'GET_PHOTO',
  SET_IMAGE_METADATA: 'SET_IMAGE_METADATA'
}

const mapStateToProps = (state, props) => {
  // imageType  = USER, CHILD, GOAL
  // imageId =USERID, CHILDID, GID
  const { image, imageType, imageId } = props

  // id token
  const token = getIDToken(state.auth)
  // user email
  const email = getUserEmail(state.root.u)

  return {
    // send local actions for (presentation <--> container)
    localActions,
    image,
    token,
    email,
    imageId,
    imageType
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
