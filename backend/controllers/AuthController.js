// обертка для контроллеров для отлавливания ошибок (аналог try/catch)
const asyncHandler = require('express-async-handler');
const { UserModel, RoleModel } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;


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
        // достает из коллекции роль "USER" для дальнейшего её присваивания пользователю
        const userRole = await RoleModel.findOne({ value: "ADMIN" });
        // создает пользователя в БД
        const user = await UserModel.create({
            ...req.body,
            userPassword: hashPassword,
            roles: [userRole.value],
        });
        if (!user) {
            throw new Error("Unable to save user to DB");           
        }
        // присваивая userPassword: "secret" , заменят hashPassword (тольеко для передачи ответа на фронтэнд)
         user.userPassword = "secret" ;

        // возвращает результат на фронтэнд. объект userToShow записывается в свойство data
        res.status(201).json({ code: 201, status: 'Success', data: user })   
    })


    login = asyncHandler(async (req, res) => {
        const { userEmail, userPassword } = req.body;
        // проверяет есть ли в теле запроса почта и пароль 
        if (!userEmail || !userPassword) {
            throw new Error("userEmail and userPassword are required")
        }
        // ищет существует ли пользователь уже в БД
        const user = await UserModel.findOne({ userEmail });
        // сравнивает введённый пароль с паролем из БД
        const validPassword = bcrypt.compareSync(userPassword, user.userPassword);
        // проверяет существование и валидность необходимых параметров
        if (!user || !validPassword) {
            throw new Error("Invalid login or password.");            
        }
        // записывает сгенерированный token в свойство объекта user.token
        user.token = this.generateToken(user._id, user.roles);
        // сохраняет в БД
        await user.save();
        // проверяет - удачно ли сохранен токен
        if (!user.token) {
            throw new Error("Unable to save user.token");      
        }

        // возвращает результат на фронтэнд
        res.status(200).json({ code: 200, status: 'Success', data: user })  
    })


    logout = asyncHandler(async (req, res) => {
        const { id } = req.user;
        // ищет пользователя с данным id в БД
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error("Unable to logout");           
        }
        // обнуляет токен
        user.token = null;
        // сохраняет данные пользователя в БД
        user.save();

        // возвращает на фронтенд
        res.status(200).json({ code: 200, status: 'Success', message: "Logout success." }) 
    })


    info = asyncHandler(async (req, res) => {
        res.send("Access granted. You are ADMIN.");
    })

    
    // генерирует токен
    generateToken = ((id, roles) => {
        // загружаемые в токен данные, которые потом можно будет из него вытянуть
        const payload = { id, roles };
        return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "8h"})
    });

}

module.exports = new AuthController();