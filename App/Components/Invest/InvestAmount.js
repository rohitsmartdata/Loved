/* eslint-disable no-unused-vars,no-trailing-spaces,jsx-indent-props */
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
import {reduxForm, Field}
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
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import LWFormInput
  from '../Utility/LWFormInput'
import GravityCapsule
  from '../Utility/GravityCapsule'
import _
  from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import { GOAL_ENTITIES } from '../../Utility/Mapper/Goal'

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

class InvestAmount extends Component {

  // --------------------------------------------------------
  // Action handler

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    this.isNormaliPhone = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    const amount = props.investmentAmount
    this.state = {
      inputWidth: amount && amount.toString().length > 0 ? amount.toString().length * 40 : 80
    }
  }

  componentWillMount () {
    const {isAddRecurring, investmentAmount} = this.props
    if (isAddRecurring) {
      this.updateInvestmentAmount(investmentAmount)
    }
  }

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.DREAM_AMOUNT
    })
    // *********** Log Analytics ***********
  }

  updateInvestmentAmount ($) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.UPDATE_INVESTMENT_AMOUNT, payload: {form: FORM_TYPES.ADD_INVESTMENT, field: INVESTMENT_ENTITIES.INVESTMENT_AMOUNT, value: $}})
  }

  next (data) {
    const amountStr = data[INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]
    const amount = (amountStr && parseInt(amountStr))
    if (!amountStr) {
      Alert.alert('Investment Amount', 'Please enter amount.')
      return
    }
    if (amount) {
      const {handleLocalAction, localActions, childID, investmentName, navigator, isAddRecurring, product} = this.props
      handleLocalAction({type: localActions.INVESTMENT_AMOUNT_SELECTED, [CHILD_ENTITIES.CHILD_ID]: childID, [INVESTMENT_ENTITIES.INVESTMENT_NAME]: investmentName, [COMMON_ENTITIES.NAVIGATOR]: navigator, [GOAL_ENTITIES.IS_ADD_RECURRING]: isAddRecurring, [INVESTMENT_ENTITIES.PRODUCT]: product})
    } else {
      this.updateInvestmentAmount(20)
      Alert.alert('Investment Amount', 'Please enter correct amount.')
    }
  }

  skip () {
    const {handleLocalAction, localActions, userID, navigator, investmentName} = this.props
    handleLocalAction({type: localActions.SKIP, [USER_ENTITIES.USER_ID]: userID, [COMMON_ENTITIES.NAVIGATOR]: navigator, [INVESTMENT_ENTITIES.INVESTMENT_NAME]: investmentName})
  }

  textChangeListener (amount) {
    this.setState({ inputWidth: amount && amount.toString().length > 0 ? amount.toString().length * 40 : 80 })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    const {firstName} = this.props
    return (
      <View style={{marginTop: 32}}>
        <Text style={{fontFamily: Fonts.type.semibold, color: '#000', fontSize: 20}}>
          How much would you like to invest into {firstName}'s Loved trading account?
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, color: '#000', fontSize: 14, marginTop: 10}}>
          Funds will be transferred and invested once you have connected your bank account.
        </Text>
      </View>
    )
  }

  renderAmountField () {
    const {inputWidth} = this.state
    const isNormaliPhone = this.isNormaliPhone || false
    const {isAddRecurring, investmentAmount} = this.props
    let amount = '20'
    if (isAddRecurring) {
      amount = investmentAmount.toString()
    }
    console.log('placeholder -----> ', amount)
    return (
      <View style={{marginTop: isNormaliPhone ? 60 : 100}}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.semibold, color: '#10427E', fontSize: 60, height: 100, bottom: 13, marginRight: 5, marginTop: 3, backgroundColor: 'transparent'}}>
            $
          </Text>
          <View style={{width: inputWidth}}>
            <Field
              whiteBackground
              selectionColor={'transparent'}
              name={INVESTMENT_ENTITIES.INVESTMENT_AMOUNT}
              autoFocus
              focusSmoothly
              contextMenuHidden
              component={LWFormInput}
              showBorder={false}
              extraTextStyle={{bottom: 5, lineHeight: 65, fontFamily: Fonts.type.semibold, fontSize: 60, color: '#10427E', height: 60, width: inputWidth, borderBottomColor: 'transparent', borderBottomWidth: 0}}
              maxLength={5}
              accessible
              accessibilityLabel={'Investment Amount'}
              accessibilityRole={'keyboardkey'}
              textChangeListener={this.textChangeListener.bind(this)}
              returnKeyType='next' placeholderText={amount} keyboardType='number-pad' />
          </View>
        </View>
      </View>
    )
  }

  renderDecisionButton () {
    const {handleSubmit} = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={10}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{...globalStyle.bottomNavigator.containerStyle, marginHorizontal: 20}} onPress={_.debounce(_.bind(handleSubmit(data => this.next(data)), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={globalStyle.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Skip and do it later'}
          accessibilityRole={'button'}
          style={{backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginTop: 10}} onPress={_.debounce(_.bind(() => this.skip(), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 14, color: '#10427E'}}>Skip and do it later</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  // --------------------------------------------------------
  // Render Core Component

  render () {
    const {investmentName, navigator, investmentAmount} = this.props
    return (
      <View style={{...globalStyle.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent titlePresent title={investmentName} />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={100}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ ...globalStyle.screen.containers.keyboard }}
          scrollEnabled={false}
        >
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            {this.renderHeading()}
            {this.renderAmountField()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderDecisionButton()}
      </View>
    )
  }
}

InvestAmount.propTypes = {
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

  // first name
  firstName: PropTypes.string.isRequired,

  // investment amount
  investmentAmount: PropTypes.number,

  // name of investment
  investmentName: PropTypes.string
}

InvestAmount.defaultProps = {
  isProcessing: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InvestAmount))

export default Screen
