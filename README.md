# Velmar-backend
Explore a complete online shopping experience with my fictional ecommerce. Discover products organized by categories and brands, manage your user account, and enjoy the ease of shopping with carts and orders. Sellers can edit and delete products, brands, and categories to maintain an up-to-date catalog. Secure authentication ensures the protection of personal data. Welcome to a realistic simulation of ecommerce, where efficiency and security come together to offer an exceptional user experience.

[Documentación en español](README-es.md)

## Table of contents
- [Clone the project](#clone-the-project)
- [Docker setup](#docker-setup)
- [Dependency installation](#dependency-installation)
- [Environment variables](#environment-variables)
- [Running Docker containers](#Running-Docker-containers)
- [Starting the project](#Starting-the-project)

***

## Clone the project
To get started, you'll need to clone the project repository into your desired directory. Use the following command:

```git clone https://github.com/diegonacimiento/velmar-backend.git```

***

## Docker setup
Velmar relies on Docker for containerization. If you haven't already, please [download and install Docker](https://www.docker.com/products/docker-desktop/). Once Docker is installed, ensure that it's running.

In the "docker.compose-yml" file, you'll find configurations for setting up a PostgreSQL container with user and password settings. Here's an example:

```javascript
´version: '3.8'
services:
  postgres:
    image: postgres:15
    env_file:
      - .env
    ports:
      - 5432:5432
    volumes:
      - ./postgres_data:/var/lib/postgresql/data

  pgadmin:
      image: dpage/pgadmin4
      env_file:
        - .env
      ports:
        - "5050:80"
      depends_on:
        - postgres´
```

***

## Dependency installation
To install the necessary dependencies for Velmar, run the following command:

``` npm install ```

***

## Environment variables
Velmar relies on some environment variables. You should create a ".env" file in the project's root directory and define these variables. Here's an example of a ".env" file with explanations:
```
POSTGRES_USER="diego" 
POSTGRES_PASSWORD="1234admin"
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DB="velmar"
DATABASE_URL="postgres://diego:1234admin@localhost:5432/velmar"
PGADMIN_DEFAULT_EMAIL=''
PGADMIN_DEFAULT_PASSWORD=''
API_KEY=""
API_SECRET=""
GG_EMAIL=""
GG_KEY=""
JWT_SECRET=""
JWT_SECRET_RECOVERY=""
FRONTEND_URL=""
FRONTEND_DOMAIN=""
TOKEN_NAME=""
NODE_ENV=""
PORT=""
```

- For DATABASE_URL, follow this format: postgres://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:POSTGRES_PORT/POSTGRES_NAME.

- You must configure your own chosen API_KEY and API_SECRET.

- JWT_SECRET and JWT_SECRET_RECOVERY should have unique keys. You can generate them [here](https://keygen.io/#fakeLink/).

#### Email sending
To configure email sending, ensure you have a Google account linked to your phone number and 2-Step Verification enabled in "Account Management" ⇒ "Security" ⇒ "Google Access." Then, go to "App Passwords" and add 'NodeApp.'

- GG_EMAIL: Use the email for which you generated the application password.

- GG_KEY: Use the generated password; do not share it with anyone.

***

# Running Docker containers
To start the Docker containers for PostgreSQL and PGAdmin, use the following commands:

```
docker-compose up -d postgres
docker-compose up -d pgadmin
```

***

# Migrations
You must generate and run a migration to create the tables. Run the following commands:

```npm run migrations:generate ./src/database/migrations/create-tables```

```npm run migrations:run```
***

# Starting the project
To start the project, use the following command:

```npm run start:dev```

This command will launch the API, and you can begin using it as intended.

***

This documentation should provide you with the necessary information to set up and use velmar-backend. If you have more questions or encounter issues, feel free to request assistance.
