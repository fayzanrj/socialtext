import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HiChat, HiOutlineSearch } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";
const useRoutes = () => {
  const pathname = usePathname();
  const path = pathname.split("/");
  const router = useRouter();

  const checkRoute = async () => {
    try {
      const userId = await sessionStorage.getItem("userId");
      if (path[1] != userId) {
        router.push(`/${userId}/conversations`);
      }
    } catch (error) {}
  };

  checkRoute();

  const handleSignOut = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userId");
    router.push("/");
  };

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: `conversations`,
        icon: HiChat,
        active: path[2] === "conversations",
      },
      {
        label: "Users",
        href: "users",
        icon: HiUsers,
        active: path[2] === "users",
      },
      {
        label: "Search",
        href: "search",
        icon: HiOutlineSearch ,
        active: path[2] === "search",
      },
      {
        label: "Logout",
        onClick: handleSignOut,
        href: "#",
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname]
  );

  return routes;
};

export default useRoutes;
