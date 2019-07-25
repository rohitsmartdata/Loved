/* eslint-disable no-unused-vars,no-trailing-spaces,no-multi-spaces,operator-linebreak */
/**
 * Created by viktor on 19/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, ActionSheetIOS, TouchableOpacity, Image, ScrollView, Dimensions, LayoutAnimation, Alert }
  from 'react-native'
import {Icon}
  from 'react-native-elements'
import LWButton
  from '../Utility/LWButton'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION, getPortfolio}
  from '../../Utility/Mapper/Common'
import LinearGradient
  from 'react-native-linear-gradient'
import Fonts
  from '../../Themes/Fonts'
import {formatPrice, formatFloatPrice, convertDateStringToRequestFormat}
  from '../../Utility/Transforms/Converter'
import Carousel
  from 'react-native-snap-carousel'
import moment
  from 'moment'
import {USER_ENTITIES} from '../../Utility/Mapper/User'

// ========================================================
// Utility
// ========================================================

// ========================================================
// Core Component
// ========================================================

class Homepage extends Component {

  // ------------------------------------------------------------
  // Life cycle methods

  constructor (props) {
    super(props)
    this.state = {
      chartVisible: false,
      backdropLayout: undefined
    }
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }
  fetchGoalData () {
    const {handleLocalAction, localActions, userID, goalID, goal} = this.props
    handleLocalAction({type: localActions.FETCH_GOAL_DETAILS, [USER_ENTITIES.USER_ID]: userID, [GOAL_ENTITIES.GID]: goalID})
  }

  // ------------------------------------------------------------
  // Action Handlers

  setBackdropLayout (layout) {
    this.setState({backdropLayout: layout})
  }

  invest () {
    const {handleLocalAction, localActions, navigator, childID, goalID, goal} = this.props
    handleLocalAction({type: localActions.INVEST, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator, [GOAL_ENTITIES.NAME]: goal[GOAL_ENTITIES.NAME]})
  }

  hide () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.HIDE_GOAL, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  _withdraw () {
    const {handleLocalAction, localActions, navigator, childID, childName, goal, goalID} = this.props
    const goalName = (goal && goal[GOAL_ENTITIES.NAME]) || undefined
    const goalBalance = (goal && goal[GOAL_ENTITIES.BALANCE]) || 0
    handleLocalAction({type: localActions.NAVIGATE_TO_WITHDRAW, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [CHILD_ENTITIES.FIRST_NAME]: childName, [GOAL_ENTITIES.NAME]: goalName, [GOAL_ENTITIES.BALANCE]: goalBalance, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  _editGoal () {
    const {handleLocalAction, localActions, childID, goalID, navigator} = this.props
    handleLocalAction({type: localActions.EDIT_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  _editRecurring () {
    const {handleLocalAction, localActions, navigator, childID, goalID} = this.props
    handleLocalAction({type: localActions.NAVIGATE_TO_EDIT_RECURRING_AMOUNT, [COMMON_ENTITIES.NAVIGATOR]: navigator, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID})
  }

  showActionSheet () {
    const {goal} = this.props
    let boostTitle = 'Boost ' + goal[GOAL_ENTITIES.NAME] + ' investment'
    let withdrawTitle = 'Withdraw from ' + goal[GOAL_ENTITIES.NAME] + ' investment'
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', boostTitle, withdrawTitle],
      cancelButtonIndex: 0
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 1:
          this.invest()
          break
        case 2:
          this._withdraw()
          break
      }
    })
  }

  // ------------------------------------------------------------
  // Inner components

  renderHeader () {
    const {goal} = this.props
    return (
      <View>
        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
          <Text style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 30, color: '#4A4A4A', marginTop: 20}}>
            {goal && goal[GOAL_ENTITIES.NAME]}
          </Text>
        </View>

      </View>
    )
  }

  // ------------------------------------------------------------
  // Debug components

  renderTransactionCard (amount, status, time, borderNeeded) {
    return (
      <View style={{flex: 1, marginTop: 10, paddingVertical: 5, backgroundColor: '#FFF', borderBottomWidth: borderNeeded ? 1 : 1, borderColor: '#D8D8D8'}}>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontFamily: 'Lato-Bold', fontSize: 16, color: 'rgb(196, 0, 41)', backgroundColor: 'transparent'}}>
            {formatPrice(amount)}
          </Text>
          <Text style={{fontFamily: 'Lato-Regular', fontSize: 14, color: '#000', backgroundColor: 'transparent'}}>
            {status}
          </Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
          <Text style={{color: 'rgb(196, 0, 41)', fontSize: 14, fontFamily: 'Lato-Regular'}}>
            {convertDateStringToRequestFormat(time)}
          </Text>
        </View>

      </View>
    )
  }

  // ------------------------------------------------------------
  // Core component

  closeModal () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.CLOSE_ARTICLE, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  renderTopContent () {
    const { navigator, goal, growth, childName } = this.props
    const goalTarget = (goal && goal[GOAL_ENTITIES.GOAL_AMOUNT]) || 0
    const goalBalance = (goal && goal[GOAL_ENTITIES.BALANCE]) || 0
    const growthValue = growth && growth.value
    let goalBalanceRatio = ((goalTarget !== 0) && ((goalBalance / goalTarget) * 10)) || 0
    const growthPercentage = growth && growth.percentage
    const { height, width } = Dimensions.get('window')
    const {backdropLayout} = this.state

    return (
      <View onLayout={event => this.setBackdropLayout(event.nativeEvent.layout)} style={{marginBottom: 20}}>
        <Image resizeMode='stretch' source={require('../../../Img/newGoal/backdrop.png')} style={{position: 'absolute', top: 0, left: 0, height: backdropLayout ? backdropLayout.height + 20 : 300, width: width}} />
        <View style={{marginTop: 32, width: width, paddingHorizontal: 16}}>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Close'}
            accessibilityRole={'button'}
            onPress={() => this.closeModal()} style={{backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            <Icon name='close' size={30} color='#FFF' />
          </TouchableOpacity>

          <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 10}}>

            <Text style={{fontFamily: Fonts.type.bold, color: 'white', fontSize: 17}}>
              {childName}'s {goal && goal[GOAL_ENTITIES.NAME]}
            </Text>

            <Text style={{fontFamily: Fonts.type.bold, color: '#ECC016', fontSize: 32, marginTop: 20}}>
              {formatFloatPrice(goalBalance)}
            </Text>

            <Text style={{fontFamily: Fonts.type.medium, color: '#FFF', fontSize: 17, marginTop: 20, textAlign: 'center'}} />

            <View style={{flexDirection: 'row', backgroundColor: '#d9d9d9', height: 10, width: '100%', marginTop: 30, marginBottom: 5}}>
              <View style={{flex: goalBalanceRatio, backgroundColor: '#ECC016', borderBottomLeftRadius: 2}} />
              <View style={{flex: 10 - goalBalanceRatio, backgroundColor: 'transparent', borderBottomRightRadius: 2, alignItems: 'flex-end', justifyContent: 'center'}} />
            </View>

            <Text style={{fontFamily: Fonts.type.regular, color: 'white', fontSize: 14, alignSelf: 'flex-end'}}>
              {goalTarget && formatPrice(goalTarget)} to go
            </Text>

            <Text style={{fontFamily: Fonts.type.regular, color: 'white', fontSize: 12, alignSelf: 'flex-start'}}>
              earnings
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'flex-start', justifyContent: 'space-between', width: '50%'}}>
              {
                (growthValue && growthPercentage) &&
                <Text style={{fontFamily: Fonts.type.bold, color: 'white', fontSize: 20}}>
                  {growthValue > 0 ? '+' : growthValue < 0 ? '' : ''}{formatPrice(growthValue)} {'  '} {growthPercentage > 0 ? '+' : growthPercentage < 0 ? '' : ''}{parseFloat(growthPercentage).toFixed(2)}%
                </Text>
              }
            </View>
          </View>
        </View>
      </View>
    )
  }

  renderInformationContent (text, editShow, textColor, onClick) {
    return (
      <View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 40, justifyContent: 'space-between' }}>
          <Text style={{fontFamily: Fonts.type.bold, color: textColor || '#000', fontSize: 16}}>
            {text}
          </Text>
          {
            editShow &&
            <TouchableOpacity
              accessible
              accessibilityLabel={'Edit'}
              accessibilityRole={'button'}
              onPress={onClick}>
              <Text style={{fontFamily: Fonts.type.regular, color: '#194d9a', fontSize: 16}}>{'edit'}</Text>
            </TouchableOpacity>
          }
        </View>
        <View style={{height: 2, backgroundColor: '#bfbfbf'}} />
      </View>
    )
  }

  renderInformation () {
    const {targetAge, goal, recurringPayment, totalGoalAmount} = this.props
    let riskID = goal[GOAL_ENTITIES.PORTFOLIO_RISK]
    const portfolio = getPortfolio(riskID)

    return (
      <View>
        {recurringPayment && this.renderInformationContent(recurringPayment.title, true, null, () => this._editRecurring())}
        {targetAge && this.renderInformationContent('Target ' + formatPrice(totalGoalAmount) + ' at Age ' + targetAge, true, null, () => this._editGoal())}
        {riskID && portfolio && this.renderInformationContent(portfolio.NAME, false, '#194d9a')}
      </View>
    )
  }

  renderButton () {
    return (
      <View style={{bottom: 0, flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 10, paddingBottom: 20, alignItems: 'center', justifyContent: 'space-between'}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Top Up'}
          accessibilityRole={'button'}
          onPress={() => this.invest()} style={{paddingVertical: 15, backgroundColor: '#417505', flex: 0.5, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
          <Text style={{fontFamily: Fonts.type.bold, color: '#fff', fontSize: 20}}>Top-up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Withdraw'}
          accessibilityRole={'button'}
          onPress={() => this._withdraw()} style={{paddingVertical: 15, backgroundColor: '#D0021B', flex: 0.5, borderRadius: 6, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontFamily: Fonts.type.bold, color: '#fff', fontSize: 20}}>Withdraw</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <ScrollView
          contentContainerStyle={{flex: 1}}>
          {this.renderTopContent()}
          {this.renderInformation()}
        </ScrollView>
        {this.renderButton()}
      </View>
    )
  }
}

Homepage.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // goal ID
  goalID: PropTypes.string.isRequired,
  // child ID
  childID: PropTypes.string.isRequired,
  // user ID
  userID: PropTypes.string.isRequired,
  // goal object itself
  goal: PropTypes.object.isRequired,
  // child's first name
  childName: PropTypes.string.isRequired,
  // growth of goal amount
  growth: PropTypes.object.isRequired,
  // is goal detail processing
  isGoalDetailProcessing: PropTypes.bool.isRequired,
  // stocks
  stocks: PropTypes.array,
  // debug mode
  debugMode: PropTypes.bool.isRequired,
  // target age
  targetAge: PropTypes.number.isRequired,
  // recurring payment
  recurringPayment: PropTypes.object.isRequired,
  // last updated time
  lastUpdatedTime: PropTypes.string.isRequired,
  // Total goal amount
  totalGoalAmount: PropTypes.string.isRequired
}

// ========================================================
// Export
// ========================================================

export default Homepage
