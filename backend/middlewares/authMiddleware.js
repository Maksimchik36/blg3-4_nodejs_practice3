const authMiddleware = async (req, res, next) => {
    // middleware нужна для работы со всем методами, кроме OPTIONS
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        // присваивает запросу пользователя данные из токена
        req.user = req.token;
        next();   
    } catch (error) {
        return res.send(error.message)            
    }
}


module.exports = authMiddleware;