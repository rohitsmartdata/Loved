/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces,jsx-indent-props,new-cap */
/**
 * User Input Detail Number 3.
 * - Phone Number
 * - Address
 *
 * Created by viktor on 27/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { Animated, StyleSheet, View, Text, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import {reduxForm, Field}
  from 'redux-form'
import Toast
  from '../Common/Toast'
import CustomNav
  from '../../Containers/Common/CustomNav'
import { connect }
  from 'react-redux'
import {FORM_TYPES}
  from '../../Config/contants'
import styles
  from '../../Themes/ApplicationStyles'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule
  from '../Utility/GravityCapsule'
import LWFormInput
  from '../Utility/LWFormInput'
import _
  from 'lodash'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import Colors
  from '../../Themes/Colors'
import Fonts
  from '../../Themes/Fonts'
import Picker from 'react-native-picker'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_USER,
  destroyOnUnmount: false
})

let deviceHeight = Dimensions.get('window').height

const stateCodes = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
  'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'PR' ]

// ========================================================
// Core Component
// ========================================================

// Todo:-
// proper error handling
class InputManualAddress extends Component {

  // -------------------------------------------------------
  // Lifecycle methods

  /*
   - introduces 'listData'
   to local state
   */
  constructor (props) {
    super(props)
    this.state = {
      listData: [],
      _line1Error: false,
      _cityError: false,
      _stateError: false,
      _zipcodeError: false,
      height: 40,
      mapY: new Animated.Value(deviceHeight),
      showContinueButton: false
    }
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  openMap () {
    Animated.timing(this.state.mapY, {
      duration: 1000,
      toValue: 0,
      delay: 300
    }).start()
  }

  closeMap () {
    Animated.timing(this.state.mapY, {
      duration: 500,
      toValue: deviceHeight,
      delay: 300
    }).start()
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.ADDRESS_LINE_1:
        this.setState({_line1Error: error})
        break
      case USER_ENTITIES.CITY:
        this.setState({_cityError: error})
        break
      case USER_ENTITIES.STATE:
        this.setState({_stateError: error})
        break
      case USER_ENTITIES.ZIP_CODE:
        this.setState({_zipcodeError: error})
        break
      default:
        this.setState({
          _line1Error: false,
          _cityError: false,
          _stateError: false,
          _zipcodeError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.ADDRESS_LINE_1:
        if (val && val !== ' ') {
          this.markError(USER_ENTITIES.ADDRESS_LINE_1, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.ADDRESS_LINE_1, true)
          return 'ADDRESS LINE 1 Required'
        }
      case USER_ENTITIES.CITY:
        if (val && val !== ' ') {
          this.markError(USER_ENTITIES.CITY, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.CITY, true)
          return 'CITY Required'
        }
      case USER_ENTITIES.STATE:
        if (val && val !== ' ') {
          this.markError(USER_ENTITIES.STATE, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.STATE, true)
          return 'State Required'
        }
      case USER_ENTITIES.ZIP_CODE:
        if (val && val !== ' ' && val.length === 5 && val !== '00000' && /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val)) {
          this.markError(USER_ENTITIES.ZIP_CODE, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.ZIP_CODE, true)
          return 'ZipCode Required'
        }
    }
  }

  componentDidMount () {
    this.updateCurrentOnboarding()

    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.USER_ADDRESS
    })
    // *********** Log Analytics ***********
  }

  // -------------------------------------------------------
  // action handlers

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  navigateToNextScreen (data) {
    let zipCode = data[USER_ENTITIES.ZIP_CODE]
    let state = data[USER_ENTITIES.STATE]
    if (!state) {
      this.markError(USER_ENTITIES.STATE, true)
    } else if (zipCode && zipCode.length === 5) {
      const {localActions, handleLocalAction, navigator, nextScreen, userID, childID} = this.props
      handleLocalAction({type: localActions.NAVIGATE_TO_NEXT_SCREEN, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen, [COMMON_ENTITIES.NAVIGATOR]: navigator, [COMMON_ENTITIES.CAN_POP]: true, 'addressData': data})
    } else {
      this.markError(USER_ENTITIES.ZIP_CODE, true)
    }
  }

  changeField (field, value) {
    const {localActions, handleLocalAction} = this.props
    handleLocalAction({type: localActions.CHANGE_FIELD, form: FORM_TYPES.ADD_USER, field: field, value: value})
  }

  /*
   set List State :-
   - sets the state of
   the list as 's'
   */
  // -------------------------------------------------------
  // render inner component
  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, marginBottom: 10 }}>
        <Text style={{ ...styles.text.mainHeader, alignSelf: 'center', marginBottom: 20 }}>
          {'Can you confirm\nthis is correct?'}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const {handleSubmit} = this.props
    const { width } = Dimensions.get('window')
    const fieldWidth = (width - 32)
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{...styles.screen.textInput.parentContainerStyle}}>
          <Field
            accessible accessibilityLabel={'Address Line 1'}
            accessibilityRole={'keyboardkey'}
            name={USER_ENTITIES.ADDRESS_LINE_1}
            isLabel
            label='Street address'
            component={LWFormInput}
            placeholderText='Street address'
            returnKeyType='next'
            whiteBackground
            onSubmitEditing={() => this.addressline2.getRenderedComponent().refs.addressline2.focus()}
            isError={this.state._line1Error}
            validate={val => this.validate(USER_ENTITIES.ADDRESS_LINE_1, val)} />
        </View>
        <View style={{...styles.screen.textInput.parentContainerStyle, marginTop: 12}}>
          <Field
            accessible accessibilityLabel={'Address Line 2'}
            accessibilityRole={'keyboardkey'}
            name={USER_ENTITIES.ADDRESS_LINE_2}
            component={LWFormInput}
            isLabel
            label='Apartment / unit'
            placeholderText='Apartment / Unit'
            returnKeyType='next'
            onSubmitEditing={() => this.city.getRenderedComponent().refs.city.focus()}
            ref={(el) => { this.addressline2 = el }}
            refField='addressline2'
            withRef
            whiteBackground
          />
        </View>

        <View style={{...styles.screen.textInput.parentContainerStyle, marginTop: 12}}>
          <Field
            accessible accessibilityLabel={'city'}
            accessibilityRole={'keyboardkey'}
            name={USER_ENTITIES.CITY}
            component={LWFormInput}
            placeholderText='City'
            isLabel
            label='City'
            ref={(el) => { this.city = el }}
            returnKeyType='next'
            refField='city'
            withRef
            whiteBackground
            isError={this.state._cityError}
            validate={val => {
              const result = this.validate(USER_ENTITIES.CITY, val)
              return result
            }}
            onSubmitEditing={() => this.addressState.getRenderedComponent().refs.addressState.focus()}
             />
        </View>

        {this.renderStatePicker()}

        <View style={{...styles.screen.textInput.parentContainerStyle, marginTop: 12}}>
          <Field
            accessible accessibilityLabel={'Zip Code'}
            accessibilityRole={'keyboardkey'}
            name={USER_ENTITIES.ZIP_CODE}
            component={LWFormInput}
            keyboardType='number-pad'
            isLabel
            maxLength={5}
            label='Zip code'
            placeholderText='Zip Code'
            ref={(el) => { this.zipcode = el }}
            returnKeyType='done'
            refField='zipcode'
            withRef
            whiteBackground
            isError={this.state._zipcodeError}
            validate={val => this.validate(USER_ENTITIES.ZIP_CODE, val)}
            extraTextStyle={{width: fieldWidth}} />
        </View>
      </View>
    )
  }

  renderNextButton () {
    const {handleSubmit} = this.props
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
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNextScreen(data)), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  renderStatePicker () {
    const {addressState} = this.props
    const {_stateError} = this.state
    return (
      <TouchableOpacity style={{justifyContent: 'center', paddingLeft: 15, marginBottom: 15, marginTop: 10, height: 40, borderRadius: 5, borderWidth: 1, borderColor: _stateError ? 'red' : Colors.fontGray}} onPress={this._showPicker.bind(this)}>
        <Text style={{fontFamily: Fonts.type.book, fontSize: 16, color: addressState ? '#1C3C70' : Colors.fontGray}}>
          {addressState || 'Select State'}
        </Text>
      </TouchableOpacity>
    )
  }

  _showPicker () {
    Keyboard.dismiss()
    Picker.init({
      pickerData: stateCodes,
      pickerConfirmBtnColor: [26, 141, 252, 1],
      pickerCancelBtnColor: [26, 141, 252, 1],
      pickerTitleText: 'Select State',
      onPickerConfirm: (pickedValue, pickedIndex) => {
        this.changeField(USER_ENTITIES.STATE, pickedValue[0])
      }
    })
    Picker.show()
  }

  // -------------------------------------------------------
  // render core component

  render () {
    const {navigator, popButton, toast, toastSubheading, toastHeading} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} leftButtonPresent={popButton} titlePresent title='Custodial Account' />
        <KeyboardAwareScrollView
          onKeyboardWillShow={(frames: Object) => {
            Picker.hide()
          }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={100}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ ...styles.screen.containers.keyboard }}
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

InputManualAddress.propTypes = {
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
  userID: PropTypes.string.isRequired,

  // childID
  childID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  // popButton
  popButton: PropTypes.bool,

  // address state
  addressState: PropTypes.string,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

InputManualAddress.defaultProps = {
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputManualAddress))

export default Screen
