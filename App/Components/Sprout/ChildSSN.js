/* eslint-disable no-trailing-spaces,spaced-comment */
/**
 * Created by demon on 16/10/17.
 */

/* eslint-disable no-unused-vars,camelcase */

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
  Alert,
  ActivityIndicator,
  TouchableHighlight,
  TextInput,
  Dimensions,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'
import { reduxForm, Field } from 'redux-form'
import CustomNav from '../../Containers/Common/CustomNav'
import { connect } from 'react-redux'
import { FORM_TYPES } from '../../Config/contants'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { SETTINGS_ENTITIES } from '../../Utility/Mapper/Settings'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import GravityCapsule from '../Utility/GravityCapsule'
import LWTextInput from '../Utility/LWFormInput'
import { validateSSN } from '../../Utility/Transforms/Validator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'
import { analytics, CURRENT_ENVIRONMENT } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import loginPinStyles from '../Common/Styles/LoginPinStyle'
import ShadowedContainer from '../../CommonComponents/ShadowedContainer'
import { Button, Icon } from 'react-native-elements'
import Colors from '../../Themes/Colors'
import { formatUserSSN } from '../../Utility/Formatter/inputFormatter'
import * as Constants from '../../Themes/Constants'
import { SPROUT } from '../../Utility/Mapper/Screens'
import { SSNRequestLink } from '../../CommonComponents/SSNRequestLink'

var Buffer = require('buffer/').Buffer

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_CHILD,
  destroyOnUnmount: false
})

const getUniqueCode = (user_id, sprout_id, ssn_request_mobile, ssn_request_email) => {
  let unique_code = ''
  let encoded_unique_code = ''
  if (!unique_code) {
    unique_code += user_id + '_' + sprout_id
    if (ssn_request_mobile) {
      unique_code += '_' + ssn_request_mobile
    }
    if (ssn_request_email) {
      unique_code += '_' + ssn_request_email
    }
    const buffer = Buffer.from(unique_code, 'utf8')
    encoded_unique_code = buffer.toString('base64')
  } else {
    encoded_unique_code = unique_code
  }

  let unique_code_url = ''
  if (process.env.ENVIRONMENT === 'PROD') {
    unique_code_url = `https://www.loved.com/enterdetails/index.html?code=${encoded_unique_code}`
  } else {
    unique_code_url = `https://www.loved.com/enterdetails/test/${CURRENT_ENVIRONMENT}/index.html?code=${encoded_unique_code}`
  }
  return {
    code: encoded_unique_code,
    url: unique_code_url
  }
}

// ========================================================
// Core Component
// ========================================================

class ChildSSN extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _ssnError: false,
      _userSSNError: false,
      child_ssn: props.childSSN || '',
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
      },
      showRequestPopup: false,
      autoNavigate: true
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
    this.refresh = false
  }

  onBack () {
    const {child_ssn} = this.state
    const {localActions, handleLocalAction, navigator} = this.props
    handleLocalAction({
      type: localActions.ON_BACK,
      form: FORM_TYPES.ADD_CHILD,
      field: CHILD_ENTITIES.SSN,
      value: child_ssn,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  componentWillMount () {
    const {isOnboardingFlow, isSSNRequested} = this.props
    if (isOnboardingFlow && isSSNRequested) {
      this.refreshStore()
    }
    isOnboardingFlow && this.updateCurrentOnboarding()
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  componentWillReceiveProps (nextProps) {
    AsyncStorage.getItem('active').then((active) => {
      let a = JSON.parse(active)
      if (a && !this.refresh && !nextProps.isSSNAdded) {
        this.refreshStore()
        this.refresh = true
      }
    }).catch((err) => {
      console.log('Error --> ', err)
    })
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
  toggleSSNLinkPopup (show) {
    this.setState({showRequestPopup: show})
  }

  // --------------------------------------------------------
  // Action handlers

  refreshStore () {
    const {handleLocalAction, localActions, userID, navigator} = this.props
    handleLocalAction({type: localActions.REFRESH_STATE, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

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

  navigateToNextScreen () {
    const { localActions, handleLocalAction, isOnboardingFlow, isAddingDesire, isAddingDream, childID, navigator, userID, userSSN } = this.props
    const childSSN = formatUserSSN(this.state.child_ssn)

    if (validateSSN(childSSN)) {
      Alert.alert('enter valid child ssn')
      return
    }
    if (userSSN && childSSN && userSSN === childSSN) {
      Alert.alert('Error', 'Please enter correct SSN\'s')
    } else {
      this.setState({autoNavigate: false}, () => {
        handleLocalAction({
          type: localActions.ADD_CHILD_SSN,
          [COMMON_ENTITIES.NAVIGATOR]: navigator,
          [CHILD_ENTITIES.SSN]: childSSN,
          [USER_ENTITIES.SSN]: userSSN,
          [USER_ENTITIES.USER_ID]: userID,
          [CHILD_ENTITIES.CHILD_ID]: childID,
          [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: isOnboardingFlow,
          [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream,
          [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire
        })
      })
    }
  }

  skip () {
    const { localActions, handleLocalAction, navigator, userSSN, childID, firstName, lastName, DOB, emailID, userID, imageMetadata, token, isAddingDesire, isAddingDream } = this.props
    handleLocalAction({
      type: localActions.SKIP_CHILD_SSN,
      [USER_ENTITIES.USER_ID]: userID,
      [USER_ENTITIES.SSN]: userSSN,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [USER_ENTITIES.EMAIL_ID]: emailID,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  getMessage () {
    const { localActions, handleLocalAction, navigator, isOnboardingFlow, userSSN, emailID, userID, childID, childName, userName } = this.props
    let x = getUniqueCode(userID, childID, undefined, emailID)
    let uniqueCode = x['code']
    let uniqueUrl = x['url']

    let message = 'Hi, I\'m creating a Loved investing account for ' + childName + ', can you enter their SSN at the link so we can start investing for their future? ' + uniqueUrl
    return message
  }

  requestSSN () {
    const { localActions, handleLocalAction, navigator, isOnboardingFlow, userSSN, emailID, userID, childID, childName, userName } = this.props
    let x = getUniqueCode(userID, childID, undefined, emailID)
    let uniqueCode = x['code']
    let uniqueUrl = x['url']

    let message = 'Hi, I\'m creating a Loved investing account for ' + childName + ', can you enter their SSN at the link so we can start investing for their future? ' + uniqueUrl

    handleLocalAction({
      type: localActions.REQUEST_CHILD_SSN,
      [USER_ENTITIES.USER_ID]: userID,
      [USER_ENTITIES.SSN]: userSSN,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [USER_ENTITIES.EMAIL_ID]: emailID,
      [CHILD_ENTITIES.UNIQUE_CODE]: uniqueCode,
      [CHILD_ENTITIES.SSN_REQUEST_PHONE_NUMBER]: undefined,
      [CHILD_ENTITIES.UNIQUE_URL]: message,
      [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: isOnboardingFlow,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  addSSN (digit) {
    if (this.state.child_ssn && this.state.child_ssn.length > 8) return
    this.setState({ child_ssn: this.state.child_ssn + digit })
  }

  trimSSN () {
    let ssn = this.state.child_ssn.slice(0, -1)
    this.setState({ child_ssn: ssn })
  }

  autoNavigate () {
    const {handleLocalAction, localActions, navigator, isOnboardingFlow, childID} = this.props
    handleLocalAction({type: localActions.AUTO_NAVIGATE_ONBOARDING, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: isOnboardingFlow, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    const {childName} = this.props

    return (
      <View style={{...styles.screen.h2.containerStyle, alignItems: 'center', marginBottom: 12, marginTop: 40}}>
        <Text style={{ fontFamily: Fonts.type.bold, color: Colors.blue, fontSize: 22, lineHeight: 28, textAlign: 'center', marginBottom: 20 }}>
          {`What is ${childName}’s\nsocial security number?`}
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: Colors.darkBlue, fontSize: 18, lineHeight: 23, textAlign: 'center' }}>
          {'Loved encrypts and securely\ntransmits your information using SSL.\n'}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const {isUserSSNAdded, childName} = this.props
    const {child_ssn} = this.state
    const text = child_ssn ? formatUserSSN(child_ssn) : `${childName}'s social security number`
    if (!isUserSSNAdded) {
      return (
        <View style={{ ...styles.screen.textInput.parentContainerStyle, marginBottom: 0, marginHorizontal: 20, paddingLeft: 15, borderColor: Colors.fontGray, borderWidth: 1, borderRadius: 5, alignItems: 'center' }}>
          <Text style={{ ...styles.text.title, color: child_ssn ? Colors.blue : Colors.fontGray }}>
            {text}
          </Text>
        </View>
      )
    }
  }

  renderPadContainer () {
    return (
      <View style={{flex: 1, justifyContent: 'center', marginVertical: 15, marginHorizontal: 25}}>
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
        <TouchableOpacity disabled
          style={{...loginPinStyles.buttonPadStyle, height: diameter, width: diameter, borderRadius: (diameter / 2), backgroundColor: 'transparent', maxHeight: 70, maxWidth: 70, justifyContent: 'center', alignItems: 'center'}}>
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
        accessibilityLabel={'Backspace'}
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
      <View style={{marginBottom: 30}}>
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
            marginHorizontal: 42
          }}
          onPress={_.debounce(_.bind(() => this.navigateToNextScreen(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={{...styles.bottomNavigator.textStyle, color: Colors.darkBlue}}>Continue</Text>
        </TouchableHighlight>
        <Text style={{ ...styles.text.description, marginTop: 16, color: Colors.blue, fontSize: 18, lineHeight: 23, textAlign: 'center' }} onPress={() => this.toggleSSNLinkPopup(true)}>
          Send SSN Request Link
        </Text>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const { isProcessing, navigator, canPop, isSSNAdded, childName, isOnboardingFlow } = this.props
    const {autoNavigate} = this.state
    if (isOnboardingFlow && isSSNAdded && autoNavigate) {
      this.autoNavigate()
    }
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav leftFoo={this.onBack.bind(this)} gradientBackdrop popManually navigator={navigator} leftButtonPresent={canPop} titlePresent title='Verification' />
        <View style={{flex: 1}}>
          {this.renderHeading()}
          {this.renderFormContainer()}
          {this.renderPadContainer()}
        </View>
        {this.renderNextButton()}
        <SSNRequestLink childName={childName} getMessage={this.getMessage.bind(this)} showModal={this.state.showRequestPopup} toggleModal={this.toggleSSNLinkPopup.bind(this)} requestSSN={this.requestSSN.bind(this)} />
        <ProcessingIndicator isProcessing={isProcessing} />
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

ChildSSN.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // is add child processing
  isProcessing: PropTypes.bool.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  // user ssn
  userSSN: PropTypes.string,

  // is ssn added
  isSSNAdded: PropTypes.bool,

  // child ssn
  childSSN: PropTypes.string,

  // is ssn requested
  isSSNRequested: PropTypes.bool,

  // user name
  userName: PropTypes.string,

  // is onboarding flow or not
  isOnboardingFlow: PropTypes.bool.isRequired,

  // child's name
  childName: PropTypes.string,

  // is adding desire
  isAddingDesire: PropTypes.bool,
  // is adding dream
  isAddingDream: PropTypes.bool,
  // can pop
  canPop: PropTypes.bool
}

ChildSSN.defaultProps = {
  // is adding desire
  isAddingDesire: false,
  // is adding dream
  isAddingDream: false,
  // is child ssn added
  isSSNAdded: false,
  // can pop
  canPop: false,
  // is onboarding flow
  isOnboardingFlow: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(ChildSSN))

export default Screen
