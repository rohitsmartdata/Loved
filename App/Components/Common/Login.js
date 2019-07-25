/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 7/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, TextInput, Alert, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {reduxForm, Field}
  from 'redux-form'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import styles
  from '../../Themes/ApplicationStyles'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view'
import LWTextInput
  from '../Utility/LWFormInput'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import {validateEmail, validatePassword, validatePasswordSchema}
  from '../../Utility/Transforms/Validator'
import _
  from 'lodash'
import { Icon }
  from 'react-native-elements'
import Colors
  from '../../Themes/Colors'
import Fonts
  from '../../Themes/Fonts'
import GravityCapsule
  from '../Utility/GravityCapsule'
import { USER_ENTITIES } from '../../Utility/Mapper/User'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.AUTH,
  destroyOnUnmount: false,
  enableReinitialize: true
})

// ========================================================
// Core Component
// ========================================================

class Login extends Component {

  // --------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      showPassword: false,
      _emailError: false,
      _passwordError: false,
      _emailErrorMessage: null,
      _passwordErrorMessage: null,
      passwordSchema: undefined,
      showIcons: false
    }
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  // --------------------------------------------------------
  // Action handlers

  componentWillMount () {
    this.props.initialize()
  }

  componentWillUnmount () {
    this.props.destroy()
  }

  togglePasswordVisibility () {
    this.setState(prevstate => {
      return {showPassword: !prevstate.showPassword}
    })
  }

  hideError () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.HIDE_ERROR})
  }

  markError (inputType, error, message) {
    switch (inputType) {
      case AUTH_ENTITIES.EMAIL:
        this.setState({_emailError: error, _emailErrorMessage: message})
        break
      case AUTH_ENTITIES.PASSWORD:
        this.setState({_passwordError: error, _passwordErrorMessage: message})
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
    this.setState({passwordSchema: schema})
  }

  validate (type, val) {
    switch (type) {
      case AUTH_ENTITIES.EMAIL:
        if (validateEmail(val)) {
          this.markError(AUTH_ENTITIES.EMAIL, true, 'Enter valid Email Address.')
          return 'Correct Email Needed'
        } else {
          this.markError(AUTH_ENTITIES.EMAIL, false, null)
          return undefined
        }
      case AUTH_ENTITIES.PASSWORD:
        this.markPasswordSchema(val)
        let passwordError = validatePassword(val)
        if (passwordError) {
          this.markError(AUTH_ENTITIES.PASSWORD, true, passwordError)
          return 'MIN 6 Char pass needed'
        } else {
          this.markError(AUTH_ENTITIES.PASSWORD, false, null)
          return undefined
        }
    }
  }

  navigateToNext (data) {
    const {localActions, handleLocalAction, handleSubmit, navigator, isProcessing, type} = this.props
    if (type !== AUTH_ENTITIES.LOGIN && /\s/.test(data[AUTH_ENTITIES.PASSWORD])) {
      Alert.alert('Signup Error', 'Password did not confirm with policy: \nPassword must not contain space')
      return
    }
    let email = data && data[AUTH_ENTITIES.EMAIL] && data[AUTH_ENTITIES.EMAIL].toLowerCase()
    handleLocalAction({
      type: type,
      [AUTH_ENTITIES.EMAIL]: email,
      [AUTH_ENTITIES.PASSWORD]: data[AUTH_ENTITIES.PASSWORD],
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  navigateToForgotPassword () {
    const {localActions, handleLocalAction, navigator} = this.props
    handleLocalAction({
      type: localActions.FORGOT_PASSWORD,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  clearField (field) {
    const {localActions, handleLocalAction, navigator} = this.props
    handleLocalAction({
      type: localActions.REMOVE_VALUE,
      form: FORM_TYPES.AUTH,
      field: field,
      value: ''
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderFormContainer () {
    const {handleSubmit, type, showEmailError, showPasswordError} = this.props
    const {_emailError, _passwordError, _passwordErrorMessage, showIcons} = this.state
    let emailError = (showEmailError && _emailError) ? 'Please enter valid email address' : undefined
    let passwordError = (showPasswordError && _passwordError) ? _passwordErrorMessage : undefined
    return (
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <View style={styles.screen.textInput.parentContainerStyle}>
          <Field
            name={AUTH_ENTITIES.EMAIL}
            isLabel
            label='Email'
            whiteBackground
            accessible
            accessibilityLabel={'Email'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='next'
            onSubmitEditing={() => this.password.getRenderedComponent().refs.password.focus()}
            autoCapitalize='none'
            component={LWTextInput}
            showIcon={showEmailError}
            iconName={emailError ? 'clear' : 'done'}
            iconCallback={() => emailError && this.clearField(AUTH_ENTITIES.EMAIL)}
            iconColor={emailError ? Colors.switchOff : Colors.appColor}
            iconSize={18}
            placeholderText='Email'
            keyboardType='email-address'
            validate={val => this.validate(AUTH_ENTITIES.EMAIL, val)}
            isError={this.state._emailError}
            extraTextStyle={{fontSize: (this.state.showPassword) ? 16 : 15}}
            extraStyle={{borderColor: emailError ? Colors.switchOff : Colors.appColor}}
            maxLength={39} />
        </View>
        {
          (emailError) &&
          <Text style={{ fontFamily: Fonts.type.book, color: Colors.switchOff, fontSize: 11, marginHorizontal: 15, marginBottom: 10, marginTop: -10 }}>
            {emailError}
          </Text>
        }
        <View style={{...styles.screen.textInput.parentContainerStyle, marginTop: 10}}>
          <Field
            name={AUTH_ENTITIES.PASSWORD}
            isLabel
            label='Password'
            whiteBackground
            accessible
            accessibilityLabel={'password'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='done'
            ref={(el) => { this.password = el }}
            refField='password'
            withRef
            component={LWTextInput}
            showIcon={showPasswordError}
            iconName={passwordError ? 'clear' : 'done'}
            iconCallback={() => passwordError && this.clearField(AUTH_ENTITIES.PASSWORD)}
            iconColor={passwordError ? Colors.switchOff : Colors.appColor}
            iconSize={18}
            secureTextEntry={!this.state.showPassword}
            placeholderText='Password'
            validate={val => this.validate(AUTH_ENTITIES.PASSWORD, val)}
            isError={this.state._passwordError}
            extraTextStyle={{fontSize: (this.state.showPassword) ? 16 : 15}}
            extraStyle={{borderColor: passwordError ? Colors.switchOff : Colors.appColor}} />
        </View>
        {
          (passwordError) &&
          <Text style={{ fontFamily: Fonts.type.book, color: Colors.switchOff, fontSize: 11, marginHorizontal: 15, marginTop: -10 }}>
            {passwordError}
          </Text>
        }
        <View style={{ marginTop: 20, marginBottom: 23 }}>
          {this.renderNextButton()}
        </View>
      </View>
    )
  }

  renderNextButton () {
    const {handleSubmit, type, isProcessing} = this.props
    const isX = this.isX || false
    return (
      <View>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          disabled={isProcessing}
          style={{
            ...styles.bottomNavigator.containerStyle
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0}
          }}
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNext(data)), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Forgot your password?'}
          accessibilityRole={'button'}
          onPress={() => this.navigateToForgotPassword()}>
          <Text style={{...styles.text.title, marginTop: 20, color: Colors.fontGray, textDecorationLine: 'underline'}}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle}}>
        <Text style={{ fontFamily: Fonts.type.bold, color: '#FFF', fontSize: 22, alignSelf: 'center', marginBottom: 20 }}>
          Hey there!
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: '#FFF', fontSize: 18, textAlign: 'center', marginHorizontal: 20 }}>
          Investing for kids starts with you so your email address please?
        </Text>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {errorObj, isProcessing, type, navigator} = this.props
    if (errorObj) {
      Alert.alert(errorObj.code,
        errorObj.message,
        [
          {text: 'OK', onPress: () => this.hideError()}
        ],
        { cancelable: false }
      )
    }

    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent customIcon={<Icon name='ios-close' type='ionicon' containerStyle={{left: 10}} color={Colors.white} size={40} />} title={'Log in'} titlePresent />
        <ProcessingIndicator isProcessing={isProcessing} />
        <KeyboardAwareScrollView
          contentContainerStyle={{ ...styles.screen.containers.keyboard }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={100}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'>
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }

}

Login.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-native-navigation
  navigator: PropTypes.object.isRequired,

  isProcessing: PropTypes.bool.isRequired,
  showPasswordError: PropTypes.bool,
  showEmailError: PropTypes.bool,

  // type of authentication 'Login' or 'SignUp'
  type: PropTypes.string.isRequired,

  // heading as per signup/login
  heading: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(Login))

export default Screen
