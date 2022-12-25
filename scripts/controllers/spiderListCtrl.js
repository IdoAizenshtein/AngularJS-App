(function () {
	function spiderListCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
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
		$scope.tab = '1';
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
				$scope.loadSpiderList()
			}
		}

		$scope.loadSpiderList = function () {
			$scope.loaderSpider = false;
			serverConnection.spiderList().then(function (res) {
				$scope.appData.spiderList = res;

				$scope.appData.spiderList.forEach(function (v) {
					if (v.DATE_CREATED !== null) {
						var dateFormat = v.DATE_CREATED;
						v.DATE_CREATED_SORT = new Date(dateFormat.split('/')[2], dateFormat.split('/')[1], dateFormat.split('/')[0]);
					}
					if (v.DATE_LAST_MODIFIED !== null) {
						var dateFormat = v.DATE_LAST_MODIFIED;
						v.DATE_LAST_MODIFIED_SORT = new Date(dateFormat.split('/')[2], dateFormat.split('/')[1], dateFormat.split('/')[0]);
					}
				})
				$scope.loaderSpider = true;
			}, function (error) {
			});
		}

		$scope.spiderUpdates = function (a, type, typeVal) {
			if (type !== 'inrun_type' || type == 'inrun_type' && a.disabledRunType == true) {
				$scope.loaderSpider = false;
				var data = {
					'inspider_id': a.SPIDER_ID
				}
				if (typeVal == 'RUN_TYPE') {
					data[type] = parseInt(a[typeVal]);
				}
				else {
					data[type] = Boolean(a[typeVal])
				}
				serverConnection.spiderUpdate(data).then(function (res) {
					$scope.loaderSpider = true;
				}, function (error) {
				});
			}
		}

		$scope.spiderUpdate = function () {
			$scope.loaderSpider = false;
			var data = {spider_id: $scope.appData.spiderUpdatePopSave.SPIDER_ID};
			if ($scope.tab == '1') {
				if ($scope.appData.spiderUpdatePopSave.SINGLE_ACCOUNT_ID !== $scope.appData.spiderUpdatePopTab1.SINGLE_ACCOUNT_ID) {
					data.single_account_id = $scope.appData.spiderUpdatePopTab1.SINGLE_ACCOUNT_ID;
				}
				if ($scope.appData.spiderUpdatePopSave.SINGLE_SNIF_ID !== $scope.appData.spiderUpdatePopTab1.SINGLE_SNIF_ID) {
					data.single_snif_id = $scope.appData.spiderUpdatePopTab1.SINGLE_SNIF_ID;
				}
				if ($scope.appData.spiderUpdatePopSave.SINLE_DAYS_TO_RUN !== $scope.appData.spiderUpdatePopTab1.SINLE_DAYS_TO_RUN) {
					data.single_day_to_run = $scope.appData.spiderUpdatePopTab1.SINLE_DAYS_TO_RUN;
				}
				if ($scope.appData.spiderUpdatePopSave.RUN_TYPE !== $scope.appData.spiderUpdatePopTab1.RUN_TYPE) {
					data.run_type = $scope.appData.spiderUpdatePopTab1.RUN_TYPE;
				}
			}
			if ($scope.tab == '2') {
				if ($scope.appData.spiderUpdatePopSave.SINGLE_ACCOUNT_ID !== $scope.appData.spiderUpdatePopTab2.SINGLE_ACCOUNT_ID) {
					data.single_account_id = $scope.appData.spiderUpdatePopTab2.SINGLE_ACCOUNT_ID;
				}
				if ($scope.appData.spiderUpdatePopSave.SINGLE_SNIF_ID !== $scope.appData.spiderUpdatePopTab2.SINGLE_SNIF_ID) {
					data.single_snif_id = $scope.appData.spiderUpdatePopTab2.SINGLE_SNIF_ID;
				}
				if ($scope.appData.spiderUpdatePopSave.SINLE_DAYS_TO_RUN !== $scope.appData.spiderUpdatePopTab2.SINLE_DAYS_TO_RUN) {
					data.single_day_to_run = $scope.appData.spiderUpdatePopTab2.SINLE_DAYS_TO_RUN;
				}
				if ($scope.appData.spiderUpdatePopSave.MATAH_DAY_TO_RUN !== $scope.appData.spiderUpdatePopTab2.MATAH_DAY_TO_RUN) {
					data.matah_day_to_run = $scope.appData.spiderUpdatePopTab2.MATAH_DAY_TO_RUN;
				}
				if ($scope.appData.spiderUpdatePopSave.IND_CHECKPIC !== $scope.appData.spiderUpdatePopTab2.IND_CHECKPIC) {
					data.ind_checkpic = $scope.appData.spiderUpdatePopTab2.IND_CHECKPIC;
				}
				if ($scope.appData.spiderUpdatePopSave.IND_CCARD_DATA !== $scope.appData.spiderUpdatePopTab2.IND_CCARD_DATA) {
					data.ind_ccard_data = $scope.appData.spiderUpdatePopTab2.IND_CCARD_DATA;
				}
				if ($scope.appData.spiderUpdatePopSave.IND_NILVIM !== $scope.appData.spiderUpdatePopTab2.IND_NILVIM) {
					data.ind_nilvim = $scope.appData.spiderUpdatePopTab2.IND_NILVIM;
				}
				if ($scope.appData.spiderUpdatePopSave.IND_RUN !== $scope.appData.spiderUpdatePopTab2.IND_RUN) {
					data.ind_run = $scope.appData.spiderUpdatePopTab2.IND_RUN;
				}
			}

			serverConnection.spider_run(data).then(function (res) {
				$scope.loaderSpider = true;
				$scope.hidePopup()
			}, function (error) {
				$scope.hidePopup()
			});
		}

		$scope.spiderUpdatePop = function (data) {
			$scope.appData.spiderUpdatePopSave = angular.copy(data);
			$scope.appData.spiderUpdatePopTab1 = data;
			$scope.appData.spiderUpdatePopTab2 = data;
			$scope.showPopup('views/templates/spiderUpdatePop.html?ver=3.74', 'spiderUpdatePop');
		}


		$scope.$parent.refresh = function () {
			$scope.loadSpiderList()
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
		$scope.help = function () {
		};


		$scope.openLogs = function (id) {
			$scope.appData.spider_get_log = {
				id: id,
				restInterval: true
			};
			$scope.showPopup('views/templates/spiderLogs.html?ver=3.74', 'spiderLogs');
			serverConnection.spider_get_log($scope.appData.spider_get_log.id).then(function (res) {
				$scope.appData.spider_get_log.log = res;
				$scope.loaIntervalLogs()
			}, function (error) {
			});
		}

		$scope.loaIntervalLogs = function () {
			var intervalLogs = setInterval(function () {
				if ($scope.appData.spider_get_log.restInterval) {
					serverConnection.spider_get_log($scope.appData.spider_get_log.id).then(function (res) {
						$scope.appData.spider_get_log.log = res;
					}, function (error) {
					});
				}
				else {
					clearInterval(intervalLogs)
				}
			}, 2000)
		}

		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
				if($scope.appData.spider_get_log){
					$scope.appData.spider_get_log.restInterval = false;
				}
			}
		});
	}


	angular.module('controllers')
		.controller('spiderListCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', spiderListCtrl]);
}());
