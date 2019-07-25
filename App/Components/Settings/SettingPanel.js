/* eslint-disable no-unused-vars,no-trailing-spaces,operator-linebreak */
/**
 * Created by viktor on 14/8/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Dimensions, TouchableOpacity, Image, ScrollView, Switch }
  from 'react-native'
import {ENVIRONMENT} from '../../Config/contants'
import { Icon }
  from 'react-native-elements'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import {SETTINGS_ENTITIES}
  from '../../Utility/Mapper/Settings'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import styles
  from './Styles/SettingPanelStyle'
import {CURRENT_VERSION, CURRENT_ENVIRONMENT}
  from '../../Config/AppConfig'
import Communications
  from 'react-native-communications'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import Fonts
  from '../../Themes/Fonts'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'

// ========================================================
// Left Header Button Component
// ========================================================

class SettingPanel extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  navigateDeep (screen) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.NAVIGATE_DEEP, [COMMON_ENTITIES.SCREEN_TYPE]: screen, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  logout () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.LOGOUT, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showDocuments () {
    const {handleLocalAction, localActions, idToken, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_DOCUMENTS, [AUTH_ENTITIES.ID_TOKEN]: idToken, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showConfirmations () {
    const {handleLocalAction, localActions, idToken, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_CONFIRMATIONS, [AUTH_ENTITIES.ID_TOKEN]: idToken, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  viewRegularTransfers () {
    const {handleLocalAction, localActions, navigator, userID} = this.props
    handleLocalAction({type: localActions.VIEW_TRANSFERS, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID})
  }

  showProfile () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_PROFILE, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  addNewChild () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ADD_NEW_CHILD, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showConfiguration () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_CONFIG, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  aboutUs () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ABOUT_US, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  navigateToDebugWindow () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.NAVIGATE_TO_DEBUG_WINDOW, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  faq () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.FAQ, [SETTINGS_ENTITIES.URL]: 'http://www.help.loved.com', [SETTINGS_ENTITIES.HEADING]: 'FAQs', [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  transferNow () {
    const {handleLocalAction, localActions, navigator, idToken} = this.props
    handleLocalAction({type: localActions.TRANSFER_NOW, [COMMON_ENTITIES.NAVIGATOR]: navigator, [AUTH_ENTITIES.ID_TOKEN]: idToken})
  }

  showRegularTransfers () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_REGULAR_TRANSFERS, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  brokerDealerInfo () {
    const {handleLocalAction, localActions, navigator, idToken} = this.props
    handleLocalAction({type: localActions.BROKER_DEALER_INFO, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  navigateToConnectBank () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.CONNECT_BANK, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  changeDebugMode (value) {
    const {handleLocalAction, localActions, userID} = this.props
    if (value) {
      handleLocalAction({type: localActions.SWITCH_OFF_DEBUG_MODE})
    } else {
      handleLocalAction({type: localActions.SWITCH_ON_DEBUG_MODE, [USER_ENTITIES.USER_ID]: userID})
    }
  }

  // ------------------------------------------------------------
  // child render methods

  renderTouchArea (title, showArrow, foo) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        accessibilityRole={'button'}
        onPress={foo}>
        <View style={styles.horizontalButton}>
          <View style={styles.horizontalButtonTextContainer}>
            <Text style={styles.horizontalButtonTextStyle}>
              {title}
            </Text>
          </View>
          {
            showArrow &&
            <View style={styles.horizontalButtonIconContainer}>
              <Icon name='keyboard-arrow-right' color='#FFF' />
            </View>
          }
        </View>
      </TouchableOpacity>
    )
  }

  renderMiddleContainer () {
    const {firstName, lastName, userID, childAvailable, addChildPossible} = this.props
    const versionStr = 'Version ' + CURRENT_VERSION
    let userIDStr = 'USER ID : ' + userID
    const isProd = CURRENT_ENVIRONMENT === ENVIRONMENT.PROD
    return (
      <View style={{flex: 1, justifyContent: 'space-around'}}>
        {
          <View style={{paddingTop: 40, paddingHorizontal: 16, paddingBottom: 40}}>
            <Text style={{fontFamily: Fonts.type.semibold, fontSize: 20, paddingBottom: 15, color: '#000', backgroundColor: 'transparent'}}>
              {firstName} {lastName}
            </Text>

            <TouchableOpacity
              accessible
              accessibilityLabel={'Profile'}
              accessibilityRole={'button'}
              style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15}} onPress={() => this.showProfile()}>
              <Image tintColor='#fff' style={{marginRight: 20}} source={require('../../../Img/icons/userProfile.png')} />
              <Text style={{fontSize: 18, color: '#10427E', fontFamily: 'Lato-Regular', backgroundColor: 'transparent'}}>
                Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible
              accessibilityLabel={'Add a child'}
              accessibilityRole={'button'}
              style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15}} onPress={() => this.addNewChild()}>
              <Image tintColor='#fff' style={{marginRight: 20}} source={require('../../../Img/icons/addProfile.png')} />
              <Text style={{fontSize: 18, color: '#10427E', fontFamily: 'Lato-Regular', backgroundColor: 'transparent'}}>
                Add a child
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessible
              accessibilityLabel={'Bank Settings'}
              accessibilityRole={'button'}
              style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 15}} onPress={() => this.navigateToConnectBank()}>
              <Image tintColor='#fff' style={{marginRight: 20}} source={require('../../../Img/icons/bank.png')} />
              <Text style={{fontSize: 18, color: '#10427E', fontFamily: 'Lato-Regular', backgroundColor: 'transparent'}}>
                Bank Settings
              </Text>
            </TouchableOpacity>
          </View>
        }
        <View style={{backgroundColor: 'rgb(237, 237, 237)', marginVertical: 20}}>
          {this.renderLinkButton('Regular Transfers', () => this.showRegularTransfers(), true, true, !childAvailable)}
          {this.renderLinkButton('Recent Transactions', () => this.viewRegularTransfers(), true, true, !childAvailable)}
          {this.renderLinkButton('Trade Confirmations', () => this.showConfirmations(), true, true, !childAvailable)}
          {this.renderLinkButton('Tax Documents', () => this.showDocuments(), true, true, !childAvailable)}
        </View>
        <View style={{backgroundColor: 'rgb(237, 237, 237)', marginBottom: 20}}>
          {this.renderLinkButton('Contact us', () => Communications.email(['support@loved.com'], null, null, 'Your topic here...', 'Your concern here...'), true, true)}
          {this.renderLinkButton('FAQs', () => this.faq(), true, true)}
          {this.renderLinkButton('About Loved', () => this.aboutUs(), true, true)}
          {this.renderLinkButton('Logout', () => this.logout(), true, false)}
        </View>
        <View style={{backgroundColor: 'rgb(237, 237, 237)', marginBottom: 40}}>
          {!isProd && this.renderLinkButton('Third Party Trade data', () => this.brokerDealerInfo(), true, true, !childAvailable)}
          {!isProd && this.renderLinkButton('Debug Window', () => this.navigateToDebugWindow(), true, false)}
          {/* {!isProd && this.renderLinkButton('Process Instructions', () => this.transferNow(), true, false, !childAvailable)} */}
          {!isProd && this.renderLinkButton(userIDStr, () => console.log('version ::: ', CURRENT_VERSION), true, false)}
          {!isProd && this.renderSwitchButton()}
        </View>
      </View>
    )
  }

  renderSwitchButton () {
    const {debugMode, childAvailable} = this.props
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 75, paddingVertical: 15, paddingHorizontal: 40, borderBottomWidth: 0, borderColor: 'rgba(155, 155, 155, 0.3)'}}>
        <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16}}>
          DEBUG MODE
        </Text>
        <Switch disabled={!childAvailable} value={debugMode} onValueChange={() => this.changeDebugMode(debugMode)} />
      </View>
    )
  }

  renderLinkButton (title, foo, showBottomBorder, showArrow, disabled) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        onPress={() => foo()} disabled={disabled === undefined ? false : disabled} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 75, paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: showBottomBorder ? 1 : 0, borderColor: 'rgba(155, 155, 155, 0.3)'}}>
        <Text style={{color: '#10427E', opacity: disabled === undefined ? 1 : disabled ? 0.5 : 1, fontFamily: Fonts.type.regular, fontSize: 16}}>
          {title}
        </Text>
        {
          showArrow && <Image source={require('../../../Img/icons/forward.png')} />
        }
      </TouchableOpacity>
    )
  }

  render () {
    const {isFetchProcessing, navigator, isLogoutHappening} = this.props
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title='Your Account' />
        <ProcessingIndicator isProcessing={isFetchProcessing || isLogoutHappening} />
        <ScrollView style={{flex: 1}}>
          {this.renderMiddleContainer()}
        </ScrollView>
      </View>
    )
  }
}

SettingPanel.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // id token
  idToken: PropTypes.string.isRequired,
  // firstname of user
  firstName: PropTypes.string.isRequired,
  // lastname of user
  lastName: PropTypes.string.isRequired,
  // is fetch processing
  isFetchProcessing: PropTypes.bool.isRequired,
  // debug mode
  debugMode: PropTypes.bool.isRequired,
  // children available
  childAvailable: PropTypes.bool.isRequired,
  // can add child
  addChildPossible: PropTypes.bool.isRequired,
  // is logout processing
  isLogoutHappening: PropTypes.bool.isRequired
}

SettingPanel.defaultProps = {
  debugMode: false,
  childAvailable: false,
  addChildPossible: false,
  isLogoutHappening: false
}

export default SettingPanel
