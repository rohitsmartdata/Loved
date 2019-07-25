/* eslint-disable no-trailing-spaces,spaced-comment,no-unused-vars,camelcase */
/**
 * Created by demon on 24/8/18.
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
  Alert,
  ActivityIndicator,
  TouchableHighlight,
  TextInput,
  Dimensions,
  TouchableOpacity, AppState
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
var Buffer = require('buffer/').Buffer
import Modal
  from 'react-native-modal'
import * as Constants from '../../Themes/Constants'
import { SSNRequestLink } from '../../CommonComponents/SSNRequestLink'
import moment from 'moment'
let lastActiveAt = moment()
let resumeDuration = 5

// ========================================================
// Utility
// ========================================================

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

class SSNPopup extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _ssnError: false,
      _userSSNError: false,
      child_ssn: '',
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
      appState: AppState.currentState
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentDidMount () {
    const {userID} = this.props
    AppState.addEventListener('change', this._handleAppStateChange)
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.ENTER_CHILD_SSN
    })
    // *********** Log Analytics ***********
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      var seconds = moment().diff(lastActiveAt, 'seconds')
      if (seconds > resumeDuration) {
        this.hideModel()
      }
    } else if (nextAppState.match(/inactive|background/)) {
      lastActiveAt = moment()
    }

    this.setState({appState: nextAppState})
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

  hideModel () {
    const {hideModal} = this.props
    hideModal && hideModal(false, undefined)
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

  requestSSN () {
    const { localActions, handleLocalAction, navigator, emailID, userID, childID, childName } = this.props
    let x = getUniqueCode(userID, childID, undefined, emailID)
    let uniqueCode = x['code']
    let uniqueUrl = x['url']

    let message = 'Hi, I\'m creating a Loved investing account for ' + childName + ', can you enter her SSN at the link so we can start investing for her future? ' + uniqueUrl

    handleLocalAction({
      type: localActions.REQUEST_CHILD_SSN,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [USER_ENTITIES.EMAIL_ID]: emailID,
      [CHILD_ENTITIES.UNIQUE_CODE]: uniqueCode,
      [CHILD_ENTITIES.SSN_REQUEST_PHONE_NUMBER]: undefined,
      [CHILD_ENTITIES.UNIQUE_URL]: message,
      [COMMON_ENTITIES.NAVIGATOR]: undefined
    })
    this.toggleSSNLinkPopup(false)
  }

  addSSN (digit) {
    if (this.state.child_ssn && this.state.child_ssn.length > 8) return
    this.setState({ child_ssn: this.state.child_ssn + digit })
  }

  trimSSN () {
    let ssn = this.state.child_ssn.slice(0, -1)
    this.setState({ child_ssn: ssn })
  }

  toggleSSNLinkPopup (show) {
    this.setState({showRequestPopup: show})
  }

  confirm () {
    if (!this.state.child_ssn) {
      Alert.alert('Enter child SSN.')
      return
    } else if (validateSSN(this.state.child_ssn)) {
      Alert.alert('Enter valid child SSN.')
      return
    }
    const {handleLocalAction, localActions, userID, childID, pushFunc, isModal, navigator} = this.props
    const childSSN = formatUserSSN(this.state.child_ssn)

    handleLocalAction({
      type: localActions.SUBMIT_SSN,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [CHILD_ENTITIES.SSN]: childSSN,
      'pushFunc': pushFunc,
      isModal: isModal,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    const {childName} = this.props

    return (
      <View style={{...styles.screen.h2.containerStyle, alignItems: 'center', marginBottom: 12, marginTop: 15}}>
        <Text style={{ fontFamily: Fonts.type.bold, color: Colors.blue, fontSize: 22, lineHeight: 28, textAlign: 'center', marginBottom: 20 }}>
          {`What is ${childName}’s\nsocial security number?`}
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: Colors.darkBlue, fontSize: 18, lineHeight: 23, textAlign: 'center' }}>
          {'Loved encrypts and securely\ntransmits your information using SSL.'}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const {isUserSSNAdded} = this.props
    const {child_ssn} = this.state
    const text = child_ssn ? formatUserSSN(child_ssn) : 'Your social security number'
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
      <View style={{...styles.screen.containers.root, flex: 1, justifyContent: 'center', paddingTop: 17, paddingHorizontal: 40}}>
        <View style={{...loginPinStyles.horizontalPadContainer, flex: 1, maxHeight: 70, justifyContent: 'space-around'}}>
          {this.renderButton(1)}
          {this.renderButton(2)}
          {this.renderButton(3)}
        </View>
        <View style={{...loginPinStyles.horizontalPadContainer, flex: 1, maxHeight: 70, justifyContent: 'space-around'}}>
          {this.renderButton(4)}
          {this.renderButton(5)}
          {this.renderButton(6)}
        </View>
        <View style={{...loginPinStyles.horizontalPadContainer, flex: 1, maxHeight: 70, justifyContent: 'space-around'}}>
          {this.renderButton(7)}
          {this.renderButton(8)}
          {this.renderButton(9)}
        </View>
        <View style={{...loginPinStyles.horizontalPadContainer, flex: 1, maxHeight: 70, justifyContent: 'space-around'}}>
          {this.renderTouchIcon()}
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
      <View
        style={{
          maxHeight: containerSize,
          maxWidth: containerSize,
          width: diameter,
          height: diameter,
          justifyContent: 'center',
          alignItems: 'center'
          // borderRadius: diameter / 2,
          // backgroundColor: Colors.white,
          // shadowColor: Colors.black,
          // shadowOffset: { width: 0, height: 3 },
          // shadowOpacity: this.state.shadowOpacity[title]
        }}
      >
        <TouchableHighlight onHideUnderlay={() => this.resetShadow(title)} onShowUnderlay={() => this.pressShadow(title)} underlayColor='rgba(78, 194, 209, 0.37)' onPress={() => this.addSSN(title)} style={{height: diameter, width: diameter, borderRadius: (diameter / 2), backgroundColor: 'transparent', maxHeight: 70, maxWidth: 70, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{...styles.text.mainHeader, fontWeight: 'normal'}}>
            {title}
          </Text>
        </TouchableHighlight>
      </View>
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
      <View
        style={{
          maxHeight: containerSize,
          maxWidth: containerSize,
          width: diameter,
          height: diameter,
          justifyContent: 'center',
          alignItems: 'center'
          // borderRadius: diameter / 2,
          // backgroundColor: Colors.white,
          // shadowColor: Colors.black,
          // shadowOffset: { width: 0, height: 3 },
          // shadowOpacity: 0.16
        }}
      >
        <TouchableOpacity
          accessible
          accessibilityLabel={'Backspace'}
          accessibilityRole={'button'}
          style={{...loginPinStyles.buttonPadStyle, height: diameter, width: diameter, borderRadius: (diameter / 2), backgroundColor: 'transparent', maxHeight: 70, maxWidth: 70, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => this.trimSSN()}
          underlayColor={Colors.selectedPinButton}>
          <Icon name='md-backspace' type='ionicon' size={30} color={'#050D13'} />
        </TouchableOpacity>
      </View>
    )
  }

  getMessage () {
    const { localActions, handleLocalAction, navigator, isOnboardingFlow, userSSN, emailID, userID, childID, childName, userName } = this.props
    let x = getUniqueCode(userID, childID, undefined, emailID)
    let uniqueCode = x['code']
    let uniqueUrl = x['url']

    let message = 'Hi, I\'m creating a Loved investing account for ' + childName + ', can you enter their SSN at the link so we can start investing for their future? ' + uniqueUrl
    return message
  }

  renderNextButton () {
    const { handleSubmit, isProcessing } = this.props
    const isX = this.isX || false
    return (
      <View>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Confirm'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 20,
            marginTop: 10
          }}
          onPress={_.debounce(_.bind(() => this.confirm(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Confirm</Text>
        </TouchableHighlight>
        <Text style={{ ...styles.text.description, marginVertical: 16, color: Colors.blue, fontSize: 18, lineHeight: 23, textAlign: 'center' }} onPress={() => this.toggleSSNLinkPopup(true)}>
          Send SSN Request Link
        </Text>
      </View>
    )
  }

  renderModalView () {
    const { isProcessing, navigator, canPop, childName, isUserSSNAdded } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent={canPop} titlePresent title='Identity Verification' />
        {this.renderCloseButton()}
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

  renderSSNView () {
    const { isProcessing, navigator, childName, totalChildren, isUserSSNAdded } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
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

  renderCloseButton () {
    return (
      <View style={{position: 'absolute', top: 30, right: 20}}>
        <Icon name='close' size={32} onPress={() => this.hideModel()} />
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isVisible, ssnAdded, isFromModal} = this.props
    if (isFromModal) {
      return this.renderSSNView()
    }
    if (ssnAdded === 1) {
      this.hideModel()
    }
    return (
      <View style={{backgroundColor: '#808'}}>
        <Modal
          keyboardShouldPersistTaps='always'
          style={{justifyContent: 'flex-end', marginTop: 40, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          onBackdropPress={() => this.hideModel()}
          onSwipe={() => this.hideModel()}
          swipeDirection='down'
          hideModalContentWhileAnimating
          scrollOffsetMax={300} // content height - ScrollView height
          isVisible={isVisible}>
          {this.renderModalView()}
        </Modal>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

SSNPopup.propTypes = {
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

  // is visible
  isVisible: PropTypes.bool.isRequired,

  // hide the modal
  hideModal: PropTypes.func.isRequired,

  // is ssn requested
  isSSNRequested: PropTypes.bool,

  // is ssn added
  ssnAdded: PropTypes.bool,

  // is modal or not
  isModal: PropTypes.bool,

  // user name
  userName: PropTypes.string,

  // child's name
  childName: PropTypes.string
}

// ========================================================
// Export
// ========================================================

export default SSNPopup
