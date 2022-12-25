(function () {
	function managementTeamCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.utils = utils;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.months = utils.monthNames();
		$scope.years = utils.years(5);
		$scope.date = new Date();
		$scope.loaderAccTeam = true;
		$scope.init = function () {
			$scope.loadAccTeamPage();
		}
		$scope.addPersonToTeamForm = false;

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

		$scope.loadAccTeamPage = function () {
			$scope.loaderAccMain = true;
			serverConnection.getTeamCompanysAcc().then(function (res) {
				$scope.appData.teamCompany = res;
				$scope.loaderAccTeam = false;
			}, function (error) {

			});
		};
		$scope.titleJobs = [
			{
				name: 'רואה חשבון',
				val: 'f438b479-81cb-4be5-8152-38e1eb838af9'
			},
			{
				name: 'מנהל חשבונות',
				val: '6e5291cd-0aab-4a11-a3ad-9991da5c0d24'
			},
			{
				name: 'יועץ מס',
				val: 'e3280343-d30c-1d33-e040-a8c0e10a2b20'
			}
		];

		$scope.addPerson = function () {
			if (!$scope.addPersonToTeamForm) {
				$scope.addPersonDetails = {
					fullName: '',
					phoneNum: '',
					titleJob: $scope.titleJobs[0].val,
					mail: '',
					ipaddress: ''
				}
				$scope.addPersonToTeamForm = true;
			}
		}


		$scope.closeAddPerson = function (addPersonTeam) {
			if (addPersonTeam) {
				addPersonTeam.$setPristine();
				addPersonTeam.$setUntouched();
			}
			$scope.addPersonToTeamForm = false;
		}

		$scope.addPersonToTeam = function (addPersonTeam) {
			var data = {
				user_name: $scope.addPersonDetails.mail,
				defining_user_id: null,
				mail: $scope.addPersonDetails.mail,
				first_name: $scope.addPersonDetails.fullName.split(' ')[0],
				last_name: $scope.addPersonDetails.fullName.split(' ')[1],
				phone_number: $scope.addPersonDetails.phoneNum,
				job_title_id: $scope.addPersonDetails.titleJob,
				workplace_company_id: null,
				ipaddress: $scope.addPersonDetails.ipaddress
			}
			serverConnection.sendAddPersonToTeam(data).then(function (res) {
				addPersonTeam.$setPristine();
				addPersonTeam.$setUntouched();
				$scope.addPersonToTeamForm = false;
				$scope.loadAccTeamPage()
			}, function (error) {

			});
		}
		$scope.appData.loaderPopSett = true;
		$scope.openSettingsTeam = function (id, name) {
			$scope.appData.loaderPopSett = true;
			$scope.appData.teamSettings = [];
			$scope.showPopup('views/templates/popupSettingsTeams.html?ver=3.74', 'popupSettingsTeams');
			$scope.appData.childUserIdPopUpSett = {'id': id, 'name': name};
			serverConnection.userGetchildusercompanies(id).then(function (res) {
				$scope.appData.teamSettings = res;
				$scope.reverse = false;
				$scope.appData.loaderPopSett = false;
			}, function (error) {

			});
		}

		$scope.setCheck = function (b, id) {
			b.disabled = true;
			$scope.appData.loaderPopSett = true;

			var data = {
				'privs': [
					{
						'user_id': b.user_id,
						'target_id': id,
						'priv_type_id': b.priv_type_id,
						'priv_type_name': b.priv_type_name,
						'priv_value': b.priv_value
					}
				],
				'userId': $scope.appData.childUserIdPopUpSett.id
			}
			serverConnection.userSetPrivs(data).then(function (res) {
				if(res == 0){
					b.disabled = false;
					$scope.appData.loaderPopSett = false;
				}
			}, function (error) {

			});
		}
		$scope.setCheckAll = function (arr) {
			arr.disabled = true;
			$scope.appData.loaderPopSett = true;

			var arrays = [];
			var indAccPriv;
			if(arr.indAccPriv == true){
				indAccPriv = true;
			}
			else{
				indAccPriv = false;
			}
			arr.privTab.forEach(function (b) {
				if (b.priv_type_id == '43e97298-c80e-4b70-b198-967709716513') {
					b.priv_value = indAccPriv;
					arrays.push({
						'user_id': b.user_id,
						'target_id': arr.companyId,
						'priv_type_id': b.priv_type_id,
						'priv_type_name': b.priv_type_name,
						'priv_value': indAccPriv
					})
				}
				if (b.priv_type_id == '6b265854-958a-4501-8207-d9f99d8d3f2a') {
					b.priv_value = indAccPriv;
					arrays.push({
						'user_id': b.user_id,
						'target_id': arr.companyId,
						'priv_type_id': b.priv_type_id,
						'priv_type_name': b.priv_type_name,
						'priv_value': indAccPriv
					})
				}
			});
			var data = {
				'privs': arrays,
				'userId': $scope.appData.childUserIdPopUpSett.id
			}
			serverConnection.userSetPrivs(data).then(function (res) {
				if(res == 0) {
					arr.disabled = false;
					$scope.appData.loaderPopSett = false;
				}
			}, function (error) {

			});
		}

		$scope.sort_by = function (predicate) {
			$scope.predicate = predicate;
			$scope.reverse = !$scope.reverse;
		};
		$scope.$parent.refresh = function () {
			$scope.loadAccTeamPage()
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
		$scope.Showhelp = false;
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
			$scope.showPopup('views/templates/mailerMainAcc.html?ver=3.74', 'mailerPopup', false);
		};
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {

			if (newVal == false) {
				$scope.error = '';
			}
		});
	}


	angular.module('controllers')
		.controller('managementTeamCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', managementTeamCtrl]);
}());
