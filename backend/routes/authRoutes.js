// CRUD

const { Router } = require('express');
const router = Router();
const { AuthController } = require('../controllers');
const { authMiddleware, rolesMiddleware, validateTokenMiddleware } = require('../middlewares');


// registration - добавление пользователя в БД
// authenticate - проверка - login и password, которые ввел пользователь, совпадают ли с теми, которые ввел пользователь
// logout - выход с сайта и снятие всех прав пользователя
// authorisation - проверка прав пользователя выполнять определенные действия на сайте (удалять, редактировать, заходить в админку, и т.д.)

router.post("/register", (req, res, next) => { console.log("joi validation"); next() }, AuthController.register);

router.post("/login", AuthController.login);

router.get("/logout", validateTokenMiddleware, authMiddleware, AuthController.logout);

router.get("/info", validateTokenMiddleware, rolesMiddleware(["ADMIN"]), AuthController.info);


module.exports = router;