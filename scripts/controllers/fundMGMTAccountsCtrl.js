(function () {
	function fundMGMTAccountsCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.$utils = utils;
		$scope.accoConversions = accoConversions;
		$scope.appData = AppData;
		$scope.bankId = $state.params.bank;
		$scope.months = utils.monthNames();
		$scope.years = utils.yearsKsafim(3);
		$scope.date = new Date();
		$scope.transactionIndFilter = {ind_expence: ''};
		$scope.appData.dateFilterTypesCards = '00';
		$scope.accountFilter = {company_account_id: null};
		$scope.firstDayOfYear = new Date(new Date().getFullYear(), (new Date().getMonth() - 3), new Date().getDate());
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
		$scope.firstDayOfYearBetween = new Date(((new Date().getMonth() > 2) ? new Date().getFullYear() : (new Date().getFullYear() - 1)), 0, 1);
		$scope.lastDayOfYearBetween = new Date(((new Date().getMonth() > 2) ? new Date().getFullYear() : (new Date().getFullYear() - 1)), 11, 31);
		var datesLast = new Date();
		datesLast.setMonth(datesLast.getMonth() - 3);
		datesLast.setDate(datesLast.getDate());
		datesLast.setFullYear(datesLast.getFullYear());
		$scope.fromDate = datesLast;
		$scope.dateFilter = {
			type: "1",
			byMonth: $scope.fromDate.getMonth(),
			byYear: $scope.fromDate.getFullYear(),
			fromDate: new Date((new Date()).setMonth(new Date().getMonth() - 3)),
			toDate: new Date(),
			fromMonth: $scope.firstDayOfYearBetween.getMonth(),
			fromYear: $scope.firstDayOfYearBetween.getFullYear(),
			toMonth: $scope.lastDayOfYearBetween.getMonth(),
			toYear: $scope.lastDayOfYearBetween.getFullYear()
		};
		$scope.datesPicker = {
			fromDatePicker: ("0" + (parseInt($scope.firstDayOfYear.getDate()))).slice(-2) + '/' + ("0" + (parseInt($scope.firstDayOfYear.getMonth() + 1))).slice(-2) + '/' + $scope.firstDayOfYear.getFullYear(),
			toDatePicker: ("0" + (parseInt($scope.lastDayOfYear.getDate()))).slice(-2) + '/' + ("0" + (parseInt($scope.lastDayOfYear.getMonth() + 1))).slice(-2) + '/' + $scope.lastDayOfYear.getFullYear()
		};
		$scope.actionTypeFilter = {company_account_id: ''};
		$scope.transactionTypeFilter = {};
		$scope.init = function () {
			$scope.appData.filteredTransactions = null;
			$scope.appData.totalsObj = {sum: {totalExpenses: 0, totalIncome: 0}};
			if ($scope.$state.current.url == "/accounts") {
				$scope.$state.go('fundManagement.bankAccounts.table');
			}
		};
		$scope.isPriShow = false;
		$scope.currency_id_fundMGMTAccountsCtrl = '₪';
		//if ($scope.appData.companies) {
		//    $scope.$emit('getCompaniesThis');
		//}
		//$scope.getTransactionTypes = function (res) {
		//    debugger
		//    if (!$scope.appData.transactionTypes || res) {
		//        serverConnection.getTransactionTypesNew($scope.appData.selectedCompany).then(function (response) {
		//            $scope.appData.transactionTypes = response;
		//            $scope.transactionTypeFilter = {};
		//            for (var i = 0; i < response.length; i++) {
		//                if ($scope.appData.goToBankAccountsTable && $scope.appData.goToBankAccountsTable.hasPeula == true) {
		//                    if($scope.appData.goToBankAccountsTable.type == response[i].trans_type_id){
		//                        $scope.transactionTypeFilter[response[i].trans_type_id] = true;
		//                    }
		//                    else{
		//                        $scope.transactionTypeFilter[response[i].trans_type_id] = false;
		//                    }
		//                }
		//                else{
		//                    $scope.transactionTypeFilter[response[i].trans_type_id] = true;
		//                }
		//            }
		//        }, function (error) {
		//        });
		//    }
		//    else{
		//        for (var i = 0; i < $scope.appData.transactionTypes.length; i++) {
		//            if ($scope.appData.goToBankAccountsTable && $scope.appData.goToBankAccountsTable.hasPeula == true) {
		//                if($scope.appData.goToBankAccountsTable.type == $scope.appData.transactionTypes[i].trans_type_id){
		//                    $scope.transactionTypeFilter[$scope.appData.transactionTypes[i].trans_type_id] = true;
		//                }
		//                else{
		//                    $scope.transactionTypeFilter[$scope.appData.transactionTypes[i].trans_type_id] = false;
		//                }
		//            }
		//            else{
		//                $scope.transactionTypeFilter[$scope.appData.transactionTypes[i].trans_type_id] = true;
		//            }
		//        }
		//    }
		//};

		$scope.getTransactionTypes = function (start) {
			serverConnection.getTransactionTypesNew($scope.appData.selectedCompany).then(function (response) {
				$scope.appData.transactionTypesReg = response;
				// $scope.appData.transactionTypesEX = [];
				// $scope.appData.transactionTypesIN = [];
				// $scope.appData.transactionTypesReg.forEach(function (v) {
				// 	if (v.ind_expence == 1) {
				// 		$scope.appData.transactionTypesEX.push(v)
				// 	}
				// 	else {
				// 		$scope.appData.transactionTypesIN.push(v)
				// 	}
				// })
				if (start) {
					$q.all([$scope.getTransactions('def'), $scope.getCompanyAccounts()]).then(function (successT, successC) {
						if (successT) {
							$scope.loader = true;
							var tooltip = '';
							$scope.appData.selectedCompany.transactions.forEach(function (t) {
								//if (t.target_name.indexOf(',') > -1) {
								//	var target_name = t.target_name.split(',');
								//	t.target_name = target_name[0];
								//	var tooltips = target_name.splice(1, target_name.length);
								//	tooltips.forEach(function (p) {
								//		tooltip += p + '|';
								//	});
								//	t.target_name_tooltip = tooltip;
								//}
								var getTypeName = $scope.getTypeName(t.trans_type_id);
								t.trans_type_name = (getTypeName !== "") ? getTypeName : "ללא קטגוריה";
								t.listPeulot = false;
								t.company_account_nickname = $scope.getAccountNum(t.company_account_id)[0];
								t.bank_account_number = $scope.getAccountNum(t.company_account_id)[2];
								t.bank_id = 'data' + $scope.getAccountNum(t.company_account_id)[1];
							});
							$scope.appData.selectedCompany.accounts = successT[1];
							if ($scope.appData.selectedCompany.accounts.bank_account_list !== null && $scope.appData.selectedCompany.accounts.bank_account_list.length == 1) {
								$scope.accountFilter = {company_account_id: $scope.appData.selectedCompany.accounts.bank_account_list[0].company_account_id};
							}
						}
					}, function (error) {

					});
				}
			}, function (error) {
				if (start) {
					$q.all([$scope.getTransactions('def'), $scope.getCompanyAccounts()]).then(function (successT, successC) {
						if (successT) {
							$scope.loader = true;
							var tooltip = '';
							$scope.appData.selectedCompany.transactions.forEach(function (t) {
								//if (t.target_name.indexOf(',') > -1) {
								//	var target_name = t.target_name.split(',');
								//	t.target_name = target_name[0];
								//	var tooltips = target_name.splice(1, target_name.length);
								//	tooltips.forEach(function (p) {
								//		tooltip += p + '|';
								//	});
								//	t.target_name_tooltip = tooltip;
								//}
								var getTypeName = $scope.getTypeName(t.trans_type_id);
								t.trans_type_name = (getTypeName !== "") ? getTypeName : "ללא קטגוריה";
								t.listPeulot = false;
								t.company_account_nickname = $scope.getAccountNum(t.company_account_id)[0];
								t.bank_account_number = $scope.getAccountNum(t.company_account_id)[2];
								t.bank_id = 'data' + $scope.getAccountNum(t.company_account_id)[1];
							});

							$scope.appData.selectedCompany.accounts = successT[1];
							if ($scope.appData.selectedCompany.accounts.bank_account_list !== null && $scope.appData.selectedCompany.accounts.bank_account_list.length == 1) {
								$scope.accountFilter = {company_account_id: $scope.appData.selectedCompany.accounts.bank_account_list[0].company_account_id};
							}
						}
					}, function (error) {

					});
				}
			});
		};

		$scope.selectCompany = function (company) {//getClasification
			$scope.appData.filteredTransactions = null;
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			$scope.getTransactionTypes(true);
		}

		$scope.refresh = function () {
			$scope.getTransactionTypes(true);
		};
		$scope.$on('refresh', function () {
			$scope.refresh();
		});
		$scope.help = function () {
			window.open('http://bizibox.biz/help/bankanalysis', '_blank');
		};

		$scope.checkAllPeula = function () {
			if (!$scope.selectedAllPeula) {
				$scope.selectedAllPeula = false;
			}
			else {
				$scope.selectedAllPeula = true;
			}
			angular.forEach($scope.appData.typePeulaRows, function (t) {
				t.peulaActive = $scope.selectedAllPeula;
			});
			$scope.filterTransaction();
		};

		$scope.checkAll = function () {
			if ($scope.selectedAll) {
				$scope.selectedAll = true;
			} else {
				$scope.selectedAll = false;
			}
			angular.forEach($scope.appData.selectedCompany.transactionsTypes, function (t) {
				t.payment_type_id = $scope.selectedAll;
			});
			$scope.filterTransaction()
		};

		$scope.getTransactions = function (force) {
			$scope.loader = false;

			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}
            $scope.isPriShow = false;
			var deferred = $q.defer();
			//if (!$scope.appData.selectedCompany.transactions || force) {
			var fromDate, toDate;
			switch ($scope.appData.dateFilterTypesCards) {
				case "00":
					fromDate = $scope.dateFilter.byYear + '' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '' + ("0" + ($scope.fromDate.getDate())).slice(-2);
					toDate = $scope.dateFilter.toDate.getFullYear() + '' + ("0" + ($scope.dateFilter.toDate.getMonth() + 1)).slice(-2) + '' + ("0" + $scope.dateFilter.toDate.getDate()).slice(-2);
					$scope.textTitlePage = '  ' + 'שלושה חודשים אחרונים';
					break;

				case "0":
					fromDate = '' + $scope.dateFilter.byYear + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '01';
					toDate = '' + $scope.dateFilter.byYear + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear);
					$scope.textTitlePage = ' ' + 'חודש' + ' ' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
					break;

				case "1":
					fromDate = $scope.datesPicker.fromDatePicker.toString().split('/')[2] + '' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '' + $scope.datesPicker.fromDatePicker.toString().split('/')[0];
					toDate = $scope.datesPicker.toDatePicker.toString().split('/')[2] + '' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '' + $scope.datesPicker.toDatePicker.toString().split('/')[0];
					$scope.textTitlePage = ' ' + 'בין תאריכים' + ' ' + $scope.datesPicker.fromDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.fromDatePicker.toString().split('/')[2] + '-' + $scope.datesPicker.toDatePicker.toString().split('/')[0] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[1] + '/' + $scope.datesPicker.toDatePicker.toString().split('/')[2];
					break;

				case "2":
					fromDate = '' + $scope.dateFilter.fromYear + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '01';
					toDate = '' + $scope.dateFilter.toYear + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '' + daysInMonth(parseInt($scope.dateFilter.toMonth) + 1, $scope.dateFilter.toYear);
					$scope.textTitlePage = '  ' + 'בין חודשים' + ' ' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear + '-' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
					break;
			}

			if ($scope.appData.goToBankAccountsTable) {
				$scope.showFilters = true;

				if ($scope.appData.goToBankAccountsTable.accId !== null) {
					$scope.accountFilter.company_account_id = $scope.appData.goToBankAccountsTable.accId;
				}
				$scope.appData.dateFilterTypesCards = $scope.appData.goToBankAccountsTable.filters;
				fromDate = $scope.appData.goToBankAccountsTable.fromDate;
				toDate = $scope.appData.goToBankAccountsTable.toDate;
				$scope.transactionIndFilter = {ind_expence: $scope.appData.goToBankAccountsTable.typeSum.toString()};
			}

			serverConnection.getTransactions($scope.appData.selectedCompany, fromDate, toDate).then(function (transactions) {
				$scope.loader = true;
				$scope.appData.selectedCompany.transactions = transactions.banktrans_peulot;
				$scope.appData.selectedCompany.transactionsTypes = transactions.searchkey_cat;

				//trans_type_id
				var tooltip = '';
				$scope.appData.selectedCompany.transactions.forEach(function (t) {
					//if (t.target_name.indexOf(',') > -1) {
					//	var target_name = t.target_name.split(',');
					//	t.target_name = target_name[0];
					//	var tooltips = target_name.splice(1, target_name.length);
					//	tooltips.forEach(function (p) {
					//		tooltip += p + '|';
					//	});
					//	t.target_name_tooltip = tooltip;
					//}
					if (force) {
						var getTypeName = $scope.getTypeName(t.trans_type_id);
						t.trans_type_name = (getTypeName !== "") ? getTypeName : "ללא קטגוריה";
					}
					t.listPeulot = false;
					t.company_account_nickname = $scope.getAccountNum(t.company_account_id)[0];
					t.bank_account_number = $scope.getAccountNum(t.company_account_id)[2];
					t.bank_id = 'data' + $scope.getAccountNum(t.company_account_id)[1];
				});
				$scope.appData.selectedCompany.transactionsTypes.forEach(function (t) {
					if ($scope.appData.goToBankAccountsTable && $scope.appData.goToBankAccountsTable.hasPeula == false) {
						if ($scope.appData.goToBankAccountsTable.type == t.searchkey_cat_id) {
							t.payment_type_id = true;
						}
						else {
							t.payment_type_id = false;
						}
					}
					else {
						t.payment_type_id = true;
					}
				});

				transactions.banktrans_peulot.forEach(function (t) {
					t.payment_type_name = accoConversions.getClasification(t.payment_type_id);
					t.company_account_nickname = $scope.getAccountNum(t.company_account_id)[0];
					t.bank_account_number = $scope.getAccountNum(t.company_account_id)[2];
					t.bank_id = 'data' + $scope.getAccountNum(t.company_account_id)[1];
				});
				$scope.filterTransaction('firstload');
				deferred.resolve(true);
			}, function (error) {
				deferred.reject(true);
			});
			//}
			//else {
			//    deferred.resolve(false);
			//}

			return deferred.promise;
		};

		$scope.getTypeName = function (id) {
			var name = "";
			$scope.appData.transactionTypesReg.forEach(function (val) {
				if (val.trans_type_id === id) {
					name = val.trans_type_name;
				}
			});
			return name;
		}

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

		$scope.converterPayMentTypes = function (type) {
			var val = '';
			if ($scope.appData.selectedCompany.transactionsTypes) {
				$scope.appData.selectedCompany.transactionsTypes.forEach(function (v) {
					if (v.searchkey_cat_id == type) {
						val = v.searchket_cat_name;
					}
				});
			}
			return val;
		};

		$scope.calcMonthTotals = function () {
			var months = [];
			var monthsSumsIncome = [[]];
			var monthsSumsExpenses = [[]];
			var totalIncomesPlot = [];
			var totalExpensesPlot = [];

			function toFixedNumber(num, fixed) {
				fixed = 2 || 0;
				fixed = Math.pow(10, fixed);
				return Math.floor(num * fixed) / fixed;
			}

			if ($scope.filterTransaction) {
				$scope.appData.totalsObj = {sum: {totalExpenses: 0, totalIncome: 0}};
				var totalExpenses = 0, totalIncome = 0, index = 0;
				var lengthfilteredTransactions = $scope.appData.filteredTransactions.length;
				for (var i = 0; i < lengthfilteredTransactions; i++) {
					if ($scope.appData.filteredTransactions[i].ind_expence == 1) {
						// if(Number($scope.appData.filteredTransactions[i].next_total) < 0){
						// }
						// else {
						// 	totalIncome = totalIncome + Number($scope.appData.filteredTransactions[i].next_total);
						// }
						totalExpenses = totalExpenses + Number($scope.appData.filteredTransactions[i].next_total);
						monthsSumsExpenses[index].push(({
							Val: toFixedNumber(Number($scope.appData.filteredTransactions[i].next_total)),
							name: $scope.appData.filteredTransactions[i].target_name
						}));
					}
					else if ($scope.appData.filteredTransactions[i].ind_expence == 0) {
						// if(Number($scope.appData.filteredTransactions[i].next_total) < 0){
						// 	totalExpenses = Number(totalExpenses) + Number($scope.appData.filteredTransactions[i].next_total);
						// }
						// else {
						// }
						totalIncome = Number(totalIncome) + Number($scope.appData.filteredTransactions[i].next_total);
						monthsSumsIncome[index].push(({
							Val: toFixedNumber(Number($scope.appData.filteredTransactions[i].next_total)),
							name: $scope.appData.filteredTransactions[i].target_name
						}));
					}
					if (i == $scope.appData.filteredTransactions.length - 1 || ($scope.appData.filteredTransactions[i + 1].due_date).split("/")[1] != ($scope.appData.filteredTransactions[i].due_date).split("/")[1]) {
						$scope.appData.totalsObj[($scope.appData.filteredTransactions[i].due_date).split("/")[1]] = {
							totalExpenses: totalExpenses,
							totalIncome: totalIncome
						};
						$scope.appData.totalsObj["sum"].totalExpenses = $scope.appData.totalsObj["sum"].totalExpenses + totalExpenses;
						$scope.appData.totalsObj["sum"].totalIncome = $scope.appData.totalsObj["sum"].totalIncome + totalIncome;
						totalExpenses = 0;
						totalIncome = 0;
						months.push($scope.months[parseInt($scope.appData.filteredTransactions[i].due_date.split("/")[1]) - 1]);
						totalIncomesPlot.push(toFixedNumber($scope.appData.totalsObj[($scope.appData.filteredTransactions[i].due_date).split("/")[1]].totalIncome));
						totalExpensesPlot.push({
							y: toFixedNumber($scope.appData.totalsObj[($scope.appData.filteredTransactions[i].due_date).split("/")[1]].totalExpenses),
							dataLabels: {x: 0, y: 25}
						});
						index++;
						monthsSumsExpenses.push([]);
						monthsSumsIncome.push([]);
					}
				}

				var inc0 = false, exp0 = false;
				var lengthTotalIncomesPlot = totalIncomesPlot.length;
				for (var i = 0; i < lengthTotalIncomesPlot; i++) {
					if (totalIncomesPlot[i] !== 0)
						inc0 = true;
					if (totalExpensesPlot[i] !== 0)
						exp0 = true;
				}
				totalIncomesPlot = (inc0) ? totalIncomesPlot : []
				totalExpensesPlot = (exp0) ? totalExpensesPlot : []
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
				xAxis: months,
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
		};

		$scope.addSumRows = function () {
			var l = $scope.appData.filteredTransactions.length;
			for (var i = 0; i < l - 1; i++) {
				if ($scope.isLastInMonth($scope.appData.filteredTransactions[i], i)) {
					var sumRow = {
						sumRow: true,
						due_date: $scope.appData.filteredTransactions[i].due_date,
						company_account_nickname: $scope.appData.filteredTransactions[i].company_account_nickname,
						payment_type_name: $scope.appData.filteredTransactions[i].payment_type_name,
						target_name: $scope.appData.filteredTransactions[i].target_name,
						next_total: $scope.appData.filteredTransactions[i].next_total,
						asmachta: $scope.appData.filteredTransactions[i].asmachta,
						itra: $scope.appData.filteredTransactions[i].itra
					};

					angular.extend(sumRow, $scope.appData.filteredTransactions[i]);
					$scope.appData.filteredTransactions.splice(i + 1, 0, sumRow).join();
					i++;
					l++;
				}
			}


			var sumRow = {
				sumRow: true,
				due_date: $scope.appData.filteredTransactions[i].due_date,
				company_account_nickname: $scope.appData.filteredTransactions[i].company_account_nickname,
				payment_type_name: $scope.appData.filteredTransactions[i].payment_type_name,
				target_name: $scope.appData.filteredTransactions[i].target_name,
				next_total: $scope.appData.filteredTransactions[i].next_total,
				asmachta: $scope.appData.filteredTransactions[i].asmachta,
				itra: $scope.appData.filteredTransactions[i].itra
			};
			angular.extend(sumRow, $scope.appData.filteredTransactions[$scope.appData.filteredTransactions.length - 1]);
			$scope.appData.filteredTransactions.splice($scope.appData.filteredTransactions.length, 0, sumRow).join();

		};

		$scope.isLastInMonth = function (row, i) {
			if (!$scope.appData.filteredTransactions || !row)
				return false;
			if (($scope.appData.filteredTransactions[i + 1].due_date).split("/")[1] != (row.due_date).split("/")[1])
				return true;
		};

		$scope.getAccountNum = function (companyId) {
			var response = '';
			if ($scope.appData.selectedCompany.accounts && $scope.appData.selectedCompany.accounts.bank_account_list.length > 0) {
				$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (account) {
					if (companyId == account.company_account_id)
						response = [account.company_account_nickname, account.bank_id, account.bank_account_number]
				})
			}

			return response;
		};

		$scope.sendMailer = function () {
			$scope.showPopup('views/templates/mailer.html?ver=3.80', 'mailerPopup', false);
		};

		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});

		$scope.peulaTypes = function () {
			var deferred = $q.defer();
			var arr = $scope.appData.filteredTransactions;
			var flags = [], output = [], l = arr.length, i;
			for (i = 0; i < l; i++) {
				if (flags[arr[i].trans_type_id]) continue;
				flags[arr[i].trans_type_id] = true;
				if ($scope.appData.goToBankAccountsTable && $scope.appData.goToBankAccountsTable.hasPeula == true) {
					if ($scope.appData.goToBankAccountsTable.type == arr[i].trans_type_id) {
						output.push({
							'trans_type_name': arr[i].trans_type_name,
							'trans_type_id': arr[i].trans_type_id,
							'peulaActive': true
						});
					}
					else {
						output.push({
							'trans_type_name': arr[i].trans_type_name,
							'trans_type_id': arr[i].trans_type_id,
							'peulaActive': false
						});
					}
				}
				else {
					output.push({
						'trans_type_name': arr[i].trans_type_name,
						'trans_type_id': arr[i].trans_type_id,
						'peulaActive': true
					});
				}

			}
			$scope.appData.typePeulaRows = output;
			deferred.resolve(true);
			return deferred.promise;
		};

		$scope.sortDateAll = true;
		$scope.appData.sortDateAll = true;
		$scope.filterTransaction = function (firstload) {
			$scope.isPriShow = false;
			if ($scope.appData.selectedCompany && $scope.appData.selectedCompany.accounts && $scope.appData.selectedCompany.accounts.bank_account_list.filter(function (item) {
				return item.company_account_id === $scope.accountFilter.company_account_id
			}).length) {
				var bankAcc = $scope.appData.selectedCompany.accounts.bank_account_list.filter(function (item) {
					return item.company_account_id === $scope.accountFilter.company_account_id
				})[0]
				$scope.currency_id_fundMGMTAccountsCtrl = accoConversions.getCurrencyId(bankAcc.currency_id);
			} else {
				$scope.currency_id_fundMGMTAccountsCtrl = '₪';
			}
			if ($scope.appData.selectedCompany && $scope.appData.selectedCompany.transactions) {
				$scope.appData.filteredTransactionsData = $filter('filterAcc')($scope.appData.selectedCompany.transactions, $scope.accountFilter);
				$scope.appData.filteredTransactions = $filter('freeFilterBankTable')($scope.appData.selectedCompany.transactions, $scope.freeSearch);

				if (firstload) {
					$scope.peulaTypes().then(function () {
						if ($scope.appData.goToBankAccountsTable && $scope.appData.goToBankAccountsTable.hasPeula == true) {
							$scope.appData.filteredTransactions = $filter('freeFilterTazrimPeula')($scope.appData.filteredTransactions, $scope.appData.typePeulaRows);
							$scope.appData.goToBankAccountsTable = false;
						}
						else {
							$scope.appData.goToBankAccountsTable = false;
						}
						$scope.appData.filteredTransactions = $filter('filterAcc')($scope.appData.filteredTransactions, $scope.accountFilter);
						$scope.appData.filteredTransactions = $filter('filtersAll')($scope.appData.filteredTransactions, $scope.appData.selectedCompany.transactionsTypes);
						//$scope.appData.filteredTransactions = $filter('filter')($scope.appData.filteredTransactions, $scope.actionTypeFilter);
						$scope.appData.filteredTransactions = $filter('filter')($scope.appData.filteredTransactions, $scope.transactionIndFilter);
						//  $scope.appData.filteredTransactions = $filter('includeFilter')($scope.appData.filteredTransactions, 'trans_type_id', $scope.transactionTypeFilter);

						if ($scope.sortDateAll == false) {
							$scope.appData.sortDateAll = false;
							// var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
							//
							// function dmyOrdA(a, b) {
							// 	a = a.due_date.replace(dateRE, "$3$2$1");
							// 	b = b.due_date.replace(dateRE, "$3$2$1");
							// 	if (a > b) return 1;
							// 	if (a < b) return -1;
							// 	return 0;
							// }
							//
							// $scope.appData.filteredTransactions.sort(dmyOrdA);

							$scope.appData.filteredTransactions.reverse();
						}

						$scope.calcMonthTotals();
						$scope.addSumRows();
					});
				}
				else {
					$scope.appData.filteredTransactions = $filter('freeFilterTazrimPeula')($scope.appData.filteredTransactions, $scope.appData.typePeulaRows);
					$scope.appData.filteredTransactions = $filter('filterAcc')($scope.appData.filteredTransactions, $scope.accountFilter);
					$scope.appData.filteredTransactions = $filter('filtersAll')($scope.appData.filteredTransactions, $scope.appData.selectedCompany.transactionsTypes);
					//$scope.appData.filteredTransactions = $filter('filter')($scope.appData.filteredTransactions, $scope.actionTypeFilter);
					$scope.appData.filteredTransactions = $filter('filter')($scope.appData.filteredTransactions, $scope.transactionIndFilter);
					//  $scope.appData.filteredTransactions = $filter('includeFilter')($scope.appData.filteredTransactions, 'trans_type_id', $scope.transactionTypeFilter);
					if ($scope.sortDateAll == false) {
						$scope.appData.sortDateAll = false;
						// var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
						//
						// function dmyOrdA(a, b) {
						// 	a = a.due_date.replace(dateRE, "$3$2$1");
						// 	b = b.due_date.replace(dateRE, "$3$2$1");
						// 	if (a > b) return 1;
						// 	if (a < b) return -1;
						// 	return 0;
						// }
						//
						// $scope.appData.filteredTransactions.sort(dmyOrdA);
						$scope.appData.filteredTransactions.reverse();
					}
					$scope.calcMonthTotals();
					$scope.addSumRows();
				}
			}

			$scope.isPriShow = $scope.accountFilter.company_account_id;

			//$scope.isPriShow = $scope.appData.dateFilterTypesCards === "0" && $scope.accountFilter.company_account_id && $scope.isThisDate($scope.dateFilter.byMonth, $scope.dateFilter.byYear);
		};

		// $scope.mail = $scope.appData.selectedCompany.mail;
		$scope.sending = function (dataExcel) {
			serverConnection.sendMail(dataExcel).then(function (res) {
				$scope.error = 'המייל נשלח בהצלחה';
				$scope.hidePopup();
			}, function (error) {
				$scope.error = 'המייל לא נשלח בהצלחה';
			});
		};

		$scope.openCheckImg = function (uuid, idBank, bankTransId) {
			debugger
			if (uuid == 'x') {
				$scope.showPopup('views/templates/alertXcheck.html?ver=3.80', 'popAlert', true);
				setTimeout(function () {
					$scope.hidePopup();
				}, 3000)
			}
			else {
				$scope.loader = false;

				var folder_name;
				$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
					if (v.company_account_id == idBank) {
						folder_name = v.bank_id + '' + v.bank_snif_id + '' + v.bank_account_number;
					}
				});
				serverConnection.copyCheks(uuid, folder_name, bankTransId).then(function (picture) {
					$scope.loader = true;
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
					$scope.loader = false;
				});
			}
		};


		$scope.get_perut_bankdetail = function (link_id, inbank_trans_id) {
			serverConnection.get_perut_bankdetail2({
				'inlink_id': link_id,
				'inbank_trans_id': inbank_trans_id
			}).then(function (res) {
				$scope.appData.bankdetailAll = res;
				$scope.appData.bankdetailIndex = 0;
				$scope.appData.bankdetail = res[$scope.appData.bankdetailIndex];
				$scope.showPopup('views/templates/bankdetail.html?ver=3.80', 'bankdetail');
			}, function (error) {
			});
		};

		$scope.targetNameChange = function (t) {
			t.targetNameChange = !t.targetNameChange;
			if (!t.targetNameChange) {
				$scope.updateTransactionTypeName(t);
			}
		};
		$scope.showAddTransTypeDialog = function (t) {
			$scope.appData.newTransParentIndex = t;
			$scope.showPopup('views/templates/addTransactionTypeDialog.html?ver=3.80', 'addTransactionTypeDialog');
		};
		$scope.updateTransactionTypeName = function (t, item) {
			var items, trans_name, data;
			if (!item) {
				items = t.trans_type_id;
				trans_name = t.target_name;
				data = {
					trans_id: t.trans_id,
					trans_name: trans_name,
					ind_bank: 1,
					trans_type_id: items,
					oldpayment_type_id: null
				}
			}
			else {
				items = item.trans_type_id;
				trans_name = t.trans_name;
				data = {
					trans_id: t.trans_id,
					ind_bank: 1,
					trans_type_id: items,
					oldpayment_type_id: null
				}
			}
			serverConnection.updateTransactionType(data).then(function (result) {
				$scope.appData.filteredTransactions.forEach(function (v, index) {
					if (v.trans_id == t.trans_id) {
						v.trans_type_name = item.trans_type_name;
						v.trans_type_id = item.trans_type_id;
						v.listPeulot = false;
						v.openListThis = false;
					}
				})

				var has = 0;
				$scope.appData.typePeulaRows.forEach(function (v) {
					if (v.trans_type_id == item.trans_type_id) {
						has = 1;
					}
				})
				if (has == 0) {
					var data = {
						'trans_type_name': item.trans_type_name,
						'trans_type_id': item.trans_type_id,
						'peulaActive': true
					}
					$scope.appData.typePeulaRows.push(data);
				}

			}, function (error) {
			});
		};
		$scope.addNewTransType = function () {
			serverConnection.addNewTransType({
				companyId: $scope.appData.selectedCompany.companyId,
				transTypeName: $scope.newTransactionName,
				indExpense: $scope.appData.newTransParentIndex.ind_expence
			}).then(function (result) {
				var t = {
					trans_id: $scope.appData.newTransParentIndex.trans_id,
					trans_name: $scope.appData.newTransParentIndex.trans_name
				}
				var item = {
					trans_type_name: $scope.newTransactionName,
					trans_type_id: result
				}
				var listPush = {
					trans_type_name: $scope.newTransactionName,
					trans_type_id: result,
					ind_expence: $scope.appData.newTransParentIndex.ind_expence
				}
				var data = {
					'trans_type_name': $scope.newTransactionName,
					'trans_type_id': result,
					'peulaActive': true
				}
				$scope.appData.typePeulaRows.push(data);
				$scope.updateTransactionTypeName(t, item)

				var pushPeulot = {
					'trans_type_name': $scope.newTransactionName,
					'trans_type_id': result
				}
				$scope.appData.transactionTypesReg.push(pushPeulot);


				// if ($scope.appData.newTransParentIndex.ind_expence == 0) {
				// 	$scope.appData.transactionTypesIN.push(pushPeulot)
				// }
				// if ($scope.appData.newTransParentIndex.ind_expence == 1) {
				// 	$scope.appData.transactionTypesEX.push(pushPeulot)
				// }

				$scope.hidePopup();
			}, function (error) {
			});
		};
		$scope.openPeulotList = function (ind, openListThis, event) {
			event.stopPropagation();
			$scope.appData.filteredTransactions.forEach(function (v, index) {
				if (v.trans_id == ind) {
					if (openListThis == true)
						v.listPeulot = true;
					else
						v.listPeulot = false;
				}
				else {
					v.listPeulot = false;
					v.openListThis = false;
				}
			})
		}
		$scope.trans_type_update_ksafim = function (item, type) {
			if (!item.edits) {
				serverConnection.trans_type_update_ksafim({
					company_id: $scope.appData.selectedCompany.companyId,
					trans_type_id: item.trans_type_id,
					trans_type_name: item.trans_type_name
				}).then(function (result) {
					$scope.appData.typePeulaRows.forEach(function (v) {
						if (v.trans_type_id == item.trans_type_id) {
							v.trans_type_name = item.trans_type_name;
						}
					})

					$scope.appData.transactionTypesReg.forEach(function (v) {
						if (v.trans_type_id == item.trans_type_id) {
							v.trans_type_name = item.trans_type_name;
						}
					})

					// if (type == 'transactionTypesEX') {
					// 	$scope.appData.transactionTypesEX.forEach(function (v) {
					// 		if (v.trans_type_id == item.trans_type_id) {
					// 			v.trans_type_name = item.trans_type_name;
					// 		}
					// 	})
					// }
					// if (type == 'transactionTypesIN') {
					// 	$scope.appData.transactionTypesIN.forEach(function (v) {
					// 		if (v.trans_type_id == item.trans_type_id) {
					// 			v.trans_type_name = item.trans_type_name;
					// 		}
					// 	})
					// }
				}, function (error) {
				});
			}
		}
		$scope.trans_type_delete_ksafim = function (item, type) {
			serverConnection.trans_type_delete_ksafim({
				companyId: $scope.appData.selectedCompany.companyId,
				transTypeId: item.trans_type_id
			}).then(function (result) {
				$scope.appData.typePeulaRows.forEach(function (v, i) {
					if (v.trans_type_id == item.trans_type_id) {
						$scope.appData.typePeulaRows.splice(i, 1);
					}
				})


				$scope.appData.transactionTypesReg.forEach(function (v, i) {
					if (v.trans_type_id == item.trans_type_id) {
						$scope.appData.transactionTypesReg.splice(i, 1);
					}
				})

				// if (type == 'transactionTypesEX') {
				// 	$scope.appData.transactionTypesEX.forEach(function (v, i) {
				// 		if (v.trans_type_id == item.trans_type_id) {
				// 			$scope.appData.transactionTypesEX.splice(i, 1);
				// 		}
				// 	})
				// }
				// if (type == 'transactionTypesIN') {
				// 	$scope.appData.transactionTypesIN.forEach(function (v, i) {
				// 		if (v.trans_type_id == item.trans_type_id) {
				// 			$scope.appData.transactionTypesIN.splice(i, 1);
				// 		}
				// 	})
				// }
			}, function (error) {
			});
		}
		$scope.openExportsHash = function () {
			if ($scope.accountFilter.company_account_id == '' || $scope.accountFilter.company_account_id == null) {
				$scope.showPopup('views/templates/popAlert.html?ver=3.80', 'popAlert', true);

				setTimeout(function () {
					$scope.hidePopup();
				}, 2000)
			}
			else {
				$scope.showPopup('views/templates/exportsHash.html?ver=3.80', 'exportsHashPop', false);
			}
		}
	}

	angular.module('controllers')
	.controller('fundMGMTAccountsCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', fundMGMTAccountsCtrl]);
}());


