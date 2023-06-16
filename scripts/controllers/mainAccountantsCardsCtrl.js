(function () {
    function mainAccountantsCardsCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
        $scope.$location = $location;
        $scope.$state = $state;
        $scope.utils = utils;
        $scope.appData = AppData;
        $scope.accoConversions = accoConversions;
        $scope.months = utils.monthNames();
        $scope.years = utils.years(5);
        $scope.date = new Date();
        $scope.$parent.appData.loaderAccMainCards = true;
        $scope.init = function () {
            $scope.loadAccCardsPage();
        }
        $scope.scrollHeightTable = 300;
        $scope.appData.typesSoftwareMemory = [];
        $scope.maxSize = 10;
        $scope.openMoreNav = false;
        $scope.openMoreNavScroll = function () {
            $scope.openMoreNav = !$scope.openMoreNav;
            if ($scope.openMoreNav) {
                $scope.scrollHeightTable = 335;
            } else {
                $scope.scrollHeightTable = 300;
            }
        }
        $scope.$parent.selectCompany = function (company) {
            $scope.getCompaniesThisStrorage(company);
            $scope.$broadcast('widthChanged');
            if (!$scope.appData.selectedCompanyIndexLink) {
                if ($scope.appData.selectedCompany.hanhahPrivilege == true) {
                    $state.go('overviewAcc.statistics');
                } else {
                    $state.go('overviewAcc.ksafim');
                }
            }
            $scope.appData.selectedCompanyIndexLink = false;
        };
        $scope.loadAccCardsPage = function (checkStatus) {
            $scope.$parent.appData.loaderAccMainCards = false;
            serverConnection.get_source_programs()
                .then(function (res) {
                    $scope.appData.sourcePrograms = res;
                    $scope.appData.get_source_programs = res;
                    $scope.appData.get_source_programs.unshift({
                        PROGRAM_ID: null,
                        PROGRAM_NAME: "ללא סוג תוכנה"
                    });
                }, function (error) {
                });
            serverConnection.getDataMainAccCards().then(function (res) {
                $scope.appData.sourceCardsAcc = res;
                if (!$scope.appData.tabCardsAcc && $scope.appData.sourceCardsAcc.length) {
                    $scope.appData.sourceCardsAcc.forEach(function (v, i) {
                        $scope.appData.companies.forEach(function (v1, i1) {
                            if (v.company_id == v1.companyId) {
                                v.companyHp = v1.companyHp;
                            }
                        })
                    });
                    if ($scope.appData.sourceCardsAcc[0].izu_type !== undefined && $scope.appData.sourceCardsAcc[0].izu_type !== null) {
                        $scope.appData.tabCardsAcc = $scope.appData.sourceCardsAcc[0].izu_type;
                        window.izu_type = $scope.appData.sourceCardsAcc[0].izu_type;
                        $scope.appData.sourceCardsAcc.forEach(function (v, i) {
                            if (v.izu_type == $scope.appData.tabCardsAcc || v.izu_type == null) {
                                v.checked = true;
                            } else {
                                v.checked = false;
                            }
                        })
                    } else {
                        window.izu_type = 1;
                        $scope.appData.tabCardsAcc = 1;
                        $scope.appData.sourceCardsAcc.forEach(function (v, i) {
                            if (v.izu_type == 1 || v.izu_type == null) {
                                v.checked = true;
                            } else {
                                v.checked = false;
                            }
                        })
                    }
                } else {
                    $scope.appData.sourceCardsAcc.forEach(function (v, i) {
                        $scope.appData.companies.forEach(function (v1, i1) {
                            if (v.company_id == v1.companyId) {
                                v.companyHp = v1.companyHp;
                            }
                        })
                        if (v.izu_type == $scope.appData.tabCardsAcc || v.izu_type == null) {
                            v.checked = true;
                        } else {
                            v.checked = false;
                        }
                    })
                }
                $scope.appData.listCardsAcc = [];
                $scope.appData.typesStatus = [];
                $scope.indMupa_yes = true;
                $scope.indMupa_no = true;
                $scope.selectedAllTypes_indMupa = true;
                if ($scope.appData.typesSoftware !== undefined && $scope.selectedAllTypes == false) {
                    $scope.appData.typesSoftware.forEach(function (v) {
                        if (v.active) {
                            var isExist = 0;
                            $scope.appData.typesSoftwareMemory.forEach(function (val) {
                                if (val.type == v.type) {
                                    isExist = 1;
                                }
                            });
                            if (isExist == 0) {
                                $scope.appData.typesSoftwareMemory.push({
                                    type: v.type,
                                    text: v.text,
                                    active: true
                                })
                            }
                        }
                    })
                }
                $scope.appData.typesSoftware = [];

                //var arr = [], arr1 = [];
                //source.forEach(function (v, i) {
                //	if (arr.indexOf(v.company_id) == -1) {
                //		arr.push(v.company_id);
                //		arr1.push({
                //			company_id: v.company_id,
                //			company_name: v.company_name
                //		});
                //	}
                //});
                //
                //var aaaa = [];
                //arr1.forEach(function (v, i) {
                //	var obj = {
                //		company_id: v.company_id,
                //		company_name: v.company_name,
                //		data: []
                //	}
                //	source.forEach(function (v1, i1) {
                //		if (obj.company_id == v1.company_id) {
                //			obj.data.push(v1)
                //		}
                //	});
                //	aaaa.push(obj)
                //});

                $scope.filterAllCards(true, true, true, checkStatus);
            }, function (error) {

            });
        };
        $scope.filterStatusCards = function () {
            if ($scope.appData.listCardsAcc && $scope.appData.listCardsAcc.length > 0) {
                $scope.appData.typesStatus = [];
                if ($scope.appData.typesSoftwareMemory.length) {
                    $scope.appData.typesSoftware = $scope.appData.typesSoftwareMemory;
                } else {
                    $scope.appData.typesSoftware = [];
                }
                $scope.appData.listCardsAcc.forEach(function (v, i) {
                    if ($scope.appData.typesStatus.length == 0) {
                        $scope.appData.typesStatus.push({type: v.last_export_status, active: true})
                    } else {
                        var statusNum = 0;
                        $scope.appData.typesStatus.forEach(function (values) {
                            if (values.type == v.last_export_status) {
                                statusNum = 1;
                            }
                        })
                        if (statusNum == 0) {
                            $scope.appData.typesStatus.push({type: v.last_export_status, active: true})
                        }
                    }
                    if ($scope.appData.typesSoftware.length == 0) {
                        $scope.appData.typesSoftware.push({
                            type: v.izu_source_program_id,
                            text: $scope.getNameSoft(v.izu_source_program_id),
                            active: true
                        });
                    } else {
                        var typeNum = 0;
                        $scope.appData.typesSoftware.forEach(function (values) {
                            if (values.type == v.izu_source_program_id) {
                                typeNum = 1;
                            }
                        })
                        if (typeNum == 0) {
                            var active = true;
                            if ($scope.appData.typesSoftwareMemory.length) {
                                active = false;
                            }
                            $scope.appData.typesSoftware.push({
                                type: v.izu_source_program_id,
                                text: $scope.getNameSoft(v.izu_source_program_id),
                                active: active
                            })
                        }
                    }
                });
            }
        }
        $scope.getNameSoft = function (id) {
            var name = "";
            $scope.appData.sourcePrograms.forEach(function (v) {
                if (v.PROGRAM_ID == id) {
                    name = v.PROGRAM_NAME;
                }
            });
            return name;
        }
        $scope.aaa = function (abc){
            console.log('abc: ', abc)
        }
        $scope.filterCompaniesNamesAndSum = function (sums, first) {
            var arr = [], sum = 0;
            if ($scope.appData.listCardsAcc && $scope.appData.listCardsAcc.length > 0) {
                $scope.appData.listCardsAcc.forEach(function (v, i) {
                    if (i == 0) {
                        var obj = {
                            company_name: v.company_name,
                            companyHp: v.companyHp,
                            ind_folder_plus: v.ind_folder_plus,
                            company_id: v.company_id,
                            db_name: v.db_name,
                            tn_last_update_date: v.tn_last_update_date,
                            indMupa: v.indMupa,
                            title: true,
                            programId: $scope.getNameSoft(v.izu_source_program_id)
                        }
                        arr.push(obj)
                        if (sums) {
                            sum++;
                        }
                    }
                    arr.push(v);
                    if ($scope.appData.listCardsAcc.length - 1 > i) {
                        if ($scope.appData.listCardsAcc[i].company_id !== $scope.appData.listCardsAcc[i + 1].company_id) {
                            var obj = {
                                company_name: $scope.appData.listCardsAcc[i + 1].company_name,
                                companyHp: $scope.appData.listCardsAcc[i + 1].companyHp,
                                ind_folder_plus: $scope.appData.listCardsAcc[i + 1].ind_folder_plus,
                                company_id: $scope.appData.listCardsAcc[i + 1].company_id,
                                db_name: $scope.appData.listCardsAcc[i + 1].db_name,
                                indMupa: $scope.appData.listCardsAcc[i + 1].indMupa,
                                tn_last_update_date: $scope.appData.listCardsAcc[i + 1].tn_last_update_date,
                                programId: $scope.getNameSoft($scope.appData.listCardsAcc[i + 1].izu_source_program_id),
                                title: true
                            }
                            arr.push(obj)
                            if (sums) {
                                sum++;
                            }
                        }
                    }
                });
                $scope.appData.listCardsAcc = arr;
            }
            $scope.appData.filteredCardsItems = $scope.appData.listCardsAcc.length;

            if (sums) {
                $scope.listCardsTitles = {
                    sumCompanies: sum,
                    status_have: 0,
                    status_zero: 0
                }

                if ($scope.appData.listCardsAcc.length > 0) {
                    $scope.appData.listCardsAcc.forEach(function (v) {
                        if (v.peulot_num > 0) {
                            $scope.listCardsTitles.status_have++;
                        }
                        if (v.last_export_status && v.last_export_status !== null && v.last_export_status == 1) {
                            $scope.listCardsTitles.status_zero++;
                        }
                    });
                    if (first) {
                        $scope.sumAllRows = angular.copy($scope.appData.listCardsAcc.length);
                    }
                }
            }
            $scope.$parent.appData.loaderAccMainCards = true;
        };

        $scope.filterAllExSoft = function () {
            var isChecks = 0;
            $scope.appData.typesSoftware.forEach(function (v) {
                if (!v.active) {
                    isChecks = 1;
                }
            });
            if (isChecks == 0) {
                $scope.selectedAllTypes = true;
            } else {
                $scope.selectedAllTypes = false;
            }
            $scope.filterAllCards(false, true);
        }
        $scope.filterAllCards = function (status, sums, first, checkStatus) {
            $scope.$parent.appData.loaderAccMainCards = false;

            $scope.appData.listCardsAcc = angular.copy($scope.appData.sourceCardsAcc);
            $scope.appData.listCardsAcc = $filter('filterSearchCards')($scope.appData.listCardsAcc, $scope.appData.searchCards);
            $scope.appData.listCardsAcc = $filter('filterCommentsCards')($scope.appData.listCardsAcc, $scope.filterComments);
            $scope.appData.listCardsAcc = $filter('myfilter')($scope.appData.listCardsAcc, $scope.typesFilters);

            if (status) {
                $scope.filterStatusCards();
            }
            if (checkStatus) {
                var statusCh = 0;
                $scope.appData.typesStatus.forEach(function (v) {
                    if (v.type == parseFloat(checkStatus)) {
                        statusCh = 1;
                        v.active = true;
                    } else {
                        v.active = false;
                    }
                })

                if (statusCh == 1) {
                    if (checkStatus == '55') {
                        $scope.allApproved = true;
                    }
                } else {
                    $scope.appData.typesStatus.forEach(function (v) {
                        v.active = true;
                    });
                }
            }

            $scope.appData.listCardsAcc = $filter('typeStatusFilterCards')($scope.appData.listCardsAcc, $scope.appData.typesStatus);
            $scope.appData.listCardsAcc = $filter('typeStatusFilterCardsSoft')($scope.appData.listCardsAcc, $scope.appData.typesSoftware);
            if($scope.appData.adminSoft){
                $scope.appData.listCardsAcc = $filter('typeStatusFilterMupa')($scope.appData.listCardsAcc, $scope.indMupa_yes, $scope.indMupa_no);
            }
            $scope.filterCompaniesNamesAndSum(sums, first);
        }
        $scope.filterTabs = function () {
            if ($scope.appData.tabCardsAcc == 1) {
                window.izu_type = 1;
            } else {
                window.izu_type = 2;
            }
            $scope.appData.searchCards = '';
            $scope.filterComments = 'all';
            $scope.typesFilters = {
                sumCompanies: true,
                status_have: false,
                status_zero: false
            };
            $scope.currentPage = 1;
            $scope.appData.sourceCardsAcc.forEach(function (v, i) {
                if (v.izu_type == $scope.appData.tabCardsAcc || v.izu_type == null) {
                    v.checked = true;
                } else {
                    v.checked = false;
                }
                if (i + 1 == $scope.appData.sourceCardsAcc.length) {
                    $scope.filterAllCards(true, true)
                }
            })
            $scope.filterAllCards(true, true)
        }

        $scope.checkAll = function () {
            if (!$scope.selectedAll) {
                $scope.selectedAll = false;
            } else {
                $scope.selectedAll = true;
            }
            angular.forEach($scope.appData.typesStatus, function (t) {
                t.active = $scope.selectedAll;
            });
            $scope.filterAllCards(false, true);
        };
        $scope.checkAllSoftType = function () {
            if (!$scope.selectedAllTypes) {
                $scope.selectedAllTypes = false;
            } else {
                $scope.selectedAllTypes = true;
            }
            angular.forEach($scope.appData.typesSoftware, function (t) {
                t.active = $scope.selectedAllTypes;
            });
            $scope.filterAllCards(false, true);
        };
        $scope.checkAllMupaType = function () {
            if (!$scope.selectedAllTypes_indMupa) {
                $scope.selectedAllTypes_indMupa = false;
            } else {
                $scope.selectedAllTypes_indMupa = true;
            }
            $scope.indMupa_yes = $scope.selectedAllTypes_indMupa;
            $scope.indMupa_no = $scope.selectedAllTypes_indMupa;
            $scope.filterAllCards(false, true);
        };
        $scope.filterAllMupa = function () {
            var isChecks = 0;
            if(!$scope.indMupa_yes || !$scope.indMupa_no){
                isChecks = 1;
            }
            if (isChecks == 0) {
                $scope.selectedAllTypes_indMupa = true;
            } else {
                $scope.selectedAllTypes_indMupa = false;
            }
            $scope.filterAllCards(false, true);
        }
        $scope.ccardSethamlazacustId = function () {
            serverConnection.ccardSethamlazacustId().then(function (res) {
                if (res == 0) {
                    $scope.loadAccCardsPage('55');
                }
            }, function (error) {

            });
        }
        $scope.ccardPreparehamlaza = function () {
            var data = {
                "inaccount_tab": []
            }
            $scope.appData.sourceCardsAcc.forEach(function (v) {
                if (v.last_export_status == 55) {
                    data.inaccount_tab.push(v.credit_card_id)
                }
            });

            serverConnection.ccardPreparehamlaza(data).then(function (res) {
                if (res == 0) {
                    $scope.allApproved = false;
                    $scope.loadAccCardsPage('57');
                }
            }, function (error) {

            });
        }

        $scope.checkPeulot = function (id) {
            var has = true;
            $scope.appData.listCardsAcc.forEach(function (v) {
                if (!v.title && v.company_id == id && v.peulot_num > 0) {
                    has = false;
                }
            })
            return has;
        }

        $scope.typesFilters = {
            sumCompanies: true,
            status_have: false,
            status_zero: false
        };
        $scope.filterComments = 'all';
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
        $scope.filter = function () {
            $timeout(function () {
                $scope.appData.filteredCardsItems = $scope.appData.filteredCardsItemsAll.length;
            }, 10);
        };
        $scope.typesFiltersActive = function (type) {
            var y, active = 0;
            for (y in $scope.listCardsTitles) {
                if (y == type) {
                    if ($scope.listCardsTitles[y] !== 0) {
                        active = 1;
                    }
                }
            }
            if (active == 1) {
                var x;
                for (x in $scope.typesFilters) {
                    if (x !== type) {
                        $scope.typesFilters[x] = false;
                    } else {
                        $scope.typesFilters[x] = true;
                    }
                }
            }
            $scope.filterAllCards(true, false);
        };
        $scope.popUpApply = function (uuid, type) {
            $scope.appData.uuidRowApply = uuid;
            $scope.appData.uuidRowApply.programName = $scope.getNameSoft($scope.appData.uuidRowApply.izu_source_program_id);
            $scope.ccardGetmahzorihiuvList();
            if (uuid.last_export_status !== 3 && uuid.last_export_status !== 7) {
                $scope.appData.showApply3or7 = false;
                if (!type) {
                    $scope.hashCartisList(uuid.company_id);
                    $scope.showPopup('views/templates/popupApplyAccCards.html?ver=3.80', 'popupApply');
                } else {
                    if (type == 'edit') {
                        $scope.hashCartisList(uuid.company_id, 'edit');
                        $scope.showPopup('views/templates/popupApplyAccCards.html?ver=3.80', 'popupApply');
                    } else {
                        $scope.hashCartisList(uuid.company_id, 'vi');
                    }
                }
            } else {
                $scope.appData.showApply3or7 = true;
                $scope.appData.hashCartisListModel = {
                    hash_id: $scope.appData.uuidRowApply["izu_cast_id"]
                }
                $scope.appData.hashCartisListHashId = $scope.appData.uuidRowApply.izu_cast_id;
                $scope.appData.hashCartisListHashName = $scope.appData.uuidRowApply.izu_account_cust_id;
                $scope.applySend();
                $scope.showPopup('views/templates/popupApplyAccCards.html?ver=3.80', 'popupApply');
            }
        };

        $scope.run_credit_card_match1 = function (company_account_id) {
            if (!$scope.disabled_till_run_credit_card_match1) {
                $scope.disabled_till_run_credit_card_match1 = true;
                serverConnection.run_credit_card_match1({
                    'companyAccountId': company_account_id
                }).then(function () {
                    $scope.disabled_till_run_credit_card_match1 = false;
                }, function () {
                    $scope.disabled_till_run_credit_card_match1 = false;
                })
            }
        }

        $scope.checksCard = function () {
            var data = {
                company_id: $scope.appData.uuidRowApply.company_id
            }
            serverConnection.hash_get_accounts(data).then(function (res) {
                $scope.appData.hash_get_accounts = res;
                $scope.appData.changeAccPopUpInside = true;
                $timeout(function () {
                    angular.element('#filterAccTableDeat').focus();
                }, 500)
            }, function (error) {

            })
        }

        $scope.changeAccInside = function (id, custId) {
            $scope.appData.initDDCustId = custId;
            var data = {
                incompany_customer_id: id
            }
            serverConnection.set_bank_cust_hash(data).then(function (res) {
                $scope.appData.changeAccPopUpInside = false;
                $scope.hashCartisList($scope.appData.uuidRowApply.company_id);
            }, function (error) {

            })
        }

        function getIndCard(card_no) {
            var ind = 0;
            $scope.appData.hashCartisList.forEach(function (v, i) {
                if (v.hash_name.indexOf(card_no.toString()) !== -1) {
                    ind = i;
                }
            })
            return ind;
        }

        $scope.hashCartisList = function (uuid, type, takeVal) {
            $scope.appData.hashCartisListHashId = null;
            $scope.appData.hashCartisListHashName = null;

            serverConnection.hashCartisList(uuid).then(function (res) {
                $scope.appData.hashCartisList = res;
                if (!type) {
                    if (!$scope.appData.initDDCustId) {
                        if ($scope.appData.uuidRowApply.izu_cast_id !== null) {
                            $scope.appData.hashCartisListHashId = $scope.appData.uuidRowApply.izu_cast_id;
                        } else {
                            $scope.appData.hashCartisListHashId = $scope.appData.hashCartisList[getIndCard($scope.appData.uuidRowApply.card_no)].hash_id;
                        }
                        if ($scope.appData.uuidRowApply.izu_account_cust_id !== null) {
                            $scope.appData.hashCartisListHashName = $scope.appData.uuidRowApply.izu_account_cust_id;
                        } else {
                            $scope.appData.hashCartisListHashName = $scope.appData.hashCartisList[getIndCard($scope.appData.uuidRowApply.card_no)].hash_id;
                        }
                    } else {
                        $scope.appData.hashCartisListHashId = $scope.appData.initDDCustId;
                        $scope.appData.hashCartisListHashName = $scope.appData.initDDCustId;
                        $scope.appData.initDDCustId = false;
                    }
                } else {
                    if (!takeVal) {
                        $scope.appData.hashCartisListHashId = $scope.appData.uuidRowApply.izu_cast_id;
                        $scope.appData.hashCartisListHashName = $scope.appData.uuidRowApply.izu_account_cust_id;
                    } else {
                        $scope.appData.hashCartisListHashId = $scope.appData.list_ccard_izu_cust_curr_get_rowEdit.IZU_CUST_ID;
                        var inizu_account_cust_id = $scope.appData.list_ccard_izu_cust_curr_get_rowEdit.IZU_ACCOUNT_CUST_ID;
                        if ($scope.appData.tabCardsAcc === 1) {
                            inizu_account_cust_id = null;
                        }
                        $scope.appData.hashCartisListHashName = inizu_account_cust_id;
                    }
                }
                $scope.applySend(type);
            }, function (error) {

            });
        };
        $scope.hashCartisLists = function (company_id, type, t) {
            $scope.appData.list_ccard_izu_cust_curr_get_rowEdit = t;
            $scope.ccardGetmahzorihiuvList(t.CCARD_IZU_CUST_CURRENCY_ID);
            $scope.hashCartisList(company_id, type, true)
        }
        $scope.ccardGetmahzorihiuvList = function (data) {
            if (data) {
                $scope.appData.ccardGetmahzorihiuvListType = true;
                serverConnection.ccard_getmahzorihiuv_hul_list({
                    izuCustCurrId: data
                }).then(function (res) {
                    res.forEach(function (it) {
                        it.CURRENCY_ID_NAME = $scope.accoConversions.getCurrencyIdName(it.CURRENCY_ID)
                    })
                    $scope.appData.ccardGetmahzorihiuvList = res;
                    if (!res.length) {
                        $scope.appData.ccardGetmahzorihiuvList = [];
                    }
                    $scope.appData.ccardGetmahzorihiuvList.push({
                        NEXT_CYCLE_DATE: 'החל מהמחזור הבא',
                        CCARD_TRANS_ID: '00000000-0000-0000-0000-000000000000',
                        NEXT_CYCLE_TOTAL: 0,
                        STATUS: 0,
                        SUM_CYCLE_TOTAL: null
                    })
                    $scope.appData.ccardGetmahzorihiuvListVal = false;
                }, function (error) {

                })
            } else {
                $scope.appData.ccardGetmahzorihiuvListType = false;
                serverConnection.ccardGetmahzorihiuvList($scope.appData.uuidRowApply.credit_card_id).then(function (res) {
                    $scope.appData.ccardGetmahzorihiuvList = res;
                    if (!res.length) {
                        $scope.appData.ccardGetmahzorihiuvList = [];
                    }
                    $scope.appData.ccardGetmahzorihiuvList.push({
                        NEXT_CYCLE_DATE: 'החל מהמחזור הבא',
                        CCARD_TRANS_ID: '00000000-0000-0000-0000-000000000000',
                        NEXT_CYCLE_TOTAL: 0,
                        STATUS: 0,
                        SUM_CYCLE_TOTAL: null
                    })
                    $scope.appData.ccardGetmahzorihiuvListVal = false;
                }, function (error) {

                })
            }


        };
        var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;

        function dmyOrdA(a, b) {
            a = a.trans_date.replace(dateRE, "$3$2$1");
            b = b.trans_date.replace(dateRE, "$3$2$1");
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        }

        $scope.applySend = function (type) {
            $scope.appData.ccardGetmahzorihiuvListVal = false;
            $scope.appData.loaderPopApplyCard = true;
            var inizu_account_cust_id = $scope.appData.hashCartisListHashName;
            if ($scope.appData.tabCardsAcc == 1) {
                inizu_account_cust_id = null;
            }
            var data = {
                "incredit_card_id": $scope.appData.uuidRowApply.credit_card_id,
                "inizu_cust_id": $scope.appData.hashCartisListHashId,
                "inizu_source_program_id": "333",
                "inizu_account_cust_id": inizu_account_cust_id,
                "izu_type": $scope.appData.tabCardsAcc
            };
            serverConnection.cardPageFullCheck(data).then(function (res) {
                $scope.appData.loaderPopApplyCard = false;
                $scope.appData.resBankPageFullCheck = res;

                var arrCc = [];
                $scope.appData.resBankPageFullCheck.transactions.forEach(function (v, i) {
                    if (v.data_source == 'CC') {
                        arrCc.push(v)
                    }
                    if (i + 1 == $scope.appData.resBankPageFullCheck.transactions.length) {
                        var dateFirst = arrCc.sort(dmyOrdA);
                        $scope.appData.monthBiziFirst = accoConversions.getDateMonth(dateFirst[0].trans_date.split("/")[1]);
                    }
                })

                if (type && type == 'vi' && res.result_status == 0) {
                    $scope.exportApply();
                }
                if (type && type == 'vi' && res.result_status !== 0) {
                    $scope.showPopup('views/templates/popupApplyAccCards.html?ver=3.80', 'popupApply');
                }
                //$scope.loadcheckboxApprAttr($scope.appData.resBankPageFullCheck.efresh);
            }, function (error) {

            });
        }

        $scope.deleteCard = function (id) {
            if ($scope.appData.deleteCardId) {
                serverConnection.deleteCreditCard($scope.appData.deleteCardId).then(function (result) {
                    $scope.appData.deleteCardId = false;
                    $scope.hidePopup();
                    $scope.loadAccCardsPage();
                }, function (error) {
                    $scope.appData.deleteCardId = false;
                });
            } else {
                $scope.appData.deleteCardId = id;
                $scope.showPopup('views/templates/alertsCardsMain.html?ver=3.80' + new Date().getTime(), 'alerts', true);
            }
        }

        $scope.appData.checkboxAppr = false;
        $scope.loadcheckboxApprAttr = function (data) {
            if (data == 0) {
                $scope.appData.checkboxAppr = true;
            } else {
                $scope.appData.checkboxAppr = false;
            }
        }
        $scope.updateAccountPassword = function (item, data) {
            var tok = item.token;
            // if (data) {
            // 	tok = item.token_id;
            // }
            var explain_desc = Number(item.explain_desc)
            if ((!data) || ((data) && (item.token_status == 1 || item.token_status == 2 || item.token_status == 4 || item.token_status == 3 || item.token_status == 157 || item.token_status == 158))) {
                $scope.appData.popupType = (explain_desc <= 30 && explain_desc >= 21) ? 1 : 0;
                $scope.appData.popupTypeStatus = item.token_status;
                $scope.appData.popupTypeLink = true;
                $scope.appData.popupDataToken = tok;
                $scope.appData.popupDataBanks = {BankNumber: Number(item.explain_desc)};
                $scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.80' + new Date().getTime(), 'accountUpdatePasswordPopup');
            }
        };

        $scope.editAlerts = function (acc, id) {
            $scope.appData.editAlertsHash = {
                'acc': acc,
                'id': id,
                'edit': false
            }
            $scope.showPopup('views/templates/editExHashCards.html?ver=3.80', 'exHashEditPop');
        }

        $scope.asmachtaSettSbmit = function () {
            $scope.hidePopup();
            var data = {
                inexport_digit: parseInt($scope.appData.asmachtaSett)
            }
            serverConnection.set_export_digit(data).then(function (res) {
                if (res == 0) {
                    if ($scope.appData.digitFilters) {
                        $scope.appData.digitFilters = false;
                        $scope.appData.radioFilterExPop = '0';
                        $scope.showPopup('views/templates/popupExportsFiltersCards.html?ver=3.80', 'popupExportsFilters');
                    } else {
                        $scope.export();
                    }
                }
            }, function (error) {

            });
        }

        $scope.exportPop = function (admin) {
            if ($scope.appData.defMonth.ind_phone_exist === 1) {
                $scope.showPopup('views/templates/alertHashavshevet.html?ver=3.80', 'alertHashavshevet', false);
                return;
            }
            if (!$scope.appData.adminSoft || admin) {
                var types = 0;
                $scope.appData.arrExportPopEx = [];
                $scope.appData.typesStatus.forEach(function (v) {
                    if (v.active == false) {
                        types = 1;
                    }
                });
                var typesSoft = 0;
                $scope.appData.typesSoftware.forEach(function (v) {
                    if (v.active == false) {
                        typesSoft = 1;
                    }
                });
                if ($scope.filterComments == 'all' && (!$scope.appData.searchCards || $scope.appData.searchCards.length == 0) && types == 0 && typesSoft == 0) {
                    $scope.appData.radioFilterExPop = false;
                    $scope.appData.sourceCardsAcc.forEach(function (v) {
                        if (v.checked == true) {
                            $scope.appData.arrExportPopEx.push(v.credit_card_id);
                        }
                    });
                    $scope.export();
                } else {
                    $scope.appData.radioFilterExPop = '0';
                    $scope.showPopup('views/templates/popupExportsFiltersCards.html?ver=3.80', 'popupExportsFilters');
                }
            } else {
                $scope.showPopup('views/templates/alertAdminCards.html?ver=3.80', 'alerts', true);
            }
        }

        $scope.blacklist = function (acc, id) {
            $scope.appData.rowBlackList = acc;
            if (acc.checked == false) {
                $scope.appData.sourceCardsAcc.forEach(function (v) {
                    if (v.company_id == id && v.credit_card_id == acc.credit_card_id) {
                        v.checked = false;
                    }
                });
                $scope.appData.listCardsAcc.forEach(function (v) {
                    if (v.company_id == id && v.credit_card_id == acc.credit_card_id) {
                        v.checked = false;
                    }
                });
            } else {
                $scope.appData.sourceCardsAcc.forEach(function (v) {
                    if (v.company_id == id && v.credit_card_id == acc.credit_card_id) {
                        v.checked = false;
                    }
                });
                $scope.appData.listCardsAcc.forEach(function (v) {
                    if (v.company_id == id && v.credit_card_id == acc.credit_card_id) {
                        v.checked = false;
                    }
                });
                $scope.appData.blacklistCheckCards = {
                    company_id: id,
                    credit_card_id: acc.credit_card_id
                }

                if (acc.izu_type == null) {
                    $scope.blacklistCheckCards()
                } else {
                    if ($scope.appData.tabCardsAcc == 1) {
                        $scope.appData.blacklistCheckCards.text = 'שים לב, כרטיס זה יוצא בפעם האחרונה בפורמט פקודות יומן, פעולה זו תשנה את פורמט הייצוא לפורמט דפי בנק, האם ברצונך להמשיך?';
                    } else {
                        $scope.appData.blacklistCheckCards.text = 'שים לב, כרטיס זה יוצא בפעם האחרונה בפורמט דפי בנק, פעולה זו תשנה את פורמט הייצוא לפורמט פקודות יומן, האם ברצונך להמשיך?';
                    }

                    $scope.showPopup('views/templates/blacklistCheckCards.html?ver=3.80', 'blacklistCheckCards');
                }
            }
        };

        $scope.blacklistCheckCards = function () {
            var data = {
                creditCardId: $scope.appData.blacklistCheckCards.credit_card_id,
                exportType: $scope.appData.tabCardsAcc
            }
            serverConnection.set_card_export_type(data).then(function (res) {
                if (res == 0) {
                    $scope.appData.sourceCardsAcc.forEach(function (v) {
                        if (v.company_id == $scope.appData.blacklistCheckCards.company_id && v.credit_card_id == $scope.appData.blacklistCheckCards.credit_card_id) {
                            v.checked = true;
                            v.izu_type = $scope.appData.tabCardsAcc;
                        }
                    });
                    $scope.appData.listCardsAcc.forEach(function (v) {
                        if (v.company_id == $scope.appData.blacklistCheckCards.company_id && v.credit_card_id == $scope.appData.blacklistCheckCards.credit_card_id) {
                            v.checked = true;
                            v.izu_type = $scope.appData.tabCardsAcc;
                        }
                    });
                }
                $scope.hidePopup();
                $scope.popUpApply($scope.appData.rowBlackList);
            }, function (error) {

            });
        }

        $scope.export = function (id, isPop) {//not from popup
            $scope.appData.lengthExTime += 1;

            if (isPop) {
                $scope.appData.idExportsCards = id;
                $scope.appData.lengthExTime = 0;

                $scope.showPopup('views/templates/exportAlerts.html?ver=3.80', 'exportAlerts', true);
                return;
            }
            if (isPop === false) {
                $scope.appData.lengthExTime = 0;

                $scope.hidePopup();
            }

            var indexBank = 0;
            if ($scope.appData.radioFilterExPop) {
                $scope.appData.lengthExTime = 0;

                $scope.appData.arrExportPopEx = [];
                if ($scope.appData.radioFilterExPop == '0') {
                    $scope.appData.listCardsAcc.forEach(function (v) {
                        if (!v.title && v.checked == true && ((v.company_id == id && $scope.appData.tabCardsAcc == 2) || ($scope.appData.tabCardsAcc == 1))) {
                            if (v.last_export_date !== null && v.last_export_date !== "" && (v.izu_account_cust_id == "" || v.izu_account_cust_id == null)) {
                                indexBank = 1;
                            }
                            $scope.appData.arrExportPopEx.push(v.credit_card_id);
                        }
                    });
                } else {
                    $scope.appData.sourceCardsAcc.forEach(function (v) {
                        if (v.checked == true && ((v.company_id == id && $scope.appData.tabCardsAcc == 2) || ($scope.appData.tabCardsAcc == 1))) {
                            if (v.last_export_date !== null && v.last_export_date !== "" && (v.izu_account_cust_id == "" || v.izu_account_cust_id == null)) {
                                indexBank = 1;
                            }
                            $scope.appData.arrExportPopEx.push(v.credit_card_id);
                        }
                    });
                }
                $scope.hidePopup();
            } else {
                $scope.appData.arrExportPopEx = [];
                $scope.appData.listCardsAcc.forEach(function (v) {
                    if (!v.title && v.checked == true && ((v.company_id == id && $scope.appData.tabCardsAcc == 2) || ($scope.appData.tabCardsAcc == 1))) {
                        if (v.last_export_date !== null && v.last_export_date !== "" && (v.izu_account_cust_id == "" || v.izu_account_cust_id == null)) {
                            indexBank = 1;
                        }
                        $scope.appData.arrExportPopEx.push(v.credit_card_id);
                    }
                });
            }
            if ($scope.appData.tabCardsAcc == 2 && indexBank > 0) {
                $scope.appData.lengthExTime = 0;

                $scope.showPopup('views/templates/alertNotExData.html?ver=3.80', 'popAlert', true);
                setTimeout(function () {
                    $scope.hidePopup();
                }, 2000)
            } else {
                var data = {
                    "dateFrom": null,
                    "dateTill": null,
                    "INccard_tab": $scope.appData.arrExportPopEx,
                    "izu_type": $scope.appData.tabCardsAcc
                }
                var jsonData = JSON.stringify(data);
                var timeOutStr;
                if ($scope.appData.exportHashProg) {
                    $scope.appData.showSucUpdPassPop = false;
                    $scope.appData.dataOfProg = {
                        "name": "export",
                        "id": id,
                        "isPop": isPop
                    }
                    $scope.showPopup('views/templates/progressBarPop.html?ver=3.80' + new Date().getTime(), 'accountUpdatePasswordPopup');
                    timeOutStr = $timeout(function () {
                        $scope.appData.showSucUpdPassPop = "fail";
                    }, 30000)
                }
                serverConnection.getccardouthashdata(jsonData).then(function (res) {
                    $scope.appData.lengthExTime = 0;
                    if (timeOutStr !== undefined) {
                        clearTimeout(timeOutStr);
                    }
                    var times = 0;
                    if ($scope.appData.exportHashProg) {
                        $scope.appData.showSucUpdPassPop = "suc";
                        $scope.appData.exportHashProg = false;
                        times = 1500;
                    }
                    $timeout(function () {
                        if (res == '' || res == '0' || res == 0) {
                            $scope.hidePopup();
                            $scope.showPopup('views/templates/alertNoneData.html?ver=3.80', 'alertNoneData');
                            $scope.loadAccCardsPage();
                        } else {
                            if ($scope.appData.tabCardsAcc == 2) {
                                var url = res;
                                serverConnection.getccardouthashdataId(res).then(function (re) {
                                    $scope.hidePopup();
                                    $scope.downloadCardFile(window.serverName + '/getccardouthashdata/' + url)
                                    $scope.loadAccCardsPage();
                                }, function (error) {
                                    $scope.hidePopup();
                                });
                            }
                            if ($scope.appData.tabCardsAcc == 1) {
                                $scope.hidePopup();
                                $scope.downloadCardFile(window.serverName + '/get_oshtnu_card')
                                $scope.loadAccCardsPage();
                            }
                        }
                    }, times)
                }, function (error) {
                    if (timeOutStr !== undefined) {
                        clearTimeout(timeOutStr);
                    }
                    if (error.status == 406) {
                        $scope.appData.lengthExTime = 0;
                        $scope.appData.showSucUpdPassPop = '406';
                    }
                        // else if (error.status == 504) {
                        // 	if ($scope.appData.exportHashProg) {
                        // 		if ($scope.appData.lengthExTime < 4) {
                        // 			$scope.nextExPopProg();
                        // 		}
                        // 		else {
                        // 			$scope.appData.lengthExTime = 0;
                        // 			$scope.appData.showSucUpdPassPop = '406';
                        // 		}
                        // 	}
                        // 	else {
                        // 		$scope.appData.lengthExTime = 0;
                        // 		$scope.hidePopup();
                        // 	}
                    // }
                    else {
                        $scope.appData.lengthExTime = 0;
                        if ($scope.appData.exportHashProg) {
                            $scope.appData.exportHashProg = false;
                            $scope.appData.showSucUpdPassPop = false;
                        }
                        $scope.hidePopup();
                    }
                });
            }
        };
        $scope.appData.lengthExTime = 0;

        $scope.downloadCardFile = function (uri) {
            function downloadURL(url) {
                var hiddenIFrameID = 'hiddenDownloader',
                    iframe = document.getElementById(hiddenIFrameID);
                if (iframe === null) {
                    iframe = document.createElement('iframe');
                    iframe.id = hiddenIFrameID;
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                }
                iframe.src = url;
            }

            downloadURL(uri)
        }
        $scope.cancelEx = function () {
            $scope.hidePopup();
        };
        $scope.exportApply = function (type) { //from button popup
            if ($scope.appData.ccardGetmahzorihiuvListType) {
                $scope.appData.list_ccard_izu_cust_curr_get.forEach(function (it) {
                    if (it.CCARD_IZU_CUST_CURRENCY_ID === $scope.appData.list_ccard_izu_cust_curr_get_rowEdit.CCARD_IZU_CUST_CURRENCY_ID) {
                        it.IZU_CUST_ID = $scope.appData.hashCartisListHashId;
                        var inizu_account_cust_id = $scope.appData.hashCartisListHashName;
                        if ($scope.appData.tabCardsAcc === 1) {
                            inizu_account_cust_id = null;
                        }
                        it.IZU_ACCOUNT_CUST_ID = inizu_account_cust_id
                    }
                });
                $scope.showPopup('views/templates/ccard_izu_cust_curr_get.html?ver=3.80', 'company_db_year_set ccard_izu_cust_curr_get', false);
            } else {
                $scope.appData.lengthExTime += 1;

                var ccard_trans_id = $scope.appData.resBankPageFullCheck.outccard_trans_id;
                if (type) {
                    ccard_trans_id = $scope.appData.ccardGetmahzorihiuvListVal.CCARD_TRANS_ID;
                }
                var inizu_account_cust_id = $scope.appData.hashCartisListHashName;
                if ($scope.appData.tabCardsAcc == 1) {
                    inizu_account_cust_id = null;
                }
                var data = {
                    dateFrom: null,
                    dateTill: null,
                    izu_cust_id: $scope.appData.hashCartisListHashId,
                    INccard_tab: [$scope.appData.uuidRowApply.credit_card_id],
                    ccard_trans_id: ccard_trans_id,
                    inizu_account_cust_id: inizu_account_cust_id,
                    izu_type: $scope.appData.tabCardsAcc
                }
                var jsonData = JSON.stringify(data);
                var timeOutStr;
                if ($scope.appData.exportHashProg) {
                    $scope.appData.showSucUpdPassPop = false;
                    $scope.showPopup('views/templates/progressBarPop.html?ver=3.80' + new Date().getTime(), 'accountUpdatePasswordPopup');
                    $scope.appData.dataOfProg = {
                        "name": "exportApply",
                        "type": type
                    }
                    timeOutStr = $timeout(function () {
                        $scope.appData.showSucUpdPassPop = "fail";
                    }, 30000)
                }
                serverConnection.getccardouthashdata(jsonData).then(function (res) {
                    $scope.appData.lengthExTime = 0;
                    if (timeOutStr !== undefined) {
                        clearTimeout(timeOutStr);
                    }
                    var times = 0;
                    if ($scope.appData.exportHashProg) {
                        $scope.appData.showSucUpdPassPop = "suc";
                        $scope.appData.exportHashProg = false;
                        times = 1500;
                    }
                    $timeout(function () {
                        if ($scope.appData.ccardGetmahzorihiuvList) {
                            $scope.appData.ccardGetmahzorihiuvList = false;
                            $scope.appData.ccardGetmahzorihiuvListVal = false;
                        }
                        $scope.hidePopup();
                        $scope.loadAccCardsPage();
                    }, times)
                }, function (error) {
                    if (timeOutStr !== undefined) {
                        clearTimeout(timeOutStr);
                    }
                    if (error.status == 406) {
                        $scope.appData.lengthExTime = 0;
                        $scope.appData.showSucUpdPassPop = '406';
                    }
                        // else if (error.status == 504) {
                        // 	if ($scope.appData.exportHashProg) {
                        // 		if ($scope.appData.lengthExTime < 4) {
                        // 			$scope.nextExPopProg();
                        // 		}
                        // 		else {
                        // 			$scope.appData.lengthExTime = 0;
                        // 			$scope.appData.showSucUpdPassPop = '406';
                        // 		}
                        // 	}
                        // 	else {
                        // 		$scope.appData.lengthExTime = 0;
                        // 		$scope.hidePopup();
                        // 	}
                    // }
                    else {
                        $scope.appData.lengthExTime = 0;
                        if ($scope.appData.exportHashProg) {
                            $scope.appData.exportHashProg = false;
                            $scope.appData.showSucUpdPassPop = false;
                        }
                        $scope.hidePopup();
                    }
                });
            }
        }

        $scope.tooltipsRet = function (a) {
            var table = '<table>';
            if (a.db_name !== null) {
                table += '<tr><td>שם בסיס נתונים:</td><td>&nbsp;</td><td>' + a.db_name + '</td></tr>';
            }
            if (a.tn_last_update_date !== null) {
                table += '<tr><td>טעינה אחרונה:</td><td>&nbsp;</td><td>' + a.tn_last_update_date + '</td></tr>';
            }
            table += '</table>';
            return table;
        }

        $scope.openSettingsAccCards = function () {
            if ($scope.appData.sourceCardsAcc && $scope.appData.sourceCardsAcc.length > 0) {
                $scope.appData.openSettingsAccCards = $scope.appData.sourceCardsAcc[0].export_card_date_format;
            } else {
                $scope.appData.openSettingsAccCards = '1';
            }
            $scope.showPopup('views/templates/openSettingsAccCards.html?ver=3.80', 'openSettingsAccCards');
        }

        $scope.showPopupPre_get_fictive = function () {
            $scope.showPopup('views/templates/showPopupPre_get_fictive_card.html?ver=3.80', 'exportAlertsMipuy', true);
        }

        $scope.get_fictive_bank_transes = function () {
            serverConnection.get_fictive_ccard_transes(JSON.stringify({
                accountant_office_id: localStorage.getItem('ACCOUNTANT_OFFICE_ID')
            })).then(function (res) {
                $scope.appData.fileExports = false;
                $scope.appData.fileDownload = true;
                if (res === 1 || res === '1') {
                    $scope.downloadFile_get_oshtnu_yearly();
                }
            }, function (error) {

            });
        }

        $scope.openSettingsAccCardsCalendar = function () {
            if ($scope.appData.sourceCardsAcc && $scope.appData.sourceCardsAcc.length > 0) {
                $scope.appData.openSettingsAccCardsCalendar = $scope.appData.sourceCardsAcc[0].export_card_jour_date_format;
            } else {
                $scope.appData.openSettingsAccCardsCalendar = '1';
            }
            $scope.showPopup('views/templates/openSettingsAccCardsCalendar.html?ver=3.80', 'openSettingsAccCards');
        }

        $scope.sendSettingsAccCards = function () {
            $scope.hidePopup();
            serverConnection.set_export_card_date_format($scope.appData.openSettingsAccCards).then(function (res) {
                $scope.loadAccCardsPage()

            }, function (error) {

            });
        }

        $scope.set_card_cust_id = function (a) {
            var modelCustId = a.modelCustId;
            if (!a.modelCustId) {
                modelCustId = "";
            }
            var data = {
                cId: a.credit_card_id,
                custId: modelCustId
            }
            serverConnection.set_card_cust_id(data).then(function (res) {
                $scope.loadAccCardsPage()
            }, function (error) {

            });
        }

        $scope.sendSettingsAccCardsCardsCalendar = function () {
            $scope.hidePopup();
            serverConnection.set_export_card_jour_date_format($scope.appData.openSettingsAccCardsCalendar).then(function (res) {

            }, function (error) {

            });
        }

        $scope.downloadFile = function () {
            $scope.appData.fileExports = true;
            $scope.appData.fileDownload = false;

            function downloadURL(url) {
                var hiddenIFrameID = 'hiddenDownloader',
                    iframe = document.getElementById(hiddenIFrameID);
                if (iframe === null) {
                    iframe = document.createElement('iframe');
                    iframe.id = hiddenIFrameID;
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                }
                iframe.src = url;
            }

            downloadURL(window.serverName + '/get_oshtnu')
        }
        $scope.downloadFile_get_oshtnu_yearly = function () {
            $scope.appData.fileExports = true;
            $scope.appData.fileDownload = false;

            function downloadURL(url) {
                var hiddenIFrameID = 'hiddenDownloader',
                    iframe = document.getElementById(hiddenIFrameID);
                if (iframe === null) {
                    iframe = document.createElement('iframe');
                    iframe.id = hiddenIFrameID;
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                }
                iframe.src = url;
            }

            downloadURL(window.serverName + '/get_oshtnu_yearly')
        }
        $scope.sendApprHash = function () {
            var data = {
                companyAccountId: $scope.appData.editAlertsHash.acc.credit_card_id,
                desc: $scope.appData.editAlertsHash.acc.explain_desc,
                izu_cust_id: null,
                last_export_status: null,
                intype_id: 1
            }
            serverConnection.hashUpdateExpExplain(data).then(function (res) {
                $scope.hidePopup();
            }, function (error) {

            });
        }

        $scope.sendCheckHash = function () {
            serverConnection.hashMakeExample($scope.appData.editAlertsHash.id).then(function (res) {

            }, function (error) {

            });
        }

        $scope.$parent.refresh = function () {
            $scope.loadAccCardsPage()
        };
        $scope.$on('refresh', function () {
            $scope.$parent.refresh();
        });
        $scope.userGetAccountants = function () {
            $scope.appData.listUserAccountantsLoader = true;
            $scope.showPopup('views/templates/setAccUser.html?ver=3.80', 'setAccUser setAccUserWide');
            serverConnection.userGetAccountants().then(function (res) {
                $scope.appData.listUserAccountants = res;
                $scope.appData.listUserAccountantsLoader = false;
            }, function (error) {

            });
        }
        $scope.ccard_izu_cust_curr_get = function (uuid, dontOpen) {
            $scope.appData.ccard_izu_cust_curr_getRun = true;
            $scope.appData.uuidRowApply = uuid;
            $scope.appData.uuidRowApply.programName = $scope.getNameSoft($scope.appData.uuidRowApply.izu_source_program_id);
            $scope.appData.list_ccard_izu_cust_curr_getLoader = true;
            if (!dontOpen) {
                $scope.showPopup('views/templates/ccard_izu_cust_curr_get.html?ver=3.80', 'company_db_year_set ccard_izu_cust_curr_get', false);
            }
            serverConnection.ccard_izu_cust_curr_get({
                creditCardId: uuid.credit_card_id
            }).then(function (res) {
                $scope.appData.list_ccard_izu_cust_curr_get = res;
                $scope.appData.list_ccard_izu_cust_curr_getLoader = false;
            }, function (error) {

            });
        }
        $scope.ccard_hul_prepare = function () {
            if ($scope.appData.ccard_izu_cust_curr_getRun) {
                $scope.appData.ccard_izu_cust_curr_getRun = false;
                var inizu_account_cust_id = $scope.appData.hashCartisListHashName;
                if ($scope.appData.tabCardsAcc === 1) {
                    inizu_account_cust_id = null;
                }
                serverConnection.ccard_hul_prepare({
                    ccardIzuCustCurrId: $scope.appData.list_ccard_izu_cust_curr_get_rowEdit.CCARD_IZU_CUST_CURRENCY_ID,
                    cycleDate: $scope.appData.ccardGetmahzorihiuvListVal.NEXT_CYCLE_DATE,
                    izuCustId: $scope.appData.hashCartisListHashId,
                    izuAccCustId: inizu_account_cust_id,
                }).then(function (res) {
                    $scope.appData.ccardGetmahzorihiuvListType = false;
                }, function (error) {
                    $scope.appData.ccardGetmahzorihiuvListType = false;
                });
            }
        }
        $scope.userCopypriv = function () {
            serverConnection.userCopypriv($scope.appData.setUserNameAccList).then(function (res) {
                $scope.hidePopup();
                if (res == 0) {
                    $q.all([$scope.getGeneralDataCompanies(), $scope.getGeneralDataPermission()]).then(function (data) {
                        $scope.appData.companies = data[0];
                        $scope.appData.defMonth = data[1];
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
                        }
                    });
                    $scope.loadAccCardsPage()
                }
            }, function (error) {

            });
        }
        $scope.help = function () {
            window.open('http://bizibox.biz/help/hashexport', '_blank');
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
            $scope.showPopup('views/templates/mailerAccCards.html?ver=3.80', 'mailerPopup', false);
        };
        $scope.$watch('appData.showPopup', function (newVal, oldVal) {
            if (newVal == false) {
                $scope.error = '';
                if ($scope.appData.ccardGetmahzorihiuvList) {
                    $scope.appData.ccardGetmahzorihiuvList = false;
                    $scope.appData.ccardGetmahzorihiuvListVal = false;
                }
            }
        });
        $scope.openBug = function (a) {
            $scope.appData.usersWorkVal = {};
            $scope.appData.usersWorkVal.token = a.token;
            $scope.appData.usersWorkVal.companyAccountId = a.credit_card_id;
            $scope.appData.usersWorkVal.companyId = a.company_id;
            $scope.appData.usersWorkVal.last_export_bank_trans_id = null;
            $scope.appData.usersWorkVal.user_cell_phone = '';
            if (!$scope.appData.adminSoft) {
                $scope.appData.usersWorkVal.tasks_type = 1;
                serverConnection.user_get_bizibox_users().then(function (data) {
                    if (localStorage.getItem('usersWorkVal') !== null) {
                        $scope.appData.usersWorkVal.taskUserId = localStorage.getItem('usersWorkVal');
                    } else {
                        $scope.appData.usersWorkVal.taskUserId = data[0].USER_ID;
                    }
                    nextToOpenPopUp();
                })
            } else {
                $q.all([serverConnection.user_get_bizibox_users(), serverConnection.get_qa_tasks_types(), serverConnection.get_qa_tasks_priorty()]).then(function (data) {
                    $scope.appData.usersWork = data[0];
                    $scope.appData.usersWork_tasks_type = data[1];
                    $scope.appData.usersWork_priority = data[2];
                    $scope.appData.usersWorkVal.tasks_type = 5;
                    $scope.appData.usersWorkVal.user_cell_phone = '';
                    $scope.appData.usersWorkVal.taskUserId = "36662323-ceac-46cc-e053-650aa8c02de3";
                    $scope.appData.usersWork_priority.forEach(function (v, i) {
                        if (v.QA_TASK_PRIORTY_DESC == 'גבוה') {
                            $scope.appData.usersWorkVal.priority = v.QA_TASK_PRIORTY_ID;
                        }
                    })
                    nextToOpenPopUp();
                });
            }

            function nextToOpenPopUp() {
                if (localStorage.getItem('usersWorkValMail') !== null) {
                    $scope.appData.usersWorkVal.mail = localStorage.getItem('usersWorkValMail');
                } else {
                    $scope.appData.usersWorkVal.mail = '';
                }
                if (localStorage.getItem('usersWorkValName') !== null) {
                    $scope.appData.usersWorkVal.Task_open_name = localStorage.getItem('usersWorkValName');
                } else {
                    $scope.appData.usersWorkVal.Task_open_name = '';
                }
                $scope.appData.taskTitlePrevText = a.credit_card_nickname;
                $scope.appData.usersWorkVal.taskTitle = $scope.appData.taskTitlePrevText + ' ' + 'בעיות ביצוא כ.אשראי';
                var cls = "";
                if (!$scope.appData.adminSoft) {
                    cls = "notAdmin";
                }
                $scope.showPopup('views/templates/addTaskCard.html?ver=3.80', 'addTask ' + cls);
            }
        }
        $scope.changeTypeTitle = function () {
            if ($scope.appData.usersWorkVal.tasks_type == 8) {
                $scope.appData.usersWorkVal.taskTitle = $scope.appData.taskTitlePrevText;
            } else {
                $scope.appData.usersWorkVal.taskTitle = $scope.appData.taskTitlePrevText + ' ' + 'בעיות ביצוא כ.אשראי';
            }
        }
        $scope.qa_task_add = function () {
            if (!$scope.appData.usersWorkVal.sent) {

                $scope.appData.usersWorkVal.sent = true;

                if ($scope.appData.adminSoft) {
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
                        order_num: $scope.appData.usersWorkVal.order_num,
                        closeMailToSend: $scope.appData.usersWorkVal.mail,
                        task_opener_name: $scope.appData.usersWorkVal.Task_open_name,
                        user_cell_phone: $scope.appData.usersWorkVal.user_cell_phone,
                    }
                } else {
                    var data = {
                        taskUserId: "36662323-ceac-46cc-e053-650aa8c02de3",
                        taskType: 5,
                        taskTitle: $scope.appData.usersWorkVal.taskTitle,
                        taskDesc: $scope.appData.usersWorkVal.taskDesc,
                        driveLink: null,
                        stateType: 1,
                        priority: 2,
                        token: $scope.appData.usersWorkVal.token,
                        companyAccountId: $scope.appData.usersWorkVal.companyAccountId,
                        companyId: $scope.appData.usersWorkVal.companyId,
                        bankTransid: null,
                        order_num: null,
                        closeMailToSend: $scope.appData.usersWorkVal.mail,
                        task_opener_name: $scope.appData.usersWorkVal.Task_open_name,
                        user_cell_phone: $scope.appData.usersWorkVal.user_cell_phone,
                    }
                }
                serverConnection.qa_task_add(data).then(function (res) {
                    localStorage.setItem('usersWorkValMail', $scope.appData.usersWorkVal.mail);
                    localStorage.setItem('usersWorkValName', $scope.appData.usersWorkVal.Task_open_name);
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
        $scope.clearAccCard = function (id) {
            serverConnection.clean_izu_ccard(id).then(function (res) {

            }, function (error) {

            });
        };
        $scope.clearAccBank = function (id) {
            $scope.appData.disabledBtnClearData = false;
            $scope.appData.idClearDataBankCard = id;
            $scope.showPopup('views/templates/clearAccBankCard.html?ver=3.80', 'alerts', true);
        };
        $scope.clearData = function () {
            $scope.appData.disabledBtnClearData = true;
            serverConnection.card_clean_export($scope.appData.idClearDataBankCard).then(function (res) {
                $scope.hidePopup();
                $scope.loadAccCardsPage();
                $scope.appData.disabledBtnClearData = false;
            }, function (error) {

            })
        }
        $scope.isExistHash = function (arr) {
            var isEx = 0;
            if (arr !== undefined) {
                if (arr.length) {
                    arr.forEach(function (v) {
                        if (v.izu_source_program_id == 333) {
                            isEx = 1;
                        }
                    })
                }
            }
            if (isEx !== 0) {
                return true;
            }
            return false;
        }
        $scope.nextExPopProg = function () {
            if ($scope.appData.dataOfProg.name === "exportApply") {
                $scope.exportApply($scope.appData.dataOfProg.type);
            } else {
                $scope.export($scope.appData.dataOfProg.id, $scope.appData.dataOfProg.isPop);
            }
        }

        $scope.card_matach_clean_export = function (id) {
            serverConnection.card_matach_clean_export(id).then(function (res) {
                $scope.ccard_izu_cust_curr_get($scope.appData.uuidRowApply, true)
            }, function (error) {

            })
        }
    }


    angular.module('controllers')
        .controller('mainAccountantsCardsCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', mainAccountantsCardsCtrl]);
}());


