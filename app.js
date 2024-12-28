const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const bidangRouter = require('./routes/bidangRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sasaranRoutes = require('./routes/sasaranRoutes');
const programRoutes = require('./routes/programRoutes');
const kegiatanRoutes = require('./routes/kegiatanRoutes');
const subkegiatanRoutes = require('./routes/subkegiatanRoutes');
const laporanRoutes = require('./routes/laporanRoutes')
const verifyToken = require('./middleware/verifyToken');
const verifyUserType = require('./middleware/verifyUserType');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session and flash configuration
app.use(
  session({
    secret: 'secretKey', // replace 'secretKey' with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// Routes
app.use('/', indexRouter);
app.use('/', dashboardRouter);
app.use('/user',verifyToken, usersRouter);
app.use('/bidang',verifyToken, verifyUserType(['super_admin']), bidangRouter);
app.use('/adminkabid',verifyToken, verifyUserType(['super_admin']), adminRoutes);
app.use('/sasaran',verifyToken, verifyUserType(['super_admin','admin_kabid']), sasaranRoutes);
app.use('/program',verifyToken, verifyUserType(['super_admin','admin_kabid']), programRoutes);
app.use('/kegiatan',verifyToken,verifyUserType(['super_admin','admin_kabid']), kegiatanRoutes);
app.use('/sub_kegiatan',verifyToken,verifyUserType(['super_admin','admin_kabid','user']), subkegiatanRoutes);
app.use('/laporan',verifyToken,verifyUserType(['super_admin','admin_kabid','user']), laporanRoutes);

// Middleware to make flash messages accessible in views
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
