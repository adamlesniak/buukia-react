export enum ViewType {
  DAY = "day",
  WEEK = "week",
}

export const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const MAX_ASSISTANTS = 7;

export const MAX_PAGINATION = 100;

export enum AssistantDetailNavigation {
  DETAIL = "detail",
  SETTINGS = "settings",
  STATISTICS = "statistics",
}

export const SETTINGS = {
  country: "ES",
  currency: "EUR",
  platformFee: 2,
  payouts: {
    paymentProvider: "stripe",
    sourceType: "bank_account",
  },
};
