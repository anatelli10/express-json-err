import { ErrorRequestHandler as RequestHandler } from "express";
/**
 * An error handler for JSON APIs.
 *
 * This overload function enables calling without parentheses if using default options.
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
export type ErrorHandlerOptions = Partial<{
    /**
     * Determines whether the response should contain the error stack trace.
     * By default, stack trace is only included when the environment variable `NODE_ENV` is `"development"`.
     */
    showStackTrace: boolean;
}>;
