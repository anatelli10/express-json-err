⋔ from [expressjs/api-error-handler](https://github.com/expressjs/api-error-handler/blob/master/index.js)

The same great module by @jonathanong except with some modernizations:

- stateless logic
- deps upgraded
- supertest replaced with jest
- configuration option `showStackTrace`
- call with default options without parentheses like `app.use(jsonError)` vs `app.use(jsonError({ showStackTrace: true })`

# express-json-err

An error handler for JSON APIs, meant to be used with [http-errors](https://github.com/jshttp/http-errors)-style errors.

## Usage

```ts
import jsonError from 'express-json-err';

const app = express()
	.get(...);

app.use(jsonError);
// or with options configured..
app.use(jsonError({ showStackTrace: true } | {} | undefined));

app.listen(...);
```

## API

## Response Body

```json
{
	"status": 500,
	"message": "Internal Server Error",
	"code": 500,
	"name": "",
	"type": "",
	"stack": "",
};
```

### Options

#### `showStackTrace`

- Determines whether the response should contain the error stack trace.
- By default, stack trace is only included when the environment variable `NODE_ENV` is `"development"`.

### Errors

4xx errors are exposed to the client.
Properties exposed are:

- `message`
- `type`
- `name`
- `code`
- `status`

5xx errors are not exposed to the client.
Instead, they are given a generic `message` as well as the `type`.

### Publishing

```sh
npm run prepublish
npm publish
```
