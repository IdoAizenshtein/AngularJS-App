(function () {
	function fundMGMTCardsCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {

		$scope.$location = $location;
		$scope.$state = $state;
		$scope.$utils = utils;
		$scope.accoConversions = accoConversions;
		$scope.appData = AppData;
		$scope.nextPage = $state.params.url;
		$scope.months = utils.monthNames();
		$scope.years = utils.yearsKsafim(3);
		$scope.date = new Date();
		$scope.accountFilter = {company_account_id: ''};
		$scope.paymentTypeFilter = {ind_total: ''};
		$scope.peulotRadio = 'false';
		//$scope.isPriShow = false;
		$scope.currency_id_fundMGMTCardsCtrl = '₪';

		$scope.cardsFilter = {};
		$scope.selectedCards = '';
		$scope.appData.dateFilterTypesCards = '00';
		$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
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
			$scope.totalAll = 0;
			$scope.transTotal = 0;
			$scope.filteredDataLoader = false;
			if ($scope.$state.current.url == "/cards") {
				$scope.$state.go('fundManagement.cards.table');
			}
		};

		$scope.selectCompany = function (company) {//getClasification
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			$scope.appData.dateFilterTypesCards = '00';
			$q.all([$scope.getCardsAtid(true), $scope.getCompanyAccounts()]).then(function (successT, successC) {
				if (successT) {
					$scope.appData.selectedCompany.cardsData.forEach(function (t) {
						t.company_account_nickname = $scope.getAccountNum(t.company_account_id)[0];
						t.bank_id = 'data' + $scope.getAccountNum(t.company_account_id)[1];

						t.peulot_tab.forEach(function (p) {
							p.peoulot.forEach(function (v) {
								v.searchObj = true;
							});
						});
					});

					$scope.filteredDataLoader = true;
				}
			}, function (error) {

			});
		};
		$scope.refresh = function () {
			$scope.getCardsAtid(true)
		};
		$scope.$on('refresh', function () {
			$scope.refresh();
		});
		$scope.help = function () {
			window.open('http://bizibox.biz/help/creditcards', '_blank');
		};
		$scope.getCardsAtid = function (force) {
			$scope.filteredDataLoader = false;
			//$scope.isPriShow = false;
			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			var deferred = $q.defer();

			if (!$scope.appData.selectedCompany.cardsData || force) {
				var fromDate, toDate;
				switch ($scope.appData.dateFilterTypesCards) {
					case "00":
						fromDate = ("0" + ($scope.fromDate.getDate())).slice(-2) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
						toDate = ("0" + ($scope.toDate.getDate())).slice(-2) + '/' + ("0" + ($scope.toDate.getMonth() + 1)).slice(-2) + '/' + $scope.toDate.getFullYear();
						$scope.textTitlePage = ' ' + 'חיוב קרוב';
						break;
					case "0":
						//$scope.isPriShow = $scope.accountFilter.company_account_id && $scope.isThisDate($scope.dateFilter.byMonth, $scope.dateFilter.byYear);
						fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
						toDate = daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
						$scope.textTitlePage = '  ' + ' חודש' + ' ' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
						break;
					case "1":
						fromDate = $scope.datesPicker.fromDatePicker.toString().split('/')[2] + '' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '' + $scope.datesPicker.fromDatePicker.toString().split('/')[0];
						toDate = $scope.datesPicker.toDatePicker.toString().split('/')[2] + '' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '' + $scope.datesPicker.toDatePicker.toString().split('/')[0];
						$scope.textTitlePage = ' ' + 'בין תאריכים' + ' ' + $scope.datesPicker.fromDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[2] + '-' + $scope.datesPicker.toDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[2];
						break;
					case "2":
						fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
						toDate = daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, $scope.dateFilter.toYear) + '/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
						$scope.textTitlePage = '  ' + 'בין חודשים' + ' ' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear + '-' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
						break;
				}

				serverConnection.getCardsAtid($scope.appData.selectedCompany, null, fromDate, toDate, ($scope.appData.dateFilterTypesCards == '00') ? 1 : null).then(function (cardsData) {
					$scope.appData.selectedCompany.cardsData = cardsData;
					$scope.cards = [];
					cardsData.forEach(function (t) {
						t.company_account_nickname = $scope.getAccountNum(t.company_account_id)[0];
						t.bank_id = 'data' + $scope.getAccountNum(t.company_account_id)[1];
						if (t.CREDIT_CARD_NO !== undefined && t.CREDIT_CARD_NO !== null) {
							$scope.cards.push({name: t.CREDIT_CARD_NO.toString(), value: t.CREDIT_CARD_NO.toString()});
							$scope.cardsFilter[t.CREDIT_CARD_NO.toString()] = true;
						}
						if (t.ind_total == 1 || t.ind_total == "1") {
							$scope.trans_total = t.trans_total
						}
					});
					$scope.cards = $filter('unique')($scope.cards, 'value');
					$scope.filteredDataLoader = true;
					deferred.resolve(true);
				}, function (error) {
					deferred.reject(true);
				});
			}
			else {
				deferred.resolve(false);
			}
			return deferred.promise;
		};
		$scope.appData.redErrorFilterType = false;
		$scope.disabledDates = function () {
			function shortDates(dates) {
				return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
			}

			$scope.appData.redErrorFilterType = false;
			if ($scope.appData.dateFilterTypesCards == '1' && shortDates($scope.datesPicker.fromDatePicker) > shortDates($scope.datesPicker.toDatePicker)) {
				$scope.appData.redErrorFilterType = '1';
			}
			else if ($scope.appData.dateFilterTypesCards == '2' && shortDates('01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear)) {
				$scope.appData.redErrorFilterType = '2';
			}
			else {
				$scope.appData.redErrorFilterType = false;
			}
		}
		$scope.isLastInMonth = function (row, index) {
			if (!$scope.filteredData || !row)
				return false;
			if (($scope.filteredData[index + 1].trans_date).split("/")[1] != (row.trans_date).split("/")[1])
				return true;
		};
		$scope.filterTransaction = function () {
			if ($scope.appData.selectedCompany.accounts.bank_account_list.filter(function (item) {
				return item.company_account_id === $scope.accountFilter.company_account_id
			}).length) {
				var bankAcc = $scope.appData.selectedCompany.accounts.bank_account_list.filter(function (item) {
					return item.company_account_id === $scope.accountFilter.company_account_id
				})[0]
				$scope.currency_id_fundMGMTCardsCtrl = accoConversions.getCurrencyId(bankAcc.currency_id);
			} else {
				$scope.currency_id_fundMGMTCardsCtrl = '₪';
			}
		}
		$scope.addSumRows = function () {
			if ($scope.filteredData.length > 1) {
				var l = $scope.filteredData.length;
				for (var i = 0; i < l - 1; i++) {
					if ($scope.isLastInMonth($scope.filteredData[i], i)) {
						var sumRow = {
							monthSum: true,
							sum: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].sum,
							sumP: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].sumP,
							sumN: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].sumN,
							zefi: $scope.monthsData[$scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]].zefi,
							id: $scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]
						};
						angular.extend(sumRow, $scope.filteredData[i]);
						$scope.filteredData.splice(i + 1, 0, sumRow).join();
						i++;
						l++;
					}
				}
				var sumRow = {
					monthSum: true,
					sum: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[2]].sum,
					sumP: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[2]].sumP,
					sumN: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[2]].sumN,
					zefi: $scope.monthsData[$scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[1] + '/' + $scope.filteredData[$scope.filteredData.length - 1].trans_date.split('/')[2]].zefi,
					id: $scope.filteredData[i].trans_date.split('/')[1] + '/' + $scope.filteredData[i].trans_date.split('/')[2]
				};

				angular.extend(sumRow, $scope.filteredData[$scope.filteredData.length - 1]);
				$scope.filteredData.splice($scope.filteredData.length, 0, sumRow).join();

			}
			if ($scope.filteredData.length == 1) {
				var sumRow = {
					monthSum: true,
					sum: $scope.monthsData[$scope.filteredData[0].trans_date.split('/')[1] + '/' + $scope.filteredData[0].trans_date.split('/')[2]].sum,
					sumP: $scope.monthsData[$scope.filteredData[0].trans_date.split('/')[1] + '/' + $scope.filteredData[0].trans_date.split('/')[2]].sumP,
					sumN: $scope.monthsData[$scope.filteredData[0].trans_date.split('/')[1] + '/' + $scope.filteredData[0].trans_date.split('/')[2]].sumN,
					zefi: $scope.monthsData[$scope.filteredData[0].trans_date.split('/')[1] + '/' + $scope.filteredData[0].trans_date.split('/')[2]].zefi,
					id: $scope.filteredData[0].trans_date.split('/')[0] + '/' + $scope.filteredData[0].trans_date.split('/')[2]
				};
				angular.extend(sumRow, $scope.filteredData[0]);
				$scope.filteredData.splice(1, 0, sumRow);
			}

		};

		$scope.getPercent = function (x, y) {
			var result = Math.round((100 * x) / y);
			return result;
		};
		$scope.calcMonthTotals = function () {
			var first = $scope.filteredData[0];
			if (!first)
				return;
			var row;
			var months = {};
			var monthId = first.trans_date.split('/')[1] + '/' + first.trans_date.split('/')[2];
			months[monthId] = {sum: 0, sumN: 0, sumP: 0, zefi: 0};
			var monthSumN = 0;
			var monthSum = $scope.filteredData[0].trans_total;
			var monthSumP = $scope.filteredData[0].total_payments;
			var monthZefi = $scope.filteredData[0].zefiletazrim;
			var total = 0;
			var trans_total = 0;
			$scope.filteredData.forEach(function (t) {
				trans_total += t.trans_total;
				t.peulot_tab.forEach(function (p) {
					p.peoulot.forEach(function (v) {
						if (v.searchObj == true) {
							total += v.hozaa;
						}
					});
				});
			});
			$scope.transTotal = trans_total.toFixed(2);

			var tooltip = [];
			$scope.filteredData[0].peulot_tab.forEach(function (p) {
				p.peoulot.forEach(function (v) {
					if (v.searchObj == true) {
						monthSumN = monthSumN + v.hozaa;
						var obj = {name: v.trans_name, Val: v.hozaa};
						tooltip.push(obj);
					}
				});
			});

			//  console.log('יום ראשון בחודש -- ראשון' + monthSumN)
			if ($scope.filteredData.length == 1) {
				row = $scope.filteredData[0];
				monthSum = monthSum;
				monthSumN = monthSumN;
				monthSumP = monthSumP;
				monthZefi = monthZefi;
				tooltip = tooltip;
			}
			if ($scope.filteredData.length > 1) {
				var lenfilteredData = $scope.filteredData.length;
				for (var i = 1; i < lenfilteredData; i++) {
					var prevRow = $scope.filteredData[i - 1];
					row = $scope.filteredData[i];
					if (row.trans_date.split('/')[1] != prevRow.trans_date.split('/')[1]) { // תחילת חודש חדש שהיום שלפניו שייך לחודש אחר

						months[monthId].sum = monthSum;
						months[monthId].sumP = monthSumP;
						months[monthId].zefi = monthZefi;
						months[monthId].drillDown = tooltip;
						months[monthId].sumN = monthSumN;
						/////

						monthId = row.trans_date.split('/')[1] + '/' + row.trans_date.split('/')[2];
						months[monthId] = {};
						months[monthId] = {sum: 0, sumN: 0, sumP: 0, zefi: 0};

						tooltip = [];
						monthSumN = 0;
						monthSum = 0;
						monthSumP = 0;
						monthZefi = 0;
						row.peulot_tab.forEach(function (t) {
							t.peoulot.forEach(function (p) {
								if (p.searchObj == true) {
									monthSumN = monthSumN + p.hozaa;
									var obj = {name: p.trans_name, Val: p.hozaa};
									tooltip.push(obj);
								}
							});
						});
						monthSum = monthSum + row.trans_total;
						monthSumP = monthSumP + row.total_payments;
						monthZefi = monthZefi + row.zefiletazrim;
						//  console.log('יום ראשון בחודש --' + monthSumN)


						months[monthId].sum = monthSum;
						months[monthId].sumP = monthSumP;
						months[monthId].zefi = monthZefi;
						months[monthId].drillDown = tooltip;
						months[monthId].sumN = monthSumN;

					}
					else {
						monthId = row.trans_date.split('/')[1] + '/' + row.trans_date.split('/')[2];
						months[monthId] = {};
						months[monthId] = {sum: 0, sumN: 0, sumP: 0, zefi: 0};

						row.peulot_tab.forEach(function (t) {
							t.peoulot.forEach(function (p) {
								if (p.searchObj == true) {
									monthSumN = monthSumN + p.hozaa;
									var obj = {name: p.trans_name, Val: p.hozaa};
									tooltip.push(obj);
								}
							});
						});
						//   console.log('2 --' + monthSumN)
						monthSum = monthSum + row.trans_total;
						monthSumP = monthSumP + row.total_payments;
						monthZefi = monthZefi + row.zefiletazrim;

						//months[monthId].sum = monthSum;
						//months[monthId].sumP = monthSumP;
						//months[monthId].zefi = monthZefi;
						//months[monthId].drillDown = tooltip;
						//months[monthId].sumN = monthSumN;
					}
				}
			}

			monthId = row.trans_date.split('/')[1] + '/' + row.trans_date.split('/')[2];
			months[monthId].sum = monthSum;
			months[monthId].sumN = monthSumN;
			months[monthId].sumP = monthSumP;
			months[monthId].zefi = monthZefi;
			months[monthId].drillDown = tooltip;
			$scope.monthsData = months;
			$scope.totalAll = total.toFixed(2);
		};

		$scope.setChart = function () {
			var data = [], xAxis = [], tooltips = [];
			//     var numOfMonths = Object.keys($scope.monthsData).length;
			for (var mKey in $scope.monthsData) {
				xAxis.push(mKey);
				if (!$scope.searchText) {
					data.push(parseInt($scope.monthsData[mKey].sum));
				}
				if ($scope.searchText) {
					data.push(parseInt($scope.monthsData[mKey].sumN));
				}
				tooltips.push($scope.monthsData[mKey].drillDown);
			}
			;

			var maxLine = Math.max.apply(Math, data);
			var minLine = Math.min.apply(Math, data);
			var valueMaxLine;
			if (maxLine > 0 && minLine > 0) {
				var valueMax = (minLine / maxLine) * 10;
				valueMaxLine = maxLine * (valueMax);
			}
			else {
				valueMaxLine = null;
			}
			console.log('minLine: ' + minLine)
			console.log('maxLine: ' + maxLine)
			console.log('valueMaxLine  החישוב: ' + valueMaxLine)
			$scope.chartData = {
				//  valueMax: valueMaxLine,
				spacingTop: 55,
				spacingLeft: 0,
				spacingRight: 0,
				borderColor: '#d8d8d8',
				borderWidth: 1,
				borderRadius: 3,
				xAxis: xAxis,
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
					data: data
				}],
				title: ' ',
				subtitle: ' ',
				tooltips: [tooltips]
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
			$scope.appData.mailFilteredData = $scope.filteredData
			$scope.showPopup('views/templates/mailerCard.html?ver=3.80', 'mailerPopup', false);
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
				$scope.showPopup('views/templates/alertXcheck.html?ver=3.80', 'popAlert', true);
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
					$scope.showPopup('views/templates/imgChecks.html?ver=3.80', 'imgChecks', false);
				}, function (error) {
				});
			}
		};

		$scope.zefiChange = function (t) {
			t.zefiChange = !t.zefiChange;
			if (!t.zefiChange)
				serverConnection.updateCardZefi(t).then(function (result) {
				}, function (error) {
				});
		};

		$scope.filterData = function () {
			if ($scope.appData.selectedCompany && $scope.appData.selectedCompany.cardsData) {
				// $scope.filteredData = $filter('filter')($scope.filteredData, $scope.paymentTypeFilter);
				$scope.filteredData = $filter('freeFilterArray')($scope.appData.selectedCompany.cardsData, $scope.searchText);
				$scope.filteredData = $filter('includeFilterArray')($scope.filteredData, 'CREDIT_CARD_NO', $scope.cardsFilter);

				$scope.filteredData = $filter('filter')($scope.filteredData, $scope.accountFilter);

				$scope.calcMonthTotals();
				$scope.addSumRows();
				$scope.setChart();
			}
		};

		$scope.$watch('appData.selectedCompany.cardsData', function (newVal, oldVal) {
			if (newVal) {
				$scope.filterData();
			}
		});


		$scope.toggleAllCards = function () {
			if ($scope.cardsFilterAll) {
				var cardLength = $scope.cards.length;
				for (var i = 0; i < cardLength; i++)
					$scope.cardsFilter[$scope.cards[i].value] = true;
			} else {
				var cardLength = $scope.cards.length;
				for (var i = 0; i < cardLength; i++)
					$scope.cardsFilter[$scope.cards[i].value] = false;
			}
		};

		$scope.$watch('cardsFilter', function (newVal, oldVal) {
			if (newVal && $scope.cards) {
				$scope.selectedCards = '';
				var all = true;
				var cardLength = $scope.cards.length;
				for (var i = 0; i < cardLength; i++) {
					if ($scope.cardsFilter[$scope.cards[i].value])
						$scope.selectedCards = $scope.selectedCards + ',' + $scope.cards[i].name;
					else
						all = false;
				}
				if ($scope.selectedCards.length > 0)
					$scope.selectedCards = $scope.selectedCards.substring(1, $scope.selectedCards.length);
				if (all) {
					$scope.selectedCards = '';
					$scope.cardsFilterAll = true
				}
				else {
					$scope.cardsFilterAll = false;
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

		//$scope.$watch('paymentTypeFilter', function (newVal, oldVal) {
		//    if (newVal != undefined) {
		//        if (newVal.ind_total == null)
		//            $scope.accountFilter.ind_total = '';
		//        $scope.filterData();
		//    }
		//}, true);


		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});

	}


	angular.module('controllers')
	.controller('fundMGMTCardsCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', fundMGMTCardsCtrl]);
}());
