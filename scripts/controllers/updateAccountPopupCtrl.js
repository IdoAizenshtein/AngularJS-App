(function () {
	function updateAccountPopupCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $interval) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.alertError = false;

		$scope.init = function () {
			$scope.changeType();
			$scope.alertError = false;
		};

		$scope.banks = $scope.accoConversions.getAllBanks();
		$scope.cards = $scope.accoConversions.getAllCards();
		$scope.slika = $scope.accoConversions.getAllSlika();
		$scope.nameTitle = function () {
			switch ($scope.appData.popupType) {
				case 0:
					return 'חשבון הבנק'
					break;
				case 1:
					return 'כרטיס אשראי';
					break;
				case 2:
					return 'סליקה';
					break;
			}
		}
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

			var len = $scope.selectedForm.length;
			for (var i = 0; i < len; i++) {
				if ($scope.appData.popupType !== 2) {
					if ($scope.appData.popupData.token.BankNumber.toString() == '58') {
						if ($scope.selectedForm[i].val.toString() == '11') {
							$scope.selectedPost = $scope.selectedForm[i];
							return;
						}
					}
					if ($scope.appData.popupData.token.BankNumber.toString() == '57') {
						if ($scope.selectedForm[i].val.toString() == '17') {
							$scope.selectedPost = $scope.selectedForm[i];
							return;
						}
					}

					if (parseFloat($scope.selectedForm[i].val) == parseFloat($scope.appData.popupData.token.BankNumber)) {
						$scope.selectedPost = $scope.selectedForm[i];
						return;
					}
				}
				else {
					if (parseFloat($scope.selectedForm[i].val) == parseFloat($scope.appData.popupData.token_data.BankNumber)) {
						$scope.selectedPost = $scope.selectedForm[i];
						return;
					}
				}
			}

			// $scope.selectedPost = $scope.selectedForm[0];
		};
		$scope.update = function () {
			// $scope.alertError = true;
			// $scope.error = 'מתחבר לראשונה';
			$scope.appData.progressBankData = true;
			$scope.appData.showSucUpdPass = false;
			$scope.appData.errorProgressBank = false;

			var userName = null,
				identifier = null,
				password = null,
				passRepeat = null,
				len = $scope.selectedPost.inputs.length;
			for (var i = 0; i < len; i++) {
				if ($scope.selectedPost.inputs[i].val == 'bank_user_name')
					identifier = $scope.selectedPost.inputs[i].data;
				if ($scope.selectedPost.inputs[i].val == 'bank_auto')
					userName = $scope.selectedPost.inputs[i].data;
				if ($scope.selectedPost.inputs[i].val == 'bank_pass')
					password = $scope.selectedPost.inputs[i].data;
			}
			var token;
			if ($scope.appData.popupType !== 2) {
				token = $scope.appData.popupData.token.token;
			}
			else {
				token = $scope.appData.popupData.token_data.token;
			}
			serverConnection.updateTokenAccount(token, password, userName, identifier).then(function (success) {
				// $scope.alertError = true;
				// $scope.error = 'התחברות בהצלחה';
				// $scope.hidePopup();

				$scope.tokenStatusLoad(token);
			}, function (error) {
				$scope.appData.popupTypeLink = false;
				// $scope.alertError = true;
				// $scope.error = 'סיסמא שגוייה';
			})
		};

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
				$scope.alertError = false;
				if ($scope.selectedPost.inputs !== undefined) {
					$scope.selectedPost.inputs.forEach(function (value, key) {
						value.data = null;
					});
				}
			}
		});

	}


	angular.module('controllers')
		.controller('updateAccountPopupCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$interval', updateAccountPopupCtrl]);
}());
