"use client";

import { authClient } from "@/lib/auth/client";
import Image from "next/image";
import { FC } from "react";
import { ImSpinner8 } from "react-icons/im";

const Profile: FC = () => {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch,
  } = authClient.useSession();

  if (isPending)
    return <ImSpinner8 className="animate-spin w-8 h-8 p-1" size={28} />;

  if (!session)
    return (
      <button
        onClick={() => authClient.signIn.social({ provider: "google" })}
        className="bg-white p-0.5 px-4 rounded-lg text-primary hover:bg-white/70 active:bg-white/90 transition-all duration-300 ease-in-out"
      >
        Login
      </button>
    );

  return (
    <div className="relative flex items-center rounded-full">
      <button className="overflow-hidden w-8 h-8 relative hover:cursor-pointer border-2 rounded-full border-white peer">
        <Image
          fill
          src={session.user.image || "/default-profile.png"}
          className="object-center object-cover"
          alt="Profile Picture"
        />
      </button>

      <div className="absolute hover:max-h-24 peer-hover:max-h-24 z-50 max-h-0 w-max rounded-lg right-0 top-full transition-all duration-300 ease-in overflow-hidden text-pms-430c">
        <span className="border-2 border-orange rounded-lg bg-solid flex flex-col justify-stretch">
          <div className="p-0.5 px-2 border-b-2 border-orange">
            Hello, {session.user.name}!
          </div>
          <button
            onClick={() => authClient.signOut()}
            className="p-0.5 px-2 transition-colors duration-300 ease-in-out bg-red hover:bg-red/70 text-white font-bold"
          >
            Logout
          </button>
        </span>
      </div>
    </div>
  );
};

export default Profile;
