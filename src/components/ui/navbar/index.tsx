import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import Profile from "./profile";
import ThemeButton from "./theme";

const Navbar: FC = () => {
  return (
    <nav className="flex gap-2 bg-primary/70 backdrop-blur-md p-2 justify-between items-center text-white fixed top-2 left-2 w-[calc(100%-1rem)] z-50 rounded-lg">
      <Link className="flex gap-2 items-center font-bold " href="/">
        <Image
          src="/pawprints.svg"
          alt="Pawprints Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <span className="3xs:inline hidden text-lg">Pawprints</span>
      </Link>
      <div className="flex-1"></div>
      <ThemeButton />
      <Profile />
    </nav>
  );
};

export default Navbar;
