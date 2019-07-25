/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 19/4/18.
 */

// ========================================================
// Import Packages
// ========================================================
import React
  from 'react'
import {Alert}
  from 'react-native'
import {connect}
  from 'react-redux'
import Screen
  from '../../Components/Common/Connectivity'

// ========================================================
// Utility Functions
// ========================================================

const handleLocalAction = (dispatch, action, navigation) => {
  const {type} = action
  switch (type) {
  }
}

// ========================================================
// REDUX [ Mapping Props & Actions ]
// ========================================================

export const localActions = {
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

