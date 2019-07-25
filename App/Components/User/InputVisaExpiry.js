/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * User Input Detail Number 2.
 * - Date of Birth
 *
 * Created by viktor on 27/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Alert, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity, TouchableHighlight } from 'react-native'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { FORM_TYPES } from '../../Config/contants'
import CustomNav from '../../Containers/Common/CustomNav'
import styles from '../../Themes/ApplicationStyles'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import GravityCapsule from '../Utility/GravityCapsule'
import LWTextInput from '../Utility/LWFormInput'
import { validateDate } from '../../Utility/Transforms/Validator'
import Fonts from '../../Themes/Fonts'
var Moment = require('moment')
import Toast
  from '../Common/Toast'
import Colors from '../../Themes/Colors'

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

class InputVisaExpiry extends Component {
  constructor (props) {
    super(props)
    this.state = {
      _visaExpiryError: false
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    const isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.isX = isIPhoneX
    this.isNormal = isNormal
  }

  componentDidMount () {
    this.updateCurrentOnboarding()
  }

  // --------------------------------------------------------
  // Action handlers

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  navigateToNextScreen (data) {
    let d = data[USER_ENTITIES.VISA_EXPIRY]
    const { localActions, handleLocalAction, navigator, nextScreen, userID } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [USER_ENTITIES.USER_ID]: userID,
      [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [USER_ENTITIES.VISA_EXPIRY]: d
    })
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.VISA_EXPIRY:
        this.setState({ _visaExpiryError: error })
        break
      default:
        this.setState({ _visaExpiryError: false })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.VISA_EXPIRY:
        if (validateDate(val) || !Moment(val, 'MM/DD/YYYY').isValid() || Moment(val, 'MM/DD/YYYY').isBefore(Moment())) {
          this.markError(USER_ENTITIES.VISA_EXPIRY, true)
          return 'VISA EXPIRY DATE SHOULD BE CORRECT'
        } else {
          this.markError(USER_ENTITIES.VISA_EXPIRY, false)
          return undefined
        }
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, paddingHorizontal: 20 }}>
        <Text style={{ ...styles.screen.h2.textStyle, fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20 }}>
          What is the expiry date of your Visa?
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    return (
      <View style={{ marginTop: 65, paddingHorizontal: 20 }}>
        <View style={styles.screen.textInput.parentContainerStyle}>
          <Field
            name={USER_ENTITIES.VISA_EXPIRY}
            accessible
            accessibilityLabel={'Visa Expiry'}
            accessibilityRole={'keyboardkey'}
            maxLength={14}
            focusSmoothly
            whiteBackground
            component={LWTextInput}
            placeholderText='MM / DD / YYYY'
            mask='[00] / [00] / [0000]'
            isError={this.state._visaExpiryError}
            keyboardType='number-pad'
            validate={val => this.validate(USER_ENTITIES.VISA_EXPIRY, val)}
          />
        </View>
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{ ...styles.bottomNavigator.containerStyle }}
          onPress={handleSubmit(data => this.navigateToNextScreen(data))}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {navigator, popButton, toast, toastSubheading, toastHeading} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} leftButtonPresent={popButton} titlePresent title='Your Account' />
        <ScrollView
          scrollEnabled={false}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ ...styles.screen.containers.root }}
        >
          <View style={{ flex: 0.92 }}>
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
          {this.renderNextButton()}
        </ScrollView>
      </View>
    )
  }
}

InputVisaExpiry.propTypes = {
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

InputVisaExpiry.defaultProps = {
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputVisaExpiry))

export default Screen
