import React, { PropTypes } from 'react'
import { View, Text } from 'react-native'
import ApplicationStyles from './Styles/AlertMessageStyles'

export default class AlertMessage extends React.Component {
  static defaultProps = { show: true }

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool
  }

  render () {
    let messageComponent = null
    if (this.props.show) {
      const { title } = this.props
      return (
        <View
          style={[ApplicationStyles.container, this.props.style]}
        >
          <View style={ApplicationStyles.contentContainer}>
            <Text allowFontScaling={false} style={ApplicationStyles.message}>{title && title.toUpperCase()}</Text>
          </View>
        </View>
      )
    }

    return messageComponent
  }
}

AlertMessage.defaultProps = {
  show: true
}