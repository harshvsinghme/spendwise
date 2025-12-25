# Notes
docker compose down -v
docker compose build --no-cache
docker compose up

docker exec -it spendwise-backend-1 sh

# Architecture

HTTP Layer

- routes — HTTP wiring only

- middlewares — authentication, validation, error handling

- controllers — request → response mapping

Application Layer

- services — business logic

Domain / Data Layer

- repositories — database access (DAO)

Infrastructure

- redis

- logger

- db — PostgreSQL pool

# Layered by responsibility, not by tech

infra = outside world

data = persistence

services = business rules

http layer = routes/controllers/middlewares