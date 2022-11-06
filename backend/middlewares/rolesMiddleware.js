const rolesMiddleware = (rolesArray) => {
    return (req, res, next) => {
        // middleware нужна для работы со всем методами, кроме OPTIONS
    if (req.method === "OPTIONS") {
        next();
    }
        try {
        const { roles } = req.token;
        let hasRole = false;
        // проверяет наличие ролей у пользователя (rolesArray - массив необходимых ролей для права на определенные действия, указанный в middleware; role - элемент массива rolesArray; roles - массив ролей у пользователя)
        rolesArray.forEach(role => {
            if (roles.includes(role)) {
                hasRole = true;
            }            
        });
        // проверяет - есть ли необходимые права
        if (!hasRole) {
           return res.status(403).json({message: "No access rights."})
        }
        next();   
    } catch (error) {
        return res.send(error.message)            
        }    
    }
}


module.exports = rolesMiddleware;