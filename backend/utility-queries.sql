-- select * from users;
-- select * from categories;

-- select * from expenses;

-- SELECT usename FROM pg_catalog.pg_user WHERE usesuper = true;

-- CREATE ROLE spendwise_app LOGIN PASSWORD 'strongpassword';
-- GRANT CONNECT ON DATABASE "SpendWise-Local" TO spendwise_app;
-- GRANT USAGE ON SCHEMA public TO spendwise_app;

-- GRANT SELECT, INSERT, UPDATE, DELETE
-- ON ALL TABLES IN SCHEMA public
-- TO spendwise_app;

-- ALTER DEFAULT PRIVILEGES
-- IN SCHEMA public
-- GRANT SELECT, INSERT, UPDATE, DELETE
-- ON TABLES TO spendwise_app;

select * from budgets;

-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO spendwise_app;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
-- GRANT USAGE, SELECT ON SEQUENCES TO spendwise_app;


-- SELECT rolname, rolsuper, rolbypassrls
-- FROM pg_roles
-- WHERE rolname = 'spendwise_app';
-- ALTER ROLE spendwise_app NOSUPERUSER NOBYPASSRLS;
-- ALTER ROLE spendwise_app SET row_security = on;


-- GRANT USAGE, SELECT ON SEQUENCE budgets_id_seq TO spendwise_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO spendwise_app;


-- select * from password_resets;

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




-- CREATE POLICY budgets_select
-- ON budgets
-- FOR SELECT
-- USING (user_id = current_setting('app.user_id')::int);

-- CREATE POLICY budgets_insert
-- ON budgets
-- FOR INSERT
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- CREATE POLICY budgets_update
-- ON budgets
-- FOR UPDATE
-- USING (user_id = current_setting('app.user_id')::int)
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- CREATE POLICY budgets_delete
-- ON budgets
-- FOR DELETE
-- USING (user_id = current_setting('app.user_id')::int);




-- CREATE POLICY expenses_select
-- ON expenses
-- FOR SELECT
-- USING (user_id = current_setting('app.user_id')::int);

-- CREATE POLICY expenses_insert
-- ON expenses
-- FOR INSERT
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- CREATE POLICY expenses_update
-- ON expenses
-- FOR UPDATE
-- USING (user_id = current_setting('app.user_id')::int)
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- CREATE POLICY expenses_delete
-- ON expenses
-- FOR DELETE
-- USING (user_id = current_setting('app.user_id')::int);




-- CREATE POLICY categories_select
-- ON categories
-- FOR SELECT
-- USING (user_id = current_setting('app.user_id')::int);

-- CREATE POLICY categories_insert
-- ON categories
-- FOR INSERT
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- CREATE POLICY categories_update
-- ON categories
-- FOR UPDATE
-- USING (user_id = current_setting('app.user_id')::int)
-- WITH CHECK (user_id = current_setting('app.user_id')::int);

-- CREATE POLICY categories_delete
-- ON categories
-- FOR DELETE
-- USING (user_id = current_setting('app.user_id')::int);