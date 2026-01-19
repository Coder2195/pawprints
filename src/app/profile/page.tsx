import type { Metadata } from "next";

import { FC } from "react";
import TransitionWrapper from "@/components/transition/wrapper";
import ScrollToTop from "@/components/ui/scroll-to-top";
import EditProfile from "@/components/profile/edit-profile";

export const metadata: Metadata = {
  title: "Pawprints - Title",
  description: "Manage your profile for the Pawprints app here!",
};

const Profile: FC = () => {
  return (
    <TransitionWrapper>
      <div className="restrict-width p-2">
        <h1 className="mt-16 text-center">Profile</h1>
        <div className="flex gap-2 justify-stretch flex-col md:flex-row">
          <EditProfile />
          <EditProfile />
        </div>
      </div>
      <ScrollToTop />
    </TransitionWrapper>
  );
};

export default Profile;
