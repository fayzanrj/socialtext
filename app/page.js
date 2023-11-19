import logo from "@/public/logo/logo.png";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <main className="h-[100svh] flex flex-col justify-center items-center gap-20">
      <Image quality={100} src={logo} width={150} height={150} alt="logo" />
      <div>
        <Link href={"/login"}>
          <button className="bg-[#a18af1] outline-none rounded-md text-white text-lg px-8 py-2 m-2 ">
            Log In
          </button>
        </Link>
        <Link href={"/login"}>
          <button className="bg-[#a18af1] outline-none rounded-md text-white text-lg px-8 py-2 m-2 ">
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}
