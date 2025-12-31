"use client";

import { authClient } from "@/lib/auth/client";
import { useClickAway } from "@/lib/hooks";
import Image from "next/image";
import { FC, Ref, useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import { MdLogout } from "react-icons/md";

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
        onClick={() => authClient.signIn.social({ provider: "google" })}
        className="bg-white p-0.5 px-4 rounded-lg text-primary hover:bg-white/70 active:bg-white/90 transition-all duration-300 ease-in-out text-lg font-bold"
      >
        Login
      </button>
    );

  return (
    <div className="relative flex items-center rounded-full" ref={ref}>
      <button
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
        } origin-top-right w-max rounded-lg right-0 top-[calc(100%+0.5rem)] transition-all duration-300 ease-in-out text-sm overflow-hidden text-pms-427c border`}
      >
        <span className="rounded-lg bg-solid flex flex-col justify-stretch overflow-hidden gap-1 p-1 max-w-[calc(100dvw-2rem)]">
          <div className="p-1 px-4">
            Welcome back, {session.user.name.split(" ")[0]}!
          </div>
          <button
            onClick={() => authClient.signOut()}
            className="p-1 px-4 transition-colors duration-300 ease-in-out bg-red hover:bg-red/70 rounded-md text-white font-bold flex items-center gap-2 justify-center"
          >
            <MdLogout size={20} />
            Logout
          </button>
        </span>
      </div>
    </div>
  );
};

export default Profile;
