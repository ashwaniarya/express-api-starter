# STARTER API PACKAGE WITH AUTHENTICATION
This is starter API creation package
## INSALLATION

clone the repo

```
$ git clone https://github.com/ashwaniarya/express-api-starter.git 
```

Install the dependencies

```
$ cd express-api-starter
$ npm install
```
## BASIC FEATURES OF PACKAGE
* The package consists of API authenticatin using passport-jwt and jsonwebtokens
* User entry gateway.
* Uset activation link sent to email

## ENDPOINTS
### POST /user/signup
This endpoint is used for user signup
JSON DATA :

Field | Description | Meta
------|-------------|-----
username| Username of the user to register| required,unique
email| email to register | required,unique
password|password for this username|required

### POST /user/login
This endpoint is used for user login

JSON DATA :

Field | Description | Meta
------|-------------|-----
username| Username to login| required
password|password to login|required

If user logs for the first time an activation link is sent to his registered email.

Once the account will get activated, loging in again will generate a token. This token is now need to access the secret routes.

Authorization : Bearer token

### GET /user/activate/:id

This endpoint is used to activate user

### POST /user/genreset 
This endpoint is used to generate reset link which is sent to user's email.

JSON DATA :
Field | Description | Meta
------|-------------|-----
email| email for which reset link will be genereated| required

## IMPORTANT
Create a file with name .env at the root of the package. You can write the environment variable used in this package

```
SECRET_KEY = <your secrect key>
MONGODB_URI = <mongodb uri>
SMTP = <domain of smtp server>
EMAIL_USERNAME = <smtp username>
EMAIL_PASSWORD = <smtp password>
```
Also change URL in **globals.js** pointing to the server domain.
 URI is the domain sent in email activation link.
```
const URL = 'http://localhost:3000'
```
## UPCOMING

Email via Google OAUTH
## CONCLUSION

Please support if you link this package.