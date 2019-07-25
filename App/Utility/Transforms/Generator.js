export const getS3FileNameAndMetadata = (typeLevel, userId, childId, goalId, ext) => {
  let fileName
  let metadata
  switch (typeLevel) {
    case 'USER':
      fileName = `${userId}/profile.${ext}`.toLowerCase()
      metadata = {user_id: userId}
      break
    case 'CHILD':
      fileName = `${userId}/${childId}/profile.${ext}`.toLowerCase()
      metadata = {user_id: userId, sprout_id: childId}
      break
    default:
      fileName = `${userId}/${childId}/${goalId}/profile.${ext}`.toLowerCase()
      metadata = {user_id: userId, sprout_id: childId, goal_id: goalId}
  }

  return {
    fileName,
    metadata
  }
}
