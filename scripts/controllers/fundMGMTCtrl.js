(function () {
	function fundMGMTCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.appData = AppData;
		$scope.bankId = $state.params.bank;

		$scope.init = function () {
			$scope.appData.user = JSON.parse(localStorage.getItem('acco_user'));
			if ($scope.appData.user)
				$scope.login().then(function (success) {
				}, function (error) {
				});
		};
	}

	angular.module('controllers')
	.controller('fundMGMTCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', fundMGMTCtrl]);
}());
