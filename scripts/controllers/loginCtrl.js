(function () {
    function loginCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state) {
        $scope.$location = $location;
        $scope.$state = $state;
        $scope.appData = AppData;
        $scope.init = function () {
            if (location.hash && location.hash !== '#/login') {
                $scope.nextPage = location.hash.split('?')[1];
                if ($scope.nextPage) {
                    $scope.nextPage = '../#/' + $scope.nextPage;
                }
            }
            $scope.appData.user = $scope.appData.user || JSON.parse(localStorage.getItem('acco_user')) || JSON.parse(sessionStorage.getItem('acco_user'));
            if ($scope.appData.user !== undefined && $scope.appData.user !== null) {
                if ($scope.appData.user.email !== undefined && $scope.appData.user.password !== undefined) {
                    $scope.loginApp();
                }
            }
        };

        $scope.loginApp = function () {
            $scope.login().then(function (success) {
                var success = success.replace(/"/g, '');
                if (success !== '00000000-0000-0000-0000-000000000000') {
                    $scope.appData.logout = success;
                    localStorage.setItem('logout', success);
                    $scope.error = '';
                    $scope.getGeneralDataPermission().then(function (data) {
                        $scope.appData.defMonth = data;
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
                        if($scope.appData.defMonth.outind_ocr !== 1 && $scope.appData.defMonth.outind_ocr !== 3 && $scope.appData.defMonth.outind_ocr_popup === 1){
                            $scope.showPopup('views/templates/ocrLandingPageSupplier.html?ver=3.80', 'ocrLandingPageSupplierPopUp', true);
                        }
                        //if ($scope.appData.user.email == $scope.appData.user.password || $scope.appData.user.password.indexOf("B$") !== -1) {
                        //	$scope.showPopup('views/templates/terms.html?ver=3.80', 'termsPopUp', false);
                        //	return;
                        //}
                        //else {
                        if ($scope.appData.adminSoft) {
                            if (location.hash == '#/promo' || location.hash == '#/login') {
                                if (data.ind_accountants == 0) {
                                    $state.go('general.funds');
                                } else {
                                    $state.go('mainAccountants.managerAcc.companyDetails');
                                }
                            } else {
                                location.replace($scope.nextPage);
                            }
                        } else {
                            if (location.hash == '#/promo' || location.hash == '#/login') {
                                if (data.ind_accountants == 0) {
                                    $state.go('general.funds');
                                } else {
                                    if (data.ind_show_agreement == 0) {
                                        var skipPopAgree = window.localStorage.getItem("skipPopAgree");
                                        if (skipPopAgree == null) {
                                            $scope.appData.skipPopAgree = 0;
                                        } else {
                                            $scope.appData.skipPopAgree = skipPopAgree;
                                        }
                                        //$scope.showPopup('views/templates/agreement.html?ver=3.80', 'agreement', true);
                                    }
                                    $state.go('mainAccountants.main');
                                }
                            } else {
                                location.replace($scope.nextPage);
                            }
                        }
                        // $timeout(function () {
                        //     var alertFIBI = window.localStorage.getItem("alertFIBI");
                        //     if (alertFIBI == null) {
                        //         $scope.showPopup('views/templates/alertFIBI.html?ver=3.80', 'modalUpdateSystem');
                        //     }
                        // }, 2000);
                        //}
                    });
                } else {
                    $state.go('login');
                    $scope.error = 'הסיסמה שהוקשה שגויה. נסה/י שוב.';
                    $scope.loaderSubmit = false;
                    return false;
                }
            }, function (error) {
                $state.go('login');
                $scope.error = 'המערכת אינה זמינה כעת, אנא נסה שוב מאוחר יותר';
                $scope.loaderSubmit = false;
                return false;
            });
        }

        $scope.loginUser = function (loginForm) {
            if (loginForm.$valid || (loginForm.email.$error.unique || loginForm.password.$error.unique && (!loginForm.email.$error.required && !loginForm.password.$error.required))) {
                $scope.loaderSubmit = true;
                loginForm.email.$setValidity('unique', true);
                loginForm.password.$setValidity('unique', true);
                var mustChange = false;
                $scope.login().then(function (success) {
                    var success = success.replace(/"/g, '');
                    if (success !== '00000000-0000-0000-0000-000000000000') {
                        $scope.appData.logout = success;
                        localStorage.setItem('logout', success);
                        $scope.error = '';
                        $scope.getGeneralDataPermission()
                            .then(function (data) {
                                $scope.appData.defMonth = data;
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
                                if ($scope.appData.user.email == $scope.appData.user.password || $scope.appData.user.password.indexOf("B$") !== -1) {
                                    $scope.showPopup('views/templates/terms.html?ver=3.80', 'termsPopUp', false);
                                    return;
                                } else {
                                    if($scope.appData.defMonth.outind_ocr !== 1 && $scope.appData.defMonth.outind_ocr !== 3 && $scope.appData.defMonth.outind_ocr_popup === 1){
                                        $scope.showPopup('views/templates/ocrLandingPageSupplier.html?ver=3.80', 'ocrLandingPageSupplierPopUp', true);
                                    }
                                    if ($scope.appData.adminSoft) {
                                        if (location.hash == '#/login') {
                                            if (data.ind_accountants == 0) {
                                                dataLayer.push({
                                                    'event': 'User Login',
                                                    'UserID': $scope.appData.user.email,
                                                    'Plan Type': 'tazrim'
                                                });
                                                $state.go('general.funds');
                                            } else {
                                                dataLayer.push({
                                                    'event': 'User Login',
                                                    'UserID': $scope.appData.user.email,
                                                    'Plan Type': 'acc'
                                                });
                                                $state.go('mainAccountants.managerAcc.companyDetails');
                                            }
                                        } else {
                                            location.replace($scope.nextPage);
                                        }
                                    } else {
                                        if (location.hash == '#/login') {
                                            if (data.ind_accountants == 0) {
                                                dataLayer.push({
                                                    'event': 'User Login',
                                                    'UserID': $scope.appData.user.email,
                                                    'Plan Type': 'tazrim'
                                                });
                                                $state.go('general.funds');
                                            } else {
                                                if (data.ind_show_agreement == 0) {
                                                    var skipPopAgree = window.localStorage.getItem("skipPopAgree");
                                                    if (skipPopAgree == null) {
                                                        $scope.appData.skipPopAgree = 0;
                                                    } else {
                                                        $scope.appData.skipPopAgree = skipPopAgree;
                                                    }
                                                    //$scope.showPopup('views/templates/agreement.html?ver=3.80', 'agreement', true);
                                                }
                                                dataLayer.push({
                                                    'event': 'User Login',
                                                    'UserID': $scope.appData.user.email,
                                                    'Plan Type': 'acc'
                                                });
                                                $state.go('mainAccountants.main');
                                            }
                                        } else {
                                            location.replace($scope.nextPage);
                                        }
                                    }
                                    //$scope.loadApiWalkMe();
                                }

                                // $timeout(function () {
                                //     var alertFIBI = window.localStorage.getItem("alertFIBI");
                                //     if (alertFIBI == null) {
                                //         $scope.showPopup('views/templates/alertFIBI.html?ver=3.80', 'modalUpdateSystem');
                                //     }
                                // }, 2000);
                            });
                    } else {
                        $scope.error = 'הסיסמה שהוקשה שגויה. נסה/י שוב.';
                        $scope.loaderSubmit = false;
                        if (loginForm) {
                            loginForm.email.$setValidity('unique', false);
                            loginForm.password.$setValidity('unique', false);
                        }
                        return false;
                    }
                }, function (error) {
                    $scope.error = 'המערכת אינה זמינה כעת, אנא נסה שוב מאוחר יותר';
                    $scope.loaderSubmit = false;
                    if (loginForm) {
                        loginForm.email.$setValidity('unique', false);
                        loginForm.password.$setValidity('unique', false);
                    }
                    return false;
                });
            }
        };

        $scope.readTerms = function () {
            $scope.showPopup('views/changePassLogin.html?ver=3.80', 'changePassword', true);
        };
    }


    angular.module('controllers')
        .controller('loginCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', loginCtrl]);
}());
