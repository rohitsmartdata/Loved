/* eslint-disable camelcase,no-unused-vars,no-trailing-spaces,operator-linebreak */
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
  WebView,
  StatusBar,
  Text,
  Alert,
  FlatList,
  Modal,
  LayoutAnimation,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Animated, AsyncStorage, Easing,
  ActionSheetIOS,
  InteractionManager
}
  from 'react-native'
import {reduxForm}
  from 'redux-form'
import { CachedImage }
  from 'react-native-cached-image'
import styles
  from '../../Themes/ApplicationStyles'
import Fonts
  from '../../Themes/Fonts'
import {FORM_TYPES}
  from '../../Config/contants'
import CustomListView
  from '../Utility/CustomListView'
import {Icon}
  from 'react-native-elements'
import { connect }
  from 'react-redux'
import {CHILD_ENTITIES}
  from '../../Utility/Mapper/Child'
import {INVESTMENT_ENTITIES}
  from '../../Utility/Mapper/Investment'
import { COMMON_ENTITIES, CUSTOM_LIST_ENTITIES, DEVICE_LOGICAL_RESOLUTION, FREQUENCY, getPortfolioInternalID }
  from '../../Utility/Mapper/Common'
import {USER_ENTITIES}
  from '../../Utility/Mapper/User'
import {AUTH_ENTITIES}
  from '../../Utility/Mapper/Auth'
import {GOAL_ENTITIES}
  from '../../Utility/Mapper/Goal'
import LinearGradient
  from 'react-native-linear-gradient'
import Avatar
  from '../../Containers/Utility/Avatar'
import { analytics }
  from '../../Config/AppConfig'
import {screens, events}
  from '../../Utility/Mapper/Tracking'
import {formatPrice, formatFloatPrice}
  from '../../Utility/Transforms/Converter'
import CustomNav
  from '../../Containers/Common/CustomNav'
import CustomLineChart
  from '../../CommonComponents/CustomLineChart/CustomLineChart'
var Spinner = require('react-native-spinkit')
import _
  from 'lodash'
import moment
  from 'moment'
import ProcessingIndicator from '../Utility/ProcessingIndicator'
import Colors from '../../Themes/Colors'
import SSNPopup from '../../Containers/Sprout/SSNPopup'
import UserSSNPopup from '../../Containers/User/UserSSNPopup'

// ========================================================
// UTILITY
// ========================================================

const form = reduxForm({
  form: FORM_TYPES.ADD_INVESTMENT,
  destroyOnUnmount: false
})

function interpolate (num, inMin, inMax, outMin, outMax) {
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

var CustomLayoutAnimation = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.curveEaseInEaseOut
  }
}

const OVERVIEW = 'Overview'
const PERFORMANCE = 'Performance'
const CHILD = 'Child'

// ========================================================
// Core Component
// ========================================================

class LI_InvestmentDetail extends Component {

  constructor (props) {
    super(props)
    const { height, width } = Dimensions.get('window')
    this.isX = height === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.height && width === DEVICE_LOGICAL_RESOLUTION.IPHONE_DEVICE_X.width
    this.riskBarNodeRef = React.createRef()
    this.state = {
      age: 0,
      y: 0,
      data: '',
      arryData: '',
      moving: true,
      isLoadingGraphData: false,
      showMoreInfo: null,
      tickerName: props.tickerName,
      widthAnimation: new Animated.Value(0),
      // selectedTab: props.isBought ? CHILD : OVERVIEW,
      ssnPopupVisible: false,
      userSSNPopupVisible: false
      // riskBarValue: new Animated.Value(0) // used to animate the risk bar
    }
  }

  showBarAnimation () {
    const { width } = Dimensions.get('window')
    let value = width
    value = (width - 64) / 3

    const {tickerDetail} = this.props
    const standardDeviation = tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_STANDARD_DEVIATION] || 0.5

    value = (standardDeviation * value) / 100

    Animated.timing(this.state.widthAnimation, {
      toValue: value,
      duration: 2000,
      delay: 1000,
      easing: Easing.linear
    }, {useNativeDriver: true}).start()
  }

  componentWillMount () {
    const {userID, isModal, investment, currentRecurringFrequency, investmentName} = this.props
    this.fetchTickerData()
    this.fetchGoalDetail()
    this.fetchInvestChartData()

    const currentValue = (investment && investment[INVESTMENT_ENTITIES.INVESTMENT_BALANCE]) || 0
    let frequency
    switch (currentRecurringFrequency) {
      case FREQUENCY.ONCE: {
        frequency = 'Once'
      }
        break
      case FREQUENCY.ONE_WEEK: {
        frequency = 'Weekly'
      }
        break
      case FREQUENCY.ONE_MONTH: {
        frequency = 'Monthly'
      }
        break
    }
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.GOAL_OPENED,
      properties: {
        name: investmentName,
        balance: currentValue,
        recurring_type: frequency
      }
    })
    // *********** Log Analytics ***********
  }

  componentWillUnmount () {
    this.flushTickerChartData()
  }

  // --------------------------------------------------------
  // Action handler

  getDataByTime (allData = [], timestamp, year) {
    this.arryData = []
    if (allData.length) {
      let duringYear = year * 365
      this.setState({arryData: null})
      let dayData = []
      let dayDataCount = []
      for (let index = 0; index < allData.length - 1; index++) {
        let value = allData[index]
        let day = this.getDayDiff(timestamp, value[0])
        if (duringYear >= day) {
          if (dayData[day] === undefined) {
            dayData[day] = dayDataCount[day] = 0
          }
          dayData[day] += value[2]
          dayDataCount[day] ++
        }
      }

      let step = 1 // this will decide how many point we are gonna have in graph. 100 for map all value in 100
      let chartData = []
      let chartDataCount = []
      for (let i = 0; i < duringYear; i++) {
        let chartIndex = parseInt(i / step)
        if (dayData[i] === undefined) {
          dayData[i] = 0
          dayDataCount[i] = 1
        }
        dayData[i] = dayData[i] / dayDataCount[i]
        if (chartData[chartIndex] === undefined) {
          chartData[chartIndex] = 0
          chartDataCount[chartIndex] = 1
        }
        chartData[chartIndex] += dayData[i]
        if (dayData[i] !== 0) {
          chartDataCount[chartIndex] ++
        }
      }
      let FinalData = []
      for (let i = 0; i < chartData.length; i++) {
        if (chartData[i] === undefined) {
          chartData[i] = 0
        }
        if (chartDataCount[i] === undefined) {
          chartDataCount[i] = 1
        }
        FinalData[chartData.length - 1 - i] = chartData[i] / chartDataCount[i]
      }
      FinalData[0] = 0
      FinalData = FinalData.filter((d) => d !== 0)
      this.arryData = FinalData
    }

    this.setState({arryData: this.arryData, isLoadingGraphData: false})
  }

  flushTickerChartData () {
    const {handleLocalAction, localActions} = this.props
    const {tickerName} = this.state
    handleLocalAction({type: localActions.FLUSH_TICKER_DATA, [GOAL_ENTITIES.TICKER_NAME]: tickerName})
  }

  sortDataByIndex (index, data) {
    if (index === 3) {
      index = 10
    }
    if (index === 2) {
      index = 5
    }
    if (index === 1) {
      index = 3
    }
    if (index === 0) {
      index = 1
    }
    this.setState({arryData: null, isLoadingGraphData: true})
    let timestamp = this.getCurrentTimeStamp()
    this.getDataByTime(data || this.data, timestamp, index)
  }
  getCurrentTimeStamp () {
    let now = new Date()
    return Math.round(now.getTime())
  }
  getDayDiff (timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2
    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24)
    return daysDifference
  }
  getDayDiffReverse (timestamp1, daysDifference) {
    var timestamp2 = Math.floor(daysDifference * 1000 * 60 * 60 * 24)
    var timeDate = timestamp1 - timestamp2
    return new Date(timeDate).toDateString()
  }

  fetchGoalDetail () {
    const {handleLocalAction, localActions, userID, investmentID} = this.props
    handleLocalAction({type: localActions.FETCH_GOAL_DETAIL, [USER_ENTITIES.USER_ID]: userID, [GOAL_ENTITIES.GID]: investmentID})
  }

  fetchTickerData () {
    const {handleLocalAction, localActions, tickerName, idToken} = this.props
    if (tickerName) {
      handleLocalAction({
        type: localActions.GET_TICKER_DATA,
        [GOAL_ENTITIES.TICKER_NAME]: tickerName,
        [AUTH_ENTITIES.ID_TOKEN]: idToken
      })
    }
  }

  fetchInvestChartData () {
    const {handleLocalAction, localActions, navigator, emailID, tickerName} = this.props
    if (tickerName) {
      this.sortDataByIndex(3)
      handleLocalAction({type: localActions.FETCH_INVEST_CHART_DATA, [COMMON_ENTITIES.NAVIGATOR]: navigator, [USER_ENTITIES.EMAIL_ID]: emailID, [GOAL_ENTITIES.TICKER_NAME]: tickerName})
    }
  }

  calculateRiskValue = () => {
    const { tickerDetail } = this.props
    const standardDeviation = tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_STANDARD_DEVIATION] || 0.5
    const deviationNumber = standardDeviation * 100
    let riskBarValue = interpolate(deviationNumber, 0, 8, 0, 10)
    riskBarValue = riskBarValue > 10 ? 10 : riskBarValue
    return riskBarValue
  }

  // animateRiskBar = () => {
  //   if (this.state.riskBarValue._value === 0) {
  //     this.riskBarNodeRef.current.measure((fx, fy, width, height, px, py) => {
  //       const { height: windowHeight } = Dimensions.get('window')
  //       if (windowHeight - py > 40) {
  //         // bar is in view, start the animation
  //         const riskBarValue = this.calculateRiskValue()
  //         InteractionManager.runAfterInteractions(() => {
  //           Animated.timing(this.state.riskBarValue, {
  //             toValue: riskBarValue,
  //             duration: 2000,
  //             delay: 100,
  //             easing: Easing.linear
  //           }, {useNativeDriver: true}).start()
  //         })
  //       }
  //     })
  //   }
  // }

  componentWillReceiveProps (nextProps) {
    if (!(_.isEqual(this.props.investChartData, nextProps.investChartData))) {
      this.data = nextProps.investChartData
      this.sortDataByIndex(3, nextProps.investChartData)
    }
    if (!(_.isEqual(this.props.isFetchingGraph, nextProps.isFetchingGraph)) && nextProps.isFetchingGraph === false) {
      this.showBarAnimation()
      this.data = nextProps.investChartData
      this.sortDataByIndex(3, nextProps.investChartData)
    }
  }

  // selectTab = (tab) => {
  //   this.setState({ selectedTab: tab })

  //   const {userID, investmentName} = this.props
  //   if (tab === OVERVIEW) {
  //     // *********** Log Analytics ***********
  //     analytics.track({
  //       userId: userID,
  //       event: events.INVEST_OVERVIEW_VIEWED,
  //       properties: {
  //         name: investmentName
  //       }
  //     })
  //     // *********** Log Analytics ***********
  //   } else if (tab === PERFORMANCE) {
  //     // *********** Log Analytics ***********
  //     analytics.track({
  //       userId: userID,
  //       event: events.INVEST_PERFORMANCE_VIEWED,
  //       properties: {
  //         name: investmentName
  //       }
  //     })
  //     // *********** Log Analytics ***********
  //   }
  // }

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

  navigateNext () {
    const {handleLocalAction, localActions, navigator, userID, childID, investmentName, investment, isssnAdded, userSSNAdded} = this.props
    if (userSSNAdded !== 1) {
      this.toggleShowUserSSN(true)
    } else if (isssnAdded !== 1) {
      this.toggleShowSSN(true)
    } else {
      handleLocalAction({type: localActions.SHOW_INVESTMENT_FUND, [USER_ENTITIES.USER_ID]: userID, [CHILD_ENTITIES.CHILD_ID]: childID, [COMMON_ENTITIES.NAVIGATOR]: navigator, [INVESTMENT_ENTITIES.INVESTMENT_NAME]: investmentName})
    }
  }

  buyInvestment () {
    const {handleLocalAction, localActions, currentRecurringFrequency, userID, childID, investmentID, investmentName, navigator} = this.props
    handleLocalAction({type: currentRecurringFrequency === undefined ? localActions.SET_INVESTMENT : localActions.BUY_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: investmentID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.GOAL_TOPUP_CLICK,
      properties: {
        name: investmentName
      }
    })
    // *********** Log Analytics ***********
  }
  sellInvestment () {
    const {handleLocalAction, localActions, userID, childID, investmentID, investmentName, navigator} = this.props
    handleLocalAction({type: localActions.SELL_INVESTMENT, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: investmentID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
    // *********** Log Analytics ***********
    analytics.track({
      userId: userID,
      event: events.GOAL_WITHDRAW_CLICK,
      properties: {
        name: investmentName
      }
    })
    // *********** Log Analytics ***********
  }

  askBuyOrSell () {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Buy',
        'Sell',
        'Cancel'
      ],
      cancelButtonIndex: 2
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          this.buyInvestment()
          break
        case 1:
          this.sellInvestment()
          break
        default:
          break
      }
    })
  }

  editRecurring () {
    const {handleLocalAction, localActions, childID, investmentID, navigator} = this.props
    handleLocalAction({type: localActions.EDIT_RECURRING, [CHILD_ENTITIES.CHILD_ID]: childID, [GOAL_ENTITIES.GID]: investmentID, [COMMON_ENTITIES.NAVIGATOR]: navigator})
  }

  // --------------------------------------------------------
  // Child Components

  renderTopMargin () {
    return (
      <View style={{height: 30, alignItems: 'center', paddingTop: 15, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <View style={{height: 7, width: 125, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 20}} />
      </View>
    )
  }

  renderNextButton () {
    return (
      <View style={{justifyContent: 'center', paddingHorizontal: 20, position: 'absolute', left: 0, right: 0, bottom: 40}}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Confirm Investment'}
          accessibilityRole={'button'}
          style={{
            ...styles.bottomNavigator.containerStyle
            // shadowOpacity: 0.15,
            // shadowRadius: 10,
            // shadowOffset: {height: 10, width: 0}
          }}
          onPress={_.debounce(_.bind(() => this.navigateNext(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={styles.bottomNavigator.textStyle}>Confirm Investment</Text>
        </TouchableHighlight>
      </View>
    )
  }

  renderHeader () {
    const {investmentName, backdropURL, isBought, isModal, navigator} = this.props
    let popFunction
    if (isModal) {
      popFunction = () => this.props.popFunc()
    } else {
      popFunction = console.log('sample pop')
    }
    return (
      <View style={{height: 300, backgroundColor: '#FFF', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        {
          backdropURL && <CachedImage source={{uri: backdropURL}} resizeMode='cover' style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: undefined, width: undefined}} />
        }
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)'}} />
        {this.renderTopMargin()}
        <CustomNav blueBackdrop navigator={navigator} leftButtonPresent={!isBought || !isModal} leftFoo={popFunction} popManually={isModal} dropTopMargin titlePresent title={investmentName} />
        {this.renderNextButton()}
      </View>
    )
  }

  renderInvestmentDetail () {
    const {tickerDetail, lastUpdatedTime} = this.props
    let about = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_DESCRIPTION])
    let name = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_UNDERLYING])
    let ticker = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_NAME])
    let price = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_LAST_PRICE])
    let url = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_URL])

    // last update time
    let m = lastUpdatedTime && moment(lastUpdatedTime).format('h:MM a, MMMM DD')

    return (
      <View style={{paddingTop: 20, paddingHorizontal: 32, paddingBottom: 10}}>

        <Text style={{fontFamily: Fonts.type.bold, fontSize: 22, color: '#1C3C70'}}>
          About
        </Text>
        <Text style={{marginTop: 13, fontFamily: Fonts.type.book, fontSize: 18, color: '#1C3C70'}}>
          {about}
        </Text>

        <Text style={{marginTop: 13, fontFamily: Fonts.type.medium, fontSize: 10, letterSpacing: 1, color: '#505050'}}>
          NAME
        </Text>
        <Text style={{fontFamily: Fonts.type.book, fontSize: 14, color: '#1C3C70'}}>
          {name}
        </Text>

        <View style={{marginTop: 13, alignItems: 'flex-end', flexDirection: 'row'}}>

          <View>
            <Text style={{fontFamily: Fonts.type.medium, fontSize: 10, letterSpacing: 1, color: '#505050'}}>
              TICKER
            </Text>
            <Text style={{fontFamily: Fonts.type.book, fontSize: 14, color: '#1C3C70'}}>
              {ticker}
            </Text>
          </View>

          <View style={{marginLeft: 40}}>
            <Text style={{fontFamily: Fonts.type.medium, fontSize: 10, letterSpacing: 1, color: '#505050'}}>
              PRICE
            </Text>
            <Text style={{fontFamily: Fonts.type.book, fontSize: 14, color: '#1C3C70'}}>
              {price && formatFloatPrice(price)}
            </Text>
          </View>

          <TouchableOpacity
            accessible
            accessibilityLabel={'show more info'}
            accessibilityRole={'link'}
            style={{marginLeft: 40}}
            onPress={() => this.setState({showMoreInfo: url})}>
            <Text style={{fontFamily: Fonts.type.book, fontSize: 14, color: '#1C3C70'}}>
              More info.
            </Text>
          </TouchableOpacity>

        </View>

        {
          m &&
          <View style={{marginTop: 20}}>
            <Text style={{color: '#9A9B9B', fontFamily: Fonts.type.book, fontSize: 10}}>
              Last updated {m}
            </Text>
          </View>
        }

      </View>
    )
  }

  renderPerformance () {
    const {tickerDetail, isLoadingGraphData} = this.props
    const showChart = tickerDetail[GOAL_ENTITIES.TICKER_SHOW_CHART]
    let strArray = [tickerDetail[GOAL_ENTITIES.TICKER_1_YEAR_CHANGE], tickerDetail[GOAL_ENTITIES.TICKER_3_YEAR_CHANGE], tickerDetail[GOAL_ENTITIES.TICKER_5_YEAR_CHANGE], tickerDetail[GOAL_ENTITIES.TICKER_OVERALL_CHANGE]]
    return (
      <View style={{marginTop: 7}}>
        <View style={{height: 44, backgroundColor: Colors.white, paddingHorizontal: 25, justifyContent: 'center'}}>
          <Text style={{fontSize: 20, fontFamily: Fonts.type.bold, color: '#1C3C70'}}>Performance History</Text>
        </View>
        <View style={{marginTop: 6, backgroundColor: 'white', marginHorizontal: 5, borderRadius: 6, paddingLeft: 19, paddingRight: 17}}>
          <Text style={{letterSpacing: 1, marginTop: 13, marginBottom: 8, fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: 'rgba(0, 0, 0, 0.62)'}}>RETURN HISTORY</Text>
          {
            this.state.arryData &&
            <CustomLineChart
              itemIndex={3}
              data={[...this.state.arryData]}
              lineColor={Colors.black}
              lineWidth={2}
              bottomStrProgress={strArray}
              chartPaddingTop={25}
              chartPaddingBottom={25}
              bottomBoxPaddingLeft={30}
              bottomBoxPaddingRight={30}
              bottomBoxBackgroundColor={Colors.white}
              bottomBoxActiveColor={Colors.buttonYellow}
              bottomBoxCellTop={3}
              bottomBoxCellBottom={3}
              onChange={(index) => this.sortDataByIndex(index)}
              isLoading={isLoadingGraphData}
            /> ||
            <View />
          }
        </View>
      </View>
    )
  }

  renderRiskReturn () {
    const {tickerDetail} = this.props
    const standardDeviation = tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_STANDARD_DEVIATION] || 0.5
    const dividendYield = tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_DIVIDEND_YIELD]
    const expenseRatio = tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_EXPENSES] && parseFloat(tickerDetail[GOAL_ENTITIES.TICKER_EXPENSES])

    const deviationNumber = standardDeviation * 100
    let barValue = interpolate(deviationNumber, 0, 8, 0, 10)
    barValue = barValue > 10 ? 10 : barValue
    let remainingValue = 10 - barValue

    return (
      <View style={{backgroundColor: '#FFF', flex: 1}}>

        <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 13, marginHorizontal: 32}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 22, color: '#1C3C70'}}>
            Risk & Return
          </Text>
          <Image source={require('../../../Img/assets/goal/info/info.png')} style={{marginLeft: 10, top: 1}} />
        </View>

        <View style={{flexDirection: 'row', marginHorizontal: 32}}>

          <View style={{flex: 1}}>
            <Text style={{fontFamily: Fonts.type.medium, fontSize: 10, letterSpacing: 1, color: '#505050'}}>
              INVESTMENT {'\n'}RISK
            </Text>
            <View style={{justifyContent: 'flex-end', flex: 1}}>
              <View style={{flexDirection: 'row', height: 10, borderRadius: 10, backgroundColor: '#9B9B9B', borderTopRightRadius: 10, borderBottomRightRadius: 10}}>
                <View style={{flex: barValue, backgroundColor: '#FF6578', height: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderTopRightRadius: barValue === 10 ? 10 : 0, borderBottomRightRadius: barValue === 10 ? 10 : 0}} />
                <View style={{flex: remainingValue, backgroundColor: 'transparent', height: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10}} />
              </View>
            </View>
          </View>

          <View style={{flex: 1, alignItems: 'center'}}>
            <View>
              <Text style={{fontFamily: Fonts.type.medium, fontSize: 10, letterSpacing: 1, color: '#505050'}}>
                DIVIDEND {'\n'}YIELD
              </Text>
              <Text style={{fontFamily: Fonts.type.medium, textAlign: 'left', fontSize: 16, letterSpacing: 1, color: '#4A4A4A'}}>
                {dividendYield && parseInt(dividendYield)}%
              </Text>
            </View>
          </View>

          <View style={{flex: 1, alignItems: 'center'}}>
            <View>
              <Text style={{fontFamily: Fonts.type.medium, fontSize: 10, letterSpacing: 1, color: '#505050'}}>
                EXPENSE {'\n'}RATIO
              </Text>
              <Text style={{fontFamily: Fonts.type.medium, fontSize: 16, letterSpacing: 1, color: '#4A4A4A'}}>
                {expenseRatio && expenseRatio.toFixed(2)}%
              </Text>
            </View>
          </View>

        </View>

        <View style={{marginTop: 22}}>
          <Text style={{marginHorizontal: 32, fontFamily: Fonts.type.medium, fontSize: 10, letterSpacing: 1, color: '#505050', marginBottom: 20}}>
            PAST PERFORMANCE
          </Text>
          {this.renderPerformance()}
        </View>
      </View>
    )
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

  renderTopHolding () {
    const {isTickerProcessing, tickerDetail} = this.props
    let listData = []
    if (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_HOLDINGS]) {
      let holdings = tickerDetail[GOAL_ENTITIES.TICKER_HOLDINGS]
      holdings.map(h => {
        let key = Object.keys(h)[0]
        let value = Object.values(h)[0]
        listData.push({
          type: CUSTOM_LIST_ENTITIES.SIMPLE,
          key: key,
          value: value && (value.toString() + '%')
        })
      })
    }
    if (listData.length > 0) {
      return (
        <View style={{marginTop: 7}}>
          <View style={{height: 44, backgroundColor: Colors.white, paddingHorizontal: 25, justifyContent: 'center'}}>
            <Text style={{fontSize: 20, fontFamily: Fonts.type.bold, color: '#1C3C70'}}>Summary</Text>
          </View>
          {
            listData.length > 0 && <CustomListView header='TOP HOLDINGS' data={listData} />
          }
        </View>
      )
    } else {
      return null
    }
  }

  renderWebViewHeader () {
    const {isModal} = this.props
    const isX = this.isX || false
    const paddingTop = isX ? 30 : 22
    const height = isX ? 80 : 70
    return (
      <View style={{flexDirection: 'row', backgroundColor: 'white', paddingTop: isModal ? 0 : paddingTop, height: isModal ? 50 : height}}>
        <TouchableOpacity
          activeOpacity={1}
          accessible
          accessibilityLabel={'Go Back'}
          accessibilityRole={'button'}
          onPress={() => this.setState({showMoreInfo: null})} style={{width: 50, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../../../Img/iconImages/Back.png')} />
        </TouchableOpacity>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#9B9B9B', fontFamily: Fonts.type.bold, fontSize: 12.5}}>Ticker</Text>
        </View>
        <View style={{width: 50, backgroundColor: 'transparent'}} />
      </View>
    )
  }
  renderMoreInfo () {
    const {showMoreInfo, isLoading} = this.state
    if (!showMoreInfo) return null
    return (
      <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'white'}}>
        {this.renderWebViewHeader()}
        <View style={{flex: 1}}>
          <TouchableOpacity style={{flex: 1}} activeOpacity={1}>
            <TouchableWithoutFeedback style={{flex: 1}}>
              <WebView
                style={{flex: 1, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, borderBottomWidth: 2}}
                onLoadStart={() => this.setState({isLoading: true})}
                onLoadEnd={() => this.setState({isLoading: false})}
                canGoBack
                canGoForward
                source={{uri: showMoreInfo.toString()}}
              />
            </TouchableWithoutFeedback>
          </TouchableOpacity>
          {
            isLoading &&
            <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}}>
              <Spinner isVisible size={100} type={'ThreeBounce'} color={Colors.buttonYellow} />
            </View> ||
            <View />
          }
        </View>
      </View>
    )
  }

  renderInformation () {
    const {isTickerProcessing, tickerDetail, isFetchingGraph} = this.props
    if (tickerDetail) {
      return (
        <React.Fragment>
          {this.renderChildInvestment()}
          {this.renderOverview()}
          {this.renderPerformance()}
          {this.renderTopHolding()}
        </React.Fragment>
      )
    } else {
      return (
        <View style={{backgroundColor: 'transparent', marginTop: 0, height: 100, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner isVisible size={80} type={'ThreeBounce'} color='#000' />
        </View>
      )
    }
  }

  renderBuySellButton () {
    const {investment} = this.props
    const currentValue = (investment && investment[INVESTMENT_ENTITIES.INVESTMENT_BALANCE]) || 0
    const onlyBuy = parseFloat(currentValue) <= 0
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Buy'}
          accessibilityRole={'button'}
          style={{ ...styles.bottomNavigator.containerStyle, width: 205, marginRight: 5, backgroundColor: Colors.buttonYellow }}
          onPress={_.debounce(_.bind(() => onlyBuy ? this.buyInvestment() : this.askBuyOrSell(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={{...styles.bottomNavigator.textStyle, color: Colors.darkBlue}}>
            {
              onlyBuy ? 'Buy' : 'Buy/Sell'
            }
          </Text>
        </TouchableHighlight>
        {/* <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Withdraw'}
          accessibilityRole={'button'}
          style={{ ...styles.bottomNavigator.containerStyle, width: 140, backgroundColor: '#F0595C', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: {height: 10, width: 0} }}
          onPress={_.debounce(_.bind(() => this.sellInvestment(), this), 500, {'leading': true, 'trailing': false})}
        >
          <Text style={{...styles.bottomNavigator.textStyle, color: Colors.white}}>
            Withdraw
          </Text>
        </TouchableHighlight> */}
      </View>
    )
  }

  renderEditRecurring () {
    const {currentRecurringAmount, currentRecurringFrequency} = this.props
    let frequency
    switch (currentRecurringFrequency) {
      case FREQUENCY.ONCE: {
        frequency = 'Once'
      }
        break
      case FREQUENCY.ONE_WEEK: {
        frequency = 'Weekly'
      }
        break
      case FREQUENCY.ONE_MONTH: {
        frequency = 'Monthly'
      }
        break
    }
    const autoInvest = currentRecurringFrequency !== undefined

    return (
      <View style={{marginTop: 13}}>
        <Text style={{fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: '#050D13', opacity: 0.80, letterSpacing: 1, marginBottom: 4}}>
          AUTO-INVEST
        </Text>
        <TouchableHighlight
          underlayColor={Colors.buttonYellowUnderlay}
          accessible
          accessibilityLabel={'Edit Recurring'}
          accessibilityRole={'button'}
          onPress={() => autoInvest ? this.editRecurring() : this.buyInvestment()}
          style={{ ...styles.bottomNavigator.containerStyle, flex: 1, backgroundColor: Colors.appBlue, shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: {height: 3, width: 0}, flexDirection: 'row' }}>
          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{fontFamily: Fonts.type.bold, fontSize: 15, color: Colors.white}}>
              {autoInvest ? 'Edit Auto-Invest' : 'Set Auto-Invest'}
            </Text>
            <View style={{position: 'absolute', right: 20, top: 2}}>
              <Icon name='edit' color='white' size={15} />
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  renderBoughtHeader () {
    const {investmentName, backdropURL, isBought, investment} = this.props
    const currentValue = (investment && investment[INVESTMENT_ENTITIES.INVESTMENT_BALANCE]) || 0
    const growthValue = (investment && investment[INVESTMENT_ENTITIES.GROWTH_IN_VALUE]) || 0
    const growthPercentage = (investment && investment[INVESTMENT_ENTITIES.GROWTH_IN_PERCENTAGE]) || 0
    let growthColor = (growthValue && growthValue < 0) ? '#F0595C' : '#4EC2D1'
    return (
      <View style={{height: 300, backgroundColor: '#FFF', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        {
          backdropURL && <CachedImage source={{uri: backdropURL}} resizeMode='cover' style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, height: undefined, width: undefined}} />
        }
        <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)'}} />
        {this.renderTopMargin()}
        <CustomNav blueBackdrop leftButtonPresent={!isBought} leftFoo={() => this.props.popFunc()} popManually dropTopMargin titlePresent title={investmentName} />

        <View>
          <Text style={{marginTop: 10, fontFamily: Fonts.type.medium, textAlign: 'center', fontSize: 10, letterSpacing: 1, color: '#F4F4F4'}}>
            CURRENT VALUE
          </Text>
          <Text style={{marginTop: 0, fontFamily: Fonts.type.bold, textAlign: 'center', fontSize: 35, letterSpacing: 1, color: '#FFF'}}>
            {currentValue && formatFloatPrice(currentValue)}
          </Text>

          <Text style={{marginTop: 10, fontFamily: Fonts.type.medium, textAlign: 'center', fontSize: 10, letterSpacing: 1, color: '#F4F4F4'}}>
            GROWTH
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 7}}>
            <View style={{backgroundColor: growthColor, minWidth: 70, marginRight: 5, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 5}}>
              <Text style={{fontFamily: Fonts.type.medium, textAlign: 'center', fontSize: 12, color: '#FFF'}}>
                {growthValue && formatFloatPrice(growthValue)}
              </Text>
            </View>
            <View style={{backgroundColor: growthColor, minWidth: 70, paddingVertical: 3, paddingHorizontal: 5, borderRadius: 5}}>
              <Text style={{fontFamily: Fonts.type.medium, textAlign: 'center', fontSize: 12, color: '#FFF'}}>
                {growthPercentage}%
              </Text>
            </View>
          </View>
        </View>

        {this.renderBuySellButton()}

        {this.renderEditRecurring()}

      </View>
    )
  }

  renderTopView () {
    const {investmentName, backdropURL, isBought, investment, firstName} = this.props
    const {selectedTab} = this.state

    return (
      <View style={{alignItems: 'center', marginTop: 7}}>
        {
          backdropURL && (
            <View style={{ paddingHorizontal: 5, height: 182, width: '100%' }}>
              <CachedImage
                source={{uri: backdropURL}}
                resizeMode='cover'
                style={{height: '100%', width: '100%'}}
            />
            </View>
          )
        }
        <View style={{marginTop: 7, flexDirection: 'row'}}>
          <View style={{flex: 150, marginRight: 9, paddingLeft: 22, justifyContent: 'center', height: 44, backgroundColor: 'white'}}>
            <Text style={{fontSize: 20, fontFamily: Fonts.type.bold, color: '#1C3C70'}}>{isBought ? this.props[CHILD_ENTITIES.FIRST_NAME] : 'Summary'}</Text>
          </View>
          <View>
            {isBought ? this.renderBuySellButton()
              : <TouchableHighlight
                underlayColor={Colors.buttonYellowUnderlay}
                accessible
                accessibilityLabel={'Add to Portfolio'}
                accessibilityRole={'button'}
                onPress={_.debounce(_.bind(() => this.navigateNext(), this), 500, {'leading': true, 'trailing': false})}>
                <View style={{width: 205, marginRight: 5, height: 44, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.buttonYellow}}>
                  <Text style={{fontFamily: Fonts.type.bold, textAlign: 'center', fontSize: 16, lineHeight: 19, color: Colors.darkBlue}}>Add to Portfolio</Text>
                </View>
              </TouchableHighlight>
            }
          </View>
        </View>

        {/* <View style={{height: 36, width: '100%', flexDirection: 'row', marginTop: 36, marginBottom: 25, paddingHorizontal: 20}}>
          {
            isBought && <TouchableHighlight
              underlayColor={Colors.buttonYellowUnderlay}
              accessible
              accessibilityLabel={CHILD}
              accessibilityRole={'button'}
              style={{flex: 1, borderRadius: 6, backgroundColor: (selectedTab === CHILD) ? Colors.white : Colors.buttonYellow, alignItems: 'center', justifyContent: 'center', marginRight: 7}}
              onPress={_.debounce(_.bind(() => this.selectTab(CHILD), this), 100, {'leading': true, 'trailing': false})}>
              <View>
                <Text style={{fontFamily: Fonts.type.bold, fontSize: 14, lineHeight: 14, color: Colors.darkBlue}}>{firstName}</Text>
                <View style={{height: (selectedTab === CHILD) ? 2 : 0, backgroundColor: Colors.darkBlue, position: 'absolute', left: 0, right: 0, bottom: -3}} />
              </View>
            </TouchableHighlight>
          }
          <TouchableHighlight
            underlayColor={(selectedTab === OVERVIEW) ? Colors.white : Colors.buttonYellowUnderlay}
            accessible
            accessibilityLabel={OVERVIEW}
            accessibilityRole={'button'}
            style={{flex: 1, borderRadius: 6, backgroundColor: (selectedTab === OVERVIEW) ? Colors.white : Colors.buttonYellow, alignItems: 'center', justifyContent: 'center', marginRight: 7}}
            onPress={_.debounce(_.bind(() => this.selectTab(OVERVIEW), this), 100, {'leading': true, 'trailing': false})}>
            <View>
              <Text style={{fontFamily: Fonts.type.bold, fontSize: 14, lineHeight: 14, color: Colors.darkBlue}}>{OVERVIEW}</Text>
              <View style={{height: (selectedTab === OVERVIEW) ? 2 : 0, backgroundColor: Colors.darkBlue, position: 'absolute', left: 0, right: 0, bottom: -3}} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={(selectedTab === PERFORMANCE) ? Colors.white : Colors.buttonYellowUnderlay}
            accessible
            accessibilityLabel={PERFORMANCE}
            accessibilityRole={'button'}
            style={{flex: 1, borderRadius: 6, backgroundColor: (selectedTab === PERFORMANCE) ? Colors.white : Colors.buttonYellow, alignItems: 'center', justifyContent: 'center', marginLeft: 7}}
            onPress={_.debounce(_.bind(() => this.selectTab(PERFORMANCE), this), 100, {'leading': true, 'trailing': false})}>
            <View>
              <Text style={{fontFamily: Fonts.type.bold, fontSize: 14, lineHeight: 14, color: Colors.darkBlue}}>{PERFORMANCE}</Text>
              <View style={{height: (selectedTab === PERFORMANCE) ? 2 : 0, backgroundColor: Colors.darkBlue, position: 'absolute', left: 0, right: 0, bottom: -3}} />
            </View>
          </TouchableHighlight>

        </View> */}
      </View>
    )
  }

  renderOverview () {
    const {tickerDetail, lastUpdatedTime, isBought} = this.props
    let about = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_DESCRIPTION])
    let name = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_UNDERLYING])
    let ticker = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_NAME])
    let price = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_LAST_PRICE])
    let url = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_URL])
    // const standardDeviation = tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_STANDARD_DEVIATION] || 0.5
    const dividendYield = tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_DIVIDEND_YIELD]
    const expenseRatio = tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_EXPENSES] && parseFloat(tickerDetail[GOAL_ENTITIES.TICKER_EXPENSES])

    const riskBarValue = this.calculateRiskValue()
    let remainingValue = 10 - riskBarValue
    let riskText = 'Conservative'
    if (riskBarValue >= 3.33 && riskBarValue < 6.66) {
      riskText = 'Moderate'
    }
    if (riskBarValue >= 6.66) {
      riskText = 'Aggressive'
    }
    // last update time
    let m = lastUpdatedTime && moment(lastUpdatedTime).tz('America/New_York').format('h:MM A z, MMMM DD').toUpperCase()

    return (
      <View style={{marginTop: 7}}>
        {
          isBought &&
          <View style={{height: 44, backgroundColor: Colors.white, paddingHorizontal: 25, justifyContent: 'center', marginBottom: 7}}>
            <Text style={{fontSize: 20, fontFamily: Fonts.type.bold, color: '#1C3C70'}}>Summary</Text>
          </View>
        }
        <View style={{backgroundColor: 'white', marginHorizontal: 5, borderRadius: 6, paddingHorizontal: 19}}>
          <Text style={{marginTop: 14, fontFamily: Fonts.type.book, fontSize: 16, lineHeight: 20, color: 'rgba(0, 0, 0, 0.62)'}}>
            {about + '\n'}
          </Text>
          <Text style={{letterSpacing: 1, fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: 'rgba(0, 0, 0, 0.62)'}}>
            UNDERLYING SECURITY
          </Text>
          <Text style={{fontFamily: Fonts.type.book, fontSize: 16, color: Colors.black}}>
            {name}
          </Text>
          <View style={{marginTop: 14, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flex: 1}}>
              <Text style={{letterSpacing: 1, fontFamily: Fonts.type.medium, fontSize: 10, color: 'rgba(0, 0, 0, 0.62)'}}>
                TICKER
              </Text>
              <Text style={{fontFamily: Fonts.type.book, fontSize: 14, color: Colors.black}}>
                {ticker}
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{letterSpacing: 1, fontFamily: Fonts.type.medium, fontSize: 10, color: 'rgba(0, 0, 0, 0.62)'}}>
                PRICE PER SHARE
              </Text>
              <Text style={{textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: Colors.black}}>
                {price && formatFloatPrice(price)}
              </Text>
            </View>
            <TouchableOpacity
              accessible
              accessibilityLabel={'show more info'}
              accessibilityRole={'link'}
              style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}
              onPress={() => this.setState({showMoreInfo: url})}>
              <Text style={{fontFamily: Fonts.type.book, fontSize: 16, color: Colors.black}}>
                Website
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop: 12}}>
            <Text style={{letterSpacing: 1, fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: 'rgba(0, 0, 0, 0.62)'}}>
              RISK
            </Text>
            <View style={{justifyContent: 'flex-end', flex: 1, marginTop: 7}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View ref={this.riskBarNodeRef} onLayout={this.animateRiskBar} style={{width: 204, flexDirection: 'row', height: 14, borderRadius: 10, backgroundColor: '#F2F3F7', borderTopRightRadius: 10, borderBottomRightRadius: 10}}>
                  <View style={{flex: riskBarValue, backgroundColor: '#9DD5E6', height: 14, borderRadius: 10}} />
                  <View style={{flex: remainingValue, backgroundColor: 'transparent', height: 14, borderTopRightRadius: 10, borderBottomRightRadius: 10}} />
                </View>
                <Text style={{marginLeft: 13, fontFamily: Fonts.type.book, fontSize: 16, lineHeight: 20}}>{riskText}</Text>
              </View>
            </View>
          </View>

          <View style={{flex: 1, flexDirection: 'row', marginTop: 13}}>
            <View>
              <Text style={{letterSpacing: 1, fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: 'rgba(0, 0, 0, 0.62)'}}>
                DIVIDEND YIELD
              </Text>
              <Text style={{fontFamily: Fonts.type.book, fontSize: 16, color: Colors.black}}>
                {dividendYield && parseInt(dividendYield)}%
              </Text>
            </View>
            <View style={{marginLeft: 125}}>
              <Text style={{letterSpacing: 1, fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: 'rgba(0, 0, 0, 0.62)'}}>
                FUND EXPENSES
              </Text>
              <Text style={{fontFamily: Fonts.type.book, fontSize: 16, color: Colors.black}}>
                {expenseRatio && expenseRatio.toFixed(2)}%
              </Text>
            </View>
          </View>

          {
            m &&
            <View style={{marginTop: 13, marginBottom: 10}}>
              <Text style={{letterSpacing: 0, fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: 'rgba(0, 0, 0, 0.62)'}}>
                UPDATED {m}
              </Text>
            </View>
          }
        </View>
      </View>
    )
  }

  renderChildInvestment () {
    const {tickerDetail, lastUpdatedTime} = this.props
    const {investmentName, backdropURL, stockInfo, isBought, investment, currentRecurringFrequency} = this.props
    if (!investment) {
      return null
    }
    const currentValue = (investment && investment[INVESTMENT_ENTITIES.INVESTMENT_BALANCE]) || 0
    const growthValue = (investment && investment[INVESTMENT_ENTITIES.GROWTH_IN_VALUE]) || 0
    const growthPercentage = (investment && investment[INVESTMENT_ENTITIES.GROWTH_IN_PERCENTAGE]) || 0
    const totalInvestment = (investment && investment[INVESTMENT_ENTITIES.INVESTMENT_TOTAL_CONTRIBUTION]) || 0
    const nextInvestmentDate = (investment && investment[INVESTMENT_ENTITIES.INVESTMENT_RECURRING_NEXT_DATE]) || ''
    let price = (tickerDetail && tickerDetail[GOAL_ENTITIES.TICKER_LAST_PRICE])
    let availableShares = (stockInfo && stockInfo[INVESTMENT_ENTITIES.STOCK_AVAILABLE_UNITS]) || undefined

    return (
      <View style={{marginTop: 6, backgroundColor: 'white', marginHorizontal: 5, borderRadius: 6, paddingLeft: 19, paddingRight: 11}}>
        <Text style={{marginTop: 21, fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: '#050D13', opacity: 0.80, letterSpacing: 1.3}}>
          CURRENT VALUE
        </Text>
        <View style={{height: 44, justifyContent: 'center'}}>
          <Text style={{fontFamily: Fonts.type.bold, fontSize: 35, lineHeight: 40, color: '#050D13'}}>
            {currentValue && formatFloatPrice(currentValue)}
          </Text>
        </View>
        <Text style={{marginTop: 12, fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: '#050D13', opacity: 0.80, letterSpacing: 1.3}}>
          GROWTH
        </Text>
        <Text style={{marginTop: 3, fontFamily: Fonts.type.bold, fontSize: 25, color: '#050D13'}}>
          {growthValue && formatFloatPrice(growthValue)} {`(${growthPercentage}%)`}
        </Text>
        <View style={{marginTop: 16, flexDirection: 'row'}}>
          <View>
            <Text style={{letterSpacing: 1, fontFamily: Fonts.type.medium, fontSize: 10, color: '#050D13', opacity: 0.80}}>
              INVESTED
            </Text>
            <Text style={{fontFamily: Fonts.type.book, fontSize: 16, color: Colors.black}}>
              {formatPrice(totalInvestment)}
            </Text>
          </View>
          {
            availableShares
            &&
            <View style={{marginLeft: 40}}>
              <Text style={{letterSpacing: 1, fontFamily: Fonts.type.medium, fontSize: 10, color: '#050D13', opacity: 0.80}}>
                SHARES
              </Text>
              <Text style={{textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: Colors.black}}>
                {availableShares}
              </Text>
            </View>
          }
          <View style={{marginLeft: 40}}>
            <Text style={{letterSpacing: 1, fontFamily: Fonts.type.medium, fontSize: 10, color: '#050D13', opacity: 0.80}}>
              AVG PRICE
            </Text>
            <Text style={{textAlign: 'center', fontFamily: Fonts.type.book, fontSize: 16, color: Colors.black}}>
              {price && formatFloatPrice(price)}
            </Text>
          </View>
        </View>
        <View style={{marginBottom: 9}}>
          {this.renderEditRecurring()}
          {nextInvestmentDate && (
          <View style={{marginTop: 12, paddingHorizontal: 3, flexDirection: 'row', marginBottom: 9, alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: '#050D13', opacity: 0.80, letterSpacing: 1}}>
              NEXT INVESTMENT
            </Text>
            <Text style={{fontFamily: Fonts.type.medium, fontSize: 10, lineHeight: 13, color: '#050D13', opacity: 0.80, letterSpacing: 1}}>
              {nextInvestmentDate && moment(nextInvestmentDate).format('MMMM DD, YYYY').toUpperCase()}
            </Text>
          </View>
        )}
        </View>
      </View>
    )
  }

  // --------------------------------------------------------
  // Render Core Component

  render () {
    const {navigator, tickerDetail, popFunction, closeModal, isModal, isBought, investmentName} = this.props
    return (
      <View style={{...styles.screen.containers.root, backgroundColor: '#f5f6fa', borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
        <StatusBar barStyle='dark-content' />
        <CustomNav
          navigator={navigator}
          leftButtonCloseModal={closeModal}
          leftButtonPresent
          leftButtonIcon={closeModal ? 'clear' : undefined}
          titlePresent
          title={investmentName}
          titleStyle={{fontSize: 20, fontFamily: Fonts.type.bold, color: 'black'}}
        />
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' onScroll={this.animateRiskBar} scrollEventThrottle={16}>
          <View style={{paddingBottom: 20}}>
            {this.renderTopView()}
            {this.renderInformation()}
          </View>
        </ScrollView>
        {this.renderMoreInfo()}
        {this.renderSSNPopup()}
        {this.renderUserSSNPopup()}
      </View>
    )
  }
}

LI_InvestmentDetail.propTypes = {
  // used for navigation, comes via react-navigation
  navigator: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func,

  // investment id
  investmentID: PropTypes.string.isRequired,

  // investment
  investment: PropTypes.object,

  // investment is already bought
  isBought: PropTypes.bool.isRequired,

  // close modal or not
  closeModal: PropTypes.bool,

  // firstname
  firstName: PropTypes.string.isRequired,

  // user id
  userID: PropTypes.string.isRequired,

  // user ssn added ?
  userSSNAdded: PropTypes.number,

  // user ssn added processing ?
  userSSNStoreProcessing: PropTypes.bool,

  // email id
  emailID: PropTypes.string.isRequired,

  // child id
  childID: PropTypes.string.isRequired,

  // push func
  pushFunc: PropTypes.func,

  // stock info
  stockInfo: PropTypes.object,

  // pop func
  popFunc: PropTypes.func,

  // is modal
  isModal: PropTypes.bool,

  // investment name
  investmentName: PropTypes.string.isRequired,

  // backdrop url
  backdropURL: PropTypes.string.isRequired,

  // is ticker processing
  isTickerProcessing: PropTypes.bool.isRequired,

  // is graph fetch processing
  isFetchingGraph: PropTypes.bool,

  // ticker detail
  tickerDetail: PropTypes.object,

  // invest chart data
  investChartData: PropTypes.array,

  // last updated time
  lastUpdatedTime: PropTypes.string,

  // ticker name
  tickerName: PropTypes.string.isRequired,

  // id token
  idToken: PropTypes.string.isRequired,
  // current recurring amount
  currentRecurringAmount: PropTypes.number.isRequired,

  // current recurring frequency
  currentRecurringFrequency: PropTypes.string.isRequired,

  // is loading graph data
  isLoadingGraphData: PropTypes.bool.isRequired,

  // is ssnAdded
  isssnAdded: PropTypes.bool

}

LI_InvestmentDetail.defaultProps = {
  isBought: false,
  closeModal: false,
  isLoadingGraphData: false
}

// ========================================================
// Export
// ========================================================
const Screen = connect()(form(LI_InvestmentDetail))

export default Screen
