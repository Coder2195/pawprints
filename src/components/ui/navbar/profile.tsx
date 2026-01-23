"use client";

import Image from "next/image";
import Link from "next/link";
import { type FC, type Ref, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { ImSpinner8 } from "react-icons/im";
import { MdLogout } from "react-icons/md";
import { authClient, signIn } from "@/lib/auth/client";
import { useClickAway } from "@/lib/hooks";

const Profile: FC = () => {
	const {
		data: session,
		isPending, //loading state
		error, //error object
		refetch,
	} = authClient.useSession();

	const [show, setShow] = useState(false);

	const ref: Ref<HTMLDivElement> = useClickAway(() => setShow(false));

	if (isPending)
		return <ImSpinner8 className="animate-spin w-8 h-8 p-1" size={28} />;

	if (!session)
		return (
			<button
				type="button"
				onClick={signIn}
				className="button button-secondary font-bold"
			>
				Login
			</button>
		);

	return (
		<div className="relative flex items-center rounded-full" ref={ref}>
			<button
				type="button"
				className="overflow-hidden w-8 h-8 relative hover:cursor-pointer border-2 rounded-full border-white peer"
				onClick={() => {
					setShow(!show);
				}}
			>
				<Image
					fill
					src={session.user.image || "/default-profile.png"}
					className="object-center object-cover"
					alt="Profile Picture"
				/>
			</button>

			<div
				className={`absolute  z-10 ${
					show ? "scale-y-100" : "scale-y-0"
				} origin-top-right w-max rounded-lg -right-2 top-[calc(100%+0.75rem)] transition-all duration-300 ease-in-out text-sm overflow-hidden text-pms-427c border`}
			>
				<span className="rounded-lg bg-solid flex flex-col justify-stretch overflow-hidden gap-1 p-1 max-w-[calc(100dvw-2rem)]">
					<div className="p-1 px-4">
						Welcome back, {session.user.name.split(" ")[0]}!
					</div>
					<Link
						href="/profile"
						scroll={false}
						className="button button-primary font-bold flex items-center gap-2 justify-center"
					>
						<CgProfile size={20} aria-label="(Edit Icon)" />
						View Profile
					</Link>
					<button
						type="button"
						onClick={() => authClient.signOut()}
						className="button button-red font-bold flex items-center gap-2 justify-center"
					>
						<MdLogout size={20} aria-label="(Logout Icon)" />
						Logout
					</button>
				</span>
			</div>
		</div>
	);
};

export default Profile;
