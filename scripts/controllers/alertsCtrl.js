(function () {
	function alertsCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.$utils = utils;
		$scope.accoConversions = accoConversions;
		$scope.appData = AppData;
		$scope.nextPage = $state.params.url;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(10);
		$scope.date = new Date();
		$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
		$scope.appData.dateFilter.type = '1';

		$scope.init = function () {

		};

		$scope.closeAlerts = function () {
			$window.history.back()
		}

		$scope.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			$scope.loadPage()
		};
		$scope.loadPage = function () {
			$scope.openMessages(true);
		}
		$scope.refresh = function () {
			//    $scope.loadPageAnalisis($scope.targetTab);
		};
		$scope.$on('refresh', function () {
			$scope.loadPage();
		});
		$scope.help = function () {
			// window.open('http://bizibox.biz/help/bookkeeping', '_blank');
		};
	}

	angular.module('controllers')
	.controller('alertsCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', alertsCtrl]);
}());