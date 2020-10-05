# Api Controller
A controller library which creates `collection` based routes and handles JSON Schema based data validations.

## Collection Structure

```ascii
.
├── collections-folder/
│   ├── collection-one
│   │   └── index.js
│   ├── collection-two
│   │   └── index.js
│   └── collection-three
│       └── index.js
└── server.js
```

## Usage
[![NPM](https://nodei.co/npm/api-controller-express.png)](https://nodei.co/npm/api-controller-express/)


### Library in action
- The file where you'll use the api-controller
    ```js
    /**
   * Controller which goes through all collections
   * and create POST routes based on operations
   * and validate data based on schemas
   *
   * @param {Object} params
   * @param {string} params.collectionPath - path where all your collections are stored
   * @param {string} params.baseUrl - Base url set to your collection
   * @param {Application} params.app - Express instance
   */
    
    controller({ collectionPath: "path-to-your-collections", baseUrl: "/sample-base-url", app });

    ```
- A Collection **file format** - `collection-name-one/index.js` 
  - ✅ CRUD Operation for a collection.
  - ✅ Operation and Scope level schema validation.
  - 🌟 Re-use operations without using rest call.
    ```js
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
    ```

### Routes
- The `controller` then creates following routes.
  ```sh
    POST http://localhost:port/<base-url-you-passed-in-controller>/<foldername-under-collectionPath>/<operation>/<scope>
  ```
  > Here **scope** is Optional
  - So for above code example the controller creates following routes
    - POST `http://127.0.0.1:3000/sample-base-url/collection-name-one/read/:scope`
    - POST `http://127.0.0.1:3000/sample-base-url/collection-name-one/update/:scope`
    - POST `http://127.0.0.1:3000/sample-base-url/collection-name-one/create/:scope`
    - POST `http://127.0.0.1:3000/sample-base-url/collection-name-one/delete/:scope`