export const Role = {
  ADMIN: "ADMIN",
  BUYER: "BUYER",
  BIDDER: "BIDDER",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const ProjectStatus = {
  DRAFT: "DRAFT",
  BIDDING: "BIDDING",
  CLOSED: "CLOSED",
  OPENED: "OPENED",
  EVALUATING: "EVALUATING",
  AWARDED: "AWARDED",
  ANNOUNCED: "ANNOUNCED",
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const BidStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  WITHDRAWN: "WITHDRAWN",
} as const;
export type BidStatus = (typeof BidStatus)[keyof typeof BidStatus];
