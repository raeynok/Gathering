
/*	********
	REQUIERE
	********	*/
var fs=require("fs");
var userSchema = require('../model/userSchema');
var crypto = require("crypto");
var passport = require('passport');
var pass = require("../model/pass");
var request = require('request');
	
		
	
/*	***************
	CREER UN COMPTE
	***************	*/

/*	Créer un utilisateur	*/
exports.doCreateUser = function(req,res,done){	// fonction de traitement du formulaire d'inscription
	var bodyUser = req.body.user;
	var formCaptcha = bodyUser.captcha;
	var response = res;
	console.log(bodyUser);
	//console.log(formCaptcha);
	//envoie une requete au serveur de verification captcha
	request.post('http://www.google.com/recaptcha/api/verify',{
			form: {privatekey: '6LfU3fwSAAAAALjNiSHNG3UA0s_8k83RbanqMjMG',
				remoteip: req.connection.remoteAddress,
				challenge: formCaptcha.challenge,
				response: formCaptcha.response}
		},
		function(err, res, body, next){
			//si le serveur renvoie un body avec false c'est que le captcha est inexact
			if(body.match(/false/) === null){
				pass.createUser(bodyUser, function(err,user){
					if (err)
					{
						return response.render('user_form', {user: req.user, message: err.code === 11000 ? "User already exists" : err.message});
					}
					else
					{
						req.login(user, function (err) {
								if (err) 
								{
									return next(err);
								}
								// successful login
								else {
									console.log("Je modifie la connexion ? " + req.isAuthenticated());	
									console.log("Le nouvel utilisateur est " + req.user.mail);	
									response.send(req.isAuthenticated());
								}
								//le login de la version sans passport, à supprimer lors de a suppression de la variable loggedIn
								//req.session.loggedIn = true;
								//req.session.currentUser = user;
								//res.send(req.session.currentUser);
						})
					}
				});
			}
			else
			{
				return response.render('user_form', {message: "Recaptcha Validation Failed. Please Re-Enter the reCAPTCHA challenge.", err: err})
			}
		}		
	)
};


/*	******************
	MODIFIER UN COMPTE
	******************	*/
	
/*	Modifier un utilisateur	*/

exports.doUpdateUser = function(req, res, done){	// fonction de modification -> ne va pas être conservée, on se contentera de faire des updates un peu comme la page projet, à voir comment on mettra ça en oeuvre
	console.log("On edite un user");
	var body = req.body;
	if (req.isAuthenticated()) {
		console.log('On cherche le currentUser depuis update : ' + body.user._id);
		pass.updateUser(body.user, function(err, user){
			if(err) 
			{
				return res.render('user_edit', {user: req.user, message: err.code === 500 ? "Updating problem" : err.message});
			}
			else
			{
				return res.render('user_profile', {user: req.user});
			}
		});
	}
	else
	{
		res.send({user : "" , connexion : req.isAuthenticated()});
	}	
};

/*	supprimer un utilisateur	*/
exports.identite_suppression = function(req, res){	// fonction de suppression du compte -> à relier au bouton supprimer mon compte de la page identite
};


/*	*********************
	RECHERCHE UTILISATEUR
	*********************	*/

/*	Réupère un utilisateur à partir de son id	*/
exports.oneUser = function(req,res, next) {
	console.log("Cherche le user_id : " + req.params.id);	
	userSchema.User.findById(req.params.id, function(err, user) {	//On cherche l'utilisateur avec cet Id
		if (err) {console.log(err); return next(err);}
		else {
		console.log(user);
		res.send(user);}
	});
};

/*	Récupère tous les utilisateurs	*/	
exports.allUsers = function(req, res, next) {
	var query = userSchema.User.find();
	query.exec(function(err, users) {
		if (err) {return next(err);}	//S'il y a une erreur, c'est géré par le middlewre error
		else {res.send(users);}
  });
};

exports.currentUser = function(req,res,next) {
	if (req.isAuthenticated()) 
	{
		console.log('On cherche currentUser : ' + req.user);
		res.send({user : req.user , connexion : req.isAuthenticated()});
	} 
	else
	{
		res.send({user : "" , connexion : req.isAuthenticated()});
	}
};
	
/*	Rechercher un utilisateur à partir de son nom	*/
exports.doSearchUser = function(req, res) {
	console.log("Chercher un utilisateur avec le nom "+req.body.tag);
	if(req.body.tag) {
		userSchema.User.findByName(req.body.tag, function(err, userNom) {
			if(err){
				console.log(err);
				res.redirect('/search_user/?500');
			}else{
				console.log(userNom);
				if(userNom[0] != null){				
					req.users = userNom[0].id;	//On enregiste la liste d'utilisateurs pour l'envoyer dans le res.render 'recherche'
					res.redirect('/user/'+req.users);
				}else{
					res.redirect('/search_user/?404=user');
				}
			}
		});
	}else{
		res.redirect('/search_user');
	}
};