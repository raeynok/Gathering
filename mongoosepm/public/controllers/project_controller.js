'use strict';



/*	Controller de la liste des projet : hérite de profile	*/
gatheringModule.controller('projectController', ['$scope', 'thisUser', 'userProject', function($scope, thisUser, userProject){	//project désigne le projet de la page
	$scope.user = thisUser;	
	$scope.project = userProject;
}]);



/*	Controller de la page /project_edit/:id	*/
gatheringModule.controller('projectEditController', ['$scope', '$location', 'project', function($scope, $location, project) {
	$scope.project = project;
	
	$scope.save = function() {							//Enregistrer le projet
		$scope.project.$save(function(project) {		//On enregitre le projet
			$location.path('/project/' + project.id);	//Puis on redirige vers la page
		});
	};
	
	$scope.remove = function() {						//Supprimer le projet
		delete $scope.project;							//On supprime le projet
		$location.path('/');							//Puis on redirige vers la page d'accueil
	};
}]);




gatheringModule.controller('projectsListController', ['$scope', 'thisUser', function($scope, thisUser) {
	$scope.user = thisUser;
	$scope.projects = thisUser.projects;
}]);

		
		

	