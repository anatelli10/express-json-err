import statuses from 'statuses';

// adapted from https://github.com/expressjs/api-error-handler/blob/master/index.js
export const errorHandler = (err: any, _req: any, res: any, _next: any) => {
	const { code, name, message, type, stack } = err;

	const isDevelopment = process.env.NODE_ENV === 'development';

	const status = (() => {
		const code = err.status || err.statusCode;

		return code >= 400 ? code : 500;
	})();

	// internal server errors
	if (status >= 500) {
		console.error(stack);

		return res.statusCode(status).json({
			status,
			message: statuses(status),
			...(isDevelopment && { stack }),
		});
	}

	// client errors
	res.statusCode(status).json({
		status,
		message,
		...(code && { code }),
		...(name && { name }),
		...(type && { type }),
		...(isDevelopment && { stack }),
	});
};
