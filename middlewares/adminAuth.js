function adminAuth(req, res, next){
    console.log('entrou middleware');
    if(req.session != undefined && req.session.user != undefined){
        next();
    }else{
        res.redirect('/login');
    }
}

module.exports = adminAuth;