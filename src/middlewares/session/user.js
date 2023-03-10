const userSessionManagement = (req, res, next) => {
    if (req.session?.user) {
        next()
    } else {
        res.redirect("/login")
    }
}

const userNotLogin = (req, res, next) => {
    if (req.session?.user) {
        res.redirect('/')
    } else {
        next()
    }
}

module.exports = {
    userSessionManagement,
    userNotLogin
} 