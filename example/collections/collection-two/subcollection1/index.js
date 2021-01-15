/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
// JSON Schema handled by AJV -- https://json-schema.org/
const schema = {
    update: {
        type: 'object',
        properties: {
            user: { type: 'object' },
            dataobj: { type: 'object' },
        },
        required: ['dataobj', 'user'],
    },
};

module.exports = (app) => {
    // This is where you'll be writing all logic code.
    const operations = {
        read: async (req) => {
            console.log('inside read of collection-two -- read');
            return { status: 'success' };
        },

        update: async (req) => {
            console.log('inside update of collection-two -- update');
            return { status: 'success' };
        },
    };
    return {
        operations,
        schema,
    };
};
