/* eslint-disable @typescript-eslint/ban-types */
import Ajv from 'ajv';

const ajv = new Ajv();
const schemaValidator = (params: { schema: object; data: object }): boolean => {
    const { schema, data } = params;
    const valid = ajv.validate(schema, data);
    if (!valid) {
        throw new Error(ajv.errorsText());
    }
    return true;
};

/**
 * @param {Object} toResponseObj - Operation return object
 */
const getStatusCode = (toResponseObj: { status?: number | string }): number => {
    let status = 200;
    if (Number(toResponseObj.status)) {
        status = Number(toResponseObj.status);
    } else if (typeof toResponseObj.status === 'string') {
        if (toResponseObj.status.toLowerCase() === 'unsuccess') {
            status = 500;
        }
    }
    return status;
};

export { schemaValidator, getStatusCode };
