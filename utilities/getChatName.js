const getChatName = (chat, userId) => {
  if (chat.isGroupChat) {
    return chat.chatName;
  }

  if (chat.chatUsers.length === 1) {
    return chat.chatName;
  }
  
  if (chat.chatUsers[0]._id == userId) {
    return chat.chatUsers[1].username;
  } else {
    return chat.chatUsers[0].username;
  }
};
export default getChatName;
