import error, { HttpError } from "http-errors";
import request, { CallbackHandler } from "supertest";
import express, { ErrorRequestHandler } from "express";
import assert from "assert";

import jsonError from "./jsonError";

const handlerTest = (httpError: HttpError, errorHandler: ErrorRequestHandler, callback: CallbackHandler) => {
	const app = express();

	app.use((_req, _res, next) => next(httpError));

	app.use(errorHandler);

	request(app.listen()).get("/").expect(httpError.status).end(callback);
};

describe("API Error Handler", () => {
	it("5xx", (done) => {
		handlerTest(
			error(501, "lol"),

			jsonError,

			(err, { body }) => {
				console.info(`^^^ *!*THE ABOVE "console.error NotImplementedError: lol" __IS INTENDED__`);

				assert.ifError(err);

				assert.equal(body.message, "Not Implemented");
				assert.equal(body.status, 501);

				done();
			},
		);
	});

	it("4xx", (done) => {
		handlerTest(
			error(401, "lol", {
				type: "a",
				code: "b",
			}),

			jsonError,

			(err, { body }) => {
				assert.ifError(err);

				assert.equal(body.message, "lol");
				assert.equal(body.status, 401);
				assert.equal(body.type, "a");
				assert.equal(body.code, "b");

				done();
			},
		);
	});

	it("can be called many ways", () => {
		const app = express();

		app.use(jsonError);
		app.use(jsonError(undefined));
		app.use(jsonError({}));
		app.use(jsonError({ showStackTrace: true }));
	});

	it("supports `showStackTrace: true` option", (done) => {
		handlerTest(
			error(401, "lol", {
				stack: "lorem ipsum dolor sit amet",
			}),

			jsonError({ showStackTrace: true }),

			(_err, { body }) => {
				assert.equal(body.stack, "lorem ipsum dolor sit amet");

				done();
			},
		);
	});

	it("supports `showStackTrace: false` option", (done) => {
		handlerTest(
			error(401, "lol", {
				stack: "lorem ipsum dolor sit amet",
			}),

			jsonError({ showStackTrace: false }),

			(_err, { body }) => {
				assert.equal(body.stack, undefined);

				done();
			},
		);
	});
});
