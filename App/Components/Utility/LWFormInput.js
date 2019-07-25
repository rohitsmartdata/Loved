/* eslint-disable no-unused-vars,no-trailing-spaces,no-useless-escape,spaced-comment */
/**
 * Created by demon on 7/1/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Animated, LayoutAnimation, TextInput, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, Dimensions }
  from 'react-native'
import TextInputMask
  from 'react-native-text-input-mask'
import {FormInput, Icon}
  from 'react-native-elements'
import Fonts
  from '../../Themes/Fonts'
import Colors from '../../Themes/Colors'

// ========================================================
// Core Class
// ========================================================

class LWFormInput extends Component {

  // -------------------------------------------------------
  // Lifecycle methods

  constructor (props) {
    super(props)
    this.state = {
      showLabel: false,
      top: 0,
      opacity: 0,
      toggled: false
    }
  }

  toggleLabel (top) {
    LayoutAnimation.spring()
    if (top) {
      this.setState({
        top: -20,
        opacity: 1,
        toggled: true
      })
    } else {
      this.setState({
        top: 0,
        opacity: 0,
        toggled: false
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    const text = nextProps.input.value
    if (this.props.input !== nextProps.input) {
      const {toggled, top} = this.state
      if (text && text.length > 0 && !toggled && top === 0) {
        this.toggleLabel(true)
      } else if (toggled && ((text && text.length === 0) || !text) && top === -20) {
        this.toggleLabel(false)
      }
    }
  }

  componentDidMount () {
    const {focusSmoothly} = this.props
    if (focusSmoothly && this._inputRef) {
      setTimeout(() => {
        this._inputRef.focus()
      }, 600)
    }
  }

  // -------------------------------------------------------
  // Action handler

  onTextChange (text, input) {
    const {textChangeListener} = this.props

    const {toggled} = this.state
    if (text && text.length > 0 && !toggled) {
      this.toggleLabel(true)
    } else if (toggled && ((text && text.length === 0) || !text)) {
      this.toggleLabel(false)
    }

    // call redux form listener
    input.onChange(text)
    // call the additional text change listener
    textChangeListener && textChangeListener(text)
  }

  renderLabel () {
    const {isLabel, label, alignment} = this.props
    const {top, opacity} = this.state
    if (isLabel) {
      return (
        <Animated.View style={{top: top, opacity: opacity, position: 'absolute', left: 15}}>
          <Text style={{textAlign: alignment, fontSize: 11, backgroundColor: 'transparent', color: Colors.fontGray}}>
            {label}
          </Text>
        </Animated.View>
      )
    } else {
      return null
    }
  }

  // -------------------------------------------------------
  // Core components

  render () {
    const {placeholderColor, isLabel, iconName, mask, textChangeListener, whiteBackground, iconCallback, showBorder, placeholderText, showIcon, extraTextStyle, extraStyle, isError, inputColor, alignment, blurHandler, input, meta, onDemandError, iconStyle, iconColor, iconSize, refField, ...inputProps} = this.props
    const showError = isError && meta.submitFailed || isError && onDemandError
    const normalBorderColor = extraStyle.borderColor || Colors.fontGray
    let fontFamily = inputProps.secureTextEntry ? {} : {fontFamily: Fonts.type.book}
    const normalTextColor = placeholderColor || (whiteBackground ? 'rgba(0, 0, 0, 0.5)' : '#FFF')
    if (mask) {
      return (
        <View style={{flex: 1, borderWidth: 1, borderColor: showError ? Colors.switchOff : Colors.fontGray, borderRadius: 5, paddingHorizontal: 17, justifyContent: 'center'}}>
          {this.renderLabel()}
          <TextInputMask
            {...inputProps}
            refInput={refField && refField || (inputRef => { this._inputRef = inputRef })}
            autoCorrect={false}
            value={input.value}
            placeholder={placeholderText}
            placeholderTextColor={Colors.fontGray}
            onChangeText={(formatted, extracted) => this.onTextChange(formatted, input)}
            style={{color: '#1C3C70', bottom: 0, ...fontFamily, fontSize: 16, width: '100%', ...extraTextStyle}}
            mask={mask}
          />
        </View>
      )
    } else {
      if (showIcon) {
        return (
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center', borderWidth: showBorder ? 1 : 0, borderColor: showError ? Colors.switchOff : normalBorderColor, borderRadius: 5}}>
            {this.renderLabel()}
            <FormInput
              {...inputProps}
              ref={refField && refField || (inputRef => { this._inputRef = inputRef })}
              autoCorrect={false}
              value={input.value}
              onChangeText={text => this.onTextChange(text, input)}
              containerStyle={{marginLeft: 5, marginRight: 5, borderBottomWidth: 0, flex: 1}}
              placeholder={placeholderText}
              placeholderTextColor={Colors.fontGray}
              inputStyle={{color: '#1C3C70', bottom: 0, ...fontFamily, fontSize: 16, width: '100%', ...extraTextStyle}}
            />
            <Icon name={iconName} size={iconSize || 28} onPress={() => iconCallback && iconCallback()} color={iconColor || '#D7D7D7'} style={{marginBottom: 15, ...iconStyle}} underlayColor='transparent' />
          </View>
        )
      } else {
        return (
          <View style={{flex: 1, borderWidth: showBorder ? 1 : 0, borderColor: showError ? Colors.switchOff : Colors.fontGray, borderRadius: 5, paddingHorizontal: 10, justifyContent: 'center'}}>
            {this.renderLabel()}
            <FormInput
              {...inputProps}
              ref={refField && refField || (inputRef => { this._inputRef = inputRef })}
              autoCorrect={false}
              value={input.value}
              onChangeText={text => this.onTextChange(text, input)}
              containerStyle={{marginLeft: 5, marginRight: 5, borderBottomWidth: 0}}
              placeholder={placeholderText}
              placeholderTextColor={Colors.fontGray}
              inputStyle={{color: '#1C3C70', bottom: 0, ...fontFamily, fontSize: 16, width: '100%', ...extraTextStyle}}
            />
          </View>
        )
      }
    }
  }
}

// ========================================================
// Prop Utility
// ========================================================

LWFormInput.propTypes = {
  // is label
  isLabel: PropTypes.bool.isRequired,
  // label
  label: PropTypes.string.isRequired,
  // placeholder text
  placeholderText: PropTypes.string.isRequired,
  // extra styling provided to textinput
  extraStyle: PropTypes.object,
  // extra styling for input text
  extraTextStyle: PropTypes.object,
  // additional listener to text change; optional
  textChangeListener: PropTypes.func,
  // format function for input
  formatFoo: PropTypes.func,
  // is error ?
  isError: PropTypes.bool,
  // should show Icon
  showIcon: PropTypes.bool,
  // icon Name
  iconName: PropTypes.string,
  // icon callback
  iconCallback: PropTypes.func,
  // show border
  showBorder: PropTypes.bool,
  // white background
  whiteBackground: PropTypes.bool,
  // focus smoothly
  focusSmoothly: PropTypes.bool,
  // mask
  mask: PropTypes.string,
  // identifier to show error immediately without onSubmitEditing
  onDemandError: PropTypes.bool,

  refField: PropTypes.string
}

LWFormInput.defaultProps = {
  isLabel: false,
  placholder: '',
  extraStyle: {},
  extraTextStyle: {},
  isError: false,
  showIcon: false,
  iconName: 'visibility',
  showBorder: true,
  whiteBackground: false,
  focusSmoothly: false,
  mask: undefined,
  onDemandError: false
}

// ========================================================
// Exporter
// ========================================================

export default LWFormInput
