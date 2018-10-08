const express = require('express')
const app = express()
const port = 3000

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/register', indexRouter);

app.use('/login', authRouter);

app.use('/users', usersRouter);
app.use('/users/all', usersRouter);

app.use('/users/unauthorized', usersRouter);

// app.get('/', (req, res) => res.send('Hello World!'))
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
