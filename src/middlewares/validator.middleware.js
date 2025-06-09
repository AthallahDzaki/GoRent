const validateBody = (schema) => {
    return (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: "failed",
                message: "Validation error",
                errors: ["Request body cannot be empty"],
            });
        }
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                status: "failed",
                message: "Validation error",
                errors: error.details.map((e) => e.message),
            });
        }
        next();
    };
};

const validateQuery = (schema) => {
    return (req, res, next) => {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.status(400).json({
                status: "failed",
                message: "Validation error",
                errors: ["Query parameters cannot be empty"],
            });
        }
        const { error } = schema.validate(req.query, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                status: "failed",
                message: "Validation error",
                errors: error.details.map((e) => e.message),
            });
        }
        next();
    };
};

const validateParams = (schema) => {
    return (req, res, next) => {
        if (!req.params || Object.keys(req.params).length === 0) {
            return res.status(400).json({
                status: "failed",
                message: "Validation error",
                errors: ["Path parameters cannot be empty"],
            });
        }
        const { error } = schema.validate(req.params, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                status: "failed",
                message: "Validation error",
                errors: error.details.map((e) => e.message),
            });
        }
        next();
    };
};

export { validateBody, validateQuery, validateParams };
