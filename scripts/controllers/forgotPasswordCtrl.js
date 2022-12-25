(function () {
	function forgotPasswordCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.appData = AppData;
		$scope.error = false;
		$scope.isSend = false;
		$scope.sendPassword = function () {
			serverConnection.sendPassword($scope.user.email, $scope.user.tel).then(function (success) {
				if (success === 1 || success === '1') {
					$scope.success = '';
					$scope.error = true;
				} else {
					$scope.isSend = true;
					$scope.error = false;
				}
			}, function (error) {
				$scope.success = '';
				$scope.error = true;
			});
		};
	}

	angular.module('controllers')
	.controller('forgotPasswordCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', forgotPasswordCtrl]);
}());


