export const mongoUserFriendsoUiFriend = (mongoUser) => ({
  id: mongoUser._id,
  photoURL: mongoUser.photoURL,
  username: mongoUser.username,
});

export const mongoUserToUiUser = (mongoUser) => ({
  id: mongoUser._id,
  photoURL: mongoUser.photoURL,
  username: mongoUser.username,
  status: mongoUser.status,
});
