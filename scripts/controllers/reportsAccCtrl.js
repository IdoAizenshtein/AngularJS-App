(function () {
	function reportsAccCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(5);
		$scope.date = new Date();
		$scope.loaderAccTeam = true;
		$scope.initPage = function () {
			if ($scope.appData.defMonth) {
				$scope.loadAccTeamPage();
			}
			else {
				$scope.$watch('appData.defMonth', function (newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}
					$scope.loadAccTeamPage();
				}, true);
			}
		}
		$scope.maxSize = 10;
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
		$scope.loaderexpenseChanged = false;
		$scope.loaderexpenseMissing = false;
		$scope.loadertyping = false;


		var fromDatesTyping = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
		$scope.fromMonthType = ('0' + (fromDatesTyping.getMonth() + 1)).slice(-2).toString();
		$scope.fromYearType = (fromDatesTyping.getFullYear()).toString();

		$scope.toMonthType = ('0' + (new Date().getMonth() + 1)).slice(-2).toString();
		$scope.toYearType = (new Date().getFullYear()).toString();


		$scope.loadAccTeamPage = function () {

			if ($scope.appData.defMonth) {
				$scope.yearexpens = $scope.appData.defMonth.month_id.toString().substr(0, 4);
				$scope.monthexpens = $scope.appData.defMonth.month_id.toString().substr(4, 2);

				$scope.yearchanged = $scope.appData.defMonth.month_id.toString().substr(0, 4);
				$scope.monthchanged = $scope.appData.defMonth.month_id.toString().substr(4, 2);

				serverConnection.defaultsPrecentReports().then(function (res) {
					$scope.defaultsPrecentReports = parseInt(res.variableexpensesdef);
					$scope.expenseChangedReport();
				}, function (error) {

				});
				$scope.expenseMissingReport();
				$scope.typing();
				$scope.dohMatch();
			}
		};

		$scope.expenseMissingReport = function () {
			$scope.loaderexpenseMissing = false;

			var data = {"date": "01/" + $scope.monthexpens + "/" + $scope.yearexpens, "company_id": null};

			serverConnection.expenseMissingReport(data).then(function (res) {
				$scope.expenseMissingReportTable = res;
				if($scope.expenseMissingReportTable){
					$scope.expenseMissingReportTable.forEach(function (v, i) {
						$scope.appData.companies.forEach(function (v1, i1) {
							if (v.companyId == v1.companyId) {
								v.companyHp = v1.companyHp;
							}
						})
					});
					$scope.filterExpenseMissingReport();
				}
				$scope.loaderexpenseMissing = true;


			}, function (error) {

			});
		};

		$scope.filterExpenseMissingReport = function () {
			$scope.appData.expenseMissingReportTable = $filter('freeFilter')(angular.copy($scope.expenseMissingReportTable), $scope.searchMatchNotShow);
		};

		$scope.typing = function () {
			$scope.loadertyping = false;

			var data = {
				"incompany_tab": [],
				"indate_from": $scope.fromYearType + '' + $scope.fromMonthType + '01',
				"indate_till": $scope.toYearType + '' + $scope.toMonthType + '01',
				"imp_type": "2"
			};
			serverConnection.userGetbankmatchimplist(data).then(function (res) {
				$scope.loadertyping = true;
				$scope.appData.typing = res;

				// Convert array to object
				//var convArrToObj = function (array) {
				//	var thisEleObj = new Object();
				//	if (typeof array == "object") {
				//		for (var i in array) {
				//			var thisEle = convArrToObj(array[i]);
				//			thisEleObj[i] = thisEle;
				//		}
				//	} else {
				//		thisEleObj = array;
				//	}
				//	return thisEleObj;
				//}


				var arr = [];

				$scope.appData.typing.dataArray.forEach(function (v, i) {

					v.splice(2, 1)

					var obj = {};
					if (i % 2 == 0) {
						obj['prev'] = false;
					}
					else {
						obj['prev'] = true;
					}
					v.forEach(function (v1, i1) {
						if (i1 == 0 || i1 == 1) {
							obj['name' + i1] = v1;
						}
						else {
							obj['name' + i1] = parseFloat(v1);
						}
					})

					arr.push(obj)
					//v.splice(v.length - 1, 1)
				})
				$scope.appData.arrTyping = arr;

				$scope.appData.arrTypingSmall = [];
				$scope.appData.arrTyping.forEach(function (v, i) {
					if (i % 2 !== 1) {
						$scope.appData.arrTypingSmall.push(v)
					}
				})
				var month = [];
				$scope.appData.typing.months.forEach(function (v, i) {
					if (i == 0) {
						month.push(
							{
								'name0': 'שם חברה'
							},
							{
								'name1': 'סה״כ'
							}
						)
					}
					var objMonth = {};
					objMonth['name' + (i + 2)] = v;
					month.push(objMonth)
				})
				$scope.monthTitle = month;
				var len = month.length;
				$scope.widthTd = (100 - (len * 2)) / len;
				$scope.sort_by3('name1');
				$scope.reverse3 = true;
			}, function (error) {
			});
		};

		$scope.expenseChangedReport = function () {
			$scope.loaderexpenseChanged = false;
			var data = {"date": "01/" + $scope.monthchanged + "/" + $scope.yearchanged, "company_id": null};
			serverConnection.expenseChangedReport(data).then(function (res) {
				$scope.expenseChangedReportTable = res;
				$scope.filterExpenseChangedReport();
				$scope.loaderexpenseChanged = true;
				$scope.expenseChangedReportTable.forEach(function (v, i) {
					$scope.appData.companies.forEach(function (v1, i1) {
						if (v.companyId == v1.companyId) {
							v.companyHp = v1.companyHp;
						}
					})
				});
			}, function (error) {

			});
		};

		$scope.filterExpenseChangedReport = function () {
			$scope.appData.expenseChangedReportTable = $filter('freeFilter')(angular.copy($scope.expenseChangedReportTable), $scope.searchMatchBigger);
		};

		$scope.setDefaultsPrecentAcc = function () {
			var data = {
				"expensesnotpresentedef": 0,
				"variableexpensesdef": $scope.defaultsPrecentReports,
				"def11": 0,
				"def12": 0
			};
			serverConnection.setDefaultsPrecentAcc(data).then(function (res) {
				if (res == 0) {
					$scope.expenseChangedReport();
				}
			}, function (error) {

			});
		};

		$scope.goToAnalisis = function (sortCodeId, tabs, id, year) {
			$scope.appData.analysisDates = true;
			$scope.appData.analysisDatesReports = true;
			$scope.appData.byOnlyYearAnalisis = parseInt(year);
			$scope.appData.targetTab = tabs;
			$scope.appData.transCodesAnalisis = sortCodeId;
			$scope.appData.sortCodesAnalisis = '';

			$scope.appData.companies.forEach(function (v, i) {
				if (id == v.companyId) {
					$scope.appData.selectedCompanyIndex = i;
					$scope.appData.selectedCompanyIndexLink = true;
					$state.go('analysis');
				}
			})
		};

		$scope.sort_by = function (predicate) {
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		};

		$scope.sort_by2 = function (predicate) {
			$scope.predicate2 = predicate;
			$scope.reverse2 = !$scope.reverse2;
		};
		$scope.sort_by3 = function (predicate) {
			$scope.predicate3 = predicate;
			$scope.reverse3 = !$scope.reverse3;
		};
		$scope.sort_by4 = function (predicate) {
			$scope.predicate4 = predicate;
			$scope.reverse4 = !$scope.reverse4;
		};

		$scope.$parent.refresh = function () {
			$scope.loadAccTeamPage()
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
		$scope.appData.ShowhelpReports = false;

		var fromDatesMatch = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
		$scope.fromMonthMatch = ('0' + (fromDatesMatch.getMonth() + 1)).slice(-2).toString();
		$scope.fromYearMatch = (fromDatesMatch.getFullYear()).toString();

		$scope.toMonthMatch = ('0' + (new Date().getMonth() + 1)).slice(-2).toString();
		$scope.toYearMatch = (new Date().getFullYear()).toString();

		$scope.dohMatch = function () {
			$scope.loaderMatch = false;
			var data = {
				"date_from": $scope.fromYearMatch + '' + $scope.fromMonthMatch + '01',
				"date_till": $scope.toYearMatch + '' + $scope.toMonthMatch + '01',
				"company_id": null
			}
			serverConnection.nomatched_report(data).then(function (res) {
				$scope.loaderMatch = true;
				$scope.appData.dohMatch = res;
				$scope.appData.dohMatch.forEach(function (v, i) {
					$scope.appData.companies.forEach(function (v1, i1) {
						if (v.COMPANY_ID == v1.companyId) {
							v.companyHp = v1.companyHp;
						}
					})
				});
				$scope.sort_by4('COMPANY_NAME');
				$scope.reverse4 = false;
			}, function (error) {
			});
		};

		$scope.$parent.help = function () {
			$scope.appData.ShowhelpReports = true;
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
		$scope.sendMailerMiss = function () {
			$scope.appData.nameDochForMail = 'פעולות שכיחות שלא הופיעו -' + 'בחודש' + ' ' + $scope.monthexpens + ' ' + 'שנה' + ' ' + $scope.yearexpens + ' -';
			$scope.showPopup('views/templates/mailerMailerMiss.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.sendMailerChangeExRepo = function () {
			$scope.appData.nameDochForMail = 'כרטיסים שגדלו/קטנו מעל' + '  ' + $scope.defaultsPrecentReports + '% ' + ' בחודש ' + $scope.monthchanged + ' שנה ' + $scope.yearchanged + ' - ';
			$scope.showPopup('views/templates/mailerChangeExRepo.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.sendMailerDohMatch = function () {
			$scope.appData.nameDochForMail = 'התאמות מחודש' + '  ' + $scope.fromMonthMatch + ' ' + ' שנה ' + $scope.fromYearMatch + ' עד חודש ' + $scope.toMonthMatch + ' שנה ' + $scope.toYearMatch + ' - ';
			$scope.showPopup('views/templates/mailerDohMatch.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.sendMailerTypereport = function () {
			$scope.appData.nameDochForMail = 'הקלדות מחודש' + '  ' + $scope.fromMonthType + ' ' + ' שנה ' + $scope.fromYearType + ' עד חודש ' + $scope.toMonthType + ' שנה ' + $scope.toYearType + ' - ';
			$scope.showPopup('views/templates/mailerTypereport.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});
	}


	angular.module('controllers')
	.controller('reportsAccCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', reportsAccCtrl]);
}());
