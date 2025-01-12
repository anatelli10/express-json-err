import statuses from "statuses";
export default function jsonError(errOrOptions, req, res, next) {
    return req && res && next
        ? // pass thru to the handler
            handler()(errOrOptions, req, res, next)
        : // configure the handler
            handler(errOrOptions);
}
const parseStatus = (err) => {
    const code = err.status || err.statusCode;
    if (code >= 400) {
        return code;
    }
    return 500;
};
function handler(options = {}) {
    const defaultConfig = {
        showStackTrace: "development" === process.env.NODE_ENV,
    };
    const config = { ...defaultConfig, ...options };
    return (err, _req, res, _next) => {
        const { code, name, message, type, stack } = err;
        const status = parseStatus(err);
        if (status >= 500) {
            // internal server errors
            console.error(stack);
            res.status(status).json({
                status,
                message: statuses[status],
                ...(config.showStackTrace && { stack }),
            });
        }
        else {
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
