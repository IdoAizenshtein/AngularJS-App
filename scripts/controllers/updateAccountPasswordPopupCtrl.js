(function () {
	function updateAccountPasswordPopupCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $interval) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.init = function () {
			$scope.changeType();

			$scope.appData.errorProgressBank = false;
			$scope.appData.progressBankData = false;
			var bankNum;
			if (!$scope.appData.popupTypeLink) {
				if ($scope.appData.popupType !== 2) {
					bankNum = $scope.appData.popupData.token;
				} else {
					bankNum = $scope.appData.popupData.token_data;
				}
			} else {
				bankNum = $scope.appData.popupDataBanks;
			}
			$scope.appData.numberOfBank = parseFloat(bankNum.BankNumber);
		};
		$scope.banks = $scope.accoConversions.getAllBanks();
		$scope.cards = $scope.accoConversions.getAllCards();
		$scope.slika = $scope.accoConversions.getAllSlika();
		$scope.changeType = function () {
			switch ($scope.appData.popupType) {
				case 0:
					$scope.selectedForm = $scope.banks;
					break;
				case 1:
					$scope.selectedForm = $scope.cards;
					break;
				case 2:
					$scope.selectedForm = $scope.slika;
					break;
			}
			$scope.selectedPost = $scope.selectedForm[0];
		};
		$scope.changeAccountPassword = function (form) {
			// if (form.$valid) {
			$scope.appData.progressBankData = true;
			$scope.appData.showSucUpdPass = false;
			$scope.appData.errorProgressBank = false;
			var userName = null, identifier = null, password = null, passRepeat = null;
			var token, bankNum, status;

			if (!$scope.appData.popupTypeLink) {
				if ($scope.appData.popupType !== 2) {
					token = $scope.appData.popupData.token.token;
					bankNum = $scope.appData.popupData.token;
					status = $scope.appData.popupData.token.status;
				}
				else {
					token = $scope.appData.popupData.token_data.token;
					bankNum = $scope.appData.popupData.token_data;
					status = $scope.appData.popupData.token_data.status;
				}
			} else {
				status = $scope.appData.popupTypeStatus;
				token = $scope.appData.popupDataToken;
				bankNum = $scope.appData.popupDataBanks;
			}
			if (((status && status === 2)) && $scope.password.trim() !== $scope.passRepeat.trim()) {
				$scope.appData.errorProgressBank = "הסיסמאות אינן תואמות";
			}
			else {
				// if (bankNum.BankNumber === 157 || bankNum.BankNumber === 158) {
				// 	password = null;
				// 	identifier = $scope.password.trim();
				// }
				// else {
				// 	password = $scope.password.trim();
				// 	identifier = null;
				// }
				password = $scope.password.trim();
				identifier = null;
				serverConnection.updateToken(token, password, identifier, null).then(function (success) {
					$scope.tokenStatusLoad(token);
				}, function (error) {
					//   alert(error)
					$scope.appData.popupTypeLink = false;
				});
			}
			// }
			// else{
			// 	debugger
			// }
		};
		$scope.passwordsMatch = function () {
			var bankNum, status;
			if (!$scope.appData.popupTypeLink) {
				if ($scope.appData.popupType !== 2) {
					bankNum = $scope.appData.popupData.token.BankNumber;
					status = $scope.appData.popupData.token.status;
				}
				else {
					bankNum = $scope.appData.popupData.token_data.BankNumber;
					status = $scope.appData.popupData.token_data.status;
				}
			}
			else {
				status = $scope.appData.popupTypeStatus;
				bankNum = $scope.appData.popupDataBanks.BankNumber;
			}
			if (!$scope.password || (((status && status === 2)) && $scope.password !== $scope.passRepeat)) {
				return false;
			}
			return true;
		};
		$scope.passwordsMatchAlert = function () {
			var bankNum, status;
			if (!$scope.appData.popupTypeLink) {
				if ($scope.appData.popupType !== 2) {
					bankNum = $scope.appData.popupData.token.BankNumber;
					status = $scope.appData.popupData.token.status;
				}
				else {
					bankNum = $scope.appData.popupData.token_data.BankNumber;
					status = $scope.appData.popupData.token_data.status;
				}
			}
			else {
				bankNum = $scope.appData.popupDataBanks.BankNumber;
				status = $scope.appData.popupTypeStatus;
			}
			if (((bankNum !== 157 && bankNum !== 158) || (status && status === 2)) && ($scope.password !== undefined && $scope.passRepeat !== undefined && ($scope.password !== $scope.passRepeat))) {
				return false;
			}
			return true;
		};
		$scope.checkMarkod = function () {
			var bankNum, status;
			if (!$scope.appData.popupTypeLink) {
				if ($scope.appData.popupType !== 2) {
					bankNum = $scope.appData.popupData.token.BankNumber;
					status = $scope.appData.popupData.token.status;
				}
				else {
					bankNum = $scope.appData.popupData.token_data.BankNumber;
					status = $scope.appData.popupData.token_data.status;
				}
			}
			else {
				status = $scope.appData.popupTypeStatus;
				bankNum = $scope.appData.popupDataBanks.BankNumber;
			}
			// if (bankNum !== 157 && bankNum !== 158) {
			// 	return true;
			// } else {
			// 	if (status && status === 2) {
			// 		return true;
			// 	} else {
			// 		return false;
			// 	}
			// }
			if (status && status === 2) {
				return true;
			} else {
				return false;
			}
		}
		$scope.$watch('appData.popupType', function (newVal, oldVal) {
			if (newVal != undefined) {
				$scope.changeType();
			}
		});
		$scope.$watch('appData.popupData', function (newVal, oldVal) {
			if (newVal != undefined) {
				$scope.changeType();
			}
		}, true);
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {
			if (newVal == false) {
				$scope.password = null;
				$scope.passRepeat = null;
			}
		});
		$scope.accountUpdatePopup = function () {
			var token;

			if (!$scope.appData.popupTypeLink) {
				if ($scope.appData.popupType !== 2) {
					token = $scope.appData.popupData.token.token;
				}
				else {
					token = $scope.appData.popupData.token_data.token;
				}
			} else {
				token = $scope.appData.popupDataToken;
			}

			if ($scope.appData.popupType !== 2) {
				$scope.appData.popupData = {
					token: {
						BankNumber: $scope.appData.numberOfBank,
						token: token
					}
				};
			}
			else {
				$scope.appData.popupData = {
					token_data: {
						BankNumber: $scope.appData.numberOfBank,
						token: token
					}
				};
			}
			$scope.showPopup('views/templates/accountUpdatePopup.html?ver=3.74' + new Date().getTime(), 'accountUpdatePopup');
		};
	}


	angular.module('controllers')
	.controller('updateAccountPasswordPopupCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$interval', updateAccountPasswordPopupCtrl]);
}());
