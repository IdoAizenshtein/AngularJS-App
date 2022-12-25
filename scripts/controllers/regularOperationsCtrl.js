(function () {
    function regularOperationsCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $interval) {
        $scope.$location = $location;
        $scope.$state = $state;
        $scope.appData = AppData;
        $scope.accoConversions = accoConversions;
        $scope.alertError = false;

        $scope.init = function () {
            $scope.changeType();
            if ($scope.appData.selectedCompany && $scope.appData.selectedCompany.accounts.bank_account_list !== null) {
	            $scope.appData.listAcc = [];
	            $scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (item) {
		            if(item.currency_id === 1){
			            $scope.appData.listAcc.push(item);
                    }
	            });

                $scope.selectedAccount = $scope.appData.selectedCompany.accounts.bank_account_list[0].company_account_id;
            }
            $scope.alertError = false;
            $scope.state_enable = false;
        };
        $scope.banks = $scope.accoConversions.getAllBanks();
        $scope.cards = $scope.accoConversions.getAllCards();
        $scope.slika = $scope.accoConversions.getAllSlika();

        $scope.changeType = function () {
            switch ($scope.appData.popupType) {
                case 0:
                    $scope.selectedForm = $scope.banks;
                    $scope.title = ' הוספת חשבון בנק';
                    $scope.labelTitle = 'בנק';
                    $scope.titleInside = 'חשבון הבנק';
                    break;
                case 1:
                    $scope.selectedForm = $scope.cards;
                    $scope.title = 'הוסף כרטיס אשראי';
                    $scope.labelTitle = 'כרטיס אשראי';
                    $scope.titleInside = 'כרטיס אשראי';
                    break;
                case 2:
                    $scope.selectedForm = $scope.slika;
                    $scope.title = 'הוסף חשבון סליקה';
                    $scope.labelTitle = 'סולק';
                    $scope.titleInside = 'סליקה';
                    break;
            }
            $scope.selectedPost = $scope.selectedForm[0];
        };

        $scope.getTokenStatus = function (successtoken) {
            $scope.state_enable = true;
            var deferred = $q.defer();
            function internalFunc(t) {
                $timeout(function () {
                    serverConnection.tokenStatus(successtoken).then(function (status) {
                        var error = 0;
                        if (status.status_id == 9 || status.status_id == 10) {
                            error++;
                            if ($scope.appData.companyIdPopUp) {
                                $scope.hidePopup();
                            }
	                        $scope.errorRed = false;
                            $scope.error = 'מתבצע ניסיון לחיבור ראשוני';
                            $scope.alertError = true;
	                        internalFunc(5000);
                        } else if (status.status_id == 1) {
                            error++;
	                        $scope.errorRed = true;
	                        $scope.error = 'קיימת בעיה טכנית, אנא פנה לתמיכת bizibox 03-5610382';
                            $scope.alertError = true;
                            $scope.state_enable = false;
                        } else if (status.status_id == 2) {
                            error++;
	                        $scope.errorRed = true;
	                        $scope.error = 'אחד או יותר מהפרטים המזהים שהקלדת שגוי. אנא נסה/י שנית.';
                            $scope.alertError = true;
                            $scope.state_enable = false;
                        } else if (status.status_id == 3) {
                            error++;
	                        $scope.errorRed = true;
	                        $scope.error = 'גישתך לחשבון חסומה';
                            $scope.alertError = true;
                            $scope.state_enable = false;
                        } else if (status.status_id == 4) {
                            error++;
	                        $scope.errorRed = true;
	                        $scope.error = 'סיסמתך בבנק פגה, אנא החלף סיסמה בבנק';
                            $scope.alertError = true;
                            $scope.state_enable = false;
                        } else if (!error) {
	                        $scope.errorRed = false;
	                        $scope.error = 'ההתחברות בוצעה בהצלחה!';
                            $scope.alertError = true;
                            $scope.state_enable = true;
                            deferred.resolve(status.token_id);
                        }
                    });
                }, t);
            }

	        internalFunc(0);
            return deferred.promise;
        };

        $scope.getAccounts = function (status) {
            var stop;
            var deferred = $q.defer();
            stop = $interval(function () {
                serverConnection.tokenPostStatus(status).then(function (accid) {
                    $scope.error = 'מתבצע איסוף נתונים';
                    if (accid.length !== 0) {
                        $interval.cancel(stop);
                        deferred.resolve(accid);
                    }
                });
            }, 5000);
            return deferred.promise;
        };

        $scope.accountHaspeulot = function (acchas) {
            var stopInterval;
            var deferred = $q.defer();
            stopInterval = $interval(function () {
                serverConnection.accountHaspeulot(acchas).then(function (getaccounts) {
                    $scope.error = 'מתבצעת בדיקת הימצאות נתונים';
                    if (getaccounts == 'true') {
                        deferred.resolve(getaccounts);
                        $interval.cancel(stopInterval);
                        $scope.error = 'יש נתונים';
                    }
                    else {
                        deferred.reject('resaon');
                    }
                });
            }, 5000);
            return deferred.promise;
        };

        $scope.getPeulotKvuot = function (getaccounts) {
            var deferred = $q.defer();
            serverConnection.getPeulotKvuot(getaccounts).then(function (getAllPeuolot) {
                $scope.error = 'קבלת נתונים';
                deferred.resolve(getAllPeuolot);
            });
            return deferred.promise;
        };

        $scope.disabled = function (e) {
            if ($scope.state_enable == true) {
                return true;
            }
            else {
                return false;
            }
        };

        $scope.addPost = function (formReg) {
            if (formReg.$valid) {
                $scope.state_enable = true;
	            var id;
	            if($scope.appData.selectedCompany && $scope.appData.selectedCompany.companyId){
		            id = $scope.appData.selectedCompany.companyId;
	            }
                if ($scope.selectedPost.val == '999') {
	                if ($scope.appData.popupType != 0) {
		                id = $scope.selectedAccount;
	                }
	                if ($scope.appData.companyIdPopUp) {
		                id = $scope.appData.companyIdPopUp;
	                }
                    var indAccPoalim = 0;
                    if ($scope.$state.current.name == 'mainAccountants.exportHashv') {
                        indAccPoalim = 1;
                    }
                    var data = {
                        companyId: id,
                        bankId: '12',
                        bankSnifId: $scope.selectedPost.inputs[0].data.trim(),
                        bankAccId: $scope.selectedPost.inputs[1].data.trim(),
                        indAccPoalim: indAccPoalim
                    }
                    serverConnection.insertPoalimBasakim(data).then(function (res) {
                        if (res !== '00000000-0000-0000-0000-000000000000') {
                            $scope.gettokensalertsload();
                            $scope.hidePopup();
                            $scope.state_enable = false;
                            location.reload();
                        }
                        else{
                            $scope.alertError = true;
                            $scope.error = 'פרטי הכניסה קיימים במערכת';
                            $scope.state_enable = false;
                            $scope.errorRed = true;
                        }
                    }, function (error) {
                        if (error.status) {
                            if (error.status == 409) {
                                $scope.alertError = true;
                                $scope.error = 'פרטי הכניסה קיימים במערכת';
                                $scope.state_enable = false;
	                            $scope.errorRed = true;
                            }
                            if (error.status == 500) {
	                            $scope.errorRed = true;

	                            $scope.alertError = true;
                                $scope.state_enable = false;
                                $scope.error = 'המערכת אינה זמינה כעת, אנא נסו שנית מאוחר יותר';
                            }
                        }
                    });
                }
                else {
                    var ind_acc_bank = 1;
                    if ($scope.appData.popupType != 0) {
                        id = $scope.selectedAccount;
                    }
                    if ($scope.appData.companyIdPopUp) {
                        id = $scope.appData.companyIdPopUp;
                        ind_acc_bank = 1;
                    }
                    serverConnection.banksPost(id, $scope.selectedPost, ind_acc_bank).then(function (success) {
                        var successtoken = success.token_id;
                        if ($scope.appData.companyIdPopUp) {
                            $scope.appData.companyIdPopUp = null;
                            $scope.gettokensalertsload();
                            return false;
                        }
                        return $scope.getTokenStatus(successtoken);
                    }).then(function (status) {
                        if ($scope.appData.popupType != -1) {
                            location.reload();
                        }
                        else {
                            return $scope.getAccounts(status);
                        }
                    }).then(function (acchas) {
                        if (acchas.length > 0 && $scope.appData.popupType == 0) {
                            $scope.setCookie("companyId", acchas[0].account_id, 30);
                            $scope.setCookie("companyName", acchas[0].company_account_id, 30);
                            location.replace("../regularOperations.html");
                        }
                        else {
                            $scope.hidePopup();
                        }
                    }, function (error) {
                        if (error.status) {
                            if (error.status == 409) {
                                $scope.alertError = true;
                                $scope.error = 'פרטי הכניסה קיימים במערכת';
                                $scope.state_enable = false;
	                            $scope.errorRed = true;

                                //setTimeout(function () {
                                //    location.reload();
                                //}, 5000);
                            }
                            if (error.status == 500) {
	                            $scope.errorRed = true;
	                            $scope.alertError = true;
                                $scope.state_enable = false;
                                $scope.error = 'המערכת אינה זמינה כעת, אנא נסו שנית מאוחר יותר';
                            }
                        }
                    });

                }
            }
        };

        $scope.$watch('appData.popupType', function (newVal, oldVal) {
            if (newVal != undefined) {
                $scope.changeType();
            }
        });

        $scope.$watch('appData.showPopup', function (newVal, oldVal) {
            if (newVal == false) {
	            $scope.init();
                // $scope.alertError = false;
                // $scope.selectedPost.inputs.forEach(function (value, key) {
                //     value.data = null;
                // });
            }
        });

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + "; " + expires + "; " + "path=/";
        }


    }


    angular.module('controllers')
        .controller('regularOperationsCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$interval', regularOperationsCtrl]);
}());
