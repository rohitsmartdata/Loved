/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 27/7/18.
 */

// ========================================================
// Import Packages
// ========================================================

import {connect}
  from 'react-redux'
import Screen
  from '../../Components/User/InfoTip'
import {UserActions, getGlossary, isFetchingGlossary}
  from '../../Redux/Reducers/UserReducer'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action

  switch (type) {
    case localActions.FETCH_GLOSSARY:
      dispatch(UserActions.fetchGlossary())
      break
    default:
      console.log('---- LOCAL ACTION DEFAULT [START] ----')
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
  FETCH_GLOSSARY: 'fetchGlossary'
}

const mapStateToProps = (state, props) => {
  const glossary = getGlossary(state.root.u)
  const isProcessing = isFetchingGlossary(state.root.u)
  return {
    // send local actions for (presentation <--> container)
    localActions: localActions,

    // glossary
    glossary,

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
