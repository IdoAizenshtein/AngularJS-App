(function () {
	function mainAccountantsCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(5);
		$scope.date = new Date();
		$scope.appData.loaderAccMain = false;
		var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
		function dmyOrdA(a, b) {
			a = a.date_value.replace(dateRE, "$3$2$1");
			b = b.date_value.replace(dateRE, "$3$2$1");
			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		}
		$scope.init = function () {
			$scope.loadAccMainPage();
		}
		if ($scope.appData.listCom) {
			$scope.appData.loaderAccMain = true;
		}
		$scope.scrollHeightTable = 290;
		$scope.maxSize = 10;
		$scope.openMoreNav = false;
		if (localStorage.getItem('userAccName')) {
			$scope.appData.userAccName = localStorage.getItem('userAccName');
		}
		if (localStorage.getItem('userAccNameUsers')) {
			$scope.appData.userAccNameUsers = localStorage.getItem('userAccNameUsers');
		}
		$scope.openMoreNavScroll = function () {
			$scope.openMoreNav = !$scope.openMoreNav;
			if ($scope.openMoreNav) {
				$scope.scrollHeightTable = 350;
			}
			else {
				$scope.scrollHeightTable = 290;
			}
		}
		$scope.$parent.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			if (!$scope.appData.selectedCompanyIndexLink) {
				if ($scope.appData.selectedCompany.hanhahPrivilege == true) {
					$state.go('overviewAcc.statistics');
				}
				else {
					$state.go('overviewAcc.ksafim');
				}
			}
			$scope.appData.selectedCompanyIndexLink = false;
		};
		$scope.loadAccMainPage = function () {
			$scope.appData.loaderAccMain = false;
			serverConnection.getDataMainAcc().then(function (res) {
				$scope.appData.listCom = res.graphTab;
				$scope.appData.listCom.forEach(function (t) {
					t.impGraphList.sort(dmyOrdA);
					var x, y;
					x = [], y = [];
					t.impGraphList.forEach(function (t1, ii1) {
						var month = parseInt(t1.month_id.toString().substr(4, 2));
						var date_year = t1.month_id.toString().substr(2, 2);
						var item = month + '/' + date_year;
						if (ii1 < 8) {
							x.push(item);
							y.push(t1.imp_match_count)
						}
					});
					t.impGraphListAll = [x, y];
				})

				$scope.appData.filteredItems = res.graphTab.length;
				$scope.appData.totalItems = res.graphTab.length;
				$scope.appData.listTitles = {
					xFrom: res.xFrom,
					currmonthMaamPayCount: res.currmonthMaamPayCount,
					xIs: res.xIs,
					currmonthMaamPayCountNot: res.currmonthMaamPayCount - res.xIs,
					export_status_big: 0,
					token_status: 0,
					export_status: 0,
					last_export_status_have: 0,
					export_status_null: 0,
					token_status_have: 0,
					token_status_zero: 0,
					token_status_null: 0,
					status2: 0,
					statusbig100: 0
				}
				if (res.graphTab.length > 0) {
					function convertDate(date) {
						if (date) {
							return parseFloat(date.split('/')[2] + date.split('/')[1] + date.split('/')[0])
						}
					}

					$scope.appData.listCom.forEach(function (v) {
						if (v.last_export_status == 2) {
							$scope.appData.listTitles.status2++;
						}
						if (v.last_export_status > 0 && v.last_export_status !== 2) {
							$scope.appData.listTitles.export_status_big++;
						}
						if (v.last_export_status >= 0 && v.last_export_status !== null) {
							$scope.appData.listTitles.last_export_status_have++;
						}
						if (v.token_status > 0 && v.token_status < 100) {
							$scope.appData.listTitles.token_status++;
						}
						if (v.token_status == 0) {
							$scope.appData.listTitles.token_status_zero++;
						}
						if (v.token_status > 100) {
							$scope.appData.listTitles.statusbig100++;
						}
						if (v.token_status >= 0 && v.token_status !== null) {
							$scope.appData.listTitles.token_status_have++;
						}
						if (v.token_status == null || v.token_status == undefined) {
							$scope.appData.listTitles.token_status_null++;
						}
						if (v.last_export_status == 0) {
							$scope.appData.listTitles.export_status++;
						}
						if (v.last_export_status == null || v.last_export_status == undefined) {
							$scope.appData.listTitles.export_status_null++;
						}
						v.dateSort = convertDate(v.last_inv_date);
						if (v.token_status !== null) {
							v.sort_token_status = v.token_status;
						}
						else {
							v.sort_token_status = -1;
						}
						if (v.last_export_status !== null) {
							v.sort_last_export_status = v.last_export_status;
						}
						else {
							v.sort_last_export_status = -1;
						}
					});

					$scope.sort_by('dateSort');
					$scope.reverse = true;
				}
				$scope.appData.loaderAccMain = true;

			}, function (error) {

			});
		};
		$scope.typesFilters = {
			xFrom: true,
			currmonthMaamPayCount: false,
			xIs: false,
			currmonthMaamPayCountNot: false,
			export_status_big: false,
			token_status: false,
			export_status: false,
			last_export_status_have: false,
			export_status_null: false,
			token_status_have: false,
			token_status_zero: false,
			token_status_null: false,
			status2: false,
			statusbig100: false
		};
		$scope.currentPage = 1; //current page
		if (!localStorage.getItem('entryLimit')) {
			$scope.entryLimit = 50;
			localStorage.setItem('entryLimit', $scope.entryLimit)
		}
		else {
			$scope.entryLimit = parseFloat(localStorage.getItem('entryLimit'));
		}
		$scope.entryLimitChange = function () {
			localStorage.setItem('entryLimit', $scope.entryLimit)
		}
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};
		$scope.filter = function () {
			$timeout(function () {
				$scope.appData.filteredItems = $scope.appData.filteredMainAccAll.length;
			}, 10);
		};
		$scope.typesFiltersActive = function (type) {
			var y, active = 0;
			for (y in $scope.appData.listTitles) {
				if (y == type) {
					if ($scope.appData.listTitles[y] !== 0) {
						active = 1;
					}
				}
			}
			if (active == 1) {
				var x;
				for (x in $scope.typesFilters) {
					if (x !== type) {
						$scope.typesFilters[x] = false;
					}
					else {
						$scope.typesFilters[x] = true;
					}
				}
			}
		};
		$scope.arrsSorting = [];
		$scope.sort_by = function (predicate) {
			var isObj = 0;
			if ($scope.arrsSorting.length > 0) {
				$scope.arrsSorting.forEach(function (v) {
					if (v == predicate) {
						isObj = 1;
					}
				})
			}
			if (isObj == 0) {
				if (predicate == 'sort_token_status' || predicate == 'sort_last_export_status') {
					$scope.reverse = false;
				}
				else {
					$scope.reverse = true;
				}
				$scope.arrsSorting.push(predicate)
			}
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		};
		$scope.updateAccountPassword = function (item) {
			var tok = item.token;
			$scope.appData.popupType = 0;
			$scope.appData.popupTypeLink = true;
			$scope.appData.popupDataToken = tok;
			$scope.appData.popupDataBanks = {BankNumber: item.bank_id};
			$scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.80' + new Date().getTime(), 'accountUpdatePasswordPopup');
		};
		$scope.editAlerts = function (acc, id) {
			$scope.appData.editAlertsHash = {
				'acc': acc,
				'id': id,
				'edit': false
			}

			$scope.showPopup('views/templates/editExHashMain.html?ver=3.80', 'exHashEditPop');
		}
		$scope.sendApprHash = function () {
			var data = {
				companyAccountId: $scope.appData.editAlertsHash.acc.last_export_account_id,
				desc: $scope.appData.editAlertsHash.acc.explain_desc,
				izu_cust_id: null,
				last_export_status: null
			}
			serverConnection.hashUpdateExpExplain(data).then(function (res) {
				$scope.hidePopup();
			}, function (error) {

			});
		}
		$scope.sendCheckHash = function () {
			serverConnection.hashMakeExample($scope.appData.editAlertsHash.id).then(function (res) {

			}, function (error) {

			});
		}
		$scope.$parent.refresh = function () {
			$scope.loadAccMainPage()
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
		$scope.userGetAccountants = function () {
			$scope.appData.listUserAccountantsLoader = true;
			$scope.showPopup('views/templates/setAccUser.html?ver=3.80', 'setAccUser setAccUserWide');
			serverConnection.userGetAccountants().then(function (res) {
				$scope.appData.listUserAccountants = res;
				$scope.appData.listUserAccountants.forEach(function (v) {
					v.fullName = v.first_name + ' ' + v.last_name;
				})
				$scope.appData.listUserAccountantsLoader = false;
			}, function (error) {

			});
		}
		$scope.getRegularUsers = function () {
			$scope.appData.listUserAccountantsLoader = true;
			$scope.showPopup('views/templates/setAccUsersRegular.html?ver=3.80', 'setAccUser');
			serverConnection.getRegularUsers().then(function (res) {
				$scope.appData.listUserRegAccountants = res;
				$scope.appData.listUserAccountantsLoader = false;
			}, function (error) {

			});
		}
		$scope.getAllDeletedCompany = function () {
			$scope.showPopup('views/templates/showPopPasswordFormMainAcc.html?ver=3.80' + new Date().getTime(), 'showPopPasswordForm', true);
		}
		$scope.checkpopPasswordCompaiesTab = function (showPopPasswordForm) {
			if (showPopPasswordForm.$valid) {
				$scope.hidePopup();

				$scope.appData.listAllDeletedCompanyLoader = true;
				$scope.showPopup('views/templates/setAccCompanyDeletedUser.html?ver=3.80', 'setAccCompanyDeletedUser');
				serverConnection.get_all_deleted_company().then(function (res) {
					$scope.appData.listAllDeletedCompany = res;
					$scope.appData.listAllDeletedCompanyLoader = false;
				}, function (error) {
					$scope.appData.listAllDeletedCompanyLoader = false;
					$scope.hidePopup();
				});
			}
		};
		$scope.setDeletedCompany = function () {
			$scope.appData.setDeletedCompanyList = JSON.parse($scope.appData.setDeletedCompanyList);
			$scope.hidePopup();
			$scope.showPopup('views/templates/setAccCompanyDeletedDate.html?ver=3.80', 'setAccCompanyDeletedDate');
		}

		$scope.companyUndeleted = function () {
			$scope.appData.listAllDeletedCompanyLoader = true;
			var expartion_date = null;
			if ($scope.appData.dateSelectedDelete !== "null") {
				expartion_date = $scope.appData.datePickerInlineDeletedComapny;
			}
			var data = {
				expartion_date: expartion_date,
				comapny_id: $scope.appData.setDeletedCompanyList.COMPANY_ID
			}
			serverConnection.company_undeleted(data).then(function (res) {
				$scope.appData.listAllDeletedCompanyLoader = false;
				$scope.hidePopup();
			}, function (error) {
				$scope.appData.listAllDeletedCompanyLoader = false;
				$scope.hidePopup();
			});
		}
		$scope.userCopypriv = function (reg) {
			var users;
			if (reg) {
				users = JSON.parse($scope.appData.setUserNameAccList).USER_ID;
			}
			else {
				users = JSON.parse($scope.appData.setUserNameAccList).user_id;
			}
			serverConnection.userCopypriv(users).then(function (res) {
				$scope.hidePopup();
				if (res == 0) {
					if (JSON.parse($scope.appData.setUserNameAccList).first_name) {
						var users = JSON.parse($scope.appData.setUserNameAccList).first_name + ' ' + JSON.parse($scope.appData.setUserNameAccList).last_name;
						$scope.appData.userAccName = users;
						$scope.appData.userAccNameUsers = "";
						localStorage.setItem('userAccName', users);
						localStorage.removeItem('userAccNameUsers');
					}
					if (JSON.parse($scope.appData.setUserNameAccList).NAME) {
						localStorage.setItem('userAccNameUsers', JSON.parse($scope.appData.setUserNameAccList).NAME);
						$scope.appData.userAccNameUsers = JSON.parse($scope.appData.setUserNameAccList).NAME;
						$scope.appData.userAccName = "";
						localStorage.removeItem('userAccName');
					}

					if (reg) {
						localStorage.setItem('ACCOUNTANT_OFFICE_ID', '');
					} else {
						if (JSON.parse($scope.appData.setUserNameAccList).accountant_office_id) {
							localStorage.setItem('ACCOUNTANT_OFFICE_ID', JSON.parse($scope.appData.setUserNameAccList).accountant_office_id);
						} else {
							localStorage.setItem('ACCOUNTANT_OFFICE_ID', '');
						}
					}
					// if (localStorage.getItem('userAccName')) {
					// 	$scope.appData.userAccName = localStorage.getItem('userAccName');
					// 	$scope.appData.userAccNameUsers = "";
					// }
					// if (localStorage.getItem('userAccNameUsers')) {
					// 	$scope.appData.userAccName = "";
					// 	$scope.appData.userAccNameUsers = localStorage.getItem('userAccNameUsers');
					// }
					$q.all([$scope.getGeneralDataCompanies(), $scope.getGeneralDataPermission()]).then(function (data) {
						$scope.appData.companies = data[0];
						$scope.appData.defMonth = data[1];
						try {
							if (($scope.appData.defMonth.biziboxRole === 'REPRESENTATIVE' || $scope.appData.defMonth.biziboxRole === 'REPRESENTATIVE_MANAGER') && $scope.appData.adminSoft) {
								$scope.appData.defMonth.hideCompanyName = true;
							} else {
								$scope.appData.defMonth.hideCompanyName = false;
							}
						} catch (e) {

						}
						if (!$scope.appData.adminSoft && $scope.appData.defMonth.bizibox_employee === 1) {
							$scope.logout();
							return;
						}
						if ($scope.appData.companies.length == 1) {
							setTimeout(function () {
								$scope.goToLink($scope.appData.companies[0].companyId, 'businessInfo')
							}, 500)
						}
						else {
							$scope.loadAccMainPage()
						}
					});
				}
			}, function (error) {

			});
		}
		$scope.refresh = function () {
			$scope.loadAccMainPage()
		};
		$rootScope.$on('refresh', function () {
			$scope.refresh();
		});
		$scope.Showhelp = false;
		$scope.ShowhelpFade = true;
		$scope.$parent.help = function () {
			$scope.Showhelp = true;
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
			$scope.showPopup('views/templates/mailerMainAcc.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});
	}


	angular.module('controllers')
	.controller('mainAccountantsCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', mainAccountantsCtrl]);
}());
