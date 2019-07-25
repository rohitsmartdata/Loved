/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by demon on 12/10/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, Keyboard, TextInput }
  from 'react-native'
import { Icon }
  from 'react-native-elements'
import styles
  from '../Themes/ApplicationStyles'
import Colors
  from '../Themes/Colors'
import { formatPrice } from '../Utility/Transforms/Converter'
import Fonts from '../Themes/Fonts'
import ShadowedContainer from './ShadowedContainer'
import { Field } from 'redux-form'

// ========================================================
// Components
// ========================================================

class EditableTextInput extends Component {

  constructor (props) {
    super(props)
    this.state = {
      editText: props.editText || false,
      textInputValue: props.value
    }
  }

  // -------------------------------------------------------
  // action handlers

  onTextChange (inputText, input) {
    if (!inputText) { return }

    let text = inputText.replace('$', '')
    text = text.replace(',', '')

    const {textChangeListener, minimumValue = 0} = this.props

    if (isNaN(parseInt(text)) || (minimumValue && parseInt(text) < minimumValue)) {
      this.setState({textInputValue: minimumValue.toString()})
      textChangeListener && textChangeListener(text)
    } else {
      this.setState({textInputValue: text})
      textChangeListener && textChangeListener(text)
    }
  }

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this))
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _keyboardDidShow = () => {
    console.log('key board show')
  }

  _keyboardDidHide = () => {
    // const { shouldCallonSubmit } = this.props
    // alert('key board hide' + shouldCallonSubmit)
  }

  onSubmit () {
    const {onSubmitEditing} = this.props
    this.setState({editText: false})
    // call the additional text change listener
    onSubmitEditing && onSubmitEditing(this.state.textInputValue)
  }

  // -------------------------------------------------------
  // core render method

  render () {
    const {meta, value, inputProps, keyboardType, maxLength, style, textInputStyle, formatValue, minimumValue = 0} = this.props
    let textValue = this.state.textInputValue || minimumValue

    return (
      <View style={{
        height: 54,
        borderWidth: 1,
        borderColor: '#9FB0C5',
        borderRadius: 50,
        paddingHorizontal: 10,
        justifyContent: 'center',
        ...style
      }}>
        {
          this.state.editText &&
          <TextInput
            accessible
            accessibilityLabel={'editableTextInput'}
            ref={inputRef => { this._inputRef = inputRef }}
            value={(formatValue) ? formatValue(textValue) : textValue}
            autoCorrect={false}
            style={{
              color: '#1C3C70',
              bottom: 0,
              fontFamily: Fonts.type.bold,
              fontSize: 27,
              width: '100%',
              textAlign: 'center',
              ...textInputStyle
            }}
            onChangeText={text => this.onTextChange(text)}
            onSubmitEditing={this.onSubmit.bind(this)}
            onBlur={this.onSubmit.bind(this)}
            keyboardType='decimal-pad'
            maxLength={maxLength}
            returnKeyType={'done'}
            {...inputProps}
          /> ||
          <View>
            <Text
              accessible
              accessibilityLabel={'editableText'}
              style={{
                color: '#1C3C70',
                bottom: 0,
                fontFamily: Fonts.type.bold,
                fontSize: 27,
                textAlign: 'center',
                ...textInputStyle
              }}>
              {(formatValue) ? formatValue(value) : value}
            </Text>
            <View style={{position: 'absolute', right: 0, top: 0, bottom: 0, justifyContent: 'center'}}>
              <ShadowedContainer
                accessible
                accessibilityLabel={'editableTextContainer'}
                accessibilityRole={'button'}
                size={26} onPress={() => {
                  this.setState({editText: true, textInputValue: value}, () => {
                    this._inputRef && this._inputRef.focus()
                  })
                }}>
                <Icon accessible accessibilityLabel={'editableTextIcon'} name='edit-3' type='feather' color={Colors.fontGray} size={11} />
              </ShadowedContainer>
            </View>
          </View>
        }
      </View>
    )
  }
}

EditableTextInput.propTypes = {
  keyboardType: PropTypes.string.isRequired,
  maxLength: PropTypes.number
}
EditableTextInput.defaultProps = {
  keyboardType: 'number-pad',
  maxLength: 7
}

export default EditableTextInput
