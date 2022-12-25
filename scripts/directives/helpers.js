(function () {
    var INTEGER_REGEXP = /^[A-Za-z0-9]{1,100}$/;
    var passReg = /^[A-Za-z0-9]{6,12}$/;

    function scrollFill() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).css({
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                    'height': $(window).height() - attrs.scrollFill
                });
                $(document).hover(function (e) {
                    $(".ui-tooltip").remove();
                });
                scope.$on('widthChanged', function () {
                    if (scope.appData.defMonth && ((scope.appData.defMonth.ind_accountants == 0) && (scope.appData.defMonth.ind_sample == 1)) || ((scope.appData.selectedCompany) && (scope.appData.defMonth.ind_accountants == 0) && (scope.appData.selectedCompany.days_left_till_expire || scope.appData.selectedCompany.days_left_till_expire == 0))) {
                        $(element).css({
                            'overflow-y': 'auto',
                            'overflow-x': 'hidden',
                            'height': $(window).height() - attrs.scrollFill - 30
                        });
                    } else {
                        $(element).css({
                            'overflow-y': 'auto',
                            'overflow-x': 'hidden',
                            'height': $(window).height() - attrs.scrollFill
                        });
                    }
                });
                $(window).resize(function () {
                    if (scope.appData.defMonth && ((scope.appData.defMonth.ind_accountants == 0) && (scope.appData.defMonth.ind_sample == 1)) || ((scope.appData.selectedCompany) && (scope.appData.defMonth.ind_accountants == 0) && (scope.appData.selectedCompany.days_left_till_expire || scope.appData.selectedCompany.days_left_till_expire == 0))) {
                        $(element).css({
                            'overflow-y': 'auto',
                            'overflow-x': 'hidden',
                            'height': $(window).height() - attrs.scrollFill - 30
                        });
                    } else {
                        $(element).css({
                            'overflow-y': 'auto',
                            'overflow-x': 'hidden',
                            'height': $(window).height() - attrs.scrollFill
                        });
                    }
                });
                scope.$watch(function () {
                    return element.attr('scroll-fill');
                }, function (newValue, oldValue) {
                    if (newValue && (newValue !== oldValue)) {
                        $(element).css({
                            'overflow-y': 'auto',
                            'overflow-x': 'hidden',
                            'height': $(window).height() - attrs.scrollFill
                        });
                    }
                }, true);
            }
        };
    }

    function scrollFillTabs() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).css({
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                    'height': $(window).height() - $(element).offset().top
                });

                scope.$on('widthChanged', function () {
                    $(element).css({
                        'overflow-y': 'auto',
                        'overflow-x': 'hidden',
                        'height': $(window).height() - $(element).offset().top
                    });
                });

                scope.$watch(function () {
                    return element.attr('scroll-fill-tabs');
                }, function (newValue, oldValue) {
                    if (newValue && (newValue !== oldValue)) {
                        $(element).css({
                            'overflow-y': 'auto',
                            'overflow-x': 'hidden',
                            'height': $(window).height() - $(element).offset().top
                        });
                    }
                }, true);
            }
        };
    }

    function heightTabs() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                function loadHeightTabs() {
                    var messages = $(element);
                    if ($(element).find('.ksafim-data-wrap.ksafimList').is(':visible')) {
                        var ksafim_wrap = $(element).find('.ksafim-data-wrap.ksafimList');
                    }
                    if ($(element).find('.ksafim-data-wrap.accList').is(':visible')) {
                        var ksafim_wrap = $(element).find('.ksafim-data-wrap.accList');
                    }
                    var ksafim_data = $(element).find('.ksafim-data');
                    var general_alerts = $(element).find('.general-alerts');
                    if (general_alerts.length == 0) {
                        general_alerts = $(element).find('.messagesSkira');
                    }
                    var hei = 55;
                    if (scope.appData.permissionAlert) {
                        hei = 55 + 58;
                    }
                    $(messages).height($(window).height() - hei);
                    //var len = $(ksafim_data).children('li:visible').length;
                    //  $(ksafim_wrap).height((len * 53) + 1);

                    $(general_alerts).height($(messages).height() - $(ksafim_wrap).height() - 5);
                    $(general_alerts).children('ul').height($(general_alerts).height() - 55);
                }

                setTimeout(function () {
                    loadHeightTabs()
                }, 1000)

                $(window).resize(function () {
                    loadHeightTabs()
                });
                //scope.$watch(function (newValue) {
                //	if (newValue.$state.current.name) {
                //		loadHeightTabs()
                //	}
                //});
                //scope.$watch(function () {
                //	return element.attr('scroll-fill');
                //}, function (newValue, oldValue) {
                //	if (newValue && (newValue !== oldValue)) {
                //		loadHeightTabs()
                //	}
                //}, true);

                scope.$watch('$state.current.name', function (newValue, oldValue) {
                    if (newValue) {
                        setTimeout(function () {
                            loadHeightTabs()
                        }, 500)
                    }
                }, true);

                scope.$on('widthChanged', function () {
                    loadHeightTabs()
                });
            }
        };

    }

    function showSubline() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                var $this = $(element);
                var next = $(element).next();
                $this.on('click', function () {
                    $(this).closest('.rowNew').find('.sublineRow').slideToggle(200);
                });

                $this.closest('body').find('.selectAllPeulot  input').on('change', function () {
                    if ($(this).val() == 'false') {
                        next.slideUp(300);
                    } else {
                        next.slideDown(100);
                    }
                });


            }
        };

    }

    function accordionWrap() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).find('li > div').click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if ($(this).next().is(':visible') == false) {
                        $(element).children('li').removeClass('selected').find('ul').slideUp(250);
                    }
                    $(this).closest('li').toggleClass('selected');
                    $(this).next().slideToggle(250);

                    setTimeout(function () {
                        var messages = $('.page-content > .messages');
                        var ksafim_wrap = $('.ksafim-data-wrap.ksafimList');

                        var general_alerts = $('.general-alerts');
                        if (general_alerts.length == 0) {
                            general_alerts = $('.messagesSkira');
                        }
                        $(messages).height($('.main_nav').height());
                        $(general_alerts).height($(messages).height() - $(ksafim_wrap).height());
                        $(general_alerts).children('ul').height($(general_alerts).height() - 55);
                    }, 250)
                });
            }
        };
    }

    function accordionAcc() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).find('li > div').click(function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if ($(this).next().is(':visible') == false) {
                        $(element).children('li').removeClass('selected').find('ul').slideUp(250);
                    }
                    $(this).closest('li').toggleClass('selected');
                    $(this).next().slideToggle(250);

                    setTimeout(function () {
                        var messages = $('.page-content > .messages');
                        var ksafim_wrap = $('.ksafim-data-wrap.accList');
                        var general_alerts = $('.general-alerts');
                        if (general_alerts.length == 0) {
                            general_alerts = $('.messagesSkira');
                        }
                        $(messages).height($('.main_nav').height());
                        $(general_alerts).height($(messages).height() - $(ksafim_wrap).height());
                        $(general_alerts).children('ul').height($(general_alerts).height() - 55);
                    }, 250)

                });
            }
        };


    }

    function popup($compile) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).addClass('popup');
                $(element).append($compile($('<div class="popup-wrapper zoomIn animated"></div><div class="bg_popup_page"></div>'))(scope));

                if (element.attr('close') == "true") {
                    $(element).bind('click', close);
                }

                function close(event) {
                    if (event.target.className == "popup") {
                        $(element).find('.popup-close').click();
                    }
                }

                scope.$watch(function () {
                    return element.attr('classpop');
                }, function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    $(element).find('.popup-wrapper').removeClass(oldValue).addClass(newValue);
                }, true);

                scope.$watch(function () {
                    return element.attr('template');
                }, function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    $(element).find('.popup-wrapper').empty();
                    $(element).find('.popup-wrapper').append($compile($('<div data-ng-include class="popup-inner-wrapper" src="\'' + element.attr("template") + '\'"></div>'))(scope));
                    if (element.attr('close') !== "true") {
                        $(element).find('.popup-wrapper').append($compile($('<img src="image/close_popup.png" alt="סגור" class="popup-close" ng-click="appData.showPopup = false"/>'))(scope));
                        // $(element).bind('click', close);
                    } else {
                        $(element).unbind('click', close);
                    }
                }, true);
            }
        };
    }

    function dropdown() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).addClass('dropdown');
                $(element).find('.dropdown-content').hide();
                $(element).find('.dropdown-toggle').on('click', function (e) {
                    e.stopPropagation();
                    var thisDd = $(this).closest('.dropdown').find('.dropdown-content');
                    $('.dropdown-content').not(thisDd).slideUp("fast");
                    thisDd.slideToggle("fast");
                });
                $(element).find('.dropdown-content').on('click', function (e) {
                    e.stopPropagation();
                });
                $('#ui-datepicker-div').on('click', '> *', function (e) {
                    e.stopPropagation();
                });
                $('.ui-corner-all').on('click', function (e) {
                    e.stopPropagation();
                });
                $(element).find('.dropdown-close').on('click', function (e) {
                    e.preventDefault()
                    $(this).closest('.dropdown-content').slideUp("fast");
                });

                //
                //$(element).addClass('dropdown');
                //var show = false;
                //$(element).find('.dropdown-content').hide();
                //
                //function hideDropdown(event) {
                //    if (event.target && (event.target.attributes.class.nodeValue.indexOf("dropdown-content") == -1 && event.target.parentNode.parentNode.attributes.class.nodeValue.indexOf("dropdown-content") == -1 && event.target.parentNode.parentNode.parentNode.attributes.class.nodeValue.indexOf("dropdown-content") == -1 && event.target.parentNode.parentNode.parentNode.parentNode.parentNode.attributes.class.nodeValue.indexOf("dropdown-content") == -1) || event.target.attributes.class.nodeValue.indexOf("dropdown-toggle") > -1) {
                //        $(element).find('.dropdown-content').slideUp();
                //        show = false;
                //        $(document).unbind('click', hideDropdown);
                //    }
                //}
                //
                //$(element).on('click', '.dropdown-toggle', function (event) {
                //    //event.stopPropagation();
                //    //event.preventDefault();
                //    $(element).find('.dropdown-content').slideToggle();
                //    show = !show;
                //    if (show) {
                //        setTimeout(function () {
                //            $(document).on('click', hideDropdown);
                //        }, 100);
                //    }
                //});
                //
                //$(element).on('click', '.dropdown-close', function (e) {
                //    e.stopPropagation();
                //    e.preventDefault();
                //    $(element).find('.dropdown-content').slideUp();
                //    show = false;
                //    $(document).unbind('click', hideDropdown);
                //});

            }
        };
    }

    function chartDraw() {
        return {
            restrict: 'A',
            scope: {
                chartData: '=',
                fromDirectiveFn: '=method'
            },
            link: function postLink(scope, element, attrs) {
                scope.$watch('chartData', function (newValue, oldValue) {
                    if (newValue) {
                        setTimeout(function () {
                            scope.updateView();
                        }, 100)
                    }
                }, true);
                scope.updateView = function () {
                    $(element).highcharts({
                        chart: {
                            type: 'line',
                            style: {
                                fontFamily: 'Arial, Helvetica, sans-serif', // default font
                                fontSize: '12px'
                            },
                            zoomType: scope.chartData.zoomType,
                            spacingTop: scope.chartData.spacingTop,
                            spacingLeft: scope.chartData.spacingLeft,
                            spacingRight: scope.chartData.spacingRight,
                            borderColor: scope.chartData.borderColor,
                            borderWidth: scope.chartData.borderWidth,
                            borderRadius: scope.chartData.borderRadius,
                            animation: {
                                duration: 300
                            }
                            //events: {
                            //    load: function(){
                            //        this.myTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                            //    }
                            //}
                        },
                        title: {
                            text: scope.chartData.title,
                            x: -20,
                            useHTML: Highcharts.hasBidiBug
                        },
                        subtitle: {
                            text: scope.chartData.subtitle,
                            x: -20
                        },
                        xAxis: {
                            categories: scope.chartData.xAxis,
                            //plotLines: scope.chartData.xPlotLines || [],
                            reversed: false || scope.chartData.reversed,
                            tickWidth: 0,
                            labels: {
                                style: {
                                    fontFamily: 'Arial, Helvetica, sans-serif', // default font
                                    fontSize: '12px',
                                    color: '#adacac'
                                }
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        labels: {
                            align: 'right',
                            x: -10,
                            y: 0
                        },
                        yAxis: {
                            min: scope.chartData.valueMin,
                            max: scope.chartData.valueMax,
                            title: {
                                text: scope.chartData.yLabel,
                                align: 'high',
                                rotation: 0,
                                offset: -15,
                                y: -30,
                                x: scope.chartData.yAxisTitle || 0
                            },
                            plotLines: scope.chartData.yPLotLines || [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }],
                            opposite: true,
                            gridLineColor: '#ebebeb',
                            gridLineWidth: 1,
                            labels: {
                                style: {
                                    fontFamily: 'Arial',
                                    fontSize: '12px',
                                    color: '#adacac',
                                    direction: 'ltr'
                                },
                                align: 'left',
                                x: 0,
                                y: 0
                            }
                        },
                        legend: {
                            itemStyle: {
                                color: '#adacac',
                                fontSize: '16px',
                                fontFamily: '"esterebold", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif' // default font
                            },
                            symbolWidth: 8,
                            itemDistance: 30,
                            layout: 'horizontal',
                            align: 'left',
                            floating: true,
                            enabled: scope.chartData.legend,
                            verticalAlign: 'top',
                            borderWidth: 0,
                            useHTML: Highcharts.hasBidiBug,
                            rtl: true,
                            y: -50,
                            reversed: true,
                            x: 20,
                            navigation: {
                                activeColor: '#3E576F',
                                animation: true,
                                arrowSize: 12,
                                inactiveColor: '#CCC',
                                style: {
                                    fontWeight: 'bold',
                                    color: '#333',
                                    fontSize: '12px'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#e8e8e8',
                            shared: false,
                            useHTML: true,
                            borderRadius: 2,
                            shadow: false,
                            enabled: true,
                            formatter: scope.chartData.tooltip || function () {
                                if (!scope.chartData.tooltipManager) {
                                    var title = "סה״כ חיובים";
                                    var str = "<div class=\"chart-tooltip\"><table><thead><tr><th>" + title + "</th><th><span>₪</span>" + this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</th></tr></thead>";
                                    var l = scope.chartData.tooltips[this.series.index][this.point.x].length;
                                    for (var i = 0; i < l; i++) {
                                        str += "<tr><td><div>" + scope.chartData.tooltips[this.series.index][this.point.x][i].name + "</div></td><td><div><span>₪</span>" + scope.chartData.tooltips[this.series.index][this.point.x][i].Val.toString() + "</div></td></tr>";
                                    }
                                    str += "</table></div>";
                                    return (scope.chartData.tooltips[this.series.index][this.point.x].length > 0) ? str : 'אין נתונים';
                                } else {
                                    var title = "סה״כ משימות";
                                    var str = "<div class=\"chart-tooltip tooltipsManagerWrap\"><table><thead><tr><th>" + title + "</th><th>" + this.y.toString() + "</th></tr></thead>";
                                    var l = scope.chartData.tooltips[this.series.index][this.point.x].length;
                                    for (var i = 0; i < l; i++) {
                                        str += "<tr><td><div>" + scope.chartData.tooltips[this.series.index][this.point.x][i].name + "</div></td><td><div>" + scope.chartData.tooltips[this.series.index][this.point.x][i].Val.toString() + "</div></td></tr>";
                                    }
                                    str += "</table></div>";
                                    return (scope.chartData.tooltips[this.series.index][this.point.x].length > 0) ? str : 'אין נתונים';
                                }
                            }
                        },
                        plotOptions: {
                            line: {
                                animation: (scope.chartData.animation == false) ? false : true,
                                lineWidth: 2,
                                dataLabels: {
                                    align: 'center',
                                    enabled: (scope.chartData.plotOptions) ? false : true,
                                    y: -10,
                                    formatter: function () {
                                        return (this.y).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                                    }
                                },
                                enableMouseTracking: true
                            },
                            series: {
                                stickyTracking: false,
                                events: {
                                    // click: function(evt) {
                                    //     this.chart.myTooltip.refresh(evt.point, evt);
                                    // },
                                    // mouseOut: function() {
                                    //    this.chart.myTooltip.hide();
                                    // },
                                    legendItemClick: function (event) {
                                        var visibility = !this.visible ? 'visible' : 'hidden';
                                        if (visibility === 'visible') {
                                            scope.fromDirectiveFn(visibility, event.target.name);
                                        }
                                        return;
                                    }
                                }
                                // point: {
                                //     events: {
                                //         mouseOver: function (evt) {
                                //        //  this.series.chart.myTooltip.refresh(evt.currentTarget, evt);
                                //         }
                                //     }
                                // }
                            }
                        },
                        navigation: {
                            useHTML: Highcharts.hasBidiBug,
                            buttonOptions: {
                                align: 'right',
                                verticalAlign: 'top',
                                y: -45,
                                x: -10,
                                useHTML: Highcharts.hasBidiBug
                            },
                            menuItemStyle: {
                                fontWeight: 'normal',
                                background: 'none',
                                color: '#1387a9'
                            },
                            menuItemHoverStyle: {
                                background: '#1387a9',
                                color: '#fff'
                            }
                        },
                        series: scope.chartData.data
                    });
                };
            }
        }
    }

    function chartDrawNew() {
        return {
            restrict: 'A',
            scope: {
                chartData: '='
            },
            link: function postLink(scope, element, attrs) {
                scope.$watch('chartData', function (newValue, oldValue) {
                    if (newValue) {
                        setTimeout(function () {
                            scope.updateView();
                        }, 100)
                    }
                }, true);
                scope.updateView = function () {
                    $(element).highcharts({
                        chart: {
                            backgroundColor: 'transparent',
                            type: 'line',
                            style: {
                                fontFamily: 'Arial, Helvetica, sans-serif', // default font
                                fontSize: '12px'
                            },
                            zoomType: scope.chartData.zoomType,
                            spacingTop: scope.chartData.spacingTop,
                            spacingLeft: scope.chartData.spacingLeft,
                            spacingRight: scope.chartData.spacingRight,
                            borderColor: scope.chartData.borderColor,
                            borderWidth: scope.chartData.borderWidth,
                            borderRadius: scope.chartData.borderRadius,
                            animation: {
                                duration: 40
                            }
                            //events: {
                            //    load: function(){
                            //        this.myTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                            //    }
                            //}
                        },
                        title: {
                            text: scope.chartData.title,
                            x: -20,
                            useHTML: Highcharts.hasBidiBug
                        },
                        subtitle: {
                            text: scope.chartData.subtitle,
                            x: -20
                        },
                        xAxis: {
                            categories: scope.chartData.xAxis,
                            reversed: false,
                            tickWidth: 0,
                            labels: {
                                style: {
                                    fontFamily: 'esterebold, Arial, Helvetica, sans-serif',
                                    fontSize: '15px',
                                    color: '#75777b'
                                }
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        labels: {
                            align: 'left',
                            x: -10,
                            y: 0
                        },
                        yAxis: {
                            min: scope.chartData.valueMin,
                            max: scope.chartData.valueMax,
                            title: {
                                text: scope.chartData.yLabel,
                                align: 'high',
                                rotation: 0,
                                offset: -15,
                                y: -30,
                                x: 0,
                                style: {
                                    fontFamily: 'esterregular, Arial',
                                    fontSize: '13px',
                                    color: '#75777b'
                                }
                            },
                            plotLines: scope.chartData.yPLotLines || [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }],
                            opposite: false,
                            gridLineColor: '#ebebeb',
                            gridLineWidth: 1,
                            labels: {
                                style: {
                                    fontFamily: 'esterregular, Arial',
                                    fontSize: '15px',
                                    color: '#adacac',
                                    direction: 'ltr'
                                },
                                align: 'left',
                                x: -40,
                                y: 0
                            }
                        },
                        legend: {
                            itemStyle: {
                                color: '#adacac',
                                fontSize: '16px',
                                fontFamily: '"esterebold", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif' // default font
                            },
                            symbolWidth: 8,
                            itemDistance: 30,
                            layout: 'horizontal',
                            align: 'left',
                            floating: true,
                            enabled: scope.chartData.legend,
                            verticalAlign: 'top',
                            borderWidth: 0,
                            useHTML: Highcharts.hasBidiBug,
                            rtl: false,
                            y: -50,
                            reversed: false,
                            x: 0,
                            navigation: {
                                activeColor: '#3E576F',
                                animation: true,
                                arrowSize: 12,
                                inactiveColor: '#CCC',
                                style: {
                                    fontWeight: 'bold',
                                    color: '#333',
                                    fontSize: '12px'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#e8e8e8',
                            shared: false,
                            useHTML: true,
                            borderRadius: 2,
                            shadow: false,
                            enabled: true,
                            formatter: scope.chartData.tooltip || function () {
                                if (!scope.chartData.tooltipManager) {
                                    var title = "סה״כ חיובים";
                                    var str = "<div class=\"chart-tooltip\"><table><thead><tr><th>" + title + "</th><th><span>₪</span>" + this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</th></tr></thead>";
                                    var l = scope.chartData.tooltips[this.series.index][this.point.x].length;
                                    for (var i = 0; i < l; i++) {
                                        str += "<tr><td><div>" + scope.chartData.tooltips[this.series.index][this.point.x][i].name + "</div></td><td><div><span>₪</span>" + scope.chartData.tooltips[this.series.index][this.point.x][i].Val.toString() + "</div></td></tr>";
                                    }
                                    str += "</table></div>";
                                    return (scope.chartData.tooltips[this.series.index][this.point.x].length > 0) ? str : 'אין נתונים';
                                } else {
                                    var title = "סה״כ משימות";
                                    var str = "<div class=\"chart-tooltip tooltipsManagerWrap\"><table><thead><tr><th>" + title + "</th><th>" + this.y.toString() + "</th></tr></thead>";
                                    var l = scope.chartData.tooltips[this.series.index][this.point.x].length;
                                    for (var i = 0; i < l; i++) {
                                        str += "<tr><td><div>" + scope.chartData.tooltips[this.series.index][this.point.x][i].name + "</div></td><td><div>" + scope.chartData.tooltips[this.series.index][this.point.x][i].Val.toString() + "</div></td></tr>";
                                    }
                                    str += "</table></div>";
                                    return (scope.chartData.tooltips[this.series.index][this.point.x].length > 0) ? str : 'אין נתונים';
                                }
                            }
                        },
                        plotOptions: {
                            series: {
                                marker: {
                                    radius: 6,
                                    fillColor: '#1387a9',
                                    lineWidth: 1,
                                    lineColor: "#1387a9"
                                }
                            },
                            line: {
                                animation: (scope.chartData.animation == false) ? false : true,
                                lineWidth: 2,
                                dataLabels: {
                                    align: 'center',
                                    enabled: (scope.chartData.plotOptions) ? false : true,
                                    y: -10,
                                    formatter: function () {
                                        return (this.y).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                                    }
                                },
                                enableMouseTracking: true
                            }
                            //series: {
                            //    stickyTracking: false,
                            //    events: {
                            //        click: function(evt) {
                            //            this.chart.myTooltip.refresh(evt.point, evt);
                            //        },
                            //        mouseOut: function() {
                            //           this.chart.myTooltip.hide();
                            //        }
                            //    },
                            //    point: {
                            //        events: {
                            //            mouseOver: function (evt) {
                            //           //  this.series.chart.myTooltip.refresh(evt.currentTarget, evt);
                            //            }
                            //        }
                            //    }
                            //}
                        },
                        navigation: {
                            useHTML: Highcharts.hasBidiBug,
                            buttonOptions: {
                                align: 'left',
                                verticalAlign: 'top',
                                y: -45,
                                x: -10,
                                useHTML: Highcharts.hasBidiBug
                            },
                            menuItemStyle: {
                                fontWeight: 'normal',
                                background: 'none',
                                color: '#1387a9'
                            },
                            menuItemHoverStyle: {
                                background: '#1387a9',
                                color: '#fff'
                            }
                        },
                        series: scope.chartData.data
                    });
                };
            }
        }
    }

    function chartDrawScroll() {
        return {
            restrict: 'A',
            scope: {
                chartDataSrc: '='
            },
            link: function postLink(scope, element, attrs) {
                scope.$watch('chartDataSrc', function (newValue, oldValue) {
                    if (newValue) {
                        setTimeout(function () {
                            scope.updateView();
                        }, 100)
                    }
                }, true);
                scope.updateView = function () {
                    Highcharts.setOptions({
                        lang: {
                            shortMonths: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
                        },
                        global: {
                            useUTC: true
                        }
                    });
                    $(element).highcharts('StockChart', {
                        chart: {
                            type: 'line',
                            style: {
                                fontFamily: 'Arial, Helvetica, sans-serif', // default font
                                fontSize: '12px'
                            },
                            "spacingTop": 55,
                            "spacingLeft": 0,
                            "spacingRight": 0,
                            "borderColor": "#d8d8d8",
                            "borderWidth": 1,
                            "borderRadius": 3,
                            "legend": true,
                            "xAxis": false,
                            "reversed": false,
                            "yLabel": "סה״כ בש״ח",
                            animation: {
                                duration: 300
                            }
                        },
                        rangeSelector: {
                            inputPosition: {
                                x: -150,
                                y: -10
                            },
                            buttonPosition: {
                                x: -10,
                                y: 50
                            },
                            buttonTheme: { // styles for the buttons
                                fill: 'none',
                                stroke: 'none',
                                'stroke-width': 0,
                                width: 80,
                                r: 8,
                                style: {
                                    color: '#039',
                                    fontWeight: 'bold'
                                },
                                states: {
                                    hover: {},
                                    select: {
                                        fill: '#039',
                                        style: {
                                            color: 'white'
                                        }
                                    }
                                }
                            },
                            inputBoxBorderColor: 'gray',
                            inputBoxWidth: 120,
                            inputBoxHeight: 18,
                            inputStyle: {
                                color: '#039',
                                fontWeight: 'bold'
                            },
                            labelStyle: {
                                color: 'silver',
                                fontWeight: 'bold'
                            },
                            enabled: true,
                            allButtonsEnabled: true,
                            buttons: [{
                                type: 'week',
                                count: 1,
                                text: 'שבוע'
                            }, {
                                type: 'month',
                                count: 1,
                                text: 'חודש'
                            }],
                            selected: 0
                        },
                        title: {
                            text: scope.chartDataSrc.title,
                            x: -20,
                            useHTML: Highcharts.hasBidiBug
                        },
                        subtitle: {
                            text: scope.chartDataSrc.subtitle,
                            x: -20
                        },
                        navigator: {
                            enabled: true
                        },
                        xAxis: {
                            type: 'datetime',
                            reversed: false,
                            tickWidth: 0,
                            labels: {
                                style: {
                                    fontFamily: 'Arial, Helvetica, sans-serif', // default font
                                    fontSize: '12px',
                                    color: '#adacac'
                                }
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        labels: {
                            align: 'left',
                            x: -10,
                            y: 0
                        },
                        yAxis: {
                            reversed: false,
                            showFirstLabel: true,
                            showLastLabel: true,
                            min: scope.chartDataSrc.valueMin,
                            max: scope.chartDataSrc.valueMax,
                            title: {
                                text: scope.chartDataSrc.yLabel,
                                align: 'high',
                                rotation: 0,
                                offset: -15,
                                y: -30,
                                x: scope.chartDataSrc.yAxisTitle || 0,
                                useHTML: Highcharts.hasBidiBug
                            },
                            plotLines: scope.chartDataSrc.yPLotLines || [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }],
                            opposite: true,
                            gridLineColor: '#ebebeb',
                            gridLineWidth: 1,
                            labels: {
                                style: {
                                    fontFamily: 'Arial',
                                    fontSize: '12px',
                                    color: '#adacac',
                                    direction: 'ltr'
                                },
                                align: 'left',
                                x: 0,
                                y: 0
                            }
                        },
                        scrollbar: {
                            barBackgroundColor: '#8a8a8a',
                            barBorderRadius: 0,
                            barBorderWidth: 0,
                            buttonBackgroundColor: '#4e4d4d',
                            buttonBorderWidth: 0,
                            buttonBorderRadius: 0,
                            trackBackgroundColor: '#e6e6e6',
                            trackBorderWidth: 1,
                            trackBorderRadius: 0,
                            trackBorderColor: '#8a8a8a'
                        },
                        legend: {
                            itemStyle: {
                                color: '#adacac',
                                fontSize: '16px',
                                fontFamily: '"esterebold", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif'
                            },
                            symbolWidth: 8,
                            itemDistance: 30,
                            layout: 'horizontal',
                            align: 'left',
                            floating: true,
                            enabled: scope.chartDataSrc.legend,
                            verticalAlign: 'top',
                            borderWidth: 0,
                            useHTML: Highcharts.hasBidiBug,
                            rtl: true,
                            y: -50,
                            reversed: true,
                            x: 20,
                            navigation: {
                                activeColor: '#3E576F',
                                animation: true,
                                arrowSize: 12,
                                inactiveColor: '#CCC',
                                style: {
                                    fontWeight: 'bold',
                                    color: '#333',
                                    fontSize: '12px'
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#e8e8e8',
                            shared: false,
                            useHTML: true,
                            borderRadius: 2,
                            shadow: false,
                            enabled: true,
                            formatter: function () {
                                var title = "סה״כ חיובים";
                                var str = "<div class=\"chart-tooltip\"><table><thead><tr><th>" + title + "</th><th><span>₪</span>" + this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</th></tr></thead>";
                                var l = scope.chartDataSrc.tooltips[this.series.index][this.point.index].length;

                                for (var i = 0; i < l; i++) {
                                    str += "<tr><td><div>" + scope.chartDataSrc.tooltips[this.series.index][this.point.index][i].name + "</div></td><td><div><span>₪</span>" + scope.chartDataSrc.tooltips[this.series.index][this.point.index][i].Val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</div></td></tr>";
                                }
                                str += "</table></div>";
                                return (scope.chartDataSrc.tooltips[this.series.index][this.point.index].length > 0) ? str : 'אין נתונים';
                            }

                        },
                        plotOptions: {
                            series: {
                                compare: 'percent'
                            },
                            line: {
                                animation: (scope.chartDataSrc.animation == false) ? false : true,
                                lineWidth: 2,
                                dataLabels: {
                                    align: 'center',
                                    enabled: (scope.chartDataSrc.plotOptions) ? false : true,
                                    y: -5,
                                    formatter: function () {
                                        if (this.y == 0) {
                                            return "";
                                        } else {
                                            return (this.y).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                                        }
                                    }
                                },
                                enableMouseTracking: true
                            }
                        },
                        navigation: {
                            useHTML: Highcharts.hasBidiBug,
                            buttonOptions: {
                                align: 'right',
                                verticalAlign: 'top',
                                y: -45,
                                x: -10,
                                useHTML: Highcharts.hasBidiBug
                            },
                            menuItemStyle: {
                                fontWeight: 'normal',
                                background: 'none',
                                color: '#1387a9'
                            },
                            menuItemHoverStyle: {
                                background: '#1387a9',
                                color: '#fff'
                            }
                        },

                        series: scope.chartDataSrc.data
                    }, function (chart) {
                        setTimeout(function () {
                            chart.rangeSelector.inputGroup.element.children[0].innerHTML = '';
                            chart.rangeSelector.inputGroup.element.children[2].innerHTML = '';
                            chart.rangeSelector.zoomText.element.innerHTML = "";
                            $('input.highcharts-range-selector', $(chart.container).parent()).datepicker();
                        }, 0);
                    });
                    $.datepicker.setDefaults({
                        dateFormat: 'yy-mm-dd',
                        onSelect: function () {
                            this.onchange();
                            this.onblur();
                        }
                    });
                };
            }
        }
    }

    function datePicker() {
        'use strict';
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).datepicker({
                    showOn: "button",
                    buttonImage: "image/calendar.gif",
                    buttonImageOnly: true
                });

                scope.$watch(function () {
                    return $(element).val()
                }, function (newValue, oldValue) {
                    if (newValue) {
                        if ($(element).attr('name') == 'fromDatePicker') {
                            scope.datesPicker.fromDatePicker = newValue;
                        }
                        if ($(element).attr('name') == 'toDatePicker') {
                            scope.datesPicker.toDatePicker = newValue;
                        }
                    }
                });
            }
        }
    }

    function datePickerInline() {
        'use strict';
        return {
            restrict: 'A',
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    inline: true,
                    minDate: new Date(),
                    defaultDate: new Date(),
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            if (attr.names == 'datePickerInlineDeletedComapny') {
                                scope.appData.datePickerInlineDeletedComapny = dateText;
                            }
                        });
                    }
                });
            }
        }
    }

    function datePickerTazrim() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                calendar: '='
            },
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    minDate: new Date(),
                    buttonImageOnly: false,
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                        });
                    }
                });
                scope.$watch('calendar', function (newVal, oldVal) {
                    if (newVal == false) {
                        $(element).datepicker("enable");
                    } else {
                        $(element).datepicker("disable");
                    }
                }, true);
            }
        }
    }

    function datePickerTazrimAdd() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    showOn: "button",
                    buttonImage: "image/calendar.gif",
                    buttonImageOnly: true,
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                        });
                    }
                });
            }
        }
    }

    function datePickerDays() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    maxDate: new Date(),
                    showOn: "button",
                    buttonImage: "image/calendar.gif",
                    buttonImageOnly: true,
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                        });
                    }
                });
            }
        }
    }

    function datePickerSetDate() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    showOn: "button",
                    buttonImage: "image/calendar.gif",
                    buttonImageOnly: true,
                    defaultDate: new Date(),
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                        });
                    }
                });
            }
        }
    }

    function datePickerSetDateEx() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    showOn: "button",
                    buttonImage: "image/calendar.gif",
                    buttonImageOnly: true,
                    defaultDate: null,
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                            scope.appData.dataCompanyDet.EXPIRATION_DATE = dateText;
                        });
                    }
                });
            }
        }
    }

    function datePickerTazrimMin() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    minDate: new Date(),
                    showOn: "button",
                    buttonImage: "image/calendar.gif",
                    buttonImageOnly: true,
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                        });
                    }
                });
            }
        }
    }

    function datePickerTazrimAddRow() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                var data = '';
                var SelectedDates = {};

                function dateSetHighlight() {
                    scope.appData.dataHmlaza.forEach(function (v) {
                        if (v.ind_hariga == true) {
                            var dates = v.date_value.split('/');
                            SelectedDates[new Date(dates[1] + '/' + dates[0] + '/' + dates[2])] = new Date(dates[1] + '/' + dates[0] + '/' + dates[2]);
                        }
                    })
                };

                function dateSetHamlaza1() {
                    var dfd = jQuery.Deferred();
                    scope.appData.dataHmlaza.forEach(function (v) {
                        if (v.date_value == scope.appData.dataAddRow.day_id) {
                            //console.log(scope.getTotal(v.zefi_itrat_sgira))
                            dfd.resolve(scope.getTotal(v.zefi_itrat_sgira));
                        }
                    })
                    return dfd.promise();
                };

                function appendText() {
                    $.when(dateSetHamlaza1()).then(function (sums) {
                        setTimeout(function () {
                            $('#ui-datepicker-div').append('<div class="sumHam"><p>צפי יתרה לתאריך נבחר</p> &#8362; ' + sums + '</div><div class="buttonsPopTazrim"><button class="close">בחירה</button><button class="close cancel">ביטול</button></div>');
                            $(".close").on('click', function () {
                                $('#ui-datepicker-div').hide();
                            });
                        }, 50);
                    })
                }

                $(element).on('focus click', function () {
                    $(this).blur();
                    setTimeout(function () {
                        $('#ui-datepicker-div').show();
                    }, 50)
                });
                $(document).on("click", function (e) {
                    var ele = $(e.toElement);
                    if (!ele.hasClass("hasDatepicker") && !ele.hasClass("ui-datepicker") && !ele.hasClass("ui-icon") && !$(ele).parent().parents(".ui-datepicker").length) {
                        $('#ui-datepicker-div').hide();
                    }
                });
                $(element).datepicker({
                    minDate: new Date(),
                    onSelect: function (dateText, inst) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                            scope.appData.dataAddRow.day_id = dateText;
                        });
                        appendText();
                        inst.inline = true;
                    },
                    beforeShow: function (input, inst) {
                        var dates = input.value.split('/')[2] + ("0" + (input.value.split('/')[1])).slice(-2);
                        scope.initDateDef(dates);

                        setTimeout(function () {
                            inst.currentYear = input.value.split('/')[2];
                            inst.currentMonth = input.value.split('/')[1] - 1;
                            inst.currentDay = parseInt(scope.appData.dataAddRow.day_id.split('/')[0]);
                            dateSetHighlight()
                            appendText();
                        }, 500)
                        $('#ui-datepicker-div').addClass('datepickerPopTazrim');
                    },
                    beforeShowDay: function (date) {
                        var Highlight = SelectedDates[date];
                        if (Highlight) {
                            return [true, 'Highlighted', ''];
                        } else {
                            return [true, '', ''];
                        }
                    },
                    onChangeMonthYear: function (year, month, inst) {
                        var dates = year + ("0" + (month)).slice(-2);
                        scope.initDateDef(dates);

                        setTimeout(function () {
                            $(element).val(scope.appData.dataAddRow.day_id);
                            inst.currentYear = year;
                            inst.currentMonth = month - 1;
                            inst.currentDay = parseInt(scope.appData.dataAddRow.day_id.split('/')[0]);
                            dateSetHighlight()
                            $(element).datepicker("refresh");
                            appendText();
                            //var datesSet = new Date(year, month - 1, parseInt(scope.appData.dataAddRow.day_id.split('/')[0]));
                            //inst.settings.beforeShowDay(datesSet, parseInt(scope.appData.dataAddRow.day_id.split('/')[0]))
                        }, 500)
                        inst.inline = true;
                    }
                });
            }
        }
    }

    function datePickerTazrimAddRowHa() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                var SelectedDates = {};
                $(element).on('focus click', function () {
                    $(this).blur();
                    setTimeout(function () {
                        $('#ui-datepicker-div').show();
                    }, 50)
                });
                $(document).on("click", function (e) {
                    var ele = $(e.toElement);
                    if (!ele.hasClass("hasDatepicker") && !ele.hasClass("ui-datepicker") && !ele.hasClass("ui-icon") && !$(ele).parent().parents(".ui-datepicker").length) {
                        $('#ui-datepicker-div').hide();
                    }
                });

                function dateSetHighlight() {
                    scope.appData.dataHmlaza.forEach(function (v) {
                        if (v.ind_hariga == true) {
                            var dates = v.date_value.split('/');
                            SelectedDates[new Date(dates[1] + '/' + dates[0] + '/' + dates[2])] = new Date(dates[1] + '/' + dates[0] + '/' + dates[2]);
                        }
                    })
                };
                $(element).datepicker({
                    minDate: new Date(),
                    onSelect: function (dateText, inst) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                        });
                    },
                    beforeShowDay: function (date) {
                        var Highlight = SelectedDates[date];
                        if (Highlight) {
                            return [true, 'Highlighted', ''];
                        } else {
                            return [true, '', ''];
                        }
                    },
                    onChangeMonthYear: function (year, month, inst) {
                        var dates = year + ("0" + (month)).slice(-2);
                        scope.initDateDef(dates);
                        setTimeout(function () {
                            dateSetHighlight()
                            $(element).datepicker("refresh");
                        }, 500)
                    },
                    beforeShow: function (input, inst) {
                        var dates = input.value.split('/')[2] + ("0" + (input.value.split('/')[1])).slice(-2);
                        scope.initDateDef(dates);

                        setTimeout(function () {
                            dateSetHighlight()
                        }, 500)
                        $('#ui-datepicker-div').addClass('datepickerPopTazrim');
                    }
                });
            }
        }
    }

    function datePickerSetDatePop() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    showOn: "button",
                    buttonImage: "image/calendar.gif",
                    buttonImageOnly: true,
                    defaultDate: null,
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                        });
                    }
                });
            }
        }
    }

    function datePickerSetDatePopSetMonth() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                function monthDiff(d1, d2) {
                    var months;
                    months = (d2.getFullYear() - d1.getFullYear()) * 12;
                    months -= d1.getMonth();
                    months += d2.getMonth() + 1;
                    return months <= 0 ? 0 : months;
                }

                $(element).datepicker({
                    showOn: "button",
                    minDate: new Date(),
                    buttonImage: "image/calendar.gif",
                    buttonImageOnly: true,
                    defaultDate: null,
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            // var dateFirst = scope.appData.billingAccountCheckNowDate;
                            // var dateParseFirst = new Date(parseFloat(dateFirst.split("/")[2]), parseFloat(dateFirst.split("/")[1]) - 1, parseFloat(dateFirst.split("/")[0]));
                            // var dateParseLast = new Date(parseFloat(dateText.split("/")[2]), parseFloat(dateText.split("/")[1]) - 1, parseFloat(dateText.split("/")[0]));
                            // var monthBetween = monthDiff(dateParseFirst, dateParseLast);
                            // if (monthBetween > 0) {
                            // 	var sum = Number(scope.appData.billingAccountCheckNowSum) * monthBetween;
                            // 	if (sum.toString().indexOf(".") !== -1) {
                            // 		if (scope.appData.billingAccountCheckNow) {
                            // 			scope.appData.billingAccountCheckNow.Cheque_Sum = sum.toString().split('.')[0] + "." + sum.toString().split('.')[1].substr(0, 1);
                            // 		}
                            // 		if (scope.appData.billingAccountTranferNow) {
                            // 			scope.appData.billingAccountTranferNow.customPay_Sum = sum.toString().split('.')[0] + "." + sum.toString().split('.')[1].substr(0, 1);
                            // 		}
                            // 	}
                            // 	else {
                            // 		if (scope.appData.billingAccountCheckNow) {
                            // 			scope.appData.billingAccountCheckNow.Cheque_Sum = sum.toString();
                            // 		}
                            // 		if (scope.appData.billingAccountTranferNow) {
                            // 			scope.appData.billingAccountTranferNow.customPay_Sum = sum.toString();
                            // 		}
                            // 	}
                            // }
                            ngModel.$setViewValue(dateText);
                        });
                    }
                });
            }
        }
    }

    function datePickerAll() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    buttonImageOnly: false,
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                        });
                    }
                });
            }
        }
    }


    function datePickerAllChangeMonthYear() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attr, ngModel) {
                $(element).datepicker({
                    buttonImageOnly: false,
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function (dateText) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(dateText);
                        });
                    }
                });
            }
        }
    }


    function tooltips() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    position: {
                        my: "center bottom-10",
                        at: "center top",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        callback($(this).prop('title').replace(new RegExp("\\|", "g"), '</div><div>'));
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    //open: function (event, ui) {
                    //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                    //},
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();
                    }
                });

                //scope.$watch('filteredTransactions', function (newVal, oldVal) {
                //    if (newVal) {
                //        $("[title]").tooltip({
                //            position: {
                //                using: function (position, feedback) {
                //                    $(this).css(position);
                //                    $("<div>")
                //                      .addClass("arrow")
                //                      .addClass(feedback.vertical)
                //                      .addClass(feedback.horizontal)
                //                      .appendTo(this);
                //                }
                //            }
                //        });
                //    }
                //});
            }
        }
    }

    function tooltipsTazrim() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    tooltipClass: "ui-tooltip1",
                    position: {
                        my: "center bottom-10",
                        at: "center top",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        callback($(this).prop('title').replace(new RegExp("\\|", "g"), '</div><div>'));
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    //open: function (event, ui) {
                    //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                    //},
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();

                    }
                });
            }
        }
    }

    function tooltipsWhite() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    tooltipClass: "ui-tooltip-white",
                    position: {
                        my: "center bottom-10",
                        at: "center top",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        callback($(this).prop('title').replace(new RegExp("\\|", "g"), '</div><div>'));
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    //open: function (event, ui) {
                    //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                    //},
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();

                    }
                });
            }
        }
    }

    function tooltipsWhiteBanks() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    items: "[tooltip]",
                    tooltipClass: "ui-tooltip-white",
                    position: {
                        my: "center bottom-10",
                        at: "center top",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        var json = JSON.parse($(this).attr('tooltip'));
                        var date = json.date_updated.split(" ");
                        var data = '<div class="tooltipBanksWhite"><p class="titlesBanksAll titlesBanksAllTooltip">' +
                            '<i class="bank' + json.bank_id + '"></i>' +
                            json.company_account_nickname +
                            '</p>' +
                            '<p class="rowBank">עדכון אחרון:' +
                            '<span style="display: inline-block; direction: rtl;">' +
                            date[0] + " " + date[1].split(":")[0] + ":" + date[1].split(":")[1] +
                            '</span>' +
                            '</p>' +
                            '<p class="rowBank">יתרה לשימוש:' +
                            '<span style="direction: ltr;">' +
                            '₪' + json.balance_use +
                            '</span>' +
                            '</p></div>';

                        callback(data.replace(new RegExp("\\|", "g"), '</div><div>'));
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();

                    }
                });
            }
        }
    }

    function tooltipsTazrimElipsis() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element)
                    .tooltip({
                        items: "[tooltip]",
                        tooltipClass: "ui-tooltip1",
                        position: {
                            my: "center bottom-10",
                            at: "center top",
                            using: function (position, feedback) {
                                $(this).css(position);
                                $("<div>")
                                    .addClass("arrow")
                                    .addClass(feedback.vertical)
                                    .addClass(feedback.horizontal)
                                    .appendTo(this);
                            }
                        },
                        content: function (callback) {
                            var toolInput = this.children[0];
                            if ((toolInput.offsetWidth < toolInput.scrollWidth) == true) {
                                callback($(this).attr('tooltip').replace(new RegExp("\\|", "g"), '</div><div>'));
                            }
                        },
                        show: {
                            delay: 800,
                            duration: 10
                        },
                        //open: function (event, ui) {
                        //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                        //},
                        close: function (event, ui) {
                            $(".ui-tooltip").remove();
                        }
                    });
            }
        }
    }

    function tooltipsAccElipsis() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element)
                    .tooltip({
                        items: "[tooltip]",
                        tooltipClass: "ui-tooltip1",
                        position: {
                            my: "center bottom-10",
                            at: "center top",
                            using: function (position, feedback) {
                                $(this).css(position);
                                $("<div>")
                                    .addClass("arrow")
                                    .addClass(feedback.vertical)
                                    .addClass(feedback.horizontal)
                                    .appendTo(this);
                            }
                        },
                        content: function (callback) {
                            var toolInput = this.children[0];
                            if ((toolInput.offsetWidth < toolInput.scrollWidth) == true) {
                                callback($(this).attr('tooltip').replace(new RegExp("\\|", "g"), '</div><div>'));
                            }
                        },
                        show: {
                            delay: 800,
                            duration: 10
                        },
                        //open: function (event, ui) {
                        //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                        //},
                        close: function (event, ui) {
                            $(".ui-tooltip").remove();

                        }
                    });
            }
        }
    }

    function tooltipsAccElipsisHover() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element)
                    .tooltip({
                        items: "[tooltip]",
                        tooltipClass: "ui-tooltip1",
                        position: {
                            my: "center bottom-10",
                            at: "center top",
                            using: function (position, feedback) {
                                $(this).css(position);
                                $("<div>")
                                    .addClass("arrow")
                                    .addClass(feedback.vertical)
                                    .addClass(feedback.horizontal)
                                    .appendTo(this);
                            }
                        },
                        content: function (callback) {
                            var toolInput = this.children[0];
                            if ((toolInput.offsetWidth < toolInput.scrollWidth) == true) {
                                callback($(this).attr('tooltip').replace(new RegExp("\\|", "g"), '</div><div>').replace(new RegExp("\\,", "g"), '</div><div>'));
                            }
                        },
                        show: {
                            delay: 800,
                            duration: 10
                        },
                        open: function (event, ui) {
                            if (typeof (event.originalEvent) === 'undefined') {
                                return false;
                            }

                            var $id = $(ui.tooltip).attr('id');

                            // close any lingering tooltips
                            $('div.ui-tooltip').not('#' + $id).remove();

                            // ajax function to pull in data and add it to the tooltip goes here
                        },
                        close: function (event, ui) {
                            ui.tooltip.hover(function () {
                                    $(this).stop(true).fadeTo(400, 1);
                                },
                                function () {
                                    $(this).fadeOut('400', function () {
                                        $(this).remove();
                                    });
                                });
                        }
                    });
            }
        }
    }

    function tooltipsMess() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    tooltipClass: "ui-tooltip1",
                    position: {
                        my: "center bottom-15",
                        at: "center bottom-15",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        callback($(this).prop('title').replace(new RegExp("\\|", "g"), '</div><div>'));
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    //open: function (event, ui) {
                    //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                    //},
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();

                    }
                });


            }
        }
    }

    function tooltipsReg() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    tooltipClass: "ui-tooltip1",
                    position: {
                        my: "center bottom-5",
                        at: "center bottom-5",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        callback($(this).prop('title').replace(new RegExp("\\|", "g"), '</div><div>'));
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    //open: function (event, ui) {
                    //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                    //},
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();

                    }
                });


            }
        }
    }

    function tooltipsCheck() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    tooltipClass: "ui-tooltip1",
                    position: {
                        my: "center top-30",
                        at: "center top-30",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        callback($(this).prop('title').replace(new RegExp("\\|", "g"), '</div><div>'));
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    //open: function (event, ui) {
                    //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                    //},
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();

                    }
                });


            }
        }
    }

    function tooltipsElipsis() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    items: "[tooltip]",
                    tooltipClass: "ui-tooltip1",
                    position: {
                        my: "center bottom-10",
                        at: "center top",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        var toolInput = this;
                        if ((toolInput.offsetWidth < toolInput.scrollWidth) == true) {
                            callback($(this).attr('tooltip').replace(new RegExp("\\|", "g"), '</div><div>'));
                        }
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    //open: function (event, ui) {
                    //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                    //},
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();

                    }
                });
            }
        }
    }

    function tooltipMenu() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    items: "[tooltip]",
                    tooltipClass: "ui-tooltip-right",
                    position: {
                        my: "center bottom-10",
                        at: "right top",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        if (scope.appData.mainNavClosed) {
                            callback($(this).attr('tooltip').replace(new RegExp("\\|", "g"), '</div><div>'));
                        }
                    },
                    show: {
                        delay: 800,
                        duration: 8
                    },
                    //open: function (event, ui) {
                    //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                    //},
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();

                    }
                });
            }
        }
    }

    function tooltipsElipsisTazrim() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    items: "[tooltip]",
                    tooltipClass: "ui-tooltip1",
                    position: {
                        my: "center bottom-10",
                        at: "center top",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        var toolInput = this;
                        if ((toolInput.offsetWidth < toolInput.scrollWidth) == true) {
                            callback($(this).attr('tooltip').replace(new RegExp("\\|", "g"), '</div><div>'));
                        }
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    //open: function (event, ui) {
                    //	ui.tooltip.animate({top: ui.tooltip.position().top}, "fast");
                    //},
                    close: function (event, ui) {
                        $(".ui-tooltip").remove();

                    }
                });
            }
        }
    }

    function pieDraw($timeout) {
        return {
            restrict: 'A',
            scope: {
                pieData: '='
            },
            link: function postLink(scope, element, attrs) {
                scope.$watch(function () {
                    return ((element[0].className === 'pieToLoad' && element[0].className === 'active') || element[0].className !== 'pieToLoad') && scope.pieData;
                }, function (newValue) {
                    //console.log('active-----', newValue)
                    if (newValue) {
                        scope.updateView();
                    }
                }, true);
                scope.updateView = function () {
                    $(element).highcharts({
                        chart: {
                            type: 'pie',
                            spactingTop: 0,
                            spacingBottom: 0,
                            margin: [0, 0, 0, 0],
                            padding: [0, 0, 0, 0],
                            backgroundColor: 'transparent'
                        },
                        credits: {
                            enabled: false
                        },
                        colors: scope.pieData.colors,
                        title: scope.pieData.title,
                        plotOptions: {
                            pie: {
                                borderWidth: 0,
                                startAngle: 90,
                                innerSize: '72%',
                                size: '100%',
                                dataLabels: false
                            },
                            series: {
                                animation: {
                                    duration: 200
                                }
                            }
                        },
                        tooltip: {
                            formatter: scope.pieData.tooltip || null,
                            useHTML: true
                        },
                        series: [{
                            data: scope.pieData.data
                        }]
                    });
                };
            }
        }
    }

    function checkScroll() {
        return {
            link: function (scope, elem, attrs) {
                elem.on('scroll', function (e) {
                    var target = e.target;
                    var scrollPos = (target.scrollTop + target.offsetTop)
                    // console.log('scrollTop----', target.scrollTop)
                    // console.log('offsetHeight----', target.offsetHeight)
                    // console.log('scrollPos----', scrollPos)


                    var elemsChild = $(elem).find('.mini-pies > div');
                    if (elemsChild.length) {
                        elemsChild.each(function (i1, main) {
                            var pieCube = $(main).find('.pieCube');
                            if (pieCube.length) {
                                pieCube.each(function (i, v) {
                                    // var offsettop = $(v).offset().top - 89 - target.offsetTop;
                                    // if (i === 20) {
                                    //     // console.log('offsettop element correct :----', offsettop)
                                    //     // console.log('scroll scrollTop correct:', scrollPos)
                                    //     // console.log('UPthenconta', ($(v).offset().top - target.offsetTop + 40) < 0)
                                    //     // console.log('Down', (target.scrollTop+target.offsetHeight) > $(v).offset().top)
                                    //     // console.log('real offsetTop of element', ($(v).offset().top - target.offsetTop + 40))
                                    //     // console.log('offsetHeight', target.offsetHeight)
                                    //     // console.log('scrollTop', target.scrollTop)
                                    //     // console.log('offsetTop', target.offsetTop)
                                    //     // console.log('$(v).offset().top', $(v).offset().top)
                                    //     // console.log('out for up', ($(v).offset().top - target.offsetTop + 40) < 0)
                                    //     //
                                    //     // console.log(($(v).offset().top - target.offsetTop + 40) < (target.offsetHeight + 89))
                                    //     // var aaaa = (($(v).offset().top - target.offsetTop + 40) < (target.offsetHeight + 89)) && !(($(v).offset().top - target.offsetTop + 40) < 0);
                                    //     // console.log('------', aaaa)
                                    //     // if (aaaa) {
                                    //     //     $(v).children('div').eq(0).addClass('active').css('background', 'yellow')
                                    //     // } else {
                                    //     //     $(v).children('div').eq(0).removeClass('active').css('background', 'red').children('div').remove()
                                    //     // }
                                    //     // console.log('insideCon', ((target.scrollTop+target.offsetHeight) > $(v).offset().top) && (($(v).offset().top - target.offsetTop + 40) > 0))
                                    //     // var insideContainer = (((target.scrollTop+target.offsetHeight) > $(v).offset().top) && (($(v).offset().top - target.offsetTop + 40) > 0))
                                    //     // if (insideContainer) {
                                    //     //     $(v).children('div').eq(0).addClass('active').css('background', 'yellow')
                                    //     // } else {
                                    //     //     $(v).children('div').eq(0).removeClass('active').css('background', 'red').children('div').remove()
                                    //     // }
                                    //     // console.log('10smallthanscroll', offsettop < target.offsetTop)
                                    //     // console.log('10biggerthanscroll', scrollPos > offsettop + 89)
                                    //     // console.log('4isinsideCon', ((scrollPos > offsettop) && (($(v).offset().top - target.offsetTop + 40) < 0)))
                                    // }
                                    var insideContainer = (($(v).offset().top - target.offsetTop + 40) < (target.offsetHeight + 89)) && !(($(v).offset().top - target.offsetTop + 40) < 0);
                                    if (insideContainer) {
                                        $(v).children('div').eq(0).addClass('active')
                                    } else {
                                        $(v).children('div').eq(0).removeClass('active').children('div').remove()
                                    }
                                })
                            }
                        })
                        scope.$apply();
                    }
                })
            }
        }
    }

    function accoValid() {
        return {
            restrict: 'A',
            priority: 1,
            link: function postLink(scope, element, attrs) {

                var validated = null;

                function validate(field) {
                    if (field.value.length > 0) {
                        $(field).closest('.inputLogin').removeClass('has-error');
                        return true;
                    }
                    $(field).closest('.inputLogin').addClass('has-error');
                    return false;
                };

                function validateForm() {
                    validated = true;
                    var fields = $(element).find('input:not([type="submit"]):visible'), l = fields.length;
                    for (var i = 0; i < l; i++) {
                        if (!validate(fields[i]))
                            validated = false;
                    }
                    return validated;
                };

                $(element).on('blur', 'input:not([type="submit"]):visible', function (event) {
                    validate(event.target);
                });

                $(element).on('keyup', 'input:not([type="submit"]):visible', function (event) {
                    validate(event.target);
                });

                $(element).on('click', 'input[type="submit"]', function (event) {
                    if (validateForm()) {
                        scope.error = '';
                        scope.$apply(attrs.submit);
                    } else {
                        scope.error = 'יש למלא את שם המשתמש וסיסמה.';
                    }
                });

            }
        };
    }

    function focusNext() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).on('click', function (event) {
                    $(event.target.nextElementSibling).focus();
                });
            }
        };
    }

    //function messageLinks() {
    //    return {
    //        restrict: 'A',
    //        link: function postLink(scope, element, attrs) {
    //            scope.$watch('appData.selectedCompany.messages', function (newVal, oldVal) {
    //                if (newVal) {
    //                    $(element).find('span').on('click', function (e) {
    //                        var href = $(this).attr("href");
    //                        var popupType = href.split('?')[0].toString();
    //                        var token = href.split('?')[1].toString();
    //                        var account = href.split('?')[2].toString();
    //                        scope.updatePassword(popupType, token, account);
    //                    });
    //                }
    //            });
    //        }
    //    };
    //}
    function dialog() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attr) {
                //$("#dialog").dialog({
                //	dialogClass: 'noTitleStuff',
                //	autoOpen: false,
                //	draggable: false,
                //	position: {
                //		my: "top",
                //		at: "top"
                //	},
                //	width: 500,
                //	height: 60,
                //	show: {
                //		effect: "blind",
                //		duration: 100
                //	},
                //	hide: {
                //		effect: "blind",
                //		duration: 100
                //	},
                //	close: function (event, ui) {
                //		scope.appData.openDialog = false;
                //	}
                //});
                scope.$watch('appData.openDialog', function (newVal) {
                    if (newVal == true) {
                        $(".noTitleStuff").show().animate({top: "0px"}, 1000);
                        setTimeout(function () {
                            scope.$apply(function () {
                                scope.appData.openDialog = false;
                            })
                        }, 12000);
                    } else {
                        $(".noTitleStuff").animate({top: "-60px"}, 1000);
                        setTimeout(function () {
                            $(".noTitleStuff").hide()
                        }, 1000)
                    }
                });
            }
        }
    }

    function validbank() {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.validbank = function (modelValue, viewValue) {
                    if (scope.label.regValid) {
                        if (scope.label.regValid == 'lettresAndNumbers') {
                            if (INTEGER_REGEXP.test(viewValue)) {
                                return false;
                            }
                        }
                        if (scope.label.regValid == 'pass') {
                            if (passReg.test(viewValue)) {
                                return false;
                            }
                        }
                        if (scope.formReg.bank_user_name.$error.validbank && scope.formReg.bank_pass.$error.validbank) {
                            scope.$parent.state_enable = false;
                        } else {
                            scope.$parent.state_enable = true;
                        }
                    }
                };
            }
        };
    }

    function navSlider($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                initOnload: '@',
                data: '='
            },
            link: function (scope, element, attrs) {
                var initializeSlick, loadNav;
                loadNav = function () {
                    return $timeout(function () {
                        if (window.browserDetect.browser == 'Chrome') {
                            var scrollRig = ($('.match_peulot')[0].scrollWidth - $('.match_peulot')[0].clientWidth) - $('.match_peulot')[0].scrollLeft;
                            var witPage = $('.match_peulot')[0].scrollWidth - $('.match_peulot')[0].clientWidth;

                            var wit = 0;
                            $(".groupDateList").each(function (i, v) {
                                wit += $(this).outerWidth();
                                if (wit > scrollRig) {
                                    $(".date_sort_li_fixed").text($(this).find(".date_sort_li").text());
                                    console.log("iii: ", i);
                                    return false
                                }
                            });
                            //var scrollWidth = $('.match_peulot')[0].scrollWidth;
                            //var otherWidth = $('.funds-header').width() + 20;
                            if (($('.match_peulot')[0].scrollWidth <= $('.match_peulot')[0].clientWidth) && $('.match_peulot')[0].scrollLeft == 0) {
                                $(".nav-next, .nav-prev").hide();
                            } else {
                                //var scrollRight = ($(window).width() - ($('.groupDateList:first').offset().left + $('.groupDateList:first').outerWidth()));
                                //var scrollLeft = $('.groupDateList:last').offset().left;
                                $(".nav-next, .nav-prev").show();

                                if ($('.match_peulot')[0].scrollLeft == 0) {
                                    $('.nav-next').hide();
                                } else {
                                    $('.nav-next').show();
                                }

                                if (scrollRig == 0) {
                                    $('.nav-prev').hide();
                                } else {
                                    $('.nav-prev').show();
                                }
                            }
                        } else {
                            if (window.browserDetect.browser == 'Explorer') {
                                var scrollRig = $('.match_peulot')[0].scrollLeft;
                                var witPage = $('.match_peulot')[0].scrollWidth - $('.match_peulot')[0].clientWidth;
                                console.log(scrollRig, witPage);
                                var wit = 0;
                                $(".groupDateList").each(function (i, v) {
                                    wit += $(this).outerWidth();
                                    if (wit >= scrollRig) {
                                        $(".date_sort_li_fixed").text($(this).find(".date_sort_li").text());
                                        console.log("iii: ", i);
                                        return false
                                    }
                                });
                                if (($('.match_peulot')[0].scrollWidth <= $('.match_peulot')[0].clientWidth) && $('.match_peulot')[0].scrollLeft == 0) {
                                    $(".nav-next, .nav-prev").hide();
                                } else {
                                    $(".nav-next, .nav-prev").show();
                                    if (scrollRig == 0) {
                                        $('.nav-prev').hide();
                                        $('.nav-next').show();
                                    }
                                    if (($('.match_peulot')[0].scrollWidth - $('.match_peulot')[0].clientWidth) + scrollRig == 0) {
                                        $('.nav-prev').show();
                                        $('.nav-next').hide();
                                    }
                                }
                            } else {
                                var scrollRig = $('.match_peulot')[0].scrollLeft;
                                var witPage = $('.match_peulot')[0].scrollWidth - $('.match_peulot')[0].clientWidth;
                                console.log(scrollRig, witPage);
                                var wit = 0;
                                $(".groupDateList").each(function (i, v) {
                                    wit -= $(this).outerWidth();
                                    if (wit <= scrollRig) {
                                        $(".date_sort_li_fixed").text($(this).find(".date_sort_li").text());
                                        console.log("iii: ", i);
                                        return false
                                    }
                                });
                                if (($('.match_peulot')[0].scrollWidth <= $('.match_peulot')[0].clientWidth) && $('.match_peulot')[0].scrollLeft == 0) {
                                    $(".nav-next, .nav-prev").hide();
                                } else {
                                    $(".nav-next, .nav-prev").show();

                                    if (scrollRig == 0) {
                                        $('.nav-prev').hide();
                                        $('.nav-next').show();
                                    }

                                    if (($('.match_peulot')[0].scrollWidth - $('.match_peulot')[0].clientWidth) + scrollRig == 0) {
                                        $('.nav-prev').show();
                                        $('.nav-next').hide();
                                    }
                                }
                            }
                        }

                    }, 600);
                },
                    initializeSlick = function () {
                        return $timeout(function () {
                            var elems = $(element).find(".match_peulot");
                            elems.scroll(function () {
                                loadNav();
                            });
                            $(".nav-next").off('click');
                            $(".nav-next").on('click', function () {
                                var sum = "-=390px";
                                if (window.browserDetect.browser == 'Explorer') {
                                    sum = "+=390px";
                                }
                                $('.match_peulot').animate({
                                    scrollLeft: sum
                                }, 500);
                                loadNav();
                                return false;
                            });
                            $(".nav-prev").off('click');
                            $(".nav-prev").on('click', function () {
                                var sum = "+=390px";
                                if (window.browserDetect.browser == 'Explorer') {
                                    sum = "-=390px";
                                }
                                $('.match_peulot').animate({
                                    scrollLeft: sum
                                }, 500);
                                loadNav()
                                return false;
                            });
                            loadNav()
                        });
                    };
                if (scope.initOnload) {
                    return scope.$watch('data', function (newValue, oldValue) {
                        if (newValue && newValue !== 0 && (newValue !== oldValue)) {
                            initializeSlick();
                        }
                    });
                }
            }
        };
    }

    function checkUuid() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.format = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    if (val && val !== "") {
                        var token = viewValue.replace(/-/g, "").toUpperCase();
                        if (token.length === 0 || token.length === 32) {
                            return true;
                        } else {
                            return false
                        }
                    }
                    return true
                };
            }
        }
    }

    function numberOnly() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    if (val) {
                        ngModel.$setViewValue(val.toString().replace(/[^0-9.-]*/g, ''));
                        ngModel.$render();
                    }
                    return true;
                };
            }
        }
    }

    function numberOnlys() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                $(ele).keyup(function () {
                    var viewValue = ngModel.$viewValue;
                    if (viewValue !== undefined && viewValue !== "" && viewValue !== null) {
                        ngModel.$setViewValue(viewValue.replace(/[^\d]/g, ''));
                        ngModel.$render();
                    }
                });

                $(ele).off("blur");
                $(ele).on("blur", function () {
                    var viewValue = ngModel.$viewValue;
                    if (viewValue !== undefined && viewValue !== "" && viewValue !== null) {
                        ngModel.$setValidity('required', false);
                        ngModel.$setViewValue(viewValue.replace(/[^\d]/g, ''));
                        ngModel.$render();
                    } else {
                        ngModel.$setValidity('required', true);
                    }
                });
            }
        }
    }

    function numberOnlyAsmachta() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    if (val) {
                        ngModel.$setViewValue(val.toString().replace(/[^\d]/g, ''));
                        ngModel.$render();
                    }
                    return true;
                };
            }
        }
    }

    function sortableDrag($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                initOnload: '@',
                data: '='
            },
            link: function (scope, element, attrs) {
                var initializeSlick;
                initializeSlick = function () {
                    return $timeout(function () {
                        $('#sortable').sortable({
                            items: "li:not(.ui-state-disabled)"
                        });
                        $('#sortable').disableSelection();
                    });
                };
                if (scope.initOnload) {
                    return scope.$watch('data', function (newValue, oldValue) {
                        if (newValue && newValue !== 0 && (newValue !== oldValue)) {
                            initializeSlick();
                        }
                    });
                }
            }
        };
    }

    function navSliderMeuhad($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                initOnload: '@',
                data: '='
            },
            link: function (scope, element, attrs) {
                var initializeSlick, loadNav;
                loadNav = function () {
                    return $timeout(function () {
                        var scrollWidth = $('.scrollRightBottom')[0].scrollWidth;
                        var otherWidth = $('.funds-header').width();
                        if (scrollWidth <= otherWidth) {
                            //$(".bb-nav-next, .bb-nav-prev").hide();
                        } else {
                            var scrollRight = ($(window).width() - ($('.scrollRightBottom .ui-state-default:first').offset().left + $('.scrollRightBottom .ui-state-default:first').outerWidth()));
                            var scrollLeft = $('.ui-state-default:last').offset().left;

                            $(".bb-nav-next, .bb-nav-prev").show();

                            //if (scrollLeft == 23) {
                            //	$('.bb-nav-next').hide();
                            //}
                            //else {
                            //	$('.bb-nav-next').show();
                            //}
                            //
                            //if (scrollRight == 297) {
                            //	$('.bb-nav-prev').hide();
                            //}
                            //else {
                            //	$('.bb-nav-prev').show();
                            //}
                        }
                    }, 600);
                },
                    initializeSlick = function () {
                        return $timeout(function () {
                            var elems = $(element);
                            elems.scroll(function () {
                                $("#popUpTooltip").hide();
                                scope.$apply(function () {
                                    var scrollTop = element[0].scrollTop;
                                    if (scrollTop == 0) {
                                        scope.$parent.appData.pixelsScrolled = 0;
                                    } else {
                                        scope.$parent.appData.pixelsScrolled = (scrollTop - 50);
                                    }
                                })
                            });
                            $(".total_hacnasot > p, .total_hozaot > p").off('click');
                            $(".total_hacnasot > p, .total_hozaot > p").on("click", function () {
                                var $this = $(this);
                                var offset = $this.offset();
                                var peulot = $this.next(".peoulot");
                                if (peulot.length && peulot.text() !== "") {
                                    var elem = peulot.children("div").html();
                                    $("#popUpTooltip").show();
                                    var lengthTr = peulot.find("table tr").length;
                                    if (lengthTr < 5) {
                                        $("#popUpTooltip").removeClass("big").offset({
                                            top: offset.top - 140,
                                            left: offset.left - 100
                                        });
                                    } else {
                                        $("#popUpTooltip").addClass("big").offset({
                                            top: offset.top - 235,
                                            left: offset.left - 100
                                        });
                                    }
                                    $("#popUpTooltip > div").html(elem);
                                } else {
                                    $("#popUpTooltip").hide();
                                }
                            });
                            $('#closePopTooltip').off('click');
                            $('#closePopTooltip').on("click", function () {
                                $("#popUpTooltip").hide();
                            });
                            $(".bb-nav-next").off('click');
                            $(".bb-nav-next").on('click', function () {
                                $('.scrollRightBottom').animate({
                                    scrollLeft: "-=390px"
                                }, 500);
                                loadNav()
                                return false;
                            });
                            $(".bb-nav-prev").off('click');
                            $(".bb-nav-prev").on('click', function () {
                                $('.scrollRightBottom').animate({
                                    scrollLeft: "+=390px"
                                }, 500);
                                loadNav()
                                return false;
                            });
                            loadNav()
                        });
                    };

                return scope.$watch('$parent.$parent.initOnload', function (newValue, oldValue) {
                    initializeSlick();
                });

                //return scope.$watch('data', function (newValue, oldValue) {
                //	if (newValue && newValue !== 0 && (newValue !== oldValue) || scope.loadFromGraphTazrim) {
                //		initializeSlick();
                //	}
                //});
            }
        };
    }

    function autoFocus($timeout) {
        return {
            link: function (scope, element, attrs) {
                $(element).on('click', function () {
                    $timeout(function () {
                        element.next().focus()
                    }, 100)
                })
            }
        };
    }

    function mySlideshow($timeout) {
        return {
            link: function (scope, element, attrs) {
                $timeout(function () {
                    $(element).cycle({
                        speed: 8000,
                        manualSpeed: 100,
                        fx: "fadeout",
                        pager: "#no-template-pager",
                        pauseOnHover: true,
                        slides: '> div',
                        pagerTemplate: ''
                    });
                }, 0);
            }
        }
    }

    function ensureUnique() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    if (viewValue) {
                        ngModel.$setViewValue(viewValue.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        if (viewValue.substring(0, 1) == '0') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function ensureUniqueTelNotReq() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    if (viewValue) {
                        ngModel.$setViewValue(viewValue.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        if (viewValue.substring(0, 1) == '0') {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                };
            }
        }
    }

    function userChecks(serverConnection, $timeout, $q) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                c.$asyncValidators.uEmail = function (modelValue, viewValue) {
                    var value = modelValue || viewValue;

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.user.email = value;
                        })
                    })

                    var fname = '', lname = '';
                    if (scope.user.name) {
                        fname = scope.user.name.split(' ')[0];
                        lname = scope.user.name.split(' ')[1];
                    }
                    var tel = '';
                    if (scope.user.tel) {
                        var length_str = scope.user.tel.length;
                        if (length_str > 0) {
                            if (length_str == 10) {
                                tel = scope.user.tel.substr(0, 3) + '-' + scope.user.tel.substr(3, 9);
                            } else if (length_str == 9) {
                                tel = scope.user.tel.substr(0, 2) + '-' + scope.user.tel.substr(2, 8);
                            }
                        }
                    }

                    var pel = 0;
                    if (location.href.split("?")[1] == 'pelephone') {
                        pel = 1;
                    }

                    var data = {
                        "user_name": value,
                        "first_name": fname,
                        "last_name": lname,
                        "cell": tel,
                        "hesder_id": pel
                    };

                    var def = $q.defer();
                    serverConnection.userNamecheks(data).then(function (res) {
                        if (res == 0) {
                            def.resolve(true);
                            c.$setValidity('unique', true);
                        } else {
                            c.$setValidity('unique', false);
                            def.reject(false)
                        }
                    }, function (error) {
                        c.$setValidity('unique', false);
                        def.reject(false)
                    });
                    return def.promise;
                }

            }
        }
    }

    function legalTz() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                $(ele).keyup(function () {
                    var viewValue = ngModel.$viewValue;
                    if (viewValue !== undefined && viewValue !== "" && viewValue !== null) {
                        ngModel.$setViewValue(viewValue.replace(/[^\d -]/g, ''));
                        ngModel.$render();
                    }
                });

                $(ele).off("blur");
                $(ele).on("blur", function () {
                    var viewValue = ngModel.$viewValue;
                    if (viewValue !== undefined && viewValue !== "" && viewValue !== null) {
                        ngModel.$setValidity('required', true);
                        var lenStr = viewValue.toString().length;
                        if (lenStr == 8) {
                            viewValue = "0" + viewValue.toString();
                        }
                        ngModel.$setViewValue(viewValue.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        var tot = 0;
                        for (var i = 0; i < 8; i++) {
                            var x = (((i % 2) + 1) * new String(viewValue).charAt(i));
                            if (x > 9) {
                                x = x.toString();
                                x = parseInt(x.charAt(0)) + parseInt(x.charAt(1))
                            }
                            tot += x;
                        }
                        if ((tot + parseInt(new String(viewValue).charAt(8))) % 10 !== 0) {
                            ngModel.$setValidity('integer', false);
                        } else {
                            ngModel.$setValidity('integer', true);
                        }
                    } else {
                        ngModel.$setValidity('integer', true);
                        ngModel.$setValidity('required', false);
                    }
                });
            }
        }
    }

    function legalTzHp() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                $(ele).keyup(function () {
                    var viewValue = ngModel.$viewValue;
                    if (viewValue !== undefined && viewValue !== "" && viewValue !== null) {
                        ngModel.$setViewValue(viewValue.replace(/[^\d -]/g, ''));
                        ngModel.$render();
                    }
                });

                $(ele).off("blur");
                $(ele).on("blur", function () {
                    ngModel.$setValidity('required', true);
                    var viewValue = ngModel.$viewValue;
                    if (viewValue !== undefined && viewValue !== "" && viewValue !== null) {
                        var lenStr = viewValue.toString().length;
                        if (lenStr === 8) {
                            viewValue = "0" + viewValue.toString();
                        }
                        ngModel.$setViewValue(viewValue.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        var tot = 0;
                        for (var i = 0; i < 8; i++) {
                            var x = (((i % 2) + 1) * new String(viewValue).charAt(i));
                            if (x > 9) {
                                x = x.toString();
                                x = parseInt(x.charAt(0)) + parseInt(x.charAt(1))
                            }
                            tot += x;
                        }
                        if ((tot + parseInt(new String(viewValue).charAt(8))) % 10 !== 0) {
                            ngModel.$setValidity('integer', false);
                        } else {
                            ngModel.$setValidity('integer', true);
                        }
                    } else {
                        ngModel.$setValidity('integer', true);
                    }
                });
            }
        }
    }

    function checkCompanyHp(serverConnection, $timeout, $q) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                c.$asyncValidators.uHp = function (modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    var def = $q.defer();
                    serverConnection.checkCompanyHp(value).then(function (res) {
                        if (res == 'callback(false)') {
                            def.resolve(true);
                            c.$setValidity('unique', true);
                        } else {
                            c.$setValidity('unique', false);
                            def.reject(false)
                        }
                        $timeout(function () {
                            scope.$apply(function () {
                                scope.user.hp = modelValue;
                            })
                        });
                    }, function (error) {
                        c.$setValidity('unique', false);
                        def.reject(false)
                    });
                    return def.promise;
                }

            }
        }
    }

    function validationBanks($timeout) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, ctrl) {
                ctrl.$validators.valid = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    var names = attrs.id;
                    var valBank;
                    if (scope.$state.includes('signup')) {
                        valBank = scope.user.myBanks.val;
                    } else {
                        valBank = scope.selectedPost.val;
                    }
                    if (val) {
                        // if (valBank == '20') {
                        // 	if (names == 'bank_user_name') {
                        // 		ctrl.$setViewValue(val.replace(/[^\d -]/g, ''));
                        // 		ctrl.$render();
                        // 	}
                        // }
                        if (valBank == '999') {
                            ctrl.$setViewValue(val.replace(/[^\d -]/g, ''));
                            ctrl.$render();
                        }
                        if (valBank == '22' || valBank == '23') {
                            if (names == 'bank_auto') {
                                ctrl.$setViewValue(val.replace(/[^\d -]/g, ''));
                                ctrl.$render();
                                if (val.length == 6) {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.bank_pass = false;
                                        })
                                    });
                                    return true;
                                } else {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.bank_pass = '6 ספרות בלבד';
                                        })
                                    });
                                    return false;
                                }
                            }
                        }
                        if (valBank == '25') {
                            if (names == 'bank_user_name') {
                                ctrl.$setViewValue(val.replace(/[^\d -]/g, ''));
                                ctrl.$render();
                                if (val.length == 6) {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.bank_pass = false;
                                        })
                                    });
                                    return true;
                                } else {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.bank_pass = '6 ספרות בלבד';
                                        })
                                    });
                                    return false;
                                }
                            }
                        }
                        //if (valBank == '12') {
                        //	if (val.length >= 6 && val.length <= 14) {
                        //		$timeout(function () {
                        //			scope.$apply(function () {
                        //				scope.bank_pass = false;
                        //			})
                        //		});
                        //
                        //		return true;
                        //	}
                        //	else {
                        //		$timeout(function () {
                        //			scope.$apply(function () {
                        //				scope.bank_pass = '6-14 ספרות ואותיות באנגלית';
                        //			})
                        //		});
                        //		return false;
                        //	}
                        //}
                        if (valBank == '04') {
                            var letterNumber = /^[0-9a-zA-Z]+$/;
                            var lenLetter = val.length;
                            var lenDigit = val.replace(/[^\d -]/g, '').length;

                            //if (names == 'bank_user_name') {
                            //	if (!letterNumber.test(val) || lenLetter !== 7 || lenDigit !== 5) {
                            //		$timeout(function () {
                            //			scope.$apply(function () {
                            //				scope.bank_pass = 'קוד משתמש מורכב מ 2 אותיות לועזיות ו5 ספרות';
                            //			})
                            //		});
                            //		return false;
                            //	}
                            //	else {
                            //		$timeout(function () {
                            //			scope.$apply(function () {
                            //				scope.bank_pass = false;
                            //			})
                            //		});
                            //		return true;
                            //	}
                            //}
                            if (names == 'bank_auto') {
                                ctrl.$setViewValue(val.replace(/[^\d -]/g, ''));
                                ctrl.$render();
                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.bank_pass = false;
                                    })
                                });
                                return true;
                            }
                            if (names == 'bank_pass') {
                                if (val.length >= 6 && val.length <= 14) {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.bank_pass = false;
                                        })
                                    });
                                    return true;
                                } else {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.bank_pass = '6-14 ספרות ואותיות באנגלית';
                                        })
                                    });
                                    return false;
                                }
                            }
                        }
                    }

                    return true;
                };

            }
        }
    }

    function capslock($timeout) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, ctrl) {
                $(ele).keypress(function (e) {
                    var s = String.fromCharCode(e.keyCode || e.which);
                    if (s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
                        $timeout(function () {
                            scope.$apply(function () {
                                scope.$parent.capslockAlert = 'שים לב! caps lock לחוץ';
                            });
                        });
                    } else {
                        $timeout(function () {
                            scope.$apply(function () {
                                scope.$parent.capslockAlert = '';
                            });
                        })
                    }
                });
            }
        }
    }

    function menu() {
        return {
            restrict: 'A',
            link: function (scope, ele, attrs, ctrl) {
                $("li.open_nav_side .open_side").on('click', function (e) {
                    $('ul.menu > li  a').removeClass('actives');
                    $('ul.menu > li > a.unclick_nav').next().slideUp('fast');
                })
                $('ul.menu > li > a.unclick_nav').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var $this = $(this);
                    $('ul.menu > li  a').not($this).removeClass('actives');
                    $('ul.menu > li > a.unclick_nav').not($this).next().slideUp('fast');
                    $this.toggleClass('actives').next().slideToggle('fast');
                    if (scope.appData.mainNavClosed) {
                        scope.appData.mainNavClosed = false;
                        scope.appData.mainNavClosedIs = true;
                    }
                });

                $(".open_nav_side > .open_side_settings").on('click', function (e) {
                    e.stopPropagation();
                    $('ul.menu > li  a').removeClass('actives');
                    $('ul.menu > li > a.unclick_nav').next().slideUp('fast');
                })
                $('ul.nav_inline > li  a.inline_links').on('click', function (e) {
                    e.stopPropagation();
                    if (scope.appData.mainNavClosedIs) {
                        scope.appData.mainNavClosed = true;
                        scope.appData.mainNavClosedIs = false;
                        $('ul.menu > li  a').removeClass('actives');
                        $('ul.menu > li > a.unclick_nav').next().slideUp('fast');
                    }
                });
            }
        }
    }

    function replaceAnd() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    if (val) {
                        ngModel.$setViewValue(val.replace(/&/g, ''));
                        ngModel.$render();
                    }
                    return true;
                };
            }
        }
    }

    function clickCapture() {
        return {
            link: function (scope, elm, attrs) {
                elm.bind('click', function () {
                    if (scope.$state.current.name == 'tazrim') {
                        //Clicks on the body close all drop downs.
                        if (scope.appData.bankTazrim) {
                            scope.appData.bankTazrim.forEach(function (v, index) {
                                if (v.listPeulot == true) {
                                    v.listPeulot = false;
                                }
                                if (v.openListThis == true) {
                                    v.openListThis = false;
                                }
                                if (v.showInputSearch == true) {
                                    v.showInputSearch = false;
                                }
                            })
                        }
                        if (scope.appData.filterTazrim) {
                            scope.appData.filterTazrim.forEach(function (val, index, arr) {
                                var v = arr[index];
                                if (v.listPeulot == true) {
                                    v.listPeulot = false;
                                }
                                if (v.openListThis == true) {
                                    v.openListThis = false;
                                }
                                if (v.showInputSearch == true) {
                                    v.showInputSearch = false;
                                }
                            })
                        }
                        if (scope.appData.dataAddRow) {
                            scope.appData.dataAddRow.arrListChecks.forEach(function (v) {
                                if (v.listPeulot == true) {
                                    v.listPeulot = false;
                                }
                            })
                        }
                        scope.$apply();
                    }
                    if (scope.$state.current.name == 'regularOp.cube') {
                        scope.appData.openListThis = false;
                        scope.$apply();
                    }
                    if (scope.$state.current.name == 'fundManagement.bankAccounts.table') {
                        //Clicks on the body close all drop downs.
                        if (scope.appData.filteredTransactions) {

                            scope.appData.filteredTransactions.forEach(function (v) {
                                if (v.listPeulot == true) {
                                    v.listPeulot = false;
                                }
                            })
                            scope.$apply();
                        }

                    }


                    $(elm).find('.dropdown-content').slideUp("fast");
                });
            }
        }
    }

    function userChecksCompany(serverConnection, $timeout, $q) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                c.$asyncValidators.uEmail = function (modelValue, viewValue) {
                    var value = modelValue || viewValue;

                    $timeout(function () {
                        scope.$apply(function () {
                            if (scope.appData.companyAdd) {
                                scope.appData.companyAdd.email = value;
                            }
                            if (scope.appData.default_user_create) {
                                scope.appData.default_user_create.defUserEmail = value;
                            }
                        })
                    })

                    var def = $q.defer();
                    serverConnection.userNamecheksCompany(value).then(function (res) {
                        if (res == 'false') {
                            def.resolve(true);
                            c.$setValidity('unique', true);
                        } else {
                            c.$setValidity('unique', false);
                            def.reject(false)
                        }
                    }, function (error) {
                        c.$setValidity('unique', false);
                        def.reject(false)
                    });
                    return def.promise;
                }
            }
        }
    }

    function pelephoneCheck(serverConnection, $timeout, $q) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                $(ele).keyup(function (e) {
                    var dInput = this.value;
                    if (dInput.substring(0, 1) == '0' && dInput.length == 10) {
                        if (location.href.split("?")[1] == 'pelephone') {
                            var pelephone = 'pelephone=' + dInput;
                            //console.log(form.uTel.$valid)
                            serverConnection.checkPelephone(pelephone).then(function (res) {
                                var resParse = JSON.parse(res);
                                if (resParse == true) {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.appData.isPelephone = true;
                                        })
                                    })
                                } else {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.appData.isPelephone = false;
                                        })
                                    })
                                }
                            }, function (error) {
                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.appData.isPelephone = 'error';
                                    })
                                })
                            });
                        }
                    }
                });
            }
        }
    }

    function positionTooltip($timeout) {
        return {
            restrict: 'A',
            link: function (scope, ele, attrs, ctrl) {
                $(ele).on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var top = $(this).offset().top - 100;
                    var left = $(this).offset().left - 220;
                    scope.appData.showTooltip = true;
                    scope.appData.dataTool = scope.a;
                    scope.$apply();
                    $('.tooltipCloack').offset({top: top, left: left});

                    // scope.$watch(function () {
                    // 	return attrs.$$element.context.offsetTop;
                    // }, function (newVal, oldVal) {
                    // 	if (newVal && newVal != oldVal) {
                    // 		$('.tooltipCloack').offset({ top: top, left: left });
                    // 	}
                    // });
                });

                $(ele).on('mouseleave', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $timeout(function () {
                        scope.$apply(function () {
                            scope.appData.showTooltip = false;
                        })
                    })
                });
            }
        }
    }

    function fileread($timeout) {
        return {
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    $timeout(function () {
                        scope.$apply(function () {
                            scope.valTextFile = changeEvent.target.files[0].name;
                            scope.appData.alertErrorUploadExcel = false;
                        })
                    })
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        var contents = loadEvent.target.result;
                        try {
                            alasql.promise('SELECT * FROM XLSX("' + contents + '",{headers:true})', [])
                                .then(function (data) {
                                    function getJsDateFromExcel(excelDate) {
                                        return new Date((parseFloat(excelDate) - (25568 + 1)) * 86400 * 1000);
                                    }

                                    scope.appData.excelChecks = [];
                                    data.forEach(function (v, i) {
                                        if (v.סוג_פעולה) {
                                            var hachnasa, hozaa, trans_type_id, asmachta, trans_name, date_convert,
                                                payment;
                                            if (v.סוג_פעולה.indexOf('הכנסה') !== -1) {
                                                hachnasa = Math.abs(parseFloat(v.סכום));
                                                hozaa = null;
                                                trans_type_id = '7b94ad34-2bc1-4f4a-b905-a9f582a06179';
                                            }
                                            if (v.סוג_פעולה.indexOf('הוצאה') !== -1) {
                                                hozaa = Math.abs(parseFloat(v.סכום));
                                                hachnasa = null;
                                                trans_type_id = 'f605bc82-2921-4548-b09b-937c7baa1c2a';
                                            }
                                            if ((v.סוג_פעולה.indexOf('הוצאה') == -1) && (v.סוג_פעולה.indexOf('הכנסה') == -1)) {
                                                scope.$apply(function () {
                                                    scope.appData.alertErrorUploadExcelText = "חסר פירוט הוצאה/הכנסה";
                                                    scope.appData.alertErrorUploadExcel = true;
                                                })
                                            }
                                            if (v.סכום == undefined) {
                                                scope.$apply(function () {
                                                    scope.appData.alertErrorUploadExcelText = "שדה סכום לא יכול להיות ריק";
                                                    scope.appData.alertErrorUploadExcel = true;
                                                })
                                            }
                                            if (v.סוג_תשלום == undefined) {
                                                scope.$apply(function () {
                                                    scope.appData.alertErrorUploadExcelText = "שדה תשלום לא יכול להיות ריק";
                                                    scope.appData.alertErrorUploadExcel = true;
                                                })
                                            } else {
                                                payment = v.סוג_תשלום.trim();
                                            }
                                            if (v.אסמכתא) {
                                                if (isNaN(v.אסמכתא) == false) {
                                                    asmachta = parseFloat(v.אסמכתא);
                                                } else if (v.אסמכתא.replace(/\D/g, "") == "") {
                                                    asmachta = 0;
                                                } else {
                                                    asmachta = parseFloat(v.אסמכתא.replace(/\D/g, ""));
                                                }
                                            } else {
                                                asmachta = 0;
                                            }

                                            trans_name = '';
                                            if (v.תיאור) {
                                                trans_name = v.תיאור;
                                            } else {
                                                scope.$apply(function () {
                                                    scope.appData.alertErrorUploadExcelText = "שדה תיאור אינו יכול להיות ריק";
                                                    scope.appData.alertErrorUploadExcel = true;
                                                })
                                            }
                                            if (v.תאריך) {
                                                var formatDate = v.תאריך.toString();
                                                if (formatDate.indexOf("/") == -1 && formatDate.indexOf(".") == -1) {
                                                    var dates = getJsDateFromExcel(v.תאריך);
                                                    date_convert = ("0" + (dates.getDate())).slice(-2) + '/' + ("0" + (parseInt(dates.getMonth()) + 1)).slice(-2) + '/' + dates.getFullYear();
                                                } else {
                                                    if (formatDate.indexOf("/") !== -1) {
                                                        var dates = v.תאריך.toString().replace(/\s/g, "");
                                                        var years = dates.split('/')[2], yearSend;
                                                        if (years.length == 4) {
                                                            yearSend = years;
                                                        }
                                                        if (years.length == 2) {
                                                            yearSend = '20' + years;
                                                        }
                                                        date_convert = ("0" + (dates.split('/')[0])).slice(-2) + '/' + ("0" + (dates.split('/')[1])).slice(-2) + '/' + yearSend;
                                                    }
                                                    if (formatDate.indexOf(".") !== -1) {
                                                        var dates = v.תאריך.toString().replace(/\s/g, "");
                                                        var years = dates.split('.')[2], yearSend;
                                                        if (years.length == 4) {
                                                            yearSend = years;
                                                        }
                                                        if (years.length == 2) {
                                                            yearSend = '20' + years;
                                                        }
                                                        date_convert = ("0" + (dates.split('.')[0])).slice(-2) + '/' + ("0" + (dates.split('.')[1])).slice(-2) + '/' + yearSend;
                                                    }
                                                    if ((formatDate.indexOf("/") == -1) && (formatDate.indexOf(".") == -1)) {
                                                        scope.$apply(function () {
                                                            scope.appData.alertErrorUploadExcelText = "תקלה בפורמט התאריך, יש לרשום עם סימני . או / בין שנה/חודש/יום";
                                                            scope.appData.alertErrorUploadExcel = true;
                                                        })
                                                    }
                                                }
                                            } else {
                                                scope.$apply(function () {
                                                    scope.appData.alertErrorUploadExcelText = "שדה תאריך לא יכול להיות ריק";
                                                    scope.appData.alertErrorUploadExcel = true;
                                                })
                                            }
                                            if (scope.appData.alertErrorUploadExcel !== true) {
                                                scope.appData.excelChecks.push({
                                                    asmachta: asmachta,
                                                    company_account_id: scope.appData.selectAccAddTazrim,
                                                    company_id: scope.appData.selectedCompany.companyId,
                                                    day_id: date_convert,
                                                    hachnasa: hachnasa,
                                                    hozaa: hozaa,
                                                    payment_type_id: scope.convertTypePeulaName(payment),
                                                    trans_name: trans_name,
                                                    trans_type_id: trans_type_id,
                                                    source_program_id: 150,
                                                    delete_old_payments: Number(scope.appData.Excel_delete_old_payments)
                                                })
                                            }
                                        }
                                    })
                                    console.log(scope.appData.excelChecks)
                                    scope.importShow = true;
                                })
                                .catch(function (err) {
                                    scope.appData.alertErrorUploadExcelText = "הקובץ פגום.";
                                    scope.appData.alertErrorUploadExcel = true;
                                });
                        } catch (e) {
                            scope.appData.alertErrorUploadExcelText = "הקובץ פגום.";
                            scope.appData.alertErrorUploadExcel = true;
                        }
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }

    function chartSmall($timeout) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                if (scope.data.sum_inv_cur_mon > 0 ||
                    ((scope.data.sum_inv_cur_mon <= 0
                        || scope.data.sum_inv_cur_mon == null)
                        && (scope.data.last_inv_date && scope.data.last_inv_date !== '01/01/1980'))) {
                    var newValue = angular.copy(scope.data.impGraphListAll);
                    $(window).on('resize', function (a) {
                        $timeout(function () {
                            if ($(window).width() < 1450) {
                                x = x.splice(0, 4);
                                y = y.splice(0, 4);
                            }
                            updateView();
                        }, 500)
                    });
                    var x = newValue[0], y = newValue[1];

                    function updateView() {
                        $(element).highcharts({
                            chart: {
                                plotBorderWidth: 0,
                                type: 'areaspline',
                                style: {
                                    fontFamily: '"esterebold", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
                                    fontSize: '10px'
                                },
                                marginTop: 20,
                                marginBottom: 20,
                                spacingTop: 0,
                                spacingBottom: 0,
                                spacingLeft: 0,
                                spacingRight: 0,
                                animation: {
                                    duration: 1000
                                }
                            },
                            title: {
                                text: ''
                            },
                            subtitle: {
                                text: ''
                            },
                            xAxis: {
                                categories: x,
                                reversed: true,
                                labels: {
                                    style: {
                                        fontFamily: '"esterebold", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
                                        fontSize: '10px'
                                    }
                                },
                                tickWidth: 0,
                                gridLineWidth: 0,
                                lineWidth: 0,
                                minorGridLineWidth: 0,
                                lineColor: 'transparent',
                                minorTickLength: 0,
                                tickLength: 0
                            },
                            yAxis: {
                                gridLineWidth: 0,
                                minorGridLineWidth: 0,
                                lineWidth: 0,
                                labels: {
                                    enabled: false
                                },
                                title: {
                                    text: ''
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            credits: {
                                enabled: false
                            },

                            //plotOptions: {
                            //	areaspline: {
                            //		fillOpacity: 0.5
                            //	}
                            //},
                            plotOptions: {
                                areaspline: {
                                    fillOpacity: 0.5,
                                    dataLabels: {
                                        align: 'center',
                                        enabled: true,
                                        y: -25,
                                        color: '#1387a9'
                                    },
                                    enableMouseTracking: false
                                },
                                series: {
                                    fillColor: '#eaf4f7'
                                }
                            },
                            tooltip: {
                                enabled: false
                            },
                            //tooltip: {
                            //	backgroundColor: '#fff',
                            //	borderWidth: 1,
                            //	borderColor: '#e8e8e8',
                            //	shared: false,
                            //	useHTML: true,
                            //	borderRadius: 2,
                            //	shadow: false,
                            //	enabled: true,
                            //	formatter: function () {
                            //		var str = "<div class=\"chart-toolti\"><span>₪</span>" + this.y.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "</div>";
                            //		return str;
                            //	}
                            //},
                            series: [{
                                data: y
                            }]
                        })
                    }

                    $timeout(function () {
                        if ($(window).width() < 1450) {
                            x = x.splice(0, 4);
                            y = y.splice(0, 4);
                        }
                        // console.log(x, y, scope.data.company_name)
                        updateView();
                    }, 500)
                }
            }
        }
    }

    function chartSmallProfile($timeout) {
        return {
            restrict: 'A',
            scope: {
                chartDataProfile: '='
            },
            link: function postLink(scope, element, attrs) {
                var x, y;
                scope.$watch('chartDataProfile', function (newValue, oldValue) {
                    if (newValue && newValue !== 0) {
                        x = [], y = []
                        newValue.months.forEach(function (v) {
                            var month = parseInt(v.toString().substr(4, 2));
                            var date_year = v.toString().substr(2, 2);
                            var item = month + '/' + date_year;
                            x.push(item);
                        });
                        newValue.dataArray.forEach(function (v, i) {
                            if (i == 0) {
                                v.forEach(function (v1, i1) {
                                    if (i1 > 2) {
                                        y.push(eval(v1));
                                    }
                                });
                            }
                        });
                        $timeout(function () {
                            scope.updateView();
                        }, 100)
                    }
                }, true);
                scope.updateView = function () {
                    $(element).highcharts({
                        chart: {
                            backgroundColor: 'transparent',

                            type: 'line',
                            style: {
                                fontFamily: '"esterebold", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', // default font
                                fontSize: '10px'
                            },

                            marginTop: 5,
                            marginBottom: 25,
                            spacingTop: 0,
                            spacingBottom: 0,
                            spacingLeft: 0,
                            spacingRight: 0,
                            animation: {
                                duration: 1000
                            }
                        },
                        title: {
                            text: ''

                        },
                        subtitle: {
                            text: ''

                        },
                        xAxis: {
                            categories: x,
                            reversed: false,
                            tickWidth: 0,
                            labels: {
                                style: {
                                    fontFamily: '"esterebold", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
                                    fontSize: '10px'
                                }
                            }
                        },
                        yAxis: {
                            gridLineWidth: 0,
                            minorGridLineWidth: 0,
                            lineWidth: 0,
                            labels: {
                                enabled: false
                            },
                            title: {
                                text: ''
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        credits: {
                            enabled: false
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    align: 'center',
                                    enabled: true,
                                    y: -8
                                },
                                enableMouseTracking: false
                            }
                        },
                        tooltip: {
                            enabled: false
                        },
                        series: [{
                            data: y
                        }]
                    });

                };
            }
        }
    }

    function userChecksAcc(serverConnection, $timeout, $q) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                c.$asyncValidators.uEmail = function (modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    if (!value) {
                        value = "";
                    }
                    c.$setViewValue(value);
                    c.$render();

                    var def = $q.defer();
                    if (value == "") {
                        c.$setValidity('unique', false);
                        def.reject(false)
                    } else {
                        serverConnection.userNamecheksCompany(value).then(function (res) {
                            if (res == 'false') {
                                def.resolve(true);
                                c.$setValidity('unique', true);
                            } else {
                                c.$setValidity('unique', false);
                                def.reject(false)
                            }
                        }, function (error) {
                            c.$setValidity('unique', false);
                            def.reject(false)
                        });
                    }

                    return def.promise;
                }

            }
        }
    }

    function numeric() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                $(element).spinner({
                    change: function (event, ui) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(event.target.value);
                        });
                    },
                    max: attr.max,
                    min: attr.min
                });
            }
        }
    }

    function focusLi() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).on('keydown', function (event) {
                    if (event.keyCode == 40) { // down
                        scope.selected = 1;
                        if (event.target.nextElementSibling !== null) {
                            var next = event.target.nextElementSibling.children[0].children[0];
                            $(next).focus();
                        } else {
                            $('.dropListPeula ul > li').eq(1).focus();
                        }
                    }
                });
            }
        };
    }

    function keyNavigation() {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 38) {
                    var target = $(event.target).prev();
                    $(target).trigger('focus');
                }
                if (event.which === 40) {
                    var target = $(event.target).next();
                    $(target).trigger('focus');
                }
            });
        };
    }

    function dialogSelect() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attr) {
                scope.$watch('appData.openDialogSelect', function (newVal) {
                    if (newVal == true) {
                        $(".noTitleStuffSmall").show().animate({top: "0px"}, 1000);
                        //setTimeout(function () {
                        //	scope.$apply(function () {
                        //		scope.appData.openDialogSelect = false;
                        //	})
                        //}, 12000);
                    } else {
                        $(".noTitleStuffSmall").animate({top: "-60px"}, 1000);
                        //setTimeout(function () {
                        //	$(".noTitleStuffSmall").hide()
                        //}, 1000)
                    }
                });
            }
        }
    }

    function dialogVersion() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attr) {
                scope.$watch('appData.dialogVersion', function (newVal) {
                    if (newVal == false) {
                        $(".dialogVersion").animate({top: "-60px"}, 1000);
                    } else {
                        $(".dialogVersion").show().animate({top: "0px"}, 1000);
                    }
                });
            }
        }
    }

    function stopPropag() {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('click', function (e) {
                    e.stopPropagation();
                });
            }
        };
    }

    function passTabCompanies() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        ngModel.$setViewValue(val.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        if (val == 1709) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function passTabCompaniesTag() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        if (val === 'tag1390') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function passTabTeamSettings() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        if (val === 'Encmb51') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function passAl() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        if (val === 'almnvr') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function passPrivs() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        if (val === 'officeprivs1806') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function onlyNotHebrew() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.onlyNotHebrew = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    if (val) {
                        var hebrewChars = new RegExp("^[\u0590-\u05FF]+$");
                        if (!hebrewChars.test(val)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function passTabSpider() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        ngModel.$setViewValue(val.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        if (val == 4321) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function passTabBil() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        ngModel.$setViewValue(val.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        if (val == "0204") {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function passTabBilCancel() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        ngModel.$setViewValue(val.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        if (val == "0522499552") {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function passUserIdDef() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        ngModel.$setViewValue(val.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        if (val == "1511") {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function numberAsmachta() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    if (val) {
                        ngModel.$setViewValue(val.replace(/[^\d -]/g, ''));
                        ngModel.$render();

                        if (val < 3) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                };
            }
        }
    }

    function exportsExcelListCheck() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).on('click', function () {
                    function getCheck(uuid, folder_name, trans_id) {
                        var dfd = jQuery.Deferred();

                        function make_base_auth(user, password) {
                            var tok = user + ':' + password;
                            var hash = btoa(tok);
                            return "Basic " + hash;
                        }

                        var dataArr = {
                            'picture_link': uuid,
                            'folder_name': parseFloat(folder_name),
                            "bankTransId": trans_id
                        }
                        var us = 'testuser1', pass = 'test1234';
                        debugger
                        $.ajax({
                            url: window.serverName + "/chequepicGetList",
                            xhrFields: {
                                withCredentials: true
                            },
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic' + btoa(us + ':' + pass)
                            },
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', make_base_auth(us, pass));
                            },
                            method: "POST",
                            data: JSON.stringify(dataArr)
                        }).done(function (picture) {
                            if (picture.length == 0) {
                                dfd.resolve(trans_id);
                            } else {
                                dfd.resolve(true);
                            }
                        }).fail(function (jqXHR, textStatus) {

                        });
                        return dfd.promise();
                    }

                    var table = '';
                    table += '<table style="border-bottom:1px solid rgb(214, 205, 205); direction:rtl; text-align:right; "><thead><tr style="color: #fff;font: bold 12px arial;font-style: italic;">';
                    table += '<th style="background:rgb(40,94,160)">trans_id</th>';
                    table += '</tr></thead>';
                    table += '<tbody>';

                    var folder_name, arr = 0;
                    $(scope.appData.selectedCompany.transactions).each(function (i, t) {
                        if (t.picture_link && scope.checkPictureLink(t.picture_link) && t.picture_link !== 'x') {
                            scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
                                if (v.company_account_id === t.company_account_id) {
                                    folder_name = v.bank_id + '' + v.bank_snif_id + '' + v.bank_account_number;
                                }
                            });
                            $.when(getCheck(t.picture_link, folder_name, t.trans_id)).then(function (status) {
                                if (status !== true) {
                                    table += '<tr>';
                                    table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + status + '</td>';
                                    table += '</tr>';
                                    arr = arr + 1;
                                } else {
                                    arr = arr + 1;
                                }
                                if (arr == scope.appData.selectedCompany.transactions.length) {
                                    exArr()
                                }
                            })
                        } else {
                            arr = arr + 1;
                            if (arr == scope.appData.selectedCompany.transactions.length) {
                                exArr()
                            }
                        }
                    });

                    function exArr() {
                        table += '</tbody></table>';
                        var name_doch = 'רשימת trans_id' + ' - ';

                        var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';

                        var excel = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div style="font-size:20px; font-family: arial;font-weight:bold; text-align:right;color:#666;">' + title + '</div>' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</body></html>';

                        $('#ReportTableData').remove();

                        $('body').prepend("<form method='post' action='https://php.bizibox.biz/exporttoexcel.php' style='display:none' id='ReportTableData'><textarea name='tableData'>" + excel + "</textarea></form>");

                        $('#ReportTableData').submit().remove();
                        return false;
                    }
                });
            }
        }
    }

    function numberOnly19() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    if (val) {
                        ngModel.$setViewValue(val.toString().slice(0, 1).replace(/[^1-9\.]/g, ''));
                        ngModel.$render();
                    }
                    return true;
                };
            }
        }
    }

    function dropdownAll() {
        return {
            restrict: "E",
            templateUrl: "views/templates/dropdown.html?ver=3.74",
            scope: {
                placeholder: "@",
                list: "=",
                type: "=",
                selected: "=",
                property: "@",
            },
            link: function (scope) {
                scope.listVisible = false;
                scope.isPlaceholder = true;
                scope.select = function (item) {
                    scope.isPlaceholder = false;
                    scope.selected = item;
                    scope.listVisible = false;
                    if (scope.onChange !== undefined)
                        scope.onChange(item);
                };

                scope.isSelected = function (item) {
                    return item[scope.property] === scope.selected[scope.property];
                };

                scope.show = function () {
                    scope.listVisible = !scope.listVisible;
                };

                scope.$watch("selected", function (value) {
                    scope.isPlaceholder = scope.selected[scope.property] === undefined;
                    scope.display = scope.selected[scope.property];
                });
            }
        }
    }

    function tooltipsLeft() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).tooltip({
                    position: {
                        my: "left-35 bottom-20",
                        at: "left center",
                        using: function (position, feedback) {
                            $(this).css(position);
                            $("<div>")
                                .addClass("arrow")
                                .addClass(feedback.vertical)
                                .addClass(feedback.horizontal)
                                .appendTo(this);
                        }
                    },
                    content: function (callback) {
                        callback($(this).prop('title').replace(new RegExp("\\|", "g"), '</div><div>'));
                    },
                    show: {
                        delay: 800,
                        duration: 10
                    },
                    close: function (event, ui) {
                        ui.tooltip.hover(
                            function () {
                                $(this).stop(true)
                            },
                            function () {
                                $(this).remove();
                            }
                        );
                    }
                });
            }
        }
    }

    function fileUpload($timeout) {
        return {
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    $timeout(function () {
                        scope.$apply(function () {
                            scope.tfsObj.valTextFileName = changeEvent.target.files[0].name;
                        });
                    });
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        if (evt.target.readyState == FileReader.DONE) {
                            var contents = evt.target.result;
                            $.ajax({
                                url: "https://bizibox2015.visualstudio.com/DefaultCollection/_apis/wit/attachments?filename=" + changeEvent.target.files[0].name + "&api-version=1.0",
                                data: contents,
                                processData: false,
                                contentType: "application/json",
                                type: "POST",
                                headers: {
                                    'Authorization': 'Basic ' + btoa("" + ":" + "5aznizuiwje4av3ymkgxxlzu6lxx3jgua64rqdnvixamhmjsyt7a")
                                }
                            }).done(function (response, state, status) {
                                if (response.url) {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.tfsObj.valTextFileUrl = response.url;
                                        })
                                    })
                                }
                            })
                        }
                    }
                    reader.readAsArrayBuffer(changeEvent.target.files[0]);
                });
            }
        }
    }

    function navSliderBanks($timeout) {
        return {
            link: function (scope, element, attrs) {
                var loadNav = function () {
                    return $timeout(function () {
                        var pxLi = 0;
                        $("#navTopGraphBanks").find("li").each(function () {
                            pxLi += $(this).width();
                        })
                        if ((pxLi + 172 + 40) < $("#navTopGraphBanks").width()) {
                            $("#navTopGraphBanks").addClass("li130");
                        } else {
                            $("#navTopGraphBanks").removeClass("li130");
                        }

                        if ($('#navTopGraphBanks').length) {
                            if ($("#navTopGraphBanks").outerWidth() < $('#navTopGraphBanks').get(0).scrollWidth) {
                                var liLast = ($(window).width() - document.querySelector("#navTopGraphBanks li:last-child").getBoundingClientRect().right);
                                console.log("liLast: ", liLast);
                                console.log("outerWidth: ", ($("#navTopGraphBanks").outerWidth() + 50))
                                if (liLast < ($("#navTopGraphBanks").outerWidth() + 50)) {
                                    $("#leftNavClick").hide()
                                } else {
                                    $("#leftNavClick").show()
                                }
                            } else {
                                $("#leftNavClick").hide()
                            }
                        }
                        if ($("#navTopGraphBanks").length) {
                            var scrollRight = $(window).width() - document.querySelector("#navTopGraphBanks li:first-child").getBoundingClientRect().right;
                            if (scope.appData.mainNavClosed) {
                                if (scrollRight < 75) {
                                    $("#rightNavClick").show()
                                } else {
                                    $("#rightNavClick").hide()
                                }
                            } else {
                                if (scrollRight < 205) {
                                    $("#rightNavClick").show()
                                } else {
                                    $("#rightNavClick").hide()
                                }
                            }
                        }
                    }, 600);
                };
                return $timeout(function () {
                    loadNav();
                    $(window).resize(function () {
                        loadNav();
                    });
                    $("#rightNavClick").off('click');
                    $("#rightNavClick").on('click', function () {
                        $('#navTopGraphBanks').animate({
                            scrollLeft: "+=190px"
                        }, 500);
                        loadNav()
                        return false;
                    });
                    $("#leftNavClick").off('click');
                    $("#leftNavClick").on('click', function () {
                        $('#navTopGraphBanks').animate({
                            scrollLeft: "-=190px"
                        }, 500);
                        loadNav()
                        return false;
                    });
                });
            }
        };
    }

    function navSliderPop($timeout) {
        return {
            link: function (scope, element, attrs) {
                var loadNav = function () {
                    return $timeout(function () {
                        if ($(".popWalkthrus ul").outerWidth() < $('.popWalkthrus ul').get(0).scrollWidth) {
                            var liLast = ($(window).width() - document.querySelector(".popWalkthrus ul li:last-child").getBoundingClientRect().right);
                            console.log("liLast: ", liLast);
                            console.log("outerWidth: ", ($(".popWalkthrus ul").outerWidth() + 65))
                            if (liLast < ($(".popWalkthrus ul").outerWidth() + 64)) {
                                $("#leftNavClickPop").hide()
                            } else {
                                $("#leftNavClickPop").show()
                            }
                        } else {
                            $("#leftNavClickPop").hide()
                        }
                        var scrollRight = $(window).width() - document.querySelector(".popWalkthrus ul li:first-child").getBoundingClientRect().right;
                        console.log("scrollRight: ", scrollRight)
                        if (scope.appData.mainNavClosed) {
                            if (scrollRight < 75) {
                                $("#rightNavClickPop").show()
                            } else {
                                $("#rightNavClickPop").hide()
                            }
                        } else {
                            if (scrollRight < 302) {
                                $("#rightNavClickPop").show()
                            } else {
                                $("#rightNavClickPop").hide()
                            }
                        }
                    }, 600);
                };

                return $timeout(function () {
                    loadNav();
                    $("#rightNavClickPop").off('click');
                    $("#rightNavClickPop").on('click', function () {
                        var sum = "+=444px";
                        if (window.browserDetect.browser == 'Explorer') {
                            sum = "-=444px";
                        }
                        $('.popWalkthrus ul').animate({
                            scrollLeft: sum
                        }, 500);
                        loadNav();
                        return false;
                    });
                    $("#leftNavClickPop").off('click');
                    $("#leftNavClickPop").on('click', function () {
                        var sum = "-=444px";
                        if (window.browserDetect.browser == 'Explorer') {
                            sum = "+=444px";
                        }
                        $('.popWalkthrus ul').animate({
                            scrollLeft: sum
                        }, 500);
                        loadNav()
                        return false;
                    });
                });
            }
        };
    }

    function scrollAgree($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                initOnload: '@',
                data: '='
            },
            link: function (scope, element, attrs) {
                var loadScroll = {
                    initialize: function () {
                        return $timeout(function () {
                            var elems = $(element);
                            elems.scroll(function () {
                                if (!scope.$parent.appData.agreeShowAppr && (elems[0].scrollHeight - elems[0].scrollTop - elems[0].clientHeight) == 0) {
                                    scope.$apply(function () {
                                        console.log(true);
                                        scope.$parent.appData.agreeShowAppr = true;
                                    });
                                }
                            });
                        }, 0);
                    }
                };
                loadScroll.initialize();
            }
        };
    }

    function trustAsHtml($sce) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    if (val) {
                        var trust = $sce.trustAsHtml(val);
                        ngModel.$setViewValue(trust);
                        ngModel.$render();
                    }
                    return true;
                };
            }
        };
    }

    function validationCards($timeout) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, ctrl) {
                ctrl.$validators.valid = function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    var names = attrs.id;

                    if (val !== undefined) {
                        if (val.length) {
                            if (names == "numeric") {
                                $(ele).payment('restrictNumeric');
                                var tot = 0, x;
                                for (var i = 0; i < 8; i++) {
                                    x = (((i % 2) + 1) * new String(val).charAt(i));
                                    if (x > 9) {
                                        x = x.toString();
                                        x = parseInt(x.charAt(0)) + parseInt(x.charAt(1))
                                    }
                                    tot += x;
                                }
                                if ((tot + parseInt(new String(val).charAt(8))) % 10 !== 0) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                            if (names == "cc-number") {
                                $(ele).payment('formatCardNumber');
                                var cardType = $.payment.cardType(val);
                                var valid = !$.payment.validateCardNumber(val);
                                $timeout(function () {
                                    scope.$apply(function () {
                                        if (val.toString().length == 8 || val.toString().length == 9) {
                                            cardType = "isracard";
                                        }
                                        scope.appData.billingAccountNow.cardType = cardType;
                                    })
                                });
                                if (valid) {
                                    if (val.toString().length !== 8 && val.toString().length !== 9) {
                                        return false;
                                    }
                                }
                            }
                            if (names == "cc-exp") {
                                $(ele).payment('formatCardExpiry');
                                var valid = !$.payment.validateCardExpiry($(ele).payment('cardExpiryVal'));
                                if (valid) {
                                    return false;
                                }
                            }
                            if (names == "cc-cvc") {
                                $(ele).payment('formatCardCVC');
                                var valid = !$.payment.validateCardCVC(val, scope.appData.billingAccountNow.cardType);
                                if (valid) {
                                    return false;
                                }
                            }
                        }
                    }

                    return true;
                };
            }
        }
    }

    function validCell() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.valid = function (modelValue, viewValue) {
                    var val = viewValue || modelValue;
                    if (val) {
                        ngModel.$setViewValue(val.replace(/[^\d]/g, ''));
                        ngModel.$render();

                        if (val.slice(0, 1) !== "0" && val.slice(0, 1) !== "9") {
                            return false;
                        }
                        if (val.length <= 13 && val.length >= 10) {
                            if ((val.length == 12 || val.length == 13) && val.slice(0, 3) !== "972") {
                                return false;
                            }
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function ensureUniqueCellPhone() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attrs, ngModel) {
                ngModel.$validators.integer = function (modelValue, viewValue) {
                    if (viewValue) {
                        ngModel.$setViewValue(viewValue.replace(/[^\d]/g, ''));
                        ngModel.$render();

                        if (viewValue.substring(0, 2) === '05') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };
            }
        }
    }

    function ngEnter() {
        return {
            link: function (scope, ele, attrs) {
                ele.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                });
            }
        }
    }

    function elastic($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function () {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        }
    }

    angular.module('directives')
        .directive({
            'scrollFill': scrollFill,
            'scrollFillTabs': scrollFillTabs,
            'heightTabs': heightTabs,
            'showSubline': showSubline,
            'accordionWrap': accordionWrap,
            'accordionAcc': accordionAcc,
            'popup': ['$compile', popup],
            'dropdown': dropdown,
            'chartDraw': chartDraw,
            'chartDrawNew': chartDrawNew,
            'chartDrawScroll': chartDrawScroll,
            'datePicker': datePicker,
            'datePickerInline': datePickerInline,
            'datePickerTazrim': datePickerTazrim,
            'datePickerTazrimAdd': datePickerTazrimAdd,
            'datePickerDays': datePickerDays,
            'datePickerSetDate': datePickerSetDate,
            'datePickerSetDateEx': datePickerSetDateEx,
            'datePickerTazrimMin': datePickerTazrimMin,
            'datePickerTazrimAddRow': datePickerTazrimAddRow,
            'datePickerTazrimAddRowHa': datePickerTazrimAddRowHa,
            'datePickerSetDatePop': datePickerSetDatePop,
            'datePickerSetDatePopSetMonth': datePickerSetDatePopSetMonth,
            'datePickerAll': datePickerAll,
            'datePickerAllChangeMonthYear': datePickerAllChangeMonthYear,
            'tooltips': tooltips,
            'tooltipsTazrim': tooltipsTazrim,
            'tooltipsWhite': tooltipsWhite,
            'tooltipsWhiteBanks': tooltipsWhiteBanks,
            'tooltipsTazrimElipsis': tooltipsTazrimElipsis,
            'tooltipsAccElipsis': tooltipsAccElipsis,
            'tooltipsAccElipsisHover': tooltipsAccElipsisHover,
            'tooltipsMess': tooltipsMess,
            'tooltipsReg': tooltipsReg,
            'tooltipsCheck': tooltipsCheck,
            'tooltipsElipsis': tooltipsElipsis,
            'tooltipMenu': tooltipMenu,
            'tooltipsElipsisTazrim': tooltipsElipsisTazrim,
            'pieDraw': ['$timeout', pieDraw],
            'checkScroll': checkScroll,
            'accoValid': accoValid,
            'focusNext': focusNext,
            'dialog': dialog,
            'validbank': validbank,
            'navSlider': ['$timeout', navSlider],
            'checkUuid': checkUuid,
            'numberOnly': numberOnly,
            'numberOnlys': numberOnlys,
            'numberOnlyAsmachta': numberOnlyAsmachta,
            'sortableDrag': ['$timeout', sortableDrag],
            'navSliderMeuhad': ['$timeout', navSliderMeuhad],
            'autoFocus': ['$timeout', autoFocus],
            'mySlideshow': ['$timeout', mySlideshow],
            'ensureUnique': ensureUnique,
            'ensureUniqueTelNotReq': ensureUniqueTelNotReq,
            'userChecks': ['serverConnection', '$timeout', '$q', userChecks],
            'legalTz': legalTz,
            'legalTzHp': legalTzHp,
            'checkCompanyHp': ['serverConnection', '$timeout', '$q', checkCompanyHp],
            'validationBanks': ['$timeout', validationBanks],
            'capslock': ['$timeout', capslock],
            'menu': menu,
            'replaceAnd': replaceAnd,
            'clickCapture': clickCapture,
            'userChecksCompany': ['serverConnection', '$timeout', '$q', userChecksCompany],
            'pelephoneCheck': ['serverConnection', '$timeout', '$q', pelephoneCheck],
            'positionTooltip': ['$timeout', positionTooltip],
            'fileread': ['$timeout', fileread],
            'chartSmall': ['$timeout', chartSmall],
            'chartSmallProfile': ['$timeout', chartSmallProfile],
            'userChecksAcc': ['serverConnection', '$timeout', '$q', userChecksAcc],
            'numeric': numeric,
            'focusLi': focusLi,
            'keyNavigation': keyNavigation,
            'dialogSelect': dialogSelect,
            'dialogVersion': dialogVersion,
            'stopPropag': stopPropag,
            'passTabCompanies': passTabCompanies,
            'passTabCompaniesTag': passTabCompaniesTag,
            'passTabTeamSettings': passTabTeamSettings,
            'passAl': passAl,
            'passPrivs': passPrivs,
            'onlyNotHebrew': onlyNotHebrew,
            'passTabSpider': passTabSpider,
            'passTabBil': passTabBil,
            'passTabBilCancel': passTabBilCancel,
            'passUserIdDef': passUserIdDef,
            'numberAsmachta': numberAsmachta,
            'exportsExcelListCheck': exportsExcelListCheck,
            'numberOnly19': numberOnly19,
            'dropdownAll': dropdownAll,
            'tooltipsLeft': tooltipsLeft,
            'fileUpload': ['$timeout', fileUpload],
            'navSliderBanks': ['$timeout', navSliderBanks],
            'navSliderPop': ['$timeout', navSliderPop],
            'scrollAgree': ['$timeout', scrollAgree],
            'trustAsHtml': ['$sce', trustAsHtml],
            'validationCards': ['$timeout', validationCards],
            'validCell': validCell,
            'ensureUniqueCellPhone': ensureUniqueCellPhone,
            'ngEnter': ngEnter,
            'elastic': ['$timeout', elastic]
        })
}());



