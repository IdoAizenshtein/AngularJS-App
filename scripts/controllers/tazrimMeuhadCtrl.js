(function () {
	function tazrimMeuhadCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $anchorScroll) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.$utils = utils;
		$scope.accoConversions = accoConversions;
		$scope.appData = AppData;
		$scope.nextPage = $state.params.url;
		$scope.months = utils.monthNames();
		$scope.years = utils.yearsKsafim(3);
		$scope.date = new Date();
		$scope.dataChange = true;
		$scope.appData.dateFilterTypesMeuhad = '00';
		$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
		$scope.fromDate = new Date();
		$scope.toDate = new Date((new Date()).setMonth(new Date().getMonth() + 2));
		$scope.appData.redErrorFilterType = false;
		$scope.disabledDates = function () {
			function shortDates(dates) {
				return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
			}

			$scope.appData.redErrorFilterType = false;
			if ($scope.appData.dateFilterTypesMeuhad == '1' && shortDates($scope.datesPicker.fromDatePicker) > shortDates($scope.datesPicker.toDatePicker)) {
				$scope.appData.redErrorFilterType = '1';
			}
			else if ($scope.appData.dateFilterTypesMeuhad == '2' && shortDates('01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear)) {
				$scope.appData.redErrorFilterType = '2';
			}
			else {
				$scope.appData.redErrorFilterType = false;
			}
		}
		$scope.dateFilter = {
			type: "1",
			byMonth: $scope.fromDate.getMonth(),
			byYear: $scope.fromDate.getFullYear(),
			fromDate: new Date((new Date()).setDate(new Date().getDate() - 50)),
			toDate: new Date((new Date()).setDate(new Date().getDate() + 500)),
			fromMonth: $scope.firstDayOfYear.getMonth(),
			fromYear: $scope.firstDayOfYear.getFullYear(),
			toMonth: $scope.lastDayOfYear.getMonth(),
			toYear: $scope.lastDayOfYear.getFullYear()
		};
		$scope.datesPicker = {
			fromDatePicker: (($scope.firstDayOfYear.getDate().toString().length == 2) ? $scope.firstDayOfYear.getDate() : '0' + $scope.firstDayOfYear.getDate()) + '/' + (($scope.firstDayOfYear.getMonth().toString().length == 2) ? ($scope.firstDayOfYear.getMonth() + 1) : '0' + ($scope.firstDayOfYear.getMonth() + 1)) + '/' + $scope.firstDayOfYear.getFullYear(),
			toDatePicker: (($scope.lastDayOfYear.getDate().toString().length == 2) ? $scope.lastDayOfYear.getDate() : '0' + $scope.lastDayOfYear.getDate()) + '/' + (($scope.lastDayOfYear.getMonth().toString().length == 2) ? ($scope.lastDayOfYear.getMonth() + 1) : '0' + ($scope.lastDayOfYear.getMonth() + 1)) + '/' + $scope.lastDayOfYear.getFullYear()
		};
		$scope.initOnload = false;
		$scope.init = function () {
			$scope.loaderTazrimMeuhad = false;
			if ($scope.$state.current.url == "/tazrimMeuhad") {
				$scope.$state.go('tazrimMeuhad.table');
			}
		};
		$scope.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.appData.dateFilterTypesMeuhad = '00';
			$scope.$broadcast('widthChanged');
			$scope.getCompanyAccounts().then(function (res) {
				$scope.appData.selectedCompany.accounts = res;
				$scope.loadPage();
			}, function (error) {
			});
		};
		$scope.loadPage = function (from, till) {
			$scope.loaderTazrimMeuhad = false;

			if (from) {
				$scope.appData.dateFilterTypesMeuhad = '1';
				$scope.datesPicker = {
					fromDatePicker: from,
					toDatePicker: till
				};
			}
			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			var fromDate, toDate;
			switch ($scope.appData.dateFilterTypesMeuhad) {
				case "00":
					fromDate = ("0" + ($scope.fromDate.getDate())).slice(-2) + '/' + ("0" + ($scope.fromDate.getMonth() + 1)).slice(-2) + '/' + $scope.fromDate.getFullYear();
					toDate = ("0" + ($scope.toDate.getDate())).slice(-2) + '/' + ("0" + ($scope.toDate.getMonth() + 1)).slice(-2) + '/' + $scope.toDate.getFullYear();
					$scope.textTitlePage = '  ' + ' החודשיים הקרובים';
					break;
				case "0":
					fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					$scope.textTitlePage = '  ' + ' חודש' + ' ' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					break;
				case "1":
					fromDate = $scope.datesPicker.fromDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[2];
					toDate = $scope.datesPicker.toDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[2];
					$scope.textTitlePage = ' ' + 'בין תאריכים' + ' ' + $scope.datesPicker.fromDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[2] + '-' + $scope.datesPicker.toDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[2];
					break;
				case "2":
					fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, $scope.dateFilter.toYear) + '/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
					$scope.textTitlePage = '  ' + 'בין חודשים' + ' ' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear + '-' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
					break;
			}
			var data = {
				company_id: $scope.appData.selectedCompany.companyId,
				date_from: fromDate,
				date_till: toDate
			};
			$scope.appData.dateFromEndMeuhad = {
				fromDate: fromDate,
				toDate: toDate
			}
			serverConnection.getTazrim(data).then(function (res) {
				$scope.appData.tazrimMeuhad = res;

				//$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (val) {
				//	var aa = [], cc = [];
				//	$scope.appData.tazrimMeuhad.forEach(function (v, index) {
				//		//aa.push(v.day_id);
				//		var ii = [], iii = 0;
				//		v.rows.forEach(function (v1, index) {
				//			if (v1.company_account_id == val.company_account_id) {
				//				console.log(v1.company_account_id, v1.total_itra,  v.day_id);
				//				//if (ii.length) {
				//				//	ii.forEach(function (aa) {
				//				//		if (aa == v1.company_account_id) {
				//				//			console.log(aa, v.day_id);
				//				//			iii = 1;
				//				//		}
				//				//	});
				//				//}
				//				//if (iii == 0) {
				//				//	console.log(aa, v.day_id);
				//				//	ii.push(v1.company_account_id);
				//				//}
				//			}
				//		});
				//		cc.push(ii);
				//	});
				//	console.log(cc.length)
				//	console.log(aa.length)
				//});

				if ($scope.appData.tazrimMeuhad.length) {
					$scope.appData.counterCompanyExists = 0;
					$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
						v.isExists = false;
						$scope.appData.tazrimMeuhad[0].rows.forEach(function (val) {
							if (val.company_account_id == v.company_account_id) {
								v.isExists = true;
							}
						})
						if (v.isExists) {
							$scope.appData.counterCompanyExists += 1;
						}
					});
					$scope.loaderTazrimMeuhad = true;
					$scope.initOnload = !$scope.initOnload;
					var months = [], totalIncomesPlot = [], totalExpensesPlot = [], monthsSumsIncome = [[]], monthsSumsExpenses = [[]];
					$scope.appData.tazrimMeuhad.forEach(function (v, index) {
						months.push(v.day_id);
						if ($scope.loadTooltipsShow(v.rows)) {
							$scope.loadTooltips(v.rows).forEach(function (d) {
								var val;
								if (d.hachnasa) {
									val = d.hachnasa;
								}
								else {
									val = d.hozaa;
								}
								monthsSumsIncome[index].push({
									Val: parseInt(val),
									name: d.trans_name
								});
							})
							monthsSumsIncome.push([]);
						}
						else {
							monthsSumsIncome.push([]);
						}
						if ($scope.loadTooltipsShowHozaot(v.rows)) {
							$scope.loadTooltipsHozaot(v.rows).forEach(function (d) {
								var val;
								if (d.hachnasa) {
									val = d.hachnasa;
								}
								else {
									val = d.hozaa;
								}
								monthsSumsExpenses[index].push({
									Val: parseInt(val),
									name: d.trans_name
								});
							})
							monthsSumsExpenses.push([]);
						}
						else {
							monthsSumsExpenses.push([]);
						}
						v.rows.forEach(function (a) {
							if (a.company_account_id == null) {
								var date = v.day_id.split("/");
								var fullDate = new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0])).getTime();
								totalIncomesPlot.push([fullDate, a.total_hacnasot.content]);
								totalExpensesPlot.push([fullDate, a.total_hozaot.content]);
							}
						})
					});
					$scope.chartDataSrc = {
						zoomType: 'xy',
						spacingTop: 55,
						spacingLeft: 0,
						spacingRight: 0,
						borderColor: '#d8d8d8',
						borderWidth: 1,
						borderRadius: 3,
						legend: true,
						xAxis: false,
						reversed: true,
						yLabel: 'סה״כ בש״ח',
						data: [{
							cursor: 'pointer',
							name: 'הכנסות',
							lineWidth: 2,
							color: '#62b03f',
							states: {
								hover: {
									lineWidth: 2,
									color: '#62b03f'
								}
							},
							marker: {
								symbol: 'circle'
							},
							data: totalIncomesPlot
						}, {
							cursor: 'pointer',
							name: 'הוצאות',
							lineWidth: 2,
							color: '#ec3c66',
							states: {
								hover: {
									lineWidth: 2,
									color: '#ec3c66'
								}
							},
							marker: {
								symbol: 'circle'
							},
							data: totalExpensesPlot
						}],
						title: ' ',
						subtitle: ' ',
						tooltips: [monthsSumsIncome, monthsSumsExpenses]
					}
				}
				else {
					$scope.loaderTazrimMeuhad = true;
				}
			}, function (error) {
			});
		};
		$scope.loadTooltips = function (arr) {
			var tooltip = [];
			arr.forEach(function (b) {
				if (b.company_account_id !== null && b.total_hacnasot.peoulot !== null && b.total_hacnasot.peoulot.length !== 0) {
					b.total_hacnasot.peoulot.forEach(function (v) {
						tooltip.push(v);
					})
				}
			})
			return tooltip;
		}
		$scope.loadTooltipsShow = function (arr) {
			var tooltip = false;
			arr.forEach(function (b) {
				if (b.company_account_id !== null && b.total_hacnasot.peoulot !== null && b.total_hacnasot.peoulot.length !== 0) {
					tooltip = true;
				}
			})
			return tooltip;
		}
		$scope.loadTooltipsHozaot = function (arr) {
			var tooltip = [];
			arr.forEach(function (b) {
				if (b.company_account_id !== null && b.total_hozaot.peoulot !== null && b.total_hozaot.peoulot.length !== 0) {
					b.total_hozaot.peoulot.forEach(function (v) {
						tooltip.push(v);
					})
				}
			})
			return tooltip;
		}
		$scope.loadTooltipsShowHozaot = function (arr) {
			var tooltip = false;
			arr.forEach(function (b) {
				if (b.company_account_id !== null && b.total_hozaot.peoulot !== null && b.total_hozaot.peoulot.length !== 0) {
					tooltip = true;
				}
			})
			return tooltip;
		}
		$scope.addMonth = function (month, day) {
			var m = parseInt(month.toString().split('/')[1]) - 1;
			var days = parseInt(month.toString().split('/')[0]);
			var dates = new Date();
			dates.setFullYear(parseInt(month.toString().split('/')[2]));
			dates.setMonth(m);
			dates.setDate(days + day);
			return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear();
		};
		$scope.returnMonth = function (month, day) {
			var m = parseInt(month.toString().split('/')[1]) - 1;
			var days = parseInt(month.toString().split('/')[0]);
			var dates = new Date();
			dates.setFullYear(parseInt(month.toString().split('/')[2]));
			dates.setMonth(m);
			dates.setDate(days - day);
			return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear();
		};
		$scope.nextTr = function () {
			//var fromMeuhad = $scope.appData.tazrimMeuhad[$scope.appData.tazrimMeuhad.length - 1].day_id;
			var fromMeuhad = $scope.appData.dateFromEndMeuhad.toDate;
			var tillMeuhad = $scope.addMonth(fromMeuhad, 14);
			$scope.loadPage(fromMeuhad, tillMeuhad)
		}
		$scope.prevTr = function () {
			var tillMeuhad = $scope.appData.dateFromEndMeuhad.fromDate;
			//var tillMeuhad = $scope.appData.tazrimMeuhad[0].day_id;
			var fromMeuhad = $scope.returnMonth(tillMeuhad, 14);
			$scope.loadPage(fromMeuhad, tillMeuhad);
		}
		$scope.appData.pixelsScrolled = 0;
		$scope.sending = function (dataExcel) {
			serverConnection.sendMail(dataExcel).then(function (res) {
				$scope.error = 'המייל נשלח בהצלחה';
				$timeout(function () {
					$scope.hidePopup();
				}, 2000)
			}, function (error) {
				$scope.error = 'המייל לא נשלח בהצלחה';
			});
		};
		$scope.sendMailer = function () {
			$scope.appData.errorSenderMailerExcel = "";
			$scope.appData.loaderMailerPop = false;
			$scope.showPopup('views/templates/mailerMehuad.html?ver=3.74', 'mailerPopup', false);
		};
		$scope.refresh = function () {
			$scope.loadPage()
		};
		$scope.$on('refresh', function () {
			$scope.refresh();
		});
	}


	angular.module('controllers')
		.controller('tazrimMeuhadCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$anchorScroll', tazrimMeuhadCtrl]);
}());

