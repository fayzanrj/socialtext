"use client";
import Link from "next/link";
import { redirect, useParams, usePathname } from "next/navigation";
import React, { useLayoutEffect } from "react";

const Item = ({ href, active, children }) => (
  <li
    className={`inline-block mx-2 my-1 sm:mx-1 md:mx-4 w-24 py-2 text-center rounded-lg cursor-pointer ${
      active ? "bg-[#a18af1] text-white" : "bg-gray-300"
    }`}
  >
    <Link href={href}>{children}</Link>
  </li>
);

const UserOptionSelect = ({ userId }) => {
  const pathname = usePathname();
  const path = pathname.split("/");

  useLayoutEffect(() => {
    if (!path[3]) {
      redirect(`/${userId}/users/friends`);
    }
  }, []);

  return (
    <ul className="w-full min-h-[5rem] bg-white pt-5  pl-0 md:pl-10">
      <Item href={`/${userId}/users/friends`} active={path[3] === "friends"}>
        Friends
      </Item>
      <Item href={`/${userId}/users/requests`} active={path[3] === "requests"}>
        Requests
      </Item>
      <Item
        href={`/${userId}/users/requested`}
        active={path[3] === "requested"}
      >
        Requested
      </Item>
    </ul>
  );
};

export default UserOptionSelect;
