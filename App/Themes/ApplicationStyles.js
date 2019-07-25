/* eslint-disable no-unused-vars,no-trailing-spaces */
import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const commonStyles = {
  innerCentering: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}

const ApplicationStyles = {

  screen: {
    // root screen container style
    containers: {
      root: {
        flex: 1,
        backgroundColor: Colors.white
      },
      keyboard: {
        flex: 0,
        backgroundColor: Colors.white
      },
      spreadAndCenteringContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
      centeringContainer: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      cover: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    },

    // heading H1 style
    h1: {
      containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Metrics.h1.topMargin,
        marginBottom: Metrics.h1.bottomMargin
      },
      textStyle: {
        fontFamily: Fonts.type.bold,
        fontSize: Fonts.size.h1,
        color: Colors.h1,
        textAlign: 'center',
        backgroundColor: Colors.transparent
      }
    },
    // heading H1 style
    h2: {
      containerStyle: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: Metrics.h1.topMargin,
        marginBottom: Metrics.h1.bottomMargin
      },
      textStyle: {
        fontFamily: Fonts.type.regular,
        fontSize: Fonts.size.h2,
        color: Colors.h2,
        textAlign: 'left',
        backgroundColor: Colors.transparent
      }
    },
    // button styles
    buttons: {
      verticalGroup: {
        button: {
          height: Metrics.button.height.thick,
          width: Metrics.button.width.large,
          borderColor: '#FFF',
          borderWidth: Metrics.button.border.width,
          borderRadius: Metrics.button.border.radius,
          borderStyle: Metrics.button.border.style.verticalGroup,
          backgroundColor: Colors.button.background.verticalGroup
        },
        text: {
          fontSize: Fonts.size.button,
          fontFamily: Fonts.type.bold,
          textAlign: 'center',
          backgroundColor: Colors.button.background.verticalGroup,
          color: Colors.button.color.verticalGroup
        }
      },
      verticalGroupBigger: {
        button: {
          flex: 1,
          minHeight: 125,
          borderColor: '#FFF',
          borderWidth: Metrics.button.border.width,
          borderRadius: Metrics.button.border.radius,
          borderStyle: Metrics.button.border.style.verticalGroup,
          backgroundColor: Colors.button.background.verticalGroup
        },
        text: {
          fontSize: Fonts.size.buttonBigger,
          fontFamily: Fonts.type.semibold,
          textAlign: 'center',
          backgroundColor: Colors.button.background.verticalGroup,
          color: Colors.button.color.verticalGroup
        },
        description: {
          fontSize: Fonts.size.buttonBigger,
          fontFamily: Fonts.type.regular,
          textAlign: 'center',
          backgroundColor: Colors.button.background.verticalGroup,
          color: Colors.button.color.verticalGroup
        }
      },
      decisionButton: {
        button: {
          height: Metrics.button.height.thick,
          width: Metrics.button.width.large,
          borderRadius: 100,
          backgroundColor: Colors.button.background.decisionButton
        },
        text: {
          fontSize: Fonts.size.button,
          fontFamily: Fonts.type.bold,
          backgroundColor: Colors.transparent,
          color: Colors.button.color.decisionButton
        }
      }
    },

    // style for text input in forms
    textInput: {
      parentContainerStyle: {
        height: 40,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      containerStyle: {
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        height: 40,
        flex: 1,
        paddingLeft: 16,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Montserrat-Light'
      }
    },

    // horizontal line style ( used as seperator )
    horizontalLine: {
      containerStyle: commonStyles.innerCentering,
      lineStyle: {
        height: Metrics.horizontalLine.height,
        width: Metrics.horizontalLine.width,
        backgroundColor: Colors.horizontalLine
      }
    }

  },

  text: {
    jumboHeader: {
      color: Colors.white,
      fontSize: 35,
      lineHeight: 44,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: Fonts.type.bold
    },
    nameHeader: {
      color: Colors.white,
      fontSize: 25,
      lineHeight: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: Fonts.type.bold
    },
    mainHeader: {
      color: Colors.blue,
      fontSize: 22,
      lineHeight: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: Fonts.type.bold
    },
    header: {
      color: Colors.blue,
      fontSize: 18,
      lineHeight: 23,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: Fonts.type.bold
    },
    title: {
      color: Colors.black,
      fontSize: 16,
      lineHeight: 20,
      textAlign: 'center',
      fontFamily: Fonts.type.book
    },
    subTitle: {
      color: Colors.black,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      fontFamily: Fonts.type.book
    },
    description: {
      color: Colors.black,
      fontSize: 12,
      lineHeight: 15,
      textAlign: 'center',
      fontFamily: Fonts.type.book
    },
    information: {
      color: Colors.black,
      fontSize: 10,
      lineHeight: 15,
      textAlign: 'center',
      fontFamily: Fonts.type.book
    }
  },

  header: {
    containerStyle: {
      navBarTextColor: '#000',
      navBarTextFontFamily: Fonts.type.regular,
      navBarTextFontSize: 18,
      screenBackgroundColor: 'rgb(255, 208, 23)',
      navBarBackgroundColor: 'rgb(255, 208, 23)',
      navBarButtonColor: '#000',
      navBarNoBorder: true,
      statusBarTextColorScheme: 'light'
    },
    borderContainerStyle: {
      navBarTextColor: '#000',
      navBarTextFontSize: 17,
      navBarButtonColor: '#000',
      drawUnderNavBar: true,
      navBarTransparent: true,
      screenBackgroundColor: 'rgb(255, 208, 23)',
      navBarBackgroundColor: 'rgb(255, 208, 23)',
      statusBarTextColorScheme: 'light'
    }
  },

  hiddenNavbar: {
    navBarHidden: true,
    navBarNoBorder: true,
    screenBackgroundColor: '#FFF',
    navBarBackgroundColor: '#FFF',
    statusBarTextColorScheme: 'light',
    statusBarColor: '#9B9B9B'
  },

  // bottom navigator style
  bottomNavigator: {
    containerStyle: {
      backgroundColor: Colors.buttonYellow,
      justifyContent: 'center',
      alignItems: 'center',
      height: 44,
      borderRadius: 5
    },
    textWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textStyle: {
      color: Colors.blue,
      fontFamily: Fonts.type.medium,
      fontSize: 18
    },
    groupContainer: {
      flex: 0.08,
      flexDirection: 'row',
      backgroundColor: 'transparent'
    }
  },
  simpleBottomNavigator: {
    containerStyle: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      height: 45
    },
    textStyle: {
      color: '#10427E',
      fontFamily: Fonts.type.bold,
      fontSize: 15
    }
  }

}

export default ApplicationStyles
