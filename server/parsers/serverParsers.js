export const mongoServerToUiServer = (mongoServer) => ({
    ...mongoServer ? mongoServer.toObject() : {},
    id: mongoServer._id,
    channels: mongoServer.channels.map((channel) => ({
        ...channel ? channel.toObject() : {},
        id: channel ? channel._id : '12345'
    }))
})

export const mongoServersToUiServers = (mongoServer) => ({
    id: mongoServer._id,
    name: mongoServer.name,
    photoURL: mongoServer.photoURL,
    channels: mongoServer.channels.map((channel) => ({
        ...channel ? channel.toObject() : {},
        id: channel ? channel._id : '12345'
    }))
})