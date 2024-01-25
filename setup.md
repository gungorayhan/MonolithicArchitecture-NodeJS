# setup
<p>
npm init -y
tsc --init
npm install express body-parser cors ts-node-dev typescript
npm i  @types/express @types/cors nodemon
npm i mongoose @types/mongoose
npm i bcrypt @types/bcrypt
npm i jsonwebtoken @types/jsonwebtoken
npm i multer @types/multer
npm i class-validator class-transformer
npm i twilio
</p>

# folder
<p>
index.ts
config
images
utility
middleware
dto
route
controller
services
models
</p>

## in tsc-config -> for class-validator
"strictPropertyInitialization": false, <br/>
"experimentalDecorators": true,


##
 // "engines":{
  //   "node":"14.15.2",
  //   "npm" :"6.14.9"
  // },