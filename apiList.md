# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- Post /logout


## profileRouter
- GET /profile/view
- PATACH /profile/edit
- PATCH /profile/password


## connectionRequestRouter
- POST /request/send/interested/:userID
- POST /request/send/ingnored/:userID
- POST /request/review/accepeted/:requestId
- POST /request/review/rejected/:requestId


## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/Feed -> Gets You the profiles of each other users on platform

Status: ignore, interested, accepeted, rejected

