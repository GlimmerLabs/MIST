# Setup

Use [setup.sh](../setup.sh) in the parent folder.

# Set up manually

There is an option to set up a connection to either the local PostgreSQL instance, or a Docker instance. Using Docker is highly encouraged, since the installation of Docker backend is simpler than Postgres (very anecdotal), and once you install it you only need to run one simple command.

## Docker

1. Download and Install Docker & docker-compose from the Docker website: https://docs.docker.com/get-docker/
2. Make sure the Docker service is up
3. Run `docker-compose up`

- To observe what's happening in the two containers, you can run `docker logs (container name) -f` (MIST-backend / MIST-db).

- If there's a change in the Database schema ([DB initialization scripts](./db/scripts)), you need to run a migration of the current data, or destroy the current table and make a new one. Since we're not using an ORM and writing migration is a pain, I recommend just running

```
docker rm -v MIST-backend MIST-db
```

and run `docker-compose up` again.

## Local PostgreSQL

1. Download & Install PostgreSQL from the PostgreSQL: https://www.postgresql.org/download/
2. Start up the PostgreSQL service (no idea how to do it, good luck)
3. Run `npm run server` (or if you have frontend already installed and want to start both Backend and Frontend, run `npm run dev`)
