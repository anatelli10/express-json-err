// adapted from https://github.com/expressjs/api-error-handler/blob/master/index.js
import { ErrorRequestHandler as RequestHandler } from 'express';
import statuses from 'statuses';

/**
 * An error handler for JSON APIs.
 *
 * @example
 *
 * import jsonError from 'express-json-error';
 *
 * const app = express()
 * 	.get(...);
 *
 * app.use(jsonError);
 * // or with options configured..
 * app.use(jsonError({ showStackTrace: true } | {} | undefined | never));
 *
 * app.listen(...);
 */
export default function jsonError(options: ErrorHandlerOptions | undefined): RequestHandler;
export default function jsonError(...args: Parameters<RequestHandler>): ReturnType<RequestHandler>;
export default function jsonError(
	errOrOptions: ErrorHandlerOptions | undefined | Parameters<RequestHandler>[0],
	req?: Parameters<RequestHandler>[1],
	res?: Parameters<RequestHandler>[2],
	next?: Parameters<RequestHandler>[3],
) {
	return [req, res, next].every((arg) => arg === undefined)
		? // configure the handler
		  handler(errOrOptions as ErrorHandlerOptions | undefined)
		: // pass thru to the handler
		  handler()(errOrOptions as Parameters<RequestHandler>[0], req!, res!, next!);
}

export type ErrorHandlerOptions = Partial<{
	/**
	 * Determines whether the response should contain the error stack trace.
	 * By default, stack trace is only included when the environment variable `NODE_ENV` is `"development"`.
	 */
	showStackTrace: boolean;
}>;

function handler(options: ErrorHandlerOptions = {}): RequestHandler {
	const defaultConfig: ErrorHandlerOptions = {
		showStackTrace: 'development' === process.env.NODE_ENV,
	};

	const config = { ...defaultConfig, ...options };

	return (err, _req, res, _next) => {
		const { code, name, message, type, stack } = err;

		const status = (() => {
			const code = err.status || err.statusCode;

			return code >= 400 ? code : 500;
		})();

		if (status >= 500) {
			// internal server errors
			console.error(stack);

			res.status(status).json({
				status,
				message: statuses[status],
				...(config.showStackTrace && { stack }),
			});
		} else {
			// client errors
			res.status(status).json({
				status,
				message,
				...(code && { code }),
				...(name && { name }),
				...(type && { type }),
				...(config.showStackTrace && { stack }),
			});
		}
	};
}
