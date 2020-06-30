import { validationResult, Schema, checkSchema } from 'express-validator'
import { Request, Response, NextFunction } from 'express-serve-static-core'

export default function(schema: Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const validations = checkSchema(schema)
        await Promise.all(validations.map(validation => validation.run(req)))

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next()
        }

        res.status(422).json({ errors: errors.array() })
    }
}