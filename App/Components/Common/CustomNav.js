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
import { View, Text, Alert, Image, TouchableOpacity, Dimensions, ImageBackground }
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

class CustomNav extends Component {

  // ---------------------------------------------------------------
  // Action Handlers

  componentWillMount () {
    const {height, width} = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  popScreen () {
    const {handleLocalAction, localActions, navigator, leftFoo, popManually, leftButtonCloseModal} = this.props
    if (leftButtonCloseModal) {
      this.closeModal()
      return
    }
    if (popManually) {
      leftFoo()
    } else {
      handleLocalAction({type: localActions.POP_SCREEN, [COMMON_ENTITIES.NAVIGATOR]: navigator, 'extraFoo': leftFoo})
    }
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
    const {leftButtonPresent, customIcon, leftButtonIcon, blueBackdrop, gradientBackdrop} = this.props
    if (leftButtonPresent) {
      if (customIcon) {
        return (
          <TouchableOpacity
            activeOpacity={1}
            accessible
            accessibilityLabel={'Go Back'}
            accessibilityRole={'button'}
            onPress={() => this.popScreen()}
            style={{width: 50, paddingLeft: 9, justifyContent: 'center', alignItems: 'flex-start'}}>
            {customIcon}
          </TouchableOpacity>
        )
      }
      return (
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Go Back'}
          accessibilityRole={'button'}
          onPress={() => this.popScreen()}
          style={{width: 50, paddingLeft: 9, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Icon name={leftButtonIcon} color={blueBackdrop || gradientBackdrop ? '#FFF' : '#000'} size={32} />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{width: 50}} />
      )
    }
  }

  renderRightButton () {
    const {rightButtonPresent, rightButtonFoo, rightButtonIcon, rightButtonName, customRightButtonFunc, type} = this.props
    if (rightButtonName) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Go Back'}
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
          accessibilityLabel={'Go Back'}
          accessibilityRole={'button'}
          onPress={() => customRightButtonFunc ? customRightButtonFunc() : rightButtonFoo ? this.rightButtonDispatch() : this.closeModal()}
          style={{width: 50, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name={rightButtonIcon} size={type ? 20 : 32} color='#fff' type={type} />
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{width: 50}} />
      )
    }
  }

  renderTitle () {
    const {titlePresent, title, titleStyle, blueBackdrop, titleLogoPresent, gradientBackdrop} = this.props

    if (titleLogoPresent) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Image source={require('../../../Img/intermediateScreen/logoBlack.png')} />
        </View>
      )
    } else if (titlePresent) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{fontFamily: Fonts.type.book, fontSize: 17, lineHeight: 22, color: blueBackdrop || gradientBackdrop ? '#FFF' : '#505050', backgroundColor: 'transparent', ...titleStyle}}>
            {title}
          </Text>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1}} />
      )
    }
  }

  // ---------------------------------------------------------------
  // Core render method

  render () {
    const isX = this.isX || false
    const { gradientBackdrop, blueBackdrop, showBorder, dropTopMargin, leftFoo, extraStyles } = this.props
    let topMargin = isX ? 30 : 22
    topMargin = dropTopMargin ? (topMargin - 30) : topMargin
    let headerHeight = isX ? 80 : 70
    headerHeight = dropTopMargin ? (headerHeight - 30) : headerHeight
    return (
      <View style={{paddingTop: topMargin, height: headerHeight, flexDirection: 'row', backgroundColor: blueBackdrop || gradientBackdrop ? '#2948FF' : 'transparent', ...extraStyles}}>
        {this.renderLeftButton()}
        {this.renderTitle()}
        {this.renderRightButton()}
      </View>
    )
  }

}

CustomNav.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // navigator object
  navigator: PropTypes.object.isRequired,

  leftButtonCloseModal: PropTypes.bool,

  leftButtonPresent: PropTypes.bool.isRequired,
  rightButtonPresent: PropTypes.bool.isRequired,
  titlePresent: PropTypes.bool.isRequired,

  leftButtonColor: PropTypes.string,
  leftButtonIcon: PropTypes.string,
  titleStyle: PropTypes.object,

  rightButtonIcon: PropTypes.bool,
  rightButtonName: PropTypes.string,
  rightButtonFoo: PropTypes.func,
  customRightButtonFunc: PropTypes.func,

  leftFoo: PropTypes.func,
  popManually: PropTypes.bool,
  dropTopMargin: PropTypes.bool,

  title: PropTypes.string,
  titleLogoPresent: PropTypes.bool,
  backgroundColor: PropTypes.string,
  blueBackdrop: PropTypes.bool,
  gradientBackdrop: PropTypes.bool,
  showBorder: PropTypes.bool,
  type: PropTypes.string
}

CustomNav.defaultProps = {
  leftButtonPresent: false,
  leftButtonIcon: 'keyboard-arrow-left',
  rightButtonPresent: false,
  leftButtonCloseModal: false,
  rightButtonIcon: undefined,
  titlePresent: false,
  title: undefined,
  backgroundColor: 'rgb(151, 221, 255)',
  blueBackdrop: false,
  gradientBackdrop: false,
  showBorder: true,
  dropTopMargin: false,
  titleLogoPresent: false,
  popManually: false,
  type: 'material'
}

// ========================================================
// Export
// ========================================================

export default CustomNav
