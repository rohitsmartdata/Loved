/* eslint-disable no-unused-vars,no-multi-spaces,no-trailing-spaces,operator-linebreak */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {
  View, Text, Alert, FlatList, Modal, TouchableHighlight, TouchableOpacity, Image, Dimensions, ScrollView, Animated,
  AsyncStorage, ImageBackground, StyleSheet, Platform, LayoutAnimation
}
  from 'react-native'
import {reduxForm, Field}
  from 'redux-form'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import {Icon}
  from 'react-native-elements'
import { connect }
  from 'react-redux'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION}
  from '../../Utility/Mapper/Common'
import LWTextInput
  from '../Utility/LWFormInput'
import { analytics } from '../../Config/AppConfig'
import {screens} from '../../Utility/Mapper/Tracking'
import { CachedImage }
  from 'react-native-cached-image'
import Carousel from 'react-native-snap-carousel'

export const sliderWidth = Dimensions.get('window').width

const slideHeight = 125
const slideWidth = sliderWidth - 32
const itemHorizontalMargin = 0

export const itemWidth = slideWidth + itemHorizontalMargin * 2
const IS_IOS = Platform.OS === 'ios'
const entryBorderRadius = 5

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_GOAL,
  destroyOnUnmount: false
})

// ========================================================
// Core Component
// ========================================================

class SelectInvestment extends Component {

  constructor (props) {
    super(props)
    this.state = {
      _goalNameError: false,
      _selectedChild: props.selectedChild,
      scrollY: new Animated.Value(0),
      custom: false,
      visible: false
    }
    const {height, width} = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
  }

  componentWillMount () {
    // AsyncStorage.setItem('LAST_SCREEN', 'desire')
  }

  componentWillReceiveProps (nextProp) {
    const {selectedChild} = nextProp
    const {_selectedChild} = this.state
    if (_selectedChild) {
      selectedChild && (_selectedChild.childID !== selectedChild.childID) && this.setState({_selectedChild: selectedChild})
    } else if (selectedChild) {
      this.setState({_selectedChild: selectedChild})
    }
  }

  componentDidMount () {
    const {userID, products} = this.props
    if (!products) {
      this.fetchProducts()
    }
    // *********** Log Analytics ***********
    analytics.screen({
      userId: userID,
      name: screens.DESIRE
    })
    // *********** Log Analytics ***********
  }

  // --------------------------------------------------------
  // Action handler

  toggleVisibility (visible) {
    LayoutAnimation.linear()
    this.setState({visible: visible})
  }

  showSettings () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.SHOW_SETTINGS, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  fetchProducts () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.FETCH_PRODUCTS})
  }

  markError (inputType, error) {
    switch (inputType) {
      case GOAL_ENTITIES.NAME:
        this.setState({_goalNameError: error})
        break
      default:
        this.setState({
          _goalNameError: false
        })
    }
  }

  validate (type, val) {
    switch (type) {
      case GOAL_ENTITIES.NAME:
        if (val && val !== ' ') {
          this.markError(GOAL_ENTITIES.NAME, false)
          return undefined
        } else {
          this.markError(GOAL_ENTITIES.NAME, true)
          return 'Goal name required'
        }
    }
  }

  selectGoal (goalName) {
    const {_selectedChild} = this.state
    const childID = (_selectedChild && _selectedChild.childID) || undefined
    const {localActions, handleLocalAction, navigator} = this.props
    handleLocalAction({
      type: localActions.SELECT_GOAL,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.NAME]: goalName,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      'form': FORM_TYPES.ADD_GOAL
    })
  }

  addCustomGoal (goalName) {
    const {localActions, handleLocalAction, navigator} = this.props
    const {_selectedChild} = this.state
    const childID = (_selectedChild && _selectedChild.childID) || undefined
    handleLocalAction({
      type: localActions.SELECT_CUSTOM_GOAL,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [GOAL_ENTITIES.NAME]: goalName,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      'form': FORM_TYPES.ADD_GOAL
    })
  }

  _renderItemWithParallax = ({item, index}) => {
    const {_selectedChild} = this.state
    const {goalName} = this.props
    const customlabel = (_selectedChild && `${_selectedChild.firstname}'s custom goal`) || 'custom goal'
    const even = (index + 1) % 2 === 0
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: itemWidth,
          height: slideHeight,
          paddingHorizontal: itemHorizontalMargin
        }}
        onPress={() => this.selectGoal(item[GOAL_ENTITIES.PRODUCT_NAME])}
      >
        {
          item.productName === 'custom' &&
          <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}, {overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.7)'}]}>
            <View style={{marginTop: 55, marginHorizontal: 40, backgroundColor: 'transparent', height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>>
              <Field
                whiteBackground
                name={GOAL_ENTITIES.NAME}
                accessible
                accessibilityLabel={'Goal Name'}
                accessibilityRole={'keyboardkey'}
                component={LWTextInput}
                placeholderColor='#1B4F95'
                placeholderText={customlabel}
                extraTextStyle={{fontSize: 18, fontFamily: Fonts.type.bold, backgroundColor: 'transparent', overflow: 'hidden', width: 235}} />
              {
                goalName && (goalName.trim().length > 1) && <Icon name='keyboard-arrow-right' color='#000' size={32} onPress={() => this.addCustomGoal(goalName)} />
              }
            </View>
          </View>
          ||
          <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}, {overflow: 'hidden'}]}>
            <Image source={{uri: item[GOAL_ENTITIES.PRODUCT_IMAGE_URL]}} style={{flex: 1}} resizeMode={'stretch'} />
            <Text style={{position: 'absolute', fontSize: 18, color: '#fff', fontFamily: Fonts.type.bold, alignSelf: 'center', top: 70}}>{item[GOAL_ENTITIES.PRODUCT_NAME]}</Text>
          </View>
        }
      </TouchableOpacity>
    )
  }

  renderGoals (values) {
    return (
      <Carousel
        ref={(c) => { this._carousel = c }}
        data={values}
        renderItem={this._renderItemWithParallax}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        hasParallaxImages
        firstItem={0}
        inactiveSlideScale={0.94}
        inactiveSlideOpacity={0.7}
        containerCustomStyle={styles.slider}
        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
      />
    )
  }

  renderHeader (lastIndex) {
    return (
      <View style={{flexDirection: 'row', paddingHorizontal: 16, marginTop: 10, marginBottom: 5, justifyContent: 'space-between', backgroundColor: 'transparent'}}>
        <View style={{flexDirection: 'row'}}>
          <Image source={require('../../../Img/goals/addGoal.png')} style={{height: 20, width: 20}} />
          <Text style={{fontFamily: Fonts.type.semibold, fontSize: 16, color: '#000', paddingHorizontal: 5}} numberOfLines={1} ellipsizeMode={'tail'}>
            Add a goal
          </Text>
        </View>
        <TouchableOpacity
          accessible
          accessibilityLabel={'Custom'}
          accessibilityRole={'button'}
          onPress={() => this._carousel.snapToItem(lastIndex)}>
          <Text style={{fontFamily: Fonts.type.semibold, fontSize: 16, color: '#000', paddingHorizontal: 5}} numberOfLines={1} ellipsizeMode={'tail'}>
            Custom
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  // --------------------------------------------------------
  // Render Core Component

  render () {
    const {products} = this.props
    let key = products && Object.keys(products)[0]
    let values = products && products[key] && Object.values(products[key]) || []
    values && values.push({productName: 'custom'})
    const goals = values ? this.renderGoals(values) : null

    const {visible} = this.state
    if (!products && visible) {
      this.toggleVisibility(false)
    } else if (products && !visible) {
      this.toggleVisibility(true)
    }
    return (
      <View style={{backgroundColor: '#FFCF50', height: visible ? undefined : 0}}>
        <View style={{flexDirection: 'row', paddingHorizontal: 16, marginTop: 10, marginBottom: 5, justifyContent: 'space-between', backgroundColor: 'transparent'}}>
          <View style={{flexDirection: 'row'}}>
            <Image source={require('../../../Img/goals/addGoal.png')} style={{height: 20, width: 20}} />
            <Text style={{fontFamily: Fonts.type.semibold, fontSize: 16, color: '#000', paddingHorizontal: 5}} numberOfLines={1} ellipsizeMode={'tail'}>
              Add a goal
            </Text>
          </View>
          <TouchableOpacity
            accessible
            accessibilityLabel={'Custom'}
            accessibilityRole={'button'}
            onPress={() => this._carousel.snapToItem(values.length)}>
            <Text style={{fontFamily: Fonts.type.semibold, fontSize: 16, color: '#000', paddingHorizontal: 5}} numberOfLines={1} ellipsizeMode={'tail'}>
              Custom
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 125, backgroundColor: '#FFCF50', marginTop: 10}}>
          {goals}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18 // needed for shadow
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius
  },
  imageContainer: {
    flex: 1,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'transparent',
    borderRadius: entryBorderRadius
  },
  imageContainerEven: {
    backgroundColor: 'transparent'
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white'
  },
  radiusMaskEven: {
    backgroundColor: 'black'
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
  },
  textContainerEven: {
    backgroundColor: 'black'
  },
  title: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  titleEven: {
    color: 'white'
  },
  subtitle: {
    marginTop: 6,
    color: 'gray',
    fontSize: 12,
    fontStyle: 'italic'
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
})

SelectInvestment.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // user id
  userID: PropTypes.string.isRequired,

  // child objects
  childArr: PropTypes.array.isRequired,

  // is fetching products
  isFetchingProducts: PropTypes.bool.isRequired,

  // selected child
  selectedChild: PropTypes.object.isRequired,

  // can pop screen
  popButton: PropTypes.bool,

  // goal name
  goalName: PropTypes.string,

  // goals
  goals: PropTypes.string,

  // default index
  defaultIndex: PropTypes.number.isRequired,

  // products
  products: PropTypes.object.isRequired
}

SelectInvestment.defaultProps = {
  isProcessing: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(SelectInvestment))

export default Screen

