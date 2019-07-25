/* eslint-disable no-trailing-spaces,no-unused-vars,camelcase */
/**
 * User Input Detail 5
 * - Total user financial value
 *
 * Created by viktor on 28/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Image, LayoutAnimation, TouchableOpacity, Keyboard, ScrollView, Dimensions, ActivityIndicator, Animated }
  from 'react-native'
import Toast
  from '../Common/Toast'
import {reduxForm}
  from 'redux-form'
import { connect }
  from 'react-redux'
import CustomNav
  from '../../Containers/Common/CustomNav'
import {FORM_TYPES}
  from '../../Config/contants'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {COMMON_ENTITIES}
  from '../../Utility/Mapper/Common'
import
  _ from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import Options from '../../CommonComponents/Options'
import Colors from '../../Themes/Colors'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_USER,
  destroyOnUnmount: false
})

const cardWidth = 237

const heading = {
  0: 'Minimize losses',
  1: 'Maximize gains and minimize losses',
  2: 'Maximize long term gains'
}

const description = {
  0: 'I prefer security over returns when there is a chance of market movements impacting my investment',
  1: 'I\'m in between, willing to accept a little more risk for higher returns',
  2: 'I accept higher risk in order to achieve higher returns over the long term'
}

const optionData = [
  {
    detail: 'I’d get worried and want to sell my securities down.',
    value: '1'
  },
  {
    detail: 'Just leave it as it is. I have faith it will recover in time.',
    value: '2'
  },
  {
    detail: 'I’ll buy some more and watch it climb as the market recovers.',
    value: '3'
  }
]

const PROGRESS_BAR_CAP = [1, 2, 3, 4]

// ========================================================
// Core Component
// ========================================================

class InputUserDetail_8 extends Component {

  // -------------------------------------------------------
  // Lifecycle methods

  // Todo:-
  // - formalize investor type
  //   instead of using constants
  //   (0,1,2)
  constructor (props) {
    super(props)
    this.state = {
      investorType: 1,
      heading: heading[1],
      description: description[1],
      opacity: 1,
      selectedIndex: undefined
    }
    this.h = {
      textOpacity: new Animated.Value(1)
    }
  }

  componentDidMount () {
    this.updateCurrentOnboarding()
  }

  // -------------------------------------------------------
  // Action handlers

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  navigateToNextScreen (investorIndex, index) {
    this.setState({ selectedIndex: index }, () => {
      setTimeout(() => {
        const {localActions, handleLocalAction, navigator, nextScreen, residencyType, userID} = this.props
        if (residencyType && residencyType === USER_ENTITIES.NO_RESIDENCY) {
          console.log('residency type :: ', residencyType)
        } else {
          handleLocalAction({
            type: localActions.NAVIGATE_TO_NEXT_SCREEN,
            [COMMON_ENTITIES.SCREEN_TYPE]: nextScreen,
            [COMMON_ENTITIES.NAVIGATOR]: navigator,
            form: FORM_TYPES.ADD_USER,
            field: USER_ENTITIES.INVESTOR_TYPE,
            value: investorIndex,
            [USER_ENTITIES.USER_ID]: userID
          })
        }
      }, 100)
    })
  }

  indexChanged (index) {
    this.hideText(index)
  }

  hideText (index) {
    LayoutAnimation.spring()
    this.setState({
      opacity: 0,
      investorType: index,
      heading: heading[index],
      description: description[index]
    })
    setTimeout(() => this.showText(index), 200)
  }

  showText (index) {
    LayoutAnimation.spring()
    this.setState({
      opacity: 1
    })
  }

  // -------------------------------------------------------
  // inner component render methods

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, marginTop: 74, marginBottom: 65, alignItems: 'center'}}>
        <Text style={{ fontFamily: Fonts.type.bold, textAlign: 'center', color: '#1C3C70', fontSize: 22, alignSelf: 'center' }}>
          How would you react if the market dropped 20%?
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    return (
      <View style={{flex: 1, justifyContent: 'center', bottom: 40}}>
        {this.renderList('I accept higher risks for higher long term returns', '1', true, false)}
        {this.renderList('I like a balance of risk and returns', '2', true, false)}
        {this.renderList('I’m cautious and prefer to play it safe', '3', true, true)}
      </View>
    )
  }

  renderList (userFinancialValue, valueCode, showTopBorder, showBottomBorder) {
    return (
      <TouchableOpacity
        accessible
        accessibilityLabel={userFinancialValue}
        accessibilityRole={'button'}
        onPress={_.debounce(_.bind(() => this.navigateToNextScreen(valueCode), this), 500, {'leading': true, 'trailing': false})} style={{borderColor: '#D7D7D7', borderTopWidth: showTopBorder ? 1 : 0, borderBottomWidth: showBottomBorder ? 1 : 0}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}} >
          <Text style={{color: '#10427E', backgroundColor: 'transparent', fontSize: 20, fontFamily: Fonts.type.regular, marginVertical: 30, marginHorizontal: 20, textAlign: 'center'}}>
            {userFinancialValue}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderOptions () {
    const { selectedIndex } = this.state
    return (
      <View>
        {
          optionData.map((item, index) => {
            if (selectedIndex !== undefined && selectedIndex === index) {
              return (
                <Options
                  buttonText={item.detail}
                  style={{ backgroundColor: Colors.blue, paddingHorizontal: 37 }}
                  buttonTextStyle={{ color: Colors.white, fontFamily: Fonts.type.book, fontSize: 16 }}
                  onPress={_.debounce(_.bind(() => this.navigateToNextScreen(item.value, index), this), 500, {'leading': true, 'trailing': false})}
                />
              )
            }
            return (
              <Options
                style={{ paddingHorizontal: 37 }}
                buttonText={item.detail}
                buttonTextStyle={{ color: '#1C3C70', fontFamily: Fonts.type.book, fontSize: 16 }}
                onPress={_.debounce(_.bind(() => this.navigateToNextScreen(item.value, index), this), 500, {'leading': true, 'trailing': false})}
              />
            )
          })
        }
      </View>
    )
  }

  renderProgressCell (enabled) {
    return (
      <View style={{height: 10, flex: 1, marginHorizontal: 3, borderRadius: 3, borderWidth: enabled ? 0 : 1, borderColor: '#707070', backgroundColor: enabled ? '#397BDF' : '#FFF'}} />
    )
  }

  renderProgressBar () {
    return (
      <View style={{position: 'absolute', bottom: 50, left: 0, right: 0, paddingHorizontal: 20}}>
        <View style={{flexDirection: 'row'}}>
          {PROGRESS_BAR_CAP.map(index => {
            return this.renderProgressCell(index <= 1)
          })}
        </View>
      </View>
    )
  }

  // -------------------------------------------------------
  // Core render methods

  render () {
    const {navigator, popButton, toast, toastHeading, toastSubheading} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} gradientBackdrop titlePresent title='Profile' />
        <View style={{...styles.screen.containers.root, paddingHorizontal: 32}}>
          {this.renderHeading()}
          {this.renderOptions()}
          {this.renderProgressBar()}
        </View>
      </View>
    )
  }

}

InputUserDetail_8.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // next screen to navigate
  nextScreen: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  // residency type
  residencyType: PropTypes.string,

  popButton: PropTypes.bool,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string
}

InputUserDetail_8.defaultProps = {
  popButton: true
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputUserDetail_8))

export default Screen
