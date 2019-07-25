/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 28/9/18.
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
  TouchableHighlight,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { reduxForm, Field, change } from 'redux-form'
import LinearGradient from 'react-native-linear-gradient'
import CustomNav from '../../Containers/Common/CustomNav'
import loginPinStyles from '../Common/Styles/LoginPinStyle'
import { connect } from 'react-redux'
import { Button, FormInput, Icon } from 'react-native-elements'
import { FORM_TYPES, ANALYTIC_PROPERTIES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { AUTH_ENTITIES, PIN_ACTION_TYPE } from '../../Utility/Mapper/Auth'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import GravityCapsule from '../Utility/GravityCapsule'
import LWTextInput from '../Utility/LWFormInput'
import { formatUserSSN } from '../../Utility/Formatter/inputFormatter'
import { validateSSN } from '../../Utility/Transforms/Validator'
import { LW_SCREEN, LW_EVENT_TYPE } from '../../Utility/Mapper/Screens'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import Colors from '../../Themes/Colors'
import ShadowedContainer from '../../CommonComponents/ShadowedContainer'
import * as Constants from '../../Themes/Constants'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_CHILD,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class UserSSN extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _ssnError: false,
      _userSSNError: false,
      userSSN: '',
      shadowOpacity: {
        0: 0.16,
        1: 0.16,
        2: 0.16,
        3: 0.16,
        4: 0.16,
        5: 0.16,
        6: 0.16,
        7: 0.16,
        8: 0.16,
        9: 0.16
      }
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  markError (inputType, error) {
    switch (inputType) {
      case CHILD_ENTITIES.SSN:
        this.setState({ _ssnError: error })
        break
      case USER_ENTITIES.SSN:
        this.setState({_userSSNError: error})
        break
      default:
        this.setState({
          _ssnError: false,
          _userSSNError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case CHILD_ENTITIES.SSN:
        if (validateSSN(val)) {
          this.markError(CHILD_ENTITIES.SSN, true)
          return 'SSN Required'
        } else {
          this.markError(CHILD_ENTITIES.SSN, false)
          return undefined
        }
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
  }

  // --------------------------------------------------------
  // Action handlers

  pressShadow (title) {
    let currentObj = this.state.shadowOpacity
    let modified = {[title]: 0.8}
    let merged = Object.assign({}, currentObj, modified)
    this.setState({
      shadowOpacity: merged
    })
  }

  resetShadow (title) {
    let currentObj = this.state.shadowOpacity
    let modified = {[title]: 0.16}
    let merged = Object.assign({}, currentObj, modified)
    this.setState({
      shadowOpacity: merged
    })
  }

  navigateToNextScreen (data) {
    if (validateSSN(this.state.userSSN)) {
      Alert.alert('enter valid SSN')
      return
    } else {
      const { localActions, handleLocalAction, navigator, childID, userID, isAddingDesire, isAddingDream } = this.props
      let userSSN = formatUserSSN(this.state.userSSN)
      handleLocalAction({
        type: localActions.NAVIGATE_TO_CHILD_SSN,
        form: FORM_TYPES.ADD_CHILD,
        field: USER_ENTITIES.SSN,
        value: userSSN,
        [USER_ENTITIES.USER_ID]: userID,
        [CHILD_ENTITIES.CHILD_ID]: childID,
        [USER_ENTITIES.SSN]: userSSN,
        [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream,
        [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire,
        [COMMON_ENTITIES.NAVIGATOR]: navigator
      })
    }
  }

  skip () {
    const { localActions, handleLocalAction, navigator, userID, emailID } = this.props
    handleLocalAction({
      type: localActions.SKIP,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [USER_ENTITIES.USER_ID]: userID,
      [USER_ENTITIES.EMAIL_ID]: emailID
    })
  }

  addSSN (digit) {
    if (this.state.userSSN && this.state.userSSN.length > 8) return
    this.setState({ userSSN: this.state.userSSN + digit })
  }

  trimSSN () {
    let ssn = this.state.userSSN.slice(0, -1)
    this.setState({ userSSN: ssn })
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  // --------------------------------------------------------
  // Child Components

  renderHorizontalLine () {
    return (
      <View style={styles.screen.horizontalLine.containerStyle}>
        <View style={styles.screen.horizontalLine.lineStyle} />
      </View>
    )
  }

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, alignItems: 'center', marginBottom: 32, marginTop: 40}}>
        <Text style={{ fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, textAlign: 'center', marginBottom: 20 }}>
          What is your social security number?
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 18, textAlign: 'center' }}>
          Loved encrypts and securely transmits your information using SSL.
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const {isUserSSNAdded} = this.props
    const {userSSN} = this.state
    const text = userSSN ? formatUserSSN(userSSN) : 'Your social security number'
    return (
      <View>
        {
          !isUserSSNAdded &&
          <View style={{ ...styles.screen.textInput.parentContainerStyle, marginBottom: 0, paddingLeft: 15, borderColor: Colors.fontGray, borderWidth: 1, borderRadius: 5, alignItems: 'center' }}>
            <Text style={{...styles.text.title, color: userSSN ? Colors.blue : Colors.fontGray}}>
              {text}
            </Text>
          </View>
        }
      </View>
    )
  }
  renderPadContainer () {
    return (
      <View style={{flex: 1, justifyContent: 'center', marginVertical: 15, marginHorizontal: 15}}>
        <View style={{...loginPinStyles.horizontalPadContainer, flex: 1}}>
          {this.renderButton(1)}
          {this.renderButton(2)}
          {this.renderButton(3)}
        </View>
        <View style={{...loginPinStyles.horizontalPadContainer, flex: 1}}>
          {this.renderButton(4)}
          {this.renderButton(5)}
          {this.renderButton(6)}
        </View>
        <View style={{...loginPinStyles.horizontalPadContainer, flex: 1}}>
          {this.renderButton(7)}
          {this.renderButton(8)}
          {this.renderButton(9)}
        </View>
        <View style={{...loginPinStyles.horizontalPadContainer, flex: 1}}>
          {this.renderButton('')}
          {this.renderButton(0)}
          {this.renderBackButton()}
        </View>
      </View>
    )
  }

  renderButton (title) {
    let containerSize = 70
    let diameter = Constants.screen.height * 0.0865
    return (
      <TouchableHighlight onHideUnderlay={() => this.resetShadow(title)} onShowUnderlay={() => this.pressShadow(title)} underlayColor='rgba(78, 194, 209, 0.37)' onPress={() => this.addSSN(title)} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{...styles.text.mainHeader, fontSize: 30, fontWeight: 'normal'}}>
          {title}
        </Text>
      </TouchableHighlight>
    )
  }

  renderTouchIcon () {
    let containerSize = 70
    let diameter = Constants.screen.height * 0.0865
    return (
      <View
        style={{
          maxHeight: containerSize,
          maxWidth: containerSize,
          width: diameter,
          height: diameter,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.white
        }}
      >
        <TouchableOpacity disabled style={{...loginPinStyles.buttonPadStyle, height: diameter, width: diameter, borderRadius: (diameter / 2), backgroundColor: 'transparent', maxHeight: 70, maxWidth: 70, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name='md-backspace' type='ionicon' size={30} color={Colors.white} />
        </TouchableOpacity>
      </View>
    )
  }

  renderBackButton () {
    let containerSize = 70
    let diameter = Constants.screen.height * 0.0865
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'backspace'}
        accessibilityRole={'button'}
        style={{...loginPinStyles.buttonPadStyle, flex: 1, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => this.trimSSN()}
        underlayColor={Colors.selectedPinButton}>
        <Icon name='md-backspace' type='ionicon' size={30} color={'#050D13'} />
      </TouchableOpacity>
    )
  }

  renderNextButton () {
    const { handleSubmit, isProcessing } = this.props
    const isX = this.isX || false
    return (
      <View>
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
          onPress={_.debounce(_.bind(() => this.navigateToNextScreen(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableHighlight>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const { isProcessing, navigator, canPop, totalChildren, isUserSSNAdded } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent={canPop} titlePresent title='Verification' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <View style={{ flex: 8.7, paddingHorizontal: 20 }}>
          {this.renderHeading()}
          {this.renderFormContainer()}
          {this.renderPadContainer()}
        </View>
        <View style={{flex: 1.3}}>
          {this.renderNextButton()}
        </View>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

UserSSN.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // is processing
  isProcessing: PropTypes.bool,

  userID: PropTypes.string.isRequired,
  childID: PropTypes.string.isRequired,
  emailID: PropTypes.string.isRequired,

  // is adding desire
  isAddingDesire: PropTypes.bool,
  // is adding dream
  isAddingDream: PropTypes.bool,
  // is user ssn added ?
  isUserSSNAdded: PropTypes.string.isRequired,
  // can pop
  canPop: PropTypes.bool.isRequired
}

UserSSN.defaultProps = {
  isAddingDesire: false,
  // is adding dream
  isAddingDream: false,
  // is user ssn added
  isUserSSNAdded: false,
  // can pop
  canPop: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(UserSSN))

export default Screen
