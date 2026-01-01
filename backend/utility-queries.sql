-- select * from users;
-- select * from categories;
-- CREATE POLICY categories_user_isolation
-- ON categories
-- USING (user_id = current_setting('app.user_id')::int)
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- select * from expenses;
-- CREATE POLICY expenses_user_isolation
-- ON expenses
-- USING (user_id = current_setting('app.user_id')::int)
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- select * from budgets;
-- CREATE POLICY budgets_user_isolation
-- ON budgets
-- USING (user_id = current_setting('app.user_id')::int)
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- select * from password_resets;
-- CREATE POLICY password_resets_user_isolation
-- ON password_resets
-- USING (user_id = current_setting('app.user_id')::int)
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- select * from pgmigrations;

-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- ALTER TABLE password_resets DISABLE ROW LEVEL SECURITY;

-- ALTER TABLE categories FORCE ROW LEVEL SECURITY;
-- ALTER TABLE expenses FORCE ROW LEVEL SECURITY;
-- ALTER TABLE budgets FORCE ROW LEVEL SECURITY;

-- SELECT
--     n.nspname AS schema_name,
--     c.relname AS table_name,
--     c.relforcerowsecurity AS rls_forced
-- FROM
--     pg_catalog.pg_class c
-- LEFT JOIN
--     pg_catalog.pg_namespace n ON n.oid = c.relnamespace
-- WHERE
--     c.relrowsecurity = true
--     AND c.relkind = 'r' -- 'r' indicates a normal table
-- ORDER BY
--     schema_name,
--     table_name;

-- SELECT * FROM pg_policies;



