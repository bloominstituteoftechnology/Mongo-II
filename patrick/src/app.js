// Do NOT modify this file; make your changes in server.js.
const { server } = require('./server.js');

server.listen(3000);

/*
So it's a bit harder with LS-Mongo-II, since the connection happens in `src/post.js`.
We do this because we can re-use the connection across both `src/app.js` and the tests.
To add that piece of functionality, what you could do is export out the return
value of `mongoose.connect()` (i.e. the returned promise) from `src/post.js` alongside
the actual `Post` model. Then you could access that promise inside `app.js` and
call `.then()` just like in the snippet you posted.
*/
