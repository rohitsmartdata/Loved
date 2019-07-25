/* eslint-disable camelcase,no-trailing-spaces,no-unused-vars */
/**
 * Created by demon on 27/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  TouchableHighlight
} from 'react-native'
import { DEVICE_LOGICAL_RESOLUTION, COMMON_ENTITIES, FREQUENCY, getFrequencyShortTitle }
  from '../../Utility/Mapper/Common'
import {Icon, Slider}
  from 'react-native-elements'
import Modal
  from 'react-native-modal'
import {FORM_TYPES}
  from '../../Config/contants'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import Fonts
  from '../../Themes/Fonts'
import styles
  from '../../Themes/ApplicationStyles'
import HTML
  from 'react-native-render-html'
import CustomNav
  from '../../Containers/Common/CustomNav'
import _
  from 'lodash'
import {formatPrice, formatFloatPrice}
  from '../../Utility/Transforms/Converter'
import { connect }
  from 'react-redux'
import {reduxForm, Field}
  from 'redux-form'
import Colors
  from '../../Themes/Colors'
import * as Constants
  from '../../Themes/Constants'
import ButtonGroup
  from '../../CommonComponents/ButtonGroup'
import { CachedImage }
  from 'react-native-cached-image'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import { analytics }
  from '../../Config/AppConfig'
import {screens}
  from '../../Utility/Mapper/Tracking'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class LI_GoalConfirm extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  componentDidMount () {
    const {shouldUpdateOnboarding} = this.props
    shouldUpdateOnboarding && this.updateCurrentOnboarding()
  }

  // --------------------------------------------------------
  // Action handlers

  makeGoal () {
    const {handleLocalAction, localActions, navigator, payload, isPlaidLinked} = this.props
    handleLocalAction({
      type: localActions.MAKE_GOAL,
      [USER_ENTITIES.USER_ID]: payload[USER_ENTITIES.USER_ID],
      [CHILD_ENTITIES.CHILD_ID]: payload[CHILD_ENTITIES.CHILD_ID],
      [GOAL_ENTITIES.NAME]: payload[GOAL_ENTITIES.NAME],
      [GOAL_ENTITIES.PORTFOLIO_RISK]: payload[GOAL_ENTITIES.PORTFOLIO_RISK] || '02',
      [GOAL_ENTITIES.DURATION]: payload[GOAL_ENTITIES.DURATION],
      [GOAL_ENTITIES.GOAL_AMOUNT]: payload[GOAL_ENTITIES.GOAL_AMOUNT],
      [GOAL_ENTITIES.RECURRING_AMOUNT]: payload[GOAL_ENTITIES.RECURRING_AMOUNT],
      [GOAL_ENTITIES.RECURRING_FREQUENCY]: payload[GOAL_ENTITIES.RECURRING_FREQUENCY],
      [GOAL_ENTITIES.IS_PLAID_LINKED]: isPlaidLinked,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  makeInvestment () {
    const {handleLocalAction, localActions, navigator, payload, isPlaidLinked} = this.props
    handleLocalAction({
      type: localActions.MAKE_INVESTMENT,
      [USER_ENTITIES.USER_ID]: payload[USER_ENTITIES.USER_ID],
      [CHILD_ENTITIES.CHILD_ID]: payload[CHILD_ENTITIES.CHILD_ID],
      [INVESTMENT_ENTITIES.INVESTMENT_NAME]: payload[INVESTMENT_ENTITIES.INVESTMENT_NAME],
      [INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]: payload[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID],
      [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: payload[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT],
      [INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY]: payload[INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY],
      [USER_ENTITIES.IS_PLAID_LINKED]: isPlaidLinked,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderGoalInvestment () {
    const {payload, firstname, images} = this.props
    const investmentAmount = payload[GOAL_ENTITIES.RECURRING_AMOUNT]
    const investmentFrequency = payload[GOAL_ENTITIES.RECURRING_FREQUENCY]
    const frequency = investmentFrequency && getFrequencyShortTitle(investmentFrequency)
    const goalName = payload[GOAL_ENTITIES.NAME]
    const goalImage = (images && images[INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL])
    return (
      <View>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.bold, marginHorizontal: 20, fontSize: 22, color: '#1C3C70'}}>
          Can you confirm your {investmentAmount && formatPrice(investmentAmount)} {frequency} investment into {firstname}'s {goalName}?
        </Text>
        <View style={{alignItems: 'center'}}>
          {
            goalImage && <CachedImage source={{uri: goalImage}} style={{height: 125, width: 125, borderRadius: 60, marginTop: 10}} />
          }
        </View>
      </View>
    )
  }

  renderGoalDescription () {
    const {isInvestment, payload, firstname} = this.props
    const goalName = payload[GOAL_ENTITIES.NAME]
    const goalAmount = payload[GOAL_ENTITIES.GOAL_AMOUNT]
    const age = payload[GOAL_ENTITIES.DURATION]

    return (
      <View>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: '#1C3C70'}}>
          Your plan for {firstname}'s
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 26, color: '#1C3C70'}}>
          {goalName}
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: '#1C3C70'}}>
          To Reach
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 26, color: '#1C3C70'}}>
          {formatPrice(goalAmount)}
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: '#1C3C70'}}>
          For when {firstname} is
        </Text>
        <Text style={{marginTop: 12, textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 26, color: '#1C3C70'}}>
          {age} years old
        </Text>
      </View>
    )
  }

  renderBody () {
    return (
      <View style={{flex: 8, justifyContent: 'space-around'}}>
        {this.renderGoalDescription()}
        {this.renderGoalInvestment()}
      </View>
    )
  }

  renderNextButton () {
    const isX = this.isX || false
    const {isInvestment, isProcessing} = this.props
    return (
      <View style={{flex: 2, justifyContent: 'center'}}>
        <TouchableOpacity
          disabled={isProcessing}
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{ 
            ...styles.bottomNavigator.containerStyle 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0} 
          }}
          onPress={_.debounce(_.bind(() => this.makeGoal(), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {payload, firstname, isProcessing} = this.props
    const goalName = payload[GOAL_ENTITIES.NAME]
    const title = firstname + '\'s ' + goalName
    const {navigator} = this.props
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <ProcessingIndicator isProcessing={isProcessing} />
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent titlePresent title={title} />
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {this.renderBody()}
          {this.renderNextButton()}
        </View>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

LI_GoalConfirm.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // is investment
  isInvestment: PropTypes.bool.isRequired,

  // payload
  payload: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // is plaid linked
  isPlaidLinked: PropTypes.bool.isRequired,

  // first name
  firstname: PropTypes.string.isRequired,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // images
  images: PropTypes.object
}

// ========================================================
// Export
// ========================================================

export default LI_GoalConfirm
