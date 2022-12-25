(function () {
    function periodicalCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
        $scope.$location =  $location;
        $scope.$state = $state;
        $scope.appData = AppData;
        $scope.popupTemplate = 'views/templates/alertPopup.html?ver=3.74';

        $scope.init = function() {
            $scope.showPopup = true;
            $scope.appData.user = JSON.parse(localStorage.getItem('acco_user'));
            if ($scope.appData.user) {
                if (!$scope.appData.companies)
                    $scope.login().then(function(response) {
                        if ($scope.appData.defMonth.ind_accountants == 0)
                            $scope.appData.selectedCompanyIndex = 0;
                    }, function(error) {
                        $scope.$state.go("login");
                    });
            }
            else
                $scope.$state.go("login");
        };

        $scope.selectCompany = function(company) {
            $scope.getCompaniesThisStrorage(company);
            if (!company.accounts) {
                serverConnection.getCompanyAccounts(company.companyId).then( function(accounts) {
                    $scope.appData.selectedCompany.accounts = accounts;
                    $scope.selectedCompanyAccount = $scope.appData.selectedCompany.accounts.bank_account_list[0];
                    $scope.getCompanyAccountData();
                }, function(error) {

                });
            }
        };

        $scope.getCompanyAccountData = function() {
            if(!$scope.selectedCompanyAccount.fixedActions) {
                serverConnection.getFixedActions($scope.appData.selectedCompany.companyId, $scope.selectedCompanyAccount.company_account_id).then(function(response) {
                    $scope.selectedCompanyAccount.fixedActions = response;
                }, function(error) {

                });
            }

            if(!$scope.selectedCompanyAccount.fixedActionsHTML) {
                serverConnection.getFixedActionsHTML($scope.appData.selectedCompany.companyId, $scope.selectedCompanyAccount.company_account_id).then(function(response) {
                    $scope.selectedCompanyAccount.fixedActionsHTML = response;
                }, function(error) {

                });
            }
        };

        $scope.showActionHtmlTable = function(element, action) {
            //debugger;
        };


        $scope.companyAccountChanged = function() {
            //debugger;
        };

        $scope.showPopup = function() {
            $scope.showPopup = true;
        };

        $scope.hidePopup = function() {
            $scope.showPopup = true;
        };
    }


    angular.module('controllers')
        .controller('periodicalCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', periodicalCtrl]);
}());
