(function () {
	function poalimAsakimCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $filter) {
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
		$scope.scrollPage = 180;
		$scope.maxSize = 10;
		$scope.tab = '2';
		$scope.appData.dateTodayParse = ("0" + ($scope.date.getDate())).slice(-2) + '/' + ("0" + ($scope.date.getMonth() + 1)).slice(-2) + '/' + $scope.date.getFullYear();
		$scope.typesFilters = {
			sumCompanies: true,
			SPIDER_BEGIN_WORK_DATE: false,
			BALANCE_LAST_UPDATED_DATE: false
		};
		$scope.init = function () {
			$scope.loadPoalimAsakim();
			$scope.gettokensalertsload();
		}
		$scope.$parent.selectCompany = function (company) {
			$scope.getCompaniesThisStrorage(company);
			$scope.$broadcast('widthChanged');
			if (!$scope.appData.selectedCompanyIndexLink) {
				if ($scope.appData.selectedCompany.hanhahPrivilege == true) {
					$state.go('overviewAcc.statistics');
				}
				else {
					$state.go('overviewAcc.ksafim');
				}
			}
			$scope.appData.selectedCompanyIndexLink = false;
		};
		$scope.currentPage = 1; //current page
		if (!localStorage.getItem('entryLimit')) {
			$scope.entryLimit = 50;
			localStorage.setItem('entryLimit', $scope.entryLimit)
		}
		else {
			$scope.entryLimit = parseFloat(localStorage.getItem('entryLimit'));
		}
		$scope.entryLimitChange = function () {
			localStorage.setItem('entryLimit', $scope.entryLimit)
		}
		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};
		//$scope.sort_by = function (predicate) {
		//	$scope.predicate = predicate;
		//	$scope.reverse = !$scope.reverse;
		//};
		var timeoutPoalim;
		$scope.loadPoalimAsakim = function () {
			$scope.appData.disablePlay = false;

			$timeout.cancel(timeoutPoalim);
			function convertDate(date) {
				if (date && date !== null) {
					return parseFloat(date.split('/')[2] + date.split('/')[1] + date.split('/')[0])
				}
			}

			$scope.appData.loaderPoalim = false;
			serverConnection.userGetPoalimbizStatusList().then(function (res) {
				$scope.appData.poalimAsakimArr = res;
				$scope.appData.spiderIdListAll = [];
				var disablePlay = 0;
				$scope.appData.poalimAsakimArr.forEach(function (v, i) {
					v.BALANCE_LAST_UPDATED_DATE_short = convertDate(v.BALANCE_LAST_UPDATED_DATE);
					v.CHECKPIC_LAST_UPDATE_DATE_short = convertDate(v.CHECKPIC_LAST_UPDATE_DATE);
					v.SPIDER_BEGIN_WORK_DATE_short = convertDate(v.SPIDER_BEGIN_WORK_DATE);
					if (v.OTP_TOKEN == null || (v.SPIDER_BEGIN_WORK_DATE !== null || v.LAST_EXPORT_STATUS > 0)) {
						disablePlay = 1;
					}
					if (i == 0) {
						if (v.SPIDER_ID !== null) {
							$scope.appData.spiderIdListAll.push(v.SPIDER_ID);
						}
					}
					if ($scope.appData.poalimAsakimArr.length - 1 > i) {
						if ($scope.appData.poalimAsakimArr[i].SPIDER_ID !== $scope.appData.poalimAsakimArr[i + 1].SPIDER_ID) {
							if ($scope.appData.poalimAsakimArr[i + 1].SPIDER_ID !== null) {
								$scope.appData.spiderIdListAll.push($scope.appData.poalimAsakimArr[i + 1].SPIDER_ID);
							}
						}
					}
				});
				if (disablePlay == 1) {
					$scope.appData.disablePlay = true;
					timeoutPoalim = $timeout(function () {
						$scope.loadPoalimAsakim()
					}, 12000)
				}
				$scope.appData.otpList = $scope.checkOtp($scope.appData.poalimAsakimArr);
				$scope.filterAll(true);
			}, function (error) {
			});
		}

		$scope.filtersRowsGroup = function (first) {
			function compare(a, b) {
				if (a.SPIDER_ID < b.SPIDER_ID)
					return -1;
				if (a.SPIDER_ID > b.SPIDER_ID)
					return 1;
				return 0;
			}

			$scope.appData.poalimAsakim.sort(compare);

			function nameNull(name) {
				if (name == null) {
					return 'לא משויך'
				}
				else {
					return name;
				}
			}

			var arr = [];
			if ($scope.appData.poalimAsakim && $scope.appData.poalimAsakim.length > 0) {
				$scope.appData.poalimAsakim.forEach(function (v, i) {
					if (i == 0) {
						var obj = {
							SPIDER_NAME: nameNull(v.SPIDER_NAME),
							SPIDER_ID: v.SPIDER_ID,
							title: true
						}
						arr.push(obj)
					}
					arr.push(v);
					if ($scope.appData.poalimAsakim.length - 1 > i) {
						if ($scope.appData.poalimAsakim[i].SPIDER_ID !== $scope.appData.poalimAsakim[i + 1].SPIDER_ID) {
							var obj = {
								SPIDER_NAME: nameNull($scope.appData.poalimAsakim[i + 1].SPIDER_NAME),
								SPIDER_ID: $scope.appData.poalimAsakim[i + 1].SPIDER_ID,
								title: true
							}
							arr.push(obj)
						}
					}
				});
				if (first) {
					$scope.sumAllRows = angular.copy(arr.length);
				}
				$scope.appData.poalimAsakim = arr;
			}
		}

		$scope.filterAll = function (first) {
			$scope.appData.loaderPoalim = false;
			$scope.appData.poalimAsakim = angular.copy($scope.appData.poalimAsakimArr);
			$scope.appData.poalimAsakim = $filter('filterSearchPoalim')($scope.appData.poalimAsakim, $scope.freeSearch);
			$scope.listExTitles = {
				sumCompanies: $scope.appData.poalimAsakimArr.length,
				SPIDER_BEGIN_WORK_DATE: 0,
				BALANCE_LAST_UPDATED_DATE: 0
			}
			if ($scope.appData.poalimAsakim.length > 0) {
				$scope.appData.poalimAsakim.forEach(function (v) {
					if (v.SPIDER_BEGIN_WORK_DATE !== null) {
						$scope.listExTitles.SPIDER_BEGIN_WORK_DATE++;
					}
					if (v.BALANCE_LAST_UPDATED_DATE !== null && (v.BALANCE_LAST_UPDATED_DATE == $scope.appData.dateTodayParse)) {
						$scope.listExTitles.BALANCE_LAST_UPDATED_DATE++;
					}
				});
			}
			$scope.appData.poalimAsakim = $filter('myfilter')($scope.appData.poalimAsakim, $scope.typesFilters);
			$scope.filtersRowsGroup(first);
			$scope.appData.loaderPoalim = true;
		}

		$scope.showRunType = function (notAll) {
			if (!notAll) {
				$scope.appData.runtypeRows = false;
			}
			$scope.appData.checkboxRunType = [
				{
					val: true,
					type: 24
				},
				{
					val: false,
					type: 32
				},
				{
					val: false,
					type: 2
				}
			]
			$scope.showPopup('views/templates/popupRunType.html?ver=3.74', 'popupRunType');
		}
		$scope.playRunType = function (notAll) {
			if (!notAll) {
				$scope.appData.runtypeRows = false;
			}
			var sum = 1;
			//$scope.appData.checkboxRunType.forEach(function (v) {
			//	if (v.val == true) {
			//		sum += v.type
			//	}
			//})
			if (!$scope.appData.runtypeRows) {
				var data = {
					inrun_type: sum
				}
			}
			else {
				var single_day_to_run = null;
				if ($scope.appData.runtypeRows.single_day_to_run !== '') {
					single_day_to_run = $scope.appData.runtypeRows.single_day_to_run;
				}
				var data = {
					inrun_type: sum,
					bank_snif_id: $scope.appData.runtypeRows.BANK_SNIF_ID,
					bank_account_id: $scope.appData.runtypeRows.BANK_ACCOUNT_ID,
					single_day_to_run: single_day_to_run
				}
			}
			serverConnection.userUpdateSpiderRuntype(data).then(function (res) {
				$scope.appData.runtypeRows = false;
				$scope.appData.loaderPoalim = false;
				$scope.loaIntervalLogs();
				$scope.showPopup('views/templates/popupStateConnectToBank.html?ver=3.74', 'popupStateConnectToBank');
			}, function (error) {

			});
		}

		$scope.loaIntervalLogs = function (isOtp) {
			var isOtp = isOtp;
			$scope.appData.loaderSpiderStatus = true;
			var checkStatus = setInterval(function () {
				serverConnection.userGetPoalimbizStatusList()
				.then(function (res) {
					$scope.appData.poalimAsakimArrAll = res;
					var arrLen = {
						SPIDER_BEGIN_WORK_DATE: 0,
						BALANCE_LAST_UPDATED_DATE: 0
					}
					if ($scope.appData.poalimAsakimArrAll.length > 0) {
						$scope.appData.poalimAsakimArrAll.forEach(function (v) {
							if (v.SPIDER_BEGIN_WORK_DATE !== null) {
								arrLen.SPIDER_BEGIN_WORK_DATE++;
							}
							if (v.BALANCE_LAST_UPDATED_DATE !== null && (v.BALANCE_LAST_UPDATED_DATE == $scope.appData.dateTodayParse)) {
								arrLen.BALANCE_LAST_UPDATED_DATE++;
							}
						});
					}
					$scope.appData.listExTitlesSpider = {
						SPIDER_BEGIN_WORK_DATE: arrLen.SPIDER_BEGIN_WORK_DATE,
						BALANCE_LAST_UPDATED_DATE: arrLen.BALANCE_LAST_UPDATED_DATE
					}
					if ((arrLen.SPIDER_BEGIN_WORK_DATE > 0 && arrLen.BALANCE_LAST_UPDATED_DATE > 0) && (arrLen.SPIDER_BEGIN_WORK_DATE == arrLen.BALANCE_LAST_UPDATED_DATE)) {
						clearInterval(checkStatus);
					}
				});
			}, 3000);

			function loadSpiderLogs() {
				if (!isOtp) {
					var concatAll = [], concatAllLast = [];
					$scope.appData.spiderIdListAll.forEach(function (v, ind) {
						serverConnection.spider_get_log(v)
						.then(function (res) {
							if (res.length) {
								concatAllLast.push(res[res.length - 1]);
							}
							$scope.appData.spider_logs = concatAll.concat(res);
							if (ind + 1 == $scope.appData.spiderIdListAll.length) {
								try {
									setTimeout(function () {
										var logElement = $("#logsSpiders")[0];
										if (logElement !== undefined) {
											logElement.scrollTop = logElement.scrollHeight;
										}
									}, 1000)
								}
								finally {
									var indStatus = 0;
									concatAllLast.forEach(function (v) {
										if (v.STATUS == 8 || v.STATUS == 7 || v.STATUS == 1 || v.STATUS == 2) {
											indStatus = 1;
										}
									});
									if (indStatus !== 1) {
										setTimeout(loadSpiderLogs, 5000);
									}
									else {
										$scope.appData.loaderSpiderStatus = false;
										$scope.hidePopup();
									}
								}
							}
						}, function (error) {
							loadSpiderLogs();
						});
					});
				}
				else {
					var concatAll = [], concatAllLast = [];
					serverConnection.spider_get_log($scope.appData.otpTokenLast)
					.then(function (res) {
						if (res.length) {
							concatAllLast.push(res[res.length - 1]);
						}
						$scope.appData.spider_logs = concatAll.concat(res);
						try {
							setTimeout(function () {
								var logElement = $("#logsSpiders")[0];
								if (logElement !== undefined) {
									logElement.scrollTop = logElement.scrollHeight;
								}
							}, 1000)
						}
						finally {
							var indStatus = 0;
							concatAllLast.forEach(function (v) {
								if (v.STATUS == 8 || v.STATUS == 7 || v.STATUS == 1 || v.STATUS == 2) {
									indStatus = 1;
								}
							});
							if (indStatus !== 1) {
								setTimeout(loadSpiderLogs, 5000);
							}
							else {
								$scope.appData.loaderSpiderStatus = false;
								$scope.hidePopup();
							}
						}
					}, function (error) {
						loadSpiderLogs();
					});
				}
			}

			loadSpiderLogs();
		}

		$scope.showRunTypeApply = function () {
			var data = {
				"inrun_type": -1
			}
			serverConnection.userUpdateSpiderRuntype(data).then(function (res) {
				if (res == 0) {
					$scope.loadPoalimAsakim()
				}
			}, function (error) {

			})
		}

		$scope.openRunType = function (a) {
			$scope.appData.runtypeRows = a;
			$scope.showRunType(true);
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
					}
					else {
						$scope.typesFilters[x] = true;
					}
				}
			}
			$scope.filterAll();
		};


		$scope.spiderUpdate = function () {
			$scope.loaderSpider = false;
			var data = {spider_id: $scope.appData.spiderUpdatePopSave.SPIDER_ID};
			if ($scope.tab == '1') {
				if ($scope.appData.spiderUpdatePopTab1.SINGLE_ACCOUNT_ID !== null) {
					data.single_account_id = $scope.appData.spiderUpdatePopTab1.SINGLE_ACCOUNT_ID;
				}
				if (null !== $scope.appData.spiderUpdatePopTab1.SINGLE_SNIF_ID) {
					data.single_snif_id = $scope.appData.spiderUpdatePopTab1.SINGLE_SNIF_ID;
				}
				if (null !== $scope.appData.spiderUpdatePopTab1.SINLE_DAYS_TO_RUN) {
					data.single_day_to_run = $scope.appData.spiderUpdatePopTab1.SINLE_DAYS_TO_RUN;
				}
				if (null !== $scope.appData.spiderUpdatePopTab1.RUN_TYPE) {
					data.run_type = $scope.appData.spiderUpdatePopTab1.RUN_TYPE;
				}
			}
			if ($scope.tab == '2') {
				if (null !== $scope.appData.spiderUpdatePopTab2.SINGLE_ACCOUNT_ID) {
					data.single_account_id = $scope.appData.spiderUpdatePopTab2.SINGLE_ACCOUNT_ID;
				}
				if (null !== $scope.appData.spiderUpdatePopTab2.SINGLE_SNIF_ID) {
					data.single_snif_id = $scope.appData.spiderUpdatePopTab2.SINGLE_SNIF_ID;
				}
				if (null !== $scope.appData.spiderUpdatePopTab2.SINLE_DAYS_TO_RUN) {
					data.single_day_to_run = $scope.appData.spiderUpdatePopTab2.SINLE_DAYS_TO_RUN;
				}
				if (null !== $scope.appData.spiderUpdatePopTab2.MATAH_DAY_TO_RUN) {
					data.matah_day_to_run = $scope.appData.spiderUpdatePopTab2.MATAH_DAY_TO_RUN;
				}
				if (null !== $scope.appData.spiderUpdatePopTab2.IND_CHECKPIC) {
					data.ind_checkpic = $scope.appData.spiderUpdatePopTab2.IND_CHECKPIC;
				}
				if (null !== $scope.appData.spiderUpdatePopTab2.IND_CCARD_DATA) {
					data.ind_ccard_data = $scope.appData.spiderUpdatePopTab2.IND_CCARD_DATA;
				}
				if (null !== $scope.appData.spiderUpdatePopTab2.IND_NILVIM) {
					data.ind_nilvim = $scope.appData.spiderUpdatePopTab2.IND_NILVIM;
				}
				if (null !== $scope.appData.spiderUpdatePopTab2.IND_RUN) {
					data.ind_run = $scope.appData.spiderUpdatePopTab2.IND_RUN;
				}
				if (null !== $scope.appData.spiderUpdatePopTab2.DATE_TILL) {
					data.date_till = $scope.appData.spiderUpdatePopTab2.DATE_TILL;
				}
			}

			serverConnection.spider_run(data).then(function (res) {
				$scope.loaderSpider = true;
				$scope.hidePopup()
			}, function (error) {
				$scope.hidePopup()
			});
		}

		$scope.spiderUpdatePop = function (data) {
			$scope.appData.spiderUpdatePopSave = angular.copy(data);
			$scope.appData.spiderUpdatePopTab1 = data;
			$scope.appData.spiderUpdatePopTab2 = data;
			$scope.showPopup('views/templates/spiderUpdatePopPoalim.html?ver=3.74', 'spiderUpdatePop');
		}

		$scope.$parent.refresh = function () {
			$scope.loadPoalimAsakim()
		};
		$scope.$on('refresh', function () {
			$scope.$parent.refresh();
		});
		$scope.help = function () {
		};
		$scope.getOtpToken = function () {
			$scope.appData.showAddTokenPopInside = false;
			serverConnection.get_OtpToken().then(function (res) {
				$scope.appData.get_OtpToken = res;
				$scope.showPopup('views/templates/tokensOtpLists.html?ver=3.74', 'tokensOtpLists');
			})
		}


		$scope.addTokenPopInside = function (a, remove) {
			if (a !== undefined) {
				$scope.appData.editTokenInsidePop = true;
				$scope.appData.tokenOTPPopInside = {
					otp_nickname: a.OTP_NICKNAME,
					otp_cell: a.OTP_CELL,
					ind_auto_otp_run: remove ? 999 : a.IND_AUTO_OTP_RUN,
					user_name: null,
					password: null,
					token: a.TOKEN
				};
			}
			else {
				$scope.appData.editTokenInsidePop = false;
				$scope.appData.tokenOTPPopInside = {
					otp_nickname: null,
					otp_cell: null,
					ind_auto_otp_run: 0,
					company_account_id: "00000000-0000-0000-0000-000000000000",
					user_name: null,
					password: null
				};
			}

			$scope.appData.showAddTokenPopInside = true;
		}

		$scope.token_run_manual_run = function () {
			serverConnection.token_run_manual($scope.appData.token_run_manual_PopInside).then(function (res) {
				$scope.appData.show_token_run_manual_PopInside = false;
				$scope.appData.otpTokenFromPopUp = $scope.appData.token_run_manual_PopInside.intoken;
				$scope.appData.passPoalim = "";
				$scope.showPopup('views/templates/passPoalimAsakim.html?ver=3.74', 'mailerPopup', false);
			})
		}
		$scope.token_run_manual = function (token) {
			$scope.appData.token_run_manual_PopInside = {
				inrun_type_to_do: 20,
				intoken: token,
			};

			$scope.appData.show_token_run_manual_PopInside = true;
		}
		$scope.removeTokenPopInside = function (a) {
			$scope.appData.removeTokenPopInside = true;
			$scope.appData.tokenOTPPopInside = {
				otp_nickname: a.OTP_NICKNAME,
				otp_cell: a.OTP_CELL,
				ind_auto_otp_run: 999,
				user_name: null,
				password: null,
				token: a.TOKEN
			};
		}
		$scope.updateTokenOTP999 = function () {
			$scope.appData.removeTokenPopInside = false;
			serverConnection.token_update_Otp($scope.appData.tokenOTPPopInside).then(function (res) {
				serverConnection.get_OtpToken().then(function (res) {
					$scope.appData.get_OtpToken = res;
					$scope.loadPoalimAsakim();
				})
			})
		}
		$scope.updateTokenOTP = function () {
			if ($scope.appData.tokenOTPPopInside.otp_cell.slice(0, 3) == "972") {
				if ($scope.appData.tokenOTPPopInside.otp_cell.length == 13) {
					$scope.appData.tokenOTPPopInside.otp_cell = $scope.appData.tokenOTPPopInside.otp_cell.slice(0, 3) + "" + $scope.appData.tokenOTPPopInside.otp_cell.slice(4, 13)
				}
			}
			else {
				if ($scope.appData.tokenOTPPopInside.otp_cell.length == 10) {
					$scope.appData.tokenOTPPopInside.otp_cell = "972" + $scope.appData.tokenOTPPopInside.otp_cell.slice(1, 10);
				}
			}
			$scope.appData.showAddTokenPopInside = false;

			if ($scope.appData.editTokenInsidePop) {
				serverConnection.token_update_Otp($scope.appData.tokenOTPPopInside).then(function (res) {
					serverConnection.get_OtpToken().then(function (res) {
						$scope.appData.get_OtpToken = res;
						$scope.loadPoalimAsakim();
					})
				})
			}
			else {
				serverConnection.token_createOtp($scope.appData.tokenOTPPopInside).then(function (res) {
					serverConnection.get_OtpToken().then(function (res) {
						$scope.appData.get_OtpToken = res;
						$scope.loadPoalimAsakim();
					})
				})
			}
		}

		$scope.checkOtp = function (arr) {
			var arrFinish = [];
			arr.forEach(function (v) {
				if (v.OTP_TOKEN !== null) {
					if (!arrFinish.length) {
						arrFinish.push({
							OTP_TOKEN: v.OTP_TOKEN,
							TARGET_USERNAME: v.TARGET_USERNAME
						})
					} else {
						var idx = 0;
						arrFinish.forEach(function (val, index) {
							if (val.OTP_TOKEN == v.OTP_TOKEN) {
								idx = 1;
							}
							if (index + 1 == arrFinish.length) {
								if (idx == 0) {
									arrFinish.push({
										OTP_TOKEN: v.OTP_TOKEN,
										TARGET_USERNAME: v.TARGET_USERNAME
									})
								}
							}
						})
					}
				}
			});
			return arrFinish;
		};


		$scope.runOtp = function () {
			$scope.appData.passPoalim = "";
			if ($scope.appData.otpList.length == 1) {
				serverConnection.token_run_manual({
					"inrun_type_to_do": 0,
					"intoken": $scope.appData.otpList[0].OTP_TOKEN
				}).then(function (res) {
					$scope.showPopup('views/templates/passPoalimAsakim.html?ver=3.74', 'mailerPopup', false);
				})
			}
			else {
				$scope.appData.otpTokenFromPopUp = $scope.appData.otpList[0].OTP_TOKEN;
				$scope.showPopup('views/templates/setTokenPoalimAsakim.html?ver=3.74', 'mailerPopup');
			}
		}


		$scope.runOtpFromPopUp = function () {
			serverConnection.token_run_manual({
				"inrun_type_to_do": 0,
				"intoken": $scope.appData.otpTokenFromPopUp
			}).then(function (res) {
				$scope.hidePopup();
				$scope.appData.passPoalim = "";
				$scope.showPopup('views/templates/passPoalimAsakim.html?ver=3.74', 'mailerPopup', false);
			})
		}

		$scope.runOtpFromPopUpInside = function (token) {
			$scope.appData.otpTokenFromPopUp = token;
			serverConnection.token_run_manual({
				"inrun_type_to_do": 0,
				"intoken": token
			}).then(function (res) {
				$scope.hidePopup();
				$scope.appData.passPoalim = "";
				$scope.showPopup('views/templates/passPoalimAsakim.html?ver=3.74', 'mailerPopup', false);
			})
		}

		$scope.token_updateotp = function () {
			var token = $scope.appData.otpTokenFromPopUp;
			// if ($scope.appData.otpList.length == 1) {
			// 	token = $scope.appData.otpList[0].OTP_TOKEN
			// }
			// else {
			// 	token = $scope.appData.otpTokenFromPopUp
			// }
			$scope.appData.otpTokenLast = token;
			serverConnection.token_updateotp({
				"token": token,
				"password": $scope.appData.passPoalim
			}).then(function (res) {
				$scope.hidePopup();
				$scope.appData.runtypeRows = false;
				$scope.appData.loaderPoalim = false;
				$scope.loaIntervalLogs();
				$scope.showPopup('views/templates/popupStateConnectToBank.html?ver=3.74', 'popupStateConnectToBank');
			})
		}
		$scope.openOtpPop = function (a) {
			$scope.appData.alertOTP = false;
			$scope.appData.otpUserPass = a;
			$scope.showPopup('views/templates/otpUserPass.html?ver=3.74', 'otpUserPass');
		}
		$scope.updatePassPoalim = function () {
			$scope.appData.alertOTP = false;
			var data = {
				"company_account_id": $scope.appData.otpUserPass.COMPANY_ACCOUNT_ID,
				"user_name": $scope.appData.otpUserPass.user,
				"password": $scope.appData.otpUserPass.pass
			}
			serverConnection.token_createOtp(data)
			.then(function (res) {
				$scope.loadPoalimAsakim();
				if (res == 1 || res == "1") {
					$scope.appData.alertOTP = true;
				}
				else {
					$scope.hidePopup();
				}
			}, function (error) {

			})
		}
		$scope.cleanSpiders = function () {
			$scope.appData.spidersLists = [];
			$scope.appData.poalimAsakim.forEach(function (v, i) {
				if (v.title) {
					$scope.appData.spidersLists.push(v);
				}
			});
			if ($scope.appData.spidersLists.length == 1) {
				$scope.cleanSpidersService($scope.appData.spidersLists[0].SPIDER_ID);
			}
			else {
				$scope.showPopup('views/templates/spidersListCleans.html?ver=3.74', 'spidersListCleans');
			}
		}
		$scope.cleanSpidersService = function (id) {
			$scope.appData.listAllClearLoader = true;
			serverConnection.spider_clean_account(id).then(function (res) {
				$scope.appData.listAllClearLoader = false;
			}, function (error) {
				$scope.appData.listAllClearLoader = false;
			});
		}
		$scope.$watch('appData.showPopup', function (newVal, oldVal) {
			if (newVal == false) {
				$scope.loadPoalimAsakim();
				$scope.error = '';
			}
		});
	}


	angular.module('controllers')
	.controller('poalimAsakimCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$filter', poalimAsakimCtrl]);
}());
