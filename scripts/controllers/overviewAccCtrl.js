(function () {
    function overviewAccCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q) {
        $scope.$location = $location;
        $scope.$state = $state;
        $scope.utils = utils;
        $scope.appData = AppData;
        $scope.accoConversions = accoConversions;
        $scope.months = utils.monthNames();
        $scope.bankId = $state.params.bank;
        $scope.date = new Date();
        $scope.shownGraph = {company_account_nickname: 'כל הבנקים'};
        $scope.shownGraphIndex = 0;
        $scope.shownGraphIndexSelected = '0';
        $scope.pieInd = 3;
        $scope.activePie = 3;
        if ($scope.appData.selectTimeExporter == undefined) {
            $scope.appData.selectTimeExporter = "0";
        }
        if ($scope.bankId) {
            var index;
            for (var i = 0; i < $scope.appData.selectedCompany.accounts.bank_account_list.length; i++) {
                if ($scope.appData.selectedCompany.accounts.bank_account_list[i].company_account_id)
                    index = i;
            }
        }
        $scope.buttonActive = true;
        $scope.selectActive = true;
        $scope.showPrevButton = false;
        $scope.spinnerNext = false;
        $scope.spinnerPrev = false;
        $scope.datesDef = function () {
            var byMonth;
            var byYear;
            if ($state.current.name == 'overviewAcc.statistics') {
                $scope.years = utils.years(10);
                if ($scope.appData.selectedCompany.default_account_month) {
                    var default_account_month = $scope.appData.selectedCompany.default_account_month;
                    byMonth = parseInt(default_account_month.toString().substring(4, 6)) - 1;
                    byYear = parseInt(default_account_month.toString().substring(0, 4));
                } else {
                    var date = new Date();
                    date.setFullYear(date.getFullYear());
                    date.setMonth(date.getMonth() - 2);
                    date.setDate(date.getDate());
                    byMonth = date.getMonth();
                    byYear = date.getFullYear();
                }
            } else {
                $scope.years = utils.yearsKsafim(3);

                if ($scope.date.getMonth() !== 0) {
                    if ($scope.date.getDate() == 1) {
                        byMonth = $scope.date.getMonth() - 1;
                    } else {
                        byMonth = $scope.date.getMonth();
                    }
                    byYear = $scope.date.getFullYear();
                } else {
                    if ($scope.date.getDate() == 1) {
                        byMonth = 11;
                        byYear = $scope.date.getFullYear() - 1;
                    } else {
                        byMonth = $scope.date.getMonth();
                        byYear = $scope.date.getFullYear();
                    }
                }

            }
            $scope.firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
            $scope.lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);
            $scope.dateFilter = {
                type: "0",
                byMonth: byMonth,
                byYear: byYear,
                byOnlyYear: $scope.date.getFullYear(),
                fromMonth: $scope.firstDayOfYear.getMonth(),
                fromYear: $scope.firstDayOfYear.getFullYear(),
                toMonth: $scope.lastDayOfYear.getMonth(),
                toYear: $scope.lastDayOfYear.getFullYear()
            };
        };
        $scope.colorsNegative = ['#BB404C', '#EC3C66', '#F06485', '#ED4A4A', '#FD6935', '#FD9C35', '#FDC430', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
        $scope.colorsPositive = ['#15708B', '#1287AA', '#19A9C4', '#30C7C2', '#4FA374', '#59BE85', '#69D776', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
        $scope.colorsBanks = ['#1387a9', '#19a9c5', '#23c5e5', '#30C7C2', '#4FA374', '#59BE85', '#69D776', '#DADADA'];
        $scope.loaderSkiraAccMess = true;
        $scope.loaderSkiraAccTitle = true;
        $scope.loaderSkiraAccExports = true;
        $scope.loaderSkiraAccGraph = true;
        $scope.loaderSkiraAccGraphPay = true;
        $scope.loaderSkiraKsafimGraph = true;
        $scope.loaderSkiraKsafimGraphPay = true;
        $scope.getListAccor = 1;
        $scope.editInputs = true;
        $scope.loaderLoadDetailsCompany = true;
        $scope.init = function () {

        };
        $scope.selectCompany = function (company) {
            $scope.getCompaniesThisStrorage(company);
            $scope.$broadcast('widthChanged');
            $scope.loadCompanysForThis();
            $scope.userGetbankmatchimplist();

            if ($state.current.name == 'overviewAcc.statistics') {
                $scope.accTab();
            } else if ($state.current.name == 'overviewAcc.ksafim') {
                $scope.ksafimTab();
            } else if ($state.current.name == 'overviewAcc.businessInfo') {
                $scope.company_det()
            }
            $scope.compExpGetList();
            $scope.loadMessAccSkira();
        };
        $scope.$watch('$state.current.name', function (newValue, oldValue) {
            if (newValue && (newValue !== oldValue)) {
                if (newValue == "overviewAcc.statistics") {
                    $scope.accTab();
                }
                if (newValue == "overviewAcc.ksafim") {
                    $scope.ksafimTab();
                }
                if (newValue == "overviewAcc.businessInfo") {
                    $scope.company_det();
                }
            }
        });

        $scope.accTab = function () {
            if ($scope.appData.selectedCompany) {
                $scope.getCompaniesThisStrorage();
            }
            $scope.getCompanyAccounts().then(function (response) {
                $scope.appData.selectedCompany.accounts = response;
                $scope.datesDef();
                $scope.appData.redErrorFilterType = false;
                $scope.pieInd = 3;
                $scope.activePie = 3;
                $scope.getWithdrawals($scope.pieInd);
                $scope.skiraListType();
                $scope.getListAccor = 1;
                $scope.getAccList();
            });
        };
        $scope.ksafimTab = function () {
            if ($scope.appData.selectedCompany) {
                $scope.getCompaniesThisStrorage();
            }
            $scope.datesDef();
            $scope.appData.redErrorFilterType = false;
            $scope.pieInd = 0;
            $scope.activePie = 0;
            $scope.getCompanyAccounts().then(function (response) {
                $scope.appData.selectedCompany.accounts = response;
                var from = $scope.appData.selectedCompany.accounts.bank_account_list[0].balance_last_update_date;
                for (var i = 1; i < $scope.appData.selectedCompany.accounts.bank_account_list.length; i++) {
                    var d = $scope.appData.selectedCompany.accounts.bank_account_list[i].balance_last_update_date;
                    if (compareDates(from, d) < 0)
                        from = d;
                }

                function compareDates(d1, d2) {
                    var sum1 = new Date();
                    sum1.setFullYear(d1.split('/')[2]);
                    sum1.setMonth(d1.split('/')[1]);
                    sum1.setDate(d1.split('/')[0]);

                    var sum2 = new Date();
                    sum2.setFullYear(d2.split('/')[2]);
                    sum2.setMonth(d2.split('/')[1]);
                    sum2.setDate(d2.split('/')[0]);
                    return sum1 - sum2;
                };

                function addWeek(week) {
                    var dates = new Date();
                    dates.setFullYear(parseInt(week.toString().split('/')[2]));
                    dates.setMonth(parseInt(week.toString().split('/')[1]) - 1);
                    dates.setDate(parseInt(week.toString().split('/')[0]) + 10);

                    return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear()
                };

                var dateFrom = from.split("/");
                var dates = new Date(parseInt(dateFrom[2]), parseInt(dateFrom[1]) - 1, parseInt(dateFrom[0]) - 2);
                var from = ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear();

                $scope.appData.balanceLastUpdateDateForGraph = from;

                $scope.appData.nextAndPrevGraphFrom = from;
                $scope.appData.nextAndPrevGraphTo = addWeek(from);

                $scope.getWithdrawals($scope.pieInd);
                $scope.getTazrim(from, addWeek(from));
                $scope.accountsWithAll = [{company_account_nickname: 'כל הבנקים'}].concat($scope.appData.selectedCompany.accounts.bank_account_list);
                $scope.getListAccor = 2;
                $scope.getKsafimData();
            });
        };
        $scope.getAccList = function (forced) {
            if (!$scope.appData.selectedCompany.accListData || forced) {
                serverConnection.getAccList($scope.appData.selectedCompany.companyId).then(function (response) {
                    $scope.appData.selectedCompany.accListData = response;
                }, function (error) {

                });
            }
        };
        $scope.getKsafimData = function (forced) {
            if (!$scope.appData.selectedCompany.ksafimData || forced) {
                $scope.loaderKsafimData = true;

                var id = null;
                if ($scope.shownGraphIndex !== 0) {
                    id = $scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1].company_account_id;
                }
                serverConnection.getKsafimData({
                    company_id: $scope.appData.selectedCompany.companyId,
                    company_account_id: id
                }).then(function (response) {
                    $scope.appData.selectedCompany.ksafimData = response;
                    $scope.maazanSum = +$scope.appData.selectedCompany.ksafimData.ccardPeulotatidData.total
                        + $scope.appData.selectedCompany.ksafimData.outCheques.total
                        + $scope.appData.selectedCompany.ksafimData.outLoans.total
                        + $scope.appData.selectedCompany.accounts.total_opening_balance
                        + $scope.appData.selectedCompany.ksafimData.solekPeulotatidData.total
                        + $scope.appData.selectedCompany.ksafimData.inCheques.total
                        + $scope.appData.selectedCompany.ksafimData.outDeposits.total;

                    $scope.loaderKsafimData = false;
                }, function (error) {
                });
            }
        };
        if (!$scope.appData.indexGraphTazrimGeneral) {
            $scope.appData.indexGraphTazrimGeneral = {
                from: 0,
                to: 7
            }
        }
        $scope.graphSett = function () {
            $scope.appData.todayGraph = null;
            var xAxis = [], yLabel = {totals: []}, credit_facility = [], tooltipData = [];
            for (var i = 0; i < $scope.appData.selectedCompany.tazrim.length; i++) {

                var dateSplit = $scope.appData.selectedCompany.tazrim[i].day_id.split("/");

                var datesToday = new Date();
                var dateToday = ("0" + (datesToday.getDate())).slice(-2) + '/' + ("0" + (datesToday.getMonth() + 1)).slice(-2) + '/' + datesToday.getFullYear().toString();
                if (dateToday == $scope.appData.selectedCompany.tazrim[i].day_id) {
                    xAxis.push("היום");
                    $scope.appData.todayGraph = i;
                } else {
                    xAxis.push(dateSplit[0] + "/" + dateSplit[1]);
                }

                credit_facility.push($scope.appData.selectedCompany.accounts.total_credit_facility);
                tooltipData.push([]);
                for (var j = 0; j < $scope.appData.selectedCompany.tazrim[i].rows.length; j++) {
                    if ($scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id == null) {
                        yLabel.totals.push($scope.appData.selectedCompany.tazrim[i].rows[j].total_itra);
                    } else {
                        tooltipData[i].push({
                            value: $scope.appData.selectedCompany.tazrim[i].rows[j].total_itra,
                            name: $scope.getNickname($scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id)
                        });
                        yLabel[$scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id] = yLabel[$scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id] || [];
                        yLabel[$scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id].push($scope.appData.selectedCompany.tazrim[i].rows[j].total_itra);
                    }
                }
            }

            $scope.appData.selectedCompany.tazrim.xAxis = xAxis;
            $scope.appData.selectedCompany.tazrim.yLabel = yLabel;
            $scope.appData.selectedCompany.tazrim.credit_facility = credit_facility;
            $scope.appData.selectedCompany.tazrim.tooltipData = tooltipData;
            $scope.tazrimChanged();
        }
        $scope.getTazrim = function (fromDate, tillDate, nav) {
            if (!$scope.appData.selectedCompany.tazrim || nav) {
                serverConnection.getTazrim({
                    company_id: $scope.appData.selectedCompany.companyId,
                    date_from: fromDate,
                    date_till: tillDate
                }).then(function (response) {
                    if (!nav) {
                        $scope.appData.tazrimGraphMainGeneral = angular.copy(response);
                        $scope.appData.selectedCompany.tazrim = response.slice($scope.appData.indexGraphTazrimGeneral.from, $scope.appData.indexGraphTazrimGeneral.to);
                        $scope.graphSett();
                    } else {
                        $scope.spinnerPrev = false;
                        $scope.spinnerNext = false;
                        $scope.appData.tazrimGraphMainGeneralNew = angular.copy(response);
                    }
                }, function (error) {
                });
            } else {
                $scope.graphSett();
            }
        };
        $scope.getNickname = function (companyId) {
            var response = '';
            $scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (account) {
                if (account.company_account_id == companyId)
                    response = account.company_account_nickname;
            });
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
        $scope.updateSelection = function (forced) {
            $scope.shownGraphIndex = parseInt(forced);
            $scope.shownGraphIndexSelected = forced.toString();
            $scope.loaderSkiraKsafimGraph = true;

            if ($scope.shownGraphIndex == 0) {
                if ($scope.appData.adminSoft) {
                    $scope.showTotal(true);
                }
                $scope.getKsafimData(true);
                $scope.getWithdrawals($scope.pieInd);
            } else {
                if ($scope.appData.adminSoft) {
                    $scope.showSpecific([$scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1]], $scope.shownGraphIndex - 1);
                }
                $scope.getKsafimData(true);
                $scope.getWithdrawals($scope.pieInd);
            }
        };

        $scope.tazrimChanged = function (data) {
            if ($scope.bankId) {
                var index;
                for (var i = 0; i < $scope.appData.selectedCompany.accounts.bank_account_list.length; i++) {
                    if ($scope.appData.selectedCompany.accounts.bank_account_list[i].company_account_id)
                        index = i;
                }
                if ($scope.appData.adminSoft) {
                    $scope.showSpecific([index, {company_account_id: $scope.bankId}]);
                }
            } else {
                if ($scope.appData.adminSoft) {
                    if ($scope.shownGraphIndex == 0) {
                        $scope.showTotal(true);
                    } else {
                        $scope.showSpecific([$scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1]], $scope.shownGraphIndex - 1);
                    }
                }
            }
        }

        $scope.showTotal = function (notify) {
            var serData = Math.min.apply(Math, $scope.appData.selectedCompany.tazrim.yLabel.totals);
            var lineGraph = $scope.appData.selectedCompany.tazrim.credit_facility[0];
            if (lineGraph !== undefined) {
                $scope.appData.hideGraph = false;
                if (serData < lineGraph) {
                    var valueMin = serData;
                } else {
                    var valueMin = (serData - (Math.abs(serData) / 5));
                }

                var serDataMax = Math.max.apply(Math, $scope.appData.selectedCompany.tazrim.yLabel.totals);
                var valueMax = serDataMax + (Math.abs(serDataMax) / 5);

                console.log('lineGraph :' + lineGraph);
                console.log('valueMin :' + serData);
                console.log('valueMax :' + serDataMax);
                console.log('SetvalueMin :' + valueMin);
                console.log('SetvalueMax :' + valueMax);

                var circleEmpty = {
                    radius: 6,
                    fillColor: "#eaeaea",
                    lineWidth: 2,
                    lineColor: "#1387a9",
                    states: {
                        hover: {
                            radius: 9,
                            fillColor: '#eaeaea',
                            lineColor: '#1387a9',
                            lineWidth: 2
                        }
                    }
                };
                var x = 0;
                var len = $scope.appData.selectedCompany.tazrim.yLabel.totals.length;
                var xData = [];
                while (x < len) {
                    if ($scope.appData.todayGraph == null || (x > $scope.appData.todayGraph)) {
                        xData.push({
                            y: Math.round($scope.appData.selectedCompany.tazrim.yLabel.totals[x]),
                            marker: circleEmpty
                        })
                    } else {
                        xData.push({y: Math.round($scope.appData.selectedCompany.tazrim.yLabel.totals[x])})
                    }
                    x++
                }
                var lineGraphPosition;
                if ($scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length < 6) {
                    lineGraphPosition = 120;
                }
                if ($scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length > 5 && $scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length < 8) {
                    lineGraphPosition = 150;
                }
                if ($scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length > 7 && $scope.appData.selectedCompany.tazrim.credit_facility[0].toString().length < 12) {
                    lineGraphPosition = 170;
                }
                console.log($scope.appData.todayGraph)
                $scope.chartData = {
                    valueMin: valueMin,
                    valueMax: valueMax,
                    zoomType: 'xy',
                    animation: false,
                    spacingTop: 55,
                    spacingLeft: 0,
                    spacingRight: 0,
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 0,
                    legend: false,
                    //spacing: [0,0,0,0],
                    xAxis: $scope.appData.selectedCompany.tazrim.xAxis,
                    yLabel: 'סה״כ בש״ח',
                    yPLotLines: [{ // mark the weekend
                        color: '#ec3b65',
                        width: 2,
                        value: $scope.appData.selectedCompany.tazrim.credit_facility[0],
                        dashStyle: 'Solid',
                        label: {
                            text: ' אשראי ' + accoConversions.getParseComma($scope.appData.selectedCompany.tazrim.credit_facility[0]),
                            align: 'left',
                            x: lineGraphPosition
                        }
                    }],
                    data: [{
                        zoneAxis: 'x',
                        zones: [{
                            value: $scope.appData.todayGraph == null ? 0 : $scope.appData.todayGraph,
                            color: '#1387a9'
                        }, {
                            color: '#1387a9',
                            dashStyle: 'dot'
                        }],
                        data: xData,
                        name: 'Totals',
                        cursor: 'pointer'
                    }],
                    title: ' ',
                    subtitle: ' ',
                    tooltip: function () {
                        var str = '';
                        if ($scope.appData.selectedCompany.accounts.bank_account_list.length < 4) {
                            str += '<div class="top-chart-tooltip">';
                            str += '<div class="inner-bar-chart">';
                            var maxHeight = 100;
                            var max = [],
                                lenPoint = $scope.appData.selectedCompany.tazrim.tooltipData[this.point.x].length;
                            for (var i = 0; i < lenPoint; i++) {
                                max.push($scope.appData.selectedCompany.tazrim.tooltipData[this.point.x][i].value);
                            }
                            max = Math.max.apply(null, max);
                            for (var i = 0; i < lenPoint; i++) {
                                var val = $scope.appData.selectedCompany.tazrim.tooltipData[this.point.x][i].value;
                                if (Math.abs(max) < Math.abs(val)) {
                                    val = max;
                                    max = val;
                                }
                                var barHeight = ((Math.abs(val) / Math.abs(max)) * 100) ? ((Math.abs(val) / Math.abs(max)) * 100) : 0;
                                var barColor = '#1387a9';
                                str += '<div style="height:' + barHeight + '%;background-color:' + barColor + '"></div>';
                            }
                            str += '</div>';
                            str += '<div class="inner-legend">';
                        } else {
                            str += '<div class="top-chart-tooltip widthAll">';
                            str += '<div class="inner-legend widthAll">';
                        }

                        if ($scope.appData.selectedCompany.accounts.bank_account_list.length > 1) {
                            str += '<div><div><h2>כל הבנקים</h2><div class="total"><span>&#8362;</span>' + $scope.getTotal(Math.floor(this.y)) + '</div></div>';
                        }
                        var lenPointX = $scope.appData.selectedCompany.tazrim.tooltipData[this.point.x].length;
                        for (var i = 0; i < lenPointX; i++) {
                            str += '<div><div class="name">' + $scope.appData.selectedCompany.tazrim.tooltipData[this.point.x][i].name + '</div><div class="val"><span>&#8362;</span>' + $scope.getTotal(Math.floor($scope.appData.selectedCompany.tazrim.tooltipData[this.point.x][i].value)) + '</div></div>';
                        }
                        str += '</div></div>';

                        return str;
                    }
                };
            } else {
                $scope.appData.hideGraph = true;
            }


            $scope.loaderSkiraKsafimGraph = false;

        };
        $scope.showSpecific = function (data, notify) {
            if (!$scope.appData.selectedCompany.tazrim)
                return;

            var tooltipData = [];

            if (data.length == 1) {
                var lengthArray = 0;
                var lineGraph = data[0].credit_facility;
            } else {
                var lengthArray = 1;
                var lineGraph = data[1].credit_facility;
            }
            for (var i = 0; i < $scope.appData.selectedCompany.tazrim.length; i++) {
                tooltipData.push([]);
                for (var j = 0; j < $scope.appData.selectedCompany.tazrim[i].rows.length; j++) {
                    if ($scope.appData.selectedCompany.tazrim[i].rows[j].company_account_id == data[lengthArray].company_account_id) {
                        var obj = $scope.appData.selectedCompany.tazrim[i].rows[j];
                        if (obj.total_hacnasot.peoulot) {
                            for (var k = 0; k < obj.total_hacnasot.peoulot.length; k++) {
                                tooltipData[i].push({
                                    name: obj.total_hacnasot.peoulot[k].trans_name,
                                    value: obj.total_hacnasot.peoulot[k].hachnasa,
                                    ind: 0
                                });
                            }
                        }
                        if (obj.total_hozaot.peoulot) {
                            for (var k = 0; k < obj.total_hozaot.peoulot.length; k++) {
                                tooltipData[i].push({
                                    name: obj.total_hozaot.peoulot[k].trans_name,
                                    value: obj.total_hozaot.peoulot[k].hozaa,
                                    ind: 1
                                });
                            }
                        }
                    }
                }
            }
            var serData = Math.min.apply(Math, $scope.appData.selectedCompany.tazrim.yLabel[data[lengthArray].company_account_id]);

            if (serData < lineGraph) {
                var valueMin = serData;
            } else {
                var valueMin = (serData - (Math.abs(serData) / 5));
            }
            var dataGraph = $scope.appData.selectedCompany.tazrim.yLabel[data[lengthArray].company_account_id];
            if (dataGraph !== undefined) {
                $scope.appData.hideGraph = false;
                var serDataMax = Math.max.apply(Math, $scope.appData.selectedCompany.tazrim.yLabel[data[lengthArray].company_account_id]);
                var valueMax = serDataMax + (Math.abs(serDataMax) / 5);


                var circleEmpty = {
                    fillColor: '#eaeaea',
                    lineWidth: 2,
                    lineColor: null
                };
                var x = 0;
                var len = dataGraph.length;
                var xData = [];
                while (x < len) {
                    if ($scope.appData.todayGraph !== null && (x > $scope.appData.todayGraph)) {
                        xData.push({
                            y: Math.round(dataGraph[x]),
                            marker: circleEmpty
                        })
                    } else {
                        xData.push({y: Math.round(dataGraph[x])})
                    }
                    x++
                }
                var lineGraphPosition;
                if (lineGraph.toString().length < 6) {
                    lineGraphPosition = 120;
                }
                if (lineGraph.toString().length > 5 && lineGraph.toString().length < 8) {
                    lineGraphPosition = 150;
                }
                if (lineGraph.toString().length > 7 && lineGraph.toString().length < 12) {
                    lineGraphPosition = 170;
                }


                console.log('lineGraph :' + lineGraph);
                console.log('valueMin :' + serData);
                console.log('valueMax :' + serDataMax);

                console.log('SetvalueMin :' + valueMin);
                console.log('SetvalueMax :' + valueMax);


                $scope.chartData = {
                    valueMin: valueMin,
                    valueMax: valueMax,
                    zoomType: 'xy',
                    animation: false,
                    spacingTop: 55,
                    spacingLeft: 0,
                    spacingRight: 0,
                    borderColor: '#fff',
                    borderWidth: 0,
                    borderRadius: 0,
                    legend: false,
                    xAxis: $scope.appData.selectedCompany.tazrim.xAxis,
                    yLabel: 'סה״כ בש״ח',
                    yPLotLines: [{
                        color: '#ec3b65',
                        width: 2,
                        value: lineGraph,
                        dashStyle: 'Solid',
                        label: {
                            text: 'מסגרת אשראי  ' + accoConversions.getParseComma(lineGraph),
                            align: 'left',
                            x: lineGraphPosition
                        }
                    }],
                    data: [{
                        zoneAxis: 'x',
                        zones: [{
                            value: $scope.appData.todayGraph,
                            color: '#1387a9'
                        }, {
                            color: '#1387a9',
                            dashStyle: 'dot'
                        }],
                        data: xData,
                        name: 'Totals',
                        cursor: 'pointer',
                        lineWidth: 2,
                        color: '#1387a9',
                        states: {
                            hover: {
                                lineWidth: 2,
                                color: '#1387a9'
                            }
                        }
                    }],
                    title: ' ',
                    subtitle: ' ',
                    tooltip: function () {
                        var str = '<div class="chart-tooltip-table"><table><tbody>';
                        var len = tooltipData[this.point.x].length;
                        for (var i = 0; i < len; i++) {
                            var clss = (tooltipData[this.point.x][i].ind == 1) ? 'expense' : 'income';
                            str += '<tr><td><div>' + tooltipData[this.point.x][i].name + '</div></td><td class="' + clss + '"><div><span>&#8362;</span>' + $scope.getTotal(tooltipData[this.point.x][i].value) + '</div></td></tr>';
                        }
                        str += '</table></tbody></div>';
                        return (tooltipData[this.point.x].length > 0) ? str : 'אין נתונים';
                    }
                };

            } else {
                $scope.appData.hideGraph = true;
            }
            $scope.loaderSkiraKsafimGraph = false;
        };
        $scope.loadMessAccSkira = function () {
            $scope.loaderSkiraAccMess = true;
            serverConnection.dataReportCompositeId($scope.appData.selectedCompany.companyId).then(function (response) {
                $scope.appData.messAccSkira = response.activity;

                function convertNameAcc(type) {
                    switch (type) {
                        case 'tasksNum':
                            return "משימות";
                            break;
                        case 'activitiesNum':
                            return "פעילויות";
                            break;
                        case 'alertsNum':
                            return "התראות";
                            break;
                    }
                }

                if ($scope.appData.messAccSkira.activityContent !== null) {
                    var arrStatus = [{
                        type: 'הצג הכל',
                        name: $scope.appData.selectedCompany.companyId
                    }];
                    $scope.appData.messAccSkira.activityContent.forEach(function (v) {
                        if (arrStatus.length == 1) {
                            arrStatus.push({type: convertNameAcc(v.typeOfActivity), name: v.typeOfActivity})
                        } else {
                            var statusNum = 0;
                            arrStatus.forEach(function (values) {
                                if (values.name == v.typeOfActivity) {
                                    statusNum = 1;
                                }
                            })
                            if (statusNum == 0) {
                                arrStatus.push({type: convertNameAcc(v.typeOfActivity), name: v.typeOfActivity})
                            }
                        }
                    })
                    $scope.appData.messAccSkiraSelect = arrStatus;
                    $scope.messAccSkiraSelect = $scope.appData.messAccSkiraSelect[0];
                }
                $scope.loaderSkiraAccMess = false;

            }, function (error) {
            });
        }
        $scope.addTask = function () {
            $scope.appData.addTaskSkira = {};
            $scope.appData.addTaskSkira.day_id = ('0' + (new Date().getDate())).slice(-2) + '/' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '/' + new Date().getFullYear();
            $scope.showPopup('views/templates/addTaskSkira.html?ver=3.80', 'addTaskSkira');
        }
        $scope.goToBankAccountsTable = function (type, num) {
            var fromDate, toDate;

            function daysInMonth(month, year) {
                return new Date(year, month, 0).getDate();
            }

            switch ($scope.appData.dateFilter.type) {
                case "0":
                    fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
                    toDate = daysInMonth(parseInt($scope.dateFilter.byMonth) + 1, $scope.dateFilter.byYear) + '/' + ("0" + (parseInt($scope.dateFilter.byMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.byYear;
                    break;
                case "1":
                    fromDate = '01/01/' + $scope.dateFilter.byOnlyYear;
                    toDate = '31/12/' + $scope.dateFilter.byOnlyYear;

                    break;
                case "2":
                    fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
                    toDate = '01/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
                    break;
            }
            var id = null;
            if ($scope.shownGraphIndex !== 0) {
                id = $scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1].company_account_id;
            }
            if ($scope.appData.goToBankAccountsTable) {
                $scope.appData.goToBankAccountsTable = '';
            }
            var pieInd;
            if ($scope.pieInd == 0) {
                pieInd = false;
            }
            if ($scope.pieInd == 1) {
                pieInd = true;
            }
            $scope.appData.goToBankAccountsTable = {
                'hasPeula': pieInd,
                'type': type,
                'filters': $scope.appData.dateFilter.type,
                'fromDate': fromDate,
                'toDate': toDate,
                'typeSum': num,
                'accId': id
            };
            $scope.$state.go('fundManagement.bankAccounts.table');
        };
        $scope.messageCreate = function () {
            var data = {
                "messageTypeID": "FB76D93BB096251AE043640AA8C077C8",
                "companyId": $scope.appData.selectedCompany.companyId,
                "messageText": $scope.appData.addTaskSkira.message_add + ", <a class='remove_alerts' onclick='aaa()' href='sendWSbuza'>סמן כבוצע</a>",
                "dateValue": $scope.appData.addTaskSkira.day_id,
                "indMessageForAccountant": 1,
                "indAccMessageType": 3,
                "indShatef": null,
                "users": []
            };
            serverConnection.messageCreate(data).then(function (response) {
                $scope.loadMessAccSkira();
            }, function (error) {
            });
        }
        $scope.messagesDeleteSkira = function (id) {
            serverConnection.messagesDeleteSkira(id).then(function (response) {
                $scope.loadMessAccSkira();
            }, function (error) {
            });
        }
        $scope.loadCompanysForThis = function () {
            $scope.loaderSkiraAccTitle = true;
            $scope.loaderLoadDetailsCompany = true;

            serverConnection.loadCompanysForThis($scope.appData.selectedCompany.companyId).then(function (response) {
                var thisCom = response.find(function (com){
                    return com.companyId === $scope.appData.selectedCompany.companyId
                });
                $scope.appData.detailsCompany = thisCom ? thisCom : response[0];
                $scope.loaderSkiraAccTitle = false;
                $scope.loaderLoadDetailsCompany = false;
                serverConnection.get_source_programs()
                    .then(function (res) {
                        $scope.appData.get_source_programs = res;
                    }, function (error) {
                    });

            }, function (error) {
            });
            if ($state.current.name == 'overviewAcc.businessInfo') {
                serverConnection.company_admin({
                    companyId: $scope.appData.selectedCompany.companyId
                }).then(function (res) {
                    $scope.appData.dataCompanyInfo = res[0]
                }, function (error) {
                });
            }
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
        $scope.compExpGetList = function () {
            $scope.loaderSkiraAccExports = true;

            serverConnection.compExpGetList($scope.appData.selectedCompany.companyId).then(function (response) {
                if (response[0]) {
                    $scope.appData.compExpGetList = response[0];
                    $scope.appData.compExpGetList.data.forEach(function (a) {
                        if (a.last_export_date !== null && a.bank_account_id !== null) {
                            if (a.ind_blacklist == 0) {
                                a.ind_blacklist = true;
                                $scope.appData.fileExports = true;
                            } else {
                                a.ind_blacklist = false;
                            }
                        }
                    });
                } else {
                    $scope.appData.compExpGetList = response;
                }
                $scope.loaderSkiraAccExports = false;

            }, function (error) {
            });
        }
        $scope.blklistDelete = function (uuid) {
            var deferred = $q.defer();
            serverConnection.blklistDelete(uuid).then(function (res) {
                deferred.resolve(res);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.blacklist = function (acc) {
            if (acc.ind_blacklist == false) {
                $scope.blklistCreate(acc.company_account_id).then(function (res) {
                    $scope.appData.compExpGetList.data.forEach(function (a) {
                        if (a.company_account_id == acc.company_account_id) {
                            a.ind_blacklist = false;
                        }
                    });
                });
            } else {
                $scope.blklistDelete(acc.company_account_id).then(function (res) {
                    $scope.appData.compExpGetList.data.forEach(function (a) {
                        if (a.company_account_id == acc.company_account_id) {
                            a.ind_blacklist = true;
                        }
                    });
                });
            }
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
        $scope.updateAccountPassword = function (item, data) {
            var tok = item.token;
            if (data) {
                tok = item.token_id;
            }
            if (item.status == 1 || item.status == 2 || item.status == 4 || item.status == 3 || item.status == 157 || item.status == 158) {
                $scope.appData.popupType = 0;
                $scope.appData.popupTypeStatus = item.status;
                $scope.appData.popupTypeLink = true;
                $scope.appData.popupDataToken = tok;
                $scope.appData.popupDataBanks = {BankNumber: item.bank_id};
                $scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.80' + new Date().getTime(), 'accountUpdatePasswordPopup');
            }
        };
        $scope.editAlerts = function (acc, id) {
            $scope.appData.editAlertsHash = {
                'acc': acc,
                'id': id,
                'edit': false
            }

            $scope.showPopup('views/templates/editExHashSkira.html?ver=3.80', 'exHashEditPop');
        }
        $scope.resetExports = function (data) {
            serverConnection.resetExports(data).then(function (res) {
                if (res == 0) {
                    $scope.compExpGetList()
                }
            }, function (error) {

            });
        }
        $scope.cancelEx = function () {
            $scope.hidePopup();
        };
        $scope.exportApply = function () {
            var data = {
                dateFrom: null,
                dateTill: null,
                izuCustId: $scope.appData.hashCartisListModel.hash_id,
                inaccount_tab: [$scope.appData.uuidRowApply.company_account_id],
                bankTransId: $scope.appData.resBankPageFullCheck.bank_trans_id,
                efresh: $scope.appData.resBankPageFullCheck.efresh,
                biziboxEndDayItra: $scope.appData.resBankPageFullCheck.bizibox_end_day_itra
            }

            var jsonData = JSON.stringify(data);
            $scope.oshtnuFile(jsonData).then(function (res) {
                $scope.hidePopup();
                $scope.compExpGetList();
                if (res == 0) {
                    $scope.appData.fileExports = false;
                    $scope.appData.fileDownload = true;
                    $scope.downloadFile();
                } else {
                    //  alert('אין נתונים')
                }
            });
        }
        $scope.hashCartisList = function (uuid) {
            serverConnection.hashCartisList(uuid).then(function (res) {
                $scope.appData.hashCartisList = res;
                $scope.appData.hashCartisListModel = $scope.appData.hashCartisList[0];
                $scope.applySend();
            }, function (error) {

            });
        };
        $scope.exportPop = function () {
            $scope.export();
        }
        $scope.export = function (datesPicker) {
            $scope.appData.arrExportPopEx = [];
            $scope.appData.compExpGetList.data.forEach(function (a) {
                if (a.ind_blacklist == true) {
                    $scope.appData.arrExportPopEx.push(a.company_account_id);
                }
            });
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
            $scope.oshtnuFile(jsonData).then(function (res) {
                $scope.hidePopup();
                $scope.compExpGetList()
                if (res == 0) {
                    $scope.appData.fileExports = false;
                    $scope.appData.fileDownload = true;
                    $scope.downloadFile();
                } else {
                    $scope.showPopup('views/templates/alertNoneData.html?ver=3.80', 'alertNoneData');
                }
            });
        };
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
        $scope.company_det = function () {
            if ($scope.appData.selectedCompany) {
                $scope.getCompaniesThisStrorage();
            }
            $scope.getCompanyAccounts().then(function (response) {
                $scope.appData.selectedCompany.accounts = response;
                if ($scope.appData.selectedCompany && $scope.appData.adminSoft) {
                    var data = {
                        incompany_id: $scope.appData.selectedCompany.companyId
                    }

                    serverConnection.company_admin({
                        companyId: $scope.appData.selectedCompany.companyId
                    }).then(function (res) {
                        $scope.appData.dataCompanyInfo = res[0]


                        // $scope.appData.dataCompanyDet = res[0];
                        // if ($scope.appData.dataCompanyDet.EXPIRATION_DATE == null) {
                        // 	$scope.appData.dataCompanyDet.EXPIRATION_DATE_PIC = null;
                        // }
                        // else {
                        // 	$scope.appData.dataCompanyDet.EXPIRATION_DATE_PIC = $scope.appData.dataCompanyDet.EXPIRATION_DATE;
                        // }
                    }, function (error) {
                    });

                    serverConnection.company_det(data).then(function (res) {
                        $scope.appData.dataCompanyDet = res[0];
                        if ($scope.appData.dataCompanyDet.EXPIRATION_DATE == null) {
                            $scope.appData.dataCompanyDet.EXPIRATION_DATE_PIC = null;
                        } else {
                            $scope.appData.dataCompanyDet.EXPIRATION_DATE_PIC = $scope.appData.dataCompanyDet.EXPIRATION_DATE;
                        }
                    }, function (error) {
                    });
                }
            });
        }
        $scope.pushAlert = function (push) {
            if (push == null) {
                return '';
            } else {
                if (push == 'false') {
                    return 'לא'
                } else {
                    return 'כן'
                }
            }
        }
        $scope.appData.loaderPopApplyover = false;
        $scope.applySend = function () {
            $scope.appData.loaderPopApplyover = true;
            var data = {
                "companyAccId": $scope.appData.uuidRowApply.company_account_id,
                "izuCustId": $scope.appData.hashCartisListModel.hash_id,
                "izuSourceProgramId": "333"
            };
            serverConnection.bankPageFullCheck(data).then(function (res) {
                $scope.appData.loaderPopApplyover = false;
                $scope.appData.resBankPageFullCheck = res;
                $scope.loadcheckboxApprAttr($scope.appData.resBankPageFullCheck.efresh);
            }, function (error) {

            });
        }
        $scope.getOshtnu = function () {
            var deferred = $q.defer();
            serverConnection.getOshtnu().then(function (res) {
                deferred.resolve(res);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.oshtnuFile = function (data) {
            var deferred = $q.defer();
            serverConnection.oshtnuFile(data).then(function (res) {
                deferred.resolve(res);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.appData.checkboxAppr = false;
        $scope.loadcheckboxApprAttr = function (data) {
            if (data == 0) {
                $scope.appData.checkboxAppr = true;
            } else {
                $scope.appData.checkboxAppr = false;
            }
        }
        $scope.popUpApply = function (uuid) {
            $scope.appData.dataCompanyNmaeApply = $scope.appData.compExpGetList.company_name;
            $scope.appData.uuidRowApply = uuid;
            if (uuid.last_export_status !== 3 && uuid.last_export_status !== 7) {
                $scope.appData.showApply3or7 = false;
                $scope.hashCartisList($scope.appData.compExpGetList.company_id);
            } else {
                $scope.appData.showApply3or7 = true;

                $scope.appData.hashCartisListModel = {
                    hash_id: uuid.izu_cust_id
                }
                $scope.applySend()
            }
            $scope.showPopup('views/templates/popupApplyAccSkira.html?ver=3.80', 'popupApply');
        }
        $scope.openListCompanys = function (openUsersList) {
            if (openUsersList) {
                var data = {"companyId": $scope.appData.selectedCompany.companyId, "messageId": null};
                serverConnection.getListUsersOfCompany(data).then(function (res) {
                    $scope.appData.detailsCompany.usersList = res;
                }, function (error) {
                });
            }
        }
        $scope.setListUsersOfCompany = function (info, companyId, del, idx) {
            if (del) {
                var data = {"userUuid": info, "companyid": companyId};
                serverConnection.delListUsersOfCompany(data).then(function (res) {
                    if (res == 0) {
                        $scope.appData.detailsCompany.user_details.splice(idx, 1);
                    }
                }, function (error) {
                });
            } else {
                var data = {"userUuid": info.user_id, "companyid": companyId};
                serverConnection.setListUsersOfCompany(data).then(function (res) {
                    if (res == 0) {
                        $scope.loadCompanysForThis();
                    } else {
                        $scope.showPopup('views/templates/notPer.html?ver=3.80', 'popAlert', true);
                        setTimeout(function () {
                            $scope.hidePopup();
                        }, 1500)
                    }
                }, function (error) {
                });
            }
        }
        $scope.setAllDeatProfile = function () {
            $scope.editInputs = true;
            $scope.loaderLoadDetailsCompany = true;

            var MAIN_CONTACT_NAME = $scope.appData.dataCompanyInfo.MAIN_CONTACT_NAME,
                CONTACT_MAIL = $scope.appData.dataCompanyInfo.CONTACT_MAIL,
                CONTACT_PHONE = $scope.appData.dataCompanyInfo.CONTACT_PHONE,
                MEETING_DATE = (($scope.appData.adminSoft) ? $scope.appData.dataCompanyInfo.MEETING_DATE : null);

            if (MAIN_CONTACT_NAME == undefined || MAIN_CONTACT_NAME == '') {
                MAIN_CONTACT_NAME = null;
            }
            if (CONTACT_MAIL == undefined || CONTACT_MAIL == '') {
                CONTACT_MAIL = null;
            }
            if (CONTACT_PHONE == undefined || CONTACT_PHONE == '') {
                CONTACT_PHONE = null;
            }
            if (MEETING_DATE == undefined || MEETING_DATE == '') {
                MEETING_DATE = null;
            }

            var data = {
                "companyId": $scope.appData.selectedCompany.companyId,
                "contactMail": CONTACT_MAIL,
                "contactPhone": CONTACT_PHONE,
                "mainContactName": MAIN_CONTACT_NAME,
                "meetingDate": MEETING_DATE
            }
            serverConnection.update_company_admin(data).then(function (response) {
                $scope.loadCompanysForThis();
            }, function (error) {
            });
        }
        $scope.userGetbankmatchimplist = function () {
            var data = {
                "incompany_tab": [$scope.appData.selectedCompany.companyId],
                "indate_from": (new Date().getFullYear() - 1) + '' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '01',
                "indate_till": new Date().getFullYear() + '' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '01',
                "imp_type": "2"
            };
            serverConnection.userGetbankmatchimplist(data).then(function (res) {
                $scope.appData.chartSmallProfile = res;
            }, function (error) {
            });
        }
        $scope.dateConv = function (date) {
            if (date) {
                return parseInt(date.split('/')[0]) + '/' + parseInt(date.split('/')[1]);
            }
        }
        $scope.getWithdrawals = function (pieInd) {
            $scope.loaderSkiraAccGraphPay = true;
            $scope.loaderSkiraKsafimGraphPay = true;

            $scope.appData.selectedCompany.withdrawals = [{
                "name": "משיכות",
                "sum": 0.0,
                "month_id": 0,
                "children": [],
                "sort_code_exists": 1
            }, {
                "name": "הפקדות",
                "sum": 0.0,
                "month_id": 0,
                "children": [],
                "sort_code_exists": 1
            }];
            $scope.activePie = pieInd;
            var fromDate, toDate;

            function daysInMonth(month, year) {
                return new Date(year, month, 0).getDate();
            }

            switch ($scope.appData.dateFilter.type) {
                case "0":
                    var bymonthDate = (parseInt($scope.dateFilter.byMonth) + 1);

                    fromDate = '01/' + ("0" + bymonthDate).slice(-2) + '/' + $scope.dateFilter.byYear;
                    toDate = daysInMonth(bymonthDate - 1, $scope.dateFilter.byYear) + '/' + ("0" + bymonthDate).slice(-2) + '/' + $scope.dateFilter.byYear;
                    $scope.datePeriod = accoConversions.getDateMonth(("0" + bymonthDate).slice(-2)) + ' ' + $scope.dateFilter.byYear;
                    break;
                case "1":
                    fromDate = '01/01/' + $scope.dateFilter.byOnlyYear;
                    toDate = '31/12/' + $scope.dateFilter.byOnlyYear;
                    $scope.datePeriod = fromDate + ' - ' + toDate;
                    break;
                case "2":
                    fromDate = '01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear;
                    toDate = daysInMonth(parseInt($scope.dateFilter.toMonth), $scope.dateFilter.toYear) + '/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear;
                    $scope.datePeriod = fromDate + ' - ' + toDate;
                    break;
            }

            var id = null;
            if ($scope.shownGraphIndex !== 0) {
                id = $scope.appData.selectedCompany.accounts.bank_account_list[$scope.shownGraphIndex - 1].company_account_id;
            }


            serverConnection.getWithdrawals({
                incompany_id: $scope.appData.selectedCompany.companyId,
                incompany_account_id: id,
                indate_from: fromDate,
                indate_till: toDate,
                ind_trans_type: pieInd
            }).then(function (response) {
                $scope.appData.selectedCompany.withdrawals = response;
                $scope.showWithdrowals();
            }, function (error) {

            });
        };
        $scope.showWithdrowals = function () {
            var positive = [], negative = [];
            var pZeros = true, nZeros = true;
            var colorsNegative = $scope.colorsNegative;
            var colorsPositive = $scope.colorsPositive;
            for (var i = 0; i < $scope.appData.selectedCompany.withdrawals[0].children.length; i++) {
                negative.push(Math.abs($scope.appData.selectedCompany.withdrawals[0].children[i].sum));
                if ($scope.appData.selectedCompany.withdrawals[0].children[i].sum != 0)
                    nZeros = false;
            }
            for (var i = 0; i < $scope.appData.selectedCompany.withdrawals[1].children.length; i++) {
                positive.push($scope.appData.selectedCompany.withdrawals[1].children[i].sum);
                if ($scope.appData.selectedCompany.withdrawals[1].children[i].sum != 0)
                    pZeros = false;
            }

            var nSum = 0;
            if (negative.length > 0) {
                nSum = negative.reduce(function (previousValue, currentValue, index, array) {
                    return previousValue + currentValue;
                });
            }

            var pSum = 0;
            if (positive.length > 0) {
                pSum = positive.reduce(function (previousValue, currentValue, index, array) {
                    return previousValue + currentValue;
                });
            }

            if (pZeros) {
                positive = [0, 1];
                colorsPositive = ['#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
            }

            if (nZeros) {
                negative = [0, 1];
                colorsNegative = ['#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA', '#DADADA'];
            }
            $scope.appData.selectedCompany.withdrawals[0].tooltips = [];
            for (var i = 0; i < $scope.appData.selectedCompany.withdrawals[0].children.length; i++) {
                $scope.appData.selectedCompany.withdrawals[0].children[i].data = negative;
                var tmpColors = [];
                for (var j = 0; j < colorsNegative.length; j++) {
                    if (i == j)
                        tmpColors.push(colorsNegative[j]);
                    else
                        tmpColors.push('#DADADA');
                }
                $scope.appData.selectedCompany.withdrawals[0].children[i].colors = tmpColors;
                $scope.appData.selectedCompany.withdrawals[0].children[i].tooltip = '&nbsp;';
                $scope.appData.selectedCompany.withdrawals[0].tooltips.push({
                    name: $scope.appData.selectedCompany.withdrawals[0].children[i].name,
                    value: $scope.appData.selectedCompany.withdrawals[0].children[i].sum
                });
            }

            $scope.appData.selectedCompany.withdrawals[1].tooltips = [];
            for (var i = 0; i < $scope.appData.selectedCompany.withdrawals[1].children.length; i++) {
                $scope.appData.selectedCompany.withdrawals[1].children[i].data = positive;
                var tmpColors = [];
                for (var j = 0; j < colorsPositive.length; j++) {
                    if (i == j)
                        tmpColors.push(colorsPositive[j]);
                    else
                        tmpColors.push('#DADADA');
                }
                $scope.appData.selectedCompany.withdrawals[1].children[i].colors = tmpColors;
                $scope.appData.selectedCompany.withdrawals[1].children[i].tooltip = '&nbsp;';
                $scope.appData.selectedCompany.withdrawals[1].tooltips.push({
                    name: $scope.appData.selectedCompany.withdrawals[1].children[i].name,
                    value: $scope.appData.selectedCompany.withdrawals[1].children[i].sum
                });
            }

            function tooltipNegative() {
                if ($scope.appData.selectedCompany.withdrawals[0].tooltips.length > 0) {
                    var str = '<div class="top-chart-pie">';
                    str = str + '<div>' + $scope.appData.selectedCompany.withdrawals[0].tooltips[this.point.x].name + '</div>';
                    str = str + '<div><span>&#8362;</span>' + $scope.getTotal($scope.appData.selectedCompany.withdrawals[0].tooltips[this.point.x].value) + '</div>';
                    str = str + '</div>';
                    return str;
                } else {
                    var str = '<div class="top-chart-pie"><h2 class="notDataGraphTooltip">אין נתונים</h2></div>';
                    return str;
                }
            }

            function tooltipPositive() {
                if ($scope.appData.selectedCompany.withdrawals[1].tooltips.length > 0) {
                    var str = '<div class="top-chart-pie">';
                    str = str + '<div>' + $scope.appData.selectedCompany.withdrawals[1].tooltips[this.point.x].name + '</div>';
                    str = str + '<div><span>&#8362;</span>' + $scope.getTotal($scope.appData.selectedCompany.withdrawals[1].tooltips[this.point.x].value) + '</div>';
                    str = str + '</div>';
                    return str;
                } else {
                    var str = '<div class="top-chart-pie"><h2 class="notDataGraphTooltip">אין נתונים</h2></div>';
                    return str;
                }
            }


            $scope.appData.selectedCompany.withdrawals.negative = {
                data: negative,
                title: $scope.appData.selectedCompany.withdrawals[0].name,
                colors: colorsNegative,
                tooltip: tooltipNegative
            };
            $scope.appData.selectedCompany.withdrawals.positive = {
                data: positive,
                title: $scope.appData.selectedCompany.withdrawals[1].name,
                colors: colorsPositive,
                tooltip: tooltipPositive
            };
            $scope.loaderSkiraAccGraphPay = false;
            $scope.loaderSkiraKsafimGraphPay = false;

        };
        $scope.skiraListType = function () {
            $scope.loaderSkiraAccGraph = true;

            serverConnection.getSkiraListType($scope.appData.selectedCompany.companyId).then(function (response) {
                $scope.appData.selectedCompany.skiraListType = response;
                var arr = [];
                $scope.appData.selectedCompany.skiraListType.forEach(function (v) {
                    if (v.metchilatshana !== 0) {
                        arr.push(v)
                    }
                });
                $scope.appData.selectedCompany.skiraListType = arr;
                var i = 0;
                var text = "";
                while ($scope.appData.selectedCompany.skiraListType[i]) {
                    var data = $scope.appData.selectedCompany.skiraListType[i].caption;
                    $scope.selectSkira(data, 0);
                    break
                    i++;
                }
                $scope.loaderSkiraAccGraph = false;

            }, function (error) {
            });
        };
        $scope.selectSkira = function (data, idx) {
            $scope.today = new Date();
            if ($scope.appData.selectedCompany.default_account_month) {
                var datesYear = $scope.appData.selectedCompany.default_account_month.toString().substring(0, 4);
                $scope.today.setFullYear(parseFloat(datesYear))
            }
            $scope.lastDayOfMonth = new Date($scope.today.getFullYear(), $scope.today.getMonth() + 1, 0);
            $scope.lastDayOfMonthPrev = new Date(($scope.today.getFullYear() - 1), $scope.today.getMonth() + 1, 0);
            $scope.indexGraph = idx;
            var numOrStr = data;
            var parseData = parseInt(numOrStr);
            var dateFrom = $scope.today.getFullYear() + '0101';
            var dateTill = $scope.lastDayOfMonth.getFullYear() + '' + ("0" + ($scope.lastDayOfMonth.getMonth() + 1)).slice(-2) + '' + ("0" + ($scope.lastDayOfMonth.getDate())).slice(-2);

            var dateFromPrev = ($scope.today.getFullYear() - 1) + '0101';
            var dateTillPrev = $scope.lastDayOfMonthPrev.getFullYear() + '' + ("0" + ($scope.lastDayOfMonthPrev.getMonth() + 1)).slice(-2) + '' + ("0" + ($scope.lastDayOfMonthPrev.getDate())).slice(-2);

            if (isNaN(parseData) == false) {
                if (!$scope.appData.selectedCompany[data]) {
                    var req = {
                        "companyId": $scope.appData.selectedCompany.companyId,
                        "from": dateFrom,
                        "till": dateTill,
                        "prevFrom": dateFromPrev,
                        "prevTill": dateTillPrev,
                        "targetTab": [data],
                        "transTypeCatId": "null",
                        "supplierId": "null",
                        "sortCodeId": "null"
                    };

                    serverConnection.getSkiraGraphAccNumbers(req).then(function (response) {
                        $scope.appData.selectedCompany[data] = response;
                        $scope.getGraphSlika(data.toString());
                    }, function (error) {

                    });
                } else {
                    $scope.getGraphSlika(data.toString());
                }
            } else {
                var req = {
                    "companyId": $scope.appData.selectedCompany.companyId,
                    "from": dateFrom,
                    "till": dateTill,
                    "prevFrom": dateFromPrev,
                    "prevTill": dateTillPrev
                };
                if (numOrStr == 'golmi') {
                    if (!$scope.appData.selectedCompany.skiraGraphRgolmicmp) {
                        serverConnection.rgolmicmp(req).then(function (response) {
                            $scope.appData.selectedCompany.skiraGraphRgolmicmp = response;
                            $scope.getGraphSlika('skiraGraphRgolmicmp');
                        }, function (error) {

                        });
                    } else {
                        $scope.getGraphSlika('skiraGraphRgolmicmp');
                    }
                }
                if (numOrStr == 'naki') {
                    if (!$scope.appData.selectedCompany.skiraGraphrnakicmp) {
                        serverConnection.rnakicmp(req).then(function (response) {
                            $scope.appData.selectedCompany.skiraGraphrnakicmp = response;
                            $scope.getGraphSlika('skiraGraphrnakicmp');
                        }, function (error) {

                        });
                    } else {
                        $scope.getGraphSlika('skiraGraphrnakicmp');
                    }
                }
            }
        };
        $scope.getGraphSlika = function (dataNum) {
            if ($scope.appData.selectedCompany[dataNum]) {
                var xAxis = [];
                var dataGraph = [];
                $scope.appData.selectedCompany[dataNum].line_graph.forEach(function (v) {
                    xAxis.push($scope.accoConversions.getDayMonthNum(v.date_month.toString()));
                    var tooltips = new Array();
                    v.tooltip.forEach(function (v1) {
                        var tool_content = {
                            'title': v1.name,
                            'value': v1.total.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                        };
                        tooltips.push(tool_content);
                    });
                    dataGraph.push({'y': parseInt(v.sum), 'players': tooltips});
                });

                $scope.chartData = {
                    spacingTop: 55,
                    spacingLeft: 0,
                    spacingRight: 0,
                    borderColor: '#fff',
                    borderWidth: 0,
                    borderRadius: 0,
                    legend: false,
                    xAxis: xAxis,
                    data: [{
                        data: dataGraph,
                        cursor: 'pointer',
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
                        }
                    }],
                    title: ' ',
                    subtitle: ' ',
                    tooltip: function () {
                        var str = '<div class="chart-tooltip-table"><table><tbody>';
                        str += '<tr style="font-family: esterebold, Arial;"><td><div>סה"כ</div></td><td><div><span>&#8362;</span>' + $scope.getTotal(this.y) + '</div></td></tr>';
                        this.point.players.forEach(function (datum) {
                            str += '<tr><td><div>' + datum.title + '</div></td><td><div><span>&#8362;</span>' + datum.value + '</div></td></tr>';
                        });
                        return (this.point.players.length > 0) ? str : 'אין נתונים';
                    }

                };
            }
        };
        $scope.showPopOutLoans = function (obj, types) {
            if (obj) {
                $scope.appData.objPopUp = obj;
                $scope.appData.objPopUp.types = types;
                $scope.showPopup('views/templates/popupDetailsAcc.html?ver=3.80', 'popupDetailsSkira', false);
            }
        };
        $scope.goToAnalisis = function (sortCodeId, tabs) {
            $scope.appData.analysisDates = true;
            $scope.appData.byMonthAnalisis = $scope.dateFilter.byMonth;
            $scope.appData.byYearAnalisis = $scope.dateFilter.byYear;
            $scope.appData.byOnlyYearAnalisis = $scope.dateFilter.byOnlyYear;
            $scope.appData.fromMonthAnalisis = $scope.dateFilter.fromMonth;
            $scope.appData.fromYearAnalisis = $scope.dateFilter.fromYear;
            $scope.appData.toMonthAnalisis = $scope.dateFilter.toMonth;
            $scope.appData.toYearAnalisis = $scope.dateFilter.toYear;
            $scope.appData.targetTab = tabs;

            if ($scope.appData.selectedCompany.withdrawals[0].sort_code_exists == 1) {
                if ($scope.activePie == 2) {
                    $scope.appData.transCodesAnalisis = sortCodeId;
                    $scope.appData.sortCodesAnalisis = '';
                }
                if ($scope.activePie == 3) {
                    $scope.appData.sortCodesAnalisis = sortCodeId;
                    $scope.appData.transCodesAnalisis = '';
                }
            } else {
                $scope.appData.transCodesAnalisis = sortCodeId;
                $scope.appData.sortCodesAnalisis = '';
            }
            $state.go('analysis');
        };
        $scope.appData.redErrorFilterType = false;
        $scope.disabledDates = function () {
            function shortDates(dates) {
                return dates.split('/')[2] + '' + dates.split('/')[1] + '' + dates.split('/')[0];
            }

            $scope.appData.redErrorFilterType = false;
            if ($scope.appData.dateFilter.type == '2' && shortDates('01/' + ("0" + (parseInt($scope.dateFilter.fromMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.fromYear) > shortDates('01/' + ("0" + (parseInt($scope.dateFilter.toMonth) + 1)).slice(-2) + '/' + $scope.dateFilter.toYear)) {
                $scope.appData.redErrorFilterType = '2';
            } else {
                $scope.appData.redErrorFilterType = false;
            }
        }
        $scope.nextAndPrevGraph = function (type) {
            //$scope.loaderSkiraKsafimGraph = true;
            function addWeek(week, oneDay) {
                var days = 1;
                if (oneDay) {
                    days = 11;
                }
                var dates = new Date();
                dates.setFullYear(parseInt(week.toString().split('/')[2]));
                dates.setMonth(parseInt(week.toString().split('/')[1]) - 1);
                dates.setDate(parseInt(week.toString().split('/')[0]) + days);

                return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear()
            };

            function prevWeek(week, oneDay) {
                var days = 1;
                if (oneDay) {
                    days = 11;
                }
                var dates = new Date();
                dates.setFullYear(parseInt(week.toString().split('/')[2]));
                dates.setMonth(parseInt(week.toString().split('/')[1]) - 1);
                dates.setDate(parseInt(week.toString().split('/')[0]) - days);

                return ("0" + dates.getDate()).slice(-2) + '/' + ("0" + (dates.getMonth() + 1)).slice(-2) + '/' + dates.getFullYear()
            };

            if (type == 'next') {
                $scope.showPrevButton = true;
                if ($scope.appData.prevNextGraphType == 'prev' || !$scope.appData.prevNextGraphType || $scope.appData.prevNextGraphTypeAdd == 'prev') {
                    if ($scope.appData.indexGraphTazrimGeneral.to !== 11) {
                        $scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from + 1;
                        $scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to + 1;
                    } else {
                        $scope.spinnerNext = true;
                    }
                    $scope.appData.prevNextGraphType = 'next';
                    $scope.appData.prevNextGraphTypeAdd = 'next';
                    $scope.appData.nextAndPrevGraphFrom = addWeek($scope.appData.nextAndPrevGraphTo);
                    $scope.appData.nextAndPrevGraphTo = addWeek($scope.appData.nextAndPrevGraphTo, true);
                    $scope.getTazrim($scope.appData.nextAndPrevGraphFrom, $scope.appData.nextAndPrevGraphTo, true);
                } else {
                    if ($scope.appData.indexGraphTazrimGeneral.to == 11) {
                        if (!$scope.appData.tazrimGraphMainGeneralNew) {
                            $scope.spinnerNext = true;
                        } else {
                            $scope.appData.indexGraphTazrimGeneral.from = 0;
                            $scope.appData.indexGraphTazrimGeneral.to = 7;
                            $scope.appData.tazrimGraphMainGeneral = angular.copy($scope.appData.tazrimGraphMainGeneralNew);
                            $scope.appData.tazrimGraphMainGeneralNew = false;
                            $scope.appData.prevNextGraphTypeAdd = 'prev';
                        }
                    } else {
                        $scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from + 1;
                        $scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to + 1;
                    }
                }

                $scope.appData.selectedCompany.tazrim = angular.copy($scope.appData.tazrimGraphMainGeneral).slice($scope.appData.indexGraphTazrimGeneral.from, $scope.appData.indexGraphTazrimGeneral.to)
                $scope.graphSett();
            }
            if (type == 'prev') {
                //if ($scope.appData.balanceLastUpdateDateForGraph > 0) {
                //	$scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from - 1;
                //	$scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to - 1;
                //	//$scope.appData.nextAndPrevGraphTo = prevWeek($scope.appData.nextAndPrevGraphFrom);
                //	//$scope.appData.nextAndPrevGraphFrom = prevWeek($scope.appData.nextAndPrevGraphFrom, true);
                //	//$scope.$parent.getTazrim($scope.appData.nextAndPrevGraphFrom, $scope.appData.nextAndPrevGraphTo);
                //	$scope.appData.selectedCompany.tazrim = angular.copy($scope.appData.tazrimGraphMainGeneral).slice($scope.appData.indexGraphTazrimGeneral.from, $scope.appData.indexGraphTazrimGeneral.to)
                //	$scope.$parent.graphSett();
                //}
                if ($scope.appData.indexGraphTazrimGeneral.from == 1 && $scope.appData.balanceLastUpdateDateForGraph == $scope.appData.nextAndPrevGraphFrom) {
                    $scope.showPrevButton = false;
                }
                if ($scope.appData.prevNextGraphType == 'next' || !$scope.appData.prevNextGraphType || $scope.appData.prevNextGraphTypeAdd == 'next') {
                    if ($scope.appData.indexGraphTazrimGeneral.from !== 0) {
                        $scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from - 1;
                        $scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to - 1;
                    } else {
                        $scope.spinnerPrev = true;
                    }
                    $scope.appData.prevNextGraphTypeAdd = 'prev';
                    $scope.appData.prevNextGraphType = 'prev';
                    $scope.appData.nextAndPrevGraphTo = prevWeek($scope.appData.nextAndPrevGraphFrom);
                    $scope.appData.nextAndPrevGraphFrom = prevWeek($scope.appData.nextAndPrevGraphFrom, true);
                    $scope.getTazrim($scope.appData.nextAndPrevGraphFrom, $scope.appData.nextAndPrevGraphTo, true);
                } else {
                    if ($scope.appData.indexGraphTazrimGeneral.from == 0) {
                        if (!$scope.appData.tazrimGraphMainGeneralNew) {
                            $scope.spinnerPrev = true;
                        } else {
                            $scope.appData.indexGraphTazrimGeneral.from = 4;
                            $scope.appData.indexGraphTazrimGeneral.to = 11;
                            $scope.appData.tazrimGraphMainGeneral = angular.copy($scope.appData.tazrimGraphMainGeneralNew);
                            $scope.appData.tazrimGraphMainGeneralNew = false;
                            $scope.appData.prevNextGraphTypeAdd = 'next';
                        }
                    } else {
                        $scope.appData.indexGraphTazrimGeneral.from = $scope.appData.indexGraphTazrimGeneral.from - 1;
                        $scope.appData.indexGraphTazrimGeneral.to = $scope.appData.indexGraphTazrimGeneral.to - 1;
                    }
                }
                $scope.appData.selectedCompany.tazrim = angular.copy($scope.appData.tazrimGraphMainGeneral).slice($scope.appData.indexGraphTazrimGeneral.from, $scope.appData.indexGraphTazrimGeneral.to)
                $scope.graphSett();
            }
        }
        $scope.deleteoutDeposits = function () {
            serverConnection.deposit_delete($scope.appData.objPopUp.deposit_id).then(function (response) {
                $scope.getKsafimData(true);
            }, function (error) {
            });
        }
        $scope.deleteoutLoans = function () {
            serverConnection.loan_delete($scope.appData.objPopUp.loan_id).then(function (response) {
                $scope.getKsafimData(true);
            }, function (error) {
            });
        }
        $scope.refresh = function () {
            $scope.loadCompanysForThis();
            $scope.userGetbankmatchimplist();
            $scope.getWithdrawals($scope.pieInd);
            $scope.skiraListType();
            $scope.compExpGetList();
            $scope.loadMessAccSkira();
            if ($state.current.name == 'overviewAcc.businessInfo') {
                $scope.company_det()
            }
        };
        $scope.appData.showhelpSkira = false;
        $scope.$parent.help = function () {
            $scope.appData.showhelpSkira = true;
        };
        $scope.openBug = function () {
            $scope.appData.usersWorkVal = {};
            $q.all([serverConnection.user_get_bizibox_users(), serverConnection.get_qa_tasks_types(), serverConnection.get_qa_tasks_priorty()]).then(function (data) {
                $scope.appData.usersWork = data[0];
                $scope.appData.usersWork_tasks_type = data[1];
                $scope.appData.usersWork_priority = data[2];

                if (localStorage.getItem('usersWorkVal') !== null) {
                    $scope.appData.usersWorkVal.taskUserId = localStorage.getItem('usersWorkVal');
                } else {
                    $scope.appData.usersWorkVal.taskUserId = data[0][0].USER_ID;
                }

                $scope.appData.usersWorkVal.tasks_type = 2;
                $scope.appData.usersWorkVal.taskTitle = 'בעיה כללית';
                $scope.appData.usersWork_priority.forEach(function (v, i) {
                    if (v.QA_TASK_PRIORTY_DESC == 'גבוה') {
                        $scope.appData.usersWorkVal.priority = v.QA_TASK_PRIORTY_ID;
                    }
                })
                $scope.showPopup('views/templates/addTaskOver.html?ver=3.80', 'addTask');
            });
        }
        $scope.qa_task_add = function () {
            if(!$scope.appData.usersWorkVal.sent) {

                $scope.appData.usersWorkVal.sent = true;

                var data = {
                    taskUserId: $scope.appData.usersWorkVal.taskUserId,
                    taskType: $scope.appData.usersWorkVal.tasks_type,
                    taskTitle: $scope.appData.usersWorkVal.taskTitle,
                    taskDesc: $scope.appData.usersWorkVal.taskDesc,
                    driveLink: $scope.appData.usersWorkVal.driveLink,
                    stateType: 1,
                    priority: $scope.appData.usersWorkVal.priority,
                    token: null,
                    companyAccountId: null,
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
        $scope.clearHaanah = function () {
            $scope.showPopup('views/templates/clearAccData.html?ver=3.80', 'clearAccData');
        }
        $scope.clearHaanahSend = function () {
            serverConnection.company_clean_haanah($scope.appData.companySource.companyId).then(function (res) {
                $scope.hidePopup();
                $scope.refresh()
            }, function (error) {

            });
        }
        $scope.bizibox_downgrade = function () {
            $scope.showPopup('views/templates/bizibox_downgrade.html?ver=3.80', 'clearAccData');
        }
        $scope.bizibox_downgrade_send = function () {
            serverConnection.bizibox_downgrade({
                "companyId": $scope.appData.selectedCompany.companyId
            }).then(function (res) {
                $scope.hidePopup();
                $scope.refresh()
            }, function (error) {

            });
        }
        $scope.$on('refresh', function () {
            $scope.refresh();
        });
        $scope.delete_hash_bank = function () {
            $scope.loaderSkiraAccTitle = true;
            serverConnection.delete_hash_bank($scope.appData.selectedCompany.companyId).then(function (response) {
                $scope.loaderSkiraAccTitle = false;
                $scope.hidePopup();
            }, function (error) {
                $scope.loaderSkiraAccTitle = false;
                $scope.hidePopup();
            });
        }
        $scope.company_exporter_settime = function () {
            $scope.loaderSkiraAccTitle = true;
            var data = {
                companyID: $scope.appData.selectedCompany.companyId,
                time: $scope.appData.selectTimeExporter
            }
            serverConnection.company_exporter_settime(data).then(function (response) {
                $scope.loaderSkiraAccTitle = false;
                $scope.hidePopup();
            }, function (error) {
                $scope.loaderSkiraAccTitle = false;
                $scope.hidePopup();
            });
        }
        $scope.company_exporter_settime_ref = function () {
            $scope.loaderSkiraAccTitle = true;
            var data = {
                companyID: $scope.appData.selectedCompany.companyId,
                time: '4'
            }
            serverConnection.company_exporter_settime(data).then(function (response) {
                $scope.loaderSkiraAccTitle = false;
                $scope.hidePopup();
            }, function (error) {
                $scope.hidePopup();
                $scope.loaderSkiraAccTitle = false;
            });
        }
        $scope.setApprove = function () {
            if ($scope.appData.peulaApprOverview == "1") {
                $scope.company_exporter_settime();
            }
            if ($scope.appData.peulaApprOverview == "2") {
                $scope.delete_hash_bank();
            }
            if ($scope.appData.peulaApprOverview == "3") {
                $scope.company_exporter_settime_ref();
            }
        }
        $scope.openAlertsApr = function (type) {
            $scope.appData.peulaApprOverview = type;
            $scope.showPopup('views/templates/alertsPeula.html?ver=3.80', 'alerts', true);
        }
    }

    angular.module('controllers')
        .controller('overviewAccCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', overviewAccCtrl]);
}());
