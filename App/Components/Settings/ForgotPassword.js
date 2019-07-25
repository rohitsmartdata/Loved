/* eslint-disable no-unused-vars,no-trailing-spaces */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, Alert, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity, TouchableHighlight } from 'react-native'
import CustomNav from '../../Containers/Common/CustomNav'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import Fonts from '../../Themes/Fonts'
import { FORM_TYPES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule from '../Utility/GravityCapsule'
import LWTextInput from '../Utility/LWFormInput'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import { validateEmail, validatePassword, validatePasswordSchema } from '../../Utility/Transforms/Validator'
import Colors from '../../Themes/Colors'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.FORGOT_PASSWORD,
  destroyOnUnmount: false,
  enableReinitialize: true
})

// ========================================================
// Core Component
// ========================================================

class ForgotPassword extends Component {
  // --------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      showPassword: false,
      _emailError: false,
      _passwordError: false,
      passwordSchema: undefined
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  componentWillMount () {
    this.props.initialize()
  }

  componentWillUnmount () {
    this.props.destroy()
    this.props.handleLocalAction({ 
      type: this.props.localActions.RESET_FORGOT_PASSWORD_EMAIL 
    })
  }

  // --------------------------------------------------------
  // Action handlers

  togglePasswordVisibility () {
    this.setState(prevstate => {
      return { showPassword: !prevstate.showPassword }
    })
  }

  hideError () {
    const { handleLocalAction, localActions } = this.props
    handleLocalAction({ type: localActions.HIDE_ERROR })
  }

  markError (inputType, error) {
    switch (inputType) {
      case AUTH_ENTITIES.EMAIL:
        this.setState({ _emailError: error })
        break
      case AUTH_ENTITIES.PASSWORD:
        this.setState({ _passwordError: error })
        break
      default:
        this.setState({
          _emailError: false,
          _passwordError: false
        })
    }
  }

  markPasswordSchema (val) {
    let schema = validatePasswordSchema(val)
    this.setState({ passwordSchema: schema })
  }

  validate (type, val) {
    switch (type) {
      case AUTH_ENTITIES.EMAIL:
        if (validateEmail(val)) {
          this.markError(AUTH_ENTITIES.EMAIL, true)
          return 'Correct Email Needed'
        } else {
          this.markError(AUTH_ENTITIES.EMAIL, false)
          return undefined
        }
      case AUTH_ENTITIES.PASSWORD:
        this.markPasswordSchema(val)
        if (validatePassword(val)) {
          this.markError(AUTH_ENTITIES.PASSWORD, true)
          return 'MIN 6 Char pass needed'
        } else {
          this.markError(AUTH_ENTITIES.PASSWORD, false)
          return undefined
        }
    }
  }

  navigateToNext (data) {
    const { localActions, handleLocalAction, handleSubmit, userID, navigator, isProcessing, isVerified, email } = this.props
    let allOK

    if (!isVerified) {
      handleLocalAction({
        type: localActions.FORGOT_PASSWORD,
        [AUTH_ENTITIES.EMAIL]: data[AUTH_ENTITIES.EMAIL],
        [COMMON_ENTITIES.NAVIGATOR]: navigator,
        [USER_ENTITIES.USER_ID]: userID
      })
    } else {
      handleLocalAction({
        type: localActions.CONFIRM_PASSWORD,
        [AUTH_ENTITIES.EMAIL]: email,
        [AUTH_ENTITIES.VERIFICATION_CODE]: data[AUTH_ENTITIES.VERIFICATION_CODE],
        [AUTH_ENTITIES.PASSWORD]: data[AUTH_ENTITIES.PASSWORD],
        [COMMON_ENTITIES.NAVIGATOR]: navigator
      })
    }
  }

  // --------------------------------------------------------
  // Child Components
  renderPasswordDescription () {
    const { passwordSchema } = this.state
    return (
      <View>
        <Text style={{textAlign: 'left', fontFamily: Fonts.type.regular, fontSize: 12}}>
          Make your password at least eight characters with an uppercase and lowercase character, plus a number.
        </Text>
      </View>
    )
  }
  renderHeading () {
    const text = this.props.isVerified
      ? 'Please input the verification code from you email and your new password'
      : 'Please input your email address for verification code.'
    return (
      <View
        style={{
          ...styles.screen.containers.centeringContainer,
          marginTop: 32
        }}
      >
        <Text style={{ ...styles.screen.h2.textStyle, fontFamily: Fonts.type.semibold, color: '#000000', fontSize: 20 }}>
          {text}
        </Text>
      </View>
    )
  }

  renderEmailForm () {
    return (
      <View
        style={{
          ...styles.screen.containers.centeringContainer,
          marginTop: 60
        }}
      >
        <View style={styles.screen.textInput.parentContainerStyle}>
          <Field
            name={AUTH_ENTITIES.EMAIL}
            whiteBackground
            accessible
            accessibilityLabel={'email'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='go'
            autoCapitalize='none'
            component={LWTextInput}
            leftIcon
            leftIconName='mail-outline'
            placeholderText='Email'
            keyboardType='email-address'
            validate={val => this.validate(AUTH_ENTITIES.EMAIL, val)}
            isError={this.state._emailError}
            maxLength={39}
          />
        </View>
      </View>
    )
  }

  renderVerificationAndPasswordForm () {
    const { handleSubmit } = this.props
    return (
      <View
        style={{
          ...styles.screen.containers.centeringContainer,
          marginTop: 60
        }}
      >
        <View style={styles.screen.textInput.parentContainerStyle}>
          <Field
            name={AUTH_ENTITIES.VERIFICATION_CODE}
            accessible
            whiteBackground
            accessibilityLabel={'Verification Code'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='next'
            autoCapitalize='none'
            component={LWTextInput}
            placeholderText='Verification Code'
            keyboardType='number-pad'
          />
        </View>
        <View
          style={{
            ...styles.screen.textInput.parentContainerStyle,
            marginTop: 20
          }}
        >
          <Field
            name={AUTH_ENTITIES.PASSWORD}
            accessible
            whiteBackground
            accessibilityLabel={'password'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='next'
            onSubmitEditing={handleSubmit(data => this.navigateToNext(data))}
            component={LWTextInput}
            showIcon
            iconName={this.state.showPassword ? 'visibility' : 'visibility-off'}
            iconCallback={() => this.togglePasswordVisibility()}
            secureTextEntry={!this.state.showPassword}
            placeholderText='Password'
            validate={val => this.validate(AUTH_ENTITIES.PASSWORD, val)}
            isError={this.state._passwordError}
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
          style={{ 
            ...styles.bottomNavigator.containerStyle, 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0}, 
            marginHorizontal: 20 
          }}
          onPress={handleSubmit(data => this.navigateToNext(data))}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  renderForm () {
    if (this.props.isVerified) {
      return this.renderVerificationAndPasswordForm()
    }
    return this.renderEmailForm()
  }
  // --------------------------------------------------------
  // Core render method

  render () {
    const { errorObj, isProcessing, type, navigator, isVerified } = this.props
    if (errorObj) {
      Alert.alert(errorObj.code, errorObj.message, [{ text: 'OK', onPress: () => this.hideError() }], { cancelable: false })
    }
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Forgot Password' />
        <KeyboardAwareScrollView
          extraScrollHeight={32}
          resetScrollToCoords={{ x: 0, y: 0 }}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{
            ...styles.screen.containers.keyboard
          }}
        >
          <ProcessingIndicator isProcessing={isProcessing} />
          <View style={{ flex: 0.92, paddingHorizontal: 16 }}>
            {this.renderHeading()}
            {this.renderForm()}
            {isVerified && this.renderPasswordDescription()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderNextButton()}
      </View>
    )
  }
}

ForgotPassword.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-native-navigation
  navigator: PropTypes.object.isRequired,

  isProcessing: PropTypes.bool.isRequired,

  email: PropTypes.string,

  userID: PropTypes.string.isRequired,

  isVerified: PropTypes.bool
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(ForgotPassword))

export default Screen
