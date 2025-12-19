# Notes

- Local backend uses **Bun v1.3.4** as a global installation  
  - `npm i -g bun`

# Architecture

HTTP Layer

- routes — HTTP wiring only

- middlewares — authentication, validation, error handling

- controllers — request → response mapping

Application Layer

- services — business logic

Domain / Data Layer

- repositories — database access (DAO)

- db — PostgreSQL pool

Infrastructure

- redis

- logger

- config

# Layered by responsibility, not by tech

infra = outside world

data = persistence

services = business rules

http layer = routes/controllers/middlewares