/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * InputPhoneNumber
 * - Phone number
 *
 * Created by Anita on 5/9/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  PushNotificationIOS,
  Text,
  Alert,
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
import _
  from 'lodash'
import { analytics }
  from '../../Config/AppConfig'
import {events}
  from '../../Utility/Mapper/Tracking'
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

class InputPhoneNumber extends Component {
  constructor (props) {
    super(props)
    this.state = {
      _phoneError: false
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  componentDidMount () {
    this.updateCurrentOnboarding()
  }

  // --------------------------------------------------------
  // Action handlers

  triggerEnterEvent () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.SIGNUP_PHONE_NUMBER
    })
    // *********** Log Analytics ***********
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  navigateToNextScreen (data) {
    let phone = data[USER_ENTITIES.PHONE_NUMBER]
    if (!phone || (phone && phone.length === 0)) {
      return
    }

    const { handleLocalAction, localActions, navigator, userID, emailID } = this.props
    handleLocalAction({ type: localActions.CREATE_PIN, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.PHONE_NUMBER]: data[USER_ENTITIES.PHONE_NUMBER], [USER_ENTITIES.USER_ID]: userID })

    // const {localActions, handleLocalAction, navigator, nextScreen, userID} = this.props
    // handleLocalAction({type: localActions.NAVIGATE_TO_NEXT_SCREEN, [USER_ENTITIES.PHONE_NUMBER]: phone, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.PHONE_NUMBER:
        this.setState({_phoneError: error})
        break
      default:
        this.setState({
          _phoneError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.PHONE_NUMBER:
        if (/^\( ?([0-9]{3} )\) ?[-. ]?([0-9]{3}) [-. ] ?([0-9]{4})$/.test(val)) {
          this.markError(USER_ENTITIES.PHONE_NUMBER, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.PHONE_NUMBER, true)
          return 'Phone Required'
        }
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, alignItems: 'center'}}>
        <Text style={{fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, alignSelf: 'center', marginBottom: 20}}>
          What is your phone number?
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 18, textAlign: 'center', marginHorizontal: 20 }}>
          We are required to collect this information under Federal Law.
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
            accessible accessibilityLabel={'Phone Number'}
            accessibilityRole={'keyboardkey'}
            name={USER_ENTITIES.PHONE_NUMBER}
            component={LWFormInput}
            mask='( [000] ) [000] - [0000]'
            keyboardType='number-pad'
            isLabel
            onChange={(text) => {
              if (text && text.length === 3) {
                this.triggerEnterEvent()
              }
            }}
            focusSmoothly
            label='Phone number'
            placeholderText='Phone Number'
            returnKeyType='next'
            whiteBackground
            isError={this.state._phoneError}
            validate={val => this.validate(USER_ENTITIES.PHONE_NUMBER, val)}
            maxLength={18}
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))} />
        </View>
      </View>
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
    const { navigator, popButton, toast, toastHeading, toastSubheading } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent={popButton} title={'Sign up'} titlePresent />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={100}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 0 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
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

InputPhoneNumber.propTypeDetail_s = {
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

  // popButton
  popButton: PropTypes.bool,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

InputPhoneNumber.defaultProps = {
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputPhoneNumber))

export default Screen
