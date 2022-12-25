(function () {
    function managerAccCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
        $scope.$location = $location;
        $scope.$state = $state;
        $scope.utils = utils;
        $scope.appData = AppData;
        $scope.accoConversions = accoConversions;
        $scope.months = utils.monthNames();
        $scope.years = utils.years(5);
        $scope.date = new Date();
        $scope.$parent.appData.loaderAccMangPage = false;
        $scope.scrollHeightTable = 325;
        $scope.maxSize = 10;
        $scope.currentPage = 1; //current page
        if (!localStorage.getItem('entryLimit')) {
            $scope.entryLimit = 50;
            localStorage.setItem('entryLimit', $scope.entryLimit)
        } else {
            $scope.entryLimit = parseFloat(localStorage.getItem('entryLimit'));
        }
        $scope.appData.companyAllList = [{
            companyId: null,
            companyName: "בחירת חברה"
        }];
        $scope.entryLimitChange = function () {
            localStorage.setItem('entryLimit', $scope.entryLimit)
        }
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };
        $scope.init = function () {
            $scope.loadAccMangPage();
        }
        $scope.addRowObj = {};
        $scope.addRowObj.typeInput = 2;
        $scope.addRowObj.PHONE_DESC = '';
        if (localStorage.getItem('userAccName')) {
            $scope.appData.userAccName = localStorage.getItem('userAccName');
        }
        if (localStorage.getItem('userAccNameUsers')) {
            $scope.appData.userAccNameUsers = localStorage.getItem('userAccNameUsers');
        }
        if (localStorage.getItem('ACCOUNTANT_OFFICE_ID') && localStorage.getItem('ACCOUNTANT_OFFICE_ID') !== '') {
            $scope.appData.ACCOUNTANT_OFFICE_ID_VAL = localStorage.getItem('ACCOUNTANT_OFFICE_ID');
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


        $scope.popupOpenServiceCall = function () {
            $scope.showPopup('views/templates/popupOpenServiceCall.html?ver=3.74' + new Date().getTime(), 'popupOpenServiceCall');
        }

        $scope.userGetAccountants = function () {
            $scope.appData.listUserAccountantsLoader = true;
            $scope.showPopup('views/templates/setAccUserManager.html?ver=3.74' + new Date().getTime(), 'setAccUser setAccUserWide');
            serverConnection.userGetAccountants().then(function (res) {
                $scope.appData.listUserAccountants = res;
                $scope.appData.listUserAccountants.forEach(function (v) {
                    v.fullName = v.first_name + ' ' + v.last_name;
                })
                $scope.appData.listUserAccountantsLoader = false;
            }, function (error) {

            });
        }
        $scope.getRegularUsers = function () {
            $scope.appData.listUserAccountantsLoader = true;
            $scope.showPopup('views/templates/setAccUsersRegularManager.html?ver=3.74', 'setAccUser');
            serverConnection.getRegularUsers().then(function (res) {
                $scope.appData.listUserRegAccountants = res;
                $scope.appData.listUserAccountantsLoader = false;
            }, function (error) {

            });
        }
        $scope.userCopypriv = function (reg) {
            var users;
            if (reg) {
                users = JSON.parse($scope.appData.setUserNameAccList).USER_ID;
            } else {
                users = JSON.parse($scope.appData.setUserNameAccList).user_id;
            }
            serverConnection.userCopypriv(users).then(function (res) {
                $scope.hidePopup();
                $q.all([$scope.getGeneralDataCompanies(), $scope.getGeneralDataPermission()]).then(function (data) {
                    $scope.appData.companies = angular.copy(data[0]);
                    $scope.appData.companyAllList = [{
                        companyId: null,
                        companyName: "בחירת חברה"
                    }];
                    if (data[0].length) {
                        $scope.appData.companyAllList = angular.copy(data[0]);
                        $scope.appData.companyAllList.unshift({
                            companyId: null,
                            companyName: "בחירת חברה"
                        })
                    }
                    $scope.appData.defMonth = data[1];
                    if (!$scope.appData.adminSoft && $scope.appData.defMonth.bizibox_employee === 1) {
                        $scope.logout();
                        return;
                    }
                    if (res == 0) {
                        if (JSON.parse($scope.appData.setUserNameAccList).first_name) {
                            var users = JSON.parse($scope.appData.setUserNameAccList).first_name + ' ' + JSON.parse($scope.appData.setUserNameAccList).last_name;
                            localStorage.setItem('userAccName', users);
                            $scope.appData.userAccName = users;
                            $scope.appData.userAccNameUsers = "";
                            localStorage.removeItem('userAccNameUsers');
                        }
                        if (JSON.parse($scope.appData.setUserNameAccList).NAME) {
                            localStorage.setItem('userAccNameUsers', JSON.parse($scope.appData.setUserNameAccList).NAME);
                            $scope.appData.userAccNameUsers = JSON.parse($scope.appData.setUserNameAccList).NAME;
                            $scope.appData.userAccName = "";
                            localStorage.removeItem('userAccName');
                        }
                        if (reg) {
                            localStorage.setItem('ACCOUNTANT_OFFICE_ID', '');
                            $scope.appData.ACCOUNTANT_OFFICE_ID_VAL = false;
                        } else {
                            if (JSON.parse($scope.appData.setUserNameAccList).accountant_office_id) {
                                $scope.appData.ACCOUNTANT_OFFICE_ID_VAL = JSON.parse($scope.appData.setUserNameAccList).accountant_office_id;
                                localStorage.setItem('ACCOUNTANT_OFFICE_ID', JSON.parse($scope.appData.setUserNameAccList).accountant_office_id);
                            } else {
                                $scope.appData.ACCOUNTANT_OFFICE_ID_VAL = false;
                                localStorage.setItem('ACCOUNTANT_OFFICE_ID', '');
                            }
                        }
                        if ($scope.appData.companies.length === 1) {
                            $timeout(function () {
                                $scope.goToLink($scope.appData.companies[0].companyId, 'businessInfo')
                            }, 500)
                        } else {
                            if (!reg && JSON.parse($scope.appData.setUserNameAccList).accountant_office_id) {
                                $timeout(function () {
                                    $state.go('mainAccountants.managerAcc.office');
                                    $scope.loadAccMangPage()
                                }, 500)
                            } else {
                                $scope.loadAccMangPage()
                            }
                        }
                    }
                });
            }, function (error) {

            });
        }
        $scope.refresh = function () {
            $scope.loadAccMangPage()
        };
        $scope.$on('refresh', function () {
            $scope.refresh();
        });
        $scope.openBug = function () {
            $scope.appData.usersWorkVal = {};
            $q.all([serverConnection.user_get_bizibox_users(), serverConnection.get_qa_tasks_types(), serverConnection.get_qa_tasks_priorty(), serverConnection.get_task_catagory(), serverConnection.get_qa_tasks_states()]).then(function (data) {
                $scope.appData.usersWork = data[0];
                $scope.appData.usersWork_tasks_type = data[1];
                $scope.appData.usersWork_priority = data[2];
                $scope.appData.usersWork_task_catagory = angular.copy(data[3]);
                $scope.appData.usersWork_statesPop = angular.copy(data[4]);
                $scope.appData.usersWorkVal.stateType = 1;
                $scope.appData.usersWork_task_catagory.unshift({
                    TASK_CATEGORY_NAME: "בחר קטגוריה",
                    TASK_CATEGORY_ID: "null"
                });
                $scope.appData.usersWorkVal.closeTaskCategoryID = "null";
                $scope.appData.usersWorkVal.closeTASK_CATEGORY_COMMENT = null;
                if (localStorage.getItem('usersWorkVal') !== null) {
                    $scope.appData.usersWorkVal.taskUserId = localStorage.getItem('usersWorkVal');
                } else {
                    $scope.appData.usersWorkVal.taskUserId = data[0][0].USER_ID;
                }

                $scope.appData.usersWorkVal.companyId = $scope.appData.companyAllList[0].companyId;
                $scope.appData.usersWorkVal.tasks_type = null;
                $scope.appData.usersWorkVal.taskTitle = 'בעיה כללית';
                $scope.appData.usersWork_priority.forEach(function (v, i) {
                    if (v.QA_TASK_PRIORTY_DESC == 'גבוה') {
                        $scope.appData.usersWorkVal.priority = v.QA_TASK_PRIORTY_ID;
                    }
                })
                // $scope.loadChart();
            });
        }
        $scope.getTypeBug = function (typeNum) {
            var type = "";
            if ($scope.appData.usersWork_tasks_type) {
                $scope.appData.usersWork_tasks_type.forEach(function (v) {
                    if (v.QA_TASK_TYPE_ID == typeNum) {
                        type = v.QA_TASK_TYPE_DESC;
                    }
                });
            }
            return type;
        }
        $scope.editRowsExporter = function (a) {
            a.disabled = true;
        };
        $scope.saveRowsExporter = function (a) {
            a.disabled = false;
            var data = {
                "exporter_id": a.EXPORTER_ID,
                "comment": a.EXP_COMMENT ? a.EXP_COMMENT : '',
            }
            serverConnection.update_exporter_comment(data)
                .then(function () {

                })
        }
        $scope.editRowsOffice_details = function (num) {
            $scope.appData.get_acco_office_details[0]['disabled' + num] = true;
        }
        $scope.saveRowsOffice_details = function () {
            // $scope.appData.get_acco_office_details[0]['disabled' + num] = false;
            var a = $scope.appData.get_acco_office_details[0];
            var data = {
                "accountantOfficeId": $scope.appData.get_acco_office_details[0].ACCOUNTANT_OFFICE_ID,
                "phone1": $scope.appData.get_acco_office_details[0].PHONE1 ? $scope.appData.get_acco_office_details[0].PHONE1 : '',
                "phone2": $scope.appData.get_acco_office_details[0].PHONE2 ? $scope.appData.get_acco_office_details[0].PHONE2 : '',
                "sugHiuv": a.SUG_HIUV,
                "fax": a.FAX,
                "email": $scope.appData.get_acco_office_details[0].EMAIL ? $scope.appData.get_acco_office_details[0].EMAIL : '',
                "accountantOfficeName": $scope.appData.get_acco_office_details[0].ACCOUNTANT_OFFICE_NAME ? $scope.appData.get_acco_office_details[0].ACCOUNTANT_OFFICE_NAME : '',
                "discountPrc": a.DISCOUNT_PRC,
                "discountSum": a.DISCOUNT_SUM,
                "phone1_comment": a.PHONE1_COMMENT,
                "phone2_comment": a.PHONE2_COMMENT,
                "acc_address": a.ACC_ADDRESS,
                "acc_city": a.ACC_CITY,
                "indDoNotUpdSums": null
            }
            serverConnection.accountant_office_update(data)
                .then(function () {

                })
        }

        $scope.editRowsUsers = function (a, num) {
            a['disabled' + num] = true;
        }
        $scope.saveRowsUsers = function (a, num) {
            // a['disabled' + num] = false;

            var data = {
                first_name: a.FIRST_NAME ? a.FIRST_NAME : '',
                last_name: a.LAST_NAME ? a.LAST_NAME : '',
                cell: a.CELL_PHONE ? a.CELL_PHONE : '',
                user_id: a.USER_ID
            }
            serverConnection.update_user_det(data).then(function (res) {

            }, function (error) {

            });
        }


        $scope.addNote = function () {

            $scope.appData.acc_office_getnotes.push({
                "ACCOUNTANT_OFFICE_NOTE_ID": null,
                "ACCOUNTANT_OFFICE_ID": localStorage.getItem('ACCOUNTANT_OFFICE_ID'),
                "NOTE_TEXT": "",
                "NOTE_ORDER": String($scope.appData.acc_office_getnotes.length + 1),
                "disabled": true
            })
        };
        $scope.editRowsNote = function (a) {
            a.disabled = true;
        };
        $scope.saveRowsNote = function (a) {
            a.disabled = false;
            if (a.ACCOUNTANT_OFFICE_NOTE_ID) {
                var data = {
                    "accountantOfficeNoteId": a.ACCOUNTANT_OFFICE_NOTE_ID,
                    "noteText": a.NOTE_TEXT ? a.NOTE_TEXT : '',
                    "noteOrder": a.NOTE_ORDER ? a.NOTE_ORDER : ''
                }
                serverConnection.acc_office_updatenote(data)
                    .then(function () {
                        serverConnection.acc_office_getnotes()
                            .then(function (res) {
                                if (res && res.length) {
                                    res.sort(function (a, b) {
                                        return (a.NOTE_ORDER > b.NOTE_ORDER) ? 1 : -1;
                                    });
                                }
                                $scope.appData.acc_office_getnotes = res;
                            }, function (error) {

                            });
                    })
            } else {
                var data = {
                    "accountantOfficeId": localStorage.getItem('ACCOUNTANT_OFFICE_ID'),
                    "noteText": a.NOTE_TEXT ? a.NOTE_TEXT : ''
                }
                serverConnection.acc_office_createnote(data)
                    .then(function (res) {
                        serverConnection.acc_office_getnotes().then(function (data) {
                            if (data && data.length) {
                                data.sort(function (a, b) {
                                    return (a.NOTE_ORDER > b.NOTE_ORDER) ? 1 : -1;
                                });
                            }
                            $scope.appData.acc_office_getnotes = data;
                        })

                    })
            }
        }

        $scope.editRows = function (a) {
            a.disabled = true;
        };
        $scope.saveRows = function (a) {
            if ((a.PHONE_NUMBER && a.PHONE_PREFIX) || (!a.PHONE_NUMBER && !a.PHONE_PREFIX)) {
                a.disabled = false;
                var data = {
                    "accountantId": $scope.appData.get_accountant_det.USER_ID,
                    "linkId": a.LINK_ID ? a.LINK_ID : null,
                    "phoneType": a.PHONE_TYPE_ID,
                    "phoneNumber": a.PHONE_NUMBER ? a.PHONE_NUMBER : "",
                    "phonePrefix": a.PHONE_PREFIX ? a.PHONE_PREFIX : "",
                    "phoneDesc": a.PHONE_DESC ? a.PHONE_DESC : ""
                }
                serverConnection.set_accountant_phone(data)
                    .then(function () {

                    })
            }
        }
        $scope.saveRowsNew = function () {
            if ($scope.addRowObj.PHONE_NUMBER && $scope.addRowObj.PHONE_PREFIX) {
                var data = {
                    "accountantId": $scope.appData.get_accountant_det.USER_ID,
                    "linkId": null,
                    "phoneType": $scope.addRowObj.typeInput,
                    "phoneNumber": $scope.addRowObj.PHONE_NUMBER ? $scope.addRowObj.PHONE_NUMBER : "",
                    "phonePrefix": $scope.addRowObj.PHONE_PREFIX ? $scope.addRowObj.PHONE_PREFIX : "",
                    "phoneDesc": $scope.addRowObj.PHONE_DESC ? $scope.addRowObj.PHONE_DESC : ""
                }
                serverConnection.set_accountant_phone(data)
                    .then(function () {
                        $scope.openRowEditable = false;
                        $scope.addRowObj = {};
                        $scope.addRowObj.typeInput = 2;
                        $scope.addRowObj.PHONE_DESC = '';
                        serverConnection.get_accountant_phones()
                            .then(function (res) {
                                $scope.appData.get_accountant_phones = res;
                            });
                    })
            }
        }
        $scope.qa_task_add = function () {
            if(!$scope.appData.usersWorkVal.sent && $scope.appData.usersWorkVal.tasks_type){

                $scope.appData.usersWorkVal.sent = true;

            $scope.hidePopup();
            var data = {
                taskUserId: $scope.appData.usersWorkVal.taskUserId,
                taskType: $scope.appData.usersWorkVal.tasks_type,
                taskTitle: $scope.appData.usersWorkVal.taskTitle,
                taskDesc: $scope.appData.usersWorkVal.taskDesc,
                driveLink: $scope.appData.usersWorkVal.driveLink,
                stateType: $scope.appData.usersWorkVal.stateType,
                priority: $scope.appData.usersWorkVal.priority,
                token: null,
                companyAccountId: null,
                companyId: $scope.appData.usersWorkVal.companyId,
                bankTransid: null,
                order_num: $scope.appData.usersWorkVal.order_num,
                task_category_comment: $scope.appData.usersWorkVal.closeTASK_CATEGORY_COMMENT,
                task_category_id: $scope.appData.usersWorkVal.closeTaskCategoryID
            }
            serverConnection.qa_task_add(data).then(function (res) {
                $scope.appData.usersWorkVal.sent = false;

                serverConnection.get_accountant_timeline().then(function (data) {
                    $scope.appData.get_accountant_timeline = data;
                    $scope.openBug();
                })
            }, function (error) {
                $scope.appData.usersWorkVal.sent = false;

            });
            }
        }
        $scope.loadChart = function () {
            var totalSumMes = [], months = [], tooltips = [[]];

            function groupBy(array, f) {
                var groups = {};
                array.forEach(function (o) {
                    var group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
            }

            var result = groupBy($scope.appData.get_accountant_timeline, function (item) {
                return [item.DATE_CREATED];
            });
            result.forEach(function (v, i) {
                totalSumMes.push(v.length);
                months.push(v[0].DATE_CREATED);
                v.forEach(function (val, ind) {
                    var TASK_DESC = '';
                    if (val.TASK_DESC !== null) {
                        TASK_DESC = val.TASK_DESC + " | ";
                    }
                    var COMPANY_NAME = '';
                    if (val.COMPANY_NAME !== null) {
                        COMPANY_NAME = val.COMPANY_NAME + " | ";
                    }
                    var STATUS_DESC = '';
                    if (val.STATUS_DESC !== null) {
                        STATUS_DESC = val.STATUS_DESC + " | ";
                    }
                    var TASK_TITLE = '';
                    if (val.TASK_TITLE !== null) {
                        TASK_TITLE = val.TASK_TITLE + " | ";
                    }
                    tooltips[i].push({
                        name: COMPANY_NAME + '' + TASK_DESC + TASK_TITLE,
                        Val: STATUS_DESC + '' + $scope.getTypeBug(val.STATE_TYPE)
                    });
                })
                tooltips.push([]);
            });
            $scope.chartData = {
                tooltipManager: true,
                zoomType: 'xy',
                spacingTop: 55,
                spacingLeft: 0,
                spacingRight: 0,
                borderColor: '#d8d8d8',
                borderWidth: 1,
                borderRadius: 3,
                legend: false,
                xAxis: months,
                reversed: true,
                yLabel: 'סה״כ משימות',
                data: [{
                    cursor: 'pointer',
                    name: '',
                    lineWidth: 2,
                    color: '#1387a9',
                    states: {
                        hover: {
                            lineWidth: 2,
                            color: '#1387a9'
                        }
                    },
                    marker: {
                        symbol: 'circle'
                    },
                    data: totalSumMes
                }],
                title: ' ',
                subtitle: ' ',
                tooltips: [tooltips]
            }
        }
        $scope.loadAccMangPage = function () {
            $scope.$parent.appData.loaderAccMangPage = true;
            $timeout(function () {
                if ($state.current.name == 'mainAccountants.managerAcc.companyDetails') {
                    $q.all([serverConnection.get_accountant_det(), serverConnection.get_accountant_phones(), serverConnection.get_accountant_timeline(), serverConnection.getCompanies(), serverConnection.get_user_companies_det(), serverConnection.get_exporters_details()]).then(function (res) {
                        $scope.appData.get_accountant_det = res[0][0];
                        $scope.appData.get_accountant_phones = res[1];
                        $scope.appData.get_accountant_timeline = res[2];
                        $scope.appData.companies = angular.copy(res[3]);
                        $scope.appData.get_user_companies_det = res[4];
                        $scope.appData.get_exporters_details = res[5];
                        $scope.appData.companyAllList = [{
                            companyId: "null",
                            companyName: "בחירת חברה"
                        }];
                        if (res[3].length) {
                            $scope.appData.companyAllList = angular.copy(res[3]);
                            $scope.appData.companyAllList.unshift({
                                companyId: "null",
                                companyName: "בחירת חברה"
                            })
                        }
                        $scope.openBug();
                        $scope.$parent.appData.loaderAccMangPage = false;

                    }, function (error) {
                    });
                }
                if ($state.current.name == 'mainAccountants.managerAcc.office') {
                    var ACCOUNTANT_OFFICE_ID = localStorage.getItem('ACCOUNTANT_OFFICE_ID');
                    if (ACCOUNTANT_OFFICE_ID && ACCOUNTANT_OFFICE_ID !== '') {
                        // $scope.appData.get_acco_office_details = [{
                        // 	"ACCOUNTANT_OFFICE_ID": "5d4d03ed-b385-4cfe-e053-0b6519ac6671",
                        // 	"ACCOUNTANT_OFFICE_NAME": "יניב ונטלי",
                        // 	"DATE_CREATED": "06/11/2017",
                        // 	"DATE_LAST_MODIFIED": null,
                        // 	"LAST_MODIFING_USER_ID": "6a3284b0-3cf4-44ac-b2d7-abb82b2dd789",
                        // 	"IND_DELETED": 0,
                        // 	"SUG_HIUV": 3,
                        // 	"DISCOUNT_PRC": null,
                        // 	"DISCOUNT_SUM": null,
                        // 	"LAST_PAYMENT_DATE": null,
                        // 	"LAST_PAYMENT_STATUS": null,
                        // 	"EMAIL": null,
                        // 	"FAX": null,
                        // 	"PHONE1": null,
                        // 	"PHONE2": null,
                        // 	"PHONE1_COMMENT": null,
                        // 	"PHONE2_COMMENT": null,
                        // 	"ACC_ADDRESS": null,
                        // 	"ACC_CITY": null,
                        // 	"FATHER_NAME": "גבי אביאור"
                        // }];
                        serverConnection.get_user_companies_det()
                            .then(function (res) {
                                $scope.appData.get_user_companies_det = res;
                            }, function (error) {

                            });
                        serverConnection.acc_office_getnotes()
                            .then(function (res) {
                                if (res && res.length) {
                                    res.sort(function (a, b) {
                                        return (a.NOTE_ORDER > b.NOTE_ORDER) ? 1 : -1;
                                    });
                                }
                                $scope.appData.acc_office_getnotes = res;
                            }, function (error) {

                            });
                        serverConnection.get_exporters_details()
                            .then(function (res) {
                                $scope.appData.get_exporters_details = res;

                            }, function (error) {

                            });
                        serverConnection.get_acco_office_timeline()
                            .then(function (res) {
                                $scope.appData.get_acco_office_timeline = res;

                            }, function (error) {

                            });
                        serverConnection.get_acco_office_users()
                            .then(function (res) {
                                $scope.appData.get_acco_office_users = res;
                                $scope.$parent.appData.loaderAccMangPage = false;

                            }, function (error) {

                            });
                        serverConnection.get_acco_office_details()
                            .then(function (res) {
                                $scope.appData.get_acco_office_details = res;

                            }, function (error) {

                            });
                        // $scope.appData.get_acco_office_timeline = [{
                        // 	"TASK_ID": "4fc6760f-6a24-497f-e053-650019ac290f",
                        // 	"FORMAT_DATE": "18/05/17 14:05",
                        // 	"TITLE": " - בעיה כללית ()",
                        // 	"ORIGINAL_DESC": null,
                        // 	"TASK_DESC": "ייבוא דפי בנק לכל החברות",
                        // 	"(SELECTQTY.QA_TASK_TYPE_DESCFROMQA_TASKS_TYPESQTYWHEREQTY.QA_TASK_TYPE_ID=QT.STATE_TYPE)||'-'||(SELECTQC.TASK_CATEGORY_NAMEFROMQA_TASK_CATAGORYQCWHEREQC.TASK_CATEGORY_ID=QT.TASK_CATEGORY_ID)": "שיחה נכנסת - ",
                        // 	"CLOSE_DATE": null,
                        // 	"CLOSE_MAIL_TO_SEND": null,
                        // 	"COMAPNY_ID": null,
                        // 	"CREATED_BY": "2ea0e2aa-9e4d-5cbd-e053-650aa8c0c514",
                        // 	"DATE_CREATED": "18/05/2017",
                        // 	"(SELECTCOMPANY_NAMEFROMFTC_COMPANYCOWHERECO.COMPANY_ID=QT.COMAPNY_ID)||'-'||QT.TASK_TITLE": " - בעיה כללית",
                        // 	"TASK_COLOR": "green",
                        // 	"LAST_CHANGE": "מירית סטוניס - 18/05/17 14:05"
                        // }, {
                        // 	"TASK_ID": "4e707f6d-403a-073f-e053-650019ac6cf0",
                        // 	"FORMAT_DATE": "01/05/17 08:05",
                        // 	"TITLE": " - בעיה כללית ()",
                        // 	"ORIGINAL_DESC": null,
                        // 	"TASK_DESC": "לבקשת אייל חזות, כל נתוני הנה\"ח של כל החברות בלירם נמחקו.",
                        // 	"(SELECTQTY.QA_TASK_TYPE_DESCFROMQA_TASKS_TYPESQTYWHEREQTY.QA_TASK_TYPE_ID=QT.STATE_TYPE)||'-'||(SELECTQC.TASK_CATEGORY_NAMEFROMQA_TASK_CATAGORYQCWHEREQC.TASK_CATEGORY_ID=QT.TASK_CATEGORY_ID)": "שיחה נכנסת - ",
                        // 	"CLOSE_DATE": null,
                        // 	"CLOSE_MAIL_TO_SEND": null,
                        // 	"COMAPNY_ID": null,
                        // 	"CREATED_BY": "36662323-ceac-46cc-e053-650aa8c02de3",
                        // 	"DATE_CREATED": "01/05/2017",
                        // 	"(SELECTCOMPANY_NAMEFROMFTC_COMPANYCOWHERECO.COMPANY_ID=QT.COMAPNY_ID)||'-'||QT.TASK_TITLE": " - בעיה כללית",
                        // 	"TASK_COLOR": "green",
                        // 	"LAST_CHANGE": "יוסי פורטוגז - 01/05/17 08:05"
                        // }, {
                        // 	"TASK_ID": "4cf24966-e90a-45e8-e053-650019acf3a4",
                        // 	"FORMAT_DATE": "12/04/17 12:04",
                        // 	"TITLE": "ג.ס. מאגרי מים בע\"מ - בעיה כללית ()",
                        // 	"ORIGINAL_DESC": null,
                        // 	"TASK_DESC": "לבקשת נעמה נבדק חשבון פועלים 124991. אין תנועות למעט העברה מסגירה.",
                        // 	"(SELECTQTY.QA_TASK_TYPE_DESCFROMQA_TASKS_TYPESQTYWHEREQTY.QA_TASK_TYPE_ID=QT.STATE_TYPE)||'-'||(SELECTQC.TASK_CATEGORY_NAMEFROMQA_TASK_CATAGORYQCWHEREQC.TASK_CATEGORY_ID=QT.TASK_CATEGORY_ID)": "שיחה נכנסת - ",
                        // 	"CLOSE_DATE": null,
                        // 	"CLOSE_MAIL_TO_SEND": null,
                        // 	"COMAPNY_ID": "4cf119c1-727b-0cef-e053-650019ac76ec",
                        // 	"CREATED_BY": "36662323-ceac-46cc-e053-650aa8c02de3",
                        // 	"DATE_CREATED": "12/04/2017",
                        // 	"(SELECTCOMPANY_NAMEFROMFTC_COMPANYCOWHERECO.COMPANY_ID=QT.COMAPNY_ID)||'-'||QT.TASK_TITLE": "ג.ס. מאגרי מים בע\"מ - בעיה כללית",
                        // 	"TASK_COLOR": "green",
                        // 	"LAST_CHANGE": "יוסי פורטוגז - 12/04/17 12:04"
                        // }, {
                        // 	"TASK_ID": "4cf263a0-49b5-0fd4-e053-650019ac3859",
                        // 	"FORMAT_DATE": "12/04/17 12:04",
                        // 	"TITLE": " - בעיה כללית ()",
                        // 	"ORIGINAL_DESC": null,
                        // 	"TASK_DESC": "סיוע לנעמה בטעינת חשבונות פועלים בעסקים (לאחר התקנת ספיידר 2 בגרסת רו\"ח (\"צרה\")).",
                        // 	"(SELECTQTY.QA_TASK_TYPE_DESCFROMQA_TASKS_TYPESQTYWHEREQTY.QA_TASK_TYPE_ID=QT.STATE_TYPE)||'-'||(SELECTQC.TASK_CATEGORY_NAMEFROMQA_TASK_CATAGORYQCWHEREQC.TASK_CATEGORY_ID=QT.TASK_CATEGORY_ID)": "שיחה נכנסת - ",
                        // 	"CLOSE_DATE": null,
                        // 	"CLOSE_MAIL_TO_SEND": null,
                        // 	"COMAPNY_ID": null,
                        // 	"CREATED_BY": "36662323-ceac-46cc-e053-650aa8c02de3",
                        // 	"DATE_CREATED": "12/04/2017",
                        // 	"(SELECTCOMPANY_NAMEFROMFTC_COMPANYCOWHERECO.COMPANY_ID=QT.COMAPNY_ID)||'-'||QT.TASK_TITLE": " - בעיה כללית",
                        // 	"TASK_COLOR": "green",
                        // 	"LAST_CHANGE": "יוסי פורטוגז - 12/04/17 12:04"
                        // }, {
                        // 	"TASK_ID": "4cf24966-e2b8-45e8-e053-650019acf3a4",
                        // 	"FORMAT_DATE": "12/04/17 10:04",
                        // 	"TITLE": " - בעיה כללית ()",
                        // 	"ORIGINAL_DESC": null,
                        // 	"TASK_DESC": "סיוע לנעמה בהקמה (פיילוט עם תוכנת לירם שיהפוך את מוסא ג'ריס מלקוח תזרים ללקוח ראיית חשבון).",
                        // 	"(SELECTQTY.QA_TASK_TYPE_DESCFROMQA_TASKS_TYPESQTYWHEREQTY.QA_TASK_TYPE_ID=QT.STATE_TYPE)||'-'||(SELECTQC.TASK_CATEGORY_NAMEFROMQA_TASK_CATAGORYQCWHEREQC.TASK_CATEGORY_ID=QT.TASK_CATEGORY_ID)": "שיחה נכנסת - ",
                        // 	"CLOSE_DATE": null,
                        // 	"CLOSE_MAIL_TO_SEND": null,
                        // 	"COMAPNY_ID": null,
                        // 	"CREATED_BY": "36662323-ceac-46cc-e053-650aa8c02de3",
                        // 	"DATE_CREATED": "12/04/2017",
                        // 	"(SELECTCOMPANY_NAMEFROMFTC_COMPANYCOWHERECO.COMPANY_ID=QT.COMAPNY_ID)||'-'||QT.TASK_TITLE": " - בעיה כללית",
                        // 	"TASK_COLOR": "green",
                        // 	"LAST_CHANGE": "יוסי פורטוגז - 12/04/17 10:04"
                        // }];
                    } else {
                        $scope.$parent.appData.loaderAccMangPage = false;
                    }
                }
            }, 500)
        };
        $scope.goToTaskManager = function (taskId) {
            $scope.appData.qa_task_by_serach_run = true;
            $scope.appData.qa_task_by_serach = {
                companyName: '',
                companyHp: '',
                jiraBugId: '',
                taskId: taskId,
                taskNumber: '',
                officeName: '',
                desc: ''
            }
            $state.go('mainAccountants.taskManager');
        };
        $scope.goToNewApp = function () {
            window.open("https://adm1.bizibox.biz/login", "_blank")
            // window.open("https://bsecure.bizibox.biz/cfl/general?id=" + , "_self")
        }
        $scope.sort_by = function (predicate) {
            $scope.predicate = predicate;
            $scope.reverse = !$scope.reverse;
        };
        $scope.loadCompanyTable = function () {
            serverConnection.get_accountant_companies().then(function (res) {
                $scope.items = res;
                $scope.title = [];
                $scope.items.forEach(function (v, i) {
                    if (i == 0) {
                        $scope.title.push(v)
                    }
                });
                var element_count = 0;
                for (var e in $scope.title[0]) {
                    if ($scope.title[0].hasOwnProperty(e)) {
                        element_count++;
                    }
                }
                $scope.widthTdTh = (100 - element_count) / element_count;
                $scope.items.splice(0, 1);
                $scope.itemsSum = $scope.items.length;
                $scope.loaderAccBank = false;
                $scope.$parent.appData.loaderAccMangPage = false;
            }, function (error) {
                alert("קיימת שגיאה");
            });
        };
        $scope.setAsimon = function () {
            serverConnection.user_set_export_token().then(function (tokens) {
                $scope.loadAccMangPage();
            }, function (error) {
            });
        };

        $scope.add_office_privs_password = function () {
            $scope.showPopup('views/templates/add_office_privs_password.html?ver=3.74' + new Date().getTime(), 'showPopPasswordForm', true);
        };
        $scope.add_office_privs = function (showPopPasswordForm) {
            if (showPopPasswordForm.$valid) {
                $scope.hidePopup();
                serverConnection.add_office_privs({
                    userId:  $scope.appData.get_accountant_det.USER_ID
                }).then(function (tokens) {

                }, function (error) {
                });
            }
        };

        $scope.goToNewLink = function (a) {
            var userOnBehalf = JSON.stringify({
                companyToSelect: a.COMPANY_HP,
                id: localStorage.getItem('user_id'),
                name: (localStorage.getItem('userAccName') || localStorage.getItem('userAccNameUsers'))
            });
            var base = 'https://';
            if (location.origin.includes('adm-pre.bizibox.biz') || location.origin.includes('localhost')) {
                base += 'qa-adm1.bizibox.biz/cfl/general'
            } else if (location.origin.includes('adm-stg.bizibox.biz')) {
                base += 'stg-adm1.bizibox.biz/cfl/general'
            } else if (location.origin.includes('adm.bizibox.biz')) {
                base += 'adm1.bizibox.biz/cfl/general'
            } else if (location.origin.includes('stg-adm.bizibox.biz')) {
                base += 'stg-adm1.bizibox.biz/cfl/general'
            }else if (location.origin.includes('i-admin-dev-ng.bizibox.biz')) {
                base += ' i-adm1-dev-ng.bizibox.biz/cfl/general'
            }
            var url = base + "?companyToSelect=" + a.COMPANY_HP + "&id=" + localStorage.getItem('user_id') + "&name=" + (localStorage.getItem('userAccName') || localStorage.getItem('userAccNameUsers'));
            localStorage.setItem('userOnBehalf', userOnBehalf);
            window.open(url, "_blank");
        }
        $scope.$parent.refresh = function () {
            $scope.loadAccMangPage()
        };
        $rootScope.$on('refresh', function () {
            $scope.$parent.refresh();
        });
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
            $scope.showPopup('views/templates/mailerAccCards.html?ver=3.74', 'mailerPopup', false);
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
    }

    angular.module('controllers')
        .controller('managerAccCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', managerAccCtrl]);
}());


