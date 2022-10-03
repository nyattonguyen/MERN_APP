function errorHandler(err, req, res, next) {
    if(err.name === 'UnauthorizedError'){
        // jwt loi xac thuc
        return res.status(401).json({message: "the user is not authorized "})
    }
    if(err.name === 'ValidationError'){
        //loi xac nhan
        return res.status(401).json({message:err})
    }
    // 
    return res.status(500).json(err);
}
module.exports = errorHandler;