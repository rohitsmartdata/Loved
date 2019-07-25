/* eslint-disable key-spacing,no-trailing-spaces */
/**
 * Created by viktor on 21/6/17.
 */

// ========================================================
// ADD_GOAL Component
// ========================================================

// Entities
export const COMMON_ENTITIES = {
  START_JOURNEY: 'START_JOURNEY',

  // navigator object
  NAVIGATOR: 'navigator',
  // navigator title
  NAVIGATOR_TITLE: 'NAVIGATOR_TITLE',
  // parent navigator object; used to bypass lightbox
  // navigator object limitations
  PARENT_NAVIGATOR: 'PARENT_NAVIGATOR',
  // dispatch object
  DISPATCH: 'DISPATCH',
  // should reset navigation stack
  RESET_STACK: 'RESET_STACK',
  // stale option
  IS_STALE: 'IS_STALE',
  // can skip,
  CAN_SKIP: 'CAN_SKIP',
  // skip screen
  SKIP_SCREEN: 'SKIP_SCREEN',
  // type of screen
  SCREEN_TYPE: 'SCREEN_TYPE',
  // type of next screen
  NEXT_SCREEN: 'NEXT_SCREEN',
  // type of form
  FORM_TYPE: 'formType',
  // is real time fetch
  IS_REAL_TIME: 'isRealTime',
  // can pop screen
  CAN_POP: 'canPop',
  // show bank linked
  SHOW_BANK_LINKED: 'showBankLinked',

  P_FUNC: 'pFunc',
  // awaiting invest
  // i.e. flag to mark whether
  // if user is in middle of investing
  AWAITING_INVEST: 'awaitingInvest',
  IS_ONBOARDING_FLOW: 'isOnboardingFlow',

  CALLBACK_FUCTION: 'callBackFuction',
  PROPS: 'props'
}

export const CUSTOM_LIST_ENTITIES = {
  SIMPLE  : 1,
  BULLET  : 2,
  GAP     : 3
}

export const GOAL_DURATION_TYPE = {
  AGE : 'Age',
  BIRTHDAY: 'Birthday',
  CHRISTMAS: 'Christmas',
  SOON: 'Soon',
  END_OF_SCHOOL_YEAR: 'End of School year',
  COLLEGE: 'College'
}

export const FREQUENCY = {
  ONE_YEAR: '1y',
  ONE_QUARTER: '1Q',
  ONE_MONTH: '1M',
  FORTNIGHT: '2w',
  ONE_WEEK: '1w',
  ONE_DAY: '1d',
  ONCE: 'once'
}

export const getFrequencyTitle = (f) => {
  switch (f) {
    case FREQUENCY.ONE_YEAR:
      return 'per year'
    case FREQUENCY.ONE_QUARTER:
      return 'per quarter'
    case FREQUENCY.ONE_MONTH:
      return 'per month'
    case FREQUENCY.FORTNIGHT:
      return 'per 2 weeks'
    case FREQUENCY.ONE_WEEK:
      return 'per week'
    case FREQUENCY.ONE_DAY:
      return 'per day'
    case FREQUENCY.ONCE:
      return 'once'
  }
}
export const getFrequencyShortTitle = (f) => {
  switch (f) {
    case FREQUENCY.ONE_YEAR:
      return 'yearly'
    case FREQUENCY.ONE_QUARTER:
      return 'quarterly'
    case FREQUENCY.ONE_MONTH:
      return 'monthly'
    case FREQUENCY.FORTNIGHT:
      return 'bi-weekly'
    case FREQUENCY.ONE_WEEK:
      return 'weekly'
    case FREQUENCY.ONE_DAY:
      return 'day'
    case FREQUENCY.ONCE:
      return 'once'
  }
}
export const getFrequencyLongTitle = (f) => {
  switch (f) {
    case FREQUENCY.ONE_YEAR:
      return 'every year'
    case FREQUENCY.ONE_QUARTER:
      return 'every quarter'
    case FREQUENCY.ONE_MONTH:
      return 'every month'
    case FREQUENCY.FORTNIGHT:
      return 'every bi-weekly'
    case FREQUENCY.ONE_WEEK:
      return 'every week'
    case FREQUENCY.ONE_DAY:
      return 'one day'
    case FREQUENCY.ONCE:
      return 'once'
  }
}

export const getPortfolio = (code) => {
  switch (code) {
    case '01': return {
      CODE: '01',
      NAME: 'Aggressive',
      HEADING: 'Invest for the long term',
      TICKER: 'AOA',
      GROWTH: '0.08'
    }
    case '02': return {
      CODE: '02',
      NAME: 'Moderate',
      HEADING: 'Invest for the medium term',
      TICKER: 'AOM',
      GROWTH: '0.05'
    }
    case '03': return {
      CODE: '03',
      NAME: 'Slow and Steady', // Conservative
      HEADING: 'Invest for the short term',
      TICKER: 'AOK',
      GROWTH: '0.03'
    }
    case '04': return {
      CODE: '04',
      NAME: 'Cash',
      HEADING: 'Cash returns',
      TICKER: 'MINT',
      GROWTH: '0.01'
    }
    default: return {
      CODE: '01',
      NAME: 'Aggressive',
      HEADING: 'Invest for the long term',
      TICKER: 'AOA',
      GROWTH: '0.01'
    }
  }
}

export const getPortfolioInternalID = (portfolioID) => {
  switch (portfolioID) {
    case '05':
      return 1
    case '06':
      return 2
    case '07':
      return 3
    case '08':
      return 4
    case '09':
      return 5
    case '10':
      return 14
    case '11':
      return 6
    case '12':
      return 7
    case '13':
      return 8
    case '14':
      return 9
    case '15':
      return 10
    case '16':
      return 11
    case '17':
      return 12
    case '18':
      return 13
  }
}

// export const getDreamData = (code) => {
//   switch (code) {
//     case 1: return {
//       PORTFOLIO_ID: '05',
//       NAME: 'Trailblazing Founders',
//       SUBHEADING: 'Leading Tech Companies',
//       // temporary
//       TICKER: 'VGT',
//       BRIEF: 'Cut a unique path, creating the next big thing by investing into and learning about entrepreneurship through a few simple steps of customer value creation.',
//       DESCRIPTION: 'Cut a unique path, creating the next big thing by investing into and learning about entrepreneurship through a few simple steps of customer value creation.',
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Trailblazing.png'),
//       IMAGE_URL: require('../../../Img/dreamImages/trailblazing.png')
//     }
//     case 2: return {
//       PORTFOLIO_ID: '06',
//       NAME: 'Creative Creator',
//       SUBHEADING: 'Media Companies',
//       // temporary
//       TICKER: 'IEME',
//       BRIEF: 'Nurture creative passion and how that can develop into a career by investing into and learning about creative companies.',
//       // temporary
//       DESCRIPTION: 'Nurture creative passion and how that can develop into a career by investing into and learning about creative companies.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Creative.png'),
//       IMAGE_URL: require('../../../Img/dreamImages/creativeCreator.png')
//     }
//     case 3: return {
//       PORTFOLIO_ID: '07',
//       NAME: 'Planet Saver',
//       SUBHEADING: 'Sustainable Companies',
//       // temporary
//       TICKER: 'CRBN',
//       BRIEF: 'Lead positive change by learning how doing good can pay off, whilst investing into companies making a difference to the planet.',
//       // temporary
//       DESCRIPTION: 'Lead positive change by learning how doing good can pay off, whilst investing into companies making a difference to the planet.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Green.png'),
//       IMAGE_URL: require('../../../Img/dreamImages/planetSaver.png')
//     }
//     case 4: return {
//       PORTFOLIO_ID: '08',
//       NAME: 'Health Heroes',
//       SUBHEADING: 'Health Companies',
//       // temporary
//       TICKER: 'VHT',
//       BRIEF: 'Become one of the many heroes saving lives in the health industry - surgeons, paramedics and researchers all play a part in our lives.',
//       // temporary
//       DESCRIPTION: 'Become one of the many heroes saving lives in the health industry - surgeons, paramedics and researchers all play a part in our lives.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Health.png'),
//       IMAGE_URL: require('../../../Img/dreamImages/healthHeroes.png')
//     }
//     case 5: return {
//       PORTFOLIO_ID: '09',
//       NAME: 'Company Captain',
//       SUBHEADING: 'America\'s Largest Companies',
//       // temporary
//       TICKER: 'VOO',
//       BRIEF: 'Learn about what makes a company and how leadership qualities play a part in people and the companies they help create.',
//       // temporary
//       DESCRIPTION: 'Learn about what makes a company and how leadership qualities play a part in people and the companies they help create.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Companies.png'),
//       IMAGE_URL: require('../../../Img/dreamImages/companyCaptain.png')
//     }
//     case 6: return {
//       PORTFOLIO_ID: '11',
//       NAME: 'Steve Job\'s Details',
//       SUBHEADING: 'Leading Tech Companies',
//       // temporary
//       TICKER: 'AAPL',
//       BRIEF: 'The story of Apple and Steve Jobs, why design matters, what creates an Apple product and how to pursue a design led career.',
//       // temporary
//       DESCRIPTION: 'The story of Apple and Steve Jobs, why design matters, what creates an Apple product and how to pursue a design led career.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Apple.png'),
//       IMAGE_URL: require('../../../Img/PortfolioImages/image_steve.png')
//     }
//     case 7: return {
//       PORTFOLIO_ID: '12',
//       NAME: 'Bezo\'s Mindset',
//       SUBHEADING: 'Investment Amazon',
//       // temporary
//       TICKER: 'AMZN',
//       BRIEF: 'Customer focus, hard work and adopting new approaches has helped Jeff structure Amazon to be better than the competition. Learn to do the same.',
//       // temporary
//       DESCRIPTION: 'Unstoppable customer focus, hard work and ability to venture far beyond books has helped Jeff structured Amazon to be better than the competition. Learn to do the same.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Amazon.png'),
//       IMAGE_URL: require('../../../Img/PortfolioImages/image_amazon.png')
//     }
//     case 8: return {
//       PORTFOLIO_ID: '13',
//       NAME: 'Disney\'s Creativity',
//       SUBHEADING: 'Investment Disney',
//       // temporary
//       TICKER: 'DIS',
//       BRIEF: 'Walt used creativity to create enjoyment for so many people. Like every entrepreneur, he started small and succesfully went on to create an empire.',
//       // temporary
//       DESCRIPTION: 'Walt used his creativity to create enjoyment for so many people. Like every entrepreneur should, he started small and he succesfully went on to create an empire.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Disney.png'),
//       IMAGE_URL: require('../../../Img/dreamImages/disney.png')
//     }
//     case 9: return {
//       PORTFOLIO_ID: '14',
//       NAME: 'Zuckerberg\'s Hacks',
//       SUBHEADING: 'Investment Facebook',
//       // temporary
//       TICKER: 'FB',
//       BRIEF: 'Mark started small with a few lines of code and created the most successful media businesses on this planet. Learn from Mark\'s success.',
//       // temporary
//       DESCRIPTION: 'Mark turned a dorm room project into the most successful media businesses on this planet. Learn about Facebook and Mark\'s tenacity in building the world\'s leading social platform.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Mark.png'),
//       IMAGE_URL: require('../../../Img/dreamImages/mark.png')
//     }
//     case 10: return {
//       PORTFOLIO_ID: '15',
//       NAME: 'Warren Invests Wisely',
//       SUBHEADING: 'Berkshire Hathaway Inc',
//       // temporary
//       TICKER: 'BRK.B',
//       BRIEF: 'Warren is the greatest investor of all time. His principals in life and investing are ones to keep hold of for life. Learn and live by them.',
//       // temporary
//       DESCRIPTION: 'Warren is the greatest investor of all time. His principals in life and investing are ones to keep hold of for life. Learn and live by them.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Warren.png'),
//       IMAGE_URL: require('../../../Img/dreamImages/warren.png')
//     }
//     case 11: return {
//       PORTFOLIO_ID: '16',
//       NAME: 'Cash the Creeper',
//       SUBHEADING: 'Sustainable Companies',
//       // temporary
//       TICKER: 'NEAR',
//       BRIEF: 'Cash is a safe bet. It provides security and reassurance, but at the cost of some growth. Just watch out for inflation.',
//       // temporary
//       DESCRIPTION: 'Cash is a safe bet. It provides security and reassurance, but at the cost of some growth. Just watch out for inflation.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Cash.png'),
//       IMAGE_URL: require('../../../Img/PortfolioImages/image_cash.png')
//     }
//     case 12: return {
//       PORTFOLIO_ID: '17',
//       NAME: 'Bonds are IOUs',
//       SUBHEADING: 'Leading Tech Companies',
//       // temporary
//       TICKER: 'VTEB',
//       BRIEF: 'Did a friend ever forget their lunch money and you gave them an I Owe You ("IOU")? Well in business that happens every day, but we call them bonds.',
//       // temporary
//       DESCRIPTION: 'Did a friend ever forget their lunch money and you gave them an I Owe You ("IOU")? Well in business that happens every day, but we call them bonds.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Bonds.png'),
//       IMAGE_URL: require('../../../Img/PortfolioImages/image_bonds.png')
//     }
//     case 13: return {
//       PORTFOLIO_ID: '18',
//       NAME: 'Dividends are Profits',
//       SUBHEADING: 'Media Companies',
//       // temporary
//       TICKER: 'DGRO',
//       BRIEF: 'Future dividends are the reason why someone invests. Sometimes we get caught up in hype, but always be reminded that profits are what matter.',
//       // temporary
//       DESCRIPTION: 'Future dividends are the reason why someone invests. Sometimes we get caught up in hype, but always be reminded that profits are what matter.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Dividends.png'),
//       IMAGE_URL: require('../../../Img/PortfolioImages/image_dividend.png')
//     }
//     case 14: return {
//       PORTFOLIO_ID: '10',
//       NAME: 'Diversity from Risks',
//       SUBHEADING: 'Moderate Growth Portfolio',
//       // temporary
//       TICKER: 'SHE',
//       BRIEF: 'One should never hold all your eggs in one basket. Consider risk and return in context to each other, whilst factoring in your personal situation.',
//       // temporary
//       DESCRIPTION: 'Cut a unique path and create the next big thing by investing into and learning about entrepreneurship, leading tech companies and their founders.',
//       // temporary
//       WHAT_INVESTMENT: 'Portfolio of Technology Companies',
//       // temporary
//       WHAT_LEARN: 'Entrepreneurship and Tech Industry',
//       BACKDROP_URL: require('../../../Img/PortfolioImages/Gambling.png'),
//       IMAGE_URL: require('../../../Img/PortfolioImages/image_diversify.png')
//     }
//   }
// }

export const PLAID_ACTIONS = {
  ACKNOWLEDGED : 'acknowledged',
  CONNECTED: 'connected',
  EXIT: 'exit'
}

export const BUTTON_TYPES = {
  DECISION_BUTTON: 'decisionButton',
  VERTICAL_GROUP: 'verticalGroup'
}

export const DEVICE_LOGICAL_RESOLUTION = {
  IPHONE_DEVICE_X: {
    height: 812,
    width: 375
  },
  IPHONE_DEVICE_PLUS : {
    height: 736,
    width: 414
  },
  IPHONE_DEVICE: {
    height: 667,
    width: 375
  },
  IPHONE_DEVICE_SE: {
    height: 568,
    width: 320
  }
}

export const getIcons = (name) => {
  switch (name) {
    case 'Vacation':
      return undefined
    case 'Emergency Fund':
      return require('../../../Img/dashboardIcons/Umbrella.png')
    case 'First car':
      return require('../../../Img/dashboardIcons/car.png')
    case 'College':
      return require('../../../Img/dashboardIcons/College.png')
    case 'Home':
      return require('../../../Img/dashboardIcons/city.png')
    case 'Business Idea':
      return undefined
    case 'Trailblazing Founders':
      return require('../../../Img/dashboardIcons/Rocket.png')
    case 'Creative Creator':
      return require('../../../Img/dashboardIcons/Art.png')
    case 'Planet Saver':
      return require('../../../Img/dashboardIcons/Earth_pin.png')
    case 'Health Heroes':
      return require('../../../Img/dashboardIcons/Heart_beating.png')
    case 'Company Captain':
      return undefined
    case 'Steve Job\'s Details':
      return undefined
    case 'Bezo\'s Mindset':
      return undefined
    case 'Disney\'s Creativity':
      return undefined
    case 'Zuckerberg\'s Hacks':
      return require('../../../Img/dashboardIcons/Mark.png')
    case 'Warren Invests Wisely':
      return require('../../../Img/dashboardIcons/warren.png')
    case 'Cash the Creeper':
      return undefined
    case 'Bonds are IOUs':
      return undefined
    case 'Dividends are Profits':
      return undefined
    case 'Diversity from Risks':
      return undefined
  }
}
