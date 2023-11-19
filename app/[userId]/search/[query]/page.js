import SearchUserInput from "@/components/searchComponents/SearchUserInput";
import React from "react";
import SearchedUserItem from "@/components/searchComponents/SearchedUserItem";


// HEADERS FOR API REQUEST
const headers = {
  "Content-Type": "application/json",
  api_key: process.env.API_KEY,
};

const Page = async ({ params }) => {
  const response = await fetch(
    `${process.env.HOST}/api/search/${params.query}`,  { cache: "no-store",  headers : headers}
  );
  
  const res = await response.json();
  const searched = await res;
  return (
    <div className="block sm:pl-80 h-[100svh]">
      <SearchUserInput userId={params.userId} />
      <main className="SCROLL_BAR w-full relative bg-white p-4 sm:p-8  h-[85%] overflow-y-auto sm:h-[93%] ">
        <p>
          Search results for <b>{params.query}</b>
        </p>
        <div className="my-4 flex justify-around flex-wrap ">
          {searched.map((item, index) => {
            return item._id !== params.userId ? (
              <SearchedUserItem
                key={index}
                userId={params.userId}
                searchedUserId={item._id}
                username={item.username}
                email={item.email}
                icon={item.icon}
              />
            ) : null;
          })}
        </div>
      </main>
    </div>
  );
};

export default Page;
