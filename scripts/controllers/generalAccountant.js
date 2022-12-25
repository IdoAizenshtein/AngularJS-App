(function () {
	function generalAccountant($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.bankId = $state.params.bank;
		$scope.months = utils.monthNames();
		$scope.init = function () {
			$scope.$parent.pieInd = 3;
			$scope.$parent.activePie = 3;
			if ($scope.bankId) {
				var index, lenAcc = $scope.appData.selectedCompany.accounts.bank_account_list.length;
				for (var i = 0; i < lenAcc; i++) {
					if ($scope.appData.selectedCompany.accounts.bank_account_list[i].company_account_id)
						index = i;
				}
			}
		};
		$scope.getMessagesAcc = function () {
			serverConnection.hanatransGetlastpeulot($scope.appData.selectedCompany.companyId).then(function (response) {
				$scope.appData.selectedCompany.messagesAccList = response;
			}, function (error) {
			});
		}
		$scope.$watch('pieInd', function (newVal) {
			if ($scope.appData.selectedCompany) {
				$scope.getCompaniesThisStrorage();
				$scope.datesDef();

				$scope.getWithdrawals(newVal);
				$scope.getMessagesAcc();
				$scope.getAccList();
				$scope.skiraListType();
			}
		});
		$scope.$on('getCompanyAccountsFunds', function () {
			if ($state.current.name == 'general.accountant') {
				$scope.datesDef();
				$scope.getAccList();
				$scope.getMessagesAcc();
				$scope.skiraListType();
			}
		});
		$scope.skiraListType = function () {
			$scope.$parent.loaderSkiraAccGraph = true;

			serverConnection.getSkiraListType($scope.appData.selectedCompany.companyId).then(function (response) {
				$scope.appData.selectedCompany.skiraListType = response;
				var arr = [];
				$scope.appData.selectedCompany.skiraListType.forEach(function (v) {
					if (v.metchilatshana !== 0) {
						arr.push(v)
					}
				});
				$scope.appData.selectedCompany.skiraListType = arr;
				var i = 0;
				var text = "";
				while ($scope.appData.selectedCompany.skiraListType[i]) {
					var data = $scope.appData.selectedCompany.skiraListType[i].caption;
					$scope.selectSkira(data, 0);
					break
					i++;
				}
				$scope.$parent.loaderSkiraAccGraph = false;
			}, function (error) {
			});
		};
		$scope.selectSkira = function (data, idx) {
			$scope.today = new Date();
			if ($scope.appData.selectedCompany.default_account_month) {
				var datesYear = $scope.appData.selectedCompany.default_account_month.toString().substring(0, 4);
				$scope.today.setFullYear(parseFloat(datesYear))
			}
			$scope.lastDayOfMonth = new Date($scope.today.getFullYear(), $scope.today.getMonth() + 1, 0);
			$scope.lastDayOfMonthPrev = new Date(($scope.today.getFullYear() - 1), $scope.today.getMonth() + 1, 0);

			$scope.indexGraph = idx;
			var numOrStr = data;
			var parseData = parseInt(numOrStr);
			var dateFrom = $scope.today.getFullYear() + '0101';
			var dateTill = $scope.lastDayOfMonth.getFullYear() + '' + ("0" + ($scope.lastDayOfMonth.getMonth() + 1)).slice(-2) + '' + ("0" + ($scope.lastDayOfMonth.getDate())).slice(-2);

			var dateFromPrev = ($scope.today.getFullYear() - 1) + '0101';
			var dateTillPrev = $scope.lastDayOfMonthPrev.getFullYear() + '' + ("0" + ($scope.lastDayOfMonthPrev.getMonth() + 1)).slice(-2) + '' + ("0" + ($scope.lastDayOfMonthPrev.getDate())).slice(-2);

			if (isNaN(parseData) == false) {
				if (!$scope.appData.selectedCompany[data]) {
					var req = {
						"companyId": $scope.appData.selectedCompany.companyId,
						"from": dateFrom,
						"till": dateTill,
						"prevFrom": dateFromPrev,
						"prevTill": dateTillPrev,
						"targetTab": [data],
						"transTypeCatId": "null",
						"supplierId": "null",
						"sortCodeId": "null"
					};

					serverConnection.getSkiraGraphAccNumbers(req).then(function (response) {
						$scope.appData.selectedCompany[data] = response;
						$scope.getGraphSlika(data.toString());
					}, function (error) {

					});
				}
				else {
					$scope.getGraphSlika(data.toString());
				}
			}
			else {
				var req = {
					"companyId": $scope.appData.selectedCompany.companyId,
					"from": dateFrom,
					"till": dateTill,
					"prevFrom": dateFromPrev,
					"prevTill": dateTillPrev
				};
				if (numOrStr == 'golmi') {
					if (!$scope.appData.selectedCompany.skiraGraphRgolmicmp) {
						serverConnection.rgolmicmp(req).then(function (response) {
							$scope.appData.selectedCompany.skiraGraphRgolmicmp = response;
							$scope.getGraphSlika('skiraGraphRgolmicmp');
						}, function (error) {

						});
					}
					else {
						$scope.getGraphSlika('skiraGraphRgolmicmp');
					}
				}
				if (numOrStr == 'naki') {
					if (!$scope.appData.selectedCompany.skiraGraphrnakicmp) {
						serverConnection.rnakicmp(req).then(function (response) {
							$scope.appData.selectedCompany.skiraGraphrnakicmp = response;
							$scope.getGraphSlika('skiraGraphrnakicmp');
						}, function (error) {

						});
					}
					else {
						$scope.getGraphSlika('skiraGraphrnakicmp');
					}
				}
			}
		};
		$scope.getGraphSlika = function (dataNum) {
			if ($scope.appData.selectedCompany[dataNum]) {
				var xAxis = [];
				var dataGraph = [];
				$scope.appData.selectedCompany[dataNum].line_graph.forEach(function (v) {
					xAxis.push($scope.accoConversions.getDayMonthNum(v.date_month.toString()));
					var tooltips = new Array();
					v.tooltip.forEach(function (v1) {
						var tool_content = {
							'title': v1.name,
							'value': v1.total.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
						};
						tooltips.push(tool_content);
					});
					dataGraph.push({'y': parseInt(v.sum), 'players': tooltips});
				});

				$scope.chartData = {
					spacingTop: 55,
					spacingLeft: 0,
					spacingRight: 0,
					borderColor: '#fff',
					borderWidth: 0,
					borderRadius: 0,
					legend: false,
					xAxis: xAxis,
					data: [{
						data: dataGraph,
						cursor: 'pointer',
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
						}
					}],
					title: ' ',
					subtitle: ' ',
					tooltip: function () {
						var str = '<div class="chart-tooltip-table"><table><tbody>';
						str += '<tr style="font-family: esterebold, Arial;"><td><div>סה"כ</div></td><td><div><span>&#8362;</span>' + $scope.getTotal(this.y) + '</div></td></tr>';
						this.point.players.forEach(function (datum) {
							str += '<tr><td><div>' + datum.title + '</div></td><td><div><span>&#8362;</span>' + datum.value + '</div></td></tr>';
						});
						return (this.point.players.length > 0) ? str : 'אין נתונים';
					}

				};
			}
		};
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
		$scope.getAccList = function (forced) {
			if (!$scope.appData.selectedCompany.accListData || forced) {
				$scope.$parent.loaderAccListData = true;
				serverConnection.getAccList($scope.appData.selectedCompany.companyId).then(function (response) {
					$scope.appData.selectedCompany.accListData = response;
					$scope.$parent.loaderAccListData = false;
					$scope.$broadcast('widthChanged');
				}, function (error) {

				});
			}
		};
		$scope.goToAnalisis = function (sortCodeId, tabs) {
			$scope.appData.analysisDates = true;
			$scope.appData.byMonthAnalisis = $scope.dateFilter.byMonth;
			$scope.appData.byYearAnalisis = $scope.dateFilter.byYear;
			$scope.appData.byOnlyYearAnalisis = $scope.dateFilter.byOnlyYear;
			$scope.appData.fromMonthAnalisis = $scope.dateFilter.fromMonth;
			$scope.appData.fromYearAnalisis = $scope.dateFilter.fromYear;
			$scope.appData.toMonthAnalisis = $scope.dateFilter.toMonth;
			$scope.appData.toYearAnalisis = $scope.dateFilter.toYear;
			$scope.appData.targetTab = tabs;

			if ($scope.appData.selectedCompany.withdrawals[0].sort_code_exists == 1) {
				if ($scope.activePie == 2) {
					$scope.appData.transCodesAnalisis = sortCodeId;
					$scope.appData.sortCodesAnalisis = '';
				}
				if ($scope.activePie == 3) {
					$scope.appData.sortCodesAnalisis = sortCodeId;
					$scope.appData.transCodesAnalisis = '';
				}
			}
			else {
				$scope.appData.transCodesAnalisis = sortCodeId;
				$scope.appData.sortCodesAnalisis = '';
			}
			$state.go('analysis');
		};
	}

	angular.module('controllers')
	.controller('generalAccountant', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', generalAccountant]);
}());
