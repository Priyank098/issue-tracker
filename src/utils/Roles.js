const adminRoles = [
    {
        url: "/createUser",
        method: "post"
    },
    {
        url: "/updateUser/:id",
        method: "patch"
    },
    {
        url: "/deleteUser/:id",
        method: "delete"
    },
    {
        url: "/viewUserById/:id",
        method: "get"
    }
]


module.exports = {adminRoles}