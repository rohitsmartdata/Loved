/* eslint-disable no-unused-vars,no-trailing-spaces,operator-linebreak,camelcase */
/**
 * Created by demon on 24/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {
  View,
  Text,
  ActionSheetIOS,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  LayoutAnimation,
  AppState
}
  from 'react-native'
import branch from 'react-native-branch'
import {Icon}
  from 'react-native-elements'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, getIcons, getPortfolio, getPortfolioInternalID, getFrequencyTitle, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import Fonts
  from '../../Themes/Fonts'
import {formatPrice, formatFloatPrice, limitText}
  from '../../Utility/Transforms/Converter'
import moment
  from 'moment'
import { CachedImage }
  from 'react-native-cached-image'
import _
  from 'lodash'
import GoalBase
  from '../../Containers/Goals/GoalBase'
import LI_InvestmentBase
  from '../../Containers/Invest/LI_InvestmentBase'
import LI_ShowInvestment
  from '../../Containers/Invest/LI_ShowInvestment'
import LI_ShowGoal
  from '../../Containers/Goals/LI_ShowGoal'
import ShadowedContainer from '../../CommonComponents/ShadowedContainer'
import Colors from '../../Themes/Colors'
let lastActiveAt = moment()
let resumeDuration = 5

// ========================================================
// Core Component
// ========================================================

class ChildView extends Component {

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
    this.state = {
      appState: AppState.currentState,
      newInvestments: this.filterInvestments(props.investments),
      goalVisible: false,
      investmentVisible: false,
      showInvestment: false,
      showGoal: false,
      investmentID: undefined
    }
  }

  // ------------------------------------------------------------
  // Lifecycle methods

  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(nextProps.investments, this.props.investments)) {
      this.setState({newInvestments: this.filterInvestments(nextProps.investments)})
    }
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      var seconds = moment().diff(lastActiveAt, 'seconds')
      if (seconds > resumeDuration) {
        this.setState({
          goalVisible: false,
          showGoal: false,
          investmentVisible: false,
          showInvestment: false
        })
      }
    } else if (nextAppState.match(/inactive|background/)) {
      lastActiveAt = moment()
    }

    this.setState({appState: nextAppState})
  }

  // ------------------------------------------------------------
  // Action Handlers

  navigateToChildInvesting () {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({type: localActions.NAVIGATE_TO_CHILD_INVESTING, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  toggleGoal (visibility) {
    this.setState({
      goalVisible: visibility
    })
  }

  toggleShowGoal (visibility, goalID) {
    this.setState({
      showGoal: visibility,
      investmentID: goalID
    })
  }

  toggleInvestment (visibility) {
    this.setState({
      investmentVisible: visibility
    })
  }

  toggleShowInvestment (visibility, investmentID) {
    this.setState({
      showInvestment: visibility,
      investmentID: investmentID
    })
  }

  filterInvestments = (investments) => {
    let filteredInvestments = []
    if (investments) {
      investments.map(i => {
        if (!i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY]) {
          let temp = investments.find(o => {
            return o.name === i.name && o[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY]
          })
          if (!temp) {
            filteredInvestments.push(i)
          }
        } else {
          filteredInvestments.push(i)
        }
      })
    }
    return filteredInvestments
    // investments && Object.values(investments).map(i => {
    //   if (!i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY]) {
    //     let temp = investments.find(o => {
    //       return o.name === i.name && o[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY]
    //     })
    //     if (temp) return null
    //   }
    // })
  }

  addNewGoal () {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({type: localActions.ADD_NEW_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  addnewInvestment () {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({type: localActions.ADD_NEW_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showGoal (goalID, name) {
    const {handleLocalAction, localActions, childID, navigator, userID} = this.props
    handleLocalAction({type: localActions.SHOW_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [GOAL_ENTITIES.NAME]: name, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID})
  }

  showInvestment (investmentID) {
    const {handleLocalAction, localActions, childID, navigator, userID} = this.props
    handleLocalAction({type: localActions.SHOW_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [INVESTMENT_ENTITIES.INVESTMENT_ID]: investmentID, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID})
  }

  popView () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.POPUP, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showPortfolioDetail (investmentID, investmentName, investmentAmount, internalID, rValue, tickerName, portfolioID, boostAmount) {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    let recurrenceExixts = false
    if (boostAmount) {
      let duplicateInvestments = this.props.investments.filter(i => i.name === investmentName && i.investmentRecurringAmount)
      if (duplicateInvestments.length > 0) {
        recurrenceExixts = duplicateInvestments[0][INVESTMENT_ENTITIES.INVESTMENT_ID]
      }
    }
    handleLocalAction({
      type: localActions.SHOW_PORTFOLIO_DETAIL,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [INVESTMENT_ENTITIES.INVESTMENT_NAME]: investmentName,
      [INVESTMENT_ENTITIES.INVESTMENT_TICKER_NAME]: tickerName,
      [INVESTMENT_ENTITIES.INVESTMENT_INTERNAL_ID]: internalID,
      [INVESTMENT_ENTITIES.INVESTMENT_ID]: investmentID,
      [INVESTMENT_ENTITIES.PRODUCT_PORTFOLIO_ID]: portfolioID,
      [INVESTMENT_ENTITIES.PRODUCT_BOOST_AMOUNT]: boostAmount,
      [INVESTMENT_ENTITIES.INVESTMENT_AMOUNT]: investmentAmount,
      [INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT]: rValue,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      [INVESTMENT_ENTITIES.IS_RECURRENCE_INVESTMENT_EXIST]: recurrenceExixts
    })
  }

  showDesireActionSheet (goalID, name, balance) {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({
      type: localActions.SHOW_GOAL,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.NAME]: name,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  invest (goalID, name) {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({type: localActions.INVEST, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [GOAL_ENTITIES.NAME]: name, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  withdraw (goalID, name, balance) {
    const {handleLocalAction, localActions, navigator, childID, firstName} = this.props
    handleLocalAction({
      type: localActions.NAVIGATE_TO_WITHDRAW,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [CHILD_ENTITIES.FIRST_NAME]: firstName,
      [GOAL_ENTITIES.GID]: goalID,
      [GOAL_ENTITIES.NAME]: name,
      [GOAL_ENTITIES.BALANCE]: balance,
      [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  editGoal (goalID) {
    const {handleLocalAction, localActions, navigator, childID} = this.props
    handleLocalAction({type: localActions.EDIT_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // ------------------------------------------------------------
  // Child render methods

  renderInvestmentCard (investmentID, name = '', balance = 0, gValue = 0, gPercentage, rAmount = 0, rFrequency, rStatus, portfolioID, tickerName, i) {
    let frequencyTitle = rFrequency && getFrequencyTitle(rFrequency)
    const internalID = getPortfolioInternalID(portfolioID)
    let recurringStatement = rFrequency && (rStatus === 'stopped' ? 'Paused' : (rAmount && (formatPrice(rAmount) + ' ' + frequencyTitle)))
    let tempBoostAmount
    if (!recurringStatement) {
      let boostAmount = this.getBoostInformation(i)

      tempBoostAmount = formatPrice(boostAmount)
      recurringStatement = boostAmount && ('Pending ' + tempBoostAmount)
    }
    let img = name && getIcons(name)
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Show Portfolio detail'}
        accessibilityRole={'button'}
        key={investmentID}
        onPress={() => this.showPortfolioDetail(investmentID, name, balance, internalID, rAmount, tickerName, portfolioID, tempBoostAmount)} >
        <View style={{backgroundColor: '#FFF', marginTop: 20, paddingBottom: 20, paddingLeft: 16, paddingRight: 16, borderBottomWidth: 1, borderColor: '#BDBDBD'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 17, color: '#000', marginBottom: 5, fontFamily: Fonts.type.bold}}>
                {limitText(name, 23)}
              </Text>
              <Text style={{fontSize: 14, color: '#000', fontFamily: Fonts.type.regular}}>
                {recurringStatement}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{fontSize: 17, color: '#000', marginBottom: 5, fontFamily: Fonts.type.bold}}>
                {formatFloatPrice(balance)}
              </Text>
              <Text style={{fontSize: 14, color: '#000', fontFamily: Fonts.type.helvetica}}>
                {gPercentage > 0 ? '+' : gPercentage < 0 ? '' : ''}{parseFloat(gPercentage).toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  getBoostInformation (investment) {
    let instructions = investment[GOAL_ENTITIES.INSTRUCTIONS]
    let amount
    let arr = (instructions && Object.values(instructions)) || []
    arr && arr.map(i => {
      let frequency = i[GOAL_ENTITIES.INSTRUCTION_FREQUENCY]
      if (frequency === 'once') {
        amount = i[GOAL_ENTITIES.INSTRUCTION_AMOUNT]
      }
    })
    return amount
  }

  renderInvestmentPanel () {
    const {newInvestments} = this.state
    return (
      <View>
        {newInvestments && Object.values(newInvestments).map(i => {
          return this.renderInvestmentCard(i[INVESTMENT_ENTITIES.INVESTMENT_ID], i[INVESTMENT_ENTITIES.INVESTMENT_NAME], i[INVESTMENT_ENTITIES.INVESTMENT_BALANCE], i[INVESTMENT_ENTITIES.GROWTH_IN_VALUE], i[INVESTMENT_ENTITIES.GROWTH_IN_PERCENTAGE], i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_AMOUNT], i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_FREQUENCY], i[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_STATUS], i[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID], i[INVESTMENT_ENTITIES.INVESTMENT_TICKER_NAME], i)
        })}
      </View>
    )
  }

  renderGoalPanel () {
    const {goals} = this.props
    return (
      <View>
        {goals && Object.values(goals).map(goal => {
          return this.renderGoalCard(goal[GOAL_ENTITIES.GID], goal[GOAL_ENTITIES.NAME], goal[GOAL_ENTITIES.BALANCE], goal[GOAL_ENTITIES.TOTAL_CONTRIBUTIONS], goal[GOAL_ENTITIES.GOAL_AMOUNT], goal[GOAL_ENTITIES.PORTFOLIO_RISK], goal[GOAL_ENTITIES.GROWTH_IN_VALUE], goal[GOAL_ENTITIES.GROWTH_IN_PERCENTAGE], goal[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT], goal[GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY], goal[GOAL_ENTITIES.GOAL_RECURRING_STATUS])
        })}
      </View>
    )
  }

  renderCashBalance () {
    return (
      <View style={{backgroundColor: '#FFF', marginTop: 20, paddingBottom: 20, paddingHorizontal: 32, borderBottomWidth: 1, borderColor: '#BDBDBD'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 16, color: '#000', fontFamily: Fonts.type.bold, marginBottom: 5}}>Loved Cash Balance</Text>
            <Text style={{fontSize: 14, color: '#000', fontFamily: Fonts.type.regular}}>Available now</Text>
            <Text style={{fontSize: 14, color: '#000', fontFamily: Fonts.type.regular}}>Recent sell orders to Loved Cash</Text>
            <Text style={{fontSize: 14, color: '#000', fontFamily: Fonts.type.regular}}>Recent withdrawals to Bank</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{fontSize: 16, color: '#000', fontFamily: Fonts.type.bold, marginBottom: 5}}>$12.19</Text>
            <Text style={{fontSize: 16, color: '#000', fontFamily: Fonts.type.regular}}>$2.19</Text>
            <Text style={{fontSize: 16, color: '#000', fontFamily: Fonts.type.regular}}>$10.00</Text>
            <Text style={{fontSize: 16, color: '#000', fontFamily: Fonts.type.regular}}>$5.00</Text>
          </View>
        </View>
      </View>
    )
  }

  renderGoalCard (goalID, goalName = '', goalBalance = 0, totalContribution, target = 0, portfolioType, gValue, gPercentage, rAmount, rFrequency, rStatus) {
    const {debugMode} = this.props
    const {width} = Dimensions.get('window')
    let progress = ((target !== 0) && (goalBalance / target)) || 0
    let portfolioName = getPortfolio(portfolioType).NAME || ''
    let goalBalanceRatio = ((target !== 0) && (goalBalance / target)) || 0
    let toGo = (goalBalance && (target - goalBalance)) || target
    let portfolio = getPortfolio(portfolioType)
    let frequencyTitle = rFrequency && getFrequencyTitle(rFrequency)

    let img = goalName && getIcons(goalName)
    let recurringStatement = rStatus === 'stopped' ? 'Paused' : (rAmount && (formatPrice(rAmount) + ' ' + frequencyTitle))
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Show Goal actions'}
        accessibilityRole={'button'}
        key={goalID}
        onPress={() => this.showDesireActionSheet(goalID, goalName, goalBalance)}>

        <View style={{backgroundColor: '#FFF', marginTop: 20, paddingBottom: 20, paddingLeft: 16, paddingRight: 16, borderBottomWidth: 1, borderColor: '#BDBDBD'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 17, color: '#000', marginBottom: 5, fontFamily: Fonts.type.bold}}>
              {limitText(goalName, 23)}
            </Text>
            <Text style={{fontSize: 17, color: '#000', marginBottom: 5, fontFamily: Fonts.type.bold}}>
              {formatFloatPrice(goalBalance)}
            </Text>
          </View>
          <View style={{height: 8, width: '100%', backgroundColor: '#d4d4d4', marginTop: 2, marginBottom: 7}}>
            <View style={{backgroundColor: '#096A9A', height: 8, width: `${goalBalanceRatio}%`}} />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 14, color: '#000', fontFamily: Fonts.type.regular}}>
              {recurringStatement}
            </Text>
            <Text style={{fontSize: 14, color: '#000', fontFamily: Fonts.type.regular}}>
              {formatPrice(parseInt(toGo))} to go
            </Text>
          </View>
        </View>

      </TouchableOpacity>
    )
  }

  renderLastUpdateTime () {
    const {lastUpdatedTime} = this.props
    if (lastUpdatedTime) {
      let m = moment(lastUpdatedTime).format('h:MM a, MMMM DD')
      return (
        <View style={{paddingHorizontal: 26, marginTop: 10, backgroundColor: '#FFF'}}>
          <Text style={{marginBottom: 10, textAlign: 'center', fontSize: 12, color: '#000', fontFamily: Fonts.type.regular, backgroundColor: 'transparent'}}>
            Last updated: {m}
          </Text>
        </View>
      )
    } else return null
  }

  renderGoalComponent () {
    const {goalVisible} = this.state
    const { navigator, childID } = this.props
    if (goalVisible) {
      return <GoalBase navigator={navigator} childID={childID} isVisible={goalVisible} foo={this.toggleGoal.bind(this)} />
    } else {
      return null
    }
  }

  renderInvestmentComponent () {
    const {investmentVisible} = this.state
    const { navigator, childID } = this.props
    if (investmentVisible) {
      return <LI_InvestmentBase navigator={navigator} childID={childID} isVisible={investmentVisible} foo={this.toggleInvestment.bind(this)} />
    } else {
      return null
    }
  }

  renderShowInvestment () {
    const {showInvestment, investmentID} = this.state
    const { navigator, childID } = this.props
    if (showInvestment) {
      return <LI_ShowInvestment navigator={navigator} childID={childID} isVisible={showInvestment} investmentID={investmentID} foo={this.toggleShowInvestment.bind(this)} />
    } else {
      return null
    }
  }

  renderShowGoal () {
    const {showGoal, investmentID} = this.state
    const { navigator, childID } = this.props
    if (showGoal) {
      return <LI_ShowGoal navigator={navigator} childID={childID} isVisible={showGoal} goalID={investmentID} foo={this.toggleShowGoal.bind(this)} />
    } else {
      return null
    }
  }

  renderGoalButton () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Create Goal'}
        accessibilityRole={'button'}
        onPress={() => this.toggleGoal(true)}>
        <Text>
          Create Goal
        </Text>
      </TouchableOpacity>
    )
  }

  renderInvestementButton () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Create Investment'}
        accessibilityRole={'button'}
        onPress={() => this.toggleInvestment(true)}>
        <Text>
          Create investment
        </Text>
      </TouchableOpacity>
    )
  }

  // ------------------------------------------------------------
  // inner components

  renderGoalCube (GID, title, balance = 0, target = 0, growthAmount, growthPercentage, transactions) {
    const {goalImages} = this.props
    let goalImage = (goalImages && goalImages[title])
    let iconImage = (goalImage && goalImage[GOAL_ENTITIES.PRODUCT_IMAGE_URL])
    let cover = 0.1
    let unCover = 0.9
    let progress = ((target !== 0) && (balance / target)) || 0
    progress = (progress === 0) ? 0.1 : progress
    let remaining = 1 - progress
    let transactionArray = (transactions && Object.keys(transactions))
    let isTransactionPresent = (transactions && transactionArray.length > 0) || false
    let showPending = (parseInt(balance) === 0)
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        onPress={() => this.showGoal(GID, title)}
        style={{marginHorizontal: 5, borderRadius: 5, marginBottom: 5, paddingHorizontal: 12, height: 87, borderColor: '#4EC2D1', flexDirection: 'row', backgroundColor: '#FFF'}} >
        <View style={{alignSelf: 'center'}}>
          {
            iconImage ?
              <View style={{height: 61, width: 61, borderRadius: 30, shadowOpacity: 0.3, shadowOffset: {height: 0, width: 0}}}>
                <CachedImage source={{uri: iconImage}} style={{height: 61, width: 61, borderRadius: 30}} />
              </View>
              : <View style={{height: 61, width: 61, borderRadius: 100, backgroundColor: '#A3A2AC'}} />
          }
        </View>
        <View style={{backgroundColor: 'transparent', paddingVertical: 12, flex: 8, justifyContent: 'center', marginLeft: 10}}>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontFamily: Fonts.type.medium, fontSize: 18, color: '#000'}}>
              {limitText(title, 20)}
            </Text>
            <Text style={{fontFamily: Fonts.type.medium, fontSize: 18, color: '#000'}}>
              {showPending ? 'Pending' : formatFloatPrice(balance)}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5}}>
            <Text style={{fontFamily: Fonts.type.book, textAlign: 'right', fontSize: 16, color: 'rgba(0, 0, 0, 0.46)'}}>
              {(showPending ? '' : 'of ') + formatFloatPrice(target)}
            </Text>
          </View>
          <View style={{position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', height: 3}}>
            <View style={{flex: progress, backgroundColor: '#2C78F9', borderTopLeftRadius: 10, borderBottomLeftRadius: 10}} />
            <View style={{flex: remaining, backgroundColor: 'rgba(44, 120, 249, 0.17)', borderTopRightRadius: 10, borderBottomRightRadius: 10}} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderGoals () {
    const {goals} = this.props
    let goalsAvailable = goals && goals.length > 0
    return (
      <View onPress={() => this.addNewGoal()} style={{backgroundColor: 'transparent'}}>
        <TouchableOpacity onPress={() => this.addNewGoal()} style={{backgroundColor: '#FFF', paddingVertical: 10, marginBottom: 5, alignItems: 'center', paddingLeft: 24, paddingRight: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontFamily: Fonts.type.bold, letterSpacing: 0, fontSize: 20, color: '#1C3C70'}}>
            Achieving
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image accessible accessibilityLabel={'addGoalIcon'} style={{height: 18, width: 18}} source={require('../../../Img/assets/dashboard/Plus-2/Plus.png')} />
          </View>
        </TouchableOpacity>
        <View>
          {
            goalsAvailable ? Object.values(goals).map(goal => this.renderGoalCube(goal[GOAL_ENTITIES.GID], goal[GOAL_ENTITIES.NAME], goal[GOAL_ENTITIES.BALANCE], goal[GOAL_ENTITIES.GOAL_AMOUNT], goal[GOAL_ENTITIES.GROWTH_IN_VALUE], goal[GOAL_ENTITIES.GROWTH_IN_PERCENTAGE], goal[GOAL_ENTITIES.TRANSACTIONS])) : this.renderStartGoal()
          }
        </View>
      </View>
    )
  }

  renderInvestments () {
    const {newInvestments} = this.state
    let investmentsAvailable = newInvestments && newInvestments.length > 0
    let cap = (newInvestments && Object.values(newInvestments).length) || 0
    return (
      <View style={{backgroundColor: 'transparent'}}>
        <TouchableOpacity onPress={() => this.addnewInvestment()} style={{backgroundColor: '#FFF', marginVertical: 5, paddingVertical: 10, alignItems: 'center', paddingLeft: 24, paddingRight: 16, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 20, color: '#1C3C70'}}>
            Investing
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image accessible accessibilityLabel={'addGoalIcon'} style={{height: 18, width: 18}} source={require('../../../Img/assets/dashboard/Plus-2/Plus.png')} />
          </View>
        </TouchableOpacity>
        <View>
          {
            investmentsAvailable ? Object.values(newInvestments).map((i, index) => {
              const omitBorder = index === (cap - 1)
              return this.renderInvestmentCube(i[INVESTMENT_ENTITIES.INVESTMENT_ID], i[INVESTMENT_ENTITIES.INVESTMENT_NAME], i[INVESTMENT_ENTITIES.INVESTMENT_BALANCE], i[INVESTMENT_ENTITIES.GROWTH_IN_VALUE], i[INVESTMENT_ENTITIES.GROWTH_IN_PERCENTAGE], i[INVESTMENT_ENTITIES.INVESTMENT_RISK_ID], i[INVESTMENT_ENTITIES.INVESTMENT_TICKER_NAME], omitBorder, i[INVESTMENT_ENTITIES.TRANSACTIONS])
            }) : this.renderStartPortfolio()
          }
        </View>
      </View>
    )
  }

  renderInvestmentCube (investmentID, name, balance = 0, growthAmount, growthPercentage, portfolioID, tickerName, omitBorder, transactions) {
    const {width} = Dimensions.get('window')
    const {investmentImages} = this.props
    const cubeWidth = width - (16 * 2)

    let investmentImage = (investmentImages && investmentImages[tickerName])
    let iconImage = (investmentImage && investmentImage[INVESTMENT_ENTITIES.PRODUCT_IMAGE_URL])
    let growthColor = (growthAmount && growthAmount < 0) ? '#F0595C' : '#67D14E'
    let transactionArray = (transactions && Object.keys(transactions))
    let isTransactionPresent = (transactions && transactionArray.length > 0) || false
    let showPending = (parseInt(balance) === 0)
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={name}
        onPress={() => this.showInvestment(investmentID)}
        style={{marginHorizontal: 5, marginBottom: 5, paddingHorizontal: 12, height: 87, borderRadius: 5, borderColor: '#4EC2D1', flexDirection: 'row', backgroundColor: '#FFF'}} >
        <View style={{backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
          {
            iconImage ?
              <View style={{height: 61, width: 61, borderRadius: 30, shadowOpacity: 0.05, shadowOffset: {height: 0, width: 0}}}>
                <CachedImage source={{uri: iconImage}} style={{height: 61, width: 61, borderRadius: 30}} />
              </View>
              : <View style={{height: 61, width: 61, borderRadius: 100, backgroundColor: '#A3A2AC'}} />
          }
        </View>
        <View style={{backgroundColor: 'transparent', flex: 8, justifyContent: 'center', marginLeft: 10}}>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontFamily: Fonts.type.medium, fontSize: 18, letterSpacing: 0.3, color: '#000'}}>
              {limitText(name, 20)}
            </Text>
            <Text style={{fontFamily: Fonts.type.medium, fontSize: 18, color: '#000'}}>
              {showPending ? 'Pending' : formatFloatPrice(balance)}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5}}>
            {
              !showPending ?
                <Text style={{fontFamily: Fonts.type.book, textAlign: 'right', fontSize: 16, color: 'rgba(0, 0, 0, 0.46)'}}>
                  {growthAmount > 0 && '+'}{growthAmount && formatFloatPrice(growthAmount)} {''} ({growthPercentage > 0 && '+'}{growthPercentage}%)
                </Text>
                :
                <Text style={{fontFamily: Fonts.type.book, textAlign: 'right', fontSize: 16, color: 'rgba(0, 0, 0, 0.46)'}} />
            }
          </View>

        </View>
      </TouchableOpacity>
    )
  }

  renderStartGoal () {
    return (
      <View style={{paddingHorizontal: 5}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Start building a portfolio'}
          accessibilityRole={'button'}
          style={{flexDirection: 'row', paddingLeft: 18, paddingRight: 16, height: 87, marginBottom: 5, backgroundColor: '#FFF', borderRadius: 5}}
          onPress={() => this.addNewGoal()}>
          <View style={{flex: 7, borderTopRightRadius: 5, borderBottomRightRadius: 5, justifyContent: 'center'}}>
            <Text style={{fontFamily: Fonts.type.book, letterSpacing: 1, fontSize: 20, color: '#050D13'}}>
              Set Investment Goals
            </Text>
            <Text style={{fontFamily: Fonts.type.book, fontSize: 16, color: 'rgba(5, 13, 19, 0.5)', marginTop: 5}}>
              Plan and achieve for the future.
            </Text>
          </View>
          <View style={{flex: 3, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 5, borderBottomLeftRadius: 5}}>
            <Image source={require('../../../Img/assets/dashboard/manComp2/manComp2.png')} style={{height: 51, width: 62}} />
          </View>
          <Icon name='angle-right' type='font-awesome' color='#000' />
        </TouchableOpacity>
      </View>
    )
  }

  renderStartPortfolio () {
    return (
      <View style={{paddingHorizontal: 5}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Start a fund to achieve Goals'}
          accessibilityRole={'button'}
          style={{flexDirection: 'row', height: 87, paddingLeft: 18, paddingRight: 16, marginBottom: 5, backgroundColor: '#FFF', borderRadius: 5}}
          onPress={() => this.addnewInvestment()}>
          <View style={{flex: 7, borderTopRightRadius: 5, borderBottomRightRadius: 5, justifyContent: 'center'}}>
            <Text style={{fontFamily: Fonts.type.book, letterSpacing: 1, fontSize: 20, color: '#050D13'}}>
              Build a Portfolio
            </Text>
            <Text style={{fontFamily: Fonts.type.book, fontSize: 16, color: 'rgba(5, 13, 19, 0.5)', marginTop: 5}}>
              Start with as little as $5.
            </Text>
          </View>
          <View style={{flex: 3, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 5, borderBottomLeftRadius: 5}}>
            <Image source={require('../../../Img/assets/dashboard/swingBull/swingBull.png')} style={{height: 62, width: 63}} />
          </View>
          <Icon name='angle-right' type='font-awesome' color='#000' />
        </TouchableOpacity>
      </View>
    )
  }

  renderBlankGoalState () {
    const {goalsPresent, investmentPresent} = this.props
    return (
      <View style={{backgroundColor: '#FFF', paddingVertical: 20}}>
        {this.renderStartGoal()}
        {this.renderStartPortfolio()}
      </View>
    )
  }

  // ------------------------------------------------------------
  // Debug mode

  renderTempButton () {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={'Open Now'}
        accessibilityRole={'button'}
        onPress={() => this.navigateToChildInvesting()}>
        <Text>
          Open Now
        </Text>
      </TouchableOpacity>
    )
  }

  renderCurrentValue () {
    const {child} = this.props
    let currentValue = (child && child[CHILD_ENTITIES.PORTFOLIO] && child[CHILD_ENTITIES.PORTFOLIO][CHILD_ENTITIES.CURRENT_VALUE]) || 9
    return (
      <View style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', marginHorizontal: 16, marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Current Value
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000', marginTop: 5}}>
          {currentValue}
        </Text>
      </View>
    )
  }

  renderGoalDetails () {
    const {goals} = this.props
    return (
      <View style={{backgroundColor: 'transparent', paddingHorizontal: 16}}>

        {goals && Object.values(goals).map(goal => {
          return this.renderGoalDetail(goal[GOAL_ENTITIES.NAME], goal[GOAL_ENTITIES.CURRENT_VALUE], goal[GOAL_ENTITIES.PENDING_TRANSFER_AMOUNT], goal[GOAL_ENTITIES.PENDING_WITHDRAWAL_AMOUNT])
        })}

      </View>
    )
  }

  renderInvestmentDetails () {
    const {investments} = this.props
    return (
      <View style={{backgroundColor: 'transparent', paddingHorizontal: 16}}>

        {investments && Object.values(investments).map(i => {
          return this.renderGoalDetail(i[INVESTMENT_ENTITIES.INVESTMENT_NAME], i[INVESTMENT_ENTITIES.CURRENT_VALUE], i[INVESTMENT_ENTITIES.PENDING_TRANSFER_AMOUNT], i[INVESTMENT_ENTITIES.PENDING_WITHDRAWAL_AMOUNT])
        })}

      </View>
    )
  }

  renderGoalDetail (goalName, currentValue, pendingTransfers, pendingWithdrawal) {
    const {child} = this.props
    return (
      <View style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', marginVertical: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 5, borderWidth: 0.5, borderColor: 'gray', shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)'}}>
          Name
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000'}}>
          {goalName}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 3}}>
          Current Value
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000'}}>
          {currentValue}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 3}}>
          Pending Transfers
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000'}}>
          {pendingTransfers}
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 12, color: 'rgb(196, 0, 41)', marginTop: 3}}>
          Pending Withdrawal
        </Text>
        <Text style={{fontFamily: Fonts.type.regular, fontSize: 15, color: '#000'}}>
          {pendingWithdrawal}
        </Text>
      </View>
    )
  }

  inviteFriends = async () => {
    let branchUniversalObject = await branch.createBranchUniversalObject(
      'dashboard_child_view_referral_link',
      {
        title: 'Check this out'
      },
    )
    let {
      channel,
      completed,
      error
    } = await branchUniversalObject.showShareSheet()
  }

  renderInvite () {
    return (
      <TouchableOpacity onPress={this.inviteFriends} style={{backgroundColor: '#FFF', marginHorizontal: 5, borderRadius: 5, marginTop: 5, paddingVertical: 10, alignItems: 'center', paddingLeft: 20, paddingRight: 14, flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../../Img/assets/dashboard/invite/invite.png')} style={{marginRight: 10}} />
          <Text style={{fontFamily: Fonts.type.medium, letterSpacing: 1, fontSize: 16, color: '#050D13'}}>
            Invite your friends
          </Text>
        </View>
        <Icon name='angle-right' type='font-awesome' color='#000' />
      </TouchableOpacity>
    )
  }

  renderDisclaimer () {
    return (
      <View style={{backgroundColor: 'transparent'}}>
        <View style={{backgroundColor: '#FFF', marginBottom: 5, paddingHorizontal: 20, paddingVertical: 12}}>
          <Text style={{fontFamily: Fonts.type.bold, letterSpacing: 0, fontSize: 20, color: '#1C3C70', lineHeight: 25}}>
            Disclaimer
          </Text>
        </View>
        <View style={{backgroundColor: '#FFF', marginHorizontal: 5, paddingHorizontal: 16, borderRadius: 6, paddingVertical: 10}}>
          <Text style={{fontFamily: Fonts.type.book, letterSpacing: 0, fontSize: 15, color: '#050D13', lineHeight: 20}}>
            {`Investments always hold inherent risk.\n\nPast investment performance does not guarantee future performance.\n\nUnderstand any historical and expected returns, and projections, are hypothetical and may not reflect actual performance.`}
          </Text>
        </View>
      </View>
    )
  }

  // ------------------------------------------------------------
  // Core render method

  render () {
    const isX = this.isX || false
    const {debugMode, investments, goals, goalsPresent, investmentPresent} = this.props
    return (
      <View style={{flex: 1}}>
        {/* {this.renderInvite()} */}
        <View style={{marginVertical: 0}}>
          {this.renderInvestments()}
          {this.renderGoals()}
          {this.renderDisclaimer()}
        </View>

        {this.renderInvestmentComponent()}
        {this.renderGoalComponent()}
        {this.renderShowInvestment()}
        {this.renderShowGoal()}

        {debugMode && this.renderCurrentValue()}
        {debugMode && this.renderGoalDetails()}
        {debugMode && this.renderInvestmentDetails()}
      </View>
    )
  }

}

ChildView.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,
  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,
  // first name of child
  firstName: PropTypes.string.isRequired,
  // user id
  userID: PropTypes.string.isRequired,
  // goals object
  goals: PropTypes.array.isRequired,
  // investments
  investments: PropTypes.array.isRequired,
  // investment images
  investmentImages: PropTypes.object.isRequired,
  // investment images
  goalImages: PropTypes.object.isRequired,
  // child's unique id
  childID: PropTypes.string.isRequired,
  // child
  child: PropTypes.object.isRequired,
  // debug mode
  debugMode: PropTypes.bool.isRequired,
  // image url
  childImageUrl: PropTypes.string,
  // last updated time
  lastUpdatedTime: PropTypes.string.isRequired,
  // goals present
  goalsPresent: PropTypes.bool.isRequired,
  // investments proesent
  investmentPresent: PropTypes.bool.isRequired
}

// ========================================================
// Export
// ========================================================

export default ChildView
