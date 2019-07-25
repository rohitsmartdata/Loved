/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by victorchoudhary on 11/05/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, {Component}
  from 'react'
import PropTypes
  from 'prop-types'
import {View, Text, Alert, Keyboard, Animated}
  from 'react-native'
import { FormInput, FormValidationMessage }
  from 'react-native-elements'
import colors from '../../Themes/Colors'
import fonts from '../../Themes/Fonts'

// ========================================================
// Components
// ========================================================

class CustomInput extends Component {

  // -------------------------------------------------------
  // Constructor

  constructor (props) {
    super(props)
    this.state = {
      showLabel: false
    }
    this.h = {
      fade: new Animated.Value(0.3),
      top: new Animated.Value(10)
    }
  }

  // -------------------------------------------------------
  // action handlers

  toggleLabel (show) {
    // do not run through function
    // if we already have 'show' state
    if (this.state.showLabel === show) {
      return
    }

    this.setState({showLabel: show})
    if (show) {
      Animated.parallel([
        Animated.timing(                  // Animate over time
          this.h.fade,                // The animated value to drive
          {
            toValue: 1,                   // Animate to opacity: 1 (opaque)
            duration: 250               // Make it take a while
          }
        ).start(),
        Animated.timing(                  // Animate over time
          this.h.top,                // The animated value to drive
          {
            toValue: 0,                   // Animate to opacity: 1 (opaque)
            duration: 250               // Make it take a while
          }
        ).start()
      ])
    } else {
      this.h.fade = new Animated.Value(0)
      this.h.top = new Animated.Value(10)
    }
  }

  onTextChange (text, input) {
    const {textChangeListener} = this.props

    // call redux form listener
    input.onChange(text)

    // call custom listener from parent component
    textChangeListener && textChangeListener(text)
  }

  // -------------------------------------------------------
  // render inner components

  renderLabel () {
    const {isLabel, label, alignment} = this.props
    if (isLabel) {
      return (
        <Animated.View style={{opacity: this.h.fade, top: this.h.top}}>
          <Text style={{textAlign: alignment, fontSize: 12, backgroundColor: 'transparent', color: '#FFF'}}>
            {label}
          </Text>
        </Animated.View>
      )
    } else {
      return null
    }
  }

  componentWillUpdate () {
    if (this.props.input && this.props.input.value && this.props.input.value.length > 0) {
      this.toggleLabel(true)
    }
  }

  renderInput (placeholderText) {
    const {placeholderColor, inputColor, alignment, blurHandler, input, ...inputProps} = this.props
    return (
      <FormInput
        {...inputProps}
        autoCorrect={false}
        placeholder={this.state.showLabel ? undefined : placeholderText}
        onChangeText={text => this.onTextChange(text, input)}
        onBlur={(obj) => { obj.nativeEvent.text.length === 0 && this.toggleLabel(false); input.onBlur(); blurHandler && blurHandler() }}
        onFocus={(obj) => { this.toggleLabel(true); input.onFocus }}
        value={input.value}
        containerStyle={{marginLeft: 0, marginRight: 0, borderBottomWidth: 0}}
        placeholderTextColor={placeholderColor || colors.inactiveInput}
        inputStyle={{color: inputColor || colors.actionInput, fontSize: fonts.size.formInput, textAlign: alignment}}
      />
    )
  }

  renderErrorMessage (message) {
    const {errorLabelColor} = this.props
    return (
      <FormValidationMessage labelStyle={{color: errorLabelColor || 'rgb(226,134,76)'}}>
        {message}
      </FormValidationMessage>
    )
  }

  // -------------------------------------------------------
  // core render method

  render () {
    const {placeholderText, isSection} = this.props
    return (
      <View style={{marginBottom: isSection ? 16 : 0}}>
        {this.state.showLabel && this.renderLabel()}
        {this.renderInput(placeholderText)}
      </View>
    )
  }

}

// ========================================================
// Exports
// ========================================================

CustomInput.propTypes = {
  isLabel: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  placeholderText: PropTypes.string.isRequired,
  isSection: PropTypes.bool.isRequired,
  textChangeListener: PropTypes.func,
  alignment: PropTypes.string,
  blurHandler: PropTypes.func
}

CustomInput.defaultProps = {
  isLabel: false,
  isSection: false,
  placholder: '',
  textChangeListener: undefined,
  alignment: 'center',
  blurHandler: undefined
}

export default CustomInput
