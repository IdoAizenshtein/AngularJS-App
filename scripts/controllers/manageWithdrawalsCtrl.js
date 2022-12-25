(function () {
	function manageWithdrawalsCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(5);
		$scope.date = new Date();
		$scope.showTabProb = true;
		$scope.scrollHeightTable = 260;
		$scope.scrollPage = 180;
		$scope.maxSize = 10;

		$scope.appData.dateTodayParse = ("0" + ($scope.date.getDate())).slice(-2) + '/' + ("0" + ($scope.date.getMonth() + 1)).slice(-2) + '/' + $scope.date.getFullYear();
		$scope.init = function () {
			$scope.gettokensalertsload();
		}
		$scope.$parent.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			if (!$scope.appData.selectedCompanyIndexLink) {
				if ($scope.appData.selectedCompany.hanhahPrivilege == true) {
					$state.go('overviewAcc.statistics');
				}
				else{
					$state.go('overviewAcc.ksafim');
				}
			}
			$scope.appData.selectedCompanyIndexLink = false;
		};

		$scope.currentPage = 1; //current page
		if (!localStorage.getItem('entryLimit')) {
			$scope.entryLimit = 50;
			localStorage.setItem('entryLimit', $scope.entryLimit)
		}
		else {
			$scope.entryLimit = parseFloat(localStorage.getItem('entryLimit'));
		}
		$scope.entryLimitChange = function () {
			localStorage.setItem('entryLimit', $scope.entryLimit)
		}
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.sort_by = function (predicate) {
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		};

		$scope.checkpopPasswordCompaiesTab = function (showPopPasswordForm) {
			if (showPopPasswordForm.$valid) {
				$scope.showPopPassword = true;
				$scope.loadManageWithdrawals()
			}
		}

		$scope.loadManageWithdrawals = function () {
			$scope.loaderManageWithdrawals = false;
			serverConnection.getReportsTypes().then(function (res) {
				$scope.appData.getReportsTypes = res;
				$scope.appData.valDD = $scope.appData.getReportsTypes[0].REPORT_NUM;
				$scope.getReportsTypesNum($scope.appData.valDD)
			}, function (error) {
			});
		}

		$scope.getReportsTypesNum = function (valDD) {
			$scope.loaderManageWithdrawals = false;
			serverConnection.getReportsTypesNum(valDD).then(function (res) {
				$scope.appData.getReportsTypesNum = res;
				$scope.appData.getReportsTypesNum.forEach(function (v) {
					if (v.EXTRACTDATE !== null) {
						var dateFormat = v.EXTRACTDATE.split(' ')[0];
						var min = v.EXTRACTDATE.split(' ')[1];
						v.dateAndMin = new Date(dateFormat.split('/')[2], dateFormat.split('/')[1], dateFormat.split('/')[0], min.split(':')[0], min.split(':')[1], min.split(':')[2], 0);
					}
				})
				$scope.loaderManageWithdrawals = true;
			}, function (error) {
			});
		}

		$scope.openMoreData = function (a) {
			$scope.appData.openMoreDataMangWit = a;
			$scope.showPopup('views/templates/openMoreDataMangWit.html?ver=3.74', 'openMoreDataMangWit');
		}

		$scope.showRunType = function (acc, type) {
			$scope.appData.tokenRunType = acc;
			$scope.appData.tokenTypeRunPrent = type;

			if (type == 'bank') {
				$scope.appData.checkboxRunTypeSett = [
					{
						val: true,
						type: 0
					},
					{
						val: false,
						type: 8
					},
					{
						val: false,
						type: 2
					},
					{
						val: false,
						type: 32
					}
				]
			}
			if (type == 'solek' || type == 'ccard') {
				$scope.appData.checkboxRunTypeSett = [
					{
						val: true,
						type: 100
					},
					{
						val: false,
						type: 1
					}
				]
			}

			$scope.showPopup('views/templates/popupRunTypeManag.html?ver=3.74', 'popupRunType');
		}

		$scope.playRunType = function () {
			var sum = 0;
			$scope.appData.checkboxRunTypeSett.forEach(function (v) {
				if (v.val == true) {
					sum += v.type
				}
			})
			var data = {
				intoken: $scope.appData.tokenRunType,
				inrun_type_to_do: sum
			}
			serverConnection.token_run_manual(data).then(function (res) {
				$scope.appData.getReportsTypesNum.forEach(function (v) {
					if (v.TOKEN == $scope.appData.tokenRunType) {
						v.disabledClick = true;
					}
				})
				$scope.gettokensalertsload();
				$scope.hidePopup();
			}, function (error) {

			});
		}


		$scope.ifDisabled = function (a) {
			if ((a.WEBSITE_TARGET_TYPE_ID !== 157 && a.WEBSITE_TARGET_TYPE_ID !== 158) && (a.IND_RUN == 0) && (a.STATUS == 0 || a.STATUS == 5 || a.STATUS == 99)) {
				return false
			}
			else {
				return true;
			}
		}

		$scope.refrashCheck = false;
		$scope.refrashMinutes = 5;
		$scope.refrashPage = function () {
			if ($scope.refrashCheck == true && $scope.refrashMinutes) {
				$interval.cancel($scope.timeMin);

				$scope.timeMin = $interval(function () {
					if ($scope.refrashCheck == true && $scope.refrashMinutes) {
						$scope.getReportsTypesNum($scope.appData.valDD)
					}
				}, (1000 * $scope.refrashMinutes));
			}
		}

		$scope.$parent.refresh = function () {
			$scope.getReportsTypesNum($scope.appData.valDD)
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
		$scope.help = function () {
		};

		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});
	}


	angular.module('controllers')
		.controller('manageWithdrawalsCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', manageWithdrawalsCtrl]);
}());
