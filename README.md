# Chat

React app with Apollo Server backend.

## Client Technologies

-   React
-   Apollo Client
-   React Bootstrap
-   Jest

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

-   Decided to not use `classnames` dependency but vanilla JS instead

-   Decided to extend jwt token with not only with username, but with object that contains id and username

## Sequelize

-   `sequelize --help` to list all sequelize CLI commands (run in dir where sequelize is locally installed)
-   `sequelize init`
-   `sequelize seed:generate --name create-users`: like a migration, but for data
-   `sequelize db:seed:all`: run all seeds
-   `sequelize db:seed --seed 20210429191405-create-messages.js`: run specific seed

### Setting up a migration and migrate

-   `sequelize model:generate --name Message --attributes content:string,uuid:uuid,from:string,to:string`
-   `sequelize db:migrate`

### Remove Tables

`sequelize db:migrate:undo:all`

## TODO

-   Create separate AddMessage component out of Messages component
-   Issue: `Warning: findDOMNode is deprecated in StrictMode`
-   Build copy from scratch to better understand everything
-   Use TypeScript
-   Use MongoDB instead of Sequelize
-   Deploy to Heroku / Amazon / Vercel
