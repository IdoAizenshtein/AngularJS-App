(function () {
	function companysCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $anchorScroll, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.$utils = utils;
		$scope.accoConversions = accoConversions;
		$scope.appData = AppData;
		$scope.nextPage = $state.params.url;
		$scope.months = utils.monthNames();
		$scope.years = utils.yearsKsafim(3);
		$scope.date = new Date();
		var orderBy = $filter('orderBy');

		$scope.init = function () {
			$scope.loaderListCompanys = false;
			$scope.loadPage();
		};

		$scope.selectCompanySort = [
			{
				type: 'abc',
				val: 'לפי סדר א’-ב’'
			},
			{
				type: 'dateLast',
				val: 'תאריך הקלדה אחרון'
			},
			{
				type: 'unEnteredMonth',
				val: 'לא הוקלדו החודש'
			},
			{
				type: 'enteredMonth',
				val: 'הוקלדו החודש'
			}
		];
		$scope.selectCompanyTypeSort = $scope.selectCompanySort[0].type;

		$scope.$parent.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			if (!$scope.appData.selectedCompanyIndexLink) {
				if ($scope.appData.selectedCompany.hanhahPrivilege == true) {
					$state.go('overviewAcc.statistics');
				}
				else{
					$state.go('overviewAcc.ksafim');
				}
			}
			$scope.appData.selectedCompanyIndexLink = false;
		};

		$scope.loadPage = function () {
			$scope.loaderListCompanys = false;
			serverConnection.loadCompanysList().then(function (res) {
				$scope.appData.companysList = res;
				$scope.appData.companyTable = angular.copy($scope.appData.companysList);
				$scope.appData.companyTable.forEach(function (v) {
					if (v.last_inv_date)
						v.last_inv_date_sort = v.last_inv_date.split('/')[2] + '' + v.last_inv_date.split('/')[1] + '' + v.last_inv_date.split('/')[0];
				});
				$scope.order = function (predicate, reverse) {
					$scope.clsHref = predicate;
					$scope.appData.companyTable = orderBy($scope.appData.companyTable, predicate, reverse);
				};
				$scope.order('companyName', false);
				$scope.sortCompanys()
			}, function (error) {
			});
		};

		$scope.sortCompanys = function () {
			$scope.loaderListCompanys = false;

			var type = $scope.selectCompanyTypeSort;
			if (type == 'abc') {
				var source = angular.copy($scope.appData.companysList);
				source.sort(function (a, b) {
					return (a.companyName > b.companyName) ? 1 : -1;
				});

				var data = {};
				var dates = [];

				source.forEach(function (v) {
					if (typeof data[v.companyName.substr(0, 1)] == "undefined") {
						data[v.companyName.substr(0, 1)] = [];
					}

					data[v.companyName.substr(0, 1)].push(v);
					if (dates.indexOf(v.companyName.substr(0, 1)) == -1) {
						dates.push(v.companyName.substr(0, 1));
					}
				});
				if (JSON.stringify(data) !== '{}') {
					$scope.appData.afterSortFirst = dates;
					$scope.appData.afterSort = data;
				}
				$timeout(function () {
					$scope.loaderListCompanys = true;
				}, 1000)
			}
			if (type == 'dateLast') {
				var source = angular.copy($scope.appData.companysList);
				var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;

				function dmyOrdA(a, b) {
					if (a.last_inv_date) {
						a = a.last_inv_date.replace(dateRE, "$3$2$1");
					}
					if (b.last_inv_date) {
						b = b.last_inv_date.replace(dateRE, "$3$2$1");
					}
					if (a < b) return 1;
					if (a > b) return -1;
					return 0;
				}

				source.sort(dmyOrdA);
				$scope.appData.afterSort = source;
				$timeout(function () {
					$scope.loaderListCompanys = true;
				}, 1000)
			}
			if (type == 'unEnteredMonth') {
				var source = angular.copy($scope.appData.companysList);
				source.sort(function (a, b) {
					return (a.sum_inv_cur_mon > b.sum_inv_cur_mon) ? 1 : -1;
				});
				$scope.appData.afterSort = source;
				$timeout(function () {
					$scope.loaderListCompanys = true;
				}, 1000)
			}
			if (type == 'enteredMonth') {
				var source = angular.copy($scope.appData.companysList);
				source.sort(function (a, b) {
					return (a.sum_inv_cur_mon < b.sum_inv_cur_mon) ? 1 : -1;
				});
				$scope.appData.afterSort = source;
				$timeout(function () {
					$scope.loaderListCompanys = true;
				}, 1000)
			}
		}
		$scope.mailCheck = function (mail) {
			if (mail.indexOf('@') == -1) {
				return false;
			}
			else {
				return true;
			}
		}

		$scope.openListCompanys = function (b, $event) {
			$event.stopPropagation();
			if (!b.usersList) {
				if (b.openUsersList) {
					var data = {"companyId": b.companyId, "messageId": null};
					serverConnection.getListUsersOfCompany(data).then(function (res) {
						if ($scope.selectCompanyTypeSort == 'abc') {
							$scope.appData.afterSortFirst.forEach(function (v) {
								$scope.appData.afterSort[v].forEach(function (x) {
									if (b.companyId == x.companyId) {
										x.usersList = res;
									}
								})
							})
						}
						else {
							$scope.appData.afterSort.forEach(function (x) {
								if (b.companyId == x.companyId) {
									x.usersList = res;
								}
							})
						}
					}, function (error) {
					});
				}
			}
		}

		$scope.setListUsersOfCompany = function ($event, info, companyId, del, idx) {
			$event.stopPropagation();
			if (del) {
				var data = {"userUuid": info, "companyid": companyId};
				serverConnection.delListUsersOfCompany(data).then(function (res) {
					if (res == 0) {
						if ($scope.selectCompanyTypeSort == 'abc') {
							$scope.appData.afterSortFirst.forEach(function (v) {
								$scope.appData.afterSort[v].forEach(function (x) {
									if (companyId == x.companyId) {
										x.user_details.splice(idx, 1);
									}
								})
							})
						}
						else {
							$scope.appData.afterSort.forEach(function (x) {
								if (companyId == x.companyId) {
									x.user_details.splice(idx, 1);
								}
							})
						}

					}
				}, function (error) {
				});
			} else {
				var data = {"userUuid": info.user_id, "companyid": companyId};
				serverConnection.setListUsersOfCompany(data).then(function (res) {
					if (res == 0) {
						serverConnection.loadCompanysForThis(companyId).then(function (res) {
							if ($scope.selectCompanyTypeSort == 'abc') {
								$scope.appData.afterSortFirst.forEach(function (v) {
									$scope.appData.afterSort[v].forEach(function (x) {
										if (companyId == x.companyId) {
											x.user_details = res[0].user_details;
										}
									})
								})
							}
							else {
								$scope.appData.afterSort.forEach(function (x) {
									if (companyId == x.companyId) {
										x.user_details = res[0].user_details;
									}
								})
							}
						}, function (error) {
						});
					}
					else {
						$scope.showPopup('views/templates/notPer.html?ver=3.74', 'popAlert', true);
						setTimeout(function () {
							$scope.hidePopup();
						}, 1500)
					}
				}, function (error) {
				});
			}
		}

		$scope.Showhelp = false;
		$scope.$parent.help = function () {
			$scope.Showhelp = true;
		};
		$scope.$parent.refresh = function () {
			$scope.loadPage()
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
		// activator_status
		//
		// ind_mail_to_send
		//
		// ind_account_exists

		//

		$scope.default_user_create = function (data, check) {
			serverConnection.default_user_create(data).then(function (res) {
				$scope.hidePopup();
				if(check){
					if ($scope.selectCompanyTypeSort == 'abc') {
						$scope.appData.afterSortFirst.forEach(function (v) {
							$scope.appData.afterSort[v].forEach(function (x) {
								if ($scope.appData.default_user_create.companyId == x.companyId) {
									x.ind_mail_to_send = 1;
									x.phone_number = $scope.appData.default_user_create.defUserCell;
									x.mail = $scope.appData.default_user_create.defUserEmail;
									x.full_name = $scope.appData.default_user_create.defUserName;
								}
							})
						})
					}
					else {
						$scope.appData.afterSort.forEach(function (x) {
							if ($scope.appData.default_user_create.companyId == x.companyId) {
								x.ind_mail_to_send = 1;
								x.phone_number = $scope.appData.default_user_create.defUserCell;
								x.mail = $scope.appData.default_user_create.defUserEmail;
								x.full_name = $scope.appData.default_user_create.defUserName;
							}
						})
					}
				}
			}, function (error) {
			});
		}

		$scope.editCompany = function (editCompanyForm) {
			if (editCompanyForm.$valid) {
				$scope.appData.companyEditDisabledButton = true;
			}
		}

		$scope.editMailToSend = function (b) {
			$scope.appData.companyEditDisabledButton = false;
			if (b.ind_account_exists == 0) {
				b.ind_mail_to_send = 0;
				b.ind_account_exists_null = true;
			}
			else {
				if (b.ind_mail_to_send == 0) {
					var data = {
						"companyId": b.companyId,
						"defUserCell": b.phone_number,
						"defUserEmail": b.mail,
						"indMailToSend": 0,
						"defUserName": b.full_name
					};
					$scope.default_user_create(data);
				}
				else {
					b.ind_mail_to_send = 0;
					$scope.appData.default_user_create = {
						"companyId": b.companyId,
						"defUserCell": b.phone_number,
						"defUserEmail": b.mail,
						"indMailToSend": 1,
						"defUserName": b.full_name
					};
					$scope.showPopup('views/templates/default_user_create.html?ver=3.74', 'default_user_create addCompanyWrap');
				}
			}
		}
	}


	angular.module('controllers')
	.controller('companysCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$anchorScroll', '$filter', companysCtrl]);
}());

