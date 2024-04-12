// adapted from https://github.com/expressjs/api-error-handler/blob/master/index.js
import { ErrorRequestHandler } from 'express';
import statuses from 'statuses';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const { code, name, message, type, stack } = err;

	const isDevelopment = 'development' === process.env.NODE_ENV;

	const status = (() => {
		const code = err.status || err.statusCode;

		return code >= 400 ? code : 500;
	})();

	// internal server errors
	if (status >= 500) {
		console.error(stack);

		return res.status(status).json({
			status,
			message: statuses(status),
			...(isDevelopment && { stack }),
		});
	}

	// client errors
	res.status(status).json({
		status,
		message,
		...(code && { code }),
		...(name && { name }),
		...(type && { type }),
		...(isDevelopment && { stack }),
	});
};
