DevTinder APIs List

## Auth Router

POST /signup - done
POST /login - done
POST /logout - done

## Profile Router

GET /profile/view - done
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
