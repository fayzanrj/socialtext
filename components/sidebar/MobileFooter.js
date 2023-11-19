"use client";
import useRoutes from "@/hooks/useRoutes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { HiOutlineUser } from "react-icons/hi";

const MobileFooter = ({ userId }) => {
  const routes = useRoutes();
  const pathname = usePathname();
  const path = pathname.split("/");

  return (
    <div
      className={`sm:hidden w-full h-[8%] z-50 pt-1  absolute bottom-0 ${
        path[2] === "conversations" ? "" : "bg-white"
      }`}
    >
      <ul
        className={`w-[90%] h-[90%] rounded-2xl mx-auto bg-[#a18aff] overflow-hidden`}
      >
        {routes.map((route, index) => {
          return (
            <MobileItem
              key={index}
              Icon={route.icon}
              label={route.label}
              href={`/${userId}/${route.href}`}
              active={route.active}
              onClick={route.onClick}
            />
          );
        })}
        <li className="inline-block w-1/5 relative h-full">
          <Link
            href={`/${userId}/myprofile`}
            className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            text-white
            sm:hover:bg-gray-100
        `}
          >
            <HiOutlineUser  
              className={`h-8 w-8 p-1 m-auto rounded-lg shrink-0\ ${
                path[2] === "myprofile" && " bg-[#7857ff]"
              }`}
              aria-hidden="true"
            />
            <span className="sr-only">profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MobileFooter;

const MobileItem = ({ Icon, href, active, label, onClick }) => {
  return (
    <li onClick={onClick} className="inline-block w-1/5 relative h-full">
      <Link
        href={href}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white`
      }
      >
        <Icon
          className={`h-8 w-8 p-1 m-auto rounded-lg shrink-0\ ${
            active && " bg-[#7857ff]"
          }`}
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};
