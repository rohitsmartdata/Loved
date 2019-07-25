/* eslint-disable no-unused-vars,no-trailing-spaces,camelcase,operator-linebreak */
/**
 * Created by demon on 15/10/18.
 */

// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import {
  View,
  Text,
  Alert,
  FlatList,
  Modal,
  LayoutAnimation,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Image,
  Keyboard,
  Dimensions,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated, AsyncStorage, Easing
}
  from 'react-native'
import {reduxForm}
  from 'redux-form'
import {TabView, SceneMap}
  from 'react-native-tab-view'
import SearchBar
  from 'react-native-search-bar'
import globalStyle
  from '../../Themes/ApplicationStyles'
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
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import {COMMON_ENTITIES, DEVICE_LOGICAL_RESOLUTION, getPortfolioInternalID}
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import LinearGradient
  from 'react-native-linear-gradient'
import CustomNav
  from '../../Containers/Common/CustomNav'
import ProcessingIndicator
  from '../Utility/ProcessingIndicator'
var Spinner = require('react-native-spinkit')
import { CachedImage }
  from 'react-native-cached-image'
import Colors
  from '../../Themes/Colors'
import SSNPopup
  from '../../Containers/Sprout/SSNPopup'
import UserSSNPopup
  from '../../Containers/User/UserSSNPopup'
import _
  from 'lodash'
import { TextInput, TouchableWithoutFeedback }
  from 'react-native-gesture-handler'
import Fuse
  from 'fuse.js'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_INVESTMENT,
  destroyOnUnmount: false
})

class InvestmentList extends React.PureComponent {
  state = {
    scrollY: new Animated.Value(0)
  }

  _renderItem = ({item, index}) => this.props.renderCard(item, index)

  _keyExtractor = (item) => `${String(item.productPortfolioID)}-${String(item.productTicker)}-${String(item.productType)}`

  render () {
    const {
      keyIndex,
      products,
      isDashboardView,
      renderCard,
      searchQuery,
      searching
    } = this.props

    let keys = (products && Object.keys(products)) || []
    let _selectedValue = (keyIndex && products[keyIndex])
    let portfolio = (_selectedValue && Object.values(_selectedValue))
    let keyName = 'productName'
    let sortedPortfolioList = _.orderBy(portfolio, [keyName], ['asc'])
    if (searching) {
      keys.forEach(k => {
        if (k !== keyIndex) {
          sortedPortfolioList = [
            ...sortedPortfolioList,
            ...Object.values(products[k])
          ]
        }
      })
    }
    if (searchQuery.length) {
      const fuse = new Fuse(sortedPortfolioList, {
        keys: ['productName', 'productTicker']
      })
      sortedPortfolioList = fuse.search(searchQuery, {
        shouldSort: true,
        threshold: 0.0
      })
    }
    return (
      <FlatList
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: isDashboardView ? 130 : 30}}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}

        scrollEventThrottle={16}
        data={sortedPortfolioList}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
        // {sortedPortfolioList && sortedPortfolioList.map((p, index) => {
        //   return renderCard(p, index)
        // })}
    )
  }
}

// ========================================================
// Core Component
// ========================================================

class LI_SelectInvestment extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.state = {
      currentTab: 0,
      focused: false,
      query: '',
      search: '',
      searching: false,
      searchQuery: '',
      touched: false,
      barY: new Animated.Value(70),
      barOpacity: new Animated.Value(1),
      ssnPopupVisible: false,
      searchList: props.singularList,
      userSSNPopupVisible: false
    }
  }

  componentDidMount () {
    const {products, isOnboardingFlow, goalEnabled, sortedType} = this.props
    isOnboardingFlow && this.updateCurrentOnboarding()
    if (!products) {
      this.fetchProducts()
    }
    if (goalEnabled) {
      sortedType && sortedType.map(type => {
        let title = type[0]
        let index = type[1]
        if (title === 'Goals') {
          this.setCurrentTab(index - 1)
        }
      })
    }
  }

  componentWillUnmount () {
    this.resetGoalEnabled()
  }

  componentWillReceiveProps (nextProps) {
    let singularList = nextProps.singularList
    let goalEnabled = nextProps.goalEnabled
    const {searchList} = this.state

    if (!searchList) {
      this.setState({searchList: singularList})
    }
    if (goalEnabled) {
      const {sortedType} = this.props
      sortedType && sortedType.map(type => {
        let title = type[0]
        let index = type[1]
        if (title === 'Goals') {
          this.setCurrentTab(index - 1)
        }
      })
    }
  }

  toggleFocus (flag) {
    this.setState({focused: flag})
    if (flag === false) {
      this.updateQuery('')
      this.search && this.search.blur()
    }
  }

  updateQuery (text) {
    this.setState({query: text})
    if (text && text.length > 1) {
      this.searchQuery(text)
    } else if (text.length === 0) {
      this.setState({searchList: this.props.singularList})
    }
  }

  searchQuery (text) {
    const {singularList} = this.props

    let sText = text.toLowerCase()
    let filteredList = singularList.filter(item => item['name'].toLowerCase().match(sText))
    this.setState({searchList: filteredList})
  }

  // --------------------------------------------------------
  // Action handler

  resetGoalEnabled () {
    const {handleLocalAction, localActions} = this.props
    handleLocalAction({type: localActions.RESET_GOAL_ENABLED})
  }

  updateCurrentOnboarding () {
    const {handleLocalAction, localActions, emailID} = this.props
    handleLocalAction({type: localActions.UPDATE_CURRENT_ONBOARDING, [USER_ENTITIES.EMAIL_ID]: emailID})
  }

  selectGoal (name) {
    const {handleLocalAction, isssnAdded, userSSNAdded, localActions, childID, navigator} = this.props
    if (userSSNAdded !== 1) {
      this.toggleShowUserSSN(true)
    } else if (isssnAdded !== 1) {
      this.toggleShowSSN(true)
    } else {
      handleLocalAction({
        type: localActions.GOAL_SELECTED,
        [GOAL_ENTITIES.NAME]: name,
        [CHILD_ENTITIES.CHILD_ID]: childID,
        [COMMON_ENTITIES.NAVIGATOR]: navigator
      })
    }
  }

  showGoal (goalID, name) {
    const {handleLocalAction, localActions, childID, navigator, userID} = this.props
    handleLocalAction({type: localActions.SHOW_GOAL, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: goalID, [GOAL_ENTITIES.NAME]: name, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID})
  }

  selectInvestment (name, riskID, productTicker, backdropURL) {
    const {handleLocalAction, localActions, navigator, userID, childID, emailID, pushFunc, idToken, isModal} = this.props
    handleLocalAction({type: localActions.INVESTMENT_SELECTED,
      [USER_ENTITIES.USER_ID]: userID,
      [INVESTMENT_ENTITIES.INVESTMENT_NAME]: name,
      [INVESTMENT_ENTITIES.INVESTMENT_RISK_ID]: riskID,
      [INVESTMENT_ENTITIES.PRODUCT_TICKER]: productTicker,
      [INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL]: backdropURL,
      [AUTH_ENTITIES.ID_TOKEN]: idToken,
      [USER_ENTITIES.EMAIL_ID]: emailID,
      [CHILD_ENTITIES.CHILD_ID]: childID,
      [COMMON_ENTITIES.NAVIGATOR]: navigator,
      'isModal': isModal,
      'pushFunc': pushFunc})
  }

  showInvestment (investmentID) {
    const {handleLocalAction, localActions, childID, navigator, userID} = this.props
    handleLocalAction({type: localActions.SHOW_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [INVESTMENT_ENTITIES.INVESTMENT_ID]: investmentID, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.USER_ID]: userID})
  }

  fetchProducts () {
    const {handleLocalAction, localActions, navigator} = this.props
    handleLocalAction({type: localActions.FETCH_PRODUCTS})
  }

  extendBar () {
    Animated.parallel([
      Animated.timing(this.state.barY, {
        duration: 200,
        toValue: 70,
        easing: Easing.linear
      }),
      Animated.timing(this.state.barOpacity, {
        toValue: 1,
        duration: 300
      })
    ]).start()
  }

  setCurrentTab (n) {
    Animated.parallel([
      Animated.timing(this.state.barY, {
        duration: 200,
        toValue: -5,
        easing: Easing.linear
      }),
      Animated.timing(this.state.barOpacity, {
        toValue: 0,
        duration: 200
      })
    ]).start(() => {
      this.setState({
        currentTab: n
      }, () => this.extendBar())
    })
  }

  startFade () {
    Animated.timing(this.state._animated, {
      toValue: 0,
      duration: 1000,
      delay: 300
    }).start()
  }

  getWidth (e) {
    const {x, y, width, height} = e.nativeEvent.layout
    this.setState({outerView: width}, () => this.extendBar())
  }

  updateSearchQuery = (searchQuery) => {
    this.setState({searchQuery})
  }

  openChildSelectionBottomSheet = () => {
    Alert.alert('TODO')
  }

  toggleSearch = () => {
    this.setState({
      searching: !this.state.searching,
      searchQuery: ''
    }, () => {
      console.log(' call back --> ', this.searchInputNode)
      if (this.state.searching) {
        this.searchInputNode.focus()
      } else {
        this.searchInputNode.blur()
      }
    })
  }

  // --------------------------------------------------------
  // Child Components

  renderHeader = () => {
    const {firstName} = this.props
    const {query} = this.state
    let initial = firstName && firstName.charAt(0)
    return (
      <View style={{marginTop: 45, paddingLeft: 15, flexDirection: 'row', alignItems: 'center'}}>
        <View style={{height: 36, width: 36, backgroundColor: 'white', marginRight: 5, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.07, shadowOffset: {width: 1, height: 1}}}>
          <Text style={{fontSize: 14, fontFamily: Fonts.type.book}}>
            {initial}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <SearchBar
            text={this.state.query}
            textColor='rgba(5, 13, 19, 0.49)'
            placeholder='Search Investments'
            ref={ref => (this.search = ref)}
            searchBarStyle='minimal'
            tintColor='rgba(5, 13, 19, 0.49)'
            onFocus={() => this.toggleFocus(true)}
            onChangeText={value => this.updateQuery(value)}
            onCancelButtonPress={() => this.toggleFocus(false)}
          />
        </View>
      </View>
    )
  }

  toggleShowSSN (visibility) {
    this.setState({
      ssnPopupVisible: visibility
    })
  }

  toggleShowUserSSN (visibility) {
    this.setState({
      userSSNPopupVisible: visibility
    })
  }

  renderUserSSNPopup () {
    const {userSSNPopupVisible} = this.state
    const {navigator} = this.props
    if (userSSNPopupVisible) {
      return (
        <View style={{flex: 1}}>
          <UserSSNPopup hideModal={this.toggleShowUserSSN.bind(this)} navigator={navigator} isVisible={userSSNPopupVisible} />
        </View>
      )
    } else {
      return null
    }
  }

  renderSSNPopup () {
    const {ssnPopupVisible} = this.state
    const {navigator, childID} = this.props
    if (ssnPopupVisible) {
      return (
        <View style={{flex: 1}}>
          <SSNPopup hideModal={this.toggleShowSSN.bind(this)} childID={childID} navigator={navigator} isVisible={ssnPopupVisible} />
        </View>
      )
    } else {
      return null
    }
  }

  renderPanelCube (title, index) {
    const {currentTab, barY} = this.state
    let length = title.length * 7.5

    const lineWidth = barY.interpolate({
      inputRange: [0, 35, 70],
      outputRange: [0, length / 2, length]
    })
    let displayTitle = title && title.replace(/_/g, ' ')
    return (
      <TouchableOpacity
        activeOpacity={1}
        accessible
        accessibilityLabel={title}
        onPress={() => (currentTab !== index) && this.setCurrentTab(index)}
        style={{
          flex: 1,
          backgroundColor: '#FFF',
          height: 28.5,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
          paddingHorizontal: 10,
          borderRadius: 5,
          borderColor: '#DBDBDB',
          borderWidth: 1
        }}
      >
        <Text style={{
          fontSize: 15,
          color: Colors.black,
          fontFamily: currentTab === index ? Fonts.type.bold : Fonts.type.book
        }}
        >
          {displayTitle}
        </Text>
      </TouchableOpacity>
    )
  }

  renderTabContent = ({route, jumpTo}) => {
    const { products, isDashboardView } = this.props
    const { searching, searchQuery } = this.state
    return <InvestmentList jumpTo={jumpTo} keyIndex={route.key} products={products} isDashboardView={isDashboardView} renderCard={this.renderCard} searchQuery={searchQuery} searching={searching} />
  }

  renderInvestments = () => {
    const {products, sortedType, tickerIDs, initiateGoal} = this.props

    let keys = []
    let routes = []
    sortedType.map(type => {
      let title = type[0]
      keys.push(title)
      routes.push({key: title, title: title})
    })

    let goalIndex = (keys.length > 0 && keys.indexOf('Goals')) || -1
    if (initiateGoal && goalIndex !== -1 && !this.state.touched) {
      this.setState({currentTab: goalIndex, touched: true})
      return <View style={{flex: 1}} />
    }
    return (
      <View style={{ flex: 1 }}>
        <TabView
          swipeEnabled={false}
          navigationState={{
            index: this.state.currentTab,
            routes: routes
          }}
          onIndexChange={index => this.setState({currentTab: index})}
          renderScene={this.renderTabContent}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={() => {
            const { width } = Dimensions.get('window')
            return (
              <View style={{height: 40, marginBottom: 15}}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{marginTop: 10}}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      minWidth: width,
                      paddingHorizontal: 8,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {
                      keys.map((k, i) => this.renderPanelCube(k, i))
                    }
                  </View>
                </ScrollView>
              </View>
            )
          }}
        />
      </View>
    )
  }

  renderCard = (portfolio, index) => {
    const {tickerIDs, investmentNames, goalNames, goals, investments} = this.props
    let name = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_NAME]
    let description = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_DESCRIPTION]
    let whatInvestment = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_WHAT_IS_INVESTMENT]
    let imageURL = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_IMAGE_URL]
    let backdropURL = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_BACKDROP_IMAGE_URL]
    let portfolioID = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_PORTFOLIO_ID]
    let ticker = portfolio && portfolio[INVESTMENT_ENTITIES.PRODUCT_TICKER]
    let addedInvestment = portfolio && portfolio.investment
    let isAdded = (investmentNames && (investmentNames.includes(name))) || (goalNames && goalNames.includes(name))
    let investmentID = ''
    let goalID

    investments && investments.filter((i) => {
      if (i[INVESTMENT_ENTITIES.INVESTMENT_NAME] === name) {
        investmentID = i[INVESTMENT_ENTITIES.INVESTMENT_ID]
      }
    })
    goals && goals.filter((i) => {
      if (i[GOAL_ENTITIES.NAME] === name) {
        goalID = i[GOAL_ENTITIES.GID]
      }
    })
    return (
      <TouchableHighlight
        underlayColor={Colors.appBlue}
        accessible
        accessibilityRole={'button'}
        onPress={() => {
          if (portfolioID) {
            isAdded ? this.showInvestment(investmentID) : this.selectInvestment(name, portfolioID, ticker, backdropURL)
          } else {
            isAdded ? this.showGoal(goalID, name) : this.selectGoal(name)
          }
        }}
        accessibilityLabel={name}
        style={{marginHorizontal: 5, marginBottom: 5, borderRadius: 6, overflow: 'hidden'}}>
        <Animated.View style={{flexDirection: 'row', backgroundColor: Colors.white, height: 100}}>
          <View style={{paddingHorizontal: 10, alignSelf: 'center'}}>
            {
              imageURL ?
                <CachedImage source={{uri: imageURL}} style={{height: 84, width: 84, borderRadius: 42}} />
                :
                <View style={{height: 84, width: 84, borderRadius: 42, backgroundColor: 'rgba(0, 0, 0, 0.1)'}} />
            }
          </View>
          <View style={{flex: 1, marginVertical: 8, paddingRight: 10}}>
            {
              name &&
              <Text style={{fontSize: 18, lineHeight: 23, fontFamily: Fonts.type.bold, color: '#000', marginBottom: 3, width: 200}} numberOfLines={1} ellipsizeMode={'tail'} >
                {name}
              </Text>
            }
            {
              description &&
              <Text style={{fontSize: 16, lineHeight: 16, fontFamily: Fonts.type.book, color: 'rgba(0, 0, 0, 0.37)'}} numberOfLines={3} ellipsizeMode={'tail'} >
                {description}
              </Text>
            }
          </View>
          <View style={{position: 'absolute', right: 10, top: 10}}>
            {
              isAdded && <Icon name='heart' type={'font-awesome'} color={Colors.buttonYellow} size={15} />
            }
          </View>
        </Animated.View>
      </TouchableHighlight>
    )
  }

  renderSearchResultPanel () {
    const {searchList} = this.state
    const {singularList} = this.props
    const {width} = Dimensions.get('window')

    let searchableList = (searchList && searchList.length === 0) ? singularList : searchList
    return (
      <View style={{flex: 1, backgroundColor: '#FAFAFA', paddingTop: 15, paddingLeft: 5}}>
        <Text style={{fontFamily: Fonts.type.bold, fontSize: 18, left: 18, marginBottom: 15}}>
          Suggested
        </Text>
        <FlatList
          keyboardShouldPersistTaps='always'
          showsVerticalScrollIndicator={false}
          data={searchableList}
          renderItem={item => {
            const name = item.item['name']
            const ticker = item.item['ticker']
            const backdropURL = item.item['backdrop_image']
            const riskID = item.item['portfolio_id']
            const isInvestment = item.item['is_dream']
            if (isInvestment === undefined) {
              return null
            }
            return (
              <TouchableOpacity onPress={() => isInvestment ? this.selectInvestment(name, riskID, ticker, backdropURL) : this.selectGoal(name)} style={{width: width - 10, paddingLeft: 18, height: 90, marginBottom: 5, borderRadius: 5, backgroundColor: '#FFF', justifyContent: 'center'}}>
                <Text style={{fontFamily: Fonts.type.bold, fontSize: 18}}>
                  {item.item['name']}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }

  // --------------------------------------------------------
  // Render Core Component

  render () {
    const {navigator, isModal, isssnAdded, isDashboardView, firstName, processingProducts, closeModal} = this.props
    const title = isDashboardView ? 'Discover for ' + firstName : 'Discover'
    const {focused} = this.state
    return (
      <View style={{...globalStyle.screen.containers.root, backgroundColor: '#fafafa'}}>
        <ProcessingIndicator isProcessing={processingProducts} />
        <StatusBar barStyle='dark-content' />
        {this.renderHeader()}
        {focused ? this.renderSearchResultPanel() : this.renderInvestments()}
        {this.renderSSNPopup()}
        {this.renderUserSSNPopup()}
      </View>
    )
  }

}

LI_SelectInvestment.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // close modal or not
  closeModal: PropTypes.bool,

  // firstname
  firstName: PropTypes.string.isRequired,

  // singular list
  singularList: PropTypes.array.isRequired,

  // is onboarding flow
  isOnboardingFlow: PropTypes.bool.isRequired,

  // loading products
  processingProducts: PropTypes.bool.isRequired,

  // products
  products: PropTypes.array.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // email id
  emailID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // ticker id's bought
  tickerIDs: PropTypes.array.isRequired,

  // goal tab is enabled or not
  goalEnabled: PropTypes.bool,

  // goals
  goals: PropTypes.array.isRequired,

  // goal names
  goalNames: PropTypes.array.isRequired,

  // push function
  pushFunc: PropTypes.func.isRequired,

  // id token
  idToken: PropTypes.string.isRequired,

  // is modal
  isModal: PropTypes.bool.isRequired,

  // is dashboard view
  isDashboardView: PropTypes.bool,

  // is ssn added
  isssnAdded: PropTypes.bool,

  // initiate goal tab first
  initiateGoal: PropTypes.bool,

  // user ssn added ?
  userSSNAdded: PropTypes.number,

  // user ssn added processing ?
  userSSNStoreProcessing: PropTypes.bool,

  // sorted types
  sortedType: PropTypes.array,

  // investment names
  investmentNames: PropTypes.array.isRequired,
  investments: PropTypes.object
}

LI_SelectInvestment.defaultProps = {
  isProcessing: false,
  processingProducts: false,
  closeModal: false,
  isDashboardView: false,
  initiateGoal: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(LI_SelectInvestment))

export default Screen
