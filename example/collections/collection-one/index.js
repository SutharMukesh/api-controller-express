/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
const path = require('path');

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
        pass: async (data) => {
            console.log('inside read of collection-one -- readpass');
            // res.status(200).json({ status: "success" })
            return { status: 'success' };
        },
        fail: async (data) => {
            console.log('inside read of collection-one -- readfail');
            // res.status(500).json({ status: "unsuccess" })
            return { status: 'unsuccess' };
        },
        customstatuscode: async (data) => {
            console.log('inside read of collection-one -- readcustomstatuscode');
            // res.status(204).json({ status: "success" })
            return { status: '204' };
        },
        rescustommethod: async (data) => {
            console.log('inside update of collection-one -- resdownload');
            // res.status(200).download("pathoffile","file.txt")
            return { resMethod: 'download', resParams: [path.join(__dirname, './index.js'), 'index.js'] };
        },
    };
    return {
        operations,
        schema,
    };
};
