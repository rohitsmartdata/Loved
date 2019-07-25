/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 21/6/17.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { View, Text, Alert, Dimensions, KeyboardAvoidingView, Keyboard, ScrollView, Image, ActivityIndicator, TouchableOpacity, TouchableHighlight }
  from 'react-native'
import { reduxForm, Field, reset }
  from 'redux-form'
import { connect }
  from 'react-redux'
import CustomNav
  from '../../Containers/Common/CustomNav'
import { FORM_TYPES }
  from '../../Config/contants'
import styles
  from '../../Themes/ApplicationStyles'
import { CHILD_ENTITIES }
  from '../../Utility/Mapper/Child'
import { USER_ENTITIES }
  from '../../Utility/Mapper/User'
import { AUTH_ENTITIES }
  from '../../Utility/Mapper/Auth'
import { SETTINGS_ENTITIES }
  from '../../Utility/Mapper/Settings'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION }
  from '../../Utility/Mapper/Common'
import { KeyboardAwareScrollView }
  from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule
  from '../Utility/GravityCapsule'
import LWTextInput
  from '../Utility/LWFormInput'
import Fonts
  from '../../Themes/Fonts'
import { validateDate }
  from '../../Utility/Transforms/Validator'
var Moment = require('moment')
import Avatar from '../../Containers/Utility/Avatar'
import _
  from 'lodash'
import { analytics }
  from '../../Config/AppConfig'
import {screens, events}
  from '../../Utility/Mapper/Tracking'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
import Colors
  from '../../Themes/Colors'
import Modal
  from 'react-native-modal'
import CustodialInfo
  from './CustodialInfo'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_CHILD,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class AddChildBirthDate extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _DOBError: false,
      showAgeWarning: false,
      showModal: false
    }
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentDidMount () {
    const {userID} = this.props
    // shouldUpdateOnboarding && this.updateCurrentOnboarding()
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.ACCOUNT_KYC_DATE_OF_BIRTH
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handlers

  toggleModal (visible) {
    this.setState({
      showModal: visible
    })

    const {userID} = this.props
    if (visible) {
      // *********** Log Analytics ***********
      analytics.track({
        userId: userID,
        event: events.VIEWED_WHAT_IS_CUSTODIAL_ACCOUNT
      })
      // *********** Log Analytics ***********
    }
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  markError (inputType, error) {
    switch (inputType) {
      case CHILD_ENTITIES.DOB:
        this.setState({ _DOBError: error })
        break
      default:
        this.setState({
          _DOBError: false
        })

    }
  }

  validate (type, val) {
    switch (type) {
      case CHILD_ENTITIES.DOB:
        if (validateDate(val) || !Moment(val, 'MM/DD/YYYY').isValid() || Moment(val, 'MM/DD/YYYY').isAfter(Moment())) {
          this.markError(USER_ENTITIES.DOB, true)
          return 'DOB REQUIRED PROPERLY'
        } else {
          this.markError(USER_ENTITIES.DOB, false)
          return undefined
        }
    }
  }

  navigateToNextScreen (data) {
    const { localActions, handleLocalAction, userID, userSSNAdded, identityData, emailID, token, imageMetadata, navigator, isAddingDream, isAddingDesire, isOnboardingFlow } = this.props
    let d = data[CHILD_ENTITIES.DOB]
    let date = Moment(d, 'MM/DD/YYYY')
    let now = Moment()
    let age = now.diff(date, 'days')
    // Alert.alert('Diff :: ', age)
    if (age > 7305) {
      this.setState({showAgeWarning: 'Sorry, Loved is for those under 18 only.\nContact support service for any queries at\nsupport@loved.com'})
    } else {
      this.setState({showAgeWarning: false})
      handleLocalAction({
        type: localActions.SUBMIT_ADD_CHILD,
        [CHILD_ENTITIES.FIRST_NAME]: this.props[CHILD_ENTITIES.FIRST_NAME] || data[CHILD_ENTITIES.FIRST_NAME],
        [CHILD_ENTITIES.LAST_NAME]: this.props[CHILD_ENTITIES.LAST_NAME] || data[CHILD_ENTITIES.LAST_NAME],
        [CHILD_ENTITIES.DOB]: data[CHILD_ENTITIES.DOB],
        [COMMON_ENTITIES.NAVIGATOR]: navigator,
        [USER_ENTITIES.USER_ID]: userID,
        [USER_ENTITIES.IDENTITY_DATA]: identityData,
        [CHILD_ENTITIES.IS_ADDING_DESIRE]: isAddingDesire,
        [CHILD_ENTITIES.IS_ADDING_DREAM]: isAddingDream,
        [SETTINGS_ENTITIES.IMAGE_METADATA]: imageMetadata,
        [USER_ENTITIES.IS_SSN_ADDED]: userSSNAdded,
        [AUTH_ENTITIES.ID_TOKEN]: token,
        [USER_ENTITIES.EMAIL_ID]: emailID,
        [COMMON_ENTITIES.IS_ONBOARDING_FLOW]: isOnboardingFlow
      })
    }
  }

  // --------------------------------------------------------
  // Child Components

  renderHeading () {
    return (
      <View style={{ ...styles.screen.h2.containerStyle, marginBottom: 10, alignItems: 'center' }}>
        <Text style={{ fontFamily: Fonts.type.bold, color: '#1C3C70', fontSize: 22, alignSelf: 'center', marginBottom: 20 }}>
          What’s their date of birth?
        </Text>
        <Text style={{ fontFamily: Fonts.type.book, color: '#1C3C70', fontSize: 18, textAlign: 'center' }}>
          {'We are required to collect this\ninformation under Federal Law.'}
        </Text>
      </View>
    )
  }

  renderFormContainer () {
    const { handleSubmit, userID, userEmail } = this.props
    const { width } = Dimensions.get('window')

    return (
      <View style={{flex: 1, marginBottom: 110}}>
        <View style={{flex: 1}}>
          <View style={{ ...styles.screen.textInput.parentContainerStyle, marginTop: 30 }}>
            <Field
              name={CHILD_ENTITIES.DOB}
              label={''}
              isLabel
              maxLength={14}
              accessible
              focusSmoothly
              whiteBackground
              accessibilityLabel={'Date Of Birth'}
              accessibilityRole={'keyboardkey'}
              component={LWTextInput}
              mask='[00] / [00] / [0000]'
              returnKeyType='next'
              onSubmitEditing={handleSubmit(data => this.navigateToNextScreen(data))}
              placeholderText='Birthdate (MM / DD / YYYY)'
              isError={this.state._DOBError}
              keyboardType='number-pad'
              extraTextStyle={{ marginRight: 4, width: width - 90 }}
              validate={val => this.validate(CHILD_ENTITIES.DOB, val)}
            />
          </View>
          {
            (this.state.showAgeWarning) &&
            <Text style={{ ...styles.text.title, textAlign: 'left', color: Colors.switchOff, fontWeight: 'normal' }}>
              {this.state.showAgeWarning}
            </Text>
          }
        </View>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={`{what's a custodial account?}`}
          accessibilityRole={'button'}
          onPress={() => this.toggleModal(true)}>
          <Text style={{ ...styles.text.title, color: Colors.fontGray, textDecorationLine: 'underline' }}>
            {'What’s a custodial account?'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderNextButton () {
    const { handleSubmit, isProcessing } = this.props
    const isX = this.isX || false
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableOpacity
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          disabled={isProcessing}
          accessibilityLabel={'Continue'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle,
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0},
            marginHorizontal: 20
          }}
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNextScreen(data)), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Continue</Text>
        </TouchableOpacity>
      </GravityCapsule>
    )
  }

  renderModal () {
    const {showModal} = this.state
    if (!showModal) {
      return null
    } else {
      return (
        <Modal
          keyboardShouldPersistTaps='always'
          style={{justifyContent: 'flex-end', marginVertical: 100, marginHorizontal: 32}}
          backdropColor='black'
          animationOut='slideOutDown'
          backdropOpacity={0.6}
          isVisible={showModal}>

          <CustodialInfo toggleModal={this.toggleModal.bind(this)} />

        </Modal>
      )
    }
  }

  // --------------------------------------------------------
  // Render Core component

  render () {
    const { isProcessing, navigator, popButton } = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#FFF'}}>
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent={popButton} titlePresent title='Custodial Account' />
        <ProcessingIndicator isProcessing={isProcessing} />
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          {this.renderHeading()}
          {this.renderFormContainer()}
        </View>
        {this.renderNextButton()}
        {this.renderModal()}
      </View>
    )
  }
}

AddChildBirthDate.propTypes = {
  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func.isRequired,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object.isRequired,

  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  userID: PropTypes.string.isRequired,

  // user identity data
  identityData: PropTypes.object,

  // is processing
  isProcessing: PropTypes.bool.isRequired,

  // user email
  userEmail: PropTypes.string,

  // email id
  emailID: PropTypes.string.isRequired,

  // is adding desire
  isAddingDesire: PropTypes.bool,

  // is adding dream
  isAddingDream: PropTypes.bool,

  // image meta data
  imageMetadata: PropTypes.object,

  // id token string
  token: PropTypes.string,

  popButton: PropTypes.bool,

  userSSNAdded: PropTypes.bool,

  shouldUpdateOnboarding: PropTypes.bool,

  isOnboardingFlow: PropTypes.bool
}

AddChildBirthDate.defaultProps = {
  isProcessing: false,
  // is adding desire
  isAddingDesire: false,
  // is adding dream
  isAddingDream: false,
  // pop button present of not
  popButton: true,
  // should update onboarding
  shouldUpdateOnboarding: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(AddChildBirthDate))

export default Screen
