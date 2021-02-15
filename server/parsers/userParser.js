

export const mongoUserToUiUser = (mongoUser) => ({
    ...mongoUser ? mongoUser.toObject() : {},
    id: mongoUser ? mongoUser._id : '12345',

})