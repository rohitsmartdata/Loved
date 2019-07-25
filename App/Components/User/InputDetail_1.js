/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * User Input Detail Number 1.
 * - First Name
 * - Last Name
 *
 * Created by viktor on 27/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import Toast
  from '../Common/Toast'
import { reduxForm, Field } from 'redux-form'
import CustomNav from '../../Containers/Common/CustomNav'
import { connect } from 'react-redux'
import { FORM_TYPES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule from '../Utility/GravityCapsule'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import LWFormInput from '../Utility/LWFormInput'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import _
  from 'lodash'
import { AgeInstruction } from '../../CommonComponents/AgeInstruction'
import Colors from '../../Themes/Colors'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_USER,
  destroyOnUnmount: false,
  touchOnBlur: false
})

// ========================================================
// Core Component
// ========================================================

class InputUserDetail_1 extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _firstNameError: false,
      _lastNameError: false,
      _middleNameError: false,
      showAgeInstruction: false
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    const isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.isX = isIPhoneX
    this.isNormal = isNormal
  }

  componentWillMount () {
    this.onboardingStarted()
    this.updateCurrentOnboarding()
  }

  // --------------------------------------------------------
  // Action handlers

  navigateToNextScreen (data) {
    const { localActions, handleLocalAction, navigator, nextScreen, userID } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [USER_ENTITIES.USER_ID]: userID,
      [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [USER_ENTITIES.FIRST_NAME]: data[USER_ENTITIES.FIRST_NAME],
      [USER_ENTITIES.LAST_NAME]: data[USER_ENTITIES.LAST_NAME]
    })
  }

  toggleAgeInstruction (show) {
    this.setState({showAgeInstruction: show})
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.FIRST_NAME:
        this.setState({ _firstNameError: error })
        break
      case USER_ENTITIES.LAST_NAME:
        this.setState({ _lastNameError: error })
        break
      case USER_ENTITIES.MIDDLE_INITIAL:
        this.setState({ _middleNameError: error })
        break
      default:
        this.setState({
          _firstNameError: false,
          _lastNameError: false,
          _middleNameError: false
        })
    }
  }

  validate (type, val) {
    const trimmedVal = val && val.trim()
    switch (type) {
      case USER_ENTITIES.FIRST_NAME:
        if (trimmedVal && trimmedVal !== '' && /^[a-zA-Z\s]*$/.test(trimmedVal)) {
          this.markError(USER_ENTITIES.FIRST_NAME, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.FIRST_NAME, true)
          return 'FIRST NAME REQ'
        }
      case USER_ENTITIES.LAST_NAME:
        if (trimmedVal && trimmedVal !== '' && /^[a-zA-Z\s]*$/.test(trimmedVal)) {
          this.markError(USER_ENTITIES.LAST_NAME, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.LAST_NAME, true)
          return 'LAST NAME REQ'
        }
      case USER_ENTITIES.MIDDLE_INITIAL:
        if (!trimmedVal) {
          this.markError(USER_ENTITIES.MIDDLE_INITIAL, false)
          return undefined
        } else if (trimmedVal && trimmedVal === '' && /^[a-zA-Z\s]*$/.test(trimmedVal)) {
          this.markError(USER_ENTITIES.MIDDLE_INITIAL, true)
          return 'MIDDLE NAME REQ'
        }
    }
  }

  onboardingStarted () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.ONBOARDING_STARTED, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, alignItems: 'center'}}>
        <Text style={{ fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, alignSelf: 'center', marginBottom: 20 }}>
          What is your legal name?
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 18, textAlign: 'center', marginHorizontal: 20 }}>
          We need your full legal name to confirm your identity.
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { handleSubmit } = this.props
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{...styles.screen.textInput.parentContainerStyle}}>
          <Field
            name={USER_ENTITIES.FIRST_NAME}
            accessible
            isLabel
            label='First name'
            accessibilityLabel={'First Name'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='next'
            onSubmitEditing={() => this.lastname.getRenderedComponent().refs.lastname.focus()}
            component={LWFormInput}
            focusSmoothly
            whiteBackground
            focus
            isError={this.state._firstNameError}
            placeholderText='First name'
            extraStyle={{ marginRight: 4 }}
            validate={val => this.validate(USER_ENTITIES.FIRST_NAME, val)}
          />
        </View>
        <View style={{ ...styles.screen.textInput.parentContainerStyle, marginTop: 7 }}>
          <Field
            name={USER_ENTITIES.LAST_NAME}
            component={LWFormInput}
            accessible
            isLabel
            label='Last name'
            whiteBackground
            accessibilityLabel={'lastname'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='done'
            ref={(el) => { this.lastname = el }}
            refField='lastname'
            withRef
            isError={this.state._lastNameError}
            placeholderText='Last name'
            extraStyle={{ marginLeft: 4 }}
            validate={val => this.validate(USER_ENTITIES.LAST_NAME, val)}
          />
        </View>
      </View>
    )
  }

  renderAgeInstruction () {
    const isX = this.isX || false
    return (
      <TouchableOpacity
        activeOpacity={1}
        accessible
        accessibilityLabel={'Continue'}
        accessibilityRole={'button'}
        onPress={() => this.toggleAgeInstruction(true)}>
        <Text style={{marginBottom: isX ? 110 : 100, color: Colors.blue, fontSize: 18, lineHeight: 23, fontFamily: Fonts.type.book, textAlign: 'center'}}>
          Are you under the age of 18?
        </Text>
      </TouchableOpacity>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{ 
            ...styles.bottomNavigator.containerStyle, 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0}, 
            marginHorizontal: 20 
          }}
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNextScreen(data)), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const isX = this.isX || false
    const { navigator, toast, toastHeading, toastSubheading } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} gradientBackdrop title={'Sign up'} titlePresent />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={50}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 0 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderAgeInstruction()}
        {this.renderNextButton()}
        <AgeInstruction showModal={this.state.showAgeInstruction} toggleModal={this.toggleAgeInstruction.bind(this)} />
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

InputUserDetail_1.propTypes = {
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

  // user ID
  userID: PropTypes.string,

  // email id
  emailID: PropTypes.string.isRequired,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(InputUserDetail_1))

export default Screen
