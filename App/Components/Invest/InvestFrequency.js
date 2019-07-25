/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 26/4/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, TextInput, FlatList, Modal, TouchableHighlight, TouchableOpacity, Image, Dimensions, ScrollView }
  from 'react-native'
import {reduxForm}
  from 'redux-form'
import CustomNav
  from '../../Containers/Common/CustomNav'
import globalStyle
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import { connect }
  from 'react-redux'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, FREQUENCY, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import GravityCapsule
  from '../Utility/GravityCapsule'
import _
  from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_INVESTMENT,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class InvestFrequency extends Component {

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    this.isNormaliPhone = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.DREAM_FREQUENCY
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handler

  next (f) {
    const {handleLocalAction, localActions, navigator, isChildSSNAdded, userID, childID, investmentPortfolioID, investmentAmount, investmentName, isPlaidLinked, product} = this.props
    let tempInvestmentName = investmentName || product.productName
    let tempInvestmentPortfolioID = investmentPortfolioID || product.productPortfolioID
    handleLocalAction({
      type: localActions.ADD_INVESTMENT,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [INVESTMENT_ENTITIES.INVESTMENT_NAME]: tempInvestmentName,
      [USER_ENTITIES.IS_PLAID_LINKED]: isPlaidLinked,
      [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: investmentAmount,
      [INVESTMENT_ENTITIES.INVESTMENT_FREQUENCY]: f,
      [INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]: tempInvestmentPortfolioID,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [CHILD_ENTITIES.IS_SSN_ADDED]: isChildSSNAdded
    })
  }

  skip () {
    const {handleLocalAction, localActions, userID, navigator, investmentName} = this.props
    handleLocalAction({type: localActions.SKIP, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.NAVIGATOR]: navigator, [INVESTMENT_ENTITIES.INVESTMENT_NAME]: investmentName})
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    const {investmentName} = this.props
    return (
      <View style={{marginTop: 32}}>
        <Text style={{fontFamily: Fonts.type.semibold, color: '#000', fontSize: 20}}>
          Please confirm your investment and when you want it to occur?
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, color: '#000', fontSize: 14, marginTop: 10}}>
          Funds will be transferred and invested once you have connected your bank account.
        </Text>
      </View>
    )
  }

  renderInvestmentAmount () {
    const {investmentAmount} = this.props
    return (
      <View style={{marginTop: 100}}>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.semibold, color: '#10427E', fontSize: 60, backgroundColor: 'transparent'}}>
          ${investmentAmount}
        </Text>
      </View>
    )
  }

  renderFrequencies () {
    const {processing, isAddRecurring} = this.props
    return (
      <View style={{height: (isAddRecurring) ? 150 : 200, justifyContent: 'space-around', marginTop: 50}}>
        {!isAddRecurring &&
          <TouchableOpacity
            accessible
            accessibilityLabel={'Set Frequency: Once'}
            accessibilityRole={'button'}
            disabled={processing} onPress={_.debounce(_.bind(() => this.next(FREQUENCY.ONCE), this), 500, {'leading': true, 'trailing': false})}>
            <Text style={{textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 24, color: '#10427E', backgroundColor: 'transparent'}}>
              Once
            </Text>
          </TouchableOpacity>
        }
        <TouchableOpacity
          accessible
          accessibilityLabel={'Set Frequency: 2 Wekly'}
          accessibilityRole={'button'}
          disabled={processing} onPress={_.debounce(_.bind(() => this.next(FREQUENCY.FORTNIGHT), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={{textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 24, color: '#10427E', backgroundColor: 'transparent'}}>
            2-Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Set Frequency: Monthly'}
          accessibilityRole={'button'}
          disabled={processing} onPress={_.debounce(_.bind(() => this.next(FREQUENCY.ONE_MONTH), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={{textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 24, color: '#10427E', backgroundColor: 'transparent'}}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderDecisionButton () {
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Cancel'}
          accessibilityRole={'button'}
          style={{backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginTop: 10}} onPress={_.debounce(_.bind(() => this.skip(), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 14, color: '#10427E'}}>Cancel</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Render Core Component

  render () {
    const {investmentName, navigator, processing} = this.props
    return (
      <View style={{...globalStyle.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title={investmentName} />
        <ProcessingIndicator isProcessing={processing} />
        <View style={{paddingHorizontal: 16}}>
          {this.renderHeading()}
          {this.renderInvestmentAmount()}
          {this.renderFrequencies()}
        </View>
        {this.renderDecisionButton()}
      </View>
    )
  }

}

InvestFrequency.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // user id
  userID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // processing
  processing: PropTypes.bool.isRequired,

  // is plaid linked
  isPlaidLinked: PropTypes.bool.isRequired,

  // investment amount
  investmentAmount: PropTypes.number,

  // name of investment
  investmentName: PropTypes.string,

  // risk id
  investmentPortfolioID: PropTypes.string,

  isChildSSNAdded: PropTypes.bool
}

InvestFrequency.defaultProps = {
  isProcessing: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InvestFrequency))

export default Screen
