/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
const path = require('path');

// JSON Schema handled by AJV -- https://json-schema.org/
const schema = {
    read: {
        type: 'object',
        properties: {
            user: { type: 'object' },
        },
        required: ['user'],
    },
    // Schema for scope support
    read_download: {
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
            console.log('inside read of collection-one');

            // Get scope from the route
            const { scope } = req.params;

            if (scope === 'xyz') {
                // Logic to read a data based on scope xyz
                return { status: 'success', data: 'xyz_data' };
            }

            if (scope === 'download') {
                // logic to read data and send data as a file.
                // res.status(200).download("pathoffile","file.txt")
                return { resMethod: 'download', resParams: [path.join(__dirname, './index.js'), 'index.js'] };
            }

            // logic to read data without scope.
            // res.status(200).json({ status: 'success', data: 'mydata' })
            return { status: 'success', data: 'mydata' };
        },
        create: async (req) => {
            console.log('inside create of collection-one');

            const data = req.body;
            // Logic to write a data into db.
            // res.status(500).json({ status: "unsuccess" })
            return { status: '201' };
        },
        update: async (req) => {
            console.log('inside update of collection-one');

            const data = req.body;
            // update data logic
            // res.status(200).json({ status: "success", message: 'data updated with custom status code'  })
            return { status: 'success', message: 'data updated with custom status code' };
        },
        delete: async (req) => {
            console.log('inside delete of collection-one');

            // delete a data form db
            // res.status(200).json({ status: 'success' })
            return { status: 'success' };
        },
    };
    return {
        operations,
        schema,
    };
};
