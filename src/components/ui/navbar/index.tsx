import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import Profile from "./profile";
import ThemeButton from "./theme";

const Navbar: FC = () => {
  return (
    <nav className="flex gap-2 bg-primary p-2 justify-between items-center text-white fixed top-0 left-0 w-full z-50">
      <Link className="flex gap-2 items-center font-bold " href="/">
        <Image
          src="/pawprints.svg"
          alt="Pawprints Logo"
          width={40}
          height={40}
        />
        Pawprints
      </Link>
      <div className="flex-1"></div>
      <ThemeButton />
      <Profile />
    </nav>
  );
};

export default Navbar;
