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
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule from '../Utility/GravityCapsule'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import LWFormInput from '../Utility/LWFormInput'
import { validateDate } from '../../Utility/Transforms/Validator'
import { SPROUT } from '../../Utility/Mapper/Screens'
var Moment = require('moment')
import _
  from 'lodash'
import { analytics }
  from '../../Config/AppConfig'
import {screens, events}
  from '../../Utility/Mapper/Tracking'
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

class InputUserDetail_2 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      _DOBError: false,
      showAgeInstruction: false
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  componentDidMount () {
    const { userID } = this.props
    this.updateCurrentOnboarding()
    this.logNumberOfChildren()
  }

  // --------------------------------------------------------
  // Action handlers

  triggerEnterEvent () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.SIGNUP_DATE_OF_BIRTH
    })
    // *********** Log Analytics ***********
  }

  logNumberOfChildren () {
    const {handleLocalAction, localActions, numberOfChildren} = this.props
    handleLocalAction({type: localActions.LOG_NUMBER_OF_CHILDREN_AT_START, [CHILD_ENTITIES.NUMBER_OF_CHILDREN_AT_START]: numberOfChildren})
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  toggleAgeInstruction (show) {
    this.setState({showAgeInstruction: show})
  }

  navigateToNextScreen (data) {
    const { localActions, handleLocalAction, navigator, nextScreen, userID } = this.props
    let d = data[USER_ENTITIES.DOB]
    let date = Moment(d, 'MM/DD/YYYY')
    let now = Moment()
    let age = now.diff(date, 'years')
    let next = age < 18 ? SPROUT.AGE_LIMITATION_NOTIFICATION : nextScreen
    handleLocalAction({
      type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [USER_ENTITIES.USER_ID]: userID,
      [COMMON_ENTITIES.SCREEN_TYPE]: next,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [USER_ENTITIES.DOB]: d
    })
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.DOB:
        this.setState({ _DOBError: error })
        break
      default:
        this.setState({
          _DOBError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.DOB:
        if (validateDate(val) || !Moment(val, 'MM/DD/YYYY').isValid() || Moment(val).isAfter(Moment())) {
          this.markError(USER_ENTITIES.DOB, true)
          return 'DOB REQUIRED PROPERLY'
        } else {
          this.markError(USER_ENTITIES.DOB, false)
          return undefined
        }
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, alignItems: 'center'}}>
        <Text style={{ fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, alignSelf: 'center', marginBottom: 20 }}>
          What is your date of birth?
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
            name={USER_ENTITIES.DOB}
            component={LWFormInput}
            maxLength={14}
            isLabel
            focusSmoothly
            label='Your Date of birth'
            mask='[00] / [00] / [0000]'
            accessible
            onChange={(text) => {
              if (text && text.length === 1) {
                this.triggerEnterEvent()
              }
            }}
            whiteBackground
            accessibilityLabel={'Date Of Birth'}
            accessibilityRole={'keyboardkey'}
            returnKeyType='next'
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))}
            isError={this.state._DOBError}
            placeholderText='MM / DD / YYYY'
            keyboardType='number-pad'
            validate={val => this.validate(USER_ENTITIES.DOB, val)}
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

InputUserDetail_2.propTypeDetail_s = {
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

  numberOfChildren: PropTypes.number,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

InputUserDetail_2.defaultProps = {
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputUserDetail_2))

export default Screen
