export const Environments = {
  PRODUCTION: "production",
  STAGING: "staging",
  TESTING: "testing",
  DEVELOPMENT: "development",
  LOCAL: "local",
};
export type Environment = (typeof Environments)[keyof typeof Environments];

export const isLocal = [Environments.LOCAL].includes(process.env["NODE_ENV"]!);

export const isDev = [Environments.DEVELOPMENT].includes(process.env["NODE_ENV"]!);
export const isLocalOrDev = [Environments.LOCAL, Environments.DEVELOPMENT].includes(
  process.env["NODE_ENV"]!
);

export const isProd = [Environments.PRODUCTION].includes(process.env["NODE_ENV"]!);
