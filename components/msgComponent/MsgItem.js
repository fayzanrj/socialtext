import Image from "next/image";
import React from "react";
import { MdDone } from "react-icons/md";

const MsgItem = ({ msg, sentBy, userId, name, icon, sentAt }) => {
  const user = "user";
  const sentByCurrentUser = sentBy === userId;
  return (

    <div
      className={`w-full gap-2 ${
        sentByCurrentUser ? "flex justify-end" : "flex justify-start"
      } ${name.length > 0 ? "mt-3" : ""}
  }`}
    >
      <div>
        {!sentByCurrentUser ? (
          <div className="w-[40px] h-[30px] bg-white text-white">
            {icon && (
              <Image
                className="rounded-full"
                src={icon}
                width={40}
                height={30}
                alt="avatar"
              />
            )}
          </div>
        ) : null}
      </div>

      <div className={`w-fit  max-w-[80%] lg:max-w-[50%] h-fit break-words `}>
        {!sentByCurrentUser && <p className="ml-2">{name}</p>}
        <div
          className={`w-full relative my-1  py-1 px-3 rounded-[.75rem] ${
            sentByCurrentUser
              ? "bg-sky-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          <p>{msg}</p>
          <div
            className={`w-full relative ${
              sentByCurrentUser ? "text-right" : "text-left"
            }`}
          >
            <p className="text-[.7rem] mt-1">
              {sentAt}{" "}
              {sentByCurrentUser && (
                <span className=" w-4 inline-block">
                  <MdDone
                    size={"1rem"}
                    className="absolute top-1/2 transform -translate-y-1/2"
                  />
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MsgItem;

