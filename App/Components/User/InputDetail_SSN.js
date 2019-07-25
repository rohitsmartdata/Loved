/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * Created by demon on 13/10/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import Toast
  from '../Common/Toast'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import CustomNav from '../../Containers/Common/CustomNav'
import { FORM_TYPES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule from '../Utility/GravityCapsule'
import LWFormInput from '../Utility/LWFormInput'
import { validateSSN } from '../../Utility/Transforms/Validator'
import Fonts from '../../Themes/Fonts'
import _
  from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
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

class InputUserDetail_SSN extends Component {
  constructor (props) {
    super(props)
    this.state = {
      _ssnError: false
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.SSN:
        this.setState({ _ssnError: error })
        break
      default:
        this.setState({
          _ssnError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.SSN:
        if (validateSSN(val)) {
          this.markError(USER_ENTITIES.SSN, true)
          return 'SSN Required'
        } else {
          this.markError(USER_ENTITIES.SSN, false)
          return undefined
        }
    }
  }

  componentDidMount () {
    this.updateCurrentOnboarding()
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.USER_SSN
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  navigateToNextScreen () {
    const { localActions, handleLocalAction, navigator, nextScreen, userID } = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [USER_ENTITIES.USER_ID]: userID,
      [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={styles.screen.h2.containerStyle}>
        <Text style={{ ...styles.screen.h2.textStyle, fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20 }}>
          What is your Social Security Number?
        </Text>
        <Text style={{ marginTop: 10, fontFamily: Fonts.type.regular, color: '#000', fontSize: 14, backgroundColor: 'transparent' }}>
          We are required to collect this information under Federal Law.
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { width } = Dimensions.get('window')
    return (
      <View style={{ marginTop: 11 }}>
        <View style={styles.screen.textInput.parentContainerStyle}>
          <Field
            name={USER_ENTITIES.SSN}
            accessible
            isLabel
            label='SSN'
            accessibilityLabel={'Social Security Number'}
            accessibilityRole={'keyboardkey'}
            component={LWFormInput}
            mask='[000]-[00]-[0000]'
            maxLength={11}
            focusSmoothly
            whiteBackground
            keyboardType='number-pad'
            placeholderText='SSN'
            isError={this.state._ssnError}
            validate={val => this.validate(USER_ENTITIES.SSN, val)}
          />
        </View>

        {this.renderSSNDetail()}
      </View>
    )
  }

  renderSSNDetail () {
    return (
      <View style={{ marginTop: 10 }}>
        <Text style={{ fontFamily: Fonts.type.regular, fontSize: 12, backgroundColor: 'transparent', color: '#000' }}>
          All transmitted data is encrypted and utilizes SSL for your security.
        </Text>
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
    const {navigator, popButton, toast, toastHeading, toastSubheading} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} leftButtonPresent={popButton} titlePresent title='Your Account' />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={100}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ ...styles.screen.containers.keyboard }}
        >
          <View style={{ flex: 0.9, paddingHorizontal: 16 }}>
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderNextButton()}
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

InputUserDetail_SSN.propTypes = {
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

InputUserDetail_SSN.defaultProps = {
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputUserDetail_SSN))

export default Screen
