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
 * Controller which goes through all collections
 * and create routes based on operations
 * and validate data based on schemas
 *
 * @param {Object} params
 * @param {string} params.collectionPath - path where all your collections are stored
 * @param {string} params.baseUrl - Base url set to your collection
 * @param {Application} params.app - Express instance
 */
const apicontroller = (params: { collectionPath: string; baseUrl: string; app: Application }): null => {
    const { collectionPath, baseUrl, app } = params;
    const collectionsDir: Array<string> = fs.readdirSync(collectionPath);
    if (collectionsDir.length === 0) throw new Error(`No collections defined under ${collectionPath}`);

    collectionsDir.map((collection) => {
        const { operations, schema } = require(path.join(collectionPath, collection))(app);
        if (Object.keys(operations).length === 0) throw new Error(`No operations defined for ${collection}`);

        Object.keys(operations).map((operation: string) => {
            return app.post(`${baseUrl}/${collection}/${operation}`, async (req: Request, res: any, next: NextFunction) => {
                try {
                    if (schema[operation]) {
                        schemaValidator({ schema: schema[operation], data: req.body });
                    } else {
                        console.warn(`No Schema found for operaion:${operation} in ${collection} collection`);
                    }
                    const toResponseObj = await operations[operation](req.body);

                    // Set response status code
                    const statusCode: number = getStatusCode(toResponseObj);
                    res = res.status(statusCode);

                    // Get resMethod and parameters for the same
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
        });
        return null;
    });
    return null;
};
export = apicontroller;
