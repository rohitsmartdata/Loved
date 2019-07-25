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
import CustomNav
  from '../../Containers/Common/CustomNav'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import LinearGradient
  from 'react-native-linear-gradient'
import Fonts
  from '../../Themes/Fonts'
import {formatPrice}
  from '../../Utility/Transforms/Converter'
// ========================================================
// Core Component
// ========================================================

class Invest extends Component {

  // ------------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    this.populateState()
  }

  // ------------------------------------------------------------
  // Action Handlers

  addNewChild (childID) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.ADD_NEW_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
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

  loadChart () {
    const {handleLocalAction, localActions, childID} = this.props
    handleLocalAction({type: localActions.FETCH_CHART_DATA, [CHILD_ENTITIES.CHILD_ID]: childID})
  }

  showChart () {
    this.loadChart()
    LayoutAnimation.linear()
    this.setState({charVisible: true})
  }
  hideChart () {
    LayoutAnimation.linear()
    this.setState({charVisible: false})
  }

  // ------------------------------------------------------------
  // Child render methods

  renderDecisionBox (c1, c2, title, img, w, h) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={title}
        accessibilityRole={'button'}
        style={{width: 180, height: 127, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, shadowColor: 'gray', shadowOpacity: 1, shadowRadius: 20, shadowOffset: {width: 0, height: 0}, marginLeft: 10, marginRight: 10}}>
        <LinearGradient colors={[c1, c2]} start={{x: -1, y: -1}} end={{x: 3, y: 0}} locations={[0, 0.7]} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={img} style={{width: w || 45, height: h || 45}} />
        </LinearGradient>
        <View style={{height: 40, backgroundColor: '#FFF', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.regular, fontSize: 13, color: '#586871', backgroundColor: 'transparent'}}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  showGoal (goalID, name) {
    const {handleLocalAction, localActions, childID, navigator, userID} = this.props
    handleLocalAction({type: localActions.SHOW_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [GOAL_ENTITIES.NAME]: name, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID})
  }

  renderChildPanel () {
    const {childArr} = this.props
    return (
      <View style={{backgroundColor: 'transparent', marginTop: 30, paddingLeft: 10, paddingRight: 10, paddingBottom: 0, zIndex: 500}}>

        {childArr.map(child => {
          let portfolio = child[CHILD_ENTITIES.PORTFOLIO]
          return this.renderChildCard(require('../../../Img/icons/child.png'), child[CHILD_ENTITIES.CHILD_ID], child[CHILD_ENTITIES.FIRST_NAME], (portfolio && portfolio[CHILD_ENTITIES.CURRENT_VALUE]) || 0, (portfolio && portfolio[CHILD_ENTITIES.GROWTH_IN_VALUE]) || 0, (portfolio && portfolio[CHILD_ENTITIES.GROWTH_IN_PERCENTAGE]) || 0, '')
        })}

      </View>
    )
  }

  renderChildCard (img, childID, childName, portfolioValue, valueIncrease, percentageIncrease, message) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={`Add child ${childName}`}
        accessibilityRole={'button'}
        key={childID}
        onPress={() => this.addNewChild(childID)}
        style={{zIndex: 1, padding: 30, marginBottom: 20, backgroundColor: '#FFF', borderRadius: 10, shadowOpacity: 0.3, shadowOffset: {width: 0, height: 3}}}>

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
            <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 20, backgroundColor: 'transparent'}}>
              {formatPrice(portfolioValue)}
            </Text>
            <View style={{justifyContent: 'flex-end'}}>
              <Text style={{color: '#4A4A4A', fontFamily: Fonts.type.regular, fontSize: 16, backgroundColor: 'transparent'}}>
                {parseFloat(valueIncrease).toFixed(2)}% / {formatPrice(valueIncrease)}
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
      </TouchableOpacity>
    )
  }

  renderHeader () {
    return (
      <View style={{paddingHorizontal: 30, marginTop: 20}}>
        <Text style={{color: '#00CBCE', fontFamily: 'Kefa-Regular', fontSize: 38, backgroundColor: 'transparent'}}>
          For whome are we investing for?
        </Text>
      </View>
    )
  }

  // ------------------------------------------------------------
  // Core render method

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <CustomNav navigator={this.props.navigator} titlePresent title='CREATE INVESTMENT' />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
        >
          {this.renderHeader()}
          {this.renderChildPanel()}
        </ScrollView>
      </View>
    )
  }

}

Invest.propTypes = {
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
  userID: PropTypes.string.isRequired
}

Invest.defaultProps = {
  totalPortfolioValue: 0,
  growthValue: '0',
  growthPercentage: '1.2'
}

// ========================================================
// Export
// ========================================================

export default Invest
