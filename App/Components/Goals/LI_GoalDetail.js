/* eslint-disable no-trailing-spaces,camelcase,no-unused-vars */
/**
 * Created by demon on 26/10/18.
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
  Alert,
  StatusBar,
  FlatList,
  Modal,
  LayoutAnimation,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Animated, AsyncStorage
}
  from 'react-native'
import {reduxForm}
  from 'redux-form'
import { CachedImage }
  from 'react-native-cached-image'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import CustomListView
  from '../Utility/CustomListView'
import {Icon}
  from 'react-native-elements'
import { connect }
  from 'react-redux'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, CUSTOM_LIST_ENTITIES, DEVICE_LOGICAL_RESOLUTION, getFrequencyLongTitle, getPortfolio, getPortfolioInternalID}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import LinearGradient
  from 'react-native-linear-gradient'
import Avatar
  from '../../Containers/Utility/Avatar'
import { analytics }
  from '../../Config/AppConfig'
import {events}
  from '../../Utility/Mapper/Tracking'
import {formatPrice, formatFloatPrice}
  from '../../Utility/Transforms/Converter'
import CustomNav
  from '../../Containers/Common/CustomNav'
var Spinner = require('react-native-spinkit')
import _
  from 'lodash'
import Goal
  from '../../Containers/Goals/SelectGoal.js'
import moment
  from 'moment'
import ShadowedContainer
  from '../../CommonComponents/ShadowedContainer'
import Colors from '../../Themes/Colors'

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

class LI_GoalDetail extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentDidMount () {
    const {goal, userID} = this.props
    let goalName = (goal && goal[GOAL_ENTITIES.NAME])
    let balance = (goal && goal[GOAL_ENTITIES.BALANCE])
    let target = (goal && goal[GOAL_ENTITIES.GOAL_AMOUNT])
    let recurringFrequency = (goal && goal[GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY])
    let portfolioRisk = (goal && goal[GOAL_ENTITIES.PORTFOLIO_RISK])
    let portfolio = getPortfolio(portfolioRisk)
    let portfolioName = portfolio.NAME

    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.GOAL_OPENED,
      properties: {
        name: goalName,
        balance: balance,
        recurring_type: recurringFrequency,
        amount_goal: target,
        portfolio_type: portfolioName
      }
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handler

  buyInvestment () {
    const {handleLocalAction, localActions, userID, childID, goal, goalID, navigator} = this.props
    let recurringAmount = (goal && goal[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT])
    handleLocalAction({type: recurringAmount ? localActions.BUY_INVESTMENT : localActions.SET_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    let goalName = (goal && goal[GOAL_ENTITIES.NAME])
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.GOAL_TOPUP_CLICK,
      properties: {
        name: goalName
      }
    })
    // *********** Log Analytics ***********
  }
  sellInvestment () {
    const {handleLocalAction, localActions, userID, childID, goal, goalID, navigator} = this.props
    handleLocalAction({type: localActions.SELL_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    let goalName = (goal && goal[GOAL_ENTITIES.NAME])
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.GOAL_WITHDRAW_CLICK,
      properties: {
        name: goalName
      }
    })
    // *********** Log Analytics ***********
  }
  editRecurring () {
    const {handleLocalAction, localActions, childID, goalID, navigator} = this.props
    handleLocalAction({type: localActions.EDIT_RECURRING, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }
  editGoal () {
    const {handleLocalAction, localActions, childID, goalID, navigator} = this.props
    handleLocalAction({type: localActions.EDIT_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderTopMargin () {
    return (
      <View style={{height: 30, alignItems: 'center', paddingTop: 15, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <View style={{height: 7, width: 125, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 20}} />
      </View>
    )
  }

  renderBuySellButton () {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 32, marginTop: 15}}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Top up'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            width: 140,
            marginRight: 30,
            backgroundColor: '#4EC2D1',
            shadowOpacity: 0.15,
            shadowRadius: 10,
            shadowOffset: {height: 10, width: 0}
          }}
          onPress={_.debounce(_.bind(() => this.buyInvestment(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>
            Top-up
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Withdraw'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            width: 140,
            backgroundColor: '#F0595C',
            shadowOpacity: 0.15,
            shadowRadius: 10,
            shadowOffset: {height: 10, width: 0}
          }}
          onPress={_.debounce(_.bind(() => this.sellInvestment(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>
            Withdraw
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderBoughtHeader () {
    const {goal, firstName, backdropURL, navigator} = this.props
    const {width} = Dimensions.get('window')
    let goalName = (goal && goal[GOAL_ENTITIES.NAME])
    let balance = (goal && goal[GOAL_ENTITIES.BALANCE])
    let growthValue = (goal && goal[GOAL_ENTITIES.GROWTH_IN_VALUE])
    let growthPercentage = (goal && goal[GOAL_ENTITIES.GROWTH_IN_PERCENTAGE])
    let target = (goal && goal[GOAL_ENTITIES.GOAL_AMOUNT])

    let growthColor = (growthValue && growthValue < 0) ? '#F0595C' : '#4EC2D1'
    let heading = firstName + '\'s Goals'

    let progress = ((target !== 0) && (balance / target)) || 0
    progress = (progress === 0) ? 0.05 : progress
    let remaining = 1 - progress

    let toGo = (target - balance)

    return (
      <View style={{backgroundColor: '#FFF', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        {
          backdropURL && <CachedImage source={{uri: backdropURL}} resizeMode='cover' style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: undefined, width: undefined}} />
        }
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)'}} />
        {this.renderTopMargin()}
        <CustomNav navigator={navigator} leftButtonPresent titleStyle={{color: '#FFF'}} leftButtonCloseModal leftButtonIcon='clear' leftFoo={() => this.props.popFunc()} popManually dropTopMargin titlePresent title={heading} />

        <Text style={{marginTop: 13, fontFamily: Fonts.type.bold, fontSize: 22, color: '#FFF', textAlign: 'center'}}>
          {goalName}
        </Text>

        <Text style={{marginTop: 10, fontFamily: Fonts.type.medium, textAlign: 'center', fontSize: 10, letterSpacing: 1, color: '#F4F4F4'}}>
          BALANCE
        </Text>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 26, color: '#FFF', textAlign: 'center'}}>
          {balance && formatPrice(balance)}
        </Text>

        <Text style={{marginTop: 10, fontFamily: Fonts.type.medium, textAlign: 'center', fontSize: 10, letterSpacing: 1, color: '#F4F4F4'}}>
          EARNINGS
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 7}}>
          <View style={{backgroundColor: growthColor, minWidth: 70, height: 25, justifyContent: 'center', alignItems: 'center', marginRight: 5, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 5}}>
            <Text style={{fontFamily: Fonts.type.medium, textAlign: 'center', fontSize: 12, color: '#FFF'}}>
              {growthValue && formatFloatPrice(growthValue)}
            </Text>
          </View>
          <View style={{backgroundColor: growthColor, minWidth: 70, paddingVertical: 3, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, borderRadius: 5}}>
            <Text style={{fontFamily: Fonts.type.medium, textAlign: 'center', fontSize: 12, color: '#FFF'}}>
              {growthPercentage}%
            </Text>
          </View>
        </View>

        <View style={{marginHorizontal: 32}}>
          <View style={{flexDirection: 'row', width: (width - 64), padding: 1, backgroundColor: '#FFF', height: 10, borderRadius: 10, marginTop: 20}}>
            <View style={{flex: progress, borderRadius: 10, backgroundColor: '#4EC2D1'}} />
            <View style={{flex: remaining}} />
          </View>
          <Text style={{fontFamily: Fonts.type.book, marginTop: 5, fontSize: 12, color: '#FFF', textAlign: 'right'}}>
            {toGo && formatPrice(toGo)} of {target && formatPrice(target)} to go
          </Text>
        </View>

        {this.renderBuySellButton()}

      </View>
    )
  }

  renderEditPanel () {
    const {goal, backdropURL, firstName} = this.props

    let goalName = (goal && goal[GOAL_ENTITIES.NAME])
    let balance = (goal && goal[GOAL_ENTITIES.BALANCE])
    let growthValue = (goal && goal[GOAL_ENTITIES.GROWTH_IN_VALUE])
    let growthPercentage = (goal && goal[GOAL_ENTITIES.GROWTH_IN_PERCENTAGE])
    let target = (goal && goal[GOAL_ENTITIES.GOAL_AMOUNT])

    let portfolioRisk = (goal && goal[GOAL_ENTITIES.PORTFOLIO_RISK])
    let portfolio = getPortfolio(portfolioRisk)

    let recurringAmount = (goal && goal[GOAL_ENTITIES.GOAL_RECURRING_AMOUNT])
    let recurringFrequency = (goal && goal[GOAL_ENTITIES.GOAL_RECURRING_FREQUENCY])
    let recurringNext = (goal && goal[GOAL_ENTITIES.GOAL_RECURRING_NEXT_DATE])
    let freqString = getFrequencyLongTitle(recurringFrequency)
    let recurringString = recurringAmount ? (formatPrice(recurringAmount) + ' ' + freqString) : 'None'
    return (
      <View style={{paddingHorizontal: 20, paddingTop: 10}}>

        <Text style={{marginTop: 5, fontFamily: Fonts.type.medium, fontSize: 10, letterSpacing: 1, color: '#505050'}}>
          EDIT
        </Text>

        {this.renderEditCube('NAME', goalName)}

        {recurringAmount && this.renderEditCube('RECURRING INVESTMENT', recurringString, 'editRecurring', recurringNext)}

        {this.renderEditCube('TARGET', (target && formatPrice(target)), 'editGoal')}

        {this.renderEditCube('TYPE OF PORTFOLIO', (portfolio && portfolio.NAME), undefined)}

      </View>
    )
  }

  renderEditCube (name, value, action, subString) {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', marginTop: 10, paddingHorizontal: 15, paddingTop: 13, paddingBottom: 10, borderWidth: 0, borderRadius: 10, shadowOpacity: 0.3, shadowRadius: 3, shadowOffset: {width: 2, height: 2}}}>
        <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: '#FFF', paddingBottom: 10}}>
          <Text style={{marginTop: 5, fontFamily: Fonts.type.medium, fontSize: 10, letterSpacing: 1, color: '#505050'}}>
            {name}
          </Text>
          <View style={{marginTop: 9}}>
            <Text style={{fontFamily: Fonts.type.book, fontSize: 18, color: '#1C3C70'}}>
              {value}
            </Text>
          </View>
          {
            subString &&
            <View style={{position: 'absolute', left: 0, right: 15, bottom: 0}}>
              <Text style={{fontFamily: Fonts.type.book, fontSize: 10, color: '#4EC2D1'}}>
                Next occurrence {'\t'} {subString}
              </Text>
            </View>
          }
        </View>
        {
          action &&
          <View style={{backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center'}}>
            <ShadowedContainer size={26} accessible accessibilityLabel={'Pop screen'} accessibilityRole={'button'} onPress={() => action === 'editGoal' ? this.editGoal() : this.editRecurring()}>
              <Icon name='edit-3' type='feather' color='#9FB0C5' size={11} />
            </ShadowedContainer>
          </View>
        }
      </View>
    )
  }

  // --------------------------------------------------------
  // Render Core Component

  render () {
    return (
      <View style={{flex: 1}}>
        {this.renderBoughtHeader()}
        <StatusBar barStyle='dark-content' />
        <ScrollView contentContainerStyle={{paddingBottom: 10}} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            accessible
            accessibilityLabel={'container'}
            accessibilityRole={'button'}>
            <TouchableWithoutFeedback
              accessible
              accessibilityLabel={'contentContainer'}
              accessibilityRole={'button'}>
              {this.renderEditPanel()}
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

}

LI_GoalDetail.propTypes = {
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

  // firstname
  firstName: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // goal id
  goalID: PropTypes.string.isRequired,

  // goal
  goal: PropTypes.object.isRequired,

  // push func
  pushFunc: PropTypes.func,

  // backdrop url
  backdropURL: PropTypes.string,

  // pop func
  popFunc: PropTypes.func
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(LI_GoalDetail))

export default Screen
