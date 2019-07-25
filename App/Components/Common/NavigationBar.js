/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 20/2/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, Image, TouchableOpacity, Dimensions }
  from 'react-native'
import {Icon}
  from 'react-native-elements'
import Fonts
  from '../../Themes/Fonts'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'

// ========================================================
// Core Component
// ========================================================

class NavigationBar extends Component {

  // ---------------------------------------------------------------
  // Action Handlers

  componentWillMount () {
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  popScreen () {
    const {handleLocalAction, localActions, navigator, leftFoo} = this.props
    handleLocalAction({type: localActions.POP_SCREEN, [COMMON_ENTITIES.NAVIGATOR]: navigator, 'extraFoo': leftFoo})
  }

  closeModal () {
    const {handleLocalAction, localActions, navigator, leftFoo} = this.props
    handleLocalAction({type: localActions.CLOSE_MODAL, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  rightButtonDispatch () {
    const {handleLocalAction, localActions, navigator, rightButtonFoo} = this.props
    handleLocalAction({type: localActions.RIGHT_FOO, [COMMON_ENTITIES.NAVIGATOR]: navigator, 'rightButtonFoo': rightButtonFoo})
  }

  // ---------------------------------------------------------------
  // Top Containers

  renderLeftButton () {
    const isX = this.isX || false
    const {leftButtonPresent, leftButtonColor, blueBackdrop} = this.props
    if (leftButtonPresent) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Go Back'}
          accessibilityRole={'button'}
          onPress={() => this.popScreen()} style={{width: 50, paddingLeft: 5, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Icon name='keyboard-arrow-left' color={blueBackdrop ? '#FFF' : '#000'} size={32} />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{width: 50}} />
      )
    }
  }

  renderRightButton () {
    const {rightButtonPresent, rightButtonFoo, rightButtonIcon, rightButtonName, customRightButtonFunc} = this.props
    if (rightButtonName) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Right Button'}
          accessibilityRole={'button'}
          onPress={() => customRightButtonFunc ? customRightButtonFunc() : rightButtonFoo ? this.rightButtonDispatch() : this.closeModal()}
          style={{width: 50, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: Fonts.type.medium, fontSize: 20, color: '#000', backgroundColor: 'transparent'}}>
            {rightButtonName}
          </Text>
        </TouchableOpacity>
      )
    } else if (rightButtonPresent) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Right Button'}
          accessibilityRole={'button'}
          onPress={() => rightButtonFoo ? this.rightButtonDispatch() : this.closeModal()}
          style={{width: 50, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name={rightButtonIcon} size={32} color='#9B9B9B' />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{width: 50}} />
      )
    }
  }

  renderTitle () {
    const {title} = this.props
    return (
      <TouchableOpacity
        activeOpacity={1}
        accessible
        accessibilityLabel={title}
        accessibilityRole={'button'}
        style={{justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'row'}}>
        <Text style={{fontFamily: Fonts.type.semibold, fontSize: 18, color: '#000', backgroundColor: 'transparent'}}>
          {title}
        </Text>
        <Icon name={'ios-arrow-down'} size={12} color='#000' type={'ionicon'} containerStyle={{top: 3, marginLeft: 8}} />
      </TouchableOpacity>
    )
  }

  // ---------------------------------------------------------------
  // Core render method

  render () {
    const isX = this.isX || false
    const { backgroundColor } = this.props
    return (
      <View style={{paddingTop: isX ? 30 : 22, height: isX ? 80 : 70, backgroundColor}}>
        {this.props.children}
      </View>
    )
  }

}

NavigationBar.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired,

  title: PropTypes.string,
  backgroundColor: PropTypes.string
}

NavigationBar.defaultProps = {
  title: undefined,
  backgroundColor: '#FFCF50'
}

// ========================================================
// Export
// ========================================================

export default NavigationBar
