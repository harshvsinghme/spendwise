/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.alterColumn("categories", "name", {
    type: "varchar(30)",
    notNull: true,
  });
  pgm.alterColumn("categories", "icon", {
    type: "varchar(20)",
    notNull: true,
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.alterColumn("categories", "name", {
    type: "varchar(50)",
    notNull: true,
  });
  pgm.alterColumn("categories", "icon", {
    type: "varchar(1)",
    notNull: true,
  });
};
