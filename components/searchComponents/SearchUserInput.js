"use client";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { GrFormSearch } from "react-icons/gr";

const SearchUserInput = ({userId}) => {
  const router = useRouter();
  const search = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(search?.current.value)
    router.push(`/${userId}/search/${search?.current.value}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-[7%] relative bg-white pt-1"
    >
      <div className="w-[90%] bg-gray-200 rounded-3xl flex m-auto justify-center items-center">
        <input
          id="search"
          ref={search}
          placeholder="Search a user"
          className="w-[95%]  bg-transparent px-[1rem] outline-none "
        />
        <button aria-label="SearchBtn" type="submit">
          <GrFormSearch size={"2.5rem"} />
        </button>
      </div>
    </form>
  );
};

export default SearchUserInput;
