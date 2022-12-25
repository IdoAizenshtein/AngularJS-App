(function () {
	function analysisCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
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
		if (sessionStorage.getItem("targetTab") !== null) {
			$scope.appData.analysisDates = true;
		}
		var url_location = location.href;
		if (url_location.split("?").length == 4) {
			$scope.appData.analysisDates = true;
		}
		$scope.loaderAnalysis = false;
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
			if (!$scope.appData.analysisDates) {
				$scope.loadGraphThis = true;
				$scope.appData.dateFilter.type = '1';

				$scope.dateFilter = {
					type: "0",
					byMonth: byMonth,
					byYear: byYear,
					byOnlyYear: byYear,
					fromMonth: 0,
					fromYear: byYear,
					toMonth: 11,
					toYear: byYear
				};
			}
			else {
				if (sessionStorage.getItem("targetTab") !== null) {
					$scope.appData.targetTab = sessionStorage.getItem("targetTab");
					if (sessionStorage.getItem("transCodesAnalisis") !== null) {
						if (sessionStorage.getItem("transCodesAnalisis") == '') {
							$scope.appData.transCodesAnalisis = '';
							$scope.appData.sortCodesAnalisis = $scope.convertUuid(sessionStorage.getItem("sortCodesAnalisis"));
						}
						else {
							$scope.appData.transCodesAnalisis = $scope.convertUuid(sessionStorage.getItem("transCodesAnalisis"));
							$scope.appData.sortCodesAnalisis = '';
						}
					}
					else {
						$scope.appData.transCodesAnalisis = '';
						$scope.appData.sortCodesAnalisis = '';
					}
					if (sessionStorage.getItem("byMonth") !== null) {
						$scope.appData.dateFilter.type = '0';
						$scope.appData.byMonthAnalisis = parseInt(sessionStorage.getItem("byMonth")) - 1;
						$scope.appData.byYearAnalisis = parseInt(sessionStorage.getItem("byYear"));
						$scope.appData.byOnlyYearAnalisis = byYear;
						$scope.appData.fromMonthAnalisis = 0;
						$scope.appData.fromYearAnalisis = byYear;
						$scope.appData.toMonthAnalisis = 11;
						$scope.appData.toYearAnalisis = byYear;
					}
					else if (sessionStorage.getItem("fromMonth") !== null) {
						$scope.appData.dateFilter.type = '2';
						$scope.appData.byMonthAnalisis = byMonth;
						$scope.appData.byYearAnalisis = byYear;
						$scope.appData.byOnlyYearAnalisis = byYear;
						$scope.appData.fromMonthAnalisis = parseInt(sessionStorage.getItem("fromMonth")) - 1;
						$scope.appData.fromYearAnalisis = sessionStorage.getItem("fromYear");
						$scope.appData.toMonthAnalisis = parseInt(sessionStorage.getItem("toMonth")) - 1;
						$scope.appData.toYearAnalisis = sessionStorage.getItem("toYear");
					}
					else if (sessionStorage.getItem("byOnlyYear") !== null) {
						$scope.appData.dateFilter.type = '1';
						$scope.appData.byMonthAnalisis = byMonth;
						$scope.appData.byYearAnalisis = byYear;
						$scope.appData.fromMonthAnalisis = 0;
						$scope.appData.fromYearAnalisis = byYear;
						$scope.appData.toMonthAnalisis = 11;
						$scope.appData.toYearAnalisis = byYear;
						$scope.appData.byOnlyYearAnalisis = parseInt(sessionStorage.getItem("byOnlyYear"));
					}

					$scope.dateFilter = {
						type: "0",
						byMonth: parseInt($scope.appData.byMonthAnalisis),
						byYear: parseInt($scope.appData.byYearAnalisis),
						byOnlyYear: parseInt($scope.appData.byOnlyYearAnalisis),
						fromMonth: parseInt($scope.appData.fromMonthAnalisis),
						fromYear: parseInt($scope.appData.fromYearAnalisis),
						toMonth: parseInt($scope.appData.toMonthAnalisis),
						toYear: parseInt($scope.appData.toYearAnalisis)
					};
				}
				else if (url_location.split("?").length == 4) {
					if (url_location.split('?')[1].length == 32) {
						var something = url_location.split('?')[1].toString();
						var companyId = something.substr(0, 8) + '-' + something.substr(8, 4) + '-' + something.substr(12, 4) + '-' + something.substr(16, 4) + '-' + something.substr(20, 12);
					}
					else {
						var companyId = url_location.split("?")[1];
					}
					if (url_location.split('?')[3].length == 32) {
						var something = url_location.split('?')[3].toString();
						var transTypeCatId = something.substr(0, 8) + '-' + something.substr(8, 4) + '-' + something.substr(12, 4) + '-' + something.substr(16, 4) + '-' + something.substr(20, 12);
					}
					else {
						var transTypeCatId = url_location.split("?")[3];
					}
					$scope.appData.targetTab = url_location.split("?")[2];
					$scope.appData.transCodesAnalisis = transTypeCatId;
					$scope.appData.sortCodesAnalisis = '';
					window.history.pushState("", "", "/#/analysis");
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
				}
				else {
					if (!$scope.appData.analysisDatesReports) {
						if ($scope.appData.dateFilter.type == '0') {
							$scope.dateFilter = {
								type: "0",
								byMonth: $scope.appData.byMonthAnalisis,
								byYear: $scope.appData.byYearAnalisis,
								byOnlyYear: byYear,
								fromMonth: 0,
								fromYear: byYear,
								toMonth: 11,
								toYear: byYear
							};
						}
						if ($scope.appData.dateFilter.type == '1') {
							$scope.dateFilter = {
								type: "0",
								byMonth: byMonth,
								byYear: byYear,
								byOnlyYear: $scope.appData.byOnlyYearAnalisis,
								fromMonth: 0,
								fromYear: byYear,
								toMonth: 11,
								toYear: byYear
							};
						}
						if ($scope.appData.dateFilter.type == '2') {
							$scope.dateFilter = {
								type: "0",
								byMonth: byMonth,
								byYear: byYear,
								byOnlyYear: byYear,
								fromMonth: $scope.appData.fromMonthAnalisis,
								fromYear: $scope.appData.fromYearAnalisis,
								toMonth: $scope.appData.toMonthAnalisis,
								toYear: $scope.appData.toYearAnalisis
							};
						}
					}
					else {
						$scope.appData.dateFilter.type = '1';
						$scope.dateFilter = {
							type: "0",
							byMonth: byMonth,
							byYear: byYear,
							byOnlyYear: $scope.appData.byOnlyYearAnalisis,
							fromMonth: 0,
							fromYear: byYear,
							toMonth: 11,
							toYear: byYear
						};
						$scope.appData.analysisDatesReports = false;
					}
				}

				sessionStorage.clear();

			}
		};
		$scope.sortCodes = '';
		$scope.transCodes = '';
		$scope.selectName = 'כל קודי המיון';
		$scope.chartDataGr = true;
		if (!$scope.appData.analysisDates) {
			$scope.targetTab = '1011';
		}
		$scope.init = function () {

		};
		$scope.convertUuid = function (id) {
			if (id && id !== '') {
				var sr = id.search("-");
				if (sr == -1) {
					var res = id.toLowerCase();
					var uuid = res.substring(0, 8) + '-' + res.substring(8, 12) + '-' + res.substring(12, 16) + '-' + res.substring(16, 20) + '-' + res.substring(20, 32);
					return uuid;
				}
				else {
					return id;
				}
			}
			else {
				return id;
			}
		};
		$scope.nameTabs = function (num) {
			var nums = num.toString();
			switch (nums) {
				case '1000':
					return "                הכנסות";
				case '1022':
					return "                עלות המכירות";
				case 'golmi':
					return "                רווח גולמי";
				case '1011':
					return "                הוצאות הנהלה וכלליות";
				case '1033':
					return "                הוצאות מימון";
				case 'naki':
					return "                רווח נקי";
			}
		}
		$scope.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.datesDef();
			$scope.$broadcast('widthChanged');
			$scope.appData.changeListAnalisis = false;
			if (!$scope.appData.analysisDates) {
				$scope.loadPageAnalisis('1011');
			}
			else {
				$scope.transCodes = $scope.convertUuid($scope.appData.transCodesAnalisis);
				$scope.sortCodes = $scope.convertUuid($scope.appData.sortCodesAnalisis);
				//  $timeout(function(){
				$scope.loadPageAnalisis($scope.appData.targetTab);
				//}, 2000)
			}
		};
		$scope.getAnalisisAllServer = function (data) {
			var deferred = $q.defer();
			serverConnection.getAnalisisAll(data).then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}
		$scope.getAnalisisNakiServer = function (data) {
			var deferred = $q.defer();
			serverConnection.getAnalisisNaki(data).then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
		$scope.getAnalisisGolmiServer = function (data) {
			var deferred = $q.defer();
			serverConnection.getAnalisisGolmi(data).then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
		$scope.getAnalisisListServer = function (data) {
			var deferred = $q.defer();
			serverConnection.getAnalisisList(data).then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
		$scope.getAnalisisListThreeServer = function (data) {
			var deferred = $q.defer();
			serverConnection.getAnalisisListThree(data).then(function (res) {
				deferred.resolve(res);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};
		$scope.loadPageAnalisis = function (targetTab, getPrev) {
			$scope.loaderAnalysis = false;

			if ($scope.appData.analysisDates) {
				$scope.targetTab = $scope.appData.targetTab;
			}
			var fromDate, toDate, fromDatePrev, toDatePrev, fromDatePrev2, toDatePrev2;

			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			switch ($scope.appData.dateFilter.type) {
				case "0":
					fromDate = $scope.dateFilter.byYear + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '01';
					toDate = $scope.dateFilter.byYear + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '' + daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear);

					fromDatePrev = ($scope.dateFilter.byYear - 1) + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '01';
					toDatePrev = ($scope.dateFilter.byYear - 1) + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '' + daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, ($scope.dateFilter.byYear - 1));

					fromDatePrev2 = ($scope.dateFilter.byYear - 2) + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '01';
					toDatePrev2 = ($scope.dateFilter.byYear - 2) + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '' + daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, ($scope.dateFilter.byYear - 2));

					$scope.appData.datesSelectAnalisis = $scope.accoConversions.getDateMonth(("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2)) + ' ' + $scope.dateFilter.byYear;
					break;

				case "1":
					fromDate = $scope.dateFilter.byOnlyYear + '0101';
					toDate = $scope.dateFilter.byOnlyYear + '1231';

					fromDatePrev = ($scope.dateFilter.byOnlyYear - 1) + '0101';
					toDatePrev = ($scope.dateFilter.byOnlyYear - 1) + '1231';

					fromDatePrev2 = ($scope.dateFilter.byOnlyYear - 2) + '0101';
					toDatePrev2 = ($scope.dateFilter.byOnlyYear - 2) + '1231';

					$scope.appData.datesSelectAnalisis = $scope.dateFilter.byOnlyYear;
					break;

				case "2":
					fromDate = $scope.dateFilter.fromYear + '' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '01';
					toDate = $scope.dateFilter.toYear + '' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '01';

					fromDatePrev = ($scope.dateFilter.fromYear - 1) + '' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '01';
					toDatePrev = ($scope.dateFilter.toYear - 1) + '' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '' + daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, ($scope.dateFilter.toYear - 1));

					fromDatePrev2 = ($scope.dateFilter.fromYear - 2) + '' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '01';
					toDatePrev2 = ($scope.dateFilter.toYear - 2) + '' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '' + daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, ($scope.dateFilter.toYear - 2));

					$scope.appData.datesSelectAnalisis = $scope.accoConversions.getDateMonth(("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2)) + ' ' + $scope.dateFilter.fromYear + ' - ' + $scope.accoConversions.getDateMonth(("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2)) + ' ' + $scope.dateFilter.toYear;
					break;
			}
			$scope.appData.fromDateRowThree = fromDate;
			$scope.appData.toDateRowThree = toDate;
			if (targetTab == 'naki' || targetTab == 'golmi') {
				var req = {
					"companyId": $scope.appData.selectedCompany.companyId,
					"from": fromDate,
					"till": toDate,
					"prevFrom": fromDatePrev,
					"prevTill": toDatePrev
				};
				var reqPrev = {
					"companyId": $scope.appData.selectedCompany.companyId,
					"from": fromDatePrev,
					"till": toDatePrev,
					"prevFrom": fromDatePrev2,
					"prevTill": toDatePrev2
				};
			}
			else {
				if ($scope.transCodes === '') {
					var transTypeCatId = '';
				}
				else {
					var transTypeCatId = $scope.transCodes;
				}
				if ($scope.sortCodes === '') {
					var sortCodeId = '';
				}
				else {
					var sortCodeId = $scope.sortCodes;
				}
				var req = {
					"companyId": $scope.appData.selectedCompany.companyId,
					"from": fromDate,
					"till": toDate,
					"prevFrom": fromDatePrev,
					"prevTill": toDatePrev,
					"targetTab": [targetTab],
					"transTypeCatId": transTypeCatId,
					"supplierId": null,
					"sortCodeId": sortCodeId
				};
				var reqPrev = {
					"companyId": $scope.appData.selectedCompany.companyId,
					"from": fromDatePrev,
					"till": toDatePrev,
					"prevFrom": fromDatePrev2,
					"prevTill": toDatePrev2,
					"targetTab": [targetTab],
					"transTypeCatId": transTypeCatId,
					"supplierId": null,
					"sortCodeId": sortCodeId
				};
			}
			var reqList = {
				"companyId": $scope.appData.selectedCompany.companyId,
				"from": fromDate,
				"till": toDate,
				"prevFrom": fromDatePrev,
				"prevTill": toDatePrev,
				"targetTab": [targetTab]
			};
			if (targetTab == 'naki') {
				$scope.getAnalisisNakiServer(req).then(function (success) {
					$scope.appData.analysis = [];
					$scope.appData.analysis.push(success);
					$scope.importGraph();

					return $scope.getAnalisisNakiServer(reqPrev);
				}).then(function (success2) {
					$scope.appData.analysis.push(success2);
					$scope.importGraph();

				}, function (error) {

				});
			}
			else if (targetTab == 'golmi') {
				$scope.getAnalisisGolmiServer(req).then(function (success) {
					$scope.appData.analysis = [];
					$scope.appData.analysis.push(success);
					$scope.importGraph();
					return $scope.getAnalisisGolmiServer(reqPrev);
				}).then(function (success2) {
					$scope.appData.analysis.push(success2);
					$scope.importGraph();
				}, function (error) {

				});
			}
			else {
				$scope.getAnalisisAllServer(req).then(function (success) {
					$scope.appData.analysis = [];
					$scope.appData.analysis.push(success);
					$scope.importGraph();
					if ($scope.appData.changeListAnalisis == false) {
						return $scope.getAnalisisList(reqList);
					} else {
						return $scope.getAnalisisAllServer(reqPrev);
					}
				}).then(function (success2) {
					if ($scope.appData.changeListAnalisis == false) {
						$scope.getAnalisisAllServer(reqPrev).then(function (success3) {
							$scope.appData.analysis.push(success3);
							$scope.importGraph();
						}, function (error) {

						});
					} else {
						$scope.appData.analysis.push(success2);
						$scope.importGraph();
					}
				}, function (error) {

				});
			}
			$scope.loaderAnalysis = true;

		};

		$scope.ctrlFn = function (state, name) {

		}

		$scope.importGraph = function () {
			$scope.dataGraph = [];
			$scope.dateX = [];
			$scope.points = [];
			$scope.points1 = [];
			$scope.sum = 0;
			$scope.sumPrev = 0;
			$scope.precentThisYears = 0;
			$scope.precentPrevYear = 0;
			var precentThisYears = 0;
			var precentPrevYear = 0;

			if (($scope.appData.analysis[0].line_graph.length > 0) || ($scope.appData.analysis[1].line_graph.length > 0)) {
				$scope.chartDataGr = true;
				if ($scope.appData.analysis[0].line_graph.length > 0) {
					$scope.appData.analysis[0].line_graph.forEach(function (v) {
						$scope.dateX.push($scope.accoConversions.getDayMonthGraph(v.date_month));
						var tooltips = new Array();
						if (v.tooltip.length !== 0) {
							v.tooltip.forEach(function (a, ind) {
								var tool_content = {
									'title': a.name,
									'value': '₪ ' + $scope.getTotal(a.total)
								};
								tooltips.push(tool_content);
							});
							precentThisYears += v.tooltip[0].total;
						}
						else {
							var tool_content = {
								'title': 'לא נמצאו נתונים',
								'value': ''
							};
							tooltips.push(tool_content);
						}
						var point = {
							'y': eval(v.sum),
							'players': tooltips
						};
						$scope.points.push(point);
						$scope.sum += eval(v.sum);
					});
					$scope.point1 = {
						cursor: 'pointer',
						name: $scope.appData.analysis[0].year,
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
						data: $scope.points,
						visible: true
					};
					$scope.dataGraph.push($scope.point1);
					if ($scope.sum !== 0 && precentThisYears !== 0) {
						var precentYears = ($scope.sum / precentThisYears) * 100;
						$scope.precentThisYears = Math.round(precentYears);
					}
				}
				if ($scope.appData.analysis[1] && $scope.appData.analysis[1].line_graph.length > 0) {
					$scope.appData.analysis[1].line_graph.forEach(function (v) {
						var tooltips = new Array();
						if (v.tooltip.length !== 0) {
							v.tooltip.forEach(function (a) {
								var tool_content = {
									'title': a.name,
									'value': '₪ ' + $scope.getTotal(a.total)
								};
								tooltips.push(tool_content);
							});
							precentPrevYear += v.tooltip[0].total;
						}
						else {
							var tool_content = {
								'title': 'לא נמצאו נתונים',
								'value': ''
							};
							tooltips.push(tool_content);
						}
						var point = {
							'y': eval(v.sum),
							'players': tooltips
						};
						$scope.points1.push(point);
						$scope.sumPrev += eval(v.sum);
					});
					$scope.point2 = {
						cursor: 'pointer',
						name: $scope.appData.analysis[1].year,
						lineWidth: 2,
						color: '#b4b4b4',
						states: {
							hover: {
								lineWidth: 2,
								color: '#b4b4b4'
							}
						},
						marker: {
							symbol: 'circle'
						},
						data: $scope.points1,
						visible: false
					};
					$scope.dataGraph.push($scope.point2);
					if ($scope.sumPrev !== 0 && precentPrevYear !== 0) {
						var precentPrevYears = ($scope.sumPrev / precentPrevYear) * 100;
						$scope.precentPrevYear = Math.round(precentPrevYears);
					}
				}
				else {
					var name = "";
					if ($scope.appData.dateFilter.type === '0') {
						name = ($scope.dateFilter.byYear - 1)
					} else if ($scope.appData.dateFilter.type === '1') {
						name = ($scope.dateFilter.byOnlyYear - 1)
					} else if ($scope.appData.dateFilter.type === '2') {
						name = ($scope.dateFilter.fromYear - 1)
					}
					$scope.point2 = {
						cursor: 'pointer',
						name: name,
						lineWidth: 2,
						color: '#b4b4b4',
						states: {
							hover: {
								lineWidth: 2,
								color: '#b4b4b4'
							}
						},
						marker: {
							symbol: 'circle'
						},
						data: [],
						visible: false
					};
					$scope.dataGraph.push($scope.point2);
				}

				$scope.chartData = {
					showFirst: true,
					spacingTop: 55,
					spacingLeft: 0,
					spacingRight: 0,
					borderColor: '#fff',
					borderWidth: 0,
					borderRadius: 0,
					legend: true,
					xAxis: $scope.dateX,
					yLabel: 'סה״כ בש״ח',
					yAxisTitle: -25,
					data: $scope.dataGraph,
					title: ' ',
					subtitle: ' ',
					plotOptions: true,
					tooltip: function () {
						var result = '';
						var resultss = '';
						result += '<div style="overflow:hidden"><div style="direction:rtl;float:right;width: 120px; padding-right: 5px;font-family: esterebold, Arial;text-align: right;padding-left: 5px;">סה"כ</div><div style="font-family: esterebold, Arial;direction:ltr;float:left;width:95px;text-align:right;">' + '₪ ' + this.y.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</div></div>';
						this.point.players.forEach(function (v) {
							if (v.title !== "") {
								resultss = 'not_empty';
								result += '<div  style="overflow:hidden"><div style="direction:rtl;float:right;width: 120px; padding-right: 5px;text-align: right;padding-left: 5px;">' + v.title + '</div><div style="width:95px; text-align:right;">' + v.value + '</div></div>';
							} else {
								resultss += '<div style="width:220px; text-align:center;">אין נתונים</div>';
							}
						});
						return '<div class="htmlTooltip">' + result + '</div>';
					}
				};
				$scope.percentPrevThis($scope.sum, $scope.sumPrev);
			}
			if (($scope.appData.analysis[0].line_graph.length == 0) && ($scope.appData.analysis[1] && $scope.appData.analysis[1].line_graph.length == 0)) {
				$scope.sum = 0;
				$scope.sumPrev = 0;
				$scope.precentTotal = 0;
				$scope.chartDataGr = false;
			}


		};
		$scope.precentTotal = '-';
		$scope.precentTotalClass = '';
		$scope.percentPrevThis = function (year, prev) {
			if (prev == 0) {
				$scope.precentTotal = '-';
				$scope.precentTotalClass = 'black_num';
			}
			else {
				$scope.sumPrecent = year / prev;
				if ($scope.targetTab == '1000' || $scope.targetTab == 'golmi' || $scope.targetTab == 'naki') {
					if ((prev < 0) && (year > 0)) {
						if ($scope.sumPrecent > 1) {
							$scope.sumPrecent = ($scope.sumPrecent - 1) * 100;
							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'green_num';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'green_num';
							}
						}
						else if ($scope.sumPrecent == 1) {
							$scope.precentTotal = '0%';
							$scope.precentTotalClass = 'green_num';
						}
						else if ($scope.sumPrecent < 1) {
							$scope.sumPrecent = (1 - $scope.sumPrecent) * 100;
							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'green_num';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'green_num';
							}

						}
					}
					else if ((prev > 0) && (year < 0)) {
						if ($scope.sumPrecent > 1) {
							$scope.sumPrecent = ($scope.sumPrecent - 1) * 100;

							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'red_num';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'red_num';
							}

						}
						else if ($scope.sumPrecent == 1) {
							$scope.precentTotal = '0%';
							$scope.precentTotalClass = 'red_num';
						}
						else if ($scope.sumPrecent < 1) {
							$scope.sumPrecent = (1 - $scope.sumPrecent) * 100;
							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'red_num';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'red_num';
							}
						}
					}
					else {
						if ($scope.sumPrecent > 1) {
							$scope.sumPrecent = ($scope.sumPrecent - 1) * 100;

							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'green_num';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'green_num';
							}
						}
						else if ($scope.sumPrecent == 1) {
							$scope.sumPrecent = 0;
							$scope.precentTotal = '0%';
							$scope.precentTotalClass = 'black_num';
						}
						else if ($scope.sumPrecent < 1) {
							$scope.sumPrecent = (1 - $scope.sumPrecent) * 100;
							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'green_num';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'red_num';
							}

						}
					}

				}
				else {
					if ((prev < 0) && (year > 0)) {
						if ($scope.sumPrecent > 1) {
							$scope.sumPrecent = ($scope.sumPrecent - 1) * 100;
							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'red_num_up';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'red_num_up';
							}
						}
						else if ($scope.sumPrecent == 1) {
							$scope.precentTotal = '0%';
							$scope.precentTotalClass = 'red_num_up';
						}
						else if ($scope.sumPrecent < 1) {
							$scope.sumPrecent = (1 - $scope.sumPrecent) * 100;
							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'red_num_up';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'red_num_up';
							}
						}


					}
					else if ((prev > 0) && (year < 0)) {
						if ($scope.sumPrecent > 1) {
							$scope.sumPrecent = ($scope.sumPrecent - 1) * 100;
							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'green_num_down';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'green_num_down';
							}
						}
						else if ($scope.sumPrecent == 1) {
							$scope.precentTotal = '0%';
							$scope.precentTotalClass = 'green_num_down';
						}
						else if ($scope.sumPrecent < 1) {
							$scope.sumPrecent = (1 - $scope.sumPrecent) * 100;
							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'green_num_down';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'green_num_down';
							}
						}
					}
					else {
						if ($scope.sumPrecent > 1) {
							$scope.sumPrecent = ($scope.sumPrecent - 1) * 100;

							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'red_num_up';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'red_num_up';
							}
						}
						else if ($scope.sumPrecent == 1) {
							$scope.precentTotal = '0%';
							$scope.precentTotalClass = 'black_num';
						}
						else if ($scope.sumPrecent < 1) {
							$scope.sumPrecent = (1 - $scope.sumPrecent) * 100;
							if ($scope.sumPrecent > 1000) {
								$scope.precentTotal = 'מעל 1000%';
								$scope.precentTotalClass = 'red_num_up';
							}
							else if ($scope.sumPrecent == Infinity) {
								$scope.precentTotal = '-';
								$scope.precentTotalClass = 'black_num';
							}
							else {
								$scope.precentTotal = Math.round($scope.sumPrecent).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '%';
								$scope.precentTotalClass = 'green_num_down';
							}
						}


					}


				}
			}
		};
		$scope.getAnalisisList = function (data) {
			var deferred = $q.defer();
			$scope.getAnalisisListServer(data).then(function (res) {
				deferred.resolve(true);
				$scope.appData.listAnalisis = res;
				$scope.appData.listAnalisis.forEach(function (v, index) {
					v.rowshow = false;
				});
				if ($scope.appData.listAnalisis.length > 1) {
					$scope.selectCodeSort = [
						{
							'name': 'כל קודי המיון',
							'id': 'null',
							'idx': 'all'
						}
					];
					$scope.appData.listAnalisis.forEach(function (v, index) {
						var optionCode = {
							'name': v.level_1.number + ' - ' + v.level_1.name,
							'id': v.level_1.id,
							'idx': index
						};
						$scope.selectCodeSort.push(optionCode);
					});
				}
				else {
					$scope.selectCodeSort = [];
					if ($scope.appData.listAnalisis.length == 1) {
						$scope.appData.listAnalisis.forEach(function (v, index) {
							if (v.level_1.name !== null) {
								var optionCode = {
									'name': v.level_1.number + ' - ' + v.level_1.name,
									'id': v.level_1.id,
									'idx': index
								};
							}
							else {
								var optionCode = {
									'name': $scope.nameTabs($scope.targetTab),
									'id': v.level_1.id,
									'idx': index
								};
								$scope.selectName = $scope.nameTabs($scope.targetTab);
							}
							$scope.selectCodeSort.push(optionCode);
						});
					}
				}

				if (!$scope.appData.analysisDates) {
					$scope.appData.selectCodeSortId = $scope.selectCodeSort[0];
					$scope.selectedInitTrans();
				}
				else {
					if ($scope.sortCodes !== '') {
						var indx = '';
						var indSelect = 0;
						if ($scope.selectCodeSort.length > 1) {
							indSelect = 1;
						}
						$scope.selectCodeSort.forEach(function (v) {
							if (v.id == $scope.sortCodes) {
								indx = v.idx + indSelect;
							}
						});
						$scope.appData.selectCodeSortId = $scope.selectCodeSort[indx];
						$scope.selectedInitTrans();
					}
					else {
						if ($scope.appData.listAnalisis.length !== 1 && $scope.transCodes !== '') {
							var dataLevel1 = '';
							var dataLevel2 = '';
							var ind = '';
							var ind2 = '';
							$scope.appData.listAnalisis.forEach(function (v, index) {
								dataLevel1 = v.level_1.id;
								ind = index + 1;

								v.level_1.level_2.forEach(function (a) {
									if (a.id == $scope.transCodes) {
										dataLevel2 = dataLevel1;
										ind2 = ind;
										return false;
									}
								});
							});
							$scope.appData.selectCodeSortId = $scope.selectCodeSort[ind2];
							$scope.selectedInitTrans(dataLevel2);
						}
						else {
							if ($scope.transCodes !== '') {
								var ind = '';
								$scope.appData.listAnalisis[0].level_1.level_2.forEach(function (v, index) {
									if (v.id == $scope.transCodes) {
										ind = index + 1;
										return false;
									}
								});
								$scope.appData.selectCodeSortId = $scope.selectCodeSort[0];
								$scope.selectedInitTrans($scope.appData.listAnalisis[0].level_1.id);
							}
							else {
								$scope.appData.selectCodeSortId = $scope.selectCodeSort[0];
								$scope.selectedInitTrans();
							}
						}
					}
					$timeout(function () {
						$scope.loadGraphThis = true;
					}, 100)
				}


			}, function (error) {
				deferred.resolve(true);
			});
			return deferred.promise;
		}
		$scope.appData.redErrorFilterType = false;
		$scope.disabledDates = function () {
			function shortDates(dates) {
				return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
			}

			$scope.appData.redErrorFilterType = false;
			if ($scope.appData.dateFilter.type == '2' && shortDates('01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear)) {
				$scope.appData.redErrorFilterType = '2';
			}
			else {
				$scope.appData.redErrorFilterType = false;
			}
		}
		$scope.openRowThree = function (id) {
			var id = id;
			var res;
			var req = {
				"companyId": $scope.appData.selectedCompany.companyId,
				"from": $scope.appData.fromDateRowThree,
				"till": $scope.appData.toDateRowThree,
				"transTypeCatId": id
			};
			$scope.getAnalisisListThreeServer(req).then(function (res) {
				res = res;
				$scope.appData.listAnalisis.forEach(function (v) {
					v.level_1.level_2.forEach(function (a) {
						if (a.id == id) {
							a.level_3 = res;
						}
					});
				});
			}, function (error) {
			});
		}
		$scope.selectTransChange = function (data) {
			$scope.selectName = data.name;
			$scope.appData.changeListAnalisis = true;
			$scope.sortCodes = '';
			if (data.id == 'null') {
				$scope.transCodes = '';
			}
			else {
				$scope.transCodes = data.id;
				$scope.openRowThree(data.id)
			}
			if (!$scope.appData.analysisDates) {
				$scope.loadPageAnalisis($scope.targetTab);
			}
			$timeout(function () {
				var idx = $scope.appData.selectCodeSortId.idx;
				$scope.appData.listAnalisis.forEach(function (v, index) {
					if ($scope.sortCodes !== 'null') {
						if (idx == index) {
							v.rowshow = true;
						}
						else {
							v.rowshow = false;
						}
					}
					else {
						v.rowshow = false;
					}

					v.level_1.level_2.forEach(function (a) {
						if ($scope.transCodes !== 'null') {
							if (a.id == $scope.transCodes) {
								a.rowshow = true;
							}
							else {
								a.rowshow = false;
							}
						}
						else {
							a.rowshow = false;
						}
					});
				});
			}, 500)

			$scope.appData.analysisDates = false;
		};
		$scope.selectedInitTrans = function (data) {
			$scope.selectTrans = [{
				'name': 'כל הכרטיסים',
				'id': 'null',
				'idx': 'all'
			}];
			if (data && (data !== 'null')) {
				$scope.dataSelectTrans = data;
				var index2 = '';
				$scope.appData.listAnalisis.forEach(function (v) {
					if (v.level_1.id == $scope.dataSelectTrans) {
						v.level_1.level_2.forEach(function (a, index) {
							var option = {
								'name': a.number + ' - ' + a.name,
								'id': a.id,
								'idx': index
							};
							$scope.selectTrans.push(option)
							if ($scope.appData.analysisDates) {
								if (a.id == $scope.transCodes) {
									index2 = index + 1;
								}
							}
						});
					}
				});
				if (!$scope.appData.analysisDates) {
					$scope.appData.selectTransId = $scope.selectTrans[0];
				}
				else {
					$scope.appData.selectTransId = $scope.selectTrans[index2];
					//  $timeout(function () {
					$scope.selectTransChange($scope.appData.selectTransId);
					//  }, 500)
				}
			}
			if (!data || data == 'null') {
				if ($scope.appData.listAnalisis.length > 0) {
					var indSel = 0;
					$scope.appData.listAnalisis[0].level_1.level_2.forEach(function (a, index) {
						var option = {
							'name': a.number + ' - ' + a.name,
							'id': a.id,
							'idx': index
						};
						$scope.selectTrans.push(option)
						if (a.id == $scope.transCodes) {
							indSel = index + 1;
						}
					});
					if ($scope.appData.listAnalisis.length > 1) {
						$scope.appData.selectTransId = $scope.selectTrans[0];
					}
					else {
						$scope.appData.selectTransId = $scope.selectTrans[indSel];
					}

					//   $timeout(function () {
					if ($scope.appData.analysisDates) {
						if ($scope.transCodes !== '') {
							$scope.selectTransChange($scope.appData.selectTransId);
						}
						else {
							$scope.selectCodeSortChange($scope.appData.selectCodeSortId);
						}
					}
					//    }, 500)

				}
			}
		};
		$scope.selectCodeSortChange = function (data) {
			$scope.selectName = data.name;
			if (!$scope.appData.analysisDates) {
				$scope.selectedInitTrans(data.id);
			}
			$scope.appData.changeListAnalisis = true;
			$scope.transCodes = '';
			if (data.id == 'null') {
				$scope.sortCodes = '';
			}
			else {
				$scope.sortCodes = data.id;
			}
			if (!$scope.appData.analysisDates) {
				$scope.loadPageAnalisis($scope.targetTab);
			}

			$scope.appData.listAnalisis.forEach(function (v) {
				if ($scope.sortCodes !== 'null') {
					if (v.level_1.id == $scope.sortCodes) {
						v.rowshow = true;
					}
					else {
						v.rowshow = false;
					}
				}
				v.level_1.level_2.forEach(function (a) {
					a.rowshow = false;
				});
			});
			$scope.appData.analysisDates = false;
		};
		$scope.refresh = function () {
			$scope.loadPageAnalisis($scope.targetTab);
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
			$scope.showPopup('views/templates/mailerAnalisis.html?ver=3.74', 'mailerPopup', false);
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {
			if ($scope.appData.selectedCompany) {
				if ($scope.appData.selectedCompany.mail.indexOf("$") == -1) {
					$scope.mail = $scope.appData.selectedCompany.mail;
				}
				else {
					$scope.mail = $scope.appData.selectedCompany.mail.split('$')[1];
				}
			}

			if (newVal == false) {
				$scope.error = '';
			}
		});
	}

	angular.module('controllers')
	.controller('analysisCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', analysisCtrl]);
}());
