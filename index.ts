// adapted from https://github.com/expressjs/api-error-handler/blob/master/index.js
import { ErrorRequestHandler as RequestHandler } from 'express';
import statuses from 'statuses';

export type ErrorHandlerOptions = Partial<{
	/**
	 * Determines whether the response should contain the error stack trace.
	 * By default, stack trace is only included when the environment variable `NODE_ENV` is `"development"`.
	 */
	showStackTrace: boolean;
}>;

/**
 * An error handler for JSON APIs.
 *
 * @example
 *
 * const app = express()
 * 	.get(...);
 *
 * app.use(errorHandler);
 * // or with options configured..
 * app.use(errorHandler({ showStackTrace: true } | {} | undefined | never));
 *
 * app.listen(...);
 */
export function errorHandler(...args: Parameters<RequestHandler>): ReturnType<RequestHandler>;
export function errorHandler(options?: ErrorHandlerOptions): RequestHandler;
export function errorHandler(
	_optionsOrErr?: ErrorHandlerOptions | Parameters<RequestHandler>[0],
	_req?: Parameters<RequestHandler>[1],
	res?: Parameters<RequestHandler>[2],
	_next?: Parameters<RequestHandler>[3],
): RequestHandler | ReturnType<RequestHandler> {
	var config: ErrorHandlerOptions = {
		showStackTrace: 'development' === process.env.NODE_ENV,
	};

	// We're receiving an express request handler input
	// Pass the args thru
	//
	// i.e. `app.use(errorHandler)`
	if (_req != null) {
		const err: Parameters<RequestHandler>[0] = _optionsOrErr;

		return handler(err, _req, res!, _next!);
	}

	const options: ErrorHandlerOptions = _optionsOrErr ?? {};

	// We're receiving configuration options
	//
	// i.e. `app.use(errorHandler({ showStackTrace: false }))`
	if (Object.keys(options).length) {
		Object.assign(config, options);
	}

	return handler;

	function handler(
		err: Parameters<RequestHandler>[0],
		_req: Parameters<RequestHandler>[1],
		res: Parameters<RequestHandler>[2],
		_next: Parameters<RequestHandler>[3],
	) {
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
				message: statuses(status),
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
	}
}
