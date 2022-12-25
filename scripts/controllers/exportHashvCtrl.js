(function () {
    function exportHashvCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
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
        $scope.scrollPage = 167;
        $scope.maxSize = 10;
        $scope.openMoreNav = false;
        $scope.allApproved = false;
        $scope.appData.typesSoftwareMemory = [];
        $scope.openMoreNavScroll = function () {
            $scope.openMoreNav = !$scope.openMoreNav;
            if ($scope.openMoreNav) {
                $scope.scrollHeightTable = 295;
                $scope.scrollPage = 215;
            } else {
                $scope.scrollHeightTable = 260;
                $scope.scrollPage = 167;
            }
        }
        $scope.typesFilters = {
            sumCompanies: true,
            exStatus: false,
            exStatusprocec: false
        };
        $scope.init = function () {
            $scope.appData.freeSearch = '';
            $scope.loadExMain();
            $scope.userAccGettokensalerts();
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
        $scope.appData.fileDownload = false;
        $scope.appData.fileExports = true;
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
                $scope.appData.filteredCardsItems = $scope.filtered.length;
            }, 10);
        };
        $scope.loadExports = function () {
            var deferred = $q.defer();
            serverConnection.getExportHashv().then(function (res) {
                deferred.resolve(res);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.blklistDelete = function (uuid) {
            var deferred = $q.defer();
            serverConnection.blklistDelete(uuid).then(function (res) {
                deferred.resolve(res);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.hashCartisList = function (uuid, type) {
            serverConnection.hashCartisList(uuid).then(function (res) {
                $scope.appData.hashCartisList = res;
                if ($scope.appData.hashCartisList.length == 0) {
                    $scope.appData.loaderPopApply = false;
                } else {
                    if (!type) {
                        if (!$scope.appData.initDDCustId) {
                            $scope.appData.hashCartisListModel = $scope.appData.hashCartisList[0];
                        } else {
                            $scope.appData.hashCartisList.forEach(function (v, i) {
                                if (v.hash_id == $scope.appData.initDDCustId) {
                                    $scope.appData.hashCartisListModel = $scope.appData.hashCartisList[i];
                                    $scope.appData.initDDCustId = false;
                                }
                            })
                        }
                    } else {
                        function gethash_name(izu_cust_id) {
                            var ind;
                            $scope.appData.hashCartisList.forEach(function (v, i) {
                                if (izu_cust_id == v.hash_id) {
                                    ind = i;
                                }
                            })
                            return ind;
                        }

                        $scope.appData.hashCartisListModel = $scope.appData.hashCartisList[gethash_name($scope.appData.uuidRowApply.izu_cust_id)];
                    }
                    $scope.applySend(type);
                }
            }, function (error) {

            });
        };
        $scope.blklistCreate = function (uuid) {
            var deferred = $q.defer();
            serverConnection.blklistCreate(uuid).then(function (res) {
                deferred.resolve(res);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.showPopupPre_get_fictive = function () {
            $scope.showPopup('views/templates/showPopupPre_get_fictive_bank.html?ver=3.74', 'exportAlertsMipuy', true);
        }
        $scope.get_fictive_bank_transes = function () {
            serverConnection.get_fictive_bank_transes(JSON.stringify({
                accountant_office_id: localStorage.getItem('ACCOUNTANT_OFFICE_ID')
            })).then(function (res) {
                $scope.appData.fileExports = false;
                $scope.appData.fileDownload = true;
                if (res === 0 || res === '0') {
                    $scope.downloadFile_get_oshtnu_yearly();
                }
            }, function (error) {

            });
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
        $scope.oshtnuFile = function (data) {
            var deferred = $q.defer();
            serverConnection.oshtnuFile(data).then(function (res) {
                deferred.resolve(res);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.datesPicker = {'fromDatePicker': '', 'toDatePicker': ''}
        $scope.getOshtnu = function () {
            var deferred = $q.defer();
            serverConnection.getOshtnu().then(function (res) {
                deferred.resolve(res);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.getNameTypeSoft = function (typeNum) {
            var type = "";
            $scope.appData.get_source_programs.forEach(function (v) {
                if (v.PROGRAM_ID == typeNum) {
                    type = v.PROGRAM_NAME;
                }
            });
            return type;
        };
        $scope.loadExMain = function (checkStatus) {
            $scope.loaderExports = false;
            serverConnection.get_source_programs()
                .then(function (res) {
                    $scope.appData.get_source_programs = res;
                    $scope.appData.get_source_programs.unshift({
                        PROGRAM_ID: null,
                        PROGRAM_NAME: "ללא סוג תוכנה"
                    });
                }, function (error) {
                });
            $scope.loadExports().then(function (res) {
                $scope.appData.exportsHashavArr = res;
                $scope.appData.exportsHashavArr.forEach(function (v, i) {
                    v.data.forEach(function (v1, i1) {
                        if (v1.last_export_date !== null && v1.bank_account_id !== null) {
                            if (v1.ind_blacklist == 0) {
                                v1.ind_blacklist = true;
                            } else {
                                v1.ind_blacklist = false;
                            }
                        }
                    })
                });
                $scope.indMupa_yes = true;
                $scope.indMupa_no = true;
                $scope.selectedAllTypes_indMupa = true;
                $scope.appData.typesStatus = [];
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
                $scope.filterAllEx(true, true, true, checkStatus);
            });
        }
        $scope.openSetCompanies = function (uuid) {
            $scope.appData.listUserAccountantsComLoader = true;
            $scope.appData.listCompaniesAccountantsId = uuid;
            $scope.appData.listCompaniesAccountants = angular.copy($scope.appData.companies);
            $scope.showPopup('views/templates/setAccCompaniesEx.html?ver=3.74', 'setAccUser listCompaniesAccountants');
            $scope.appData.listUserAccountantsComLoader = false;
        }
        $scope.transferAccount = function () {
            $scope.appData.listUserAccountantsComLoader = true;
            var data = {
                company_id: $scope.appData.setUserNameCompanyList,
                company_account_id: $scope.appData.listCompaniesAccountantsId
            }
            serverConnection.transferAccount(data).then(function (res) {
                if (res == 0) {
                    $scope.hidePopup()
                    $scope.appData.listUserAccountantsComLoader = false;
                    $scope.appData.listCompaniesAccountantsId = false;
                    $scope.appData.setUserNameCompanyList = false;
                    $scope.loadExMain()
                }
            }, function (error) {

            });
        }
        $scope.set_source_program = function (a) {
            if (a.disabledChangeTypeSoft == false) {
                var izu_source_program_id = a.izu_source_program_id;
                if (izu_source_program_id == null) {
                    izu_source_program_id = 999;
                }
                var data = {
                    company_id: a.company_id,
                    source_program_id: izu_source_program_id
                }
                serverConnection.set_source_program(data)
                    .then(function (res) {
                        $scope.appData.exportsHashav.forEach(function (v) {
                            if (v.company_id == a.company_id) {
                                v.izu_source_program_id = izu_source_program_id;
                            }
                        });

                        $scope.appData.exportsHashavArr.forEach(function (v) {
                            if (v.company_id == a.company_id) {
                                v.data.forEach(function (val) {
                                    val.izu_source_program_id = izu_source_program_id;
                                });
                                $scope.filterAllEx(true, true);
                            }
                        })
                    }, function (error) {

                    });
            }
        };

        $scope.set_YEARLY = function (a) {
            if (a.disabledChangeYEARLY == false) {
                var data = {
                    companyId: a.company_id,
                    yearly: a.ind_yearly_program
                }
                serverConnection.company_yearly_set(data)
                    .then(function (res) {
                        $scope.appData.exportsHashav.forEach(function (v) {
                            if (v.company_id == a.company_id) {
                                v.ind_yearly_program = a.ind_yearly_program;
                            }
                        });

                        $scope.appData.exportsHashavArr.forEach(function (v) {
                            if (v.company_id == a.company_id) {
                                v.data.forEach(function (val) {
                                    val.ind_yearly_program = a.ind_yearly_program;
                                });
                                $scope.filterAllEx(true, true);
                            }
                        })
                    }, function (error) {

                    });
            }
        };
        //$scope.convertArrayEx = function (first) {
        //	$scope.loaderExports = false;
        //	var show = '', obj = 0, arrStatus = [], arr = [], arr1 = [], arr2 = [], filteredArr = [];
        //	$scope.appData.exportsHashav.forEach(function (v) {
        //		show = false;
        //		obj = 0;
        //		var filtered = [];
        //		v.data.forEach(function (a) {
        //			if (a.last_export_date == null) {
        //				obj = 1;
        //			}
        //			if (a.bank_account_id !== null) {
        //				show = true;
        //				a.showRowInside = true;
        //				if (a.last_export_date !== null) {
        //					if (a.ind_blacklist == 0) {
        //						//a.ind_blacklist = true;
        //						$scope.appData.fileExports = true;
        //					}
        //					else {
        //						//a.ind_blacklist = false;
        //					}
        //				}
        //				filtered.push(a);
        //			}
        //			else {
        //				a.showRowInside = false;
        //			}
        //
        //			//if (first && a.bank_account_id !== null) {
        //			//	if (arrStatus.length == 0) {
        //			//		arrStatus.push({type: a.last_export_status, active: true})
        //			//	}
        //			//	else {
        //			//		var statusNum = 0;
        //			//		arrStatus.forEach(function (values) {
        //			//			if (values.type == a.last_export_status) {
        //			//				statusNum = 1;
        //			//			}
        //			//		})
        //			//		if (statusNum == 0) {
        //			//			arrStatus.push({type: a.last_export_status, active: true})
        //			//		}
        //			//	}
        //			//}
        //		});
        //
        //		if (filtered.length > 0) {
        //			v.data = filtered;
        //		}
        //
        //		if (show == true) {
        //			if (obj == 1) {
        //				v.showFirst = false;
        //
        //				if (filtered.length > 0) {
        //					arr1.push(v)
        //				}
        //			}
        //			else {
        //				v.showFirst = true;
        //				if (filtered.length > 0) {
        //					arr.push(v)
        //				}
        //			}
        //		}
        //		else {
        //				arr2.push(v)
        //		}
        //		v.showRow = show;
        //	});
        //	$scope.appData.exportsHashav = arr.concat(arr1, arr2);
        //	if (first) {
        //		$scope.appData.typesStatus = arrStatus;
        //	}
        //}

        //$scope.filtersEx = function (firstload) {
        //	if ($scope.appData.exportsHashavArr) {
        //		$scope.appData.exportsHashav = angular.copy($scope.appData.exportsHashavArr);
        //		$scope.appData.exportsHashav = $filter('freeFilterEx')($scope.appData.exportsHashav, $scope.freeSearch);
        //		$scope.appData.exportsHashav = $filter('freeFilterCommentsEx')($scope.appData.exportsHashav, $scope.filterComments);
        //
        //		if (firstload) {
        //			$scope.convertArrayEx('first');
        //		}
        //		else {
        //			$scope.convertArrayEx();
        //			$scope.appData.exportsHashav = $filter('freeFilterStatusEx')($scope.appData.exportsHashav, $scope.appData.typesStatus);
        //		}
        //		$scope.loaderExports = true;
        //	}
        //}
        $scope.checksCard = function () {
            $scope.appData.loaderPopApply = true;
            var data = {
                company_id: $scope.appData.uuidRowApply.company_id
            }
            serverConnection.hash_get_accounts(data).then(function (res) {
                $scope.appData.hash_get_accounts = res;
                $scope.appData.changeAccPopUpInside = true;
                $scope.appData.loaderPopApply = false;
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
        $scope.filterStatus = function () {
            if ($scope.appData.exportsHashav && $scope.appData.exportsHashav.length > 0) {
                $scope.appData.typesStatus = [];
                if ($scope.appData.typesSoftwareMemory.length) {
                    $scope.appData.typesSoftware = $scope.appData.typesSoftwareMemory;
                } else {
                    $scope.appData.typesSoftware = [];
                }
                $scope.appData.exportsHashav.forEach(function (v, i) {
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
                            text: $scope.getNameTypeSoft(v.izu_source_program_id),
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
                                text: $scope.getNameTypeSoft(v.izu_source_program_id),
                                active: active
                            })
                        }
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
        $scope.filterCompaniesNames = function (sums, firstUp) {
            var arr = [], sum = 0;
            if ($scope.appData.exportsHashav && $scope.appData.exportsHashav.length > 0) {
                $scope.appData.exportsHashav.forEach(function (v, i) {
                    if (i == 0) {
                        var obj = {
                            ind_yearly_program: v.ind_yearly_program,
                            company_name: v.company_name,
                            company_id: v.company_id,
                            title: true,
                            showRowInside: v.showRowInside,
                            indMupa: v.indMupa,
                            showRow: v.showRow,
                            izu_source_program_id: v.izu_source_program_id,
                            db_name: v.db_name,
                            tn_last_update_date: v.tn_last_update_date,
                            ind_year_alert: v.ind_year_alert
                        }
                        arr.push(obj)
                        if (sums) {
                            sum++;
                        }
                    }
                    arr.push(v);
                    if ($scope.appData.exportsHashav.length - 1 > i) {
                        if ($scope.appData.exportsHashav[i].company_id !== $scope.appData.exportsHashav[i + 1].company_id) {
                            var obj = {
                                ind_year_alert: $scope.appData.exportsHashav[i + 1].ind_year_alert,
                                company_name: $scope.appData.exportsHashav[i + 1].company_name,
                                company_id: $scope.appData.exportsHashav[i + 1].company_id,
                                title: true,
                                indMupa: $scope.appData.exportsHashav[i + 1].indMupa,
                                showRowInside: $scope.appData.exportsHashav[i + 1].showRowInside,
                                showRow: $scope.appData.exportsHashav[i + 1].showRow,
                                ind_yearly_program: $scope.appData.exportsHashav[i + 1].ind_yearly_program,
                                izu_source_program_id: $scope.appData.exportsHashav[i + 1].izu_source_program_id,
                                db_name: $scope.appData.exportsHashav[i + 1].db_name,
                                tn_last_update_date: $scope.appData.exportsHashav[i + 1].tn_last_update_date
                            }
                            arr.push(obj)
                            if (sums) {
                                sum++;
                            }
                        }
                    }
                });
                $scope.appData.exportsHashav = arr;
            }

            if (sums) {
                $scope.listExTitles = {
                    sumCompanies: sum,
                    exStatus: 0,
                    exStatusprocec: 0
                }

                if ($scope.appData.exportsHashav.length > 0) {
                    $scope.appData.exportsHashav.forEach(function (v) {
                        // if (v.last_export_status && v.last_export_status !== null && v.last_export_status > 0 && v.last_export_status !== 2 && v.last_export_status !== 8 && v.last_export_status !== 55 && v.last_export_status !== 56 && v.last_export_status !== 57) {
                        // 	$scope.listExTitles.exStatus++;
                        // }

                        if (v.last_export_status && v.last_export_status !== null && (v.last_export_status == 1 || v.last_export_status == 3 || v.last_export_status == 4 || v.last_export_status == 99)) {
                            $scope.listExTitles.exStatus++;
                        }
                        if (v.last_export_status && v.last_export_status !== null && (v.last_export_status == 2 || v.last_export_status == 8)) {
                            $scope.listExTitles.exStatusprocec++;
                        }
                    });
                }
                if (firstUp) {
                    $scope.sumAllRows = angular.copy($scope.appData.exportsHashav.length);
                }
            }
            $scope.appData.filteredCardsItems = $scope.appData.exportsHashav.length;
            $scope.loaderExports = true;
        }

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
            $scope.filterAllEx(false, true);
        }
        $scope.filterAllEx = function (first, sums, firstUp, checkStatus) {
            $scope.loaderExports = false;
            $scope.appData.exportsHashav = angular.copy($scope.appData.exportsHashavArr);
            $scope.appData.exportsHashav = $scope.filterSortExHash($scope.appData.exportsHashav);
            $scope.appData.exportsHashav = $filter('freeFilterEx')($scope.appData.exportsHashav, $scope.appData.freeSearch);
            $scope.appData.exportsHashav = $filter('freeFilterCommentsEx')($scope.appData.exportsHashav, $scope.filterComments);
            $scope.appData.exportsHashav = $filter('myfilter')($scope.appData.exportsHashav, $scope.typesFilters);
            if (first) {
                $scope.filterStatus();
            }
            if (checkStatus) {
                var status = 0;
                $scope.appData.typesStatus.forEach(function (v) {
                    if (v.type == parseFloat(checkStatus)) {
                        status = 1;
                        v.active = true;
                    } else {
                        v.active = false;
                    }
                });
                if (status == 1) {
                    if (checkStatus == '55') {
                        $scope.allApproved = true;
                    }
                } else {
                    $scope.appData.typesStatus.forEach(function (v) {
                        v.active = true;
                    })
                }
            }
            $scope.appData.exportsHashav = $filter('typeStatusFilterCards')($scope.appData.exportsHashav, $scope.appData.typesStatus);
            $scope.appData.exportsHashav = $filter('typeStatusFilterCardsSoft')($scope.appData.exportsHashav, $scope.appData.typesSoftware);
            if($scope.appData.adminSoft){
                $scope.appData.exportsHashav = $filter('typeStatusFilterMupa')($scope.appData.exportsHashav, $scope.indMupa_yes, $scope.indMupa_no);
            }
            $scope.filterCompaniesNames(sums, firstUp);
        }
        $scope.update_account_blklist = function (item) {
            $scope.appData.companyAccountidToken = item.token;
            $scope.showPopup('views/templates/update_account_blklist.html?ver=3.74', 'update_account_blklist');
        };
        $scope.update_account_blklist_ws = function () {
            $scope.hidePopup();
            serverConnection.update_account_blklist({
                companyAccountid: $scope.appData.companyAccountidToken,
                blklistType: 2,
            }).then(function (res) {

            }, function (error) {

            });
        };
        $scope.accoSethamlazacustId = function () {
            $scope.loaderExports = false;

            serverConnection.accoSethamlazacustId().then(function (res) {
                if (res == 0) {
                    $scope.loadExMain('55');
                }
            }, function (error) {

            });
        }

        $scope.accoPreparehamlaza = function () {
            $scope.loaderExports = false;

            var data = {
                "inaccount_tab": []
            }
            $scope.appData.exportsHashavArr.forEach(function (v) {
                v.data.forEach(function (v1) {
                    if (v1.last_export_status == 55) {
                        data.inaccount_tab.push(v1.company_account_id)
                    }
                })
            });

            serverConnection.accoPreparehamlaza(data).then(function (res) {
                if (res == 0) {
                    $scope.allApproved = false;
                    $scope.loadExMain('57');
                }
            }, function (error) {

            });
        }

        $scope.typesFiltersActive = function (type) {
            var y, active = 0;
            for (y in $scope.listExTitles) {
                if (y == type) {
                    if ($scope.listExTitles[y] !== 0) {
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
            $scope.filterAllEx(true);
        };

        $scope.filterSortExHash = function (arrAll) {
            var show, obj = 0, arr = [], arr1 = [], arr2 = [], arrAllRetr = [];
            arrAll.forEach(function (v) {
                show = false;
                obj = 0;
                var filtered = [];
                v.data.forEach(function (a) {
                    if (a.last_export_date == null) {
                        obj = 1;
                    }
                    if (a.bank_account_id !== null) {
                        show = true;
                        a.showRowInside = true;
                        filtered.push(a);
                    } else {
                        a.showRowInside = false;
                    }
                });

                if (filtered.length > 0) {
                    v.data = filtered;
                }

                if (show == true) {
                    if (obj == 1) {
                        if (filtered.length > 0) {
                            arr1.push(v)
                        }
                    } else {
                        if (filtered.length > 0) {
                            arr.push(v)
                        }
                    }
                } else {
                    arr2.push(v)
                }
                v.showRow = show;
            });

            var res = arr.concat(arr1, arr2);

            res.forEach(function (v, i) {
                v.data.forEach(function (v1, i1) {
                    v1.company_name = v.company_name;
                    v1.company_id = v.company_id;
                    v1.showRowInside = v.showRowInside;
                    v1.showRow = v.showRow;

                    //if (v1.last_export_date !== null && v1.bank_account_id !== null) {
                    //	if (v1.ind_blacklist == 0) {
                    //		v1.ind_blacklist = true;
                    //	} else {
                    //		v1.ind_blacklist = false;
                    //	}
                    //}
                    arrAllRetr.push(v1)
                })
            })
            return arrAllRetr;
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
            $scope.filterAllEx(false, true)
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
            $scope.filterAllEx(false, true);
        };
        $scope.checkAllMupaType = function () {
            if (!$scope.selectedAllTypes_indMupa) {
                $scope.selectedAllTypes_indMupa = false;
            } else {
                $scope.selectedAllTypes_indMupa = true;
            }
            $scope.indMupa_yes = $scope.selectedAllTypes_indMupa;
            $scope.indMupa_no = $scope.selectedAllTypes_indMupa;
            $scope.filterAllEx(false, true);
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
            $scope.filterAllEx(false, true);
        }
        $scope.$parent.refresh = function () {
            $scope.loadExMain()
        };
        $scope.$on('refresh', function () {
            $scope.$parent.refresh();
        });
        $scope.help = function () {
            window.open('http://bizibox.biz/help/hashexport', '_blank');
        };
        $scope.blacklist = function (acc, id) {
            if (acc.ind_blacklist == false) {
                $scope.blklistCreate(acc.company_account_id).then(function (res) {
                    $scope.appData.exportsHashavArr.forEach(function (v) {
                        if (v.company_id == id) {
                            v.data.forEach(function (a) {
                                if (a.company_account_id == acc.company_account_id) {
                                    a.ind_blacklist = false;
                                }
                            });
                        }
                    });
                    $scope.appData.exportsHashav.forEach(function (v) {
                        if (v.company_id == id) {
                            if (v.company_account_id == acc.company_account_id) {
                                v.ind_blacklist = false;
                            }
                        }
                    });
                });
            } else {
                $scope.blklistDelete(acc.company_account_id).then(function (res) {
                    $scope.appData.exportsHashavArr.forEach(function (v) {
                        if (v.company_id == id) {
                            v.data.forEach(function (a) {
                                if (a.company_account_id == acc.company_account_id) {
                                    a.ind_blacklist = true;
                                }
                            });
                        }
                    });
                    $scope.appData.exportsHashav.forEach(function (v) {
                        if (v.company_id == id) {
                            if (v.company_account_id == acc.company_account_id) {
                                v.ind_blacklist = true;
                            }
                        }
                    });
                });
            }
        };
        $scope.exportPop = function (admin) {
            if (admin && $scope.appData.defMonth.ind_phone_exist === 1) {
                $scope.showPopup('views/templates/alertHashavshevet.html?ver=3.74', 'alertHashavshevet', false);
                return;
            }
            if (admin) {
                $scope.showPopup('views/templates/alertAdminEx.html?ver=3.74', 'exportAlerts', true);
                return;
            }
            var time = 0;
            if (admin === false) {
                time = 0
                $scope.hidePopup();
            }

            $timeout(function () {
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
                var digit = 0;
                $scope.appData.exportsHashavArr.forEach(function (v) {
                    v.data.forEach(function (a) {
                        if (a.export_digit !== null) {
                            digit = 1;
                        }
                    });
                });
                if ((!$scope.appData.freeSearch || $scope.appData.freeSearch.length == 0) && types == 0 && typesSoft == 0) {
                    $scope.appData.radioFilterExPop = false;
                    $scope.appData.exportsHashavArr.forEach(function (v) {
                        v.data.forEach(function (a) {
                            if (a.ind_blacklist == true) {
                                $scope.appData.arrExportPopEx.push(a.company_account_id);
                            }
                        });
                    });
                    if (digit == 1) {
                        $scope.export();
                    } else {
                        $scope.showPopup('views/templates/popupExportsAsmacta.html?ver=3.74', 'popupExportsAsmacta');
                    }
                } else {
                    if (digit == 1) {
                        $scope.appData.radioFilterExPop = '0';
                        $scope.showPopup('views/templates/popupExportsFilters.html?ver=3.74', 'popupExportsFilters');
                    } else {
                        $scope.appData.digitFilters = true;
                        $scope.showPopup('views/templates/popupExportsAsmacta.html?ver=3.74', 'popupExportsAsmacta');
                    }
                }
            }, time)
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
                        $scope.showPopup('views/templates/popupExportsFilters.html?ver=3.74', 'popupExportsFilters');
                    } else {
                        $scope.export();
                    }
                }
            }, function (error) {

            });
        }
        $scope.appData.lengthExTime = 0;
        $scope.export = function (datesPicker) {
            $scope.appData.lengthExTime += 1;
            if ($scope.appData.radioFilterExPop) {
                $scope.appData.arrExportPopEx = [];
                if ($scope.appData.radioFilterExPop == '0') {
                    $scope.appData.exportsHashav.forEach(function (v) {
                        if (!v.title && v.ind_blacklist == true) {
                            $scope.appData.arrExportPopEx.push(v.company_account_id);
                        }
                    });
                } else {
                    $scope.appData.exportsHashavArr.forEach(function (v) {
                        v.data.forEach(function (a) {
                            if (a.ind_blacklist == true) {
                                $scope.appData.arrExportPopEx.push(a.company_account_id);
                            }
                        });
                    });
                }
                exportsAll(datesPicker);
                $scope.hidePopup();
            } else {
                exportsAll(datesPicker);
            }

            function exportsAll() {
                if (datesPicker) {
                    $scope.hidePopup();
                    var data = {
                        "dateFrom": datesPicker.fromDatePicker,
                        "dateTill": datesPicker.toDatePicker,
                        "inaccount_tab": [$scope.appData.uuidRow]
                    }
                } else {
                    var data = {
                        "dateFrom": null,
                        "dateTill": null,
                        "inaccount_tab": $scope.appData.arrExportPopEx
                    }
                }
                var jsonData = JSON.stringify(data);
                var timeOutStr;

                if ($scope.appData.exportHashProg) {
                    $scope.appData.showSucUpdPassPop = false;
                    $scope.appData.dataOfProg = {
                        "name": "export",
                        "datesPicker": datesPicker
                    }
                    timeOutStr = $timeout(function () {
                        $scope.appData.showSucUpdPassPop = "fail";
                    }, 30000);
                    $scope.showPopup('views/templates/progressBarPopEx.html?ver=3.74' + new Date().getTime(), 'accountUpdatePasswordPopup progressBarPopEx');
                }
                $scope.oshtnuFile(jsonData).then(function (res) {
                    $scope.appData.lengthExTime = 0;
                    if (timeOutStr !== undefined) {
                        clearTimeout(timeOutStr);
                    }
                    if ($scope.appData.exportHashProg) {
                        $scope.appData.showSucUpdPassPop = "suc";
                        $scope.appData.exportHashProg = false;
                        $timeout(function () {
                            $scope.hidePopup();
                            $scope.loadExMain();
                            if (res == 0) {
                                $scope.appData.fileExports = false;
                                $scope.appData.fileDownload = true;
                                $scope.downloadFile();
                            } else {
                                $scope.showPopup('views/templates/alertNoneData.html?ver=3.74', 'alertNoneData');
                            }
                        }, 1500);
                    } else {
                        $scope.hidePopup();
                        $scope.loadExMain();
                    }
                }, function (error) {
                    if (timeOutStr !== undefined) {
                        clearTimeout(timeOutStr);
                    }
                    if (error.status == 406) {
                        $scope.appData.lengthExTime = 0;
                        $scope.appData.showSucUpdPassPop = '406';
                    } else if (error.status == 504) {
                        if ($scope.appData.exportHashProg) {
                            if ($scope.appData.lengthExTime < 4) {
                                $scope.nextExPopProg();
                            } else {
                                $scope.appData.lengthExTime = 0;
                                $scope.appData.showSucUpdPassPop = '406';
                            }
                        } else {
                            $scope.appData.lengthExTime = 0;
                            $scope.hidePopup();
                        }
                    } else {
                        $scope.appData.lengthExTime = 0;
                        if ($scope.appData.exportHashProg) {
                            $scope.appData.exportHashProg = false;
                        }
                        $scope.hidePopup();
                    }
                });
            }
        };
        $scope.downloadFile = function () {
            //  $scope.getOshtnu().then(function (res) {
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

            // downloadURL('http://pre-prod.bizibox.biz/ang/protected/get_oshtnu')

            // });
        }
        $scope.openBankAccountsPopup = function (id) {
            $scope.appData.companyIdPopUp = id;
            $scope.appData.popupType = 0;
            $scope.showPopup('views/templates/regularOperationsPopup.html?ver=3.74', 'regularOperationsPopup');
        }
        $scope.popUpExports = function (uuid) {
            $scope.appData.uuidRow = uuid;
            $scope.showPopup('views/templates/popupExports.html?ver=3.74', 'popupExports');
        }
        $scope.exportApply = function () {
            $scope.appData.lengthExTime += 1;
            var data = {
                dateFrom: null,
                dateTill: null,
                izuCustId: $scope.appData.hashCartisListModel.hash_id,
                inaccount_tab: [$scope.appData.uuidRowApply.company_account_id],
                bankTransId: $scope.appData.resBankPageFullCheck.bank_trans_id,
                efresh: $scope.appData.resBankPageFullCheck.efresh,
                biziboxEndDayItra: $scope.appData.resBankPageFullCheck.bizibox_end_day_itra
            }
            var timeOutStr;
            if ($scope.appData.exportHashProg) {
                $scope.appData.showSucUpdPassPop = false;
                $scope.appData.dataOfProg = {
                    "name": "exportApply"
                }
                timeOutStr = $timeout(function () {
                    $scope.appData.showSucUpdPassPop = "fail";
                }, 30000)
                $scope.showPopup('views/templates/progressBarPopEx.html?ver=3.74' + new Date().getTime(), 'accountUpdatePasswordPopup');
            }

            var jsonData = JSON.stringify(data);
            $scope.oshtnuFile(jsonData).then(function (res) {
                $scope.appData.lengthExTime = 0;
                if (timeOutStr !== undefined) {
                    clearTimeout(timeOutStr);
                }
                if ($scope.appData.exportHashProg) {
                    $scope.appData.showSucUpdPassPop = "suc";
                    $scope.appData.exportHashProg = false;
                    $timeout(function () {
                        $scope.hidePopup();
                        $scope.loadExMain();
                        if (res == 0) {
                            $scope.appData.fileExports = false;
                            $scope.appData.fileDownload = true;
                            $scope.downloadFile();
                        } else {
                            //  alert('אין נתונים')
                        }
                    }, 1500)
                } else {
                    $scope.hidePopup();
                    $scope.loadExMain();
                }

            }, function (error) {
                if (timeOutStr !== undefined) {
                    clearTimeout(timeOutStr);
                }
                if (error.status == 406) {
                    $scope.appData.lengthExTime = 0;
                    $scope.appData.showSucUpdPassPop = '406';
                } else if (error.status == 504) {
                    if ($scope.appData.exportHashProg) {
                        if ($scope.appData.lengthExTime < 4) {
                            $scope.nextExPopProg();
                        } else {
                            $scope.appData.lengthExTime = 0;
                            $scope.appData.showSucUpdPassPop = '406';
                        }
                    } else {
                        $scope.appData.lengthExTime = 0;
                        $scope.hidePopup();
                    }
                } else {
                    $scope.appData.lengthExTime = 0;
                    if ($scope.appData.exportHashProg) {
                        $scope.appData.exportHashProg = false;
                    }
                    $scope.hidePopup();
                }
            });
        }

        $scope.popUpApply = function (dataCompany, type) {
            $scope.appData.dataCompanyNmaeApply = dataCompany.company_name;
            $scope.appData.uuidRowApply = dataCompany;
            $scope.appData.get_source_programs.forEach(function (v) {
                if (v.PROGRAM_ID == $scope.appData.uuidRowApply.izu_source_program_id) {
                    $scope.appData.uuidRowApply.nameProgram = v.PROGRAM_NAME;
                }
            })
            if (dataCompany.last_export_status !== 3 && dataCompany.last_export_status !== 7) {
                $scope.appData.showApply3or7 = false;

                if (!type) {
                    $scope.hashCartisList(dataCompany.company_id);
                    $scope.showPopup('views/templates/popupApply.html?ver=3.74', 'popupApply');
                } else {
                    if (type == 'edit') {
                        $scope.hashCartisList(dataCompany.company_id, 'edit');
                        $scope.showPopup('views/templates/popupApply.html?ver=3.74', 'popupApply');
                    } else {
                        $scope.hashCartisList(dataCompany.company_id, 'vi');
                    }
                }
            } else {
                $scope.appData.showApply3or7 = true;
                $scope.appData.hashCartisListModel = {
                    hash_id: dataCompany.izu_cust_id
                }
                $scope.applySend();
                $scope.showPopup('views/templates/popupApply.html?ver=3.74', 'popupApply');
            }
        }

        $scope.editAlerts = function (acc, id) {
            $scope.appData.editAlertsHash = {
                'acc': acc,
                'id': id,
                'edit': false
            }

            $scope.showPopup('views/templates/editExHash.html?ver=3.74', 'exHashEditPop');
        }

        $scope.sendApprHash = function () {
            var data = {
                companyAccountId: $scope.appData.editAlertsHash.acc.company_account_id,
                desc: $scope.appData.editAlertsHash.acc.explaind_desc,
                izu_cust_id: null,
                last_export_status: null
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

        $scope.sendHashReport = function () {
            var dates = '';
            if ($scope.appData.resBankPageFullCheck.result_status == 44) {
                dates = $scope.appData.resBankPageFullCheck.peulot[0].trans_date;
            }
            var data = {
                companyAccountId: $scope.appData.uuidRowApply.company_account_id,
                desc: $scope.accoConversions.getStatusNameExApply($scope.appData.resBankPageFullCheck.result_status) + dates,
                izu_cust_id: $scope.appData.hashCartisListModel.hash_id,
                last_export_status: 99
            }
            serverConnection.hashUpdateExpExplain(data).then(function (res) {
                $scope.hidePopup()
            }, function (error) {

            });
        }

        $scope.openSettingsAccExport = function () {
            if ($scope.appData.exportsHashavArr && $scope.appData.exportsHashavArr.length > 0) {
                if ($scope.appData.exportsHashavArr[0].data[0].export_digit == -1) {
                    $scope.appData.openSettingsAccExport = '';
                } else {
                    $scope.appData.openSettingsAccExport = $scope.appData.exportsHashavArr[0].data[0].export_digit;
                }
            } else {
                $scope.appData.openSettingsAccExport = '';
            }
            $scope.showPopup('views/templates/openSettingsAccExport.html?ver=3.74', 'openSettingsAccExportPop');
        }

        $scope.sendSettingsAccExport = function () {
            $scope.hidePopup();
            var data = {
                inexport_digit: parseInt($scope.appData.openSettingsAccExport)
            }
            serverConnection.set_export_digit(data).then(function (res) {

            }, function (error) {

            });
        }
        $scope.set_bank_cust_id = function (a) {
            var modelCustId = a.modelCustId;
            if (!a.modelCustId) {
                modelCustId = "";
            }
            var data = {
                cId: a.company_account_id,
                custId: modelCustId
            }
            serverConnection.set_bank_cust_id(data).then(function (res) {
                $scope.loadExMain()
            }, function (error) {

            });
        }
        $scope.deleteNext = function () {
            $scope.hidePopup();
            $scope.deleteBankAccount();
        };

        $scope.deleteBankAccount = function (account) {
            if ($scope.appData.deleteAccTypeXpHash == 1) {
                $scope.loaderExports = false;
                serverConnection.deleteBankAccount($scope.appData.deleteBankAccId).then(function (result) {
                    $scope.loadExMain()
                }, function (error) {

                });
                $scope.appData.deleteAccTypeXpHash = 0;
            } else {
                $scope.appData.deleteBankAccId = account;
                $scope.appData.deleteAccTypeXpHash = 1;
                $scope.showPopup('views/templates/alertsBeforeDelAccExHash.html?ver=3.74', 'alerts', true);
            }
        };

        $scope.hidePopupHashDel = function () {
            $scope.appData.showPopup = false;
            $scope.appData.deleteAccTypeXpHash = 0;
        };
        $scope.appData.loaderPopApply = false;
        $scope.applySend = function (type) {
            $scope.appData.loaderPopApply = true;
            var data = {
                "companyAccId": $scope.appData.uuidRowApply.company_account_id,
                "izuCustId": $scope.appData.hashCartisListModel.hash_id,
                "izuSourceProgramId": $scope.appData.uuidRowApply.izu_source_program_id
            };
            serverConnection.bankPageFullCheck(data).then(function (res) {
                $scope.appData.loaderPopApply = false;
                $scope.appData.resBankPageFullCheck = res;
                if (type && type == 'vi' && res.result_status == 0) {
                    $scope.exportApply();
                }
                if (type && type == 'vi' && res.result_status !== 0) {
                    $scope.showPopup('views/templates/popupApply.html?ver=3.74', 'popupApply');
                }
                $scope.loadcheckboxApprAttr($scope.appData.resBankPageFullCheck.efresh);
            }, function (error) {

            });
        }
        $scope.cancelEx = function () {
            $scope.hidePopup();
        };
        $scope.removeTimeFromDate = function (val) {
            return val.toString().substring(0, 8);
        }
        $scope.appData.checkboxAppr = false;
        $scope.loadcheckboxApprAttr = function (data) {
            if (data == 0) {
                $scope.appData.checkboxAppr = true;
            } else {
                $scope.appData.checkboxAppr = false;
            }
        }
        $scope.resetExports = function (data) {
            serverConnection.resetExports(data).then(function (res) {
                if (res == 0) {
                    $scope.loadExMain()
                }
            }, function (error) {

            });
        }

        $scope.banks = $scope.accoConversions.getAllBanks();
        $scope.cards = $scope.accoConversions.getAllCards();
        $scope.slika = $scope.accoConversions.getAllSlika();
        $scope.updateAccountPassword = function (item, data) {
            var tok = item.token;
            if (data && item.token_id) {
                tok = item.token_id;
            }
            $scope.appData.popupType = 0;
            $scope.banks.forEach(function (v) {
                if (v.val === item.bank_id.toString()) {
                    $scope.appData.popupType = 0;
                }
            })
            $scope.cards.forEach(function (v) {
                if (v.val === item.bank_id.toString()) {
                    $scope.appData.popupType = 1;
                }
            })
            $scope.slika.forEach(function (v) {
                if (v.val === item.bank_id.toString()) {
                    $scope.appData.popupType = 2;
                }
            })
            if (item.status == 1 || item.status == 2 || item.status == 4 || item.status == 157 || item.status == 158) {
                $scope.appData.popupTypeStatus = item.status;
                $scope.appData.popupTypeLink = true;
                $scope.appData.popupDataToken = tok;
                $scope.appData.popupDataBanks = {BankNumber: item.bank_id};
                $scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.74' + new Date().getTime(), 'accountUpdatePasswordPopup');
            } else if (item.status == 3) {
                $scope.appData.popupData = {
                    token: {
                        BankNumber: item.bank_id,
                        token: tok
                    }
                };
                $scope.showPopup('views/templates/accountUpdatePopup.html?ver=3.74' + new Date().getTime(), 'accountUpdatePopup');
            }
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
            $scope.showPopup('views/templates/mailerHash.html?ver=3.74', 'mailerPopup', false);
        };
        $scope.$watch('appData.showPopup', function (newVal, oldVal) {

            if (newVal == false) {
                $scope.error = '';
            }
        });
        $scope.openBug = function (a) {
            $scope.appData.usersWorkVal = {};
            $scope.appData.usersWorkVal.token = a.token_id;
            $scope.appData.usersWorkVal.companyAccountId = a.company_account_id;
            $scope.appData.usersWorkVal.companyId = a.company_id;
            $scope.appData.usersWorkVal.last_export_bank_trans_id = a.last_export_bank_trans_id;
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
                        if (v.QA_TASK_PRIORTY_DESC === 'גבוה') {
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
                $scope.appData.taskTitlePrevText = a.account_nickname;
                $scope.appData.usersWorkVal.taskTitle = $scope.appData.taskTitlePrevText + ' ' + 'בעיות בייצוא לחשבון';

                var cls = "";
                if (!$scope.appData.adminSoft) {
                    cls = "notAdmin";
                }
                $scope.showPopup('views/templates/addTaskExHash.html?ver=3.74', 'addTask ' + cls);
            }
        }
        $scope.changeTypeTitle = function () {
            if ($scope.appData.usersWorkVal.tasks_type == 8) {
                $scope.appData.usersWorkVal.taskTitle = $scope.appData.taskTitlePrevText;
            } else {
                $scope.appData.usersWorkVal.taskTitle = $scope.appData.taskTitlePrevText + ' ' + 'בעיות בייצוא לחשבון';
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
                    $scope.successAlertSend();
                }, function (error) {
                    $scope.appData.usersWorkVal.sent = false;
                });
            }

        }
        $scope.changeUserWork = function () {
            localStorage.setItem('usersWorkVal', $scope.appData.usersWorkVal.taskUserId)
        }
        $scope.clearAccBank = function (id) {
            $scope.appData.disabledBtnClearData = false;
            $scope.appData.idClearDataBankEx = id;
            $scope.showPopup('views/templates/clearAccBank.html?ver=3.74', 'alerts', true);
        };
        $scope.clearData = function () {
            $scope.appData.disabledBtnClearData = true;
            serverConnection.account_clean_export($scope.appData.idClearDataBankEx).then(function (res) {
                $scope.hidePopup();
                $scope.loadExMain();
                $scope.appData.disabledBtnClearData = false;
            }, function (error) {

            })
        }
        $scope.clean_izu_bt = function (id) {
            $scope.appData.clean_izu_bt = id;
            $scope.showPopup('views/templates/alertAdminExClean.html?ver=3.74', 'alerts', true);
        }
        $scope.clean_izu_bt_send = function () {
            serverConnection.clean_izu_bt($scope.appData.clean_izu_bt).then(function (res) {
                $scope.hidePopup();
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
                $scope.exportApply();
            } else {
                $scope.export($scope.appData.dataOfProg.datesPicker);
            }
        }

        $scope.openAlertsApr = function (company_id) {
            $scope.appData.peulaApprcompanyID = company_id;
            $scope.showPopup('views/templates/alertsPeulaHash.html?ver=3.74', 'alerts', true);
        }
        $scope.setApprove = function () {
            serverConnection.company_exporter_settime({
                companyID: $scope.appData.peulaApprcompanyID,
                time: 4,
            }).then(function (res) {
                $scope.hidePopup();
            }, function (error) {

            })
        }

        $scope.company_db_year_get = function (a, reload) {
            $scope.appData.company_db_year_setLoader = true;
            if (!reload) {
                $scope.showPopup('views/templates/company_db_year_set.html?ver=3.74', 'company_db_year_set', false);
            }
            serverConnection.company_db_year_get({
                companyId: a.company_id,
                dbName: a.db_name,
            }).then(function (res) {
                $scope.appData.company_db_year_set = {
                    company_db_year_set: res,
                    row: a
                };
                $scope.appData.company_db_year_setLoader = false;
                if (!reload) {
                    $timeout(function () {
                        $scope.appData.popupClose = true;
                    }, (60000 * 5))
                }
            }, function (error) {

            })
        }

        $scope.company_db_year_set = function (dbName, dbYear) {
            serverConnection.company_db_year_set({
                companyId: $scope.appData.company_db_year_set.row.company_id,
                dbName: dbName,
                dbYear: dbYear
            }).then(function (res) {
                $scope.company_db_year_get($scope.appData.company_db_year_set.row, true)
            }, function (error) {

            })
        }
    }

    angular.module('controllers')
        .controller('exportHashvCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', exportHashvCtrl]);
}());
