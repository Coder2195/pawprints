import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import Profile from "./profile";
import ThemeButton from "./theme";
import Nav from "./nav";

const Navbar: FC = () => {
  return (
    <div className="w-full fixed top-0 left-0 p-2 z-40">
      <Nav>
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
        <div className="flex-1">
          <Link href="/about" className="ml-4 hover:underline">
            About
          </Link>
          <Link href="/create" className="ml-4 hover:underline">
            Create
          </Link>
        </div>
        <ThemeButton />
        <Profile />
      </Nav>
    </div>
  );
};

export default Navbar;
