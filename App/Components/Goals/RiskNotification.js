/* eslint-disable no-unused-vars,no-trailing-spaces,no-multiple-empty-lines */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, Image, ScrollView, Dimensions, LayoutAnimation, TouchableOpacity}
  from 'react-native'
import {reduxForm}
  from 'redux-form'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import { connect }
  from 'react-redux'
import { CHILD_ENTITIES as CHILD_ENTITES }
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import _
  from 'lodash'
import InfoTip
  from '../../Containers/User/InfoTip'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class RiskNotification extends Component {

  constructor (props) {
    super(props)
    this.state = {
      infoTipVisible: false,
      infoTipCode: undefined
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  // --------------------------------------------------------
  // action handlers

  toggleInfoTip (visibility, code) {
    this.setState({
      infoTipVisible: visibility
    })
    code && this.setState({
      infoTipCode: code
    })
  }

  confirm () {
    const {handleLocalAction, localActions, isChildSSNAdded, isPlaidLinked, userID, childID, goalName, goalAmount, duration, recurringAmount, recurringFrequency, portfolioRisk, suggestedRisk, navigator} = this.props
    handleLocalAction({
      type: localActions.ADD_GOAL,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITES.CHILD_ID]: childID,
      [GOAL_ENTITIES.NAME]: goalName,
      [GOAL_ENTITIES.GOAL_AMOUNT]: goalAmount,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount,
      [GOAL_ENTITIES.RECURRING_FREQUENCY]: recurringFrequency,
      [GOAL_ENTITIES.DURATION]: duration,
      [GOAL_ENTITIES.PORTFOLIO_RISK]: portfolioRisk,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [CHILD_ENTITES.IS_SSN_ADDED]: isChildSSNAdded,
      [USER_ENTITIES.IS_PLAID_LINKED]: isPlaidLinked})
  }

  changePortfolio () {
    const {handleLocalAction, localActions, isChildSSNAdded, isPlaidLinked, userID, childID, goalName, goalAmount, duration, recurringAmount, recurringFrequency, portfolioRisk, suggestedRisk, navigator} = this.props
    handleLocalAction({
      type: localActions.ADD_GOAL,
      [USER_ENTITIES.USER_ID]: userID,
      [CHILD_ENTITES.CHILD_ID]: childID,
      [GOAL_ENTITIES.NAME]: goalName,
      [GOAL_ENTITIES.GOAL_AMOUNT]: goalAmount,
      [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount,
      [GOAL_ENTITIES.RECURRING_FREQUENCY]: recurringFrequency,
      [GOAL_ENTITIES.DURATION]: duration,
      [GOAL_ENTITIES.PORTFOLIO_RISK]: suggestedRisk,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [CHILD_ENTITES.IS_SSN_ADDED]: isChildSSNAdded,
      [USER_ENTITIES.IS_PLAID_LINKED]: isPlaidLinked})
  }

  // --------------------------------------------------------
  // child components

  renderBottomComponent () {
    const isX = this.isX || false
    return (
      <View style={{marginBottom: isX ? 20 : 10}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'CONFIRM'}
          accessibilityRole={'button'}
          style={{backgroundColor: 'rgb(255, 208, 23)', marginHorizontal: 16, height: 50, justifyContent: 'center', alignItems: 'center'}} onPress={_.debounce(_.bind(() => this.confirm(), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={[styles.bottomNavigator.textStyle, { color: '#000' }]}>CONFIRM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Switch to Suggested Portfolio'}
          accessibilityRole={'button'}
          onPress={_.debounce(_.bind(() => this.changePortfolio(), this), 500, {'leading': true, 'trailing': false})} style={styles.simpleBottomNavigator.containerStyle}>
          <Text style={[styles.simpleBottomNavigator.textStyle, { color: '#FFF' }]}>Switch to Suggested Portfolio</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderTopComponent () {
    const isX = this.isX || false
    const { width } = Dimensions.get('window')

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>

          <View style={{flex: 5, justifyContent: 'space-around'}}>
            <TouchableOpacity
              accessible
              accessibilityLabel={'Show Actions'}
              accessibilityRole={'button'}
              onPress={() => this.showActionSheet()} style={{marginTop: isX ? 50 : 30, marginHorizontal: 16}} />
            <View style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require('../../../Img/iconImages/balance.png')} style={{height: 145, width: 175}} />
            </View>
            <Text style={{textAlign: 'center', lineHeight: 40, fontSize: 37, fontFamily: Fonts.type.nanumPen, backgroundColor: 'transparent', color: '#FFF'}}>
              Just be aware!
            </Text>
          </View>

          <View style={{flex: 5, marginTop: 40}}>
            <View style={{paddingHorizontal: 20}}>
              <Text style={{fontFamily: Fonts.type.regular, letterSpacing: 0.5, textAlign: 'center', fontSize: 16, lineHeight: 25, color: '#FFF', backgroundColor: 'transparent'}}>
                You selected a portfolio with a risk higher than we thought you would be comfortable with. {'\n\n'}
                Please confirm your selection or go with our suggested portfolio.
              </Text>
            </View>
            <TouchableOpacity
              accessible
              accessibilityLabel={'Why does risk and return matter?'}
              accessibilityRole={'button'}
              onPress={() => this.toggleInfoTip(true, USER_ENTITIES.GLOSSARY_KEYWORD_GOAL_AMOUNT_WHY_RISK_MATTERS)}>
              <Text style={{fontFamily: Fonts.type.regular, letterSpacing: 0.5, textDecorationLine: 'underline', textAlign: 'center', fontSize: 16, lineHeight: 25, color: '#FFF', backgroundColor: 'transparent'}}>
                Why does risk and return matter?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  // --------------------------------------------------------
  // core component

  render () {
    const {isProcessing} = this.props
    const { infoTipCode, infoTipVisible } = this.state
    return (
      <View style={{flex: 1, backgroundColor: '#10427E'}}>
        <ProcessingIndicator isProcessing={isProcessing} />
        {this.renderTopComponent()}
        {this.renderBottomComponent()}
        <InfoTip isVisible={infoTipVisible} isGlossary={false} code={infoTipCode} foo={this.toggleInfoTip.bind(this)} />
      </View>
    )
  }

}

RiskNotification.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // user id
  userID: PropTypes.string.isRequired,
  // child id
  childID: PropTypes.string.isRequired,
  // goal name
  goalName: PropTypes.string.isRequired,
  // portfolio Risk
  portfolioRisk: PropTypes.string.isRequired,
  // duration
  duration: PropTypes.number.isRequired,
  // goal amount
  goalAmount: PropTypes.number.isRequired,
  // recurring amount
  recurringAmount: PropTypes.number.isRequired,
  // recurring frequency
  recurringFrequency: PropTypes.string.isRequired,
  // plaid linked
  isPlaidLinked: PropTypes.bool.isRequired,
  // suggested risk
  suggestedRisk: PropTypes.string.isRequired,
  // is processing
  isProcessing: PropTypes.bool.isRequired,
  // is child ssn added
  isChildSSNAdded: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(RiskNotification))

export default Screen
