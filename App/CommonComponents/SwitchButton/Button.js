/* Switch Button Component class
 */
import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import styles from './styles'
import PropTypes from 'prop-types'
import Fonts from '../../Themes/Fonts'
import Colors from '../../Themes/Colors'

const Button = props => {
  return (
    <View style={{borderRadius: 100, margin: 3}}>
      <TouchableOpacity
        accessible
        accessibilityLabel={props.type}
        accessibilityRole={'button'}
        onPress={props.onPress}
        style={styles.buttonStyle}
      >
        <Text style={style.buttonTextStyle}>{props.type}</Text>
      </TouchableOpacity>
    </View>
  )
}

Button.propTypes = {
  type: PropTypes.string,
  active: PropTypes.bool,
  onPress: PropTypes.func
}

Button.defaultProps = {
  active: false
}

export default Button

const style = {
  buttonTextStyle: {
    fontFamily: Fonts.type.book,
    color: Colors.blue,
    fontSize: 16
  }
}
