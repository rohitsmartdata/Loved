/* eslint-disable no-unused-vars,no-trailing-spaces */
/**
 * Created by viktor on 5/7/17.
 */

import fonts from '../../../Themes/Fonts'

export default {
  // Root container
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },

  // Top level containers
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  buttonStyle: {
    width: 70,
    height: 70,
    marginRight: 0,
    marginLeft: 0,
    borderWidth: 0,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonTitleStyle: {
    fontSize: 12,
    fontWeight: fonts.weight.Semibold,
    color: '#FFF'
  }
}
