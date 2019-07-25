// ========================================================
// Import Packages
// ========================================================

import React, { Component }
  from 'react'
import PropTypes
  from 'prop-types'
import { Image, TouchableHighlight, View, Text }
  from 'react-native'
import { GiftedChat }
  from 'react-native-gifted-chat'

import avatarImage from '../../../Img/Acadamy/avatar.png'
import suggesstionImage from '../../../Img/Acadamy/sugesstion.png'
import LoaderImage from '../../../Img/Acadamy/lodingChat.gif'
import Message from 'react-native-gifted-chat/src/Message'
import Bubble from 'react-native-gifted-chat/src/Bubble'
import Fonts from '../../Themes/Fonts'
import * as Animatable
  from 'react-native-animatable'

// ========================================================
// UTILITY
// ========================================================

const chatData = [
  {
    text: 'Let’s get started on our learning journey.',
    suggestions: ['Learning', 'Careers', 'Themes']
  },
  {
    text: 'This is the new text message',
    suggestions: ['Companies']
  },
  {
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    suggestions: ['Companies', 'Portfolio', 'Learning', 'Careers', 'Themes']
  },
  {
    text: 'you can select any of this',
    suggestions: ['Companies', 'Portfolio', 'Careers', 'Themes']
  },
  {
    text: 'It has survived not only five centuries',
    suggestions: ['Companies', 'Careers', 'Themes']
  },
  {
    text: 'Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
    suggestions: ['Careers', 'Themes']
  },
  {
    text: 'Various versions have evolved over the years, sometimes by accident, sometimes on purpose.',
    suggestions: ['Companies', 'Portfolio', 'Learning', 'Careers', 'Themes']
  }
]
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

// ========================================================
// Core Component
// ========================================================

class ChatRoom extends Component {
  state = {
    messages: []
  }

  componentWillMount () {
    this.selectSuggestion(chatData[0])
  }

  selectSuggestion (message, onSend) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: avatarImage
          },
          ...message
        }),
        loading: false,
        minInputToolbarHeight: 195 // Math.ceil(message.suggestions.length / 2) * 60 + 15
      }
    }, () => onSend && onSend([], false))
  }

  renderHeader () {
    return (
      <View style={{marginBottom: 15, marginTop: 50}}>
        <View style={{marginBottom: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '30%', paddingRight: '10%'}}>
          <Text style={{color: '#FFF', opacity: 0.68, fontSize: 15, fontFamily: Fonts.type.book, alignSelf: 'center'}}>Harriette</Text>
          <View style={{flexDirection: 'row'}}>
            <Image style={{height: 30, width: 30, marginRight: 24}} source={avatarImage} />
            <Image style={{height: 28, width: 28}} source={avatarImage} />
          </View>
        </View>
        <Image style={{height: 72, width: 72, alignSelf: 'center'}} source={avatarImage} />
        <Text style={{color: '#FFF', fontSize: 16, fontFamily: Fonts.type.bold, alignSelf: 'center'}}>Fenway</Text>
      </View>
    )
  }
  renderSuggestion (item, index, odd, onSend) {
    let margins = odd ? {marginLeft: (index % 2 !== 0 && index) ? 15 : 5, marginRight: (index % 2 === 0) ? 15 : 5} : {marginLeft: (index % 2 === 0) ? 15 : 5, marginRight: (index % 2 !== 0) ? 15 : 5}

    let style = (index === 0 && odd) && {margin: 5} || margins
    return (
      <TouchableHighlight style={{width: (odd && index === 0) ? '51%' : '50%', height: 60}} onPress={() => {
        this.setState({
          loading: true
        }, () => {
          setTimeout(() => {
            this.selectSuggestion(chatData[getRandomInt(7)], onSend)
          }, 1500)
        })
      }} underlayColor={'transparent'}>
        <View style={{flex: 1, margin: 5, backgroundColor: '#1C3C70', borderRadius: 5, flexDirection: 'row', alignItems: 'center', ...style}}>
          <Image style={{height: 35, width: 35, marginHorizontal: 18}} source={suggesstionImage} />
          <Text style={{color: '#FFF', fontSize: 18, fontFamily: Fonts.type.medium}}>{item}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderLoading () {
    if (this.state.loading) {
      return (
        <Message
          currentMessage={{
            user: {
              _id: 2,
              avatar: avatarImage
            }
          }}
          renderCustomView={() => <Image source={LoaderImage} style={{borderRadius: 15, height: 30, width: 50}} />}
        />
      )
    } else {
      return null
    }
  }

  renderBubble (props) {
    return (
      <Animatable.View animation={'fadeInLeft'} duration={400}>
        <Bubble {...props} />
      </Animatable.View>
    )
  }

  render () {
    let suggestions = this.state.messages[0].suggestions
    let isTopComponent = suggestions.length > 0 && suggestions.length % 2 !== 0

    return (
      <View style={{ backgroundColor: '#69B8D0', flex: 1 }}>
        {this.renderHeader()}
        <GiftedChat
          messages={this.state.messages}
          user={{
            _id: 1
          }}
          renderBubble={this.renderBubble}
          renderChatFooter={() => this.renderLoading()}
          minInputToolbarHeight={this.state.minInputToolbarHeight}
          renderInputToolbar={(props) => {
            return (
              <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
                {
                  suggestions.map((item, index) => this.renderSuggestion(item, index, isTopComponent, props.onSend))
                }
              </View>
            )
          }}
          customTextStyle={{color: '#000', fontSize: 16, fontFamily: Fonts.type.book}}
        />
      </View>
    )
  }
}

ChatRoom.propTypes = {
  // used for navigation, comes via react-navigation
  navigation: PropTypes.object.isRequired,

  // used for handling local actions, comes from container directly
  handleLocalAction: PropTypes.func,

  // used for mapping local action types, comes from container directly
  localActions: PropTypes.object,

  // used for submitting form, comes via redux-form
  handleSubmit: PropTypes.func
}

// ========================================================
// Export
// ========================================================
export default ChatRoom

