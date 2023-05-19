(function () {
	function tazrimCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $anchorScroll, $ocLazyLoad) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.$utils = utils;
		$scope.accoConversions = accoConversions;
		$scope.appData = AppData;
		$scope.nextPage = $state.params.url;
		$scope.months = utils.monthNames();
		$scope.years = utils.yearsTazrim(4);
		$scope.date = new Date();
		$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
		$scope.fromDate = new Date();
		$scope.toDate = new Date((new Date()).setDate(new Date().getDate() + 500));
		$scope.fromMonYear = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
		$scope.toMonYear = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1);
		$scope.fromDatePick = new Date();
		$scope.toDatePick = new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate());
		//$scope.datesPicker = {
		//    fromDatePicker: (($scope.fromMonYear.getDate().toString().length == 2) ? $scope.fromMonYear.getDate() : '0' + $scope.fromMonYear.getDate()) + '/' + (($scope.fromMonYear.getMonth().toString().length == 2) ? ($scope.fromMonYear.getMonth() + 1) : '0' + ($scope.fromMonYear.getMonth() + 1)) + '/' + $scope.fromMonYear.getFullYear(),
		//    toDatePicker: (($scope.toMonYear.getDate().toString().length == 2) ? $scope.toMonYear.getDate() : '0' + $scope.toMonYear.getDate()) + '/' + (($scope.toMonYear.getMonth().toString().length == 2) ? ($scope.toMonYear.getMonth() + 1) : '0' + ($scope.toMonYear.getMonth() + 1)) + '/' + $scope.toMonYear.getFullYear()
		//};
		$ocLazyLoad.load({
			cache: true,
			files: [
				'scripts/lib/xlsx.core.min.js?ver=0.2',
				'scripts/lib/alasql.min.js?ver=0.2'
			]
		});
		$scope.init = function () {
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
			$scope.appData.dateFilterTypesTzrim = '00';
			$scope.appData.addTypePeulaPopUpForm = false;
			$scope.appData.redErrorFilterType = false;
			$scope.appData.openDialog = false;
			$scope.appData.alertSucUpd = false;
			$scope.appData.alertSucAdd = false;
			$scope.appData.Excel_delete_old_payments = false;
		};
		$scope.filteredDataLoader = false;
		$scope.showRowSumNig = false;
		$scope.loaderTazrim = false;
		$scope.showAlertNullAcc = false;
		$scope.first = true;
		$scope.showAlertNull = false;
		$scope.accountFilter = {company_account_id: ''};
		$scope.paymentTypeFilter = {ind_total: ''};
		$scope.solekFilter = {};
		$scope.selectedSolkim = '';
		$scope.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			$scope.loadPageTazrim();
		};
		$scope.loadPageTazrim = function () {
			serverConnection.getCompanyAccounts($scope.appData.selectedCompany.companyId)
			.then(function (res) {
				$scope.appData.selectedCompany.accounts = res;
				$scope.dateUpdateSort = angular.copy(res.bank_account_list);
				if ($scope.dateUpdateSort !== null) {
					$scope.lastUpdateDate($scope.dateUpdateSort);
					$scope.appData.banksList = [], $scope.appData.selectBankAddRowTazrim = [];
					$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
						$scope.appData.banksList.push(v);
						$scope.appData.selectBankAddRowTazrim.push(v)
					});
					$scope.appData.banksList.push({
						'company_account_nickname': 'כל הבנקים',
						'company_account_id': 'null',
						'credit_facility': $scope.appData.selectedCompany.accounts.total_credit_facility,
						'opening_balance': $scope.appData.selectedCompany.accounts.total_opening_balance,
						'balance_use': $scope.appData.selectedCompany.accounts.total_balance_use,
						'balance_last_update_date': $scope.appData.lastUpdateDateAllBanks
					})
					$scope.appData.selectBankAddRowTazrim.unshift({
						'company_account_nickname': 'בחר חשבון',
						'company_account_id': 'null'
					})
					$scope.appData.selectedItem = $scope.appData.banksList[0];
					$scope.appData.selectAccAddTazrim = $scope.appData.selectBankAddRowTazrim[1].company_account_id;
					$scope.accountGetharigadate();
					$scope.appData.bankThis = $scope.appData.selectedCompany.accounts.bank_account_list[0];
					$scope.getTransactionTypes(true);
				}
				else {
					$scope.loaderTazrim = true;
					$scope.showAlertNullAcc = true;
				}

				//$scope.$parent.showPopUpNew2()
				//$scope.$parent.showPopUpNew3()
			}, function (error) {
			});
		};
		$scope.accountGetharigadate = function () {
			var data = {
				company_account_id: $scope.appData.selectAccAddTazrim
			}
			serverConnection.accountGetharigadate(data).then(function (res) {
				$scope.appData.alertSucUpdSelect = res.harigadate;
				$scope.appData.openDialogSelect = true;
			}, function (error) {
			});
		}
		$scope.gotoRowHariga = function () {
			$scope.appData.openDialogSelect = false;

			function addWeek(week) {
				var days = 7;
				var dates = new Date();
				dates.setFullYear(parseInt(week.toString().split('/')[2]));
				dates.setMonth(parseInt(week.toString().split('/')[1]) - 1);
				dates.setDate(parseInt(week.toString().split('/')[0]) + days);

				return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear()
			};

			function prevWeek(week) {
				var days = 1;
				var dates = new Date();
				dates.setFullYear(parseInt(week.toString().split('/')[2]));
				dates.setMonth(parseInt(week.toString().split('/')[1]) - 1);
				dates.setDate(parseInt(week.toString().split('/')[0]) - days);

				return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear()
			};
			var changeDates = {
				'date_from': prevWeek($scope.appData.alertSucUpdSelect),
				'date_till': addWeek($scope.appData.alertSucUpdSelect)
			};
			$scope.loadTazrimBank($scope.appData.selectedItem, changeDates);
		}
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
					$scope.selectDatesOnSubmit();
				}
			}, function (error) {
				if (start) {
					$scope.selectDatesOnSubmit();
				}
			});
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
		$scope.checkAll = function () {
			if (!$scope.selectedAll) {
				$scope.selectedAll = false;
			} else {
				$scope.selectedAll = true;
			}
			angular.forEach($scope.appData.typePay, function (t) {
				t.paymentActive = $scope.selectedAll;
			});
			$scope.filtersTazrim()
		};
		$scope.checkAllPeula = function () {
			if (!$scope.selectedAllPeula) {
				$scope.selectedAllPeula = false;
			} else {
				$scope.selectedAllPeula = true;
			}
			angular.forEach($scope.appData.typePeulaRows, function (t) {
				t.peulaActive = $scope.selectedAllPeula;
			});
			$scope.filtersTazrim()
		};
		$scope.changeItem = function (data) {
			$scope.selectDatesOnSubmit();
			var id = "";
			if (data.company_account_id == undefined) {
				id = data;
			}
			else {
				id = data.company_account_id;
			}
			$scope.appData.selectAccAddTazrim = id;
			if (id !== 'null') {
				$scope.accountGetharigadate();
			}
		};
		$scope.convertDateShort = function (date) {
			return parseInt(date.toString().split('/')[0]) + '/' + parseInt(date.toString().split('/')[1]) + '/' + date.toString().split('/')[2].substring(2, 4);
		};
		$scope.lastUpdateDate = function (arrAcc) {
			var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;

			function dmyOrdA(a, b) {
				a = a.balance_last_update_date.replace(dateRE, "$3$2$1");
				b = b.balance_last_update_date.replace(dateRE, "$3$2$1");
				if (a < b) return 1;
				if (a > b) return -1;
				return 0;
			}

			arrAcc.sort(dmyOrdA);
			$scope.appData.lastUpdateDateAllBanks = arrAcc[0].balance_last_update_date;
		};
		$scope.addMonth = function (month, day) {
			var m = parseInt(month.toString().split('/')[1]) - 1;
			var days = parseInt(month.toString().split('/')[0]);
			var dates = new Date();
			dates.setFullYear(parseInt(month.toString().split('/')[2]));
			dates.setMonth(m);
			dates.setDate(days + day);
			return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear();
		};
		$scope.addMonthOne = function (month) {
			var m = parseInt(month.toString().split('/')[1]);
			var days = parseInt(month.toString().split('/')[0]);
			var lastDayOfMonth = new Date(parseInt(month.toString().split('/')[2]), m, 0);
			if (days == lastDayOfMonth.getDate()) {
				var lastDayOfMonthLast = new Date(parseInt(month.toString().split('/')[2]), m + 1, 0);
				return lastDayOfMonthLast.getDate() + '/' + ("0" + (lastDayOfMonthLast.getMonth() + 1)).slice(-2) + '/' + lastDayOfMonthLast.getFullYear();
			}
			else {
				var dates = new Date(parseInt(month.toString().split('/')[2]), m, days);
				return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear();
			}
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
		$scope.loadTazrimOfBankServer = function (data) {
			var def = $q.defer();
			var data = JSON.stringify(data);
			serverConnection.getTazrimToDay(data).then(function (response) {
				def.resolve(response);
			}, function (error) {
				def.reject(error)
			});
			return def.promise;
		};
		$scope.getDayFromDate = function (date) {
			var dates = new Date();
			dates.setMonth(parseInt(date.toString().split('/')[1]));
			dates.setDate(parseInt(date.toString().split('/')[0]));
			dates.setFullYear(parseInt(date.toString().split('/')[2]));
			var day;
			switch (dates.getDay()) {
				case 0:
					day = "א'";
					break;
				case 1:
					day = "ב'";
					break;
				case 2:
					day = "ג'";
					break;
				case 3:
					day = "ד'";
					break;
				case 4:
					day = "ה'";
					break;
				case 5:
					day = "ו'";
					break;
				case 6:
					day = "שבת";
					break;
			}
			return day;
		};
		$scope.loadNickNameBank = function (uuid) {
			var nick;
			$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
				if (v.company_account_id == uuid) {
					nick = v.company_account_nickname.trim().replace(/\s+/g, " ");
				}
			});
			return nick;
		}
		$scope.loadTazrimBank = function (detalis, changeDates) {
			$scope.appData.bankTazrim = '';
			$scope.loaderTazrim = false;
			$scope.showAlertNull = false;

			//$scope.defDates = {
			//    'prev': $scope.addMonth(detalis.balance_last_update_date, 30),
			//    'next': detalis.balance_last_update_date
			//};
			//
			//$scope.appData.defPrev = detalis.balance_last_update_date;
			//$scope.appData.defNext = $scope.addMonth(detalis.balance_last_update_date, 30);

			if (changeDates) {
				$scope.appData.defPrev = changeDates.date_from;
				$scope.appData.defNext = changeDates.date_till;
				if (changeDates.date_load) {
					$scope.appData.date_load = changeDates.date_load;
				}
			}
			$scope.appData.datesTazrimEx = $scope.appData.defPrev + '-' + $scope.appData.defNext;

			var data = {
				"company_id": detalis.company_account_id,
				"date_from": $scope.appData.defPrev,
				"date_till": $scope.appData.defNext
			};
			$scope.loadTazrimOfBankServer(data).then(function (response) {
				$scope.appData.bankTazrim = response;

				if (response.length) {
					$scope.appData.bankTazrim.forEach(function (v, index) {
						var getTypeName = $scope.getTypeName(v.trans_type_id);
						v.trans_type_name = (getTypeName !== "") ? getTypeName : "ללא קטגוריה";
					});
					if ($scope.appData.transIdRowAn) {
						$scope.gotoAnchor()
					}
					else {
						if (!$scope.appData.changeRow) {
							$(".scrollWrap").animate({
								scrollTop: 0
							}, "fast");
						}
						else {
							$scope.appData.changeRow = false;
						}
					}
				}
				else {
					$scope.loaderTazrim = true;
					$scope.showAlertNull = true;
				}
				$scope.filtersTazrim('firstload');
			});
		};
		$scope.loadTazrimAllBanks = function (changeDates) {
			$scope.appData.bankTazrim = '';
			$scope.loaderTazrim = false;
			$scope.showAlertNull = false;

			$scope.appData.defPrev = $scope.appData.lastUpdateDateAllBanks;
			$scope.appData.defNext = $scope.addMonth($scope.appData.lastUpdateDateAllBanks, 30);
			if (changeDates) {
				$scope.appData.defPrev = changeDates.date_from;
				$scope.appData.defNext = changeDates.date_till;
				if (changeDates.date_load) {
					$scope.appData.date_load = changeDates.date_load;
				}
			}
			$scope.appData.datesTazrimEx = $scope.appData.defPrev + '-' + $scope.appData.defNext;

			serverConnection.getTazrimMeforat({
				company_id: $scope.appData.selectedCompany.companyId,
				date_from: $scope.appData.defPrev,
				date_till: $scope.appData.defNext
			}).then(function (response) {
				$scope.appData.bankTazrim = response.tazrim_mefort;
				if (response.tazrim_mefort !== null) {
					$scope.appData.bankTazrim = response.tazrim_mefort;
					$scope.appData.bankTazrim.forEach(function (v, index) {
						var getTypeName = $scope.getTypeName(v.trans_type_id);
						v.trans_type_name = (getTypeName !== "") ? getTypeName : "ללא קטגוריה";
					});
					if ($scope.appData.transIdRowAn) {
						$scope.gotoAnchor()
					}
					else {
						if (!$scope.appData.changeRow) {
							$(".scrollWrap").animate({
								scrollTop: 0
							}, "fast");
						}
						else {
							$scope.appData.changeRow = false;
						}

					}

				}
				else {
					$scope.loaderTazrim = true;
					$scope.showAlertNull = true;
				}
				$scope.filtersTazrim('firstload');

			});
		};
		$scope.showAddTransTypeDialog = function (t) {
			$scope.appData.newTransParentIndex = t;
			$scope.showPopup('views/templates/addTransactionTypeDialogTazrim.html?ver=3.80', 'addTransactionTypeDialog');
		};
		$scope.updateTransactionTypeName = function (t, item) {
			serverConnection.updateTransactionType({
				trans_id: t.trans_id,
				trans_name: t.trans_name,
				ind_bank: 1,
				trans_type_id: item.trans_type_id,
				oldpayment_type_id: null
			}).then(function (result) {
				$scope.appData.bankTazrim.forEach(function (v, index) {
					if (v.trans_id == t.trans_id) {
						v.trans_type_name = item.trans_type_name;
						v.trans_type_id = item.trans_type_id;
						v.listPeulot = false;
						v.openListThis = false;
						v.showInputSearch = false;
					}
				})
				$scope.appData.filterTazrim.forEach(function (v, index) {
					if (v.trans_id == t.trans_id) {
						v.trans_type_name = item.trans_type_name;
						v.trans_type_id = item.trans_type_id;
						v.listPeulot = false;
						v.openListThis = false;
						v.showInputSearch = false;
					}
				});
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
				transTypeName: $scope.appData.newTransactionName,
				indExpense: $scope.appData.newTransParentIndex.ind_expence
			}).then(function (result) {
				var t = {
					trans_id: $scope.appData.newTransParentIndex.trans_id,
					trans_name: $scope.appData.newTransParentIndex.trans_name
				}
				var item = {
					trans_type_name: $scope.appData.newTransactionName,
					trans_type_id: result
				}
				var listPush = {
					trans_type_name: $scope.appData.newTransactionName,
					trans_type_id: result,
					ind_expence: $scope.appData.newTransParentIndex.ind_expence
				}
				var data = {
					'trans_type_name': $scope.appData.newTransactionName,
					'trans_type_id': result,
					'peulaActive': true
				}
				$scope.appData.typePeulaRows.push(data);
				$scope.updateTransactionTypeName(t, item)

				var pushPeulot = {
					'trans_type_name': $scope.appData.newTransactionName,
					'trans_type_id': result
				}
				$scope.appData.transactionTypesReg.push(pushPeulot);


				// if ($scope.appData.newTransParentIndex.hachnasa && $scope.appData.newTransParentIndex.hachnasa !== null) {
				// 	$scope.appData.transactionTypesIN.push(pushPeulot)
				// }
				// if ($scope.appData.newTransParentIndex.hozaa && $scope.appData.newTransParentIndex.hozaa !== null) {
				// 	$scope.appData.transactionTypesEX.push(pushPeulot)
				// }

				$scope.hidePopup();
			}, function (error) {
			});
		};
		$scope.addNewTransTypeFromPopUp = function () {
			var ind_expence = 0;
			if ($scope.appData.radioType == 'hozaa') {
				ind_expence = 1;
			}
			serverConnection.addNewTransType({
				companyId: $scope.appData.selectedCompany.companyId,
				transTypeName: $scope.appData.addTypePeulaFromPopUp,
				indExpense: ind_expence
			}).then(function (result) {
				$scope.appData.addTypePeulaPopUpForm = false;
				var data = {
					'trans_type_name': $scope.appData.addTypePeulaFromPopUp,
					'trans_type_id': result,
					'peulaActive': true
				}
				$scope.appData.typePeulaRows.push(data);

				var pushPeulot = {
					'trans_type_name': $scope.appData.addTypePeulaFromPopUp,
					'trans_type_id': result
				}

				$scope.appData.transactionTypesReg.push(pushPeulot);

				// if ($scope.appData.radioType == 'hozaa') {
				// 	$scope.appData.transactionTypesEX.push(pushPeulot)
				// }
				// else {
				// 	$scope.appData.transactionTypesIN.push(pushPeulot)
				// }
			}, function (error) {
			});
		};
		$scope.openPeulotList = function (ind, openListThis, event) {
			event.stopPropagation();
			$scope.appData.filterTazrim.forEach(function (v, index) {
				if (v.trans_id == ind) {
					if (openListThis == true)
						v.listPeulot = true;
					else
						v.listPeulot = false;
				}
				else {
					v.listPeulot = false;
					v.openListThis = false;
					v.showInputSearch = false;
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

					$scope.appData.transactionTypesReg.forEach(function (v) {
						if (v.trans_type_id == item.trans_type_id) {
							v.trans_type_name = item.trans_type_name;
						}
					});

				}, function (error) {
				});
			}
		}
		$scope.deletedTypePeulaPop = function () {
			serverConnection.trans_type_delete_ksafim({
				companyId: $scope.appData.selectedCompany.companyId,
				transTypeId: $scope.appData.trans_type_delete_ksafimItem.item.trans_type_id
			}).then(function (result) {
				$scope.appData.typePeulaRows.forEach(function (v, i) {
					if (v.trans_type_id == $scope.appData.trans_type_delete_ksafimItem.item.trans_type_id) {
						$scope.appData.typePeulaRows.splice(i, 1);
					}
				})

				$scope.appData.transactionTypesReg.forEach(function (v, i) {
					if (v.trans_type_id == $scope.appData.trans_type_delete_ksafimItem.item.trans_type_id) {
						$scope.appData.transactionTypesReg.splice(i, 1);
					}
				});

				// if ($scope.appData.trans_type_delete_ksafimItem.type == 'transactionTypesEX') {
				// 	$scope.appData.transactionTypesEX.forEach(function (v, i) {
				// 		if (v.trans_type_id == $scope.appData.trans_type_delete_ksafimItem.item.trans_type_id) {
				// 			$scope.appData.transactionTypesEX.splice(i, 1);
				// 		}
				// 	})
				// }
				// if ($scope.appData.trans_type_delete_ksafimItem.type == 'transactionTypesIN') {
				// 	$scope.appData.transactionTypesIN.forEach(function (v, i) {
				// 		if (v.trans_type_id == $scope.appData.trans_type_delete_ksafimItem.item.trans_type_id) {
				// 			$scope.appData.transactionTypesIN.splice(i, 1);
				// 		}
				// 	})
				// }
				$scope.hidePopup();
			}, function (error) {
				$scope.hidePopup();
			});
		}
		$scope.trans_type_delete_ksafim = function (item, type) {
			$scope.appData.trans_type_delete_ksafimItem = {
				item: item,
				type: type
			};
			$scope.showPopup('views/templates/alertsDelTypePeula.html?ver=3.80', 'alerts', true);
		}
		$scope.selectDatesOnSubmit = function () {
			function daysInMonth(month, year) {
				return new Date(year, month, 0).getDate();
			}

			var fromDate, toDate;
			switch ($scope.appData.dateFilterTypesTzrim) {
				case "00":
					fromDate = $scope.appData.selectedItem.balance_last_update_date;
					toDate = $scope.addMonth($scope.appData.selectedItem.balance_last_update_date, 30)
					$scope.textTitlePage = '  ' + ' החודש הקרוב';
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
			var changeDates = {
				'date_from': fromDate,
				'date_till': toDate
			};

			$scope.appData.datesTazrimEx = fromDate + '-' + toDate;

			if ($scope.appData.selectedItem.company_account_id == 'null') {
				$scope.loadTazrimAllBanks(changeDates);
			}
			else {
				$scope.loadTazrimBank($scope.appData.selectedItem, changeDates);
			}
		};
		$scope.loadPrev = function () {
			var changeDates = {
				'date_load': 'before',
				'date_from': $scope.returnMonth($scope.appData.defPrev, 31),
				'date_till': $scope.returnMonth($scope.appData.defPrev, 1)
			};
			$scope.appData.defPrev = changeDates.date_from;
			if ($scope.appData.selectedItem.company_account_id == 'null') {
				$scope.loadTazrimAllBanks(changeDates);
			}
			else {
				$scope.loadTazrimBank($scope.appData.selectedItem, changeDates);
			}
		};
		$scope.loadMore = function () {
			var changeDates = {
				'date_load': 'after',
				'date_from': $scope.addMonth($scope.appData.defNext, 1),
				'date_till': $scope.addMonth($scope.appData.defNext, 31)
			};

			$scope.appData.defNext = changeDates.date_till;
			if ($scope.appData.selectedItem.company_account_id == 'null') {
				$scope.loadTazrimAllBanks(changeDates);
			}
			else {
				$scope.loadTazrimBank($scope.appData.selectedItem, changeDates);
			}
		};
		$scope.freeFilterTazrimArray = function (input, term) {
			if (!input || !term) {
				return input;
			}
			var obj = [], len = input.length;
			var letterMatch = new RegExp(term, 'i');

			for (var i = 0; i < len; i++) {
				if (letterMatch.test(input[i].day_id) || letterMatch.test(input[i].trans_name) || letterMatch.test(input[i].hachnasa) || letterMatch.test(input[i].hozaa) || letterMatch.test(input[i].asmachta) || letterMatch.test(input[i].itra) || letterMatch.test(input[i].searchkey_cat_name) || letterMatch.test(input[i].trans_type_name)) {
					obj.push(input[i]);
				}
			}

			return obj;
		}
		$scope.freeFilterTazrimPay = function (input, term) {
			if (!input || !term) {
				return input;
			}
			var filtered = [], len = input.length, lenTer = term.length;
			var data;
			for (var i = 0; i < len; i++) {
				data = input[i];
				for (var j = 0; j < lenTer; j++) {
					if (term[j].paymentActive == true) {
						if (data.serchkey_cat_id == term[j].serchkey_cat_id) {
							filtered.push(data);
						}
					}
				}
			}
			return filtered;
		}
		$scope.filtersTazrim = function (firstload) {
			if ($scope.appData.selectedCompany && $scope.appData.bankTazrim) {
				$scope.appData.filterTazrim = angular.copy($scope.appData.bankTazrim);
				$scope.appData.filterTazrim = $scope.freeFilterTazrimArray(angular.copy($scope.appData.bankTazrim), $scope.appData.freeSearch);

				if (firstload) {
					$scope.peulaTypes();
				}
				else {
					$scope.appData.filterTazrim = $filter('freeFilterTazrimPeula')($scope.appData.filterTazrim, $scope.appData.typePeulaRows);
				}

				if (firstload) {
					$scope.paymentTyps();
				}
				else {
					$scope.appData.filterTazrim = $filter('freeFilterTazrimPay')($scope.appData.filterTazrim, $scope.appData.typePay);
				}
				$scope.calcNigreret();
				$scope.loaderTazrim = true;
			}
		}
		$scope.paymentTyps = function () {
			var arr = $scope.appData.filterTazrim;
			var flags = [], output = [], l = arr.length, i;
			for (i = 0; i < l; i++) {
				if (flags[arr[i].serchkey_cat_id]) continue;
				flags[arr[i].serchkey_cat_id] = true;
				output.push({
					'searchkey_cat_name': arr[i].searchkey_cat_name,
					'serchkey_cat_id': arr[i].serchkey_cat_id,
					'paymentActive': true
				});
			}
			$scope.appData.typePay = output;
		};
		$scope.peulaTypes = function () {
			var arr = $scope.appData.filterTazrim;
			var flags = [], output = [], l = arr.length, i;
			for (i = 0; i < l; i++) {
				if (flags[arr[i].trans_type_id]) continue;
				flags[arr[i].trans_type_id] = true;
				output.push({
					'trans_type_name': arr[i].trans_type_name,
					'trans_type_id': arr[i].trans_type_id,
					'peulaActive': true
				});
			}
			$scope.appData.typePeulaRows = output;
		};
		$scope.sortAddRowsSum = function (arr) {
			var arrSort = [], lenArr = arr.length;
			for (var i = 0; i < lenArr; i++) {
				if (arr[i].target_type_id == 18) {
					arrSort.push(arr[i])
				}
				if (lenArr !== i + 1) {
					if (arr[i].target_type_id == 18 && arr[i + 1].target_type_id !== 18) {
						var data = {
							showRowPast: true
						}

						arrSort.push(data);
					}
				}
				if (lenArr == i + 1 && arr[i].target_type_id == 18) {
					var data = {
						showRowPast: true
					}

					arrSort.push(data);
				}
				if (arr[i].ind_nigreret == true && arr[i].target_type_id !== 18) {
					arrSort.push(arr[i])
				}
				if (lenArr !== i + 1) {
					if (arr[i].ind_nigreret == true && arr[i].target_type_id !== 18 && arr[i + 1].ind_nigreret == false) {
						var data = {
							showRowSumNig: true
						}
						arrSort.push(data);
					}
				}
				if (lenArr == i + 1 && arr[i].ind_nigreret == true && arr[i].target_type_id !== 18) {
					var data = {
						showRowSumNig: true
					}
					arrSort.push(data);
				}
				if (arr[i].ind_nigreret == false && arr[i].target_type_id !== 18) {
					arrSort.push(arr[i])
				}
			}
			$scope.appData.filterTazrim = arrSort;

		}
		$scope.calcNigreret = function () {
			var sum = $scope.appData.filterTazrim.reduce(function (sum, value) {
				if (value.ind_nigreret == true) {
					if (value.hachnasa !== null) {
						sum = sum + value.hachnasa;
					} else {
						sum = sum + value.hozaa;
					}
				}
				return sum
			}, 0);
			$scope.calcSum = sum;
			$scope.appData.filterTazrimcalcSum = sum;

			var hac = 0, hoz = 0;
			$scope.appData.filterTazrim.reduce(function (sum, val) {
				if (val.hachnasa) {
					hac = hac + val.hachnasa;

				}
				if (val.hozaa) {
					hoz = hoz + val.hozaa;

				}
			}, 0);
			$scope.hacAll = hac;
			$scope.hozAll = hoz;
			$scope.appData.filterTazrimhacAll = hac;
			$scope.appData.filterTazrimhozAll = hoz;

			var arr = [], len = $scope.appData.filterTazrim.length;
			for (var i = 0; i < len; i++) {
				if ($scope.appData.filterTazrim[i].target_type_id == 18) {
					arr.push($scope.appData.filterTazrim[i])
				}

				if ($scope.appData.filterTazrim[i].ind_nigreret == true && $scope.appData.filterTazrim[i].target_type_id !== 18) {
					arr.push($scope.appData.filterTazrim[i])
				}

				if ($scope.appData.filterTazrim[i].ind_nigreret == false && $scope.appData.filterTazrim[i].target_type_id !== 18) {
					arr.push($scope.appData.filterTazrim[i])
				}
			}
			$scope.sortAddRowsSum(arr);

		};
		$scope.activeAll = function (a) {
			if (a.classActive == false) {
				$scope.appData.filterTazrim.forEach(function (v) {
					if (a.trans_id == v.trans_id) {
						v.classActive = true;
					}
					else {
						v.classActive = false;
					}
				});
			} else {
				$scope.appData.filterTazrim.forEach(function (v) {
					if (a.trans_id == v.trans_id) {
						v.classActive = false;
					}
				});
			}
		};
		$scope.activeAllRow = function (a) {
			if (a.classActive == false) {
				$scope.appData.filterTazrim.forEach(function (v) {
					if ((a.trans_id + '' + a.day_id) == (v.trans_id + '' + v.day_id)) {
						v.classActive = true;
					}
					else {
						v.classActive = false;
					}
				});
			} else {
				$scope.appData.filterTazrim.forEach(function (v) {
					if ((a.trans_id + '' + a.day_id) == (v.trans_id + '' + v.day_id)) {
						v.classActive = false;
					}
				});
			}
		};
		$scope.asmachtaCheck = function (data) {
			if (data == 'none') {
				return '';
			}
		}
		$scope.convertDateInput = function (date) {
			return date.toString().split('/')[2] + '-' + date.toString().split('/')[1] + '-' + date.toString().split('/')[0];
		}
		$scope.unConvertDateInput = function (date) {
			return date.toString().split('-')[2] + '/' + date.toString().split('-')[1] + '/' + date.toString().split('-')[0];
		}
		$scope.asmachtaEmpty = function (a) {
			if (a.asmachta == "none") {
				a.asmachta = '';
			}
		};
		$scope.paymentTypsConfig = function (a) {
			if (a.serchkey_cat_id == 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f') {
				a.paymentTypsConfigAll = [
					{
						'searchkey_cat_name': a.searchkey_cat_name, 'serchkey_cat_id': a.serchkey_cat_id
					},
					{
						'searchkey_cat_name': 'שיק', 'serchkey_cat_id': '2802e927-1ec7-462a-9f9c-2580f939cc71'
					},
					{
						'searchkey_cat_name': 'העברה בנקאית', 'serchkey_cat_id': 'bae4449d-c934-4ea0-abf6-762f25a35c3d'
					}
					//    , {
					//    'searchkey_cat_name': 'מזומן', 'serchkey_cat_id': '7ecd2776-7fa2-4f28-95ed-08b13430ebf7'
					//}
				];
				a.selectedItemPayMent = a.paymentTypsConfigAll[0];
			}
			if (a.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71') {
				a.paymentTypsConfigAll = [
					{
						'searchkey_cat_name': a.searchkey_cat_name, 'serchkey_cat_id': a.serchkey_cat_id
					}, {
						'searchkey_cat_name': 'צפי', 'serchkey_cat_id': 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f'
					}, {
						'searchkey_cat_name': 'העברה בנקאית', 'serchkey_cat_id': 'bae4449d-c934-4ea0-abf6-762f25a35c3d'
					}
					//    , {
					//    'searchkey_cat_name': 'מזומן', 'serchkey_cat_id': '7ecd2776-7fa2-4f28-95ed-08b13430ebf7'
					//}
				];
				a.selectedItemPayMent = a.paymentTypsConfigAll[0];
			}
			if (a.serchkey_cat_id == 'bae4449d-c934-4ea0-abf6-762f25a35c3d') {
				a.paymentTypsConfigAll = [
					{
						'searchkey_cat_name': a.searchkey_cat_name, 'serchkey_cat_id': a.serchkey_cat_id
					}, {
						'searchkey_cat_name': 'שיק', 'serchkey_cat_id': '2802e927-1ec7-462a-9f9c-2580f939cc71'
					}, {
						'searchkey_cat_name': 'צפי', 'serchkey_cat_id': 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f'
					}
					//    , {
					//    'searchkey_cat_name': 'מזומן', 'serchkey_cat_id': '7ecd2776-7fa2-4f28-95ed-08b13430ebf7'
					//}
				];
				a.selectedItemPayMent = a.paymentTypsConfigAll[0];
			}
			if (a.serchkey_cat_id == '7ecd2776-7fa2-4f28-95ed-08b13430ebf7') {
				a.paymentTypsConfigAll = [{
					'searchkey_cat_name': a.searchkey_cat_name, 'serchkey_cat_id': a.serchkey_cat_id
				}, {
					'searchkey_cat_name': 'שיק', 'serchkey_cat_id': '2802e927-1ec7-462a-9f9c-2580f939cc71'
				}, {
					'searchkey_cat_name': 'צפי', 'serchkey_cat_id': 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f'
				}
					, {
						'searchkey_cat_name': 'העברה בנקאית', 'serchkey_cat_id': 'bae4449d-c934-4ea0-abf6-762f25a35c3d'
					}
				];
				a.selectedItemPayMent = a.paymentTypsConfigAll[0];
			}
		};
		$scope.updateRowServer = function (data) {
			var def = $q.defer();
			serverConnection.updateTazrimRowSer(data).then(function (response) {
				def.resolve(response);
			}, function (error) {
				def.reject(error)
			});
			return def.promise;
		};
		$scope.updateRowZefiServer = function (urls, data) {
			var def = $q.defer();
			serverConnection.updateTazrimRowZefi(urls, data).then(function (response) {
				def.resolve(response);
			}, function (error) {
				def.reject(error)
			});
			return def.promise;
		};
		$scope.deleteRowServer = function (data) {
			var def = $q.defer();
			serverConnection.deleteTazrimRow(data).then(function (response) {
				def.resolve(response);
			}, function (error) {
				def.reject(error)
			});
			return def.promise;
		};
		$scope.toggleAllTransactionTypes = function () {
			var lenA = $scope.appData.transactionTypes.length;

			if ($scope.transactionTypeFilterAll) {
				for (var i = 0; i < lenA; i++)
					$scope.transactionTypeFilter[$scope.appData.transactionTypes[i].trans_type_id] = true;
			}
			else {
				for (var i = 0; i < lenA; i++)
					$scope.transactionTypeFilter[$scope.appData.transactionTypes[i].trans_type_id] = false;
			}
			$scope.filtersTazrim()

		};
		$scope.clickSortTypes = function () {


			//$scope.selectedTransactionsTypes = '';
			//var all = true;
			//for (var i = 0; i < $scope.appData.transactionTypes.length; i++) {
			//    if ($scope.transactionTypeFilter[$scope.appData.transactionTypes[i].trans_type_id]) {
			//        $scope.selectedTransactionsTypes = $scope.selectedTransactionsTypes + $scope.appData.transactionTypes[i].trans_type_name + ', ';
			//    }
			//    else
			//        all = false;
			//}
			//if (all) {
			//    $scope.selectedTransactionsTypes = '';
			//    $scope.transactionTypeFilterAll = true;
			//}
			//else {
			//    $scope.selectedTransactionsTypes = $scope.selectedTransactionsTypes.substring(0, $scope.selectedTransactionsTypes.length - 2);
			//    $scope.transactionTypeFilterAll = false;
			//}
			//
			//$scope.filtersTazrim()


		}
		$scope.updateRow = function (a, removeRow) {
			$scope.appData.changeRow = a.changeRef;
			var changePayVal;
			if (a.changePayVal) {
				changePayVal = a.changePayVal;
			}
			else {
				changePayVal = null;
			}
			if (a.asmachta == '') {
				a.asmachta = null;
			}
			if (a.serchkey_cat_id == 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f' || a.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71' || a.serchkey_cat_id == 'bae4449d-c934-4ea0-abf6-762f25a35c3d' || a.serchkey_cat_id == '7ecd2776-7fa2-4f28-95ed-08b13430ebf7') {
				if (a.selectedItemPayMent) {
					if (a.selectedItemPayMent.serchkey_cat_id == 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f') {
						a.payment_type_id = 10;
					}
					if (a.selectedItemPayMent.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71') {
						a.payment_type_id = 1;
					}
					if (a.selectedItemPayMent.serchkey_cat_id == 'bae4449d-c934-4ea0-abf6-762f25a35c3d') {
						a.payment_type_id = 9;
					}
					if (a.selectedItemPayMent.serchkey_cat_id == '7ecd2776-7fa2-4f28-95ed-08b13430ebf7') {
						a.payment_type_id = 2;
					}
				}
				else {
					if (a.serchkey_cat_id == 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f') {
						a.payment_type_id = 10;
					}
					if (a.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71') {
						a.payment_type_id = 1;
					}
					if (a.serchkey_cat_id == 'bae4449d-c934-4ea0-abf6-762f25a35c3d') {
						a.payment_type_id = 9;
					}
					if (a.serchkey_cat_id == '7ecd2776-7fa2-4f28-95ed-08b13430ebf7') {
						a.payment_type_id = 2;
					}
				}
			}
			if (a.hozaa) {
				if (a.trans_type_name == null) {
					a.trans_type_id = "f605bc82-2921-4548-b09b-937c7baa1c2a"
				}
				var data = {
					"sign_type": a.sign_type,
					"day_id": a.day_id,
					"ind_nigreret": a.ind_nigreret,
					"payment_type_id": a.payment_type_id,
					"company_account_id": a.company_account_id,
					"asmachta": a.asmachta,
					"trans_id": a.trans_id,
					"trans_name": a.trans_name.replace(/&quot;/g, "\"").replace(/"/g, "\"").replace(/&rlm;/g, "").replace(/״/g, "\""),
					"hozaa": Math.abs(a.hozaa),
					"itra": a.itra,
					"itracolor": a.itracolor,
					"union_itra": a.union_itra,
					"ind_zefi": a.ind_zefi,
					"ind_bank": a.ind_bank,
					"trans_type_id": a.trans_type_id,
					"tkufa_date_from": a.tkufa_date_from,
					"tkufa_date_till": a.tkufa_date_till,
					"oldpayment_type_id": changePayVal
				}
			}
			else {
				if (a.trans_type_name == null) {
					a.trans_type_id = "7b94ad34-2bc1-4f4a-b905-a9f582a06179"
				}
				var data = {
					"sign_type": a.sign_type,
					"day_id": a.day_id,
					"ind_nigreret": a.ind_nigreret,
					"payment_type_id": a.payment_type_id,
					"company_account_id": a.company_account_id,
					"asmachta": a.asmachta,
					"trans_id": a.trans_id,
					"trans_name": a.trans_name.replace(/&quot;/g, "\"").replace(/"/g, "\"").replace(/&rlm;/g, "").replace(/״/g, "\""),
					"hachnasa": a.hachnasa,
					"itra": a.itra,
					"itracolor": a.itracolor,
					"union_itra": a.union_itra,
					"ind_zefi": a.ind_zefi,
					"ind_bank": a.ind_bank,
					"trans_type_id": a.trans_type_id,
					"tkufa_date_from": a.tkufa_date_from,
					"tkufa_date_till": a.tkufa_date_till,
					"oldpayment_type_id": changePayVal
				}
			}
			if (removeRow) {
				$scope.deleteRowServer(JSON.stringify(data)).then(function (suc) {
					$scope.appData.changeRow = true;
					$scope.changeItem($scope.appData.selectedItem);
					a.changePayVal = false;
				}, function (error) {
					console.log(error)
					$scope.showPopup('views/templates/tazrimError.html?ver=3.80', 'popAlert', true);
					setTimeout(function () {
						$scope.hidePopup();
					}, 2000)
				});
			}
			else {
				$scope.updateRowServer(JSON.stringify(data)).then(function (suc) {
					if ($scope.appData.changeRow == true) {
						$scope.appData.openDialog = true;
						$scope.appData.alertSucUpd = true;
						$scope.appData.alertSucAdd = false;
						$scope.changeItem($scope.appData.selectedItem)
					}
					a.changePayVal = false;
				}, function (error) {
					console.log(error)
					$scope.showPopup('views/templates/tazrimError.html?ver=3.80', 'popAlert', true);
					setTimeout(function () {
						$scope.hidePopup();
					}, 2000)
				});
			}
		};
		$scope.updateRowZefi = function (a) {
			$scope.appData.changeRow = a.changeRef;
			var target_type_id = a.target_type_id;
			if (target_type_id == 21) {
				var urls = 'cardtazrim_update_zefi';
				if (a.hozaa) {
					var data = {"ccardTazrimId": a.trans_id, "zefi": Math.abs(parseFloat(a.hozaa))};
				}
				else {
					var data = {"ccardTazrimId": a.trans_id, "zefi": Math.abs(parseFloat(a.hachnasa))};
				}
			}

			if (target_type_id == 22) {
				var urls = 'solektazrim_update_zefi';
				if (a.hozaa) {
					var data = {"solekTazrimId": a.trans_id, "zefi": Math.abs(parseFloat(a.hozaa))};
				}
				else {
					var data = {"solekTazrimId": a.trans_id, "zefi": Math.abs(parseFloat(a.hachnasa))};
				}
			}
			$scope.updateRowZefiServer(urls, data).then(function (data) {
				if ($scope.appData.changeRow == true) {
					$scope.appData.openDialog = true;
					$scope.appData.alertSucUpd = true;
					$scope.appData.alertSucAdd = false;
					$scope.changeItem($scope.appData.selectedItem)
				}
			}, function (error) {
				$scope.showPopup('views/templates/tazrimError.html?ver=3.80', 'popAlert', true);
				setTimeout(function () {
					$scope.hidePopup();
				}, 2000)
			})
		};
		$scope.toggleEdit = function (a) {
			a.custom = a.custom === false ? true : false;
			var target_type_id = a.target_type_id;
			if (a.custom == false) {
				a.copy = $scope.copy(a);
				if (a.hozaa !== undefined && a.hozaa !== null && a.hozaa !== '') {
					$scope.totalPrevDelete = a.hozaa;
				}
				if (a.hachnasa !== undefined && a.hachnasa !== null && a.hachnasa !== '') {
					$scope.totalPrevDelete = a.hachnasa;
				}
				if (a.asmachta == '0') {
					a.asmachta = '';
				}
				$scope.cancelRowAll(a);
				a.cancelEdit = true;
				if (target_type_id == 18) {
					a.asmachtaDisabled = true;
					a.date = true;
					a.companyAccount = true;
					a.payMent = true;
					a.sumEdit = true;
					a.itraSum = true;
					if (a.serchkey_cat_id == 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f' || a.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71' || a.serchkey_cat_id == 'bae4449d-c934-4ea0-abf6-762f25a35c3d' || a.serchkey_cat_id == '7ecd2776-7fa2-4f28-95ed-08b13430ebf7') {
						a.payMent = false;
					}
					a.transName = false;
					a.changePeula = false;
				}
				if (target_type_id == 11) {
					//if (a.serchkey_cat_id == 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f' || a.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71' || a.serchkey_cat_id == 'bae4449d-c934-4ea0-abf6-762f25a35c3d' || a.serchkey_cat_id == '7ecd2776-7fa2-4f28-95ed-08b13430ebf7') {
					//    a.payMent = false;
					//}
					a.payMent = true;
					a.asmachtaDisabled = false;
					a.date = false;
					a.transName = true;
					a.sumEdit = false;
					a.itraSum = true;
					a.companyAccount = true;
					a.changePeula = true;
				}
				if ((target_type_id !== 21) && (target_type_id !== 22) && (target_type_id !== 23) && (target_type_id !== 18) && (target_type_id !== 11)) {
					if (a.serchkey_cat_id == 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f' || a.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71' || a.serchkey_cat_id == 'bae4449d-c934-4ea0-abf6-762f25a35c3d' || a.serchkey_cat_id == '7ecd2776-7fa2-4f28-95ed-08b13430ebf7') {
						a.payMent = false;
					}
					a.asmachtaDisabled = false;
					a.date = false;
					a.transName = false;
					a.sumEdit = false;
					a.itraSum = true;
					var sign_type = a.sign_type;
					if ((sign_type == 1) || (sign_type == 11)) {
						a.companyAccount = true;
					}
					else {
						a.companyAccount = false;
					}
					a.changePeula = false;
				}
				if (target_type_id == 21 || target_type_id == 22) {
					if (a.ind_zefi == 0) {
						a.asmachtaDisabled = true;
						a.date = true;
						a.companyAccount = true;
						a.payMent = true;
						a.transName = true;
						a.itraSum = true;
						if (a.serchkey_cat_id == 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f' || a.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71' || a.serchkey_cat_id == 'bae4449d-c934-4ea0-abf6-762f25a35c3d' || a.serchkey_cat_id == '7ecd2776-7fa2-4f28-95ed-08b13430ebf7') {
							a.payMent = false;
						}
						a.sumEdit = false;
						a.changePeula = true;
					}
				}
				if (target_type_id !== 18) {
					if (a.payment_type_id == 21) {
						a.changePeula = true;
					}
				}
			}
			else {
				$scope.appData.emptyInputsTazrim = '';
				var errors = 0;
				var sumTotal;
				if (a.hozaa !== undefined && a.hozaa !== null) {
					sumTotal = a.hozaa;
				}
				if (a.hachnasa !== undefined && a.hachnasa !== null) {
					sumTotal = a.hachnasa;
				}
				if ((target_type_id == 21 || target_type_id == 22) && parseFloat(sumTotal) < parseFloat($scope.totalPrevDelete)) {
					if (a.hozaa !== undefined && a.hozaa !== null) {
						a.hozaa = $scope.totalPrevDelete;
					}
					if (a.hachnasa !== undefined && a.hachnasa !== null) {
						a.hachnasa = $scope.totalPrevDelete;
					}
					errors = errors + 1;
					$scope.appData.emptyInputsTazrim += 'לא ניתן לעדכן סכום נמוך ממה שהתקבל מהבנק/חברת האשראי' + '.<br>';
				}
				if (a.selectedItemPayMent) {
					if (((a.paymentTypsConfigAll && a.selectedItemPayMent.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71') || (!a.paymentTypsConfigAll && a.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71')) && a.target_type_id !== 18 && a.asmachta && (a.asmachta.length > 0 && a.asmachta.length < 4)) {
						errors = errors + 1;
						$scope.appData.emptyInputsTazrim += 'אסמכתא חייבת להיות לפחות 4 תווים' + '.<br>';
					}
				}
				else {
					if (((!a.paymentTypsConfigAll && a.serchkey_cat_id == '2802e927-1ec7-462a-9f9c-2580f939cc71')) && a.target_type_id !== 18 && a.asmachta && (a.asmachta.length > 0 && a.asmachta.length < 4)) {
						errors = errors + 1;
						$scope.appData.emptyInputsTazrim += 'אסמכתא חייבת להיות לפחות 4 תווים' + '.<br>';
					}
				}

				if ((a.hozaa !== undefined && a.hozaa !== null && a.hozaa == '') || (a.hachnasa !== undefined && a.hachnasa !== null && a.hachnasa == '')) {
					errors = errors + 1;
					$scope.appData.emptyInputsTazrim += 'יש להשלים את שדה הסכום' + '.<br>';
				}

				if (errors !== 0) {
					a.custom = true;
					$scope.showPopup('views/templates/emptyInputsTazrim.html?ver=3.80', 'popAlert', true);
					setTimeout(function () {
						$scope.hidePopup();
					}, 2000)
				}
				else {
					a.cancelEdit = false;
					a.asmachtaDisabled = true;
					a.date = true;
					a.companyAccount = true;
					a.payMent = true;
					a.transName = true;
					a.sumEdit = true;
					a.itraSum = true;
					a.changePeula = true;
					if (target_type_id == 21 || target_type_id == 22) {
						$scope.updateRowZefi(a)
					}
					else {
						$scope.updateRow(a)
					}
				}
			}
		};
		$scope.changeDate = function (a) {
			if (a.cancelEdit == false) {
				var target_type_id = a.target_type_id;
				if (target_type_id == 21 || target_type_id == 22) {
					$scope.updateRowZefi(a)
				}
				else {
					$scope.updateRow(a)
				}
			}
		};
		$scope.cancelRowAll = function (row) {
			var row = row;
			$scope.appData.filterTazrim.forEach(function (a) {
				if (a.trans_id !== row.trans_id) {
					a.custom = true;
					a.cancelEdit = false;
					a.asmachtaDisabled = true;
					a.date = true;
					a.companyAccount = true;
					a.payMent = true;
					a.transName = true;
					a.sumEdit = true;
					a.itraSum = true;
					a.changePeula = true;
				}
				else {
					a.custom = false;
				}
			});
		};
		$scope.cancelRow = function (a) {
			if (a.hozaa !== undefined && a.hozaa !== null && a.hozaa == '') {
				a.hozaa = $scope.totalPrevDelete;
			}
			if (a.hachnasa !== undefined && a.hachnasa !== null && a.hachnasa == '') {
				a.hachnasa = $scope.totalPrevDelete;
			}
			$scope.custom = true;
			a.custom = true;
			a.cancelEdit = false;
			a.asmachtaDisabled = true;
			a.date = true;
			a.companyAccount = true;
			a.payMent = true;
			a.transName = true;
			a.sumEdit = true;
			a.itraSum = true;
			a.changePeula = true;

			a.trans_type_name = a.copy.trans_type_name;
			a.trans_id = a.copy.trans_id;
			a.day_id = a.copy.day_id;
			a.original_date = a.copy.original_date;
			a.company_account_id = a.copy.company_account_id;
			a.serchkey_cat_id = a.copy.serchkey_cat_id;
			a.selectedItemPayMent = a.copy.selectedItemPayMent;
			a.searchkey_cat_name = a.copy.searchkey_cat_name;
			a.asmachta = a.copy.asmachta;
			a.trans_name = a.copy.trans_name;
			a.hachnasa = a.copy.hachnasa;
			a.hozaa = a.copy.hozaa;
			a.union_itra = a.copy.union_itra;

			a.copy = undefined;
		};
		$scope.deleted = function () {
			$scope.updateRow($scope.appData.dataRowTazrimDeleted, 'removeRow');
			$scope.hidePopup();
		};
		$scope.deleteRow = function (a, removeRow) {
			if (a.hozaa !== undefined && a.hozaa !== null && a.hozaa == '') {
				a.hozaa = $scope.totalPrevDelete;
			}
			if (a.hachnasa !== undefined && a.hachnasa !== null && a.hachnasa == '') {
				a.hachnasa = $scope.totalPrevDelete;
			}
			$scope.appData.dataRowTazrimDeleted = a;
			$scope.showPopup('views/templates/alertsPrevDeleted.html?ver=3.80', 'alerts', true);
			//$scope.appData.bankTazrim.forEach(function (v) {
			//    v.rows.forEach(function (a) {
			//        if ($scope.typeRow == 'hozaa') {
			//            for (var i = a.total_hozaot.peoulot.length - 1; i >= 0; i--) {
			//                if (a.total_hozaot.peoulot[i].trans_id == $scope.rowEdit.trans_id) {
			//                    a.total_hozaot.peoulot.splice(i, 1);
			//                }
			//            }
			//        }
			//        else {
			//            a.total_hacnasot.peoulot.splice(a.total_hacnasot.peoulot.indexOf($scope.rowEdit.trans_id), 1);
			//            for (var i = a.total_hacnasot.peoulot.length - 1; i >= 0; i--) {
			//                if (a.total_hacnasot.peoulot[i].trans_id == $scope.rowEdit.trans_id) {
			//                    a.total_hacnasot.peoulot.splice(i, 1);
			//                }
			//            }
			//        }
			//    })
			//})
		};
		$scope.addRowTazrimSend = function (type) {
			$scope.clickGa('מסך תזרים הוספת ' + type);
			var date_def = new Date();
			var month = date_def.getMonth() + 1
			var day = date_def.getDate();
			if (day.toString().length == 1) {
				var day = '0' + day;
			}
			else {
				var day = day;
			}
			if (month.toString().length == 1) {
				var month = '0' + month;
			}
			else {
				var month = month;
			}

			$scope.paymentTypeSelect = [
				{
					'serchkeyId': 'adc85ff7-1578-4893-8a9a-9001f5f6bc5f',
					'paymentTypeName': 'צפי',
					'paymentType': 10
				},
				{
					'serchkeyId': '2802e927-1ec7-462a-9f9c-2580f939cc71',
					'paymentTypeName': 'שיק',
					'paymentType': 1
				},
				{
					'serchkeyId': 'bae4449d-c934-4ea0-abf6-762f25a35c3d',
					'paymentTypeName': 'העברה בנקאית',
					'paymentType': 9
				}
				//{
				//    'serchkeyId': '7ecd2776-7fa2-4f28-95ed-08b13430ebf7',
				//    'paymentTypeName': 'מזומן',
				//    'paymentType': 2
				//}
			];

			if (type == 'hozaa') {
				var trans_type_id = 'f605bc82-2921-4548-b09b-937c7baa1c2a';
				var hachnasa = null;
				var hozaa;
				$scope.appData.typesAdd = 'הוצאה';
				$scope.appData.radioType = 'hozaa';
			}
			else {
				var trans_type_id = '7b94ad34-2bc1-4f4a-b905-a9f582a06179';
				var hachnasa;
				var hozaa = null;
				$scope.appData.typesAdd = 'הכנסה';
				$scope.appData.radioType = 'hachnasa';
			}
			$scope.appData.errorAsma = '';
			$scope.appData.dataAddRow = {
				"type": type,
				"day_id": day + '/' + month + '/' + date_def.getFullYear(),
				"payment_type_id": '',
				"company_account_id": '',
				"asmachta": '',
				"trans_type_id": trans_type_id,
				"trans_name": '',
				"hachnasa": hachnasa,
				"hozaa": hozaa,
				"arrListChecks": [{
					"day_id": day + '/' + month + '/' + date_def.getFullYear(),
					"asmachta": '',
					"hozaa": '',
					"hachnasa": '',
					"trans_name": '',
					"trans_type_id": '',
					"trans_type_name": ''
				}],
				"sum": '',
				"paymentTypeSelect": [
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
					//
					//,
					//{
					//    'serchkeyId': '7ecd2776-7fa2-4f28-95ed-08b13430ebf7',
					//    'paymentTypeName': 'מזומן',
					//    'paymentType': 2
					//}
				]
			}


			$scope.appData.selectTypeAddTazrim = $scope.appData.dataAddRow.paymentTypeSelect[0];


			var date = $scope.appData.dataAddRow.day_id.split('/')[2] + '' + $scope.appData.dataAddRow.day_id.split('/')[1];
			$scope.appData.datePickerDefDate = date;

			if ($scope.appData.selectAccAddTazrim !== "null") {
				$scope.initDateDef(date)
			}
			$scope.showPopup('views/templates/popupAddRowTazrim.html?ver=3.80', 'popupAddRowTazrim');
		};
		$scope.initDateDef = function (date) {
			if ($scope.appData.selectAccAddTazrim !== "null") {
				serverConnection.loadgetDateSuggCalendar($scope.appData.selectAccAddTazrim, date).then(function (response) {
					$scope.appData.dataHmlaza = response.data;
					$scope.appData.dataAddRow.day_id = response.default_date_value;
					$scope.dateSetHamlaza();
				}, function (error) {

				});
			}
		};
		$scope.keyUpAsmachta = function (valAsmachta, $index) {
			if (valAsmachta.toString().length > 3) {
				var data = {
					companyAccId: $scope.appData.selectAccAddTazrim,
					checqueNo: valAsmachta
				}
				$scope.appData.dataAddRow.arrListChecks[$index].textErrorAsmachta = "";
				$scope.appData.dataAddRow.arrListChecks[$index].redColorBorderAsmacExist = false;
				serverConnection.get_existing_cheque(data).then(function (response) {
					if (response.length) {
						$scope.appData.dataAddRow.arrListChecks[$index].textErrorAsmachta = "שיק בעל אסמכתא זו הוזן ל " + response[0].PAYMENT_DESC + " בסכום של " + response[0].TOTAL + " לתאריך " + response[0].DUE_DATE;
						$scope.appData.dataAddRow.arrListChecks[$index].redColorBorderAsmacExist = false;
					}
					else {
						var ind;
						$scope.appData.dataAddRow.arrListChecks.forEach(function (v, i) {
							if (v.asmachta.toString().length > 3 && valAsmachta.toString().length > 3 && (v.asmachta.toString() == valAsmachta.toString()) && $scope.appData.dataAddRow.arrListChecks.length > 1 && ($index !== i)) {
								if (ind == undefined) {
									ind = i + 1;
								}
								$scope.appData.dataAddRow.arrListChecks[$index].textErrorAsmachta = "אסמכתא זו כבר הוזנה בשורה" + " " + ind;
								$scope.appData.dataAddRow.arrListChecks[$index].redColorBorderAsmacExist = true;
							}
						});
					}
				}, function (error) {
					var ind;
					$scope.appData.dataAddRow.arrListChecks.forEach(function (v, i) {
						if (v.asmachta.toString().length > 3 && valAsmachta.toString().length > 3 && (v.asmachta.toString() == valAsmachta.toString()) && $scope.appData.dataAddRow.arrListChecks.length > 1 && ($index !== i)) {
							if (ind == undefined) {
								ind = i + 1;
							}
							$scope.appData.dataAddRow.arrListChecks[$index].textErrorAsmachta = "אסמכתא זו כבר הוזנה בשורה" + " " + ind;
							$scope.appData.dataAddRow.arrListChecks[$index].redColorBorderAsmacExist = true;
						}
					});
				});
			}
		}
		$scope.addCheck = function ($event) {
			if ($event) {
				if ($event.which !== 13) {
					return false
				}
			}
			var length = $scope.appData.dataAddRow.arrListChecks.length - 1;
			var day = $scope.addMonthOne($scope.appData.dataAddRow.arrListChecks[length].day_id)

			if ($scope.appData.dataAddRow.arrListChecks[length].asmachta) {
				var asmachta = parseFloat($scope.appData.dataAddRow.arrListChecks[length].asmachta) + 1;
			}
			else {
				var asmachta = '';
			}
			if ($scope.appData.dataAddRow.arrListChecks[length].trans_name) {
				var trans_name = $scope.appData.dataAddRow.arrListChecks[length].trans_name;
			}
			else {
				var trans_name = '';
			}
			var data;
			if ($scope.appData.radioType == 'hozaa') {
				if ($scope.appData.dataAddRow.arrListChecks[length].hozaa) {
					var hozaa = $scope.appData.dataAddRow.arrListChecks[length].hozaa;
				}
				else {
					var hozaa = '';
				}
				data = {
					"day_id": day,
					"asmachta": asmachta,
					"hozaa": hozaa,
					"trans_name": trans_name,
					"trans_type_id": $scope.appData.dataAddRow.arrListChecks[length].trans_type_id,
					"trans_type_name": $scope.appData.dataAddRow.arrListChecks[length].trans_type_name
				}
			}
			else {
				if ($scope.appData.dataAddRow.arrListChecks[length].hachnasa) {
					var hachnasa = $scope.appData.dataAddRow.arrListChecks[length].hachnasa;
				}
				else {
					var hachnasa = '';
				}
				data = {
					"day_id": day,
					"asmachta": asmachta,
					"hachnasa": hachnasa,
					"trans_name": trans_name,
					"trans_type_id": $scope.appData.dataAddRow.arrListChecks[length].trans_type_id,
					"trans_type_name": $scope.appData.dataAddRow.arrListChecks[length].trans_type_name
				}
			}
			$scope.appData.dataAddRow.arrListChecks.push(data);
			$scope.keyUpAsmachta(data.asmachta, $scope.appData.dataAddRow.arrListChecks.length - 1);
		}
		$scope.addCheckNew = function () {
			var asmachta = '';
			var trans_name = '';
			var length = $scope.appData.dataAddRow.arrListChecks.length - 1;
			var day = $scope.appData.dataAddRow.arrListChecks[length].day_id;
			var data;
			if ($scope.appData.radioType == 'hozaa') {
				var hozaa = '';
				data = {
					"day_id": day,
					"asmachta": asmachta,
					"hozaa": hozaa,
					"trans_name": trans_name,
					"trans_type_id": '',
					"trans_type_name": ''
				}
			}
			else {
				var hachnasa = '';
				data = {
					"day_id": day,
					"asmachta": asmachta,
					"hachnasa": hachnasa,
					"trans_name": trans_name,
					"trans_type_id": '',
					"trans_type_name": ''
				}
			}

			$scope.appData.dataAddRow.arrListChecks.push(data)
		}
		$scope.removeCheck = function (num) {
			$scope.appData.dataAddRow.arrListChecks.splice(num, 1);
		}
		$scope.disabledDates = function () {
			function shortDates(dates) {
				return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
			}

			$scope.appData.redErrorFilterType = false;
			if ($scope.appData.dateFilterTypesTzrim == '1' && shortDates($scope.appData.datesPicker.fromDatePicker) > shortDates($scope.appData.datesPicker.toDatePicker)) {
				$scope.appData.redErrorFilterType = '1';
			}
			else if ($scope.appData.dateFilterTypesTzrim == '2' && shortDates('01/' + ("0" + (parseInt($scope.appData.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.appData.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.appData.dateFilter.toYear)) {
				$scope.appData.redErrorFilterType = '2';
			}
			else {
				$scope.appData.redErrorFilterType = false;
			}
		}
		$scope.dateSetHamlaza = function () {
			$scope.appData.dataHmlaza.forEach(function (v) {
				if (v.date_value == $scope.appData.dataAddRow.day_id) {
					$scope.appData.hamlazaSum = v.zefi_itrat_sgira;
				}
			})
		};
		$scope.addRowValidation = function () {
			var error = 0;
			$scope.appData.dataAddRow.arrListChecks.forEach(function (a) {
				if (a.day_id == '') {
					a.redColorBorderDate = true;
					error++;
				}
				else {
					var len = a.day_id.split('/').length;
					if (len < 3) {
						a.redColorBorderDate = true;
						error++;
					}
					else if ((a.day_id.split('/')[0].length > 2 || a.day_id.split('/')[0].length == 0) || (a.day_id.split('/')[1].length > 2 || a.day_id.split('/')[1].length == 0) || (a.day_id.split('/')[2].length > 4 || a.day_id.split('/')[2].length == 0)) {
						a.redColorBorderDate = true;
						error++;
					}
					else {
						a.redColorBorderDate = false;
					}
				}

				if (a.trans_name == '') {
					a.redColorBorderTrans = true;
					error++;
				}
				else {
					a.redColorBorderTrans = false;
				}

				if ($scope.appData.radioType == 'hozaa') {
					if (!a.hozaa) {
						a.redColorBorderHozaa = true;
						error++;
					}
					else {
						a.redColorBorderHozaa = false;
					}
				}

				if ($scope.appData.radioType == 'hachnasa') {
					if (!a.hachnasa) {
						a.redColorBorderHachnasa = true;
						error++;
					}
					else {
						a.redColorBorderHachnasa = false;
					}
				}

				if ($scope.appData.selectTypeAddTazrim.paymentType == 1 && (a.asmachta.length > 0 && a.asmachta.length < 4)) {
					a.redColorBorderAsmac = true;
					//error++;
				}
				else {
					a.redColorBorderAsmac = false;
				}
				if (a.redColorBorderAsmacExist) {
					error++;
				}
			})

			if ($scope.appData.selectAccAddTazrim == 'null') {
				error++;
			}
			var ret = false;
			if (error > 0) {
				ret = true;
			}
			return ret;
		}
		$scope.addRow = function () {
			$scope.appData.errorAsma = '';
			var data = [];

			var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;

			function dmyOrdA(a, b) {
				if (a.day_id) {
					a = a.day_id.replace(dateRE, "$3$2$1");
				}
				if (b.day_id) {
					b = b.day_id.replace(dateRE, "$3$2$1");
				}
				if (a < b) return 1;
				if (a > b) return -1;
				return 0;
			}

			$scope.appData.dataAddRow.arrListChecks.sort(dmyOrdA);
			$scope.appData.dataAddRowDatesAll = {
				date_from: $scope.appData.dataAddRow.arrListChecks[$scope.appData.dataAddRow.arrListChecks.length - 1].day_id
			}
			if ($scope.appData.dataAddRow.arrListChecks.length > 1) {
				$scope.appData.dataAddRowDatesAll.date_till = $scope.appData.dataAddRow.arrListChecks[0].day_id;
			}
			else if ($scope.appData.dataAddRow.arrListChecks.length == 1) {
				$scope.appData.dataAddRowDatesAll.date_till = $scope.addMonth($scope.appData.dataAddRowDatesAll.date_from, 30);
			}
			$scope.appData.dataAddRow.arrListChecks.forEach(function (v) {
				var ho, ha, asmachta;
				if ($scope.appData.radioType == 'hozaa') {
					ho = Math.abs(parseFloat(v.hozaa));
					ha = null;
				} else {
					ha = Math.abs(parseFloat(v.hachnasa));
					ho = null;
				}
				asmachta = parseFloat(v.asmachta);
				if (v.asmachta == '') {
					asmachta = 0;
				}
				var obj = {
					"day_id": v.day_id,
					"payment_type_id": $scope.appData.selectTypeAddTazrim.paymentType,
					"company_account_id": $scope.appData.selectAccAddTazrim,
					"asmachta": asmachta,
					"company_id": $scope.appData.selectedCompany.companyId,
					"trans_type_id": v.trans_type_id,
					"trans_name": v.trans_name,
					"hachnasa": ha,
					"hozaa": ho

				}
				data.push(obj)
			});
			$scope.hidePopup();
			serverConnection.addTazrimRow(JSON.stringify(data)).then(function (response) {
				$scope.appData.openDialog = true;
				$scope.appData.alertSucUpd = false;
				$scope.appData.alertSucAdd = true;
				$scope.appData.transIdRow = response;
				$scope.changeItem($scope.appData.selectAccAddTazrim)
			}, function (error) {

			});
		};
		$scope.convertTypePeulaName = function (name) {
			var names;
			$scope.appData.arrPayType.forEach(function (v) {
				if (name == v.paymentTypeName) {
					names = v.paymentType
				}
			});
			return names;
		}
		$scope.updateFromExcel = function () {
			$scope.showPopup('views/templates/popupExportExcel.html?ver=3.80', 'popupExportExcel');
		}
		$scope.downloadExcelTemplate = function () {
			function download(url) {
				var hiddenIFrameID = 'hiddenDownloader',
					iframe = document.getElementById(hiddenIFrameID);
				if (iframe === null) {
					iframe = document.createElement('iframe');
					iframe.id = hiddenIFrameID;
					iframe.style.display = 'none';
					document.body.appendChild(iframe);
				}
				iframe.src = url;
			}

			download('https://secure.bizibox.biz/add_tazrim_tamplate.xlsx')
		}
		$scope.updateSubmitExport = function () {
			serverConnection.addTazrimRow(JSON.stringify($scope.appData.excelChecks)).then(function (response) {
				if (response !== '00000000-0000-0000-0000-000000000000') {
					$scope.appData.alertErrorUploadExcel = false;
					$scope.appData.openDialog = true;
					$scope.appData.alertSucUpd = false;
					$scope.appData.alertSucAdd = true;
					$scope.appData.transIdRow = response;
					$scope.changeItem($scope.appData.selectedItem)
					$scope.hidePopup();
				}
				else {
					$scope.appData.alertErrorUploadExcel = true;
				}
			}, function (error) {
				$scope.appData.alertErrorUploadExcel = true;
			});
		}
		$scope.gotoAnchor = function () {
			$scope.appData.filterTazrim.forEach(function (v) {
				if ($scope.appData.transIdRow.replace(/"/g, '') == v.trans_id) {
					$timeout(function () {
						v.classActive = true;
						$location.hash($scope.appData.transIdRow.replace(/"/g, ''));
						$anchorScroll();
						$timeout(function () {
							$location.hash('');
							$scope.appData.transIdRowAn = false;
						}, 100)
					}, 1000)
				}
			});
		};
		$scope.decodeFun = function (num) {
			return decodeURIComponent(num);
		}
		$scope.gotoRowAdd = function () {
			$scope.appData.openDialog = false;
			$scope.appData.alertSucUpd = false;
			$scope.appData.alertSucAdd = false;
			$scope.appData.transIdRowAn = true;
			$scope.appData.bankTazrim = '';
			var changeDates = {
				'date_from': $scope.appData.dataAddRowDatesAll.date_from,
				'date_till': $scope.appData.dataAddRowDatesAll.date_till
			};
			if ($scope.appData.selectedItem.company_account_id == 'null') {
				$scope.appData.banksList.forEach(function (v) {
					if (v.company_account_id == 'null') {
						if ($scope.appData.selectedItem !== v) {
							$scope.appData.selectedItem = v;
						}
					}
				})
				$scope.loadTazrimAllBanks(changeDates);
			}
			else {
				$scope.appData.banksList.forEach(function (v) {
					if (v.company_account_id == $scope.appData.selectAccAddTazrim) {
						if ($scope.appData.selectedItem !== v) {
							$scope.appData.selectedItem = v;
						}
					}
				});
				$scope.loadTazrimBank($scope.appData.selectedItem, changeDates);
			}
		}
		$scope.refresh = function () {
			$scope.selectDatesOnSubmit();
			$scope.getTransactionTypes();
		};
		$scope.$on('refresh', function () {
			$scope.refresh();
		});
		$scope.help = function () {
			window.open('http://bizibox.biz/help/cashflowdetailed', '_blank');
		};
		$scope.openCheckImg = function (uuid, idBank, bankTransId) {
			if (uuid == 'x') {
				$scope.showPopup('views/templates/alertXcheck.html?ver=3.80', 'popAlert', true);
				setTimeout(function () {
					$scope.hidePopup();
				}, 3000)
			}
			else {
				$scope.filteredDataLoader = false;

				var folder_name;
				$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
					if (v.company_account_id == idBank) {
						folder_name = v.bank_id + '' + v.bank_snif_id + '' + v.bank_account_number;
					}
				});
				serverConnection.copyCheks(uuid, folder_name, bankTransId).then(function (picture) {
					$scope.filteredDataLoader = true;

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
					$scope.filteredDataLoader = true;
				});
			}
		};
		$scope.changePeulaClick = function (a, event) {
			if (!a.changePeula) {
				a.openListThis = !a.openListThis;
				a.showInputSearch = true;
				a.searchType = '';
				$scope.openPeulotList(a.trans_id, a.openListThis, event)
			}
		}
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
			$scope.showPopup('views/templates/mailerTazrim.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.isObj = function (val) {
			var retVal = angular.isDefined(val) && (val !== null);
			return retVal
		}
		$scope.excelDeleteOldPayments = function () {
			if ($scope.appData.excelChecks && $scope.appData.excelChecks.length > 0) {
				$scope.appData.excelChecks.forEach(function (v) {
					v.delete_old_payments = Number($scope.appData.Excel_delete_old_payments);
				})
			}
		}
		$scope.getBankId = function (uuid) {
			var nick;
			$scope.appData.banksList.forEach(function (v) {
				if (v.company_account_id == uuid) {
					nick = v.bank_id;
				}
			});
			return nick;
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {
			//if ($scope.appData.selectedCompany)
			//	$scope.mail = $scope.appData.selectedCompany.mail;

			if (newVal == false) {
				if ($scope.appData.alertErrorUploadExcel) {
					$scope.appData.alertErrorUploadExcel = false;
				}

				$scope.error = '';
				$scope.importShow = false;
				$scope.valTextFile = '';
				$scope.appData.excelChecks = false;
				$("#uploadBtn").val('');
			}
		});
		$scope.copy = function (item1) {
			return angular.copy(item1);
		};
	}

	angular.module('controllers')
	.controller('tazrimCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$anchorScroll', '$ocLazyLoad', tazrimCtrl]);
}());


