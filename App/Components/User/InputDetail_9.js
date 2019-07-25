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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  KeyboardAvoidingView,
  Switch,
  Keyboard,
  ScrollView,
  LayoutAnimation,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import Toast
  from '../Common/Toast'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import { FORM_TYPES } from '../../Config/contants'
import CustomNav from '../../Containers/Common/CustomNav'
import styles from '../../Themes/ApplicationStyles'
import Fonts from '../../Themes/Fonts'
import { USER_ENTITIES } from '../../Utility/Mapper/User'
import { COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION } from '../../Utility/Mapper/Common'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import GravityCapsule from '../Utility/GravityCapsule'
import LWTextInput from '../Utility/LWFormInput'
import _
  from 'lodash'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import Colors from '../../Themes/Colors'

// ========================================================
// Utility
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_USER,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class InputUserDetail_9 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      _politicalOrganisationNameError: false,
      _immediateRelativesNameError: false,
      _stockTickerError: false,
      _brokerageCompanyNameError: false
    }
    const { height, width } = Dimensions.get('window')
    const isIPhoneX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.isX = isIPhoneX
  }

  componentWillMount () {
    this.updateFormValue(USER_ENTITIES.FAMILY_BROKERAGE_FLAG, false)
    this.updateFormValue(USER_ENTITIES.FAMILY_POLITICAL_FLAG, false)
    this.updateFormValue(USER_ENTITIES.STOCK_OWNER_FLAG, false)
  }

  componentDidMount () {
    this.updateCurrentOnboarding()
  }

  // ------------------------------------------------------------------------
  // action handlers

  markError (inputType, error) {
    switch (inputType) {
      case USER_ENTITIES.POLITICAL_ORGANISATION:
        this.setState({ _politicalOrganisationNameError: error })
        break
      case USER_ENTITIES.POLITICAL_ASSOCIATED_RELATIVE:
        this.setState({ _immediateRelativesNameError: error })
        break
      case USER_ENTITIES.STOCK_BROKERAGE_FIRM:
        this.setState({ _brokerageCompanyNameError: error })
        break
      case USER_ENTITIES.STOCK_TICKER:
        this.setState({ _stockTickerError: error })
        break
      default:
        this.setState({
          _politicalOrganisationNameError: false,
          _immediateRelativesNameError: false,
          _brokerageCompanyNameError: false,
          _stockTickerError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case USER_ENTITIES.POLITICAL_ORGANISATION:
        if (val && val.trim() !== '' && /^[a-zA-Z\s]*$/.test(val) && val.trim() === val) {
          this.markError(USER_ENTITIES.POLITICAL_ORGANISATION, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.POLITICAL_ORGANISATION, true)
          return 'political organisation required'
        }
      case USER_ENTITIES.POLITICAL_ASSOCIATED_RELATIVE:
        if (val && val.trim() !== '' && /^[a-zA-Z\s]*$/.test(val) && val.trim() === val) {
          this.markError(USER_ENTITIES.POLITICAL_ASSOCIATED_RELATIVE, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.POLITICAL_ASSOCIATED_RELATIVE, true)
          return 'political associated relative required'
        }
      case USER_ENTITIES.STOCK_BROKERAGE_FIRM:
        if (val && val.trim() !== '' && /^[a-zA-Z\s]*$/.test(val) && val.trim() === val) {
          this.markError(USER_ENTITIES.STOCK_BROKERAGE_FIRM, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.STOCK_BROKERAGE_FIRM, true)
          return 'stock brokerage required'
        }
      case USER_ENTITIES.STOCK_TICKER:
        if (val && val.trim() !== '' && /^[a-zA-Z\s]*$/.test(val) && val.trim() === val) {
          this.markError(USER_ENTITIES.STOCK_TICKER, false)
          return undefined
        } else {
          this.markError(USER_ENTITIES.STOCK_TICKER, true)
          return 'stock ticker required'
        }
    }
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  updateFormValue (field, value) {
    const { localActions, handleLocalAction } = this.props
    handleLocalAction({ type: localActions.UPDATE_FORM_VALUE, form: FORM_TYPES.ADD_USER, field: field, value: value })
  }

  navigateToNextScreen (data) {
    const { familyBrokerageFlag, familyPoliticalFlag, stockOwnerFlag } = data
    if (familyBrokerageFlag) {
      if (!data[USER_ENTITIES.STOCK_TICKER]) {
        return
      }
    }
    if (familyPoliticalFlag) {
      if (!data[USER_ENTITIES.POLITICAL_ASSOCIATED_RELATIVE]) {
        return
      }
      if (!data[USER_ENTITIES.POLITICAL_ORGANISATION]) {
        return
      }
    }
    if (stockOwnerFlag) {
      if (!data[USER_ENTITIES.STOCK_BROKERAGE_FIRM]) {
        return
      }
    }

    const { localActions, handleLocalAction, navigator, nextScreen, userID } = this.props
    handleLocalAction({ type: localActions.NAVIGATE_TO_NEXT_SCREEN,
      [USER_ENTITIES.USER_ID]: userID,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      familyBrokerageFlag: familyBrokerageFlag,
      familyPoliticalFlag: familyPoliticalFlag,
      familyBrokerageAnswer: data[USER_ENTITIES.STOCK_TICKER],
      familyPoliticalAnswer: data[USER_ENTITIES.POLITICAL_ORGANISATION]
    })
  }

  renderHeading () {
    return (
      <View style={{...styles.screen.h2.containerStyle, marginTop: 30, alignItems: 'center', paddingHorizontal: 20}}>
        <Text style={{fontFamily: Fonts.type.bold, textAlign: 'center', color: Colors.blue, fontSize: 22, lineHeight: 28, alignSelf: 'center'}}>
          Do any of the following apply to you?
        </Text>
        <Text style={{fontFamily: Fonts.type.book, textAlign: 'center', color: Colors.blue, fontSize: 18, lineHeight: 23, marginTop: 23, alignSelf: 'center'}}>
          It is likely none of these will apply to you.+ {'\n'}
        </Text>
      </View>
    )
  }

  // ------------------------------------------------------------------------
  // Family Brokerage Firm Relation

  renderBrokerageFields () {
    const { familyBrokerageFlag } = this.props
    return (
      <View style={{marginBottom: 36}}>
        <View>
          {this.renderLabel('Enter the stock ticker(s)')}
          <View style={{ ...styles.screen.textInput.parentContainerStyle, marginTop: 5, marginBottom: 1 }}>
            <Field
              name={USER_ENTITIES.STOCK_TICKER}
              whiteBackground
              accessible
              accessibilityLabel={'Stock Ticker'}
              accessibilityRole={'keyboardkey'}
              component={LWTextInput}
              isLabel
              label='Stock ticker'
              placeholderText='Brokerage company name(s)'
              isError={this.state._stockTickerError}
              validate={val => this.validate(USER_ENTITIES.STOCK_TICKER, val)}
            />
          </View>
        </View>
      </View>
    )
  }

  renderBrokerageSwitch () {
    const { familyBrokerageFlag } = this.props
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{flex: 8.5}}>
            <Text style={{fontFamily: Fonts.type.book, color: Colors.blue, fontSize: 16, lineHeight: 20, textAlign: 'left'}}>
              {'Do you or a family member work\nfor another brokerage firm?'}
            </Text>
          </View>
          <View style={{flex: 1.5, alignItems: 'flex-end'}}>
            <Switch
              accessible
              accessibilityLabel={'brokerageSwitch'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], left: 8, backgroundColor: '#F8F7F7', borderWidth: 1, borderColor: '#C2C4C7', borderRadius: 15 }}
              value={familyBrokerageFlag}
              onTintColor={'#2D50FE'}
              ios_backgroundColor={Colors.switchOff}
              tintColor={Colors.white}
              onValueChange={() => this.updateFormValue(USER_ENTITIES.FAMILY_BROKERAGE_FLAG, !this.props.familyBrokerageFlag)}
            />
          </View>
        </View>
        {familyBrokerageFlag && this.renderBrokerageFields()}
      </View>
    )
  }

  // ------------------------------------------------------------------------
  // Family Political Connection Relation

  renderPoliticalFields () {
    const { familyPoliticalFlag } = this.props
    return (
      <View>
        <View>
          {this.renderLabel('Related political organization')}
          <View style={{ ...styles.screen.textInput.parentContainerStyle, marginTop: 5, marginBottom: 1 }}>
            <Field
              whiteBackground
              name={USER_ENTITIES.POLITICAL_ORGANISATION}
              accessible
              isLabel
              label='Political organization name'
              accessibilityLabel={'Political Organisation Name'}
              accessibilityRole={'keyboardkey'}
              component={LWTextInput}
              returnKeyType='next'
              onSubmitEditing={() => this.relativename.getRenderedComponent().refs.relativename.focus()}
              placeholderText='Political organization name'
              isError={this.state._politicalOrganisationNameError}
              validate={val => this.validate(USER_ENTITIES.POLITICAL_ORGANISATION, val)}
            />
          </View>
        </View>
        <View>
          {this.renderLabel('Immediate relatives')}
          <View style={{ ...styles.screen.textInput.parentContainerStyle, marginTop: 5, marginBottom: 1 }}>
            <Field
              whiteBackground
              name={USER_ENTITIES.POLITICAL_ASSOCIATED_RELATIVE}
              accessible
              isLabel
              label='Immediate relatives name(s)'
              accessibilityLabel={'Political Associated Relative Name'}
              accessibilityRole={'keyboardkey'}
              ref={(el) => { this.relativename = el }}
              refField='relativename'
              withRef
              component={LWTextInput}
              placeholderText='Immediate relatives name(s)'
              isError={this.state._immediateRelativesNameError}
              validate={val => this.validate(USER_ENTITIES.POLITICAL_ASSOCIATED_RELATIVE, val)}
            />
          </View>
        </View>
      </View>
    )
  }

  renderPoliticalSwitch () {
    const { familyPoliticalFlag } = this.props
    return (
      <View style={{marginBottom: 50, backgroundColor: 'transparent'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 8.5}}>
            <Text style={{fontFamily: Fonts.type.book, color: Colors.blue, fontSize: 16, lineHeight: 20, textAlign: 'left'}}>
              Are you or a family member a senior executive, or 10% shareholder at a publically traded company?
            </Text>
          </View>
          <View style={{flex: 1.5, alignItems: 'flex-end'}}>
            <Switch
              accessible
              accessibilityLabel={'politicalSwitch'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], left: 8, backgroundColor: '#F8F7F7', borderWidth: 1, borderColor: '#C2C4C7', borderRadius: 15 }}
              value={familyPoliticalFlag}
              onTintColor={'#2D50FE'}
              ios_backgroundColor='red'
              tintColor={Colors.white}
              onValueChange={() => this.updateFormValue(USER_ENTITIES.FAMILY_POLITICAL_FLAG, !this.props.familyPoliticalFlag)}
            />
          </View>
        </View>
        {familyPoliticalFlag && this.renderPoliticalFields()}
      </View>
    )
  }

  // ------------------------------------------------------------------------
  // Family Shareholder Relation

  renderShareholderFields () {
    const { stockOwnerFlag } = this.props
    return (
      <View style={{ marginBottom: 36 }}>
        <View>
          {this.renderLabel('Brokerage company name(s)')}
          <View style={styles.screen.textInput.parentContainerStyle}>
            <Field
              whiteBackground
              name={USER_ENTITIES.STOCK_BROKERAGE_FIRM}
              accessible
              accessibilityLabel={'Stock Brokerage Firm'}
              accessibilityRole={'keyboardkey'}
              accessibilityHint={'Enter the stock ticker(s)'}
              component={LWTextInput}
              isLabel
              label='Brokerage Firm'
              placeholderText='Enter the stock ticker(s)'
              isError={this.state._brokerageCompanyNameError}
              validate={val => this.validate(USER_ENTITIES.STOCK_BROKERAGE_FIRM, val)}
            />
          </View>
        </View>
      </View>
    )
  }

  renderShareholderSwitch () {
    const { stockOwnerFlag } = this.props
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 8 }}>
            <Text style={{ fontSize: 16, fontFamily: Fonts.type.regular, color: Colors.blue, backgroundColor: 'transparent' }}>
              Are you or a family member a senior executive, or 10% shareholder at a publically traded company?
            </Text>
          </View>
          <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Switch
              accessible
              accessibilityLabel={'shareholderSwitch'}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], left: 8, backgroundColor: '#F8F7F7', borderWidth: 1, borderColor: '#C2C4C7', borderRadius: 15 }}
              value={stockOwnerFlag}
              onTintColor={'#2D50FE'}
              tintColor={Colors.white}
              onValueChange={() => this.updateFormValue(USER_ENTITIES.STOCK_OWNER_FLAG, !this.props.stockOwnerFlag)}
            />
          </View>
        </View>
        {!stockOwnerFlag && this.renderHorizontalLine()}
        {stockOwnerFlag && this.renderShareholderFields()}
      </View>
    )
  }

  // ------------------------------------------------------------------------
  // Next button

  renderLabel (title) {
    return (
      <View style={{ marginBottom: 5 }}>
        <Text style={{ fontSize: Fonts.size.buttonLabel, color: '#FFF', backgroundColor: 'transparent', fontFamily: 'montserrat-semibold' }}>
          {title}
        </Text>
      </View>
    )
  }

  renderNextButton () {
    const {handleSubmit, familyBrokerageFlag, familyPoliticalFlag, stockOwnerFlag} = this.props
    const isX = this.isX || false
    const buttonTitle = (familyPoliticalFlag || familyBrokerageFlag || stockOwnerFlag) ? 'Continue' : 'NONE OF THESE APPLY'
    return (
      <GravityCapsule floatValue={isX ? 20 : 10} keyboardExtraGap={27}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
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
          onPress={_.debounce(_.bind(handleSubmit(data => this.navigateToNextScreen(data)), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={{...styles.bottomNavigator.textStyle}}>{(!familyBrokerageFlag && !familyPoliticalFlag) ? 'None of these apply' : 'Continue'}</Text>
        </TouchableHighlight>
      </GravityCapsule>
    )
  }

  renderHorizontalLine () {
    return (
      <View style={{ flexDirection: 'row', marginTop: 28, marginBottom: 28 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#E6E6E6' }} />
      </View>
    )
  }

  renderMessage () {
    const { familyBrokerageFlag, familyPoliticalFlag, stockOwnerFlag } = this.props
    if (familyBrokerageFlag || familyPoliticalFlag || stockOwnerFlag) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontFamily: Fonts.type.regular, color: '#4A4A4A', backgroundColor: 'transparent' }}>
            Separate multiple names with commas.
          </Text>
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1 }} />
      )
    }
  }

  // ------------------------------------------------------------------------
  // Core render

  render () {
    const {toast, toastHeading, popButton, toastSubheading, navigator} = this.props
    return (
      <View style={{ ...styles.screen.containers.root, backgroundColor: '#FFF' }}>
        <Toast toast={toast} heading={toastHeading} subheading={toastSubheading} shouldFloat />
        <CustomNav navigator={navigator} gradientBackdrop leftButtonPresent={popButton} titlePresent title='Profile' />
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          resetScrollToCoords={{ x: 0, y: 0 }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 32 }}
        >
          {this.renderHeading()}
          <View style={{ marginTop: 15 }}>
            {this.renderPoliticalSwitch()}
            {this.renderBrokerageSwitch()}
          </View>
        </KeyboardAwareScrollView>
        {this.renderNextButton()}
      </View>
    )
  }
}

InputUserDetail_9.propTypes = {
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
  residencyType: PropTypes.string.isRequired,

  familyBrokerageFlag: PropTypes.bool.isRequired,
  familyPoliticalFlag: PropTypes.bool.isRequired,
  stockOwnerFlag: PropTypes.bool.isRequired,

  // toast
  toast: PropTypes.bool,
  toastHeading: PropTypes.string,
  toastSubheading: PropTypes.string,

  popButton: PropTypes.bool
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(InputUserDetail_9))

export default Screen
