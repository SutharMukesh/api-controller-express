/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Request, Response, NextFunction, Router, Application } from 'express';

import * as path from 'path';
import * as fs from 'fs';
import schemaValidator from './validator';

const apicontroller = (params: { collectionPath: string; baseurl: string; router: Router; app: Application }): null => {
    const { collectionPath, baseurl, router, app } = params;
    const collectionsDir: Array<string> = fs.readdirSync(collectionPath);
    if (collectionsDir.length === 0) throw new Error(`No collections defined under ${collectionPath}`);

    collectionsDir.map((collection) => {
        const { operations, schema } = require(path.join(collectionPath, collection))(app);
        if (Object.keys(operations).length === 0) throw new Error(`No operations defined for ${collection}`);

        Object.keys(operations).map((operation: string) => {
            return router.post(`${baseurl}/${collection}/${operation}`, async (req: Request, res: Response, next: NextFunction) => {
                try {
                    if (schema[operation]) {
                        schemaValidator({ schema: schema[operation], data: req.body });
                    } else {
                        console.warn(`No Schema found for operaion:${operation} in ${collection} collection`);
                    }
                    return await operations[operation](req.body);
                } catch (error) {
                    return next(error);
                }
            });
        });
        return null;
    });
    return null;
};
export default apicontroller;
