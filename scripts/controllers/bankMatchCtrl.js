(function () {

	function bankMatchCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $anchorScroll) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.$utils = utils;
		$scope.accoConversions = accoConversions;
		$scope.appData = AppData;
		$scope.nextPage = $state.params.url;
		$scope.months = utils.monthNames();
		$scope.years = utils.yearsKsafim(3);
		$scope.date = new Date();
		$scope.appData.alertTabMatch = 1;
		$scope.selectDatesValue = [
			{
				name: 'מהישן לחדש',
				val: true
			}, {
				name: 'מהחדש לישן',
				val: false
			}
		];
		$scope.selectDatesValueCancel = [
			{
				name: 'לפי תאריך התאמה',
				val: true
			}, {
				name: 'לפי תאריך פעולה',
				val: false
			}
		];
		$scope.appData.calcSumBankPeulot = 0;
		$scope.appData.numberOfPeulotMatchBottom = 0;
		$scope.appData.defaultSumsSort = 0;
		$scope.appData.defaultTypesPaysSort = "all";
		$scope.appData.groupFiltersMatch = {
			sums: [],
			typesOfPays: []
		};
		$scope.selectedAllPeula = true;
		$scope.checkAllPeula = function () {
			if (!$scope.selectedAllPeula) {
				$scope.selectedAllPeula = false;
			} else {
				$scope.selectedAllPeula = true;
			}
			angular.forEach($scope.appData.groupFiltersMatch.sums, function (t) {
				t.paymentActive = $scope.selectedAllPeula;
			});
			$scope.filterBankMatch();
		};
		$scope.selectedAll = true;
		$scope.checkAll = function () {
			if (!$scope.selectedAll) {
				$scope.selectedAll = false;
			} else {
				$scope.selectedAll = true;
			}
			$scope.appData.groupFiltersMatch.typesOfPays.forEach(function (t) {
				t.paymentActive = $scope.selectedAll;
			})
			$scope.filterBankMatch();
		};
		$scope.init = function () {
			$scope.appData.sortDateBank = true;
			$scope.loaderMatch = false;
			$scope.appData.alertTabMatchNull = false;
			$scope.checkRemove = false;
			$scope.checkRemoveMatch = false;
			$scope.loaderMatchTable = true;
		};
		$scope.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			$scope.getCompanyAccounts().then(function (res) {
				$scope.appData.selectedCompany.accounts = res;
				if($scope.appData.selectedCompany.accounts.bank_account_list !== null){
					$scope.appData.defaultCompanyAcc = $scope.appData.selectedCompany.accounts.bank_account_list[0].company_account_id;
					$scope.loadPage();
				}
				else{
					$scope.loaderMatch = true;
					$scope.appData.alertTabMatchNull = true;
				}
			}, function (error) {
			});
		};
		$scope.loadPage = function () {
			if ($state.current.name == 'bankMatch.set') {
				if ($scope.topSampleNav == "113px") {
					$scope.appData.tbodyMatchScroll = 525;
				}
				else {
					$scope.appData.tbodyMatchScroll = 470;
				}
				$scope.loadBankPeulot();
			}
			if ($state.current.name == 'bankMatch.cancel') {
				$scope.loadBankPeulotCancel();
			}
		}

		$scope.loadBankPeulot = function (load) {
			$scope.loaderMatch = false;

			if ($scope.topSampleNav == "113px") {
				$scope.appData.tbodyMatchScroll = 525;
			}
			else {
				$scope.appData.tbodyMatchScroll = 470;
			}
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
			console.log(0);

			serverConnection.loadBankPeulot($scope.appData.selectedCompany.companyId).then(function (res) {
				$scope.appData.bankMatchList = res;
				console.log(1);
				if (res.length) {
					//var result = groupBy($scope.appData.bankMatchList, function (item) {
					//	return [item.company_account_id];
					//});
					//result.sort(function (a, b) {
					//	return b.length - a.length;
					//});
					if (!load) {
						$scope.appData.defaultCompanyAcc = res[0].company_account_id;
					}
					$scope.sortBankPeulot();
				}
				else {
					$scope.appData.alertTabMatch = 0;
					$scope.loaderMatch = true;
				}
			}, function (error) {
			});
		};
		$scope.loadBankPeulotCancel = function () {
			$scope.loaderMatch = false;
			$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
				if (v.company_account_id == $scope.appData.defaultCompanyAcc) {
					$scope.appData.selectBankMatchId = v.bank_id;
				}
			});
			var checkRemove, orderByMatch;
			if ($scope.checkRemove == false) {
				checkRemove = 0;
			}
			else {
				checkRemove = 1;
			}
			if ($scope.appData.sortDateBank == false) {
				orderByMatch = 1;
			}
			else {
				orderByMatch = 0;
			}

			var data = {
				companyAccountId: $scope.appData.defaultCompanyAcc,
				indDelete: checkRemove,
				orderByMatch: orderByMatch
			}

			serverConnection.loadBankPeulotCancel(data).then(function (res) {
				$scope.appData.bankMatchList = res;
				$scope.appData.lengthBankMatch = res.length;
				$scope.appData.lengthBankMatchCopy = angular.copy(res.length);
				if (res.length > 0) {
					$scope.sortBankPeulot()
				}
				else {
					$scope.loaderMatch = true;
				}
			}, function (error) {
			});
		};
		$scope.getNameAccTitle = function (id) {
			var title = {};
			$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
				if (v.company_account_id == id) {
					title.name = v.company_account_nickname;
					title.number = v.bank_id;
				}
			})
			return title;
		};
		$scope.sortBankPeulot = function () {
			$scope.loaderMatchTable = false;
			$scope.appData.lengthBankMatch = $scope.appData.lengthBankMatchCopy;
			$scope.appData.listBankMatchAfter = {};
			$scope.appData.datesListBankMatch = [];

			var data = {};
			var dates = [];
			var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
			console.log(2);

			function dmyOrdA(a, b) {
				a = a.replace(dateRE, "$3$2$1");
				b = b.replace(dateRE, "$3$2$1");
				if ($state.current.name == 'bankMatch.set') {
					if ($scope.appData.sortDateBank) {
						if (a > b) return 1;
						if (a < b) return -1;
					}
					else {
						if (a < b) return 1;
						if (a > b) return -1;
					}
				}
				else {
					if (a < b) return 1;
					if (a > b) return -1;
				}
				return 0;
			}

			//if ($state.current.name == 'bankMatch.set') {
			//	$scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
			//		if (v.company_account_id == $scope.appData.defaultCompanyAcc) {
			//			$scope.appData.selectBankMatchId = v.bank_id;
			//		}
			//	})
			//}

			$scope.pushTransIdBankList = [];
			var lengthArr = 0;
			$scope.appData.bankMatchList.forEach(function (v, i) {
				if ($state.current.name == 'bankMatch.set') {
					//if ($scope.appData.defaultCompanyAcc == v.company_account_id && ((v.source_type_id == 10 && $scope.checkRemoveMatch == false) || ($scope.checkRemoveMatch == true))) {
					//	if ($scope.termFilterMatchSet && $scope.termFilterMatchSet.length) {
					//		var letterMatch = new RegExp($scope.termFilterMatchSet, 'i');
					//		if (letterMatch.test(v.asmachta) || letterMatch.test(v.day_id) || letterMatch.test(v.hachnasa) || letterMatch.test(v.hozaa) || letterMatch.test(v.trans_name)) {
					//			if (typeof data[v.day_id] == "undefined") {
					//				data[v.day_id] = [];
					//			};
					//			v.active = false;
					//			data[v.day_id].push(v);
					//			if (dates.indexOf(v.day_id) == -1) {
					//				dates.push(v.day_id);
					//			}
					//			$scope.pushTransIdBankList.push(v.trans_id);
					//			lengthArr++;
					//		}
					//	}
					//else {
					v.account_name = $scope.getNameAccTitle(v.company_account_id);
					if (typeof data[v.day_id] == "undefined") {
						data[v.day_id] = [];
					}
					v.active = false;
					data[v.day_id].push(v);
					if (dates.indexOf(v.day_id) == -1) {
						dates.push(v.day_id);
					}
					$scope.pushTransIdBankList.push(v.trans_id);
					lengthArr++;
					//}
					//}
				}
				if ($state.current.name == 'bankMatch.cancel') {
					var dateSort = v.match_date;
					if ($scope.appData.sortDateBank) {
						dateSort = v.trans_date;
					}
					if ($scope.termFilterMatchCancel && $scope.termFilterMatchCancel.length) {
						var letterMatch = new RegExp($scope.termFilterMatchCancel, 'i');
						if (letterMatch.test(v.trans_desc_azonly) || letterMatch.test(v.trans_date) || letterMatch.test(v.total) || letterMatch.test(v.asmachta)) {
							if (typeof data[dateSort] == "undefined") {
								data[dateSort] = [];
							}
							v.active = false;
							data[dateSort].push(v);
							if (dates.indexOf(dateSort) == -1) {
								dates.push(dateSort);
							}
							$scope.pushTransIdBankList.push(v.bank_trans_id);
						}
					}
					else {
						if (typeof data[dateSort] == "undefined") {
							data[dateSort] = [];
						}
						v.active = false;
						data[dateSort].push(v);
						if (dates.indexOf(dateSort) == -1) {
							dates.push(dateSort);
						}
						$scope.pushTransIdBankList.push(v.bank_trans_id);
					}
				}
			});
			console.log(3);

			$scope.appData.listBankMatchAfter = data;
			//$scope.appData.datesListBankMatch = dates.sort(dmyOrdA);

			$scope.appData.datesListBankMatch = dates;
			if ($state.current.name == 'bankMatch.cancel') {
				lengthArr = $scope.appData.lengthBankMatch;
			}
			if ($state.current.name == 'bankMatch.set') {
				$scope.appData.lengthBankMatch = lengthArr;
			}
			console.log(4);

			if (lengthArr > 0) {
				if ($state.current.name == 'bankMatch.set') {
					$scope.appData.listBankMatchAfter[$scope.appData.datesListBankMatch[0]][0].active = true;
					$scope.loadTablePeulot();
				}
				else {
					if ($scope.pushTransIdBankList.length) {
						$scope.loaderMatchTable = true;
						$scope.loaderMatch = true;
						//$scope.appData.listBankMatchAfter[$scope.appData.datesListBankMatch[0]][0].active = true;
						//$scope.loadTablePeulotRemove($scope.appData.listBankMatchAfter[$scope.appData.datesListBankMatch[0]][0].bank_trans_id)
					}
					else {
						$scope.appData.lengthBankMatch = 0;
						$scope.loaderMatchTable = true;
						$scope.loaderMatch = true;
					}
				}
			}
			else {
				if ($scope.appData.bankMatchList.length) {
					$scope.loaderMatch = true;
				}
				$scope.loaderMatchTable = true;
			}
		}
		$scope.checkRadioAll = function () {
			$scope.appData.peulotTableCancel.forEach(function (v) {
				if (v.match_link_id == $scope.appData.match_link_id) {
					v.active = true;
				}
				else {
					v.active = false;
				}
			})
		}
		$scope.loadTablePeulotRemove = function (transId, trans_desc_azonly) {
			$scope.appData.loaderMatchTable = false;
			$scope.loaderMatch = true;
			$scope.appData.transDescAzonlyPop = trans_desc_azonly;
			$scope.appData.datesListBankMatch.forEach(function (v) {
				$scope.appData.listBankMatchAfter[v].forEach(function (a) {
					if (a.bank_trans_id == transId) {
						a.active = true;
					}
					else {
						a.active = false;
					}
				});
			});
			var data = {
				companyId: $scope.appData.selectedCompany.companyId,
				bank_trans_ids: [transId]
			};
			serverConnection.loadTablePeulotRemove(data).then(function (res) {
				$scope.appData.peulotTableCancel = res;
				if (res.length > 0) {
					//$scope.appData.match_link_id = $scope.appData.peulotTableCancel[0].match_link_id;
					$scope.checkRadioAll();
				}
				$scope.showPopup('views/templates/loadTablePeulotRemove.html?ver=3.80', 'loadTablePeulotRemovePop');
				$scope.appData.loaderMatchTable = true;
				$scope.loaderMatch = true;
			}, function (error) {

			});
		}
		$scope.cancelMatchPeulot = function (data) {
			$scope.hidePopup();
			var trans_id;
			$scope.appData.datesListBankMatch.forEach(function (v) {
				$scope.appData.listBankMatchAfter[v].forEach(function (a) {
					if (a.active) {
						trans_id = a.bank_trans_id
					}
				})
			})
			//var match_link_id = $scope.appData.match_link_id;
			//if (data) {
			//	match_link_id = null;
			//}
			var data = {
				match_link_id: null,
				trans_id: trans_id
			}
			serverConnection.pirukAthama(data).then(function (res) {
				//$scope.loadBankPeulotCancel();
				$scope.refresh();
			}, function (error) {

			});
		}
		$scope.loadTablePeulot = function () {
			console.log(5);
			$scope.appData.listTablePeulot = undefined;

			var all_peulot = {
				company_id: $scope.appData.selectedCompany.companyId,
				company_account_id: null,
				bank_trans_ids: []
			}

			$scope.loaderMatch = true;
			serverConnection.getAllPeoulotList(all_peulot).then(function (successT) {
				console.log(6);

				$scope.appData.listTablePeulot = [[], successT];
				var trans_id = $scope.appData.listBankMatchAfter[$scope.appData.datesListBankMatch[0]][0].trans_id;
				var company_account_id = $scope.appData.listBankMatchAfter[$scope.appData.datesListBankMatch[0]][0].company_account_id;
				$scope.setTableListBank(trans_id, company_account_id);
			})
		}
		$scope.setTableListBank = function (transid, company_account_id, $event) {
			console.log(7);

			$scope.loaderMatchTable = true;
			$scope.appData.groupFiltersMatch = {
				sums: [],
				typesOfPays: []
			};
			var rowsTableBottomMatch = [];
			$scope.appData.calcSumBankPeulot = 0;
			$scope.appData.numberOfPeulotMatchBottom = 0;
			$scope.appData.listTransIdAndExp = [];
			var hov_avar = 0, atid = 0;
			if ($event) {
				if ($event.ctrlKey) {
					//Ctrl+Click
					$scope.appData.datesListBankMatch.forEach(function (v) {
						$scope.appData.listBankMatchAfter[v].forEach(function (a) {
							if (a.trans_id == transid) {
								a.active = !a.active;
								if (a.active) {
									var expence = a.hozaa;
									if (expence == null) {
										expence = false;
									}
									else {
										expence = true;
									}
									var data = {
										'trans_id': a.trans_id,
										'expence': expence,
										'company_account_id': a.company_account_id
									};
									$scope.appData.listTransIdAndExp.push(data);
								}
							}
						})
					})
				}
				else {
					$scope.appData.datesListBankMatch.forEach(function (v) {
						$scope.appData.listBankMatchAfter[v].forEach(function (a) {
							if (a.trans_id == transid) {
								var expence = a.hozaa;
								if (expence == null) {
									expence = false;
								}
								else {
									expence = true;
								}
								var data = {
									'trans_id': a.trans_id,
									'expence': expence,
									'company_account_id': a.company_account_id
								};
								$scope.appData.listTransIdAndExp.push(data);
								a.active = true;
							}
							else {
								a.active = false;
							}
						})
					})
				}
			}
			else {
				$scope.appData.datesListBankMatch.forEach(function (v, ind) {
					$scope.appData.listBankMatchAfter[v].forEach(function (a, i) {
						if (i == 0 && ind == 0) {
							var expence = a.hozaa;
							if (expence == null) {
								expence = false;
							}
							else {
								expence = true;
							}
							a.active = true;
							var data = {
								'trans_id': a.trans_id,
								'expence': expence,
								'company_account_id': a.company_account_id
							};
							$scope.appData.listTransIdAndExp.push(data);
						}
						else {
							a.active = false;
						}
					})
				})
			}

			$scope.appData.listTransIdAndExp.forEach(function (v) {
				$scope.appData.listTablePeulot[1].forEach(function (c) {
					c.valType = 1;
					if (v.expence == c.ind_expense && c.ind_hov_avar == true && v.company_account_id == c.company_account_id) {
						c.check = false;
						if (hov_avar == 0) {
							rowsTableBottomMatch.push({
								title: true,
								text: "פעולות שטרם הופקדו/נפרעו"
							});
							hov_avar = 1;
						}
						rowsTableBottomMatch.push(c);
					}
					if (v.expence == c.ind_expense && c.ind_hov_avar == false && v.company_account_id == c.company_account_id) {
						if (atid == 0) {
							rowsTableBottomMatch.push({
								title: true,
								text: "פעולות צפויות עתידיות"
							});
							atid = 1;
						}
						rowsTableBottomMatch.push(c);
					}
				})
			});
			$scope.appData.rowsTableBottomMatch = rowsTableBottomMatch;
			console.log(8);

			var trans_array_id = {
				incompany_id: $scope.appData.selectedCompany.companyId,
				incompany_account_id: company_account_id,
				bank_trans_ids: [transid]
			};
			serverConnection.bankMatchMumlazot(trans_array_id)
			.then(function (successT) {
				console.log(9);
				$scope.appData.listTablePeulot[0] = successT;
				$scope.appData.listTransIdAndExp.forEach(function (v) {
					$scope.appData.listTablePeulot[0].forEach(function (c) {
						c.valType = 0;
						if (v.trans_id == c.bank_trans_id && v.expence == c.ind_expense) {
							c.check = false;
							$scope.appData.rowsTableBottomMatch.push(c);
						}
					});
				});
				$scope.loaderMatch = true;
				$scope.loaderMatchTable = true;
				$scope.appData.rowsTableBottomMatchMain = angular.copy($scope.appData.rowsTableBottomMatch);
				$scope.filterTypesOfPays();
				$scope.filterTypesOfSums();
				$scope.filterBankMatch();
			})
		}
		$scope.filterTypesOfPays = function () {
			var arr = $scope.appData.rowsTableBottomMatchMain;
			var flags = [], output = [], l = arr.length, i;
			for (i = 0; i < l; i++) {
				if (!arr[i].title) {
					if (flags[arr[i].target_payment_type_id]) continue;
					flags[arr[i].target_payment_type_id] = true;
					output.push({
						'target_payment_type_id': arr[i].target_payment_type_id,
						'text': $scope.accoConversions.getTypePayment(arr[i].target_payment_type_id),
						'paymentActive': true
					});
				}
			}
			$scope.appData.groupFiltersMatch.typesOfPays = output;
		}
		$scope.filterTypesOfSums = function () {
			var arr = $scope.appData.rowsTableBottomMatchMain;
			var flags = [], output = [], l = arr.length, i;
			for (i = 0; i < l; i++) {
				if (!arr[i].title) {
					if (flags[arr[i].target_total]) continue;
					flags[arr[i].target_total] = true;
					output.push({
						'val': arr[i].target_total,
						'text': $scope.round2Fixed(arr[i].target_total),
						'paymentActive': true
					});
				}
			}
			output.sort(function (a, b) {
				return (a.val < b.val) ? 1 : -1;
			});
			$scope.appData.groupFiltersMatch.sums = output;
		}
		$scope.freeFilterMatchArray = function (input, term) {
			if (!input || !term) {
				return input;
			}
			var obj = [], len = input.length;

			for (var i = 0; i < len; i++) {
				if ((input[i].target_name !== undefined && input[i].target_name !== null && input[i].target_name.toString().indexOf(term) !== -1) || (input[i].target_total !== undefined && input[i].target_total !== null && input[i].target_total.toString().indexOf(term) !== -1) || (input[i].target_asmachta !== undefined && input[i].target_asmachta !== null && input[i].target_asmachta.toString().indexOf(term) !== -1)) {
					obj.push(input[i]);
				}
			}

			return obj;
		}
		$scope.filterBankMatch = function () {
			$scope.appData.rowsTableBottomMatch = $scope.freeFilterMatchArray(angular.copy($scope.appData.rowsTableBottomMatchMain), $scope.freeSearch);
			$scope.appData.rowsTableBottomMatch = $filter('freeFilterMatchTypesOfPays')($scope.appData.rowsTableBottomMatch, $scope.appData.groupFiltersMatch.typesOfPays);
			$scope.appData.rowsTableBottomMatch = $filter('freeFilterMatchSums')($scope.appData.rowsTableBottomMatch, $scope.appData.groupFiltersMatch.sums);
			$scope.appData.rowsTableBottomMatch = $filter('freeFilterMatchRowsTitle')($scope.appData.rowsTableBottomMatch);
		}
		$scope.calcSum = function () {
			var sum = 0, number = 0;
			if ($scope.appData.rowsTableBottomMatch.length) {
				var sum = $scope.appData.rowsTableBottomMatch.reduce(function (sum, value) {
					if (value.check == true) {
						sum = sum + value.target_total;
						number += 1;
					}
					return sum
				}, 0);
			}
			$scope.appData.calcSumBankPeulot = sum;
			$scope.appData.numberOfPeulotMatchBottom = number;
		}
		$scope.removeListOnePeula = function (transId) {
			var data = {
				bank_trans_ids: [transId]
			}
			serverConnection.removeListOnePeula(data).then(function (res) {
				$scope.loadBankPeulot(true)
			}, function (error) {
			});
		}
		$scope.removeFromPop = function () {
			var transId = [];
			$scope.appData.datesListBankMatch.forEach(function (v) {
				$scope.appData.listBankMatchAfter[v].forEach(function (a) {
					transId.push(a.trans_id)
				})
			})
			var data = {
				bank_trans_ids: transId
			}
			serverConnection.removeListOnePeula(data).then(function (res) {
				$scope.loadBankPeulot()
			}, function (error) {
			});
		}
		$scope.removeListAllPeulot = function () {
			$scope.showPopup('views/templates/alertRemoveListOnePeula.html?ver=3.80', 'alerts alertRemoveListOnePeula', true);
		}
		$scope.matchPeulot = function () {
			var data = [];
			$scope.appData.datesListBankMatch.forEach(function (v) {
				$scope.appData.listBankMatchAfter[v].forEach(function (a) {
					if (a.active) {
						data.push(a)
					}
				})
			});
			var dataTable = [];
			$scope.appData.rowsTableBottomMatch.forEach(function (v) {
				if (v.check == true && v.valType == 0) {
					var obj = {
						"target_id": v.target_id,
						"target_type_id": v.target_type_id,
						"target_total": v.target_total,
						"target_name": v.target_name,
						"target_original_date": v.target_original_date,
						"target_payment_type_id": v.target_payment_type_id,
						"target_asmachta": v.target_asmachta,
						"target_ind_kvua": v.target_ind_kvua,
						"match_link_id": v.match_link_id,
						"date_from": v.date_from,
						"date_till": v.date_till,
						"ind_hov_avar": v.ind_hov_avar,
						"match_prc": v.match_prc,
						"bank_trans_id": v.bank_trans_id,
						"searchkey_id": v.searchkey_id,
						"match_status": v.match_status,
						"ind_expense": v.ind_expense
					}
					dataTable.push(obj)
				}
				if (v.check == true && v.valType == 1) {
					var obj = {
						"target_id": v.target_id,
						"target_type_id": v.target_type_id,
						"target_total": v.target_total,
						"target_name": v.target_name,
						"target_original_date": v.target_original_date,
						"target_payment_type_id": v.target_payment_type_id,
						"target_asmachta": v.target_asmachta,
						"target_ind_kvua": v.target_ind_kvua,
						"match_link_id": v.match_link_id,
						"date_from": v.date_from,
						"date_till": v.date_till,
						"ind_hov_avar": v.ind_hov_avar,
						"match_prc": v.match_prc,
						"bank_trans_id": v.bank_trans_id,
						"searchkey_id": v.searchkey_id,
						"match_status": v.match_status,
						"ind_expense": v.ind_expense
					}
					dataTable.push(obj)
				}
			})

			var dataReq = {
				'peulaLoZfuyaList': data,
				'data': dataTable
			}
			serverConnection.matchPeulot(dataReq).then(function (res) {
				$scope.loadBankPeulot('load')
			}, function (error) {
			});
		}
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
		$scope.$on('refresh', function () {
			$scope.refresh();
		});
		$scope.refresh = function () {
			$scope.loadPage();
		};
	}


	angular.module('controllers')
	.controller('bankMatchCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$anchorScroll', bankMatchCtrl]);
}());
