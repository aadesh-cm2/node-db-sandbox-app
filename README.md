# Asset Manager - Sandbox APP

## Under the Hood (Tech Stack):

App is based of MERN Stack with the following verions for each:

Frontend – React.js v17.0.2​
Backend – Node.js v14.16.0​
REST API – Express.js v4.17.1​
Database – NoSQL MongoDB v4.10

## APIs Exposed:

POST /api/v1/assets/ 

To save Asset Data. Requires image file in req.file and asset data in req.body

Sample body model:
```
{
    assetName : {
        assetNameEN : String,
        assetNameFR : String,
    },
    make : String,
    model : String,
    desc : String,
    primary : Boolean,
    metaData : {
        makeCD : Number,
        modelCD : String,
        modelYear : String,
         modelTypeEN : String,
        modelTypeFR : String,
        modelSubTypeEN : String,
        modelSubTypeFR : String,
        color : String,
        expiryDate : String,
    }

}
```

POST /api/v1/assets/bulk

To save bulk Asset Data for a single vehicle type. Requires image files in req.files and asset data in req.body

Sample body model:

```
{
    assetName : {
        assetNameEN : String,
        assetNameFR : String,
    },
    make : String,
    model : String,
    desc : String,
    primary : Boolean,
    metaData : {
        makeCD : Number,
        modelCD : String,
        modelYear : String,
         modelTypeEN : String,
        modelTypeFR : String,
        modelSubTypeEN : String,
        modelSubTypeFR : String,
        color : String,
        expiryDate : String,
    }
}
```

POST /api/v1/assets/all

Used to filter, sort and/or fetch all assets based on filters and pagination data. Requires body data for config.

Sample body data: 
```
{
    query: {
        makeCD: 1,
    },
    config: { 
        page : 1,
        limit : 10,
    },
    sort : {
        modelYear : 'asc'
    }
}
```

PUT /api/v1/assets/vehicle/:id

Update a single vehicle asset with asset id provided in req.params. Requires updated asset data in body

Body data similar to POST request for saving an asset.

DELETE /api/v1/assets/vehicle/:id

Delete (Temporarily disable an asset by setting status to false) an asset by providing asset id in req.params

GET /api/v1/assets/vehicle/:id

Fetch a single asset with asset id in req.params

## Dependencies

### Backend
```
"express-basic-auth": "^1.2.0",
"firebase": "^8.4.1",
"firebase-admin": "^9.6.0",
"image-size": "^1.0.0",
"mongoose": "^5.12.5",
"multer": "^1.4.2",
"node-dotify": "^1.1.0",
```
### Frontend
```
"@material-ui/core": "^4.11.3",
"@material-ui/icons": "^4.11.2",
"@material-ui/lab": "^4.0.0-alpha.57",
"@material-ui/pickers": "^3.3.10",
"axios": "^0.21.1",
"node-vibrant": "^3.1.6",
"react-router-dom": "^5.2.0",
"react-toastify": "^7.0.4",
```