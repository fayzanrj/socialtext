const UserChatListSkeleton = () => {
  return <>
  <SkeletonItem/>
  <SkeletonItem/>
  <SkeletonItem/>
  <SkeletonItem/>
  <SkeletonItem/>
  <SkeletonItem/>
  <SkeletonItem/>
  <SkeletonItem/>
  <SkeletonItem/>
  <SkeletonItem/>
  <SkeletonItem/>
  </>;
};

export default UserChatListSkeleton;

import React from "react";

const SkeletonItem = () => {
  return (
    <div>
      <div className="relative flex w-full h-20 gap-2 p-4">
        <div className="CHAT_LIST_LOADER relative overflow-hidden h-12 w-12 rounded-full "></div>
        <div className="flex-1">
          <div className="CHAT_LIST_LOADER relative overflow-hidden mb-1 h-5 w-full rounded-lg text-lg"></div>
          <div className="CHAT_LIST_LOADER relative overflow-hidden h-5 w-full rounded-lg  text-sm"></div>
        </div>
      </div>

      <hr className="w-[90%] m-auto " />
    </div>
  );
};
