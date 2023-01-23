const getAdminLogin = (req, res) => {
    res.render("admin/login", { adminHeader: true })
}
const postAdminLogin = (req, res) => {
    const admin = {
        email: "admin@gmail.com",
        password: "123456"
    }
    console.log(req.body);
}

module.exports = {
    getAdminLogin,
    postAdminLogin
}