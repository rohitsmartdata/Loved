/* eslint-disable no-trailing-spaces,key-spacing */
/**
 * This root fixture is mocking
 * state of the app when homepage
 * arrives.
 *
 * Created by viktor on 31/5/17.
 */

export default {

  user : {

    info : {
      UID     : 1234,
      emailID : 'victorchoudhary001@gmail.com',
      isActive: true,
      firstName   : 'victor',
      lastName    : 'choudhary',
      DOB         : '01/08/1990'
    }

  },

  children : {

    map : {

      'C1' : {
        firstName : 'chinu',
        lastName  : 'choudhary',
        DOB       : '12/07/1993'
      },

      'C2' : {
        firstName : 'rahul',
        lastName  : 'choudhary',
        DOB       : '13/02/1995'
      }

    }

  }

}
