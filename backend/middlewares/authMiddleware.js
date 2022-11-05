const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;


const authMiddleware = async (req, res, next) => {
    // middleware нужна для работы со всем методами, кроме OPTIONS
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        // проверяет - указаны ли параметры авторизации
        if (!req.headers.authorization) {
            throw new Error("Authorization header is not provided.");
        }        
        // проверяет начинается ли authorization с Bearer 
        if (!req.headers.authorization.startsWith("Bearer")) {
            throw new Error("Invalid token type.");            
        };
        // достает токен из req.headers
        const token = req.headers.authorization.split(" ")[1];
        // расшифровывает токен
        const decodedData = jwt.verify(token, JWT_SECRET_KEY);
        // проверяет - удалось ли расшифровать токен
        if (!decodedData) {
            throw new Error("Unable to verify token.");           
        }
        // присваивает запросу пользователя данные, полученные благодаря расшифровке токена
        req.user = decodedData;
        next();   
    } catch (error) {
        res.send(error.message)            
    }
}


module.exports = authMiddleware;