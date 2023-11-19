import UserOptionSelect from "@/components/UserOptionSelect";
import Sidebar from "@/components/sidebar/Sidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = async (props) => {
  return (
    <>
      <div className="block sm:pl-80 h-[100svh]">
        <div className="w-full relative bg-white  h-[92.5%] text-center md:text-left sm:h-[100%] ">
          <UserOptionSelect userId={props.params.userId} />
          <main className="min-h-[80%] sm:min-h-[88.6%] SCROLL_BAR bg-white">
            {props.children}
          </main>
        </div>
      </div>
    </>
  );
};

export default RootLayout;
