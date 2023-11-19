"use client";
import useRoutes from "@/hooks/useRoutes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiOutlineUser } from "react-icons/hi";

const DesktopSidebar = ({ userId }) => {
  const routes = useRoutes();
  return (
    <div className="hidden sm:block w-14 h-full relative border-r-2">
      <ul className="w-[80%] rounded-xl bg-[#a18aff] mx-auto my-2 py-1">
        {routes.map((route, index) => {
          return (
            <DesktopItem
              key={index}
              Icon={route.icon}
              label={route.label}
              href={`/${userId}/${route.href}`}
              active={route.active}
              onClick={route.onClick}
            />
          );
        })}
      </ul>
      <div className=" w-10 m-auto absolute bottom-3 left-2">
        <Link href={`/${userId}/myprofile`}>
          <HiOutlineUser
            className={`h-8 w-8 p-1 m-auto rounded-lg shrink-0 `}
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
};

export default DesktopSidebar;

const DesktopItem = ({ Icon, href, active, label, onClick }) => {
  return (
    <li className=" w-full my-6" onClick={onClick}>
      <Link
        href={href}
        className={`
          group 
          text-sm 
          leading-6 
          font-semibold 
          text-gray-500 
          hover:text-black 
`}
      >
        <Icon
          className={`h-8 w-8 p-1 mx-auto text-white rounded-lg shrink-0  ${
            active && " bg-[#7857ff]"
          }`}
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};
