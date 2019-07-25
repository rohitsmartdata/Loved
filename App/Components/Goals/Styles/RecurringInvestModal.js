/* eslint-disable no-trailing-spaces,no-unused-vars */
/**
 * Created by viktor on 5/7/17.
 */

import fonts from '../../../Themes/Fonts'

export default {
  // Root container
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  innerContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 30,
    backgroundColor: 'rgb(83, 179, 98)',
    borderWidth: 3,
    borderColor: '#FFF'
  },

  headingContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  amountHeaderContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subheadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  decisionBoxStyle: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  ball: {
    height: 35,
    width: 35,
    borderRadius: 100,
    backgroundColor: 'rgba(256, 256, 256, 0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  datePickerCustomStyle: {
    placeholderText: {
      color: 'rgb(193,201,246)',
      fontWeight: '600',
      fontSize: 16
    },
    dateText: {
      color: 'rgb(193,201,246)',
      fontWeight: '600',
      fontSize: 16
    },
    dateInput: {
      borderWidth: 0
    }
  },
  datePickerStyle: {
    backgroundColor: '#FFF',
    borderRadius: 40,
    width: 300,
    height: 44,
    marginRight: 0,
    marginLeft: 0,
    borderWidth: 0
  },
  headingStyle: {
    fontSize: 20,
    backgroundColor: 'transparent',
    color: '#FFF'
  },
  amountHeaderStyle: {
    fontSize: 34,
    fontWeight: '300',
    backgroundColor: 'transparent',
    color: '#FFF'
  },
  subheadingStyle: {
    fontSize: 12,
    fontWeight: fonts.weight.Semibold,
    backgroundColor: 'transparent',
    color: '#FFF'
  }
}
