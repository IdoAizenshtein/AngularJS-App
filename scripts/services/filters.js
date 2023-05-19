(function () {
    function shortDates(dates) {
        return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
    }

    function companyFilter() {
        return function (input, term) {

            if (!input || !term)
                return input;
            var obj = [];
            input.forEach(function (company) {
                if (company.companyName.indexOf(term) > -1 || ('' + company.companyHp).indexOf(term) > -1 || (company.full_name && company.full_name.indexOf(term) > -1))
                    obj.push(company);
            });

            return obj;

        };
    }

    function freeFilterTazrim() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }

            var obj = [];
            var letterMatch = new RegExp(term, 'i'), len = input.length;
            for (var i = 0; i < len; i++) {
                if (letterMatch.test(JSON.stringify(input[i]))) {
                    obj.push(input[i]);
                }
            }
            return obj;
        };
    }

    function freeFilterTazrimPay() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }

            var filtered = [];
            var data, len = input.length, termLen = term.length;
            for (var i = 0; i < len; i++) {
                data = input[i];
                for (var j = 0; j < termLen; j++) {
                    if (term[j].paymentActive == true) {
                        if (data.serchkey_cat_id == term[j].serchkey_cat_id) {
                            filtered.push(data);
                        }
                    }
                }
            }
            //    angular.forEach(input, function (item) {
            //    data = item;
            //    angular.forEach(term, function (t) {
            //        if (t.paymentActive == true) {
            //            if (data.serchkey_cat_id == t.serchkey_cat_id) {
            //                filtered.push(data);
            //            }
            //        }
            //    });
            //});
            return filtered;
        };
    }

    function freeFilterTazrimPeula() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }
            var filtered = [];
            var data, len = input.length, termLen = term.length;
            for (var i = 0; i < len; i++) {
                data = input[i];
                for (var j = 0; j < termLen; j++) {
                    if (term[j].peulaActive == true) {
                        if (data.trans_type_id == term[j].trans_type_id) {
                            filtered.push(data);
                        }
                    }
                }
            }
            return filtered;
        };
    }

    function includeFilter() {
        return function (input, field, termObj) {
            if (!input || !termObj || !field)
                return input;

            var allSelected = true;
            for (var key in termObj)
                if (!termObj[key])
                    allSelected = false;
            if (allSelected)
                return input;

            var obj = [];
            input.forEach(function (item) {
                for (var key in termObj) {
                    if (termObj[key]) { //show obj if equal
                        if (item[field] == key) {
                            obj.push(item);
                            break;
                        }
                    }
                }
            });

            return obj;
        };
    }

    function filtersAll() {
        return function (items, types) {
            if (!items || !types)
                return items;

            var filtered = [];
            var item = '';
            angular.forEach(items, function (item) {
                item = item;
                angular.forEach(types, function (t) {
                    if (t.payment_type_id == true) {
                        if (item.searchkey_cat_id == t.searchkey_cat_id) {
                            filtered.push(item);
                        }
                    }
                });

            });
            return filtered;
        };
    }

    function freeFilter() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }

            var obj = [];
            var letterMatch = new RegExp(term, 'i');
            input.forEach(function (v) {
                if (letterMatch.test(JSON.stringify(v))) {
                    obj.push(v);
                }
            });
            return obj;
        };
    }

    function freeFilterBankTable() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }

            var term = term.toString().toLowerCase();
            var obj = [];
            input.forEach(function (v) {
                if (
                    (v.due_date && v.due_date.toString().toLowerCase().indexOf(term) > -1)
                    ||
                    (v.itra && v.itra.toString().toLowerCase().indexOf(term) > -1)
                    ||
                    (v.next_total && v.next_total.toString().toLowerCase().indexOf(term) > -1)
                    ||
                    (v.target_name && v.target_name.toString().toLowerCase().indexOf(term) > -1)
                    ||
                    (v.asmachta && v.asmachta.toString().toLowerCase().indexOf(term) > -1)
                    ||
                    (v.trans_type_name && v.trans_type_name.toString().toLowerCase().indexOf(term) > -1)
                ) {
                    obj.push(v);
                }
                if (
                    (v.bank_account_number && term.length >= 4 && v.bank_account_number.toString().toLowerCase().indexOf(term) > -1)
                ) {
                    obj.push(v);
                }
            });
            return obj;
        };
    }

    function filterAcc() {
        return function (input, term) {
            if (term.company_account_id == '' || term.company_account_id == null) {
                return input;
            }
            if (term.company_account_id !== '') {
                var obj = [];
                input.forEach(function (v) {
                    if (v.company_account_id == term.company_account_id) {
                        obj.push(v);
                    }
                });
                return obj;
            }
        };
    }

    function freeFilterTrue() {
        return function (input, term) {
            if (!input || !term)
                return input;

            var obj = [];
            var letterMatch = new RegExp(term, 'i'), len = input.length;

            for (var i = 0; i < len; i++) {
                if (letterMatch.test(input[i].due_date) || letterMatch.test(input[i].company_account_nickname) || letterMatch.test(input[i].payment_type_name) || letterMatch.test(input[i].target_name) || letterMatch.test(input[i].next_total) || letterMatch.test(input[i].asmachta) || letterMatch.test(input[i].itra)) {
                    obj.push(input[i]);
                }
            }

            return obj;
        };
    }

    function freeFilterArray() {
        return function (input, term) {
            if (!input || !term) {
                var arra = [];
                input.forEach(function (item) {
                    item.peulot_tab.forEach(function (aaa) {
                        aaa.peoulot.forEach(function (bbb) {
                            bbb.searchObj = true;
                        });
                    });
                    arra.push(item);
                });
                return arra;
            } else {
                var arr = input;
                var letterMatch = new RegExp(term, 'i');
                var obj = [];
                arr.forEach(function (item) {
                    item.peulot_tab.forEach(function (aaa) {
                        aaa.peoulot.forEach(function (bbb) {
                            if (letterMatch.test(bbb.original_date) || letterMatch.test(bbb.trans_name) || letterMatch.test(bbb.hozaa) || letterMatch.test(bbb.original_total)) {
                                bbb.searchObj = true;
                            } else {
                                bbb.searchObj = false;
                            }
                        });
                    });
                    obj.push(item);
                });
                return obj;
            }
        };
    }

    function includeFilterArray() {
        return function (input, field, termObj) {

            if (!input || !termObj || !field)
                return input;
            var allSelected = true;
            for (var key in termObj)
                if (!termObj[key])
                    allSelected = false;
            if (allSelected)
                return input;

            var obj = [];
            input.forEach(function (item) {
                for (var key in termObj) {
                    if (termObj[key]) { //show obj if equal
                        if (item[field] == key) {
                            obj.push(item);
                        } else {
                            if (item.monthSum == true) {
                                obj.push(item);
                            }
                        }
                    }
                }

            });
            return obj;
        };
    }

    function addHeadersFilter() {
        return function (input) {

            if (!input)
                return input;
            var obj = [];
            var prev = null;
            var totalIncome = 0, totalExpenses = 0;
            input.forEach(function (item) {
                if (prev && !prev.headerItem && !item.headerItem) {
                    if (getMonth(prev.due_date) != getMonth(item.due_date)) { // New Month
                        // debugger;
                        var headerItem = JSON.parse(JSON.stringify(prev));
                        headerItem.headerItem = true;
                        headerItem.month = getMonth(prev.due_date);
                        headerItem.year = getYear(prev.due_date);
                        headerItem.totalIncome = totalIncome;
                        headerItem.totalExpenses = totalExpenses;
                        // obj.push(headerItem);
                        totalExpenses = 0;
                        totalIncome = 0;
                    }
                }
                if (item.ind_expence == 1) {
                    totalExpenses = totalExpenses + parseInt(item.next_total);
                } else if (item.ind_expence == 0) {
                    totalIncome = totalIncome + parseInt(item.next_total);
                }
                if (prev && !prev.headerItem)
                    obj.push(item);
                prev = item;
            });

            function getMonth(str) {
                return str.split("/")[1];
            };

            function getYear(str) {
                return str.split("/")[2];
            };

            return obj;
        };
    }

    function unique() {
        return function (items, filterOn) {
            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {}, newItems = [];

                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function (item) {
                    var valueToCheck, isDuplicate = false, len = newItems.length;

                    for (var i = 0; i < len; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            return items;
        };
    }

    function freeFilterEx() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }
            var obj = [];
            var letterMatch = new RegExp(term, 'i'), len = input.length;
            for (var i = 0; i < len; i++) {
                if (!input[i].title) {
                    if ((input[i].company_name !== null && letterMatch.test(input[i].company_name)) || (input[i].companyHp && input[i].companyHp !== null && letterMatch.test(input[i].companyHp.toString())) || (input[i].company_hp && input[i].company_hp !== null && letterMatch.test(input[i].company_hp.toString())) || (input[i].bank_account_id !== null && letterMatch.test(input[i].bank_account_id.toString()))) {
                        obj.push(input[i]);
                    }
                }
            }
            return obj;
        };
    }

    function freeFilterStatusEx() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }

            var filteredArr = [];
            input.forEach(function (v) {
                var filtered = [];
                v.data.forEach(function (v1) {
                    term.forEach(function (v2) {
                        if (v2.active && v2.type == v1.last_export_status) {
                            filtered.push(v1);
                        }
                    })
                })
                if (filtered.length > 0) {
                    v.data = filtered;
                    filteredArr.push(v)
                }
            })

            return filteredArr;
        };
    }

    function freeFilterCommentsEx() {
        return function (input, term) {
            if (!input || !term || term == 'all') {
                return input;
            }

            var filteredArr = [];
            input.forEach(function (v) {
                if (!v.title) {
                    if (term == '0' && v.explaind_desc !== null) {
                        filteredArr.push(v);
                    }
                    if (term == '1' && v.explaind_desc == null) {
                        filteredArr.push(v);
                    }
                }
            })

            return filteredArr;
        };
    }

    function startFrom() {
        return function (input, start) {
            if (input) {
                start = +start; //parse to int
                return input.slice(start);
            }
            return [];
        }
    }

    function myfilter() {
        return function (input, typesFilters) {
            if (!input || !typesFilters) {
                return input;
            }
            var filteredArr = [];
            input.forEach(function (v) {
                if (typesFilters.xFrom == true) {
                    filteredArr.push(v);
                }
                if (typesFilters.currmonthMaamPayCount == true) {
                    if (v.is_pay_maam == 1) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.xIs == true) {
                    if (v.sum_inv_cur_mon > 0) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.currmonthMaamPayCountNot == true) {
                    if (v.sum_inv_cur_mon == 0 && v.is_pay_maam == 1) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.export_status_big == true) {
                    if (v.last_export_status > 0 && v.last_export_status !== 2) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.status2 == true) {
                    if (v.last_export_status == 2) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.token_status == true) {
                    if (v.token_status > 0 && v.token_status < 100) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.statusbig100 == true) {
                    if (v.token_status > 100) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.export_status == true) {
                    if (v.last_export_status == 0) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.last_export_status_have == true) {
                    if (v.last_export_status >= 0 && v.last_export_status !== null) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.export_status_null == true) {
                    if (v.last_export_status == null || v.last_export_status == undefined) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.token_status_have == true) {
                    if (v.token_status >= 0 && v.token_status !== null) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.token_status_zero == true) {
                    if (v.token_status == 0) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.token_status_null == true) {
                    if (v.token_status == null || v.token_status == undefined) {
                        filteredArr.push(v);
                    }
                }


                if (typesFilters.sumCompanies == true) {
                    if (!v.title) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.status_have == true) {
                    if (!v.title) {
                        if (v.peulot_num > 0) {
                            filteredArr.push(v);
                        }
                    }
                }
                if (typesFilters.status_zero == true) {
                    if (!v.title) {
                        if (v.last_export_status && v.last_export_status !== null && v.last_export_status == 1) {
                            filteredArr.push(v);
                        }
                    }
                }

                if (typesFilters.exStatus == true) {
                    if (!v.title) {
                        if (v.last_export_status && v.last_export_status !== null && (v.last_export_status == 1 || v.last_export_status == 3  || v.last_export_status == 4 || v.last_export_status == 99)) {
                            filteredArr.push(v);
                        }
                    }
                }

                if (typesFilters.exStatusprocec == true) {
                    if (!v.title) {
                        if (v.last_export_status && v.last_export_status !== null && (v.last_export_status == 2 || v.last_export_status == 8)) {
                            filteredArr.push(v);
                        }
                    }
                }

                if (typesFilters.SPIDER_BEGIN_WORK_DATE == true) {
                    if (v.SPIDER_BEGIN_WORK_DATE !== null) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.BALANCE_LAST_UPDATED_DATE == true) {
                    var dates = new Date();

                    if (v.BALANCE_LAST_UPDATED_DATE !== null && (v.BALANCE_LAST_UPDATED_DATE == ("0" + (dates.getDate())).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear())) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.ORIGINAL_PAYMENT_DATE == true) {
                    if (v.IND_ZEFI === 0 && v.STATUS !== null && v.STATUS > 0 && (v.PAYMENT_DATE == v.ORIGINAL_PAYMENT_DATE)) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.ORIGINAL_PAYMENT_DATE_payment_date == true) {
                    if (v.STATUS === 0 && ((Math.abs(new Date(v.PAYMENT_DATE.replace(/^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/, "$2/$1/$3")) - new Date(v.ORIGINAL_PAYMENT_DATE.replace(/^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/, "$2/$1/$3"))) / 1000) / 86400) > 3) {
                        filteredArr.push(v);
                    }
                }
                if (typesFilters.INDZEFI == true) {
                    if (v.IND_ZEFI === 0) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.IND_ACCOUNTANT == true) {
                    if (v.IND_ACCOUNTANT === typesFilters.acc) {
                        filteredArr.push(v);
                    }
                }


                if (typesFilters.IND_BANK_ITEM == true) {
                    if (v.IND_BANK_ITEM === 1) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.IND_SRIKA_ITEM == true) {

                    if (v.IND_SRIKA_ITEM === 1) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.MISPAR_SHUROT_PKUDOT_YMN == true) {
                    if (v.IND_PKUDOT_YMN_ITEM === 1) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.IND_CARD_ITEM == true) {
                    if (v.IND_CARD_ITEM === 1) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.SUG_HIUV1 == true) {
                    if (v.SUG_HIUV == 1) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.SUG_HIUV2 == true) {
                    if (v.SUG_HIUV == 2) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.ITEM_PRICE_PER_OTHER_ITEMS_DIS == true) {
                    if (v.ITEM_PRICE_PER_OTHER_ITEMS_DIS > 0) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.TOTAL_SRIKA_PRICE == true) {
                    if (v.TOTAL_SRIKA_PRICE > 0) {
                        filteredArr.push(v);
                    }
                }

                if (typesFilters.typeHiuv !== undefined) {
                    if (typesFilters.typeHiuv == 0) {
                        filteredArr.push(v);
                    } else {
                        if (v.SUG_HIUV == typesFilters.typeHiuv) {
                            filteredArr.push(v);
                        }
                    }
                }

                if (typesFilters.allFiltersSett === true || typesFilters['allFiltersSett0'] === true) {
                    filteredArr.push(v);
                }

                if (typesFilters.typeFilterDate !== undefined) {
                    if (typesFilters.typeFilterDate === true) {
                        if (shortDates(v.DATE_CREATED) >= shortDates(typesFilters.from)
                            &&
                            shortDates(v.DATE_CREATED) <= shortDates(typesFilters.to)) {
                            filteredArr.push(v);
                        }
                    }
                }


            });
            return filteredArr;
        };
    }


    function typeListFilter() {
        return function (input, term) {
            if (!input || !term)
                return input;

            var obj = [];
            input.forEach(function (v) {
                if (v.trans_type_name.indexOf(term) > -1) {
                    obj.push(v);
                }
            });
            return obj;
        };
    }

    function filterListUserAcc() {
        return function (input, term) {
            if (!input || !term)
                return input;

            var obj = [];
            input.forEach(function (v) {
                if ((v.first_name && v.first_name.toString().indexOf(term) > -1)
                    || (v.last_name && v.last_name.toString().indexOf(term) > -1)
                    || ((v.accountant_office_name !== null) && (v.accountant_office_name.toString().indexOf(term) > -1))
                    || ((v.billing_account_name !== null) && (v.billing_account_name.toString().indexOf(term) > -1))
                    || (v.mail && v.mail.toString().indexOf(term) > -1)
                    || (v.fullName && v.fullName.toString().indexOf(term) > -1)) {
                    obj.push(v);
                }
            });
            return obj;
        };
    }


    function typeStatusFilterCards() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }

            var filteredArr = [];
            input.forEach(function (v) {
                term.forEach(function (v2) {
                    if (!v.title) {
                        if (v2.active && v2.type == v.last_export_status) {
                            filteredArr.push(v);
                        }
                    }
                })

            })
            return filteredArr;
        };
    }

    function typeStatusFilterMupa() {
        return function (input, indMupa_yes, indMupa_no) {
            if (!input) {
                return input;
            }

            var filteredArr = [];
            input.forEach(function (v) {
                if ((indMupa_yes && v.indMupa === 1) || (indMupa_no && v.indMupa !== 1)) {
                    filteredArr.push(v);
                }
            })

            return filteredArr;
        };
    }

    function typeStatusFilterCardsSoft() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }

            var filteredArr = [];
            input.forEach(function (v) {
                term.forEach(function (v2) {
                    if (!v.title) {
                        if (v2.active && v2.type == v.izu_source_program_id) {
                            filteredArr.push(v);
                        }
                    }
                })

            })
            return filteredArr;
        };
    }

    function filterCommentsCards() {
        return function (input, term) {
            if (!input || !term || term == 'all') {
                return input;
            }

            var filteredArr = [];
            input.forEach(function (v) {
                if (!v.title) {
                    if (term == '0' && v.explain_desc !== null) {
                        filteredArr.push(v);
                    }
                    if (term == '1' && v.explain_desc == null) {
                        filteredArr.push(v);
                    }
                }
            })

            return filteredArr;
        };
    }

    function filterSearchCards() {
        return function (input, term) {
            if (!input || !term)
                return input;

            var obj = [];
            input.forEach(function (v) {
                if (!v.title) {
                    if ((v.izu_cast_id !== null && v.izu_cast_id.indexOf(term) > -1) || (v.company_name !== null && v.company_name.indexOf(term) > -1) || (v.companyHp && v.companyHp !== null && v.companyHp.toString().indexOf(term) > -1) || (v.credit_card_nickname !== null && v.credit_card_nickname.indexOf(term) > -1) || (v.izu_account_cust_nickname !== null && v.izu_account_cust_nickname.indexOf(term) > -1)) {
                        obj.push(v);
                    }
                }
            });
            return obj;
        };
    }

    function filterSearchPoalim() {
        return function (input, term) {
            if (!input || !term)
                return input;

            var obj = [];
            input.forEach(function (v) {
                if ((v.COMPANY_NAME !== null && v.COMPANY_NAME.indexOf(term) > -1) || (v.ACCOUNT_NICKNAME !== null && v.ACCOUNT_NICKNAME.indexOf(term) > -1) || (v.BANK_SNIF_ID !== null && v.BANK_SNIF_ID.toString().indexOf(term) > -1) || (v.BANK_ACCOUNT_ID !== null && v.BANK_ACCOUNT_ID.toString().indexOf(term) > -1) || (v.BALANCE_LAST_UPDATED_DATE !== null && v.BALANCE_LAST_UPDATED_DATE.indexOf(term) > -1) || (v.CHECKPIC_LAST_UPDATE_DATE !== null && v.CHECKPIC_LAST_UPDATE_DATE.indexOf(term) > -1) || (v.SPIDER_BEGIN_WORK_DATE !== null && v.SPIDER_BEGIN_WORK_DATE.toString().indexOf(term) > -1)) {
                    obj.push(v);
                }
            });
            return obj;
        };
    }

    function filterListUserAccCom() {
        return function (input, term) {
            if (!input || !term)
                return input;

            var obj = [];
            input.forEach(function (v) {
                if (v.companyName.indexOf(term) > -1 || (v.full_name && v.full_name.indexOf(term) > -1) || (v.companyHp && v.companyHp.toString().indexOf(term) > -1)) {
                    obj.push(v);
                }
            });
            return obj;
        };
    }

    function filterTrial() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }
            var filteredArr = [];
            input.forEach(function (v) {
                var filtered = [];
                v.level_1.level_2.forEach(function (v1) {
                    if (
                        v1.name.toString().indexOf(term) > -1
                        || (v1.number !== undefined) && v1.number.toString().indexOf(term) > -1
                        || (v1.sum !== undefined) && v1.sum.toString().indexOf(term) > -1
                        || (v1.percentage !== undefined) && v1.percentage.toString().indexOf(term) > -1
                        || (v1.target_supp_desc !== undefined) && v1.target_supp_desc.toString().indexOf(term) > -1
                        || (v1.alert !== undefined) && v1.alert.toString().indexOf(term) > -1
                        || (v1.current_balance !== undefined) && v1.current_balance.toString().indexOf(term) > -1) {
                        v1.rowshow = true;
                        filtered.push(v1);
                    }
                })
                if (filtered.length > 0) {
                    v.tableShow = true;
                    v.rowshow = true;
                    v.level_1.level_2 = filtered;
                    filteredArr.push(v)
                }
            })
            return filteredArr;
        };
    }

    function freeFilterMatchTypesOfPays() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }
            var filtered = [];
            var data, len = input.length, termLen = term.length;
            for (var i = 0; i < len; i++) {
                data = input[i];
                for (var j = 0; j < termLen; j++) {
                    if (term[j].paymentActive == true) {
                        if (data.target_payment_type_id !== undefined && (data.target_payment_type_id == term[j].target_payment_type_id)) {
                            filtered.push(data);
                        }
                    }
                }
            }
            return filtered;
        };
    }

    function freeFilterMatchSums() {
        return function (input, term) {
            if (!input || !term) {
                return input;
            }
            var filtered = [];
            var data, len = input.length, termLen = term.length;
            for (var i = 0; i < len; i++) {
                data = input[i];
                for (var j = 0; j < termLen; j++) {
                    if (term[j].paymentActive == true) {
                        if (data.target_total !== undefined && (data.target_total == term[j].val)) {
                            filtered.push(data);
                        }
                    }
                }
            }
            return filtered;
        };
    }

    function freeFilterMatchRowsTitle() {
        return function (input) {
            if (!input) {
                return input;
            }
            var filtered = [];
            var data, len = input.length, ind = 0, indx = 0;
            for (var i = 0; i < len; i++) {
                data = input[i];
                if (data.valType == 0) {
                    filtered.push(data);
                } else {
                    if (data.ind_hov_avar == true) {
                        if (ind == 0) {
                            filtered.push({
                                title: true,
                                text: "פעולות שטרם הופקדו/נפרעו"
                            });
                            ind = 1;
                        }
                        filtered.push(data);
                    }
                    if (data.ind_hov_avar == false) {
                        if (indx == 0) {
                            filtered.push({
                                title: true,
                                text: "פעולות צפויות עתידיות"
                            });
                            indx = 1;
                        }
                        filtered.push(data);
                    }
                }
            }
            return filtered;
        };
    }

    function filterSearchBill() {
        return function (input, term) {
            if (!input || !term)
                return input;

            var obj = [];
            input.forEach(function (v) {
                if ((v.BILLING_ACCOUNT_COMPANY_NAME !== null && v.BILLING_ACCOUNT_COMPANY_NAME.toString().indexOf(term) > -1)
                    ||
                    (v.BILLING_ACCOUNT_HP !== null && v.BILLING_ACCOUNT_HP.toString().indexOf(term) > -1)
                    ||
                    (v.BILLING_ACCOUNT_NAME !== null && v.BILLING_ACCOUNT_NAME.toString().indexOf(term) > -1)
                    ||
                    (v.BILLING_ACCOUNT_EMAIL !== null && v.BILLING_ACCOUNT_EMAIL.toString().indexOf(term) > -1)
                    ||
                    (v.DESCRIPTION !== null && v.DESCRIPTION.toString().indexOf(term) > -1)
                    ||
                    (v.PAYMENT_DATE !== null && v.PAYMENT_DATE.toString().indexOf(term) > -1)
                    ||
                    (v.PAYMENT_TYPE_ID !== null && v.PAYMENT_TYPE_ID.toString().indexOf(term) > -1)
                    ||
                    (v.SUMTOBILL !== null && v.SUMTOBILL.toString().indexOf(term) > -1)
                    ||
                    (v.STATUS_DESC !== null && v.STATUS_DESC.toString().indexOf(term) > -1)
                    ||
                    (v.EXTSP_CARDNUMBER5 !== null && v.EXTSP_CARDNUMBER5.toString().indexOf(term) > -1)) {
                    obj.push(v);
                }
            });
            return obj;
        };
    }


    function filterSearchChecks() {
        return function (input, term) {
            if (!input || !term)
                return input;

            var obj = [];
            input.forEach(function (v) {
                if (
                    (v.total !== null && v.total.toString().indexOf(term || '') > -1)
                    ||
                    (v.payment_desc !== null && v.payment_desc.toString().indexOf(term || '') > -1)
                    ||
                    (v.cheque_no !== null && v.cheque_no.toString().indexOf(term || '') > -1)
                ) {
                    obj.push(v);
                }
            });
            return obj;
        };
    }

    function filterSearchBillSelect() {
        return function (input, term) {
            if (!input || !term)
                return input;

            var obj = [];
            input.forEach(function (v) {
                if (v.IND_ACCOUNTANT == parseFloat(term)) {
                    obj.push(v);
                }
            });
            return obj;
        };
    }

    angular.module('services')
        .filter({
            'companyFilter': companyFilter,
            'freeFilterTazrim': freeFilterTazrim,
            'freeFilterTazrimPay': freeFilterTazrimPay,
            'freeFilterTazrimPeula': freeFilterTazrimPeula,
            'includeFilter': includeFilter,
            'filtersAll': filtersAll,
            'freeFilter': freeFilter,
            'freeFilterBankTable': freeFilterBankTable,
            'filterAcc': filterAcc,
            'freeFilterTrue': freeFilterTrue,
            'freeFilterArray': freeFilterArray,
            'includeFilterArray': includeFilterArray,
            'addHeadersFilter': addHeadersFilter,
            'unique': unique,
            'freeFilterEx': freeFilterEx,
            'freeFilterStatusEx': freeFilterStatusEx,
            'freeFilterCommentsEx': freeFilterCommentsEx,
            'startFrom': startFrom,
            'myfilter': myfilter,
            'typeListFilter': typeListFilter,
            'filterListUserAcc': filterListUserAcc,
            'typeStatusFilterCards': typeStatusFilterCards,
            'typeStatusFilterCardsSoft': typeStatusFilterCardsSoft,
            'typeStatusFilterMupa': typeStatusFilterMupa,
            'filterCommentsCards': filterCommentsCards,
            'filterSearchCards': filterSearchCards,
            'filterSearchPoalim': filterSearchPoalim,
            'filterListUserAccCom': filterListUserAccCom,
            'filterTrial': filterTrial,
            'freeFilterMatchTypesOfPays': freeFilterMatchTypesOfPays,
            'freeFilterMatchSums': freeFilterMatchSums,
            'freeFilterMatchRowsTitle': freeFilterMatchRowsTitle,
            'filterSearchBill': filterSearchBill,
            'filterSearchChecks': filterSearchChecks,
            'filterSearchBillSelect': filterSearchBillSelect
        });
}());

