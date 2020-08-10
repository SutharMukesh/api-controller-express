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
  - ✅ Crud services for a collection.
  - ✅ Operation level schemas.
  - 🌟 Re-use operations without using rest call.
  - ✅ Supports all express `res` methods in operations.
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
            // CRUD Operations
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

- More control over `res` object of expressjs 
    > res methods - [link](https://expressjs.com/en/5x/api.html#res) 
  ```js
    const operations = {
        read: async (data) => {
            // Default
            // res.status(200).json({ status: "success" })
            return { status: "success" };   
       
            // Auto 500 for Unsuccess 
            // res.status(500).json({ status: "unsuccess" })
            return { status: "unsuccess" };

            // Custom methods of res
            // res.status(200).download("pathoffile","file.txt")
            return { resMethod:"download",resParams:["pathoffile","file.txt"]}

            // Custom status code
            // res.status(205).json({ status: "unsuccess" })
            return { status: 205 };
        }
    };
  ```
> ***Note:***  
> For more usecases - refer `/example` folder 

### Routes
- The `controller` then creates routes for you in this format.
  ```sh
    POST http://localhost:port/<base-url-you-passed-in-controller>/<foldername-under-collectionPath>/<operation>
  ```
  - So for above code example the controller creates following routes
    - POST `http://127.0.0.1:3000/sample-base-url/collection-name-one/read`
    - POST `http://127.0.0.1:3000/sample-base-url/collection-name-one/update`