import Link from "next/link";
import type { FC } from "react";
import { BiLogoGithub } from "react-icons/bi";
import { SiKofi } from "react-icons/si";

const Footer: FC = () => {
	return (
		<footer className="bg-black border-t text-white w-full text-xs">
			<div className="restrict-width text-center p-2">
				<div>
					<span className="font-bold">Pawprints</span> - Designed with love by{" "}
					<Link
						href="https://coder2195.dev"
						className="hover-underline [--underline-thickness:0.1em] text-orange"
						target="_blank"
					>
						Amber
					</Link>
				</div>
				<div className="flex justify-center items-center gap-2 m-1">
					<Link href="https://github.com/Coder2195/pawprints/" target="_blank">
						<BiLogoGithub
							size={48}
							className="w-8 h-8 inline"
							aria-label="Github"
						/>
					</Link>

					<Link href="https://ko-fi.com/coder2195" target="_blank">
						<SiKofi size={48} className="w-8 h-8 inline" aria-label="Ko-fi" />
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
