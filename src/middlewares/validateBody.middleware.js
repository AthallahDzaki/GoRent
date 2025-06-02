const validateBody = (schema) => {
    return (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                errors: ["Request body cannot be empty"],
            });
        }
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                errors: error.details.map((e) => e.message),
            });
        }
        next();
    };
};

export default validateBody;
