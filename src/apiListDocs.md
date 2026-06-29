DevTinder APIs List

## Auth Router

POST /signup
POST /login
POST /logout

## Profile Router

GET /profile/view
PATCH /profile/edit
PATCH /profile/password

## Connection Request Router

POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

GET /connections
GET /requests/received
GET /feed - gets you the profiles of others users on platform

status : ignore, interested, accepted, rejected
