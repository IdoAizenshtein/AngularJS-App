(function () {
	function reportCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.$utils = utils;
		$scope.accoConversions = accoConversions;
		$scope.appData = AppData;
		$scope.nextPage = $state.params.url;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(10);
		$scope.date = new Date();

		//$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
		//	if (from.name !== 'report') {
		//		$scope.appData.loadPrevPage = false;
		//	}
		//});

		//if (!$scope.appData.loadPrevPage) {
		$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
		$scope.appData.dateFilterTypes = "0";
		$scope.appData.valueRadio = 'radio1';
		$scope.appData.valueRadioPrev = 'yes';

		var byMonth;
		var byYear;
		var date = new Date();
		date.setFullYear(date.getFullYear());
		date.setMonth(date.getMonth() - 2);
		date.setDate(date.getDate());
		byMonth = date.getMonth();
		byYear = date.getFullYear();
		$scope.appData.dateFilters = {
			type: "0",
			byMonth: byMonth,
			byYear: byYear,
			byOnlyYear: $scope.date.getFullYear(),
			fromMonth: $scope.firstDayOfYear.getMonth(),
			fromYear: $scope.firstDayOfYear.getFullYear(),
			toMonth: $scope.lastDayOfYear.getMonth(),
			toYear: $scope.lastDayOfYear.getFullYear()
		};
		//}

		$scope.init = function () {
			$scope.appData.valueRadioPrint = 'level1';
			//if (!$scope.appData.loadPrevPage) {
			//	$scope.loaderReport = false;
			//}
			//else {
			if($scope.appData.selectRevah !== undefined){
				$scope.selectRevahSet = $scope.appData.selectRevah[0].val;
				$scope.setGraph(0);
				$scope.loaderReport = true;
			}

			//}
		};

		$scope.convertUuid = function (id) {
			var res = id.toLowerCase();
			var uuid = res.substring(0, 8) + '-' + res.substring(8, 12) + '-' + res.substring(12, 16) + '-' + res.substring(16, 20) + '-' + res.substring(20, 32);
			return uuid;
		};

		$scope.selectCompany = function (company) {
			//if (($scope.appData.selectedCompany && company.companyId !== $scope.appData.selectedCompany.companyId) || (!$scope.appData.selectedCompany) || !$scope.appData.loadPrevPage) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			if ($scope.appData.selectedCompany.default_account_month) {
				var datesYear = $scope.appData.selectedCompany.default_account_month.toString().substring(0, 4);
				$scope.appData.dateFilterTypes = "1";
				$scope.appData.dateFilters.byOnlyYear = parseFloat(datesYear);
			}
			$scope.loadPage();
			//}
		};

		$scope.getReportServer = function (data) {
			var deferred = $q.defer();
			serverConnection.getReport(data).then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		$scope.exportPrintsAll = function (type) {
			$scope.appData.typeExportReports = type;
			$scope.showPopup('views/templates/popSelectRowReport.html?ver=3.74', 'popSelectRowReport');
		}
		$scope.appData.redErrorFilterType = false;
		$scope.disabledDates = function () {
			function shortDates(dates) {
				return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
			}

			$scope.appData.redErrorFilterType = false;
			if ($scope.appData.dateFilterTypes == '2' && shortDates('01/' + ("0" + (parseInt($scope.appData.dateFilters.fromMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilters.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.appData.dateFilters.toMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilters.toYear)) {
				$scope.appData.redErrorFilterType = '2';
			}
			else {
				$scope.appData.redErrorFilterType = false;
			}
		}

		$scope.loadPage = function () {
			$scope.loaderReport = false;
			var fromDate, toDate, stockEnterance = 0, stockExit = 0, stockEnterancePrev = 0, stockExitPrev = 0;
			if ($scope.stockEnterance) {
				stockEnterance = parseInt($scope.stockEnterance);
			}
			if ($scope.stockExit) {
				stockExit = parseInt($scope.stockExit);
			}
			if ($scope.stockEnterancePrev) {
				stockEnterancePrev = parseInt($scope.stockEnterancePrev);
			}
			if ($scope.stockExitPrev) {
				stockExitPrev = parseInt($scope.stockExitPrev);
			}
			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}
			switch ($scope.appData.dateFilterTypes) {
				case "0":
					fromDate = '01/01/' + $scope.date.getFullYear();
					toDate = '31/12/' + $scope.date.getFullYear();

					$scope.appData.datesSelectReport = ' שנה נוכחית';
					break;

				case "1":
					fromDate = '01/01/' + $scope.appData.dateFilters.byOnlyYear;
					toDate = '31/12/' + $scope.appData.dateFilters.byOnlyYear;

					$scope.appData.datesSelectReport = $scope.appData.dateFilters.byOnlyYear;
					break;

				case "2":
					fromDate = '01' + '/' + ("0" + (parseInt($scope.appData.dateFilters.fromMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilters.fromYear;
					toDate = '01' + '/' + ("0" + (parseInt($scope.appData.dateFilters.toMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilters.toYear;
					$scope.appData.datesSelectReport = $scope.accoConversions.getDateMonth(("0" + (parseInt($scope.appData.dateFilters.fromMonth) + 1)).slice(-2)) + ' ' + $scope.appData.dateFilters.fromYear + ' - ' + $scope.accoConversions.getDateMonth(("0" + (parseInt($scope.appData.dateFilters.toMonth) + 1)).slice(-2)) + ' ' + $scope.appData.dateFilters.toYear;
					break;
			}
			$scope.appData.fromDateRow = fromDate;
			$scope.appData.toDateRow = toDate;
			var reqList = {
				"companyId": $scope.appData.selectedCompany.companyId,
				"prevYear": 1,
				"dateFrom": fromDate,
				"dateTill": toDate,
				"stockEnterance": stockEnterance,
				"stockExit": stockExit,
				"stockEnterancePrev": stockEnterancePrev,
				"stockExitPrev": stockExitPrev
			};
			$scope.getReportRevah(reqList);
		};

		$scope.getReportRevah = function (data) {
			$scope.getReportServer(data).then(function (res) {
				$scope.appData.revahHefsed = res;
				$scope.loaderReport = true;
				if ($scope.appData.revahHefsed.data.length > 0) {
					$scope.appData.selectRevah = [];
					$scope.appData.revahHefsed.data.forEach(function (a, index) {
						if (index % 2 == 0) {
							var obj = {
								val: index,
								name: a.title
							}
							$scope.appData.selectRevah.push(obj);
						}
						if (a.data) {
							a.data.forEach(function (v, ind) {
								if (ind == 0 && v.sum == 0) {
									a.rowZero = true;
								}
							})
						}

						if (a.smallData) {
							a.smallData.forEach(function (v, ind) {
								if (ind == 0 && v.sum == 0) {
									a.rowZero = true;
								}
							})
						}

						a.rowsAsList.forEach(function (v, ind) {
							if (v.data) {
								v.data.forEach(function (c, ind) {
									if (ind == 0 && c.sum == 0) {
										v.rowZero = true;
									}
								})
							}

							if (v.smallData) {
								v.smallData.forEach(function (c, ind) {
									if (ind == 0 && c.sum == 0) {
										v.rowZero = true;
									}
								})
							}


							v.rowsAsList.forEach(function (c, ind) {
								if (c.data) {
									c.data.forEach(function (d, ind) {
										if (ind == 0 && d.sum == 0) {
											c.rowZero = true;
										}
									})
								}

								if (c.smallData) {
									c.smallData.forEach(function (d, ind) {
										if (ind == 0 && d.sum == 0) {
											c.rowZero = true;
										}
									})
								}
							})
						})

					})
					$scope.selectRevahSet = $scope.appData.selectRevah[0].val;
					$scope.setGraph(0);
				}
			}, function (error) {

			});
		}

		$scope.setGraph = function (ind) {
			var sumThisYear = [], sumPrevYear = [], tooltipThisYear = [], tooltipPrevYear = [];
			var graph = angular.copy($scope.appData.revahHefsed);
			var month = [];
			graph.dates.forEach(function (a) {
				month.push($scope.accoConversions.getDayMonthNum(a))
			})
			graph.data[ind].data.forEach(function (a) {
				if (a.summary == false) {
					sumThisYear.push(a.sum);
				}
			})


			if (graph.data[ind].rowsAsList.length > 0) {
				var wrapArr = [];

				function tooltipThis(i) {
					graph.data[ind].rowsAsList.forEach(function (a) {
						if ($scope.appData.valueRadioPrev == 'yes') {
							var objects = {
								name: a.title,
								Val: a.data[i + 1].sum
							}
							wrapArr.push(objects)
						}
						else {
							if (!a.rowZero) {
								var objects = {
									name: a.title,
									Val: a.data[i + 1].sum
								}
								wrapArr.push(objects)
							}
						}
					})
				}

				var i = 0;
				while (i < graph.data[ind].rowsAsList[0].data.length - 1) {
					tooltipThis(i)
					i++;
				}
				var indx = 0;
				var tooltipThisYearSlice = [];
				wrapArr.forEach(function (v, index) {
					indx++;
					tooltipThisYearSlice.push(v)
					if (indx == graph.data[ind].rowsAsList.length) {
						tooltipThisYear.push(tooltipThisYearSlice)
						indx = 0;
						tooltipThisYearSlice = [];
					}
				})
			}


			graph.data[ind + 1].smallData.forEach(function (a) {
				if (a.summary == false) {
					sumPrevYear.push(a.sum);
				}
			})


			if (graph.data[ind].rowsAsList.length > 0) {
				var wrapArr1 = [];

				function tooltipThis1(i1) {
					graph.data[ind + 1].rowsAsList.forEach(function (a) {
						var objects = {
							name: a.title,
							Val: a.smallData[i1 + 1].sum
						}
						wrapArr1.push(objects)
					})
				}

				var i1 = 0;
				while (i1 < graph.data[ind].rowsAsList[0].data.length - 1) {
					tooltipThis1(i1)
					i1++;
				}
				var indx1 = 0;
				var tooltipThisPrevSlice = [];
				wrapArr1.forEach(function (v, index) {
					indx1++;
					tooltipThisPrevSlice.push(v)
					if (indx1 == graph.data[ind].rowsAsList.length) {
						tooltipPrevYear.push(tooltipThisPrevSlice)
						indx1 = 0;
						tooltipThisPrevSlice = [];
					}
				})
			}


			if ($scope.appData.valueRadioPrev == 'yes') {
				var chart = [{
					cursor: 'pointer',
					name: graph.data[ind].title,
					lineWidth: 2,
					color: '#aeaeae',
					states: {
						hover: {
							lineWidth: 2,
							color: '#aeaeae'
						}
					},
					marker: {
						symbol: 'circle'
					},
					data: sumThisYear
				}, {
					cursor: 'pointer',
					name: graph.data[ind + 1].title + ' אשתקד',
					lineWidth: 2,
					color: '#1387a9',
					states: {
						hover: {
							lineWidth: 2,
							color: '#1387a9'
						}
					},
					marker: {
						symbol: 'circle'
					},
					data: sumPrevYear
				}];
			}
			else {
				var chart = [{
					cursor: 'pointer',
					name: graph.data[ind].title,
					lineWidth: 2,
					color: '#aeaeae',
					states: {
						hover: {
							lineWidth: 2,
							color: '#aeaeae'
						}
					},
					marker: {
						symbol: 'circle'
					},
					data: sumThisYear
				}];
			}

			$scope.chartData = {
				zoomType: 'xy',
				spacingTop: 55,
				spacingLeft: 0,
				spacingRight: 0,
				borderColor: '#d8d8d8',
				borderWidth: 1,
				borderRadius: 3,
				legend: true,
				xAxis: month,
				reversed: false,
				yLabel: 'סה״כ בש״ח',
				data: chart,
				title: ' ',
				subtitle: ' ',
				tooltips: [tooltipThisYear, tooltipPrevYear]
			}


		}

		$scope.goToAnalisis = function (row, idx, year, tabs, id) {
			if (tabs !== '2') {
				$scope.appData.analysisDates = true;
				if (tabs == '1') {
					tabs = 'golmi';
				}
				if (tabs == '3') {
					tabs = 'naki';
				}
				$scope.appData.targetTab = tabs;
				if (idx == 0) {
					$scope.appData.dateFilter.type = '2';
					var datesFrom = $scope.appData.revahHefsed.dates[0];
					var datesTo = $scope.appData.revahHefsed.dates[$scope.appData.revahHefsed.dates.length - 1];
					$scope.appData.fromMonthAnalisis = parseInt(datesFrom.toString().substr(4, 2)) - 1;
					$scope.appData.toMonthAnalisis = parseInt(datesTo.toString().substr(4, 2)) - 1;

					if (year == 'thisYear') {
						$scope.appData.fromYearAnalisis = parseInt(datesFrom.toString().substr(0, 4));
						$scope.appData.toYearAnalisis = parseInt(datesTo.toString().substr(0, 4));
					}
					else {
						$scope.appData.fromYearAnalisis = parseInt(datesFrom.toString().substr(0, 4)) - 1;
						$scope.appData.toYearAnalisis = parseInt(datesTo.toString().substr(0, 4)) - 1;
					}
				}
				else {
					$scope.appData.dateFilter.type = '0';
					var dates = $scope.appData.revahHefsed.dates[idx - 1];
					$scope.appData.byMonthAnalisis = parseInt(dates.toString().substr(4, 2)) - 1;
					if (year == 'thisYear') {
						$scope.appData.byYearAnalisis = parseInt(dates.toString().substr(0, 4));
					}
					else {
						$scope.appData.byYearAnalisis = parseInt(dates.toString().substr(0, 4)) - 1;
					}
				}
				if (row) {
					if (row == 'row1') {
						$scope.appData.transCodesAnalisis = '';
						$scope.appData.sortCodesAnalisis = '';
					}
					if (row == 'row2') {
						$scope.appData.sortCodesAnalisis = id;
						$scope.appData.transCodesAnalisis = '';
					}
					if (row == 'row3') {
						$scope.appData.transCodesAnalisis = id;
						$scope.appData.sortCodesAnalisis = '';
					}
				}
				$state.go('analysis');
			}
		};

		$scope.imgSet = function (data) {
			if (data == true)
				return 'minus';
			else
				return 'plus';
		}
		$scope.refresh = function () {
			$scope.loadPage()
		};
		$scope.$on('refresh', function () {
			$scope.refresh();
		});
		$scope.help = function () {
			window.open('http://bizibox.biz/help/profitandloss', '_blank');
		};

		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.appData.valueRadioPrint = 'level1';
				$scope.error = '';
			}
		});

	}


	angular.module('controllers')
		.controller('reportCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', reportCtrl]);
}());






