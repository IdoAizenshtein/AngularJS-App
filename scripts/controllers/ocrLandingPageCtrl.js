(function () {
    function ocrLandingPageCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
        $scope.$location = $location;
        $scope.$state = $state;
        $scope.$utils = utils;
        $scope.accoConversions = accoConversions;
        $scope.appData = AppData;
        $scope.nextPage = $state.params.url;
        $scope.months = utils.monthNames();
        $scope.years = utils.yearsKsafim(3);
        $scope.date = new Date();
        $scope.first = true;
        $scope.showAlertNull = false;
        $scope.accountFilter = {company_account_id: ''};

        $scope.loaderAnalysis = false;
        $scope.params = {
            "fullName": "",
            "cell": ""
        }
        $scope.init = function () {
            if (!$scope.appData.leadSource_create_lead_ocr) {
                $scope.appData.leadSource_create_lead_ocr = $scope.$state.current.name.includes('ocrLandingPageSupplier') ? 'supplier' : 'bank';
            }
        }
        $scope.selectCompany = function (company) {
            $scope.getCompaniesThisStrorage(company);
            $scope.$broadcast('widthChanged');
            $scope.appData.changeListAnalisis = false;
            $scope.getCompanyAccounts().then(function (res) {
                $scope.appData.selectedCompany.accounts = res;
            }, function (error) {
            });
        };
        $scope.loadPage = function () {
            $scope.loaderChecks = false;
        };

        $scope.refresh = function () {
            $scope.loadPage();
        };
        $scope.$on('refresh', function () {
            $scope.refresh();
        });
        $scope.help = function () {
            window.open('http://bizibox.biz/help/bookkeeping', '_blank');
        };
        $scope.sending = function (dataExcel) {
            serverConnection.sendMail(dataExcel).then(function (res) {
                $scope.error = 'המייל נשלח בהצלחה';
                $scope.hidePopup();
            }, function (error) {
                $scope.error = 'המייל לא נשלח בהצלחה';
            });
        };

        $scope.create_lead_ocr_send = function (form) {
            if (form.$valid) {
                $scope.params.leadSource = $scope.appData.leadSource_create_lead_ocr;
                serverConnection.create_lead_ocr($scope.params).then(function (res) {
                    form.$setPristine();
                    form.$setUntouched();
                    $scope.showPopup('views/templates/create_lead_ocr_sent.html?ver=3.74', 'create_lead_ocr_sent', true);
                    setTimeout(function () {
                        $scope.hidePopup();
                        // if ($scope.appData.leadSource_create_lead_ocr === 'supplier') {
                        //     window.open("https://bsecure.bizibox.biz/signup/personal-data", "_self");
                        // }
                    }, 1500)
                }, function (error) {

                });
            }
        };

        $scope.sendMailer = function () {
            $scope.showPopup('views/templates/mailerChecks.html?ver=3.74', 'mailerPopup', false);
        };
        $scope.$watch('appData.showPopup', function (newVal, oldVal) {
            if (newVal == false) {
                $scope.error = '';
            }
        });
    }

    angular.module('controllers')
        .controller('ocrLandingPageCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', ocrLandingPageCtrl]);
}());

