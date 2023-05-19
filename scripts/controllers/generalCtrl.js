(function () {
	function generalCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();

		$scope.date = new Date();
		$scope.shownGraph = {company_account_nickname: 'כל הבנקים'};
		$scope.shownGraphIndex = 0;
		$scope.shownGraphIndexSelected = '0';
		$scope.datesDef = function () {
			var byMonth;
			var byYear;
			if ($state.current.name == 'general.accountant') {
				$scope.years = utils.years(10);
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
			}
			else {
				$scope.years = utils.yearsKsafim(3);

				if ($scope.date.getMonth() !== 0) {
					if ($scope.date.getDate() == 1) {
						byMonth = $scope.date.getMonth() - 1;
					}
					else {
						byMonth = $scope.date.getMonth();
					}
					byYear = $scope.date.getFullYear();
				}
				else {
					if ($scope.date.getDate() == 1) {
						byMonth = 11;
						byYear = $scope.date.getFullYear() - 1;
					}
					else {
						byMonth = $scope.date.getMonth();
						byYear = $scope.date.getFullYear();
					}
				}

			}
			$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
			$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
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
		$scope.loaderLastPeulot = true;
		$scope.loaderKsafimData = true;
		$scope.loaderAccListData = true;
		$scope.loaderSkiraKsafimGraph = true;
		$scope.loaderSkiraKsafimGraphPay = true;
		$scope.loaderSkiraAccGraph = true;
		$scope.loaderSkiraAccGraphPay = true;
		$scope.spinnerNext = false;
		$scope.spinnerPrev = false;
		$scope.pieInd = 0;
		$scope.colorsNegative = ['#BB404C', '#EC3C66', '#F06485', '#ED4A4A', '#FD6935', '#FD9C35', '#FDC430', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
		$scope.colorsPositive = ['#15708B', '#1287AA', '#19A9C4', '#30C7C2', '#4FA374', '#59BE85', '#69D776', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
		$scope.colorsBanks = ['#1387a9', '#19a9c5', '#23c5e5', '#30C7C2', '#4FA374', '#59BE85', '#69D776', '#DADADA'];
		$scope.showPrevButton = false;
		$scope.init = function () {
		};
		$scope.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.datesDef();
			$scope.$broadcast('widthChanged');
			$scope.getMessages(null);
			$scope.getWithdrawals($scope.pieInd);
			$scope.$broadcast('getCompanyAccountsFunds');
			$scope.branch_mechirotmonth_getdata()
		};
		$scope.openCheckImg = function (uuid, idBank, bankTransId) {
			if (uuid == 'x') {
				$scope.showPopup('views/templates/alertXcheck.html?ver=3.80', 'popAlert', true);
				setTimeout(function () {
					$scope.hidePopup();
				}, 3000)
			}
			else {
				$scope.loaderMatch = false;

				var folder_name;
				$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
					if (v.company_account_id == idBank) {
						folder_name = v.bank_id + '' + v.bank_snif_id + '' + v.bank_account_number;
					}
				});
				serverConnection.copyCheks(uuid, folder_name, bankTransId).then(function (picture) {
					$scope.loaderMatch = true;
					if (picture.length > 0) {
						$scope.showPopup('views/templates/imgChecks.html?ver=3.80', 'imgChecks', false);
						return $scope.pictureCheck(picture);
					}
					else {
						$scope.appData.iconCheckAll = '';
						$scope.showPopup('views/templates/checksnot.html?ver=3.80', 'popAlert', true);
						setTimeout(function () {
							$scope.hidePopup();
						}, 1500)
					}
				}, function (error) {
					$scope.loaderMatch = true;

				});
			}
		};
		$scope.graphSett = function () {
			$scope.appData.todayGraph = null;
			var xAxis = [], yLabel = {totals: []}, credit_facility = [], tooltipData = [],
				lenTazrim = $scope.appData.selectedCompany.tazrim.length;
			for (var i = 0; i < lenTazrim; i++) {
				var dateSplit = $scope.appData.selectedCompany.tazrim[i].day_id.split("/");

				var datesToday = new Date();
				var dateToday = ("0" + (datesToday.getDate())).slice(-2) + '/' + ("0" + (datesToday.getMonth() + 1)).slice(-2) + '/' + datesToday.getFullYear().toString();
				if (dateToday == $scope.appData.selectedCompany.tazrim[i].day_id) {
					xAxis.push("היום");
					$scope.appData.todayGraph = i;
				}
				else {
					xAxis.push(dateSplit[0] + "/" + dateSplit[1]);
				}
				credit_facility.push($scope.appData.selectedCompany.accounts.total_credit_facility);
				tooltipData.push([]);
				var lengthRowTaz = $scope.appData.selectedCompany.tazrim[i].rows.length;
				for (var j = 0; j < lengthRowTaz; j++) {
					if ($scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id == null) {
						yLabel.totals.push($scope.appData.selectedCompany.tazrim[i].rows[j].total_itra);
					}
					else {
						tooltipData[i].push({
							value: $scope.appData.selectedCompany.tazrim[i].rows[j].total_itra,
							name: $scope.getNickname($scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id)
						});
						yLabel[$scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id] = yLabel[$scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id] || [];
						yLabel[$scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id].push($scope.appData.selectedCompany.tazrim[i].rows[j].total_itra);
					}
				}
			}

			$scope.appData.selectedCompany.tazrim.xAxis = xAxis;
			$scope.appData.selectedCompany.tazrim.yLabel = yLabel;
			$scope.appData.selectedCompany.tazrim.credit_facility = credit_facility;
			$scope.appData.selectedCompany.tazrim.tooltipData = tooltipData;
			if ($scope.shownGraphIndex == 0) {
				$scope.$broadcast('showTotal', true);
			}
			else {
				$scope.$broadcast('showSpecific', [$scope.shownGraphIndex - 1, $scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1]]);
			}
		}

		if (!$scope.appData.indexGraphTazrimGeneral) {
			$scope.appData.indexGraphTazrimGeneral = {
				from: 0,
				to: 7
			}
		}
		$scope.branch_mechirotmonth_getdata = function (id) {
			//var data = {
			//	"company_id":"0CE9901EB83B18FFE053650AA8C071BD",
			//	"company_branch_id":"0CE9901EB84118FFE053650AA8C071BD",
			//	"currdate":"01/08/2015"
			//}
			//serverConnection.branch_mechirotmonth_getdata(data).then(function (response) {
			//
			//}, function (error) {
			//});
		};
		$scope.getTazrim = function (fromDate, tillDate, nav) {
			if (!$scope.appData.selectedCompany.tazrim || nav) {
				serverConnection.getTazrim({
					company_id: $scope.appData.selectedCompany.companyId,
					date_from: fromDate,
					date_till: tillDate
				}).then(function (response) {
					if (!nav) {
						$scope.appData.tazrimGraphMainGeneral = angular.copy(response);
						$scope.appData.selectedCompany.tazrim = response.slice($scope.appData.indexGraphTazrimGeneral.from, $scope.appData.indexGraphTazrimGeneral.to);
						$scope.graphSett();
					}
					else {
						$scope.spinnerPrev = false;
						$scope.spinnerNext = false;
						$scope.appData.tazrimGraphMainGeneralNew = angular.copy(response);
					}
					$scope.$broadcast('widthChanged');
				}, function (error) {
				});
			}
			else {
				$scope.graphSett();
			}
		};
		$scope.updateSelection = function (forced) {
			//if (angular.isObject(forced)) {
			$scope.loaderSkiraKsafimGraph = true;

			$scope.shownGraphIndex = parseInt(forced);
			$scope.shownGraphIndexSelected = forced.toString();

			if ($scope.shownGraphIndex == 0) {
				$scope.$broadcast('showTotal', true);
				$scope.getMessages(null);
			}
			else {
				$scope.getMessages($scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1].company_account_id);
				$scope.$broadcast('showSpecific', [$scope.shownGraphIndex - 1, $scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1]]);
			}
		};
		$scope.getNickname = function (companyId) {
			var response = '';
			if ($scope.appData.selectedCompany.accounts && $scope.appData.selectedCompany.accounts.bank_account_list.length > 0) {
				$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (account) {
					if (account.company_account_id == companyId)
						response = account.company_account_nickname;
				});
			}
			return response;
		};
		$scope.getAccountNum = function (companyId) {
			var response = '';
			$scope.appData.selectedCompany.tokens.accounts_and_cc.forEach(function (account) {
				account.accounts.forEach(function (acc) {
					if (acc.company_account_id == companyId)
						response = acc.bank_account_id;
				});
			})
			return response;
		};
		$scope.buttonActive = true;
		$scope.selectActive = true;
		$scope.getDate = function (int) {
			var d = new Date(int);
			return (d.getFullYear() + '').substr(2, 4) + ' ב' + $scope.utils.monthNames()[d.getMonth()] + ' ' + d.getHours() + ':' + d.getMinutes();
		};
		$scope.getWithdrawals = function (pieInd) {
			$scope.loaderSkiraKsafimGraphPay = true;
			$scope.loaderSkiraAccGraphPay = true;

			$scope.appData.selectedCompany.withdrawals = [{
				"name": "משיכות",
				"sum": 0.0,
				"month_id": 0,
				"children": [],
				"sort_code_exists": 1
			}, {
				"name": "הפקדות",
				"sum": 0.0,
				"month_id": 0,
				"children": [],
				"sort_code_exists": 1
			}];
			$scope.activePie = pieInd;
			var fromDate, toDate;

			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			switch ($scope.appData.dateFilter.type) {
				case "0":
					//if($scope.pieInd == 2 || $scope.pieInd == 3){
					//    if($scope.appData.selectedCompany.default_account_month){
					//        var default_account_month = $scope.appData.selectedCompany.default_account_month;
					//        fromDate = '01/' +  default_account_month.toString().substring(4,6) + '/' + default_account_month.toString().substring(0, 4);

					//        var date = new Date();
					//        date.setFullYear(parseInt(default_account_month.toString().substring(0, 4)));
					//        date.setMonth(parseInt(default_account_month.toString().substring(4,6)));
					//        date.setDate(1);

					//        toDate = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
					//        $scope.datePeriod = accoConversions.getDateMonth(default_account_month.toString().substring(4, 6)) + ' ' + default_account_month.toString().substring(0, 4);

					//    }
					//    else{
					//        var date = new Date();
					//        date.setFullYear(date.getFullYear());
					//        date.setMonth(date.getMonth() - 2);
					//        date.setDate(date.getDate());
					//        fromDate = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
					//        $scope.datePeriod = accoConversions.getDateMonth(("0" + (date.getMonth() + 1)).slice(-2)) + ' ' + date.getFullYear();


					//        date.setFullYear(date.getFullYear());
					//        date.setMonth(date.getMonth() - 1);
					//        date.setDate(date.getDate());
					//        toDate = ("0" + (date.getDate())).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();

					//    }
					//}
					//else{

					var bymonthDate = (parseInt($scope.dateFilter.byMonth) + 1);

					fromDate = '01/' + ("0" + bymonthDate).slice(-2) + '/' + $scope.dateFilter.byYear;
					toDate = daysInMonth(bymonthDate - 1, $scope.dateFilter.byYear) + '/' + ("0" + bymonthDate).slice(-2) + '/' + $scope.dateFilter.byYear;
					$scope.datePeriod = accoConversions.getDateMonth(("0" + bymonthDate).slice(-2)) + ' ' + $scope.dateFilter.byYear;
					break;
				case "1":
					fromDate = '01/01/' + $scope.dateFilter.byOnlyYear;
					toDate = '31/12/' + $scope.dateFilter.byOnlyYear;
					$scope.datePeriod = fromDate + ' - ' + toDate;

					break;
				case "2":
					fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
					toDate = daysInMonth(parseInt($scope.dateFilter.toMonth), $scope.dateFilter.toYear) + '/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
					$scope.datePeriod = fromDate + ' - ' + toDate;
					break;
			}

			var id = null;
			if ($scope.shownGraphIndex !== 0) {
				id = $scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1].company_account_id;
			}


			serverConnection.getWithdrawals({
				incompany_id: $scope.appData.selectedCompany.companyId,
				incompany_account_id: id,
				indate_from: fromDate,
				indate_till: toDate,
				ind_trans_type: pieInd
			}).then(function (response) {
				$scope.appData.selectedCompany.withdrawals = response;
				$scope.showWithdrowals();
			}, function (error) {

			});
		};
		$scope.showWithdrowals = function () {
			var positive = [], negative = [];
			var pZeros = true, nZeros = true;
			var colorsNegative = $scope.colorsNegative;
			var colorsPositive = $scope.colorsPositive;
			var lenChildWid = $scope.appData.selectedCompany.withdrawals[0].children.length;
			for (var i = 0; i < lenChildWid; i++) {
				negative.push(Math.abs($scope.appData.selectedCompany.withdrawals[0].children[i].sum));
				if ($scope.appData.selectedCompany.withdrawals[0].children[i].sum != 0)
					nZeros = false;
			}
			var lenChildWidTwo = $scope.appData.selectedCompany.withdrawals[1].children.length;
			for (var i = 0; i < lenChildWidTwo; i++) {
				positive.push($scope.appData.selectedCompany.withdrawals[1].children[i].sum);
				if ($scope.appData.selectedCompany.withdrawals[1].children[i].sum != 0)
					pZeros = false;
			}

			var nSum = 0;
			if (negative.length > 0) {
				nSum = negative.reduce(function (previousValue, currentValue, index, array) {
					return previousValue + currentValue;
				});
			}

			var pSum = 0;
			if (positive.length > 0) {
				pSum = positive.reduce(function (previousValue, currentValue, index, array) {
					return previousValue + currentValue;
				});
			}

			if (pZeros) {
				positive = [0, 1];
				colorsPositive = ['#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
			}

			if (nZeros) {
				negative = [0, 1];
				colorsNegative = ['#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
			}


			//$scope.appData.selectedCompany.withdrawals[0].sum = Math.abs(nSum);
			//$scope.appData.selectedCompany.withdrawals[1].sum = Math.abs(pSum);
			//   debugger
			$scope.appData.selectedCompany.withdrawals[0].tooltips = [];
			var lenChildWidA = $scope.appData.selectedCompany.withdrawals[0].children.length;
			for (var i = 0; i < lenChildWidA; i++) {
				$scope.appData.selectedCompany.withdrawals[0].children[i].data = negative;
				var tmpColors = [], lenColo = colorsNegative.length;
				for (var j = 0; j < lenColo; j++) {
					if (i == j)
						tmpColors.push(colorsNegative[j]);
					else
						tmpColors.push('#DADADA');
				}
				$scope.appData.selectedCompany.withdrawals[0].children[i].colors = tmpColors;
				$scope.appData.selectedCompany.withdrawals[0].children[i].tooltip = '&nbsp;';
				$scope.appData.selectedCompany.withdrawals[0].tooltips.push({
					name: $scope.appData.selectedCompany.withdrawals[0].children[i].name,
					value: $scope.appData.selectedCompany.withdrawals[0].children[i].sum
				});
			}
			$scope.appData.selectedCompany.withdrawals[1].tooltips = [];
			var lenChildWidTwoB = $scope.appData.selectedCompany.withdrawals[1].children.length;
			for (var i = 0; i < lenChildWidTwoB; i++) {
				$scope.appData.selectedCompany.withdrawals[1].children[i].data = positive;
				var tmpColors = [], lenColor = colorsPositive.length;
				for (var j = 0; j < lenColor; j++) {
					if (i == j)
						tmpColors.push(colorsPositive[j]);
					else
						tmpColors.push('#DADADA');
				}
				$scope.appData.selectedCompany.withdrawals[1].children[i].colors = tmpColors;
				$scope.appData.selectedCompany.withdrawals[1].children[i].tooltip = '&nbsp;';
				$scope.appData.selectedCompany.withdrawals[1].tooltips.push({
					name: $scope.appData.selectedCompany.withdrawals[1].children[i].name,
					value: $scope.appData.selectedCompany.withdrawals[1].children[i].sum
				});
			}

			function tooltipNegative() {
				if ($scope.appData.selectedCompany.withdrawals[0].tooltips.length > 0) {
					var str = '<div class="top-chart-pie">';
					str = str + '<div>' + $scope.appData.selectedCompany.withdrawals[0].tooltips[this.point.x].name + '</div>';
					str = str + '<div><span style="display: inline-block; direction: ltr;">' + $scope.getTotal($scope.appData.selectedCompany.withdrawals[0].tooltips[this.point.x].value) + '</span><span>&#8362;</span></div>';
					str = str + '</div>';
					return str;
				}
				else {
					var str = '<div class="top-chart-pie"><h2 class="notDataGraphTooltip">אין נתונים</h2></div>';
					return str;
				}
			}

			function tooltipPositive() {
				if ($scope.appData.selectedCompany.withdrawals[1].tooltips.length > 0) {
					var str = '<div class="top-chart-pie">';
					str = str + '<div>' + $scope.appData.selectedCompany.withdrawals[1].tooltips[this.point.x].name + '</div>';
					str = str + '<div><span style="display: inline-block; direction: ltr;">' + $scope.getTotal($scope.appData.selectedCompany.withdrawals[1].tooltips[this.point.x].value) + '</span><span>&#8362;</span></div>';
					str = str + '</div>';
					return str;
				}
				else {
					var str = '<div class="top-chart-pie"><h2 class="notDataGraphTooltip">אין נתונים</h2></div>';
					return str;
				}
			}

			$scope.appData.selectedCompany.withdrawals.negative = {
				data: negative,
				title: $scope.appData.selectedCompany.withdrawals[0].name,
				colors: colorsNegative,
				tooltip: tooltipNegative
			};
			$scope.appData.selectedCompany.withdrawals.positive = {
				data: positive,
				title: $scope.appData.selectedCompany.withdrawals[1].name,
				colors: colorsPositive,
				tooltip: tooltipPositive
			};
			$scope.loaderSkiraKsafimGraphPay = false;
			$scope.loaderSkiraAccGraphPay = false;
		};
		$scope.refresh = function () {
			$scope.appData.selectedCompany.tokens = null;
			$scope.selectCompany($scope.appData.selectedCompany);
		};
		$scope.help = function () {
			window.open('http://bizibox.biz/help/generaloverview', '_blank');
		};
		$scope.getMessages = function (id) {
			$scope.loaderLastPeulot = true;

			var data = {
				company_id: $scope.appData.selectedCompany.companyId,
				company_account_id: id
			}
			serverConnection.getMessages(data).then(function (response) {
				$scope.loaderLastPeulot = false;

				function groupBy(array, f) {
					var groups = {};
					array.forEach(function (o) {
						var group = JSON.stringify(f(o));
						groups[group] = groups[group] || [];
						groups[group].push(o);
					});
					return Object.keys(groups).map(function (group) {
						return groups[group];
					})
				}

				var messages = groupBy(response, function (item) {
					return [item.trans_date];
				});

				var all = [];
				messages.forEach(function (v, i) {
					var messages1 = groupBy(v, function (item) {
						return [item.company_account_id];
					});
					all.push(messages1)
				})

				all.forEach(function (v, i) {
					v.forEach(function (v1) {
						v1.dataTitle = v1[0].account_nickname;
					})
					v.dataTitle = v[0][0].trans_date;
				})
				$scope.appData.selectedCompany.messages = all;
			}, function (error) {
			});
		};

		$scope.deleteoutDeposits = function () {
			serverConnection.deposit_delete($scope.appData.objPopUp.deposit_id).then(function (response) {
				$rootScope.$broadcast('loadKsafimData');
			}, function (error) {
			});
		}

		$scope.deleteoutLoans = function () {
			serverConnection.loan_delete($scope.appData.objPopUp.loan_id).then(function (response) {
				$rootScope.$broadcast('loadKsafimData');
			}, function (error) {
			});
		}

		//$scope.removeAlert = function (id, idx) {
		//    var mss_delete = $scope.appData.selectedCompany.messages[idx];
		//    serverConnection.removeAlertFromList(id).then(function (response) {
		//        $scope.appData.selectedCompany.messages.splice(mss_delete, 1);
		//    }, function (error) {
		//
		//    });
		//};

		$scope.$on('refresh', function () {
			$scope.refresh();
		});

		$scope.updatePassword = function (popupType, token, account) {
			$scope.appData.popupTypeLink = true;
			$scope.appData.popupType = parseInt(popupType);
			$scope.appData.popupDataToken = token;
			$scope.appData.popupDataBanks = parseInt(account);
			$scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.80' + new Date().getTime(), 'accountUpdatePasswordPopup');
		};
	}


	angular.module('controllers')
	.controller('generalCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', generalCtrl]);
}());
