(function () {
	function billingCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(5);
		$scope.date = new Date();
		$scope.refrashMinutes = 5;
		$scope.loaderAccBank = true;

		$scope.nextPage = $state.params.url;
		$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
		$scope.fromDate = new Date();
		$scope.toDate = new Date((new Date()).setDate(new Date().getDate() + 500));
		$scope.fromMonYear = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		$scope.toMonYear = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1);
		$scope.fromDatePick = new Date();
		$scope.toDatePick = new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate());


		$scope.init = function () {
			$scope.appData.searchBill = "";
			$scope.loaderAccMainBill = true;
			$scope.appData.tabAccBill = 1;
			$scope.appData.selectBill = "null";
			var datesTime = new Date();
			$scope.datesPicker = ("0" + (parseInt(datesTime.getDate()))).slice(-2) + "/" + ("0" + (parseInt(datesTime.getMonth() + 1))).slice(-2) + "/" + datesTime.getFullYear();

			$scope.appData.dateFilter = {
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
			$scope.appData.datesPicker = {
				fromDatePicker: ("0" + (parseInt($scope.fromDatePick.getDate()))).slice(-2) + '/' + ("0" + (parseInt($scope.fromDatePick.getMonth() + 1))).slice(-2) + '/' + $scope.fromMonYear.getFullYear(),
				toDatePicker: ("0" + (parseInt($scope.toDatePick.getDate()))).slice(-2) + '/' + ("0" + (parseInt($scope.toDatePick.getMonth() + 1))).slice(-2) + '/' + $scope.toDatePick.getFullYear()
			};
			$scope.appData.arrPayType = [
				{
					'serchkeyId': '2802e927-1ec7-462a-9f9c-2580f939cc71',
					'paymentTypeName': 'שיק',
					'paymentType': 1
				},
				{
					'serchkeyId': 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f',
					'paymentTypeName': 'צפי',
					'paymentType': 10
				},
				{
					'serchkeyId': 'bae4449d-c934-4ea0-abf6-762f25a35c3d',
					'paymentTypeName': 'העברה בנקאית',
					'paymentType': 9
				}
			];
			$scope.appData.openDialogSelect = false;
			$scope.appData.dateFilterTypesBill = '00';
			$scope.appData.addTypePeulaPopUpForm = false;
			$scope.appData.redErrorFilterType = false;
			$scope.appData.openDialog = false;
			$scope.appData.alertSucUpd = false;
			$scope.appData.alertSucAdd = false;
			$scope.appData.Excel_delete_old_payments = false;

			$scope.loadAccBiling();
		}
		$scope.scrollHeightTable = 325;
		$scope.maxSize = 10;
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
		$scope.disabledDates = function () {
			function shortDates(dates) {
				return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
			}

			$scope.appData.redErrorFilterType = false;
			if ($scope.appData.dateFilterTypesBill == '1' && shortDates($scope.appData.datesPicker.fromDatePicker) > shortDates($scope.appData.datesPicker.toDatePicker)) {
				$scope.appData.redErrorFilterType = '1';
			}
			else if ($scope.appData.dateFilterTypesBill == '2' && shortDates('01/' + ("0" + (parseInt($scope.appData.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.appData.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.toYear)) {
				$scope.appData.redErrorFilterType = '2';
			}
			else {
				$scope.appData.redErrorFilterType = false;
			}
		}

		$scope.$parent.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			if (!$scope.appData.selectedCompanyIndexLink) {
				if ($scope.appData.selectedCompany.hanhahPrivilege == true) {
					$state.go('overviewAcc.statistics');
				}
				else {
					$state.go('overviewAcc.ksafim');
				}
			}
			$scope.appData.selectedCompanyIndexLink = false;
		};

		$scope.returnCompare = function (report_num) {
			var num = false;
			$scope.appData.adminReports.forEach(function (v, i) {
				if (!v.lineBreakGroup && v.report_num == report_num) {
					num = true;
				}
			})
			return num;
		};
		$scope.freeze = function (id) {
			var data = {
				"billing_payment_id": id,
				"status": "9999"
			}
			serverConnection.payment_update_status(data).then(function (res) {
				$scope.loadAccBiling();
			}, function (error) {
			});
		}
		$scope.pays = function (id, name) {
			$scope.appData.userPayInfo = {
				id: id,
				name: name
			}
			$scope.showPopup('views/templates/alertPaysAppr.html?ver=3.74' + new Date().getTime(), 'alerts', true);
		}

		$scope.paysAppr = function () {
			var data = {
				"billing_payment_id": $scope.appData.userPayInfo.id,
				"status": "1"
			}
			serverConnection.payment_update_status(data).then(function (res) {
				$scope.hidePopup()
				$scope.get_chayavim_masach();
			}, function (error) {
				$scope.hidePopup()
			});
		}
		$scope.loadAccBiling = function () {
			$scope.loaderAccMainBill = true;
			$scope.appData.searchBill = "";
			$scope.appData.PAYMENTTABS = "1";
			// var dateSpl = $scope.datesPicker.split("/");
			// var datesTime = new Date(parseFloat(dateSpl[2]), parseFloat(dateSpl[1]) - 1, parseFloat(dateSpl[0]));
			// var dates = datesTime.getFullYear() + "" + ("0" + (parseInt(datesTime.getMonth() + 1))).slice(-2) + "" + ("0" + (parseInt(datesTime.getDate()))).slice(-2);

			$scope.loaderAccBank = true;

			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			var fromDate, toDate;
			switch ($scope.appData.dateFilterTypesBill) {
				case "00":
					fromDate = $scope.datesPicker;
					toDate = $scope.datesPicker;
					$scope.textTitlePage = '  ' + ' היום';
					break;
				case "0":
					fromDate = '01' + '/' + ("0" + (parseInt($scope.appData.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.byYear;
					toDate = daysInMonth(parseInt($scope.appData.dateFilter.byMonth) + 1, $scope.appData.dateFilter.byYear) + '/' + ("0" + (parseInt($scope.appData.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.byYear;
					$scope.textTitlePage = '  ' + ' חודש' + ' ' + ("0" + (parseInt($scope.appData.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.byYear;
					break;
				case "1":
					fromDate = $scope.appData.datesPicker.fromDatePicker.toString().split('/')[0] + '/' + $scope.appData.datesPicker.fromDatePicker.toString().split('/')[1] + '/' + $scope.appData.datesPicker.fromDatePicker.toString().split('/')[2];
					toDate = $scope.appData.datesPicker.toDatePicker.toString().split('/')[0] + '/' + $scope.appData.datesPicker.toDatePicker.toString().split('/')[1] + '/' + $scope.appData.datesPicker.toDatePicker.toString().split('/')[2];
					$scope.textTitlePage = ' ' + 'בין תאריכים' + ' ' + fromDate + '-' + toDate;
					break;
				case "2":
					fromDate = '01/' + ("0" + (parseInt($scope.appData.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.fromYear;
					toDate = daysInMonth(parseInt($scope.appData.dateFilter.toMonth) + 1, $scope.appData.dateFilter.toYear) + '/' + ("0" + (parseInt($scope.appData.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.toYear;
					$scope.textTitlePage = '  ' + 'בין חודשים' + ' ' + ("0" + (parseInt($scope.appData.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.fromYear + '-' + ("0" + (parseInt($scope.appData.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.toYear;
					break;
			}
			var dates = {
				"date_from": fromDate,
				"date_till": toDate
			}
			$scope.appData.datesTazrimEx = fromDate + '-' + toDate;

			serverConnection.get_hiuvim_masach(dates).then(function (res) {
				$scope.appData.itemsBillMain = res;
				$scope.filterData();

				$scope.loaderAccMainBill = false;
			}, function (error) {

			});
		};
		$scope.get_chayavim_masach = function () {
			$scope.loaderAccMainBill = true;
			$scope.appData.searchBill2 = "";
			serverConnection.get_chayavim_masach().then(function (res) {
				$scope.appData.get_chayavim_masachAll = res;
				$scope.appData.sumOfGet_chayavim_masach = 0;
				$scope.appData.sumsOfChayavimAll = {
					tazrimSum: 0,
					tazrimCount: 0,
					accSum: 0,
					accCount: 0
				}

				$scope.appData.get_chayavim_masachAll.forEach(function (v, i) {
					$scope.appData.sumOfGet_chayavim_masach += v.SUMTOBILL;

					if (v.IND_ACCOUNTANT == 0) {
						$scope.appData.sumsOfChayavimAll.tazrimCount += 1;
						$scope.appData.sumsOfChayavimAll.tazrimSum += v.SUMTOBILL;
					}
					if (v.IND_ACCOUNTANT == 1) {
						$scope.appData.sumsOfChayavimAll.accCount += 1;
						$scope.appData.sumsOfChayavimAll.accSum += v.SUMTOBILL;
					}
				});
				$scope.appData.filter2 = 'all';
				$scope.filterData2();
				$scope.loaderAccMainBill = false;
			}, function (error) {

			});
		};

		$scope.filterData = function (filter) {
			$scope.appData.itemsBill = angular.copy($scope.appData.itemsBillMain);
			$scope.appData.itemsBill = $filter('filterSearchBill')($scope.appData.itemsBill, $scope.appData.searchBill);
			if ($scope.appData.selectBill !== "null") {
				$scope.appData.itemsBill = $filter('filterSearchBillSelect')($scope.appData.itemsBill, $scope.appData.selectBill);
			}
			$scope.count_paymet_tab = {
				normal: 0,
				fails: 0,
				failsToday: 0,
				success: 0,
				billable: 0,
				totalSumPay: 0,
				totalSumFailed: 0,
				zefi: 0
			}
			var day_id = ('0' + (new Date().getDate())).slice(-2) + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear();
			$scope.appData.itemsBillAllLen = 0;
			$scope.appData.itemsBill.forEach(function (v, i) {
				if (v.IND_ZEFI === 0) {
					$scope.appData.itemsBillAllLen += 1;
					if (v.PAYMENT_TAB == 0) {
						$scope.count_paymet_tab.totalSumPay += v.SUMTOBILL;
						$scope.count_paymet_tab.normal += 1;
					}
					if (v.PAYMENT_TAB == 1) {
						$scope.count_paymet_tab.totalSumFailed += v.SUMTOBILL;
						$scope.count_paymet_tab.fails += 1;
					}
					if (v.PAYMENT_TAB == 2) {
						$scope.count_paymet_tab.billable += 1;
					}
					if (v.STATUS !== null && v.STATUS > 0 && (v.PAYMENT_DATE == v.ORIGINAL_PAYMENT_DATE)) {
						$scope.count_paymet_tab.failsToday += 1;
					}
				}

				if (v.STATUS === 0 && ((Math.abs(new Date(v.PAYMENT_DATE.replace(/^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/, "$2/$1/$3")) - new Date(v.ORIGINAL_PAYMENT_DATE.replace(/^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/, "$2/$1/$3"))) / 1000) / 86400) > 3) {
					$scope.count_paymet_tab.success += 1;
				}
				if (v.IND_ZEFI === 1) {
					$scope.count_paymet_tab.zefi += v.SUMTOBILL;
				}
			});
			if ($scope.appData.PAYMENTTABS == "1") {
				$scope.appData.itemsBill = $filter('myfilter')($scope.appData.itemsBill, {
					INDZEFI: true
				});
			}
			if ($scope.appData.PAYMENTTABS == "3") {
				$scope.appData.itemsBill = $filter('myfilter')($scope.appData.itemsBill, {
					ORIGINAL_PAYMENT_DATE: true
				});
			}
			if ($scope.appData.PAYMENTTABS == "4") {
				$scope.appData.itemsBill = $filter('myfilter')($scope.appData.itemsBill, {
					ORIGINAL_PAYMENT_DATE_payment_date: true
				});
			}
		}
		$scope.filterData2 = function (filter) {
			$scope.appData.get_chayavim_masach = angular.copy($scope.appData.get_chayavim_masachAll);
			$scope.appData.get_chayavim_masach = $filter('filterSearchBill')($scope.appData.get_chayavim_masach, $scope.appData.searchBill2);
			if (filter !== undefined || $scope.appData.filter2 !== 'all') {
				if (filter !== undefined) {
					$scope.appData.filter2 = filter;
				}
				else {
					filter = $scope.appData.filter2;
				}
				$scope.appData.get_chayavim_masach = $filter('myfilter')($scope.appData.get_chayavim_masach, {
					IND_ACCOUNTANT: true,
					acc: Number(filter)
				});
			}
			$scope.ignore = true;
		}

		$scope.checkpopPasswordCompaiesTab = function (showPopPasswordForm) {
			if (showPopPasswordForm.$valid) {
				$scope.showPopPassword = true;
			}
		}
		$scope.clickNavQa = function (id, tab) {
			$state.go('mainAccountants.bankDataManagement.view');
			$scope.loaderAccBank = true;
			$scope.appData.activeNavQa = id;
			localStorage.setItem('activeNavQa', $scope.appData.activeNavQa);
			if (tab) {
				$scope.appData.adminReports = undefined;
			}
			serverConnection.adminReportsId1($scope.appData.activeNavQa).then(function (res) {
				var adminReports = res;
				if (adminReports.length > 0) {
					adminReports = $filter('orderBy')(adminReports, 'report_num');
					var arrAdmin = [];
					var nums = parseInt(adminReports[0].report_num / 100);
					var newObj = false;
					adminReports.forEach(function (v, i) {
						if ($scope.appData.adminReports !== undefined && $scope.returnCompare(v.report_num) == false) {
							v.newObj = true;
							newObj = true;
						}
						arrAdmin.push(v)
						if (i > 0) {
							if (parseInt(v.report_num / 100) !== nums) {
								arrAdmin.splice(arrAdmin.length - 1, 0, {
									'lineBreakGroup': true
								});
							}
							nums = parseInt(v.report_num / 100);
						}
						if (adminReports.length == i + 1) {
							$scope.appData.adminReports = arrAdmin;
							$scope.loaderAccBank = false;
							if (newObj == true) {
								document.getElementById("audioQa").pause();
								document.getElementById("audioQa").currentTime = 0;
								document.getElementById("audioQa").play();
							}
						}
					})
				}
				else {
					$scope.appData.adminReports = res;
					$scope.loaderAccBank = false;
				}
			}, function (error) {
				$scope.loaderAccBank = false;
			});
		}

		$scope.sort_by = function (predicate) {
			$scope.ignore = false;
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		};
		$scope.prepare_billing = function () {
			var data = {
				"billing_account_id": null,
				"date": null
			}
			serverConnection.prepare_billing(data)
			.then(function (res) {
			})
		}
		$scope.run_billing = function () {
			serverConnection.run_billing()
			.then(function (res) {
			})
		}
		$scope.refrashPage = function () {
			$scope.loadAccBankAdminPage()
		}
		$scope.sending = function (dataExcel) {
			serverConnection.sendMail(dataExcel).then(function (res) {
				$scope.error = 'המייל נשלח בהצלחה';
				$scope.hidePopup();
			}, function (error) {
				$scope.error = 'המייל לא נשלח בהצלחה';
			});
		};
		$scope.sendMailer = function (type) {
			if (type == 1) {
				$scope.showPopup('views/templates/mailerAccBill.html?ver=3.74', 'mailerPopup', false);
			}
			if (type == 2) {
				$scope.showPopup('views/templates/mailerAccBill2.html?ver=3.74', 'mailerPopup', false);
			}
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
		$scope.$parent.refresh = function () {
			if ($scope.appData.tabAccBill == 2) {
				$scope.get_chayavim_masach();
			}
			else {
				$scope.loadAccBiling();
			}
		};
		$scope.help = function () {
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {
			if (newVal == false) {
				$scope.error = '';
			}
		});
	}


	angular.module('controllers')
	.controller('billingCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', billingCtrl]);
}());
