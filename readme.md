# Api Controller
A controller library which creates `collections` based routes.

## Collection Structure

```ascii
.
├── collections
│   ├── collection-name-one
│   │   └── index.js
│   ├── collection-name-two
│   │   └── index.js
│   └── collection-name-three
│       └── index.js
└── test.js
```

## Usage
[![NPM](https://nodei.co/npm/api-controller-express.png)](https://nodei.co/npm/api-controller-express/)


### Library in action
- The file where you'll use the controller
    ```js
    const app = require("express")();
    const controller = require("api-controller");
    const router = app.Router;

    controller({ collectionPath: "path-to-base-url/collections", baseUrl: "base-url", app });

    app.listen(3000, () => console.log("server running"));
    ```
- `collection-name/index.js` file format
    ```js
    const schema = {
        read: {
            type: 'object',
            properties: {
                user: { type: 'object' },
                dataobj: {type: 'object'}
            },
            required: ['dataobj', 'user']
        }
        update: {
            type: 'object',
            properties: {
                user: { type: 'object' },
                dataobj: {type: 'object'}
            },
            required: ['dataobj', 'user']
        }
    };

    module.exports = app => {
        const dbutil = utils(app);

        const operations = {
            read: async data => {
                
                return result;
            },

            update: async data => {
                
                return result;
            }
        };
        return {
            operations,
            schema
        };
    };

    ```
