const getChatIcon = (chat, userId) => {
  if (chat.isGroupChat) {
    return chat.pic;
  }

  if (chat.chatUsers.length === 1) {
    return chat.chatUsers[0].icon;
  }

  if (chat.chatUsers[0]._id == userId) {
    return chat.chatUsers[1].icon;
  } else {
    return chat.chatUsers[0].icon;
  }
};
export default getChatIcon;
