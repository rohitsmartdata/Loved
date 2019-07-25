/* eslint-disable no-unused-vars,operator-linebreak */
/**
 * Created by demon on 29/4/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, ActionSheetIOS, TouchableOpacity, Image, ScrollView, Dimensions, LayoutAnimation }
  from 'react-native'
import {Icon}
  from 'react-native-elements'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION, getPortfolio}
  from '../../Utility/Mapper/Common'
import Fonts
  from '../../Themes/Fonts'
import {formatPrice}
  from '../../Utility/Transforms/Converter'
import moment
  from 'moment'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class InvestHomepage extends Component {

  // ------------------------------------------------------------
  // Life cycle methods

  constructor (props) {
    super(props)
    this.state = {
      chartVisible: false
    }
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  // ------------------------------------------------------------
  // Action Handlers

  invest () {
    const {handleLocalAction, localActions, investment, navigator, childID, investmentID} = this.props
    handleLocalAction({type: localActions.INVEST, [CHILD_ENTITIES.CHILD_ID]: childID, [INVESTMENT_ENTITIES.INVESTMENT_ID]: investmentID, [INVESTMENT_ENTITIES.INVESTMENT_NAME]: investment[INVESTMENT_ENTITIES.INVESTMENT_NAME], [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }
  hide () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.HIDE_GOAL, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showActionSheet () {
    const {investment} = this.props
    let boostTitle = 'Boost ' + investment[INVESTMENT_ENTITIES.INVESTMENT_NAME] + ' investment'
    let withdrawTitle = 'Withdraw from ' + investment[INVESTMENT_ENTITIES.INVESTMENT_NAME] + ' investment'
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', boostTitle, withdrawTitle],
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1:
          this.invest()
          break
        case 2:
          break
      }
    })
  }

  // ------------------------------------------------------------
  // Inner components

  renderHeader () {
    const {investment} = this.props
    return (
      <View>
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
          <Text style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 30, color: '#4A4A4A', marginTop: 20}}>
            {investment && investment[INVESTMENT_ENTITIES.INVESTMENT_NAME]}
          </Text>
        </View>

      </View>
    )
  }

  renderMiddleContainer () {
    const {investment, growth} = this.props
    const investmentBalance = (investment && investment[INVESTMENT_ENTITIES.INVESTMENT_BALANCE]) || 0
    const growthValue = growth.value
    const growthPercentage = growth.percentage
    return (
      <View style={{marginTop: 10, marginBottom: 50}}>
        <Text style={{textAlign: 'center', fontFamily: Fonts.type.bold, fontSize: 50, color: '#4A4A4A', backgroundColor: 'transparent', marginTop: 10, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2}}>
          {formatPrice(investmentBalance)}
        </Text>
        {
          (growthValue && growthPercentage) &&
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 16, color: 'rgb(0, 206, 103)', textAlign: 'center'}}>
              {growthValue >= 0 ? '+ ' : '- '}{growthValue && formatPrice(growthValue)} {'  '} {growthPercentage >= 0 ? '+ ' : '- '}{growthPercentage && growthPercentage}%
            </Text>
          </View>
        }
      </View>
    )
  }

  renderAddButton () {
    return (
      <View style={{position: 'absolute', bottom: 10, left: 0, right: 10, alignItems: 'flex-end', backgroundColor: 'transparent', zIndex: 1000, marginTop: 50}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Add'}
          accessibilityRole={'button'}
          onPress={() => this.showActionSheet()}>
          <Icon
            raised
            name='add'
            size={32}
            containerStyle={{backgroundColor: '#00CE82'}}
            color='#FFF' />
        </TouchableOpacity>
      </View>
    )
  }

  renderInvestmentInformation () {
    const {investment, recurringPayment} = this.props
    let riskID = investment[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]
    const portfolio = getPortfolio(riskID)
    return (
      <View>
        {recurringPayment && this.renderInfoCard(recurringPayment.title, 'Edit', () => console.log('will edit recurring payment'), true)}
        {riskID && portfolio && this.renderInfoCard(portfolio.HEADING, undefined, undefined, recurringPayment === undefined)}
      </View>
    )
  }

  renderInfoCard (title, buttonName, foo, showBorder) {
    return (
      <View style={{padding: 30, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: showBorder ? 1 : 0, borderColor: '#D8D8D8'}}>
        <Text style={{fontSize: 16, fontFamily: Fonts.type.regular, color: '#4A4A4A'}}>
          {title}
        </Text>
        {
          buttonName &&
          <TouchableOpacity
            accessible
            accessibilityLabel={buttonName}
            accessibilityRole={'button'}
            onPress={() => foo && foo()}>
            <Text style={{fontSize: 12, fontFamily: Fonts.type.regular, color: '#9B9B9B'}}>
              {buttonName}
            </Text>
          </TouchableOpacity>
        }
      </View>
    )
  }

  renderLastUpdatedTime () {
    const {lastUpdatedTime} = this.props
    let m = (lastUpdatedTime && moment(lastUpdatedTime).format('h:MM a, MMMM do')) || undefined
    const isX = this.isX || false
    return (
      <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', paddingBottom: 5}}>
        <Text style={{marginBottom: isX ? 15 : 10, textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 12, color: '#9B9B9B', backgroundColor: 'transparent'}}>
          Last updated: {m}
        </Text>
      </View>
    )
  }

  // ------------------------------------------------------------
  // Debug components

  // ------------------------------------------------------------
  // Core component

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <ScrollView
          style={{flex: 1, backgroundColor: '#FFF'}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            <View>
              {this.renderHeader()}
              {this.renderMiddleContainer()}
            </View>
            <View style={{marginTop: 80}}>
              {this.renderInvestmentInformation()}
            </View>
          </View>
        </ScrollView>
        {this.renderLastUpdatedTime()}
        {this.renderAddButton()}
      </View>
    )
  }

}

InvestHomepage.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // goal ID
  investmentID: PropTypes.string.isRequired,
  // child ID
  childID: PropTypes.string.isRequired,
  // goal object itself
  investment: PropTypes.object.isRequired,
  // child's first name
  childName: PropTypes.string.isRequired,
  // growth of goal amount
  growth: PropTypes.object.isRequired,
  // recurring payment
  recurringPayment: PropTypes.object.isRequired,
  // last updated time
  lastUpdatedTime: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

export default InvestHomepage
