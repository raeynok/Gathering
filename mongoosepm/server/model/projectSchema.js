var mongooseProject = require('mongoose');	// initialisation de mongoose

/*	******
	SCHEMA
	******	*/

var Schema = mongooseProject.Schema;

var projectSchema = new Schema({		// création du modèle -> structure des données
	projectName: {type: String, unique: true, required: true},
	createdBy: {type: mongooseProject.Schema.Types.ObjectId, ref: 'User'},		//Créé par une seule personne
	members: [{type: mongooseProject.Schema.Types.ObjectId, ref: 'User'}],		//Plusieurs membre : on utilise un tableau
	administrators: [{type: mongooseProject.Schema.Types.ObjectId, ref: 'User'}],
	group: [{type: mongooseProject.Schema.Types.ObjectId, ref: 'Group'}],
	needs: [{type: String}],
	themes: [{type: mongooseProject.Schema.Types.ObjectId, ref: 'Theme'}],
	createdOn: {type: Date, default: Date.now},
	modifiedOn: {type: Date, default: Date.now},
	presentation: {type: String},
});

/*	********
	METHODES
	********	*/
	
//Remarque : les méthodes doivent être définies après les schémas et avant les modèles

projectSchema.statics.findByUserID = function (userid, callback) {
	this.find(					//On cherche un projet
		{ createdBy : userid },	//Dont le créateur est userid
		'_id projectName',		//On récupère un tableau d'instance de projets avec _id et nom du projet
		{sort: 'modifiedOn'},	//On les tri par date de modification
		callback);
};

projectSchema.statics.findByName = function (tag, callback) {
	this.find({ projectName : tag },{sort: 'modifiedOn'}, callback);
};

projectSchema.statics.findByProjectID = function (projectId, callback) {
	this.find(					//On cherche un projet
		{ _id : projectId },	//Dont le créateur est userid
		'_id projectName',		//On récupère un tableau d'instance de projets avec _id et nom du projet
		{sort: 'modifiedOn'},	//On les tri par date de modification
		callback);
};

exports.Project = mongooseProject.model('Project', projectSchema);	// exportation du modèle pour pouvoir l'utiliser
