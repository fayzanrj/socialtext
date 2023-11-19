import Image from "next/image";
import Link from "next/link";

const UserChatListItem = ({
  userId,
  chatId,
  chatName,
  icon,
  msg,
  updatedAt,
  sender,
  readBy,
  isGroupChat,
  isChatUpdate
}) => {
 
  return (
    <Link href={`/${userId}/conversations/${chatId}`}>
      <div
        className={`w-full h-20 max-h-20  p-3 flex gap-3 items-center cursor-pointer sm:hover:bg-stone-200 ${
          readBy.includes(userId) ? "" : "font-bold"
        }`}
      >
        {/* USER AVATAR DIV */}
        <div className="w-[10%] sm:w-[22%] min-w-min-[15%]">
          <Image
            className="rounded-full"
            src={icon}
            width={80}
            height={50}
            alt="avatar"
          />
        </div>

        <div className="w-[85%] sm:max-w-[70%] sm-w-[70%] h-full">
          {/* USERNAME AND TIME */}
          <div className="flex justify-between items-center w-full h-1/2 max-h-1/2 overflow-hidden">
            <p
              className={`text-sm sm:text-[.83rem] w-[60%] max-w-[70%] max-h-[70%] overflow-hidden whitespace-nowrap ${
                readBy.includes(userId) ? "font-semibold" : "font-bold"
              }`}
            >
              {isGroupChat ? chatName : `@${chatName}`}
            </p>

            <div
              className={`text-[.7rem] w-[40%] text-right`}
            >
              {updatedAt}
            </div>
          </div>

          <div
            className={`w-full h-1/3 max-h-1/3 overflow-hidden mt-2 sm:text-[.79rem] text-sm pl-1 whitespace-nowrap`}
          >
            {!isChatUpdate && (sender._id === userId ? "You: " : isGroupChat && `@${sender.username}: `)}
            <span>{msg}</span>
          </div>
        </div>
      </div>
      <hr className="w-[90%] m-auto " />
    </Link>
  );
};

export default UserChatListItem;
