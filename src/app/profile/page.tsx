import type { Metadata } from "next";

import type { FC } from "react";
import EditProfile from "@/components/profile/edit-profile";
import MyPawprints from "@/components/profile/pawprints";
import TransitionWrapper from "@/components/transition/wrapper";
import ScrollToTop from "@/components/ui/scroll-to-top";

export const metadata: Metadata = {
	title: "Pawprints - Title",
	description: "Manage your profile for the Pawprints app here!",
};

const Profile: FC = () => {
	return (
		<TransitionWrapper>
			<div className="restrict-width p-2">
				<h1 className="mt-16 text-center">Profile</h1>
				<div className="flex gap-2 justify-stretch items-start flex-col md:flex-row">
					<EditProfile />
					<MyPawprints />
				</div>
			</div>
			<ScrollToTop />
		</TransitionWrapper>
	);
};

export default Profile;
