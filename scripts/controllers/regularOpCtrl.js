(function () {
	function regularOpCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $anchorScroll) {
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
		$scope.showAlertNull = false;
		$scope.accountFilter = {company_account_id: ''};
		$scope.paymentTypeFilter = {ind_total: ''};
		$scope.solekFilter = {};
		$scope.selectedSolkim = '';
		$scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
		$scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
		$scope.fromDate = new Date((new Date()).setDate(new Date().getDate() - 50));
		$scope.toDate = new Date((new Date()).setDate(new Date().getDate() + 500));
		$scope.fromMonYear = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
		$scope.toMonYear = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
		$scope.appData.dateFilter.types = '00';
		$scope.dateFilter = {
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
		$scope.datesPicker = {
			fromDatePicker: (($scope.fromMonYear.getDate().toString().length == 2) ? $scope.fromMonYear.getDate() : '0' + $scope.fromMonYear.getDate()) + '/' + (($scope.fromMonYear.getMonth().toString().length == 2) ? ($scope.fromMonYear.getMonth() + 1) : '0' + ($scope.fromMonYear.getMonth() + 1)) + '/' + $scope.fromMonYear.getFullYear(),
			toDatePicker: (($scope.toMonYear.getDate().toString().length == 2) ? $scope.toMonYear.getDate() : '0' + $scope.toMonYear.getDate()) + '/' + (($scope.toMonYear.getMonth().toString().length == 2) ? ($scope.toMonYear.getMonth() + 1) : '0' + ($scope.toMonYear.getMonth() + 1)) + '/' + $scope.toMonYear.getFullYear()
		};
		$scope.inpaymentType = [
			{
				val: 40,
				name: 'הוראת קבע'
			},
			{
				val: 1,
				name: 'שיק'
			},
			{
				val: 9,
				name: 'העברה בנקאית'
			}
		];
		$scope.monthsDaySelect = [];
		$scope.monthsDay = new Date(new Date().getFullYear(), (new Date().getMonth() + 1), 0).getDate();
		for (var i = 1; i < $scope.monthsDay + 1; i++) {
			$scope.monthsDaySelect.push(i.toString())
		}

		var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;

		function dmyOrdA(a, b) {
			a = a.trans_date.replace(dateRE, "$3$2$1");
			b = b.trans_date.replace(dateRE, "$3$2$1");
			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		}


		$scope.init = function () {
			$scope.loaderPeulot = true;
			$scope.appData.showCubeAll = false;
			if ($scope.$state.current.url == "/regularOp") {
				$scope.$state.go('regularOp.cube');
			}
		};

		$scope.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);

			$scope.$broadcast('widthChanged');
			$scope.loadPage();
		};

		$scope.loadPage = function () {
			$scope.getCompanyAccounts().then(function (res) {
				$scope.appData.selectedCompany.accounts = res;
				if ($scope.appData.selectedCompany.accounts.bank_account_list !== null) {
					$scope.appData.selectedItem = $scope.appData.selectedCompany.accounts.bank_account_list[0];
					$scope.loadData()
				}
				else {
					$scope.appData.showCubeAll = true;
					$scope.loaderPeulot = false;
				}

			}, function (error) {

			});
		};


		$scope.loadData = function () {
			$scope.loaderPeulot = true;
			// if($state.current.name == 'regularOp.cube'){
			$scope.getTransactionTypes(true);
			$scope.getPeulotKvuot();
			// }
		}

		$scope.getPeulotKvuot = function () {
			$scope.loaderPeulot = true;
			serverConnection.getFixedActions($scope.appData.selectedCompany.companyId, $scope.appData.selectedItem.company_account_id).then(function (response) {
				$scope.appData.peulotKvuot = response;
				$scope.loaderPeulot = false;
			}, function (error) {
				$scope.loaderPeulot = false;
			});
		};

		$scope.transkvuotHtmlGetlist = function () {
			serverConnection.getFixedActionsHTML($scope.appData.selectedCompany.companyId, $scope.appData.selectedItem.company_account_id).then(function (response) {
				$scope.appData.transkvuotHtmlGetlist = response;

				$scope.appData.transkvuotHtmlGetlist.forEach(function (v, index) {
					var getTypeName = $scope.getTypeName(v.trans_type_id);
					v.trans_type_name = (getTypeName !== "") ? getTypeName : "ללא קטגוריה";
				});
				//    if($state.current.name == 'regularOp.graph') {
				$scope.convertArrToPie();
				$timeout(function () {
					$scope.sort_by('ind_expense', 'ind_hova');
				}, 2000)
				//  }
			}, function (error) {
				$scope.loaderPeulot = false;
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
				$scope.setPopDef();
				if(start){
					$scope.transkvuotHtmlGetlist();
				}
			}, function (error) {
				if(start){
					$scope.transkvuotHtmlGetlist();
				}
			});
			//serverConnection.getTransactionTypes().then(function (response) {
			//    $scope.appData.transactionTypesReg = response;
			//    $scope.appData.transactionTypesEX = [];
			//    $scope.appData.transactionTypesIN = [];
			//    $scope.appData.transactionTypesReg.forEach(function (v) {
			//        if (v.ind_expense == true) {
			//            $scope.appData.transactionTypesEX.push(v)
			//        }
			//        else {
			//            $scope.appData.transactionTypesIN.push(v)
			//        }
			//    })
			//    $scope.setPopDef()
			//}, function (error) {
			//});
		};

		$scope.setPopDef = function () {
			$scope.appData.peulaAddText = '';
			$scope.appData.openListThis = false;
			$scope.appData.setPopDef = {
				payNum: 1,
				intrans_name: '',
				intotal: '',
				inpayment_type: '40',
				intrans_frequency_id: '1',
				daysMonthPeulot: '1',
				option3: '',
				option2: '',
				fromDateFr: ('0' + (new Date().getDate())).slice(-2) + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear(),
				optionSelect: 'option1'
			};
			// if ($scope.appData.transactionTypesEX.length > 0) {
			//
			//
			// }
			// if ($scope.appData.transactionTypesIN.length > 0) {
			// }

			// $scope.appData.transactionTypesReg.forEach(function (val, idx) {
			// 	if(val.trans_type_id == "f8dd5d61-fb5d-44ba-b7e6-65f25e7b2c6d"){
			// 		$scope.appData.defTypeEx = $scope.appData.transactionTypesReg[idx].trans_type_id;
			// 		$scope.appData.defTypeIn = $scope.appData.transactionTypesReg[idx].trans_type_id;
			// 	}
			// });
			$scope.appData.defTypeEx = "f8dd5d61-fb5d-44ba-b7e6-65f25e7b2c6d";
			$scope.appData.defTypeIn = "f8dd5d61-fb5d-44ba-b7e6-65f25e7b2c6d";

			$scope.appData.disabledEditPeula = false;

			var a = new Date();
			var aa = a.getDay();
			var arr = [];
			var aDay = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - aa);
			var b = parseFloat(aDay.getFullYear() + '' + ("0" + (aDay.getMonth() + 1)).slice(-2) + '' + ("0" + aDay.getDate()).slice(-2));
			arr.push(b)
			for (var i = 1; i < 7; i++) {
				var days = new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDate() - aa) + i);
				var b = parseFloat(days.getFullYear() + '' + ("0" + (days.getMonth() + 1)).slice(-2) + '' + ("0" + days.getDate()).slice(-2));
				arr.push(b)
			}
			$scope.appData.radioDaysInweek = arr;
			$scope.appData.dayNum = parseFloat(new Date().getFullYear() + '' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '' + ("0" + new Date().getDate()).slice(-2));
		}

		$scope.nameOfType = function (v, arr) {
			var name;
			arr.forEach(function (a) {
				if (a.trans_type_id == v) {
					name = a.trans_type_name;
				}
			})
			return name;
		}

		$scope.getNameKey = function (id) {
			var name;
			$scope.appData.transactionTypesReg.forEach(function (v) {
				if (v.trans_type_id == id) {
					name = v.trans_type_name;
				}
			});
			return name;
		}

		$scope.bankLoadPeulotBysk = function (a) {
			if (!a.dataTable) {
				serverConnection.bankLoadPeulotBysk($scope.appData.selectedCompany.companyId, $scope.appData.selectedItem.company_account_id, a.searchkey_id).then(function (response) {
					$scope.appData.peulotKvuot.forEach(function (v) {
						if (v.searchkey_id == a.searchkey_id) {
							v.dataTable = response;
						}
						else {
							v.dataTable = false;
						}
					})
					if ($scope.appData.transkvuotHtmlGetlist) {
						$scope.appData.transkvuotHtmlGetlist.forEach(function (v) {
							v.dataTable = false;
						})
					}
				}, function (error) {
				});
			}
			else {
				a.dataTable = false;
			}
		};
		$scope.trans_type_update_ksafim = function (item, type) {
			if (!item.edits) {
				serverConnection.trans_type_update_ksafim({
					company_id: $scope.appData.selectedCompany.companyId,
					trans_type_id: item.trans_type_id,
					trans_type_name: item.trans_type_name
				}).then(function (result) {
					$scope.appData.transactionTypesReg.forEach(function (v) {
						if (v.trans_type_id == item.trans_type_id) {
							v.trans_type_name = item.trans_type_name;
						}
					})


					// 		if (type == 'transactionTypesEX') {
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
				$scope.appData.transactionTypesReg.forEach(function (v, i) {
					if (v.trans_type_id == item.trans_type_id) {
						$scope.appData.transactionTypesReg.splice(i, 1);
					}
				});
			}, function (error) {
			});
		}
		$scope.addPeulaText = function (type) {
			var indExpense = 1;
			if (type == 'in') {
				indExpense = 0;
			}
			var data = {
				"companyId": $scope.appData.selectedCompany.companyId,
				"transTypeName": $scope.appData.peulaAddText,
				"indExpense": indExpense
			}
			serverConnection.addNewTransType(data).then(function (response) {
				var indExpenseType = true;
				if (type == 'in') {
					indExpenseType = false;
				}
				var obj = {
					"trans_type_name": $scope.appData.peulaAddText,
					"trans_type_id": response,
					"ind_expense": indExpenseType
				};
				if (type == 'in') {
					$scope.appData.transactionTypesReg.push(obj);
					$scope.appData.defTypeIn = response;
					$scope.appData.defTypeNameIn = $scope.appData.peulaAddText;
				}
				else {
					$scope.appData.transactionTypesReg.push(obj);
					$scope.appData.defTypeEx = response;
					$scope.appData.defTypeNameEx = $scope.appData.peulaAddText;
				}
				$scope.appData.peulaAddText = '';
			}, function (error) {
			});
		}

		$scope.deleteRowFromTable = function (dataTable, len, searchkey_id, bank_trans_id) {
			var i;
			dataTable.forEach(function (a, index) {
				if (a.bank_trans_id == bank_trans_id) {
					i = index;
				}
			});
			dataTable.splice(i, 1);
			if (len == 1) {
				$scope.appData.peulotKvuot.forEach(function (v) {
					if (v.searchkey_id == searchkey_id) {
						v.dataTable = false;
						v.removeOpenRable = true;
					}
				})
			}
		}

		$scope.deleteRowFromTable2 = function (dataTable, len, trans_id, bank_trans_id, match_link_id) {
			var data = {
				match_link_id: match_link_id,
				trans_id: trans_id
			}
			serverConnection.pirukAthama(data).then(function (response) {
				var i;
				dataTable.forEach(function (a, index) {
					if (a.bank_trans_id == bank_trans_id) {
						i = index;
					}
				});
				dataTable.splice(i, 1);
				if (len == 1) {
					$scope.appData.transkvuotHtmlGetlist.forEach(function (v) {
						if (v.trans_id == trans_id) {
							v.dataTable = false;
							v.removeOpenRable = true;
						}
					})
				}
			}, function (error) {
			});
		}

		$scope.deleteAllRowFromTable = function (a) {
			if (a.checks) {
				$scope.appData.peulotKvuot.forEach(function (v) {
					if (v.searchkey_id == a.searchkey_id) {
						v.dataTable = false;
						v.removeOpenRable = true;
					}
				})
			}
			else {
				var pusharr = [];
				$scope.appData.peulotKvuot.forEach(function (v) {
					if (v.searchkey_id == a.searchkey_id) {
						v.dataTable.forEach(function (c, index) {
							if (!c.checks) {
								pusharr.push(c)
							}
						});
						v.dataTable = pusharr;
						if (pusharr.length == 0) {
							v.dataTable = false;
							v.removeOpenRable = true;
						}

					}
				})
			}
		}
		$scope.deleteAllRowFromTable2 = function (a) {
			if (a.checks) {
				$scope.appData.transkvuotHtmlGetlist.forEach(function (v) {
					if (v.trans_id == a.trans_id) {
						v.dataTable.forEach(function (d, index) {
							var data = {
								match_link_id: d.match_link_id,
								trans_id: a.trans_id
							}
							serverConnection.pirukAthama(data).then(function (response) {

							}, function (error) {
							});
							if (v.dataTable.length == (index + 1)) {
								v.dataTable = false;
							}
						})
						v.removeOpenRable = true;
					}
				})
			}
			else {
				var pusharr = [];
				$scope.appData.transkvuotHtmlGetlist.forEach(function (v) {
					if (v.trans_id == a.trans_id) {
						v.dataTable.forEach(function (c, index) {
							if (!c.checks) {
								pusharr.push(c)
							}
							else {
								var data = {
									match_link_id: c.match_link_id,
									trans_id: a.trans_id
								}
								serverConnection.pirukAthama(data).then(function (response) {

								}, function (error) {
								});
							}
						});
						v.dataTable = pusharr;
						if (pusharr.length == 0) {
							v.dataTable = false;
							v.removeOpenRable = true;
						}
					}
				})
			}
		}
		$scope.bankLoadDismissbysk = function (searchkeyId, ind) {
			serverConnection.bankLoadDismissbysk($scope.appData.selectedCompany.companyId, $scope.appData.selectedItem.company_account_id, searchkeyId).then(function (response) {
				$scope.appData.peulotKvuot.splice(ind, 1);
			}, function (error) {
			});
		};

		$scope.bankLoadDismissbysk2 = function (trans_id, ind) {
			$scope.appData.bankLoadDismissbysk2Id = trans_id;
			$scope.appData.bankLoadDismissbysk2Ind = ind;
			$scope.showPopup('views/templates/alertsPrevDeletedReg.html?ver=3.80', 'alerts', true);
		};

		$scope.bankLoadDismissbysk2Delete = function () {
			$scope.hidePopup();
			serverConnection.transkvuotDelete($scope.appData.bankLoadDismissbysk2Id).then(function (response) {
				$scope.appData.transkvuotHtmlGetlist.splice($scope.appData.bankLoadDismissbysk2Ind, 1);
				$scope.convertArrToPie();
			}, function (error) {
			});
		}

		$scope.transkvuaGetpeulot = function (a) {
			if (!a.dataTable) {
				var data = {"trans_id": a.trans_id, "target_type_id": a.target_type_id};
				serverConnection.transkvuaGetpeulot(data).then(function (response) {
					$scope.appData.transkvuotHtmlGetlist.forEach(function (v) {
						if (v.trans_id == a.trans_id) {
							v.dataTable = response.sort(dmyOrdA);
						}
						else {
							v.dataTable = false;
						}
					})
					if ($scope.appData.peulotKvuot) {
						$scope.appData.peulotKvuot.forEach(function (v) {
							v.dataTable = false;
						})
					}
				}, function (error) {
				});
			}
			else {
				a.dataTable = false;
			}
		};

		$scope.transkvuaGetpeulotPop = function (a) {
			var data = {"trans_id": a.trans_id, "target_type_id": a.target_type_id};
			serverConnection.transkvuaGetpeulot(data).then(function (response) {
				$scope.appData.transkvuotHtmlGetlistPopTable = angular.copy(a);
				$scope.appData.transkvuotHtmlGetlistPopTable.dataTable = response;
				$scope.showPopup('views/templates/transkvuotHtmlGetlistPopTable.html?ver=3.80', 'transkvuotHtmlGetlistPopTable');
			}, function (error) {
			});
		};


		$scope.deleteAllRowFromTable2Pop = function (a) {
			if (a.checks) {
				$scope.appData.transkvuotHtmlGetlistPopTable.dataTable.forEach(function (v, index) {
					var data = {
						match_link_id: $scope.appData.transkvuotHtmlGetlistPopTable.match_link_id,
						trans_id: v.trans_id
					}
					serverConnection.pirukAthama(data).then(function (response) {

					}, function (error) {
					});
					if ($scope.appData.transkvuotHtmlGetlistPopTable.dataTable.length == (index + 1)) {
						$scope.appData.transkvuotHtmlGetlistPopTable.dataTable = false;
					}
				})
			}
			else {
				var pusharr = [];
				$scope.appData.transkvuotHtmlGetlistPopTable.dataTable.forEach(function (v, index) {
					if (!v.checks) {
						pusharr.push(v);
					}
					else {
						var data = {
							match_link_id: v.match_link_id,
							trans_id: a.trans_id
						}
						serverConnection.pirukAthama(data).then(function (response) {

						}, function (error) {
						});
					}
				});
				$scope.appData.transkvuotHtmlGetlistPopTable.dataTable = pusharr;
				if (pusharr.length == 0) {
					$scope.appData.transkvuotHtmlGetlistPopTable.dataTable = false;
				}
			}
		}
		$scope.deleteRowFromTable2Pop = function (dataTable, len, trans_id, bank_trans_id, match_link_id) {
			var data = {
				match_link_id: match_link_id,
				trans_id: trans_id
			}
			serverConnection.pirukAthama(data).then(function (response) {
				var i;
				dataTable.forEach(function (a, index) {
					if (a.bank_trans_id == bank_trans_id) {
						i = index;
					}
				});
				dataTable.splice(i, 1);
				if (len == 1) {
					$scope.appData.transkvuotHtmlGetlistPopTable.dataTable = false;
				}
			}, function (error) {
			});
		}

		$scope.bankLoadPeulotByskPop = function (a) {
			serverConnection.bankLoadPeulotBysk($scope.appData.selectedCompany.companyId, $scope.appData.selectedItem.company_account_id, a.searchkey_id).then(function (response) {
				$scope.appData.bankLoadPeulotByskPopTable = angular.copy(a);
				$scope.appData.bankLoadPeulotByskPopTable.dataTable = response;
				$scope.showPopup('views/templates/bankLoadPeulotByskPopTable.html?ver=3.80', 'transkvuotHtmlGetlistPopTable');
			}, function (error) {
			});
		};
		$scope.deleteAllRowFromTablePop = function (a) {
			if (a.checks) {
				$scope.appData.bankLoadPeulotByskPopTable.dataTable = false;
			}
			else {
				var pusharr = [];
				$scope.appData.bankLoadPeulotByskPopTable.dataTable.forEach(function (v) {
					if (!v.checks) {
						pusharr.push(v)
					}
				})
				$scope.appData.bankLoadPeulotByskPopTable.dataTable = pusharr;
				if (pusharr.length == 0) {
					$scope.appData.bankLoadPeulotByskPopTable.dataTable = false;
				}
			}
		}
		$scope.deleteRowFromTablePop = function (dataTable, len, searchkey_id, bank_trans_id) {
			var i;
			dataTable.forEach(function (a, index) {
				if (a.bank_trans_id == bank_trans_id) {
					i = index;
				}
			});
			dataTable.splice(i, 1);
			if (len == 1) {
				$scope.appData.bankLoadPeulotByskPopTable.dataTable = false;
			}
		}
		$scope.distinct = function (arr) {
			var direct_id = false,
				time = 1;
			arr.forEach(function (v) {
				if (v.direct_id !== null) {
					if (time == 1) {
						direct_id = v.direct_id;
						time = 0;
					}
					if (direct_id !== v.direct_id) {
						direct_id = false;
					}
				}
			})
			var data = {
				'direct_id': direct_id
			}
			return data;
		}
		$scope.setAppr = function (a) {
			if (a.avg_total.length == 0 || a.searchkey.length == 0) {
				$scope.showPopup('views/templates/peulotTextPop.html?ver=3.80', 'popAlert', true);
				setTimeout(function () {
					$scope.hidePopup();
				}, 2000)
			}
			else {
				$scope.daraTr = [];
				if (!a.dataTable) {
					serverConnection.bankLoadPeulotBysk($scope.appData.selectedCompany.companyId, $scope.appData.selectedItem.company_account_id, a.searchkey_id).then(function (response) {
						$scope.appData.peulotKvuot.forEach(function (v) {
							if (v.searchkey_id == a.searchkey_id) {
								$scope.dataTable = response;
							}
						})
						if ($scope.dataTable.length > 0) {
							$scope.dataTable.forEach(function (v) {
								var tr = {
									bank_trans_id: v.bank_trans_id,
									source_ind_expence: v.source_ind_expence,
									searchkey_id: v.searchkey_id
								}
								$scope.daraTr.push(tr)
							})
							$scope.dis = $scope.distinct($scope.dataTable);
						}

						$scope.sendAppr(a)
					}, function (error) {
					});
				}
				else {
					if (a.dataTable.length > 0) {
						a.dataTable.forEach(function (v) {
							var tr = {
								bank_trans_id: v.bank_trans_id,
								source_ind_expence: v.source_ind_expence,
								searchkey_id: v.searchkey_id
							}
							$scope.daraTr.push(tr)
						})
						$scope.dis = $scope.distinct(a.dataTable);
					}
					$scope.sendAppr(a)
				}
			}
		}

		$scope.sendAppr = function (a) {
			var intrans_type_id;
			if (a.ind_hova == false) {
				intrans_type_id = '7b94ad34-2bc1-4f4a-b905-a9f582a06179';
			}
			else {
				intrans_type_id = 'f605bc82-2921-4548-b09b-937c7baa1c2a';
			}

			var data = {
					"incompany_id": $scope.appData.selectedCompany.companyId,
					"incompany_branch_id": $scope.appData.selectedCompany.company_branch_id,
					"intrans_type_id": intrans_type_id,
					"intrans_name": a.searchkey,
					"inpayment_type": 40,
					"incompany_account_id": $scope.appData.selectedItem.company_account_id,
					"intotal": parseFloat(a.avg_total),
					"intrans_frequency_id": a.frequency,
					"intrans_date": a.max_trans_date,
					"intrans_expiration_date": null,
					"auto_update_type": 1,
					"peulot": $scope.daraTr,
					"ind_expence": (a.ind_hova) ? 1 : 0
				}
			var dataReq = data;

			if ($scope.dis && $scope.dis.direct_id !== false) {
				dataReq = angular.extend(data, $scope.dis.direct_id);
			}

			//if($scope.dis.kod_peula !== false){
			//    angular.extend(dst, src);
			//}

			serverConnection.transkvuotCreate(dataReq).then(function (response) {
				$scope.loadRefresh()
			}, function (error) {
			});
		}

		$scope.addPeula = function (type) {
			$scope.setPopDef();
			$scope.appData.EditDataPeula = false;
			if (type == 'ex') {
				$scope.showPopup('views/templates/expencePeula.html?'  + new Date().getTime(), 'popupAddPeula', false);
			}
			else {
				$scope.showPopup('views/templates/incomPeula.html?'  + new Date().getTime(), 'popupAddPeula', false);
			}
		}

		$scope.incomPeulaType17Send = function () {
			var autoUpdateType, zefiDayOfWeek, userTotal, zefiDayOfMonth, frequency;
			if ($scope.appData.setPopDef17.autoUpdateType == '1') {
				autoUpdateType = 1;
				zefiDayOfWeek = null;
				userTotal = null;
				zefiDayOfMonth = null;
				frequency = $scope.appData.setPopDef17.trans_frequency_id;
			}
			if ($scope.appData.setPopDef17.autoUpdateType == '4') {
				userTotal = $scope.appData.setPopDef17.intotal;
				autoUpdateType = 3;
				zefiDayOfWeek = null;
				zefiDayOfMonth = $scope.appData.setPopDef17.autoUpdateTypeDDMonth;
				frequency = 3;
			}
			if ($scope.appData.setPopDef17.autoUpdateType == '2') {
				userTotal = $scope.appData.setPopDef17.intotal;
				autoUpdateType = 3;
				zefiDayOfWeek = $scope.appData.setPopDef17.autoUpdateTypeDD;
				zefiDayOfMonth = null;
				frequency = 2;
			}
			if ($scope.appData.setPopDef17.autoUpdateType == '3') {
				autoUpdateType = 4;
				userTotal = null;
				zefiDayOfWeek = null;
				zefiDayOfMonth = null;
				frequency = null;
			}

			//autoUpdateType = $scope.appData.setPopDef17.updateSum
			var data = {
				insolek_id: $scope.appData.setPopDef17.trans_id,
				userTotal: userTotal,
				autoUpdateType: autoUpdateType,
				frequency: frequency,
				zefiDayOfWeek: zefiDayOfWeek,
				zefiDayOfMonth: zefiDayOfMonth
			}
			serverConnection.solek_calc_zefi(data).then(function (response) {
				$scope.hidePopup();
				$scope.loadRefresh()
			}, function (error) {
			});
		}

		$scope.changeText = function () {
			if ($scope.appData.setPopDef17.autoUpdateType == '2') {
				$scope.appData.setPopDef17.textUpdateSum1 = 'שבועי';
			}
			else {
				$scope.appData.setPopDef17.textUpdateSum1 = 'חודשי';
			}
		}

		$scope.loadEditPeula = function (a) {
			if (a.next_trans_date !== null) {
				var dateDayDef = new Date(parseFloat(a.next_trans_date.split('/')[2]), parseFloat(a.next_trans_date.split('/')[1]) - 1, parseFloat(a.next_trans_date.split('/')[0])).getDay();
				$scope.appData.dayNum = $scope.appData.radioDaysInweek[dateDayDef];
			}

			if (a.target_type_id !== 11 && a.target_type_id !== 9 && a.target_type_id !== 17) {
				$scope.appData.EditDataPeula = false;
				$scope.showPopup('views/templates/peulotNotEdit.html?ver=3.80', 'popAlert', true);
				setTimeout(function () {
					$scope.hidePopup();
				}, 2000)
			}
			else {
				if (a.target_type_id == 17) {
					var updateSum;
					if (a.auto_update_type && a.auto_update_type !== null) {
						updateSum = a.auto_update_type.toString();
					}
					else {
						updateSum = '1';
					}

					// if (a.zefi_day_of_week !== undefined && a.zefi_day_of_week !== null) {
					// 	$scope.appData.setPopDef17 = {
					// 		autoUpdateType: '2',
					// 		intrans_name: a.trans_name,
					// 		intotal: a.next_total,
					// 		autoUpdateTypeDD: a.zefi_day_of_week,
					// 		autoUpdateTypeDDMonth: "1",
					// 		updateSum: updateSum,
					// 		trans_id: a.trans_id,
					// 		textUpdateSum1: 'שבועי',
					// 		trans_frequency_id: a.trans_frequency_id
					// 	};
					// }
					// else {
					// 	if (a.auto_update_type == 4) {
					// 		$scope.appData.setPopDef17 = {
					// 			autoUpdateType: '3',
					// 			intrans_name: a.trans_name,
					// 			intotal: a.next_total,
					// 			autoUpdateTypeDD: '1',
					// 			autoUpdateTypeDDMonth: "1",
					// 			updateSum: '1',
					// 			trans_id: a.trans_id,
					// 			textUpdateSum1: 'חודשי',
					// 			trans_frequency_id: a.trans_frequency_id
					// 		};
					// 	}
					// 	else {
					// 		$scope.appData.setPopDef17 = {
					// 			autoUpdateType: '1',
					// 			intrans_name: a.trans_name,
					// 			intotal: a.next_total,
					// 			autoUpdateTypeDD: '1',
					// 			autoUpdateTypeDDMonth: "1",
					// 			updateSum: updateSum,
					// 			trans_id: a.trans_id,
					// 			textUpdateSum1: 'חודשי',
					// 			trans_frequency_id: a.trans_frequency_id
					// 		};
					// 	}
					// }
					$scope.appData.setPopDef17 = {
						autoUpdateType: '1',
						intrans_name: a.trans_name,
						intotal: 0,
						autoUpdateTypeDD: "1",
						autoUpdateTypeDDMonth: "1",
						updateSum: updateSum,
						trans_id: a.trans_id,
						textUpdateSum1: '',
						trans_frequency_id: a.trans_frequency_id
					};
					$scope.appData.setPopDef17.disabledOption1 = false;
					if (a.slika_type == 2 || a.slika_type == 3) {
						$scope.appData.setPopDef17.autoUpdateType = "1";
					}
					else if (a.slika_type == 5) {
						$scope.appData.setPopDef17.autoUpdateType = "4";
						$scope.appData.setPopDef17.autoUpdateTypeDDMonth = a.zefi_day_of_month;
						$scope.appData.setPopDef17.intotal = a.user_total;
					}
					else if (a.slika_type == 4) {
						$scope.appData.setPopDef17.autoUpdateType = "2";
						$scope.appData.setPopDef17.autoUpdateTypeDD = a.zefi_day_of_week;
						$scope.appData.setPopDef17.intotal = a.user_total;
					}
					else if (a.slika_type == 1) {
						$scope.appData.setPopDef17.autoUpdateType = "3";
					}
					else if (a.slika_type == 6) {
						$scope.appData.setPopDef17.disabledOption1 = true;
					}

					$scope.showPopup('views/templates/incomPeulaType17.html?ver=3.80', 'incomPeulaType17', false);
				}
				else {
					if (a.target_type_id == 11) {
						$scope.appData.disabledEditPeula = false;
					}
					else {
						$scope.appData.disabledEditPeula = true;
					}
					$scope.appData.EditDataPeula = a;
					var trans_expiration_date = '', opt = 'option1';
					if (a.trans_expiration_date !== null) {
						trans_expiration_date = a.trans_expiration_date;
						opt = 'option3';
					}
					var daysMonthPeulot = '1';
					if (a.trans_frequency_id == 3) {
						if (a.trans_date !== null) {
							daysMonthPeulot = parseInt(a.trans_date.split('/')[0]).toString();
						}
						else {
							daysMonthPeulot = "1";
						}
					}
					$scope.appData.setPopDef = {
						payNum: a.auto_update_type.toString(),
						intrans_name: a.trans_name,
						intotal: a.next_total,
						inpayment_type: a.payment_type_id.toString(),
						intrans_frequency_id: a.trans_frequency_id.toString(),
						daysMonthPeulot: daysMonthPeulot,
						fromDateFr: a.trans_date,
						option3: trans_expiration_date,
						option2: '',
						optionSelect: opt
					};

					if (a.target_type_id == 11) {
						if (a.ind_expense == 1) {
							$scope.appData.defTypeEx = a.trans_type_id;
							$scope.appData.defTypeNameEx = a.trans_type_name;
							$scope.showPopup('views/templates/expencePeula.html?ver=3.80', 'popupAddPeula', false);
						}
						else {
							$scope.appData.defTypeIn = a.trans_type_id;
							$scope.appData.defTypeNameIn = a.trans_type_name;
							$scope.showPopup('views/templates/incomPeula.html?ver=3.80', 'popupAddPeula', false);
						}
					}
					else {
						if (a.ind_expense == 1) {
							$scope.appData.defTypeEx = a.trans_type_id;
							$scope.appData.defTypeNameEx = a.trans_type_name;
							$scope.showPopup('views/templates/expencePeula.html?ver=3.80', 'popupAddPeula-small', false);
						}
						else {
							$scope.appData.defTypeIn = a.trans_type_id;
							$scope.appData.defTypeNameIn = a.trans_type_name;
							$scope.showPopup('views/templates/incomPeula.html?ver=3.80', 'popupAddPeula-small', false);
						}
					}
				}

			}
		}

		$scope.addPeulaSend = function (defTypeIn, typeEx) {
			$scope.hidePopup();

			var intrans_date, intrans_expiration_date;
			if ($scope.appData.setPopDef.optionSelect == 'option1') {
				intrans_expiration_date = null;
			}
			if ($scope.appData.setPopDef.optionSelect == 'option3') {
				intrans_expiration_date = parseFloat($scope.appData.setPopDef.option3.split('/')[2] + '' + $scope.appData.setPopDef.option3.split('/')[1] + '' + $scope.appData.setPopDef.option3.split('/')[0]);
			}

			if ($scope.appData.setPopDef.intrans_frequency_id == '1') {
				var a = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
				intrans_date = parseFloat(a.getFullYear() + '' + ("0" + (a.getMonth() + 1)).slice(-2) + '' + ("0" + a.getDate()).slice(-2));

				if ($scope.appData.setPopDef.optionSelect == 'option2') {
					var a = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1 + parseFloat($scope.appData.setPopDef.option2));
					intrans_expiration_date = parseFloat(a.getFullYear() + '' + ("0" + (a.getMonth() + 1)).slice(-2) + '' + ("0" + a.getDate()).slice(-2));
				}
			}
			if ($scope.appData.setPopDef.intrans_frequency_id == '2') {
				intrans_date = $scope.appData.dayNum;
				var dayInweeks = parseFloat($scope.appData.setPopDef.option2) * 7;
				if ($scope.appData.setPopDef.optionSelect == 'option2') {
					var a = new Date(parseInt($scope.appData.dayNum.toString().substring(0, 4)), parseInt($scope.appData.dayNum.toString().substring(4, 6)) - 1, parseInt($scope.appData.dayNum.toString().substring(6, 8)) + dayInweeks);
					intrans_expiration_date = parseFloat(a.getFullYear() + '' + ("0" + (a.getMonth() + 1)).slice(-2) + '' + ("0" + a.getDate()).slice(-2));
				}
			}
			if ($scope.appData.setPopDef.intrans_frequency_id == '3') {
				var monthThis;
				if (new Date().getDate() < parseInt($scope.appData.setPopDef.daysMonthPeulot)) {
					monthThis = new Date().getMonth();
					intrans_date = parseFloat(new Date().getFullYear() + '' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '' + ("0" + parseInt($scope.appData.setPopDef.daysMonthPeulot)).slice(-2));
				}
				else {
					monthThis = new Date().getMonth() + 1;
					var a = new Date(new Date().getFullYear(), new Date().getMonth() + 1, parseInt($scope.appData.setPopDef.daysMonthPeulot));
					intrans_date = parseFloat(a.getFullYear() + '' + ("0" + (a.getMonth() + 1)).slice(-2) + '' + ("0" + a.getDate()).slice(-2));
				}
				var monthSum = parseFloat($scope.appData.setPopDef.option2);
				if ($scope.appData.setPopDef.optionSelect == 'option2') {
					var a = new Date(new Date().getFullYear(), monthThis + monthSum, parseInt($scope.appData.setPopDef.daysMonthPeulot));
					intrans_expiration_date = parseFloat(a.getFullYear() + '' + ("0" + (a.getMonth() + 1)).slice(-2) + '' + ("0" + a.getDate()).slice(-2));
				}
			}
			if ($scope.appData.setPopDef.intrans_frequency_id == '4') {
				intrans_date = parseFloat($scope.appData.setPopDef.fromDateFr.split('/')[2] + '' + $scope.appData.setPopDef.fromDateFr.split('/')[1] + '' + $scope.appData.setPopDef.fromDateFr.split('/')[0]);
				var monthSum = parseFloat($scope.appData.setPopDef.option2) * 2;
				if ($scope.appData.setPopDef.optionSelect == 'option2') {
					var a = new Date(parseInt($scope.appData.setPopDef.fromDateFr.split('/')[2]), (parseInt($scope.appData.setPopDef.fromDateFr.split('/')[1]) - 1) + monthSum, parseInt($scope.appData.setPopDef.fromDateFr.split('/')[0]));
					intrans_expiration_date = parseFloat(a.getFullYear() + '' + ("0" + (a.getMonth() + 1)).slice(-2) + '' + ("0" + a.getDate()).slice(-2));
				}
			}
			if ($scope.appData.setPopDef.intrans_frequency_id == '5') {
				intrans_date = parseFloat($scope.appData.setPopDef.fromDateFr.split('/')[2] + '' + $scope.appData.setPopDef.fromDateFr.split('/')[1] + '' + $scope.appData.setPopDef.fromDateFr.split('/')[0]);
				var monthSum = parseFloat($scope.appData.setPopDef.option2) * 3;
				if ($scope.appData.setPopDef.optionSelect == 'option2') {
					var monthParse = parseFloat($scope.appData.setPopDef.fromDateFr.split('/')[1]), quarter;
					if (monthParse == 1 || monthParse == 2 || monthParse == 3) {
						quarter = 2;
					}
					if (monthParse == 4 || monthParse == 5 || monthParse == 6) {
						quarter = 5;
					}
					if (monthParse == 7 || monthParse == 8 || monthParse == 9) {
						quarter = 8;
					}
					if (monthParse == 10 || monthParse == 11 || monthParse == 12) {
						quarter = 11;
					}
					var a = new Date(parseInt($scope.appData.setPopDef.fromDateFr.split('/')[2]), quarter + monthSum, 1);
					intrans_expiration_date = parseFloat(a.getFullYear() + '' + ("0" + (a.getMonth() + 1)).slice(-2) + '' + ("0" + a.getDate()).slice(-2));
				}
			}
			if ($scope.appData.setPopDef.intrans_frequency_id == '6') {
				intrans_date = parseFloat($scope.appData.setPopDef.fromDateFr.split('/')[2] + '' + $scope.appData.setPopDef.fromDateFr.split('/')[1] + '' + $scope.appData.setPopDef.fromDateFr.split('/')[0]);
				var monthSum = parseFloat($scope.appData.setPopDef.option2) * 12;
				if ($scope.appData.setPopDef.optionSelect == 'option2') {
					var a = new Date(parseInt($scope.appData.setPopDef.fromDateFr.split('/')[2]), (parseInt($scope.appData.setPopDef.fromDateFr.split('/')[1]) - 1) + monthSum, parseInt($scope.appData.setPopDef.fromDateFr.split('/')[0]));
					intrans_expiration_date = parseFloat(a.getFullYear() + '' + ("0" + (a.getMonth() + 1)).slice(-2) + '' + ("0" + a.getDate()).slice(-2));
				}
			}

			if (!$scope.appData.EditDataPeula) {
				var data = {
					"incompany_id": $scope.appData.selectedCompany.companyId,
					"incompany_branch_id": $scope.appData.selectedCompany.company_branch_id,
					"intrans_type_id": defTypeIn,
					"intrans_name": $scope.appData.setPopDef.intrans_name,
					"inpayment_type": parseFloat($scope.appData.setPopDef.inpayment_type),
					"incompany_account_id": $scope.appData.selectedItem.company_account_id,
					"intotal": parseFloat($scope.appData.setPopDef.intotal),
					"intrans_frequency_id": parseFloat($scope.appData.setPopDef.intrans_frequency_id),
					"intrans_date": parseFloat(intrans_date),
					"intrans_expiration_date": intrans_expiration_date, // null
					"auto_update_type": parseFloat($scope.appData.setPopDef.payNum),
					"peulot": [],
					"ind_expence": typeEx
				}
				serverConnection.transkvuotCreate(data).then(function (response) {
					$scope.loadRefresh()
				}, function (error) {
				});
			}
			else {
				var data = {
					"transId": $scope.appData.EditDataPeula.trans_id,
					"transTypeId": defTypeIn,
					"companyId": $scope.appData.selectedCompany.companyId,
					"transDate": parseFloat(intrans_date),
					"transName": $scope.appData.setPopDef.intrans_name,
					"transTotal": parseFloat($scope.appData.setPopDef.intotal),
					"transFrequencyId": parseFloat($scope.appData.setPopDef.intrans_frequency_id),
					"paymentTypeId": parseFloat($scope.appData.setPopDef.inpayment_type),
					"companyAccountId": $scope.appData.EditDataPeula.company_account_id,
					"transExpirationDate": intrans_expiration_date,
					"indExpense": $scope.appData.EditDataPeula.ind_expense,
					"targetTypeId": $scope.appData.EditDataPeula.target_type_id,
					"autoUpdateType": parseFloat($scope.appData.setPopDef.payNum)
				};
				serverConnection.transkvuotCreateEdit(data).then(function (response) {
					$scope.loadRefresh()
				}, function (error) {
				});
			}
		}

		$scope.convertArrToPie = function () {
			var tool = function tooltip() {
				var str = '<div class="top-chart-pie">';
				str = str + '<div>' + this.key + '</div>';
				str = str + '<div><span>&#8362;</span>' + $scope.getTotal(this.y) + '</div>';
				str = str + '</div>';
				return str;
			}
			var arrColor1 = [];
			for (var i = 1; i < 20; i++) {
				var color = 'rgb(207,' + (42 + (i * 9)) + ',' + (81 + (i * 9)) + ')'
				arrColor1.push(color)
			}
			var arrColor = [];
			for (var i = 1; i < 20; i++) {
				var color = 'rgb(35,' + (128 + (i * 12)) + ',' + (16 + (i * 12)) + ')'
				arrColor.push(color)
			}
			var obj = {
				data: [],
				graph: [],
				tooltip: tool,
				title: 'הכנסות',
				colors: arrColor
			}
			var obj1 = {
				data: [],
				graph: [],
				tooltip: tool,
				title: 'הוצאות',
				colors: arrColor1
			}
			$scope.appData.transkvuotHtmlGetlist.forEach(function (v, ind) {
				if (v.ind_expense == 0) {
					var dataObj = {
						name: v.trans_name,
						y: v.next_total
					};
					obj.data.push(dataObj);
					var graph = {
						trans_name: v.trans_name,
						next_total: v.next_total,
						hodesh1: v.hodesh1,
						hodesh2: v.hodesh2,
						hodesh3: v.hodesh3,
						memuza_hodesh1: v.memuza_hodesh1,
						memuza_hodesh2: v.memuza_hodesh2,
						memuza_hodesh3: v.memuza_hodesh3,
						trans_frequency_id: v.trans_frequency_id
					}
					obj.graph.push(graph);
				}
				if (v.ind_expense == 1) {
					var dataObj = {
						name: v.trans_name,
						y: v.next_total
					};
					obj1.data.push(dataObj)
					var graph = {
						trans_name: v.trans_name,
						next_total: v.next_total,
						hodesh1: v.hodesh1,
						hodesh2: v.hodesh2,
						hodesh3: v.hodesh3,
						memuza_hodesh1: v.memuza_hodesh1,
						memuza_hodesh2: v.memuza_hodesh2,
						memuza_hodesh3: v.memuza_hodesh3,
						trans_frequency_id: v.trans_frequency_id
					}
					obj1.graph.push(graph);
				}
			});
			$scope.appData.pieInPeulot = obj;
			$scope.appData.pieExPeulot = obj1;
			$scope.appData.pieInPeulot.data.sort(function (a, b) {
				return b.y - a.y;
			});
			$scope.appData.pieExPeulot.data.sort(function (a, b) {
				return b.y - a.y;
			});
			$scope.appData.pieInPeulot.graph.sort(function (a, b) {
				return b.next_total - a.next_total;
			});
			$scope.appData.pieExPeulot.graph.sort(function (a, b) {
				return b.next_total - a.next_total;
			});
			$scope.appData.sumPeulotIn = $scope.appData.pieInPeulot.graph.reduce(function (sum, value) {
				var next_total = value.next_total;
				if (value.trans_frequency_id == 1) {
					next_total = (next_total * 30.43685);
				}
				if (value.trans_frequency_id == 2) {
					next_total = (next_total * 4.3);
				}
				if (value.trans_frequency_id == 4) {
					next_total = (next_total / 2);
				}
				if (value.trans_frequency_id == 5) {
					next_total = (next_total / 3);
				}
				if (value.trans_frequency_id == 6) {
					next_total = (next_total / 12);
				}
				sum = sum + next_total;
				return sum
			}, 0);
			$scope.appData.sumPeulotEx = $scope.appData.pieExPeulot.graph.reduce(function (sum, value) {
				var next_total = value.next_total;
				if (value.trans_frequency_id == 1) {
					next_total = (next_total * 30.43685);
				}
				if (value.trans_frequency_id == 2) {
					next_total = (next_total * 4.3);
				}
				if (value.trans_frequency_id == 4) {
					next_total = (next_total / 2);
				}
				if (value.trans_frequency_id == 5) {
					next_total = (next_total / 3);
				}
				if (value.trans_frequency_id == 6) {
					next_total = (next_total / 12);
				}
				sum = sum + next_total;
				return sum
			}, 0);

		};
		$scope.setColor = function (index) {
			var arr = [], len = $scope.appData.pieInPeulot.data.length;
			for (var i = 0; i < len; i++) {
				if (index == i) {
					arr.push($scope.appData.pieInPeulot.colors[index])
				}
				else {
					arr.push('#DADADA')
				}
			}
			return arr;
		}
		$scope.setColor1 = function (index) {
			var arr = [], len = $scope.appData.pieExPeulot.data.length;
			for (var i = 0; i < len; i++) {
				if (index == i) {
					arr.push($scope.appData.pieExPeulot.colors[index])
				}
				else {
					arr.push('#DADADA')
				}
			}
			return arr;
		}
		$scope.loadRefresh = function () {
			$scope.loadData();
		}
		$scope.graphSet = function (a) {
			var arr = [];
			if (a.hodesh1 !== null) {
				arr.push(a.memuza_hodesh1);
			}
			if (a.hodesh2 !== null) {
				arr.push(a.memuza_hodesh2);
			}
			if (a.hodesh3 !== null) {
				arr.push(a.memuza_hodesh3);
			}
			return Math.max.apply(Math, arr);
		}
		$scope.changeTotal = function () {
			if ($scope.appData.EditDataPeula) {
				$scope.appData.setPopDef.payNum = '3';
			}
		}
		$scope.dateShort = function (num) {
			return parseInt(num.toString().substring(4, 6)) + '/' + num.toString().substring(2, 4);
		}
		$scope.sort_by = function (predicate, predicate1) {
			$scope.predicate = predicate;
			$scope.predicate1 = predicate1;
			$scope.reverse = !$scope.reverse;
		};
		$scope.refresh = function () {
			$scope.loadData();
		};
		$scope.$on('refresh', function () {
			$scope.refresh();
		});
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
			$scope.showPopup('views/templates/mailerregularOp.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.help = function () {
			window.open('http://bizibox.biz/help/cashflowdetailed', '_blank');
		};
	}


	angular.module('controllers')
	.controller('regularOpCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$anchorScroll', regularOpCtrl]);
}());
