(function () {
	function mainAccountCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(5);
		$scope.date = new Date();
		$scope.init = function () {
			//$scope.appData.user = JSON.parse(localStorage.getItem('acco_user'));
			//if ($scope.appData.user)
			//	$scope.login().then(function(success) {
			//	}, function(error) {
			//	});
		};

		localStorage.removeItem('acco_companyId');
		localStorage.removeItem('acco_companyName');
		$('.company-selector-cnt input').val('');
		$scope.dataReportComposite = function (openMessAcc) {
			if (openMessAcc) {
				$scope.appData.loaderAccMessAll = false;
				serverConnection.dataReportComposite().then(function (res) {
					$scope.appData.messAccAllMain = res.activity.activityContent;
					$scope.appData.loaderAccMessAll = true;
				}, function (error) {

				});
			}
		}
		$scope.dataReportComposite(true)
	}

	angular.module('controllers')
	.controller('mainAccountCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', mainAccountCtrl]);
}());