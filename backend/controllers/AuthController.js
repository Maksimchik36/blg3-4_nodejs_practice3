// обертка для контроллеров для отлавливания ошибок (аналог try/catch)
const asyncHandler = require('express-async-handler');
const { UserModel } = require('../models');
const bcrypt = require('bcryptjs');


class AuthController{
    
    register = asyncHandler(async (req, res) => {
        const { userEmail, userPassword } = req.body;
        // проверяет есть ли в теле запроса почта и пароль 
        if (!userEmail || !userPassword) {
            throw new Error("userEmail and userPassword are required")
        }
        // ищет существует ли пользователь уже в БД
        const candidate = await UserModel.findOne({ userEmail });
        if (candidate) {
            throw new Error("User already exists. Please login.");            
        }
        // хэширует пароль
        const hashPassword = bcrypt.hashSync(userPassword, 10);
        if (!hashPassword) {
            throw new Error("Unable to hash password");    
        }
        // создает пользователя в БД
        const user = await UserModel.create({ ...req.body, userPassword: hashPassword });
        if (!user) {
            throw new Error("Unable to save user to DB");           
        }
        // присваивая userPassword: "secret" , скрываем hashPassword (для передачи ответа на фронтэнд)
        const userToShow = { userEmail, userPassword: "secret" };

        // возвращает результат на фронтэнд. объект userToShow записывается в свойство data
        res.status(201).json({ code: 201, status: 'Success', data: userToShow })   
    })

    login = asyncHandler(async (req, res) => {
        res.send(req.body)
    })
    logout = asyncHandler(async (req, res) => {
        res.send(req.body)
    })
    info = asyncHandler(async (req, res) => {
        res.send(req.body)
    })

}

module.exports = new AuthController();