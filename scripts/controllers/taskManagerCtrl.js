(function () {
	function taskManagerCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(5);
		$scope.date = new Date();
		$scope.showTabProb = true;
		$scope.scrollHeightTable = 260;
		$scope.scrollPage = 180;
		$scope.maxSize = 10;
		$scope.openMoreNav = false;
		$scope.allApproved = false;
		$scope.typesFilters = {
			sumCompanies: true,
			exStatus: false,
			exStatusprocec: false
		};
		$scope.init = function () {
			$scope.get_qa_tasks_load();
		}
		$scope.loaderTasks = true;
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

		$scope.appData.fileDownload = false;
		$scope.appData.fileExports = true;
		$scope.filterComments = 'all';
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
				$scope.appData.filteredCardsItems = $scope.filtered.length;
			}, 10);
		};
		$scope.typesSFilters = '';
		$scope.openPopEmail = function () {
			$scope.hidePopup();
			// $scope.appData.addTaskPop.taskId
			// $scope.appData.addTaskPop.taskUserId
			// $scope.appData.addTaskPop.description
			$timeout(function () {
				$scope.showPopup('views/templates/openPopEmail.html?ver=3.74', 'addTaskPop openPopEmail');
			}, 50);
		};
		$scope.prepare_return_mail = function () {
			serverConnection.prepare_return_mail({
				taskId: $scope.appData.addTaskPop.taskId,
				userId: $scope.appData.addTaskPop.taskUserId,
				description: $scope.appData.addTaskPop.description && $scope.appData.addTaskPop.description !== '' ? $scope.appData.addTaskPop.description : null,
			}).then(function (res) {
				$scope.hidePopup();
			}, function (error) {

			});
		};

		$scope.get_qa_tasks_load = function () {
			$q.all([serverConnection.user_get_bizibox_users(), serverConnection.get_qa_tasks_types(), serverConnection.get_qa_tasks_states(), serverConnection.get_qa_tasks_priorty(), serverConnection.get_task_catagory()]).then(function (data) {
				$scope.appData.usersWork = data[0];
				$scope.appData.usersWork_tasks_typePop = angular.copy(data[1]);
				$scope.appData.usersWork_statesPop = angular.copy(data[2]);
				$scope.appData.usersWork_priorityPop = angular.copy(data[3]);
				$scope.appData.usersWork_task_catagory = angular.copy(data[4]);
				$scope.appData.usersWork_task_catagory.unshift({
					TASK_CATEGORY_NAME: "בחר קטגוריה",
					TASK_CATEGORY_ID: "null"
				});
				$scope.appData.usersWork_tasks_type = data[1];
				$scope.appData.usersWork_tasks_type.unshift({
					"QA_TASK_TYPE_ID": 0,
					"QA_TASK_TYPE_DESC": "סוג משימה"
				})
				$scope.appData.usersWork_states = data[2];
				$scope.appData.usersWork_states.unshift({
					"QA_TASK_STATE_ID": 0,
					"QA_TASK_STATE_DESC": "סטטוס משימה"
				})
				$scope.appData.usersWork_priority = data[3];
				$scope.appData.usersWork_priority.unshift({
					"QA_TASK_PRIORTY_ID": null,
					"QA_TASK_PRIORTY_DESC": "להיום"
				});
				$scope.appData.tasksObj = {};

				if (decodeURIComponent(window.location.hash).split('?').length == 2) {
					if (decodeURIComponent(window.location.hash).split('?')[1].indexOf('&') == -1) {
						$scope.appData.tasksObj.usersWork = decodeURIComponent(window.location.hash).split('?')[1];
						$scope.appData.tasksObj.usersWork_tasks_type = $scope.appData.usersWork_tasks_type[0].QA_TASK_TYPE_ID;
						$scope.appData.tasksObj.usersWork_states = $scope.appData.usersWork_states[0].QA_TASK_STATE_ID;
					}
					else {
						var param = decodeURIComponent(window.location.hash).split('?')[1];
						var paramUsers = param.split('&');
						$scope.appData.tasksObj.usersWork = paramUsers[2];
						$scope.appData.tasksObj.usersWork_tasks_type = parseFloat(paramUsers[1]);
						$scope.appData.tasksObj.usersWork_states = parseFloat(paramUsers[0]);
						$scope.typesSFilters = paramUsers[3];
					}
				}
				else {
					$scope.appData.tasksObj.usersWork = $scope.appData.usersWork[0].USER_ID;
					$scope.appData.tasksObj.usersWork_tasks_type = $scope.appData.usersWork_tasks_type[0].QA_TASK_TYPE_ID;
					$scope.appData.tasksObj.usersWork_states = $scope.appData.usersWork_states[0].QA_TASK_STATE_ID;
				}

				$scope.get_qa_tasks();
			});
		}
		$scope.typesActive = 'all';
		$scope.filterType = function (type) {
			$scope.typesActive = type;
			var filteredArr = [];
			$scope.appData.tasksView.forEach(function (v) {
				if (type == 'all') {
					filteredArr.push(v);
				}
				else if (type == null) {
					if (v.PRIORTY == 3 || v.ORDER_NUM == 1) {
						filteredArr.push(v);
					}
				}
				else {
					if (v.PRIORTY == type) {
						filteredArr.push(v);
					}
				}
			})
			filteredArr.forEach(function (v){
				v.TASK_CATEGORY_NAME = $scope.getNameCategory(v.TASK_CATEGORY_ID)
			})
			$scope.appData.tasksViewArr = filteredArr;
		}

		$scope.sortNumberMiss = function () {
			$scope.listTitles = [];
			$scope.appData.usersWork_priority.forEach(function (v, i) {
				var ind = 0;
				$scope.appData.tasksView.forEach(function (v1, i1) {
					if (v.QA_TASK_PRIORTY_ID == null) {
						if (v1.PRIORTY == 3 || v1.ORDER_NUM == 1) {
							ind = ind + 1;
						}
					}
					else {
						if (v.QA_TASK_PRIORTY_ID == v1.PRIORTY) {
							ind = ind + 1;
						}
					}
				})
				$scope.listTitles.push(ind)
			})
		}

		$scope.typesFiltersActiveNum = 'all';

		$scope.get_qa_tasks = function () {
			$scope.loaderTasks = true;
			var data = {
				stateType: $scope.appData.tasksObj.usersWork_states,
				otherUserId: $scope.appData.tasksObj.usersWork,
				bugType: $scope.appData.tasksObj.usersWork_tasks_type
			}
			serverConnection.get_qa_tasks(data).then(function (res) {
				$scope.appData.tasksView = angular.copy(res);
				$scope.appData.tasksView.forEach(function (v){
					v.TASK_CATEGORY_NAME = $scope.getNameCategory(v.TASK_CATEGORY_ID)
				})
				$scope.appData.tasksViewArr = $scope.appData.tasksView;

				// function dmyOrdA(a, b) {
				// 	if (a.TASK_NUMBER < b.TASK_NUMBER) return 1;
				// 	if (a.TASK_NUMBER > b.TASK_NUMBER) return -1;
				// 	return 0;
				// }
				//
				// var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
				// function dmyOrdB(a, b) {
				// 	a = a.DATE_CREATED.replace(dateRE, "$3$2$1");
				// 	b = b.DATE_CREATED.replace(dateRE, "$3$2$1");
				// 	if (a < b) return 1;
				// 	if (a > b) return -1;
				// 	return 0;
				// }
				// $scope.appData.tasksViewArr.sort(dmyOrdA);
				// debugger
				// $scope.appData.tasksViewArr.sort(dmyOrdB);
				//
				try {
					var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
					$scope.appData.tasksViewArr.sort(function (a, b) {
						return a.DATE_CREATED.replace(dateRE, "$3$2$1") - b.DATE_CREATED.replace(dateRE, "$3$2$1") || a["TASK_NUMBER"] - b["TASK_NUMBER"];
					}).reverse();
				}catch (e){

				}


				$scope.sortNumberMiss();
				$scope.loaderTasks = false;
				$scope.appData.loaderTasksEdit = false;
				if (decodeURIComponent(window.location.hash).split('?').length == 2) {
					if (decodeURIComponent(window.location.hash).split('?')[1].indexOf('&') == -1) {
						$scope.filterType(null);
					}
				}

				if($scope.appData.qa_task_by_serach_run){
					$scope.appData.qa_task_by_serach_run = false;
					localStorage.setItem('qa_task_by_serach', JSON.stringify($scope.appData.qa_task_by_serach))
					serverConnection.qa_task_by_serach($scope.appData.qa_task_by_serach)
					.then(function (data) {
						data.forEach(function (v){
							v.TASK_CATEGORY_NAME = $scope.getNameCategory(v.TASK_CATEGORY_ID)
						})
						$scope.appData.tasksViewArr = data;
						$scope.appData.tasksObj.usersWork = $scope.appData.tasksViewArr[0].TASK_USER_ID;
						$scope.hidePopup();
					}, function (error) {
						$scope.hidePopup();
					});
				}
			}, function (error) {
			});
		}

		$scope.popUpEdit = function (a) {
			$scope.appData.addTaskPop = {
				taskUserId: a.TASK_USER_ID,
				tasks_type: a.BUG_TYPE,
				TASK_OPENER_NAME: a.TASK_OPENER_NAME,
				TASK_NUMBER: a.TASK_NUMBER,
				CLOSE_MAIL_TO_SEND: a.CLOSE_MAIL_TO_SEND,
				USER_CELL_PHONE: a.USER_CELL_PHONE,
				JIRA_BUG_ID: a.JIRA_BUG_ID,
				taskTitle: a.TASK_TITLE,
				taskDesc: a.TASK_DESC,
				driveLink: a.DRIVE_LINK,
				priority: a.PRIORTY,
				token: a.TOKEN,
				COMPANY_ID: a.COMAPNY_ID,
				COMPANY_ACCOUNT_ID: a.COMAPNY_ACCOUNT_ID,
				BANK_TRANS_ID: a.BANK_TRANS_ID,
				taskId: a.TASK_ID,
				stateType: a.STATE_TYPE,
				order_num: a.ORDER_NUM,
				task_category_id: $scope.appData.usersWork_task_catagory[0].TASK_CATEGORY_ID
			}
			if (a.TASK_CATEGORY_ID && a.TASK_CATEGORY_ID !== null) {
				$scope.appData.addTaskPop.task_category_id = a.TASK_CATEGORY_ID;
			}
			$scope.appData.addTaskPop.link = window.location.href + '?' + a.STATE_TYPE + '&' + $scope.appData.addTaskPop.tasks_type + '&' + $scope.appData.addTaskPop.taskUserId + '&' + a.TASK_ID;
			$scope.appData.addTaskPopDisabled = {
				taskUserId: true,
				tasks_type: true,
				taskTitle: true,
				taskDesc: true,
				driveLink: true,
				priority: true,
				TASK_NUMBER: true,
				TASK_OPENER_NAME: true,
				CLOSE_MAIL_TO_SEND: true,
				jira_bug_id: true,
				token: true,
				COMPANY_ID: true,
				COMPANY_ACCOUNT_ID: true,
				BANK_TRANS_ID: true,
				taskId: true,
				order_num: true
			}
			$scope.showPopup('views/templates/addTaskPopEdit.html?ver=3.74', 'addTaskPop');
		}
		$scope.getNameCategory = function (id) {
			var txt = "";
			if (id && $scope.appData.usersWork_task_catagory && $scope.appData.usersWork_task_catagory.length) {
				$scope.appData.usersWork_task_catagory.forEach(function (x) {
					if (x.TASK_CATEGORY_ID == id) {
						txt = x.TASK_CATEGORY_NAME;
					}
				});
			}
			return txt;
		}
		$scope.nameUser = function (id) {
			var idName = '';
			$scope.appData.usersWork.forEach(function (v) {
				if (v.USER_ID == id) {
					idName = v.NAME;
				}
			})
			return idName;
		}

		$scope.nameTasks = function (id) {
			var idName = '';
			$scope.appData.usersWork_tasks_type.forEach(function (v) {
				if (id == 0) {
					idName = 'הכל';
				}
				else {
					if (v.QA_TASK_TYPE_ID == id) {
						idName = v.QA_TASK_TYPE_DESC;
					}
				}
			})
			return idName;
		}

		$scope.nameStates = function (id) {
			var idName = '';
			$scope.appData.usersWork_states.forEach(function (v) {
				if (id == 0) {
					idName = 'הכל';
				}
				else {
					if (v.QA_TASK_STATE_ID == id) {
						idName = v.QA_TASK_STATE_DESC;
					}
				}
			})
			return idName;
		}

		$scope.get_qa_tasks_hist = function (taskId) {
			$scope.appData.historyIdTask = taskId;
			serverConnection.get_qa_tasks_hist({'taskId': taskId}).then(function (res) {
				$scope.appData.tasks_hist = res;
				$scope.showPopup('views/templates/tasks_hist.html?ver=3.74', 'tasks_hist');
			}, function (error) {
			});
		}

		$scope.updatePopTask = function (obj, val) {
			$scope.appData.loaderTasksEdit = true;
			var data = {
				taskId: $scope.appData.addTaskPop.taskId
			}
			if (obj == 'order_num') {
				data[obj] = parseFloat(val);
			}
			else {
				data[obj] = val;
			}
			serverConnection.qa_task_update(data).then(function (res) {
				$scope.get_qa_tasks()
			}, function (error) {
			});
		}
		$scope.updatePopTaskComment = function (val) {
			var data = {
				taskId: $scope.appData.historyIdTask,
				taskDesc: val
			}
			serverConnection.qa_task_update(data).then(function (res) {
				serverConnection.get_qa_tasks_hist({'taskId': $scope.appData.historyIdTask}).then(function (res) {
					$scope.appData.tasks_hist = res;
					$scope.get_qa_tasks()
				}, function (error) {
				});
			}, function (error) {
			});
		}

		$scope.closeRowTask = function (a) {
			$scope.appData.closeTaskId = a.TASK_ID;
			$scope.appData.closeTASK_OPENER_NAME = a.TASK_OPENER_NAME;
			$scope.appData.closeCLOSE_MAIL_TO_SEND = a.CLOSE_MAIL_TO_SEND;
			$scope.appData.closeTASK_CATEGORY_COMMENT = null;
			$scope.appData.closeTaskDesc = "";
			$scope.appData.closeTaskCategoryID = a.TASK_CATEGORY_ID;
			if (!$scope.appData.usersWork_task_catagory || !$scope.appData.usersWork_task_catagory.length || a.TASK_CATEGORY_ID === null) {
				$scope.appData.closeTaskCategoryID = "null";
			}
			$scope.showPopup('views/templates/closeRowTask.html?ver=3.74', 'addTask closeRowTask');
		}

		$scope.closeRowTaskSender = function () {
			var data = {
				taskId: $scope.appData.closeTaskId,
				taskDesc: $scope.appData.closeTaskDesc,
				task_category_comment: $scope.appData.closeTASK_CATEGORY_COMMENT,
				task_category_id: $scope.appData.closeTaskCategoryID
			};
			serverConnection.qa_tasks_close(data).then(function (res) {
				$scope.hidePopup();
				$scope.get_qa_tasks_load();
			}, function (error) {
			});
		}

		$scope.$parent.refresh = function () {
			$scope.get_qa_tasks()
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});

		$scope.openBug = function () {
			$scope.appData.usersWorkVal = {};
			$scope.appData.usersWorkVal.taskUserId = angular.copy($scope.appData.tasksObj.usersWork);
			$scope.appData.addTaskPop.task_category_id = $scope.appData.usersWork_task_catagory[0].TASK_CATEGORY_ID;
			if ($scope.appData.tasksObj.usersWork_tasks_type == 0) {
				$scope.appData.usersWorkVal.tasks_type = $scope.appData.usersWork_tasks_typePop[0].QA_TASK_TYPE_ID;
			}
			else {
				$scope.appData.usersWorkVal.tasks_type = anglar.copy($scope.appData.tasksObj.usersWork_tasks_type);
			}

			$scope.appData.usersWorkVal.taskTitle = '';
			$scope.appData.usersWork_priorityPop.forEach(function (v, i) {
				if (v.QA_TASK_PRIORTY_DESC == 'גבוה') {
					$scope.appData.usersWorkVal.priority = v.QA_TASK_PRIORTY_ID;
				}
			})
			$scope.showPopup('views/templates/addTaskMain.html?ver=3.74', 'addTask');
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
					token: null,
					companyAccountId: null,
					companyId: null,
					bankTransid: null,
					order_num: $scope.appData.usersWorkVal.order_num
				}
				serverConnection.qa_task_add(data).then(function (res) {
					$scope.appData.usersWorkVal.sent = false;

					$scope.get_qa_tasks()
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

		$scope.qa_task_by_serach_popup = function () {
			if (localStorage.getItem('qa_task_by_serach')) {
				$scope.appData.qa_task_by_serach = JSON.parse(localStorage.getItem('qa_task_by_serach'));
			} else {
				$scope.appData.qa_task_by_serach = {
					companyName: '',
					companyHp: '',
					jiraBugId: '',
					taskId: '',
					taskNumber: '',
					officeName: '',
					desc: ''
				}
			}
			$scope.showPopup('views/templates/qa_task_by_serach_popup.html?ver=3.74' + new Date().getTime(), 'billingPop qa_task_by_serach_popup');
		}
		$scope.qa_task_by_serach = function (forms) {
			if (forms.$valid) {
				localStorage.setItem('qa_task_by_serach', JSON.stringify($scope.appData.qa_task_by_serach))
				serverConnection.qa_task_by_serach($scope.appData.qa_task_by_serach)
				.then(function (data) {
					data.forEach(function (v){
						v.TASK_CATEGORY_NAME = $scope.getNameCategory(v.TASK_CATEGORY_ID)
					})
					$scope.appData.tasksViewArr = data;
					$scope.hidePopup();
				}, function (error) {
					$scope.hidePopup();
				});
			}
		}


		$scope.sending = function (dataExcel) {
			serverConnection.sendMail(dataExcel).then(function (res) {
				$scope.error = 'המייל נשלח בהצלחה';
				$scope.hidePopup();
			}, function (error) {
				$scope.error = 'המייל לא נשלח בהצלחה';
			});
		};
		$scope.sendMailer = function () {
			$scope.showPopup('views/templates/mailerTasksExport.html?ver=3.74', 'mailerPopup', false);
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});
	}


	angular.module('controllers')
	.controller('taskManagerCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', taskManagerCtrl]);
}());
