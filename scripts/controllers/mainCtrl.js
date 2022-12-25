(function () {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

    if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB.")
    }

    function mainCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $filter, $q, $interval, $templateCache, $anchorScroll, $window) {
        $scope.$location = $location;
        $scope.$state = $state;
        $scope.appData = AppData;
        $scope.loaderSubmit = false;
        $scope.accoConversions = accoConversions;
        $scope.pollZoomFireEvent = function () {
            $timeout(function () {
                $scope.$broadcast('widthChanged');
            }, 500)
            var widthNow = $(window).width();
            var heightNow = $(window).height();
            if (window.lastWidth == widthNow && window.lastHeight == heightNow) return;
            window.lastWidth = widthNow;
            window.lastHeight = heightNow;
        }

        // window.walkme_player_event = function (event) {
        // 	// if (event.WalkthruId !== undefined && event.WalkthruId == 267438) {
        // 	// 	window.help_user = 1;
        // 	// }
        // 	// if ((event == "true" || event == "close" || event == true || event.Type == "PlayerInitComplete") && $scope.appData.defMonth.ind_accountants == 0) {
        // 	// 	window.walkme_event = function (eventData) {
        // 	// 		if (eventData.Type == "WalkthruCompleted" && eventData.WalkthruId !== 267438) {
        // 	// 			setTimeout(function () {
        // 	// 				window.walkme_player_event("true");
        // 	// 			}, 1000);
        // 	// 		}
        // 	// 		if (eventData.Type == "WalkthruCompleted" && eventData.WalkthruId == 267438) {
        // 	// 			window.help_user = 0;
        // 	// 		}
        // 	// 	}
        // 	// 	window.WalkMePlayerAPI.showPlayer();
        // 	// 	if ($scope.appData.defMonth && $scope.appData.defMonth.ind_accountants == 0) {
        // 	// 		$scope.appData.getWalkthrus = [];
        // 	// 		var walkMeAPITasks = window.WalkMeAPI.getTasks();
        // 	// 		var ind = 0, isCompleted = 0;
        // 	// 		walkMeAPITasks.forEach(function (v) {
        // 	// 			if (v.Name.indexOf("סקירה") !== -1) {
        // 	// 				v.NameImg = "skiraPop";
        // 	// 			}
        // 	// 			if (v.Name.indexOf("חשבונות") !== -1) {
        // 	// 				v.NameImg = "accPop";
        // 	// 			}
        // 	// 			if (v.Name.indexOf("תזרים") !== -1) {
        // 	// 				v.NameImg = "tazrimPop";
        // 	// 			}
        // 	// 			if (v.Name.indexOf("הגדרות") !== -1) {
        // 	// 				v.NameImg = "settPop";
        // 	// 			}
        // 	// 			if (v.Name.indexOf("פרטים") !== -1) {
        // 	// 				v.NameImg = "settPop";
        // 	// 			}
        // 	// 			if (v.Name.indexOf("כספים") !== -1) {
        // 	// 				v.NameImg = "ksafimPop";
        // 	// 			}
        // 	// 			if ($scope.appData.defMonth.ind_accountants == 0) {
        // 	// 				//if (v.TaskProperties.DisplayCondition && v.TaskProperties.DisplayCondition.funcArgs && v.TaskProperties.DisplayCondition.funcArgs.UrlInput && v.TaskProperties.DisplayCondition.funcArgs.UrlInput == "general/funds") {
        // 	// 				if (v.IsCompleted == 0) {
        // 	// 					ind += 1;
        // 	// 					if (ind == 1) {
        // 	// 						v.taskFirst = true;
        // 	// 					}
        // 	// 				}
        // 	// 				else {
        // 	// 					isCompleted += 1;
        // 	// 				}
        // 	// 				$scope.appData.getWalkthrus.push(v);
        // 	// 				//}
        // 	// 			}
        // 	// 			else {
        // 	// 				//if (v.TaskProperties.DisplayCondition && v.TaskProperties.DisplayCondition.funcArgs && v.TaskProperties.DisplayCondition.funcArgs.UrlInput && v.TaskProperties.DisplayCondition.funcArgs.UrlInput == "mainAccountants") {
        // 	// 				// if (v.IsCompleted == 0) {
        // 	// 				// 	ind += 1;
        // 	// 				// 	if (ind == 1) {
        // 	// 				// 		v.taskFirst = true;
        // 	// 				// 	}
        // 	// 				// }
        // 	// 				// else {
        // 	// 				// 	isCompleted += 1;
        // 	// 				// }
        // 	// 				// $scope.appData.getWalkthrus.push(v);
        // 	// 				//}
        // 	// 			}
        // 	// 		});
        // 	// 		if (ind !== 0 && $scope.appData.defMonth.ind_accountants == 0) {
        // 	// 			$scope.appData.walkTaskUnCompleted = ind;
        // 	// 			$scope.appData.walkTaskCompleted = isCompleted;
        // 	// 			$scope.appData.precentPopStepCompleted = (10) + parseInt((90 / $scope.appData.getWalkthrus.length) * $scope.appData.walkTaskCompleted);
        // 	// 			if ($scope.appData.defMonth.ind_sample == 1) {
        // 	// 				$scope.appData.showPopWalkme = false;
        // 	// 				if (event == "true") {
        // 	// 					$scope.showPopup('views/templates/popWalkthrus.html?ver=3.74', 'popWalkthrus', false);
        // 	// 				}
        // 	// 				else if (event == "close") {
        // 	// 					$scope.appData.showPopWalkme = true;
        // 	// 				}
        // 	// 				else {
        // 	// 					if ($state.includes('general')) {
        // 	// 						$scope.showPopup('views/templates/popUpHelpWalkMe.html?ver=3.74', 'popUpHelpWalkMe', false);
        // 	// 					}
        // 	// 				}
        // 	// 			}
        // 	// 			else {
        // 	// 				if (event == "true") {
        // 	// 					$scope.showPopup('views/templates/popWalkthrus.html?ver=3.74', 'popWalkthrus', false);
        // 	// 				}
        // 	// 				$scope.appData.showPopWalkme = true;
        // 	// 			}
        // 	// 		}
        // 	// 		else {
        // 	// 			$scope.appData.showPopWalkme = false;
        // 	// 		}
        // 	// 	}
        // 	// }
        // };

        $scope.checkLeftScroll = function () {
            if ($scope.appData.precentPopStepCompleted > 60) {
                setTimeout(function () {
                    $('.popWalkthrus ul').animate({
                        scrollLeft: "-=444px"
                    }, 500);
                }, 2000)
            }
        }
        $scope.reloadVersion = function () {
            if ($scope.appData.dialogVersion == true) {
                $scope.appData.dialogVersion = false;
                $scope.reloadAccData();
            } else {
                $scope.appData.dialogVersion = false;
                window.location.reload(true);
            }
        }
        $scope.init = function () {
            $scope.appData.get_users = 'get_regular_users';
            $scope.appData.dialogVersion = false;
            //$rootScope.$on('$viewContentLoaded', function () {
            //    $templateCache.removeAll();
            //});
            window.lastWidth = $(window).width();
            window.lastHeight = $(window).height();
            $scope.pollZoomFireEvent();
            $scope.appData.permissionAlert = false;

            if (location.host.indexOf("localhost") !== -1 || location.host == 'i-admin-dev-ng.bizibox.biz' || location.host == 'adm.bizibox.biz' || location.host == 'adm-stg.bizibox.biz' || location.host == '172.25.100.31' || location.host == 'stg-adm.bizibox.biz' || location.host == '10.200.140.31' || location.host == '192.168.10.116' || location.host == '172.25.101.12' || location.host == 'int-pre-prod.bizibox.biz' || location.host == 'adm-pre.bizibox.biz' || location.pathname == '/adm/' || location.host == 'adm-dr.bizibox.biz') {
                $scope.appData.adminSoft = true;
                $rootScope.adminSoft = true;

                function loadInterval() {
                    if (location.hash !== '' && location.hash !== '#/login' && !(/^signup/.test(location.hash.split('/')[1])) && !location.hash.includes("forgotPassword")) {
                        serverConnection.userSetreadmsgZero('00000000-0000-0000-0000-000000000321').then(function (response) {
                            if ($scope.appData.sumMess !== undefined && $scope.appData.sumMess !== response) {
                                document.getElementById("audio").pause();
                                document.getElementById("audio").currentTime = 0;
                                document.getElementById("audio").play();
                                $scope.appData.sumMess = response;
                            } else {
                                $scope.appData.sumMess = response;
                            }
                        }, function (error) {
                        });
                    }
                }

                loadInterval();
                setInterval(function () {
                    loadInterval()
                }, 15000);
            }
            $scope.intervalVersion = $interval(function () {
                serverConnection.getVersionNumber()
                    .then(function (data) {
                        if ($("#scriptVersion").attr("src").length) {
                            var versionNumSrc = $("#scriptVersion").attr("src").split("ver=")[1];
                            $scope.appData.numVersionCurrent = versionNumSrc;
                            if (versionNumSrc !== data.version) {
                                $scope.appData.dialogVersionText = {
                                    text: "קיימת גרסה חדשה יותר של bizibox.",
                                    btn: "רענן"
                                }
                                $scope.appData.dialogVersion = versionNumSrc;
                            }
                            //else {
                            //	$scope.appData.dialogVersion = false;
                            //}
                        } else {
                            $scope.appData.dialogVersionText = {
                                text: "קיימת גרסה חדשה יותר של bizibox.",
                                btn: "רענן"
                            }
                            $scope.appData.dialogVersion = "0.0";
                        }
                    }, function (error) {
                    });
            }, 60000);

            //$scope.$on('permissionUser', function (event, data) {
            //    $scope.getGeneralDataCompanies().then(function (response) {
            //        $scope.appData.companies = response;
            //        $scope.appData.uuid = [];
            //        $scope.appData.companies.forEach(function (v) {
            //            $scope.appData.uuid.push(v.companyId);
            //        })
            //    });
            //});
            //if (location.hash !== '#/forgotPassword' && location.hash !== '#/login') {
            //    $scope.getGeneralDataPermission().then(function (per) {
            //        $scope.$broadcast('permissionUser', {
            //            'ind_accountants': per.ind_accountants,
            //            'ind_sample': per.ind_sample
            //        });
            //        $scope.appData.defMonth = per;
            //    });
            //}

            $scope.$watch('$state.current.name', function (newValue, oldValue) {
                if (newValue && (newValue !== oldValue)) {
                    if ($scope.appData.removeTemplateCache) {
                        console.log('----removeTemplateCache----')
                        $timeout(function () {
                            $scope.appData.removeTemplateCache = false;
                            $templateCache.removeAll();
                            if ('caches' in window) {
                                window.caches.keys().then(function (cacheNames) {
                                    cacheNames.forEach(function (cacheName) {
                                        window.caches.open(cacheName).then(function (cache) {
                                            return cache.keys();
                                        }).then(function (requests) {
                                            requests.forEach(function (request) {
                                                window.caches.open(cacheName).then(function (cache) {
                                                    return cache.delete(request.url);
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            window.location.reload(true);
                        }, 150)
                    }
                    // if ((window.WalkMePlayerAPI !== undefined) && newValue === "login") {
                    // 	setTimeout(function () {
                    // 		window.WalkMePlayerAPI.hidePlayer();
                    // 	}, 500);
                    // }
                    if ($scope.appData.defMonth) {
                        if ($scope.appData.defMonth.ind_accountants == 1 && $scope.$state.includes('mainAccountants')) {
                            $scope.appData.placeholderNameCompanies = 'בחר חברה להצגת פרופיל';
                            $scope.topSampleNav = '55px';
                            $scope.appData.permissionAlertHa = false;
                            $scope.appData.permissionAlertKs = false;
                            $scope.appData.permissionAlert = false;
                            $scope.appData.statusPassAlert = false;
                        } else {
                            $scope.appData.placeholderNameCompanies = 'חיפוש חברה...';
                        }
                    }

                    $scope.$watch('appData.companies', function (newValue, oldValue) {
                        if (newValue) {
                            $scope.loadComapnyFromChache();
                        }
                    });
                }
            });
            //$scope.$watch('$state.current.name', function (newValue, oldValue) {
            //	if (newValue === oldValue) {
            //		return;
            //	}
            //	$scope.$watch('appData.companies', function (newValue, oldValue) {
            //		if (newValue === oldValue) {
            //			return;
            //		}
            //		$scope.loadComapnyFromChache();
            //	}, true);
            //}, true);

            window.browserDetect = {
                init: function () {
                    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
                    this.version = this.searchVersion(navigator.userAgent)
                        || this.searchVersion(navigator.appVersion)
                        || "an unknown version";
                    this.OS = this.searchString(this.dataOS) || "an unknown OS";
                },
                searchString: function (data) {
                    var l = data.length;
                    for (var i = 0; i < l; i++) {
                        var dataString = data[i].string;
                        var dataProp = data[i].prop;
                        this.versionSearchString = data[i].versionSearch || data[i].identity;
                        if (dataString) {
                            if (dataString.indexOf(data[i].subString) != -1)
                                return data[i].identity;
                        } else if (dataProp)
                            return data[i].identity;
                    }
                },
                searchVersion: function (dataString) {
                    var index = dataString.indexOf(this.versionSearchString);
                    if (index == -1) return;
                    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
                },
                dataBrowser: [
                    {
                        string: navigator.userAgent,
                        subString: "Chrome",
                        identity: "Chrome"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "OmniWeb",
                        versionSearch: "OmniWeb/",
                        identity: "OmniWeb"
                    },
                    {
                        string: navigator.vendor,
                        subString: "Apple",
                        identity: "Safari",
                        versionSearch: "Version"
                    },
                    {
                        prop: window.opera,
                        identity: "Opera",
                        versionSearch: "Version"
                    },
                    {
                        string: navigator.vendor,
                        subString: "iCab",
                        identity: "iCab"
                    },
                    {
                        string: navigator.vendor,
                        subString: "KDE",
                        identity: "Konqueror"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "Firefox",
                        identity: "Firefox"
                    },
                    {
                        string: navigator.vendor,
                        subString: "Camino",
                        identity: "Camino"
                    },
                    {        // for newer Netscapes (6+)
                        string: navigator.userAgent,
                        subString: "Netscape",
                        identity: "Netscape"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "MSIE",
                        identity: "Explorer",
                        versionSearch: "MSIE"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "Gecko",
                        identity: "Mozilla",
                        versionSearch: "rv"
                    },
                    {         // for older Netscapes (4-)
                        string: navigator.userAgent,
                        subString: "Mozilla",
                        identity: "Netscape",
                        versionSearch: "Mozilla"
                    }
                ],
                dataOS: [
                    {
                        string: navigator.platform,
                        subString: "Win",
                        identity: "Windows"
                    },
                    {
                        string: navigator.platform,
                        subString: "os",
                        identity: "os"
                    },
                    {
                        string: navigator.userAgent,
                        subString: "iPhone",
                        identity: "iPhone/iPod"
                    },
                    {
                        string: navigator.platform,
                        subString: "Linux",
                        identity: "Linux"
                    }
                ]
            };
            window.browserDetect.init();
            $scope.appData.browserDetect = window.browserDetect;
            if (($scope.appData.browserDetect.browser == 'Explorer') && ($scope.appData.browserDetect.version < 9)) {
                $scope.showAlertExplorerVersion = true;
            } else {
                $scope.showAlertExplorerVersion = false;
            }
            if ($(window).width() > 1250) {
                $scope.appData.mainNavClosed = false;
            } else {
                $scope.appData.mainNavClosed = true;
            }

            if (location.hash !== '' && location.hash !== '#/login' && location.hash !== '#/forgotPassword' && !(/^signup/.test(location.hash.split('/')[1]))) {
                $q.all([$scope.getGeneralDataCompanies(), $scope.getGeneralDataPermission()]).then(function (data) {

                    if (new Date().getTime() < new Date(2021, 5, 24, 20).getTime()) {
                        var hideModalUpdateSystem = localStorage.getItem('hideModalUpdateSystem');
                        if (hideModalUpdateSystem === null) {
                            $scope.showPopup('views/templates/modalUpdateSystem.html?ver=3.74', 'modalUpdateSystem');
                        }
                    }

                    // $timeout(function () {
                    //     var alertFIBI = window.localStorage.getItem("alertFIBI");
                    //     if (alertFIBI == null) {
                    //         $scope.showPopup('views/templates/alertFIBI.html?ver=3.74', 'modalUpdateSystem');
                    //     }
                    // }, 2000);
                    $scope.appData.companies = data[0];
                    $scope.appData.defMonth = data[1];
                    if (!$scope.appData.adminSoft && $scope.appData.defMonth.bizibox_employee === 1) {
                        $scope.logout();
                        return;
                    }
                    if ($scope.appData.defMonth.outind_ocr !== 1 && $scope.appData.defMonth.outind_ocr !== 3 && $scope.appData.defMonth.outind_ocr_popup === 1) {
                        $scope.showPopup('views/templates/ocrLandingPageSupplier.html?ver=3.74', 'ocrLandingPageSupplierPopUp', true);
                    }

                    // if ($scope.appData.defMonth.ind_phone_exist === 0) {
                    // 	$scope.appData.phoneNumber = "";
                    // 	$scope.appData.codeNumber = "";
                    // 	$scope.appData.stepPhone = 1;
                    // 	$scope.showPopup('views/templates/ind_phone_exist.html?ver=3.74', 'indPhoneExist', false, true);
                    // }

                    // if ($scope.appData.defMonth.ind_phone_exist === 0) {
                    // 	$scope.appData.phoneNumber = "";
                    // 	$scope.appData.codeNumber = "";
                    // 	$scope.appData.stepPhone = 1;
                    // 	$scope.showPopup('views/templates/ind_phone_exist.html?ver=3.74', 'indPhoneExist', false, true);
                    // }

                    //$scope.loadApiWalkMe();

                    $scope.appData.user = $scope.appData.user || JSON.parse(localStorage.getItem('acco_user')) || JSON.parse(sessionStorage.getItem('acco_user'));
                    if ($scope.appData.user !== undefined && $scope.appData.user !== null) {
                        if ($scope.appData.user.email !== undefined && $scope.appData.user.password !== undefined) {
                            window.user_id = $scope.appData.user.email;
                            window.login_count = $scope.appData.defMonth.login_count;
                            if ($scope.appData.defMonth.ind_accountants == 1) {
                                window.ind_acc = 1;
                            } else {
                                window.ind_acc = 0;
                            }
                        }
                    }


                    if ($scope.appData.defMonth.ind_accountants == 1) {
                        $scope.appData.heightCompRow = 33;
                    } else {
                        $scope.appData.heightCompRow = 63;
                        $scope.gettokensalertsload();
                    }
                    if ($scope.appData.defMonth.ind_accountants == 1 && $scope.$state.includes('mainAccountants')) {
                        $scope.appData.placeholderNameCompanies = 'בחר חברה להצגת פרופיל';
                    } else {
                        $scope.appData.placeholderNameCompanies = 'חיפוש חברה...';
                    }
                });
            }
            if ($scope.isMobile() == true) {
                window.open("https://bsecure.bizibox.biz/", "_self");
                // window.open("https://secure.bizibox.biz/mobile/#/app/promoSign", "_self");
            }
        };
        $scope.modalUpdateSystemHide = function () {
            localStorage.setItem('hideModalUpdateSystem', String(true));
            $scope.hidePopup();
        }
        $scope.modalAlertFIBIHide = function () {
            localStorage.setItem('alertFIBI', 'true');
            $scope.hidePopup();
        }
        $scope.isMobile = function () {
            var check = false;
            (function (a, b) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };
        if ($scope.appData.adminSoft) {
            $scope.appData.userAccNameUsers = "";
            $scope.appData.userAccName = "";

            if (localStorage.getItem('userAccName')) {
                $scope.appData.userAccName = localStorage.getItem('userAccName');
            }
            if (localStorage.getItem('userAccNameUsers')) {
                $scope.appData.userAccNameUsers = localStorage.getItem('userAccNameUsers');
            }
        }
        //$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //	mixpanel.track("Page info", {
        //		"Page": toState.name
        //	});
        //	mixpanel.track_links(toState.name, "Page");
        //})
        if (location.host == "secure.bizibox.biz") {
            $rootScope.$on('$stateChangeSuccess', function (event) {
                $window.ga('send', 'pageview', 'state: ' + $location.path());
            });
        }
        $scope.topSampleNavScroll = 110;
        $scope.loadComapnyFromChache = function () {
            var data = $scope.appData.defMonth;

            var storedCompanyIndex = $scope.getStoredSelectedCompanyIndex();
            if (data !== undefined && data.ind_accountants !== undefined && data.ind_accountants == 1 && $state.includes('mainAccountants')) {
                $scope.appData.selectedCompanyIndex = null;
            } else {
                if (storedCompanyIndex !== null) {
                    $scope.appData.selectedCompanyIndex = storedCompanyIndex;
                } else if (data !== undefined && data.ind_accountants !== undefined && data.ind_accountants == 0) {
                    $scope.appData.selectedCompanyIndex = 0;
                }
            }
        };
        $scope.getCompaniesThisStrorage = function (company) {
            var isCompanyChange = false
            if (company && $scope.appData.selectedCompany && $scope.appData.selectedCompany.companyId && ($scope.appData.selectedCompany.companyId !== company.companyId)) {
                isCompanyChange = true
            }
            if (company) {
                $scope.appData.companySource = angular.copy(company);
                $scope.appData.selectedCompany = angular.copy(company);
                $scope.saveSelectedCompany();
            }
            $scope.topSampleNav = '55px';
            $scope.topSampleNavScroll = 110;
            $scope.appData.permissionAlert = false;
            if ($scope.appData.selectedCompany.hanhahPrivilege == false) {
                if ($state.current.name == 'overviewAcc.statistics' || $state.current.name == 'analysis' || $state.current.name == 'trialBalance' || $state.current.name == 'general.accountant' || $state.current.name == 'report') {
                    $scope.appData.selectedCompany.companyId = "856f4212-3f5f-4cfc-b2fb-b283a1da2f7c";
                    $scope.topSampleNav = '113px';
                    $scope.topSampleNavScroll = 123;
                    $scope.appData.permissionAlert = true;
                    $scope.appData.permissionAlertHa = true;
                    $scope.appData.permissionAlertKs = false;
                    $scope.appData.statusPassAlert = false;
                } else {
                    $scope.appData.selectedCompany.companyId = $scope.appData.companySource.companyId;
                }
            }
            if ($scope.appData.selectedCompany.ksafimPrivilege == false) {
                if ($scope.appData.selectedCompany.companyId !== "856f4212-3f5f-4cfc-b2fb-b283a1da2f7c") {
                    if ($state.current.name == 'overviewAcc.ksafim' || $state.current.name == 'tazrim' || $state.includes('tazrimMeuhad') || $state.current.name == 'bankMatch.set' || $state.current.name == 'bankMatch.cancel' || $state.current.name == 'regularOp' || $state.current.name == 'regularOp.cube' || $state.current.name == 'regularOp.graph' || $state.current.name == 'fundManagement.bankAccounts' || $state.current.name == 'fundManagement.slika' || $state.current.name == 'fundManagement.cards' || $state.current.name == 'general.funds.bank' || $state.current.name == 'fundManagement.bankAccounts.table' || $state.current.name == 'fundManagement.bankAccounts.graph' || $state.current.name == 'fundManagement.slika.table' || $state.current.name == 'fundManagement.slika.graph' || $state.current.name == 'fundManagement.cards.table' || $state.current.name == 'fundManagement.cards.graph' || $state.current.name == 'general.funds' || $state.current.name == 'checksAnalysis') {
                        $scope.appData.selectedCompany.companyId = "856f4212-3f5f-4cfc-b2fb-b283a1da2f7c";
                        $scope.topSampleNav = '113px';
                        $scope.topSampleNavScroll = 123;
                        $scope.appData.permissionAlert = true;
                        $scope.appData.permissionAlertKs = true;
                        $scope.appData.permissionAlertHa = false;
                        $scope.appData.statusPassAlert = false;
                    } else {
                        $scope.appData.selectedCompany.companyId = $scope.appData.companySource.companyId;
                    }
                }
            }

            if (($scope.appData.defMonth.ind_accountants == 0) && ($scope.appData.selectedCompany.days_left_till_expire || $scope.appData.selectedCompany.days_left_till_expire == 0) && $scope.appData.selectedCompany.days_left_till_expire !== -1) {
                $scope.topSampleNav = '113px';
                $scope.topSampleNavScroll = 123;
            }

            if (!$scope.$state.includes('settings')) {
                if ($scope.appData.companySource.companyId !== undefined && $scope.appData.companySource.companyId !== $scope.appData.companySourceChangeId) {
                    $scope.appData.companySourceChangeId = $scope.appData.companySource.companyId;
                    $scope.loadAlertsPassWrong();
                } else {
                    if ($scope.appData.statusPassAlert && !$scope.appData.permissionAlert) {
                        $scope.topSampleNav = '113px';
                        $scope.topSampleNavScroll = 123;
                        $scope.appData.permissionAlertHa = false;
                        $scope.appData.permissionAlertKs = false;
                        $scope.appData.permissionAlert = true;
                        $scope.appData.statusPassAlert = true;
                    }
                    $scope.setHeightScroll();
                }
            } else {
                $scope.setHeightScroll();
            }
            $scope.loadSumMess($scope.appData.selectedCompany.companyId);

            if (isCompanyChange && $scope.appData.adminSoft) {
                $templateCache.removeAll();
                if ('caches' in window) {
                    window.caches.keys().then(function (cacheNames) {
                        cacheNames.forEach(function (cacheName) {
                            window.caches.open(cacheName).then(function (cache) {
                                return cache.keys();
                            }).then(function (requests) {
                                requests.forEach(function (request) {
                                    window.caches.open(cacheName).then(function (cache) {
                                        return cache.delete(request.url);
                                    });
                                });
                            });
                        });
                    });
                }
                window.location.reload(true);
            }
        };

        $scope.openMoreNav = false;
        $scope.openMoreNavScroll = function () {
            $scope.openMoreNav = !$scope.openMoreNav;
            $scope.setHeightScroll();
        };
        $scope.setHeightScroll = function () {
            if ($scope.topSampleNav == "113px") {
                $scope.topSampleNavScroll = 123;
                $scope.scrollMatchCancel = 260;

                if ($scope.openMoreNav) {
                    $scope.scrollHeightTazrim = 395;
                    $scope.scrollHeightFundsTable = 395;
                    $scope.appData.tbodyMatchScroll = 590;
                } else {
                    $scope.appData.tbodyMatchScroll = 525;
                    $scope.scrollHeightTable = 280;
                    $scope.scrollHeightMehuad = 161;
                    $scope.scrollHeightReport = 279;
                    $scope.scrollHeightAnalysis = 179;
                    $scope.scrollChecksAnalysis = 338;
                    $scope.scrollHeightOverview = 311;
                    $scope.bankMatchHeightScroll = 115;
                    $scope.scrollHeightTazrim = 350;
                    $scope.scrollHeightMain = 176;
                    $scope.scrollHeightFundsTable = 350;
                }
            } else {
                $scope.topSampleNavScroll = 65;
                $scope.scrollMatchCancel = 220;

                if ($scope.openMoreNav) {
                    $scope.scrollHeightTazrim = 355;
                    $scope.scrollHeightFundsTable = 350;
                    $scope.appData.tbodyMatchScroll = 535;
                } else {
                    $scope.appData.tbodyMatchScroll = 470;
                    $scope.scrollHeightTable = 220;
                    $scope.scrollHeightMehuad = 103;
                    $scope.scrollHeightReport = 223;
                    $scope.scrollHeightAnalysis = 123;
                    $scope.scrollChecksAnalysis = 280;
                    $scope.scrollHeightOverview = 255;
                    $scope.bankMatchHeightScroll = 55;
                    $scope.scrollHeightTazrim = 300;
                    $scope.scrollHeightMain = 88;
                    $scope.scrollHeightFundsTable = 260;
                }
            }
        };

        //window.walkme_player_event = function (event) {
        //	if (event.Type == "PlayerInitComplete") {
        //
        //		//setTimeout(function () {
        //		//	if (location.hash !== '' && location.hash !== '#/login' && !(/^signup/.test(location.hash.split('/')[1]))) {
        //		//		$("#walkme-menu").removeClass("importantRuleBlock").addClass("importantRule");
        //		//		$("#walkme-player, #walkme-attengrab").removeClass("importantRule").addClass("importantRuleBlock");
        //		//		$("#walkme-player").addClass("right0");
        //		//	}
        //		//	else {
        //		//		$("#walkme-player").removeClass("right0");
        //		//		$("#walkme-player, #walkme-attengrab, #walkme-menu").removeClass("importantRuleBlock").addClass("importantRule");
        //		//	}
        //		//}, 100)
        //	}
        //
        //	if (event.Type == "BeforeMenuOpen") {
        //		//$("#walkme-player").removeClass("right0");
        //		//$("#walkme-player, #walkme-attengrab, #walkme-menu").removeClass("importantRuleBlock").addClass("importantRule");
        //		//WalkMePlayerAPI.hidePlayer();
        //		//$scope.showPopup('views/templates/popUpHelpWalkMe.html?ver=3.74', 'popUpHelpWalkMe', false);
        //		//$scope.appData.getWalkthrus = WalkMeAPI.getTasks();
        //		//arr.forEach(function(v, i){
        //		//	if(i == 0){
        //		//		WalkMeAPI.startWalkthruByIndex(v.Index)
        //		//	}
        //		//})
        //	}
        //}
        $scope.apprAgree = function () {
            serverConnection.ind_task_read().then(function (response) {
                $scope.hidePopup();
            }, function (error) {
                $scope.hidePopup();
            });
        }
        $scope.skipPopAgree = function () {
            var skipPopAgree = window.localStorage.getItem("skipPopAgree");
            if (skipPopAgree == null) {
                window.localStorage.setItem("skipPopAgree", 1);
            } else {
                window.localStorage.setItem("skipPopAgree", parseFloat(skipPopAgree) + 1);
            }
            $scope.hidePopup();
        }
        $scope.loadApiWalkMe = function () {
            // if ($scope.$state.includes('signup')) {
            // 	if (window.WalkMeAPI == undefined) {
            // 		$scope.appData.showPopWalkmeLoad = false;
            // 		if (window.location.host !== 'adm.bizibox.biz' && window.location.host !== "secure.bizibox.biz") {
            // 			var src = 'https://cdn.walkme.com/users/ec254e397cfa4e669ba77df93abe8348/test/walkme_ec254e397cfa4e669ba77df93abe8348_https.js';
            // 			setTimeout(function () {
            // 				$.getScript(src, function () {
            // 					console.log("Running walkme.js");
            // 					window._walkmeConfig = {smartLoad: true};
            // 					$scope.appData.showPopWalkmeLoad = true;
            // 				});
            // 			}, 2000)
            // 		} else {
            // 			var src = 'https://cdn.walkme.com/users/ec254e397cfa4e669ba77df93abe8348/walkme_ec254e397cfa4e669ba77df93abe8348_https.js';
            // 			setTimeout(function () {
            // 				$.getScript(src, function () {
            // 					console.log("Running walkme.js");
            // 					window._walkmeConfig = {smartLoad: true};
            // 					$scope.appData.showPopWalkmeLoad = true;
            // 				});
            // 			}, 2000)
            // 		}
            // 	} else {
            // 		window.walkme_player_event(true);
            // 	}
            // } else {
            // $scope.appData.user = $scope.appData.user || JSON.parse(localStorage.getItem('acco_user')) || JSON.parse(sessionStorage.getItem('acco_user'));
            // if ($scope.appData.user !== undefined && $scope.appData.user !== null) {
            // 	if ($scope.appData.user.email !== undefined && $scope.appData.user.password !== undefined) {
            // 		window.user_id = $scope.appData.user.email;
            // 		window.login_count = $scope.appData.defMonth.login_count;
            // 		if ($scope.appData.defMonth.ind_accountants == 1) {
            // 			window.ind_acc = 1;
            // 		}
            // 		else {
            // 			window.ind_acc = 0;
            // 		}
            // 	}
            // }
            // if (window.WalkMeAPI == undefined) {
            // 	$scope.appData.showPopWalkmeLoad = false;
            // 	if (window.location.host !== 'adm.bizibox.biz' && window.location.host !== "secure.bizibox.biz") {
            // 		var src = 'https://cdn.walkme.com/users/ec254e397cfa4e669ba77df93abe8348/test/walkme_ec254e397cfa4e669ba77df93abe8348_https.js';
            // 		setTimeout(function () {
            // 			$.getScript(src, function () {
            // 				console.log("Running walkme.js");
            // 				window._walkmeConfig = {smartLoad: true};
            // 				$scope.appData.showPopWalkmeLoad = true;
            // 			});
            // 		}, 2000)
            // 	}
            // 	else {
            // 		var src = 'https://cdn.walkme.com/users/ec254e397cfa4e669ba77df93abe8348/walkme_ec254e397cfa4e669ba77df93abe8348_https.js';
            // 		setTimeout(function () {
            // 			$.getScript(src, function () {
            // 				console.log("Running walkme.js");
            // 				window._walkmeConfig = {smartLoad: true};
            // 				$scope.appData.showPopWalkmeLoad = true;
            // 			});
            // 		}, 2000)
            // 	}
            // }
            // else {
            // 	window.walkme_player_event(true);
            // }
            //}
        };
        $scope.openWalkthruByIndex = function (v) {
            //WalkMeAPI.startWalkthruByIndex(index)
            // if (v.taskFirst) {
            // 	$scope.appData.classPop = "text";
            // 	WalkMeAPI.startWalkthruById(v.RelatedDeployableId);
            // 	$scope.hidePopup();
            // }
        };
        $scope.openWalkthruById = function (v) {
            //WalkMeAPI.startWalkthruById(v)
        };
        $scope.openMenuSideWalkMe = function () {
            //window.WalkMePlayerAPI.toggleMenu();
        }
        $scope.popWalkthrusClose = function () {
            $scope.hidePopup();
            $scope.showPopup('views/templates/popWalkthrusClose.html?ver=3.74', 'popWalkthrusClose', true);
        };
        $scope.hideWt = function () {
            //$scope.hidePopup();
            //window.walkme_player_event("close");
            //setTimeout(function () {
            //	WalkMePlayerAPI.showPlayer();
            //}, 50)
            //$("#walkme-player, #walkme-attengrab").removeClass("importantRule").addClass("importantRuleBlock");
            //$("#walkme-player").addClass("right0");
        };
        $scope.gotoPopWalkthrus = function () {
            $scope.hidePopup();
            $scope.showPopup('views/templates/popWalkthrus.html?ver=3.74', 'popWalkthrus', false);
        }
        $scope.openListMatchMess = function (open) {
            $scope.appData.contentPopMatchInside = false;
            $scope.appData.contentPopMatchIndex = 0;
            $scope.appData.contentPopMatchNumber = 0;
            $scope.appData.contentPopMatchInsideIndex = 0;
            var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;

            function dmyOrdA(a, b) {
                var ab = $scope.parseDateSpace(a.target_original_date).split("/");
                var abLast = ab[0] + '/' + ab[1] + '/20' + ab[2];
                a = abLast.replace(dateRE, "$3$2$1");
                var ba = $scope.parseDateSpace(b.target_original_date).split("/");
                var baLast = ba[0] + '/' + ba[1] + '/20' + ba[2];
                b = baLast.replace(dateRE, "$3$2$1");
                if (a < b) return 1;
                if (a > b) return -1;
                return 0;
            }

            $scope.appData.messMatchPass.nigrarot.sort(dmyOrdA);
            $scope.appData.messMatchPassPeulot = $scope.appData.messMatchPass.nigrarot;

            if (!open) {
                $scope.appData.contentPopMatch = 'contentPop1';
                $scope.showPopup('views/templates/popMatchMess.html?ver=3.74', 'popMatchMess');
            } else {
                $scope.appData.contentPopMatch = 'contentPop2';
                $scope.appData.contentPopMatchInside = 'matchPeulaPop';
                $scope.showPopup('views/templates/popMatchMess.html?ver=3.74', 'popMatchMess contentPopWrap2');
                if (!$scope.appData.messMatchPassPeulot[0].innerData.length) {
                    $scope.matchPeulaPop();
                }
            }
        };
        $scope.matchPeulaPop = function () {
            $scope.appData.contentPopMatchInside = "matchPeulaListPop";
            $scope.appData.loaderPopMatchTableInside = true;
            $scope.appData.classPop = 'popMatchMess contentPopWrap2 contentPopWrap2Table';
            $scope.appData.numberRowsPopMatchSelected = 0;
            var data = {
                target_id: $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetID,
                target_type_id: $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_type_id
            };
            serverConnection.nigreret_getbankpeulot(data).then(function (response) {
                $scope.appData.tableMatchForCubePop = response;
                $scope.appData.loaderPopMatchTableInside = false;
            }, function (error) {
            });
        };
        $scope.closeMatchPeulaPop = function () {
            $scope.appData.classPop = 'popMatchMess contentPopWrap2';
            $scope.appData.contentPopMatchInside = "matchPeulaPop";
            $scope.appData.numberRowsPopMatchSelected = 0;
        };
        $scope.clickGa = function (text) {
            $window.ga('send', 'event', text, 'eventsSecure');
        }
        $scope.navPeulaMatchPop = function (type) {
            $scope.appData.contentPopMatchInsideIndex = 0;
            if (type == 'prev') {
                $scope.appData.contentPopMatchIndex -= 1;
            } else {
                $scope.appData.contentPopMatchIndex += 1;
            }
            if ($scope.appData.contentPopMatchInside == "matchPeulaListPop") {
                $scope.matchPeulaPop();
            }
        };
        $scope.memoryPeulaPopSend = function () {
            $scope.clickGa('תזכורת פעולה');
            var daystoDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
            var snooze_date = ("0" + (daystoDate.getDate())).slice(-2) + '/' + ("0" + (daystoDate.getMonth() + 1)).slice(-2) + '/' + daystoDate.getFullYear();
            var data = {
                target_id: $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetID,
                target_type_id: $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_type_id,
                ind_snooze_send_message: 0,
                snooze_date: snooze_date
            }
            serverConnection.peula_snooze_update(data).then(function (res) {
                $scope.appData.contentPopMatchInsidePop = false;
                $scope.appData.contentPopMatchNumber += 1;
                $scope.appData.contentPopMatchInsideIndex = 0;
                $scope.appData.messMatchPassPeulot.splice($scope.appData.contentPopMatchIndex, 1);

                if ($scope.appData.contentPopMatchIndex >= $scope.appData.messMatchPassPeulot.length) {
                    $scope.appData.contentPopMatchIndex = $scope.appData.messMatchPassPeulot.length - 1;
                }
                if ($scope.appData.contentPopMatchNumber == $scope.appData.messMatchPass.nigrarot.length) {
                    $scope.hidePopup();
                } else {
                    if ($scope.appData.contentPopMatchInside == "matchPeulaListPop") {
                        $scope.matchPeulaPop();
                    }
                }
            }, function (error) {
            });
        }
        $scope.appData.contentPopMatchInsidePop = false;
        $scope.deletePeulaPop = function () {
            $scope.appData.contentPopMatchInsidePop = "deletePeulaPop";
        };
        $scope.memoryPeulaPop = function () {
            $scope.appData.contentPopMatchInsidePop = "memoryPeulaPop";
        };
        $scope.deletePeulaPopSend = function () {
            $scope.clickGa('מחיקת פעולה');
            var data = {
                target_id: $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetID,
                target_type_id: $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_type_id,
                target_payment_type_id: $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_payment_type_id
            }
            serverConnection.peula_delete(data).then(function (res) {
                $scope.appData.contentPopMatchInsidePop = false;
                $scope.appData.contentPopMatchNumber += 1;
                $scope.appData.contentPopMatchInsideIndex = 0;
                $scope.appData.messMatchPassPeulot.splice($scope.appData.contentPopMatchIndex, 1);

                if ($scope.appData.contentPopMatchIndex >= $scope.appData.messMatchPassPeulot.length) {
                    $scope.appData.contentPopMatchIndex = $scope.appData.messMatchPassPeulot.length - 1;
                }
                if ($scope.appData.contentPopMatchNumber == $scope.appData.messMatchPass.nigrarot.length) {
                    $scope.hidePopup();
                } else {
                    if ($scope.appData.contentPopMatchInside == "matchPeulaListPop") {
                        $scope.matchPeulaPop();
                    }
                }
            }, function (error) {
            });
        };
        $scope.matchPeulaPopSend = function () {
            $scope.clickGa('התאמת פעולה מפופאפ התאמה');
            var ind_expence = false;
            if ($scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].ind_expence == 1) {
                ind_expence = true;
            }
            var data = [{
                "target_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetID,
                "target_type_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_type_id,
                "target_total": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetTotal,
                "target_name": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetName,
                "target_original_date": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_original_date.split(" ")[0],
                "target_payment_type_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_payment_type_id,
                "target_asmachta": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetAsmachta,
                "target_ind_kvua": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_ind_kvua,
                "match_link_id": null,
                "date_from": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].date_from,
                "date_till": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].date_till,
                "ind_hov_avar": true,
                "match_prc": 0,
                "bank_trans_id": null,
                "searchkey_id": null,
                "match_status": 0,
                "ind_expense": ind_expence
            }];

            var dataTable = [];
            $scope.appData.tableMatchForCubePop.forEach(function (v) {
                if (v.active) {
                    var hachnasa = null, hozaa = null, total = v.TOTAL;
                    if (v.IND_HOVA == 1) {
                        hozaa = total;
                    } else {
                        hachnasa = total;
                    }
                    var obj = {
                        "sign_type": 0,
                        "day_id": v.TRANS_DATE,
                        "ind_nigreret": false,
                        "payment_type_id": null,
                        "company_account_id": v.COMPANY_ACCOUNT_ID,
                        "asmachta": v.ASMACHTA,
                        "trans_id": v.BANK_TRANS_ID,
                        "trans_name": v.TRANS_DESC,
                        "hachnasa": hachnasa,
                        "hozaa": hozaa,
                        "ind_bank": true,
                        "picture_link": null,
                        "source_type_id": null,
                        "searchkey_id": null

                    };
                    dataTable.push(obj)
                }
            })
            var dataReq = {
                'data': data,
                'peulaLoZfuyaList': dataTable
            };

            serverConnection.matchPeulot(dataReq).then(function (res) {
                $scope.appData.contentPopMatchNumber += 1;
                $scope.appData.contentPopMatchInsideIndex = 0;
                $scope.appData.messMatchPassPeulot.splice($scope.appData.contentPopMatchIndex, 1);
                if ($scope.appData.contentPopMatchIndex >= $scope.appData.messMatchPassPeulot.length) {
                    $scope.appData.contentPopMatchIndex = $scope.appData.messMatchPassPeulot.length - 1;
                }
                if ($scope.appData.contentPopMatchNumber == $scope.appData.messMatchPass.nigrarot.length) {
                    $scope.hidePopup();
                } else {
                    if ($scope.appData.contentPopMatchInside == "matchPeulaListPop") {
                        $scope.matchPeulaPop();
                    }
                }
            }, function (error) {
            });
        };
        $scope.setTableListMatchPop = function (a, $event) {
            if ($event) {
                $scope.appData.numberRowsPopMatchSelected = 0;
                if ($event.ctrlKey) {
                    //Ctrl+Click
                    $scope.appData.tableMatchForCubePop.forEach(function (v) {
                        if (a.BANK_TRANS_ID == v.BANK_TRANS_ID) {
                            v.active = !v.active;
                            if (v.active) {
                                $scope.appData.numberRowsPopMatchSelected += 1;
                            }
                        }
                    })
                } else {
                    $scope.appData.tableMatchForCubePop.forEach(function (v) {
                        if (a.BANK_TRANS_ID == v.BANK_TRANS_ID) {
                            v.active = true;
                            $scope.appData.numberRowsPopMatchSelected = 1;
                        } else {
                            v.active = false;
                        }
                    })
                }
            }
        };
        $scope.matchPeulaMumletzetPopSend = function () {
            $scope.clickGa('התאמת פעולה מפופאפ התאמה');
            var ind_expence = false;
            if ($scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].ind_expence == 1) {
                ind_expence = true;
            }
            var data = [{
                "target_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetID,
                "target_type_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_type_id,
                "target_total": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetTotal,
                "target_name": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetName,
                "target_original_date": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_original_date.split(" ")[0],
                "target_payment_type_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_payment_type_id,
                "target_asmachta": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].targetAsmachta,
                "target_ind_kvua": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].target_ind_kvua,
                "match_link_id": null,
                "date_from": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].date_from,
                "date_till": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].date_till,
                "ind_hov_avar": true,
                "match_prc": 0,
                "bank_trans_id": null,
                "searchkey_id": null,
                "match_status": 0,
                "ind_expense": ind_expence
            }];

            var dataTable = [];
            var hachnasa = null, hozaa = null,
                total = $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].innerData[$scope.appData.contentPopMatchInsideIndex].total;
            if ($scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].innerData[$scope.appData.contentPopMatchInsideIndex].ind_hova == 1) {
                hozaa = total;
            } else {
                hachnasa = total;
            }
            var obj = {
                "sign_type": 0,
                "day_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].innerData[$scope.appData.contentPopMatchInsideIndex].trans_date.split(" ")[0],
                "ind_nigreret": false,
                "payment_type_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].innerData[$scope.appData.contentPopMatchInsideIndex].searchkey_payment_type_id,
                "company_account_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].innerData[$scope.appData.contentPopMatchInsideIndex].company_account_id,
                "asmachta": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].innerData[$scope.appData.contentPopMatchInsideIndex].asmachta,
                "trans_id": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].innerData[$scope.appData.contentPopMatchInsideIndex].bank_trans_id,
                "trans_name": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].innerData[$scope.appData.contentPopMatchInsideIndex].trans_desc,
                "hachnasa": hachnasa,
                "hozaa": hozaa,
                "ind_bank": true,
                "picture_link": $scope.appData.messMatchPassPeulot[$scope.appData.contentPopMatchIndex].innerData[$scope.appData.contentPopMatchInsideIndex].picture_link,
                "source_type_id": 11,
                "searchkey_id": null
            };
            dataTable.push(obj)
            var dataReq = {
                'data': data,
                'peulaLoZfuyaList': dataTable
            };
            serverConnection.matchPeulot(dataReq).then(function (res) {
                $scope.appData.contentPopMatchNumber += 1;
                $scope.appData.contentPopMatchInsideIndex = 0;
                $scope.appData.messMatchPassPeulot.splice($scope.appData.contentPopMatchIndex, 1);
                if ($scope.appData.contentPopMatchIndex >= $scope.appData.messMatchPassPeulot.length) {
                    $scope.appData.contentPopMatchIndex = $scope.appData.messMatchPassPeulot.length - 1;
                }
                if ($scope.appData.contentPopMatchNumber == $scope.appData.messMatchPass.nigrarot.length) {
                    $scope.hidePopup();
                } else {
                    if ($scope.appData.contentPopMatchInside == "matchPeulaListPop") {
                        $scope.matchPeulaPop();
                    }
                }
            }, function (error) {
            });
        };


        $scope.update_new_ui = function (type) {
            var param = {
                'uiType': type
            };
            serverConnection.update_new_ui(param).then(function (res) {
                $scope.hidePopup();
                window.open("https://bsecure.bizibox.biz/login", "_self")
            }, function (error) {
            });
        };
        $scope.goToNewWebApp = function () {
            window.open("https://bsecure.bizibox.biz/cfl/cash-flow/daily/details", "_blank");
            $scope.hidePopup();
        };
        $scope.parseDateSpace = function (dates) {
            if (dates == undefined || dates == null || dates == "") {
                return "";
            } else {
                return dates.split(" ")[0];
            }
        };
        $scope.matchFromTazrim = function (a) {
            $scope.clickGa('התאמת פעולה-מסך תזרים מפורט');
            var ind;
            $scope.appData.messMatchPass.nigrarot.forEach(function (v, i) {
                if (v.targetID == a.trans_id) {
                    ind = i;
                }
            });
            if (ind !== undefined) {
                $scope.appData.messMatchPass.nigrarot.unshift($scope.appData.messMatchPass.nigrarot[ind]);
                $scope.appData.messMatchPass.nigrarot.splice(ind + 1, 1);
                $scope.appData.contentPopMatchIndex = 0;
                $scope.appData.contentPopMatchNumber = 0;
                $scope.appData.contentPopMatchInsideIndex = 0;
                $scope.appData.messMatchPassPeulot = $scope.appData.messMatchPass.nigrarot;
                $scope.appData.contentPopMatch = 'contentPop2';
                $scope.appData.contentPopMatchInside = 'matchPeulaPop';
                $scope.showPopup('views/templates/popMatchMess.html?ver=3.74', 'popMatchMess contentPopWrap2');
                if (!$scope.appData.messMatchPassPeulot[0].innerData.length) {
                    $scope.matchPeulaPop();
                }
            }
        };


        //$scope.getCompaniesThisStrorage = function () {
        //    var data = $scope.appData.defMonth;
        //    if (data.ind_sample == 1 || data.ind_sample == '1') {
        //        if ($state.current.name == 'settings.accounts') {
        //            $scope.appData.selectedCompany.companyId = $scope.appData.uuid[0];
        //
        //            $scope.topSampleNav = '55px';
        //        }
        //        else {
        //            $scope.appData.selectedCompany.companyId = '856F4212-3F5F-4CFC-B2FB-B283A1DA2F7C';
        //            $scope.topSampleNav = '113px';
        //        }
        //    }
        //    else {
        //        if (isNaN($scope.appData.selectedCompany.days_left_till_expire)) {
        //            if (data.ind_sample == 0) {
        //                if ($state.current.name == "general.accountant") {
        //                    if (!$scope.appData.selectedCompany.hanhahPrivilege) {
        //                        $scope.appData.uuid.forEach(function (v, index) {
        //                            if (v == $scope.appData.selectedCompany.companyId) {
        //                                $scope.appData.indexSelectCompany = index;
        //                            }
        //                        });
        //                        $scope.appData.selectedCompany.companyId = '856F4212-3F5F-4CFC-B2FB-B283A1DA2F7C';
        //                        $scope.topSampleNav = '113px';
        //                    }
        //                    else {
        //                        $scope.topSampleNav = '55px';
        //                    }
        //                }
        //                else {
        //                    if ($scope.appData.indexSelectCompany) {
        //                        $scope.appData.selectedCompany.companyId = $scope.appData.uuid[$scope.appData.indexSelectCompany];
        //                    }
        //                    $scope.topSampleNav = '55px';
        //
        //                }
        //            }
        //        }
        //        else {
        //            $scope.topSampleNav = '113px';
        //        }
        //
        //    }
        //    console.log('getCompaniesThisStrorage');
        //    $scope.saveSelectedCompany();
        //};
        $scope.$on('errorLog', function (event, data) {
            if (!$scope.appData.adminSoft) {
                if (data.statusCode == 500) {
                    //$scope.showPopup('views/templates/error500.html?ver=3.74', 'popAlert', true);
                    //setTimeout(function () {
                    //	if ($scope.$state && $scope.$state.current.name == 'login') {
                    //		localStorage.clear()
                    //	}
                    //	$scope.hidePopup();
                    //	location.reload();
                    //}, 4500)
                }

                if (!$scope.appData.selectedCompany) {
                    data.companyId = null;
                } else {
                    data.companyId = $scope.appData.selectedCompany.companyId;
                }
                serverConnection.logError(data).then(function (response) {

                }, function (error) {

                });

                if (location.host == "secure.bizibox.biz") {
                    var company = "";
                    if ($scope.appData.selectedCompany) {
                        company = "<br><b>companyName: </b>" + $scope.appData.selectedCompany.companyName + "<br><b>companyId: </b>" + $scope.appData.selectedCompany.companyId + "<br><b>name_roh: </b>" + $scope.appData.defMonth.full_name + "<br>";
                    } else {
                        company = "<br><b>name_roh: </b>" + $scope.appData.defMonth.full_name + "<br>";
                    }
                    var content = [
                        {
                            "op": "add",
                            "path": "/fields/System.Title",
                            "value": data.statusCode + " - " + data.requestUrl
                        },
                        {
                            "op": "add",
                            "path": "/fields/System.AssignedTo",
                            "value": "eyal hazut <eyal@ifact.co.il>"
                        },
                        {
                            "op": "add",
                            "path": "/fields/Microsoft.VSTS.Scheduling.RemainingWork",
                            "value": 1
                        },
                        {
                            "op": "add",
                            "path": "/fields/System.AreaPath",
                            "value": "bizibox"
                        },
                        {
                            "op": "add",
                            "path": "/fields/Microsoft.VSTS.TCM.ReproSteps",
                            "value": "<p style='font-size:15px'><b>locationUrl:</b> " + location.href + company + "<b>requestUrl: </b>" + data.requestUrl + "<br><b>requestPayload: </b>" + data.requestPayload + "<br><b>message: </b>" + data.responseText + "</p>"
                        },
                        {
                            "op": "add",
                            "path": "/fields/System.WorkItemType",
                            "value": "Bug"
                        },
                        {
                            "op": "add",
                            "path": "/fields/System.Tags",
                            "value": "biziboxWeb;"
                        }
                    ];
                    var paramsData = {
                        url: "https://bizibox2015.visualstudio.com/DefaultCollection/bizibox/_apis/wit/workitems/$Task?api-version=1.0",
                        xhrFields: {
                            withCredentials: true
                        },
                        method: "PATCH",
                        type: "PATCH",
                        data: JSON.stringify(content),
                        headers: {
                            'Accept': '*/*',
                            'Content-Type': 'application/json-patch+json',
                            'Authorization': 'Basic ' + btoa("" + ":" + "5aznizuiwje4av3ymkgxxlzu6lxx3jgua64rqdnvixamhmjsyt7a")
                        }
                    };
                    $.ajax(paramsData)
                        .done(function (response, state, status) {

                        })
                        .fail(function (error, resErr) {

                        })
                }
            }
        });
        $scope.openMessages = function (openMess) {
            if (($scope.appData.adminSoft && openMess) || ($scope.appData.selectedCompany !== undefined && $scope.appData.selectedCompany.companyId && openMess)) {
                var companyId;
                if ($scope.appData.adminSoft !== undefined && $scope.appData.adminSoft) {
                    companyId = '00000000-0000-0000-0000-000000000000';
                    serverConnection.userSetreadmsgZero(companyId).then(function (response) {
                        $scope.appData.sumMess = response;
                        serverConnection.loadMess(companyId).then(function (res) {
                            $scope.appData.messAll = res;
                        }, function (error) {
                        });
                    }, function (error) {
                    });
                } else {
                    companyId = $scope.appData.selectedCompany.companyId;
                    serverConnection.loadMess(companyId).then(function (response) {
                        $scope.appData.messAll = response;
                        $scope.appData.messAll.forEach(function (v) {
                            if (v.ind_read == 1) {
                                v.ind_read = 0;
                                serverConnection.userSetreadmsg(v.message_id).then(function (response) {
                                    $scope.appData.sumMess = response;
                                }, function (error) {
                                });
                            }
                        });
                    }, function (error) {
                    });
                }
            }
        }
        $scope.readMess = function (mid) {
            serverConnection.userSetreadmsg(mid).then(function (response) {
                $scope.appData.sumMess = response;
                $scope.appData.messAll.forEach(function (v) {
                    if (v.message_id == mid) {
                        if (v.ind_read == 0) {
                            v.ind_read = 1;
                        } else {
                            v.ind_read = 0;
                        }
                    }
                });
            }, function (error) {
            });
        }
        $scope.loadSumMess = function (id) {
            serverConnection.loadSumMess(id).then(function (response) {
                $scope.appData.sumMess = response;
            }, function (error) {
            });
        };
        $scope.getPeulotToday = function (id, date) {
            var data = {
                companyAccId: id,
                dateValue: date.split('/')[2] + '' + date.split('/')[1] + '' + date.split('/')[0]
            }
            serverConnection.getPeulotToday(data).then(function (response) {
                $scope.appData.peulotMessages = response;
                $scope.showPopup('views/templates/peulotMessages.html?ver=3.74', 'peulotMessages');
            }, function (error) {
            });
        };
        if (sessionStorage.getItem('acco_user')) {
            $scope.appData.userLogin = JSON.parse(sessionStorage.getItem('acco_user')).email;
        }
        $scope.spiderBanks = function (id) {
            serverConnection.spiderBanks(id).then(function (response) {
                if ($scope.appData.defMonth.ind_accountants == 0) {
                    $scope.gettokensalertsload();
                }
            }, function (error) {
            });
        };
        $scope.updatePasswordPopUpMess = function (token, account) {
            $scope.appData.popupTypeLink = true;
            $scope.appData.popupType = 0;
            $scope.appData.popupDataToken = token;
            $scope.appData.popupDataBanks = account;
            $scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.74' + new Date().getTime(), 'accountUpdatePasswordPopup');
        };
        $scope.getTotalComma = function (num) {
            if (num) {
                var s = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                return s;
            } else {
                return 0;
            }
        };
        $scope.getAccountsList = function (status) {
            var stop;
            var deferred = $q.defer();
            stop = $interval(function () {
                serverConnection.tokenPostStatus(status).then(function (accid) {
                    if (accid.length !== 0) {
                        $interval.cancel(stop);
                        deferred.resolve(accid);
                    }
                });
            }, 5000);
            return deferred.promise;
        };
        $scope.appData.helpSignUpArr = [
            {
                text: 'מסך סקירה כללית מאפשר לך לצפות במידע פיננסי באופן מרוכז ותמציתי בכלל החשבונות שהוזנו למערכת, כעת נפרט כעת נפרט ונסביר כל כל רכיב במסך',
                top: '180px',
                right: '50%'
            },
            {
                text: 'גרף זה מראה את הפעולות בתזרים לשבוע הקרוב ובנוסף יתרות בנקים',
                top: '505px',
                right: '50%'
            },
            {
                text: 'ניתוח כספי לתקופה מסוימת, משיכות מול הפקדות',
                top: '116px',
                right: '50%'
            },
            {
                text: 'פה יופיעו הפעולות האחרונות מכל חשבונות הבנק',
                top: '140px',
                right: '50%'
            },
            {
                text: 'בלחיצה על אייקון זה, תוכל לראות הודעות והתראות.',
                top: '140px',
                right: '50%'
            },
            {
                text: 'באפשרותך לצפות בנתונים פיננסיים של העסק בצורה מרוכזת',
                top: '200px',
                right: '50%'
            },
            {
                text: 'לאחר טעינת הבנק תגיע למסך זה שבו תוכל להגדיר ולערוך את הפעולות הקבועות שזיהינו בחשבונותיך',
                top: '180px',
                right: '50%'
            },
            {
                text: 'המערכת מזהה פעולות מחזוריות ומבקשת אישורך להפכן לקבועות בתזרים',
                top: '200px',
                right: '50%'
            },
            {
                text: 'הוספת פעולה קבועה חדשה',
                top: '200px',
                right: '50%'
            },
            {
                text: 'לחץ על העיפרון על מנת לערוך פעולה קיימת',
                top: '200px',
                right: '50%'
            },
            {
                text: 'במסך זה תוכל להגדיר חשבונות בנק נוספים,להוסיף כרטיסי אשראי חוץ בנקאיים וחשבונות סליקה',
                top: '180px',
                right: '50%'
            },
            {
                text: 'אפשרות הוספת חשבונות מבנקים נוספים',
                top: '200px',
                right: '50%'
            },
            {
                text: 'מסך זה מאפשר לצפות ולערוך את נתוני תזרים מזומנים בצורה קלה ומפורטת, תוכל לעשות סינונים שונים ולהוסיף פעולות עתידיות',
                top: '180px',
                right: '50%'
            },
            {
                text: 'אפשרות סינון מתקדם לפי תאריך רצוי',
                top: '290px',
                right: '75%'
            },
            {
                text: 'אפשרות סינון לפי בנק',
                top: '138px',
                right: '50%'
            },
            {
                text: 'הוספת צפי הכנסה/הוצאה ישירות לתוך תזרים',
                top: '180px',
                right: '50%'
            },
            {
                text: 'אנא המתן לסיום טעינת הנתונים...',
                top: '180px',
                right: '50%'
            }
        ];
        $scope.gotoNextHelp = function () {
            $scope.appData.helpSignUpClass = false;

            $scope.appData.helpSignUpInd = $scope.appData.helpSignUpInd + 1;
            if ($scope.appData.helpSignUpInd == 2) {
                $(".bg-dark").animate({
                    scrollTop: 300
                }, 600);
            }
            if ($scope.appData.helpSignUpInd == 4) {
                $scope.openMess = true;
                $scope.openMessages(true)
            }
            if ($scope.appData.helpSignUpInd == 5) {
                $scope.openMess = false;
            }
            if ($scope.appData.helpSignUpInd == 6) {
                $state.go('regularOp.cube');
                $scope.appData.helpSignUpClass = true;
            }
            if ($scope.appData.helpSignUpInd == 10) {
                $state.go('settings.accounts');
                $scope.appData.helpSignUpClass = true;
            }
            if ($scope.appData.helpSignUpInd == 12) {
                $state.go('tazrim');
                $scope.appData.helpSignUpClass = true;
            }
            if ($scope.appData.helpSignUpInd == 13) {
                $scope.showFilters = true;
            }
            if ($scope.appData.helpSignUpInd == 14) {
                $scope.showFilters = false;
            }
            if ($scope.appData.helpSignUpInd == 15) {
                $scope.appData.buttonHelp = 'זהו, סיימנו';
            }
            $scope.appData.helpFadeout = true;
            $timeout(function () {
                $scope.appData.helpFadeout = false;
            }, 300)
        }
        $scope.appData.helpSignUp = false;
        $scope.appData.buttonHelp = 'המשך';
        $scope.appData.helpSignUpInd = 0;
        $scope.appData.helpSignUpClass = true;
        //$scope.helpSignUp = function () {
        //	//$scope.appData.helpSignUp = true;
        //	//$scope.appData.helpSignUpInd = 0;
        //	$state.go('general.funds');
        //}
        $scope.accListLoad = function (status) {
            $scope.login(true).then(function (success) {
                var success = success.replace(/"/g, '');
                if (success !== '00000000-0000-0000-0000-000000000000') {
                    $scope.appData.logout = success;
                    localStorage.setItem('logout', success);
                    $state.go('general.funds');
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 3500);
                } else {
                    $state.go('login');
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 3500);
                }
            }, function (error) {
                $state.go('login');
                setTimeout(function () {
                    window.location.reload(true);
                }, 3500);
            });
        }
        $scope.reloadAccData = function () {
            if ($scope.appData.accSet && $scope.appData.accSet.length > 1) {
                $scope.showPopup('views/signup/popupAcc.html?ver=3.74', 'popupAcc', true);
            } else {
                $q.all([$scope.getGeneralDataCompanies(), $scope.getGeneralDataPermission()]).then(function (data) {
                    $scope.appData.companies = data[0];
                    $scope.appData.defMonth = data[1];
                    if (!$scope.appData.adminSoft && $scope.appData.defMonth.bizibox_employee === 1) {
                        $scope.logout();
                        return;
                    }
                    $scope.$broadcast("refresh");
                    $timeout(function () {
                        $scope.appData.helpSignUp = false;
                        $scope.appData.helpSignUpInd = 0;
                        if ($scope.appData.defMonth.ind_accountants == 0) {
                            $scope.gettokensalertsload();
                        }
                        $state.go('regularOp.cube');
                    }, 2000)
                });
            }
        }
        $scope.setPAcc = function (formPopAcc) {
            if (formPopAcc.$valid) {
                $scope.hidePopup();
                var data = {
                    "company_id": $scope.appData.uuidSignUp.outcompany_id,
                    "company_account_id": $scope.appData.uuidAcc
                };
                serverConnection.accountSetPrimary(data).then(function (res) {
                    $q.all([$scope.getGeneralDataCompanies(), $scope.getGeneralDataPermission()]).then(function (data) {
                        $scope.appData.companies = data[0];
                        $scope.appData.defMonth = data[1];
                        if (!$scope.appData.adminSoft && $scope.appData.defMonth.bizibox_employee === 1) {
                            $scope.logout();
                            return;
                        }
                        $scope.$broadcast("refresh");
                        $timeout(function () {
                            $scope.appData.helpSignUp = false;
                            $scope.appData.helpSignUpInd = 0;
                            if ($scope.appData.defMonth.ind_accountants == 0) {
                                $scope.gettokensalertsload();
                            }
                        }, 2000)
                    });
                    $state.go('regularOp.cube');
                }, function (error) {
                });
            }
        }
        $scope.getTotal = function (num, hideMinus) {
            if (num == undefined) {
                var s = "";
            } else {
                var num = parseInt(num).toFixed(0);
                var s = num.toString();
                if (hideMinus) {
                    s = s.replace('-', '');
                }
                s = s.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                if (s == "undefined") {
                    s = "0"
                }
            }
            return s;
        };
        $scope.getTotalRound = function (num, hideMinus) {
            if (num == undefined) {
                var s = "";
            } else {
                var num = Math.round(num);
                var s = num.toString();
                if (hideMinus) {
                    s = s.replace('-', '');
                }
                s = s.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                if (s == "undefined") {
                    s = "0"
                }
            }
            return s;
        }
        $scope.getTotalAgora = function (num, currency_id, id) {
            if (num !== undefined) {
                if (id !== undefined && $scope.appData.selectedCompany && $scope.appData.selectedCompany.accounts) {
                    $scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
                        if (v.company_account_id == id) {
                            currency_id = v.currency_id;
                        }
                    })
                }
                var cur = '';
                if (currency_id == null || currency_id == 1 || currency_id == "1") {
                    cur = '&#8362; ';
                } else {
                    cur = accoConversions.getCurrencyId(currency_id)
                }
                var sum = num.toString();
                if (sum.indexOf('.') !== -1) {
                    if (sum.split('.')[1].length > 1) {
                        sum = cur + sum.split('.')[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "<i class='colorNormal'>." + sum.split('.')[1].toString().substring(0, 2) + "</i>";
                    } else {
                        sum = cur + sum.split('.')[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "<i class='colorNormal'>." + sum.split('.')[1].toString() + "0</i>";
                    }
                } else {
                    sum = cur + sum.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "<i class='colorNormal'>.00</i>";
                }
                return sum;
            }
        }
        $scope.round2Fixed = function (value, hideMinus) {
            if (value || value == 0) {

                value = +value;

                if (isNaN(value))
                    return NaN;

                // Shift
                value = value.toString().split('e');
                value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 2) : 2)));

                if (hideMinus) {
                    value = value.toString().replace('-', '');
                }
                // Shift back
                value = value.toString().split('e');

                return (+(value[0] + 'e' + (value[1] ? (+value[1] - 2) : -2))).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

            }


            // var val = (+(value[0] + 'e' + (value[1] ? (+value[1] - 2) : -2))).toString();
            //
            //return  '<span>' + val.substring(0, val.length - 1).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '.</span><span style="color: #808080;">' + val.substring(val.length - 2, val.length) + '</span>';
        }
        $scope.roundFixed = function (value) {
            if (value !== undefined && value !== null) {
                return value.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            }
        }
        $scope.roundNum = function (value) {
            if (value !== undefined && value !== null) {
                return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            }
        }
        $scope.roundNumPoints = function (value) {
            if (value !== undefined && value !== null) {
                var fullSplitNum = value.toString().split('.');
                return fullSplitNum[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + (fullSplitNum[1] ? ('.' + fullSplitNum[1].substring(0, 2)) : '');
            }
        }
        $scope.checkIfFuture = function (date) {
            if (date) {
                var d = new Date(Number(date.split('/')[2]), Number(date.split('/')[1]), Number(date.split('/')[0]));
                return d.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
            }
            return false;
        }
        $scope.getDateEqualToday = function (dateEqual) {
            var date = new Date();
            var dateToday = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
            if (dateEqual == dateToday) {
                return 'נכון להיום בבוקר';
            } else {
                return dateEqual;
            }
        };
        $scope.getDateEqualTodayTazrim = function (dateEqual) {
            var date = new Date();
            var dateToday = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
            if (dateEqual == dateToday) {
                return 'היום בבוקר';
            } else {
                return dateEqual;
            }
        };
        $scope.openPopUpNewWebApp = function () {
            $scope.showPopup('views/templates/newWebApp.html?ver=3.74', 'ind_show_agreement', true, true);
        }
        $scope.goToManagerAcc = function () {
            if (localStorage.getItem('ACCOUNTANT_OFFICE_ID') && localStorage.getItem('ACCOUNTANT_OFFICE_ID') !== '') {
                $scope.$state.go('mainAccountants.managerAcc.office');
            } else {
                $scope.$state.go('mainAccountants.managerAcc.companyDetails');
            }
        }
        $scope.goToOcr = function (leadSource) {
            if ($scope.appData.defMonth.outind_ocr === 1 || $scope.appData.defMonth.outind_ocr === 3) {
                window.open("https://bsecure.bizibox.biz/accountants/companies?tab=journal-trans", "_self");
            } else {
                $scope.appData.leadSource_create_lead_ocr = leadSource;
                if (leadSource === 'supplier') {
                    $scope.$state.go('mainAccountants.ocrLandingPageSupplier');
                } else {
                    $scope.$state.go('mainAccountants.ocrLandingPageBank');
                }
            }
        }
        $scope.login = function (sign) {
            var deferred = $q.defer();
            var OSName = "Unknown OS";
            if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
            if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
            if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
            if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
            var data = {
                inuser_username: $scope.appData.user.email,
                inuser_password: $scope.appData.user.password,
                inbrowser: $scope.appData.browserDetect.browser + ' ' + $scope.appData.browserDetect.version,
                inos: OSName
            };
            serverConnection.login(data).then(function (success, status) {
                if (typeof (success) === "object") {
                    var baseDomain = '.bizibox.biz', expireAfter = new Date();
                    //expireAfter.setTime(expireAfter.getTime() + 600000);
                    expireAfter.setMinutes(expireAfter.getMinutes() + 9);
                    document.cookie = "bizibox_token-new=" + success.token + "; domain=" + baseDomain + "; expires=" + expireAfter.toUTCString() + "; path=/";
                    window.location.replace(success.location);
                } else {
                    sessionStorage.setItem('acco_user', JSON.stringify($scope.appData.user));
                    if ($scope.appData.user.rememberMe) {
                        localStorage.setItem('acco_user', JSON.stringify($scope.appData.user));
                    }
                    var success = success.replace(/"/g, '');
                    if (success !== '00000000-0000-0000-0000-000000000000') {
                        $scope.getGeneralDataCompanies()
                            .then(function (res) {
                                $scope.appData.companies = res;
                                $scope.getGeneralDataPermission().then(function (res) {
                                    $scope.appData.defMonth = res;
                                    if (!$scope.appData.adminSoft && $scope.appData.defMonth.bizibox_employee === 1) {
                                        $scope.logout();
                                        return;
                                    }
                                    if ($scope.appData.defMonth.ind_show_agreement === 1) {
                                        $scope.showPopup('views/templates/ind_show_agreement.html?ver=3.74', 'ind_show_agreement', true, true);
                                    }
                                    if ($scope.appData.defMonth.outind_ocr !== 1 && $scope.appData.defMonth.outind_ocr !== 3 && $scope.appData.defMonth.outind_ocr_popup === 1) {
                                        $scope.showPopup('views/templates/ocrLandingPageSupplier.html?ver=3.74', 'ocrLandingPageSupplierPopUp', true);
                                    }
                                    // else if ($scope.appData.defMonth.ind_phone_exist === 0) {
                                    // 	$scope.appData.phoneNumber = "";
                                    // 	$scope.appData.codeNumber = "";
                                    // 	$scope.appData.stepPhone = 1;
                                    // 	$scope.showPopup('views/templates/ind_phone_exist.html?ver=3.74', 'indPhoneExist', false, true);
                                    // }
                                    deferred.resolve(success);
                                    if (!sign) {
                                        if ($scope.appData.defMonth.ind_accountants == 0) {
                                            $scope.gettokensalertsload();
                                        }
                                    }
                                }, function (error) {
                                    deferred.resolve(success);
                                });
                            }, function (error) {
                                deferred.resolve(success);
                            });
                    } else {
                        deferred.resolve(success);
                    }
                }

            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.sendSmsService = function (cellPhone, code, step) {
            $scope.logerPhone = true;
            $scope.appData.codeNumberNotCorrect = false;

            if (step === 3 && code !== '180677') {
                $timeout(function () {
                    $scope.logerPhone = false;
                    $scope.appData.codeNumberNotCorrect = true;
                }, 1500);
            } else {
                serverConnection.update_phone_number({
                    cellPhone: "+972" + cellPhone.toString().substring(1, cellPhone.length),
                    code: code
                }).then(function (success) {
                    $scope.logerPhone = false;
                    $scope.appData.stepPhone = step;
                    if (step === 3) {
                        $timeout(function () {
                            $scope.hidePopup();
                        }, 3000)
                    }
                }).fail(function () {
                    $scope.logerPhone = false;
                    $scope.appData.codeNumberNotCorrect = true;
                })
            }
        }
        $scope.toFixedTrunc = function (value) {
            var n = 2;
            var f = Math.pow(10, n);
            return (Math.trunc(value * f) / f).toFixed(n).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        }
        $scope.gettokensalerts = function () {
            var deferred = $q.defer();
            serverConnection.gettokensalerts().then(function (success) {
                deferred.resolve(success);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.loadAlertsPassWrong = function () {
            if ($scope.appData.companySourceChangeId !== undefined) {
                serverConnection.company_getbiziboxtasks($scope.appData.companySourceChangeId)
                    .then(function (data) {
                        $scope.appData.messMatchPass = data;
                        $scope.appData.sumMessMatchPass = 0;
                        if ($scope.appData.messMatchPass.wp.length) {
                            $scope.appData.sumMessMatchPass += $scope.appData.messMatchPass.wp.length;
                        }
                        if ($scope.appData.messMatchPass.nigrarot.length) {
                            $scope.appData.sumMessMatchPass += 1;
                            if ($scope.appData.messMatchPass.result == 2 && $state.current.name == 'general.funds') {
                                if ($scope.appData.selectedCompany.companyId !== "856f4212-3f5f-4cfc-b2fb-b283a1da2f7c") {
                                    $scope.openListMatchMess();
                                }
                            }
                        }
                        if (!$scope.appData.permissionAlert) {
                            if (data.wp.length && (data.wp[0].status_id == 2 || data.wp[0].status_id == 3 || data.wp[0].status_id == 4)) {
                                $scope.appData.statusPassWrong = data.wp[0];
                                $scope.topSampleNav = '113px';
                                $scope.topSampleNavScroll = 123;
                                $scope.appData.permissionAlertHa = false;
                                $scope.appData.permissionAlertKs = false;
                                $scope.appData.permissionAlert = true;
                                $scope.appData.statusPassAlert = true;
                            } else {
                                $scope.topSampleNav = '55px';
                                $scope.topSampleNavScroll = 65;
                                $scope.appData.permissionAlertHa = false;
                                $scope.appData.permissionAlertKs = false;
                                $scope.appData.permissionAlert = false;
                                $scope.appData.statusPassAlert = false;
                            }
                        }
                        $scope.setHeightScroll();
                    }, function (error) {
                    });
            }
        };
        $scope.ind_task_read = function () {
            serverConnection.ind_task_read()
                .then(function (data) {
                    $scope.loadAlertsPassWrong();
                }, function (error) {
                });
        };
        $scope.closeAlertPass = function () {
            $scope.topSampleNav = '55px';
            $scope.appData.permissionAlertHa = false;
            $scope.appData.permissionAlertKs = false;
            $scope.appData.permissionAlert = false;
            $scope.appData.statusPassAlert = false;
            $scope.setHeightScroll();
        };
        $scope.clickMenuLinkMain = function () {
            $('ul.menu > li  a').removeClass('active');
            $('ul.menu > li > a.unclick_nav').next().slideUp('fast');
            if ($scope.appData.mainNavClosed) {
                $scope.appData.mainNavClosed = false;
                $scope.appData.mainNavClosedIs = true;
            }
        }
        $scope.checkPictureLink = function (pic) {
            if (pic == null) {
                return false
            } else {
                var indexofval = pic.indexOf("-");
                if (indexofval == -1) {
                    if (pic == 'x') {
                        return true
                    } else {
                        return false
                    }
                } else {
                    return true
                }
            }
        }
        $scope.gettokensalertsload = function () {
            $scope.gettokensalerts()
                .then(function (usersBanks) {
                    $scope.appData.usersBanksProgress = usersBanks;
                    if (usersBanks.length !== 0) {
                        $scope.appData.usersBanksProgress = usersBanks;
                        if ($scope.appData.companies.length == 1 && $scope.appData.selectedCompany && $scope.appData.selectedCompany.ksafimPrivilege == false) {
                            $scope.getAccountsList(usersBanks[0].token)
                                .then(function (acchas) {
                                    if (acchas.length > 0) {
                                        if (acchas.length > 1) {
                                            $scope.appData.accSet = acchas;
                                            $scope.showPopup('views/signup/popupAcc.html?ver=3.74', 'popupAcc', true);
                                        } else {
                                            $scope.appData.helpSignUp = false;
                                            $scope.appData.helpSignUpInd = 0;
                                            $q.all([$scope.getGeneralDataCompanies(), $scope.getGeneralDataPermission()]).then(function (data) {
                                                $scope.appData.companies = data[0];
                                                $scope.appData.defMonth = data[1];
                                                if (!$scope.appData.adminSoft && $scope.appData.defMonth.bizibox_employee === 1) {
                                                    $scope.logout();
                                                    return;
                                                }
                                                if ($scope.appData.defMonth.ind_accountants == 0) {
                                                    $scope.gettokensalertsload();
                                                }
                                            });
                                            $state.go('regularOp.cube');
                                        }
                                    }
                                }, function (error) {
                                });
                        }

                        var stop = $interval(function () {
                            if (location.hash !== '' && location.hash !== '#/login' && !(/^signup/.test(location.hash.split('/')[1]))) {
                                $scope.gettokensalerts().then(function (usersBanks) {
                                    if (usersBanks.length !== 0) {
                                        $scope.appData.usersBanksProgress = usersBanks;
                                    } else {
                                        $interval.cancel(stop);
                                        $timeout(function () {
                                            $scope.appData.usersBanksProgress = '';
                                        }, 60000)
                                    }
                                });
                            } else {
                                $interval.cancel(stop);
                                $timeout(function () {
                                    $scope.appData.usersBanksProgress = '';
                                }, 60000)
                            }
                        }, 10000);
                    }
                });
        };
        $scope.userAccGettokensalerts = function () {
            serverConnection.userAccGettokensalerts().then(function (usersBanks) {
                if (usersBanks.length !== 0) {
                    $scope.appData.userAccGettokensalerts = usersBanks;
                    var stop = $interval(function () {
                        serverConnection.userAccGettokensalerts().then(function (usersBanks) {
                            if ($state.current.name == 'mainAccountants.exportHashv') {
                                if (usersBanks.length !== 0) {
                                    $scope.appData.userAccGettokensalerts = usersBanks;
                                } else {
                                    $interval.cancel(stop);
                                    $timeout(function () {
                                        $scope.appData.userAccGettokensalerts = [];
                                    }, 60000)
                                }
                            } else {
                                $interval.cancel(stop);
                                $timeout(function () {
                                    $scope.appData.userAccGettokensalerts = [];
                                }, 60000)
                            }
                        });
                    }, 10000);
                } else {
                    $scope.appData.userAccGettokensalerts = [];
                }
            });
        };
        $scope.getGeneralDataCompanies = function () {
            var deferred = $q.defer();
            serverConnection.getCompanies().then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.getGeneralDataPermission = function () {
            var deferred = $q.defer();
            serverConnection.getDefMonth().then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        $scope.saveSelectedCompany = function () {
            localStorage.setItem('acco_companyId', $scope.appData.selectedCompany.companyId);
            localStorage.setItem('acco_companyName', $scope.appData.selectedCompany.companyName);
            //$scope.setCookie('companyId', $scope.appData.selectedCompany.companyId, 30);
            //$scope.setCookie('companyName', encodeURI($scope.appData.selectedCompany.companyName), 30);
            //localStorage.setItem('company_branch_id', $scope.appData.selectedCompany.company_branch_id);
            //localStorage.setItem("deatalisUser", JSON.stringify($scope.appData.selectedCompany));
        };
        $scope.getStoredSelectedCompanyIndex = function () {
            var storedCompanyId = localStorage.getItem('acco_companyId');
            if (storedCompanyId) {
                var l = $scope.appData.companies.length;
                for (var i = 0; i < l; i++) {
                    if (storedCompanyId == $scope.appData.companies[i].companyId) {
                        return (i);
                    }
                }
            }
            return null;
        };
        $scope.getCompanyAccounts = function () {
            var deferred = $q.defer();
            serverConnection.getCompanyAccounts($scope.appData.selectedCompany.companyId).then(function (accounts) {
                $scope.appData.selectedCompany.accounts = accounts;
                var accountAll = [];
                var acc = [], acc1 = [], acc2 = [], acc3 = [], acc4 = [];
                var datesToday = new Date();
                var dateToday = ("0" + (datesToday.getDate())).slice(-2) + '/' + ("0" + (datesToday.getMonth() + 1)).slice(-2) + '/' + datesToday.getFullYear().toString();
                if (accounts.bank_account_list && accounts.bank_account_list.length) {
                    accounts.bank_account_list.forEach(function (v) {
                        if (v.status == 0 && (v.balance_last_update_date == dateToday)) {
                            v.type = 0;
                            acc.push(v)
                        }
                        if (v.status == 0 && (v.balance_last_update_date !== dateToday)) {
                            v.type = 1;
                            acc1.push(v)
                        }
                        if (v.status !== 0 && v.status !== 2 && (v.balance_last_update_date == dateToday)) {
                            v.type = 2;
                            acc2.push(v)
                        }
                        if (v.status !== 0 && v.status !== 2 && (v.balance_last_update_date !== dateToday)) {
                            v.type = 3;
                            acc3.push(v)
                        }
                        if (v.status == 2) {
                            v.type = 4;
                            acc4.push(v)
                        }
                    })
                    var all = accountAll.concat(acc, acc1, acc2, acc3, acc4);
                    $scope.appData.selectedCompany.accounts.bank_account_list = all;
                    deferred.resolve($scope.appData.selectedCompany.accounts);
                } else {
                    deferred.resolve($scope.appData.selectedCompany.accounts);
                }
            }, function (error) {
                deferred.reject(true);
            });
            return deferred.promise;
        };
        $scope.formatdate = function (dateStr) {
            var d = split('-').join('/')
        };
        $scope.params_create_lead_ocr = {
            "fullName": "",
            "cell": "",
            "leadSource": "supplier"
        }
        $scope.create_lead_ocr_send = function (form) {
            if (form.$valid) {
                $scope.hidePopup();
                serverConnection.create_lead_ocr($scope.params_create_lead_ocr).then(function (res) {
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
        $scope.update_not_interested_ocr_date = function () {
            serverConnection.update_not_interested_ocr_date().then(function (res) {
                $scope.hidePopup();
            }, function (error) {

            });
        }
        $scope.stopPropagation = function (event) {
            event.stopPropagation();
        };
        $scope.showPopup = function (popupTemplate, classPop, allowClose, isPreferred) {
            if (!$scope.appData.showPopupPreferred) {
                $scope.appData.showPopup = true;
                if (allowClose) {
                    $scope.appData.popupClose = true;
                } else {
                    $scope.appData.popupClose = false;
                }
                $scope.appData.popupTemplate = popupTemplate;
                $scope.appData.classPop = classPop;
                if (isPreferred) {
                    $scope.appData.showPopupPreferred = true;
                }
            }
        };
        $scope.hidePopup = function (popupTemplate) {
            $scope.appData.showPopupPreferred = false;
            $scope.appData.showPopup = false;
        };
        $(document).keyup(function (e) {
            if (e.keyCode == 27) {
                $scope.hidePopup()
            }
        });
        $scope.hidePopupAndData = function (popupTemplate) {
            $scope.appData.showPopupPreferred = false;
            $scope.appData.showPopup = false;
            $scope.appData.data = 0;
        };
        $scope.setCookie = function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            document.cookie = cname + "=" + cvalue + "; " + exdays + "; " + "path=/";
        };
        $scope.setCookieMin = function (name, aaa, exTime) {
            var exdate = new Date();
            exdate.setTime(exdate.getTime() + exTime);
            var c_value = escape(aaa) + ((exTime == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = name + "=" + c_value + "; " + "path=/";
        };
        $scope.getCookie = function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';'), l = ca.length;
            for (var i = 0; i < l; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        };
        $scope.changePassword = function (formChangePass) {
            if (formChangePass.$valid) {
                if ($scope.appData.user.password == $scope.newPassword) {
                    $scope.errorChange = "הסיסמה זהה לסיסמתך הנוכחית ";
                    $scope.success = '';

                    return false;
                } else if ($scope.appData.user.email == $scope.newPassword) {
                    $scope.errorChange = "הסיסמה זהה לשם המשתמש ";
                    $scope.success = '';

                    return false;
                } else {
                    serverConnection.updatePasswordGet($scope.newPassword)
                        .then(function (success) {
                            $scope.errorChange = '';
                            $scope.success = "הסיסמא הוחלפה";
                            if ($scope.nextPage) {
                                location.replace($scope.nextPage);
                            } else {
                                location.replace("../");
                            }
                            // if (window.WalkMeAPI == undefined) {
                            // 	$scope.loadApiWalkMe();
                            // }
                        }, function (error) {
                            $scope.success = '';
                            $scope.errorChange = ' שגיאה בשליחת הנתונים';
                        });
                }
            }
        };
        if (!$scope.appData.dateFilter) {
            $scope.appData.dateFilter = {type: '0'};
        }
        $scope.LegalTz = function (tzval) {
            var tot = 0;
            for (i = 0; i < 8; i++) {
                x = (((i % 2) + 1) * new String(tzval).charAt(i));
                if (x > 9) {
                    x = x.toString();
                    x = parseInt(x.charAt(0)) + parseInt(x.charAt(1))
                }
                tot += x;
            }
            if ((tot + parseInt(new String(tzval).charAt(8))) % 10 !== 0) {
                return false;
            } else {
                return true;
            }
        }
        //$scope.appData.popUpAllNew1 = false;
        //$scope.showPopUpNew1 = function () {
        //	if (new Date(2015, 6, 10) > new Date() && (localStorage.getItem('hidealertnew1') == null || localStorage.getItem('hidealertnew1') == 'false')) {
        //		$scope.appData.popUpAllNew1 = true;
        //	}
        //}
        //
        //$scope.notShowNew1 = function (hidealertnew1) {
        //	localStorage.setItem('hidealertnew1', hidealertnew1)
        //}
        //
        //$scope.appData.popUpAllNew2 = false;
        //$scope.showPopUpNew2 = function () {
        //	if (new Date(2015, 6, 10) > new Date() && (localStorage.getItem('hidealertnew2') == null || localStorage.getItem('hidealertnew2') == 'false')) {
        //		$scope.appData.popUpAllNew2 = true;
        //	}
        //}
        //
        //$scope.notShowNew2 = function (hidealertnew2) {
        //	localStorage.setItem('hidealertnew2', hidealertnew2)
        //}
        //
        //
        //$scope.appData.popUpAllNew3 = false;
        //$scope.showPopUpNew3 = function () {
        //	if (new Date(2015, 6, 10) > new Date() && (localStorage.getItem('hidealertnew3') == null || localStorage.getItem('hidealertnew3') == 'false')) {
        //		$scope.appData.popUpAllNew3 = true;
        //	}
        //}
        //$scope.notShowNew3 = function (hidealertnew3) {
        //	localStorage.setItem('hidealertnew3', hidealertnew3)
        //}
        $scope.openSupportService = function () {
            $scope.appData.usersWorkVal = {};
            $scope.appData.usersWorkVal.companyId = angular.copy($scope.appData.selectedCompany.companyId);
            $scope.appData.usersWorkVal.taskTitle = "קריאת שירות לחברת " + $scope.appData.selectedCompany.companyName;
            $scope.showPopup('views/templates/openSupportService.html?ver=3.74', 'addTask notAdmin');
        }
        $scope.sendSupportService = function (supportForm) {
            if (supportForm.$valid) {
                if (!$scope.appData.usersWorkVal.sent) {

                    $scope.appData.usersWorkVal.sent = true;
                    var data = {
                        taskUserId: "00435295-07ca-721d-e053-650aa8c060e0",
                        taskType: 3,
                        taskTitle: $scope.appData.usersWorkVal.taskTitle,
                        taskDesc: $scope.appData.usersWorkVal.taskDesc,
                        driveLink: null,
                        stateType: 1,
                        priority: 2,
                        token: null,
                        companyAccountId: null,
                        companyId: $scope.appData.usersWorkVal.companyId,
                        bankTransid: null,
                        order_num: null,
                        closeMailToSend: $scope.appData.usersWorkVal.mail,
                        task_opener_name: $scope.appData.usersWorkVal.Task_open_name
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
        }
        $scope.updateAccountPasswordsLine = function (item) {
            $scope.appData.popupType = 0;
            $scope.appData.popupTypeLink = true;
            $scope.appData.popupDataToken = item.token;
            $scope.appData.popupDataBanks = {BankNumber: item.website_target_type_id};
            $scope.showPopup('views/templates/accountUpdatePasswordPopup.html?ver=3.74' + new Date().getTime(), 'accountUpdatePasswordPopup');
        };
        $scope.getDate = function (str) {
            var formatted = str.split('-').reverse().join('/');
            var arr = str.split('-').reverse();
            var today = new Date();
            if (today.getFullYear() == arr[2] && ("0" + today.getMonth()).slice(-2) == arr[1] && ("0" + today.getDate()).slice(-2) == arr[0])
                formatted = 'היום'
            return formatted;
        };
        $scope.isThisDate = function (month, year) {
            var isCompare = false;
            if (new Date().getMonth() !== Number(month) || new Date().getFullYear() !== Number(year)) {
                isCompare = true;
            }
            return isCompare;
        };
        $scope.getUrlPay = function (val) {
            // var url = 'https://secure.cardcom.co.il/External/ExternalClearingPage3.aspx?';
            // if (val.companyName) {
            // 	url += '&ExtCInvoiceTo=' + val.companyName;
            // }
            // if (val.city_name) {
            // 	url += '&ExtCInvoiceCity=' + val.city_name;
            // }
            // if (val.zipcode) {
            // 	url += '&ExtCInvoiceZipCode=' + val.zipcode;
            // }
            // if (val.companyHp) {
            // 	url += '&ExtCInvoiceUserID=' + val.companyHp;
            // }
            // if (val.mail) {
            // 	url += '&ExtCUserEmail=' + val.mail;
            // }
            // if (val.street) {
            // 	url += '&ExtCInvoiceStreet=' + val.street;
            // }
            // url += '&TerminalNumber=13942&extgroupid=1&languages=he';
            // if (val.companyHp) {
            // 	url += '&ReturnData=' + val.companyHp;
            // }
            // var urlHref = encodeURI(url);
            // return window.open(urlHref, '_blank');
            $state.go('settings.payments.payments');
        };
        $scope.removeCompany = function () {
            localStorage.removeItem('acco_companyId');
            localStorage.removeItem('acco_companyName');
            $scope.appData.selectedCompany = false;
            $('.company-selector-cnt input').val('');
            if ($scope.appData.adminSoft) {
                $state.go('mainAccountants.managerAcc.companyDetails');
            } else {
                $state.go('mainAccountants.main');
            }
        };
        $scope.removeCompanyRegular = function () {
            $timeout(function () {
                angular.element(".company-selector-cnt input").trigger('focus');
            }, 0);
        };
        $scope.goToLink = function (id, page) {
            $scope.appData.companies.forEach(function (v, i) {
                if (id == v.companyId) {
                    $scope.appData.selectedCompanyIndex = i;
                    $scope.appData.selectedCompanyIndexLink = true;
                    if (page == 'revah') {
                        $state.go('report');
                    }
                    if (page == 'maazan') {
                        $state.go('trialBalance');
                    }
                    if (page == 'listCompany') {
                        if (v.hanhahPrivilege == true) {
                            $state.go('overviewAcc.statistics');
                        } else {
                            $state.go('overviewAcc.ksafim');
                        }
                    }
                    if (page == 'businessInfo') {
                        if ($scope.$state.current.name === 'overviewAcc.businessInfo') {
                            $scope.getCompaniesThisStrorage(v);

                            $timeout(function () {
                                $templateCache.removeAll();
                                if ('caches' in window) {
                                    window.caches.keys().then(function (cacheNames) {
                                        cacheNames.forEach(function (cacheName) {
                                            window.caches.open(cacheName).then(function (cache) {
                                                return cache.keys();
                                            }).then(function (requests) {
                                                requests.forEach(function (request) {
                                                    window.caches.open(cacheName).then(function (cache) {
                                                        return cache.delete(request.url);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                                window.location.reload(true);
                            }, 150);
                        } else {
                            $state.go('overviewAcc.businessInfo');
                        }
                    }
                }
            })
        }
        var timeout = null;
        var counter = 0;
        $scope.timeoutLogOut = function () {
            if ($scope.$state.current.url !== '/login' && $scope.$state.current.name !== 'mainAccountants.bankDataManagement.view' && $scope.$state.current.name !== 'mainAccountants.manageWithdrawals') {
                var timeMin = 1200000;
                if ($scope.appData.adminSoft) {
                    timeMin = 7200000;
                }
                if (timeout !== null) {
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function () {
                    var count = 60;
                    counter = $interval(function () {
                        count = count - 1;
                        if (count <= 0) {
                            $interval.cancel(counter);
                            return false;
                        }
                        if (count == 1 && $scope.$state.current.name !== 'mainAccountants.bankDataManagement.view' && $scope.$state.current.name !== 'mainAccountants.manageWithdrawals') {
                            $scope.logoutServer();
                            $interval.cancel(counter);
                            return;
                        }
                        if ($scope.$state.current.name !== 'mainAccountants.bankDataManagement.view' && $scope.$state.current.name !== 'mainAccountants.manageWithdrawals') {
                            if ($scope.appData.adminSoft) {
                                $scope.textHeaderAlert = ' לא זיהינו פעולה בחשבונך ב-שעתיים האחרונות. המערכת תבצע יציאה אוטומטית בעוד:';
                            } else {
                                $scope.textHeaderAlert = '  לא זיהינו פעולה בחשבונך ב-20 הדקות האחרונות. המערכת תבצע יציאה אוטומטית בעוד:';
                            }
                            $scope.timer = count + " שניות  ";
                            $scope.alertsLogOutWrap = true;
                        }

                    }, 1000);
                }, timeMin);
            }
        };
        $scope.timeoutLogOutExit = function () {
            $timeout.cancel(timeout);
            $interval.cancel(counter);
            $scope.alertsLogOutWrap = false;
        };
        $scope.logout = function () {
            // if (window.WalkMePlayerAPI !== undefined) {
            // 	window.WalkMePlayerAPI.hidePlayer();
            // }
            $scope.logoutServer(true).then(function () {
                $state.go('login');
            });
        };
        $scope.logoutServerConnection = function () {
            $scope.logoutServer();
        };
        $scope.logoutServer = function (data) {
            var deferred = $q.defer();
            var uuidLogOut;
            uuidLogOut = localStorage.getItem('logout');
            if (uuidLogOut !== null) {
                serverConnection.logOut(uuidLogOut).then(function (response) {
                    deferred.resolve(response);
                    $scope.appData.user = false;
                    if (data) {
                        // localStorage.clear();
                        localStorage.removeItem('refrashCheckQa');
                        localStorage.removeItem('entryLimit');
                        localStorage.removeItem('activeNavQa');
                        localStorage.removeItem('refrashCheckQa');
                        localStorage.removeItem('usersWorkValMail');
                        localStorage.removeItem('usersWorkVal');
                        localStorage.removeItem('logout');
                        localStorage.removeItem('userAccName');
                        localStorage.removeItem('userAccNameUsers');
                        localStorage.removeItem('acco_user');
                        localStorage.removeItem('acco_companyId');
                        localStorage.removeItem('acco_companyName');
                    } else {
                        window.open("http://bizibox.biz/?nocookie=1", "_self");
                    }
                    sessionStorage.clear();
                    $scope.appData.companySourceChangeId = undefined;
                }, function (error) {
                    deferred.reject(error);
                });
            } else {
                deferred.resolve(true);
                $scope.appData.user = false;
                $scope.appData.companySourceChangeId = undefined;
            }
            return deferred.promise;
        };
        $scope.visibleNav = function () {
            if ($state.current.name == '' || $state.current.name == 'login' || $state.current.name == 'login.url' || $state.current.name == 'forgotPassword' || $scope.$state.includes('signup')) {
                return false;
            } else {
                return true;
            }
        }
        $scope.addCompanyOpen = function () {
            $scope.appData.companyAdd = {};
            serverConnection.get_source_programs()
                .then(function (res) {
                    $scope.appData.get_source_programs = res;
                    $scope.appData.get_source_programs.unshift({
                        PROGRAM_ID: "",
                        PROGRAM_NAME: "בחירה מרשימה"
                    });
                    $scope.appData.companyAdd.software = $scope.appData.get_source_programs[0].PROGRAM_ID;
                }, function (error) {
                });

            $scope.get_exporter_companies();
        }
        $scope.addCompanyOpenModal = function () {
            $scope.showPopup('views/templates/addCompany.html?ver=3.74', 'addCompanyWrap', false);
        }
        $scope.get_exporter_companies = function () {
            $scope.appData.counterExporter = {
                fail: 0,
                suc: 0
            };
            $scope.hidePopup();
            $scope.appData.loaderPopExporter = true;
            $scope.showPopup('views/templates/exporter_companies.html?ver=3.74', 'exporter_companies', true);
            serverConnection.get_exporter_companies()
                .then(function (response) {
                    $scope.appData.exporter_companies = response;
                    $scope.appData.loaderPopExporter = false;
                }, function (error) {
                });
        }
        $scope.resetCompany = function (addCompanyForm) {
            if (addCompanyForm) {
                addCompanyForm.$setPristine();
                addCompanyForm.$setUntouched();
            }
        };
        $scope.$watch('appData.showPopup', function (newValue, oldValue) {
            if (!newValue) {
                $scope.appData.showPopupPreferred = false;
            }
            if (newValue === oldValue) {
                return;
            }
            // if (newValue == false && ($scope.appData.classPop == "popWalkthrus" || $scope.appData.classPop == "popUpHelpWalkMe")) {
            // 	$scope.popWalkthrusClose();
            // }
            if (newValue == false && ($scope.appData.classPop.indexOf("contentPopWrap2") !== -1) && $state.current.name == "tazrim") {
                $scope.$broadcast("refresh");
                console.log("ref")
            }
            if ($scope.appData.selectedCompany && $scope.appData.selectedCompany.mail) {
                if ($scope.appData.selectedCompany.mail.indexOf("$") == -1) {
                    $scope.mail = $scope.appData.selectedCompany.mail;
                } else {
                    $scope.mail = $scope.appData.selectedCompany.mail.split('$')[1];
                }
            }

            setTimeout(function () {
                $scope.triggerResetForm();
            }, 10)
        }, true);
        $scope.triggerResetForm = function () {
            angular.element('#resetCompany').trigger('click');
        };
        $scope.sending = function (dataExcel) {
            serverConnection.sendMail(dataExcel).then(function (res) {
                $scope.error = 'המייל נשלח בהצלחה';
                $scope.hidePopup();
            }, function (error) {
                $scope.error = 'המייל לא נשלח בהצלחה';
            });
        };
        $scope.sendMailerRevah = function () {
            $scope.showPopup('views/templates/mailerRevah.html?ver=3.74', 'mailerPopup', false);
        };
        $scope.openLinkTasks = function (link) {
            var url = '#/mainAccountants/taskManager' + link;
            window.open(url, '_self')
            window.location.reload()
        }
        $scope.addCompany = function (addCompanyForm) {
            if (addCompanyForm.$valid) {
                $scope.appData.companyAdd.disabledButton = true;
                var name = $scope.appData.companyAdd.name, email = $scope.appData.companyAdd.email,
                    tel = $scope.appData.companyAdd.tel;
                if (name == '' || name == undefined) {
                    name = null;
                }
                if (email == '' || email == undefined) {
                    email = null;
                }
                if (tel == '' || tel == undefined) {
                    tel = null;
                }
                var data = {
                    inuser_name: name,
                    inuser_username: email,
                    inuser_cell: tel,
                    inuser_password: email,
                    incompany_name: $scope.appData.companyAdd.cname,
                    incompany_hp: $scope.appData.companyAdd.hp,
                    inesder_maam: $scope.appData.companyAdd.tax,
                    insource_program_id: $scope.appData.companyAdd.software
                }
                if ($scope.appData.companyAdd.db_name !== undefined) {
                    data.db_name = $scope.appData.companyAdd.db_name;
                }
                serverConnection.companyAccountantCreate(data).then(function (response) {
                    $scope.hidePopup();
                    if ($state.current.name == 'mainAccountants.companys.cube' || $state.current.name == 'mainAccountants.companys.table') {
                        addCompanyForm.$setPristine();
                        addCompanyForm.$setUntouched();
                        $scope.getGeneralDataCompanies().then(function (data) {
                            $scope.appData.companies = data;
                        });
                        $scope.$broadcast("refresh");
                    }
                    if ($state.current.name == 'mainAccountants.exportHashv') {
                        addCompanyForm.$setPristine();
                        addCompanyForm.$setUntouched();
                        $scope.getGeneralDataCompanies().then(function (data) {
                            $scope.appData.companies = data;
                        });
                        $scope.$broadcast("refresh");
                    }
                }, function (error) {
                });
            }
        }

        $scope.appData.disabledSendersExporter = false;
        $scope.send_exporter_companies = function () {
            $scope.appData.disabledSendersExporter = true;

            function sender(item) {
                var data = {
                    inuser_name: null,
                    inuser_username: null,
                    inuser_cell: null,
                    inuser_password: null,
                    incompany_name: item.COMPANY_NAME,
                    incompany_hp: item.HP,
                    inesder_maam: item.ESDER_MAAM,
                    insource_program_id: item.SOURCE_PROGRAM_ID
                }
                if (item.DATABASE_NAME !== undefined) {
                    data.db_name = item.DATABASE_NAME;
                }
                serverConnection.companyAccountantCreate(data).then(function (response) {
                    $scope.appData.counterExporter.suc += 1;
                    item.status = "success";
                    loopSenders();
                }, function (error) {
                    $scope.appData.counterExporter.fail += 1;
                    item.status = "fail";
                    loopSenders();
                });
            }

            function loopSenders() {
                for (var i = 0, len = $scope.appData.exporter_companies.length; i < len; i++) {
                    if ($scope.appData.exporter_companies[i].check && !$scope.appData.exporter_companies[i].status) {
                        sender($scope.appData.exporter_companies[i]);
                        break;
                    } else if (i + 1 == len) {
                        $scope.appData.disabledSendersExporter = false;
                        break;
                    }
                }
            }

            loopSenders();
        };
        $scope.pictureCheck = function (picture) {
            $scope.appData.imgPtr = 0;
            var max = picture.length;
            $scope.appData.iconCheck = picture;
            if (max == 1) {
                $scope.appData.prev_pic = false;
                $scope.appData.next_pic = false;
                $scope.appData.iconCheckAll = picture[0].replace(/&#10;/g, '');
            }
            if (max > 1) {
                $scope.appData.iconCheckAll = $scope.appData.iconCheck[0].replace(/&#10;/g, '');
                return $scope.navHide(0, (max - 1));
            }
        };
        $scope.navHide = function (imgPtr, max) {
            $scope.appData.imgPtr = imgPtr;
            $scope.appData.max = max;
            if ($scope.appData.imgPtr == $scope.appData.max) {
                $scope.appData.prev_pic = true;
                $scope.appData.next_pic = false;
            }
            if ($scope.appData.imgPtr == 0) {
                $scope.appData.prev_pic = false;
                $scope.appData.next_pic = true;
            }
            if (($scope.appData.imgPtr > 0) && ($scope.appData.imgPtr < $scope.appData.max)) {
                $scope.appData.prev_pic = true;
                $scope.appData.next_pic = true;
            }
        };
        $scope.nextImg = function () {
            if ($scope.appData.imgPtr == $scope.appData.max) {
                return;
            }
            $scope.appData.imgPtr = $scope.appData.imgPtr + 1;
            $scope.appData.iconCheckAll = $scope.appData.iconCheck[$scope.appData.imgPtr].replace(/&#10;/g, '');
            return $scope.navHide($scope.appData.imgPtr, $scope.appData.max);
        };
        $scope.prevImg = function () {
            if ($scope.appData.imgPtr == 0) {
                return;
            }
            $scope.appData.imgPtr = $scope.appData.imgPtr - 1;
            $scope.appData.iconCheckAll = $scope.appData.iconCheck[$scope.appData.imgPtr].replace(/&#10;/g, '');
            return $scope.navHide($scope.appData.imgPtr, $scope.appData.max);
        };
        $scope.successAlertSend = function () {
            $scope.showPopup('views/templates/succAlertSend.html?ver=3.74', 'popAlertSender', true);
            $timeout(function () {
                $scope.hidePopup();
            }, 1500)
        }
        //$window.onbeforeunload = $scope.logoutServer();
        $scope.openTfsPop = function () {
            $scope.tfsObj = {
                title: "",
                reproSteps: "",
                valTextFileUrl: undefined,
                valTextFileName: undefined,
                hyperlink: undefined
            };
            $scope.showPopup('views/templates/tfsPop.html?ver=3.74', 'tfsPop');
        }
        $scope.sendToTfs = function () {
            var company = "";
            if ($scope.appData.selectedCompany) {
                company = "<br><b>companyName: </b>" + $scope.appData.selectedCompany.companyName + "<br><b>companyId: </b>" + $scope.appData.selectedCompany.companyId + "<br><b>name_roh: </b>" + $scope.appData.defMonth.full_name;
            } else {
                company = "<br><b>name_roh: </b>" + $scope.appData.defMonth.full_name;
            }

            var content = [
                {
                    "op": "add",
                    "path": "/fields/System.Title",
                    "value": $scope.tfsObj.title
                },
                {
                    "op": "add",
                    "path": "/fields/System.AssignedTo",
                    "value": "eyal hazut <eyal@ifact.co.il>"
                },
                {
                    "op": "add",
                    "path": "/fields/Microsoft.VSTS.Scheduling.RemainingWork",
                    "value": 1
                },
                {
                    "op": "add",
                    "path": "/fields/System.AreaPath",
                    "value": "bizibox"
                },
                {
                    "op": "add",
                    "path": "/fields/Microsoft.VSTS.TCM.ReproSteps",
                    "value": "<p style='font-size:15px'><b>message: </b>" + $scope.tfsObj.reproSteps + "<br><b>locationUrl:</b> " + location.href + company + "</p>"
                },
                {
                    "op": "add",
                    "path": "/fields/System.WorkItemType",
                    "value": "Bug"
                },
                {
                    "op": "add",
                    "path": "/fields/System.Tags",
                    "value": "biziboxWeb;"
                }
            ];

            if ($scope.tfsObj.valTextFileUrl !== undefined) {
                content.push({
                    "op": "add",
                    "path": "/relations/-",
                    "value": {
                        "rel": "AttachedFile",
                        "url": $scope.tfsObj.valTextFileUrl,
                        "attributes": {
                            "comment": $scope.tfsObj.valTextFileName
                        }
                    }
                })
            }
            if ($scope.tfsObj.hyperlink !== undefined) {
                content.push({
                    "op": "add",
                    "path": "/relations/-",
                    "value": {
                        "rel": "Hyperlink",
                        "url": $scope.tfsObj.hyperlink
                    }
                })
            }
            var paramsData = {
                url: "https://bizibox2015.visualstudio.com/DefaultCollection/bizibox/_apis/wit/workitems/$Task?api-version=1.0",
                xhrFields: {
                    withCredentials: true
                },
                method: "PATCH",
                type: "PATCH",
                data: JSON.stringify(content),
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json-patch+json',
                    'Authorization': 'Basic ' + btoa("" + ":" + "5aznizuiwje4av3ymkgxxlzu6lxx3jgua64rqdnvixamhmjsyt7a")
                }
            };
            $.ajax(paramsData)
                .done(function (response, state, status) {
                    $scope.hidePopup()
                })
                .fail(function (error, resErr) {

                })
        }
        $scope.getNameAccTitle = function (id) {
            var text = "";
            if ($scope.appData.selectedCompany.accounts.bank_account_list) {
                $scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
                    if (v.company_account_id == id) {
                        text = v.company_account_nickname;
                    }
                });

            }
            return text;
        }
        $scope.reloadPageAndCompany = function () {
            $scope.getGeneralDataCompanies().then(function (data) {
                $scope.appData.companies = data;
                $state.reload();
            });
        }
        $scope.getShoetName = function (name) {
            var names = name.split(" ");
            names[names.length - 1] = names[names.length - 1].substring(0, 4);
            var nameShort = names.join().replace(/,/g, " ");
            return nameShort;
        }
        $scope.tokenStatusLoad = function (status) {
            $scope.getTokenPostStatus(status).then(function (acchas) {
                if ($scope.appData.defMonth.ind_accountants == 0) {
                    $scope.gettokensalertsload();
                }
                $scope.closeAlertPass();
                $scope.hidePopup();
                $scope.loadAlertsPassWrong();

                if ($scope.$state.current.url == "/exportHashv") {
                    $scope.userAccGettokensalerts();
                }
                $scope.$broadcast("refresh");
                $scope.appData.helps = true;
                $scope.appData.finishLoadBank = true;
            }, function (error) {
            });
        };
        $scope.getTokenPostStatus = function (token) {
            var stop;
            var deferred = $q.defer();
            stop = $interval(function () {
                $scope.appData.showSucUpdPass = false;
                serverConnection.tokenStatus(token).then(function (status) {
                    if (status.status_id == 9 || status.status_id == 10) {
                        $scope.appData.progressBankData = true;
                        $scope.appData.showSucUpdPass = false;
                        $scope.appData.errorProgressBank = false;
                    } else if (status.status_id == 1) {
                        $scope.appData.progressBankData = false;
                        $interval.cancel(stop);
                        $scope.appData.errorProgressBank = 'קיימת בעיה טכנית, אנא פנה לbizibox טל׳ 03-5610382';
                    } else if (status.status_id == 2) {
                        $scope.appData.progressBankData = false;
                        $interval.cancel(stop);
                        $scope.appData.errorProgressBank = 'ההתחברות לבנק נכשלה. אנא ודאו שהסיסמה עדכנית ושאין טעויות הקלדה. 3 ניסיונות כושלים יגרמו לחסימת החשבון.';
                    } else if (status.status_id == 3) {
                        $scope.appData.progressBankData = false;
                        $interval.cancel(stop);
                        $scope.appData.errorProgressBank = 'גישתך לחשבון חסומה';
                    } else if (status.status_id == 4) {
                        $scope.appData.progressBankData = false;
                        $interval.cancel(stop);
                        $scope.appData.errorProgressBank = 'סיסמתך בבנק פגה, אנא החלף סיסמה בבנק';
                    } else {
                        $interval.cancel(stop);
                        $scope.appData.showSucUpdPass = true;
                        $timeout(function () {
                            deferred.resolve(status.token_id);
                        }, 3000)
                    }
                });
            }, 5000);
            return deferred.promise;
        };
        $scope.openCheckImgMain = function (uuid, idBank, bankTransId) {
            if (uuid == 'x') {
                $scope.appData.imgPopIsShow = true;
                $scope.appData.imgPopIsShowType = 1;
                $timeout(function () {
                    $scope.appData.imgPopIsShowType = 0;
                    $scope.appData.imgPopIsShow = false;
                }, 3000)
            } else {
                $scope.loaderMatch = false;
                if ($scope.appData.selectedCompany.accounts && $scope.appData.selectedCompany.accounts.bank_account_list) {
                    var folder_name;
                    $scope.appData.selectedCompany.accounts.bank_account_list.forEach(function (v) {
                        if (v.company_account_id == idBank) {
                            folder_name = v.bank_id + '' + v.bank_snif_id + '' + v.bank_account_number;
                        }
                    });
                    serverConnection.copyCheks(uuid, folder_name, bankTransId).then(function (picture) {
                        $scope.loaderMatch = true;
                        if (picture.length > 0) {
                            $scope.appData.imgPopIsShow = true;
                            $scope.appData.imgPopIsShowType = 3;
                            return $scope.pictureCheck(picture);
                        } else {
                            $scope.appData.iconCheckAll = '';
                            $scope.appData.imgPopIsShow = true;
                            $scope.appData.imgPopIsShowType = 2;
                            $timeout(function () {
                                $scope.appData.imgPopIsShowType = 0;
                                $scope.appData.imgPopIsShow = false;
                            }, 1500)
                        }
                    }, function (error) {
                        $scope.loaderMatch = true;

                    });
                } else {
                    $scope.appData.iconCheckAll = '';
                    $scope.appData.imgPopIsShow = true;
                    $scope.appData.imgPopIsShowType = 2;
                    $timeout(function () {
                        $scope.appData.imgPopIsShowType = 0;
                        $scope.appData.imgPopIsShow = false;
                    }, 1500)
                }
            }
        };
        $scope.openTerms = function (type) {
            if (type == "1") {
                $scope.showPopup('views/signup/termosof.html?ver=3.74', 'openTerms');
            }
            if (type == "2") {
                $scope.showPopup('views/signup/popTermosfPrivate.html?ver=3.74', 'openTerms');
            }
        }
        $scope.checkIfIsHtml = function (text) {
            return /<[a-z/][\s\S]*>/i.test(text);
        }
        $scope.moveDetail = function (parama) {
            if (parama === 'next' && ($scope.appData.bankdetailIndex + 1) < $scope.appData.bankdetailAll.length) {
                $scope.appData.bankdetailIndex = $scope.appData.bankdetailIndex + 1;
                $scope.appData.bankdetail = $scope.appData.bankdetailAll[$scope.appData.bankdetailIndex];
            }
            if (parama === 'prev' && $scope.appData.bankdetailIndex > 0) {
                $scope.appData.bankdetailIndex = $scope.appData.bankdetailIndex - 1;
                $scope.appData.bankdetail = $scope.appData.bankdetailAll[$scope.appData.bankdetailIndex];
            }
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
        $scope.getRegularUsers = function (isRefresh) {
            $scope.appData.listUserAccountantsLoader = true;
            if (!isRefresh) {
                $scope.showPopup('views/templates/setAccUsersRegularManager.html?ver=3.74', 'setAccUser');
            }

            function CreateObjectStore(dbName, storeName) {
                var request = indexedDB.open(dbName);
                request.onsuccess = function (e) {
                    var database = e.target.result;
                    var isExist = database.objectStoreNames.contains(storeName);
                    if (!isExist) {
                        var version = parseInt(database.version);
                        database.close();
                        var secondRequest = indexedDB.open(dbName, version + 1);
                        secondRequest.onupgradeneeded = function (e) {
                            var database = e.target.result;
                            var isExist = database.objectStoreNames.contains(storeName);
                            if (!isExist) {
                                var objectStore = database.createObjectStore(storeName, {
                                    autoIncrement: true
                                });
                                database.close();

                                if (storeName === 'regularUsers') {
                                    serverConnection.getRegularUsers().then(function (usersData) {
                                        $scope.appData.listUserRegAccountants = usersData;
                                        $scope.appData.listUserAccountantsLoader = false;
                                        AddDataToTheStore(dbName, storeName, usersData);
                                    }, function (error) {

                                    });
                                } else {
                                    serverConnection.getDeletedUsers().then(function (usersData) {
                                        $scope.appData.listUserRegAccountants = usersData;
                                        $scope.appData.listUserAccountantsLoader = false;
                                        AddDataToTheStore(dbName, storeName, usersData);
                                    }, function (error) {

                                    });
                                }

                            }
                        };
                        secondRequest.onsuccess = function (e) {
                            e.target.result.close();
                        }
                    } else {
                        database.close();
                        ReadData(dbName, storeName);
                    }
                }
            }

            function ReadData(dbName, storeName) {
                var request = indexedDB.open(dbName);
                request.onsuccess = function (e) {
                    var database = e.target.result;
                    var objectStore = database.transaction([storeName], 'readwrite').objectStore(storeName);
                    $scope.appData.listUserRegAccountants = [];
                    var isDeleted = true;
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            isDeleted = false;
                            $scope.appData.listUserRegAccountants = cursor.value;
                            cursor.continue();
                        } else {
                            if (isDeleted) {
                                database.close();
                                if (storeName === 'regularUsers') {
                                    serverConnection.getRegularUsers().then(function (usersData) {
                                        $scope.appData.listUserRegAccountants = usersData;
                                        $scope.appData.listUserAccountantsLoader = false;
                                        AddDataToTheStore(dbName, storeName, usersData);
                                    }, function (error) {

                                    });
                                } else {
                                    serverConnection.getDeletedUsers().then(function (usersData) {
                                        $scope.appData.listUserRegAccountants = usersData;
                                        $scope.appData.listUserAccountantsLoader = false;
                                        AddDataToTheStore(dbName, storeName, usersData);
                                    }, function (error) {

                                    });
                                }
                            } else {
                                console.log("No more entries!");
                                $scope.appData.listUserAccountantsLoader = false;
                                database.close();
                            }
                        }
                    };
                }
            }

            function clearStore(dbName, storeName) {
                var request = indexedDB.open(dbName);
                request.onsuccess = function (e) {
                    var database = e.target.result;
                    database.transaction([storeName], 'readwrite').objectStore(storeName).clear();
                    database.close();
                    CreateObjectStore(dbName, storeName);
                }
            }

            function AddDataToTheStore(dbName, storeName, data) {
                var request = indexedDB.open(dbName);
                request.onsuccess = function (e) {
                    var database = e.target.result;
                    database.transaction([storeName], 'readwrite').objectStore(storeName).add(data);
                    database.close();
                }
            }

            if (!isRefresh) {
                if ($scope.appData.get_users === 'get_regular_users') {
                    CreateObjectStore('usersLists', 'regularUsers');
                } else {
                    CreateObjectStore('usersLists', 'deletedUsers');
                }
            } else {
                if ($scope.appData.get_users === 'get_regular_users') {
                    clearStore('usersLists', 'regularUsers');
                } else {
                    clearStore('usersLists', 'deletedUsers');
                }
            }

        }
        $scope.userCopypriv = function (reg) {
            $scope.hidePopup();
            $scope.appData.loaderPageChangeUsers = true;
            var users;
            if (reg) {
                users = JSON.parse($scope.appData.setUserNameAccList).USER_ID;
            } else {
                users = JSON.parse($scope.appData.setUserNameAccList).user_id;
            }

            localStorage.setItem('user_id', users);
            serverConnection.userCopypriv(users).then(function (res) {
                $q.all([$scope.getGeneralDataCompanies(), $scope.getGeneralDataPermission()]).then(function (data) {
                    $scope.appData.loaderPageChangeUsers = false;
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
                    if (res === 0) {
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
                        // if (localStorage.getItem('userAccName')) {
                        // 	$scope.appData.userAccName = localStorage.getItem('userAccName');
                        // 	$scope.appData.userAccNameUsers = "";
                        // }
                        // if (localStorage.getItem('userAccNameUsers')) {
                        // 	$scope.appData.userAccName = "";
                        // 	$scope.appData.userAccNameUsers = localStorage.getItem('userAccNameUsers');
                        // }
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
                            $scope.appData.removeTemplateCache = true;
                            $timeout(function () {
                                $scope.goToLink($scope.appData.companies[0].companyId, 'businessInfo');
                            }, 500)
                        } else {

                            if (!reg && JSON.parse($scope.appData.setUserNameAccList).accountant_office_id) {
                                $timeout(function () {
                                    $scope.appData.removeTemplateCache = true;
                                    if ($scope.$state.current.name === 'mainAccountants.managerAcc.office') {
                                        $templateCache.removeAll();
                                        if ('caches' in window) {
                                            window.caches.keys().then(function (cacheNames) {
                                                cacheNames.forEach(function (cacheName) {
                                                    window.caches.open(cacheName).then(function (cache) {
                                                        return cache.keys();
                                                    }).then(function (requests) {
                                                        requests.forEach(function (request) {
                                                            window.caches.open(cacheName).then(function (cache) {
                                                                return cache.delete(request.url);
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        }
                                        window.location.reload(true);
                                    } else {
                                        $state.go('mainAccountants.managerAcc.office');
                                        $rootScope.$broadcast("refresh");
                                    }

                                    // $scope.loadAccMangPage()
                                }, 500)
                            } else {
                                $scope.appData.removeTemplateCache = true;
                                if ($scope.$state.current.name === 'mainAccountants.managerAcc.office') {
                                    $templateCache.removeAll();
                                    if ('caches' in window) {
                                        window.caches.keys().then(function (cacheNames) {
                                            cacheNames.forEach(function (cacheName) {
                                                window.caches.open(cacheName).then(function (cache) {
                                                    return cache.keys();
                                                }).then(function (requests) {
                                                    requests.forEach(function (request) {
                                                        window.caches.open(cacheName).then(function (cache) {
                                                            return cache.delete(request.url);
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    }
                                    window.location.reload(true);
                                } else {
                                    $state.go('mainAccountants.managerAcc.companyDetails');
                                    $rootScope.$broadcast("refresh");
                                }

                                // $scope.loadAccMangPage()
                            }
                        }
                    } else {
                        $templateCache.removeAll();
                        if ('caches' in window) {
                            window.caches.keys().then(function (cacheNames) {
                                cacheNames.forEach(function (cacheName) {
                                    window.caches.open(cacheName).then(function (cache) {
                                        return cache.keys();
                                    }).then(function (requests) {
                                        requests.forEach(function (request) {
                                            window.caches.open(cacheName).then(function (cache) {
                                                return cache.delete(request.url);
                                            });
                                        });
                                    });
                                });
                            });
                        }
                        window.location.reload(true);
                    }
                }, function (error) {
                    $templateCache.removeAll();
                    if ('caches' in window) {
                        window.caches.keys().then(function (cacheNames) {
                            cacheNames.forEach(function (cacheName) {
                                window.caches.open(cacheName).then(function (cache) {
                                    return cache.keys();
                                }).then(function (requests) {
                                    requests.forEach(function (request) {
                                        window.caches.open(cacheName).then(function (cache) {
                                            return cache.delete(request.url);
                                        });
                                    });
                                });
                            });
                        });
                    }
                    window.location.reload(true);
                });
            }, function (error) {
                $templateCache.removeAll();
                if ('caches' in window) {
                    window.caches.keys().then(function (cacheNames) {
                        cacheNames.forEach(function (cacheName) {
                            window.caches.open(cacheName).then(function (cache) {
                                return cache.keys();
                            }).then(function (requests) {
                                requests.forEach(function (request) {
                                    window.caches.open(cacheName).then(function (cache) {
                                        return cache.delete(request.url);
                                    });
                                });
                            });
                        });
                    });
                }
                window.location.reload(true);
            });
        }
    }

    angular.module('controllers')
        .controller('mainCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$filter', '$q', '$interval', '$templateCache', '$anchorScroll', '$window', mainCtrl]);
}());


// function notify(){
// 	if (!("Notification" in window)) {
// 		alert("This browser does not support desktop notification");
// 	}
// 	else if (Notification.permission === "denied") {
// 		alert("Notifications blocked. Please enable them in your browser.");
// 	}
// 	else if (Notification.permission !== "denied") {
// 		Notification.requestPermission(function (permission) {
// 			if(!('permission' in Notification)) {
// 				Notification.permission = permission;
// 			}
// 			// If the user accepts, let's create a notification
// 			if (permission === "granted") {
// 				var notification = new Notification('theTitle', {
// 					body: "theBody",
// 					icon: "https://secure.bizibox.biz/image/logo_login.png"
// 				});
// 				setTimeout(notification.close.bind(notification), 5000);
// 				notification.onclick = function () {
// 					window.open("http://google.com");
// 				};
// 			}
// 		});
// 	}
//
// }






