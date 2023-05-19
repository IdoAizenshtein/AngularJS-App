(function () {
	function bankDataManagementCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(5);
		$scope.date = new Date();


		$scope.refrashMinutes = 5;
		$scope.loaderAccBank = true;
		$scope.init = function () {
			if (!localStorage.getItem('refrashCheckQa')) {
				$scope.refrashCheck = false;
				localStorage.setItem('refrashCheckQa', $scope.refrashCheck);
			}
			else {
				$scope.refrashCheck = eval(localStorage.getItem('refrashCheckQa'));
				if ($scope.refrashCheck) {
					$scope.refrashPage()
				}
			}
			$scope.loadAccBankAdminPage();
			if ($scope.$state.current.name == 'mainAccountants.bankDataManagement.reportsManagement') {
				$scope.$state.go('mainAccountants.bankDataManagement.view');
			}
		}
		$scope.scrollHeightTable = 325;
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

		$scope.returnCompare = function (report_num) {
			var num = false;
			$scope.appData.adminReports.forEach(function (v, i) {
				if (!v.lineBreakGroup && v.report_num == report_num) {
					num = true;
				}
			})
			return num;
		};

		$scope.loadAccBankAdminPage = function () {
			$scope.loaderAccBank = true;
			serverConnection.get_report_cat().then(function (res) {
				$scope.appData.navHeaderQa = res;
				if (!localStorage.getItem('activeNavQa')) {
					$scope.appData.activeNavQa = $scope.appData.navHeaderQa[0].REPORT_CAT;
					localStorage.setItem('activeNavQa', $scope.appData.activeNavQa)
				}
				else {
					$scope.appData.activeNavQa = parseFloat(localStorage.getItem('activeNavQa'));
				}
				$scope.clickNavQa($scope.appData.activeNavQa);
			}, function (error) {

			});
		};

		$scope.clickNavQa = function (id, tab) {
			$state.go('mainAccountants.bankDataManagement.view');
			$scope.loaderAccBank = true;
			$scope.appData.activeNavQa = id;
			localStorage.setItem('activeNavQa', $scope.appData.activeNavQa);
			if (tab) {
				$scope.appData.adminReports = undefined;
			}
			serverConnection.adminReportsId1($scope.appData.activeNavQa).then(function (res) {
				var adminReports = res;
				if (adminReports.length > 0) {
					adminReports = $filter('orderBy')(adminReports, 'report_num');
					var arrAdmin = [];
					var nums = parseInt(adminReports[0].report_num / 100);
					var newObj = false;
					adminReports.forEach(function (v, i) {
						if ($scope.appData.adminReports !== undefined && $scope.returnCompare(v.report_num) == false) {
							v.newObj = true;
							newObj = true;
						}
						arrAdmin.push(v)
						if (i > 0) {
							if (parseInt(v.report_num / 100) !== nums) {
								arrAdmin.splice(arrAdmin.length - 1, 0, {
									'lineBreakGroup': true
								});
							}
							nums = parseInt(v.report_num / 100);
						}
						if (adminReports.length == i + 1) {
							$scope.appData.adminReports = arrAdmin;
							$scope.loaderAccBank = false;
							if (newObj == true) {
								document.getElementById("audioQa").pause();
								document.getElementById("audioQa").currentTime = 0;
								document.getElementById("audioQa").play();
							}
						}
					})
				}
				else {
					$scope.appData.adminReports = res;
					$scope.loaderAccBank = false;
				}
			}, function (error) {
				$scope.loaderAccBank = false;
			});
		}

		$scope.sort_by = function (predicate) {
			if ($scope.items.length > 1) {
				if ($scope.items[2][predicate + 'DateSort']) {
					predicate = predicate + 'DateSort';
				}
			}
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		};

		$scope.openCubeReports = function (nameReports) {
			$scope.appData.savePositionQa = $('.bg-dark.scrollDesign')[0].scrollTop;
			$scope.appData.cubeReportsQa = nameReports;
			$scope.loaderAccBank = true;
			//if (!nameReports.state_name) {
			$scope.nameReports = nameReports.report_name;
			serverConnection.adminReportsId(nameReports.report_num).then(function (res) {
				$scope.items = res;
				$scope.title = [];
				$scope.items.forEach(function (v, i) {
					for (var key in v) {
						if (v[key]) {
							var txt = v[key].toString().trim();
							if ((/^\s*(3[01]|[12][0-9]|0?[1-9])(\/)(1[012]|0?[1-9])(\/)(\d{4})\s*$/g).test(txt)) { //dd/mm/yyyy - d/m/yyyy
								var dateTxt = txt.split('/');
								v[key + 'DateSort'] = new Date(Number(dateTxt[2]), Number(dateTxt[1]), Number(dateTxt[0])).getTime();
							} else if ((/^\s*(3[01]|[12][0-9]|0?[1-9])(\/)(1[012]|0?[1-9])(\/)(\d{2})\s*$/g).test(txt)) { //dd/mm/yy - d/m/yy
								var dateTxt = txt.split('/');
								v[key + 'DateSort'] = new Date(Number('20' + dateTxt[2]), Number(dateTxt[1]), Number(dateTxt[0])).getTime();
							} else if ((/^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.(\d{4})\s*$/g).test(txt)) { //dd.mm.yyyy - d.m.yyyy
								var dateTxt = txt.split('.');
								v[key + 'DateSort'] = new Date(Number(dateTxt[2]), Number(dateTxt[1]), Number(dateTxt[0])).getTime();
							} else if ((/^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.(\d{2})\s*$/g).test(txt)) {  //dd.mm.yy - d.m.yy
								var dateTxt = txt.split('.');
								v[key + 'DateSort'] = new Date(Number('20' + dateTxt[2]), Number(dateTxt[1]), Number(dateTxt[0])).getTime();
							} else if ((/^\s*(3[01]|[12][0-9]|0?[1-9])\-(1[012]|0?[1-9])\-(\d{4})\s*$/g).test(txt)) {//dd-mm-yyyy - d-m-yyyy
								var dateTxt = txt.split('-');
								v[key + 'DateSort'] = new Date(Number(dateTxt[2]), Number(dateTxt[1]), Number(dateTxt[0])).getTime();
							} else if ((/^\s*(3[01]|[12][0-9]|0?[1-9])\-(1[012]|0?[1-9])\-(\d{2})\s*$/g).test(txt)) {  //dd-mm-yy - d-m-yy
								var dateTxt = txt.split('-');
								v[key + 'DateSort'] = new Date(Number('20' + dateTxt[2]), Number(dateTxt[1]), Number(dateTxt[0])).getTime();
							} else if ((/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))$/g).test(txt)) {  //dd/mm
								var dateTxt = txt.split('/');
								v[key + 'DateSort'] = new Date(new Date().getFullYear(), Number(dateTxt[1]), Number(dateTxt[0])).getTime();
							}
						}
					}
					if (i == 0) {
						$scope.title.push(v)
					}
				});
				$scope.appData.tableQa = {
					title: $scope.title[0],
					rows: $scope.items
				}
				var element_count = 0;
				for (var e in $scope.title[0]) {
					if ($scope.title[0].hasOwnProperty(e)) {
						element_count++;
					}
				}
				$scope.widthTdTh = (100 - element_count) / element_count;
				$scope.items.splice(0, 1);
				$scope.itemsSum = $scope.items.length;
				$scope.$state.go('mainAccountants.bankDataManagement.reportsManagement');
				$scope.loaderAccBank = false;
			}, function (error) {
				alert("קיימת שגיאה");
			});
			//}
			//else {
			//	$scope.loaderAccBank = false;
			//	if (nameReports.state_name.indexOf('taskManagerByUser') == -1) {
			//		$state.go(nameReports.state_name)
			//	}
			//	else {
			//		$scope.openLinkTasks('?' + nameReports.state_name.split('?')[1])
			//	}
			//}
		}
		$scope.refrashPage = function () {
			localStorage.setItem('refrashCheckQa', $scope.refrashCheck);
			if ($scope.$state.current.name == 'mainAccountants.bankDataManagement.view' && $scope.refrashCheck == true && $scope.refrashMinutes) {
				$interval.cancel($scope.timeMin);

				$scope.timeMin = $interval(function () {
					if ($scope.$state.current.name == 'mainAccountants.bankDataManagement.view' && $scope.refrashCheck == true && $scope.refrashMinutes) {
						$scope.loadAccBankAdminPage()
					}
				}, (60000 * $scope.refrashMinutes));
			}
		}
		$scope.goToPosScroll = function () {
			$('.bg-dark.scrollDesign').animate({scrollTop: $scope.appData.savePositionQa + "px"}, 10);
		}
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
		$scope.$parent.refresh = function () {
			if ($scope.$state.current.name == 'mainAccountants.bankDataManagement.reportsManagement') {
				//$scope.$state.go('mainAccountants.bankDataManagement.view');
				$scope.openCubeReports($scope.appData.cubeReportsQa);
			}
			else {
				$scope.loadAccBankAdminPage()
			}
		};

		$scope.help = function () {
			window.open('http://bizibox.biz/help/hashexport', '_blank');
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
	.controller('bankDataManagementCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', bankDataManagementCtrl]);
}());
