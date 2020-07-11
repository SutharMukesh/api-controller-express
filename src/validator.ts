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
export default schemaValidator;
