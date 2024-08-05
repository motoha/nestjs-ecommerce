# NestJS ByDoing Application

> NestJS application with user and property CRUD operations

> Authentication using NestJS Guard & JWT

> Authorization using Interceptor and metadata

> Validation using class-validator & class-transformer packages

> Prisma for database handling

> Globally error filtering

## Prisma

After installing prisma package, run:

```bash
$ npx prisma init
```

Update the .env file with proper database url.

After adding models in schema.prisma file, update the models on database:

```bash
$ npx prisma db push
```

For visual database editor in web, run:

```bash
$ npx prisma studio
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).



## License

Nest is [MIT licensed](LICENSE).
