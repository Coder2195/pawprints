import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import Profile from "./profile";
import ThemeButton from "./theme";

const Navbar: FC = () => {
  return (
    <div className="w-full fixed top-0 left-0 p-2 z-40">
      <nav className="flex gap-2 bg-primary/70 backdrop-blur-md p-2 justify-between items-center text-white rounded-xl restrict-width mx-auto">
        <Link className="flex gap-2 items-center font-bold " href="/">
          <Image
            src="/pawprints.svg"
            alt="Pawprints Logo"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <span className="3xs:inline hidden text-lg">Pawprints</span>
        </Link>
        <div className="flex-1"></div>
        <ThemeButton />
        <Profile />
      </nav>
    </div>
  );
};

export default Navbar;
