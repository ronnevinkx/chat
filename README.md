# Chat

React app with Apollo Server backend.

## Client Technologies

-   React
-   Apollo Client
-   React Bootstrap

## Backend Technologies

-   Node.js
-   Apollo Server
-   GraphQL
-   Sequelize
-   Sequelize CLI
-   MySQL
-   JSON Web Token
-   Bcrypt

## Scripts

| Description                  | Command          | Value                                                |
| ---------------------------- | ---------------- | ---------------------------------------------------- |
| Start server                 | `npm run start`  | `node server.js`                                     |
| Start server with Nodemon    | `npm run server` | `nodemon server.js`                                  |
| Start client                 | `npm run client` | `npm start --prefix client`                          |
| Start both client and server | `npm run dev`    | `concurrently \"npm run server\" \"npm run client\"` |

## Notes

-   Based on [this](https://www.youtube.com/playlist?list=PLMhAeHCz8S3_VYiYxpcXtMz96vePOuOX3) Classed tutorial.

-   VSCode extension for GraphQL syntax highlighting: `GraphQL for VSCode`

## Sequelize

-   `sequelize --help` to list all sequelize CLI commands (run in dir where sequelize is locally installed)
-   `sequelize init`
-   `sequelize seed:generate --name create-users`: like a migration, but for data
-   `sequelize db:seed:all`: run all seeds

### Setting up a migration and migrate

-   `sequelize model:generate --name Message --attributes content:string,uuid:uuid,from:string,to:string`
-   `sequelize db:migrate`

### Remove Tables

`sequelize db:migrate:undo:all`
