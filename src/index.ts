/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Request, NextFunction, Application } from 'express';

import * as path from 'path';
import * as fs from 'fs';
import { schemaValidator, getStatusCode } from './validator';

/**
 * Create express route
 *
 * @param {Object} params
 * @param {string} params.route - url route path
 * @param {Function} params.operation - Function to run for this route
 * @param {object} params.schema - ajv schema object for body data validation
 * @param {Application} params.app - Express instance
 * @returns {Application} app object.
 */
const createRoute = (params: { route: string; operation: Function; schema: { [key: string]: any }; app: Application }): Application => {
    const { route, operation, schema, app } = params;
    return app.post(route, async (req: Request, res: any, next: NextFunction) => {
        try {
            // Validate body data with its schema
            const { scope } = req.params;
            if (schema[`${operation.name}_${scope}`]) {
                schemaValidator({ schema: schema[`${operation.name}_${scope}`], data: req.body });
            } else if (schema[operation.name]) {
                schemaValidator({ schema: schema[operation.name], data: req.body });
            } else {
                console.warn(`No Schema found for route: ${route}`);
            }

            // Run the particular operation for this route.
            const toResponseObj = await operation(req);

            // Set response status code
            const statusCode: number = getStatusCode(toResponseObj);
            res = res.status(statusCode);

            // Get resMethod and parameters for other express method or else use res.json.
            if (!toResponseObj.resMethod) {
                return res.json(toResponseObj);
            }
            const { resParams, resMethod }: { resParams: Array<any> | string | undefined; resMethod: string } = toResponseObj;
            const parameters = Array.isArray(resParams) ? resParams : [resParams];

            return res[resMethod](...parameters);
        } catch (error) {
            return next(error);
        }
    });
};

/**
 * Controller which goes through all collections
 * and create routes based on operations
 * and validate body data based on schemas
 *
 * @param {Object} params
 * @param {string} params.collectionPath - path where all your collections are stored
 * @param {string} params.baseUrl - Base url set to your collection
 * @param {Application} params.app - Express instance
 */
const apicontroller = (params: { collectionPath: string; baseUrl: string; app: Application }): null => {
    const { collectionPath, baseUrl, app } = params;
    const collectionsDir: Array<string> = fs.readdirSync(collectionPath);

    // Check if collection directory is not empty.
    if (collectionsDir.length === 0) throw new Error(`No collections defined under ${collectionPath}`);

    collectionsDir.map((collection: string) => {
        // Get Operation and schema from a collection
        const { operations, schema } = require(path.join(collectionPath, collection))(app);

        // Check operations object should not be empty
        if (Object.keys(operations).length === 0) throw new Error(`No operations defined for ${collection}`);

        // Create route for each operation.
        Object.keys(operations).map((operation: string) => {
            return createRoute({
                route: `${baseUrl}/${collection}/${operation}/:scope?`,
                operation: operations[operation],
                schema,
                app,
            });
        });
        return null;
    });
    return null;
};
export = apicontroller;
