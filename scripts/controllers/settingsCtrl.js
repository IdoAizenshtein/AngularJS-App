(function () {
    function settingsCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $http) {
        $scope.$location = $location;
        $scope.$state = $state;
        $scope.appData = AppData;
        $scope.accoConversions = accoConversions;
        $scope.appData.accounts_and_cc = true;
        $scope.appData.out_of_banks_cc = true;
        $scope.appData.solkimArr = true;
        $scope.appData.loaderSettAcc = false;
        $scope.appData.redErrorFilterType = false;
        $scope.typesFilters = {
            allFiltersSett: true
        };
        $scope.get_discount_4item_4acc_data = [];
        $scope.appData.remove = false;
        $scope.fromMonYear = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        $scope.toMonYear = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1);
        $scope.fromDatePick = new Date();
        $scope.toDatePick = new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate());
        $scope.init = function () {
            $timeout(function () {
                $scope.appData.datesPicker = {
                    fromDatePicker: ("0" + (parseInt($scope.fromDatePick.getDate()))).slice(-2) + '/' + ("0" + (parseInt($scope.fromDatePick.getMonth() + 1))).slice(-2) + '/' + $scope.fromMonYear.getFullYear(),
                    toDatePicker: ("0" + (parseInt($scope.toDatePick.getDate()))).slice(-2) + '/' + ("0" + (parseInt($scope.toDatePick.getMonth() + 1))).slice(-2) + '/' + $scope.toDatePick.getFullYear()
                };
                if ($state.current.name == 'settings.paymentsDetails.details' || $state.current.name == 'settings.paymentsDetails.clients' || $state.current.name == 'settings.paymentsDetails.potentialCustomers') {
                    $state.go('settings.payments');
                    $timeout(function () {
                        $scope.loadPayments();
                    }, 1000);
                }
                $scope.hideColmnCrads = false;
                $scope.showPopPassword = false;
                $scope.appData.showAllDeleted = false;
                $scope.appData.showAllDeletedB = false;
                $scope.appData.showAllDeletedC = false;
                if ($state.current.name == 'settings.payments') {
                    $scope.loadPayments();
                }
            }, 200)
        };
        $scope.appData.typeHiuv = "0";
        //if ($scope.appData.companies) {
        //    $scope.$emit('getCompaniesThis');
        //}
        $scope.loaderSettPays = false;
        $scope.getTypeCard = function (type) {
            switch (type) {
                case "visa":
                    return 2;
                    break;
                case "isracard":
                    return 5;
                    break;
                case "maestro":
                    return 3;
                    break;
                case "forbrugsforeningen":
                    return 0;
                    break;
                case "dankort":
                    return 0;
                    break;
                case "mastercard":
                    return 1;
                    break;
                case "amex":
                    return 0;
                    break;
                case "dinersclub":
                    return 0;
                    break;
                case "discover":
                    return 0;
                    break;
                case "unionpay":
                    return 0;
                    break;
                case "jcb":
                    return 0;
                    break;
            }
        }
        $scope.selectCompany = function (company) {
            $scope.getCompaniesThisStrorage(company);
            if ($scope.appData.selectedCompany.bank_match_type == 2) {
                $scope.appData.toggleChangeSet = true;
            } else {
                $scope.appData.toggleChangeSet = false;
            }
            $scope.$broadcast('widthChanged');
            $scope.loadAllData()
        };
        $scope.loadAllData = function () {
            $scope.loaderSettPays = true;
            if ($state.current.name == 'settings.payments') {
                $scope.loadPayments();
            } else if ($state.current.name == 'settings.paymentsDetails.details') {
                $scope.groupOfCardsValChange($scope.appData.groupOfCardsVal);
            } else if ($state.current.name == 'settings.paymentsDetails.clients') {
                $scope.existing_company_calc();
            } else if ($state.current.name == 'settings.paymentsDetails.potentialCustomers') {
                $scope.get_potential_companies();
            } else {
                $scope.getCompanyAccounts().then(function (res) {
                    $scope.appData.selectedCompany.accounts = res;
                }, function (error) {
                });
                if ($state.current.name == 'settings.accounts') {
                    $scope.appData.loaderSettAcc = true;
                    serverConnection.getTokens($scope.appData.selectedCompany.companyId)
                        .then(function (tokens) {
                            $scope.appData.selectedCompany.tokens = tokens;
                            if ($scope.appData.selectedCompany.tokens.accounts_and_cc.length) {
                                var accConsolidationSolek = [];
                                $scope.appData.selectedCompany.tokens.accounts_and_cc.forEach(function (account, indexAcc) {
                                    $scope.appData.selectedCompany.tokens.accounts_and_cc[indexAcc].notShow = false;

                                    account.accounts.forEach(function (subaccount) {
                                        if (!subaccount.deleted) {
                                            accConsolidationSolek.push(subaccount);
                                            $scope.appData.selectedCompany.tokens.accounts_and_cc[indexAcc].notShow = true;
                                        }
                                    });
                                });
                                if (accConsolidationSolek.length > 1) {
                                    var ind = 0;
                                    accConsolidationSolek.forEach(function (v, i) {
                                        if (i > 0) {
                                            if (v.company_account_id !== accConsolidationSolek[i - 1].company_account_id) {
                                                ind = 1;
                                            }
                                        }
                                    });
                                    if (ind == 1) {
                                        $scope.appData.editSoleks = true;
                                    } else {
                                        $scope.appData.editSoleks = false;
                                    }
                                } else if (accConsolidationSolek.length == 1) {
                                    $scope.appData.editSoleks = true;
                                } else {
                                    $scope.appData.editSoleks = false;
                                }
                            } else {
                                $scope.appData.editSoleks = false;
                            }
                            $scope.appData.loaderSettAcc = false;

                        }, function (error) {
                            $scope.appData.loaderSettAcc = false;
                        });
                }
                if ($state.current.name == 'settings.alerts') {
                    $scope.msgTypeCategoriesGet()
                }
                if ($state.current.name == 'settings.cards') {
                    $scope.loadSettCards()
                }
                if ($state.current.name == 'settings.about') {
                    $scope.loadAsimon();
                }
                if ($state.current.name == 'settings.companies') {
                    $scope.appData.collections = false;
                    $scope.loadCompanyDet();
                }
                if ($state.current.name == 'settings.users') {
                    $scope.loadCompanyGetusers();
                }
            }
        }
        $scope.loadAsimon = function () {
            serverConnection.company_get_api_token($scope.appData.selectedCompany.companyId).then(function (tokens) {
                $scope.appData.tokenAsimon = tokens.token;
            }, function (error) {
            });
        }
        $scope.setAsimon = function () {
            serverConnection.company_set_api_token($scope.appData.selectedCompany.companyId).then(function (tokens) {
                $scope.appData.tokenAsimon = tokens.token;
            }, function (error) {
            });
        }
        $scope.changeAsimon = function () {
            $scope.showPopup('views/templates/alertsPrevSetChangeAsimon.html?ver=3.74' + new Date().getTime(), 'alertsPrevChangeAsimon');
        }
        $scope.PAYMENT_TYPE_ID = function (PAYMENT_TYPE_ID) {
            switch (PAYMENT_TYPE_ID) {
                case 1:
                    return 'מזומן'
                    break;
                case 2:
                    return 'צ\'ק'
                    break;
                case 4:
                    return 'העברה בנקאית'
                    break;
                case 5:
                    return 'הרשאה לחיוב חשבון'
                    break;
            }
        }
        $scope.add_discount_4item_4acc = function (index, BILLING_ACCOUNT_ID) {
            $scope.appData.cancel_discount_4item_4acc = false;
            if (index !== undefined) {
                $scope.appData.add_discount_4item_4acc = {
                    index: index,
                    BILLING_ACCOUNT_ID: BILLING_ACCOUNT_ID
                }
                $scope.showPopup('views/templates/setPass.html?ver=3.74' + new Date().getTime(), 'set_sug_hiuv');
            } else {
                $scope.hidePopup();
                $scope.appData.user_get_billing_account[$scope.appData.add_discount_4item_4acc.index].get_discount_4item_4acc.push({
                    billingAccountId: $scope.appData.add_discount_4item_4acc.BILLING_ACCOUNT_ID,
                    itemId: '',
                    discountPrc: '',
                    discountExp: ''
                });
                $scope.appData.add_discount_4item_4acc = false;
            }
        }
        $scope.set_discount_4item_4acc = function (item, index) {
            if (item && item.itemId) {
                if (!item.discountPrc) {
                    item.discountPrc = null;
                }
                serverConnection.set_discount_4item_4acc(item)
                    .then(function () {
                        serverConnection.get_discount_4item_4acc(item.billingAccountId)
                            .then(function (data) {
                                $scope.appData.user_get_billing_account[index].get_discount_4item_4acc = data;
                            }, function (error) {
                            });
                    }, function (error) {
                    });
            }
        }
        $scope.delete_discount_4item_4acc = function (parentIndex, index) {
            $scope.appData.user_get_billing_account[parentIndex].get_discount_4item_4acc.splice(index, 1);
        }

        $scope.cancel_discount_4item_4acc = function (a, index) {
            $scope.appData.add_discount_4item_4acc = false;
            if (a !== undefined) {
                $scope.appData.cancel_discount_4item_4acc = {
                    a: a,
                    index: index
                }
                $scope.showPopup('views/templates/setPass.html?ver=3.74' + new Date().getTime(), 'set_sug_hiuv');
            } else {
                $scope.hidePopup();
                serverConnection.cancel_discount_4item_4acc({
                    billingAccountId: $scope.appData.cancel_discount_4item_4acc.a.BILLING_ACCOUNT_ID,
                    itemId: $scope.appData.cancel_discount_4item_4acc.a.ITEM_ID
                })
                    .then(function () {
                        serverConnection.get_discount_4item_4acc($scope.appData.cancel_discount_4item_4acc.a.BILLING_ACCOUNT_ID)
                            .then(function (data) {
                                $scope.appData.user_get_billing_account[$scope.appData.cancel_discount_4item_4acc.index].get_discount_4item_4acc = data;
                                $scope.appData.cancel_discount_4item_4acc = false;
                            }, function (error) {
                            });
                    }, function (error) {
                    });
            }
        }
        $scope.initPaymentScreen = function (){
            if($scope.appData.savePositionScroll_paymentState){
                $('.bg-dark.scrollDesign').animate({scrollTop: $scope.appData.savePositionScroll_paymentState + "px"}, 10);
                $scope.appData.savePositionScroll_paymentState = 0;
            }
        }
        $scope.loadPayments = function () {
            serverConnection.get_item().then(function (data) {
                $scope.appData.get_itemDropDown = data.filter(function (it) {
                    return it.ITEM_ID === 40 || it.ITEM_ID === 41 || it.ITEM_ID === 42
                });
            }, function (error) {
            });
            serverConnection.user_get_billing_account()
                .then(function (data) {
                    $scope.appData.user_get_billing_account = data;
                    var existErr = true;
                    $scope.appData.groupOfCards = [
                        {
                            name: "הכל",
                            billing_account_id: "00000000000000000000000000000000"
                        },
                        {
                            name: "ללא כרטיס",
                            billing_account_id: "null"
                        }
                    ];
                    $scope.appData.groupOfCardsPop = [
                        {
                            name: "ללא כרטיס",
                            billing_account_id: "null"
                        }
                    ];
                    $scope.appData.user_get_billing_account.forEach(function (a, i) {
                        if (a.IND_DISCOUNT === 1) {
                            serverConnection.get_discount_4item_4acc(a.BILLING_ACCOUNT_ID)
                                .then(function (data) {
                                    $scope.appData.user_get_billing_account[i].get_discount_4item_4acc = data;
                                }, function (error) {
                                });
                        }
                        if (a.EXTSP_CARDNUMBER5 && a.EXTSP_CARDNUMBER5.toString().length < 4) {
                            var sumZero = 4 - a.EXTSP_CARDNUMBER5.toString().length;
                            var zeroAdd = "";
                            if (sumZero == 1) {
                                zeroAdd = "0";
                            } else if (sumZero == 2) {
                                zeroAdd = "00";
                            } else if (sumZero == 3) {
                                zeroAdd = "000";
                            }
                            $scope.appData.user_get_billing_account[i].EXTSP_CARDNUMBER5 = zeroAdd + a.EXTSP_CARDNUMBER5;
                        }
                        if (i > 0) {
                            if (!$scope.appData.adminSoft && a.OPERATIONRESPONSE !== 0) {
                                existErr = false;
                            }
                            serverConnection.billing_account_getpayhistory(a.BILLING_ACCOUNT_ID)
                                .then(function (data) {
                                    a.billing_account_getpayhistory = data;
                                }, function (error) {
                                });
                        }
                        if (a.BILLING_ACCOUNT_ID !== null) {
                            var text = "אחר";
                            if (a.EXTSP_MUTAG24 == 2) {
                                text = "ויזה";
                            }
                            if (a.EXTSP_MUTAG24 == 1) {
                                text = "מאסטרקארד";
                            }
                            if (a.EXTSP_MUTAG24 == 3) {
                                text = "מאסטרו";
                            }
                            if (a.EXTSP_MUTAG24 == 4) {
                                text = "אמקס";
                            }
                            if (a.EXTSP_MUTAG24 == 5) {
                                text = "ישראכרט";
                            }
                            if (a.EXTSP_MUTAG24 == 6) {
                                text = "JCB";
                            }
                            if (a.EXTSP_MUTAG24 == 7) {
                                text = "discover";
                            }
                            if (a.EXTSP_MUTAG24 == 8) {
                                text = "דיינרס";
                            }

                            if (a.PAYMENT_TYPE_ID == 3) {
                                $scope.appData.groupOfCards.push({
                                    name: text + " " + a.EXTSP_CARDNUMBER5 + "-" + a.BILLING_ACCOUNT_COMPANY_NAME,
                                    billing_account_id: a.BILLING_ACCOUNT_ID
                                })
                                $scope.appData.groupOfCardsPop.push({
                                    name: text + " " + a.EXTSP_CARDNUMBER5 + "-" + a.BILLING_ACCOUNT_COMPANY_NAME,
                                    billing_account_id: a.BILLING_ACCOUNT_ID
                                })
                            } else {
                                $scope.appData.groupOfCards.push({
                                    name: $scope.PAYMENT_TYPE_ID(a.PAYMENT_TYPE_ID) + "-" + a.BILLING_ACCOUNT_COMPANY_NAME,
                                    billing_account_id: a.BILLING_ACCOUNT_ID
                                })
                                $scope.appData.groupOfCardsPop.push({
                                    name: $scope.PAYMENT_TYPE_ID(a.PAYMENT_TYPE_ID) + "-" + a.BILLING_ACCOUNT_COMPANY_NAME,
                                    billing_account_id: a.BILLING_ACCOUNT_ID
                                })
                            }

                        }
                    });
                    $scope.appData.existErrOpenBillingPop = existErr;
                }, function (error) {
                });
        }
        $scope.msgTypeCategoriesGet = function () {
            if ($scope.appData.selectedCompany) {
                serverConnection.msgTypeCategoriesGet($scope.appData.selectedCompany.companyId).then(function (res) {
                    $scope.appData.settingsMessages = res;
                    $scope.appData.settingsMessages.forEach(function (v) {
                        if (v.enabled == 0) {
                            v.enabled = false;
                        } else {
                            v.enabled = true;
                        }
                    })
                }, function (error) {
                });
            }
        }
        $scope.loadSettCards = function () {
            $scope.loaderCardsSett = false;
            $scope.hideColmnCrads = false;
            if ($scope.appData.selectedCompany) {
                var data = {
                    companyId: $scope.appData.selectedCompany.companyId
                }
                serverConnection.accountGetcartisim(data).then(function (res) {
                    $scope.appData.settingsCards = res;
                    $scope.loaderCardsSett = true;
                }, function (error) {
                });
            }
        }
        $scope.allowHideColmnCrads = function () {
            if ($scope.hideColmnCrads)
                $scope.hideColmnCrads = false;
            else
                $scope.hideColmnCrads = true;
        }
        $scope.openBankCard = function (b) {
            $scope.appData.cardSett = b;
            if (b.company_account_id == null) {
                if (b.recommend_company_account_id == null) {
                    $scope.appData.cardSettAcc = 'null';
                } else {
                    $scope.appData.cardSettAcc = b.recommend_company_account_id;
                }
            } else {
                $scope.appData.cardSettAcc = b.company_account_id;
            }
            $scope.showPopup('views/templates/cardSett.html?ver=3.74' + new Date().getTime(), 'cardSettPop');
        }


        $scope.editDISCOUNT = function (a) {
            if (a) {
                $scope.appData.editDISCOUNT = false;
                $scope.showPopup('views/templates/setPass.html?ver=3.74' + new Date().getTime(), 'set_sug_hiuv');
            } else {
                $scope.hidePopup();
                $scope.appData.editDISCOUNT = true
            }
        }

        $scope.setAccCard = function (formPopAcc) {
            if (formPopAcc.$valid) {
                $scope.hidePopup();
                $scope.appData.settingsCards.forEach(function (v) {
                    if (v.company_customer_id == $scope.appData.cardSett.company_customer_id) {
                        if ($scope.appData.cardSettAcc !== 'null') {
                            v.company_account_id = $scope.appData.cardSettAcc
                        } else {
                            v.company_account_id = null
                        }
                    }
                })
                serverConnection.accountSetcartisim($scope.appData.settingsCards).then(function (res) {
                    $scope.loadSettCards()
                }, function (error) {
                });
            }
        }
        $scope.changeSet = false;
        $scope.changeSett = function () {
            $scope.changeSet = true;
        }
        $scope.checksMessType = function (id) {
            if ($scope.appData.settingsMessages) {
                var check = false;
                $scope.appData.settingsMessages.forEach(function (v) {
                    if (v.data_category_id == id) {
                        check = true;
                    }
                })
                return check;
            }
        }
        $scope.userSetmsgtypeCat = function () {
            var data = angular.copy($scope.appData.settingsMessages);
            data.forEach(function (v) {
                if (v.enabled == false) {
                    v.enabled = 0;
                } else {
                    v.enabled = 1;
                }
            })
            serverConnection.userSetmsgtypeCat(data).then(function (res) {
                $scope.showPopup('views/templates/apprSettingAlert.html?ver=3.74' + new Date().getTime(), 'popAlert', true);
                setTimeout(function () {
                    $scope.hidePopup();
                }, 1000)
                $scope.changeSet = false;
            }, function (error) {
            });
        }
        $scope.getNickname = function (companyId) {
            var response = '';
            if ($scope.appData.selectedCompany.accounts.bank_account_list !== null) {
                $scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (account) {
                    if (account.company_account_id == companyId)
                        response = account.company_account_nickname;
                });
            }
            return response;
        };
        $scope.getCurrencyIdILS = function (companyId) {
            var response = false;
            if ($scope.appData.selectedCompany.accounts.bank_account_list !== null) {
                $scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (account) {
                    if (account.company_account_id == companyId)
                        response = account.currency_id === 1;
                });
            }
            return response;
        };
        $scope.getAccountNum = function (companyId) {
            var response = '';
            $scope.appData.selectedCompany.tokens.accounts_and_cc.forEach(function (account) {
                account.accounts.forEach(function (acc) {
                    if (acc.company_account_id == companyId)
                        response = acc.bank_account_id;
                });
            })
            return response;
        };
        $scope.refresh = function () {
            //$scope.appData.selectedCompany.tokens = null;
            $scope.loadAllData();
        };
        $scope.billing_account_set_gen_data = function (data, forms, cardPop) {
            var nameWs = 'billing_account_set_gen_data';
            if (cardPop === false) {
                nameWs = 'billing_account_edit_data';
            }
            if (forms.$valid) {
                if ($scope.appData.adminSoft) {
                    cardPop = false;
                    if ($scope.appData.typeChangeCard) {
                        if (data.checkTransfer) {
                            if ((data.nextBillingDate === undefined || data.nextBillingDate === "")) {
                                cardPop = "admin";
                            } else {
                                cardPop = false;
                            }
                        } else {
                            if ((data.nextBillingDate === undefined || data.nextBillingDate === "")) {
                                cardPop = true;
                            } else {
                                cardPop = false;
                            }
                        }
                    }
                }
                if ((cardPop === true || cardPop === "admin")) {
                    var dataJson = {
                        "company_id": null,
                        "biling_account_id": data.BILLING_ACCOUNT_ID
                    };
                    serverConnection.cardcom_client(dataJson)
                        .then(function (res) {
                            $scope.appData.urlCardCome = res;

                            if (!$scope.appData.openBillingPop) {
                                data.BILLING_ACCOUNT_ID = res.billingAccountId;
                            }
                            $scope.appData.openBillingPop = false;
                            billing_account_set_gen_data(cardPop);
                        }, function (error) {
                        });
                } else {
                    billing_account_set_gen_data(cardPop);
                }

                function billing_account_set_gen_data(cardPop) {
                    if (!data.BILLING_ACCOUNT_ADDRESS) {
                        data.BILLING_ACCOUNT_ADDRESS = null;
                    }
                    var dataUpdate = {
                        billingAccountId: data.BILLING_ACCOUNT_ID,
                        billingAccountName: data.BILLING_ACCOUNT_NAME,
                        billingAccountEmail: data.BILLING_ACCOUNT_EMAIL,
                        billingAccountHp: data.BILLING_ACCOUNT_HP,
                        billingAccountPhone: data.BILLING_ACCOUNT_PHONE,
                        billingAccountAddress: data.BILLING_ACCOUNT_ADDRESS,
                        billingAccountCity: data.BILLING_ACCOUNT_CITY,
                        billingAccountCompanyName: data.BILLING_ACCOUNT_COMPANY_NAME,
                        indPrimary: data.IND_PRIMARY,
                        indLeloMaam: data.IND_LELO_MAAM
                    }

                    if ($scope.appData.adminSoft) {
                        if (!data.bankId) {
                            data.bankId = null;
                        }
                        if (!data.bankSnifId) {
                            data.bankSnifId = null;
                        }
                        if (!data.bankAccountId) {
                            data.bankAccountId = null;
                        }
                        dataUpdate.bankId = data.BANK_ID;
                        dataUpdate.bankSnifId = data.BANK_SNIF_ID;
                        dataUpdate.bankAccountId = data.BANK_ACCOUNT_ID;

                        dataUpdate.limitTotal = data.LIMIT_TOTAL;
                        dataUpdate.limitDate = data.LIMIT_DATE;

                        dataUpdate.ind_sicum_cheshbonit = data.IND_SICUM_CHESHBONIT;
                        dataUpdate.cardholderidentitynumber = null;
                        if (data.cardholderidentitynumber) {
                            dataUpdate.cardholderidentitynumber = data.cardholderidentitynumber;
                        }
                        if (dataUpdate.billingAccountId === undefined || dataUpdate.billingAccountId === null) {
                            dataUpdate.billingAccountId = "00000000-0000-0000-0000-000000000000";
                        }
                        if (data.numberOfCustomer !== undefined) {
                            dataUpdate.numberOfCustomer = data.numberOfCustomer;
                        }
                        dataUpdate.extsp_cardnumber5 = null;
                        if (data.cardCom_cardNumber !== undefined) {
                            dataUpdate.extsp_cardnumber5 = data.cardCom_cardNumber.slice(-4);
                        }
                        if (data.cardType) {
                            dataUpdate.extsp_mutag24 = $scope.getTypeCard(data.cardType);
                        } else {
                            dataUpdate.extsp_mutag24 = 0;
                        }

                        dataUpdate.cardvaliditymonth = null;
                        dataUpdate.cardvalidityyear = null;
                        var dateEx = data.cardCom_tokenExpireDate;
                        if (dateEx !== undefined) {
                            dataUpdate.cardvaliditymonth = dateEx.substring(0, 2);
                            if (dateEx.toLocaleString().length === 6) {
                                dataUpdate.cardvalidityyear = dateEx.substring(2, 6);
                            } else {
                                dataUpdate.cardvalidityyear = "20" + dateEx.substring(2, 4);
                            }
                        }

                        if ($scope.appData.typeChangeCard && data.checkTransfer) {
                            if (data.nextBillingDate === undefined || data.nextBillingDate === "") {
                                dataUpdate.nextBillingDate = null;
                                data.lowProfileCode = null;
                                dataUpdate.lowProfileCode = data.lowProfileCode;
                            } else {
                                dataUpdate.nextBillingDate = data.nextBillingDate;
                                data.lowProfileCode = $scope.accoConversions.generateUUID();
                                dataUpdate.lowProfileCode = data.lowProfileCode;
                            }
                        } else {
                            if (data.lowProfileCode == undefined) {
                                dataUpdate.lowProfileCode = null;
                            } else {
                                dataUpdate.lowProfileCode = data.lowProfileCode;
                            }
                            if (data.nextBillingDate === undefined || data.nextBillingDate === "") {
                                dataUpdate.nextBillingDate = null;
                            } else {
                                dataUpdate.nextBillingDate = data.nextBillingDate;
                            }
                        }

                        if ((!data.checkTransfer) && dateEx !== undefined && data.cardCom_cardNumber !== undefined) {
                            $.get("https://secure.cardcom.co.il/Tokens.aspx?TerminalNumber=26591&CardNumber=" + data.cardCom_cardNumber + "&TokenExpireDate=" + data.cardCom_tokenExpireDate + "&UserName=rExHL9wRfa6PKfPml9uC").done(function (response) {
                                //$scope.appData.openEditlowProfileCode = false;
                                var dataRes = response;
                                if (dataRes.indexOf("OK;") !== -1) {
                                    dataRes = dataRes.split("OK;")[1];
                                }
                                console.log(dataRes);
                                data.lowProfileCode = dataRes;
                                $scope.appData.billingAccountNow.lowProfileCode = dataRes;
                                dataUpdate.lowProfileCode = data.lowProfileCode;
                                sender(dataUpdate, cardPop);
                            });
                        } else {
                            sender(dataUpdate, cardPop);
                        }

                    } else {
                        sender(dataUpdate, cardPop);
                    }

                    function sender(dataUpdate, cardPop) {
                        serverConnection[nameWs](dataUpdate)
                            .then(function () {
                                $scope.detailsPaymentSett = false;
                                $scope.loadPayments();
                                if (cardPop == true) {
                                    window.location.assign($scope.appData.urlCardCome.url);
                                } else {
                                    $scope.hidePopup();
                                }
                            }, function (error) {
                            });
                    }
                }
            }
        }
        $scope.$on('refresh', function () {
            $scope.refresh();
        });
        $scope.help = function () {
            window.open('http://bizibox.biz/help/settingsmng', '_blank');
        };
        $scope.updateAccount = function (account) {
            $scope.appData.popupType = 0;
            $scope.appData.popupData = account;
            $scope.showPopup('views/templates/accountUpdatePopup.html?ver=3.74' + new Date().getTime(), 'accountUpdatePopup');
        };
        $scope.updateCard = function (account) {
            $scope.appData.popupType = 1;
            $scope.appData.popupData = account;
            $scope.showPopup('views/templates/accountUpdatePopup.html?ver=3.74', 'accountUpdatePopup');
        };
        $scope.updateSlika = function (account) {
            $scope.appData.popupType = 2;
            $scope.appData.popupData = account;
            $scope.showPopup('views/templates/accountUpdatePopup.html?ver=3.74', 'accountUpdatePopup');
        };
        $scope.updateAccountPassword = function (account) {
            $scope.appData.popupType = 0;
            $scope.appData.popupData = account;
            $scope.appData.popupTypeLink = false;
            $scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.74' + new Date().getTime(), 'accountUpdatePasswordPopup');
        };
        $scope.updateCardPassword = function (account) {
            $scope.appData.popupType = 1;
            $scope.appData.popupData = account;
            $scope.appData.popupTypeLink = false;
            $scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.74' + new Date().getTime(), 'accountUpdatePasswordPopup');
        };
        $scope.updateSlikaPassword = function (account) {
            $scope.appData.popupType = 2;
            $scope.appData.popupData = account;
            $scope.appData.popupTypeLink = false;
            $scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.74' + new Date().getTime(), 'accountUpdatePasswordPopup');
        };
        $scope.openBankAccountsPopup = function () {
            $scope.appData.popupType = 0;
            $scope.showPopup('views/templates/regularOperationsPopup.html?ver=3.74' + new Date().getTime(), 'regularOperationsPopup');
        };
        $scope.openCardsPopup = function () {
            $scope.appData.popupType = 1;
            $scope.showPopup('views/templates/regularOperationsPopup.html?ver=3.74' + new Date().getTime(), 'regularOperationsPopup');
        };
        $scope.openSlikaPopup = function () {
            $scope.appData.popupType = 2;
            $scope.showPopup('views/templates/regularOperationsPopup.html?ver=3.74' + new Date().getTime(), 'regularOperationsPopup');
        };
        $scope.deleteNext = function () {
            $scope.hidePopup();

            switch ($scope.appData.data) {
                case 1:
                    $scope.deleteToken();
                    break;
                case 2:
                    $scope.deleteBankAccount();
                    break;
                case 3:
                    $scope.deleteCreditCard();
                    break;
                case 4:
                    $scope.deleteSlika();
                    break;
                case 5:
                    $scope.deleteCreditCardInside();
                    break;
            }
        };
        $scope.deleteToken = function (token, index) {
            if ($scope.appData.data == 1) {
                serverConnection.deleteToken($scope.appData.deleteTokenToken).then(function (result) {
                    //$scope.appData.selectedCompany.tokens.accounts_and_cc.splice($scope.appData.deleteTokenIndex, 1);
                    $scope.refresh();

                }, function (error) {
                });
                $scope.appData.data = 0;
            } else {
                if (token.token_data) {
                    var tokens = token.token_data;
                }
                if (token.token) {
                    var tokens = token.token;
                }
                $scope.appData.deleteTokenToken = tokens.token;
                $scope.appData.deleteTokenIndex = index;
                $scope.appData.data = 1;
                $scope.showPopup('views/templates/alerts.html?ver=3.74' + new Date().getTime(), 'alerts', true);
            }
        };
        $scope.sethamlaza = function (dataType) {
            var chequeValidnumofdays = $scope.appData.selectedCompany.cheque_validnumofdays,
                wireValidnumofdays = $scope.appData.selectedCompany.wire_validnumofdays,
                otherValidnumofdays = $scope.appData.selectedCompany.other_validnumofdays;

            if (chequeValidnumofdays == null) {
                chequeValidnumofdays = 7;
            }
            if (wireValidnumofdays == null) {
                wireValidnumofdays = 3;
            }
            if (otherValidnumofdays == null) {
                otherValidnumofdays = 3;
            }
            $scope.appData.setDaysHamlazza = {
                chequeValidnumofdays: chequeValidnumofdays,
                wireValidnumofdays: wireValidnumofdays,
                otherValidnumofdays: otherValidnumofdays
            }
            if (dataType == true) {
                $scope.appData.toggleChangeSet = false;
                $scope.showPopup('views/templates/changeSettingsCheck.html?ver=3.74' + new Date().getTime(), 'changeSettingsCheck');
            } else {
                var data = {
                    'companyId': $scope.appData.selectedCompany.companyId,
                    'bankMatchType': 1
                }
                var jsonData = JSON.stringify(data);
                serverConnection.sethamlaza(jsonData).then(function (result) {
                }, function (error) {
                });
            }
        };
        $scope.sethamlazaPop = function () {
            $scope.hidePopup();
            var chequeValidnumofdays = $scope.appData.setDaysHamlazza.chequeValidnumofdays,
                wireValidnumofdays = $scope.appData.setDaysHamlazza.wireValidnumofdays,
                otherValidnumofdays = $scope.appData.setDaysHamlazza.otherValidnumofdays;

            var data = {
                'companyId': $scope.appData.selectedCompany.companyId,
                'bankMatchType': 2,
                chequeValidnumofdays: parseFloat(chequeValidnumofdays),
                wireValidnumofdays: parseFloat(wireValidnumofdays),
                otherValidnumofdays: parseFloat(otherValidnumofdays)
            }
            var jsonData = JSON.stringify(data);
            serverConnection.sethamlaza(jsonData).then(function (result) {
                $scope.appData.toggleChangeSet = true;
            }, function (error) {

            });
        };
        $scope.cancelSetHamlazza = function () {
            $scope.hidePopup();
        };
        $scope.deleteBankAccount = function (account, tokenIndex, accountIndex) {
            if ($scope.appData.data == 2) {
                serverConnection.deleteBankAccount($scope.appData.deleteBankAccountaccount.company_account_id).then(function (result) {
                    //$scope.appData.selectedCompany.tokens.accounts_and_cc[$scope.appData.deleteBankAccounttokenIndex].accounts.splice($scope.appData.deleteBankAccountaccountIndex, 1);
                    $scope.refresh();
                }, function (error) {
                    //  alert(error);
                });
                $scope.appData.data = 0;
            } else {
                $scope.appData.deleteBankAccountaccount = account;
                $scope.appData.deleteBankAccounttokenIndex = tokenIndex;
                $scope.appData.deleteBankAccountaccountIndex = accountIndex;
                $scope.appData.data = 2;
                $scope.showPopup('views/templates/alerts.html?ver=3.74' + new Date().getTime(), 'alerts', true);
            }
        };
        $scope.deleteCreditCard = function (account, tokenIndex, accountIndex) {
            if ($scope.appData.data == 3) {

                serverConnection.deleteCreditCard($scope.appData.deleteCreditCardaccount.credit_card_id).then(function (result) {
                    //$scope.appData.selectedCompany.tokens.out_of_banks_cc[$scope.appData.deleteCreditCardtokenIndex].accounts.splice($scope.appData.deleteCreditCardaccountIndex, 1);
                    $scope.refresh();
                }, function (error) {
                    //  alert(error);
                });

                $scope.appData.data = 0;
            } else {
                $scope.appData.deleteCreditCardaccount = account;
                $scope.appData.deleteCreditCardtokenIndex = tokenIndex;
                $scope.appData.deleteCreditCardaccountIndex = accountIndex;

                $scope.appData.data = 3;
                $scope.showPopup('views/templates/alerts.html?ver=3.74' + new Date().getTime(), 'alerts', true);
            }
        };
        $scope.deleteCreditCardInside = function (account, tokenIndex, accountIndex, cardIndex) {
            if ($scope.appData.data == 5) {
                serverConnection.deleteCreditCard($scope.appData.deleteCreditCardaccountInside.credit_card_id).then(function (result) {
                    //$scope.appData.selectedCompany.tokens.accounts_and_cc[$scope.appData.deleteCreditCardtokenIndexInside].accounts[$scope.appData.deleteCreditCardaccountIndexInside].credit_cards.splice($scope.appData.deleteCreditCardIndexInside, 1);
                    $scope.refresh();
                }, function (error) {
                    //  alert(error);
                });
                $scope.appData.data = 0;
            } else {
                $scope.appData.deleteCreditCardaccountInside = account;
                $scope.appData.deleteCreditCardtokenIndexInside = tokenIndex;
                $scope.appData.deleteCreditCardaccountIndexInside = accountIndex;
                $scope.appData.deleteCreditCardIndexInside = cardIndex;

                $scope.appData.data = 5;
                $scope.showPopup('views/templates/alerts.html?ver=3.74' + new Date().getTime(), 'alerts', true);
            }
        };
        $scope.deleteSlika = function (account, tokenIndex, accountIndex) {
            if ($scope.appData.data == 4) {

                serverConnection.deleteSlika($scope.appData.deleteSlikaaccount.solek_data[$scope.appData.deleteSlikaaccountIndex].solek_id).then(function (result) {
                    //	$scope.appData.selectedCompany.tokens.solkim[$scope.appData.deleteSlikatokenIndex].solek_data.splice($scope.appData.deleteSlikaaccountIndex, 1);
                    $scope.refresh();

                }, function (error) {
                    //    alert(error);
                });

                $scope.appData.data = 0;
            } else {
                $scope.appData.deleteSlikaaccount = account;
                $scope.appData.deleteSlikatokenIndex = tokenIndex;
                $scope.appData.deleteSlikaaccountIndex = accountIndex;
                $scope.appData.data = 4;
                $scope.showPopup('views/templates/alerts.html?ver=3.74' + new Date().getTime(), 'alerts', true);
            }


        };
        $scope.editNameBank = function (edit, uuid, name) {
            if (!edit) {
                var data = {
                    companyAccountId: uuid,
                    accountNickname: name
                }
                serverConnection.editNameBank(data).then(function (success) {

                }, function (error) {

                });
            }
        }
        $scope.setPrimBank = function (cuuid) {
            var data = {
                company_id: $scope.appData.selectedCompany.companyId,
                company_account_id: cuuid
            }
            serverConnection.accountSetPrimary(data).then(function (success) {
                $scope.refresh()
            }, function (error) {

            });
        }
        $scope.changePassword = function (formChangePass) {
            if (formChangePass.$valid) {
                var data = {
                    new_pass: $scope.newPassword,
                    old_pass: $scope.passwordNow
                }
                serverConnection.updatePassword(data).then(function (success) {
                    if (success == 1) {
                        $scope.resStatPass = success;
                        $scope.success = '';
                        $scope.errorChange = 'הסיסמה הנוכחית שגויה';
                    } else {
                        $scope.newPassword = "";
                        $scope.passwordNow = "";
                        $scope.newPasswordRepeat = "";
                        $scope.resStatPass = 0;
                        $scope.errorChange = '';
                        $scope.success = "הסיסמא הוחלפה";
                        //$scope.refresh();
                    }
                }, function (error) {
                    $scope.success = '';
                    $scope.errorChange = 'שגיאה בשליחת הנתונים';
                });
            }
        };
        $scope.passwordsMatch = function () {
            if (!$scope.newPassword || $scope.newPassword != $scope.newPasswordRepeat)
                return false;
            return true;
        };
        $scope.toggle = true;
        $scope.user_get_bizibox_users = function () {
            serverConnection.user_get_bizibox_users().then(function (res) {
                $scope.appData.user_get_bizibox_users = res;
                var match = 0;
                $scope.appData.user_get_bizibox_users.forEach(function (v) {
                    if (v.USER_ID == $scope.appData.dataCompanyDet.MEVAZEA_MEHIRA) {
                        match = 1;
                    }
                })
                if (match == 0) {
                    $scope.appData.user_get_bizibox_users.push({
                        "USER_ID": $scope.appData.dataCompanyDet.MEVAZEA_MEHIRA,
                        "NAME": "אחר"
                    })
                }

            }, function (error) {
            });
            serverConnection.userGetAccountants().then(function (res) {
                $scope.appData.comapniesAccUsersAll = res;
                var matchId = 0;
                $scope.appData.comapniesAccUsersAll.forEach(function (v, i) {
                    v.fullName = v.first_name + ' ' + v.last_name;
                    if ($scope.appData.dataCompanyDet.MENAHEL_TIK == v.user_id) {
                        matchId = 1;
                        $scope.appData.dataCompanyDet.valueRoh = $scope.appData.comapniesAccUsersAll[i];
                    }
                })
                if (matchId == 0) {
                    $scope.appData.comapniesAccUsersAll.push({
                        "user_id": $scope.appData.dataCompanyDet.MENAHEL_TIK,
                        "fullName": "אחר"
                    })
                    $scope.appData.dataCompanyDet.valueRoh = $scope.appData.comapniesAccUsersAll[$scope.appData.comapniesAccUsersAll.length - 1];
                }
            }, function (error) {
            });
        }
        $scope.loadCompanyDet = function () {
            $scope.loaderCompaniessSett = false;
            $scope.appData.editCompaniesTab = true;
            if ($scope.appData.selectedCompany) {
                var data = {
                    incompany_id: $scope.appData.selectedCompany.companyId
                }
                serverConnection.company_mini_det(data).then(function (res) {
                    $scope.appData.dataCompanyDet = res[0];
                    serverConnection.get_source_programs()
                        .then(function (res) {
                            $scope.appData.get_source_programs = res;
                        }, function (error) {
                        });
                    if ($scope.appData.dataCompanyDet.EXPIRATION_DATE == null) {
                        $scope.appData.dataCompanyDet.EXPIRATION_DATE_PIC = null;
                    } else {
                        $scope.appData.dataCompanyDet.EXPIRATION_DATE_PIC = $scope.appData.dataCompanyDet.EXPIRATION_DATE;
                    }
                    $scope.user_get_bizibox_users();
                    $scope.loaderCompaniessSett = true;
                }, function (error) {
                });
            }
        };
        $scope.appData.editCompaniesTab = true;
        $scope.checkpopPasswordCompaiesTab = function (showPopPasswordForm) {
            if (showPopPasswordForm.$valid) {
                $scope.hidePopup();

                if ($scope.appData.typeForPopUpCompaiesTab === 'edit') {
                    $scope.appData.editCompaniesTab = false;
                } else if ($scope.appData.typeForPopUpCompaiesTab === 'delete') {
                    $scope.showPopup('views/templates/alertsDeleteSettComAcc.html?ver=3.74' + new Date().getTime(), 'alerts', true);
                }
            }
        };

        $scope.openBillingPopPassSwitch = function (a){
            $scope.appData.typePopPasswordFormSwitchEx = a;
            if ($scope.appData.adminSoft) {
                $scope.showPopup('views/templates/showPopPasswordFormSwitchEx.html?ver=3.74' + new Date().getTime(), 'showPopPasswordForm', true);
            } else {
                $scope.openBillingPop($scope.appData.typePopPasswordFormSwitchEx);
            }
        }
        $scope.checkpopPasswordCompaiesTabSwitch = function (showPopPasswordForm) {
            if (showPopPasswordForm.$valid) {
                $scope.hidePopup();
                $scope.openBillingPop($scope.appData.typePopPasswordFormSwitchEx);
            }
        };
        $scope.openBillingPopPass = function (){
            if ($scope.appData.adminSoft) {
                $scope.showPopup('views/templates/showPopPasswordFormAddPaymentMethod.html?ver=3.74' + new Date().getTime(), 'showPopPasswordForm', true);
            } else {
                $scope.openBillingPop(null);
            }
        }
        $scope.checkpopPasswordCompaiesTabMethod = function (showPopPasswordForm) {
            if (showPopPasswordForm.$valid) {
                $scope.hidePopup();
                $scope.openBillingPop(null);
            }
        };
        $scope.editCompaniesTabClick = function () {
            $scope.appData.typeForPopUpCompaiesTab = 'edit';
            $scope.showPopup('views/templates/showPopPasswordForm.html?ver=3.74' + new Date().getTime(), 'showPopPasswordForm', true);
        };
        $scope.update_company = function (settingsCompaniesForm) {
            if ($scope.appData.dataCompanyDet.EXPIRATION_DATE_PIC == null) {
                $scope.appData.dataCompanyDet.EXPIRATION_DATE_PIC = 'null';
            }
            $timeout(function () {
                if (settingsCompaniesForm.$valid) {
                    var esder_maam = null;
                    if ($scope.appData.dataCompanyDet.ESDER_MAAM !== null) {
                        esder_maam = parseFloat($scope.appData.dataCompanyDet.ESDER_MAAM)
                    }
                    var source_program_id = null;
                    if ($scope.appData.dataCompanyDet.SOURCE_PROGRAM_ID !== null) {
                        source_program_id = parseFloat($scope.appData.dataCompanyDet.SOURCE_PROGRAM_ID)
                    }
                    var ind_self_managed = null;
                    if ($scope.appData.dataCompanyDet.IND_SELF_MANAGED !== null) {
                        ind_self_managed = parseFloat($scope.appData.dataCompanyDet.IND_SELF_MANAGED)
                    }
                    var menahel_tik = null;
                    if ($scope.appData.dataCompanyDet.valueRoh !== "" && $scope.appData.dataCompanyDet.valueRoh !== undefined) {
                        menahel_tik = $scope.appData.dataCompanyDet.valueRoh.user_id;
                    }
                    var data = {
                        "incompany_id": $scope.appData.selectedCompany.companyId,
                        "company_name": $scope.appData.dataCompanyDet.COMPANY_NAME,
                        "ind_self_managed": ind_self_managed,
                        "billing_cycle": $scope.appData.dataCompanyDet.BILLING_CYCLE,
                        "mevazea_mehira": $scope.appData.dataCompanyDet.MEVAZEA_MEHIRA,
                        "next_payment_date": $scope.appData.dataCompanyDet.NEXT_PAYMENT_DATE,
                        "source_program_id": source_program_id,
                        "menahel_tik": menahel_tik,
                        "expiration_date": $scope.appData.dataCompanyDet.EXPIRATION_DATE_PIC,
                        "esder_maam": esder_maam
                    }
                    serverConnection.update_company(data).then(function (res) {
                        $scope.appData.editCompaniesTab = true;
                        $scope.loadCompanyDet();
                    }, function (error) {
                    });
                }
            }, 300);
        };
        $scope.saveEditItem = function (a) {
            var data = {
                companyId: a.COMPANY_ID,
                itemId: a.ITEM_ID,
                amount: a.AMOUNT,
                discount: a.DISCOUNT,
                bilingAccountId: a.BILLING_ACCOUNT_ID
            }
            serverConnection.company_update_item(data).then(function (res) {
                $scope.openItem()
            }, function (error) {
            });
        }
        $scope.deleteEditItem = function (a) {
            var data = {
                companyId: a.COMPANY_ID,
                itemId: a.ITEM_ID
            }
            serverConnection.company_remove_item(data).then(function (res) {
                $scope.openItem()
            }, function (error) {
            });
        }
        $scope.appData.itemCollectetionsLoader = false;
        $scope.openItem = function () {
            var data = {
                company_id: $scope.appData.selectedCompany.companyId
            }
            serverConnection.company_get_item(data).then(function (res) {
                $scope.appData.collections = res;
            }, function (error) {
            });
        };
        $scope.addItem = function (param) {
            $scope.appData.itemCollectetionsLoader = true;
            serverConnection.get_item().then(function (res) {
                $scope.appData.itemCollectetions = res;
                if (!param) {
                    $scope.showPopup('views/templates/addItemCollectionSett.html?ver=3.74' + new Date().getTime(), 'addItemCollectionSett');
                }
                $scope.appData.itemCollectetionsLoader = false;
            }, function (error) {
            });
        };
        $scope.addItemPopInside = function () {
            $scope.appData.showItemPopInside = true;
            $scope.appData.itemCollectetionsLoader = true;
            serverConnection.get_item().then(function (res) {
                //$scope.appData.itemCollectetions = res;
                var filterItems = [];
                res.forEach(function (v1) {
                    var isExist = 0;
                    $scope.appData.billing_account_getitems.forEach(function (v) {
                        if (v.ITEM_ID === v1.ITEM_ID) {
                            isExist = 1;
                        }
                    });
                    if (isExist === 0) {
                        filterItems.push(v1);
                    }
                });
                $scope.appData.itemCollectetions = filterItems;
                $scope.appData.itemCollectetionsLoader = false;
            }, function (error) {
            });
        };
        $scope.addItemColl = function (a) {
            $scope.appData.itemCollectetionsLoader = true;
            var data = {
                companyId: $scope.appData.selectedCompany.companyId,
                itemId: a.ITEM_ID,
                amount: null,
                discount: null
            }
            if ($scope.appData.BILLING_ACCOUNT_ID_SAVE !== null) {
                data.billing_account_id = $scope.appData.BILLING_ACCOUNT_ID_SAVE;
            }
            serverConnection.company_add_item(data).then(function (res) {
                $scope.hidePopup();
                $scope.addItem(true);
                $scope.openItem();
            }, function (error) {
            });
        };
        $scope.addItemCollInside = function (a) {
            $scope.appData.itemCollectetionsLoader = true;
            var data = {
                companyId: $scope.appData.BILLING_ACCOUNT_ID_SAVE_company_id,
                itemId: a.ITEM_ID,
                amount: null,
                discount: null
            }
            if ($scope.appData.BILLING_ACCOUNT_ID_SAVE !== null) {
                data.billing_account_id = $scope.appData.BILLING_ACCOUNT_ID_SAVE;
            }
            serverConnection.company_add_item(data).then(function (res) {
                $scope.appData.showItemPopInside = false;
                $scope.groupOfCardsValChange($scope.appData.groupOfCardsVal);
                $scope.billing_account_getitemsPop($scope.appData.BILLING_ACCOUNT_ID_SAVE, $scope.appData.BILLING_ACCOUNT_ID_SAVE_company_id, $scope.appData.BILLING_ACCOUNT_ID_SAVE_COMPANY_NAME);
            }, function (error) {
            });
        };
        $scope.saveEditItemInside = function (a) {
            var data = {
                companyId: a.COMPANY_ID,
                itemId: a.ITEM_ID,
                amount: a.AMOUNT,
                discount: a.DISCOUNT,
                bilingAccountId: a.BILLING_ACCOUNT_ID,
                discountPrc: a.DISCOUNT_PRC,
                discountExp: a.DISCOUNT_EXP,
                effectiveDate: a.EFFECTIVE_DATE
            }
            serverConnection.company_update_item(data).then(function (res) {
                $scope.billing_account_getitemsPop($scope.appData.BILLING_ACCOUNT_ID_SAVE, $scope.appData.BILLING_ACCOUNT_ID_SAVE_company_id, $scope.appData.BILLING_ACCOUNT_ID_SAVE_COMPANY_NAME);
            }, function (error) {
            });
        }
        $scope.deleteEditItemInside = function (a) {
            var data = {
                companyId: a.COMPANY_ID,
                itemId: a.ITEM_ID
            }
            serverConnection.company_remove_item(data).then(function (res) {
                $scope.billing_account_getitems($scope.appData.BILLING_ACCOUNT_ID_SAVE);
            }, function (error) {
            });
        }
        $scope.openEditCardPays = function () {
            $scope.appData.billingAccountsLoader = true;
            $scope.showPopup('views/templates/setCardUserCompany.html?ver=3.74' + new Date().getTime(), 'setAccUser');
            serverConnection.get_billing_accounts().then(function (res) {
                $scope.appData.listBillingAccounts = res;
                $scope.appData.billingAccountsLoader = false;
            });
        }
        $scope.company_update_billing_account = function () {
            var json = JSON.parse($scope.appData.setIdBilling);
            var data = {
                company_id: $scope.appData.selectedCompany.companyId,
                billing_account_id: json.BILLING_ACCOUNT_ID
            }
            serverConnection.company_update_billing_account(data).then(function (res) {
                $scope.hidePopup();
                $scope.loadCompanyDet()
            }, function (error) {

            });
        }
        $scope.deleteCompaniesTab = function () {
            $scope.appData.typeForPopUpCompaiesTab = 'delete';
            $scope.showPopup('views/templates/showPopPasswordForm.html?ver=3.74' + new Date().getTime(), 'showPopPasswordForm', true);
        }
        $scope.deleteCompaniesTabAppr = function () {
            $scope.hidePopup();
            serverConnection.delete_company({company_id: $scope.appData.selectedCompany.companyId}).then(function (res) {
                $scope.appData.editCompaniesTab = true;
                $scope.loadCompanyDet();
            }, function (error) {
            });
        }
        $scope.loaderCompanyGetusers = false;
        $scope.loadCompanyGetusers = function () {
            $scope.loaderCompanyGetusers = false;
            if ($scope.appData.selectedCompany) {
                var data = {
                    incompany_id: $scope.appData.selectedCompany.companyId
                }
                serverConnection.company_getusers(data).then(function (res) {
                    $scope.loaderCompanyGetusers = true;
                    $scope.appData.companyGetusersSett = res;

                    function convertDate(date) {
                        if (date) {
                            return parseFloat(date.split('/')[2] + date.split('/')[1] + date.split('/')[0])
                        }
                    }

                    $scope.appData.companyGetusersSett.forEach(function (v) {
                        v.fullname = v.FIRST_NAME + ' ' + v.LAST_NAME;
                        //v.DATE_FIRST_LOGIN_DATE = convertDate(v.FIRST_LOGIN_DATE);
                        v.DATE_LAST_LOGIN_DATE = convertDate(v.LAST_LOGIN_DATE);
                    })
                }, function (error) {
                });
            }
        }
        $scope.sort_by = function (predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
        $scope.scrollSetUsers = 260; //290
        $scope.addPersonToTeamForm = false;
        $scope.addPerson = function () {
            if (!$scope.addPersonToTeamForm) {
                $scope.scrollSetUsers = 335;
                $scope.addPersonDetails = {
                    inuser_name: '',
                    inuser_username: '',
                    inuser_cell: ''
                }
                $scope.addPersonToTeamForm = true;
            }
        }
        $scope.closeAddPerson = function (addPersonTeam) {
            if (addPersonTeam) {
                addPersonTeam.$setPristine();
                addPersonTeam.$setUntouched();
            }
            $scope.scrollSetUsers = 290;
            $scope.addPersonToTeamForm = false;
        }
        $scope.addPersonToTeam = function (addPersonTeam) {
            var tel;
            if ($scope.addPersonDetails.inuser_cell) {
                var length_str = $scope.addPersonDetails.inuser_cell.length;
                if (length_str > 0) {
                    if (length_str == 10) {
                        tel = $scope.addPersonDetails.inuser_cell.substr(0, 3) + '-' + $scope.addPersonDetails.inuser_cell.substr(3, 9);
                    } else if (length_str == 9) {
                        tel = $scope.addPersonDetails.inuser_cell.substr(0, 2) + '-' + $scope.addPersonDetails.inuser_cell.substr(2, 8);
                    }
                }
            }
            var data = {
                inuser_name: $scope.addPersonDetails.inuser_name.split(' ')[0] + ' ' + $scope.addPersonDetails.inuser_name.split(' ')[1],
                inuser_username: $scope.addPersonDetails.inuser_username,
                inuser_cell: tel,
                inuser_password: $scope.addPersonDetails.inuser_username,
                incompany_id: $scope.appData.selectedCompany.companyId
            }
            serverConnection.user_create_with_company(data).then(function (res) {
                addPersonTeam.$setPristine();
                addPersonTeam.$setUntouched();
                $scope.addPersonToTeamForm = false;
                $scope.scrollSetUsers = 235;
                $scope.loadCompanyGetusers()
            }, function (error) {

            });
        }
        $scope.changePasswordToDefault = function (id) {
            $scope.appData.resetPassIdSett = id;
            $scope.showPopup('views/templates/alertsResetPass.html?ver=3.74' + new Date().getTime(), 'alerts', true);
        }
        $scope.changePasswordToDefaultAppr = function () {
            $scope.hidePopup();
            serverConnection.change_password_to_default($scope.appData.resetPassIdSett).then(function (res) {
            }, function (error) {
            });
        }
        $scope.editRowSettUsersUpdate = function (a) {
            if (a.disabledEditRow == true) {
                a.disabledEditRow = false;
            } else {
                if (a.settUserForm.$valid) {
                    a.disabledEditRow = true;
                    var data = {
                        first_name: a.FIRST_NAME,
                        last_name: a.LAST_NAME,
                        mail: a.MAIL,
                        cell: a.CELL,
                        user_id: a.USER_ID,
                        username: a.USER_NAME,
                        job_title_id: a.JOB_TITLE_ID
                    }
                    serverConnection.update_user_det(data).then(function (res) {

                    }, function (error) {

                    });
                }
            }
        }
        $scope.showRunType = function (acc, type) {
            $scope.appData.tokenRunType = acc;
            $scope.appData.tokenTypeRunPrent = type;
            if (type == 'bank') {
                $scope.appData.checkboxRunTypeSett = [
                    {
                        val: true,
                        type: 0
                    },
                    {
                        val: false,
                        type: 8
                    },
                    {
                        val: false,
                        type: 2
                    },
                    {
                        val: false,
                        type: 32
                    }
                ]
            }
            if (type == 'solek' || type == 'ccard') {
                $scope.appData.checkboxRunTypeSett = [
                    {
                        val: true,
                        type: 100
                    },
                    {
                        val: false,
                        type: 1
                    }
                ]
            }
            $scope.showPopup('views/templates/popupRunTypeSett.html?ver=3.74' + new Date().getTime(), 'popupRunType');
        }
        $scope.playRunType = function () {
            var sum = 0;
            $scope.appData.checkboxRunTypeSett.forEach(function (v) {
                if (v.val == true) {
                    sum += v.type
                }
            })
            var data = {
                intoken: $scope.appData.tokenRunType,
                inrun_type_to_do: sum
            }
            serverConnection.token_run_manual(data).then(function (res) {
                $scope.gettokensalertsload();
                $scope.hidePopup();
            }, function (error) {

            });
        }
        $scope.playRunTypeAfter = function (token) {
            var sum = 0;
            var data = {
                intoken: token,
                inrun_type_to_do: sum
            }
            serverConnection.token_run_manual(data).then(function (res) {
                $scope.refresh()
            }, function (error) {

            });
        }
        $scope.recoverBankAccount = function (subaccount, token, account) {
            var data = {
                id: subaccount.company_account_id,
                tokenType: 'bank'
            }
            serverConnection.undeleted_account(data).then(function (res) {
                if (token !== undefined && (account.token.status !== 2 && account.token.status !== 3 && account.token.status !== 4 && account.token.ind_otp_token !== 1)) {
                    $scope.refresh()
                    $scope.playRunTypeAfter(token)
                } else {
                    $scope.refresh()
                }
            }, function (error) {

            });
        }
        $scope.recoverCreditCard = function (subaccount, token) {
            var data = {
                id: subaccount.credit_card_id,
                tokenType: 'card'
            }
            serverConnection.undeleted_account(data).then(function (res) {
                if (token !== undefined) {
                    $scope.playRunTypeAfter(token)
                }
            }, function (error) {

            });
        }
        $scope.recoverCreditCardInside = function (subaccount) {
            var data = {
                id: subaccount.credit_card_id,
                tokenType: 'card'
            }
            serverConnection.undeleted_account(data).then(function (res) {
                $scope.refresh()
            }, function (error) {

            });
        }
        $scope.recoverSlika = function (subaccount, token) {
            var data = {
                id: subaccount.solek_id,
                tokenType: 'solely'
            }
            serverConnection.undeleted_account(data).then(function (res) {
                if (token !== undefined) {
                    $scope.playRunTypeAfter(token)
                }
            }, function (error) {

            });
        }
        $scope.tokenUpdatedatesmeshicha = function (token) {
            function paresrDate(dates) {
                return ('0' + (dates.getDate())).slice(-2) + '/' + ('0' + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear()
            }

            var inaccount_days = paresrDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 3))
            $scope.appData.tokenUpdatedatesmeshicha = {
                inaccount_days: inaccount_days,
                incheckpic_days: false,
                intoken: token
            }
            $scope.showPopup('views/templates/tokenUpdatedatesmeshicha.html?ver=3.74' + new Date().getTime(), 'tokenUpdatedatesmeshicha');
        }
        $scope.token_updatedatesmeshicha = function () {
            function matchBetweenDates(firstDates) {
                var firstDates = firstDates.split('/');
                var firstDate = new Date(parseInt(firstDates[2]), parseInt(firstDates[1]) - 1, parseInt(firstDates[0]));
                var secondDate = new Date();
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                return diffDays;
            }

            var inaccount_days = matchBetweenDates($scope.appData.tokenUpdatedatesmeshicha.inaccount_days);
            var incheckpic_days = 0;
            if ($scope.appData.tokenUpdatedatesmeshicha.incheckpic_days == true) {
                incheckpic_days = 1;
            }
            var data = {
                inaccount_days: inaccount_days,
                incheckpic_days: incheckpic_days,
                intoken: $scope.appData.tokenUpdatedatesmeshicha.intoken
            }
            serverConnection.token_updatedatesmeshicha(data).then(function (res) {
                $scope.hidePopup();
                $scope.gettokensalertsload();
            }, function (error) {

            });
        }
        $scope.openBug = function (token, val, kinuy) {
            $scope.appData.usersWorkVal = {};
            $scope.appData.usersWorkVal.token = token;
            $scope.appData.usersWorkVal.companyAccountId = val;
            $q.all([serverConnection.user_get_bizibox_users(), serverConnection.get_qa_tasks_types(), serverConnection.get_qa_tasks_priorty()]).then(function (data) {
                $scope.appData.usersWork = data[0];
                $scope.appData.usersWork_tasks_type = data[1];
                $scope.appData.usersWork_priority = data[2];

                if (localStorage.getItem('usersWorkVal') !== null) {
                    $scope.appData.usersWorkVal.taskUserId = localStorage.getItem('usersWorkVal');
                } else {
                    $scope.appData.usersWorkVal.taskUserId = data[0][0].USER_ID;
                }

                $scope.appData.usersWorkVal.tasks_type = 1;
                $scope.appData.usersWorkVal.taskTitle = kinuy + ' ' + 'בעיות במשיכה של חשבון';
                $scope.appData.usersWork_priority.forEach(function (v, i) {
                    if (v.QA_TASK_PRIORTY_DESC == 'גבוה') {
                        $scope.appData.usersWorkVal.priority = v.QA_TASK_PRIORTY_ID;
                    }
                })
                $scope.showPopup('views/templates/addTask.html?ver=3.74' + new Date().getTime(), 'addTask');
            });
        }
        $scope.qa_task_add = function () {
            if (!$scope.appData.usersWorkVal.sent) {

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
                    companyId: $scope.appData.selectedCompany.companyId,
                    bankTransid: null,
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
        $scope.openConsolidation = function (id, token) {
            $scope.appData.setAccConsolidation = id;
            $scope.appData.accConsolidation = [];
            $scope.appData.selectedCompany.tokens.accounts_and_cc.forEach(function (account) {
                account.accounts.forEach(function (subaccount) {
                    if (!subaccount.deleted && subaccount.company_account_id !== id) {
                        $scope.appData.accConsolidation.push(subaccount);
                    }
                })
            });
            $scope.showPopup('views/templates/accConsolidation.html?ver=3.74' + new Date().getTime(), 'setAccUser');
        };
        $scope.openConsolidationCards = function (editable, id) {
            if (!editable.editable) {
                editable.editable = true;
                $scope.appData.accConsolidationSolek = [];
                var isILS = $scope.getCurrencyIdILS(id);
                $scope.appData.selectedCompany.tokens.accounts_and_cc.forEach(function (account) {
                    account.accounts.forEach(function (subaccount) {
                        if (!subaccount.deleted && subaccount.company_account_id !== id) {
                            if (isILS) {
                                if (subaccount.currency_id === 1) {
                                    $scope.appData.accConsolidationSolek.push(subaccount);
                                }
                            } else {
                                if (subaccount.currency_id !== 1) {
                                    $scope.appData.accConsolidationSolek.push(subaccount);
                                }
                            }
                        }
                    });
                });
                editable.editableValue = $scope.appData.accConsolidationSolek[0];
            } else {
                editable.editable = false;
                var data = {
                    companyAccountId: editable.editableValue.company_account_id,
                    creditcardId: editable.credit_card_id
                }
                serverConnection.card_account_transfer(data).then(function (res) {
                    $scope.refresh();
                }, function (error) {
                    alert("שגיאה בשליחת נתונים");
                });
            }
        };
        $scope.openConsolidationSolek = function (editable, id) {
            if (!editable.editable) {
                editable.editable = true;
                $scope.appData.accConsolidationSolek = [];
                $scope.appData.selectedCompany.tokens.accounts_and_cc.forEach(function (account) {
                    account.accounts.forEach(function (subaccount) {
                        if (!subaccount.deleted && subaccount.company_account_id !== id) {
                            $scope.appData.accConsolidationSolek.push(subaccount);
                        }
                    })
                });
                editable.editableValue = $scope.appData.accConsolidationSolek[0];
            } else {
                editable.editable = false;
                var data = {
                    companyAccountId: editable.editableValue.company_account_id,
                    solekId: editable.solek_id
                }
                serverConnection.solek_account_transfer(data).then(function (res) {
                    $scope.refresh();
                }, function (error) {
                    alert("שגיאה בשליחת נתונים");
                });
            }
        };
        $scope.setAccConsolidation = function (val) {
            if (val) {
                $scope.hidePopup();
                $scope.showPopup('views/templates/alertsConsolidation.html?ver=3.74' + new Date().getTime(), 'alerts', true);
            }
        };
        $scope.openTranfer = function (id, type) {
            $scope.appData.setAccTranfer = id;
            $scope.appData.accTranferLoader = true;
            if (type) {
                $scope.appData.accTranferList = angular.copy($scope.appData.companies);
                $scope.showPopup('views/templates/accTranferSolek.html?ver=3.74' + new Date().getTime(), 'setAccUser');
                $scope.appData.accTranferLoader = false;
            } else {
                serverConnection.get_all_company().then(function (res) {
                    $scope.appData.accTranferList = res;
                    $scope.appData.accTranferLoader = false;
                }, function (error) {
                    $scope.appData.accTranferLoader = false;
                    alert("שגיאה בקבלת הנתונים");
                });
                $scope.showPopup('views/templates/accTranfer.html?ver=3.74' + new Date().getTime(), 'setAccUser');
            }
        };
        $scope.setTransfers = function (val) {
            if (val) {
                $scope.hidePopup();
                $scope.showPopup('views/templates/alertsTransfers.html?ver=3.74' + new Date().getTime(), 'alerts', true);
            }
        }
        $scope.setTransfersSolek = function (val) {
            if (val) {
                $scope.hidePopup();
                $scope.showPopup('views/templates/alertsTransfersSolek.html?ver=3.74' + new Date().getTime(), 'alerts', true);
            }
        }
        $scope.setApprove = function (type) {
            if (type == "Consolidation") {
                $scope.appData.accConsolidationLoader = true;
                var data = {
                    accountOldToKeep: $scope.appData.setAccConsolidation,
                    accountNewToDelete: $scope.appData.setAccListConsolidation
                };
                serverConnection.union_accounts(data).then(function (res) {
                    $scope.appData.accConsolidationLoader = false;
                    $scope.hidePopup();
                    $scope.refresh();
                }, function (error) {
                    $scope.appData.accConsolidationLoader = false;
                    alert("שגיאה בשליחת נתונים");
                });
            }
            if (type == "Transfers") {
                $scope.appData.accTranferLoader = true;
                var data = {
                    company_id: $scope.appData.setUserAccListTransfer,
                    company_account_id: $scope.appData.setAccTranfer
                };
                serverConnection.transferAccount(data).then(function (res) {
                    if (res == 0) {
                        $scope.appData.accTranferLoader = false;
                        $scope.hidePopup();
                        $scope.refresh();
                    } else {
                        $scope.appData.accTranferLoader = false;
                        alert("שגיאה בשליחת נתונים");
                    }
                }, function (error) {
                    $scope.appData.accTranferLoader = false;
                    alert("שגיאה בשליחת נתונים");
                });
            }
            if (type == "TransfersCustomer") {
                $scope.appData.accTranferLoader = true;
                var data = {
                    companyId: $scope.appData.setUserAccListTransfer,
                    solekId: $scope.appData.setAccTranfer
                };
                serverConnection.solek_company_transfer(data).then(function (res) {
                    if (res == 0) {
                        $scope.appData.accTranferLoader = false;
                        $scope.hidePopup();
                        $scope.refresh();
                    } else {
                        $scope.appData.accTranferLoader = false;
                        alert("שגיאה בשליחת נתונים");
                    }
                }, function (error) {
                    $scope.appData.accTranferLoader = false;
                    alert("שגיאה בשליחת נתונים");
                });
            }
            if (type == "BILLING_ACCOUNT_ID") {
                serverConnection.billing_account_delete($scope.appData.BILLING_ACCOUNT_ID).then(function (data) {
                    $scope.loadPayments();
                    $scope.hidePopup();

                }, function (error) {
                    $scope.hidePopup();

                });
            }
            if (type == "update_billing_next_date") {
                var data = {
                    billing_account_id: $scope.appData.BILLING_update_billing_next_date.BILLING_ACCOUNT_ID,
                    billing_next_date: $scope.appData.BILLING_update_billing_next_date.COMPANY_NEXT_PAYMENT_DATE,
                    payment_type_id: $scope.appData.BILLING_update_billing_next_date.PAYMENT_TYPE_ID
                }
                serverConnection.update_billing_next_date(data).then(function () {
                    $scope.hidePopup();
                }, function (error) {
                    $scope.hidePopup();
                });
            }

        }
        $scope.checkpopPasswordBill = function () {
            $scope.appData.showItemPopInsidePass = false;
            if ($scope.appData.showItemPopInsidePassType === 'addItemPopInside') {
                $scope.addItemPopInside();
            } else if ($scope.appData.showItemPopInsidePassType === 'saveEditItemInside') {
                $scope.saveEditItemInside($scope.appData.saveAItemBill);
            } else if ($scope.appData.showItemPopInsidePassType === 'deleteEditItemInside') {
                $scope.deleteEditItemInside($scope.appData.saveAItemBill);
            }
        }
        $scope.openNameUser = function (name) {
            var text = "לא נמצא מזהה";
            if (name !== null) {
                text = name;
            }
            $scope.appData.userIndNameId = text;
            $scope.showPopup('views/templates/nameUserId.html?ver=3.74' + new Date().getTime(), 'nameUserId');
        }
        $scope.appData.loaderPopSett = true;
        $scope.openSettingsTeam = function (name, id) {
            $scope.appData.loaderPopSett = true;
            $scope.appData.showItemPopInsidePassword = false;

            $scope.appData.teamSettings = [];
            $scope.showPopup('views/templates/popupSettingsTeamsSett.html?ver=3.74' + new Date().getTime(), 'popupSettingsTeams');
            $scope.appData.childUserIdPopUpSett = {'id': id, 'name': name};
            serverConnection.get_all_company(id).then(function (res) {
                $scope.appData.teamSettings = res;
                $scope.reverse = false;
                $scope.appData.loaderPopSett = false;
            }, function (error) {

            });
        }
        $scope.setCheck = function (check, priv_type_name, a) {
            a.disabled = true;
            $scope.appData.showItemPopInsidePassword = false;
            $scope.appData.loaderPopSett = true;
            var priv_type_id = '43e97298-c80e-4b70-b198-967709716513';
            if (priv_type_name === 'anhalatheshbonot') {
                priv_type_id = '6b265854-958a-4501-8207-d9f99d8d3f2a';
            }
            if (a.IND_KSAFIM_PRIV === 1 && a.IND_ANHALATHESHBONOT_PRIV === 1) {
                a.indAccPriv = true
            }

            var check = parseInt(check);
            var data = {
                'privs': [
                    {
                        'user_id': $scope.appData.childUserIdPopUpSett.id,
                        'target_id': a.COMPANY_ID,
                        'priv_type_id': priv_type_id,
                        'priv_type_name': priv_type_name,
                        'priv_value': Boolean(check)
                    }
                ],
                'userId': $scope.appData.childUserIdPopUpSett.id
            }
            serverConnection.userSetPrivs(data).then(function (res) {
                if (res == 0) {
                    a.disabled = false;
                    $scope.appData.loaderPopSett = false;
                }
            }, function (error) {

            });
        }
        $scope.setCheckAll = function (arr) {
            arr.disabled = true;
            $scope.appData.showItemPopInsidePassword = false;

            if (arr.indAccPriv) {
                arr.IND_KSAFIM_PRIV = 1;
                arr.IND_ANHALATHESHBONOT_PRIV = 1;
            } else {
                arr.IND_KSAFIM_PRIV = 0;
                arr.IND_ANHALATHESHBONOT_PRIV = 0;
            }

            $scope.appData.loaderPopSett = true;
            var arrays = [
                {
                    'user_id': $scope.appData.childUserIdPopUpSett.id,
                    'target_id': arr.COMPANY_ID,
                    'priv_type_id': '43e97298-c80e-4b70-b198-967709716513',
                    'priv_type_name': 'ksafim',
                    'priv_value': arr.indAccPriv
                },
                {
                    'user_id': $scope.appData.childUserIdPopUpSett.id,
                    'target_id': arr.COMPANY_ID,
                    'priv_type_id': '6b265854-958a-4501-8207-d9f99d8d3f2a',
                    'priv_type_name': 'anhalatheshbonot',
                    'priv_value': arr.indAccPriv
                }
            ];
            var data = {
                'privs': arrays,
                'userId': $scope.appData.childUserIdPopUpSett.id
            }
            serverConnection.userSetPrivs(data).then(function (res) {
                if (res == 0) {
                    arr.disabled = false;
                    $scope.appData.loaderPopSett = false;
                }
            }, function (error) {

            });
        }
        $scope.closePopPass = function () {
            if ($scope.appData.showItemPopInsidePassword.small) {
                if ($scope.appData.showItemPopInsidePassword.small === 'ksafim') {
                    if ($scope.appData.showItemPopInsidePassword.IND_KSAFIM_PRIV === 0) {
                        $scope.appData.showItemPopInsidePassword.IND_KSAFIM_PRIV = 1;
                    } else {
                        $scope.appData.showItemPopInsidePassword.IND_KSAFIM_PRIV = 0;
                    }
                } else {
                    if ($scope.appData.showItemPopInsidePassword.IND_ANHALATHESHBONOT_PRIV === 0) {
                        $scope.appData.showItemPopInsidePassword.IND_ANHALATHESHBONOT_PRIV = 1;
                    } else {
                        $scope.appData.showItemPopInsidePassword.IND_ANHALATHESHBONOT_PRIV = 0;
                    }
                }
            } else {
                $scope.appData.showItemPopInsidePassword.indAccPriv = !$scope.appData.showItemPopInsidePassword.indAccPriv;
            }

            $scope.appData.showItemPopInsidePassword = false
        }
        $scope.setCheckSend = function (showPopPasswordForm) {
            if (showPopPasswordForm.$valid) {
                if ($scope.appData.showItemPopInsidePassword.small) {
                    $scope.setCheck($scope.appData.showItemPopInsidePassword.small === 'ksafim' ? $scope.appData.showItemPopInsidePassword.IND_KSAFIM_PRIV : $scope.appData.showItemPopInsidePassword.IND_ANHALATHESHBONOT_PRIV, $scope.appData.showItemPopInsidePassword.small, $scope.appData.showItemPopInsidePassword)
                } else {
                    $scope.setCheckAll($scope.appData.showItemPopInsidePassword)
                }
            }
        }
        $scope.userDelete = function (id) {
            var data = {
                userUuid: id
            }
            serverConnection.user_delete(data).then(function (res) {
                $scope.loadCompanyGetusers();
            }, function (error) {

            });
        }
        $scope.downloadURL = function (documentnumber, documenttype) {
            var hiddenIFrameID = 'hiddenDownloaderNew',
                iframe = document.getElementById(hiddenIFrameID);
            if (iframe === null) {
                iframe = document.createElement('iframe');
                iframe.id = hiddenIFrameID;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }
            iframe.src = '../ang/cardcom_pdf?documentnumber=' + documentnumber + '&documenttype=' + documenttype;
            setTimeout(function () {
                iframe.remove();
            }, 10000);
        }
        $scope.billing_account_set_primary = function (BILLING_ACCOUNT_ID) {
            serverConnection.billing_account_set_primary(BILLING_ACCOUNT_ID).then(function (data) {
                $scope.loadPayments();
            }, function (error) {
            });
        }
        $scope.openBillingPop = function (biling_account, type) {
            if (biling_account === null) {
                $scope.appData.openBillingPop = false;
                $scope.appData.typeChangeCard = true;
                $scope.appData.billingAccountNow = $scope.appData.user_get_billing_account[0];
            } else {
                $scope.appData.openBillingPop = true;
                $scope.appData.typeChangeCard = false;
                $scope.appData.billingAccountNow = biling_account;
            }
            if ($scope.appData.adminSoft) {
                $scope.showPopup('views/templates/billingPop.html?ver=3.74' + new Date().getTime(), 'billingPop isAdmin');
            } else {
                $scope.showPopup('views/templates/billingPop.html?ver=3.74' + new Date().getTime(), 'billingPop noAdmin');
            }
        }
        $scope.openBillingCheckPop = function (biling_Dea) {
            $scope.appData.billingAccountCheckNow = {
                "billingAccountName": null,
                "billingAccountEmail": null,
                "billingAccountHp": null,
                "billing_account_phone": null,
                "billing_account_address": null,
                "billing_account_city": null,
                "billing_account_company_name": null,
                "cheque_ChequeNumber": "",
                "Cheque_BankNumber": "",
                "Cheque_SnifNumber": "",
                "Cheque_AccountNumber": "",
                "Cheque_DateCheque": "",
                "Cheque_Sum": biling_Dea.COMPANY_NEXT_PAYMENT_TOTAL,
                "InvoiceNumber": null,
                "InvoiceType": null,
                "date_payed_until": "",
                "items_tab": [],
                "inv_toclose_tab": [],
                "ExtIsVatFree": null,
                "description": "",
                "billing_account_id": biling_Dea.BILLING_ACCOUNT_ID
            };
            $scope.appData.billingAccountCheckNowSum = biling_Dea.COMPANY_NEXT_PAYMENT_TOTAL;
            $scope.appData.billingAccountCheckNowDate = biling_Dea.COMPANY_NEXT_PAYMENT_DATE;
            $scope.showPopup('views/templates/billingCheckPop.html?ver=3.74' + new Date().getTime(), 'billingCheckPop');
        }
        $scope.billing_account_set_cheque = function (data, forms) {
            if (forms.$valid) {
                serverConnection.billing_account_set_cheque($scope.appData.billingAccountCheckNow).then(function (res) {
                    $scope.loadPayments();
                    $scope.hidePopup();
                }, function (error) {

                });
            }
        }

        $scope.openBillingInvoicePop = function (biling_Dea) {
            $scope.appData.billingInvoice = {
                "sumToBill": null,
                "invoiceNumber": null,
                "paymentDate": "",
                "billingAccountId": biling_Dea.BILLING_ACCOUNT_ID
            };
            $scope.showPopup('views/templates/create_billing_invoicePop.html?ver=3.74' + new Date().getTime(), 'billingCheckPop short create_billing_invoicePop');
        }

        $scope.create_billing_invoice = function (data, forms) {
            if (forms.$valid) {
                serverConnection.create_billing_invoice($scope.appData.billingInvoice).then(function (res) {
                    $scope.loadPayments();
                    $scope.hidePopup();
                }, function (error) {

                });
            }
        }
        $scope.openBillingTransferPop = function (biling_Dea) {
            $scope.appData.billingAccountTranferNow = {
                "billingAccountName": null,
                "billingAccountEmail": null,
                "billingAccountHp": null,
                "billing_account_phone": null,
                "billing_account_address": null,
                "billing_account_city": null,
                "billing_account_company_name": null,
                "customPay_Asmacta": "",
                "customPay_TranDate": "",
                "customPay_Sum": biling_Dea.COMPANY_NEXT_PAYMENT_TOTAL,
                "InvoiceNumber": null,
                "InvoiceType": null,
                "date_payed_until": "",
                "items_tab": [],
                "inv_toclose_tab": [],
                "ExtIsVatFree": null,
                "customPay_Description": "",
                "billing_account_id": biling_Dea.BILLING_ACCOUNT_ID
            };
            $scope.appData.billingAccountCheckNowSum = biling_Dea.COMPANY_NEXT_PAYMENT_TOTAL;
            $scope.appData.billingAccountCheckNowDate = biling_Dea.COMPANY_NEXT_PAYMENT_DATE;
            $scope.showPopup('views/templates/billingTransferPop.html?ver=3.74' + new Date().getTime(), 'billingCheckPop short');
        }
        $scope.openChangeuserPop = function (biling_Dea) {
            $scope.appData.listUserAccountantsLoader = true;
            $scope.showPopup('views/templates/changeuserPop.html?ver=3.74', 'setAccUser');
            $scope.appData.changeuserPop = {
                fromUserId: $scope.appData.get_accountant_det.USER_ID,
                toUserId: null,
                billingAccountId: biling_Dea.BILLING_ACCOUNT_ID
            };

            serverConnection.company_getusers({
                incompany_id: $scope.appData.selectedCompany && $scope.appData.selectedCompany.companyId ? $scope.appData.selectedCompany.companyId : null //biling_Dea.BILLING_ACCOUNT_ID
            }).then(function (res) {
                $scope.appData.companyGetusersSett = res;

                function convertDate(date) {
                    if (date) {
                        return parseFloat(date.split('/')[2] + date.split('/')[1] + date.split('/')[0])
                    }
                }

                $scope.appData.companyGetusersSett.forEach(function (v) {
                    v.fullname = v.FIRST_NAME + ' ' + v.LAST_NAME;
                    v.DATE_LAST_LOGIN_DATE = convertDate(v.LAST_LOGIN_DATE);
                })
                $scope.appData.listUserAccountantsLoader = false;
            }, function (error) {
            });
        }
        $scope.userCopypriv = function () {
            serverConnection.user_billing_privs_changeuser($scope.appData.changeuserPop).then(function (res) {
                $scope.hidePopup();
            }, function (error) {
                $scope.hidePopup();
            });
        }
        $scope.billing_account_set_directdeb = function (data, forms) {
            if (forms.$valid) {
                serverConnection.billing_account_set_directdeb($scope.appData.billingAccountTranferNow).then(function (res) {
                    $scope.loadPayments();
                    $scope.hidePopup();
                }, function (error) {

                });
            }
        }
        $scope.getToken = function () {
            $.get("https://secure.cardcom.co.il/Tokens.aspx?TerminalNumber=26591&CardNumber=" + data.cardCom_cardNumber + "&TokenExpireDate=" + data.cardCom_tokenExpireDate + "&UserName=rExHL9wRfa6PKfPml9uC").done(function (response) {
                $scope.appData.openEditlowProfileCode = false;
                var data = response;
                if (data.indexOf("OK;") !== -1) {
                    data = data.split("OK;")[1];
                }
                $scope.appData.billingAccountNow.lowProfileCode = data;
            });
            // $("#sendForm").off('click');
            // $("#sendForm").on('click', function (e) {
            // 	e.preventDefault();
            // 	$http({
            // 		method: 'GET',
            // 		url: "https://secure.cardcom.co.il/Tokens.aspx?TerminalNumber=26591&CardNumber=" + $scope.appData.cardCom_cardNumber + "&TokenExpireDate=" + $scope.appData.cardCom_tokenExpireDate + "&UserName=rExHL9wRfa6PKfPml9uC"
            // 	}).then(function successCallback(response) {
            // 		$scope.appData.openEditlowProfileCode = false;
            // 		var data = response.data;
            // 		if (data.indexOf("OK;") !== -1) {
            // 			data = data.split("OK;")[1];
            // 		}
            // 		$scope.appData.user_get_billing_account[0].lowProfileCode = data;
            // 	}, function errorCallback(response) {
            // 	});
            // });
            // $("#sendForm").trigger('click');
        }
        $scope.billing_account_delete = function (BILLING_ACCOUNT_ID) {
            $scope.appData.BILLING_TYPE_NEXT = 'BILLING_ACCOUNT_ID';
            $scope.appData.BILLING_ACCOUNT_ID = BILLING_ACCOUNT_ID;
            $scope.showPopup('views/templates/alertHiuvim.html?ver=3.74', 'alerts', true);
        }

        $scope.billing_account_getitems = function (BILLING_ACCOUNT_ID) {
            $scope.appData.BILLING_ACCOUNT_ID_SAVE = BILLING_ACCOUNT_ID;
            var data = {
                "biling_account_id": BILLING_ACCOUNT_ID
            };
            serverConnection.billing_account_getitems(data).then(function (data) {
                $scope.appData.billing_account_getitems = data;
                $scope.showPopup('views/templates/billingPopDeat.html?ver=3.74' + new Date().getTime(), 'billingPopDeat' + ($scope.appData.adminSoft ? ' pagePopDeatBillAdmin' : ''));
            }, function (error) {
            });
        }
        $scope.billing_account_getitemsPop = function (BILLING_ACCOUNT_ID, company_id, COMPANY_NAME) {
            $scope.appData.showItemPopInside = false;
            $scope.appData.BILLING_ACCOUNT_ID_SAVE = BILLING_ACCOUNT_ID;
            $scope.appData.BILLING_ACCOUNT_ID_SAVE_COMPANY_NAME = COMPANY_NAME;
            $scope.appData.BILLING_ACCOUNT_ID_SAVE_company_id = company_id;
            var data = {
                "biling_account_id": BILLING_ACCOUNT_ID,
                "company_id": company_id
            };
            serverConnection.billing_account_getitems(data).then(function (data) {
                $scope.appData.billing_account_getitems = data;
                $scope.showPopup('views/templates/billingPopDeat.html?ver=3.74' + new Date().getTime(), 'billingPopDeat' + ($scope.appData.adminSoft ? ' pagePopDeatBillAdmin' : ''));
            }, function (error) {
            });
        }
        $scope.set_default_user_id = function (id) {
            $scope.appData.set_default_user_id_def = id;
            $scope.showPopup('views/templates/set_default_user_id.html?ver=3.74' + new Date().getTime(), 'payment_cancel');
        }
        $scope.set_default_user_id_def = function (showPopPasswordFormCancel) {
            if (showPopPasswordFormCancel.$valid) {
                var data = {
                    def_user_id: $scope.appData.set_default_user_id_def,
                    company_id: $scope.appData.selectedCompany.companyId
                }
                serverConnection.set_default_user_id(data).then(function (res) {
                    $scope.hidePopup();
                    $scope.loadAllData()
                }, function (error) {
                    $scope.hidePopup();
                });
            }
        }
        $scope.showPopCancelPay = function (id) {
            $scope.appData.BILLING_PAYMENT_ID = id;
            $scope.showPopup('views/templates/payment_cancel.html?ver=3.74' + new Date().getTime(), 'payment_cancel');
        }
        $scope.payment_cancel = function (showPopPasswordFormCancel) {
            if (showPopPasswordFormCancel.$valid) {
                if ($scope.appData.BILLING_PAYMENT_ID.PAYMENT_TYPE_ID === 4 || $scope.appData.BILLING_PAYMENT_ID.PAYMENT_TYPE_ID === 5) {
                    var row = $scope.appData.BILLING_PAYMENT_ID;
                    var date_base = row.PAYMENT_DATE.split("/");
                    var fullDate = new Date(parseInt(date_base[2]), parseInt(date_base[1]), parseInt(date_base[0]));
                    var data = {
                        "billingAccountName": null,
                        "billingAccountEmail": null,
                        "billingAccountHp": null,
                        "billing_account_phone": null,
                        "billing_account_address": null,
                        "billing_account_city": null,
                        "billing_account_company_name": null,
                        "customPay_Asmacta": row.INVOICE_NUMBER,
                        "customPay_TranDate": row.PAYMENT_DATE,
                        "customPay_Sum": row.SUMTOBILL,
                        "InvoiceNumber": null,
                        "InvoiceType": 2,
                        "date_payed_until": ("0" + (fullDate.getDate())).slice(-2) + '/' + ("0" + (fullDate.getMonth() + 1)).slice(-2) + '/' + fullDate.getFullYear(),
                        "items_tab": [],
                        "inv_toclose_tab": [],
                        "ExtIsVatFree": 0,
                        "customPay_Description": 'חשבונית זיכוי ' + row.INVOICE_NUMBER,
                        "billing_account_id": row.BILLING_PAYMENT_ID
                    };
                    serverConnection.billing_account_set_directdeb(data).then(function (res) {
                        $scope.loadPayments();
                        $scope.hidePopup();
                    }, function (error) {

                    });
                } else {
                    serverConnection.payment_cancel($scope.appData.BILLING_PAYMENT_ID.BILLING_PAYMENT_ID).then(function (res) {
                        $scope.loadPayments();
                        $scope.hidePopup();
                    }, function (error) {
                    });
                }
            }
        }
        $scope.openStateDetails = function (id, ACCOUNTANT_OFFICE_ID, BILLING_ACCOUNT_EMAIL) {
            if (id == null) {
                id = null;
            }
            if (ACCOUNTANT_OFFICE_ID) {
                $scope.appData.existing_company_calc_id = ACCOUNTANT_OFFICE_ID;
            }
            if (BILLING_ACCOUNT_EMAIL) {
                $scope.appData.existing_company_calc_mail = BILLING_ACCOUNT_EMAIL;
            }
            $scope.appData.groupOfCardsVal = id;
            $scope.groupOfCardsValChange(id, true);
        }
        $scope.billing_payment_get_items_dtls = function (b, a) {
            $scope.appData.existing_company_calc_mail = a;
            $scope.appData.loaderPopSett = true;
            $scope.appData.titleDtlsPay = "פירוט חשבונית " + b.INVOICE_NUMBER + " לתאריך " + b.PAYMENT_DATE + " ע״ס  " + b.SUMTOBILL + " כולל מע״מ";
            $scope.showPopup('views/templates/paymentGetItemsDtls.html?ver=3.74', 'paymentGetItemsDtls');
            var data = {
                billing_payment_id: b.BILLING_PAYMENT_ID
            }
            serverConnection.billing_payment_get_items_dtls(data).then(function (res) {
                $scope.appData.loaderPopSett = false;
                $scope.appData.billing_payment_get_items_dtls = res;
            }, function (error) {
            });
        }
        $scope.billing_send_invoice_mail = function (b, a) {
            $scope.appData.billing_send_invoice_mail = {
                invoiceNumber: b.INVOICE_NUMBER,
                invoiceType: b.INVOICERESPONSE_INVOICETYPE
            }
            $scope.appData.mailerAddrSett = a;
            $scope.appData.errorSenderMailerExcel = "";
            $scope.appData.loaderMailerPop = false;
            $scope.showPopup('views/templates/mailerSettHiuvim.html?ver=3.74', 'mailerPopup', false);
        }
        $scope.sending_billing_send_invoice_mail = function () {
            var data = Object.assign({emailAddress: $scope.appData.mailerAddrSett}, $scope.appData.billing_send_invoice_mail);
            serverConnection.billing_send_invoice_mail(data).then(function (res) {
                $scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
                $timeout(function () {
                    $scope.hidePopup();
                }, 2000)
            }, function (error) {
                $scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
            });
        };
        $scope.scrollHeightTable = 250;
        $scope.scrollHeightTableInside = 400;
        $scope.currentPage = 1; //current page
        if (!localStorage.getItem('entryLimit')) {
            $scope.entryLimit = 50;
            localStorage.setItem('entryLimit', $scope.entryLimit)
        } else {
            $scope.entryLimit = parseFloat(localStorage.getItem('entryLimit'));
        }
        $scope.entryLimitChange = function () {
            localStorage.setItem('entryLimit', $scope.entryLimit)
        }
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.maxSize = 10;
        $scope.groupOfCardsValChange = function (id, first) {
            $scope.loaderSettPays = true;
            $scope.appData.billing_report_4company = [];
            $scope.appData.billing_report_4company_main = [];
            $scope.appData.billing_report_4company_sum = [];
            if (id == "null") {
                id = null;
            }
            var dataCom = {
                "menahel_tik": null,
                "biling_account_id": id,
                "accountant_office_id": null
            }
            $q.all([serverConnection.billing_report_4company(dataCom), serverConnection.billing_report_4company_sum(dataCom)]).then(function (data) {
                $scope.appData.billing_report_4company_main = data[0];
                $scope.appData.billing_report_4company_sum = data[1][0];
                $scope.filters_SettPays();
                // if (first) {
                // 	$state.go('settings.paymentsDetails.details');
                // }
            });
        }
        $scope.filters_SettPays = function (isCalc, isFilterSums) {
            if (isFilterSums) {
                $scope.typesFilters = {};
                $scope.typesFilters[isFilterSums] = true;
            }
            $scope.loaderSettPays = true;
            $scope.appData.savePositionScroll_paymentState = $('.bg-dark.scrollDesign').scrollTop();

            $scope.appData.billing_report_4company = [];
            $scope.appData.billing_report_4company = angular.copy($scope.appData.billing_report_4company_main);
            $scope.appData.billing_report_4company = $filter('myfilter')($scope.appData.billing_report_4company, $scope.typesFilters);
            if (isCalc) {
                $scope.appData.sums_existing_billing = $scope.appData.billing_report_4company.reduce(function (a, b) {
                    if (b.IND_BANK_ITEM === 1) {
                        a[4] = a[4] + b.TOTAL_YETZU_BANK;
                        a[5] = a[5] + 1;
                    }
                    if (b.IND_CARD_ITEM === 1) {
                        a[2] = a[2] + b.TOTAL_YETZU_CCARD;
                        a[3] = a[3] + 1;
                    }
                    if (b.IND_OTHER_ITEM === 1) {
                        a[0] = a[0] + b.ITEM_PRICE_PER_OTHER_ITEMS_DIS;
                        a[1] = a[1] + 1;
                    }
                    return [
                        a[0],
                        a[1],
                        a[2],
                        a[3],
                        a[4],
                        a[5]
                    ];
                }, [0, 0, 0, 0, 0, 0]);
            } else {
                $scope.appData.sums_existing_billing = $scope.appData.billing_report_4company.reduce(function (a, b) {
                    if (b.IND_OTHER_ITEM === 1) {
                        a[0] = a[0] + b.ITEM_PRICE_PER_OTHER_ITEMS_DIS;
                        a[1] = a[1] + 1;
                    }
                    return [
                        a[0],
                        a[1]
                    ];
                }, [0, 0]);
            }
            if ($state.current.name !== 'settings.paymentsDetails.details') {
                $state.go('settings.paymentsDetails.details');
            }
            $scope.loaderSettPays = false;
        }
        $scope.editCompanyPayment = function (a) {
            $scope.appData.BILLING_TYPE_NEXT = 'update_billing_next_date';
            $scope.appData.BILLING_update_billing_next_date = a;
            $scope.showPopup('views/templates/alertHiuvim.html?ver=3.74', 'alerts', true);
        }
        $scope.existing_company_calc = function () {
            $scope.loaderSettPays = true;
            $scope.appData.sums_existing_company = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            $scope.appData.existing_company_calc = [];
            $scope.appData.existing_company_calc_main = [];
            var data = {
                accountantOfficeId: $scope.appData.existing_company_calc_id
            };
            serverConnection.existing_company_calc(data)
                .then(function (res) {
                    $scope.appData.existing_company_calc_main = res;
                    $scope.ignore = true;
                    $scope.filters_calc();
                }, function (error) {
                });
        }
        $scope.filters_calc = function (isFilterDates, isCalc, isFilterSums) {
            if (isFilterSums) {
                $scope.typesFilters = {};
                $scope.typesFilters[isFilterSums] = true;
            }
            $scope.loaderSettPays = true;
            $scope.appData.existing_company_calc = [];
            $scope.appData.existing_company_calc = angular.copy($scope.appData.existing_company_calc_main);
            if (isFilterDates) {
                $scope.appData.existing_company_calc = $filter('myfilter')($scope.appData.existing_company_calc, {
                    'typeFilterDate': true,
                    'from': $scope.appData.datesPicker.fromDatePicker,
                    'to': $scope.appData.datesPicker.toDatePicker
                });
            }
            $scope.appData.existing_company_calc = $filter('myfilter')($scope.appData.existing_company_calc, $scope.typesFilters);
            $scope.appData.existing_company_calc = $filter('myfilter')($scope.appData.existing_company_calc, {
                'typeHiuv': $scope.appData.typeHiuv
            });
            //$scope.appData.existing_company_calc = $filter('orderBy')($scope.appData.existing_company_calc, $scope.predicate, $scope.reverse , $scope.ignore);
            if (isCalc !== false) {
                $scope.appData.sums_existing_company = $scope.appData.existing_company_calc.reduce(function (a, b) {
                    if (b.IND_BANK_ITEM === 1) {
                        a[1] = a[1] + 1;
                    }
                    if (b.IND_CARD_ITEM === 1) {
                        a[2] = a[2] + 1;
                    }

                    if (b.SUG_HIUV == 1) {
                        a[9] = a[9] + 1;
                    }
                    if (b.SUG_HIUV == 2) {
                        a[10] = a[10] + 1;
                    }
                    return [
                        a[0] + b.TASHLUM_KAVUA_TOTAL,
                        a[1],
                        a[2],
                        a[3] + b.PAAR_BANKIM,
                        a[4] + b.PAAR_ASHRAI,
                        a[5] + b.TASHLUM_PERROW_BANKIM,
                        a[6] + b.TASHLUM_PERROW_ASHRAI,
                        a[7] + b.TASHLUM_PERROW_TOTAL,
                        a[8] + b.PAAR_TOTAL,
                        a[9],
                        a[10]
                    ];
                }, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                $scope.reverse = false;
                $scope.sort_by_client('BANK_ROWS_HODESH_KODEM');
            }
            if ($state.current.name !== 'settings.paymentsDetails.clients') {
                $state.go('settings.paymentsDetails.clients');
            }
            $scope.loaderSettPays = false;
        }
        $scope.disabledDates = function () {
            function shortDates(dates) {
                return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
            }

            $scope.appData.redErrorFilterType = false;
            if (shortDates($scope.appData.datesPicker.fromDatePicker) > shortDates($scope.appData.datesPicker.toDatePicker)) {
                $scope.appData.redErrorFilterType = '1';
            } else {
                $scope.appData.redErrorFilterType = false;
            }
        }
        $scope.get_potential_companies = function () {
            $scope.loaderSettPays = true;
            $scope.appData.get_potential_companies = [];
            $scope.appData.sums_existing_company_ITEM_PRICE_BEFORE_VAT = 0;
            var data = {
                accountantOfficeId: $scope.appData.existing_company_calc_id
            };
            serverConnection.get_potential_companies(data)
                .then(function (res) {
                    $scope.appData.get_potential_companies = res;
                    //$scope.ignore = true;
                    $scope.appData.sums_existing_company_ITEM_PRICE_BEFORE_VAT = $scope.appData.get_potential_companies.reduce(function (a, b) {
                        return a + b.ITEM_PRICE_BEFORE_VAT;
                    }, 0);
                    $scope.reverse = false;
                    $scope.sort_by_client('AVG_ROWS');
                    if ($state.current.name !== 'settings.paymentsDetails.potentialCustomers') {
                        $state.go('settings.paymentsDetails.potentialCustomers');
                    }
                    $scope.loaderSettPays = false;
                }, function (error) {
                });
        }
        $scope.sending = function (dataExcel) {
            serverConnection.sendMail(dataExcel).then(function (res) {
                $scope.error = 'המייל נשלח בהצלחה';
                $timeout(function () {
                    $scope.hidePopup();
                }, 2000)
            }, function (error) {
                $scope.error = 'המייל לא נשלח בהצלחה';
            });
        };
        $scope.sendMailer = function () {
            $scope.appData.errorSenderMailerExcel = "";
            $scope.appData.loaderMailerPop = false;
            $scope.showPopup('views/templates/mailerHiuvim.html?ver=3.74', 'mailerPopup', false);
        };
        $scope.sendMailerClients = function () {
            $scope.appData.errorSenderMailerExcel = "";
            $scope.appData.loaderMailerPop = false;
            $scope.showPopup('views/templates/mailerClients.html?ver=3.74', 'mailerPopup', false);
        };
        $scope.sendMailerClientsPoten = function () {
            $scope.appData.errorSenderMailerExcel = "";
            $scope.appData.loaderMailerPop = false;
            $scope.showPopup('views/templates/mailerClientsPoten.html?ver=3.74', 'mailerPopup', false);
        };
        $scope.sendMailerPays = function () {
            $scope.appData.errorSenderMailerExcel = "";
            $scope.appData.loaderMailerPop = false;
            $scope.showPopup('views/templates/mailerClientsPays.html?ver=3.74', 'mailerPopup', false);
        };
        $scope.sort_by_client = function (predicate) {
            //$scope.ignore = false;
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
        $scope.set_sug_hiuv = function (COMPANY_ID, SUG_HIUV, COMPANY_NAME) {
            $scope.appData.set_sug_hiuv_de = {
                accountantOfficeId: null,
                COMPANY_ID: COMPANY_ID,
                SUG_HIUV: (SUG_HIUV === 1) ? 2 : 1,
                COMPANY_NAME: COMPANY_NAME
            }
            $scope.showPopup('views/templates/set_sug_hiuv.html?' + new Date().getTime(), 'set_sug_hiuv');
        };
        $scope.set_sug_hiuv_ws = function () {
            $scope.loaderSettPays = true;
            var data = {
                accountantOfficeId: $scope.appData.set_sug_hiuv_de.accountantOfficeId,
                companyId: $scope.appData.set_sug_hiuv_de.COMPANY_ID,
                sugHiuv: $scope.appData.set_sug_hiuv_de.SUG_HIUV
            };
            serverConnection.set_sug_hiuv(data)
                .then(function (res) {
                    $scope.hidePopup();
                    $scope.existing_company_calc();
                    $scope.loaderSettPays = false;
                }, function (error) {
                });
        }
        $scope.set_default_sug_hiuv_for_acc = function () {
            $scope.loaderSettPays = true;
            var data = {
                accountantOfficeId: $scope.appData.existing_company_calc_id,
                sugHiuv: ($scope.appData.existing_company_calc_main[0].V_SUG_HIUV === 1) ? 2 : 1
            };
            serverConnection.set_default_sug_hiuv_for_acc(data)
                .then(function (res) {
                    $scope.loaderSettPays = false;
                    $scope.existing_company_calc();
                }, function (error) {
                });
        }
        $scope.set_sug_hiuv_all = function () {
            $scope.appData.set_sug_hiuv_de = {
                COMPANY_ID: null,
                SUG_HIUV: null,
                accountantOfficeId: $scope.appData.existing_company_calc_id
            }
            $scope.showPopup('views/templates/set_sug_hiuv_all.html?' + new Date().getTime(), 'set_sug_hiuv');
        }
        $scope.set_sug_hiuv_all_pass = function () {
            $scope.showPopup('views/templates/set_sug_hiuv_pass.html?' + new Date().getTime(), 'set_sug_hiuv');
        }
        $scope.restore_billing_account = function (id) {
            serverConnection.restore_billing_account({
                billing_account_id: id
            })
                .then(function (res) {
                    $scope.loadPayments();
                }, function (error) {
                });
        }
        $scope.convert_billing_account = function (params) {
            if (params) {
                serverConnection.convert_billing_account({
                    accountantOfficeId: params.ACCOUNTANT_OFFICE_ID,
                    bilingAccountId: params.BILLING_ACCOUNT_ID,
                    accountType: params.IND_ACCOUNTANT
                })
                    .then(function (res) {
                        $scope.loadPayments();
                    }, function (error) {
                    });
            }
        }


        $scope.set_discount_for_acc_office = function (params) {
            if (params) {
                serverConnection.set_discount_for_acc_office({
                    accountantOfficeId: params.ACCOUNTANT_OFFICE_ID,
                    discountSum: params.DISCOUNT_SUM,
                    discountPrc: params.DISCOUNT_PRC,
                    discountExp: params.DISCOUNT_EXP
                })
                    .then(function (res) {
                        $scope.loadPayments();
                    }, function (error) {
                    });
            }
        }
    }


    angular.module('controllers')
        .controller('settingsCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$http', settingsCtrl]);
}());
