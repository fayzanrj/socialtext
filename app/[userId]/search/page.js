import SearchUserInput from "@/components/searchComponents/SearchUserInput";
import React from "react";

const Page = (props) => {
  return (
    <div className="block sm:pl-80  h-[100svh] bg-white">
      <SearchUserInput userId={props.params.userId}/>
      <main className="w-full h-[85.5%] sm:h-[93%] bg-white relative">
        <div className="font-semibold w-full flex justify-center items-center h-full">
          Search an user
        </div>
      </main>
    </div>
  );
};

export default Page;
