(function () {
	function signupCtrl($scope, $rootScope, $location, $window, $timeout, AppData, serverConnection, utils, $state, accoConversions, $q, $interval, $ocLazyLoad) {
		$scope.$location = $location;
		$scope.$state = $state;
		$scope.appData = AppData;
		$scope.accoConversions = accoConversions;
		$scope.initStates = function () {
			if ($scope.step1 == true) {
				$state.go('signup.step1');
			}
		};
		$scope.init = function () {
			//if (location.href.split("?")[1] == 'pelephone') {
			//	$scope.appData.showInputAg = true;
			//}

			window.open("https://bsecure.bizibox.biz/signup", "_self");

			if (location.hash.split("?").length > 1) {
				var locFromLand = location.hash.split("?")[1].split("&");
				if (locFromLand.length == 1) {
					$scope.typeAnswer = decodeURIComponent(locFromLand[0].split("=")[1].replace("%20", " "));
					window.ind_landing_page = 1;
					//$scope.loadApiWalkMe();
					setTimeout(function () {
						history.pushState({}, null, "https://secure.bizibox.biz/#/signup");
					}, 20);
				}
				if (locFromLand.length == 2) {
					$scope.user.name = decodeURIComponent(locFromLand[0].split("=")[1].replace("%20", " "));
					$scope.user.tel = decodeURIComponent(locFromLand[1].split("=")[1]);
					window.ind_landing_page = 1;
					window.user_id = $scope.user.tel;
					//$scope.loadApiWalkMe();
					setTimeout(function () {
						history.pushState({}, null, "https://secure.bizibox.biz/#/signup");
					}, 20);
				}
				if (locFromLand.length == 3) {
					$scope.user.name = decodeURIComponent(locFromLand[0].split("=")[1].replace("%20", " "));
					$scope.user.tel = decodeURIComponent(locFromLand[1].split("=")[1]);
					$scope.typeAnswer = decodeURIComponent(locFromLand[2].split("=")[1]);
					window.ind_landing_page = 1;
					window.user_id = $scope.user.tel;
					//$scope.loadApiWalkMe();
					setTimeout(function () {
						history.pushState({}, null, "https://secure.bizibox.biz/#/signup");
					}, 20);
				}
			}
			else {
				$state.go('signup.step1');
				window.ind_landing_page = 0;
				//$scope.loadApiWalkMe();
			}
		};
		$scope.loaderSign = true;
		$scope.stepSide = true;
		$scope.banks = $scope.accoConversions.getAllBanks();
		$scope.getNameBank = function (val) {
			var name;
			$scope.accoConversions.getAllBanks().forEach(function (v) {
				if (v.val == val) {
					name = v.name;
				}
			})
			return name;
		}
		$scope.srcLinkMobile = false;
		$scope.progressStep = 'step1Bar';
		$scope.titleSignUp = 'פרטים אישיים';
		$scope.smallTitleSignUp = '(בהמשך ניתן להוסיף משתמשים נוספים.)';
		$scope.step1 = true;
		$scope.step2 = false;
		$scope.step3 = false;

		//$scope.appData.isPelephone = true;
		$scope.master = {};
		// var axel = Math.random() + "";
		// var dbclick = "https://4632688.fls.doubleclick.net/activityi;src=4632688;type=lpimo0;cat=bizib00-;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=1;num=" + axel * 10000000000000 + "?";
		// $("#dbclick").attr("src", dbclick);
		$scope.update = function (user, form) {
			$scope.master = angular.copy(user);
			if (form.$valid) {
				$scope.loaderSign = false;

				var tel, fname, lname;
				if ($scope.user.name) {
					fname = $scope.user.name.split(' ')[0];
					lname = $scope.user.name.split(' ')[1];
				}
				if ($scope.user.tel) {
					var length_str = $scope.user.tel.length;
					if (length_str > 0) {
						if (length_str == 10) {
							tel = $scope.user.tel.substr(0, 3) + '-' + $scope.user.tel.substr(3, 9);
						} else if (length_str == 9) {
							tel = $scope.user.tel.substr(0, 2) + '-' + $scope.user.tel.substr(2, 8);
						}
					}
				}
				var OSName = "Unknown OS";
				if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
				if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
				if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
				if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
				var inanswer = null;
				if ($scope.typeAnswer) {
					inanswer = $scope.typeAnswer;
				}
				var pel = 1;
				if (location.href.split("?")[1] !== undefined) {
					pel = location.href.split("?")[1];
				}
				var data = {
					'inuser_name': $scope.user.email,
					'infirst_name': fname,
					'inlast_name': lname,
					'in_cell': tel,
					'in_ios': OSName,
					'inanswer': inanswer,
					'in_hesder_id': pel
				};
				serverConnection.updateLeadInfo(data).then(function (res) {
					if (res == true) {
						//$scope.appData.showInputAg = false;
						$scope.progressStep = 'step2Bar';
						$scope.titleSignUp = 'פרטי העסק';
						$scope.smallTitleSignUp = '';
						$scope.step1 = false;
						$scope.step2 = true;
						$scope.step3 = false;
						$scope.loaderSign = true;
						if (window.ind_landing_page !== 1) {
							ga('send', 'event', 'lead-event', 'homepage-form-lead');
						}
						ga('send', 'event', 'step1button', 'click', 'step1completed');
						var axel = Math.random() + "";
						var a = axel * 10000000000000000;
						var flDiv = document.body.appendChild(document.createElement("div"));
						flDiv.setAttribute("id", "DCLK_FLDiv1");
						flDiv.style.position = "absolute";
						flDiv.style.top = "0";
						flDiv.style.left = "0";
						flDiv.style.width = "1px";
						flDiv.style.height = "1px";
						flDiv.style.display = "none";
						flDiv.innerHTML = '<iframe id="DCLK_FLIframe1" src="https://4632688.fls.doubleclick.net/activityi;src=4632688;type=lpimo0;cat=bizib001;ord=1" width="0" height="0" frameborder="0"><\/iframe>';
						$state.go('signup.step2');

						$('body,html').animate({
							scrollTop: 0
						}, 500);
					}
				}, function (error) {

				});
			}
			else {
				if ($scope.user.tel) {
					var tel, fname, lname;
					var length_str = $scope.user.tel.length;
					if (length_str > 0) {
						if (length_str == 10) {
							tel = $scope.user.tel.substr(0, 3) + '-' + $scope.user.tel.substr(3, 9);
						} else if (length_str == 9) {
							tel = $scope.user.tel.substr(0, 2) + '-' + $scope.user.tel.substr(2, 8);
						}
					}

					if ($scope.user.name) {
						fname = $scope.user.name.split(' ')[0];
						lname = $scope.user.name.split(' ')[1];
					}
					var OSName = "Unknown OS";
					if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
					if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
					if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
					if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
					var inanswer = null;
					if ($scope.typeAnswer) {
						inanswer = $scope.typeAnswer;
					}
					var pel = 1;
					if (location.href.split("?")[1] !== undefined) {
						pel = location.href.split("?")[1];
					}
					var data = {
						'inuser_name': $scope.user.email,
						'infirst_name': fname,
						'inlast_name': lname,
						'in_cell': tel,
						'in_ios': OSName,
						'inanswer': inanswer,
						'in_hesder_id': pel
					};
					serverConnection.updateLeadInfo(data).then(function (res) {
					}, function (error) {
					});
				}
			}
		};
		$scope.back = function () {
			$scope.progressStep = 'step1Bar';
			$scope.titleSignUp = 'פרטים אישיים';
			$scope.smallTitleSignUp = '(בהמשך יהיה ניתן להוסיף משתמשים נוספים.)';
			$scope.step1 = true;
			$scope.step2 = false;
			$scope.step3 = false;
			$state.go('signup.step1');
			$('body,html').animate({
				scrollTop: 0
			}, 500);
		}
		$scope.update2 = function (form2) {
			if (form2.$valid) {
				$scope.loaderSign = false;

				var tel;
				if ($scope.user.tel) {
					var length_str = $scope.user.tel.length;
					if (length_str > 0) {
						if (length_str == 10) {
							tel = $scope.user.tel.substr(0, 3) + '-' + $scope.user.tel.substr(3, 9);
						} else if (length_str == 9) {
							tel = $scope.user.tel.substr(0, 2) + '-' + $scope.user.tel.substr(2, 8);
						}
					}
				}

				var pel = 1;
				if (location.href.split("?")[1] !== undefined) {
					pel = location.href.split("?")[1];
				}

				var data = {
					inuser_name: $scope.user.name,
					inuser_cell: tel,
					inuser_username: $scope.user.email,
					inuser_password: $scope.user.password,
					incompany_name: $scope.user.cname,
					incompany_hp: $scope.user.hp,
					inhesder_id: pel
				}

				serverConnection.companyUserCreate(data).then(function (res) {
					$scope.appData.uuidSignUp = res;
					if (res.outcompany_id !== null) {
						$scope.stepSide = false;
						$scope.progressStep = 'step3Bar';
						$scope.titleSignUp = 'קישור חשבון הבנק';
						$scope.smallTitleSignUp = '';
						$scope.step1 = false;
						$scope.step2 = false;
						$scope.step3 = true;
						$state.go('signup.step3');
						$scope.loaderSign = true;
						ga('send', 'event', 'step2button', 'click', 'step2completed');
						var axel = Math.random() + "";
						var a = axel * 10000000000000000;
						var flDiv = document.body.appendChild(document.createElement("div"));
						flDiv.setAttribute("id", "DCLK_FLDiv1");
						flDiv.style.position = "absolute";
						flDiv.style.top = "0";
						flDiv.style.left = "0";
						flDiv.style.width = "1px";
						flDiv.style.height = "1px";
						flDiv.style.display = "none";
						flDiv.innerHTML = '<iframe id="DCLK_FLIframe1" src="https://4632688.fls.doubleclick.net/activityi;src=4632688;type=lpimo0;cat=bizib002;ord=1" width="0" height="0" frameborder="0"><\/iframe>';
						$('body,html').animate({
							scrollTop: 0
						}, 500);
					}
				}, function (error) {

				});
			}
		};

		$scope.alertErrorHead = false;

		$scope.getTokenStatus = function (successtoken) {
			$scope.state_enable = true;
			var deferred = $q.defer();

			function internal(t) {
				$timeout(function () {
					serverConnection.tokenStatus(successtoken).then(function (status) {
						var error = 0;
						if (status.status_id == 9 || status.status_id == 10) {
							error++;
							$scope.error = 'מתבצע ניסיון לחיבור ראשוני, לאחר אישור ההתחברות תועבר להדרכה קצרה על המערכת עד שיטענו חשבונותיך';
							$scope.alertError = true;
							$scope.alertErrorHead = false;
							$scope.errorRed = false;
							internal(5000);
						} else if (status.status_id == 1) {
							error++;
							$scope.error = 'קיימת בעיה טכנית, אנא פנה לתמיכת bizibox 03-5610382';
							$scope.alertError = true;
							$timeout(function () {
								$scope.alertError = false;
							}, 2000)
							$scope.alertErrorHead = true;
							$scope.errorRed = true;
							$scope.state_enable = false;
						} else if (status.status_id == 2) {
							error++;
							$scope.error = 'אחד או יותר מהפרטים המזהים שהקלדת שגוי. אנא נסה/י שנית.';
							$scope.alertError = true;
							$scope.errorRed = true;
							$scope.alertErrorHead = true;
							$timeout(function () {
								$scope.alertError = false;
							}, 2000)
							$scope.state_enable = false;
						} else if (status.status_id == 3) {
							error++;
							$scope.error = 'גישתך לחשבון חסומה';
							$scope.errorRed = true;
							$scope.alertError = true;
							$scope.alertErrorHead = true;
							$timeout(function () {
								$scope.alertError = false;
							}, 2000)
							$scope.state_enable = false;
						} else if (status.status_id == 4) {
							error++;
							$scope.error = 'סיסמתך בבנק פגה, אנא החלף סיסמה בבנק';
							$scope.alertError = true;
							$scope.errorRed = true;
							$scope.alertErrorHead = true;
							$timeout(function () {
								$scope.alertError = false;
							}, 2000)
							$scope.state_enable = false;
						} else if (!error) {
							$scope.error = 'ההתחברות בוצעה בהצלחה!';
							$scope.errorRed = false;
							$scope.alertErrorHead = false;
							$scope.alertError = true;
							$scope.state_enable = true;
							deferred.resolve(status.token_id);
						}
					});
				}, t);
			}

			internal(0);
			return deferred.promise;
		};

		$scope.signLogin = function () {
			$scope.login().then(function (success) {
				var success = success.replace(/"/g, '');
				if (success !== '00000000-0000-0000-0000-000000000000') {
					$scope.appData.logout = success;
					localStorage.setItem('logout', success);
					$state.go('general.funds');
					setTimeout(function () {
						window.location.reload(true);
					}, 3500);
				}
			}, function (error) {
			});
		}

		$scope.signLoginEx = function () {
			if(dataLayer !== undefined){
				dataLayer.push({
					"event": "Full Signup – Success - without bank details"
				})
			}
			//ga('send', 'event', 'step3button', 'view_product', 'step3completed');
			// var axel = Math.random() + "";
			// var a = axel * 10000000000000000;
			// var flDiv = document.body.appendChild(document.createElement("div"));
			// flDiv.setAttribute("id", "DCLK_FLDiv1");
			// flDiv.style.position = "absolute";
			// flDiv.style.top = "0";
			// flDiv.style.left = "0";
			// flDiv.style.width = "0px";
			// flDiv.style.height = "0px";
			// flDiv.style.display = "none";
			// flDiv.innerHTML = '<iframe id="DCLK_FLIframe1" src="https://4632688.fls.doubleclick.net/activityi;src=4632688;type=lpimo0;cat=bizib003;ord=1" width="0" height="0" frameborder="0"><\/iframe>';
			$scope.appData.user = {email: $scope.user.email, password: $scope.user.password};
			$scope.signLogin()
		}

		$scope.addPost = function (formBank, myBanks) {
			if (formBank.$valid) {
				$scope.progressStep = 'step4Bar';
				$scope.state_enable = true;
				$scope.alertErrorHead = false;
				if(dataLayer !== undefined){
					dataLayer.push({
						"event": "Full Signup – Success - with bank details"
					})
				}
				var id = $scope.appData.uuidSignUp.outcompany_id;
				if (myBanks.val == '999') {
					var indAccPoalim = 0;
					var data = {
						companyId: id,
						bankId: '12',
						bankSnifId: myBanks.inputs[0].data,
						bankAccId: myBanks.inputs[1].data,
						indAccPoalim: indAccPoalim
					};
					serverConnection.insertPoalimBasakim(data).then(function (res) {
						$scope.error = 'נציג ביזיבוקס ייצור איתך קשר בהקדם, הנך מועבר לחברה לדוגמא';
						$scope.alertError = true;
						$timeout(function () {
							$scope.alertError = false;
							if ($scope.isMobile() == true) {
								$scope.srcLinkMobile = true;
								var isMobile = {
									Android: function () {
										return navigator.userAgent.match(/Android/i);
									},
									BlackBerry: function () {
										return navigator.userAgent.match(/BlackBerry/i);
									},
									iOS: function () {
										return navigator.userAgent.match(/iPhone|iPad|iPod/i);
									},
									Opera: function () {
										return navigator.userAgent.match(/Opera Mini/i);
									},
									Windows: function () {
										return navigator.userAgent.match(/IEMobile/i);
									},
									any: function () {
										return (isMobile.Android() || isMobile.BlackBerry() || isMobile.Opera() || isMobile.Windows());
									}
								};
								if (isMobile.any()) {
									$scope.srcLink = "https://play.google.com/store/apps/details?id=com.bizibox.IFact";
									window.open("https://play.google.com/store/apps/details?id=com.bizibox.IFact", "_self");
								}
								else {
									$scope.srcLink = "https://itunes.apple.com/app/id626155379";
									window.open("https://itunes.apple.com/app/id626155379", "_self");
								}
							}
							else {
								$scope.signLoginEx();
							}
						}, 3000);
						$scope.alertErrorHead = true;
						$scope.errorRed = true;
						$scope.state_enable = false;
					}, function (error) {
						if (error.status) {
							if (error.status == 409) {
								$scope.alertError = true;
								$scope.error = 'פרטי הכניסה קיימים במערכת';
								$scope.errorRed = true;
								$scope.alertErrorHead = true;
								$timeout(function () {
									$scope.alertError = false;
								}, 2000);
								$scope.state_enable = false;
							}
							if (error.status == 500) {
								$scope.alertError = true;
								$scope.errorRed = true;
								$scope.alertErrorHead = true;

								$timeout(function () {
									$scope.alertError = false;
								}, 2000)
								$scope.state_enable = false;
								$scope.error = 'המערכת אינה זמינה כעת, אנא נסו שנית מאוחר יותר';
							}
						}
					});
				}
				else {
					var ind_acc_bank = 'signup';
					serverConnection.banksPost(id, myBanks, ind_acc_bank).then(function (success) {
						var successtoken = success.token_id;
						$('body,html').animate({
							scrollTop: 0
						}, 500);
						return $scope.getTokenStatus(successtoken);
					}).then(function (status) {
						ga('send', 'event', 'step3.1button', 'connect_bank', 'step3.1completed');
						var axel = Math.random() + "";
						var a = axel * 10000000000000000;
						var flDiv = document.body.appendChild(document.createElement("div"));
						flDiv.setAttribute("id", "DCLK_FLDiv1");
						flDiv.style.position = "absolute";
						flDiv.style.top = "0";
						flDiv.style.left = "0";
						flDiv.style.width = "0px";
						flDiv.style.height = "0px";
						flDiv.style.display = "none";
						flDiv.innerHTML = '<iframe id="DCLK_FLIframe1" src="https://4632688.fls.doubleclick.net/activityi;src=4632688;type=lpimo0;cat=bizib003;ord=1" width="0" height="0" frameborder="0"><\/iframe>';

						if ($scope.isMobile() == true) {
							$scope.srcLinkMobile = true;
							var isMobile = {
								Android: function () {
									return navigator.userAgent.match(/Android/i);
								},
								BlackBerry: function () {
									return navigator.userAgent.match(/BlackBerry/i);
								},
								iOS: function () {
									return navigator.userAgent.match(/iPhone|iPad|iPod/i);
								},
								Opera: function () {
									return navigator.userAgent.match(/Opera Mini/i);
								},
								Windows: function () {
									return navigator.userAgent.match(/IEMobile/i);
								},
								any: function () {
									return (isMobile.Android() || isMobile.BlackBerry() || isMobile.Opera() || isMobile.Windows());
								}
							};
							if (isMobile.any()) {
								$scope.srcLink = "https://play.google.com/store/apps/details?id=com.bizibox.IFact";
								window.open("https://play.google.com/store/apps/details?id=com.bizibox.IFact", "_self");
							}
							else {
								$scope.srcLink = "https://itunes.apple.com/app/id626155379";
								window.open("https://itunes.apple.com/app/id626155379", "_self");
							}
						}
						else {
							$scope.appData.user = {
								email: $scope.user.email,
								password: $scope.user.password
							};
							$scope.accListLoad(status);
						}

					}, function (error) {
						if (error.status) {
							if (error.status == 409) {
								$scope.alertError = true;
								$scope.error = 'פרטי הכניסה קיימים במערכת';
								$scope.errorRed = true;
								$scope.alertErrorHead = true;

								$timeout(function () {
									$scope.alertError = false;
								}, 2000)
								$scope.state_enable = false;
							}
							if (error.status == 500) {
								$scope.alertError = true;
								$scope.errorRed = true;
								$scope.alertErrorHead = true;

								$timeout(function () {
									$scope.alertError = false;
								}, 2000);
								$scope.state_enable = false;
								$scope.error = 'המערכת אינה זמינה כעת, אנא נסו שנית מאוחר יותר';
							}
						}
					});
				}
			}
		};

		$scope.popTermosf = function () {
			$scope.showPopup('views/signup/termosof.html?ver=3.74', 'termosof', false);
		}
		$scope.popTermosfPrivate = function () {
			$scope.showPopup('views/signup/popTermosfPrivate.html?ver=3.74', 'termosof', false);
		}
		$scope.reset = function (form) {
			if (form) {
				form.$setPristine();
				form.$setUntouched();
			}
			$scope.user = angular.copy($scope.master);
		};

		$scope.reset();
	}

	angular.module('controllers')
	.controller('signupCtrl', ['$scope', '$rootScope', '$location', '$window', '$timeout', 'AppData', 'serverConnection', 'utils', '$state', 'accoConversions', '$q', '$interval', '$ocLazyLoad', signupCtrl]);
}());
