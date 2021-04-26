import Express from "express"
import bcrypt from "bcrypt"
import { initializePassport } from "./passport-config.js"
import passport from "passport"
import flash from "express-flash"
import session from "express-session"
import methodOverride from "method-override"
import { config } from "dotenv"

if(process.env.NODE_ENV !== "production") {
  config()
}

initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

const app = Express()

app.set("vew-engine", "ejs")
app.use(Express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name })
})

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs")
})

app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}))

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs")
})

app.post("/register", checkNotAuthenticated, async (req, res) => {
  const { name, email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    users.push({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    })
    res.redirect("/login")
  } catch {
    res.redirect("/register")
  }
  console.dir(users)
})

app.delete("/logout", (req, res) => {
  req.logOut()
  res.redirect("/login")
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/")
  }

  next()
}

app.listen(3000)