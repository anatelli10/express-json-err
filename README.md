
# express-json-error

An error handler for JSON APIs, meant to be used with [http-errors](https://github.com/jshttp/http-errors)-style errors.

## Example

```ts
import { errorHandler } from 'express-json-error';

const app = express()
	.get(...);

api.use(errorHandler);
// or with options configured..
app.use(errorHandler({ showStackTrace: true } | {} | undefined | never));

app.listen(...);
```

## API

_after your routes:_

```ts
app.use(errorHandler)
```

```ts
app.use(errorHandler(options | {} | undefined | never))
```

### Options

#### `showStackTrace` 
* Determines whether the response should contain the error stack trace.
* By default, stack trace is only included when the environment variable `NODE_ENV` is `"development"`.

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
