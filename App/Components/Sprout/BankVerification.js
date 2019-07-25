/* eslint-disable no-trailing-spaces,spaced-comment,no-unused-vars,camelcase */
/**
 * Created by demon on 24/8/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Dimensions, Text, TouchableOpacity, Alert
} from 'react-native'
import CustomNav from '../../Containers/Common/CustomNav'
import styles from '../../Themes/ApplicationStyles'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import { Icon } from 'react-native-elements'
import Modal
  from 'react-native-modal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Field, reduxForm } from 'redux-form'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import LWFormInput from '../Utility/LWFormInput'
import GravityCapsule from '../Utility/GravityCapsule'
import _ from 'lodash'
import { FORM_TYPES } from '../../Config/contants'
import connect from 'react-redux/es/connect/connect'
import { CHILD_ENTITIES } from '../../Utility/Mapper/Child'
import { AUTH_ENTITIES } from '../../Utility/Mapper/Auth'
import EditableTextInput from '../../CommonComponents/editableTextInput'

const form = reduxForm({
  form: FORM_TYPES.BANK_VERIFICATION_DETAILS,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class BankVerification extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _firstAmountError: false,
      _secondAmountError: false
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentDidMount () {
    const {userID} = this.props
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.BANK_VERIFICATION
    })
    // *********** Log Analytics ***********
  }

  hideModel () {
    const {hideModal} = this.props
    hideModal && hideModal(false, undefined)
  }

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.FIRST_AMOUNT:
        this.setState({ _firstAmountError: error })
        break
      case USER_ENTITIES.SECOND_AMOUNT:
        this.setState({ _secondAmountError: error })
        break
      default:
        this.setState({
          _firstAmountError: false,
          _secondAmountError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.FIRST_AMOUNT:
        if (val && val.trim() !== '' && val.trim() === val && !isNaN(parseFloat(val))) {
          this.markError(USER_ENTITIES.FIRST_AMOUNT, false)
          return 'verified'
        } else {
          this.markError(USER_ENTITIES.FIRST_AMOUNT, true)
          return 'FIRST AMOUNT REQ'
        }
      case USER_ENTITIES.SECOND_AMOUNT:
        if (val && val.trim() !== '' && val.trim() === val && !isNaN(parseFloat(val))) {
          this.markError(USER_ENTITIES.SECOND_AMOUNT, false)
          return 'verified'
        } else {
          this.markError(USER_ENTITIES.SECOND_AMOUNT, true)
          return 'SECOND AMOUNT REQ'
        }
    }
  }

  // --------------------------------------------------------
  // Action handlers

  navigateToNextScreen (data) {
    const { localActions, handleLocalAction, navigator, userID, childID, fundingSourceReferenceID } = this.props
    let amount1 = parseFloat(data[USER_ENTITIES.FIRST_AMOUNT]).toFixed(3)
    let amount2 = parseFloat(data[USER_ENTITIES.SECOND_AMOUNT]).toFixed(3)
    // enter validation
    let isAmount1 = this.validate(USER_ENTITIES.FIRST_AMOUNT, amount1)
    let isAmount2 = this.validate(USER_ENTITIES.SECOND_AMOUNT, amount2)
    if (isAmount1 === 'verified' && isAmount2 === 'verified') {
      handleLocalAction({
        type: localActions.VERIFY_FUNDING_AMOUNT,
        [USER_ENTITIES.USER_ID]: userID,
        [CHILD_ENTITIES.CHILD_ID]: childID,
        [USER_ENTITIES.SOURCE_REFERENCE_ID]: fundingSourceReferenceID,
        [USER_ENTITIES.FIRST_AMOUNT]: parseFloat(amount1),
        [USER_ENTITIES.SECOND_AMOUNT]: parseFloat(amount2),
        [COMMON_ENTITIES.CALLBACK_FUCTION]: () => this.hideModel(),
        [COMMON_ENTITIES.NAVIGATOR]: navigator
      })
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    const { fundingSourceAccount } = this.props
    return (
      <View style={{ ...styles.screen.h2.containerStyle }}>
        <Text style={{ ...styles.text.mainHeader, alignSelf: 'center', marginBottom: 20 }}>
          Verify Next Amounts Received
        </Text>
        <Text style={{ ...styles.text.header, alignSelf: 'center', fontWeight: 'normal' }}>
          {`Please Verify the next two amounts deposited into your account ending in ${fundingSourceAccount.slice(-4)}`}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { handleSubmit } = this.props
    return (
      <View style={{ marginTop: 20 }}>
        <View style={{...styles.screen.textInput.parentContainerStyle}}>
          <Field
            name={USER_ENTITIES.FIRST_AMOUNT}
            isLabel
            label='First Amount'
            whiteBackground
            accessible
            accessibilityLabel={'First Amount'}
            accessibilityRole={'keyboardkey'}
            keyboardType='decimal-pad'
            returnKeyType='next'
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))}
            component={LWFormInput}
            placeholderText='First Amount'
            textChangeListener={(text) => this.validate(USER_ENTITIES.FIRST_AMOUNT, text)}
            isError={this.state._firstAmountError} />
        </View>
        <View style={{ ...styles.screen.textInput.parentContainerStyle, marginTop: 15 }}>
          <Field
            name={USER_ENTITIES.SECOND_AMOUNT}
            isLabel
            label='Second Amount'
            whiteBackground
            accessible
            accessibilityLabel={'Second Amount'}
            accessibilityRole={'keyboardkey'}
            keyboardType='decimal-pad'
            returnKeyType='next'
            onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))}
            component={LWFormInput}
            placeholderText='Second Amount'
            textChangeListener={(text) => this.validate(USER_ENTITIES.SECOND_AMOUNT, text)}
            isError={this.state._secondAmountError} />
        </View>
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{ 
            ...styles.bottomNavigator.containerStyle, 
            // shadowOpacity: 0.15, 
            // shadowRadius: 10, 
            // shadowOffset: {height: 10, width: 0}, 
            marginHorizontal: 20 
          }}
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNextScreen(data), this)), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  renderModalView () {
    const { isProcessing, navigator, canPop } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} leftButtonPresent={canPop} titlePresent title='Bank Verification' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          showsVerticalScrollIndicator={false}
          extraScrollHeight={120}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ flex: 0 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {this.renderHeading()}
            {this.renderFormContainer()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderNextButton()}
        {this.renderCloseButton()}
      </View>
    )
  }

  renderCloseButton () {
    return (
      <View style={{position: 'absolute', top: 38, right: 20}}>
        <Icon name='close' size={32} onPress={() => this.hideModel()} />
      </View>
    )
  }

  // --------------------------------------------------------
  // Core render method

  render () {
    const {isVisible} = this.props
    return (
      <View>
        <Modal
          keyboardShouldPersistTaps='always'
          style={{justifyContent: 'flex-end', marginTop: 40, marginLeft: 0, marginRight: 0, marginBottom: 0}}
          onBackdropPress={() => this.hideModel()}
          onSwipe={() => this.hideModel()}
          swipeDirection='down'
          hideModalContentWhileAnimating
          scrollOffsetMax={300} // content height - ScrollView height
          isVisible={isVisible}>
          {this.renderModalView()}
        </Modal>
      </View>
    )
  }
}

// ========================================================
// Prop verifiers
// ========================================================

BankVerification.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // is add child processing
  isProcessing: PropTypes.bool.isRequired,

  // is visible
  isVisible: PropTypes.bool.isRequired,

  // hide the modal
  hideModal: PropTypes.func.isRequired,

  // userID
  userID: PropTypes.string,

  // childID
  childID: PropTypes.string,

  fundingSourceReferenceID: PropTypes.string,

  fundingSourceAccount: PropTypes.string
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(BankVerification))

export default Screen
