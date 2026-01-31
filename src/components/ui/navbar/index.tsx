import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import Dropdown from "./dropdown";
import Nav from "./nav";
import Profile from "./profile";
import ThemeButton from "./theme";

const Navbar: FC = () => {
	const about = (
		<Link href="/about" className="hover-underline">
			About
		</Link>
	);

	const create = (
		<Link href="/create" className="hover-underline">
			Create
		</Link>
	);

	const themeButton = <ThemeButton />;
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
					<span className="3xs:inline hidden text-xl">Pawprints</span>
				</Link>
				<div className="flex-1 2xs:flex hidden items-center">
					<div className="flex-1 font-semibold gap-4 flex pl-4">
						{about}
						{create}
					</div>
					{themeButton}
				</div>
				<Dropdown>
					<div className="p-2 flex flex-col items-start">
						{about}
						{create}
					</div>
					<div className="p-2">{themeButton}</div>
				</Dropdown>
				<Profile />
			</Nav>
		</div>
	);
};

export default Navbar;
