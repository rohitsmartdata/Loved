/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 12/10/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, {Component}
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, Alert, Keyboard, TextInput}
  from 'react-native'
import {Icon}
  from 'react-native-elements'
import styles
  from '../../Themes/ApplicationStyles'
import Colors
  from '../../Themes/Colors'

// ========================================================
// Components
// ========================================================

class LWTextInput extends Component {

  // -------------------------------------------------------
  // action handlers

  onTextChange (text, input) {
    const {textChangeListener, formatFoo} = this.props

    // call redux form listener
    if (formatFoo) {
      input.onChange(formatFoo(text))
    } else {
      input.onChange(text)
    }

    // call the additional text change listener
    textChangeListener && textChangeListener(text)
  }

  // -------------------------------------------------------
  // core render method

  render () {
    const {placeholderColor, placeholderText, extraStyle, isError, inputColor, alignment, blurHandler, input, meta, ...inputProps} = this.props
    const showError = isError && meta.submitFailed
    return (
      <TextInput
        ref={inputRef => { this._inputRef = inputRef }}
        {...inputProps}
        value={input.value}
        autoCorrect={false}
        style={[styles.screen.textInput.containerStyle, extraStyle, {borderColor: '#9B9B9B', color: '#000', fontFamily: 'Lato-Regular'}]}
        onChangeText={text => this.onTextChange(text, input)}
        placeholder={placeholderText}
        placeholderTextColor='#9B9B9B'
      />
    )
  }

}

export class LWCustomTextInput extends Component {

  // -------------------------------------------------------
  // action handlers

  onTextChange (text, input) {
    const {textChangeListener} = this.props

    // call redux form listener
    input.onChange(text)

    // call the additional text change listener
    textChangeListener && textChangeListener(text)
  }

  // -------------------------------------------------------
  // core render method

  render () {
    const {placeholderColor, leftIconName, leftIcon, rightIcon, rightIconName, rightIconCallback, placeholderText, extraStyle, isError, inputColor, alignment, blurHandler, meta, input, ...inputProps} = this.props
    const showError = isError && meta.submitFailed
    return (
      <View style={{borderWidth: 1, borderColor: showError ? Colors.formInput.errorBorderColor : Colors.formInput.borderColor, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', height: 40, flex: 1, paddingLeft: 5, flexDirection: 'row'}}>
        {
          leftIcon && <Icon name={leftIconName} size={28} color='#FFF' />
        }
        <TextInput
          {...inputProps}
          value={input.value}
          autoCorrect={false}
          onChangeText={text => this.onTextChange(text, input)}
          placeholder={placeholderText}
          placeholderTextColor='rgba(255, 255, 255, 0.5)'
          style={{height: 40, flex: 1, paddingLeft: 16, color: '#FFF', fontSize: 16, fontFamily: 'Montserrat-Light'}}
        />
        {
          rightIcon && (
            <Icon name={rightIconName} size={28} color='#FFF' style={{position: 'absolute', right: 5, top: 5}} underlayColor='transparent' onPress={() => rightIconCallback && rightIconCallback()} />
          )
        }
      </View>
    )
  }

}

LWCustomTextInput.propTypes = {
  // placeholder text
  placeholderText: PropTypes.string.isRequired,
  // extra styling provided to textinput
  extraStyle: PropTypes.object,
  // additional listener to text change; optional
  textChangeListener: PropTypes.func,
  // is left icon required
  leftIcon: PropTypes.bool,
  // name of the left icon to include
  leftIconName: PropTypes.string,
  // is right icon required
  rightIcon: PropTypes.bool,
  // name of the right icon to include
  rightIconName: PropTypes.string,
  // callback for right icon
  rightIconCallback: PropTypes.func,

  isError: PropTypes.bool
}

// ========================================================
// Exports
// ========================================================

LWTextInput.propTypes = {
  // placeholder text
  placeholderText: PropTypes.string.isRequired,
  // extra styling provided to textinput
  extraStyle: PropTypes.object,
  // additional listener to text change; optional
  textChangeListener: PropTypes.func,
  // format function for input
  formatFoo: PropTypes.func,
  // is error ?
  isError: PropTypes.bool,
  // focus smoothly
  focusSmoothly: PropTypes.bool
}

LWTextInput.defaultProps = {
  placholder: '',
  extraStyle: {},
  isError: false,
  focusSmoothly: false
}

export default LWTextInput
