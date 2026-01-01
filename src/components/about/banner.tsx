import Image from "next/image";
import { FC } from "react";

const Banner: FC = () => {
  return (
    <header className="relative banner">
      <span className="restrict-width">
        <h1 className="text-white ">About Pawprints</h1>
        <h2 className="text-pms-427c underline decoration-orange decoration-10">
          Voicing the student body through petitions.
        </h2>
        <Image
          src="/banners/global-village.jpg"
          alt="Global Village"
          fill
          className="object-cover -z-50"
        />
      </span>
    </header>
  );
};

export default Banner;
