export const Environments = {
  PRODUCTION: "production",
  STAGING: "staging",
  TESTING: "testing",
  DEVELOPMENT: "development",
  LOCAL: "local",
};
export type Environment = (typeof Environments)[keyof typeof Environments];
