(function () {
	function fundMGMTSlikaCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
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

		$scope.accountFilter = {company_account_id: ''};

		$scope.paymentTypeFilter = {ind_total: ''};

		$scope.solekFilter = {};
		$scope.selectedSolkim = '';

		$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

		//var date = new Date();
		//date.setFullYear(date.getFullYear());
		//date.setMonth(date.getMonth());
		//date.setDate(date.getDate() - 50);
		//
		//
		//var byDate = date.getDate();
		//var byMonth = date.getMonth() + 1;
		//var  byYear = date.getFullYear();
		//
		//console.log(byDate +'' + byMonth + '' + byYear)

		$scope.fromDate = new Date((new Date()).setDate(new Date().getDate() - 50));
		$scope.toDate = new Date((new Date()).setDate(new Date().getDate() + 500));

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


		$scope.init = function () {
			$scope.trans_total = 0;
			$scope.hasComany = true;
			$scope.filteredDataLoader = false;
			if ($scope.$state.current.url == "/slika") {
				$scope.$state.go('fundManagement.slika.table');
			}
		};

		$scope.selectCompany = function (company) {//getClasification
			$scope.getCompaniesThisStrorage(company);

			$scope.$broadcast('widthChanged');

			$q.all([$scope.getSolekData('def'), $scope.getCompanyAccounts()]).then(function (successT, successC) {
				if (successT) {
					if (successT[1].bank_account_list !== null) {
						$scope.appData.selectedCompany.solekData.forEach(function (t) {
							t.company_account_nickname = $scope.getAccountNum(t.company_account_id)[0];
							t.bank_id = 'data' + $scope.getAccountNum(t.company_account_id)[1];
						});
						$scope.filteredDataLoader = true;
					}
					else {
						$scope.hasComany = false;
						$scope.filteredDataLoader = true;
					}
				}
			}, function (error) {

			});
		};
		$scope.refresh = function () {
			$scope.getSolekData(true);
		};
		$scope.$on('refresh', function () {
			$scope.refresh();
		});
		$scope.help = function () {
			window.open('http://bizibox.biz/help//slika', '_blank');
		};

		$scope.getSolekData = function (force) {
			$scope.filteredDataLoader = false;

			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			var deferred = $q.defer();
			if (!$scope.appData.selectedCompany.solekData || force) {
				var fromDate, toDate;
				switch ($scope.appData.dateFilter.type) {
					case "0":
						fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
						toDate = daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
						if (force == 'def') {
							fromDate = ("0" + ($scope.fromDate.getDate())).slice(-2) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
							toDate = ("0" + ($scope.toDate.getDate())).slice(-2) + '/' + ("0" + ($scope.toDate.getMonth() + 1)).slice(-2) + '/' + $scope.toDate.getFullYear();
						}
						break;
					case "1":
						fromDate = $scope.datesPicker.fromDatePicker.toString().split('/')[2] + '' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '' + $scope.datesPicker.fromDatePicker.toString().split('/')[0];
						toDate = $scope.datesPicker.toDatePicker.toString().split('/')[2] + '' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '' + $scope.datesPicker.toDatePicker.toString().split('/')[0];
						break;
					case "2":
						fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
						toDate = daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, $scope.dateFilter.toYear) + '/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
						break;
				}

				serverConnection.getSolekData($scope.appData.selectedCompany, fromDate, toDate, ($scope.first) ? 1 : null).then(function (solekData) {
					$scope.first = false;
					$scope.appData.selectedCompany.solekData = solekData;
					$scope.solkim = [];
					solekData.forEach(function (t) {
						t.payment_type_name = accoConversions.getClasification(t.payment_type_id);
						t.bank_id = 'data' + $scope.getAccountNum(t.company_account_id)[1];

						if (t.tooltip && t.solek_ID) {
							$scope.solkim.push({name: t.tooltip, value: t.solek_ID});
							$scope.solekFilter[t.solek_ID] = true;
						}
						//if (t.ind_total == 1 || t.ind_total == "1"){
						//	$scope.trans_total = t.trans_total
						//}
					});

					$scope.solkim = $filter('unique')($scope.solkim, 'value');
					$scope.filteredDataLoader = true;
					deferred.resolve(true);
				}, function (error) {
					deferred.reject(true);
				});
			}
			else
				deferred.resolve(false);

			return deferred.promise;
		};

		$scope.isLastInMonth = function (row, index) {
			if (!$scope.filteredData || !row)
				return false;
			if (($scope.filteredData[index + 1].trans_date).split("/")[1] != (row.trans_date).split("/")[1])
				return true;
		};

		$scope.isLastInDay = function (row, index) {
			if (!$scope.filteredData || !row)
				return false;
			if (($scope.filteredData[index + 1].trans_date).split("/")[0] != (row.trans_date).split("/")[0])
				return true;
		};
		$scope.appData.redErrorFilterType = false;
		$scope.disabledDates = function () {
			function shortDates(dates) {
				return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
			}

			$scope.appData.redErrorFilterType = false;
			if ($scope.appData.dateFilter.type == '1' && shortDates($scope.datesPicker.fromDatePicker) > shortDates($scope.datesPicker.toDatePicker)) {
				$scope.appData.redErrorFilterType = '1';
			}
			else if ($scope.appData.dateFilter.type == '2' && shortDates('01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear)) {
				$scope.appData.redErrorFilterType = '2';
			}
			else {
				$scope.appData.redErrorFilterType = false;
			}
		}
		//$scope.addSumRows = function () {
		//	if (!$scope.filteredData || $scope.filteredData.length == 0)
		//		return;
		//
		//	var l = $scope.filteredData.length;
		//	for (var i = 0; i < l - 1; i++) {
		//		if ($scope.isLastInDay($scope.filteredData[i], i)) {
		//			var sumRow = {
		//				daySum: true,
		//				sumTazrim: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].days[$scope.filteredData[i].trans_date].sumTazrim,
		//				sum: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].days[$scope.filteredData[i].trans_date].sum,
		//				sumP: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].days[$scope.filteredData[i].trans_date].sumP,
		//				sumN: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].days[$scope.filteredData[i].trans_date].sumN,
		//				id: $scope.filteredData[i].trans_date
		//			};
		//			angular.extend(sumRow, $scope.filteredData[i]);
		//			$scope.filteredData.splice(i + 1, 0, sumRow).join();
		//			i++;
		//			l++;
		//		}
		//		if ($scope.isLastInMonth($scope.filteredData[i], i)) {
		//			var sumRow = {
		//				monthSum: true,
		//				sumTazrim: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].sumTazrim,
		//				sum: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].sum,
		//				sumP: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].sumP,
		//				sumN: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].sumN,
		//				id: $scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]
		//			};
		//			angular.extend(sumRow, $scope.filteredData[i - 1]);
		//			$scope.filteredData.splice(i + 1, 0, sumRow).join();
		//			i++;
		//			l++;
		//		}
		//	}
		//
		//	var sumRow = {
		//		daySum: true,
		//		sumTazrim: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[2]].days[$scope.filteredData[$scope.filteredData.length - 1].trans_date].sumTazrim,
		//		sum: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[2]].days[$scope.filteredData[$scope.filteredData.length - 1].trans_date].sum,
		//		sumP: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[2]].days[$scope.filteredData[$scope.filteredData.length - 1].trans_date].sumP,
		//		sumN: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[2]].days[$scope.filteredData[$scope.filteredData.length - 1].trans_date].sumN,
		//		id: $scope.filteredData[i].trans_date
		//	};
		//	angular.extend(sumRow, $scope.filteredData[$scope.filteredData.length - 1]);
		//	$scope.filteredData.splice($scope.filteredData.length, 0, sumRow).join();
		//	sumRow = {
		//		monthSum: true,
		//		sumTazrim: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 2].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 2].trans_date.split('/')[2]].sumTazrim,
		//		sum: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 2].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 2].trans_date.split('/')[2]].sum,
		//		sumP: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 2].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 2].trans_date.split('/')[2]].sumP,
		//		sumN: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 2].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 2].trans_date.split('/')[2]].sumN,
		//		id: $scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]
		//	};
		//	angular.extend(sumRow, $scope.filteredData[$scope.filteredData.length - 2]);
		//	$scope.filteredData.splice($scope.filteredData.length, 0, sumRow).join();
		//
		//
		//};
		//
		//$scope.calcMonthTotals = function () {
		//	if (!$scope.filteredData || $scope.filteredData.length == 0)
		//		return;
		//	var first = $scope.filteredData[0];
		//
		//	var monthId = first.trans_date.split('/')[1] + '/' + first.trans_date.split('/')[2];
		//	var months = {};
		//	months[monthId] = {sum: 0, sumN: 0, sumP: 0, sumTazrim: 0, days: {}};
		//	var dayId = first.trans_date;
		//	months[monthId].days[dayId] = {
		//		sum: 0,
		//		sumN: 0,
		//		sumP: 0,
		//		sumTazrim: 0,
		//		drillDown: [{
		//			name: first.tooltip,
		//			Val: first.trans_total,
		//			sumP: first.payments_total,
		//			sumN: first.regular_payment_total,
		//			sumTazrim: first.zefiletazrim
		//		}]
		//	};
		//
		//	var trans_total = 0;
		//	$scope.filteredData.forEach(function (t) {
		//		if (!t.daySum && !t.monthSum) {
		//			trans_total += t.trans_total;
		//		}
		//	});
		//	$scope.trans_total = trans_total.toFixed(2);
		//
		//	var daySum = $scope.filteredData[0].trans_total;
		//	var daySumP = $scope.filteredData[0].payments_total;
		//	var daySumN = $scope.filteredData[0].regular_payment_total;
		//	var daySumTazrim = $scope.filteredData[0].zefiletazrim;
		//	var monthSum = $scope.filteredData[0].trans_total;
		//	var monthSumP = $scope.filteredData[0].payments_total;
		//	var monthSumN = $scope.filteredData[0].regular_payment_total;
		//	var monthSumTazrim = $scope.filteredData[0].zefiletazrim;
		//
		//	for (var i = 1; i < $scope.filteredData.length; i++) {
		//		var prevRow = $scope.filteredData[i - 1];
		//		var row = $scope.filteredData[i];
		//		if (row.trans_date.split('/')[0] != prevRow.trans_date.split('/')[0]) { // new day
		//			months[monthId].days[dayId].sum = daySum;
		//			months[monthId].days[dayId].sumN = daySumN;
		//			months[monthId].days[dayId].sumP = daySumP;
		//			months[monthId].days[dayId].sumTazrim = daySumTazrim;
		//
		//			dayId = row.trans_date;
		//			if (row.trans_date.split('/')[1] == prevRow.trans_date.split('/')[1]) {
		//				months[monthId].days[dayId] = {
		//					sum: 0,
		//					sumN: 0,
		//					sumP: 0,
		//					sumTazrim: 0,
		//					drillDown: [{
		//						name: row.tooltip,
		//						Val: row.trans_total,
		//						sumN: row.regular_payment_total,
		//						sumP: row.payments_total,
		//						sumTazrim: row.zefiletazrim
		//					}]
		//				};
		//			}
		//			daySum = row.trans_total;
		//			daySumP = row.payments_total;
		//			daySumN = row.regular_payment_total;
		//			daySumTazrim = row.zefiletazrim;
		//
		//
		//		}
		//		else {
		//			dayId = row.trans_date;
		//			months[monthId].days[dayId] = {
		//				sum: 0,
		//				sumN: 0,
		//				sumP: 0,
		//				sumTazrim: 0,
		//				drillDown: [{
		//					name: row.tooltip,
		//					Val: row.trans_total,
		//					sumN: row.regular_payment_total,
		//					sumP: row.payments_total,
		//					sumTazrim: row.zefiletazrim
		//				}]
		//			};
		//
		//			if (row.trans_date.split('/')[1] != prevRow.trans_date.split('/')[1]) {
		//				daySum = 0;
		//				daySumP = 0;
		//				daySumN = 0;
		//				daySumTazrim = 0;
		//			}
		//
		//			daySumTazrim = daySumTazrim + row.zefiletazrim;
		//			daySum = daySum + row.trans_total;
		//			daySumP = daySumP + row.payments_total;
		//			daySumN = daySumN + row.regular_payment_total;
		//
		//			months[monthId].days[dayId].drillDown.push({
		//				name: row.tooltip,
		//				Val: row.trans_total,
		//				sumN: row.regular_payment_total,
		//				sumP: row.payments_total,
		//				sumTazrim: row.zefiletazrim
		//			})
		//
		//
		//		}
		//		if (row.trans_date.split('/')[1] != prevRow.trans_date.split('/')[1]) { // new month
		//			months[monthId].sum = monthSum;
		//			months[monthId].sumP = monthSumP;
		//			months[monthId].sumN = monthSumN;
		//			months[monthId].sumTazrim = monthSumTazrim;
		//
		//
		//			monthId = row.trans_date.split('/')[1] + '/' + row.trans_date.split('/')[2];
		//			months[monthId] = {};
		//			months[monthId] = {sum: 0, sumN: 0, sumP: 0, sumTazrim: 0, days: {}};
		//			months[monthId].days[dayId] = {
		//				sum: 0,
		//				sumN: 0,
		//				sumP: 0,
		//				sumTazrim: 0,
		//				drillDown: [{
		//					name: row.tooltip,
		//					Val: row.trans_total,
		//					sumN: row.regular_payment_total,
		//					sumP: row.payments_total,
		//					sumTazrim: row.zefiletazrim
		//				}]
		//			};
		//			monthSum = row.trans_total;
		//			monthSumN = row.regular_payment_total;
		//			monthSumP = row.payments_total;
		//			monthSumTazrim = row.zefiletazrim;
		//		}
		//		else {
		//			monthSum = monthSum + row.trans_total;
		//			monthSumN = monthSumN + row.regular_payment_total;
		//			monthSumP = monthSumP + row.payments_total;
		//			monthSumTazrim = monthSumTazrim + row.zefiletazrim;
		//		}
		//	}
		//	monthId = row.trans_date.split('/')[1] + '/' + row.trans_date.split('/')[2];
		//	dayId = row.trans_date;
		//	months[monthId].days[dayId].sum = daySum;
		//	months[monthId].days[dayId].sumN = daySumN;
		//	months[monthId].days[dayId].sumP = daySumP;
		//	months[monthId].days[dayId].sumTazrim = daySumTazrim;
		//
		//	months[monthId].sum = monthSum;
		//	months[monthId].sumN = monthSumN;
		//	months[monthId].sumP = monthSumP;
		//	months[monthId].sumTazrim = monthSumTazrim;
		//
		//	$scope.monthsData = months;
		//
		//};

		$scope.summaryAdd = function (arr) {
			var wrap = [];
			arr.forEach(function (v, i) {
				if (v.trans_date !== null) {
					wrap.push(v)
				}
			});
			$scope.appData.chartSkira = {
				xAxis: [],
				data: [],
				tooltip: []
			}

			var arrays = [];
			var total = {
				trans_total: 0,
				trans_total_days: 0,
				regular_payment_total: 0,
				regular_payment_total_days: 0,
				payments_total: 0,
				payments_total_days: 0,
				zefiletazrim: 0,
				zefiletazrim_days: 0
			}
			$scope.trans_total = 0;
			var tooltip = [];

			wrap.forEach(function (v, i) {
				var tool = {
					Val: v.trans_total,
					name: v.tooltip,
					sumN: v.regular_payment_total,
					sumP: v.payments_total,
					sumTazrim: v.zefiletazrim
				}
				tooltip.push(tool);

				if (wrap.length - 1 > i) {
					arrays.push(v)
					total.trans_total = total.trans_total + v.trans_total;
					total.trans_total_days = total.trans_total_days + v.trans_total;
					total.regular_payment_total = total.regular_payment_total + v.regular_payment_total;
					total.regular_payment_total_days = total.regular_payment_total_days + v.regular_payment_total;
					total.payments_total = total.payments_total + v.payments_total;
					total.payments_total_days = total.payments_total_days + v.payments_total;
					total.zefiletazrim = total.zefiletazrim + v.zefiletazrim;
					total.zefiletazrim_days = total.zefiletazrim_days + v.zefiletazrim;

					if (wrap[i + 1].trans_date.split('/')[2] !== v.trans_date.split('/')[2]) {
						var summary = {
							id: v.trans_date.split('/')[0] + '/' + v.trans_date.split('/')[1],
							trans_total: total.trans_total_days,
							regular_payment_total: total.regular_payment_total_days,
							payments_total: total.payments_total_days,
							zefiletazrim: total.zefiletazrim_days,
							summary: 'days'
						};
						arrays.push(summary);
						total.trans_total_days = 0;
						total.regular_payment_total_days = 0;
						total.payments_total_days = 0;
						total.zefiletazrim_days = 0;

						var summaryMon = {
							id: v.trans_date.split('/')[1] + '/' + v.trans_date.split('/')[2],
							trans_total: total.trans_total,
							regular_payment_total: total.regular_payment_total,
							payments_total: total.payments_total,
							zefiletazrim: total.zefiletazrim,
							summary: 'month'
						};
						$scope.trans_total = $scope.trans_total + total.trans_total;
						arrays.push(summaryMon);
						$scope.appData.chartSkira.xAxis.push(summaryMon.id);
						$scope.appData.chartSkira.data.push(summaryMon.trans_total);
						$scope.appData.chartSkira.tooltip.push(tooltip);

						tooltip = [];
						total.trans_total = 0;
						total.regular_payment_total = 0;
						total.payments_total = 0;
						total.zefiletazrim = 0;
					}
					if (wrap[i + 1].trans_date.split('/')[2] == v.trans_date.split('/')[2]) {
						if (wrap[i + 1].trans_date.split('/')[1] !== v.trans_date.split('/')[1]) {
							var summary = {
								id: v.trans_date.split('/')[0] + '/' + v.trans_date.split('/')[1],
								trans_total: total.trans_total_days,
								regular_payment_total: total.regular_payment_total_days,
								payments_total: total.payments_total_days,
								zefiletazrim: total.zefiletazrim_days,
								summary: 'days'
							};
							arrays.push(summary)
							total.trans_total_days = 0;
							total.regular_payment_total_days = 0;
							total.payments_total_days = 0;
							total.zefiletazrim_days = 0;

							var summaryMon = {
								id: v.trans_date.split('/')[1] + '/' + v.trans_date.split('/')[2],
								trans_total: total.trans_total,
								regular_payment_total: total.regular_payment_total,
								payments_total: total.payments_total,
								zefiletazrim: total.zefiletazrim,
								summary: 'month'
							};
							$scope.trans_total = $scope.trans_total + total.trans_total;
							arrays.push(summaryMon)
							$scope.appData.chartSkira.xAxis.push(summaryMon.id);
							$scope.appData.chartSkira.data.push(summaryMon.trans_total);
							$scope.appData.chartSkira.tooltip.push(tooltip);

							tooltip = [];
							total.trans_total = 0;
							total.regular_payment_total = 0;
							total.payments_total = 0;
							total.zefiletazrim = 0;
						}
						else {
							if (wrap[i + 1].trans_date.split('/')[0] !== v.trans_date.split('/')[0]) {
								var summary = {
									id: v.trans_date.split('/')[0] + '/' + v.trans_date.split('/')[1],
									trans_total: total.trans_total_days,
									regular_payment_total: total.regular_payment_total_days,
									payments_total: total.payments_total_days,
									zefiletazrim: total.zefiletazrim_days,
									summary: 'days'
								};
								arrays.push(summary)
								total.trans_total_days = 0;
								total.regular_payment_total_days = 0;
								total.payments_total_days = 0;
								total.zefiletazrim_days = 0;
							}
						}
					}
				}
				if ((wrap.length - 1) == i) {
					arrays.push(v)

					total.trans_total = total.trans_total + v.trans_total;
					total.trans_total_days = total.trans_total_days + v.trans_total;
					total.regular_payment_total = total.regular_payment_total + v.regular_payment_total;
					total.regular_payment_total_days = total.regular_payment_total_days + v.regular_payment_total;
					total.payments_total = total.payments_total + v.payments_total;
					total.payments_total_days = total.payments_total_days + v.payments_total;
					total.zefiletazrim = total.zefiletazrim + v.zefiletazrim;
					total.zefiletazrim_days = total.zefiletazrim_days + v.zefiletazrim;


					var summary = {
						id: v.trans_date.split('/')[0] + '/' + v.trans_date.split('/')[1],
						trans_total: total.trans_total_days,
						regular_payment_total: total.regular_payment_total_days,
						payments_total: total.payments_total_days,
						zefiletazrim: total.zefiletazrim_days,
						summary: 'days'
					};
					arrays.push(summary)
					total.trans_total_days = 0;
					total.regular_payment_total_days = 0;
					total.payments_total_days = 0;
					total.zefiletazrim_days = 0;

					var summaryMon = {
						id: v.trans_date.split('/')[1] + '/' + v.trans_date.split('/')[2],
						trans_total: total.trans_total,
						regular_payment_total: total.regular_payment_total,
						payments_total: total.payments_total,
						zefiletazrim: total.zefiletazrim,
						summary: 'month'
					};
					$scope.trans_total = $scope.trans_total + total.trans_total;
					arrays.push(summaryMon);
					$scope.appData.chartSkira.xAxis.push(summaryMon.id);
					$scope.appData.chartSkira.data.push(summaryMon.trans_total);
					$scope.appData.chartSkira.tooltip.push(tooltip);

					tooltip = [];
					total.trans_total = 0;
					total.regular_payment_total = 0;
					total.payments_total = 0;
					total.zefiletazrim = 0;
				}
			})
			return arrays;
		};
		$scope.setChart = function () {
			//var data = [], xAxis = [], tooltips = [];
			//if ($scope.monthsData) {
			//	var numOfMonths = Object.keys($scope.monthsData).length;
			//	if (numOfMonths < 2) {
			//		for (var mKey in $scope.monthsData) {
			//			for (var dKey in $scope.monthsData[mKey].days) {
			//				xAxis.push(dKey);
			//				data.push($scope.monthsData[mKey].days[dKey].sum);
			//				tooltips.push($scope.monthsData[mKey].days[dKey].drillDown);
			//			}
			//		}
			//	}
			//	else {
			//		for (var mKey in $scope.monthsData) {
			//			xAxis.push(mKey);
			//			data.push($scope.monthsData[mKey].sum);
			//			tooltips.push([]);
			//			for (var dKey in $scope.monthsData[mKey].days) {
			//				//xAxis.push(dKey);
			//				//data.push($scope.monthsData[mKey].days[dKey].sum);
			//				tooltips[tooltips.length - 1] = tooltips[tooltips.length - 1].concat($scope.monthsData[mKey].days[dKey].drillDown)
			//			}
			//		}
			//	}
			//}

			//var maxLine = Math.max.apply(Math, $scope.appData.chartSkira.data);
			//var minLine = Math.min.apply(Math, $scope.appData.chartSkira.data);
			//
			//var valueMaxLine;
			//if ((maxLine > 0 && minLine > 0) || (maxLine < 0 && minLine < 0)) {
			//	var valueMax = (minLine / maxLine) * 10;
			//	valueMaxLine = maxLine * (valueMax);
			//}
			//else {
			//	valueMaxLine = null;
			//}

			$scope.chartData = {
				spacingTop: 55,
				spacingLeft: 0,
				spacingRight: 0,
				borderColor: '#d8d8d8',
				borderWidth: 1,
				borderRadius: 3,
				valueMax: null,
				xAxis: $scope.appData.chartSkira.xAxis,
				yLabel: 'סה״כ בש״ח',
				data: [{
					cursor: 'pointer',
					name: 'עסקאות',
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
					data: $scope.appData.chartSkira.data
				}],
				title: ' ',
				subtitle: ' ',
				tooltips: [$scope.appData.chartSkira.tooltip]
			}
		};

		$scope.getAccountNum = function (companyId) {
			var response = '';
			if (!$scope.appData.selectedCompany.accounts)
				return response;
			$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (account) {
				if (companyId == account.company_account_id)
					response = [account.company_account_nickname, account.bank_id]
			})
			return response;
		};

		$scope.sendMailer = function () {
			$scope.showPopup('views/templates/mailerSlika.html?ver=3.74', 'mailerPopup', false);
		};

		$scope.sending = function (dataExcel) {
			serverConnection.sendMail(dataExcel).then(function (res) {
				$scope.error = 'המייל נשלח בהצלחה';
				$scope.hidePopup();
			}, function (error) {
				$scope.error = 'המייל לא נשלח בהצלחה';
			});
		};
		$scope.openCheckImg = function (uuid, idBank, bankTransId) {
			if (uuid == 'x') {
				$scope.showPopup('views/templates/alertXcheck.html?ver=3.74', 'popAlert', true);
				setTimeout(function () {
					$scope.hidePopup();
				}, 3000)
			}
			else {
				var folder_name;
				$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
					if (v.company_account_id == idBank) {
						folder_name = v.bank_id + '' + v.bank_snif_id + '' + v.bank_account_number;
					}
				});
				serverConnection.copyCheks(uuid, folder_name, bankTransId).then(function (res) {
					$scope.appData.iconCheck = res;
					$scope.showPopup('views/templates/imgChecks.html?ver=3.74', 'imgChecks', false);
				}, function (error) {
				});
			}
		};


		$scope.updateTransactionType = function (t, newType) {
			serverConnection.updateTransactionType({
				trans_id: t.trans_id,
				trans_name: newType.display,
				ind_bank: 1,
				trans_type_id: newType.value,
				oldpayment_type_id: null
			}).then(function (result) {
				$scope.appData.selectedCompany.transactions[$scope.appData.selectedCompany.transactions.indexOf(t)].trans_type_id = newType.value;
				$scope.appData.selectedCompany.transactions[$scope.appData.selectedCompany.transactions.indexOf(t)].trans_type_name = newType.display;
				$scope.appData.selectedCompany.transactions[$scope.appData.selectedCompany.transactions.indexOf(t)].ind_expence = (newType.ind_expense) ? 1 : 0;
			}, function (error) {
			});
		};

		$scope.showAddTransTypeDialog = function (t) {
			$scope.appData.newTransParentIndex = $scope.appData.selectedCompany.transactions.indexOf(t);
			$scope.showPopup('views/templates/addTransactionTypeDialog.html?ver=3.74');
		};

		$scope.addNewTransType = function () {
			serverConnection.addNewTransType({
				companyId: $scope.appData.selectedCompany.companyId,
				transTypeName: $scope.newTransactionName,
				indExpense: $scope.newTransactionIndType
			}).then(function (result) {
				$scope.updateTransactionType($scope.appData.selectedCompany.transactions[$scope.appData.newTransParentIndex], {
					value: result.substring(1, result.length - 2),
					display: $scope.newTransactionName,
					ind_expence: parseInt($scope.newTransactionIndType)
				});
				$scope.hidePopup();
				$scope.appData.selectedCompany.transactions[$scope.appData.newTransParentIndex].transTypeChange = false;
			}, function (error) {
			});

		};

		$scope.transTypeChange = function (t) {
			if (t.ind_bank == 1)
				t.transTypeChange = !t.transTypeChange;

		};

		$scope.updateTransactionTypeName = function (t) {
			serverConnection.updateTransactionType({
				trans_id: t.trans_id,
				trans_name: t.target_name,
				ind_bank: 1,
				trans_type_id: t.trans_type_id,
				oldpayment_type_id: null
			}).then(function (result) {
			}, function (error) {
			});
		};

		$scope.targetNameChange = function (t) {
			t.targetNameChange = !t.targetNameChange;
			if (!t.targetNameChange)
				$scope.updateTransactionTypeName(t);
		};

		$scope.zefiChange = function (t) {
			t.zefiChange = !t.zefiChange;
			if (!t.zefiChange)
				serverConnection.updateSolekZefi(t).then(function (result) {
				}, function (error) {
				});
		};
		$scope.getPercent = function (x) {
			return Math.round(x);
		};

		$scope.filterData = function () {
			if ($scope.appData.selectedCompany && $scope.appData.selectedCompany.solekData) {
				$scope.filteredData = $filter('freeFilter')($scope.appData.selectedCompany.solekData, $scope.searchText);
				$scope.filteredData = $filter('includeFilter')($scope.filteredData, 'solek_ID', $scope.solekFilter);
				$scope.filteredData = $filter('filter')($scope.filteredData, $scope.accountFilter);
				$scope.filteredData = $filter('filter')($scope.filteredData, $scope.paymentTypeFilter);

				//$scope.calcMonthTotals();
				//$scope.addSumRows();
				$scope.filteredDataAll = $scope.summaryAdd($scope.filteredData);
				$scope.setChart();
			}
		};

		$scope.$watch('appData.selectedCompany.solekData', function (newVal, oldVal) {
			if (newVal) {
				$scope.filterData();
			}
		});

		$scope.toggleAllSolkim = function () {
			if ($scope.solekFilterAll) {
				var solekLen = $scope.solkim.length;
				for (var i = 0; i < solekLen; i++)
					$scope.solekFilter[$scope.solkim[i].value] = true;
			}
			else {
				var solekLen = $scope.solkim.length;
				for (var i = 0; i < solekLen; i++)
					$scope.solekFilter[$scope.solkim[i].value] = false;
			}
		};

		$scope.$watch('solekFilter', function (newVal, oldVal) {
			if (newVal && $scope.solkim) {
				$scope.selectedSolkim = '';
				var all = true;
				var solekLen = $scope.solkim.length;
				for (var i = 0; i < solekLen; i++) {
					if ($scope.solekFilter[$scope.solkim[i].value])
						$scope.selectedSolkim = $scope.selectedSolkim + ',' + $scope.solkim[i].name;
					else
						all = false;
				}
				if ($scope.selectedSolkim.length > 0)
					$scope.selectedSolkim = $scope.selectedSolkim.substring(1, $scope.selectedSolkim.length);
				if (all) {
					$scope.selectedSolkim = '';
					$scope.solekFilterAll = true
				}
				else {
					$scope.solekFilterAll = false;
				}
				$scope.filterData();
			}
		}, true);

		$scope.$watch('searchText', function (newVal, oldVal) {
			if (newVal != undefined) {
				$scope.filterData();
			}
		}, true);

		$scope.$watch('accountFilter', function (newVal, oldVal) {
			if (newVal != undefined) {
				if (newVal.company_account_id == null)
					$scope.accountFilter.company_account_id = '';
				$scope.filterData();
			}
		}, true);

		$scope.$watch('paymentTypeFilter', function (newVal, oldVal) {
			if (newVal != undefined) {
				if (newVal.ind_total == null)
					$scope.accountFilter.ind_total = '';
				$scope.filterData();
			}
		}, true);


		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});


	}


	angular.module('controllers')
	.controller('fundMGMTSlikaCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', fundMGMTSlikaCtrl]);
}());
