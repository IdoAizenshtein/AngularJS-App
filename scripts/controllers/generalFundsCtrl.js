(function () {
	function generalFundsCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {


		$scope.$location = $location;
		$scope.$state = $state;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.bankId = $state.params.bank;
		$scope.colorsNegative = ['#BB404C', '#EC3C66', '#F06485', '#ED4A4A', '#FD6935', '#FD9C35', '#FDC430', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
		$scope.colorsPositive = ['#15708B', '#1287AA', '#19A9C4', '#30C7C2', '#4FA374', '#59BE85', '#69D776', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
		$scope.colorsBanks = ['#1387a9', '#19a9c5', '#23c5e5', '#30C7C2', '#4FA374', '#59BE85', '#69D776', '#DADADA'];
		$scope.months = utils.monthNames();

		$scope.init = function () {
			$scope.$parent.pieInd = 0;

			if ($scope.bankId) {
				var index, lenAcc = $scope.appData.selectedCompany.accounts.bank_account_list.length;
				for (var i = 0; i < lenAcc; i++) {
					if ($scope.appData.selectedCompany.accounts.bank_account_list[i].company_account_id)
						index = i;
				}
				$scope.showSpecific([index, {company_account_id: $scope.bankId}]);
			}
		};

		$scope.$on('getCompanyAccountsFunds', function () {
			if ($state.current.name == 'general.funds') {
				$scope.getCompanyAccounts().then(function (response) {
					$scope.appData.selectedCompany.accounts = response;
					var from = $scope.appData.selectedCompany.accounts.bank_account_list[0].balance_last_update_date,
						lenAcc = $scope.appData.selectedCompany.accounts.bank_account_list.length;
					for (var i = 1; i < lenAcc; i++) {
						var d = $scope.appData.selectedCompany.accounts.bank_account_list[i].balance_last_update_date;
						if (compareDates(from, d) < 0)
							from = d;
					}

					function compareDates(d1, d2) {
						var sum1 = new Date();
						sum1.setFullYear(d1.split('/')[2]);
						sum1.setMonth(d1.split('/')[1]);
						sum1.setDate(d1.split('/')[0]);

						var sum2 = new Date();
						sum2.setFullYear(d2.split('/')[2]);
						sum2.setMonth(d2.split('/')[1]);
						sum2.setDate(d2.split('/')[0]);
						return sum1 - sum2;
					};

					function addWeek(week) {
						var dates = new Date();
						dates.setFullYear(parseInt(week.toString().split('/')[2]));
						dates.setMonth(parseInt(week.toString().split('/')[1]) - 1);
						dates.setDate(parseInt(week.toString().split('/')[0]) + 10);

						return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear()
					};

					var dateFrom = from.split("/");
					var dates = new Date(parseInt(dateFrom[2]), parseInt(dateFrom[1]) - 1, parseInt(dateFrom[0]) - 2);
					var from = ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear();
					$scope.appData.balanceLastUpdateDateForGraph = from;
					$scope.appData.nextAndPrevGraphFrom = from;
					$scope.appData.nextAndPrevGraphTo = addWeek(from);
					$scope.$parent.getTazrim(from, addWeek(from));
					$scope.$parent.accountsWithAll = [{company_account_nickname: 'כל הבנקים'}].concat($scope.appData.selectedCompany.accounts.bank_account_list);
					$scope.getKsafimData();
					//$scope.$parent.showPopUpNew1()
				});
			}
		});
		$scope.getKsafimData = function (forced) {
			if (!$scope.appData.selectedCompany.ksafimData || forced) {
				$scope.$parent.loaderKsafimData = true;

				var id = null;
				if ($scope.shownGraphIndex !== 0) {
					id = $scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1].company_account_id;
				}
				serverConnection.getKsafimData({
					company_id: $scope.appData.selectedCompany.companyId,
					company_account_id: id
				}).then(function (response) {
					$scope.appData.selectedCompany.ksafimData = response;
					$scope.maazanSum = +$scope.appData.selectedCompany.ksafimData.ccardPeulotatidData.total
						+ $scope.appData.selectedCompany.ksafimData.outCheques.total
						+ $scope.appData.selectedCompany.ksafimData.outLoans.total
						+ $scope.appData.selectedCompany.accounts.total_opening_balance
						+ $scope.appData.selectedCompany.ksafimData.solekPeulotatidData.total
						+ $scope.appData.selectedCompany.ksafimData.inCheques.total
						+ $scope.appData.selectedCompany.ksafimData.outDeposits.total;
					$scope.$parent.loaderKsafimData = false;
					$scope.$broadcast('widthChanged');
				}, function (error) {
				});
			}
		};
		$scope.showTotal = function (notify) {
			var serData = Math.min.apply(Math, $scope.appData.selectedCompany.tazrim.yLabel.totals);
			var lineGraph = $scope.appData.selectedCompany.tazrim.credit_facility[0];
			if (lineGraph !== undefined) {
				$scope.appData.hideGraph = false;
				if (serData < lineGraph) {
					var valueMin = serData;
				}
				else {
					var valueMin = (serData - (Math.abs(serData) / 5));
				}

				var serDataMax = Math.max.apply(Math, $scope.appData.selectedCompany.tazrim.yLabel.totals);
				var valueMax = serDataMax + (Math.abs(serDataMax) / 5);

				console.log('lineGraph :' + lineGraph);
				console.log('valueMin :' + serData);
				console.log('valueMax :' + serDataMax);
				console.log('SetvalueMin :' + valueMin);
				console.log('SetvalueMax :' + valueMax);

				var circleEmpty = {
					radius: 6,
					fillColor: "#eaeaea",
					lineWidth: 2,
					lineColor: "#1387a9",
					states: {
						hover: {
							radius: 9,
							fillColor: '#eaeaea',
							lineColor: '#1387a9',
							lineWidth: 2
						}
					}
				};
				var x = 0;
				var len = $scope.appData.selectedCompany.tazrim.yLabel.totals.length;
				var xData = [];
				while (x < len) {
					if ($scope.appData.todayGraph == null || (x > $scope.appData.todayGraph)) {
						xData.push({
							y: Math.round($scope.appData.selectedCompany.tazrim.yLabel.totals[x]),
							marker: circleEmpty
						})
					}
					else {
						xData.push({y: Math.round($scope.appData.selectedCompany.tazrim.yLabel.totals[x])})
					}
					x++
				}
				var lineGraphPosition;
				if ($scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length < 6) {
					lineGraphPosition = 120;
				}
				if ($scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length > 5 && $scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length < 8) {
					lineGraphPosition = 150;
				}
				if ($scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length > 7 && $scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length < 12) {
					lineGraphPosition = 170;
				}
				console.log($scope.appData.todayGraph)
				$scope.chartData = {
					valueMin: valueMin,
					valueMax: valueMax,
					zoomType: 'xy',
					animation: false,
					spacingTop: 55,
					spacingLeft: 0,
					spacingRight: 0,
					borderColor: 'transparent',
					borderWidth: 0,
					borderRadius: 0,
					legend: false,
					//spacing: [0,0,0,0],
					xAxis: $scope.appData.selectedCompany.tazrim.xAxis,
					yLabel: 'סה״כ בש״ח',
					yPLotLines: [{ // mark the weekend
						color: '#ec3b65',
						width: 2,
						value: $scope.appData.selectedCompany.tazrim.credit_facility[0],
						dashStyle: 'Solid',
						label: {
							text: ' אשראי ' + accoConversions.getParseComma($scope.appData.selectedCompany.tazrim.credit_facility[0]),
							align: 'left',
							x: lineGraphPosition
						}
					}],
					data: [{
						zoneAxis: 'x',
						zones: [{
							value: $scope.appData.todayGraph == null ? 0 : $scope.appData.todayGraph,
							color: '#1387a9'
						}, {
							color: '#1387a9',
							dashStyle: 'dot'
						}],
						data: xData,
						name: 'Totals',
						cursor: 'pointer'
					}],
					title: ' ',
					subtitle: ' ',
					tooltip: function () {
						var str = '';
						if ($scope.appData.selectedCompany.accounts.bank_account_list.length < 4) {
							str += '<div class="top-chart-tooltip">';
							str += '<div class="inner-bar-chart">';
							var maxHeight = 100;
							var max = [],
								lenPoint = $scope.appData.selectedCompany.tazrim.tooltipData[this.point.x].length;
							for (var i = 0; i < lenPoint; i++) {
								max.push($scope.appData.selectedCompany.tazrim.tooltipData[this.point.x][i].value);
							}
							max = Math.max.apply(null, max);
							for (var i = 0; i < lenPoint; i++) {
								var val = $scope.appData.selectedCompany.tazrim.tooltipData[this.point.x][i].value;
								if (Math.abs(max) < Math.abs(val)) {
									val = max;
									max = val;
								}
								var barHeight = ((Math.abs(val) / Math.abs(max)) * 100) ? ((Math.abs(val) / Math.abs(max)) * 100) : 0;
								var barColor = '#1387a9';
								str += '<div style="height:' + barHeight + '%;background-color:' + barColor + '"></div>';
							}
							str += '</div>';
							str += '<div class="inner-legend">';
						} else {
							str += '<div class="top-chart-tooltip widthAll">';
							str += '<div class="inner-legend widthAll">';
						}

						if ($scope.appData.selectedCompany.accounts.bank_account_list.length > 1) {
							str += '<div><div><h2>כל הבנקים</h2><div class="total"><span>&#8362;</span>' + $scope.getTotal(Math.floor(this.y)) + '</div></div>';
						}
						var lenPointX = $scope.appData.selectedCompany.tazrim.tooltipData[this.point.x].length;
						for (var i = 0; i < lenPointX; i++) {
							str += '<div><div class="name">' + $scope.appData.selectedCompany.tazrim.tooltipData[this.point.x][i].name + '</div><div class="val"><span>&#8362;</span>' + $scope.getTotal(Math.floor($scope.appData.selectedCompany.tazrim.tooltipData[this.point.x][i].value)) + '</div></div>';
						}
						str += '</div></div>';

						return str;
					}
				};
			}
			else {
				$scope.appData.hideGraph = true;
			}

			$scope.loaderSkiraKsafimGraph = false;
			$scope.$parent.loaderSkiraKsafimGraph = false;
		};
		$scope.showSpecific = function (data, notify) {
			if (!$scope.appData.selectedCompany.tazrim)
				return;

			var tooltipData = [];

			if (data.length == 1) {
				var lengthArray = 0;
				var lineGraph = data[0].credit_facility;
			}
			else {
				var lengthArray = 1;
				var lineGraph = data[1].credit_facility;
			}
			var lenTaz = $scope.appData.selectedCompany.tazrim.length;
			for (var i = 0; i < lenTaz; i++) {
				tooltipData.push([]);
				var lenRowTaz = $scope.appData.selectedCompany.tazrim[i].rows.length;
				for (var j = 0; j < lenRowTaz; j++) {
					if ($scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id == data[lengthArray].company_account_id) {
						var obj = $scope.appData.selectedCompany.tazrim[i].rows[j];
						if (obj.total_hacnasot.peoulot) {
							var lenPeu = obj.total_hacnasot.peoulot.length;
							for (var k = 0; k < lenPeu; k++) {
								if (obj.total_hacnasot.peoulot[k].hachnasa !== 0) {
									tooltipData[i].push({
										name: obj.total_hacnasot.peoulot[k].trans_name,
										value: obj.total_hacnasot.peoulot[k].hachnasa,
										ind: 0
									});
								}
							}
						}
						if (obj.total_hozaot.peoulot) {
							var lenPeuEx = obj.total_hozaot.peoulot.length;
							for (var k = 0; k < lenPeuEx; k++) {
								if (obj.total_hozaot.peoulot[k].hozaa !== 0) {
									tooltipData[i].push({
										name: obj.total_hozaot.peoulot[k].trans_name,
										value: obj.total_hozaot.peoulot[k].hozaa,
										ind: 1
									});
								}
							}
						}
					}
				}
			}
			var serData = Math.min.apply(Math, $scope.appData.selectedCompany.tazrim.yLabel[data[lengthArray].company_account_id]);

			if (serData < lineGraph) {
				var valueMin = serData;
			}
			else {
				var valueMin = (serData - (Math.abs(serData) / 5));
			}
			var dataGraph = $scope.appData.selectedCompany.tazrim.yLabel[data[lengthArray].company_account_id];
			if (dataGraph !== undefined) {
				$scope.appData.hideGraph = false;
				var serDataMax = Math.max.apply(Math, $scope.appData.selectedCompany.tazrim.yLabel[data[lengthArray].company_account_id]);
				var valueMax = serDataMax + (Math.abs(serDataMax) / 5);
				var circleEmpty = {
					radius: 6,
					fillColor: "#eaeaea",
					lineWidth: 2,
					lineColor: "#1387a9",
					states: {
						hover: {
							radius: 9,
							fillColor: '#eaeaea',
							lineColor: '#1387a9',
							lineWidth: 2
						}
					}
				};
				var x = 0;
				var len = dataGraph.length;
				var xData = [];
				while (x < len) {
					if ($scope.appData.todayGraph == null || (x > $scope.appData.todayGraph)) {
						xData.push({
							y: Math.round(dataGraph[x]),
							marker: circleEmpty
						})
					}
					else {
						xData.push({y: Math.round(dataGraph[x])})
					}
					x++
				}

				var lineGraphPosition;
				if (lineGraph.toString().length < 6) {
					lineGraphPosition = 120;
				}
				if (lineGraph.toString().length > 5 && lineGraph.toString().length < 8) {
					lineGraphPosition = 150;
				}
				if (lineGraph.toString().length > 7 && lineGraph.toString().length < 12) {
					lineGraphPosition = 170;
				}


				console.log('lineGraph :' + lineGraph);
				console.log('valueMin :' + serData);
				console.log('valueMax :' + serDataMax);
				console.log('SetvalueMin :' + valueMin);
				console.log('SetvalueMax :' + valueMax);
				$scope.chartData = {
					valueMin: valueMin,
					valueMax: valueMax,
					zoomType: 'xy',
					animation: false,
					spacingTop: 55,
					spacingLeft: 0,
					spacingRight: 0,
					borderColor: '#fff',
					borderWidth: 0,
					borderRadius: 0,
					legend: false,
					xAxis: $scope.appData.selectedCompany.tazrim.xAxis,
					yLabel: 'סה״כ בש״ח',
					yPLotLines: [{
						color: '#ec3b65',
						width: 2,
						value: lineGraph,
						dashStyle: 'Solid',
						label: {
							text: 'מסגרת אשראי  ' + accoConversions.getParseComma(lineGraph),
							align: 'left',
							x: lineGraphPosition
						}
					}],
					data: [{
						zoneAxis: 'x',
						zones: [{
							value: $scope.appData.todayGraph == null ? 0 : $scope.appData.todayGraph,
							color: '#1387a9'
						}, {
							color: '#1387a9',
							dashStyle: 'dot'
						}],
						data: xData,
						name: 'Totals',
						cursor: 'pointer'
					}],
					title: ' ',
					subtitle: ' ',
					tooltip: function () {
						var str = '<div class="chart-tooltip-table"><table><tbody>';
						var len = tooltipData[this.point.x].length;
						for (var i = 0; i < len; i++) {
							var clss = (tooltipData[this.point.x][i].ind == 1) ? 'expense' : 'income';
							str += '<tr><td><div>' + tooltipData[this.point.x][i].name + '</div></td><td class="' + clss + '"><div><span>&#8362;</span>' + $scope.getTotal(tooltipData[this.point.x][i].value) + '</div></td></tr>';
						}
						str += '</table></tbody></div>';
						return (tooltipData[this.point.x].length > 0) ? str : 'לא צפויות פעולות ליום זה';
					}
				};
			}
			else {
				$scope.appData.hideGraph = true;
			}
			$scope.loaderSkiraKsafimGraph = false;
			$scope.$parent.loaderSkiraKsafimGraph = false;
		};

		$scope.$on('showTotal', function (data) {
			$scope.showTotal(true);
			$scope.getKsafimData(true);
			$scope.getWithdrawals($scope.pieInd);
		});

		$scope.$on('showSpecific', function (event, data) {
			$scope.showSpecific(data, true);
			$scope.getKsafimData(true);
			$scope.getWithdrawals($scope.pieInd);
		});

		$scope.$on('WithdrawChanged', function (data) {
			$scope.showWithdrowals();
		});

		$scope.$on('loadKsafimData', function () {
			$scope.getKsafimData(true);
		});

		$scope.$on('TazrimChanged', function (data) {
			if ($scope.appData.selectedCompany.accounts.bank_account_list.length > 1) {
				$scope.showTotal(true);
			}
			else {
				$scope.showSpecific(data.currentScope.appData.selectedCompany.accounts.bank_account_list, false);
			}
		});

		$scope.nextAndPrevGraph = function (type) {
			//$scope.loaderSkiraKsafimGraph = true;
			function addWeek(week, oneDay) {
				var days = 1;
				if (oneDay) {
					days = 11;
				}
				var dates = new Date();
				dates.setFullYear(parseInt(week.toString().split('/')[2]));
				dates.setMonth(parseInt(week.toString().split('/')[1]) - 1);
				dates.setDate(parseInt(week.toString().split('/')[0]) + days);

				return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear()
			};

			function prevWeek(week, oneDay) {
				var days = 1;
				if (oneDay) {
					days = 11;
				}
				var dates = new Date();
				dates.setFullYear(parseInt(week.toString().split('/')[2]));
				dates.setMonth(parseInt(week.toString().split('/')[1]) - 1);
				dates.setDate(parseInt(week.toString().split('/')[0]) - days);

				return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear()
			};

			if (type == 'next') {
				$scope.$parent.showPrevButton = true;
				if ($scope.appData.prevNextGraphType == 'prev' || !$scope.appData.prevNextGraphType || $scope.appData.prevNextGraphTypeAdd == 'prev') {
					if ($scope.appData.indexGraphTazrimGeneral.to !== 11) {
						$scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from + 1;
						$scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to + 1;
					}
					else {
						$scope.$parent.spinnerNext = true;
					}
					$scope.appData.prevNextGraphType = 'next';
					$scope.appData.prevNextGraphTypeAdd = 'next';
					$scope.appData.nextAndPrevGraphFrom = addWeek($scope.appData.nextAndPrevGraphTo);
					$scope.appData.nextAndPrevGraphTo = addWeek($scope.appData.nextAndPrevGraphTo, true);
					$scope.$parent.getTazrim($scope.appData.nextAndPrevGraphFrom, $scope.appData.nextAndPrevGraphTo, true);
				}
				else {
					if ($scope.appData.indexGraphTazrimGeneral.to == 11) {
						if (!$scope.appData.tazrimGraphMainGeneralNew) {
							$scope.$parent.spinnerNext = true;
						}
						else {
							$scope.appData.indexGraphTazrimGeneral.from = 0;
							$scope.appData.indexGraphTazrimGeneral.to = 7;
							$scope.appData.tazrimGraphMainGeneral = angular.copy($scope.appData.tazrimGraphMainGeneralNew);
							$scope.appData.tazrimGraphMainGeneralNew = false;
							$scope.appData.prevNextGraphTypeAdd = 'prev';
						}
					}
					else {
						$scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from + 1;
						$scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to + 1;
					}
				}
				$scope.appData.selectedCompany.tazrim = angular.copy($scope.appData.tazrimGraphMainGeneral).slice($scope.appData.indexGraphTazrimGeneral.from, $scope.appData.indexGraphTazrimGeneral.to)
				$scope.$parent.graphSett();
			}
			if (type == 'prev') {
				//if ($scope.appData.balanceLastUpdateDateForGraph > 0) {
				//	$scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from - 1;
				//	$scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to - 1;
				//	//$scope.appData.nextAndPrevGraphTo = prevWeek($scope.appData.nextAndPrevGraphFrom);
				//	//$scope.appData.nextAndPrevGraphFrom = prevWeek($scope.appData.nextAndPrevGraphFrom, true);
				//	//$scope.$parent.getTazrim($scope.appData.nextAndPrevGraphFrom, $scope.appData.nextAndPrevGraphTo);
				//	$scope.appData.selectedCompany.tazrim = angular.copy($scope.appData.tazrimGraphMainGeneral).slice($scope.appData.indexGraphTazrimGeneral.from, $scope.appData.indexGraphTazrimGeneral.to)
				//	$scope.$parent.graphSett();
				//}
				if ($scope.appData.prevNextGraphType == 'prev' && $scope.appData.indexGraphTazrimGeneral.from == 1 && $scope.appData.balanceLastUpdateDateForGraph == $scope.appData.nextAndPrevGraphFrom) {
					$scope.$parent.showPrevButton = false;
				}
				if ($scope.appData.prevNextGraphType == 'next' || !$scope.appData.prevNextGraphType || $scope.appData.prevNextGraphTypeAdd == 'next') {
					if ($scope.appData.indexGraphTazrimGeneral.from !== 0) {
						$scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from - 1;
						$scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to - 1;
					}
					else {
						$scope.$parent.spinnerPrev = true;
					}
					$scope.appData.prevNextGraphTypeAdd = 'prev';
					$scope.appData.prevNextGraphType = 'prev';
					$scope.appData.nextAndPrevGraphTo = prevWeek($scope.appData.nextAndPrevGraphFrom);
					$scope.appData.nextAndPrevGraphFrom = prevWeek($scope.appData.nextAndPrevGraphFrom, true);
					$scope.$parent.getTazrim($scope.appData.nextAndPrevGraphFrom, $scope.appData.nextAndPrevGraphTo, true);
					if ($scope.appData.indexGraphTazrimGeneral.from == 0 && $scope.appData.balanceLastUpdateDateForGraph == $scope.appData.nextAndPrevGraphFrom) {
						$scope.$parent.showPrevButton = false;
					}
				}
				else {
					if ($scope.appData.indexGraphTazrimGeneral.from == 0) {
						if (!$scope.appData.tazrimGraphMainGeneralNew) {
							$scope.$parent.spinnerPrev = true;
						}
						else {
							$scope.appData.indexGraphTazrimGeneral.from = 4;
							$scope.appData.indexGraphTazrimGeneral.to = 11;
							$scope.appData.tazrimGraphMainGeneral = angular.copy($scope.appData.tazrimGraphMainGeneralNew);
							$scope.appData.tazrimGraphMainGeneralNew = false;
							$scope.appData.prevNextGraphTypeAdd = 'next';
						}
					}
					else {
						$scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from - 1;
						$scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to - 1;
					}
				}
				$scope.appData.selectedCompany.tazrim = angular.copy($scope.appData.tazrimGraphMainGeneral).slice($scope.appData.indexGraphTazrimGeneral.from, $scope.appData.indexGraphTazrimGeneral.to)
				$scope.$parent.graphSett();
			}
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
		$scope.$watch('pieInd', function (newVal) {
			if ($scope.appData.selectedCompany) {
				$scope.getCompaniesThisStrorage();
				$scope.datesDef();
				$scope.getWithdrawals(newVal);
				$scope.$broadcast('getCompanyAccountsFunds');
			}
		});
		$scope.$parent.showPopOutLoans = function (obj, types) {
			if (obj) {
				$scope.appData.objPopUp = obj;
				$scope.appData.objPopUp.types = types;
				$scope.showPopup('views/templates/popupDetailsSkira.html?ver=1.58', 'popupDetailsSkira', false);
			}
		};
		$scope.goToBankAccountsTable = function (type, num) {
			var fromDate, toDate;

			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			switch ($scope.appData.dateFilter.type) {
				case "0":
					fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					break;
				case "1":
					fromDate = '01/01/' + $scope.dateFilter.byOnlyYear;
					toDate = '31/12/' + $scope.dateFilter.byOnlyYear;
					break;
				case "2":
					fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
					toDate = '01/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
					break;
			}
			var id = null;
			if ($scope.shownGraphIndex !== 0) {
				id = $scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1].company_account_id;
			}
			if ($scope.appData.goToBankAccountsTable) {
				$scope.appData.goToBankAccountsTable = '';
			}
			var pieInd;
			if ($scope.pieInd == 0) {
				pieInd = false;
			}
			if ($scope.pieInd == 1) {
				pieInd = true;
			}
			$scope.appData.goToBankAccountsTable = {
				'hasPeula': pieInd,
				'type': type,
				'filters': $scope.appData.dateFilter.type,
				'fromDate': fromDate,
				'toDate': toDate,
				'typeSum': num,
				'accId': id
			};
			$scope.$state.go('fundManagement.bankAccounts.table');
		};
	}


	angular.module('controllers')
	.controller('generalFundsCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', generalFundsCtrl]);
}());

