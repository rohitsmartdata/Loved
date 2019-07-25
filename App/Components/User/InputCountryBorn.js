/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 1/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, Keyboard, ScrollView, Image, ActivityIndicator } from 'react-native'
import CustomNav from '../../Containers/Common/CustomNav'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { FORM_TYPES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES } from '../../Utility/Mapper/Common'
import SearchList from '../Utility/SearchList'
import countries from '../../Utility/countryList'
import Fonts
  from '../../Themes/Fonts'
import Toast
  from '../Common/Toast'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_USER,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class InputCountryBorn extends Component {
  componentDidMount () {
    this.updateCurrentOnboarding()
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.USER_COUNTRY_BORN
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  navigateToNextScreen (name) {
    const { localActions, handleLocalAction, navigator, nextScreen, residencyType, userID } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [USER_ENTITIES.USER_ID]: userID,
      [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [USER_ENTITIES.RESIDENCY_TYPE]: residencyType,
      form: FORM_TYPES.ADD_USER,
      field: USER_ENTITIES.COUNTRY_BORN,
      value: name
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, paddingHorizontal: 20 }}>
        <Text style={{ ...styles.screen.h2.textStyle, fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20 }}>
          Where were you born?
        </Text>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {navigator, popButton, toast, toastHeading, toastSubheading} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} titlePresent title='Your Account' leftButtonPresent={popButton} />
        {this.renderHeading()}
        <View style={{ flex: 1, paddingTop: 29 }}>
          <SearchList data={countries} touchHandler={this.navigateToNextScreen.bind(this)} />
        </View>
      </View>
    )
  }
}

InputCountryBorn.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // next screen to navigate
  nextScreen: PropTypes.string.isRequired,

  // residency type of user
  residencyType: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  popButton: PropTypes.bool,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

InputCountryBorn.defaultProps = {
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputCountryBorn))

export default Screen
