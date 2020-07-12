# Api Controller
A controller library which creates `collections` based routes and handles JSON Schema based data validations.

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
└── service.test.js
```

## Usage
[![NPM](https://nodei.co/npm/api-controller-express.png)](https://nodei.co/npm/api-controller-express/)


### Library in action
- The file where you'll use the api-controller
    ```js
    const express = require("express");
    const controller = require("api-controller-express");
    const bodyParser = require('body-parser')

    const app = express();

    // for parsing application/json
    app.use(bodyParser.json()) 

    // Creates POST routes based on modules under collectionPath.
    controller({ collectionPath: "path-to-your-collections", baseUrl: "/sample-base-url", app });

    // Error Handling Middleware
    app.use((err, req, res, next) => {
        console.log(err.message);
        res.status(500).send({ status: "unsucess", error: err.message });
    });

    app.listen(3000, () => console.log("server running"));
    ```
- A Collection file format - `collection-name-one/index.js` 
    ```js
    // JSON Schema handled by AJV -- https://json-schema.org/
    const schema = {
        update: {
            type: "object",
            properties: {
                user: { type: "object" },
                dataobj: { type: "object" },
            },
            required: ["dataobj", "user"],
        },
    };

    module.exports = (app) => {
        // This is where you'll be writing all logic code.
        const operations = {
            read: async (data) => {
                console.log("inside read of route 1");
                return { status: "success" };
            },

            update: async (data) => {
                console.log("inside update of route 1");
                return { status: "success" };
            },
        };
        return {
            operations,
            schema
        };
    };
    ```
- The `controller` then creates routes for you in this format.
  ```sh
    POST http://localhost:port/<base-url-you-passed-in-controller>/<foldername-under-collectionPath>/<operation>
  ```
  - So for above code example the controller creates following routes
    - POST `http://127.0.0.1:3000/sample-base-url/collection-name-one/read`
    - POST `http://127.0.0.1:3000/sample-base-url/collection-name-one/update`