(function () {
	function windowsManagCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(5);
		$scope.date = new Date();
		$scope.loaderWindows = true;
		$scope.initPage = function () {
			$scope.loadPageWindowsManag()
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
				else{
					$state.go('overviewAcc.ksafim');
				}
			}
			$scope.appData.selectedCompanyIndexLink = false;
		};

		$scope.loadPageWindowsManag = function () {
			$scope.loaderWindows = true;
			serverConnection.qa_itrot_list().then(function (res) {
				$scope.appData.qa_itrot_list = res;
				$scope.loaderWindows = false;
			}, function (error) {

			});
		};

		$scope.openMoreMangWindows = function (a) {
			$scope.appData.openMoreMangWindows = a;
			$scope.showPopup('views/templates/openMoreMangWindows.html?ver=3.80', 'openMoreDataMangWit');
		}

		$scope.openPeulot = function (row) {
			$scope.appData.loaderWindowsInside = true;
			$scope.appData.qa_itrot_list_row = row;
			$scope.showPopup('views/templates/qaItrotGetBanktrans.html?ver=3.80', 'qaItrotGetBanktrans');
			serverConnection.qa_itrot_get_banktrans(row.QA_ITROT_ID).then(function (res) {
				$scope.appData.qa_itrot_get_banktrans = res;
				$scope.appData.loaderWindowsInside = false;
			}, function (error) {

			});
		}

		$scope.deletePeulotInside = function (a) {
			$scope.appData.deletePopUpInside = true;
			$scope.dataDelete = {
				inbank_trans_id: a.BANK_TRANS_ID
			}
		}

		$scope.deleteNext = function () {
			$scope.appData.deletePopUpInside = false;
			$scope.appData.loaderWindowsInside = true;
			serverConnection.admin_delete_bank_trans($scope.dataDelete).then(function () {
				serverConnection.qa_itrot_get_banktrans($scope.appData.qa_itrot_list_row.QA_ITROT_ID).then(function (res) {
					$scope.appData.qa_itrot_get_banktrans = res;
					$scope.appData.loaderWindowsInside = false;
				}, function (error) {

				});
			}, function (error) {

			});
		}

		$scope.editRow = function (row) {
			$scope.appData.editIndFixedTOKEN = row.TOKEN;
			$scope.appData.editIndFixedNameCompany = row.COMPANY_NAME;
			$scope.appData.editIndFixedId = row.QA_ITROT_ID;
			$scope.appData.selectIndFixedId = row.IND_FIXED;
			$scope.appData.selectIndFixedNumbers = '';
			if(row.DESCRIPTION && row.DESCRIPTION !== null){
				$scope.appData.editIndescription = row.DESCRIPTION;
			}
			else{
				$scope.appData.editIndescription = '';
			}
			$scope.showPopup('views/templates/editRowWindowsManag.html?ver=3.80', 'openMoreDataMangWit');
		}

		$scope.update_qa_itrot = function () {
			var editIndescription = $scope.appData.editIndescription;
			if(editIndescription == undefined || editIndescription == ''){
				editIndescription = ' ';
			}
			var data = {
				infixed_id: parseInt($scope.appData.selectIndFixedId),
				inqa_itrot_id: $scope.appData.editIndFixedId,
				indescription: editIndescription
			}
			serverConnection.update_qa_itrot(data).then(function (res) {
				$scope.hidePopup()
			}, function (error) {
			});

			if($scope.appData.selectIndFixedNumbers == '0' || $scope.appData.selectIndFixedNumbers){
				var dataDay = {
					inaccount_days: $scope.appData.selectIndFixedNumbers,
					incheckpic_days: 0,
					intoken: $scope.appData.editIndFixedTOKEN
				}
				serverConnection.token_updatedatesmeshicha(dataDay).then(function (res) {
					$scope.hidePopup();
				}, function (error) {

				});
			}

		}


		$scope.updateFixed = function(){
			var data = {
				infixed_id: 2,
				inqa_itrot_id: $scope.appData.qa_itrot_list_row.QA_ITROT_ID,
				indescription: ''
			}
			serverConnection.update_qa_itrot(data).then(function (res) {
				$scope.hidePopup()
				$scope.loadPageWindowsManag()
			}, function (error) {
			});
		}

		$scope.sort_by = function (predicate) {
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		};

		$scope.$parent.refresh = function () {
			$scope.loadPageWindowsManag()
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
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
			$scope.showPopup('views/templates/mailerQaitrot.html?ver=3.80', 'mailerPopup', false);
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {
			if (newVal == false) {
				$scope.error = '';
			}
		});

		$scope.openBug = function (a) {
			$scope.appData.usersWorkVal = {};
			$scope.appData.usersWorkVal.token = a.TOKEN;
			$scope.appData.usersWorkVal.companyAccountId = a.DATALOAD_ID;
			$scope.appData.usersWorkVal.companyId  = a.COMPANY_ID;
			$scope.appData.usersWorkVal.last_export_bank_trans_id = a.QA_ITROT_ID;
			$q.all([serverConnection.user_get_bizibox_users(), serverConnection.get_qa_tasks_types(), serverConnection.get_qa_tasks_priorty()]).then(function (data) {
				$scope.appData.usersWork = data[0];
				$scope.appData.usersWork_tasks_type = data[1];
				$scope.appData.usersWork_priority = data[2];

				if (localStorage.getItem('usersWorkVal') !== null) {
					$scope.appData.usersWorkVal.taskUserId = localStorage.getItem('usersWorkVal');
				}
				else {
					$scope.appData.usersWorkVal.taskUserId = data[0][0].USER_ID;
				}

				$scope.appData.usersWorkVal.tasks_type = 1;
				$scope.appData.usersWorkVal.taskTitle = a.ACCOUNT_NICKNAME + ' ' + 'בעיה עקב דוח חלונות לחשבון';
				$scope.appData.usersWork_priority.forEach(function(v, i){
					if(v.QA_TASK_PRIORTY_DESC == 'גבוה'){
						$scope.appData.usersWorkVal.priority = v.QA_TASK_PRIORTY_ID;
					}
				})
				$scope.showPopup('views/templates/addTaskWinMang.html?ver=3.80', 'addTask');
			});
		}

		$scope.qa_task_add = function () {
			if(!$scope.appData.usersWorkVal.sent) {

				$scope.appData.usersWorkVal.sent = true;

				var data = {
					taskUserId: $scope.appData.usersWorkVal.taskUserId,
					taskType: $scope.appData.usersWorkVal.tasks_type,
					taskTitle: $scope.appData.usersWorkVal.taskTitle,
					taskDesc: $scope.appData.usersWorkVal.taskDesc,
					driveLink: $scope.appData.usersWorkVal.driveLink,
					stateType: 1,
					priority: $scope.appData.usersWorkVal.priority,
					token: $scope.appData.usersWorkVal.token,
					companyAccountId: $scope.appData.usersWorkVal.companyAccountId,
					companyId: $scope.appData.usersWorkVal.companyId,
					bankTransid: $scope.appData.usersWorkVal.last_export_bank_trans_id,
					order_num: $scope.appData.usersWorkVal.order_num
				}
				serverConnection.qa_task_add(data).then(function (res) {
					$scope.appData.usersWorkVal.sent = false;

					$scope.hidePopup();
					$scope.successAlertSend()
				}, function (error) {
					$scope.appData.usersWorkVal.sent = false;

				});
			}
		}

		$scope.changeUserWork = function () {
			localStorage.setItem('usersWorkVal', $scope.appData.usersWorkVal.taskUserId)
		}
	}


	angular.module('controllers')
		.controller('windowsManagCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', windowsManagCtrl]);
}());
