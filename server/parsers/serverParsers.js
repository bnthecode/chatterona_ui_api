export const mongoServerToUiServer = (mongoServer) => ({
  id: mongoServer._id,
  photoURL: mongoServer.photoURL,
  name: mongoServer.name,
  channels: mongoServer.channels.map((channel) => ({
    ...(channel ? channel.toObject() : {}),
    id: channel ? channel._id : "12345",
  })),
  categories: mongoServer.categories ? mongoServer.categories.map((ctg) => ({
    ...(ctg ? ctg.toObject() : {}),
    id: ctg ? ctg._id : "12345",
  })) : [],
});

export const mongoServersToUiServers = (mongoServer) => ({
  id: mongoServer._id,
  name: mongoServer.name,
  photoURL: mongoServer.photoURL,
  channels: mongoServer.channels.map((channel) => ({
    id: channel ? channel._id : "12345",
  })),
});
