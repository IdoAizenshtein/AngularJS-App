(function () {
	var hostnameWs, hostnameWsMail;
	if (location.hostname === 'localhost') {
		// hostnameWs = 'https://10.50.0.70:8443/web-0.0.1/ang/protected';
		// hostnameWs = 'https://secure.bizibox.biz/ang/protected';
		// hostnameWs = 'https://adm-stg.bizibox.biz/ang/protected';
		hostnameWs = 'https://adm-pre.bizibox.biz/ang/protected';
		//hostnameWs = 'https://int-pre-prod.bizibox.biz/ang/protected';
		// hostnameWs = "https://adm.bizibox.biz/ang/protected";
		//hostnameWs = "https://adm-pre.bizibox.biz/ang/protected";
		// hostnameWs = "https://secure-stg.bizibox.biz/ang/protected";
		//hostnameWsMail = '/api/excelExports/sendMail';
		// hostnameWs = "https://secure-dev.bizibox.biz/ang/protected";
		hostnameWsMail = '/ProjectsBiziboxMaven/api/excelExports/sendMail';
	}
	else {
		hostnameWs = '../ang/protected';
		hostnameWsMail = '../ProjectsBiziboxMaven/api/excelExports/sendMail';
	}
	//open -a Google\ Chrome --args --user-data-dir --disable-web-security
	//open -a Google\ Chrome --args --user-data-dir --disable-web-security --no-sandbox --disable-extensions-http-throttling --allow-file-access-from-files --ssl-version-max=tls1
	window.serverName = hostnameWs;
	window.port = ':8080';

	function serverConnection($http, $rootScope, $q, $timeout, $state, $templateCache) {
		function make_base_auth(email, password) {
			var tok = email + ':' + password;
			return "Basic " + btoa(tok);
		};
		var connection = {
			state: $state,
			url: serverName + '/',
			credentials: {
				email: '',
				password: ''
			},
			dataToUrl: function (data) {
				var url = '?', len = data.length;
				for (var i = 0; i < len; i++) {
					var obj = data[i];
					for (var key in obj)
						url = url + key + "=" + obj[key] + "&";
				}
				return url.substring(0, url.length - 1);
			},
			collect: function () {
				var ret = {};
				var len = arguments.length;
				for (var i = 0; i < len; i++) {
					for (var p in arguments[i]) {
						if (arguments[i].hasOwnProperty(p)) {
							ret[p] = arguments[i][p];
						}
					}
				}
				return ret;
			},
			sendHttp: function (method, action, url, data, dataType, headers, successFunc, errorFunc) {
				var deferred = $q.defer();
				var successCb = function (response) {
					if (successFunc) {
						successFunc(response.data, deferred);
					}
					else {
// 						if(response.config && response.config.url && (response.config.url.indexOf('login') !== -1) && response.status === 200){
// 							var headers = response.headers();
// debugger
// 							// var loginPageHeader = response.headers.get("LoginPage");
// 							// if(loginPageHeader && loginPageHeader !== ""){
// 							// 	window.location.replace(loginPageHeader);
// 							// }
// 						}
						deferred.resolve(response.data);
					}
				};
				var errorCb = function (resErr, a, b, c, d) {
					var data = resErr.config, error = resErr.data, status = resErr.status, config = resErr.headers;
					if (errorFunc) {
						errorFunc(error, status, deferred);
					}
					else {
						deferred.reject({'error': error, 'status': status});
						$rootScope.$broadcast('error', {msg: error});

						var requestPayload;
						if (method == "GET") {
							requestPayload = data.url;
						}
						else {
							requestPayload = JSON.stringify(data.data);
						}

						var sendError = {
							companyId: null,
							statusCode: status,
							requestUrl: data.url,
							requestPayload: requestPayload,
							responseText: error
						};

						if (status !== 401 && status !== 503 && data.url.indexOf("/ang/protected/add_html_app_log") == -1) {
							$rootScope.$broadcast('errorLog', sendError);
						}

						if (location.hash !== '#/login' && location.hash !== '#/signup') {
							if (status == 401) {
								if (location.hash.indexOf('login') == -1) {
									var url = '#/login?' + location.hash.replace('#/', '');
									var loc = decodeURI(url);
									location.replace(loc);
								}
							}
						}
					}
				};

				var paramServer;
				if (action !== 'https://php.bizibox.biz/result.php' && action !== '/pelephone.php' && action !== 'package.json') {
					paramServer = {HTML_LOGIN: true};
					// var userStorage = JSON.parse(localStorage.getItem('acco_user')) || JSON.parse(sessionStorage.getItem('acco_user'));
					// if (userStorage !== undefined && userStorage !== null && $rootScope.adminSoft) {
					// 	url = url.split("//")[0] + "//" + userStorage.email + ":" + userStorage.password + "@" + url.split("//")[1];
					// }
				}
				else {
					paramServer = {};
				}

				var authorization = make_base_auth(connection.credentials.email, connection.credentials.password);
				var authHeader = {Authorization: authorization};
				if (location.hostname === 'localhost' && action.indexOf("excelExports") !== -1) {
					//url = "http://localhost:8080";
					url = "https://secure.bizibox.biz";
				}

				// if(action === 'get_acco_office_details'){
				// 	$.ajax({
				// 		data: JSON.stringify(data),
				// 		url: url + action,
				// 		xhrFields: {
				// 			withCredentials: true
				// 		},
				// 		method: method,
				// 		type: method,
				// 		headers : {
				// 			'Authorization': authorization,
				// 			'HTML_LOGIN': true,
				// 			'Accept': '*/*',
				// 			'Content-Type': 'application/json'
				// 		},
				// 		beforeSend: function (xhr) {
				// 			xhr.setRequestHeader('Authorization', authorization);
				// 		}
				// 	})
				// 	.done(function (response, state, status) {
				// 		deferred.resolve(JSON.parse(response));
				// 	})
				// 	.fail(function (error, resErr, xhr) {
				// 	})
				// }else{
				//
				// }

				var config = {
					method: method,
					url: url + action,
					data: (data) ? data : {},
					dataType: (dataType) ? dataType : {},
					withCredentials: true,
					cache: false,
					headers: connection.collect((headers) ? headers : {}, paramServer)
				}
				//$.get(url + action);
				$http(config)
				.then(successCb, errorCb);
				return deferred.promise;
			},
			login: function (userData) {
				connection.credentials.email = userData.email;
				connection.credentials.password = userData.password;
				var authorization = make_base_auth(connection.credentials.email, connection.credentials.password);
				var headers = {
					'Accept': '*/*',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					Authorization: authorization
				};
				var dataType = 'json';
				var buffer = [];
				for (var name in userData) {
					if (!userData.hasOwnProperty(name)) {
						continue;
					}
					var value = userData[name];
					buffer.push(
						encodeURIComponent(name) +
						"=" +
						encodeURIComponent((value == null) ? "" : value)
					);
				}
				var source = buffer
				.join("&")
				.replace(/%20/g, "+");
				var data = source;
				return this.sendHttp('POST', 'login', connection.url.replace('/protected', ''), data, dataType, headers);
			},
			logOut: function (userData) {
				var headers = {'Accept': '*/*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
				var dataType = 'json';
				var data = {"insession_id": userData};
				var buffer = [];
				for (var name in data) {
					if (!data.hasOwnProperty(name)) {
						continue;
					}
					var value = data[name];
					buffer.push(
						encodeURIComponent(name) +
						"=" +
						encodeURIComponent((value == null) ? "" : value)
					);
				}
				var source = buffer
				.join("&")
				.replace(/%20/g, "+");
				var data = source;
				return this.sendHttp('POST', 'logout', connection.url, data, dataType, headers);
			},
			logError: function (data) {
				var headers = {'Accept': '*/*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
				var dataType = 'json';
				var buffer = [];
				for (var name in data) {
					if (!data.hasOwnProperty(name)) {
						continue;
					}
					var value = data[name];
					buffer.push(
						encodeURIComponent(name) +
						"=" +
						encodeURIComponent((value == null) ? "" : value)
					);
				}
				var source = buffer
				.join("&")
				.replace(/%20/g, "+");
				return this.sendHttp('POST', 'add_html_app_log', connection.url, source, dataType, headers);
			},
			getDefMonth: function () {
				return this.sendHttp('GET', 'get_def_month/null', connection.url);
			},
			gettokensalerts: function () {
				return this.sendHttp('GET', 'user_gettokensalerts', connection.url);
			},
			getCompanies: function () {
				return this.sendHttp('GET', 'user_getcompanies', connection.url);
			},
			getCompanyAccounts: function (companyId) {
				if (companyId !== undefined) {
					var data = {"companyId": companyId}
					return this.sendHttp('POST', 'accounts', connection.url, data);
				}
			},
			getTokens: function (company) {
				var data = {"companyId": company};
				return this.sendHttp('POST', 'tokens_get_data', connection.url, data);
			},
			banksPost: function (companyId, myBanks, ind_acc_bank) {
				var bank_user_name, bank_pass, bank_auto;
				var valueBank = myBanks.val;
				myBanks.inputs.forEach(function (value, key) {
					if (value.val == 'bank_user_name') {
						bank_user_name = value.data.trim();

						// if ((valueBank == 11) && (bank_user_name.length <= 6)) {
						// 	valueBank = 58;
						// }
						if ((valueBank == 11) && ((bank_user_name.length == 8) || (bank_user_name.length == 9))) {
							valueBank = 11;
						}
						// if ((valueBank == 17) && (bank_user_name.length <= 6)) {
						// 	valueBank = 57;
						// }
						if ((valueBank == 17) && ((bank_user_name.length == 8) || (bank_user_name.length == 9))) {
							valueBank = 17;
						}
					}
					if (value.val == 'bank_pass') {
						bank_pass = value.data.trim();
					}
					if (myBanks.inputs.length > 2) {
						if (value.val == 'bank_auto') {
							bank_auto = value.data.trim();
						}
					}
					else {
						bank_auto = '1';
					}
				});

				var headers = {'Accept': '*/*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
				if (ind_acc_bank == 'signup') {
					var data = {
						'company_id': companyId,
						'bank_id': valueBank,
						'bank_user_name': bank_user_name,
						'bank_auto': bank_auto,
						'bank_pass': bank_pass
					};
				}
				else {
					var data = {
						'company_id': companyId,
						'bank_id': valueBank,
						'bank_user_name': bank_user_name,
						'bank_auto': bank_auto,
						'bank_pass': bank_pass,
						'ind_acc_bank': ind_acc_bank
					};
				}

				var buffer = [];
				for (var name in data) {
					if (!data.hasOwnProperty(name)) {
						continue;
					}
					var value = data[name];
					buffer.push(
						encodeURIComponent(name) +
						"=" +
						encodeURIComponent((value == null) ? "" : value)
					);
				}
				var source = buffer
				.join("&")
				.replace(/%20/g, "+");
				var dataType = 'json';
				var data = source;
				//method, action, url, data, dataType, headers, successFunc, errorFunc
				return this.sendHttp('POST', 'account_token_create', connection.url, data, dataType, headers);
			},
			tokenStatus: function (successToken) {
				var dataType = 'json';
				return this.sendHttp('GET', 'token_status/' + encodeURIComponent(successToken), connection.url, {}, dataType);
			},
			tokenPostStatus: function (successToken) {
				var dataType = 'json';
				var data = {'token_id': successToken};
				var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
				return this.sendHttp('POST', 'get_accounts', connection.url, data, dataType, headers);
			},
			getFixedActions: function (companyId, companyAccountId) {
				var data = {"incompany_id": companyId, "incompany_account_id": companyAccountId}
				return this.sendHttp('POST', 'get_peulot_kvuot', connection.url, data);
			},
			getFixedActionsHTML: function (companyId, companyAccountId) {
				var data = {"company_id": companyId, "company_account_id": companyAccountId}
				return this.sendHttp('POST', 'transkvuot_html_getlist', connection.url, data);
			},
			bankLoadPeulotBysk: function (companyId, companyAccountId, searchkeyId) {
				var data = {
					"incompany_id": companyId,
					"incompany_account_id": companyAccountId,
					"insearchkey_id": searchkeyId
				};
				return this.sendHttp('POST', 'bank_load_peulot_bysk', connection.url, data);
			},
			transkvuaGetpeulot: function (data) {
				return this.sendHttp('POST', 'transkvua_getpeulot', connection.url, data);
			},
			transkvuotCreate: function (data) {
				return this.sendHttp('POST', 'transkvuot_create', connection.url, data);
			},
			transkvuotCreateEdit: function (data) {
				return this.sendHttp('POST', 'transkvuot_html_update', connection.url, data);
			},
			transkvuaHatamaDelete: function (data) {
				return this.sendHttp('POST', 'transkvua_hatama_delete', connection.url, data);
			},
			bankLoadDismissbysk: function (companyId, companyAccountId, searchkeyId) {
				var data = {
					'company_id': companyId,
					'company_account_id': companyAccountId,
					'searchkey_id': searchkeyId
				}
				return this.sendHttp('POST', 'bank_load_dismissbysk', connection.url, data);
			},
			accountHaspeulot: function (hasAcc) {
				var dataType = 'json';
				var data = {};
				var headers = {};
				connection.headers.accept = 'application/json';
				connection.headers.contentType = 'application/json';
				return this.sendHttp('GET', 'account_haspeulot/' + encodeURIComponent(hasAcc[0].company_account_id), data, dataType, headers, connection.url);
			},
			getPeulotKvuot: function (company, company_account_id, getaccounts) {
				var dataType = 'json';
				var data = {'incompany_id': company, 'incompany_account_id': company_account_id};
				var headers = {};
				connection.headers.accept = 'application/json';
				connection.headers.contentType = 'application/json';
				return this.sendHttp('POST', 'get_peulot_kvuot', data, dataType, headers, connection.url);
			},
			getTransactions: function (company, fromDate, toDate) {
				var data = {"company_id": company.companyId, "date_from": fromDate, "date_until": toDate};
				return this.sendHttp('POST', 'banktrans_getpeulot', connection.url, data);
			},
			getTransactionTypesNew: function (company) {
				var data = {"companyId": company.companyId, showfactory: "1"};
				return this.sendHttp('POST', 'trans_type_getlist_ksafim', connection.url, data);
			},
			getTransactionTypes: function () {
				return this.sendHttp('POST', 'trans_types', connection.url, {});
			},
			updateTazrimRow: function (newName) {
				var data = {"trans_id": 0, "trans_type_id": 0, "trans_name": newName, "ind_bank": 1}
				return this.sendHttp('POST', 'update_tazrim_row', connection.url, {});
			},
			getSolekData: function (company, fromDate, toDate, ind) {
				var data = {
					"incompany_id": company.companyId,
					"indate_from": fromDate,
					"indate_till": toDate,
					"incompany_account_id": null,
					"ind_trans_type": ind
				};
				return this.sendHttp('POST', 'solek_atid_det_getdata', connection.url, data);
			},
			deleteToken: function (tokenId) {
				return this.sendHttp('GET', 'token_delete/' + encodeURIComponent(tokenId), connection.url.replace('ang', 'acc'));
			},
			transkvuotDelete: function (id) {
				return this.sendHttp('GET', 'transkvuot_delete/' + encodeURIComponent(id), connection.url);
			},
			updateSolekZefi: function (t) {
				return this.sendHttp('POST', 'solektazrim_update_zefi', connection.url, {
					solekTazrimId: t.solekTazrimId,
					zefi: t.indZefi
				});
			},
			updateCardZefi: function (t) {
				return this.sendHttp('POST', 'cardtazrim_update_zefi', connection.url, {
					ccardTazrimId: t.ccard_tazrim_id,
					zefi: t.ind_zefi
				});
			},
			updateToken: function (tokenId, password, identifier, userName) {
				var data = {
					"token_id": tokenId,
					"password": password,
					"target_mezahe": identifier,
					"target_username": null
				};
				return this.sendHttp('POST', 'token_update', connection.url, data);
			},
			updateTokenAccount: function (tokenId, password, userName, identifier) {
				var data = {
					"token_id": tokenId,
					"password": password,
					"target_mezahe": userName,
					"target_username": identifier
				};
				return this.sendHttp('POST', 'token_update', connection.url, data);
			},
			deleteBankAccount: function (accountId) {
				var data = {"incompany_account_id": accountId}
				return this.sendHttp('GET', 'account_bank_delete/' + accountId, connection.url, {});
			},
			deleteSlika: function (solekId) {
				var data = {"solek_id": solekId}
				return this.sendHttp('GET', 'slika_delete/' + solekId, connection.url, {});
			},
			deleteCreditCard: function (creditCardId) {
				var data = {"credit_card_id": creditCardId}
				return this.sendHttp('GET', 'credit_card_delete/' + creditCardId, connection.url, {});
			},
			updatePassword: function (data) {
				return this.sendHttp('POST', 'user_update_pwd', connection.url, data);
			},
			updatePasswordGet: function (pass) {
				return this.sendHttp('GET', 'user_update_pwd/' + pass, connection.url, {});
			},
			sendPassword: function (email, tel) {
				return this.sendHttp('POST', 'forgot_password/', connection.url.replace('protected/', ''), {
					"user_name": email,
					"num_str": tel
				});
			},
			updateTransactionType: function (data) {
				return this.sendHttp('POST', 'update_tazrim_row/', connection.url, data);
			},
			addNewTransType: function (data) {
				return this.sendHttp('POST', 'trans_type_create_ksafim/', connection.url, data);
			},
			getTazrim: function (data) {
				return this.sendHttp('POST', 'tazrim_mehoad2/', connection.url, data);
			},
			getCardsAtid: function (company, account, fromDate, toDate, ind) {
				var data = {
					"incompany_id": company.companyId,
					"indate_from": fromDate,
					"indate_till": toDate,
					"incompany_account_id": account,
					"instatus_id": ind
				};
				return this.sendHttp('POST', 'ccard_atid', connection.url, data);
			},
			getWithdrawals: function (data) {
				return this.sendHttp('POST', 'meshichot_perut_get/', connection.url, data);
			},
			getMessages: function (data) {
				return this.sendHttp('POST', 'get_last_peulot', connection.url, data);
			},
			getKsafimData: function (data) {
				return this.sendHttp('POST', 'ksafim_main_get_data/', connection.url, data);
			},
			sendMail: function (dataExcel) {
				var dataType = 'html';
				var headers = {'Accept': '*/*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
				var data = dataExcel;
				var buffer = [];
				for (var name in data) {
					if (!data.hasOwnProperty(name)) {
						continue;
					}
					var value = data[name];
					buffer.push(
						encodeURIComponent(name) +
						"=" +
						encodeURIComponent((value == null) ? "" : value)
					);
				}
				var source = buffer
				.join("&")
				.replace(/%20/g, "+");

				var data = source;
				return this.sendHttp('POST', 'https://php.bizibox.biz/result.php', '', data, dataType, headers);
			},
			sendMailer: function (dataExcel) {
				return this.sendHttp('POST', hostnameWsMail, connection.url.replace('ang/protected/', '/'), dataExcel);
			},
			copyCheks: function (uuid, folder_name, bankTransId) {
				if ((window.location.hostname == 'localhost' && window.serverName == 'http://192.168.10.114/ang/protected') || window.location.host == '192.168.10.114') {
					if (sessionStorage.getItem('acco_user')) {
						connection.credentials.email = JSON.parse(sessionStorage.getItem('acco_user')).email;
						connection.credentials.password = JSON.parse(sessionStorage.getItem('acco_user')).password;
					}
					var authorization = make_base_auth(connection.credentials.email, connection.credentials.password);
					var headers = {
						'Accept': '*/*',
						'Content-Type': 'application/json; charset=UTF-8',
						Authorization: authorization
					};
					var dataType = 'json';
					var uri = 'https://secure.bizibox.biz/ang/protected/';
					return this.sendHttp('POST', 'chequepicGetList', uri, {
						"picture_link": uuid,
						'folder_name': parseFloat(folder_name),
						"bankTransId": bankTransId
					}, dataType, headers);
				}
				else {
					return this.sendHttp('POST', 'chequepicGetList', connection.url, {
						"picture_link": uuid,
						'folder_name': parseFloat(folder_name),
						"bankTransId": bankTransId
					});
				}
			},
			removeAlertFromList: function (uuid) {
				return this.sendHttp('GET', 'messages/delete/' + encodeURIComponent(uuid), connection.url, {});
			},
			getAccList: function (uuid) {
				var data = {"companyId": encodeURIComponent(uuid)};
				return this.sendHttp('POST', 'sapakim_lekohot_grid', connection.url, data);
			},
			getSkiraListType: function (uuid) {
				var data = {"companyId": encodeURIComponent(uuid)};
				return this.sendHttp('POST', 'skira_hanah_getdata', connection.url, data);
			},
			getSkiraGraphAccNumbers: function (data) {
				return this.sendHttp('POST', 'branchAllcmp1Getdata', connection.url, data);
			},
			rgolmicmp: function (data) {
				return this.sendHttp('POST', 'company_rgolmicmp_getdata', connection.url, data);
			},
			rnakicmp: function (data) {
				return this.sendHttp('POST', 'branch_rnakicmp_getdata', connection.url, data);
			},
			sethamlaza: function (data) {
				return this.sendHttp('POST', 'company_sethamlaza_type', connection.url, data);
			},
			getExportHashv: function () {
				return this.sendHttp('GET', 'hash_exp_get_list', connection.url);
			},
			blklistDelete: function (uuid) {
				return this.sendHttp('GET', 'outhashaccount_blklist_delete/' + encodeURIComponent(uuid), connection.url, {});
			},
			blklistCreate: function (uuid) {
				return this.sendHttp('GET', 'outhashaccount_blklist_create/' + encodeURIComponent(uuid), connection.url, {});
			},
			oshtnuFile: function (data) {
				return this.sendHttp('POST', 'create_oshtnu_file', connection.url, data);
			},
			get_fictive_bank_transes: function (data) {
				return this.sendHttp('POST', 'get_fictive_bank_transes', connection.url, data);
			},
			getOshtnu: function () {
				return this.sendHttp('GET', 'get_oshtnu', connection.url);
			},
			getTazrimToDay: function (data) {
				return this.sendHttp('POST', 'account_tazrim_meforat2', connection.url, data);
			},
			updateTazrimRowSer: function (data) {
				return this.sendHttp('POST', 'update_tazrim_row', connection.url, data);
			},
			updateTazrimRowZefi: function (urls, data) {
				return this.sendHttp('POST', urls, connection.url, data);
			},
			deleteTazrimRow: function (data) {
				return this.sendHttp('POST', 'delete_tazrim_row', connection.url, data);
			},
			addTazrimRow: function (data) {
				return this.sendHttp('POST', 'paymentpart_create', connection.url, data);
			},
			getTazrimMeforat: function (data) {
				return this.sendHttp('POST', 'tazrim_meforat', connection.url, data);
			},
			getAnalisisAll: function (data) {
				return this.sendHttp('POST', 'branchAllcmp1Getdata', connection.url, data);
			},
			getAnalisisNaki: function (data) {
				return this.sendHttp('POST', 'branch_rnakicmp_getdata', connection.url, data);
			},
			getAnalisisGolmi: function (data) {
				return this.sendHttp('POST', 'company_rgolmicmp_getdata', connection.url, data);
			},
			getAnalisisList: function (data) {
				return this.sendHttp('POST', 'br_all_anah_getlist', connection.url, data);
			},
			getAnalisisListThree: function (data) {
				return this.sendHttp('POST', 'br_invbyttc_anah_getlist', connection.url, data);
			},
			getMaazanList: function (data) {
				return this.sendHttp('POST', 'maazan_getlist', connection.url, data);
			},
			cartisCodeGetlist: function () {
				return this.sendHttp('GET', 'cartis_code_getlist', connection.url);
			},
			targetSupplierUpdateType: function (data) {
				return this.sendHttp('POST', 'target_supplier_update_type', connection.url, data);
			},
			loadgetDateSuggCalendar: function (companyId, date) {
				if (date == undefined) {
				}
				return this.sendHttp('GET', '7/' + companyId + '/' + date, connection.url);
			},
			unCheckRowAlert: function (data) {
				return this.sendHttp('POST', 'ttc_blklist_create', connection.url, data);
			},
			hashCartisList: function (companyId) {
				return this.sendHttp('GET', 'hash_cartis_bank_list/' + companyId, connection.url);
			},
			bankPageFullCheck: function (data) {
				return this.sendHttp('POST', 'bank_page_full_check', connection.url, data);
			},
			userAccGettokensalerts: function () {
				return this.sendHttp('GET', 'user_acc_gettokensalerts', connection.url);
			},
			resetExports: function (data) {
				return this.sendHttp('GET', 'hash_get_last_export/' + data, connection.url);
			},
			loadBankPeulot: function (id) {
				var data = {"companyId": id};
				return this.sendHttp('POST', 'bank_match_lo_zfuya', connection.url, data);
			},
			hanatransGetlastpeulot: function (id) {
				return this.sendHttp('GET', 'hanatrans_getlastpeulot/' + id, connection.url);
			},
			bankMatchMumlazot: function (data) {
				return this.sendHttp('POST', 'bank_match_mumlazot_list', connection.url, data);
			},
			getAllPeoulotList: function (data) {
				return this.sendHttp('POST', 'get_all_peoulot_list', connection.url, data);
			},
			removeListOnePeula: function (data) {
				return this.sendHttp('POST', 'bank_transtab_clearnotmtch', connection.url, data);
			},
			matchPeulot: function (data) {
				return this.sendHttp('POST', 'bank_match_create', connection.url, data);
			},
			loadBankPeulotCancel: function (data) {
				return this.sendHttp('POST', 'bank_match_motamot', connection.url, data);
			},
			loadTablePeulotRemove: function (data) {
				return this.sendHttp('POST', 'bank_match_gethatamot', connection.url, data);
			},
			pirukAthama: function (data) {
				return this.sendHttp('POST', 'piruk_athama', connection.url, data);
			},
			loadCompanysList: function () {
				var data = {"companyId": null};
				return this.sendHttp('POST', 'user_getcompanies_det', connection.url, data);
			},
			getListUsersOfCompany: function (data) {
				return this.sendHttp('POST', 'company_get_users', connection.url, data);
			},
			setListUsersOfCompany: function (data) {
				return this.sendHttp('POST', 'add_hanhahksafim_priv', connection.url, data);
			},
			loadCompanysForThis: function (id) {
				var data = {"companyId": id};
				return this.sendHttp('POST', 'user_getcompanies_det', connection.url, data);
			},
			delListUsersOfCompany: function (data) {
				return this.sendHttp('POST', 'company_del_acc_priv', connection.url, data);
			},
			userNamecheks: function (data) {
				return this.sendHttp('POST', 'user_nameexists', connection.url.replace('protected/', ''), data);
			},
			updateLeadInfo: function (data) {
				return this.sendHttp('POST', 'update_lead_info', connection.url.replace('protected/', ''), data);
			},
			checkCompanyHp: function (id) {
				return this.sendHttp('GET', 'company_hpexists/' + id + '/jsonp', connection.url.replace('ang/protected/', 'app/'));
			},
			companyUserCreate: function (data) {
				var headers = {'Accept': '*/*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
				var buffer = [];
				for (var name in data) {
					if (!data.hasOwnProperty(name)) {
						continue;
					}
					var value = data[name];
					buffer.push(
						encodeURIComponent(name) +
						"=" +
						encodeURIComponent((value == null) ? "" : value)
					);
				}
				var source = buffer
				.join("&")
				.replace(/%20/g, "+");
				var dataType = 'json';
				return this.sendHttp('POST', 'company_user_create', connection.url.replace('ang/protected/', 'ang/'), source, dataType, headers);
			},
			accountSetPrimary: function (data) {
				return this.sendHttp('POST', 'account_set_primary', connection.url, data);
			},
			loadSumMess: function (id) {
				return this.sendHttp('GET', 'user_getunreadmsgs/' + id, connection.url);
			},
			loadMess: function (id) {
				return this.sendHttp('GET', 'user_getmessages/' + id, connection.url);
			},
			userSetreadmsg: function (id) {
				return this.sendHttp('GET', 'userSetreadmsg/' + id, connection.url);
			},
			getPeulotToday: function (data) {
				return this.sendHttp('POST', 'get_peulot_today', connection.url, data);
			},
			spiderBanks: function (id) {
				return this.sendHttp('GET', 'spider_banks_per_company_acc_id/' + id, connection.url);
			},
			msgTypeCategoriesGet: function (id) {
				return this.sendHttp('GET', 'msg_type_categories_get/' + id, connection.url);
			},
			userSetmsgtypeCat: function (data) {
				return this.sendHttp('POST', 'user_setmsgtype_cat', connection.url, data);
			},
			getReport: function (data) {
				return this.sendHttp('POST', 'revachefsed_report_data', connection.url, data);
			},
			editNameBank: function (data) {
				return this.sendHttp('POST', 'update_account_nickname', connection.url, data);
			},
			userNamecheksCompany: function (num) {
				return this.sendHttp('GET', 'acc_user_nameexists/' + num, connection.url.replace('ang/protected/', 'acc/'));
			},
			companyAccountantCreate: function (data) {
				var headers = {'Accept': '*/*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
				var buffer = [];
				for (var name in data) {
					if (!data.hasOwnProperty(name)) {
						continue;
					}
					var value = data[name];
					buffer.push(
						encodeURIComponent(name) +
						"=" +
						encodeURIComponent((value == null) ? "" : value)
					);
				}
				var source = buffer
				.join("&")
				.replace(/%20/g, "+");
				var dataType = 'json';
				return this.sendHttp('POST', 'company_accountant_create', connection.url, source, dataType, headers);
			},
			insertPoalimBasakim: function (data) {
				return this.sendHttp('POST', 'insert_poalim_basakim', connection.url, data);
			},
			checkPelephone: function (num) {
				var dataType = 'json';
				var headers = {'Accept': '*/*', 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
				var data = num;
				return this.sendHttp('POST', '/pelephone.php', 'https://php.bizibox.biz', data, dataType, headers);
			},
			companyGetinchequesSum: function (data) {
				return this.sendHttp('POST', 'company_getincheques_sum', connection.url, data);
			},
			companyGetinchequesPerut: function (data) {
				return this.sendHttp('POST', 'company_getincheques_perut', connection.url, data);
			},
			accountGetcartisim: function (data) {
				return this.sendHttp('POST', 'account_getcartisim', connection.url, data);
			},
			accountSetcartisim: function (data) {
				return this.sendHttp('POST', 'account_setcartisim', connection.url, data);
			},
			chequesHathamaCreate: function (data) {
				return this.sendHttp('POST', 'cheques_hathama_create', connection.url, data);
			},
			companyGetoutchequesSum: function (data) {
				return this.sendHttp('POST', 'company_getoutcheques_sum', connection.url, data);
			},
			companyGetoutchequesPerut: function (data) {
				return this.sendHttp('POST', 'company_getoutcheques_perut', connection.url, data);
			},
			hashUpdateExpExplain: function (data) {
				return this.sendHttp('POST', 'hash_update_exp_explain', connection.url, data);
			},
			hashMakeExample: function (id) {
				return this.sendHttp('GET', 'hash_make_example/' + id, connection.url);
			},
			getDataMainAcc: function (id) {
				return this.sendHttp('GET', 'mimshak_hevrot_getdata', connection.url);
			},
			dataReportComposite: function () {
				return this.sendHttp('GET', 'data_report_composite/null', connection.url);
			},
			dataReportCompositeId: function (id) {
				return this.sendHttp('GET', 'data_report_composite/' + id, connection.url);
			},
			messagesDeleteSkira: function (id) {
				return this.sendHttp('GET', 'messages/delete/' + id, connection.url);
			},
			userGetbankmatchimplist: function (data) {
				return this.sendHttp('POST', 'user_getbankmatchimplist', connection.url, data);
			},
			compExpGetList: function (id) {
				return this.sendHttp('GET', 'comp_exp_get_list/' + id, connection.url);
			},
			messageCreate: function (data) {
				return this.sendHttp('POST', 'message_create', connection.url, data);
			},
			getTeamCompanysAcc: function () {
				return this.sendHttp('POST', 'user_get_managed_by_curr', connection.url);
			},
			sendAddPersonToTeam: function (data) {
				return this.sendHttp('POST', 'user_create', connection.url, data);
			},
			create_lead_ocr: function (data) {
				return this.sendHttp('POST', 'create_lead_ocr', connection.url, data);
			},
			update_not_interested_ocr_date: function () {
				return this.sendHttp('POST', 'update_not_interested_ocr_date', connection.url);
			},
			userGetchildusercompanies: function (id) {
				return this.sendHttp('GET', 'user_getchildusercompanies/' + id, connection.url);
			},
			userSetPrivs: function (data) {
				return this.sendHttp('POST', 'user_set_privs', connection.url, data);
			},
			defaultsPrecentReports: function () {
				return this.sendHttp('GET', 'defaults', connection.url);
			},
			expenseMissingReport: function (data) {
				return this.sendHttp('POST', 'expense_missing_report', connection.url, data);
			},
			expenseChangedReport: function (data) {
				return this.sendHttp('POST', 'expense_changed_report', connection.url, data);
			},
			setDefaultsPrecentAcc: function (data) {
				return this.sendHttp('POST', 'defaults', connection.url, data);
			},
			trans_type_update_ksafim: function (data) {
				return this.sendHttp('POST', 'trans_type_update_ksafim', connection.url, data);
			},
			trans_type_delete_ksafim: function (data) {
				return this.sendHttp('POST', 'trans_type_delete_ksafim', connection.url, data);
			},
			userGetAccountants: function () {
				return this.sendHttp('GET', 'user_get_accountants', connection.url);
			},
			userCopypriv: function (id) {
				return this.sendHttp('GET', 'user_copypriv/' + id, connection.url);
			},
			getDataMainAccCards: function () {
				return this.sendHttp('GET', 'ccard_izu_masach_getlist', connection.url);
			},
			cardPageFullCheck: function (data) {
				return this.sendHttp('POST', 'credit_card_full_check', connection.url, data);
			},
			getccardouthashdata: function (data) {
				return this.sendHttp('POST', 'getccardouthashdata', connection.url, data);
			},
			get_fictive_ccard_transes: function (data) {
				return this.sendHttp('POST', 'get_fictive_ccard_transes', connection.url, data);
			},
			getccardouthashdataId: function (id) {
				return this.sendHttp('GET', 'getccardouthashdata/' + id, connection.url);
			},
			get_oshtnu_card: function (id) {
				return this.sendHttp('GET', 'get_oshtnu_card', connection.url);
			},
			ccardIzuMasachGetlist: function (data) {
				return this.sendHttp('POST', 'ccard_izu_masach_getlist', connection.url, data);
			},
			ccardSethamlazacustId: function () {
				return this.sendHttp('GET', 'ccard_sethamlazacust_id', connection.url);
			},
			adminReports: function () {
				return this.sendHttp('GET', 'admin_reports', connection.url);
			},
			adminReportsId1: function (id) {
				return this.sendHttp('GET', 'admin_reports1/' + id, connection.url);
			},
			get_report_cat: function () {
				return this.sendHttp('GET', 'get_report_cat', connection.url);
			},
			adminReportsId: function (id) {
				return this.sendHttp('GET', 'admin_reports/' + id, connection.url);
			},
			accoSethamlazacustId: function () {
				return this.sendHttp('GET', 'acco_sethamlazacust_id', connection.url);
			},
			accoPreparehamlaza: function (data) {
				return this.sendHttp('POST', 'acco_preparehamlaza', connection.url, data);
			},
			ccardPreparehamlaza: function (data) {
				return this.sendHttp('POST', 'ccard_preparehamlaza', connection.url, data);
			},
			ccardGetmahzorihiuvList: function (id) {
				return this.sendHttp('GET', 'ccard_getmahzorihiuv_list/' + id, connection.url);
			},
			userGetPoalimbizStatusList: function () {
				return this.sendHttp('GET', 'user_get_poalimbiz_status_list', connection.url);
			},
			userUpdateSpiderRuntype: function (data) {
				return this.sendHttp('POST', 'user_update_spider_runtype', connection.url, data);
			},
			userUpdateSpiderRuntypeGet: function (sum) {
				return this.sendHttp('GET', 'user_update_spider_runtype/' + sum, connection.url);
			},
			accountGetharigadate: function (data) {
				return this.sendHttp('POST', 'account_getharigadate', connection.url, data);
			},
			transferAccount: function (data) {
				return this.sendHttp('POST', 'transfer_account', connection.url, data);
			},
			company_det: function (data) {
				return this.sendHttp('POST', 'company_det', connection.url, data);
			},
			company_mini_det: function (data) {
				return this.sendHttp('POST', 'company_mini_det', connection.url, data);
			},
			company_admin: function (data) {
				return this.sendHttp('POST', 'company_admin', connection.url, data);
			},
			user_get_bizibox_users: function () {
				return this.sendHttp('GET', 'user_get_bizibox_users', connection.url);
			},
			update_company: function (data) {
				return this.sendHttp('POST', 'update_company', connection.url, data);
			},
			delete_company: function (data) {
				return this.sendHttp('POST', 'delete_company', connection.url, data);
			},
			company_getusers: function (data) {
				return this.sendHttp('POST', 'company_getusers', connection.url, data);
			},
			user_billing_privs_changeuser: function (data) {
				return this.sendHttp('POST', 'user_billing_privs_changeuser', connection.url, data);
			},
			user_create_with_company: function (data) {
				return this.sendHttp('POST', 'user_create_with_company', connection.url, data);
			},
			update_user_det: function (data) {
				return this.sendHttp('POST', 'update_user_det', connection.url, data);
			},
			change_password_to_default: function (id) {
				return this.sendHttp('GET', 'change_password_to_default/' + id, connection.url);
			},
			token_run_manual: function (data) {
				return this.sendHttp('POST', 'token_run_manual', connection.url, data);
			},
			nomatched_report: function (data) {
				return this.sendHttp('POST', 'nomatched_report', connection.url, data);
			},
			undeleted_account: function (data) {
				return this.sendHttp('POST', 'undeleted_account', connection.url, data);
			},
			token_updatedatesmeshicha: function (data) {
				return this.sendHttp('POST', 'token_updatedatesmeshicha', connection.url, data);
			},
			spiderList: function () {
				return this.sendHttp('GET', 'spider/list', connection.url);
			},
			spiderUpdate: function (data) {
				return this.sendHttp('POST', 'spider/update', connection.url, data);
			},
			set_export_digit: function (data) {
				return this.sendHttp('POST', 'set_export_digit', connection.url, data);
			},
			hash_get_accounts: function (data) {
				return this.sendHttp('POST', 'hash_get_accounts', connection.url, data);
			},
			set_bank_cust_hash: function (data) {
				return this.sendHttp('POST', 'set_bank_cust_hash', connection.url, data);
			},
			getReportsTypes: function () {
				return this.sendHttp('GET', 'get_reports_types', connection.url);
			},
			getRegularUsers: function () {
				return this.sendHttp('GET', 'get_regular_users', connection.url);
			},
			getDeletedUsers: function () {
				return this.sendHttp('GET', 'get_deleted_users', connection.url);
			},
			qa_itrot_list: function () {
				return this.sendHttp('GET', 'qa_itrot_list', connection.url);
			},
			qa_itrot_get_banktrans: function (id) {
				return this.sendHttp('GET', 'qa_itrot_get_banktrans/' + id, connection.url);
			},
			update_qa_itrot: function (data) {
				return this.sendHttp('POST', 'update_qa_itrot', connection.url, data);
			},
			admin_delete_bank_trans: function (data) {
				return this.sendHttp('POST', 'admin_delete_bank_trans', connection.url, data);
			},
			company_update: function (data) {
				return this.sendHttp('POST', 'company_update', connection.url, data);
			},
			update_company_admin: function (data) {
				return this.sendHttp('POST', 'update_company_admin', connection.url, data);
			},
			getReportsTypesNum: function (num) {
				return this.sendHttp('GET', 'tokens_reports/?run_type=' + num, connection.url);
			},
			company_get_api_token: function (id) {
				return this.sendHttp('GET', 'company_get_api_token/' + id, connection.url);
			},
			company_set_api_token: function (id) {
				return this.sendHttp('GET', 'company_set_api_token/' + id, connection.url);
			},
			deposit_delete: function (id) {
				return this.sendHttp('GET', 'deposit_delete/' + id, connection.url);
			},
			loan_delete: function (id) {
				return this.sendHttp('GET', 'loan_delete/' + id, connection.url);
			},
			branch_mechirotmonth_getdata: function (data) {
				return this.sendHttp('POST', 'branch_mechirotmonth_getdata', connection.url, data);
			},
			set_export_card_date_format: function (val) {
				return this.sendHttp('GET', 'set_export_card_date_format/' + val, connection.url);
			},
			set_export_card_jour_date_format: function (val) {
				return this.sendHttp('GET', 'set_export_card_jour_date_format/' + val, connection.url);
			},
			set_card_cust_id: function (data) {
				return this.sendHttp('POST', 'set_card_cust_id', connection.url, data);
			},
			set_bank_cust_id: function (data) {
				return this.sendHttp('POST', 'set_bank_cust_id', connection.url, data);
			},
			solek_calc_zefi: function (data) {
				return this.sendHttp('POST', 'solek_calc_zefi', connection.url, data);
			},
			company_get_item: function (data) {
				return this.sendHttp('POST', 'company_get_item', connection.url, data);
			},
			company_remove_item: function (data) {
				return this.sendHttp('POST', 'company_remove_item', connection.url, data);
			},
			company_update_item: function (data) {
				return this.sendHttp('POST', 'company_update_item', connection.url, data);
			},
			get_item: function () {
				return this.sendHttp('GET', 'get_item', connection.url);
			},
			company_add_item: function (data) {
				return this.sendHttp('POST', 'company_add_item', connection.url, data);
			},
			set_card_export_type: function (data) {
				return this.sendHttp('POST', 'set_card_export_type', connection.url, data);
			},
			user_get_bizibox_users: function () {
				return this.sendHttp('GET', 'user_get_bizibox_users', connection.url);
			},
			get_qa_tasks_types: function () {
				return this.sendHttp('GET', 'get_qa_tasks_types', connection.url);
			},
			get_qa_tasks_priorty: function () {
				return this.sendHttp('GET', 'get_qa_tasks_priorty', connection.url);
			},
			qa_task_add: function (data) {
				return this.sendHttp('POST', 'qa_task_add', connection.url, data);
			},
			get_qa_tasks: function (data) {
				return this.sendHttp('POST', 'get_qa_tasks', connection.url, data);
			},
			prepare_return_mail: function (data) {
				return this.sendHttp('POST', 'prepare_return_mail', connection.url, data);
			},
			get_qa_tasks_states: function () {
				return this.sendHttp('POST', 'get_qa_tasks_states', connection.url);
			},
			qa_task_update: function (data) {
				return this.sendHttp('POST', 'qa_task_update', connection.url, data);
			},
			qa_tasks_close: function (data) {
				return this.sendHttp('POST', 'qa_tasks_close', connection.url, data);
			},
			get_qa_tasks_hist: function (data) {
				return this.sendHttp('POST', 'get_qa_tasks_hist', connection.url, data);
			},
			userSetreadmsgZero: function (num) {
				return this.sendHttp('GET', 'userSetreadmsg/' + num, connection.url);
			},
			spider_run: function (data) {
				return this.sendHttp('POST', 'spider_run', connection.url, data);
			},
			spider_get_log: function (id) {
				return this.sendHttp('GET', 'spider_get_log/' + id, connection.url);
			},
			get_source_programs: function () {
				return this.sendHttp('GET', 'get_source_programs', connection.url);
			},
			set_source_program: function (data) {
				return this.sendHttp('POST', 'set_source_program', connection.url, data);
			},
			company_yearly_set: function (data) {
				return this.sendHttp('POST', 'company_yearly_set', connection.url, data);
			},
			company_exporter_settime: function (data) {
				return this.sendHttp('POST', 'company_exporter_settime', connection.url, data);
			},
			company_db_year_get: function (data) {
				return this.sendHttp('POST', 'company_db_year_get', connection.url, data);
			},
			company_db_year_set: function (data) {
				return this.sendHttp('POST', 'company_db_year_set', connection.url, data);
			},
			union_accounts: function (data) {
				return this.sendHttp('POST', 'union_accounts', connection.url, data);
			},
			get_all_company: function (id) {
				if (id == undefined) {
					id = "null";
				}
				return this.sendHttp('GET', 'get_all_company/' + id, connection.url);
			},
			company_getbiziboxtasks: function (id) {
				var data = {"companyId": id};
				return this.sendHttp('POST', 'company_getbiziboxtasks', connection.url, data);
			},
			get_all_deleted_company: function () {
				return this.sendHttp('GET', 'get_all_deleted_company', connection.url);
			},
			company_undeleted: function (data) {
				return this.sendHttp('POST', 'company_undeleted', connection.url, data);
			},
			user_delete: function (data) {
				return this.sendHttp('POST', 'user_delete', connection.url, data);
			},
			spider_clean_account: function (id) {
				return this.sendHttp('GET', 'spider_clean_account/' + id, connection.url);
			},
			card_account_transfer: function (data) {
				return this.sendHttp('POST', 'card_account_transfer', connection.url, data);
			},
			solek_account_transfer: function (data) {
				return this.sendHttp('POST', 'solek_account_transfer', connection.url, data);
			},
			company_clean_haanah: function (id) {
				return this.sendHttp('GET', 'company_clean_haanah/' + id, connection.url);
			},
			account_clean_export: function (id) {
				return this.sendHttp('GET', 'account_clean_export/' + id, connection.url);
			},
			card_clean_export: function (id) {
				return this.sendHttp('GET', 'card_clean_export/' + id, connection.url);
			},
			peula_snooze_update: function (data) {
				return this.sendHttp('POST', 'peula_snooze_update', connection.url, data);
			},
			peula_delete: function (data) {
				return this.sendHttp('POST', 'peula_delete', connection.url, data);
			},
			ind_task_read: function () {
				return this.sendHttp('GET', 'ind_task_read', connection.url);
			},
			nigreret_getbankpeulot: function (data) {
				return this.sendHttp('POST', 'nigreret_getbankpeulot', connection.url, data);
			},
			solek_company_transfer: function (data) {
				return this.sendHttp('POST', 'solek_company_transfer', connection.url, data);
			},
			clean_izu_bt: function (id) {
				return this.sendHttp('GET', 'clean_izu_bt/' + id, connection.url);
			},
			clean_izu_ccard: function (id) {
				return this.sendHttp('GET', 'clean_izu_ccard/' + id, connection.url);
			},
			get_exporter_companies: function () {
				return this.sendHttp('GET', 'get_exporter_companies', connection.url);
			},
			get_accountant_phones: function () {
				return this.sendHttp('GET', 'get_accountant_phones/', connection.url);
			},
			get_accountant_det: function () {
				return this.sendHttp('GET', 'get_accountant_det/', connection.url);
			},
			set_accountant_phone: function (data) {
				return this.sendHttp('POST', 'set_accountant_phone', connection.url, data);
			},
			get_accountant_timeline: function () {
				return this.sendHttp('GET', 'get_accountant_timeline/', connection.url);
			},
			get_billing_accounts: function () {
				return this.sendHttp('GET', 'get_billing_accounts', connection.url);
			},
			company_update_billing_account: function (data) {
				return this.sendHttp('POST', 'company_update_billing_account', connection.url, data);
			},
			get_accountant_companies: function () {
				return this.sendHttp('GET', 'get_accountant_companies/', connection.url);
			},
			user_set_export_token: function () {
				return this.sendHttp('GET', 'user_set_export_token', connection.url);
			},
			company_exporter_settime: function (data) {
				return this.sendHttp('POST', 'company_exporter_settime', connection.url, data);
			},
			add_office_privs: function (data) {
				return this.sendHttp('POST', 'add_office_privs', connection.url, data);
			},
			delete_hash_bank: function (id) {
				return this.sendHttp('GET', 'delete_hash_bank/' + id, connection.url);
			},
			token_run_manual: function (data) {
				return this.sendHttp('POST', 'token_run_manual', connection.url, data);
			},
			token_updateotp: function (data) {
				return this.sendHttp('POST', 'token_updateotp', connection.url, data);
			},
			get_existing_cheque: function (data) {
				return this.sendHttp('POST', 'get_existing_cheque', connection.url, data);
			},
			getVersionNumber: function () {
				return this.sendHttp('GET', 'package.json?' + new Date().getTime(), connection.url.replace("ang/protected/", ""));
			},
			token_createOtp: function (data) {
				return this.sendHttp('POST', 'token_createOtp', connection.url, data);
			},
			default_user_create: function (data) {
				return this.sendHttp('POST', 'default_user_create', connection.url, data);
			},
			prepare_billing: function (data) {
				return this.sendHttp('POST', 'prepare_hiuvim_hayom', connection.url, data);
			},
			run_billing: function () {
				return this.sendHttp('GET', 'run_billing', connection.url);
			},
			user_get_billing_account: function () {
				return this.sendHttp('GET', 'user_get_billing_account', connection.url);
			},
			get_hiuvim_masach: function (data) {
				return this.sendHttp('POST', 'get_hiuvim_masach', connection.url, data);
			},
			billing_account_set_gen_data: function (data) {
				return this.sendHttp('POST', 'billing_account_set_gen_data', connection.url, data);
			},
			billing_account_edit_data: function (data) {
				return this.sendHttp('POST', 'billing_account_edit_data', connection.url, data);
			},
			billing_account_getpayhistory: function (id) {
				var data = {
					billing_account_id: id
				}
				return this.sendHttp('POST', 'billing_account_getpayhistory', connection.url, data);
			},
			get_discount_4item_4acc: function (id) {
				var data = {
					billingAccountId: id
				}
				return this.sendHttp('POST', 'get_discount_4item_4acc', connection.url, data);
			},
			cancel_discount_4item_4acc: function (params) {
				return this.sendHttp('POST', 'cancel_discount_4item_4acc', connection.url, params);
			},
			set_discount_4item_4acc: function (params) {
				return this.sendHttp('POST', 'set_discount_4item_4acc', connection.url, params);
			},
			billing_account_set_primary: function (id) {
				var data = {
					billing_account_id: id,
					accountant_office_id: null
				}
				return this.sendHttp('POST', 'billing_account_set_primary', connection.url, data);
			},
			get_billing_payment_jt_details: function (id) {
				var data = {
					billing_payment_id: id,
				}
				return this.sendHttp('POST', 'get_billing_payment_jt_details', connection.url, data);
			},
			cardcom_client: function (data) {
				return this.sendHttp('POST', 'cardcom_client', connection.url, data);
			},
			billing_account_delete: function (id) {
				return this.sendHttp('GET', 'billing_account_delete/' + id, connection.url);
			},
			billing_account_getitems: function (data) {
				return this.sendHttp('POST', 'billing_account_getitems', connection.url, data);
			},
			payment_update_status: function (data) {
				return this.sendHttp('POST', 'payment_update_status', connection.url, data);
			},
			get_chayavim_masach: function () {
				return this.sendHttp('GET', 'get_chayavim_masach', connection.url);
			},
			billing_account_set_cheque: function (data) {
				return this.sendHttp('POST', 'billing_account_set_cheque', connection.url, data);
			},
			billing_account_set_directdeb: function (data) {
				return this.sendHttp('POST', 'billing_account_set_directdeb', connection.url, data);
			},
			create_billing_invoice: function (data) {
				return this.sendHttp('POST', 'create_billing_invoice', connection.url, data);
			},
			set_default_user_id: function (data) {
				return this.sendHttp('POST', 'set_default_user_id', connection.url, data);
			},
			payment_cancel: function (id) {
				return this.sendHttp('GET', 'payment_cancel/' + id, connection.url);
			},
			get_task_catagory: function () {
				return this.sendHttp('GET', 'get_task_catagory/1', connection.url);
			},
			get_OtpToken: function () {
				return this.sendHttp('GET', 'get_OtpToken', connection.url);
			},
			token_update_Otp: function (data) {
				return this.sendHttp('POST', 'token_update_Otp', connection.url, data);
			},
			billing_report_4company: function (data) {
				return this.sendHttp('POST', 'billing_report_4company', connection.url, data);
			},
			billing_report_4company_sum: function (data) {
				return this.sendHttp('POST', 'billing_report_4company_sum', connection.url, data);
			},
			update_billing_next_date: function (data) {
				return this.sendHttp('POST', 'update_billing_next_date', connection.url, data);
			},
			get_perut_bankdetail: function (data) {
				return this.sendHttp('POST', 'get_perut_bankdetail', connection.url, data);
			},
			update_phone_number: function (data) {
				return this.sendHttp('POST', 'update_phone_number', connection.url, data);
			},
			billing_send_invoice_mail: function (data) {
				return this.sendHttp('POST', 'billing_send_invoice_mail', connection.url, data);
			},
			billing_payment_get_items_dtls: function (data) {
				return this.sendHttp('POST', 'billing_payment_get_items_dtls', connection.url, data);
			},
			existing_company_calc: function (data) {
				return this.sendHttp('POST', 'existing_company_calc', connection.url, data);
			},
			set_sug_hiuv: function (data) {
				return this.sendHttp('POST', 'set_sug_hiuv', connection.url, data);
			},
			get_potential_companies: function (data) {
				return this.sendHttp('POST', 'get_potential_companies', connection.url, data);
			},
			set_default_sug_hiuv_for_acc: function (data) {
				return this.sendHttp('POST', 'set_default_sug_hiuv_for_acc', connection.url, data);
			},
			restore_billing_account: function (data) {
				return this.sendHttp('POST', 'restore_billing_account', connection.url, data);
			},
			convert_billing_account: function (data) {
				return this.sendHttp('POST', 'convert_billing_account', connection.url, data);
			},
			set_discount_for_acc_office: function (data) {
				return this.sendHttp('POST', 'set_discount_for_acc_office', connection.url, data);
			},
			update_new_ui: function (data) {
				return this.sendHttp('POST', 'update_new_ui', connection.url, data);
			},
			run_credit_card_match1: function (data) {
				return this.sendHttp('POST', 'run_credit_card_match1', connection.url, data);
			},
			get_perut_bankdetail2: function (data) {
				return this.sendHttp('POST', 'get_perut_bankdetail2', connection.url, data);
			},
			ccard_izu_cust_curr_get: function (data) {
				return this.sendHttp('POST', 'ccard_izu_cust_curr_get', connection.url, data);
			},
			update_account_blklist: function (data) {
				return this.sendHttp('POST', 'update_account_blklist', connection.url, data);
			},
			ccard_getmahzorihiuv_hul_list: function (data) {
				return this.sendHttp('POST', 'ccard_getmahzorihiuv_hul_list', connection.url, data);
			},
			ccard_hul_prepare: function (data) {
				return this.sendHttp('POST', 'ccard_hul_prepare', connection.url, data);
			},
			get_acco_office_details: function () {
				return this.sendHttp('POST', 'get_acco_office_details', connection.url, {
					accountantOfficeId: localStorage.getItem('ACCOUNTANT_OFFICE_ID')
				});
			},
			acc_office_getnotes: function () {
				return this.sendHttp('GET', 'acc_office_getnotes/' + localStorage.getItem('ACCOUNTANT_OFFICE_ID'), connection.url);
			},
			get_exporters_details: function () {
				return this.sendHttp('GET', 'get_exporters_details', connection.url);
			},
			get_acco_office_timeline: function () {
				return this.sendHttp('GET', 'get_acco_office_timeline/' + localStorage.getItem('ACCOUNTANT_OFFICE_ID'), connection.url);
			},
			get_acco_office_users: function () {
				return this.sendHttp('POST', 'get_acco_office_users', connection.url, {
					accountantOfficeId: localStorage.getItem('ACCOUNTANT_OFFICE_ID')
				});
			},
			qa_task_by_serach: function (data) {
				return this.sendHttp('POST', 'qa_task_by_serach', connection.url, data);
			},
			get_user_companies_det: function () {
				return this.sendHttp('GET', 'get_user_companies_det', connection.url);
			},
			update_exporter_comment: function (data) {
				return this.sendHttp('POST', 'update_exporter_comment', connection.url, data);
			},
			acc_office_updatenote: function (data) {
				return this.sendHttp('POST', 'acc_office_updatenote', connection.url, data);
			},
			accountant_office_update: function (data) {
				return this.sendHttp('POST', 'accountant_office_update', connection.url, data);
			},
			acc_office_createnote: function (data) {
				return this.sendHttp('POST', 'acc_office_createnote', connection.url, data);
			},
			bizibox_downgrade: function (data) {
				return this.sendHttp('POST', 'bizibox_downgrade', connection.url, data);
			},
			card_matach_clean_export: function (id) {
				return this.sendHttp('GET', 'card_matach_clean_export/' + id, connection.url);
			}
		};
		return connection;
	}

	angular.module('services')
	.factory('serverConnection', ['$http', '$rootScope', '$q', '$timeout', '$state', serverConnection]);
}());





