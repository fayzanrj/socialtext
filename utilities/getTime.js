//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

export const getTime = (date) => {
  if (
    new Date().getMonth() === new Date(date).getMonth() &&
    new Date().getDate() === new Date(date).getDate() &&
    new Date().getFullYear() === new Date(date).getFullYear()
  ) {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (
    new Date().getMonth() === new Date(date).getMonth() &&
    new Date().getDate() - 1 === new Date(date).getDate() &&
    new Date().getFullYear() === new Date(date).getFullYear()
  ) {
    return "Yesterday";
  } else {
    return `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}`;
  }
};
