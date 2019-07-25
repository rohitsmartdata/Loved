/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 26/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, StatusBar, NativeModules, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, TouchableOpacity, Image, ActivityIndicator, ImageBackground, TouchableHighlight }
  from 'react-native'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import GravityCapsule
  from '../Utility/GravityCapsule'
import _
  from 'lodash'
import CustomNav
  from '../../Containers/Common/CustomNav'
import Colors from '../../Themes/Colors'
var PlaidBridgeModule = NativeModules.PlaidBridgeModule
import { analytics } from '../../Config/AppConfig'
import {screens, events} from '../../Utility/Mapper/Tracking'
import { SPROUT } from '../../Utility/Mapper/Screens'
import { INVESTMENT_ENTITIES } from '../../Utility/Mapper/Investment'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class InvestReady extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _showPlaid: !props.isPlaidLinked
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentDidMount () {
    const {userID} = this.props
    this.updateCurrentOnboarding()
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.CONNECT_BANK
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  plaidConnectSuccess (accountID, publicToken) {
    const {handleLocalAction, localActions, userID, emailID, childID, goalID, recurringAmount, goalName, navigator} = this.props
    handleLocalAction({type: localActions.CONNECT_BANK,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [USER_ENTITIES.PLAID_PUBLIC_TOKEN]: publicToken,
      [USER_ENTITIES.PLAID_ACCOUNT_ID]: accountID,
      [GOAL_ENTITIES.NAME]: goalName,
      [USER_ENTITIES.EMAIL_ID]: emailID,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  confirm () {
    const {handleLocalAction, localActions, navigator, emailID, recurringAmount, childID, goalID, goalName, userID} = this.props
    handleLocalAction({type: localActions.CONFIRM,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.NAME]: goalName,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [USER_ENTITIES.EMAIL_ID]: emailID,
      [USER_ENTITIES.USER_ID]: userID})
  }

  skip () {
    const {handleLocalAction, localActions, navigator, userID, childID, goalID} = this.props
    handleLocalAction({type: localActions.SKIP, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID, childID, goalID, goalName, recurringAmount, isInvestment} = this.props
    let navigationProps = {
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.NAME]: goalName,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount,
      [INVESTMENT_ENTITIES.IS_INVESTMENT]: isInvestment
    }
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID, [COMMON_ENTITIES.PROPS]: navigationProps})
  }

  addMicroDeposit () {
    const {handleLocalAction, localActions, userID, navigator} = this.props
    handleLocalAction({type: localActions.SELECT_ACCOUNT_TYPE,
      [USER_ENTITIES.USER_ID]: userID,
      [COMMON_ENTITIES.SCREEN_TYPE]: SPROUT.SELECT_ACCOUNT_TYPE,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
    this.setState({
      _showPlaid: false
    })
  }

  // --------------------------------------------------------
  // Child Components

  // Show Plaid View with custom configurration. This can be used without initializing the plaid api
  _showPlaidView () {
    const {userID} = this.props
    PlaidBridgeModule.showPlaidViewController((error, token, metadata) => {
      const requestID = metadata.require_id
      const status = metadata.status

      if (error) {
        // *********** Log Analytics ***********
        analytics.track({
          userId: userID,
          event: events.BANK_SETUP_ERROR
        })
        // *********** Log Analytics ***********
      } else if (token) {
        let metadataObject = JSON.parse(metadata)
        this.plaidConnectSuccess(metadataObject.account_id, token)
      } else if (status && status === 'institution_not_found') {
        this.addMicroDeposit()
      }
    })

    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.PLAID_INITIATED
    })
    // *********** Log Analytics ***********
  }

  renderTextComponent () {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', paddingLeft: 45, paddingRight: 45, marginTop: 20}}>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 20, color: '#9B9B9B', textAlign: 'center', backgroundColor: 'transparent'}}>
          Sign in to your bank account to start your investment plan
        </Text>
      </View>
    )
  }

  renderHeading () {
    return (
      <View style={{paddingLeft: 30, paddingRight: 30}}>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 30, color: '#006B58', backgroundColor: 'transparent'}}>
          You’ll be ready to invest once we’ve connected your bank
        </Text>
      </View>
    )
  }

  renderHeader () {
    const {height, width} = Dimensions.get('window')
    const backdropHeight = height / 2.1
    return (
      <View style={{flex: 6, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center'}}>
        <Image source={require('../../../Img/intermediateScreen/Bank.png')} />
        <Text style={{
          textAlign: 'center',
          lineHeight: 40,
          marginTop: 70,
          fontFamily: Fonts.type.medium,
          fontSize: 26,
          backgroundColor: 'transparent',
          color: '#FFF'
        }}>
          Investing’s better with your bank linked!
        </Text>
      </View>
    )
  }

  renderBottomComponent () {
    return (
      <View>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{backgroundColor: 'rgb(255, 208, 23)', marginHorizontal: 16, height: 50, justifyContent: 'center', alignItems: 'center'}} onPress={_.debounce(_.bind(() => this._showPlaidView(), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={[styles.bottomNavigator.textStyle, { color: '#000' }]}>
            Continue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Skip and do it later'}
          accessibilityRole={'button'}
          onPress={_.debounce(_.bind(() => this.skip(), this), 500, {'leading': true, 'trailing': false})} style={styles.simpleBottomNavigator.containerStyle}>
          <Text style={[styles.simpleBottomNavigator.textStyle, { color: '#FFF' }]}>
            Skip and do it later
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderTopComponent () {
    const isX = this.isX || false
    const { width } = Dimensions.get('window')

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 0.75, justifyContent: 'space-between'}}>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Show action sheet'}
            accessibilityRole={'button'}
            onPress={() => this.showActionSheet()}
            style={{marginTop: isX ? 50 : 30, marginHorizontal: 16}} />
          <View style={{width: width * 0.3, height: width * 0.3, alignSelf: 'center'}}>
            <Image source={require('../../../Img/intermediateScreen/Bank.png')} style={{height: null, width: null, flex: 1}} resizeMode={'contain'} />
          </View>
          <Text style={{textAlign: 'center', lineHeight: 40, fontSize: 37, fontFamily: Fonts.type.nanumPen, backgroundColor: 'transparent', color: '#FFF'}}>
            Investing’s better with {'\n'} your bank linked!
          </Text>
          <View style={{paddingHorizontal: 20}}>
            <Text style={{fontFamily: Fonts.type.medium, textAlign: 'center', fontSize: 16, lineHeight: 25, color: '#FFF', backgroundColor: 'transparent'}}>
              All transmitted data is encrypted utilizing SSL for your security.
            </Text>
          </View>
        </View>
      </View>
    )
  }

  renderBody () {
    return (
      <View style={{flex: 8, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ fontFamily: Fonts.type.bold, marginTop: 32, textAlign: 'center', color: Colors.white, fontSize: 22 }}>
          Connect your Bank{'\n'}
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, marginBottom: 60, textAlign: 'center', color: Colors.white, fontSize: 18 }}>
          Your investments are only made{'\n'}once you have connected your bank.
        </Text>
        <Image source={require('../../../Img/assets/dashboard/plaid/plaid.png')} />
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    return (
      <View style={{flex: 2, justifyContent: 'center'}}>
        <Text style={{ bottom: 20, fontFamily: Fonts.type.book, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 15 }}>
          Loved is powered by Third Party Trade LLC, Member of {'\n'}SIPC. Securities in your account protected to $500k. {'\n'}For details please see <Text style={{color: Colors.white}}>www.sipc.org</Text>.
        </Text>
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
            marginHorizontal: 22
          }}
          onPress={_.debounce(_.bind(() => this._showPlaidView(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={[styles.bottomNavigator.textStyle, {color: Colors.darkBlue}]}>Continue</Text>
        </TouchableHighlight>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core Render Component

  render () {
    const {isProcessing} = this.props
    return (
      <ImageBackground style={{flex: 1, backgroundColor: '#FFF', paddingHorizontal: 20}} source={require('../../../Img/appBackground.png')}>
        <StatusBar barStyle='light-content' />
        {this.renderBody()}
        {this.renderNextButton()}
      </ImageBackground>
    )
  }

}

InvestReady.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // child id
  childID: PropTypes.string.isRequired,
  // goal id
  goalID: PropTypes.string.isRequired,
  // email id
  emailID: PropTypes.string.isRequired,
  // goal name
  goalName: PropTypes.string.isRequired,
  // isInvestment
  isInvestment: PropTypes.bool,
  // user id
  userID: PropTypes.string.isRequired,
  // recurring amount
  recurringAmount: PropTypes.number.isRequired
}

// ========================================================
// Export
// ========================================================

export default InvestReady
