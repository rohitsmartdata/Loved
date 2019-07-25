/* eslint-disable no-unused-vars,no-multi-spaces,no-trailing-spaces,indent,no-undef,operator-linebreak,spaced-comment,padded-blocks */
/**
 * Created by viktor on 3/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, Image, ScrollView, Dimensions, LayoutAnimation, TouchableOpacity}
  from 'react-native'
import {change, reset, reduxForm}
  from 'redux-form'
import {Icon, Slider}
  from 'react-native-elements'
import CustomNav
  from '../../Containers/Common/CustomNav'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES, FREQUENCY, DEVICE_LOGICAL_RESOLUTION, getFrequencyTitle}
  from '../../Utility/Mapper/Common'
import {formatPrice}
  from '../../Utility/Transforms/Converter'
import { connect }
  from 'react-redux'
import { CHILD_ENTITIES as CHILD_ENTITES }
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import moment
  from 'moment'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import _
  from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

const MINIMUM_RECURRING_VALUE = 5
const MAXIMUM_RECURRING_VALUE = 250
const RECURRING_STEP = 5

const portfolioConstant = {
  CASH: '04',
  CONSERVATIVE: '03',
  MODERATE: '02',
  AGGRESSIVE: '01'
}

const computeSuggestedPortfolio = (riskScore, year) => {
  if (riskScore && year) {
    if (year === 1 || year <= 2) {

      return portfolioConstant.CASH

    } else if (year > 2 && year <= 3) {

      if (riskScore === 100) {
        return portfolioConstant.CONSERVATIVE
      } else return portfolioConstant.CASH

    } else if (year > 3 && year <= 5) {

      if (riskScore === 100) {
        return portfolioConstant.MODERATE
      } else if (riskScore > 75) {
        return portfolioConstant.CONSERVATIVE
      } else return portfolioConstant.CASH

    } else if (year > 5 && year <= 7) {

      if (riskScore === 100) {
        return portfolioConstant.AGGRESSIVE
      } else if (riskScore > 7) {
        return portfolioConstant.MODERATE
      } else return portfolioConstant.CONSERVATIVE

    } else if (year > 7 && year <= 10) {

      if (riskScore > 75) {
        return portfolioConstant.AGGRESSIVE
      } else if (riskScore >= 50) {
        return portfolioConstant.MODERATE
      } else return portfolioConstant.CONSERVATIVE

    } else if (year > 10 && year <= 15) {

      if (riskScore >= 50) {
        return portfolioConstant.AGGRESSIVE
      } else return portfolioConstant.MODERATE

    } else if (year > 15 && year <= 21) {
      return portfolioConstant.AGGRESSIVE
    } else return portfolioConstant.CASH
  }
}

const getRiskIndex = (risk) => {
  switch (risk) {
    case '01':
      return 3
    case '02':
      return 2
    case '03':
      return 1
    case '04':
      return 0
    default: return 2
  }
}

// ========================================================
// Core Component
// ========================================================

class GoalAmount extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _ageActive: false,
      goalAmount: props.goalAmount,
      recurringAmount: props.recurringAmount,
      recurringFrequency: props.recurringFrequency,
      portfolioRisk: '02'
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isNormal = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE.width
  }

  // --------------------------------------------------------
  // lifecycle methods

  componentWillMount () {
    const {portfolioRisk, recurringFrequency, recurringAmount, age, goalMaturityAge} = this.props
    this.updateRecurringAmount(this.props.recurringAmount)
    this.updateRecurringType(this.props.recurringFrequency)
    this.updateGoalMaturityAge(goalMaturityAge, true)
  }

  componentDidMount () {
    const {duration, userID, goalName} = this.props
    this.reflectGoalAmount(duration)
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.DESIRE_AMOUNT,
      properties: {
        desire: goalName
      }
    })
    // *********** Log Analytics ***********
  }

  componentWillReceiveProps (props) {
    this.setState({
      goalAmount: props.goalAmount,
      recurringAmount: props.recurringAmount,
      recurringFrequency: props.recurringFrequency
    })
  }

  // --------------------------------------------------------
  // action handlers

  _setAgeActive () {
    this.setState({
      _ageActive: true
    })
  }

  _setRecurringActive () {
    this.setState({
      _ageActive: false
    })
  }

  updateField (action, field, value) {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: action, payload: {form: FORM_TYPES.ADD_GOAL, field: field, value: value}})
  }

  updateRecurringAmount ($) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_RECURRING_AMOUNT, GOAL_ENTITIES.RECURRING_AMOUNT, parseInt($))
  }

  updateGoalAmount ($) {
    const {localActions} = this.props
    this.updateField(localActions.UPDATE_GOAL_AMOUNT, GOAL_ENTITIES.GOAL_AMOUNT, Math.floor($))
  }

  updateGoalDuration (d, updateRisk = false) {
    this.reflectGoalAmount(d)
    const {localActions, riskScore} = this.props
    this.updateField(localActions.UPDATE_GOAL_DURATION, GOAL_ENTITIES.DURATION, d)
    if (updateRisk) {
      let riskSuggested = computeSuggestedPortfolio(riskScore, d)
      let riskIndex = getRiskIndex(riskSuggested)
      this.updatePortfolioRisk(riskIndex)
    }
  }

  updatePortfolioRisk (index) {
    const {handleLocalAction, localActions} = this.props
    let pRisk
    switch (index) {
      case 0: pRisk = '04'
            break
      case 1: pRisk = '03'
            break
      case 2: pRisk = '02'
            break
      case 3: pRisk = '01'
            break
      default: pRisk = '02'
    }
    LayoutAnimation.linear()
    this.setState({portfolioRisk: pRisk})
    handleLocalAction({type: localActions.UPDATE_RISK, payload: {form: FORM_TYPES.ADD_GOAL, field: GOAL_ENTITIES.PORTFOLIO_RISK, value: pRisk}})
  }

  updateGoalAmountForecast ($) {
    const {localActions} = this.props
    this.updateGoalAmount($)
    this.updateField(localActions.UPDATE_GOAL_AMOUNT_FORECAST, GOAL_ENTITIES.GOAL_AMOUNT_FORECAST, $)
  }

  updateRecurringType (frequency) {
    const {localActions, recurringAmount, recurringFrequency} = this.props
    this.updateField(localActions.UPDATE_RECURRING_TYPE, GOAL_ENTITIES.RECURRING_FREQUENCY, frequency)
  }

  updateGoalMaturityAge (maturityAge, updateRisk = false) {
    const {localActions, age} = this.props
    this.updateField(localActions.UPDATE_GOAL_MATURITY_AGE, GOAL_ENTITIES.GOAL_MATURITY_AGE, maturityAge)
    const goalDuration = (maturityAge - age)
    this.updateGoalDuration(goalDuration, updateRisk)
  }

  reflectGoalAmount (duration) {
    const {recurringAmount, recurringFrequency} = this.state
    const {growthRate} = this.props
    let $ = recurringAmount
    const targetDate = moment().add(duration, 'y')
    const currentDate = moment()
    const days = targetDate.diff(currentDate, 'days')
    let diff
    switch (recurringFrequency) {
      case FREQUENCY.ONE_WEEK:
        diff = days / 7
        break
      case FREQUENCY.FORTNIGHT:
        diff = days / 14
        break
      case FREQUENCY.ONE_MONTH:
        diff = days / 30
        break
      default:
        diff = days / 7
    }
    const contributions = $ * diff

    let a = Math.pow((1 + growthRate), diff)
    let b = a - 1
    let c = b / growthRate
    let d = $ * c
    let returns = d - contributions
    let goalAmount = contributions + returns

    this.updateGoalAmountForecast(goalAmount)
  }

  next () {
    const {handleLocalAction, localActions, isPlaidLinked, isChildSSNAdded, userID, childID, goalName, goalAmount, duration, riskScore, recurringAmount, recurringFrequency, portfolioRisk, navigator} = this.props
    let suggestion = computeSuggestedPortfolio(riskScore, duration)
    handleLocalAction({type: localActions.ADD_GOAL, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITES.CHILD_ID]: childID, [GOAL_ENTITIES.NAME]: goalName, [GOAL_ENTITIES.GOAL_AMOUNT]: goalAmount, [GOAL_ENTITIES.RECURRING_AMOUNT]: recurringAmount, [GOAL_ENTITIES.RECURRING_FREQUENCY]: recurringFrequency, [GOAL_ENTITIES.DURATION]: duration, [GOAL_ENTITIES.PORTFOLIO_RISK]: portfolioRisk, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.IS_PLAID_LINKED]: isPlaidLinked, [GOAL_ENTITIES.SUGGESTED_RISK]: suggestion, [CHILD_ENTITES.IS_SSN_ADDED]: isChildSSNAdded})
  }
  skip () {
    const {handleLocalAction, localActions, userID, childID, goalID, navigator} = this.props
    handleLocalAction({type: localActions.SKIP, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator, form: FORM_TYPES.ADD_GOAL})
  }
  showDisclaimer () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_DISCLAIMER, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // child components

  renderRecurringAmount () {
    const {_ageActive} = this.state
    const _recurringActive = !_ageActive
    const {recurringAmount, childDOB} = this.props
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`I'll invest ${recurringAmount}`}
        accessibilityRole={'button'}
        onPress={() => this._setRecurringActive()} style={{justifyContent: 'center'}}>
        <Text style={{fontFamily: Fonts.type.bold, opacity: _recurringActive ? 1 : 0.7, fontSize: 16, color: '#FFF', backgroundColor: 'transparent'}}>
          I'll invest
        </Text>
        <Text style={{top: 5, flex: 4, lineHeight: 50, fontFamily: Fonts.type.bold, fontSize: 48, opacity: _recurringActive ? 1 : 0.7, color: '#FFF', backgroundColor: 'transparent'}}>
          ${recurringAmount}
        </Text>
      </TouchableOpacity>
    )
  }

  renderRecurringType () {
    const {_ageActive} = this.state
    const {recurringFrequency} = this.props
    const title = (recurringFrequency && getFrequencyTitle(recurringFrequency)) || 'Per Week'
    if (_ageActive) {
      return (
        <View style={{...styles.screen.h2.containerStyle, marginTop: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
            <TouchableOpacity
              accessible
              accessibilityLabel={title}
              accessibilityRole={'button'}
              onPress={() => this.updateRecurringType(FREQUENCY.ONE_WEEK)} style={{flex: 1, alignItems: 'flex-start'}}>
              <Text style={{fontFamily: Fonts.type.regular, opacity: 0.7, fontSize: 18, color: '#FFF', backgroundColor: 'transparent'}}>
                {title}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return (
        <View style={{...styles.screen.h2.containerStyle, marginTop: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
            <TouchableOpacity
              accessible
              accessibilityLabel={'Per week'}
              accessibilityRole={'button'}
              onPress={() => this.updateRecurringType(FREQUENCY.ONE_WEEK)} style={{flex: 1, alignItems: 'flex-start'}}>
              <Text style={{fontFamily: recurringFrequency === FREQUENCY.ONE_WEEK ? Fonts.type.bold : Fonts.type.regular, opacity: recurringFrequency === FREQUENCY.ONE_WEEK ? 1 : 0.7, fontSize: 18, color: '#FFF', backgroundColor: 'transparent'}}>
                Per Week
              </Text>
            </TouchableOpacity>
            {
              !_ageActive
              &&
              <TouchableOpacity
                accessible
                accessibilityLabel={'per 2 week'}
                accessibilityRole={'button'}
                onPress={() => this.updateRecurringType(FREQUENCY.FORTNIGHT)} style={{flex: 1, alignItems: 'center'}}>
                <Text style={{fontFamily: recurringFrequency === FREQUENCY.FORTNIGHT ? Fonts.type.bold : Fonts.type.regular, opacity: recurringFrequency === FREQUENCY.FORTNIGHT ? 1 : 0.7, fontSize: 18, color: '#FFF', backgroundColor: 'transparent'}}>
                  Per 2 Weeks
                </Text>
              </TouchableOpacity>
            }
            {
              !_ageActive
              &&
              <TouchableOpacity
                accessible
                accessibilityLabel={'Per Month'}
                accessibilityRole={'button'}
                onPress={() => this.updateRecurringType(FREQUENCY.ONE_MONTH)} style={{flex: 1, alignItems: 'flex-end'}}>
                <Text style={{fontFamily: recurringFrequency === FREQUENCY.ONE_MONTH ? Fonts.type.bold : Fonts.type.regular, opacity: recurringFrequency === FREQUENCY.ONE_MONTH ? 1 : 0.7, fontSize: 18, color: '#FFF', backgroundColor: 'transparent'}}>
                  Per Month
                </Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      )
    }
  }

  renderSlider () {
    const {_ageActive} = this.state
    const {goalMaturityAge, age, duration, recurringAmount} = this.props
    const minValue = age + 1
    const maxValue = 21
    const min = _ageActive ? minValue : MINIMUM_RECURRING_VALUE
    const max = _ageActive ? maxValue : MAXIMUM_RECURRING_VALUE
    const amount = _ageActive ? goalMaturityAge : recurringAmount
    const step = _ageActive ? 1 : RECURRING_STEP

    return (
      <View style={{bottom: 10}}>
        <Slider
          accessible
          accessibilityLabel={'Set Age'}
          accessibilityRole={'adjustable'}
          minimumValue={min}
          maximumTrackTintColor='rgba(0, 0, 0, 0.2)'
          minimumTrackTintColor='#50E3C2'
          maximumValue={max}
          step={step}
          value={amount}
          trackStyle={{
            height: 20,
            backgroundColor: 'white',
            borderColor: '#9a9a9a'
          }}
          thumbStyle={{
            width: 39,
            height: 39,
            top: 29,
            borderRadius: 50,
            backgroundColor: '#FFF',
            shadowOpacity: 0.8,
            shadowOffset: {width: 1, height: 1},
            shadowRadius: 1
          }}
          style={{width: _ageActive ? '100%' : '99.9%'}}
          onValueChange={$ => requestAnimationFrame(() => _ageActive ? this.updateGoalMaturityAge($) : this.updateRecurringAmount($))} />
      </View>
    )
  }

  renderDecisionButtons () {
    const isX = this.isX || false
    const {isProcessing} = this.props
    return (
      <View style={{position: 'absolute', bottom: isX ? 20 : 10, left: 0, right: 0}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          disabled={isProcessing} style={{...styles.bottomNavigator.containerStyle}} onPress={_.debounce(_.bind(() => this.next(), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Desclaimer'}
          accessibilityRole={'button'}
          disabled={isProcessing} style={{backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', marginTop: 10}} onPress={_.debounce(_.bind(() => this.showDisclaimer(), this), 500, {'leading': true, 'trailing': false})}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 14.5, color: '#10427E'}}>Disclaimer</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderAgeSelector () {
    const {_ageActive} = this.state
    const {goalMaturityAge} = this.props
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`until they're Age ${goalMaturityAge}`}
        accessibilityRole={'button'}
        onPress={() => this._setAgeActive()}>
        <Text style={{color: '#FFF', opacity: _ageActive ? 1 : 0.7, textAlign: 'right', fontFamily: Fonts.type.black, fontSize: 16}}>
          until they're
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#FFF', opacity: _ageActive ? 1 : 0.7, fontFamily: Fonts.type.black, fontSize: 40}}>
            Age {goalMaturityAge}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderRiskPanel () {
    const {goalAmountForecast, rate} = this.props
    const {portfolioRisk} = this.state
    const {width} = Dimensions.get('window')
    const growth = (rate && (rate * 100)) || 0
    let imageURL
    switch (portfolioRisk) {
      case '04':
        imageURL = require('../../../Img/newIcons/aggressiveLine.png')
        break
      case '03':
        imageURL = require('../../../Img/newIcons/moderateLine.png')
        break
      case '02':
        imageURL = require('../../../Img/newIcons/conservativeLine.png')
        break
      case '01':
        imageURL = require('../../../Img/newIcons/cashLine.png')
        break
      default:
        break
    }

    let showAmount = goalAmountForecast && parseInt(goalAmountForecast)
    return (
      <View style={{flex: 1, backgroundColor: 'transparent'}}>
        {
          growth
          &&
          <Text style={{fontSize: 16.5, color: '#000', fontFamily: Fonts.type.bold}}>
            that’s forecast to grow at {growth}% p.a.
          </Text>
        }
        <View style={{flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center'}}>
          <Text style={{fontSize: 16.5, color: '#000', fontFamily: Fonts.type.bold}}>
            to {' '}
          </Text>
          <Text style={{fontSize: 40.5, color: '#000', fontFamily: Fonts.type.bold}}>
            {showAmount && formatPrice(showAmount)}
          </Text>
        </View>
        <Image source={imageURL} style={{position: 'absolute', bottom: 0, left: 0, width: width - 32}} />
      </View>
    )
  }

  renderPortfolioPanel () {
    const {portfolioRisk} = this.state
    const {duration, riskScore} = this.props
    let suggestion = computeSuggestedPortfolio(riskScore, duration)
    let totalRisk = 0
    portfolioRisk === '01' && (totalRisk += 1)
    portfolioRisk === '02' && (totalRisk += 1)
    portfolioRisk === '03' && (totalRisk += 1)
    portfolioRisk === '04' && (totalRisk += 1)
    return (
      <View style={{}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 16.5, color: '#000', backgroundColor: 'transparent', marginBottom: 15}}>
          into the recommended portfolio
        </Text>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 100}}>

          <TouchableOpacity
            accessible
            accessibilityLabel={'Cash'}
            accessibilityRole={'button'}
            onPress={() => this.updatePortfolioRisk(0)}>
            <Text style={{fontFamily: Fonts.type.bold, textAlign: 'center', color: portfolioRisk === '04' ? '#000' : '#10427E', fontSize: 12.5, backgroundColor: 'transparent'}}>
              Cash
            </Text>
            <View style={{marginTop: 5, alignItems: 'center', borderRadius: 18, justifyContent: 'space-around', paddingTop: 10, flex: 1, height: 72, width: 80, backgroundColor: portfolioRisk === '04' ? '#10427E' :  'rgba(255, 255, 255, 0.85)'}}>
              <Image source={portfolioRisk === '04' ? require('../../../Img/iconImages/cashEnabled.png') : require('../../../Img/iconImages/cashDisabled.png')} />
              {
                suggestion === '04'
                ?
                  <View style={{alignItems: 'center'}}>
                    <Image source={portfolioRisk === '04' ? require('../../../Img/iconImages/tickWhite.png') : require('../../../Img/iconImages/tickBlue.png')} />
                    <Text style={{fontFamily: Fonts.type.bold, color: portfolioRisk === '04' ? '#FFF' : '#10427E', fontSize: 10, backgroundColor: 'transparent'}}>
                      Suggested
                    </Text>
                  </View>
                :
                  <Text style={{fontFamily: Fonts.type.bold, color: portfolioRisk === '04' ? '#FFF' : '#10427E', fontSize: 10, backgroundColor: 'transparent'}}>
                    Lowest Risk
                  </Text>
              }
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            accessible
            accessibilityLabel={'Conservative'}
            accessibilityRole={'button'}
            onPress={() => this.updatePortfolioRisk(1)}>
            <Text style={{fontFamily: Fonts.type.bold, textAlign: 'center', color: portfolioRisk === '03' ? '#000' : '#10427E', fontSize: 12.5, backgroundColor: 'transparent'}}>
              Conservative
            </Text>
            <View style={{marginTop: 5, alignItems: 'center', borderRadius: 18, justifyContent: 'space-around', paddingTop: 10, flex: 1, height: 72, width: 80, backgroundColor: portfolioRisk === '03' ? '#10427E' :  'rgba(255, 255, 255, 0.85)'}}>
              <Image source={portfolioRisk === '03' ? require('../../../Img/iconImages/conservativeEnabled.png') : require('../../../Img/iconImages/conservativeDisabled.png')} />
              {
                suggestion === '03'
                ?
                  <View style={{alignItems: 'center'}}>
                    <Image source={portfolioRisk === '03' ? require('../../../Img/iconImages/tickWhite.png') : require('../../../Img/iconImages/tickBlue.png')} />
                    <Text style={{fontFamily: Fonts.type.bold, color: portfolioRisk === '03' ? '#FFF' : '#10427E', fontSize: 10, backgroundColor: 'transparent'}}>
                      Suggested
                    </Text>
                  </View>
                :
                  <Text style={{fontFamily: Fonts.type.bold, color: portfolioRisk === '03' ? '#FFF' : '#10427E', fontSize: 10, backgroundColor: 'transparent'}}>
                    Lower Risk
                  </Text>
              }
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            accessible
            accessibilityLabel={'Moderate'}
            accessibilityRole={'button'}
            onPress={() => this.updatePortfolioRisk(2)}>
            <Text style={{fontFamily: Fonts.type.bold, textAlign: 'center', color: portfolioRisk === '02' ? '#000' : '#10427E', fontSize: 12.5, backgroundColor: 'transparent'}}>
              Moderate
            </Text>
            <View style={{marginTop: 5, alignItems: 'center', borderRadius: 18, justifyContent: 'space-around', paddingTop: 10, flex: 1, height: 72, width: 80, backgroundColor: portfolioRisk === '02' ? '#10427E' :  'rgba(255, 255, 255, 0.85)'}}>
              <Image source={portfolioRisk === '02' ? require('../../../Img/iconImages/moderateEnabled.png') : require('../../../Img/iconImages/moderateDisabled.png')} />
              {
                suggestion === '02'
                ?
                  <View style={{alignItems: 'center'}}>
                    <Image source={portfolioRisk === '02' ? require('../../../Img/iconImages/tickWhite.png') : require('../../../Img/iconImages/tickBlue.png')} />
                    <Text style={{fontFamily: Fonts.type.bold, color: portfolioRisk === '02' ? '#FFF' : '#10427E', fontSize: 10, backgroundColor: 'transparent'}}>
                      Suggested
                    </Text>
                  </View>
                :
                  <Text style={{fontFamily: Fonts.type.bold, color: portfolioRisk === '02' ? '#FFF' : '#10427E', fontSize: 10, backgroundColor: 'transparent'}}>
                    Moderate Risk
                  </Text>
              }
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            accessible
            accessibilityLabel={'Aggressive'}
            accessibilityRole={'button'}
            onPress={() => this.updatePortfolioRisk(3)}>
            <Text style={{fontFamily: Fonts.type.bold, textAlign: 'center', color: portfolioRisk === '01' ? '#000' : '#10427E', fontSize: 12.5, backgroundColor: 'transparent'}}>
              Aggressive
            </Text>
            <View style={{marginTop: 5, alignItems: 'center', borderRadius: 18, justifyContent: 'space-around', paddingTop: 10, flex: 1, height: 72, width: 80, backgroundColor: portfolioRisk === '01' ? '#10427E' :  'rgba(255, 255, 255, 0.85)'}}>
              <Image source={portfolioRisk === '01' ? require('../../../Img/iconImages/aggressiveEnabled.png') : require('../../../Img/iconImages/aggressiveDisabled.png')} />
              {
                suggestion === '01'
                ?
                  <View style={{alignItems: 'center'}}>
                    <Image source={portfolioRisk === '01' ? require('../../../Img/iconImages/tickWhite.png') : require('../../../Img/iconImages/tickBlue.png')} />
                    <Text style={{fontFamily: Fonts.type.bold, color: portfolioRisk === '01' ? '#FFF' : '#10427E', fontSize: 10, backgroundColor: 'transparent'}}>
                      Suggested
                    </Text>
                  </View>
                :
                  <Text style={{fontFamily: Fonts.type.bold, color: portfolioRisk === '01' ? '#FFF' : '#10427E', fontSize: 10, backgroundColor: 'transparent'}}>
                    Higher Risk
                  </Text>
              }
            </View>
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  renderCarouselView (img) {
    const {width} = Dimensions.get('window')
    return (
      <View style={{height: 100, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
        <Image source={img} style={{width: width - 50}} />
      </View>
    )
  }

  renderBlockOne () {
    const isNormal = this.isNormal || false
    const isX = this.isX || false
    return (
      <View style={{backgroundColor: 'transparent'}}>
        <View style={{paddingHorizontal: 16, paddingTop: isNormal ? 20 : 40, paddingBottom: isX ? 20 : 0, backgroundColor: '#10427E'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {this.renderRecurringAmount()}
            {this.renderAgeSelector()}
          </View>
          {this.renderRecurringType()}
        </View>
        {this.renderSlider()}
      </View>
    )
  }

  renderBlockTwo () {
    const isNormal = this.isNormal || false
    return (
      <View style={{backgroundColor: 'transparent', paddingHorizontal: 16, bottom: isNormal ? 10 : 0}}>
        {this.renderPortfolioPanel()}
      </View>
    )
  }

  renderBlockThree () {
    return (
      <View style={{backgroundColor: 'transparent', height: 150, paddingHorizontal: 16}}>
        {this.renderRiskPanel()}
      </View>
    )
  }

  // --------------------------------------------------------
  // core component

  render () {
    const {isProcessing, goalName, duration, navigator, popButton, riskScore} = this.props
    this.reflectGoalAmount(duration)
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: 'rgb(255, 205, 0)'}}>
        <CustomNav leftFoo={reset(FORM_TYPES.ADD_GOAL)} navigator={navigator} leftButtonPresent={popButton} titlePresent title={goalName} />
        <ProcessingIndicator isProcessing={isProcessing} />
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={{flex: 1}}
          style={{flex: 1, paddingBottom: 70}}>
          {this.renderBlockOne()}
          <View style={{flex: 1, justifyContent: 'space-around', marginBottom: 15}}>
            {this.renderBlockTwo()}
            {this.renderBlockThree()}
          </View>
        </ScrollView>
        {this.renderDecisionButtons()}
      </View>
    )
  }

}

GoalAmount.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // total amount of the goal
  goalAmount: PropTypes.number.isRequired,

  // is plaid linked already ?
  isPlaidLinked: PropTypes.bool.isRequired,

  // age
  age: PropTypes.number.isRequired,

  // recurring amount
  recurringAmount: PropTypes.number.isRequired,
  // recurring frequency type
  recurringFrequency: PropTypes.string.isRequired,
  // rate of growth (for goal amount)
  growthRate: PropTypes.number.isRequired,
  // goal maturity age
  goalMaturityAge: PropTypes.number.isRequired,

  // goal name
  goalName: PropTypes.string.isRequired,

  userID: PropTypes.string,
  childID: PropTypes.string,
  goalID: PropTypes.string,
  childDOB: PropTypes.string.isRequired,
  portfolioRisk: PropTypes.string.isRequired,
  goalAmountForecast: PropTypes.number,
  rate: PropTypes.number,
  riskScore: PropTypes.number.isRequired,

  // child's firstname
  firstname: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  isProcessing: PropTypes.bool.isRequired,

  // can pop screen
  popButton: PropTypes.bool,

  isChildSSNAdded: PropTypes.bool
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(GoalAmount))

export default Screen
