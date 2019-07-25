/* eslint-disable no-unused-vars,no-trailing-spaces,padded-blocks,object-property-newline */
/**
 * Created by viktor on 13/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, KeyboardAvoidingView, Keyboard, ScrollView, Image, ImageBackground, ActivityIndicator, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import { Icon, Button }
  from 'react-native-elements'
import styles
  from './Styles/LoginPinStyle'
import globalStyle
  from '../../Themes/ApplicationStyles'
import {AUTH_ENTITIES, PIN_ACTION_TYPE, PIN_COMPONENT_TYPE}
  from '../../Utility/Mapper/Auth'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import Fonts
  from '../../Themes/Fonts'
import TouchID
  from 'react-native-touch-id'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import CodePush
  from 'react-native-code-push'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import {CURRENT_ENVIRONMENT, analytics}
  from '../../Config/AppConfig'
import {ENVIRONMENT}
  from '../../Config/contants'
import {convertDateStringToRequestFormat}
  from '../../Utility/Transforms/Converter'
import {SPROUT}
  from '../../Utility/Mapper/Screens'
import CustomNav
  from '../../Containers/Common/CustomNav'
import * as Animatable
  from 'react-native-animatable'
import {Navigation}
  from 'react-native-navigation'
import ShadowedContainer from '../../CommonComponents/ShadowedContainer'
import Colors from '../../Themes/Colors'
import {events, errorKeywords} from '../../Utility/Mapper/Tracking'
import LottieLoader from 'react-native-lottie-loader'

// ========================================================
// Core Component
// ========================================================

class LoginPin extends Component {

  constructor (props) {
    super(props)
    this.state = {
      userID: props.userID,
      PIN: '',
      FIRST_PIN: this.props[AUTH_ENTITIES.PIN_COMPONENT_TYPE] === PIN_COMPONENT_TYPE.VERIFY ? this.props.firstPIN : '',
      PIN_COMPONENT_TYPE: this.props[AUTH_ENTITIES.PIN_COMPONENT_TYPE],
      PIN_ERROR: '',
      showAlert: props.isTouchID,
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
  }

  componentDidMount () {
    if (CURRENT_ENVIRONMENT === ENVIRONMENT.DEV_1 || CURRENT_ENVIRONMENT === ENVIRONMENT.PROD || CURRENT_ENVIRONMENT === ENVIRONMENT.UAT_2) {
      CodePush.sync({updateDialog: true, installMode: CodePush.InstallMode.IMMEDIATE})
    }
    // todo: don't prompt during registration
    const {pinActionType, userID, goToHomepage} = this.props
    if (pinActionType === PIN_ACTION_TYPE.LOGIN) {
      this.authenticateTouchID()
    }
    if (pinActionType === PIN_ACTION_TYPE.ON_BOARDING) {
      this.setState({showAlert: false})
      !goToHomepage && this.updateCurrentOnboarding()
    }
    if (pinActionType === PIN_ACTION_TYPE.RESET_PASSWORD) {
      this.setState({showAlert: false})
    }
  }

  // --------------------------------------------------------
  // component action handlers

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

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  // change component type
  toggleComponentType (newType) {
    this.setState({
      PIN_COMPONENT_TYPE: newType
    })
  }

  // called when 4 digits have
  // been entered
  submitPIN (PIN) {
    // proceed if pin length is 4
    if (PIN && PIN.length === 4) {
      switch (this.state.PIN_COMPONENT_TYPE) {

        case PIN_COMPONENT_TYPE.VERIFY : {
          let result = this.verifyPIN(PIN)

          if (result) {
            if (this.props[AUTH_ENTITIES.PIN_ACTION_TYPE] === PIN_ACTION_TYPE.LOGIN) {
              setTimeout(() => {
                if (result) {
                  this.loginSuccess()
                }
              }, 100)
            } else {
              setTimeout(() => {
                // set first pin as the entered pin
                this.setFirstPin('')
                // empty pin
                this.evaporatePIN()
                // change state to CONFIRM
                this.toggleComponentType(PIN_COMPONENT_TYPE.CREATE)
              }, 100)
            }
          } else {
            this.setState({
              PIN_ERROR: 'Please enter correct passcode'
            })
          }
          this.evaporatePIN()
        }
          break

        case PIN_COMPONENT_TYPE.CREATE: {
          setTimeout(() => {
            // set first pin as the entered pin
            this.setFirstPin(PIN)
            // empty pin
            this.evaporatePIN()
            // change state to CONFIRM
            this.toggleComponentType(PIN_COMPONENT_TYPE.CONFIRM)
          }, 100)
        }
          break

        case PIN_COMPONENT_TYPE.CONFIRM: {
          let result = this.verifyPIN(PIN)
          setTimeout(() => {
            if (result) {
              this.registerPIN(PIN)
            } else {
              this.setState({
                PIN_ERROR: `PIN doesn't match. Start again`
              })
              this.toggleComponentType(PIN_COMPONENT_TYPE.CREATE)
            }
            this.evaporatePIN()
          }, 100)
        }
          break
      }
    }
  }

  // register PIN
  registerPIN (PIN) {
    const {handleLocalAction, localActions, navigator, username, goToHomepage} = this.props
    handleLocalAction({type: localActions.REGISTER_PIN, [AUTH_ENTITIES.PIN]: PIN, [USER_ENTITIES.EMAIL_ID]: username, [AUTH_ENTITIES.PIN_ACTION_TYPE]: this.props[AUTH_ENTITIES.PIN_ACTION_TYPE], [COMMON_ENTITIES.NAVIGATOR]: navigator, [AUTH_ENTITIES.GO_TO_HOMEPAGE]: goToHomepage})
  }

  // login success
  loginSuccess () {
    if (this.props[AUTH_ENTITIES.IS_PASSCODE_MODAL]) {
      Navigation.dismissAllModals()
      const {handleLocalAction, localActions, navigator, userID} = this.props
      handleLocalAction({type: localActions.FETCH_USER, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    } else {
      const {handleLocalAction, localActions, navigator, username} = this.props
      handleLocalAction({type: localActions.LOGIN_SUCCESS, [USER_ENTITIES.EMAIL_ID]: username, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    }
  }

  // --------------------------------------------------------
  // PIN utility actions

  // set firstPin
  setFirstPin (newPin) {
    const {userID, pinActionType} = this.props
    this.setState({FIRST_PIN: newPin})

    if ((!pinActionType !== PIN_ACTION_TYPE.LOGIN) && userID) {
      // *********** Log Analytics ***********
      analytics.track({
        userId: userID,
        event: events.SIGNUP_PIN,
        properties: {
        }
      })
      // *********** Log Analytics ***********
    }
  }

  // evaporte the login PIN
  evaporatePIN () {
    this.setState({PIN: ''})
  }

  addPIN (digit) {
    let PIN = this.state.PIN
    this.setState({PIN_ERROR: ''})
    if (PIN.length < 4) {
      let newPin = this.state.PIN.concat(digit)
      this.setState(prevState => { return {PIN: newPin} })
      if (newPin.length === 4) {
        this.submitPIN(newPin)
      }
    }
  }

  trimPIN = () => {
    this.setState(prevState => { return {PIN: prevState.PIN.substring(0, prevState.PIN.length - 1)} })
  }

  /*
    verifies state.FIRST_PIN with given PIN
   */
  verifyPIN (PIN) {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.SIGNUP_RE_ENTER_PIN
    })
    // *********** Log Analytics ***********
    if (this.state.FIRST_PIN === PIN) {
      return true
    }
    return false
  }

  authenticate () {
    const optionalConfigObject = {
      title: 'Touch ID or Enter Passcode', // Android
      fallbackLabel: 'Enter Passcode' // iOS (if empty, then label is hidden)
    }

    return TouchID.authenticate('Use TouchID or cancel for Passcode', optionalConfigObject)
      .then(success => {
        this.setState({showAlert: true})
        this.loginSuccess()
      })
      .catch(error => {
        this.setState({showAlert: false})
        console.warn(' [error :: ] -> ', error)
      })
  }

  handleLogout () {
    if (this.props[AUTH_ENTITIES.IS_PASSCODE_MODAL]) {
      this.props.navigator.handleDeepLink({
        link: SPROUT.AUTH_SELECTOR_SCREEN,
        payload: 'RESET'
      })
    } else {
      const {userID} = this.state
      const {handleLocalAction, localActions, navigator} = this.props
      userID && (
        analytics.track({
          userId: userID,
          event: events.LOGOUT,
          properties: {
            screen: 'passcode'
          }
        })
      )
      handleLocalAction({type: localActions.LOGOUT, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    }
  }

  authenticateTouchID () {
    TouchID.isSupported()
      .then(() => {
        this.authenticate()
      })
      .catch(error => {
        Alert.alert('TouchID not supported, ', error.message, [
          {text: 'OK', onPress: () => {
            try {
              this.refs.alertBackground.fadeOut(500).then(() => this.setState({showAlert: false}))
            } catch (e) {
              this.setState({showAlert: false})
            }
          }}
        ])
        this.setState({showAlert: true})
      })
  }

  hideError () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.HIDE_ERROR})
  }

  // --------------------------------------------------------
  // render child views

  renderButton (title) {
    const containerSize = 70
    return (
      <TouchableHighlight onHideUnderlay={() => this.resetShadow(title)} onShowUnderlay={() => this.pressShadow(title)} underlayColor='rgba(78, 194, 209, 0.37)' onPress={() => this.addPIN(title)}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: Fonts.type.book, color: 'white', fontSize: 38}}>
          {title}
        </Text>
      </TouchableHighlight>
    )
  }

  renderTouchIcon () {
    const {isTouchID, pinActionType} = this.props
    if (pinActionType === PIN_ACTION_TYPE.LOGIN) {
      return (
        <TouchableOpacity
          accessible
          accessibilityLabel={'Authenticate touch ID'}
          accessibilityRole={'button'}
          style={{
            ...styles.buttonPadStyle,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={this.authenticateTouchID} >
          <Image source={require('../../../Img/login/face_id/face_id.png')} style={{height: 38, width: 38}} />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{...styles.buttonPadStyle, flex: 1, justifyContent: 'center', alignItems: 'center'}} />
      )
    }
  }

  renderBackButton () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Backspace'}
        accessibilityRole={'button'}
        style={{...styles.buttonPadStyle, flex: 1, justifyContent: 'center', alignItems: 'center'}}
        onPress={this.trimPIN}
        underlayColor={Colors.selectedPinButton}>
        <Icon name='md-backspace' type='ionicon' size={38} color={Colors.white} />
      </TouchableOpacity>
    )
  }

  renderDot () {
    let length = this.state.PIN.length
    let errorLength = this.state.PIN_ERROR.length
    const selected = {
      color: Colors.buttonYellow,
      opacity: 1,
      size: 30
    }
    const normal = {
      color: Colors.appColor,
      opacity: 0.37,
      size: 30
    }
    let c = {
      1: errorLength || length >= 1 ? selected : normal,
      2: errorLength || length >= 2 ? selected : normal,
      3: errorLength || length >= 3 ? selected : normal,
      4: errorLength || length >= 4 ? selected : normal
    }
    let errorStyle = {}
    if (errorLength) {
      errorStyle = {
        borderColor: 'white',
        borderWidth: 2
      }
    }
    return (
      <View style={{top: 15}}>
        <View style={{...globalStyle.screen.containers.centeringContainer, flexDirection: 'row'}}>
          <View style={{...styles.dot, ...errorStyle, backgroundColor: c[1].color, opacity: c[1].opacity, width: c[1].size, height: c[1].size}} />
          <View style={{...styles.dot, ...errorStyle, backgroundColor: c[2].color, opacity: c[2].opacity, width: c[2].size, height: c[2].size}} />
          <View style={{...styles.dot, ...errorStyle, backgroundColor: c[3].color, opacity: c[3].opacity, width: c[3].size, height: c[3].size}} />
          <View style={{...styles.dot, ...errorStyle, backgroundColor: c[4].color, opacity: c[4].opacity, width: c[4].size, height: c[4].size}} />
        </View>
        {
          errorLength > 0 &&
          <View style={{...globalStyle.screen.containers.centeringContainer, flexDirection: 'row', marginTop: 10}}>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 12, justifyContent: 'center', color: 'white', backgroundColor: 'transparent'}}>
              {this.state.PIN_ERROR}
            </Text>
          </View>
        }
      </View>
    )
  }

  renderPadContainer () {
    return (
      <View style={{flex: 1, justifyContent: 'space-around'}}>
        <View style={{...styles.horizontalPadContainer}}>
          {this.renderButton(1)}
          {this.renderButton(2)}
          {this.renderButton(3)}
        </View>
        <View style={styles.horizontalPadContainer}>
          {this.renderButton(4)}
          {this.renderButton(5)}
          {this.renderButton(6)}
        </View>
        <View style={styles.horizontalPadContainer}>
          {this.renderButton(7)}
          {this.renderButton(8)}
          {this.renderButton(9)}
        </View>
        <View style={styles.horizontalPadContainer}>
          {this.renderTouchIcon()}
          {this.renderButton(0)}
          {this.renderBackButton()}
        </View>
      </View>
    )
  }

  renderHeading () {
    const {titles} = this.props
    const {PIN_COMPONENT_TYPE} = this.state
    const heading = titles[PIN_COMPONENT_TYPE]
    return (
      <Text style={{...globalStyle.text.mainHeader, fontFamily: Fonts.type.bold, color: '#FFF', fontSize: 22, marginBottom: 58}}>
        {heading}
      </Text>
    )
  }

  renderIcon () {
    const actionType = this.props[AUTH_ENTITIES.PIN_ACTION_TYPE]
    const isLogin = actionType && actionType === PIN_ACTION_TYPE.LOGIN
    return (
      <View style={{...globalStyle.screen.containers.centeringContainer, position: 'absolute', top: 40, right: 20, left: 0}}>
        {isLogin &&
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Log Out'}
          accessibilityRole={'button'}
          style={{width: 70, height: 40, justifyContent: 'center', alignItems: 'center', top: 0, right: 0, bottom: 0, position: 'absolute'}} onPress={() => this.handleLogout()}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 15, color: '#FFF', backgroundColor: 'transparent'}}>
            Logout
          </Text>
        </TouchableOpacity>
        }
      </View>
    )
  }

  // --------------------------------------------------------
  // render core views

  render () {
    let value = convertDateStringToRequestFormat('Mon Dec 31 2001 00:00:00 GMT+0000 (UTC)')
    const {isLogout, isLogoutHappening, processing, errorObj, popButton, navigator, goToHomepage, pinActionType, navigationPresent} = this.props
    const isPasscodeModel = this.props[AUTH_ENTITIES.IS_PASSCODE_MODAL]
    if (errorObj) {
      Alert.alert('Try Again',
        errorObj.message,
        [
          {text: 'OK', onPress: this.hideError}
        ],
        { cancelable: false }
      )
    }
    return (

      <View style={{...globalStyle.screen.containers.root}}>
        <ProcessingIndicator yellowBackground isProcessing={processing || isLogoutHappening} />
        <View style={{...globalStyle.screen.containers.root, backgroundColor: '#2948FF', paddingTop: popButton ? 0 : this.props[AUTH_ENTITIES.PIN_ACTION_TYPE] === PIN_ACTION_TYPE.LOGIN ? 50 : 32}}>
          <View style={{flex: 0.35, justifyContent: 'center'}}>
            {this.renderHeading()}
            {this.renderDot()}
          </View>
          <View style={{flex: 0.65, marginBottom: 50, paddingHorizontal: 20}}>
            {this.renderPadContainer()}
          </View>
          {this.renderIcon()}
        </View>
        {
          ((pinActionType === PIN_ACTION_TYPE.ON_BOARDING) && navigationPresent) &&
          <View style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
            <CustomNav navigator={navigator} leftButtonPresent titlePresent title={'Sign Up'} blueBackdrop titleStyle={{color: Colors.white}} />
          </View>
        }
        {
          this.state.showAlert &&
          <Animatable.View style={{backgroundColor: '#2C78F9', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}} useNativeDriver ref={'alertBackground'} >
            <View style={{backgroundColor: 'rgba(44, 120, 249, 0.4)', flex: 1}} />
          </Animatable.View>
        }
      </View>
    )
  }
}

LoginPin.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-native-navigation
  navigator: PropTypes.object.isRequired,

  errorObj: PropTypes.object,

  // type of PIN activity needed :-
  // VERIFY, CREATE, CONFIRM
  [AUTH_ENTITIES.PIN_COMPONENT_TYPE]: PropTypes.string.isRequired,

  // if pin activity = VERIFY, then
  // mention it's type
  [AUTH_ENTITIES.PIN_ACTION_TYPE]: PropTypes.string.isRequired,

  // if app is coming from background, then
  // it's type modal will be true.
  [AUTH_ENTITIES.IS_PASSCODE_MODAL]: PropTypes.bool,

  // shall navigate to homepage or not
  goToHomepage: PropTypes.bool.isRequired,

  // object having title as per pin
  // component type
  title: PropTypes.string,

  titles: PropTypes.object.isRequired,

  username: PropTypes.string.isRequired,

  firstPIN: PropTypes.string,

  isLogout: PropTypes.bool.isRequired,

  isTouchID: PropTypes.bool.isRequired,

  userID: PropTypes.string.isRequired,

  emailID: PropTypes.string.isRequired,

  processing: PropTypes.bool.isRequired,

  isLogoutHappening: PropTypes.bool.isRequired,

  popButton: PropTypes.bool

}

LoginPin.defaultProps = {
  [AUTH_ENTITIES.PIN_COMPONENT_TYPE]: PIN_COMPONENT_TYPE.VERIFY,
  [AUTH_ENTITIES.PIN_ACTION_TYPE]: PIN_ACTION_TYPE.LOGIN,
  goToHomepage: false,
  titles: {
    [PIN_COMPONENT_TYPE.VERIFY]: 'Enter existing PIN',
    [PIN_COMPONENT_TYPE.CREATE]: 'Enter PIN',
    [PIN_COMPONENT_TYPE.CONFIRM]: 'Re-enter new PIN'
  },
  firstPIN: undefined,
  isLogout: true,
  isTouchID: true,
  processing: false,
  isLogoutHappening: false,
  popButton: false
}

// ========================================================
// Export
// ========================================================

export default LoginPin
