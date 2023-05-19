(function () {
	function checksAnalysisCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.$utils = utils;
		$scope.accoConversions = accoConversions;
		$scope.appData = AppData;
		$scope.nextPage = $state.params.url;
		$scope.months = utils.monthNames();
		$scope.years = utils.yearsKsafim(3);
		$scope.date = new Date();
		$scope.first = true;
		$scope.showAlertNull = false;
		$scope.accountFilter = {company_account_id: ''};
		$scope.paymentTypeFilter = {ind_total: ''};
		$scope.solekFilter = {};
		$scope.selectedSolkim = '';
		$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
		$scope.fromDate = new Date((new Date()).setDate(new Date().getDate() - 50));
		$scope.toDate = new Date((new Date()).setDate(new Date().getDate() + 500));
		$scope.fromMonYear = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
		$scope.toMonYear = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
		$scope.fromDatePick = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7);
		$scope.toDatePick = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 14);
		$scope.appData.dateFilterTypesChecks = '00';
		$scope.dateFilter = {
			type: "1",
			byMonth: $scope.fromDate.getMonth(),
			byYear: $scope.fromDate.getFullYear(),
			fromDate: new Date((new Date()).setDate(new Date().getDate() - 50)),
			toDate: new Date((new Date()).setDate(new Date().getDate() + 500)),
			fromMonth: $scope.fromMonYear.getMonth(),
			fromYear: $scope.fromMonYear.getFullYear(),
			toMonth: $scope.toMonYear.getMonth(),
			toYear: $scope.toMonYear.getFullYear()
		};
		$scope.datesPicker = {
			fromDatePicker: ("0" + (parseInt($scope.fromDatePick.getDate()))).slice(-2) + '/' + ("0" + (parseInt($scope.fromDatePick.getMonth() + 1))).slice(-2) + '/' + $scope.fromMonYear.getFullYear(),
			toDatePicker: ("0" + (parseInt($scope.toDatePick.getDate()))).slice(-2) + '/' + ("0" + (parseInt($scope.toDatePick.getMonth() + 1))).slice(-2) + '/' + $scope.toDatePick.getFullYear()
		};
		var orderBy = $filter('orderBy');
		$scope.appData.redErrorFilterType = false;
		$scope.disabledDates = function () {
			function shortDates(dates) {
				return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
			}

			$scope.appData.redErrorFilterType = false;
			if ($scope.appData.dateFilterTypesChecks == '1' && shortDates($scope.datesPicker.fromDatePicker) > shortDates($scope.datesPicker.toDatePicker)) {
				$scope.appData.redErrorFilterType = '1';
			}
			else if ($scope.appData.dateFilterTypesChecks == '2' && shortDates('01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear)) {
				$scope.appData.redErrorFilterType = '2';
			}
			else {
				$scope.appData.redErrorFilterType = false;
			}
		}
		$scope.loaderAnalysis = false;
		$scope.init = function () {
			$scope.tab = 'incomeChecks';
			$scope.tabStatus = -1;
			$scope.appData.showCheckAllNull = false;
			$scope.loaderChecks = false;
			$scope.reverse = true;
		};
		$scope.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			$scope.appData.changeListAnalisis = false;
			$scope.getCompanyAccounts().then(function (res) {
				$scope.appData.selectedCompany.accounts = res;
				if($scope.appData.selectedCompany.accounts.bank_account_list !== null){
					$scope.appData.banksListChecks = [];
					$scope.appData.banksListChecks.push({
						'company_account_nickname': 'כל הבנקים',
						'company_account_id': 'null'
					})
					$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
						$scope.appData.banksListChecks.push(v)
					});
					$scope.appData.selectedBankChecks = $scope.appData.banksListChecks[0];
					$scope.loadPage();
				}
				else{
					$scope.appData.showCheckAllNull = true;
					$scope.loaderChecks = true;
				}
			}, function (error) {
			});
		};
		$scope.loadPage = function () {
			$scope.loaderChecks = false;

			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			var fromDate, toDate;
			switch ($scope.appData.dateFilterTypesChecks) {
				case "00":
					fromDate = null;
					toDate = null;
					break;
				case "0":
					fromDate = '01' + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					break;
				case "1":
					fromDate = $scope.datesPicker.fromDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[2];
					toDate = $scope.datesPicker.toDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[2];
					break;
				case "2":
					fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, $scope.dateFilter.toYear) + '/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
					break;
			}
			var req = {
				'company_id': $scope.appData.selectedCompany.companyId,
				'company_account_id': $scope.appData.selectedBankChecks.company_account_id,
				'date_from': fromDate,
				'date_till': toDate
			}
			if (fromDate == null) {
				$scope.appData.datesChecksSort = 'כל השיקים';
			}
			else {
				$scope.appData.datesChecksSort = fromDate + '-' + toDate;
			}
			if ($scope.tab == 'incomeChecks') {
				serverConnection.companyGetinchequesSum(req).then(function (res) {
					$scope.appData.companyGetinchequesSum = res;
					$scope.appData.companyGetinchequesSumSelect = res;
					$scope.openChecksList($scope.tabStatus);
				}, function (error) {
				});
			}
			else {
				serverConnection.companyGetoutchequesSum(req).then(function (res) {
					$scope.appData.companyGetinchequesSum = res;
					$scope.appData.companyGetinchequesSumSelect = res;
					$scope.openChecksList($scope.tabStatus);
				}, function (error) {
				});
			}
		};
		$scope.openChecksList = function (statusId) {
			$scope.tabStatus = statusId;
			$scope.appData.tabStatusPopStatus = statusId;
			$scope.loaderChecks = false;
			//if (statusId == -1)
			//	statusId = null;
			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			var fromDate, toDate;
			switch ($scope.appData.dateFilterTypesChecks) {
				case "00":
					fromDate = null;
					toDate = null;
					break;
				case "0":
					fromDate = '01' + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					break;
				case "1":
					fromDate = $scope.datesPicker.fromDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[2];
					toDate = $scope.datesPicker.toDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[2];
					break;
				case "2":
					fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, $scope.dateFilter.toYear) + '/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
					break;
			}
			var req = {
				'company_id': $scope.appData.selectedCompany.companyId,
				'company_account_id': $scope.appData.selectedBankChecks.company_account_id,
				'status_id': statusId,
				'date_from': fromDate,
				'date_till': toDate
			}
			if ($scope.tab === 'incomeChecks') {
				serverConnection.companyGetinchequesPerut(req).then(function (res) {
					$scope.appData.companyGetinchequesPerut = res;
					$scope.loaderChecks = true;
					$scope.appData.companyGetinchequesPerut.forEach(function (v) {
						if (v.due_date)
							v.dates = v.due_date.split('/')[2] + '' + v.due_date.split('/')[1] + '' + v.due_date.split('/')[0];
					});
					$scope.order('dates', false);
				}, function (error) {
				});
			}
			else {
				serverConnection.companyGetoutchequesPerut(req).then(function (res) {
					$scope.appData.companyGetinchequesPerut = res;
					$scope.loaderChecks = true;
					$scope.appData.companyGetinchequesPerut.forEach(function (v) {
						if (v.due_date)
							v.dates = v.due_date.split('/')[2] + '' + v.due_date.split('/')[1] + '' + v.due_date.split('/')[0];
					});
					$scope.order('dates', false);
				}, function (error) {
				});
			}
		}
		$scope.order = function (predicate, reverse) {
			$scope.clsHref = predicate;
			$scope.appData.companyGetinchequesPerut = orderBy($scope.appData.companyGetinchequesPerut, predicate, reverse);
		};
		$scope.openChecksListPop = function (statusId) {
			//if (statusId == -1)
			//	statusId = null;
			$scope.appData.checksPopMatchRadio = '';
			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			var fromDate, toDate;
			switch ($scope.appData.dateFilterTypesChecks) {
				case "00":
					fromDate = null;
					toDate = null;
					break;
				case "0":
					fromDate = '01' + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					break;
				case "1":
					fromDate = $scope.datesPicker.fromDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[2];
					toDate = $scope.datesPicker.toDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[2];
					break;
				case "2":
					fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, $scope.dateFilter.toYear) + '/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
					break;
			}
			var req = {
				'company_id': $scope.appData.selectedCompany.companyId,
				'company_account_id': $scope.appData.selectedBankChecks.company_account_id,
				'status_id': statusId,
				'date_from': fromDate,
				'date_till': toDate
			}
			serverConnection.companyGetinchequesPerut(req).then(function (res) {
				var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;

				function dmyOrdA(a, b) {
					a = a.due_date.replace(dateRE, "$3$2$1");
					b = b.due_date.replace(dateRE, "$3$2$1");
					if (a > b) return 1;
					if (a < b) return -1;
					return 0;
				}

				res.sort(dmyOrdA);
				$scope.appData.companyGetinchequesPerutPop = res;

			}, function (error) {
			});
		};
		$scope.deleteRowServer = function (data) {
			var def = $q.defer();
			serverConnection.deleteTazrimRow(data).then(function (response) {
				def.resolve(response);
			}, function (error) {
				def.reject(error)
			});
			return def.promise;
		};
		$scope.deleteRow = function (id) {
			var data = {
				sign_type: 0,
				payment_type_id: 1,
				trans_id: id
			}
			$scope.deleteRowServer(JSON.stringify(data)).then(function (suc) {
				$scope.openChecksList($scope.tabStatus);
			}, function (error) {
			});
		}
		// $scope.searchText = function (row) {
		// 	return row.total.toString().indexOf($scope.query || '') !== -1 || row.payment_desc.indexOf($scope.query || '') !== -1 || row.cheque_no.toString().indexOf($scope.query || '') !== -1;
		// };
		$scope.showTooltip = false;
		$scope.dataTool = false;
		$scope.setChecksPop = function (formPopAcc) {
			if (formPopAcc.$valid) {
				$scope.hidePopup();
				var data = {
					tnChequePaymentId: $scope.appData.checksForMatch.ifact_cheque_payment_id,
					targetChequePaymentId: $scope.appData.checksPopMatchRadio
				}
				serverConnection.chequesHathamaCreate(data).then(function (res) {
					$scope.loadPage()
				}, function (error) {
				});
			}
		}
		$scope.checkIfNone = function (a) {
			if (a) {

				if (a.length > 0) {
					var ret = true;
					a.forEach(function (v) {
						if (v.source_program_id == null || v.source_program_id == 8881) {
							ret = false;
						}
					})
					return ret;
				}
				else {
					return true;
				}
			}

		}
		$scope.loadNickNameBank = function (uuid) {
			var nick;
			if (uuid) {
				$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
					if (v.company_account_id == uuid) {
						nick = v.company_account_nickname.trim().replace(/\s+/g, " ");
					}
				});
			}
			return nick;
		}
		$scope.loadIdBank = function (uuid) {
			var nick;
			$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
				if (v.company_account_id == uuid) {
					nick = v.bank_id;
				}
			});
			return nick;
		}
		$scope.openCheckMatch = function (a) {
			$scope.appData.checksForMatch = a;
			$scope.openChecksListPop($scope.appData.tabStatusPopStatus);
			$scope.showPopup('views/templates/checksForMatch.html?ver=3.80', 'checksForMatch');
		}
		$scope.refresh = function () {
			$scope.loadPage();
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
			$scope.showPopup('views/templates/mailerChecks.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});
	}

	angular.module('controllers')
	.controller('checksAnalysisCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', checksAnalysisCtrl]);
}());

