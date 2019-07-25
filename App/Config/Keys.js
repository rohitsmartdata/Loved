/**
 * Created by demon on 5/7/18.
 */

// --------------------------------------------------------
// SEGMENT KEYS
// --------------------------------------------------------

const SEGMENT_PROD = 'FayeCLpsWmX576vPrJqnfxB4D5HKIAaM'
const SEGMENT_DEV = 'm15OAHz9YhPn4emmZJvyUPCQSZFqiak4'

export const getSegmentKey = (isProd) => {
  if (isProd) {
    return SEGMENT_PROD
  } else {
    return SEGMENT_DEV
  }
}
