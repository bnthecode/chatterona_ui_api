export const mongoChannelToUiChannel = (mongoChannel) => ({
    ...mongoChannel.toObject(),
    id: mongoChannel._id
})

export const mongoDirectMessageToUiDirectMessage = (mongoChannel) => ({
    ...mongoChannel.toObject(),
    id: mongoChannel._id,
})