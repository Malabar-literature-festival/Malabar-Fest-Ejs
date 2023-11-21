const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const cors = require("cors");
const app = express();

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

// Load env consts
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

// Sitemap
// const sitemap = require("./public/sitemap/sitemap.xml");

const indexRouter = require("./routes/ejsRoutes/index");
const homeRouter = require("./routes/ejsRoutes/home");
const usersRouter = require("./routes/ejsRoutes/users");
const aboutRouter = require("./routes/ejsRoutes/about");
const contactRouter = require("./routes/ejsRoutes/contact");
const event_listRouter = require("./routes/ejsRoutes/event-list");
const event_singleRouter = require("./routes/ejsRoutes/event-single");
const scheduleRouter = require("./routes/ejsRoutes/schedule");
const Gallery = require("./routes/ejsRoutes/gallery");
const register = require("./routes/ejsRoutes/register");
const Faq = require("./routes/ejsRoutes/faq");
const Blog = require("./routes/ejsRoutes/blog");
const Blog_News = require("./routes/ejsRoutes/blog-news");
const Blog_Details = require("./routes/ejsRoutes/blog-details");
const Attende = require("./routes/ejsRoutes/attende");
const Delegate = require("./routes/ejsRoutes/delegate");
const Student = require("./routes/ejsRoutes/student");
const Speaker = require("./routes/ejsRoutes/speaker");
const Volunter = require("./routes/ejsRoutes/volunter");
const Programe = require("./routes/ejsRoutes/programe");
const News = require("./routes/ejsRoutes/news");
const Foreign = require("./routes/ejsRoutes/foreign");

// ADDED NEWS ROUTES-------
const Privacy = require("./routes/ejsRoutes/privacy");
const Refund = require("./routes/ejsRoutes/refund");
const Conditions = require("./routes/ejsRoutes/conditions");
const AboutMlf = require("./routes/ejsRoutes/aboutMlf");
const AboutBookPlus = require("./routes/ejsRoutes/aboutBookPlus"); // ADDED NEWS ROUTES-------
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
const album = require("./routes/album.js");
// ----------------------------------------------------
const Committe = require("./routes/ejsRoutes/committe");
const Events = require("./routes/ejsRoutes/events");
const Event_inner = require("./routes/ejsRoutes/event_inner");

const sessions = require("./routes/session");
const sessionGuest = require("./routes/sessionGuest");

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
app.use("/api/v1/album", album);

app.use("/committe", Committe);
app.use("/events", Events);

app.use("/api/v1/session", sessions);
app.use("/api/v1/session-guest", sessionGuest);

// Flutter Api //
const login = require("./routes/app/login.js");
const feedback = require("./routes/app/feedback.js");
const notes = require("./routes/app/note.js");
const QnA = require("./routes/app/QnA.js");
app.use("/api/v1/login", login);
app.use("/api/v1/feedback", feedback);
app.use("/api/v1/note", notes);
app.use("/api/v1/qna", QnA);

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
