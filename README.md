# Freshworks Backend Assignment

Created with NodeJS. 

## Assignment Description

Within the repository, the module folder contains the packaged code. The module folder is the source code of the assignment. **app.js** is the client consuming the developed module. 

## Installation & Project Setup

Prerequisites: 
Node Version - 8+

1. Clone the repository
2. Navigate to the cloned directory, and type **npm install**
3. Run **node app.js**

Now the app will run at **http://localhost:1234**

Use PostMan to test the API :

```REST
# To read the data by providing key
GET http://localhost:1234/read/${key}
# Request: http://localhost:1234/read/customer
# Response: OK

# To write the data by providing key
POST http://localhost:1234/write
# Request: http://localhost:1234/write
# Request Body : 
{
	"key":"customer",
	"value": {
        "name" : "xxx",
        "address" : "yyy"
	},
	"ttl" : 5
}
# Response: OK

# To delete the data by providing key
DELETE http://localhost:1234/delete/${key}
# Request: http://localhost:1234/delete/customer
# Response: OK
