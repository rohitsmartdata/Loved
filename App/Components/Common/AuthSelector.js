/* eslint-disable no-unused-vars,no-multiple-empty-lines,no-trailing-spaces */
/**
 * Created by viktor on 12/7/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, NativeModules, Image, TouchableOpacity, Dimensions, ImageBackground, Animated, TouchableHighlight, TouchableWithoutFeedback, Linking, Keyboard }
  from 'react-native'
import Fonts
  from '../../Themes/Fonts'
import { AUTH_ENTITIES }
  from '../../Utility/Mapper/Auth'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION }
  from '../../Utility/Mapper/Common'
import CodePush
  from 'react-native-code-push'
import { CURRENT_ENVIRONMENT }
  from '../../Config/AppConfig'
import { ENVIRONMENT }
  from '../../Config/contants'
import ImageSlider
  from 'react-native-image-slider'
import Colors
  from '../../Themes/Colors'
import ApplicationStyles
  from '../../Themes/ApplicationStyles'
import * as Constants
  from '../../Themes/Constants'
import Modal from
    'react-native-modal'
import SignUp
  from '../../Containers/Common/Auth'
import { SPROUT } from '../../Utility/Mapper/Screens'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { GOAL_ENTITIES } from '../../Utility/Mapper/Goal'
import GravityCapsule from '../Utility/GravityCapsule'

const obj = [
  {
    img: require('../../../Img/assets/onboard/appLogo/logo.png'),
    title: 'Welcome to',
    description: 'Start Kids as Investors for Free',
    height: 230,
    width: 250,
    key: 0
  },
  {
    img: require('../../../Img/assets/onboard/launch1/launch1.png'),
    title: '$5 stocks. No fees.',
    description: 'Custodial investing that’s easy,\neducational, fun and free.',
    height: 280,
    width: 200,
    key: 1
  },
  {
    img: require('../../../Img/assets/onboard/launch2/launch2.png'),
    title: 'Teach habits. Reach goals.',
    description: 'Educate for financial literacy. Achieve\ngoals in their future with smart goals.',
    height: 280,
    width: 200,
    key: 2
  },
  {
    img: require('../../../Img/assets/onboard/launch3/launch3.png'),
    title: 'Account Security.',
    description: 'Securities in your account are held SIPC\nprotected to $500k. For details please\nsee',
    height: 230,
    width: 250,
    key: 3
  }
]

// ========================================================
// Core Component
// ========================================================

class AuthSelector extends Component {

  constructor (props) {
    super(props)
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
    this.state = {
      showLoginModal: false,
      y: new Animated.Value(height)
    }
  }

  hideModal () {
    this.setState({showLoginModal: false})
  }

  componentDidMount () {
    // analytics.screen({
    //   name: 'AUTH SELECTOR SCREEN'
    // })

    if (CURRENT_ENVIRONMENT === ENVIRONMENT.DEV_1 || CURRENT_ENVIRONMENT === ENVIRONMENT.PROD || CURRENT_ENVIRONMENT === ENVIRONMENT.UAT_2) {
      CodePush.sync({updateDialog: true, installMode: CodePush.InstallMode.IMMEDIATE})
    }
  }

  // ---------------------------------------------------------------
  // Action Handlers

  handleTouch (authType) {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({
      type: localActions.NAVIGATE,
      [AUTH_ENTITIES.AUTH_TYPE]: authType,
      [COMMON_ENTITIES.NAVIGATOR]: navigator
    })
  }

  // ---------------------------------------------------------------
  // Top Containers

  renderCard (item) {
    const margin = (Constants.screen.height * 103) / 812
    const paddingHorizontal = (Constants.screen.width * 40) / 375
    const marginVertical = (Constants.screen.height * 45) / 812

    if (item.title === 'Welcome to') {
      return (
        <View key={item.key} style={{flex: 1, marginBottom: margin, width: Constants.screen.width}}>
          <Text style={{
            fontFamily: Fonts.type.bold,
            fontSize: 20,
            lineHeight: 25,
            color: Colors.white,
            textAlign: 'center',
            marginBottom: 30,
            marginTop: (Constants.screen.height * 150) / 812
          }}>
            {item.title}
          </Text>
          <View style={{marginBottom: 16, paddingHorizontal, alignItems: 'center'}}>
            <Image source={item.img} style={{height: 37, width: 126}} resizeMode={'contain'} />
          </View>
          <Text style={{
            fontFamily: Fonts.type.book,
            fontSize: 20,
            lineHeight: 25,
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center'
          }}>
            {item.description}
          </Text>
        </View>
      )
    } else {
      return (
        <View key={item.key} style={{
          flex: 1,
          marginBottom: margin,
          width: Constants.screen.width,
          marginTop: (Constants.screen.height * 80) / 812
        }}>
          <View style={{height: 190, width: 220, marginBottom: 23, alignSelf: 'center'}}>
            <Image source={item.img} style={{height: 190, width: 220, alignSelf: 'center'}} resizeMode={'contain'} />
          </View>
          <Text style={{
            fontFamily: Fonts.type.bold,
            fontSize: 20,
            lineHeight: 25,
            color: Colors.white,
            textAlign: 'center',
            marginBottom: 15
          }}>
            {item.title}
          </Text>
          <Text style={{fontFamily: Fonts.type.book, fontSize: 16, color: '#EAEAEA', textAlign: 'center'}}>
            {item.description}
            {item.title === 'Account Security.' && <Text onPress={() => Linking.openURL('https://www.sipc.org')} style={{fontFamily: Fonts.type.book, fontSize: 16, color: '#EAEAEA', textAlign: 'center'}}> www.sipc.org.</Text>}
          </Text>
        </View>
      )
    }
  }

  // ---------------------------------------------------------------
  // render Child Container

  renderNextButton () {
    const isX = this.isX || false
    const marginTop = (Constants.screen.height * 23) / 812
    const marginBottom = (Constants.screen.height * 75) / 812
    return (
      <View style={{justifyContent: 'center'}}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Get started with the application'}
          accessibilityRole={'button'}
          style={{
            ...ApplicationStyles.bottomNavigator.containerStyle,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 42
          }}
          onPress={() => this.openModal()}>
          <Text style={{...ApplicationStyles.bottomNavigator.textStyle, color: Colors.darkBlue}}>Sign up</Text>
        </TouchableHighlight>
        <View style={{flexDirection: 'row', alignSelf: 'center', marginTop, marginBottom}}>
          <TouchableOpacity
            activeOpacity={1}
            accessible
            accessibilityLabel={'Log in'}
            accessibilityRole={'button'}
            onPress={() => this.handleTouch(AUTH_ENTITIES.LOGIN)}>
            <Text style={{color: Colors.white, fontFamily: Fonts.type.book, fontSize: 18, textAlign: 'center'}}>Log
              in</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  openModal () {
    Animated.timing(this.state.y, {
      duration: 300,
      toValue: 0,
      delay: 100
    }).start()
  }

  closeModal () {
    Animated.timing(this.state.y, {
      duration: 500,
      toValue: Constants.screen.height,
      delay: 100
    }).start(() => Keyboard.dismiss())
  }

  renderSignUpModal () {
    const {navigator} = this.props
    const {y} = this.state

    return (
      <Animated.View style={{transform: [{translateY: y}], height: Constants.screen.height, width: Constants.screen.width, position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
        <SignUp navigator={navigator} hideModal={this.closeModal.bind(this)} />
      </Animated.View>
    )
  }

  // ---------------------------------------------------------------
  // Core render method

  render () {
    const top = (Constants.screen.height * 131) / 812
    const bottom = (Constants.screen.height * 44) / 812
    return (
      <ImageBackground source={require('../../../Img/appBackground.png')} style={{flex: 1, paddingTop: top}}>
        <ImageSlider
          accessible
          accessibilityLabel={'startCarousel'}
          autoPlayWithInterval={2000}
          images={obj}
          style={{backgroundColor: 'transparent'}}
          customSlide={({index, item}) => this.renderCard(item)}
          customButtons={(position, move) => {
            return (
              <View>
                {this.renderNextButton()}
                <View style={{
                  flexDirection: 'row',
                  width: 60,
                  justifyContent: 'space-around',
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom
                }}>
                  {obj.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        underlayColor='#000'
                        onPress={() => move(index)}
                        style={{
                          height: 8,
                          width: 8,
                          borderRadius: 4,
                          backgroundColor: position === index ? Colors.white : 'rgba(255, 255, 255, 0.4)'
                        }}
                      />
                    )
                  })}
                </View>
              </View>
            )
          }}
        />
        {this.renderSignUpModal()}
      </ImageBackground>
    )
  }
}

AuthSelector.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired

}

// ========================================================
// Export
// ========================================================

export default AuthSelector
