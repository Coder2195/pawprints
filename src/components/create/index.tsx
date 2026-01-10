"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import OverlayPopup from "../ui/popup";
import { authClient, signIn } from "@/lib/auth/client";

const CreatePawprintClient: FC = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const needsLogin = !data?.user;
  const canCreate = !needsLogin && data?.user.accountType !== "GUEST";

  return (
    <OverlayPopup
      onClose={() => router.push("/")}
      title={
        isPending
          ? "Loading..."
          : needsLogin
          ? "Not Logged In"
          : canCreate
          ? "Create Pawprint"
          : "Guests Cannot Create Pawprints"
      }
    >
      {canCreate ? (
        <>lorem ipsum create pawprint</>
      ) : (
        <div className="h-full w-full flex justify-center items-center text-center flex-col gap-4">
          <h6>
            {isPending
              ? "Loading..."
              : needsLogin
              ? "Please log in to create pawprints."
              : "Sorry, only members of RIT can create pawprints."}
          </h6>
          {!isPending && needsLogin && (
            <button onClick={signIn} className="button button-primary">
              Log In
            </button>
          )}
        </div>
      )}
    </OverlayPopup>
  );
};

export default CreatePawprintClient;
