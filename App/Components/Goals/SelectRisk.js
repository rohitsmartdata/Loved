/* eslint-disable no-unused-vars,no-multi-spaces,no-trailing-spaces,indent */
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
import {View, Text, ScrollView, Image, Dimensions, TouchableOpacity, LayoutAnimation}
  from 'react-native'
import {reduxForm}
  from 'redux-form'
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
import {COMMON_ENTITIES, BUTTON_TYPES, getPortfolio}
  from '../../Utility/Mapper/Common'
import Swiper
  from 'react-native-swiper'
import LWButton
  from '../Utility/LWButton'
import { connect }
  from 'react-redux'
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

class SelectRisk extends Component {

  // --------------------------------------------------------
  // Action handlers

  updateIndex (index) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.UPDATE_RISK, [COMMON_ENTITIES.NAVIGATOR]: navigator, payload: {form: FORM_TYPES.ADD_GOAL, field: GOAL_ENTITIES.PORTFOLIO_RISK, value: index}})
  }

  next (risk) {
    const {handleLocalAction, localActions, childID, goalID, navigator, navigatorTitle} = this.props
    // handleLocalAction({type: localActions.SELECT_RISK, form: FORM_TYPES.ADD_GOAL, [CHILD_ENTITES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [GOAL_ENTITIES.PORTFOLIO_RISK]: risk, [COMMON_ENTITIES.NAVIGATOR]: navigator, [COMMON_ENTITIES.NAVIGATOR_TITLE]: navigatorTitle})
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    const {firstName} = this.props
    return (
      <View style={{...styles.screen.h1.containerStyle, marginBottom: 0, marginLeft: 35, marginRight: 35, alignItems: 'flex-start'}}>
        <Text style={{...styles.screen.h1.textStyle, color: '#4A4A4A', fontSize: 26, fontFamily: 'Kefa', textAlign: 'left'}}>
          How would you like to invest for {firstName}?
        </Text>
      </View>
    )
  }

  renderNextButton () {
    return (
      <View style={{position: 'absolute', bottom: 28, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', paddingLeft: 20, paddingRight: 20}}>
        <LWButton title='Next' onPress={this.next.bind(this)} buttonType={BUTTON_TYPES.DECISION_BUTTON} />
      </View>
    )
  }

  renderCarouselView (risk, img, description1, description2) {
    const {height, width} = Dimensions.get('window')
    const finalWidth = width - 60
    const isSmall = height < 700
    let portfolio = getPortfolio(risk)
    return (
      <View accessible accessibilityLabel={portfolio.NAME} style={{height: 410, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-start', width: finalWidth, borderRadius: 15, borderWidth: 1, borderColor: '#F1F1F1', shadowOpacity: 0.7, shadowRadius: 20}}>
        <Image source={img} style={{height: 360, width: '100%', resizeMode: 'stretch', paddingHorizontal: 30, paddingVertical: 30}}>
          <Text style={{fontSize: 30, fontFamily: Fonts.type.black, color: '#FFF', backgroundColor: 'transparent', textAlign: 'left'}}>
            {portfolio.HEADING}
          </Text>
          <Text style={{fontSize: 16, fontFamily: Fonts.type.black, color: '#FFF', backgroundColor: 'transparent', textAlign: 'left'}}>
            {portfolio.NAME}
          </Text>
          <Text style={{fontSize: 14, fontFamily: Fonts.type.regular, color: '#D8D8D8', backgroundColor: 'transparent', textAlign: 'left', paddingTop: 30}}>
            {description1}
          </Text>
          <Text style={{fontSize: 14, fontFamily: Fonts.type.regular, color: '#D8D8D8', backgroundColor: 'transparent', textAlign: 'left'}}>
            {description2}
          </Text>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Learn More'}
            accessibilityRole={'button'}
            onPress={() => this.next(risk)}
            style={{position: 'absolute', bottom: 20, left: 0, right: 0, width: finalWidth, textAlign: 'center'}}>
            <Text style={{fontSize: 15, alignItems: 'flex-end', fontFamily: Fonts.type.black, color: '#FFF', backgroundColor: 'transparent', textAlign: 'center'}}>
              Learn More
            </Text>
          </TouchableOpacity>
        </Image>
        <View style={{flex: 1, backgroundColor: '#FFF', borderBottomRightRadius: 15, borderBottomLeftRadius: 15}}>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Add Investment'}
            accessibilityRole={'button'}
            onPress={() => this.updateIndex(risk)} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 17, color: '#00CBCE'}}>
              Add Investment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderCarousel () {
    return (
      <Swiper
        style={{paddingHorizontal: 35, paddingTop: 40}}
        height={415}
        horizontal showPagination={false} paginationStyle={{position: 'absolute', bottom: 20}}
        dot={<View style={{backgroundColor: '#F1F1F1', width: 15, height: 2.5, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />} activeDot={<View style={{backgroundColor: '#00CBCE', width: 15, height: 2.5, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}>
        {this.renderCarouselView('01', require('../../../Img/portfolios/p_1.png'), 'Investing for the long term? Taking on more risk is a good thing when you\'re prepared to be patient through downward cycles. iShares Core Aggressive Allocation ETF')}
        {this.renderCarouselView('02', require('../../../Img/portfolios/p_2.png'), 'A safe place to start. Taking on a little bit of risk this portfolio is a good mix of risk and reward that will pay off over the years.')}
        {this.renderCarouselView('03', require('../../../Img/portfolios/p_3.png'), 'iShares Core Conservative Allocation ETF')}
        {this.renderCarouselView('04', require('../../../Img/portfolios/p_3.png'), 'The Monopoly Man is rich for a reason. Property represents a Vanguard REIT ETF (VNQ)')}
      </Swiper>
    )
  }

  // --------------------------------------------------------
  // Core component

  render () {
    const {chartData} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={this.props.navigator} rightButtonPresent titlePresent title='CREATE INVESTMENT' />
        {this.renderHeading()}
        {this.renderCarousel()}
      </View>
    )
  }
}

// ========================================================
// Prop handlers
// ========================================================

SelectRisk.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // current index of portfolio risk
  portfolioRisk: PropTypes.number.isRequired
}

// ========================================================
// Export
// ========================================================

const Screen = connect()(form(SelectRisk))

export default Screen
