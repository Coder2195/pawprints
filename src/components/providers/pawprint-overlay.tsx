"use client";
import { GetPawprintResult } from "@/lib/rpc";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import OverlayPawprint from "../pawprints/overlay";
import { AnimatePresence } from "motion/react";

type Context = {
  setPawprint: (pawprint: GetPawprintResult | null) => void;
  pawprint: GetPawprintResult | null;
};

const pawprintOverlayContext = createContext<Context>(
  null as unknown as Context
);

export function usePawprintOverlay() {
  return useContext(pawprintOverlayContext);
}

const PawprintOverlayProvider: FC<PropsWithChildren> = ({ children }) => {
  const [pawprint, setPawprint] = useState<GetPawprintResult | null>(null);

  return (
    <pawprintOverlayContext.Provider value={{ pawprint, setPawprint }}>
      {children}
      <AnimatePresence>
        {pawprint && <OverlayPawprint pawprint={pawprint} />}
      </AnimatePresence>
    </pawprintOverlayContext.Provider>
  );
};

export default PawprintOverlayProvider;
