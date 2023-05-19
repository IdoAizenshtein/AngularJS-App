(function () {
	function trialBalanceCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
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
		$scope.appData.dateFilterTypesTrial = '00';

		$scope.datesDef = function () {
			var byMonth;
			var byYear;
			if ($scope.appData.selectedCompany.default_account_month) {
				var default_account_month = $scope.appData.selectedCompany.default_account_month;
				byMonth = parseInt(default_account_month.toString().substring(4, 6)) - 1;
				byYear = parseInt(default_account_month.toString().substring(0, 4));
			}
			else {
				var date = new Date();
				date.setFullYear(date.getFullYear());
				date.setMonth(date.getMonth() - 2);
				date.setDate(date.getDate());
				byMonth = date.getMonth();
				byYear = date.getFullYear();
			}
			$scope.dateFilter = {
				type: "0",
				byMonth: byMonth,
				byYear: byYear,
				byOnlyYear: $scope.date.getFullYear(),
				fromMonth: $scope.firstDayOfYear.getMonth(),
				fromYear: $scope.firstDayOfYear.getFullYear(),
				toMonth: $scope.lastDayOfYear.getMonth(),
				toYear: $scope.lastDayOfYear.getFullYear()
			};
		};

		$scope.init = function () {
			$scope.loaderTrial = false;
		};
		$scope.convertUuid = function (id) {
			var res = id.toLowerCase();
			var uuid = res.substring(0, 8) + '-' + res.substring(8, 12) + '-' + res.substring(12, 16) + '-' + res.substring(16, 20) + '-' + res.substring(20, 32);
			return uuid;
		};

		$scope.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);

			$scope.datesDef();
			$scope.$broadcast('widthChanged');
			$scope.loadPageBalance();
		};
		$scope.getMaazanListServer = function (data) {
			var deferred = $q.defer();
			serverConnection.getMaazanList(data).then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
		$scope.cartisCodeGetlistServer = function () {
			var deferred = $q.defer();
			serverConnection.cartisCodeGetlist().then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
		$scope.targetSupplierUpdateTypeServer = function (data) {
			var deferred = $q.defer();
			serverConnection.targetSupplierUpdateType(data).then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
		$scope.unCheckRowAlertServer = function (data) {
			var deferred = $q.defer();
			serverConnection.unCheckRowAlert(data).then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
		$scope.loadPageBalance = function () {
			$scope.loaderTrial = false;
			var fromDate, toDate, fromDatePrev, toDatePrev, fromDatePrev2, toDatePrev2;

			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			$scope.ptiha = 0;
			switch ($scope.appData.dateFilterTypesTrial) {
				case "00":
					//fromDate = $scope.date.getFullYear() + '' + ("0" + ($scope.date.getMonth() + 1)).slice(-2) + '' + ("0" + ($scope.date.getDate())).slice(-2);
					//toDate = $scope.date.getFullYear() + '' + ("0" + ($scope.date.getMonth() + 1)).slice(-2) + '' + ("0" + ($scope.date.getDate())).slice(-2);
					//
					//fromDatePrev = $scope.date.getFullYear() + '' + ("0" + ($scope.date.getMonth() + 1)).slice(-2) + '' + ("0" + ($scope.date.getDate())).slice(-2);
					//toDatePrev = $scope.date.getFullYear() + '' + ("0" + ($scope.date.getMonth() + 1)).slice(-2) + '' + ("0" + ($scope.date.getDate())).slice(-2);

					fromDate = '19800101';
					fromDatePrev = '19800101';
					toDate = '20290101';
					toDatePrev = '20290101';

					$scope.appData.datesSelectBalance = 'לפי יתרה נוכחית';
					//$scope.ptiha = 1;

					break;


				case "0":
					fromDate = $scope.dateFilter.byYear + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '01';
					toDate = $scope.dateFilter.byYear + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '' + daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear);

					fromDatePrev = ($scope.dateFilter.byYear - 1) + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '01';
					toDatePrev = ($scope.dateFilter.byYear - 1) + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '' + daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, ($scope.dateFilter.byYear - 1));

					$scope.appData.datesSelectBalance = $scope.accoConversions.getDateMonth(("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2)) + ' ' + $scope.dateFilter.byYear;
					break;

				case "1":
					fromDate = $scope.dateFilter.byOnlyYear + '0101';
					toDate = $scope.dateFilter.byOnlyYear + '1231';

					fromDatePrev = ($scope.dateFilter.byOnlyYear - 1) + '0101';
					toDatePrev = ($scope.dateFilter.byOnlyYear - 1) + '1231';

					$scope.appData.datesSelectBalance = $scope.dateFilter.byOnlyYear;
					break;

				case "2":
					fromDate = $scope.dateFilter.fromYear + '' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '01';
					toDate = $scope.dateFilter.toYear + '' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '01';

					fromDatePrev = ($scope.dateFilter.fromYear - 1) + '' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '01';
					toDatePrev = ($scope.dateFilter.toYear - 1) + '' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '' + daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, ($scope.dateFilter.toYear - 1));

					$scope.appData.datesSelectBalance = $scope.accoConversions.getDateMonth(("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2)) + ' ' + $scope.dateFilter.fromYear + ' - ' + $scope.accoConversions.getDateMonth(("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2)) + ' ' + $scope.dateFilter.toYear;
					break;
			}
			$scope.appData.fromDateRow = fromDate;
			$scope.appData.toDateRow = toDate;

			var reqList = {
				"companyId": $scope.appData.selectedCompany.companyId,
				"ind_ptiha": $scope.ptiha,
				"from": fromDate,
				"till": toDate,
				"prevFrom": fromDatePrev,
				"prevTill": toDatePrev,
				"targetTab": []
			};
			$scope.getMaazanList(reqList);

		};

		$scope.unCheckRowAlert = function (id) {
			var data = {
				company_customer_id: id,
				company_id: $scope.appData.selectedCompany.companyId
			};
			$scope.unCheckRowAlertServer(data).then(function (res) {
			}, function (error) {

			});
		};

		$scope.getMaazanList = function (data) {
			$scope.cartisCodeGetlistServer().then(function (res) {
				$scope.appData.cartisCodeGetlist = res;
			}, function (error) {

			});
			$scope.getMaazanListServer(data).then(function (res) {
				$scope.appData.trialBalanceArr = res;
				$scope.appData.trialBalanceArr.forEach(function (v) {
					v.tableShow = true;
					v.rowshow = false;
					v.level_1.level_2.forEach(function (v1) {
							v1.rowshow = true;
					})
				});
				$scope.filterTrial()
			}, function (error) {

			});
		}

		$scope.filterTrial = function () {
			$scope.loaderTrial = false;
			$scope.appData.trialBalance = angular.copy($scope.appData.trialBalanceArr);
			$scope.appData.trialBalance = $filter('filterTrial')($scope.appData.trialBalance, $scope.searchFilter);
			$scope.loaderTrial = true;
		}

		$scope.editSend = function (data) {
			if (data.targetEdit == true) {
				var dataSend = {
					"company_customer_id": data.id,
					"user_target_supp_typeId": data.selectItems.target_supplier_type_id
				}
				$scope.targetSupplierUpdateTypeServer(dataSend).then(function (res) {
					$scope.appData.trialBalance.forEach(function (v) {
						v.level_1.level_2.forEach(function (a) {
							if (data.id == a.id) {
								a.target_supp_desc = a.selectItems.description;
							}
						})
					})


				}, function (error) {

				});
			}
		}
		$scope.custom = true;
		$scope.wordButton = 'פתח';
		$scope.openRowsButton = function () {
			$scope.customAlert = true;
			$scope.wordButtonAlert = 'הצג';

			$scope.custom = $scope.custom === false ? true : false;
			if ($scope.custom == false) {
				$scope.wordButton = 'סגור';
				$scope.appData.trialBalance.forEach(function (v) {
					v.tableShow = true;
					v.rowshow = true;
					v.level_1.level_2.forEach(function (a) {
						a.rowshow = true;
					});
				})
			}
			else {
				$scope.wordButton = 'פתח';
				$scope.appData.trialBalance.forEach(function (v) {
					v.rowshow = false;
				})
			}
		}

		$scope.customAlert = true;
		$scope.wordButtonAlert = 'הצג';
		$scope.openRowsButtonAlerts = function () {
			$scope.custom = true;
			$scope.wordButton = 'פתח';

			$scope.customAlert = $scope.customAlert === false ? true : false;
			if ($scope.customAlert == false) {
				$scope.wordButtonAlert = 'סגור';
				$scope.appData.trialBalance.forEach(function (v) {
					var rowShow = false;
					if (v.level_1.alert_ind) {
						v.tableShow = true;
					}
					else {
						v.tableShow = false;

					}
					v.level_1.level_2.forEach(function (a) {
						if (a.alert_text) {
							rowShow = true;
							a.rowshow = true;
						}
						else {
							a.rowshow = false;
						}
					});
					v.rowshow = rowShow;
				})
			}
			else {
				$scope.wordButtonAlert = 'הצג';
				$scope.appData.trialBalance.forEach(function (v) {
					v.rowshow = false;
					v.tableShow = true;

					v.level_1.level_2.forEach(function (a) {
						a.rowshow = true;
					});
				})
			}
		}
		$scope.appData.redErrorFilterType = false;
		$scope.disabledDates = function () {
			function shortDates(dates) {
				return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
			}
			$scope.appData.redErrorFilterType = false;
			if ($scope.appData.dateFilterTypesTrial == '2' && shortDates('01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear)) {
				$scope.appData.redErrorFilterType = '2';
			}
			else {
				$scope.appData.redErrorFilterType = false;
			}
		}

		$scope.openRowsButtonSearch = function () {
			$scope.customAlert = true;
			$scope.wordButtonAlert = 'הצג';
			$scope.custom = false;
			$scope.wordButton = 'סגור';
		}

		$scope.refresh = function () {
			$scope.loadPageBalance();
		};
		$scope.$on('refresh', function () {
			$scope.refresh();
		});
		$scope.help = function () {
			window.open('http://bizibox.biz/help/bookkeeping', '_blank');
		};
		$scope.sending = function (dataExcel) {
			serverConnection.sendMail(dataExcel).then(function (res) {
				$scope.error = 'המייל נשלח בהצלחה';
				$scope.hidePopup();
			}, function (error) {
				$scope.error = 'המייל לא נשלח בהצלחה';
			});
		};
		$scope.sendMailer = function () {
			$scope.showPopup('views/templates/mailerTrial.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});

	}


	angular.module('controllers')
		.controller('trialBalanceCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', trialBalanceCtrl]);
}());




