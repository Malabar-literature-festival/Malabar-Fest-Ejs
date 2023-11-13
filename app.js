var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const cors = require("cors");
var app = express();

const connectDB = require("./config/db");

const allowedOrigins = [
  null,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8010",
  "https://malabarliteraturefestival.com",
  "https://yellow-desert-0e7088300.3.azurestaticapps.net",
  "https://secure.ccavenue.com",
  "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
  "https://www.malabarliteraturefestival.com",
  "https://secure.ccavenue.com/bnk/servlet/processNbkReq?gtwID=AVN&requestType=PAYMENT",
];

//cors policy
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("origin", origin);
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // If you want to allow specific origins, you can check them here
      // Example: if (allowedOrigins.indexOf(origin) === -1) {
      //   return callback(new Error(origin), false);
      // }

      // Allow requests from any origin
      callback(null, true);
    },
  })
);

// Load env vars
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

// Sitemap
// const sitemap = require("./public/sitemap/sitemap.xml");

var indexRouter = require("./routes/ejsRoutes/index");
var homeRouter = require("./routes/ejsRoutes/home");
var usersRouter = require("./routes/ejsRoutes/users");
var aboutRouter = require("./routes/ejsRoutes/about");
var contactRouter = require("./routes/ejsRoutes/contact");
var event_listRouter = require("./routes/ejsRoutes/event-list");
var event_singleRouter = require("./routes/ejsRoutes/event-single");
var scheduleRouter = require("./routes/ejsRoutes/schedule");
var Gallery = require("./routes/ejsRoutes/gallery");
var register = require("./routes/ejsRoutes/register");
var Faq = require("./routes/ejsRoutes/faq");
var login = require("./routes/ejsRoutes/login");
var Blog = require("./routes/ejsRoutes/blog");
var Blog_News = require("./routes/ejsRoutes/blog-news");
var Blog_Details = require("./routes/ejsRoutes/blog-details");
var Attende = require("./routes/ejsRoutes/attende");
var Delegate = require("./routes/ejsRoutes/delegate");
var Student = require("./routes/ejsRoutes/student");
var Speaker = require("./routes/ejsRoutes/speaker");
var Volunter = require("./routes/ejsRoutes/volunter");
var Programe = require("./routes/ejsRoutes/programe");
var News = require("./routes/ejsRoutes/news");
var Foreign = require("./routes/ejsRoutes/foreign");

// ADDED NEWS ROUTES-------
var Privacy = require("./routes/ejsRoutes/privacy");
var Refund = require("./routes/ejsRoutes/refund");
var Conditions = require("./routes/ejsRoutes/conditions");
var AboutMlf = require("./routes/ejsRoutes/aboutMlf");
var AboutBookPlus = require("./routes/ejsRoutes/aboutBookPlus"); // ADDED NEWS ROUTES-------
const CommonReg = require("./routes/ejsRoutes/commonReg");
const Scanner = require("./routes/ejsRoutes/scanner");

// Admin route files
const auth = require("./routes/auth.js");
const user = require("./routes/user.js");
const userType = require("./routes/userType.js");
const menu = require("./routes/menu.js");
const subMenu = require("./routes/subMenu.js");
const menuRole = require("./routes/menuRole.js");
const subMenuRole = require("./routes/subMenuRole.js");
const appointment = require("./routes/appointment.js");
const franchise = require("./routes/franchise.js");
const dashboard = require("./routes/dashboard.js");
const faq = require("./routes/faq.js");
const aboutUs = require("./routes/aboutUs");
const gallery = require("./routes/gallery");
const news = require("./routes/news");
const speakers = require("./routes/speakers");
const registration = require("./routes/registration");
const testimonial = require("./routes/testimonial");
const pendingReg = require("./routes/pendingReg");
const pendingPayment = require("./routes/pendingPayment");
const volunteer = require("./routes/volunteer.js");
// ----------------------------------------------------
var Committe = require("./routes/ejsRoutes/committe");
var Events = require("./routes/ejsRoutes/events");
var Event_inner = require("./routes/ejsRoutes/event_inner");

// Configure the session middleware
app.use(
  session({
    secret: "sessionSecretKey",
    resave: false,
    saveUninitialized: true,
  })
);
//
// Connect to MongoDB database
connectDB();

// Sitemap
app.get("/sitemap.xml", function (req, res) {
  res.set("Content-Type", "text/xml");
  res.sendFile(path.join(__dirname, "public", "sitemap", "sitemap.xml"));
});

app.use("/images", express.static("./public/user"));
app.use("/images", express.static("./public/proteincategory"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads")); // Serve uploaded images

app.use("/", indexRouter);
// app.use("/home", homeRouter);
app.use("/users", usersRouter);
app.use("/tales-of-malabar", aboutRouter);
app.use("/contact", contactRouter);
app.use("/event-list", event_listRouter);
app.use("/event-single", event_singleRouter);
app.use("/schedule", scheduleRouter);
app.use("/gallery", Gallery);
app.use("/register", register);
app.use("/faq", Faq);
app.use("/login-register", login);
app.use("/blog-gird", Blog);
app.use("/blog-news", Blog_News);
app.use("/blog-details", Blog_Details);
app.use("/attende", Attende);
app.use("/delegate", Delegate);
app.use("/student", Student);
app.use("/speaker", Speaker);
app.use("/volunter", Volunter);
app.use("/Sessions", Programe);
app.use("/news", News);
app.use("/foreign", Foreign);
// LATESTS-----
app.use("/privacy", Privacy);
app.use("/refund", Refund);
app.use("/terms-conditions", Conditions);
app.use("/malabar-literature-festival", AboutMlf);
app.use("/book-plus-publishers", AboutBookPlus);
app.use("/common-reg", CommonReg);
app.use("/scan", Scanner);
app.use("/book-plus-publishers", AboutBookPlus);
app.use("/malabar-heritage-walk", Event_inner);

// mount Admin routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);
app.use("/api/v1/user-type", userType);
app.use("/api/v1/menu", menu);
app.use("/api/v1/sub-menu", subMenu);
app.use("/api/v1/menu-role", menuRole);
app.use("/api/v1/submenu-role", subMenuRole);
app.use("/api/v1/appointment", appointment);
app.use("/api/v1/franchise", franchise);
app.use("/api/v1/dashboard", dashboard);
app.use("/api/v1/faq", faq);
app.use("/api/v1/about-us", aboutUs);
app.use("/api/v1/gallery", gallery);
app.use("/api/v1/news", news);
app.use("/api/v1/speakers", speakers);
app.use("/api/v1/registration", registration);
app.use("/api/v1/testimonial", testimonial);
app.use("/api/v1/pending-reg", pendingReg);
app.use("/api/v1/pending-payment", pendingPayment);
app.use("/api/v1/volunteer", volunteer);

app.use("/committe", Committe);
app.use("/events", Events);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
