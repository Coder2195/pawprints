export const SIGNATURE_THRESHOLD = 200;
export const TAGS = {
  ACADEMICS: "Academics",
  DINING: "Dining",
  CAMPUS_LIFE: "Campus Life",
  EVENTS: "Events",
  FACILITIES: "Facilities",
  HOUSING: "Housing",
  PUBLIC_SAFETY: "Public Safety",
  SUSTAINABILITY: "Sustainability",
  TECHNOLOGY: "Technology",
  TRANSPORATION: "Parking & Transportation",
} as const;

export const PAWPRINT_STATUS = {
  ACTIVE: "Active",
  THRESHOLD_MET: "Threshold Met",
  COMPLETED: "Completed",
  RESPONDED: "Responded",
  EXPIRED: "Expired",
} as const;

export type PawprintStatus = keyof typeof PAWPRINT_STATUS;

export const FETCH_SIZE = 12;