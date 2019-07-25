/* eslint-disable no-unused-vars */
/**
 * Created by viktor on 4/6/17.
 */
// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, TextInput, ActivityIndicator }
  from 'react-native'
import { Button }
  from 'react-native-elements'
import {reduxForm, Field}
  from 'redux-form'
import CustomFormInput
  from '../Components/Utility/CustomFormInput'
import {FORM_TYPES}
  from '../Config/contants'
import { connect }
  from 'react-redux'
import {packFlyingData}
  from '../Utility/Utility'
import {ADD_GOAL_PATH, GOAL_ENTITIES}
  from '../Utility/Mapper/Goal'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  // specify the form type here
  // form: FORM_TYPES.ADD_GOAL
})

// ========================================================
// Core Component
// ========================================================

class PresentationComponent extends Component {

  render () {
    return (
      <View>
        <Text>
          New component
        </Text>
      </View>
    )
  }

}

PresentationComponent.propTypes = {
  // used for navigation, comes via react-navigation
  navigation: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(PresentationComponent))

export default Screen

