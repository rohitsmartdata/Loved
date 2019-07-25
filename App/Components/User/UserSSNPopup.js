/* eslint-disable no-unused-vars,camelcase,no-trailing-spaces */
/**
 * Created by demon on 1/5/19.
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
  TouchableOpacity
} from 'react-native'
import CustomNav from '../../Containers/Common/CustomNav'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import { validateSSN } from '../../Utility/Transforms/Validator'
import _ from 'lodash'
import { analytics, CURRENT_ENVIRONMENT } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import loginPinStyles from '../Common/Styles/LoginPinStyle'
import { Icon } from 'react-native-elements'
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

// ========================================================
// Core Component
// ========================================================

class UserSSNPopup extends Component {

  constructor (props) {
    super(props)
    this.state = {
      user_ssn: '',
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
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  hideModel () {
    const {hideModal} = this.props
    hideModal && hideModal(false, undefined)
  }

  // --------------------------------------------------------
  // Action handlers

  addSSN (digit) {
    if (this.state.user_ssn && this.state.user_ssn.length > 8) return
    this.setState({ user_ssn: this.state.user_ssn + digit })
  }

  trimSSN () {
    let ssn = this.state.user_ssn.slice(0, -1)
    this.setState({ user_ssn: ssn })
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

  confirm () {
    if (!this.state.user_ssn) {
      Alert.alert('Enter your SSN.')
      return
    } else if (validateSSN(this.state.user_ssn)) {
      Alert.alert('Enter valid SSN.')
      return
    }
    const {handleLocalAction, localActions, userID, navigator} = this.props
    const userSSN = formatUserSSN(this.state.user_ssn)

    handleLocalAction({
      type: localActions.SUBMIT_SSN,
      [USER_ENTITIES.USER_ID]: userID,
      [USER_ENTITIES.SSN]: userSSN,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, alignItems: 'center', marginBottom: 12, marginTop: 15}}>
        <Text style={{ fontFamily: Fonts.type.bold, color: Colors.blue, fontSize: 22, lineHeight: 28, textAlign: 'center', marginBottom: 20 }}>
          {`What is your \nsocial security number?`}
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: Colors.darkBlue, fontSize: 18, lineHeight: 23, textAlign: 'center' }}>
          {'Loved encrypts and securely\ntransmits your information using SSL.'}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const {user_ssn} = this.state
    const text = formatUserSSN(user_ssn)
    return (
      <View style={{ ...styles.screen.textInput.parentContainerStyle, marginBottom: 0, marginHorizontal: 20, paddingLeft: 15, borderColor: Colors.fontGray, borderWidth: 1, borderRadius: 5, alignItems: 'center' }}>
        <Text style={{ ...styles.text.title, color: user_ssn ? Colors.blue : Colors.fontGray }}>
          {text}
        </Text>
      </View>
    )
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

  renderNextButton () {
    const { handleSubmit, isProcessing } = this.props
    const isX = this.isX || false
    return (
      <View style={{paddingBottom: 50}}>
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
      </View>
    )
  }

  renderModalView () {
    const {isProcessing, navigator, canPop} = this.props
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
    const {isVisible, ssnAdded} = this.props
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

UserSSNPopup.propTypes = {
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

  // is visible
  isVisible: PropTypes.bool.isRequired,

  // hide the modal
  hideModal: PropTypes.func.isRequired,

  // ssn added
  ssnAdded: PropTypes.number,

  // user name
  userName: PropTypes.string,

  // child's name
  childName: PropTypes.string
}

// ========================================================
// Export
// ========================================================

export default UserSSNPopup
