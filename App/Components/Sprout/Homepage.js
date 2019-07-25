/* eslint-disable no-trailing-spaces,no-unused-vars,no-multi-spaces,no-multi-spaces,operator-linebreak */
/**
 * Created by viktor on 10/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, TouchableOpacity, Image, TouchableWithoutFeedback, Dimensions, ScrollView, Animated, LayoutAnimation }
  from 'react-native'
import styles
  from './Styles/HomepageStyle'
import globalStyle
  from '../../Themes/ApplicationStyles'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES, CUSTOM_LIST_ENTITIES}
  from '../../Utility/Mapper/Common'
import LinearGradient
  from 'react-native-linear-gradient'
import Fonts
  from '../../Themes/Fonts'
import { CircularProgress }
  from 'react-native-circular-progress'
import {formatPrice, limitText}
  from '../../Utility/Transforms/Converter'
import Carousel
  from 'react-native-snap-carousel'
const AnimatedProgress = Animated.createAnimatedComponent(CircularProgress)

// ========================================================
// Core Component
// ========================================================

export const projectionType = {
  ONE_DAY: '1D',
  ONE_WEEK: '1W',
  ONE_MONTH: '1M',
  SIX_MONTH: '6M',
  ONE_YEAR: '1Y',
  ALL: 'ALL'
}

let spaceHeight = 230

class Homepage extends Component {

  // ------------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    this.populateState()
  }

  componentWillMount () {
    const {userID} = this.props
  }

  // ------------------------------------------------------------
  // Action Handlers

  addAccount () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ADD_ACCOUNT, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  showChildView (childID) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_CHILD_VIEW, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  populateState () {
    const {goals, firstItemIndex} = this.props
    let goalBackground = {}
    let goalWidth = {}
    let titleColor = {}
    let amountColor = {}
    let enabled = {}
    goals && goals.map((goal, index) => {
      goalBackground[index] = firstItemIndex === index ? '#F1F1F1' : '#FFF'
      goalWidth[index] = firstItemIndex === index ? 10 : 10
      titleColor[index] = firstItemIndex === index ? '#586871' : '#1B1B1B'
      amountColor[index] = firstItemIndex === index ? '#586871' : '#1B1B1B'
      enabled[index] = firstItemIndex === index
    })

    this.state = {
      totalGoals: goals && goals.length,
      current: firstItemIndex,
      previous: undefined,
      goalBackground: goalBackground,
      goalWidth: goalWidth,
      titleColor: titleColor,
      amountColor: amountColor,
      enabled: enabled,
      charVisible: false
    }
  }

  animate (primary, secondary) {
    const {goalBackground, goalWidth, titleColor, amountColor, enabled} = this.state
    let newGoalBackground = Object.assign(goalBackground, {[primary]: '#F1F1F1', [secondary]: '#FFF'})
    let newGoalWidth = Object.assign(goalWidth, {[primary]: 10, [secondary]: 10})
    let newTitleColor = Object.assign(titleColor, {[primary]: '#586871', [secondary]: '#1B1B1B'})
    let newAmountColor = Object.assign(amountColor, {[primary]: '#586871', [secondary]: '#1B1B1B'})
    let newEnabled = Object.assign(enabled, {[primary]: true, [secondary]: false})
    LayoutAnimation.linear()
    this.setState({goalBackground: newGoalBackground, goalWidth: newGoalWidth, titleColor: newTitleColor, amountColor: newAmountColor, enabled: newEnabled})
  }

  snappingTo (index) {
    this.setState(prevState => {
      this.animate(index, prevState.current)
      return {
        current: index,
        previous: prevState.current
      }
    })
  }

  // ------------------------------------------------------------
  // Child render methods

  renderChildPanel () {
    const {childArr} = this.props
    return (
      <View style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 0, zIndex: 600, marginTop: -25}}>

        {childArr.map(child => {
          let portfolio = child[CHILD_ENTITIES.PORTFOLIO]
          return this.renderChildCard(require('../../../Img/icons/child.png'), child[CHILD_ENTITIES.CHILD_ID], child[CHILD_ENTITIES.FIRST_NAME], (portfolio && portfolio[CHILD_ENTITIES.CURRENT_VALUE]) || 0, (portfolio && portfolio[CHILD_ENTITIES.TOTAL_CONTRIBUTIONS]) || 0, (portfolio && portfolio[CHILD_ENTITIES.GROWTH_IN_VALUE]) || 0, (portfolio && portfolio[CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]) || 0, '', child[CHILD_ENTITIES.LAST_UPDATED_TIME])
        })}

      </View>
    )
  }

  renderChildCard (img, childID, childName, portfolioValue, totalContributions, valueIncrease, percentageIncrease, message, lastUpdatedTime) {
    const {debugMode} = this.props
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`show child info ${childName}`}
        accessibilityRole={'button'}
        key={childID}
        onPress={() => this.showChildView(childID)}
        style={{zIndex: 1, padding: 30, marginBottom: 20, bottom: 100, backgroundColor: '#FFF', borderRadius: 10, shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>

        <View style={{flexDirection: 'row', marginBottom: 20, alignItems: 'center', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={img} style={{height: 50, width: 50}} />
            <Text style={{fontFamily: Fonts.type.black, fontSize: 18, color: '#4A4A4A', marginLeft: 5, backgroundColor: 'transparent'}}>
              {childName}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontFamily: Fonts.type.regular, fontSize: 16, color: '#9B9B9B', backgroundColor: 'transparent'}}>
              {message}
            </Text>
          </View>
        </View>

        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 20, backgroundColor: 'transparent'}}>
                {formatPrice(portfolioValue)}
              </Text>
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16, backgroundColor: 'transparent'}}>
                {valueIncrease}% / {formatPrice(valueIncrease)}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#9B9B9B', fontFamily: Fonts.type.regular, fontSize: 14, backgroundColor: 'transparent'}}>
                Portfolio Value
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#9B9B9B', fontFamily: Fonts.type.regular, fontSize: 14, backgroundColor: 'transparent'}}>
                Earnings
              </Text>
            </View>
          </View>
        </View>

        {
          (debugMode && (lastUpdatedTime || totalContributions))
          &&
          <View style={{justifyContent: 'center', marginTop: 15}}>
            {
              totalContributions
              &&
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                <Text style={{flex: 5, color: 'rgb(196, 0, 41)', fontFamily: Fonts.type.regular, fontSize: 12}}>
                  TOTAL CONTRIBUTION
                </Text>
                <Text style={{flex: 5, color: 'rgb(196, 0, 41)', fontFamily: Fonts.type.regular, fontSize: 12}}>
                  {formatPrice(totalContributions)}
                </Text>
              </View>
            }
            {
              (debugMode && lastUpdatedTime)
              &&
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                <Text style={{flex: 5, color: 'rgb(196, 0, 41)', fontFamily: Fonts.type.regular, fontSize: 12}}>
                  LAST UPDATED
                </Text>
                <Text style={{flex: 5, color: 'rgb(196, 0, 41)', fontFamily: Fonts.type.regular, fontSize: 12}}>
                  {lastUpdatedTime}
                </Text>
              </View>
            }
          </View>
        }

      </TouchableOpacity>
    )
  }

  renderAddButton () {
    return (
      <View style={{...globalStyle.screen.containers.centeringContainer, backgroundColor: 'transparent', bottom: 90, paddingBottom: 0, zIndex: 1000}}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Add Account'}
          accessibilityRole={'button'}
          onPress={() => this.addAccount()} >
          <Image source={require('../../../Img/icons/add.png')} style={{height: 100, width: 100}} />
        </TouchableOpacity>
      </View>
    )
  }

  renderMiddleContainer () {
    const {handleLocalAction, localActions, navigator, childID, growthValue, growthPercentage, goals, firstName, totalPortfolioValue} = this.props
    return (
      <Image source={require('../../../Img/homepage/homepageBg.png')} style={{width: '100%', resizeMode: 'cover'}}>
        <View style={{marginTop: 50}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 18, color: '#9B9B9B', backgroundColor: 'transparent'}}>
              Your Family
            </Text>
            <Text accessible accessibilityLabel={'totalPortfolioValue'} style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 50, color: '#4A4A4A', backgroundColor: 'transparent', marginTop: 8}}>
              {formatPrice(totalPortfolioValue)}
            </Text>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text accessible accessibilityLabel={'growthValue'} style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 18, color: '#4A4A4A', backgroundColor: 'transparent', marginTop: 3}}>
                ${growthValue}
              </Text>
              <Image source={require('../../../Img/icons/arrowUp.png')} style={{width: 15, height: 15, marginLeft: 25, marginRight: 25, top: 5, resizeMode: 'contain'}} />
              <Text accessible accessibilityLabel={'growthPercentage'} style={{textAlign: 'center', fontFamily: Fonts.type.regular, fontSize: 18, color: '#4A4A4A', backgroundColor: 'transparent', marginTop: 3}}>
                {growthPercentage}%
              </Text>
            </View>
          </View>
        </View>
      </Image>
    )
  }

  // ------------------------------------------------------------
  // Core render method

  render () {
    const {childrenAvailable} = this.props
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
        >
          {childrenAvailable && this.renderMiddleContainer()}
          {childrenAvailable && this.renderChildPanel()}
          {this.renderAddButton()}
        </ScrollView>
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
  // children array
  childArr: PropTypes.array.isRequired,
  // total portfolio value of family
  totalPortfolioValue: PropTypes.number.isRequired,
  // total growth of portfolio
  growthValue: PropTypes.number.isRequired,
  // growth percentage
  growthPercentage: PropTypes.number.isRequired,
  // user id
  userID: PropTypes.string.isRequired,
  // children are available or not
  childrenAvailable: PropTypes.bool.isRequired,
  // debug mode
  debugMode: PropTypes.bool.isRequired
}

Homepage.defaultProps = {
  totalPortfolioValue: 0,
  growthValue: '0',
  growthPercentage: '1.2'
}

// ========================================================
// Export
// ========================================================

export default Homepage
