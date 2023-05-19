(function () {
	var hostnameWsPhp;
	if (location.hostname == 'localhost') {
		//hostnameWsPhp = 'http://localhost:8080/api/excelExports/download';
		hostnameWsPhp = 'https://secure.bizibox.biz/ProjectsBiziboxMaven/api/excelExports/download';
	}
	else {
		hostnameWsPhp = '../ProjectsBiziboxMaven/api/excelExports/download';
	}
	function getTotalGlobal(num) {
		var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
		return num.toString().match(re)[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}
	function getStringJson(str) {
		if (str !== undefined && str !== null) {
			return str.toString().replace(/&quot;/g, "\"").replace(/>/g, "").replace(/</g, "").replace(/"/g, "\"").replace(/&rlm;/g, "").replace(/&/g, "___").replace(//g, "");
		}
		else {
			return "";
		}
	}

	function getDateWith2DigitYear(dateStr) {
		try {
			if (dateStr) {
				var partDate = dateStr.split("/");
				return partDate[0] + '/' + partDate[1] + '/' + partDate[2].slice(2, 4);
			} else {
				return dateStr;
			}
		}
		catch (e) {
			return dateStr;
		}
	}

	function exportsExcelPriority() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					function getDateMonth(date) {
						switch (date) {
							case '01':
								return "ינואר";
								break;
							case '02':
								return "פברואר";
								break;
							case '03':
								return "מרץ";
								break;
							case '04':
								return "אפריל";
								break;
							case '05':
								return "מאי";
								break;
							case '06':
								return "יוני";
								break;
							case '07':
								return "יולי";
								break;
							case '08':
								return "אוגוסט";
								break;
							case '09':
								return "ספטמבר";
								break;
							case '10':
								return "אוקטובר";
								break;
							case '11':
								return "נובמבר";
								break;
							case '12':
								return "דצמבר";
								break;
						}
						;
					}

					var name_doch = ' ניתוח חשבונות בנק -';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								cell: [
									{
										"val": "תאריך_רישום",
										"type": "header"
									},
									{
										"val": "ת_ערך",
										"type": "header"
									},
									{
										"val": "קוד_פעולת_בנק",
										"type": "header"
									},
									{
										"val": "פרטים",
										"type": "header"
									},
									{
										"val": "חובה",
										"type": "header"
									},
									{
										"val": "זכות",
										"type": "header"
									},
									{
										"val": "אסמכתא",
										"type": "header"
									},
									{
										"val": "יתרה",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"12",
							"12",
							"12",
							"25",
							"12",
							"12",
							"12",
							"12"
						],
						senderMail: []
					};

					var itraTitle = '';
					var arrAcc = angular.copy(scope.appData.filteredTransactions);
					if (scope.appData.sortDateAll) {
						arrAcc = arrAcc.reverse();
					}
					function getTotal(num) {
						var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
						return num.toString().match(re)[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
					}
					$(arrAcc).each(function (i, v) {
						var tooltip = '';
						var ind_expence1 = '';
						var ind_expence0 = '';
						var asmachta = '';
						var itra = '';
						var payment_type_name = '';
						if (!v.sumRow) {
							if (v.ind_expence == 1) {
								ind_expence1 = (Number(v.next_total) * -1).toString();
							} else {
								ind_expence0 = (v.next_total).toString();
							}
							if (v.asmachta) {
								asmachta = v.asmachta.toString().substring(0, 9);
							}
							if (v.itra !== null) {
								itra = (v.itra).toString();
							}
							var rows = {
								"cell": [
									{
										val: getDateWith2DigitYear(v.due_date),
										type: "cell"
									},
									{
										val: getDateWith2DigitYear(v.due_date),
										type: "cell"
									},
									{
										val: "00",
										type: "cell"
									},
									{
										val: getStringJson(v.target_name),
										type: "cell"
									},
									{
										val: (ind_expence1),
										type: "cell"
									},
									{
										val: (ind_expence0),
										type: "cell"
									},
									{
										val: asmachta,
										type: "cell"
									},
									{
										val: (itra),
										type: "cellBorderLeft"
									}
								]
							};

							data.rows.push(rows);
						}
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsExcel() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					function getDateMonth(date) {
						switch (date) {
							case '01':
								return "ינואר";
								break;
							case '02':
								return "פברואר";
								break;
							case '03':
								return "מרץ";
								break;
							case '04':
								return "אפריל";
								break;
							case '05':
								return "מאי";
								break;
							case '06':
								return "יוני";
								break;
							case '07':
								return "יולי";
								break;
							case '08':
								return "אוגוסט";
								break;
							case '09':
								return "ספטמבר";
								break;
							case '10':
								return "אוקטובר";
								break;
							case '11':
								return "נובמבר";
								break;
							case '12':
								return "דצמבר";
								break;
						}
						;
					}

					var name_doch = ' ניתוח חשבונות בנק -';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								cell: [
									{
										"val": "תאריך",
										"type": "header"
									},
									{
										"val": "פ.מחז",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "סוג תשלום",
										"type": "header"
									},
									{
										"val": "סוג פעולה",
										"type": "header"
									},
									{
										"val": "תיאור",
										"type": "header"
									},
									{
										"val": "הכנסה",
										"type": "header"
									},
									{
										"val": "הוצאה",
										"type": "header"
									},
									{
										"val": "אסמכתא",
										"type": "header"
									},
									{
										"val": "יתרה",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"12",
							"8",
							"25",
							"17",
							"17",
							"20",
							"12",
							"12",
							"12",
							"12"
						],
						senderMail: []
					};

					var itraTitle = '';
					$(scope.appData.filteredTransactions).each(function (i, v) {
						var tooltip = '';
						var ind_expence1 = '';
						var ind_expence0 = '';
						var asmachta = '';
						var itra = '';
						var payment_type_name = '';
						if (!v.sumRow) {
							if (v.searchkey_cat_id) {
								payment_type_name = scope.converterPayMentTypes(v.searchkey_cat_id);
							}
							if (v.ind_kvua == 1) {
								tooltip = '↺';
							}
							if (v.ind_expence == 1) {
								ind_expence1 = v.next_total.toString();
							}
							else {
								ind_expence0 = v.next_total.toString();
							}
							if (v.asmachta) {
								asmachta = v.asmachta.toString().substring(0, 9);
							}
							if (v.itra !== null) {
								itra = v.itra.toString();
							}
							var rows = {
								"cell": [
									{
										val: v.due_date,
										type: "cell"
									},
									{
										val: tooltip,
										type: "cell"
									},
									{
										val: getStringJson(v.company_account_nickname),
										type: "cell"
									},
									{
										val: getStringJson(payment_type_name),
										type: "cell"
									},
									{
										val: getStringJson(v.trans_type_name),
										type: "cell"
									},
									{
										val: getStringJson(v.target_name),
										type: "cell"
									},
									{
										val: ind_expence0,
										type: "cell"
									},
									{
										val: ind_expence1,
										type: "cell"
									},
									{
										val: asmachta,
										type: "cell"
									},
									{
										val: itra,
										type: "cellBorderLeft"
									}
								]
							};

							data.rows.push(rows);
						}
						else {
							var rows = {
								"cell": [
									{
										"val": getStringJson(getDateMonth(v.due_date.toString().split('/')[1]) + ' ' + v.due_date.toString().split('/')[2] + ' - סה"כ'),
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": scope.appData.totalsObj[v.due_date.split("/")[1]].totalIncome.toString(),
										"type": "cellBold"
									},
									{
										"val": scope.appData.totalsObj[v.due_date.split("/")[1]].totalExpenses.toString(),
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBoldBorderLeft"
									}
								]
							};


							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":F" + (data.rows.length));
						}
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsPrint() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {

				$(element).on('click', function () {
					function getDateMonth(date) {
						switch (date) {
							case '01':
								return "ינואר";
								break;
							case '02':
								return "פברואר";
								break;
							case '03':
								return "מרץ";
								break;
							case '04':
								return "אפריל";
								break;
							case '05':
								return "מאי";
								break;
							case '06':
								return "יוני";
								break;
							case '07':
								return "יולי";
								break;
							case '08':
								return "אוגוסט";
								break;
							case '09':
								return "ספטמבר";
								break;
							case '10':
								return "אוקטובר";
								break;
							case '11':
								return "נובמבר";
								break;
							case '12':
								return "דצמבר";
								break;
						}
						;
					}

					var itraTitle = '';
					var row = '<tbody>';

					$(scope.appData.filteredTransactions).each(function (i, v) {

						var tooltip = '';
						var ind_expence1 = '';
						var ind_expence0 = '';
						var asmachta = '';
						var itra = '';
						var payment_type_name = '';
						var colspan = 2;
						if (!v.sumRow) {
							if (v.searchkey_cat_id) {
								payment_type_name = scope.converterPayMentTypes(v.searchkey_cat_id);
							}
							if (v.ind_kvua == 1) {
								tooltip = '↺';
							}
							if (v.ind_expence == 1) {
								ind_expence1 = v.next_total;
							}
							else {
								ind_expence0 = v.next_total;
							}
							if (v.asmachta) {
								asmachta = v.asmachta.toString().substring(0, 9);
							}
							if (v.itra !== null) {
								itra = '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + v.itra + '</td>';
							}
							else {
								itra = '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&nbsp;</td>';
							}
							itraTitle = '<th style="color:#000;margin: 0px 8px; font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;width:100px;">יתרה</th>';
							colspan = 3;

							row += '<tr>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;width:100px;">' + v.due_date + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;text-align:center;width:70px;">' + tooltip + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;width:150px;">' + v.company_account_nickname + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;width:150px;">' + payment_type_name + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;width:150px;">' + v.trans_type_name + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;width:200px;">' + v.target_name + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;width:120px;">' + ind_expence0 + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;width:120px;">' + ind_expence1 + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;width:100px;">' + asmachta + '</td>';
							row += itra;
							row += '</tr>';
						}

						if (v.sumRow == true) {
							row += '<tr>';
							row += '<td style="border-bottom: 1px solid #666;border-top: 1px solid #666;margin: 0px 8px;" colspan="5">' + getDateMonth(v.due_date.toString().split('/')[1]) + ' ' + v.due_date.toString().split('/')[2] + ' - סה"כ' + '</td>';
							row += '<td style="border-bottom: 1px solid #666;border-top: 1px solid #666;margin: 0px 8px;" colspan="1">' + scope.appData.totalsObj[v.due_date.split("/")[1]].totalIncome + '</td>';
							row += '<td style="border-bottom: 1px solid #666;border-top: 1px solid #666;margin: 0px 8px;text-align:right;" colspan="' + colspan + '">' + scope.appData.totalsObj[v.due_date.split("/")[1]].totalExpenses + '</td>';
							row += '</tr>';
						}


					});
					row += '</tbody>';
					var headTable = '<thead><tr>' +
						'<th  style="background: rgb(221, 217, 196);margin: 0px 8px;font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">תאריך</th>' +
						'<th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">פ.מחז</th>' +
						'<th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">ח-ן</th>' +
						'<th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">סוג תשלום</th>' +
						'<th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">סוג פעולה</th>' +
						'<th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">תיאור</th><th style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">הכנסה</th><th style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">הוצאה</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">אסמכתא</th>' + itraTitle + '</tr></thead>';

					var table = headTable + row;
					var name_doch = 'דו"ח ניתוח חשבונות בנק - ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.selectedCompany.companyName + '</td>';

					var dataArr1 = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<table style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border: 1px solid #c6c6c6;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</table>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{@page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}} font-weight: 400;font-style: normal;}th{font: 16px esterebold, Arial; color: #000 !important;}td{font: 12px Arial;}tr{height: 17px;border-bottom: 1px solid #666;}</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsMailer(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;
					var name_doch = ' ניתוח חשבונות בנק -';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}

					function getDateMonth(date) {
						switch (date) {
							case '01':
								return "ינואר";
								break;
							case '02':
								return "פברואר";
								break;
							case '03':
								return "מרץ";
								break;
							case '04':
								return "אפריל";
								break;
							case '05':
								return "מאי";
								break;
							case '06':
								return "יוני";
								break;
							case '07':
								return "יולי";
								break;
							case '08':
								return "אוגוסט";
								break;
							case '09':
								return "ספטמבר";
								break;
							case '10':
								return "אוקטובר";
								break;
							case '11':
								return "נובמבר";
								break;
							case '12':
								return "דצמבר";
								break;
						}
					}


					var name_doch = ' ניתוח חשבונות בנק -';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								cell: [
									{
										"val": "תאריך",
										"type": "header"
									},
									{
										"val": "פ.מחז",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "סוג תשלום",
										"type": "header"
									},
									{
										"val": "סוג פעולה",
										"type": "header"
									},
									{
										"val": "תיאור",
										"type": "header"
									},
									{
										"val": "הכנסה",
										"type": "header"
									},
									{
										"val": "הוצאה",
										"type": "header"
									},
									{
										"val": "אסמכתא",
										"type": "header"
									},
									{
										"val": "יתרה",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"12",
							"8",
							"25",
							"17",
							"17",
							"20",
							"12",
							"12",
							"12",
							"12"
						],
						senderMail: [{
							'title': name_doch + scope.appData.selectedCompany.companyName,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};

					var itraTitle = '';
					$(scope.appData.filteredTransactions).each(function (i, v) {
						var tooltip = '';
						var ind_expence1 = '';
						var ind_expence0 = '';
						var asmachta = '';
						var itra = '';
						var payment_type_name = '';
						if (!v.sumRow) {
							if (v.searchkey_cat_id) {
								payment_type_name = scope.converterPayMentTypes(v.searchkey_cat_id);
							}
							if (v.ind_kvua == 1) {
								tooltip = '↺';
							}
							if (v.ind_expence == 1) {
								ind_expence1 = v.next_total;
							}
							else {
								ind_expence0 = v.next_total;
							}
							if (v.asmachta) {
								asmachta = v.asmachta.toString().substring(0, 9);
							}
							if (v.itra !== null) {
								itra = v.itra;
							}
							var rows = {
								"cell": [
									{
										val: v.due_date,
										type: "cell"
									},
									{
										val: tooltip,
										type: "cell"
									},
									{
										val: v.company_account_nickname,
										type: "cell"
									},
									{
										val: getStringJson(payment_type_name),
										type: "cell"
									},
									{
										val: getStringJson(v.trans_type_name),
										type: "cell"
									},
									{
										val: getStringJson(v.target_name),
										type: "cell"
									},
									{
										val: ind_expence0.toString(),
										type: "cell"
									},
									{
										val: ind_expence1.toString(),
										type: "cell"
									},
									{
										val: asmachta,
										type: "cell"
									},
									{
										val: itra.toString(),
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
						else {
							var rows = {
								"cell": [
									{
										"val": getStringJson(getDateMonth(v.due_date.toString().split('/')[1]) + ' ' + v.due_date.toString().split('/')[2] + ' - סה"כ'),
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": scope.appData.totalsObj[v.due_date.split("/")[1]].totalIncome.toString(),
										"type": "cellBold"
									},
									{
										"val": scope.appData.totalsObj[v.due_date.split("/")[1]].totalExpenses.toString(),
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBold"
									},
									{
										"val": "",
										"type": "cellBoldBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":F" + (data.rows.length));
						}
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});

				});
			}
		}
	}


	function exportsText() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs, filter) {
				//scope.$watch(function () {
				//	return $(element).val()
				//}, function (newVal, oldVal) {
				//	if (newVal != oldVal) {
				//		console.log(newVal);
				//	}
				//});
				function stringReverse(string) {
					return string.split('').reverse().join('');
				}

				$(element).on('click', function () {


					var hasahvshevt_dat = '';
					var hasahvshevt_datle = '';
					//var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
					//function dmyOrdA(a, b) {
					//    a = a.due_date.replace(dateRE, "$3$2$1");
					//    b = b.due_date.replace(dateRE, "$3$2$1");
					//    if (a > b) return 1;
					//    if (a < b) return -1;
					//    return 0;
					//}
					//filteredTransactionsData.sort(dmyOrdA);


					scope.appData.filteredTransactionsData.reverse();


					$(scope.appData.filteredTransactionsData).each(function (i, v) {
						if (!v.sumRow) {
							var space = ' ';
							var empty = '';
							var asmachta, due_date, target_name, next_total_ex, next_total_va, itra,
								next_total_va_abs,
								next_total_ex_abs;
							if (v.asmachta == null) {
								asmachta = '         ';
							}
							else {
								var asmachta_length = 9 - v.asmachta.toString().substring(0, 9).length;
								for (i = 0; i < asmachta_length; i++) {
									empty += space;
								}
								asmachta = v.asmachta.toString().substring(0, 9) + empty;
							}

							var empty1 = '';
							var due_date_length = 10 - v.due_date.toString().substring(0, 10).length;
							for (i = 0; i < due_date_length; i++) {
								empty1 += space;
							}
							due_date = v.due_date.toString().substring(0, 10) + empty1;

							var empty2 = '';
							var target_name_length = 50 - v.target_name.toString().substring(0, 50).length;
							for (i = 0; i < target_name_length; i++) {
								empty2 += space;
							}
							target_name = stringReverse(v.target_name.toString().substring(0, 50)) + empty2;

							var empty3 = '';
							var empty4 = '';

							if (v.ind_expence == 0) {
								next_total_ex = '           ';
								next_total_va_abs = v.next_total.toString().substring(0, 9);
								next_total_va = parseFloat(next_total_va_abs).toFixed(2);

								var next_total_va_length = 11 - next_total_va.length;
								for (i = 0; i < next_total_va_length; i++) {
									empty3 += space;
								}
								next_total_va = next_total_va + empty3;
							}
							if (v.ind_expence == 1) {
								next_total_va = '           ';
								next_total_ex_abs = v.next_total.toString().substring(0, 9);
								next_total_ex = parseFloat(next_total_ex_abs).toFixed(2);

								var next_total_va_length = 11 - next_total_ex.length;
								for (i = 0; i < next_total_va_length; i++) {
									empty4 += space;
								}
								next_total_ex = next_total_ex + empty4;
							}

							var empty5 = '';
							if (v.itra !== null) {
								itra = v.itra.toFixed(2);
							}
							else {
								itra = ' ';
							}
							var itra_length = 11 - itra.toString().substring(0, 11).length;
							for (i = 0; i < itra_length; i++) {
								empty5 += space;
							}
							itra = itra.toString().substring(0, 11) + empty5;


							hasahvshevt_dat += asmachta + ' ' + due_date + ' ' + target_name + ' ' + next_total_ex + ' ' + next_total_va + ' ' + itra + '\n';
							hasahvshevt_datle += asmachta.length + ' ' + due_date.length + ' ' + target_name.length + ' ' + next_total_ex.length + ' ' + next_total_va.length + ' ' + itra.length + '\n';
						}
					});

					//// var hasahvshevt = 111 + '\n' + hasahvshevt_dat;

					//console.log(hasahvshevt_datle)

					setTimeout(function () {
						location.assign("https://php.bizibox.biz/text.php");
					}, 100);


					setTimeout(function () {
						$('#ReportTableData, #text').remove();
						$('body').prepend("<form method='post' action='https://php.bizibox.biz/hashavshevetDev.php' style='display:none' id='ReportTableData'>  <textarea name='hashavshevet'>" + hasahvshevt_dat + "</textarea></form>");
						$('#ReportTableData').submit().remove();
						return false;
					}, 2500);


				});
			}
		}
	}

	function exportsTextRiv() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs, filter) {

				function stringReverse(string) {
					return string.split('').reverse().join('');
				}

				$(element).on('click', function () {
					var hasahvshevt_dat = '';
					var hasahvshevt_datle = '';
					scope.appData.filteredTransactionsData.reverse();

					$(scope.appData.filteredTransactionsData).each(function (i, v) {
						if (!v.sumRow) {
							var space = ' ';
							var empty = '';
							var asmachta, due_date, target_name, next_total_ex, next_total_va, itra,
								next_total_va_abs,
								next_total_ex_abs;
							if (v.asmachta == null) {
								asmachta = '       ';
							}
							else {
								var asmachta_length = 7 - v.asmachta.toString().substring(0, 7).length;
								for (i = 0; i < asmachta_length; i++) {
									empty += space;
								}
								asmachta = v.asmachta.toString().substring(0, 7) + empty;
							}

							var empty1 = '';
							var datesD = v.due_date.split('/');
							var due_dates = datesD[0] + '' + datesD[1] + '' + datesD[2].substring(2, 4);
							var due_date_length = 6 - due_dates.toString().substring(0, 6).length;
							for (i = 0; i < due_date_length; i++) {
								empty1 += space;
							}
							due_date = due_dates.toString().substring(0, 6) + empty1;

							var empty2 = '';
							var target_name_length = 16 - v.target_name.toString().substring(0, 16).length;
							for (i = 0; i < target_name_length; i++) {
								empty2 += space;
							}
							target_name = stringReverse(v.target_name.toString().substring(0, 16)) + empty2;

							var empty3 = '';
							if (v.ind_expence == 0) {
								next_total_va_abs = v.next_total.toString().substring(0, 10);
								next_total_va = parseFloat(next_total_va_abs).toFixed(2);

								var next_total_va_length = 10 - next_total_va.length;
								for (i = 0; i < next_total_va_length; i++) {
									empty3 += space;
								}
								next_total_va = next_total_va + empty3;
							}
							if (v.ind_expence == 1) {
								next_total_va_abs = v.next_total.toString().substring(0, 10);
								next_total_va = parseFloat(next_total_va_abs).toFixed(2);

								var next_total_va_length = 10 - next_total_va.length;
								for (i = 0; i < next_total_va_length; i++) {
									empty3 += space;
								}
								next_total_va = next_total_va + empty3;
							}


							hasahvshevt_dat += asmachta + ' ' + due_date + '  ' + target_name + ' ' + next_total_va + '\n';
							hasahvshevt_datle += asmachta.length + ' ' + due_date.length + ' ' + target_name.length + ' ' + next_total_va.length + '\n';
						}
					});

					//console.log(hasahvshevt_datle)

					setTimeout(function () {
						$('#ReportTableData, #text').remove();
						$('body').prepend("<form method='post' action='https://php.bizibox.biz/hashavshevetDev.php' style='display:none' id='ReportTableData'>  <textarea name='hashavshevet'>" + hasahvshevt_dat + "</textarea></form>");

						$('#ReportTableData').submit().remove();
						return false;
					}, 1000);


				});
			}
		}

	}


	function exportsPrintCard() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					function getDateMonth(date) {
						switch (date) {
							case '01':
								return "ינואר";
								break;
							case '02':
								return "פברואר";
								break;
							case '03':
								return "מרץ";
								break;
							case '04':
								return "אפריל";
								break;
							case '05':
								return "מאי";
								break;
							case '06':
								return "יוני";
								break;
							case '07':
								return "יולי";
								break;
							case '08':
								return "אוגוסט";
								break;
							case '09':
								return "ספטמבר";
								break;
							case '10':
								return "אוקטובר";
								break;
							case '11':
								return "נובמבר";
								break;
							case '12':
								return "דצמבר";
								break;
						}
						;
					}

					function getPercent(x, y) {
						var result = Math.round((100 * x) / y);
						return result;
					};

					function getTotal(num) {
						var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
						return num.toString().match(re)[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
					}

					var row = '<tbody>';
					$(scope.filteredData).each(function (i, t) {
						if (!t.monthSum) {
							//var zefiPer, zefi;
							//if (t.zefi > 0) {
							//    zefiPer = getPercent(t.trans_total, t.zefiletazrim);
							//    zefi = getTotal(t.zefiletazrim);
							//}
							//else {
							//    zefiPer = '&nbsp;';
							//    zefi = '&nbsp;';
							//}
							if (t.tooltip) {
								var tooltip = t.tooltip;
							}
							else {
								var tooltip = '&nbsp;';
							}
							row += '<tr>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + t.trans_date + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + t.company_account_nickname + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + t.CREDIT_CARD_NO + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + tooltip + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + getTotal(t.total_regular) + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + getTotal(t.total_payments) + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + getTotal(t.trans_total) + '</td>';
							//row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + zefi + '</td>';
							//row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + zefiPer + '</td>';
							row += '</tr>';
							row += '<tr><td style="background: rgb(221, 217, 196);color:#000;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="1">תאריך</td>' +
								'<td style="background: rgb(221, 217, 196);color:#000;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="3">תאור</td>' +
								'<td style="background: rgb(221, 217, 196);color:#000;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="1">סכום</td>' +
								'<td style="background: rgb(221, 217, 196);color:#000;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="1"> פרטים נוספים</td>' +
								'<td style="background: rgb(221, 217, 196);color:#000;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="1"> סכום עסקה</td>' +
								'</tr>';

							$(t.peulot_tab).each(function (i, p) {
								$(p.peoulot).each(function (i, d) {
									if (d.asmachta !== 'תשלום 0 מתוך 0' && d.asmachta !== 'none') {
										var asmachta = d.asmachta;
									}
									else {
										var asmachta = '&nbsp;';
									}
									if (d.searchObj == true) {
										row += '<tr>';
										row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="1">' + d.original_date + '</td>';
										row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="3">' + d.trans_name + '</td>';
										row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="1">' + getTotal(d.hozaa) + '</td>';
										row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="1">' + asmachta + '</td>';
										row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="1">' + getTotal(d.original_total) + '</td>';
										row += '</tr>';
									}
								});
							});
						}

						if (t.monthSum == true) {
							//var zefiPer, zefi;
							//if (t.zefi > 0) {
							//    zefiPer = getPercent(t.sum, t.zefi);
							//    zefi = getTotal(t.zefi);
							//}
							//else {
							//    zefiPer = '&nbsp;';
							//    zefi = '&nbsp;';
							//}

							row += '<tr>';
							row += '<td style="border-bottom: 1px solid #666;border-top: 1px solid #666;margin: 0px 8px;" colspan="4">' + getDateMonth(t.trans_date.toString().split('/')[1]) + ' ' + t.trans_date.toString().split('/')[2] + ' - סה"כ' + '</td>';
							row += '<td style="border-bottom: 1px solid #666;border-top: 1px solid #666;margin: 0px' +
								' 8px;" colspan="1">' + getTotal(t.sumN) + '</td>';
							row += '<td style="border-bottom: 1px solid #666;border-top: 1px solid #666;margin: 0px' +
								' 8px;" colspan="1">' + getTotal(t.sumP) + '</td>';
							row += '<td style="border-bottom: 1px solid #666;border-top: 1px solid #666;margin: 0px' +
								' 8px;" colspan="1">' + getTotal(t.sum) + '</td>';
							//row += '<td style="border-bottom: 1px solid #666;border-top: 1px solid #666;margin: 0px 8px;" colspan="1">' + zefi + '</td>';
							//row += '<td style="border-bottom: 1px solid #666;border-top: 1px solid #666;margin: 0px 8px;" colspan="1">' + zefiPer + '</td>';
							row += '</tr>';
						}
					});
					row += '</tbody>';

					var headTable = '<thead><tr><th  style="background: rgb(221, 217, 196);margin: 0px 8px;font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">תאריך</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">ח-ן</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">  מס׳ כרטיס</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">   כינוי כרטיס</th><th style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">   עסקאות רגילות</th><th style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">עסקאות בתשלומים</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;"> סה"כ לחיוב</th></tr></thead>';

					var table = headTable + row;
					var name_doch = 'דו"ח כרטיסי אשראי- ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.selectedCompany.companyName + '</td>';

					var dataArr1 = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<table style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border: 1px solid #c6c6c6;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</table>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{@page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}} font-weight: 400;font-style: normal;}th{font: 11px esterebold, Arial; color: #000 !important;}td{font: 12px Arial;}tr{height: 17px;border-bottom: 1px solid #666;}</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}

	}


	function exportsExcelCardsPriority() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					function getDateMonth(date) {
						switch (date) {
							case '01':
								return "ינואר";
								break;
							case '02':
								return "פברואר";
								break;
							case '03':
								return "מרץ";
								break;
							case '04':
								return "אפריל";
								break;
							case '05':
								return "מאי";
								break;
							case '06':
								return "יוני";
								break;
							case '07':
								return "יולי";
								break;
							case '08':
								return "אוגוסט";
								break;
							case '09':
								return "ספטמבר";
								break;
							case '10':
								return "אוקטובר";
								break;
							case '11':
								return "נובמבר";
								break;
							case '12':
								return "דצמבר";
								break;
						}
						;
					}

					function getPercent(x, y) {
						var result = Math.round((100 * x) / y);
						return result;
					};

					function getTotal(num) {
						var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
						return num.toString().match(re)[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
					}

					var data = {
						rows: [
							{
								cell: [
									{
										"val": "תאריך_רישום",
										"type": "header"
									},
									{
										"val": "ת_ערך",
										"type": "header"
									},
									{
										"val": "קוד_פעולת_בנק",
										"type": "header"
									},
									{
										"val": "פרטים",
										"type": "header"
									},
									{
										"val": "חובה",
										"type": "header"
									},
									{
										"val": "זכות",
										"type": "header"
									},
									{
										"val": "אסמכתא",
										"type": "header"
									},
									{
										"val": "יתרה",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderRowsGroup",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": true,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderRowsGroupBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": true,
								"typesCellNumber": false
							},
						],
						mergeCells: [],
						widthCells: [
							"12",
							"12",
							"12",
							"18",
							"12",
							"12",
							"12",
							"12"
						],
						senderMail: []
					};
					$(scope.filteredData).each(function (i, t) {
						if (!t.monthSum) {
							$(t.peulot_tab).each(function (i1, p) {
								$(p.peoulot).each(function (i1, d) {
									if (d.searchObj == true) {
										var rows = {
											"cell": [
												{
													val: getDateWith2DigitYear(d.original_date),
													type: "cell"
												},
												{
													val: getDateWith2DigitYear(d.day_id),
													type: "cell"
												},
												{
													val: "",
													type: "cell"
												},
												{
													val: getStringJson(d.trans_name),
													type: "cell"
												},
												{
													val: getTotal(d.hozaa),
													type: "cell"
												},
												{
													val: "",
													type: "cell"
												},
												{
													val: "",
													type: "cell"
												},
												{
													val: "",
													type: "cellBorderLeft"
												}
											]
										};
										data.rows.push(rows);
									}
								});
							});

							var tooltip = '';
							if (t.tooltip) {
								tooltip = t.tooltip;
							}

							var rows = {
								"cell": [
									{
										val: getDateWith2DigitYear(t.trans_date),
										type: "cellBolderRowsGroup"
									},
									{
										val: getDateWith2DigitYear(t.trans_date),
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroup"
									},
									{
										val: getStringJson(tooltip),
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.trans_total),
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroupBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
					});
					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}

	}

	function exportsExcelCards() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					function getDateMonth(date) {
						switch (date) {
							case '01':
								return "ינואר";
								break;
							case '02':
								return "פברואר";
								break;
							case '03':
								return "מרץ";
								break;
							case '04':
								return "אפריל";
								break;
							case '05':
								return "מאי";
								break;
							case '06':
								return "יוני";
								break;
							case '07':
								return "יולי";
								break;
							case '08':
								return "אוגוסט";
								break;
							case '09':
								return "ספטמבר";
								break;
							case '10':
								return "אוקטובר";
								break;
							case '11':
								return "נובמבר";
								break;
							case '12':
								return "דצמבר";
								break;
						}
						;
					}

					function getPercent(x, y) {
						var result = Math.round((100 * x) / y);
						return result;
					};

					function getTotal(num) {
						var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
						return num.toString().match(re)[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
					}


					var name_doch = ' כרטיסי אשראי- ' + ' ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "תאריך",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "מס׳ כרטיס",
										"type": "header"
									},
									{
										"val": "כינוי כרטיס",
										"type": "header"
									},
									{
										"val": "עסקאות רגילות",
										"type": "header"
									},
									{
										"val": "עסקאות בתשלומים",
										"type": "header"
									},
									{
										"val": "סה\"כ לחיוב",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderRowsGroup",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": true,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderRowsGroupBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": true,
								"typesCellNumber": false
							},
						],
						mergeCells: [],
						widthCells: [
							"12",
							"12",
							"18",
							"12",
							"12",
							"12",
							"12"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:G1");
					$(scope.filteredData).each(function (i, t) {
						if (!t.monthSum) {
							if (t.tooltip) {
								var tooltip = t.tooltip;
							}
							else {
								var tooltip = '';
							}

							var rows = {
								"cell": [
									{
										val: getStringJson(t.trans_date),
										type: "cellBolderRowsGroup"
									},
									{
										val: getStringJson(t.company_account_nickname),
										type: "cellBolderRowsGroup"
									},
									{
										val: getStringJson(t.CREDIT_CARD_NO.toString()),
										type: "cellBolderRowsGroup"
									},
									{
										val: getStringJson(tooltip),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.total_regular),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.total_payments),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.trans_total),
										type: "cellBolderRowsGroupBorderLeft"
									}
								]
							};
							data.rows.push(rows);

							var rows = {
								"cell": [
									{
										val: "תאריך",
										type: "cellBold"
									},
									{
										val: "תאור",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "סכום",
										type: "cellBold"
									},
									{
										val: "פרטים נוספים",
										type: "cellBold"
									},
									{
										val: "סכום עסקה",
										type: "cellBoldBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("B" + (data.rows.length) + ":D" + (data.rows.length));

							$(t.peulot_tab).each(function (i1, p) {
								$(p.peoulot).each(function (i1, d) {
									if (d.asmachta !== 'תשלום 0 מתוך 0' && d.asmachta !== 'none') {
										var asmachta = d.asmachta;
									}
									else {
										var asmachta = '';
									}
									if (d.searchObj == true) {
										var rows = {
											"cell": [
												{
													val: getStringJson(d.original_date),
													type: "cell"
												},
												{
													val: getStringJson(d.trans_name),
													type: "cell"
												},
												{
													val: "",
													type: "cell"
												},
												{
													val: "",
													type: "cell"
												},
												{
													val: getTotal(d.hozaa),
													type: "cell"
												},
												{
													val: getStringJson(asmachta),
													type: "cell"
												},
												{
													val: getTotal(d.original_total),
													type: "cellBorderLeft"
												}
											]
										};
										data.rows.push(rows);
										data.mergeCells.push("B" + (data.rows.length) + ":D" + (data.rows.length));
									}
								});
							});
						}

						if (t.monthSum == true) {
							var rows = {
								"cell": [
									{
										val: getDateMonth(t.trans_date.toString().split('/')[1]) + ' ' + t.trans_date.toString().split('/')[2] + " סה\"כ - ",
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.sumN),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.sumP),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.sum),
										type: "cellBolderRowsGroupBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":D" + (data.rows.length));
						}
					});
					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}

	}

	function exportsMailerCards(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				//scope.$watch(function () {
				//	return $(element).val()
				//}, function (newVal, oldVal) {
				//	if (newVal != oldVal) {
				//		console.log(newVal);
				//	}
				//});
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;

					function getDateMonth(date) {
						switch (date) {
							case '01':
								return "ינואר";
								break;
							case '02':
								return "פברואר";
								break;
							case '03':
								return "מרץ";
								break;
							case '04':
								return "אפריל";
								break;
							case '05':
								return "מאי";
								break;
							case '06':
								return "יוני";
								break;
							case '07':
								return "יולי";
								break;
							case '08':
								return "אוגוסט";
								break;
							case '09':
								return "ספטמבר";
								break;
							case '10':
								return "אוקטובר";
								break;
							case '11':
								return "נובמבר";
								break;
							case '12':
								return "דצמבר";
								break;
						}
						;
					}

					function getPercent(x, y) {
						var result = Math.round((100 * x) / y);
						return result;
					};

					function getTotal(num) {
						var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
						return num.toString().match(re)[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
					}


					var name_doch = ' כרטיסי אשראי- ' + ' ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "תאריך",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "מס׳ כרטיס",
										"type": "header"
									},
									{
										"val": "כינוי כרטיס",
										"type": "header"
									},
									{
										"val": "עסקאות רגילות",
										"type": "header"
									},
									{
										"val": "עסקאות בתשלומים",
										"type": "header"
									},
									{
										"val": "סה\"כ לחיוב",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderRowsGroup",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": true,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderRowsGroupBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": true,
								"typesCellNumber": false
							},
						],
						mergeCells: [],
						widthCells: [
							"12",
							"12",
							"18",
							"12",
							"12",
							"12",
							"12"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:G1");
					$(scope.appData.mailFilteredData).each(function (i, t) {
						if (!t.monthSum) {
							if (t.tooltip) {
								var tooltip = t.tooltip;
							}
							else {
								var tooltip = '';
							}

							var rows = {
								"cell": [
									{
										val: t.trans_date,
										type: "cellBolderRowsGroup"
									},
									{
										val: t.company_account_nickname,
										type: "cellBolderRowsGroup"
									},
									{
										val: t.CREDIT_CARD_NO.toString(),
										type: "cellBolderRowsGroup"
									},
									{
										val: getStringJson(tooltip),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.total_regular),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.total_payments),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.trans_total),
										type: "cellBolderRowsGroupBorderLeft"
									}
								]
							};
							data.rows.push(rows);

							var rows = {
								"cell": [
									{
										val: "תאריך",
										type: "cellBold"
									},
									{
										val: "תאור",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "סכום",
										type: "cellBold"
									},
									{
										val: "פרטים נוספים",
										type: "cellBold"
									},
									{
										val: "סכום עסקה",
										type: "cellBoldBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("B" + (data.rows.length) + ":D" + (data.rows.length));

							$(t.peulot_tab).each(function (i1, p) {
								$(p.peoulot).each(function (i1, d) {
									if (d.asmachta !== 'תשלום 0 מתוך 0' && d.asmachta !== 'none') {
										var asmachta = d.asmachta;
									}
									else {
										var asmachta = '';
									}
									if (d.searchObj == true) {
										var rows = {
											"cell": [
												{
													val: d.original_date,
													type: "cell"
												},
												{
													val: getStringJson(d.trans_name),
													type: "cell"
												},
												{
													val: "",
													type: "cell"
												},
												{
													val: "",
													type: "cell"
												},
												{
													val: getTotal(d.hozaa),
													type: "cell"
												},
												{
													val: asmachta,
													type: "cell"
												},
												{
													val: getTotal(d.original_total),
													type: "cellBorderLeft"
												}
											]
										};
										data.rows.push(rows);
										data.mergeCells.push("B" + (data.rows.length) + ":D" + (data.rows.length));
									}
								});
							});
						}

						if (t.monthSum == true) {
							var rows = {
								"cell": [
									{
										val: getDateMonth(t.trans_date.toString().split('/')[1]) + ' ' + t.trans_date.toString().split('/')[2] + " סה\"כ - ",
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroup"
									},
									{
										val: "",
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.sumN),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.sumP),
										type: "cellBolderRowsGroup"
									},
									{
										val: getTotal(t.sum),
										type: "cellBolderRowsGroupBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":D" + (data.rows.length));
						}
					});
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}


	function exportsPrintSlika() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {

				$(element).on('click', function () {
					var row = '<tbody>';
					$(scope.filteredDataAll).each(function (i, t) {
						if (!t.summary) {

							if (t.tooltip) {
								var tooltip = t.tooltip;
							}
							else {
								var tooltip = '&nbsp;';
							}

							if (t.zefiletazrim) {
								var zefiletazrim = scope.getTotal(t.zefiletazrim);
								var precent = scope.getPercent((t.trans_total / t.zefiletazrim) * 100) + '%';
							}
							else {
								var zefiletazrim = '&nbsp;';
								var precent = '&nbsp;';
							}

							row += '<tr>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + t.trans_date + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + scope.getAccountNum(t.company_account_id)[0] + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + tooltip + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + scope.getTotal(t.regular_payment_total) + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + scope.getTotal(t.payments_total) + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + scope.getTotal(t.trans_total) + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + zefiletazrim + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + precent + '</td>';
							row += '</tr>';
						}
						if (t.summary == 'days') {
							if (t.zefiletazrim) {
								var sumTazrim = '&#8362;' + scope.roundFixed(t.zefiletazrim);
							}
							else {
								var sumTazrim = '&nbsp;';
							}

							row += '<tr>';
							row += '<td style="background:#E0E0E0;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="3"> סה"כ - ' + t.id + '</td>';
							row += '<td style="background:#E0E0E0;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + scope.roundFixed(t.regular_payment_total) + '</td>';
							row += '<td style="background:#E0E0E0;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + scope.roundFixed(t.payments_total) + '</td>';
							row += '<td style="background:#E0E0E0;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + scope.roundFixed(t.trans_total) + '</td>';
							row += '<td style="background:#E0E0E0;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="2">' + sumTazrim + '</td>';
							row += '</tr>';
						}
						if (t.summary == 'month') {
							if (t.zefiletazrim) {
								var sumTazrim = '&#8362;' + scope.roundFixed(t.zefiletazrim);
							}
							else {
								var sumTazrim = '&nbsp;';
							}

							row += '<tr>';
							row += '<td style="background:#d2ebf2;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="3"> סה"כ - ' + t.id + '</td>';
							row += '<td style="background:#d2ebf2;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + scope.roundFixed(t.regular_payment_total) + '</td>';
							row += '<td style="background:#d2ebf2;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + scope.roundFixed(t.payments_total) + '</td>';
							row += '<td style="background:#d2ebf2;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">&#8362;' + scope.roundFixed(t.trans_total) + '</td>';
							row += '<td style="background:#d2ebf2;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;" colspan="2">' + sumTazrim + '</td>';
							row += '</tr>';
						}

					});
					row += '</tbody>';

					var headTable = '<thead><tr><th  style="background: rgb(221, 217, 196);margin: 0px 8px;font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">תאריך</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">ח-ן</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">    תיאור</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">   עסקאות רגילות</th><th style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;"> עסקאות תשלומים</th><th style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">סה״כ</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">  צפי לתזרים</th><th  style="color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">  אחוז מצפי</th></tr></thead>';

					var table = headTable + row;
					var name_doch = 'דו"ח סליקת אשראי- ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.selectedCompany.companyName + '</td>';

					var dataArr1 = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<table style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border: 1px solid #c6c6c6;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</table>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{@page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}} font-weight: 400;font-style: normal;}th{font: 11px esterebold, Arial; color: #000 !important;}td{font: 12px Arial;}tr{height: 17px;border-bottom: 1px solid #666;}</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}

	}

	function exportsExcelSlika() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = ' סליקת אשראי- ' + ' ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "תאריך",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "תיאור",
										"type": "header"
									},
									{
										"val": "עסקאות רגילות",
										"type": "header"
									},
									{
										"val": "עסקאות תשלומים",
										"type": "header"
									},
									{
										"val": "סה״כ",
										"type": "header"
									},
									{
										"val": "צפי לתזרים",
										"type": "header"
									},
									{
										"val": "אחוז מצפי",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"12",
							"12",
							"18",
							"12",
							"12",
							"12",
							"12"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:H1");


					$(scope.filteredDataAll).each(function (i, t) {
						if (!t.summary) {
							if (t.tooltip) {
								var tooltip = t.tooltip;
							}
							else {
								var tooltip = '';
							}

							if (t.zefiletazrim) {
								var zefiletazrim = scope.roundFixed(t.zefiletazrim);
								var precent = scope.getPercent((t.trans_total / t.zefiletazrim) * 100) + '%';
							}
							else {
								var zefiletazrim = '';
								var precent = '';
							}

							var rows = {
								"cell": [
									{
										val: t.trans_date,
										type: "cell"
									},
									{
										val: scope.getAccountNum(t.company_account_id)[0],
										type: "cell"
									},
									{
										val: getStringJson(tooltip),
										type: "cell"
									},
									{
										val: scope.roundFixed(t.regular_payment_total),
										type: "cell"
									},
									{
										val: scope.roundFixed(t.payments_total),
										type: "cell"
									},
									{
										val: scope.roundFixed(t.trans_total),
										type: "cell"
									},
									{
										val: zefiletazrim,
										type: "cell"
									},
									{
										val: precent,
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
						if (t.summary == 'days') {
							if (t.zefiletazrim) {
								var sumTazrim = scope.roundFixed(t.zefiletazrim);
							}
							else {
								var sumTazrim = '';
							}

							var rows = {
								"cell": [
									{
										val: "סה״כ - " + t.id,
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: scope.roundFixed(t.regular_payment_total),
										type: "cellBold"
									},
									{
										val: scope.roundFixed(t.payments_total),
										type: "cellBold"
									},
									{
										val: scope.roundFixed(t.trans_total),
										type: "cellBold"
									},
									{
										val: sumTazrim,
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":C" + (data.rows.length));
							data.mergeCells.push("G" + (data.rows.length) + ":H" + (data.rows.length));
						}
						if (t.summary == 'month') {
							if (t.zefiletazrim) {
								var sumTazrim = scope.roundFixed(t.zefiletazrim);
							}
							else {
								var sumTazrim = '';
							}

							var rows = {
								"cell": [
									{
										val: "סה״כ - " + t.id,
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.roundFixed(t.regular_payment_total),
										type: "cellBolder"
									},
									{
										val: scope.roundFixed(t.payments_total),
										type: "cellBolder"
									},
									{
										val: scope.roundFixed(t.trans_total),
										type: "cellBolder"
									},
									{
										val: sumTazrim,
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":C" + (data.rows.length));
							data.mergeCells.push("G" + (data.rows.length) + ":H" + (data.rows.length));
						}
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}

	}

	function exportsMailerSlika(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				//scope.$watch(function () {
				//	return $(element).val()
				//}, function (newVal, oldVal) {
				//	if (newVal != oldVal) {
				//		console.log(newVal);
				//	}
				//});
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = ' סליקת אשראי- ' + ' ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "תאריך",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "תיאור",
										"type": "header"
									},
									{
										"val": "עסקאות רגילות",
										"type": "header"
									},
									{
										"val": "עסקאות תשלומים",
										"type": "header"
									},
									{
										"val": "סה״כ",
										"type": "header"
									},
									{
										"val": "צפי לתזרים",
										"type": "header"
									},
									{
										"val": "אחוז מצפי",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"12",
							"12",
							"18",
							"12",
							"12",
							"12",
							"12"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:H1");

					$(scope.filteredDataAll).each(function (i, t) {
						if (!t.summary) {
							if (t.tooltip) {
								var tooltip = t.tooltip;
							}
							else {
								var tooltip = '';
							}

							if (t.zefiletazrim) {
								var zefiletazrim = scope.roundFixed(t.zefiletazrim);
								var precent = scope.getPercent((t.trans_total / t.zefiletazrim) * 100) + '%';
							}
							else {
								var zefiletazrim = '';
								var precent = '';
							}

							var rows = {
								"cell": [
									{
										val: t.trans_date,
										type: "cell"
									},
									{
										val: scope.getAccountNum(t.company_account_id)[0],
										type: "cell"
									},
									{
										val: getStringJson(tooltip),
										type: "cell"
									},
									{
										val: scope.roundFixed(t.regular_payment_total),
										type: "cell"
									},
									{
										val: scope.roundFixed(t.payments_total),
										type: "cell"
									},
									{
										val: scope.roundFixed(t.trans_total),
										type: "cell"
									},
									{
										val: zefiletazrim,
										type: "cell"
									},
									{
										val: precent,
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
						if (t.summary == 'days') {
							if (t.zefiletazrim) {
								var sumTazrim = scope.roundFixed(t.zefiletazrim);
							}
							else {
								var sumTazrim = '';
							}

							var rows = {
								"cell": [
									{
										val: "סה״כ - " + t.id,
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: scope.roundFixed(t.regular_payment_total),
										type: "cellBold"
									},
									{
										val: scope.roundFixed(t.payments_total),
										type: "cellBold"
									},
									{
										val: scope.roundFixed(t.trans_total),
										type: "cellBold"
									},
									{
										val: sumTazrim,
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":C" + (data.rows.length));
							data.mergeCells.push("G" + (data.rows.length) + ":H" + (data.rows.length));
						}
						if (t.summary == 'month') {
							if (t.zefiletazrim) {
								var sumTazrim = scope.roundFixed(t.zefiletazrim);
							}
							else {
								var sumTazrim = '';
							}

							var rows = {
								"cell": [
									{
										val: "סה״כ - " + t.id,
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.roundFixed(t.regular_payment_total),
										type: "cellBolder"
									},
									{
										val: scope.roundFixed(t.payments_total),
										type: "cellBolder"
									},
									{
										val: scope.roundFixed(t.trans_total),
										type: "cellBolder"
									},
									{
										val: sumTazrim,
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":C" + (data.rows.length));
							data.mergeCells.push("G" + (data.rows.length) + ":H" + (data.rows.length));
						}
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}


	function exportsPrintTazrim() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {

				$(element).on('click', function () {
					var row = '';
					var row1 = '';
					var row2 = '';
					var rownig = '';
					var rowPast = '';
					$(scope.appData.filterTazrim).each(function (i, a) {
						if (a.target_type_id == 18) {
							if (a.sign_type == 1 || a.sign_type == 11) {
								var tooltip = '↺';
							}
							else {
								var tooltip = '&nbsp';
							}
							if (a.hachnasa) {
								var hachnasa = '&#8362;' + scope.getTotal(a.hachnasa);
							}
							else {
								var hachnasa = '&nbsp';
							}
							if (a.hozaa) {
								var hozaa = '&#8362;' + scope.getTotal(a.hozaa);
							}
							else {
								var hozaa = '&nbsp';
							}

							if (scope.appData.selectedItem.company_account_id == 'null') {
								var itra = '&#8362;' + scope.round2Fixed(a.union_itra)
							}
							else {
								var itra = '&#8362;' + scope.round2Fixed(a.itra)
							}

							row += '<tr>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.day_id + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + tooltip + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + scope.loadNickNameBank(a.company_account_id) + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.searchkey_cat_name + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.trans_type_name + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.asmachta + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.trans_name + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;">' + hachnasa + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;">' + hozaa + '</td>';
							row += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;">' + itra + '</td>';
							row += '</tr>';


							rowPast = '<tr> <td colspan="9" style="background: #d3eaf1;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;"> פעולות עבר </td> </tr>';
						}
						if (a.ind_nigreret == true && a.target_type_id !== 18) {
							if (a.sign_type == 1 || a.sign_type == 11) {
								var tooltip = '↺';
							}
							else {
								var tooltip = '&nbsp';
							}
							if (a.hachnasa) {
								var hachnasa = '&#8362;' + scope.getTotal(a.hachnasa);
							}
							else {
								var hachnasa = '&nbsp';
							}
							if (a.hozaa) {
								var hozaa = '&#8362;' + scope.getTotal(a.hozaa);
							}
							else {
								var hozaa = '&nbsp';
							}
							var itra = '&nbsp';
							row1 += '<tr>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.day_id + '</td>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + tooltip + '</td>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + scope.loadNickNameBank(a.company_account_id) + '</td>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.searchkey_cat_name + '</td>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.trans_type_name + '</td>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.asmachta + '</td>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.trans_name + '</td>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;">' + hachnasa + '</td>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;">' + hozaa + '</td>';
							row1 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;">' + itra + '</td>';
							row1 += '</tr>';
							rownig = ' <tr> <td colspan="8" style="background: #d3eaf1;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">   פעולות שטרם הופקדו/נפרעו </td> <td colspan="1" style="background: #d3eaf1;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;border-left:1px solid #333333; ">&#8362;' + scope.getTotal(scope.calcSum) + '</td></tr>';
						}
						if (a.ind_nigreret == false && a.target_type_id !== 18) {

							if (a.sign_type == 1 || a.sign_type == 11) {
								var tooltip = '↺';
							}
							else {
								var tooltip = '&nbsp';
							}
							if (a.hachnasa) {
								var hachnasa = '&#8362;' + scope.getTotal(a.hachnasa);
							}
							else {
								var hachnasa = '&nbsp';
							}
							if (a.hozaa) {
								var hozaa = '&#8362;' + scope.getTotal(a.hozaa);
							}
							else {
								var hozaa = '&nbsp';
							}

							if (scope.appData.selectedItem.company_account_id == 'null') {
								var itra = '&#8362;' + scope.round2Fixed(a.union_itra)
							}
							else {
								var itra = '&#8362;' + scope.round2Fixed(a.itra)
							}

							row2 += '<tr>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.day_id + '</td>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + tooltip + '</td>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + scope.loadNickNameBank(a.company_account_id) + '</td>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.searchkey_cat_name + '</td>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.trans_type_name + '</td>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.asmachta + '</td>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">' + a.trans_name + '</td>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;">' + hachnasa + '</td>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;">' + hozaa + '</td>';
							row2 += '<td style="border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;">' + itra + '</td>';
							row2 += '</tr>';

						}

					});
					var tablesBody = '<tbody>' + row + rowPast + row1 + rownig + row2 + '</tbody>';

					var headTable = '<thead><tr><th  style="border-right: 1px solid #c6c6c6 !important;background: rgb(221, 217, 196);margin: 0px 8px;font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;border-top: 1px solid #c6c6c6 !important;">תאריך</th>' +
						'<th  style="border-top: 1px solid #c6c6c6 !important;color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">מחזורית</th>' +
						'<th  style="border-top: 1px solid #c6c6c6 !important;color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">    ח-ן</th>' +
						'<th  style="border-top: 1px solid #c6c6c6 !important;color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">סוג תשלום</th>' +
						'<th  style="border-top: 1px solid #c6c6c6 !important;color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">סוג פעולה</th>' +
						'<th style="border-top: 1px solid #c6c6c6 !important;color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;"> אסמכתא</th>' +
						'<th style="border-top: 1px solid #c6c6c6 !important;color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">תיאור</th><th  style="border-top: 1px solid #c6c6c6 !important;color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">  הכנסה</th><th  style="border-top: 1px solid #c6c6c6 !important;color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;">  הוצאה</th><th  style="border-top: 1px solid #c6c6c6 !important;color:#000;margin: 0px 8px;background: rgb(221, 217, 196); font-weight: bold; text-align: right;border-bottom: 1px solid #c6c6c6;border-left: 1px solid #c6c6c6 !important;">  יתרה</th></tr></thead>';

					var table = headTable + tablesBody;
					if (scope.appData.filterTazrim.length) {
						table += '<tr> ' +
							'<td colspan="7" style="background: #d3eaf1;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;">סה״כ</td>' +
							'<td colspan="1" style="background: #d3eaf1;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;"> ' + scope.appData.filterTazrimhacAll + '</td>' +
							'<td colspan="1" style="background: #d3eaf1;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;"> ' + scope.appData.filterTazrimhozAll + '</td>' +
							'<td colspan="1" style="background: #d3eaf1;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;direction: ltr;"> ' + scope.appData.filterTazrimcalcSum + '</td>' +
							'<td colspan="1" style="background: #d3eaf1;border-bottom: 1px solid #c6c6c6;margin: 0px 8px;"> &nbsp;</td>' +
							' </tr>';
					}

					var name_doch = 'דו״ח תזרים מפורט - ' + scope.appData.datesTazrimEx;
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="border:none;font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.selectedCompany.companyName + '</td>';

					var dataArr1 = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<table style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</table>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{@page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}} font-weight: 400;font-style: normal;}th{font: 11px esterebold, Arial; color: #000 !important;}td{font: 12px Arial;}td:last-child{border-right: 1px solid #c6c6c6;}td:first-child{border-right: 1px solid #c6c6c6;}tr{height: 17px;border-bottom: 1px solid #666;}</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, 1000);
				});
			}
		}

	}

	function exportsExcelTazrim() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = ' תזרים מפורט - ' + scope.appData.datesTazrimEx + ' ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBoldTitle",
										title: true
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitleBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "תאריך",
										"type": "header"
									},
									{
										"val": "מחזורית",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "סוג תשלום",
										"type": "header"
									},
									{
										"val": "סוג פעולה",
										"type": "header"
									},
									{
										"val": "אסמכתא",
										"type": "header"
									},
									{
										"val": "תיאור",
										"type": "header"
									},
									{
										"val": "הכנסה",
										"type": "header"
									},
									{
										"val": "הוצאה",
										"type": "header"
									},
									{
										"val": "יתרה",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellNum",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellNumGre",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellNumRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "8a8a8a",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftNum",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "8a8a8a",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeftNum",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "8a8a8a",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellBoldTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "8a8a8a",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 12,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 12,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [],
						heightRows: {},
						senderMail: []
					};
					data.mergeCells.push("A1:J1");
					data.heightRows["row" + 0] = "33";
					var rownig = '';
					var rowPast = '';
					$(scope.appData.filterTazrim).each(function (i, a) {
						if (a.target_type_id == 18) {
							if (a.sign_type == 1 || a.sign_type == 11) {
								var tooltip = '↺';
							}
							else {
								var tooltip = '';
							}
							if (a.hachnasa) {
								var hachnasa = scope.getTotal(a.hachnasa);
							}
							else {
								var hachnasa = '';
							}
							if (a.hozaa) {
								var hozaa = scope.getTotal(a.hozaa);
							}
							else {
								var hozaa = '';
							}

							if (scope.appData.selectedItem.company_account_id == 'null') {
								var itra = scope.round2Fixed(a.union_itra)
							}
							else {
								var itra = scope.round2Fixed(a.itra)
							}

							var rows = {
								"cell": [
									{
										val: (a.day_id) ? a.day_id : "",
										type: "cell"
									},
									{
										val: tooltip,
										type: "cell"
									},
									{
										val: scope.loadNickNameBank(a.company_account_id),
										type: "cell"
									},
									{
										val: getStringJson(a.searchkey_cat_name),
										type: "cell"
									},
									{
										val: getStringJson(a.trans_type_name),
										type: "cell"
									},
									{
										val: (a.asmachta) ? a.asmachta : "",
										type: "cell"
									},
									{
										val: getStringJson(a.trans_name),
										type: "cell"
									},
									{
										val: hachnasa.replace(/,/g, ''),
										type: "cellNumGre"
									},
									{
										val: hozaa.replace(/,/g, ''),
										type: "cellNumRed"
									},
									{
										val: itra.replace(/,/g, ''),
										type: "cellBorderLeftNum"
									}
								]
							};
							data.rows.push(rows);
							rowPast = "1";
						}
						if (a.ind_nigreret == true && a.target_type_id !== 18) {
							if (rowPast == "1") {
								rowPast = "";
								var rows = {
									"cell": [
										{
											val: "פעולות עבר",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBoldBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":J" + (data.rows.length));
							}
							if (a.sign_type == 1 || a.sign_type == 11) {
								var tooltip = '↺';
							}
							else {
								var tooltip = '';
							}
							if (a.hachnasa) {
								var hachnasa = scope.getTotal(a.hachnasa);
							}
							else {
								var hachnasa = '';
							}
							if (a.hozaa) {
								var hozaa = scope.getTotal(a.hozaa);
							}
							else {
								var hozaa = '';
							}
							var itra = '';
							var rows = {
								"cell": [
									{
										val: (a.day_id) ? a.day_id : "",
										type: "cell"
									},
									{
										val: tooltip,
										type: "cell"
									},
									{
										val: scope.loadNickNameBank(a.company_account_id),
										type: "cell"
									},
									{
										val: getStringJson(a.searchkey_cat_name),
										type: "cell"
									},
									{
										val: getStringJson(a.trans_type_name),
										type: "cell"
									},
									{
										val: (a.asmachta) ? a.asmachta : "",
										type: "cell"
									},
									{
										val: getStringJson(a.trans_name),
										type: "cell"
									},
									{
										val: hachnasa.replace(/,/g, ''),
										type: "cellNumGre"
									},
									{
										val: hozaa.replace(/,/g, ''),
										type: "cellNumRed"
									},
									{
										val: itra.replace(/,/g, ''),
										type: "cellBorderLeftNum"
									}
								]
							};
							data.rows.push(rows);
							rownig = "1";
						}
						if (a.ind_nigreret == false && a.target_type_id !== 18) {
							if (rowPast == "1") {
								rowPast = "";
								var rows = {
									"cell": [
										{
											val: "פעולות עבר",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBoldBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":J" + (data.rows.length));
							}
							if (rownig == "1") {
								rownig = "";
								var rows = {
									"cell": [
										{
											val: "פעולות שטרם הופקדו/נפרעו",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBoldBorderLeftNum"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":I" + (data.rows.length));
							}
							if (a.sign_type == 1 || a.sign_type == 11) {
								var tooltip = '↺';
							}
							else {
								var tooltip = '';
							}
							if (a.hachnasa) {
								var hachnasa = scope.getTotal(a.hachnasa);
							}
							else {
								var hachnasa = '';
							}
							if (a.hozaa) {
								var hozaa = scope.getTotal(a.hozaa);
							}
							else {
								var hozaa = '';
							}

							if (scope.appData.selectedItem.company_account_id == 'null') {
								var itra = scope.round2Fixed(a.union_itra)
							}
							else {
								var itra = scope.round2Fixed(a.itra)
							}

							var rows = {
								"cell": [
									{
										val: (a.day_id) ? a.day_id : "",
										type: "cell"
									},
									{
										val: tooltip,
										type: "cell"
									},
									{
										val: scope.loadNickNameBank(a.company_account_id),
										type: "cell"
									},
									{
										val: getStringJson(a.searchkey_cat_name),
										type: "cell"
									},
									{
										val: getStringJson(a.trans_type_name),
										type: "cell"
									},
									{
										val: (a.asmachta) ? a.asmachta : "",
										type: "cell"
									},
									{
										val: getStringJson(a.trans_name),
										type: "cell"
									},
									{
										val: hachnasa.replace(/,/g, ''),
										type: "cellNumGre"
									},
									{
										val: hozaa.replace(/,/g, ''),
										type: "cellNumRed"
									},
									{
										val: itra.replace(/,/g, ''),
										type: "cellBorderLeftNum"
									}
								]
							};
							data.rows.push(rows);
						}
					});
					if (scope.appData.filterTazrim.length) {
						var rows = {
							"cell": [
								{
									val: "סה״כ",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: scope.appData.filterTazrimhacAll,
									type: "cellNumGre"
								},
								{
									val: scope.appData.filterTazrimhozAll,
									type: "cellNumRed"
								},
								{
									val: (scope.appData.filterTazrimcalcSum !== 0 && !isNaN(scope.appData.filterTazrimcalcSum)) ? scope.appData.filterTazrimcalcSum : "",
									type: "cellBorderLeftNum"
								}
							]
						};
						data.rows.push(rows);
						data.mergeCells.push("A" + (data.rows.length) + ":G" + (data.rows.length));
					}

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}

	}

	function exportsMailerTazrim(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = ' תזרים מפורט - ' + scope.appData.datesTazrimEx + ' ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBoldTitle",
										title: true
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitle"
									},
									{
										val: "",
										type: "cellBoldTitleBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "תאריך",
										"type": "header"
									},
									{
										"val": "מחזורית",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "סוג תשלום",
										"type": "header"
									},
									{
										"val": "סוג פעולה",
										"type": "header"
									},
									{
										"val": "אסמכתא",
										"type": "header"
									},
									{
										"val": "תיאור",
										"type": "header"
									},
									{
										"val": "הכנסה",
										"type": "header"
									},
									{
										"val": "הוצאה",
										"type": "header"
									},
									{
										"val": "יתרה",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellNum",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellNumGre",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellNumRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "8a8a8a",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftNum",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "8a8a8a",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeftNum",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "8a8a8a",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellBoldTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "8a8a8a",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": true,
								"fontSize": 12,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "8a8a8a",
								"bold": false,
								"fontSize": 12,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [],
						heightRows: {},
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:J1");
					data.heightRows["row" + 0] = "33";
					var rownig = '';
					var rowPast = '';
					$(scope.appData.filterTazrim).each(function (i, a) {
						if (a.target_type_id == 18) {
							if (a.sign_type == 1 || a.sign_type == 11) {
								var tooltip = '↺';
							}
							else {
								var tooltip = '';
							}
							if (a.hachnasa) {
								var hachnasa = scope.getTotal(a.hachnasa);
							}
							else {
								var hachnasa = '';
							}
							if (a.hozaa) {
								var hozaa = scope.getTotal(a.hozaa);
							}
							else {
								var hozaa = '';
							}

							if (scope.appData.selectedItem.company_account_id == 'null') {
								var itra = scope.round2Fixed(a.union_itra)
							}
							else {
								var itra = scope.round2Fixed(a.itra)
							}

							var rows = {
								"cell": [
									{
										val: (a.day_id) ? a.day_id : "",
										type: "cell"
									},
									{
										val: tooltip,
										type: "cell"
									},
									{
										val: scope.loadNickNameBank(a.company_account_id),
										type: "cell"
									},
									{
										val: getStringJson(a.searchkey_cat_name),
										type: "cell"
									},
									{
										val: getStringJson(a.trans_type_name),
										type: "cell"
									},
									{
										val: (a.asmachta) ? a.asmachta : "",
										type: "cell"
									},
									{
										val: getStringJson(a.trans_name),
										type: "cell"
									},
									{
										val: hachnasa.replace(/,/g, ''),
										type: "cellNumGre"
									},
									{
										val: hozaa.replace(/,/g, ''),
										type: "cellNumRed"
									},
									{
										val: itra.replace(/,/g, ''),
										type: "cellBorderLeftNum"
									}
								]
							};
							data.rows.push(rows);
							rowPast = "1";
						}
						if (a.ind_nigreret == true && a.target_type_id !== 18) {
							if (rowPast == "1") {
								rowPast = "";
								var rows = {
									"cell": [
										{
											val: "פעולות עבר",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBoldBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":J" + (data.rows.length));
							}
							if (a.sign_type == 1 || a.sign_type == 11) {
								var tooltip = '↺';
							}
							else {
								var tooltip = '';
							}
							if (a.hachnasa) {
								var hachnasa = scope.getTotal(a.hachnasa);
							}
							else {
								var hachnasa = '';
							}
							if (a.hozaa) {
								var hozaa = scope.getTotal(a.hozaa);
							}
							else {
								var hozaa = '';
							}
							var itra = '';
							var rows = {
								"cell": [
									{
										val: (a.day_id) ? a.day_id : "",
										type: "cell"
									},
									{
										val: tooltip,
										type: "cell"
									},
									{
										val: scope.loadNickNameBank(a.company_account_id),
										type: "cell"
									},
									{
										val: getStringJson(a.searchkey_cat_name),
										type: "cell"
									},
									{
										val: getStringJson(a.trans_type_name),
										type: "cell"
									},
									{
										val: (a.asmachta) ? a.asmachta : "",
										type: "cell"
									},
									{
										val: getStringJson(a.trans_name),
										type: "cell"
									},
									{
										val: hachnasa.replace(/,/g, ''),
										type: "cellNumGre"
									},
									{
										val: hozaa.replace(/,/g, ''),
										type: "cellNumRed"
									},
									{
										val: itra.replace(/,/g, ''),
										type: "cellBorderLeftNum"
									}
								]
							};
							data.rows.push(rows);
							rownig = "1";
						}
						if (a.ind_nigreret == false && a.target_type_id !== 18) {
							if (rowPast == "1") {
								rowPast = "";
								var rows = {
									"cell": [
										{
											val: "פעולות עבר",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBoldBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":J" + (data.rows.length));
							}
							if (rownig == "1") {
								rownig = "";
								var rows = {
									"cell": [
										{
											val: "פעולות שטרם הופקדו/נפרעו",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: scope.getTotal(scope.calcSum).replace(/,/g, ''),
											type: "cellBoldBorderLeftNum"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":I" + (data.rows.length));
							}
							if (a.sign_type == 1 || a.sign_type == 11) {
								var tooltip = '↺';
							}
							else {
								var tooltip = '';
							}
							if (a.hachnasa) {
								var hachnasa = scope.getTotal(a.hachnasa);
							}
							else {
								var hachnasa = '';
							}
							if (a.hozaa) {
								var hozaa = scope.getTotal(a.hozaa);
							}
							else {
								var hozaa = '';
							}

							if (scope.appData.selectedItem.company_account_id == 'null') {
								var itra = scope.round2Fixed(a.union_itra)
							}
							else {
								var itra = scope.round2Fixed(a.itra)
							}

							var rows = {
								"cell": [
									{
										val: (a.day_id) ? a.day_id : "",
										type: "cell"
									},
									{
										val: tooltip,
										type: "cell"
									},
									{
										val: scope.loadNickNameBank(a.company_account_id),
										type: "cell"
									},
									{
										val: getStringJson(a.searchkey_cat_name),
										type: "cell"
									},
									{
										val: getStringJson(a.trans_type_name),
										type: "cell"
									},
									{
										val: (a.asmachta) ? a.asmachta : "",
										type: "cell"
									},
									{
										val: getStringJson(a.trans_name),
										type: "cell"
									},
									{
										val: hachnasa.replace(/,/g, ''),
										type: "cellNumGre"
									},
									{
										val: hozaa.replace(/,/g, ''),
										type: "cellNumRed"
									},
									{
										val: itra.replace(/,/g, ''),
										type: "cellBorderLeftNum"
									}
								]
							};
							data.rows.push(rows);
						}
					});
					if (scope.appData.filterTazrim.length) {
						var rows = {
							"cell": [
								{
									val: "סה״כ",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: scope.round2Fixed(scope.appData.filterTazrimhacAll),
									type: "cellNumGre"
								},
								{
									val: scope.round2Fixed(scope.appData.filterTazrimhozAll),
									type: "cellNumRed"
								},
								{
									val: (scope.appData.filterTazrimcalcSum !== 0 && !isNaN(scope.appData.filterTazrimcalcSum)) ? scope.appData.filterTazrimcalcSum : "",
									type: "cellBorderLeftNum"
								}
							]
						};
						data.rows.push(rows);
						data.mergeCells.push("A" + (data.rows.length) + ":G" + (data.rows.length));
					}

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}


	function exportsPrintAnalisis() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {

				$(element).on('click', function () {
					var table = '';
					table += '<tbody>';
					$(scope.appData.listAnalisis).each(function (i, a) {

						table += '<tr>';
						if (scope.appData.listAnalisis.length == 1) {
							table += '<td colspan="4" style="direction: rtl;text-align: right;padding: 0px 10px;border-bottom: 1px solid #d4d4d4;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #5a5e61;">' + scope.selectName + '</td>';
						}
						else {
							table += '<td colspan="4" style="direction: rtl;text-align: right;padding: 0px 10px;border-bottom: 1px solid #d4d4d4;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #5a5e61;">' + a.level_1.number + ' - ' + a.level_1.name + '</td>';
						}
						table += '<td style="direction: ltr;padding: 0px 10px;border-bottom: 1px solid #d4d4d4;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">' + scope.getTotal(a.level_1.sum) + '</td>';
						table += '<td style="padding: 0px 10px;border-bottom: 1px solid #d4d4d4;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #5a5e61;">' + a.level_1.percentage + '%' + '</td>';
						table += '</tr>';
						$(a.level_1.level_2).each(function (i, v) {
							table += '<tr>';
							table += '<td colspan="4" style="direction: rtl;text-align: right;border-top: 1px solid #c6c6c6;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 14px/30px arial;color: #5a5e61;">' + v.number + ' - ' + v.name + '</td>';
							table += '<td style="direction: ltr;border-top: 1px solid #c6c6c6;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 14px/30px arial;color: #1387a9;">' + scope.getTotal(v.sum) + '</td>';
							table += '<td style="border-top: 1px solid #c6c6c6;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: 14px/30px arial;color: #5a5e61;">' + v.percentage + '%' + '</td>';
							table += '</tr>';
						});
					});
					table += '</tbody>';

					var name_doch = 'דו״ח ניתוח הנהלת חשבונות -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.selectedCompany.companyName + '</td>';
					var dataArr1 = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<table style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border: 1px solid #c6c6c6;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</table>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{@page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}} font-weight: 400;font-style: normal;}th{font: 11px esterebold, Arial; color: #000 !important;}td{font: 12px Arial;}tr{height: 17px;border-bottom: 1px solid #666;}</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, 1000);

				});
			}
		}

	}

	function exportsExcelAnalisis() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {


					var name_doch = ' ניתוח הנהלת חשבונות - ' + ' ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"24",
							"12",
							"12"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:C1");

					$(scope.appData.listAnalisis).each(function (i, a) {
						if (scope.appData.listAnalisis.length == 1) {
							var rows = {
								"cell": [
									{
										val: getStringJson(scope.selectName),
										type: "cellBolder"
									},
									{
										val: scope.getTotal(a.level_1.sum),
										type: "cellBolder"
									},
									{
										val: a.level_1.percentage + '%',
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
						else {
							var rows = {
								"cell": [
									{
										val: getStringJson(a.level_1.number) + ' - ' + getStringJson(a.level_1.name),
										type: "cellBolder"
									},
									{
										val: scope.getTotal(a.level_1.sum),
										type: "cellBolder"
									},
									{
										val: a.level_1.percentage + '%',
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}

						$(a.level_1.level_2).each(function (i, v) {
							var rows = {
								"cell": [
									{
										val: getStringJson(v.number) + ' - ' + getStringJson(v.name),
										type: "cell"
									},
									{
										val: scope.getTotal(v.sum),
										type: "cell"
									},
									{
										val: v.percentage + '%',
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						});
					});


					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}

	}

	function exportsMailerAnalisis(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = ' ניתוח הנהלת חשבונות - ' + ' ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"24",
							"12",
							"12"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:C1");

					$(scope.appData.listAnalisis).each(function (i, a) {
						if (scope.appData.listAnalisis.length == 1) {
							var rows = {
								"cell": [
									{
										val: getStringJson(scope.selectName),
										type: "cellBolder"
									},
									{
										val: scope.getTotal(a.level_1.sum),
										type: "cellBolder"
									},
									{
										val: a.level_1.percentage + '%',
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
						else {
							var rows = {
								"cell": [
									{
										val: getStringJson(a.level_1.number) + ' - ' + getStringJson(a.level_1.name),
										type: "cellBolder"
									},
									{
										val: scope.getTotal(a.level_1.sum),
										type: "cellBolder"
									},
									{
										val: a.level_1.percentage + '%',
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}

						$(a.level_1.level_2).each(function (i, v) {
							var rows = {
								"cell": [
									{
										val: getStringJson(v.number) + ' - ' + getStringJson(v.name),
										type: "cell"
									},
									{
										val: scope.getTotal(v.sum),
										type: "cell"
									},
									{
										val: v.percentage + '%',
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						});
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}


	function exportsPrintTrial() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {

				$(element).on('click', function () {
					var table = '';
					$(scope.appData.trialBalance).each(function (i, a) {
						table += '<table style="border-top: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;font-family:arial;margin-bottom: 20px;">';
						table += '<thead><tr>';
						table += '<th style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;width:10%;direction: rtl;text-align: right;padding: 0px 10px;">מיון</th><th style="border-bottom: 1px solid #c6c6c6;width:10%;padding: 0px 10px;direction: rtl;text-align: right;">חשבון</th><th style="border-bottom: 1px solid #c6c6c6;width:20%;padding: 0px 10px;direction: rtl;text-align: right;">שם חשבון</th><th style="border-bottom: 1px solid #c6c6c6;width:10%;padding: 0px 10px;direction: rtl;text-align: right;">סיווג</th><th style="border-bottom: 1px solid #c6c6c6;width:10%;padding: 0px 10px;direction: rtl;text-align: right;">חובה</th><th style="border-bottom: 1px solid #c6c6c6;width:10%;padding: 0px 10px;direction: rtl;text-align: right;">זכות</th><th style="border-bottom: 1px solid #c6c6c6;width:10%;padding: 0px 10px;direction: rtl;text-align: right;border-left: 1px solid #c6c6c6;">הפרש</th>';
						table += '</tr></thead>';
						table += '<tbody><tr>';
						table += '<td colspan="4" style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: rtl;text-align: right;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">' + a.level_1.number + ' - ' + a.level_1.name + '</td>';
						table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">₪' + scope.round2Fixed(a.level_1.sum_over_scode_hova, true) + '</td>';
						table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">₪' + scope.round2Fixed(a.level_1.sum_over_scode_zchut) + '</td>';
						table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">₪' + scope.round2Fixed(a.level_1.sum) + '</td>';
						table += '</tr>';
						$(a.level_1.level_2).each(function (i, v) {

							if (v.sum > 0) {
								var hozaa = '&nbsp';
								var hachnasa = '₪' + scope.round2Fixed(v.sum);
							}
							else {
								var hachnasa = '&nbsp';
								var hozaa = '₪' + scope.round2Fixed(v.sum, true);
							}
							table += '<tr>';

							table += '<td style="border-left: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 14px/30px arial;">' + a.level_1.number + '</td>';

							table += '<td  style="border-bottom: 1px solid #c6c6c6;direction: rtl;text-align: right;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 14px/30px arial;">' + v.number + '</td>';


							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: rtl;text-align: right;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 14px/30px arial;">' + v.name + '</td>';


							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 14px/30px arial;">' + v.target_supp_desc + '</td>';


							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 14px/30px arial;">' + hozaa + '</td>';

							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 14px/30px arial;">' + hachnasa + '</td>';

							table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 14px/30px arial;">';

							if (v.alert_text) {
								table += '&#33;' + v.alert_text;
							}

							table += '&nbsp;</td>';

							table += '</tr>';
						});

						if (scope.appData.trialBalance[i + 1]) {

							if (scope.appData.trialBalance[i + 1].level_1.level0Digits) {
								table += '<tr>';

								table += '<td colspan="2" style="border-left: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">סה״כ לקבוצה</td>';
								table += '<td colspan="2" style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;text-align: right;">' + scope.appData.trialBalance[i + 1].level_1.level0Digits + '*</td>';
								table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.level0HovaSum, true) + '</td>';
								table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.level0ZhutSum) + '</td>';
								table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.level0Hefresh) + '</td>';

								table += '</tr>';

							}
							if (scope.appData.trialBalance[i + 1].level_1.prevLevelDigit) {
								table += '<tr>';

								table += '<td colspan="2" style="border-left: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">סה״כ לקבוצה</td>';

								table += '<td colspan="2" style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;text-align: right;">' + scope.appData.trialBalance[i + 1].level_1.prevLevelDigit + '**</td>';
								table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.prevLevelHovaSum, true) + '</td>';
								table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.prevLevelZhutSum) + '</td>';
								table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.prevLevelHefresh) + '</td>';

								table += '</tr>';

							}


							if (scope.appData.trialBalance[i + 1].level_1.nextLevelDigits) {
								table += '<tr>';

								table += '<td colspan="2" style="border-left: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">סה״כ לקבוצה</td>';

								table += '<td colspan="2" style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;text-align: right;">' + scope.appData.trialBalance[i + 1].level_1.nextLevelDigits + '*</td>';
								table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.nextLevelHovaSum, true) + '</td>';
								table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.nextLevelZhutSum) + '</td>';
								table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.nextLevelHefresh) + '</td>';

								table += '</tr>';

							}
						}


						if ((i + 1) == (scope.appData.trialBalance.length) && scope.appData.trialBalance[i].level0Digits) {
							table += '<tr>';

							table += '<td colspan="2" style="border-left: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">סה״כ לקבוצה</td>';

							table += '<td colspan="2" style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;text-align: right;">' + scope.appData.trialBalance[i].level0Digits + '*</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i].level0HovaSum, true) + '</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i].level0ZhutSum) + '</td>';
							table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i].level0Hefresh) + '</td>';

							table += '</tr>';

						}
						if ((i + 1) == (scope.appData.trialBalance.length) && scope.appData.trialBalance[i].prevLevelDigit) {
							table += '<tr>';
							table += '<td colspan="2" style="border-left: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">סה״כ לקבוצה</td>';

							table += '<td colspan="2" style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;text-align: right;">' + scope.appData.trialBalance[i].prevLevelDigit + '**</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i].prevLevelHovaSum, true) + '</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i].prevLevelZhutSum) + '</td>';
							table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i].prevLevelHefresh) + '</td>';

							table += '</tr>';

						}
						if ((i + 1) == (scope.appData.trialBalance.length) && scope.appData.trialBalance[i].nextLevelDigits) {
							table += '<tr>';

							table += '<td colspan="2" style="border-left: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">סה״כ לקבוצה</td>';

							table += '<td colspan="2" style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;text-align: right;">' + scope.appData.trialBalance[i].level_1.nextLevelDigits + '*</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i].nextLevelHovaSum, true) + '</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i].nextLevelZhutSum) + '</td>';
							table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;">₪' + scope.round2Fixed(scope.appData.trialBalance[i].nextLevelHefresh) + '</td>';

							table += '</tr>';

						}

						table += '</tbody>';
						table += '</table>';


					});
					table += '<table style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;margin-bottom: 40px;">';
					table += '<thead><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">&nbsp;</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">&nbsp;</th><th style="width:20%;direction: rtl;text-align: right;padding: 0px 10px;">&nbsp;</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">&nbsp;</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">חובה</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">זכות</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">הפרש</th></thead><tbody><tr>';
					table += '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td  style="direction: rtl;text-align: right;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 18px/30px arial;color: #1387a9;">  ₪' + scope.round2Fixed(scope.appData.trialBalance[scope.appData.trialBalance.length - 1].totalHova, true) + '</td>';
					table += '<td  style="direction: rtl;text-align: right;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 18px/30px arial;color: #1387a9;">  ₪' + scope.round2Fixed(scope.appData.trialBalance[scope.appData.trialBalance.length - 1].totalZhut) + '</td>';
					table += '<td  style="direction: rtl;text-align: right;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 18px/30px arial;color: #1387a9;">  ₪' + scope.round2Fixed(scope.appData.trialBalance[scope.appData.trialBalance.length - 1].totalHefresh) + '</td>';

					table += '</tr></tbody></table>';

					var name_doch = 'דו״ח מאזן בוחן -' + scope.appData.datesSelectBalance + ' - ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.selectedCompany.companyName + '</td>';
					var dataArr1 = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{@page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}} font-weight: 400;font-style: normal;}</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, 1000);

				});
			}
		}

	}

	function exportsExcelTrial() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = ' מאזן בוחן -' + scope.appData.datesSelectBalance + ' - ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "1387a9",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "f9f9f9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "1387a9",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "f9f9f9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"30",
							"12",
							"24",
							"22",
							"12",
							"12",
							"12"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:G1");

					$(scope.appData.trialBalance).each(function (i, a) {
						var rows = {
							"cell": [
								{
									"val": "מיון",
									"type": "header"
								},
								{
									"val": "חשבון",
									"type": "header"
								},
								{
									"val": "שם חשבון",
									"type": "header"
								},
								{
									"val": "סיווג",
									"type": "header"
								},
								{
									"val": "חובה",
									"type": "header"
								},
								{
									"val": "זכות",
									"type": "header"
								},
								{
									"val": "הפרש",
									"type": "header"
								}
							]
						}
						data.rows.push(rows);
						var rows = {
							"cell": [
								{
									val: a.level_1.number + ' - ' + getStringJson(a.level_1.name),
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: scope.round2Fixed(a.level_1.sum_over_scode_hova, true),
									type: "cell"
								},
								{
									val: scope.round2Fixed(a.level_1.sum_over_scode_zchut),
									type: "cell"
								},
								{
									val: scope.round2Fixed(a.level_1.sum),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
						data.mergeCells.push("A" + (data.rows.length) + ":D" + (data.rows.length));

						$(a.level_1.level_2).each(function (i, v) {
							var hozaa = '', hachnasa = '';
							if (v.sum > 0) {
								hachnasa = scope.round2Fixed(v.sum);
							}
							else {
								hozaa = scope.round2Fixed(v.sum, true);
							}
							var rows = {
								"cell": [
									{
										val: a.level_1.number,
										type: "cellBold"
									},
									{
										val: v.number,
										type: "cellBold"
									},
									{
										val: v.name,
										type: "cellBold"
									},
									{
										val: getStringJson(v.target_supp_desc),
										type: "cellBold"
									},
									{
										val: hozaa,
										type: "cellBold"
									},
									{
										val: hachnasa,
										type: "cellBold"
									},
									{
										val: (v.alert_text) ? '&#33;' + getStringJson(v.alert_text) : "",
										type: "cellBoldBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						});

						if (scope.appData.trialBalance[i + 1]) {
							if (scope.appData.trialBalance[i + 1].level_1.level0Digits) {
								var rows = {
									"cell": [
										{
											val: "סה״כ לקבוצה",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.appData.trialBalance[i + 1].level_1.level0Digits + "*",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.level0HovaSum, true),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.level0ZhutSum),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.level0Hefresh),
											type: "cellBolderBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
								data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
							}
							if (scope.appData.trialBalance[i + 1].level_1.prevLevelDigit) {
								var rows = {
									"cell": [
										{
											val: "סה״כ לקבוצה",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.appData.trialBalance[i + 1].level_1.prevLevelDigit + "**",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.prevLevelHovaSum, true),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.prevLevelZhutSum),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.prevLevelHefresh),
											type: "cellBolderBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
								data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
							}
							if (scope.appData.trialBalance[i + 1].level_1.nextLevelDigits) {
								var rows = {
									"cell": [
										{
											val: "סה״כ לקבוצה",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.appData.trialBalance[i + 1].level_1.nextLevelDigits + "*",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.nextLevelHovaSum, true),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.nextLevelZhutSum),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.nextLevelHefresh),
											type: "cellBolderBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
								data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
							}
						}

						if ((i + 1) == (scope.appData.trialBalance.length) && scope.appData.trialBalance[i].level0Digits) {
							var rows = {
								"cell": [
									{
										val: "סה״כ לקבוצה",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.appData.trialBalance[i].level0Digits + "*",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].level0HovaSum, true),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].level_1.level0ZhutSum),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].level0Hefresh),
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
							data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));

						}
						if ((i + 1) == (scope.appData.trialBalance.length) && scope.appData.trialBalance[i].prevLevelDigit) {
							var rows = {
								"cell": [
									{
										val: "סה״כ לקבוצה",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.appData.trialBalance[i].prevLevelDigit + "**",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].prevLevelHovaSum, true),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].prevLevelZhutSum),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].prevLevelHefresh),
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
							data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
						}
						if ((i + 1) == (scope.appData.trialBalance.length) && scope.appData.trialBalance[i].nextLevelDigits) {
							var rows = {
								"cell": [
									{
										val: "סה״כ לקבוצה",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.appData.trialBalance[i].nextLevelDigits + "*",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].nextLevelHovaSum, true),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].nextLevelZhutSum),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].nextLevelHefresh),
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
							data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
						}

						var rows = {
							"cell": [
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBoldBorderLeft"
								}
							]
						};
						data.rows.push(rows);
						data.mergeCells.push("A" + (data.rows.length) + ":G" + (data.rows.length));
					});
					var rows = {
						"cell": [
							{
								val: "חובה: " + scope.round2Fixed(scope.appData.trialBalance[scope.appData.trialBalance.length - 1].totalHova, true),
								type: "cellBold"
							},
							{
								val: "",
								type: "cellBold"
							},
							{
								val: "",
								type: "cellBold"
							},
							{
								val: "",
								type: "cellBold"
							},
							{
								val: "זכות: " + scope.round2Fixed(scope.appData.trialBalance[scope.appData.trialBalance.length - 1].totalZhut),
								type: "cellBold"
							},
							{
								val: "הפרש: " + scope.round2Fixed(scope.appData.trialBalance[scope.appData.trialBalance.length - 1].totalHefresh),
								type: "cellBold"
							},
							{
								val: "",
								type: "cellBoldBorderLeft"
							}
						]
					};
					data.rows.push(rows);
					data.mergeCells.push("A" + (data.rows.length) + ":D" + (data.rows.length));
					data.mergeCells.push("F" + (data.rows.length) + ":G" + (data.rows.length));

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}

	}

	function exportsMailerTrial(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = ' מאזן בוחן -' + scope.appData.datesSelectBalance + ' - ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "1387a9",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "f9f9f9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "1387a9",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "f9f9f9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"30",
							"12",
							"24",
							"22",
							"12",
							"12",
							"12"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:G1");

					$(scope.appData.trialBalance).each(function (i, a) {
						var rows = {
							"cell": [
								{
									"val": "מיון",
									"type": "header"
								},
								{
									"val": "חשבון",
									"type": "header"
								},
								{
									"val": "שם חשבון",
									"type": "header"
								},
								{
									"val": "סיווג",
									"type": "header"
								},
								{
									"val": "חובה",
									"type": "header"
								},
								{
									"val": "זכות",
									"type": "header"
								},
								{
									"val": "הפרש",
									"type": "header"
								}
							]
						}
						data.rows.push(rows);
						var rows = {
							"cell": [
								{
									val: a.level_1.number + ' - ' + a.level_1.name,
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: "",
									type: "cell"
								},
								{
									val: scope.round2Fixed(a.level_1.sum_over_scode_hova, true),
									type: "cell"
								},
								{
									val: scope.round2Fixed(a.level_1.sum_over_scode_zchut),
									type: "cell"
								},
								{
									val: scope.round2Fixed(a.level_1.sum),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
						data.mergeCells.push("A" + (data.rows.length) + ":D" + (data.rows.length));

						$(a.level_1.level_2).each(function (i, v) {
							var hozaa = '', hachnasa = '';
							if (v.sum > 0) {
								hachnasa = scope.round2Fixed(v.sum);
							}
							else {
								hozaa = scope.round2Fixed(v.sum, true);
							}
							var rows = {
								"cell": [
									{
										val: a.level_1.number,
										type: "cellBold"
									},
									{
										val: v.number,
										type: "cellBold"
									},
									{
										val: v.name,
										type: "cellBold"
									},
									{
										val: getStringJson(v.target_supp_desc),
										type: "cellBold"
									},
									{
										val: hozaa,
										type: "cellBold"
									},
									{
										val: hachnasa,
										type: "cellBold"
									},
									{
										val: (v.alert_text) ? '&#33;' + getStringJson(v.alert_text) : "",
										type: "cellBoldBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						});

						if (scope.appData.trialBalance[i + 1]) {
							if (scope.appData.trialBalance[i + 1].level_1.level0Digits) {
								var rows = {
									"cell": [
										{
											val: "סה״כ לקבוצה",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.appData.trialBalance[i + 1].level_1.level0Digits + "*",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.level0HovaSum, true),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.level0ZhutSum),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.level0Hefresh),
											type: "cellBolderBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
								data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
							}
							if (scope.appData.trialBalance[i + 1].level_1.prevLevelDigit) {
								var rows = {
									"cell": [
										{
											val: "סה״כ לקבוצה",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.appData.trialBalance[i + 1].level_1.prevLevelDigit + "**",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.prevLevelHovaSum, true),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.prevLevelZhutSum),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.prevLevelHefresh),
											type: "cellBolderBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
								data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
							}
							if (scope.appData.trialBalance[i + 1].level_1.nextLevelDigits) {
								var rows = {
									"cell": [
										{
											val: "סה״כ לקבוצה",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.appData.trialBalance[i + 1].level_1.nextLevelDigits + "*",
											type: "cellBolder"
										},
										{
											val: "",
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.nextLevelHovaSum, true),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.nextLevelZhutSum),
											type: "cellBolder"
										},
										{
											val: scope.round2Fixed(scope.appData.trialBalance[i + 1].level_1.nextLevelHefresh),
											type: "cellBolderBorderLeft"
										}
									]
								};
								data.rows.push(rows);
								data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
								data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
							}
						}

						if ((i + 1) == (scope.appData.trialBalance.length) && scope.appData.trialBalance[i].level0Digits) {
							var rows = {
								"cell": [
									{
										val: "סה״כ לקבוצה",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.appData.trialBalance[i].level0Digits + "*",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].level0HovaSum, true),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].level_1.level0ZhutSum),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].level0Hefresh),
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
							data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));

						}
						if ((i + 1) == (scope.appData.trialBalance.length) && scope.appData.trialBalance[i].prevLevelDigit) {
							var rows = {
								"cell": [
									{
										val: "סה״כ לקבוצה",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.appData.trialBalance[i].prevLevelDigit + "**",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].prevLevelHovaSum, true),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].prevLevelZhutSum),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].prevLevelHefresh),
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
							data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
						}
						if ((i + 1) == (scope.appData.trialBalance.length) && scope.appData.trialBalance[i].nextLevelDigits) {
							var rows = {
								"cell": [
									{
										val: "סה״כ לקבוצה",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.appData.trialBalance[i].nextLevelDigits + "*",
										type: "cellBolder"
									},
									{
										val: "",
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].nextLevelHovaSum, true),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].nextLevelZhutSum),
										type: "cellBolder"
									},
									{
										val: scope.round2Fixed(scope.appData.trialBalance[i].nextLevelHefresh),
										type: "cellBolderBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + (data.rows.length) + ":B" + (data.rows.length));
							data.mergeCells.push("C" + (data.rows.length) + ":D" + (data.rows.length));
						}

						var rows = {
							"cell": [
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBold"
								},
								{
									val: "",
									type: "cellBoldBorderLeft"
								}
							]
						};
						data.rows.push(rows);
						data.mergeCells.push("A" + (data.rows.length) + ":G" + (data.rows.length));
					});
					var rows = {
						"cell": [
							{
								val: "חובה: " + scope.round2Fixed(scope.appData.trialBalance[scope.appData.trialBalance.length - 1].totalHova, true),
								type: "cellBold"
							},
							{
								val: "",
								type: "cellBold"
							},
							{
								val: "",
								type: "cellBold"
							},
							{
								val: "",
								type: "cellBold"
							},
							{
								val: "זכות: " + scope.round2Fixed(scope.appData.trialBalance[scope.appData.trialBalance.length - 1].totalZhut),
								type: "cellBold"
							},
							{
								val: "הפרש: " + scope.round2Fixed(scope.appData.trialBalance[scope.appData.trialBalance.length - 1].totalHefresh),
								type: "cellBold"
							},
							{
								val: "",
								type: "cellBoldBorderLeft"
							}
						]
					};
					data.rows.push(rows);
					data.mergeCells.push("A" + (data.rows.length) + ":D" + (data.rows.length));
					data.mergeCells.push("F" + (data.rows.length) + ":G" + (data.rows.length));
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}


	function exportsExcelHashPage() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '<table style="border-top: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;font-family:arial;margin-bottom: 40px;">';
					table += '<thead><tr>';
					table += '<th style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;width:10%;direction: rtl;text-align: right;padding: 0px 10px;">פעולות קיימות בחשבשבת </th>';
					table += '<th style="border-bottom: 1px solid #c6c6c6;width:10%;padding: 0px 10px;direction: rtl;text-align: right;border-right: 1px solid #c6c6c6;">פעולות קיימות בביזיבוקס </th>';
					table += '</tr></thead>';
					table += '<tbody><tr>';
					table += '<td><table>';
					$(scope.appData.resBankPageFullCheck.peulot).each(function (i, a) {
						if (a.data_source == 'BP') {
							table += '<tr><td style="border-left: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: rtl;text-align: right;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">' + a.trans_date + '</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;"> | ' + a.trans_desc + '</td>';
							table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">₪' + scope.roundFixed(a.total) + '</td></tr>';
						}
					});
					table += '</table></td>';


					table += '<td><table>';
					$(scope.appData.resBankPageFullCheck.peulot).each(function (i, a) {
						if (a.data_source == 'BT') {
							table += '<tr><td style="border-left: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: rtl;text-align: right;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">' + a.trans_date.toString() + '</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;"> | ' + a.trans_desc + '</td>';
							table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">₪' + scope.roundFixed(a.total) + '</td></tr>';
						}
					});
					table += '</table></td>';

					table += '</tr></tbody></table>';

					var name_doch = 'דו״ח ייצוא דפי בנק -' + scope.appData.dataCompanyNmaeApply;
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + '</td>';

					var excel = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div style="font-size:20px; font-family: arial;font-weight:bold; text-align:right;color:#666;">' + title + '</div>' + '<table style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</table>' + '</body></html>';
					$('#ReportTableData').remove();

					$('body').prepend("<form method='post' action='https://php.bizibox.biz/exporttoexcel.php' style='display:block' id='ReportTableData'><textarea name='tableData'>" + excel + "</textarea></form>");

					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}

	}

	function exportsExcelHashPageCards() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '<table style="border-top: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;font-family:arial;margin-bottom: 40px;">';
					table += '<thead><tr>';
					table += '<th style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;width:10%;direction: rtl;text-align: right;padding: 0px 10px;">פעולות קיימות בחשבשבת </th>';
					table += '<th style="border-bottom: 1px solid #c6c6c6;width:10%;padding: 0px 10px;direction: rtl;text-align: right;border-right: 1px solid #c6c6c6;">פעולות קיימות בביזיבוקס </th>';
					table += '</tr></thead>';
					table += '<tbody><tr>';
					table += '<td><table>';
					$(scope.appData.resBankPageFullCheck.transactions).each(function (i, a) {
						if (a.data_source == 'JT') {
							table += '<tr><td style="border-left: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: rtl;text-align: right;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">' + a.trans_date + '</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;"> | ' + a.trans_desc + '</td>';
							table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">₪' + scope.roundFixed(a.total) + '</td></tr>';
						}
					});
					table += '</table></td>';


					table += '<td><table>';
					$(scope.appData.resBankPageFullCheck.transactions).each(function (i, a) {
						if (a.data_source == 'CC') {
							table += '<tr><td style="border-left: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: rtl;text-align: right;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">' + a.trans_date.toString() + '</td>';
							table += '<td style="border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;"> | ' + a.trans_desc + '</td>';
							table += '<td style="border-right: 1px solid #c6c6c6;border-bottom: 1px solid #c6c6c6;direction: ltr;padding: 0px 10px;background: #fff;line-height: 37px;height: 37px;vertical-align: middle;font: bold 14px/37px arial;color: #1387a9;">₪' + scope.roundFixed(a.total) + '</td></tr>';
						}
					});
					table += '</table></td>';

					table += '</tr></tbody></table>';

					var name_doch = 'דו״ח בדיקת נתונים לכרטיס ' + scope.appData.uuidRowApply.izu_cast_id;
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + '</td>';

					var excel = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div style="font-size:20px; font-family: arial;font-weight:bold; text-align:right;color:#666;">' + title + '</div>' + '<table style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</table>' + '</body></html>';
					$('#ReportTableData').remove();

					$('body').prepend("<form method='post' action='https://php.bizibox.biz/exporttoexcel.php' style='display:block' id='ReportTableData'><textarea name='tableData'>" + excel + "</textarea></form>");

					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}

	}


	function exportsExcelCompanys() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'דו״ח רשימת חברות - ';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": ".ח.פ./ע.מ",
										"type": "header"
									},
									{
										"val": "סוג תוכנת רו\"ח",
										"type": "header"
									},
									{
										"val": "סוג עסק",
										"type": "header"
									},
									{
										"val": "איש קשר",
										"type": "header"
									},
									{
										"val": "טלפון",
										"type": "header"
									},
									{
										"val": "דוא\"ל",
										"type": "header"
									},
									{
										"val": "הזנה אחרונה",
										"type": "header"
									},
									{
										"val": "-  מסמכים",
										"type": "header"
									},
									{
										"val": "ממוצע חודשי",
										"type": "header"
									},
									{
										"val": "שמות אנשי המשרד",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"12",
							"18",
							"12",
							"12",
							"12",
							"12",
							"12",
							"12",
							"12",
							"20"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:H1");
					scope.appData.companysList.forEach(function (x) {
						var userCon = $(x.user_details).map(function (i1, v1) {
							return v1.acc_user_full_name;
						}).get().join(', ');
						var sum_inv_cur_mon = '';
						if (x.sum_inv_cur_mon !== 0) {
							sum_inv_cur_mon = '| ' + x.sum_inv_cur_mon + ' מסמכים ';
						}
						var phone_number = '';

						if (x.phone_number !== null) {
							phone_number = x.phone_number;
						}

						var last_inv_date = "";
						var last_inv_date_sum = "";
						if (x.last_inv_date) {
							last_inv_date = x.last_inv_date;
							last_inv_date_sum = sum_inv_cur_mon;
						}
						var rows = {
							"cell": [
								{
									val: getStringJson(x.companyName),
									type: "cell"
								},
								{
									val: x.companyHp,
									type: "cell"
								},
								{
									val: scope.accoConversions.getSourceProgramId(x.source_program_id),
									type: "cell"
								},
								{
									val: scope.accoConversions.getEsderMaam(x.esder_maam),
									type: "cell"
								},
								{
									val: getStringJson(x.full_name),
									type: "cell"
								},
								{
									val: phone_number,
									type: "cell"
								},
								{
									val: getStringJson(x.mail),
									type: "cell"
								},
								{
									val: last_inv_date,
									type: "cell"
								},
								{
									val: last_inv_date_sum,
									type: "cell"
								},
								{
									val: x.sum_inv_avg + ' מסמכים',
									type: "cell"
								},
								{
									val: getStringJson(userCon),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});


					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}


	function exportsPrintRevah() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var lengthArr = scope.appData.revahHefsed.dates.length + 2;
					var indPrec = 1;
					if (scope.appData.valueRadio !== 'radio1') {
						lengthArr = (scope.appData.revahHefsed.dates.length * 2) + 3;
						indPrec = 2;
					}

					var table = '';
					table += '<table style="direction:rtl; text-align:right; "><thead><tr style="color: #fff;font: bold 12px arial;font-style: italic;">';
					table += '<th style="background:rgb(40,94,160)">תאור</th>';
					table += '<th colspan="' + indPrec + '" style="background:rgb(40,94,160)">סה״כ</th>';

					$(scope.appData.revahHefsed.dates).each(function (i, a) {
						var styles = '', stylePre = '';
						if (i == scope.appData.revahHefsed.dates.length - 1) {
							if (scope.appData.valueRadio == 'radio1') {
								styles = 'border-left:1px solid #ddd;'
							}
							else {
								stylePre = 'border-left:1px solid #ddd;'
							}
						}
						table += '<th colspan="' + indPrec + '" style="background:rgb(40,94,160)">' + scope.accoConversions.getDayMonthNum(a) + '</th>';
					});
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.revahHefsed.data).each(function (i, val) {
						if (scope.appData.valueRadioPrev == 'yes' && i % 2 !== 0 || i % 2 == 0) {
							if (i % 2 == 0) { // even
								table += '<tr><td style="text-align: right; text-decoration: underline; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom;">' + val.title + '</td></tr>';
								if (val.rowsAsList && val.rowsAsList.length > 0) {
									if (scope.appData.valueRadioPrint == 'level3' || scope.appData.valueRadioPrint == 'level2') {
										$(val.rowsAsList).each(function (index, a) {
											if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !a.rowZero)) {
												table += '<tr><td style="text-align: right; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); font-weight: bold;">' + a.title + '</td>';

												if (a.data && a.data.length > 0) {
													$(a.data).each(function (index, b) {
														if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !b.rowZero)) {
															var styles = '', stylePre = '';
															if (index == a.data.length - 1) {
																if (scope.appData.valueRadio == 'radio1') {
																	styles = 'border-left:1px solid #ddd;'
																}
																else {
																	stylePre = 'border-left:1px solid #ddd;'
																}
															}

															table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + scope.roundFixed(b.sum) + '</td>';

															if (scope.appData.valueRadio == 'radio2') {
																var numChange = b.numChange;
																if (b.numChange == null) {
																	numChange = 0;
																}
																table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); font-weight: bold;">' + numChange + '%</td>';
															}
															if (scope.appData.valueRadio == 'radio3') {
																var hacnasotCurrPrcVal = b.hacnasotCurrPrcVal;
																if (b.hacnasotCurrPrcVal == null) {
																	hacnasotCurrPrcVal = 0;
																}
																table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); font-weight: bold;">' + hacnasotCurrPrcVal + '%</td>';
															}
														}

													});
												}
												table += '</tr>';

												if (a.rowsAsList && a.rowsAsList.length > 0) {
													if (scope.appData.valueRadioPrint == 'level3') {

														$(a.rowsAsList).each(function (index, b) {
															if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !b.rowZero)) {

																table += '<tr><td style="text-align: right; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205);">' + b.title + '</td>';
																if (b.data && b.data.length > 0) {
																	$(b.data).each(function (index, c) {
																		var styles = '', stylePre = '';
																		if (index == b.data.length - 1) {
																			if (scope.appData.valueRadio == 'radio1') {
																				styles = 'border-left:1px solid #ddd;'
																			}
																			else {
																				stylePre = 'border-left:1px solid #ddd;'
																			}
																		}

																		table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">' + scope.roundFixed(c.sum) + '</td>';

																		if (scope.appData.valueRadio == 'radio2') {
																			var numChange = c.numChange;
																			if (c.numChange == null) {
																				numChange = 0;
																			}
																			table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">' + numChange + '%</td>';
																		}
																		if (scope.appData.valueRadio == 'radio3') {
																			var hacnasotCurrPrcVal = c.hacnasotCurrPrcVal;
																			if (c.hacnasotCurrPrcVal == null) {
																				hacnasotCurrPrcVal = 0;
																			}
																			table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">' + hacnasotCurrPrcVal + '%</td>';
																		}
																	});
																}
																table += '</tr>';
															}
														})

													}
												}
											}
										})
									}
								}
							}


							table += '<tr>';
							if (i % 2 !== 0) { // odd
								table += '<td style="text-align: right; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(198, 217, 240);">סה"כ ' + val.title;
								table += ' אשתקד';
								table += '</td>'
								if (val.smallData && val.smallData.length > 0) {
									$(val.smallData).each(function (index, a) {
										table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); background: rgb(198, 217, 240);">' + scope.roundFixed(a.sum) + '</td>';
										if (scope.appData.valueRadio == 'radio2') {
											table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(198, 217, 240);">&nbsp;</td>';
										}
										if (scope.appData.valueRadio == 'radio3') {
											var hacnasotCurrPrcVal = a.hacnasotCurrPrcVal;
											if (a.hacnasotCurrPrcVal == null) {
												hacnasotCurrPrcVal = 0;
											}
											table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(198, 217, 240);">' + hacnasotCurrPrcVal + '%</td>';
										}
									});
								}
								table += '</tr>';
							}
							else {
								table += '<td style="text-align: right; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(216, 216, 216);">סה"כ ' + val.title;
								table += '</td>';

								if (val.data && val.data.length > 0) {
									$(val.data).each(function (index, a) {
										if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !a.rowZero)) {
											table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); background: rgb(216, 216, 216);">' + scope.roundFixed(a.sum) + '</td>';

											if (scope.appData.valueRadio == 'radio2') {
												var numChange = a.numChange;
												if (a.numChange == null) {
													numChange = 0;
												}
												table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(216, 216, 216);">' + numChange + '%</td>';
											}
											if (scope.appData.valueRadio == 'radio3') {
												var hacnasotCurrPrcVal = a.hacnasotCurrPrcVal;
												if (a.hacnasotCurrPrcVal == null) {
													hacnasotCurrPrcVal = 0;
												}
												table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(216, 216, 216);">' + hacnasotCurrPrcVal + '%</td>';
											}
										}
									});
								}
								table += '</tr>';
							}
						}
					});
					table += '</tbody></table>';


					var textSum = 'הפסד';
					if (scope.appData.revahHefsed.summary.sum >= 0) {
						textSum = 'רווח';
					}
					var textSumPrev = 'הפסד';
					if (scope.appData.revahHefsed.summary.prevNum >= 0) {
						textSumPrev = 'רווח';
					}

					table += '<table style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;margin-bottom: 40px;">';
					table += '<thead><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">&nbsp;</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">&nbsp;</th><th style="width:20%;direction: rtl;text-align: right;padding: 0px 10px;">&nbsp;</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">&nbsp;</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;"> סה"כ ' + textSum + ' לדו"ח</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">' + textSumPrev + ' אשתקד</th><th style="width:10%;direction: rtl;text-align: right;padding: 0px 10px;">אחוז שינוי</th></thead><tbody><tr>';
					table += '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td  style="direction: rtl;text-align: right;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 18px/30px arial;color: #1387a9;">  ₪' + scope.roundFixed(scope.appData.revahHefsed.summary.sum) + '</td>';
					table += '<td  style="direction: rtl;text-align: right;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 18px/30px arial;color: #1387a9;">  ₪' + scope.roundFixed(scope.appData.revahHefsed.summary.prevNum) + '</td>';

					if (scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 2].data[0].hacnasotCurrPrcVal !== null) {
						table += '<td  style="direction: rtl;text-align: right;padding: 0px 10px;background: #f9f9f9;line-height: 30px;height: 30px;vertical-align: middle;font: bold 18px/30px arial;color: #1387a9;"> ' + scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 2].data[0].hacnasotCurrPrcVal + '%</td>';
					}

					table += '</tr></tbody></table>';

					var name_doch = 'דו״ח רווח והפסד -' + scope.appData.datesSelectReport + ' - ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.selectedCompany.companyName + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));
					scope.hidePopup();
				});
			}
		}

	}

	function exportsExcelRevah() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'דו״ח רווח והפסד -' + scope.appData.datesSelectReport + ' - ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "285ea0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": true,
								"typesCellNumber": false
							},
							{
								"type": "titleUnderline",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"fontUnderline": true,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBoldTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldSmall",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldSmallLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": false,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": false,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmall",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},


							{
								"type": "cellBoldGrayTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldGray",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldGrayLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallBoldGray",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallBoldGrayLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},


							{
								"type": "cellBoldBlueTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBlue",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBlueLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallBoldBlue",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallBoldBlueLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20"
						],
						senderMail: []
					};

					var lengthArr = scope.appData.revahHefsed.dates.length + 2;
					var indPrec = 1;
					if (scope.appData.valueRadio !== 'radio1') {
						lengthArr = (scope.appData.revahHefsed.dates.length * 2) + 3;
						indPrec = 2;
					}
					// var table = '';
					// table += '<table style="direction:rtl; text-align:right; "><thead><tr style="color: #fff;font: bold 12px arial;font-style: italic;">';
					// table += '<th style="background:rgb(40,94,160)">תאור</th>';
					// table += '<th colspan="' + indPrec + '" style="background:rgb(40,94,160)">סה״כ</th>';
					data.rows.push({
						"cell": [
							{
								"val": "תאור",
								"type": "header"
							},
							{
								"val": "סה״כ",
								"type": "header"
							}
						]
					});

					if (indPrec == 2) {
						data.rows[0].cell.push({
							"val": "",
							"type": "header"
						});
						data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[0].cell.length - 1) + (data.rows.length) + ":" + scope.accoConversions.getABCCell(data.rows[0].cell.length) + (data.rows.length));
					}

					$(scope.appData.revahHefsed.dates).each(function (i, a) {
						var styles = '', stylePre = '';
						if (i == scope.appData.revahHefsed.dates.length - 1) {
							if (scope.appData.valueRadio == 'radio1') {
								styles = 'border-left:1px solid #ddd;'
							}
							else {
								stylePre = 'border-left:1px solid #ddd;'
							}
						}
						data.rows[0].cell.push({
							"val": scope.accoConversions.getDayMonthNum(a),
							"type": "header"
						});
						if (indPrec == 2) {
							data.rows[0].cell.push({
								"val": "",
								"type": "header"
							});
							data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[0].cell.length - 1) + (data.rows.length) + ":" + scope.accoConversions.getABCCell(data.rows[0].cell.length) + (data.rows.length));
						}
					});

					var abcLastCell = scope.accoConversions.getABCCell(data.rows[0].cell.length);

					$(scope.appData.revahHefsed.data).each(function (i, val) {
						if (scope.appData.valueRadioPrev == 'yes' && i % 2 !== 0 || i % 2 == 0) {
							if (i % 2 == 0) { // even

								//table += '<tr><td style="text-align: right; text-decoration: underline; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom;">' + val.title + '</td></tr>';
								data.rows.push({
									"cell": [
										{
											"val": getStringJson(val.title),
											"type": "titleUnderline"
										}
									]
								});

								data.mergeCells.push("A" + (data.rows.length) + ":" + abcLastCell + (data.rows.length));

								if (val.rowsAsList && val.rowsAsList.length > 0) {
									if (scope.appData.valueRadioPrint == 'level3' || scope.appData.valueRadioPrint == 'level2') {
										$(val.rowsAsList).each(function (index, a) {
											if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !a.rowZero)) {
												//table += '<tr><td style="text-align: right; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); font-weight: bold;">' + a.title + '</td>';
												data.rows.push({
													"cell": [
														{
															"val": getStringJson(a.title),
															"type": "cellBoldTitle"
														}
													]
												});
												if (a.data && a.data.length > 0) {
													$(a.data).each(function (index, b) {
														if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !b.rowZero)) {

															var styles = '', stylePre = '';
															if (index == a.data.length - 1) {
																if (scope.appData.valueRadio == 'radio1') {
																	styles = 'border-left:1px solid #ddd;'
																}
																else {
																	stylePre = 'border-left:1px solid #ddd;'
																}
															}

															//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + scope.roundFixed(b.sum) + '</td>';
															data.rows[data.rows.length - 1].cell.push({
																"val": scope.roundFixed(b.sum),
																"type": "cellBold"
															});
															if (scope.appData.valueRadio == 'radio2') {
																var numChange = b.numChange;
																if (b.numChange == null) {
																	numChange = 0;
																}
																//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); font-weight: bold;">' + numChange + '%</td>';
																data.rows[data.rows.length - 1].cell.push({
																	"val": numChange + "%",
																	"type": "cellBoldSmall"
																});
															}
															if (scope.appData.valueRadio == 'radio3') {
																var hacnasotCurrPrcVal = b.hacnasotCurrPrcVal;
																if (b.hacnasotCurrPrcVal == null) {
																	hacnasotCurrPrcVal = 0;
																}
																data.rows[data.rows.length - 1].cell.push({
																	"val": hacnasotCurrPrcVal + "%",
																	"type": "cellBoldSmall"
																});
																//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); font-weight: bold;">' + hacnasotCurrPrcVal + '%</td>';
															}
														}
													});
												}
												//table += '</tr>';

												if (a.rowsAsList && a.rowsAsList.length > 0) {
													if (scope.appData.valueRadioPrint == 'level3') {

														$(a.rowsAsList).each(function (index, b) {
															if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !b.rowZero)) {

																//table += '<tr><td style="text-align: right; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205);">' + b.title + '</td>';
																data.rows.push({
																	"cell": [
																		{
																			"val": getStringJson(b.title),
																			"type": "cellTitle"
																		}
																	]
																});

																if (b.data && b.data.length > 0) {
																	$(b.data).each(function (index, c) {
																		var styles = '', stylePre = '';
																		if (index == b.data.length - 1) {
																			if (scope.appData.valueRadio == 'radio1') {
																				styles = 'border-left:1px solid #ddd;'
																			}
																			else {
																				stylePre = 'border-left:1px solid #ddd;'
																			}
																		}

																		//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">' + scope.roundFixed(c.sum) + '</td>';
																		data.rows[data.rows.length - 1].cell.push({
																			"val": scope.roundFixed(c.sum),
																			"type": "cell"
																		});
																		if (scope.appData.valueRadio == 'radio2') {
																			var numChange = c.numChange;
																			if (c.numChange == null) {
																				numChange = 0;
																			}
																			//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">' + numChange + '%</td>';
																			data.rows[data.rows.length - 1].cell.push({
																				"val": numChange + "%",
																				"type": "cellSmall"
																			});
																		}
																		if (scope.appData.valueRadio == 'radio3') {
																			var hacnasotCurrPrcVal = c.hacnasotCurrPrcVal;
																			if (c.hacnasotCurrPrcVal == null) {
																				hacnasotCurrPrcVal = 0;
																			}
																			//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">' + hacnasotCurrPrcVal + '%</td>';
																			data.rows[data.rows.length - 1].cell.push({
																				"val": hacnasotCurrPrcVal + "%",
																				"type": "cellSmall"
																			});
																		}
																	});
																}
																//table += '</tr>';
															}
														})
													}
												}
											}
										})
									}
								}
							}


							//table += '<tr>';
							if (i % 2 !== 0) { // odd
								data.rows.push({
									"cell": [
										{
											"val": "סה״כ " + getStringJson(val.title) + "אשתקד ",
											"type": "cellBoldBlueTitle"
										}
									]
								});
								// table += '<td style="text-align: right; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(198, 217, 240);">;
								// table += ' אשתקד';
								// table += '</td>'


								if (val.smallData && val.smallData.length > 0) {
									$(val.smallData).each(function (index, a) {
										//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); background: rgb(198, 217, 240);">' + scope.roundFixed(a.sum) + '</td>';
										data.rows[data.rows.length - 1].cell.push({
											"val": scope.roundFixed(a.sum),
											"type": "cellBoldBlue"
										});
										if (scope.appData.valueRadio == 'radio2') {
											//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(198, 217, 240);">&nbsp;</td>';
											data.rows[data.rows.length - 1].cell.push({
												"val": "",
												"type": "cellSmallBoldBlue"
											});
										}
										if (scope.appData.valueRadio == 'radio3') {
											var hacnasotCurrPrcVal = a.hacnasotCurrPrcVal;
											if (a.hacnasotCurrPrcVal == null) {
												hacnasotCurrPrcVal = 0;
											}
											data.rows[data.rows.length - 1].cell.push({
												"val": hacnasotCurrPrcVal + "%",
												"type": "cellSmallBoldBlue"
											});
											//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(198, 217, 240);">' + hacnasotCurrPrcVal + '%</td>';
										}
									});
								}
								//table += '</tr>';
							}
							else {
								// table += '<td style="text-align: right; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(216, 216, 216);">סה"כ ' + val.title;
								// table += '</td>';
								data.rows.push({
									"cell": [
										{
											"val": "סה״כ " + getStringJson(val.title),
											"type": "cellBoldGrayTitle"
										}
									]
								});
								if (val.data && val.data.length > 0) {
									$(val.data).each(function (index, a) {
										if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !a.rowZero)) {
											//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); background: rgb(216, 216, 216);">' + scope.roundFixed(a.sum) + '</td>';
											data.rows[data.rows.length - 1].cell.push({
												"val": scope.roundFixed(a.sum),
												"type": "cellBoldGray"
											});
											if (scope.appData.valueRadio == 'radio2') {
												var numChange = a.numChange;
												if (a.numChange == null) {
													numChange = 0;
												}
												data.rows[data.rows.length - 1].cell.push({
													"val": numChange + "%",
													"type": "cellSmallBoldGray"
												});
												//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(216, 216, 216);">' + numChange + '%</td>';
											}
											if (scope.appData.valueRadio == 'radio3') {
												var hacnasotCurrPrcVal = a.hacnasotCurrPrcVal;
												if (a.hacnasotCurrPrcVal == null) {
													hacnasotCurrPrcVal = 0;
												}
												data.rows[data.rows.length - 1].cell.push({
													"val": hacnasotCurrPrcVal + "%",
													"type": "cellSmallBoldGray"
												});
												//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(216, 216, 216);">' + hacnasotCurrPrcVal + '%</td>';
											}
										}
									});
								}
								//table += '</tr>';
							}
						}
					});


					var textSum = 'הפסד';
					if (scope.appData.revahHefsed.summary.sum >= 0) {
						textSum = 'רווח';
					}
					var textSumPrev = 'הפסד';
					if (scope.appData.revahHefsed.summary.prevNum >= 0) {
						textSumPrev = 'רווח';
					}

					if (scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 2].data[0].hacnasotCurrPrcVal !== null && scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 1].smallData[0].hacnasotCurrPrcVal !== null) {
						data.rows.push({
								"cell": [
									{
										"val": " סה״כ " + textSum + " לדו״ח ",
										"type": "cellBoldBlueTitle"
									},
									{
										"val": textSumPrev + " אשתקד ",
										"type": "cellBoldBlueTitle"
									},
									{
										"val": "שינוי מתקופה קודמת",
										"type": "cellBoldBlueTitle"
									}
								]
							},
							{
								"cell": [
									{
										"val": scope.roundFixed(scope.appData.revahHefsed.summary.sum),
										"type": "cellBoldGray"
									},
									{
										"val": scope.roundFixed(scope.appData.revahHefsed.summary.prevNum),
										"type": "cellBoldGray"
									},
									{
										"val": (scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 2].data[0].hacnasotCurrPrcVal) - (scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 1].smallData[0].hacnasotCurrPrcVal) + "%",
										"type": "cellBoldGray"
									}
								]
							}
						);
					}
					else {
						data.rows.push({
								"cell": [
									{
										"val": " סה״כ " + textSum + " לדו״ח ",
										"type": "cellBoldBlueTitle"
									},
									{
										"val": textSumPrev + " אשתקד ",
										"type": "cellBoldBlueTitle"
									}
								]
							},
							{
								"cell": [
									{
										"val": scope.roundFixed(scope.appData.revahHefsed.summary.sum),
										"type": "cellBoldGray"
									},
									{
										"val": scope.roundFixed(scope.appData.revahHefsed.summary.prevNum),
										"type": "cellBoldGray"
									}
								]
							}
						);
					}

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					scope.hidePopup();
					return false;
				});
			}
		}
	}

	function exportsMailerRevah(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = ' רווח והפסד -' + scope.appData.datesSelectReport + ' - ' + scope.appData.selectedCompany.companyName;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "285ea0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": true,
								"typesCellNumber": false
							},
							{
								"type": "titleUnderline",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"fontUnderline": true,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBoldTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldSmall",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldSmallLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": false,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": false,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmall",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},


							{
								"type": "cellBoldGrayTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldGray",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldGrayLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallBoldGray",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallBoldGrayLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d8d8d8",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},


							{
								"type": "cellBoldBlueTitle",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBlue",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBlueLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallBoldBlue",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellSmallBoldBlueLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "c6d9f0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					var lengthArr = scope.appData.revahHefsed.dates.length + 2;
					var indPrec = 1;
					if (scope.appData.valueRadio !== 'radio1') {
						lengthArr = (scope.appData.revahHefsed.dates.length * 2) + 3;
						indPrec = 2;
					}
					// var table = '';
					// table += '<table style="direction:rtl; text-align:right; "><thead><tr style="color: #fff;font: bold 12px arial;font-style: italic;">';
					// table += '<th style="background:rgb(40,94,160)">תאור</th>';
					// table += '<th colspan="' + indPrec + '" style="background:rgb(40,94,160)">סה״כ</th>';
					data.rows.push({
						"cell": [
							{
								"val": "תאור",
								"type": "header"
							},
							{
								"val": "סה״כ",
								"type": "header"
							}
						]
					});

					if (indPrec == 2) {
						data.rows[0].cell.push({
							"val": "",
							"type": "header"
						});
						data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[0].cell.length - 1) + (data.rows.length) + ":" + scope.accoConversions.getABCCell(data.rows[0].cell.length) + (data.rows.length));
					}

					$(scope.appData.revahHefsed.dates).each(function (i, a) {
						var styles = '', stylePre = '';
						if (i == scope.appData.revahHefsed.dates.length - 1) {
							if (scope.appData.valueRadio == 'radio1') {
								styles = 'border-left:1px solid #ddd;'
							}
							else {
								stylePre = 'border-left:1px solid #ddd;'
							}
						}
						data.rows[0].cell.push({
							"val": scope.accoConversions.getDayMonthNum(a),
							"type": "header"
						});
						if (indPrec == 2) {
							data.rows[0].cell.push({
								"val": "",
								"type": "header"
							});
							data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[0].cell.length - 1) + (data.rows.length) + ":" + scope.accoConversions.getABCCell(data.rows[0].cell.length) + (data.rows.length));
						}
					});

					var abcLastCell = scope.accoConversions.getABCCell(data.rows[0].cell.length);

					$(scope.appData.revahHefsed.data).each(function (i, val) {
						if (scope.appData.valueRadioPrev == 'yes' && i % 2 !== 0 || i % 2 == 0) {
							if (i % 2 == 0) { // even

								//table += '<tr><td style="text-align: right; text-decoration: underline; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom;">' + val.title + '</td></tr>';
								data.rows.push({
									"cell": [
										{
											"val": getStringJson(val.title),
											"type": "titleUnderline"
										}
									]
								});

								data.mergeCells.push("A" + (data.rows.length) + ":" + abcLastCell + (data.rows.length));

								if (val.rowsAsList && val.rowsAsList.length > 0) {
									if (scope.appData.valueRadioPrint == 'level3' || scope.appData.valueRadioPrint == 'level2') {
										$(val.rowsAsList).each(function (index, a) {
											if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !a.rowZero)) {
												//table += '<tr><td style="text-align: right; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); font-weight: bold;">' + a.title + '</td>';
												data.rows.push({
													"cell": [
														{
															"val": getStringJson(a.title),
															"type": "cellBoldTitle"
														}
													]
												});
												if (a.data && a.data.length > 0) {
													$(a.data).each(function (index, b) {
														if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !b.rowZero)) {

															var styles = '', stylePre = '';
															if (index == a.data.length - 1) {
																if (scope.appData.valueRadio == 'radio1') {
																	styles = 'border-left:1px solid #ddd;'
																}
																else {
																	stylePre = 'border-left:1px solid #ddd;'
																}
															}

															//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + scope.roundFixed(b.sum) + '</td>';
															data.rows[data.rows.length - 1].cell.push({
																"val": scope.roundFixed(b.sum),
																"type": "cellBold"
															});
															if (scope.appData.valueRadio == 'radio2') {
																var numChange = b.numChange;
																if (b.numChange == null) {
																	numChange = 0;
																}
																//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); font-weight: bold;">' + numChange + '%</td>';
																data.rows[data.rows.length - 1].cell.push({
																	"val": numChange + "%",
																	"type": "cellBoldSmall"
																});
															}
															if (scope.appData.valueRadio == 'radio3') {
																var hacnasotCurrPrcVal = b.hacnasotCurrPrcVal;
																if (b.hacnasotCurrPrcVal == null) {
																	hacnasotCurrPrcVal = 0;
																}
																data.rows[data.rows.length - 1].cell.push({
																	"val": hacnasotCurrPrcVal + "%",
																	"type": "cellBoldSmall"
																});
																//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); font-weight: bold;">' + hacnasotCurrPrcVal + '%</td>';
															}
														}
													});
												}
												//table += '</tr>';

												if (a.rowsAsList && a.rowsAsList.length > 0) {
													if (scope.appData.valueRadioPrint == 'level3') {
														$(a.rowsAsList).each(function (index, b) {
															if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !b.rowZero)) {

																//table += '<tr><td style="text-align: right; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205);">' + b.title + '</td>';
																data.rows.push({
																	"cell": [
																		{
																			"val": getStringJson(b.title),
																			"type": "cellTitle"
																		}
																	]
																});

																if (b.data && b.data.length > 0) {
																	$(b.data).each(function (index, c) {
																		var styles = '', stylePre = '';
																		if (index == b.data.length - 1) {
																			if (scope.appData.valueRadio == 'radio1') {
																				styles = 'border-left:1px solid #ddd;'
																			}
																			else {
																				stylePre = 'border-left:1px solid #ddd;'
																			}
																		}

																		//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">' + scope.roundFixed(c.sum) + '</td>';
																		data.rows[data.rows.length - 1].cell.push({
																			"val": scope.roundFixed(c.sum),
																			"type": "cell"
																		});
																		if (scope.appData.valueRadio == 'radio2') {
																			var numChange = c.numChange;
																			if (c.numChange == null) {
																				numChange = 0;
																			}
																			//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">' + numChange + '%</td>';
																			data.rows[data.rows.length - 1].cell.push({
																				"val": numChange + "%",
																				"type": "cellSmall"
																			});
																		}
																		if (scope.appData.valueRadio == 'radio3') {
																			var hacnasotCurrPrcVal = c.hacnasotCurrPrcVal;
																			if (c.hacnasotCurrPrcVal == null) {
																				hacnasotCurrPrcVal = 0;
																			}
																			//table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-weight: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">' + hacnasotCurrPrcVal + '%</td>';
																			data.rows[data.rows.length - 1].cell.push({
																				"val": hacnasotCurrPrcVal + "%",
																				"type": "cellSmall"
																			});
																		}
																	});
																}
																//table += '</tr>';
															}
														})
													}
												}
											}
										})
									}
								}
							}


							//table += '<tr>';
							if (i % 2 !== 0) { // odd
								data.rows.push({
									"cell": [
										{
											"val": "סה״כ " + getStringJson(val.title) + "אשתקד ",
											"type": "cellBoldBlueTitle"
										}
									]
								});
								// table += '<td style="text-align: right; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(198, 217, 240);">;
								// table += ' אשתקד';
								// table += '</td>'


								if (val.smallData && val.smallData.length > 0) {
									$(val.smallData).each(function (index, a) {
										//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); background: rgb(198, 217, 240);">' + scope.roundFixed(a.sum) + '</td>';
										data.rows[data.rows.length - 1].cell.push({
											"val": scope.roundFixed(a.sum),
											"type": "cellBoldBlue"
										});
										if (scope.appData.valueRadio == 'radio2') {
											//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(198, 217, 240);">&nbsp;</td>';
											data.rows[data.rows.length - 1].cell.push({
												"val": "",
												"type": "cellSmallBoldBlue"
											});
										}
										if (scope.appData.valueRadio == 'radio3') {
											var hacnasotCurrPrcVal = a.hacnasotCurrPrcVal;
											if (a.hacnasotCurrPrcVal == null) {
												hacnasotCurrPrcVal = 0;
											}
											data.rows[data.rows.length - 1].cell.push({
												"val": hacnasotCurrPrcVal + "%",
												"type": "cellSmallBoldBlue"
											});
											//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(198, 217, 240);">' + hacnasotCurrPrcVal + '%</td>';
										}
									});
								}
								//table += '</tr>';
							}
							else {
								// table += '<td style="text-align: right; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(216, 216, 216);">סה"כ ' + val.title;
								// table += '</td>';
								data.rows.push({
									"cell": [
										{
											"val": "סה״כ " + getStringJson(val.title),
											"type": "cellBoldGrayTitle"
										}
									]
								});
								if (val.data && val.data.length > 0) {
									$(val.data).each(function (index, a) {
										if (scope.appData.valueRadioPrev == 'yes' || (scope.appData.valueRadioPrev == 'no' && !a.rowZero)) {
											//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); background: rgb(216, 216, 216);">' + scope.roundFixed(a.sum) + '</td>';
											data.rows[data.rows.length - 1].cell.push({
												"val": scope.roundFixed(a.sum),
												"type": "cellBoldGray"
											});
											if (scope.appData.valueRadio == 'radio2') {
												var numChange = a.numChange;
												if (a.numChange == null) {
													numChange = 0;
												}
												data.rows[data.rows.length - 1].cell.push({
													"val": numChange + "%",
													"type": "cellSmallBoldGray"
												});
												//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(216, 216, 216);">' + numChange + '%</td>';
											}
											if (scope.appData.valueRadio == 'radio3') {
												var hacnasotCurrPrcVal = a.hacnasotCurrPrcVal;
												if (a.hacnasotCurrPrcVal == null) {
													hacnasotCurrPrcVal = 0;
												}
												data.rows[data.rows.length - 1].cell.push({
													"val": hacnasotCurrPrcVal + "%",
													"type": "cellSmallBoldGray"
												});
												//table += '<td style="text-align: center; font-weight: bold; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 11px; line-height: normal; font-family: arial; vertical-align: bottom; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: rgb(51, 51, 51); border-top-width: 1px; border-top-style: solid; border-top-color: rgb(51, 51, 51); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(214, 205, 205); background: rgb(216, 216, 216);">' + hacnasotCurrPrcVal + '%</td>';
											}
										}
									});
								}
								//table += '</tr>';
							}
						}
					});

					var textSum = 'הפסד';
					if (scope.appData.revahHefsed.summary.sum >= 0) {
						textSum = 'רווח';
					}
					var textSumPrev = 'הפסד';
					if (scope.appData.revahHefsed.summary.prevNum >= 0) {
						textSumPrev = 'רווח';
					}


					if (scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 2].data[0].hacnasotCurrPrcVal !== null && scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 1].smallData[0].hacnasotCurrPrcVal !== null) {
						data.rows.push({
								"cell": [
									{
										"val": " סה״כ " + textSum + " לדו״ח ",
										"type": "cellBoldBlueTitle"
									},
									{
										"val": textSumPrev + " אשתקד ",
										"type": "cellBoldBlueTitle"
									},
									{
										"val": "שינוי מתקופה קודמת",
										"type": "cellBoldBlueTitle"
									}
								]
							},
							{
								"cell": [
									{
										"val": scope.roundFixed(scope.appData.revahHefsed.summary.sum),
										"type": "cellBoldGray"
									},
									{
										"val": scope.roundFixed(scope.appData.revahHefsed.summary.prevNum),
										"type": "cellBoldGray"
									},
									{
										"val": (scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 2].data[0].hacnasotCurrPrcVal) - (scope.appData.revahHefsed.data[scope.appData.revahHefsed.data.length - 1].smallData[0].hacnasotCurrPrcVal) + "%",
										"type": "cellBoldGray"
									}
								]
							}
						);
					}
					else {
						data.rows.push({
								"cell": [
									{
										"val": " סה״כ " + textSum + " לדו״ח ",
										"type": "cellBoldBlueTitle"
									},
									{
										"val": textSumPrev + " אשתקד ",
										"type": "cellBoldBlueTitle"
									}
								]
							},
							{
								"cell": [
									{
										"val": scope.roundFixed(scope.appData.revahHefsed.summary.sum),
										"type": "cellBoldGray"
									},
									{
										"val": scope.roundFixed(scope.appData.revahHefsed.summary.prevNum),
										"type": "cellBoldGray"
									}
								]
							}
						);
					}
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});

				});
			}
		}

	}


	function exportsExcelHash() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'דו״ח ייצוא דפי בנק -';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "שם חשבון",
										"type": "header"
									},
									{
										"val": "מספר בנק",
										"type": "header"
									},
									{
										"val": "מספר סניף",
										"type": "header"
									},
									{
										"val": "מספר חשבון",
										"type": "header"
									},
									{
										"val": "כרטיס הנהלת חשבונות",
										"type": "header"
									},
									{
										"val": "תאריך ייצוא אחרון",
										"type": "header"
									},
									{
										"val": "סטטוס ייצוא אחרון",
										"type": "header"
									},
									{
										"val": "DB",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"12",
							"18",
							"12",
							"12",
							"12",
							"12",
							"12",
							"20"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:H1");
					$(scope.appData.exportsHashav).each(function (i, v) {
						if (v.last_export_date !== undefined && v.last_export_date !== null) {
							var status = '';
							if (v.last_export_status !== null) {
								status = scope.accoConversions.getStatusCompanyEx(v.last_export_status);
							}
							var izu_cust_id = '';
							if (v.izu_cust_id !== null) {
								izu_cust_id = v.izu_cust_id;
							}
							var db = '';
							if (v.db_name !== null) {
								db = v.db_name;
							}
							var rows = {
								"cell": [
									{
										val: getStringJson(v.company_name),
										type: "cell"
									},
									{
										val: getStringJson(v.account_nickname),
										type: "cell"
									},
									{
										val: v.bank_id,
										type: "cell"
									},
									{
										val: v.bank_snif_id,
										type: "cell"
									},
									{
										val: v.bank_account_id,
										type: "cell"
									},
									{
										val: izu_cust_id,
										type: "cell"
									},
									{
										val: v.last_export_date,
										type: "cell"
									},
									{
										val: getStringJson(status),
										type: "cell"
									},
									{
										val: getStringJson(db),
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailerHash(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = ' ייצוא דפי בנק -';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;

					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "שם חשבון",
										"type": "header"
									},
									{
										"val": "מספר בנק",
										"type": "header"
									},
									{
										"val": "מספר סניף",
										"type": "header"
									},
									{
										"val": "מספר חשבון",
										"type": "header"
									},
									{
										"val": "כרטיס הנהלת חשבונות",
										"type": "header"
									},
									{
										"val": "תאריך ייצוא אחרון",
										"type": "header"
									},
									{
										"val": "סטטוס ייצוא אחרון",
										"type": "header"
									},
									{
										"val": "DB",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"12",
							"18",
							"12",
							"12",
							"12",
							"12",
							"12",
							"20"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:H1");
					$(scope.appData.exportsHashav).each(function (i, v) {
						if (v.last_export_date !== undefined && v.last_export_date !== null) {
							var status = '';
							if (v.last_export_status !== null) {
								status = scope.accoConversions.getStatusCompanyEx(v.last_export_status);
							}
							var izu_cust_id = '';
							if (v.izu_cust_id !== null) {
								izu_cust_id = v.izu_cust_id;
							}
							var db = '';
							if (v.db_name !== null) {
								db = v.db_name;
							}
							var rows = {
								"cell": [
									{
										val: getStringJson(v.company_name),
										type: "cell"
									},
									{
										val: getStringJson(v.account_nickname),
										type: "cell"
									},
									{
										val: v.bank_id,
										type: "cell"
									},
									{
										val: v.bank_snif_id,
										type: "cell"
									},
									{
										val: v.bank_account_id,
										type: "cell"
									},
									{
										val: izu_cust_id,
										type: "cell"
									},
									{
										val: v.last_export_date,
										type: "cell"
									},
									{
										val: getStringJson(status),
										type: "cell"
									},
									{
										val: getStringJson(db),
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}

	function exportsPrintHash() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="direction:rtl; text-align:right; "><thead><tr style="color: #fff;font: bold 12px arial;font-style: italic;">';
					table += '<th style="background:rgb(40,94,160)">שם חברה</th>';
					table += '<th style="background:rgb(40,94,160)">שם חשבון</th>';
					table += '<th style="background:rgb(40,94,160)">מספר בנק</th>';
					table += '<th style="background:rgb(40,94,160)">מספר סניף</th>';
					table += '<th style="background:rgb(40,94,160)">מספר חשבון</th>';
					table += '<th style="background:rgb(40,94,160)">כרטיס הנהלת חשבונות</th>';
					table += '<th style="background:rgb(40,94,160)">תאריך ייצוא אחרון</th>';
					table += '<th style="background:rgb(40,94,160)">סטטוס ייצוא אחרון</th>';
					table += '<th style="background:rgb(40,94,160)">DB</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.exportsHashavArr).each(function (i, val) {
						$(val.data).each(function (ind, v) {
							if (v.last_export_date !== null) {
								var status = '&nbsp;';
								if (v.last_export_status !== null) {
									status = scope.accoConversions.getStatusCompanyEx(v.last_export_status);
								}
								var izu_cust_id = '&nbsp;';
								if (v.izu_cust_id !== null) {
									izu_cust_id = v.izu_cust_id;
								}
								var db = '&nbsp;';
								if (v.db_name !== null) {
									db = v.db_name;
								}
								table += '<tr>';
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + val.company_name + '</td>';
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + v.account_nickname + '</td>';
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + v.bank_id + '</td>';
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + v.bank_snif_id + '</td>';
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + v.bank_account_id + '</td>';
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + izu_cust_id + '</td>';
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + v.last_export_date + '</td>';
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + status + '</td>';
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: bold;">' + db + '</td>';
								table += '</tr>';
							}
						});
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח ייצוא דפי בנק -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}


	function exportsPrintChecks() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); "> תאריך פרעון</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סכום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">ח-ן</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">תיאור</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">מספר שיק</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">הערות</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.companyGetinchequesPerut).each(function (i, val) {
						var hariga_message = '&nbsp;';
						if (val.hariga_message) {
							hariga_message = val.hariga_message;
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + val.due_date + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + '₪' + scope.roundFixed(val.total) + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + scope.loadNickNameBank(val.company_account_id) + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + val.payment_desc + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + val.cheque_no + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + hariga_message + '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var namesSec, namesTitle;
					$(scope.appData.companyGetinchequesSum).each(function (i, val) {
						if (scope.tabStatus == val.status_id) {
							namesSec = val.cheque_status_desc;
						}
					});

					if (scope.tab == 'incomeChecks') {
						namesTitle = 'שיקים נכנסים'
					}
					else {
						namesTitle = 'שיקים יוצאים';
					}
					var name_doch = 'דו״ח ניתוח שיקים -' + ' ' + namesTitle + ', ' + namesSec + ', ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.css("width", "1px").css("height", "1px").css("position", "absolute").css("left", "-9999px").appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelChecks() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var namesSec = "", namesTitle = "";
					$(scope.appData.companyGetinchequesSum).each(function (i, val) {
						if (scope.tabStatus == val.status_id) {
							namesSec = getStringJson(val.cheque_status_desc);
						}
					});

					if (scope.tab == 'incomeChecks') {
						namesTitle = 'שיקים נכנסים'
					}
					else {
						namesTitle = 'שיקים יוצאים';
					}
					var name_doch = 'דו״ח ניתוח שיקים -' + ' ' + namesTitle + ', ' + namesSec + ', ' + scope.appData.defMonth.full_name;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = getStringJson(scope.appData.selectedCompany.full_name);
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "תאריך פרעון",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "תיאור",
										"type": "header"
									},
									{
										"val": "מספר שיק",
										"type": "header"
									},
									{
										"val": "הערות",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"12",
							"12",
							"18",
							"22",
							"12",
							"18"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:F1");

					$(scope.appData.companyGetinchequesPerut).each(function (i, val) {
						var hariga_message = '';
						if (val.hariga_message) {
							hariga_message = getStringJson(val.hariga_message);
						}
						var cheque_no = '';
						if (val.cheque_no) {
							cheque_no = getStringJson(val.cheque_no);
						}
						var rows = {
							"cell": [
								{
									val: val.due_date,
									type: "cell"
								},
								{
									val: scope.roundFixed(val.total),
									type: "cell"
								},
								{
									val: getStringJson(scope.loadNickNameBank(val.company_account_id)),
									type: "cell"
								},
								{
									val: getStringJson(val.payment_desc),
									type: "cell"
								},
								{
									val: cheque_no,
									type: "cell"
								},
								{
									val: hariga_message,
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailerChecks(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var namesSec = "", namesTitle = "";
					$(scope.appData.companyGetinchequesSum).each(function (i, val) {
						if (scope.tabStatus == val.status_id) {
							namesSec = val.cheque_status_desc;
						}
					});

					if (scope.tab == 'incomeChecks') {
						namesTitle = 'שיקים נכנסים'
					}
					else {
						namesTitle = 'שיקים יוצאים';
					}
					var name_doch = ' ניתוח שיקים -' + ' ' + namesTitle + ', ' + namesSec + ', ' + scope.appData.defMonth.full_name;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = getStringJson(scope.appData.selectedCompany.full_name);
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								"cell": [
									{
										"val": "תאריך פרעון",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "ח-ן",
										"type": "header"
									},
									{
										"val": "תיאור",
										"type": "header"
									},
									{
										"val": "מספר שיק",
										"type": "header"
									},
									{
										"val": "הערות",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"12",
							"12",
							"18",
							"22",
							"12",
							"18"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:F1");

					$(scope.appData.companyGetinchequesPerut).each(function (i, val) {
						var hariga_message = '';
						if (val.hariga_message) {
							hariga_message = getStringJson(val.hariga_message);
						}
						var cheque_no = '';
						if (val.cheque_no) {
							cheque_no = getStringJson(val.cheque_no);
						}
						var rows = {
							"cell": [
								{
									val: val.due_date,
									type: "cell"
								},
								{
									val: scope.roundFixed(val.total),
									type: "cell"
								},
								{
									val: getStringJson(scope.loadNickNameBank(val.company_account_id)),
									type: "cell"
								},
								{
									val: getStringJson(val.payment_desc),
									type: "cell"
								},
								{
									val: cheque_no,
									type: "cell"
								},
								{
									val: hariga_message,
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}


	function exportsPrintMainAcc() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">שם החברה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">מסמכים</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51);">ייצוא דפי בנק</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.filteredMainAccAll).each(function (i, val) {
						var sum_inv_cur_mon = '', last_export_status = '';
						if ((val.sum_inv_cur_mon <= 0 || val.sum_inv_cur_mon == null) && (!val.last_inv_date || val.last_inv_date == '01/01/1980')) {
							sum_inv_cur_mon = '&nbsp;';
						}
						if (val.sum_inv_cur_mon > 0 || ((val.sum_inv_cur_mon <= 0 || val.sum_inv_cur_mon == null) && (val.last_inv_date && val.last_inv_date !== '01/01/1980'))) {
							var not = '';
							if (val.sum_inv_cur_mon <= 0 || val.sum_inv_cur_mon == null) {
								not = 'לא ';
							}
							sum_inv_cur_mon = not + ' הוקלדו החודש' + ' | ' + val.last_inv_date + ' - ' + val.sum_inv_cur_mon;
						}
						if ((!val.last_export_status || val.last_export_status == null || val.last_export_status < 0) && (val.token_status == null || !val.token_status || val.token_status <= 0)) {
							last_export_status = '&nbsp;';
						}
						if (val.last_export_status > 0) {
							last_export_status = scope.accoConversions.getStatus(val.last_export_status) + ' | ' + val.last_export_date + ' - ' + val.last_export_account_nickname;
						}
						if ((val.last_export_status <= 0 || val.last_export_status == null || !val.last_export_status) && val.token_status > 0) {
							last_export_status = scope.accoConversions.getStatustokensalerts(val.token_status) + ' | ' + val.balance_last_updated_date + ' - ' + val.token_account_nickname;
						}
						if (val.last_export_status == 0 && (val.token_status <= 0 || val.token_status == null || !val.token_status)) {
							last_export_status = 'פעיל' + ' | ' + val.last_export_date;
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' + val.company_name + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' + sum_inv_cur_mon + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' + last_export_status + '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח נתוני לקוחות - ראשי -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.css("width", "1px").css("height", "1px").css("position", "absolute").css("left", "-9999px").appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelMainAcc() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'דו״ח נתוני לקוחות - ראשי -' + ', ' + scope.appData.defMonth.full_name;
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם החברה",
										"type": "header"
									},
									{
										"val": "מסמכים",
										"type": "header"
									},
									{
										"val": "ייצוא דפי בנק",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"25",
							"20",
							"35"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:C1");

					$(scope.appData.filteredMainAccAll).each(function (i, val) {
						var sum_inv_cur_mon = '', last_export_status = '';
						if ((val.sum_inv_cur_mon <= 0 || val.sum_inv_cur_mon == null) && (!val.last_inv_date || val.last_inv_date == '01/01/1980')) {
							sum_inv_cur_mon = '';
						}
						if (val.sum_inv_cur_mon > 0 || ((val.sum_inv_cur_mon <= 0 || val.sum_inv_cur_mon == null) && (val.last_inv_date && val.last_inv_date !== '01/01/1980'))) {
							var not = '';
							if (val.sum_inv_cur_mon <= 0 || val.sum_inv_cur_mon == null) {
								not = 'לא ';
							}
							sum_inv_cur_mon = not + ' הוקלדו החודש' + ' | ' + val.last_inv_date + ' - ' + val.sum_inv_cur_mon;
						}
						if ((!val.last_export_status || val.last_export_status == null || val.last_export_status < 0) && (val.token_status == null || !val.token_status || val.token_status <= 0)) {
							last_export_status = '';
						}
						if (val.last_export_status > 0) {
							last_export_status = scope.accoConversions.getStatus(val.last_export_status) + ' | ' + val.last_export_date + ' - ' + val.last_export_account_nickname;
						}
						if ((val.last_export_status <= 0 || val.last_export_status == null || !val.last_export_status) && val.token_status > 0) {
							last_export_status = scope.accoConversions.getStatustokensalerts(val.token_status) + ' | ' + val.balance_last_updated_date + ' - ' + val.token_account_nickname;
						}
						if (val.last_export_status == 0 && (val.token_status <= 0 || val.token_status == null || !val.token_status)) {
							last_export_status = 'פעיל' + ' | ' + val.last_export_date;
						}

						var rows = {
							"cell": [
								{
									val: val.company_name,
									type: "cell"
								},
								{
									val: sum_inv_cur_mon,
									type: "cell"
								},
								{
									val: last_export_status,
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});


					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailerMainAcc(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = 'דו״ח נתוני לקוחות - ראשי -' + ', ' + scope.appData.defMonth.full_name;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;

					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם החברה",
										"type": "header"
									},
									{
										"val": "מסמכים",
										"type": "header"
									},
									{
										"val": "ייצוא דפי בנק",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"25",
							"20",
							"35"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:C1");
					$(scope.appData.filteredMainAccAll).each(function (i, val) {
						var sum_inv_cur_mon = '', last_export_status = '';
						if ((val.sum_inv_cur_mon <= 0 || val.sum_inv_cur_mon == null) && (!val.last_inv_date || val.last_inv_date == '01/01/1980')) {
							sum_inv_cur_mon = '';
						}
						if (val.sum_inv_cur_mon > 0 || ((val.sum_inv_cur_mon <= 0 || val.sum_inv_cur_mon == null) && (val.last_inv_date && val.last_inv_date !== '01/01/1980'))) {
							var not = '';
							if (val.sum_inv_cur_mon <= 0 || val.sum_inv_cur_mon == null) {
								not = 'לא ';
							}
							sum_inv_cur_mon = not + ' הוקלדו החודש' + ' | ' + val.last_inv_date + ' - ' + val.sum_inv_cur_mon;
						}
						if ((!val.last_export_status || val.last_export_status == null || val.last_export_status < 0) && (val.token_status == null || !val.token_status || val.token_status <= 0)) {
							last_export_status = '';
						}
						if (val.last_export_status > 0) {
							last_export_status = scope.accoConversions.getStatus(val.last_export_status) + ' | ' + val.last_export_date + ' - ' + val.last_export_account_nickname;
						}
						if ((val.last_export_status <= 0 || val.last_export_status == null || !val.last_export_status) && val.token_status > 0) {
							last_export_status = scope.accoConversions.getStatustokensalerts(val.token_status) + ' | ' + val.balance_last_updated_date + ' - ' + val.token_account_nickname;
						}
						if (val.last_export_status == 0 && (val.token_status <= 0 || val.token_status == null || !val.token_status)) {
							last_export_status = 'פעיל' + ' | ' + val.last_export_date;
						}

						var rows = {
							"cell": [
								{
									val: val.company_name,
									type: "cell"
								},
								{
									val: sum_inv_cur_mon,
									type: "cell"
								},
								{
									val: last_export_status,
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});

				});
			}
		}

	}


	function exportsPrintAccCards() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">פעולות לייצוא</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">כרטיס</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">עדכון אחרון</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">אינדקס כרטיס</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">אינדקס בנק</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">ייצוא אחרון</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סטטוס</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">DB</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.listCardsAcc).each(function (i, val) {
						if (val.title) {
							table += '<tr>';
							table += '<td colspan="7" style="padding-right:20px;text-align: right; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' + val.company_name + '</td>';
							table += '</tr>';
						}
						else {
							var db = '&nbsp;';
							if (val.db_name !== null) {
								db = val.db_name;
							}
							var izu_cast_id = '&nbsp;', izu_account_cust_nickname = '&nbsp;',
								izu_account_cust_id = '&nbsp;', last_export_date = '&nbsp;', color = '#ec3c66',
								izu_cust_nickname = '&nbsp;', izu_account_cust_nickname = '&nbsp;';
							if (val.izu_cast_id !== null) {
								izu_cast_id = val.izu_cast_id;
							}
							if (val.izu_cust_nickname !== null) {
								izu_cust_nickname = ' | ' + val.izu_cust_nickname;
							}
							if (val.izu_account_cust_nickname !== null) {
								izu_account_cust_nickname = ' | ' + val.izu_account_cust_nickname;
							}
							if (val.balance_last_update_date !== null) {
								izu_account_cust_nickname = val.balance_last_update_date + ' | ' + scope.accoConversions.getStatus(val.token_status);
							}
							if (val.izu_account_cust_id !== null) {
								izu_account_cust_id = val.izu_account_cust_id;
							}
							if (val.last_export_date !== null) {
								last_export_date = val.last_export_date + '<br>' + val.last_export_user_name;
							}
							if (val.last_export_status == 0 || val.last_export_status == 8) {
								color = '#62b03f';
							}
							table += '<tr>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' + val.peulot_num + '</td>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								val.credit_card_nickname
								+ '</td>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								izu_account_cust_nickname
								+ '</td>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								izu_cast_id + '' + izu_cust_nickname
								+ '</td>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								izu_account_cust_id + '' + izu_account_cust_nickname
								+ '</td>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								last_export_date
								+ '</td>';
							table += '<td style="color:' + color + ';text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								scope.accoConversions.getStatusCompanyEx(val.last_export_status)
								+ '</td>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								db
								+ '</td>';
							table += '</tr>';
						}
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח ייצוא כ.אשראי -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelAccCards() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'דו״ח ייצוא כ.אשראי -';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "פעולות לייצוא",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "עדכון אחרון",
										"type": "header"
									},
									{
										"val": "אינדקס כרטיס",
										"type": "header"
									},
									{
										"val": "אינדקס בנק",
										"type": "header"
									},
									{
										"val": "ייצוא אחרון",
										"type": "header"
									},
									{
										"val": "סטטוס",
										"type": "header"
									},
									{
										"val": "DB",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:H1");

					$(scope.appData.listCardsAcc).each(function (i, val) {
						if (val.title) {
							var rows = {
								"cell": [
									{
										val: getStringJson(val.company_name),
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + data.rows.length + ":H" + data.rows.length);
						}
						else {
							var db = '';
							if (val.db_name !== null) {
								db = val.db_name;
							}
							var izu_cast_id = '', izu_account_cust_nickname = '', izu_account_cust_id = '',
								last_export_date = '', color = 'cellRed', izu_cust_nickname = '',
								izu_account_cust_nickname = '';
							if (val.izu_cast_id !== null) {
								izu_cast_id = val.izu_cast_id;
							}
							if (val.izu_cust_nickname !== null) {
								izu_cust_nickname = ' | ' + val.izu_cust_nickname;
							}
							if (val.izu_account_cust_nickname !== null) {
								izu_account_cust_nickname = ' | ' + val.izu_account_cust_nickname;
							}
							if (val.balance_last_update_date !== null) {
								izu_account_cust_nickname = val.balance_last_update_date + ' | ' + scope.accoConversions.getStatus(val.token_status);
							}
							if (val.izu_account_cust_id !== null) {
								izu_account_cust_id = val.izu_account_cust_id;
							}
							if (val.last_export_date !== null) {
								last_export_date = val.last_export_date + '\n' + val.last_export_user_name;
							}
							if (val.last_export_status == 0 || val.last_export_status == 8) {
								color = 'cellGreen';
							}
							var rows = {
								"cell": [
									{
										val: getStringJson(val.peulot_num),
										type: "cell"
									},
									{
										val: getStringJson(val.credit_card_nickname),
										type: "cell"
									},
									{
										val: getStringJson(izu_account_cust_nickname),
										type: "cell"
									},
									{
										val: getStringJson(izu_cast_id + '' + izu_cust_nickname),
										type: "cell"
									},
									{
										val: getStringJson(izu_account_cust_id + '' + izu_account_cust_nickname),
										type: "cell"
									},
									{
										val: last_export_date,
										type: "cell"
									},
									{
										val: scope.accoConversions.getStatusCompanyEx(val.last_export_status),
										type: color
									},
									{
										val: getStringJson(db),
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailerAccCards(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = ' ייצוא כ.אשראי -';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "פעולות לייצוא",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "עדכון אחרון",
										"type": "header"
									},
									{
										"val": "אינדקס כרטיס",
										"type": "header"
									},
									{
										"val": "אינדקס בנק",
										"type": "header"
									},
									{
										"val": "ייצוא אחרון",
										"type": "header"
									},
									{
										"val": "סטטוס",
										"type": "header"
									},
									{
										"val": "DB",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:H1");
					$(scope.appData.listCardsAcc).each(function (i, val) {
						if (val.title) {
							var rows = {
								"cell": [
									{
										val: getStringJson(val.company_name),
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
							data.mergeCells.push("A" + data.rows.length + ":H" + data.rows.length);
						}
						else {
							var db = '';
							if (val.db_name !== null) {
								db = val.db_name;
							}
							var izu_cast_id = '', izu_account_cust_nickname = '', izu_account_cust_id = '',
								last_export_date = '', color = 'cellRed', izu_cust_nickname = '',
								izu_account_cust_nickname = '';
							if (val.izu_cast_id !== null) {
								izu_cast_id = val.izu_cast_id;
							}
							if (val.izu_cust_nickname !== null) {
								izu_cust_nickname = ' | ' + val.izu_cust_nickname;
							}
							if (val.izu_account_cust_nickname !== null) {
								izu_account_cust_nickname = ' | ' + val.izu_account_cust_nickname;
							}
							if (val.balance_last_update_date !== null) {
								izu_account_cust_nickname = val.balance_last_update_date + ' | ' + scope.accoConversions.getStatus(val.token_status);
							}
							if (val.izu_account_cust_id !== null) {
								izu_account_cust_id = val.izu_account_cust_id;
							}
							if (val.last_export_date !== null) {
								last_export_date = val.last_export_date + '\n' + val.last_export_user_name;
							}
							if (val.last_export_status == 0 || val.last_export_status == 8) {
								color = 'cellGreen';
							}
							var rows = {
								"cell": [
									{
										val: getStringJson(val.peulot_num),
										type: "cell"
									},
									{
										val: getStringJson(val.credit_card_nickname),
										type: "cell"
									},
									{
										val: getStringJson(izu_account_cust_nickname),
										type: "cell"
									},
									{
										val: getStringJson(izu_cast_id + '' + izu_cust_nickname),
										type: "cell"
									},
									{
										val: getStringJson(izu_account_cust_id + '' + izu_account_cust_nickname),
										type: "cell"
									},
									{
										val: last_export_date,
										type: "cell"
									},
									{
										val: scope.accoConversions.getStatusCompanyEx(val.last_export_status),
										type: color
									},
									{
										val: getStringJson(db),
										type: "cellBorderLeft"
									}
								]
							};
							data.rows.push(rows);
						}
					});
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}


	function printAllChecks() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '<table style="width:100%;direction:rtl; text-align:center; "><tbody>';
					$(scope.appData.iconCheck).each(function (i, v) {
						table += '<tr>';
						table += '<td><img height="auto" width="600" src="data:image/png;base64,' + v + '"></td>';
						table += '</tr>';
					})
					table += '</tbody></table>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';
					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: portrait;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					setTimeout(function () {
						objFrame.print();
						setTimeout(function () {
							jFrame.remove();
						}, 2000)
					}, (500));
				});
			}
		}
	}


	function exportsPrintExpMissingReportTable() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">לקוח</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">כרטיס</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">חודש הזנה אחרונה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סכום קבוע </th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.expenseMissingReportTable).each(function (i, val) {
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' +
							val.companyName
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							val.transTypeCatName
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							scope.accoConversions.getYearMont(val.date)
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							val.sum
							+ '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'פעולות שכיחות שלא הופיעו -' + 'בחודש' + ' ' + scope.monthexpens + ' ' + 'שנה' + ' ' + scope.yearexpens + ' -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelExpMissingReportTable() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var name_doch = 'פעולות שכיחות שלא הופיעו -' + 'בחודש' + ' ' + scope.monthexpens + ' ' + 'שנה' + ' ' + scope.yearexpens + ' -';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "לקוח",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "חודש הזנה אחרונה",
										"type": "header"
									},
									{
										"val": "סכום קבוע",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:D1");

					$(scope.appData.expenseMissingReportTable).each(function (i, val) {
						var rows = {
							"cell": [
								{
									val: getStringJson(val.companyName),
									type: "cell"
								},
								{
									val: getStringJson(val.transTypeCatName),
									type: "cell"
								},
								{
									val: scope.accoConversions.getYearMont(val.date),
									type: "cell"
								},
								{
									val: val.sum.toString(),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailExpMissingReportTable(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = scope.appData.nameDochForMail;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;

					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "לקוח",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "חודש הזנה אחרונה",
										"type": "header"
									},
									{
										"val": "סכום קבוע",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:D1");

					$(scope.appData.expenseMissingReportTable).each(function (i, val) {
						var rows = {
							"cell": [
								{
									val: getStringJson(val.companyName),
									type: "cell"
								},
								{
									val: getStringJson(val.transTypeCatName),
									type: "cell"
								},
								{
									val: scope.accoConversions.getYearMont(val.date),
									type: "cell"
								},
								{
									val: val.sum.toString(),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}


	function exportsPrintChangeExRepo() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">לקוח</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">כרטיס</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">חודש קודם</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סכום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">שינוי</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.expenseChangedReportTable).each(function (i, val) {
						var color = 'color: #ec3c66;';
						if (val.change.colorType == 'green') {
							color = 'color: #62b03f;';
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' +
							val.companyName
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							val.transTypeCatName
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							val.avgTotal
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							val.sum
							+ '</td>';
						table += '<td style="' + color + 'text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							val.change.numChange
							+ '</td>';
						table += '</tr>';
					});


					table += '</tbody></table>';
					var name_doch = 'כרטיסים שגדלו/קטנו מעל' + '  ' + scope.defaultsPrecentReports + '% ' + ' בחודש ' + scope.monthchanged + ' שנה ' + scope.yearchanged + ' - ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelChangeExRepo() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'כרטיסים שגדלו/קטנו מעל' + '  ' + scope.defaultsPrecentReports + '% ' + ' בחודש ' + scope.monthchanged + ' שנה ' + scope.yearchanged + ' - ';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "לקוח",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "חודש קודם",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "שינוי",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftRed",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftGreen",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:E1");

					$(scope.appData.expenseChangedReportTable).each(function (i, val) {
						var color = 'cellBorderLeftRed';
						if (val.change.colorType == 'green') {
							color = 'cellBorderLeftGreen';
						}

						var rows = {
							"cell": [
								{
									val: getStringJson(val.companyName),
									type: "cell"
								},
								{
									val: getStringJson(val.transTypeCatName),
									type: "cell"
								},
								{
									val: val.avgTotal.toString(),
									type: "cell"
								},
								{
									val: val.sum.toString(),
									type: "cell"
								},
								{
									val: val.change.numChange,
									type: color
								}
							]
						};
						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailChangeExRepo(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = scope.appData.nameDochForMail;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;

					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "לקוח",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "חודש קודם",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "שינוי",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftRed",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftGreen",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:E1");

					$(scope.appData.expenseChangedReportTable).each(function (i, val) {
						var color = 'cellBorderLeftRed';
						if (val.change.colorType == 'green') {
							color = 'cellBorderLeftGreen';
						}

						var rows = {
							"cell": [
								{
									val: getStringJson(val.companyName),
									type: "cell"
								},
								{
									val: getStringJson(val.transTypeCatName),
									type: "cell"
								},
								{
									val: val.avgTotal.toString(),
									type: "cell"
								},
								{
									val: val.sum.toString(),
									type: "cell"
								},
								{
									val: val.change.numChange,
									type: color
								}
							]
						};
						data.rows.push(rows);
					});
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}


	function exportsPrintTypereport() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">שם חברה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סה״כ</th>';

					$(scope.appData.typing.months).each(function (i, val) {
						table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">' + scope.accoConversions.getDayMonthGraph(val) + '</th>';
					})
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.itemsAllReport).each(function (i, val) {
						table += '<tr>';
						for (var x in val) {
							if (x.indexOf("name") !== -1) {
								table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' +
									val[x]
									+ '</td>';
							}
						}
						table += '</tr>';
					});
					table += '</tbody></table>';
					var name_doch = 'הקלדות מחודש' + '  ' + scope.fromMonthType + ' ' + ' שנה ' + scope.fromYearType + ' עד חודש ' + scope.toMonthType + ' שנה ' + scope.toYearType + ' - ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelTypereport() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'הקלדות מחודש' + '  ' + scope.fromMonthType + ' ' + ' שנה ' + scope.fromYearType + ' עד חודש ' + scope.toMonthType + ' שנה ' + scope.toYearType + ' - ';

					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "סה״כ",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftRed",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftGreen",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:E1");
					$(scope.appData.typing.months).each(function (i, val) {
						data.rows[1].cell.push({
							"val": scope.accoConversions.getDayMonthGraph(val),
							"type": "header"
						})
					})

					$(scope.appData.itemsAllReport).each(function (i, val) {
						var rows = {
							"cell": []
						};
						for (var x in val) {
							if (x.indexOf("name") !== -1) {
								rows.cell.push({
									val: getStringJson(val[x]),
									type: "cell"
								});
							}
						}
						data.rows.push(rows);
					});
					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailTypereport(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = scope.appData.nameDochForMail;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "סה״כ",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftRed",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftGreen",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20",
							"20"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:E1");
					$(scope.appData.typing.months).each(function (i, val) {
						data.rows[1].cell.push({
							"val": scope.accoConversions.getDayMonthGraph(val),
							"type": "header"
						})
					})

					$(scope.appData.itemsAllReport).each(function (i, val) {
						var rows = {
							"cell": []
						};
						for (var x in val) {
							if (x.indexOf("name") !== -1) {
								rows.cell.push({
									val: getStringJson(val[x]),
									type: "cell"
								});
							}
						}
						data.rows.push(rows);
					});
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}


	function exportsPrintDohMatch() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">שם חברה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">חודש</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סה״כ פעולות</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">לא מותאמות</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.itemsAllReportMatch).each(function (i, val) {
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' +
							val.COMPANY_NAME
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							scope.accoConversions.getDayMonthGraph(val.MONTH_ID)
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							val.PEULOT_COUNT
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							val.IMP_MATCH_COUNT
							+ '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';
					var name_doch = 'התאמות מחודש' + '  ' + scope.fromMonthMatch + ' ' + ' שנה ' + scope.fromYearMatch + ' עד חודש ' + scope.toMonthMatch + ' שנה ' + scope.toYearMatch + ' - ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));
				});
			}
		}
	}

	function exportsExcelDohMatch() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'התאמות מחודש' + '  ' + scope.fromMonthMatch + ' ' + ' שנה ' + scope.fromYearMatch + ' עד חודש ' + scope.toMonthMatch + ' שנה ' + scope.toYearMatch + ' - ';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "חודש",
										"type": "header"
									},
									{
										"val": "סה״כ פעולות",
										"type": "header"
									},
									{
										"val": "לא מותאמות",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"15",
							"15"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:D1");

					$(scope.appData.itemsAllReportMatch).each(function (i, val) {
						var rows = {
							"cell": [
								{
									val: getStringJson(val.COMPANY_NAME),
									type: "cell"
								},
								{
									val: scope.accoConversions.getDayMonthGraph(val.MONTH_ID),
									type: "cell"
								},
								{
									val: val.PEULOT_COUNT,
									type: "cell"
								},
								{
									val: val.IMP_MATCH_COUNT,
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailDohMatch(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = scope.appData.nameDochForMail;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;

					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "חודש",
										"type": "header"
									},
									{
										"val": "סה״כ פעולות",
										"type": "header"
									},
									{
										"val": "לא מותאמות",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"20",
							"15",
							"15"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:D1");

					$(scope.appData.itemsAllReportMatch).each(function (i, val) {
						var rows = {
							"cell": [
								{
									val: getStringJson(val.COMPANY_NAME),
									type: "cell"
								},
								{
									val: scope.accoConversions.getDayMonthGraph(val.MONTH_ID),
									type: "cell"
								},
								{
									val: val.PEULOT_COUNT,
									type: "cell"
								},
								{
									val: val.IMP_MATCH_COUNT,
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}


	function exportsPrintTasks() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">לינק</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תאריך יצירה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">נושא</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תאור</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">חברה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">חשבון</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תאריך סגירה</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.tasksView).each(function (i, val) {
						var DATE_CREATED = '&nbsp;', DRIVE_LINK = '&nbsp;', TASK_TITLE = '&nbsp;',
							TASK_DESC = '&nbsp;',
							COMPANY_NAME = '&nbsp;', ACCOUNT_NICKNAME = '&nbsp;', CLOSE_DATE = '&nbsp;';
						if (val.DATE_CREATED !== null) {
							DATE_CREATED = val.DATE_CREATED;
						}
						if (val.DRIVE_LINK !== null) {
							DRIVE_LINK = val.DRIVE_LINK;

						}
						if (val.TASK_TITLE !== null) {
							TASK_TITLE = val.TASK_TITLE;

						}
						if (val.TASK_DESC !== null) {
							TASK_DESC = val.TASK_DESC;

						}
						if (val.COMPANY_NAME !== null) {
							COMPANY_NAME = val.COMPANY_NAME;

						}
						if (val.ACCOUNT_NICKNAME !== null) {
							ACCOUNT_NICKNAME = val.ACCOUNT_NICKNAME;

						}
						if (val.CLOSE_DATE !== null) {
							CLOSE_DATE = val.CLOSE_DATE;

						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' +
							DRIVE_LINK
							+ '</td>';

						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							DATE_CREATED
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TASK_TITLE
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TASK_DESC
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							COMPANY_NAME
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							ACCOUNT_NICKNAME
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							CLOSE_DATE
							+ '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח משימות' + ' -' + scope.nameUser(scope.appData.tasksObj.usersWork) + ', סוג משימה: ' + scope.nameTasks(scope.appData.tasksObj.usersWork_tasks_type) + ', סטטוס משימה: ' + scope.nameStates(scope.appData.tasksObj.usersWork_states);

					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelTasks() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="border-bottom:1px solid rgb(214, 205, 205); direction:rtl; text-align:right; "><thead><tr style="color: #fff;font: bold 12px arial;font-style: italic;">';
					table += '<th style="background:rgb(40,94,160)">לינק</th>';
					table += '<th style="background:rgb(40,94,160)">תאריך יצירה</th>';
					table += '<th style="background:rgb(40,94,160)">נושא</th>';
					table += '<th style="background:rgb(40,94,160)">תאור</th>';
					table += '<th style="background:rgb(40,94,160)">חברה</th>';
					table += '<th style="background:rgb(40,94,160)">חשבון</th>';
					table += '<th style="background:rgb(40,94,160)">תאריך סגירה</th>';


					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.tasksView).each(function (i, val) {
						var DATE_CREATED = '&nbsp;', DRIVE_LINK = '&nbsp;', TASK_TITLE = '&nbsp;',
							TASK_DESC = '&nbsp;',
							COMPANY_NAME = '&nbsp;', ACCOUNT_NICKNAME = '&nbsp;', CLOSE_DATE = '&nbsp;';
						if (val.DATE_CREATED !== null) {
							DATE_CREATED = val.DATE_CREATED;
						}
						if (val.DRIVE_LINK !== null) {
							DRIVE_LINK = val.DRIVE_LINK;

						}
						if (val.TASK_TITLE !== null) {
							TASK_TITLE = val.TASK_TITLE;

						}
						if (val.TASK_DESC !== null) {
							TASK_DESC = val.TASK_DESC;

						}
						if (val.COMPANY_NAME !== null) {
							COMPANY_NAME = val.COMPANY_NAME;

						}
						if (val.ACCOUNT_NICKNAME !== null) {
							ACCOUNT_NICKNAME = val.ACCOUNT_NICKNAME;

						}
						if (val.CLOSE_DATE !== null) {
							CLOSE_DATE = val.CLOSE_DATE;

						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + DRIVE_LINK + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + DATE_CREATED + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TASK_TITLE + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TASK_DESC + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + COMPANY_NAME + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + ACCOUNT_NICKNAME + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + CLOSE_DATE + '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח משימות' + ' -' + scope.nameUser(scope.appData.tasksObj.usersWork) + ', סוג משימה: ' + scope.nameTasks(scope.appData.tasksObj.usersWork_tasks_type) + ', סטטוס משימה: ' + scope.nameStates(scope.appData.tasksObj.usersWork_states);

					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';

					var excel = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div style="font-size:20px; font-family: arial;font-weight:bold; text-align:right;color:#666;">' + title + '</div>' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</body></html>';

					$('#ReportTableData').remove();

					$('body').prepend("<form method='post' action='https://php.bizibox.biz/exporttoexcel.php' style='display:block' id='ReportTableData'><textarea name='tableData'>" + excel + "</textarea></form>");

					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailTasks() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="border-bottom:1px solid rgb(214, 205, 205); direction:rtl; text-align:right; "><thead><tr style="color: #fff;font: bold 12px arial;font-style: italic;">';
					table += '<th style="background:rgb(40,94,160)">לינק</th>';
					table += '<th style="background:rgb(40,94,160)">תאריך יצירה</th>';
					table += '<th style="background:rgb(40,94,160)">נושא</th>';
					table += '<th style="background:rgb(40,94,160)">תאור</th>';
					table += '<th style="background:rgb(40,94,160)">חברה</th>';
					table += '<th style="background:rgb(40,94,160)">חשבון</th>';
					table += '<th style="background:rgb(40,94,160)">תאריך סגירה</th>';


					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.tasksView).each(function (i, val) {
						var DATE_CREATED = '&nbsp;', DRIVE_LINK = '&nbsp;', TASK_TITLE = '&nbsp;',
							TASK_DESC = '&nbsp;',
							COMPANY_NAME = '&nbsp;', ACCOUNT_NICKNAME = '&nbsp;', CLOSE_DATE = '&nbsp;';
						if (val.DATE_CREATED !== null) {
							DATE_CREATED = val.DATE_CREATED;
						}
						if (val.DRIVE_LINK !== null) {
							DRIVE_LINK = val.DRIVE_LINK;

						}
						if (val.TASK_TITLE !== null) {
							TASK_TITLE = val.TASK_TITLE;

						}
						if (val.TASK_DESC !== null) {
							TASK_DESC = val.TASK_DESC;

						}
						if (val.COMPANY_NAME !== null) {
							COMPANY_NAME = val.COMPANY_NAME;

						}
						if (val.ACCOUNT_NICKNAME !== null) {
							ACCOUNT_NICKNAME = val.ACCOUNT_NICKNAME;

						}
						if (val.CLOSE_DATE !== null) {
							CLOSE_DATE = val.CLOSE_DATE;

						}

						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + DRIVE_LINK + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + DATE_CREATED + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TASK_TITLE + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TASK_DESC + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + COMPANY_NAME + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + ACCOUNT_NICKNAME + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + CLOSE_DATE + '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח משימות' + ' -' + scope.nameUser(scope.appData.tasksObj.usersWork) + ', סוג משימה: ' + scope.nameTasks(scope.appData.tasksObj.usersWork_tasks_type) + ', סטטוס משימה: ' + scope.nameStates(scope.appData.tasksObj.usersWork_states);

					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</body></html>';

					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;

					var dataExcel = {
						'title': name_doch,
						'adress': scope.mail,
						'email': dataArr,
						'name_roh': name_roh,
						'name_doch': name_doch,
						'name_company': name_company
					};
					scope.sending(dataExcel);
				});
			}
		}
	}


	function exportsPrintQaitrot() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">ת. טעינה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">ת. פעולה </th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תיאור פעולה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">אסמכתא</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סכום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">זכות/חובה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">קוד פעולה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">יתרה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">&nbsp;</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.qa_itrot_get_banktrans).each(function (i, val) {
						var LOAD_DATE = '&nbsp;', TRANS_DATE = '&nbsp;', TRANS_DESC_AZONLY = '&nbsp;',
							ASMACHTA = '&nbsp;', TOTAL = '&nbsp;', IND_HOVA = '&nbsp;', KOD_PEULA = '&nbsp;',
							ITRA = '&nbsp;', LAST_EXPORT_DATE = '&nbsp;';
						if (val.LOAD_DATE !== null) {
							LOAD_DATE = val.LOAD_DATE;
						}
						if (val.TRANS_DATE !== null) {
							TRANS_DATE = val.TRANS_DATE;
						}
						if (val.TRANS_DESC_AZONLY !== null) {
							TRANS_DESC_AZONLY = val.TRANS_DESC_AZONLY;
						}
						if (val.ASMACHTA !== null) {
							ASMACHTA = val.ASMACHTA;
						}
						if (val.TOTAL !== null) {
							TOTAL = val.TOTAL;
						}
						if (val.IND_HOVA !== null) {
							IND_HOVA = val.IND_HOVA;
						}
						if (val.KOD_PEULA !== null) {
							KOD_PEULA = val.KOD_PEULA;
						}
						if (val.ITRA !== null) {
							ITRA = val.ITRA;
						}
						if (val.LAST_EXPORT_DATE !== null) {
							LAST_EXPORT_DATE = 'יוצא לחשבשבת';
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' +
							LOAD_DATE
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TRANS_DATE
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TRANS_DESC_AZONLY
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							ASMACHTA
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TOTAL
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							IND_HOVA
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							KOD_PEULA
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							ITRA
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							LAST_EXPORT_DATE
							+ '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח חלונות' + ' - ' + scope.appData.qa_itrot_list_row.COMPANY_NAME + ', ' + 'מס׳ חשבון: ' + scope.appData.qa_itrot_list_row.BANK_ACCOUNT_ID;

					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';


					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelQaitrot() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="border-bottom:1px solid rgb(214, 205, 205); direction:rtl; text-align:right; "><thead><tr style="color: #fff;font: bold 12px arial;font-style: italic;">';
					table += '<th style="background:rgb(40,94,160)">ת. טעינה</th>';
					table += '<th style="background:rgb(40,94,160)">ת. פעולה </th>';
					table += '<th style="background:rgb(40,94,160)">תיאור פעולה</th>';
					table += '<th style="background:rgb(40,94,160)">אסמכתא</th>';
					table += '<th style="background:rgb(40,94,160)">סכום</th>';
					table += '<th style="background:rgb(40,94,160)">זכות/חובה</th>';
					table += '<th style="background:rgb(40,94,160)">קוד פעולה</th>';
					table += '<th style="background:rgb(40,94,160)">יתרה</th>';
					table += '<th style="background:rgb(40,94,160)">&nbsp;</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.qa_itrot_get_banktrans).each(function (i, val) {
						var LOAD_DATE = '&nbsp;', TRANS_DATE = '&nbsp;', TRANS_DESC_AZONLY = '&nbsp;',
							ASMACHTA = '&nbsp;', TOTAL = '&nbsp;', IND_HOVA = '&nbsp;', KOD_PEULA = '&nbsp;',
							ITRA = '&nbsp;', LAST_EXPORT_DATE = '&nbsp;';
						if (val.LOAD_DATE !== null) {
							LOAD_DATE = val.LOAD_DATE;
						}
						if (val.TRANS_DATE !== null) {
							TRANS_DATE = val.TRANS_DATE;
						}
						if (val.TRANS_DESC_AZONLY !== null) {
							TRANS_DESC_AZONLY = val.TRANS_DESC_AZONLY;
						}
						if (val.ASMACHTA !== null) {
							ASMACHTA = val.ASMACHTA;
						}
						if (val.TOTAL !== null) {
							TOTAL = val.TOTAL;
						}
						if (val.IND_HOVA !== null) {
							IND_HOVA = val.IND_HOVA;
						}
						if (val.KOD_PEULA !== null) {
							KOD_PEULA = val.KOD_PEULA;
						}
						if (val.ITRA !== null) {
							ITRA = val.ITRA;
						}
						if (val.LAST_EXPORT_DATE !== null) {
							LAST_EXPORT_DATE = 'יוצא לחשבשבת';
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + LOAD_DATE + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TRANS_DATE + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TRANS_DESC_AZONLY + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + ASMACHTA + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TOTAL + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + IND_HOVA + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + KOD_PEULA + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + ITRA + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + LAST_EXPORT_DATE + '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח חלונות' + ' - ' + scope.appData.qa_itrot_list_row.COMPANY_NAME + ', ' + 'מס׳ חשבון: ' + scope.appData.qa_itrot_list_row.BANK_ACCOUNT_ID;

					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';

					var excel = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div style="font-size:20px; font-family: arial;font-weight:bold; text-align:right;color:#666;">' + title + '</div>' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</body></html>';

					$('#ReportTableData').remove();

					$('body').prepend("<form method='post' action='https://php.bizibox.biz/exporttoexcel.php' style='display:block' id='ReportTableData'><textarea name='tableData'>" + excel + "</textarea></form>");

					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailQaitrot() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="border-bottom:1px solid rgb(214, 205, 205); direction:rtl; text-align:right; "><thead><tr style="color: #fff;font: bold 12px arial;font-style: italic;">';
					table += '<th style="background:rgb(40,94,160)">ת. טעינה</th>';
					table += '<th style="background:rgb(40,94,160)">ת. פעולה </th>';
					table += '<th style="background:rgb(40,94,160)">תיאור פעולה</th>';
					table += '<th style="background:rgb(40,94,160)">אסמכתא</th>';
					table += '<th style="background:rgb(40,94,160)">סכום</th>';
					table += '<th style="background:rgb(40,94,160)">זכות/חובה</th>';
					table += '<th style="background:rgb(40,94,160)">קוד פעולה</th>';
					table += '<th style="background:rgb(40,94,160)">יתרה</th>';
					table += '<th style="background:rgb(40,94,160)">&nbsp;</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.qa_itrot_get_banktrans).each(function (i, val) {
						var LOAD_DATE = '&nbsp;', TRANS_DATE = '&nbsp;', TRANS_DESC_AZONLY = '&nbsp;',
							ASMACHTA = '&nbsp;', TOTAL = '&nbsp;', IND_HOVA = '&nbsp;', KOD_PEULA = '&nbsp;',
							ITRA = '&nbsp;', LAST_EXPORT_DATE = '&nbsp;';
						if (val.LOAD_DATE !== null) {
							LOAD_DATE = val.LOAD_DATE;
						}
						if (val.TRANS_DATE !== null) {
							TRANS_DATE = val.TRANS_DATE;
						}
						if (val.TRANS_DESC_AZONLY !== null) {
							TRANS_DESC_AZONLY = val.TRANS_DESC_AZONLY;
						}
						if (val.ASMACHTA !== null) {
							ASMACHTA = val.ASMACHTA;
						}
						if (val.TOTAL !== null) {
							TOTAL = val.TOTAL;
						}
						if (val.IND_HOVA !== null) {
							IND_HOVA = val.IND_HOVA;
						}
						if (val.KOD_PEULA !== null) {
							KOD_PEULA = val.KOD_PEULA;
						}
						if (val.ITRA !== null) {
							ITRA = val.ITRA;
						}
						if (val.LAST_EXPORT_DATE !== null) {
							LAST_EXPORT_DATE = 'יוצא לחשבשבת';
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + LOAD_DATE + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TRANS_DATE + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TRANS_DESC_AZONLY + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + ASMACHTA + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + TOTAL + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + IND_HOVA + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + KOD_PEULA + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;">' + ITRA + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); font-weight: normal;">' + LAST_EXPORT_DATE + '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח חלונות' + ' - ' + scope.appData.qa_itrot_list_row.COMPANY_NAME + ', ' + 'מס׳ חשבון: ' + scope.appData.qa_itrot_list_row.BANK_ACCOUNT_ID;

					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ,' + scope.appData.defMonth.full_name + '</td>';
					var dataArr = '<html><body style=" background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</body></html>';

					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;

					var dataExcel = {
						'title': name_doch,
						'adress': scope.mail,
						'email': dataArr,
						'name_roh': name_roh,
						'name_doch': name_doch,
						'name_company': name_company
					};
					scope.sending(dataExcel);
				});
			}
		}
	}


	function exportsPrintMehuad() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="direction: rtl;text-align: right;"> <tr> <td> <table> <tr> <td>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> </tr> </table> <table style="border: 1px solid #c6c6c6;background: #f9f9f9;text-align: center;color: #576066 !important;border-bottom: none;"> <tr> <th style="color: #5a5e61;background: #f9f9f9;">תאריך </th> </tr>';
					$(scope.appData.tazrimMeuhad).each(function (i, val) {
						table += '<tr> <td style="border-bottom: 1px solid #d4d4d4;background: #fff;">';
						table += val.day_id;
						table += '</td></tr>';
					});
					table += '</table></td>';

					table += '<td><table style="border: 1px solid #c6c6c6;background: #f9f9f9;text-align: center;color: #576066 !important;border-bottom: none;"><tr>';
					table += '<th colspan="4">';
					table += "כל הבנקים";
					table += '</th>';
					table += '</tr><tr>';
					table += '<th colspan="2" style="text-align: center;">יתרת פתיחה </th>';
					table += '<th colspan="2" style="text-align: center;direction: ltr;"><span>' + scope.round2Fixed(scope.appData.selectedCompany.accounts.total_opening_balance) + '</span></th>';
					table += '</tr><tr>';
					table += '<th colspan="2" style="text-align: center;"> מסגרת אשראי </th> <th colspan="2" style="text-align: center;direction: ltr;"> <span>' + scope.round2Fixed(scope.appData.selectedCompany.accounts.total_credit_facility) + '</span> </th>';
					table += '</tr><tr><td colspan="4">&nbsp;</td></tr>';
					table += '<tr><th style="background: #fdfdfd;border-bottom: 1px solid #f0f0f0;"> הכנסה </th> <th style="background: #fdfdfd;border-bottom: 1px solid #f0f0f0;"> הוצאה </th> <th style="background: #fdfdfd;border-bottom: 1px solid #f0f0f0;"> יתרה </th> <th style="background: #fdfdfd;border-bottom: 1px solid #f0f0f0;"> יתרה לשימוש </th> </tr>';
					$(scope.appData.tazrimMeuhad).each(function (i, val) {
						$(val.rows).each(function (ind, v) {
							if (v.company_account_id == null) {
								var color = '#576066';
								if (v.hariga > 0) {
									var color = '#62b03f';
								}
								if (v.hariga < 0) {
									var color = '#ec3c66';
								}
								table += '<tr>';
								table += '<td style="direction: ltr;background: #fdfdfd;border-bottom: 1px solid #f0f0f0;text-align: center;">';
								table += scope.round2Fixed(v.total_hacnasot.content)
								table += '</td>';
								table += '<td style="direction: ltr;background: #fdfdfd;border-bottom: 1px solid #f0f0f0;text-align: center;">';
								table += scope.round2Fixed(v.total_hozaot.content)
								table += '</td>';
								table += '<td style="direction: ltr;background: #fdfdfd;border-bottom: 1px solid #f0f0f0;text-align: center;">';
								table += scope.round2Fixed(v.total_itra)
								table += '</td>';
								table += '<td style="direction: ltr;text-align: center;background: #fdfdfd;border-bottom: 1px solid #f0f0f0; color:' + color + '">';
								table += scope.round2Fixed(v.hariga)
								table += '</td>';
								table += '</tr>';
							}
						});
					});
					table += '</table></td><td>&nbsp;</td>';

					if (scope.appData.selectedCompany.accounts.bank_account_list) {
						$(scope.appData.selectedCompany.accounts.bank_account_list).each(function (indx, values) {
							if (values.isExists) {
								table += '<td><table style="border: 1px solid #c6c6c6;background: #f9f9f9;text-align: center;color: #576066 !important;border-bottom: none;"><tr>';
								table += '<th colspan="4">';
								table += values.company_account_nickname;
								table += '</th>';
								table += '</tr><tr>';
								table += '<th colspan="2" style="text-align: center;">יתרת פתיחה </th>';
								table += '<th colspan="2" style="direction: ltr;text-align: center;"><span>' + scope.round2Fixed(values.opening_balance) + '</span></th>';
								table += '</tr><tr>';
								table += '<th colspan="2" style="text-align: center;"> מסגרת אשראי </th> <th colspan="2" style="direction: ltr;"> <span>' + scope.round2Fixed(values.credit_facility) + '</span> </th>';
								table += '</tr><tr><td colspan="4">&nbsp;</td></tr>';
								table += '<tr><th style="background: #fdfdfd;border-bottom: 1px solid #f0f0f0;"> הכנסה </th> <th style="background: #fdfdfd;border-bottom: 1px solid #f0f0f0;"> הוצאה </th> <th style="background: #fdfdfd;border-bottom: 1px solid #f0f0f0;"> יתרה </th> <th style="background: #fdfdfd;border-bottom: 1px solid #f0f0f0;"> יתרה לשימוש </th> </tr>';
								$(scope.appData.tazrimMeuhad).each(function (i, val) {
									$(val.rows).each(function (ind, v) {
										if (v.company_account_id == values.company_account_id) {
											var color = '#576066';
											if (v.hariga > 0) {
												var color = '#62b03f';
											}
											if (v.hariga < 0) {
												var color = '#ec3c66';
											}
											table += '<tr>'
											table += '<td style="text-align: center;background: #fdfdfd;border-bottom: 1px solid #f0f0f0;direction: ltr;">';
											table += scope.round2Fixed(v.total_hacnasot.content)
											table += '</td>';
											table += '<td style="text-align: center;background: #fdfdfd;border-bottom: 1px solid #f0f0f0;direction: ltr;">';
											table += scope.round2Fixed(v.total_hozaot.content)
											table += '</td>';
											table += '<td style="text-align: center;background: #fdfdfd;border-bottom: 1px solid #f0f0f0;direction: ltr;">';
											table += scope.round2Fixed(v.total_itra)
											table += '</td>';
											table += '<td style="text-align: center;direction: ltr;background: #fdfdfd;border-bottom: 1px solid #f0f0f0; color:' + color + '">';
											table += scope.round2Fixed(v.hariga)
											table += '</td>';
											table += '</tr>';
										}
									});
								});
								table += '</table></td><td>&nbsp;</td>';
								if (indx % 3 == 0) {
									table += '</tr></table>';
									table += '<table style="direction: rtl;text-align: right;"> <tr> <td> <table> <tr> <td>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> </tr> </table> ';
									if (indx + 1 < scope.appData.selectedCompany.accounts.bank_account_list.length) {
										table += '<table style="border: 1px solid #c6c6c6;background: #f9f9f9;text-align: center;color: #576066 !important;border-bottom: none;"> <tr> <th style="color: #5a5e61;background: #f9f9f9;">תאריך </th> </tr>';
										$(scope.appData.tazrimMeuhad).each(function (i, val) {
											table += '<tr> <td style="border-bottom: 1px solid #d4d4d4;background: #fff;">';
											table += val.day_id;
											table += '</td></tr>';
										});
										table += '</table></td>';
									}
								}
							}
						});
					}

					table += '</tr></table>';

					var name_doch = 'תזרים מאוחד - ' + scope.appData.selectedCompany.companyName + ' ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';
					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: portrait;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));
				});
			}
		}
	}

	function exportsExcelMehuad() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {

				$(element).on('click', function () {
					var name_doch = 'תזרים מאוחד - ' + scope.appData.selectedCompany.companyName + ' ';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [],
						styles: [
							{
								"type": "cellBoldTitle",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": false,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "5a5e61",
								"fillForegroundColor": "f9f9f9",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellTitleAll",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"color": "5a5e61",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleRight",
								"borderRight": true,
								"borderRightColor": "f9f9f9",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "f9f9f9",
								"borderBottom": true,
								"borderBottomColor": "f9f9f9",
								"bold": true,
								"fontSize": 11,
								"color": "5a5e61",
								"fillForegroundColor": "f9f9f9",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "f9f9f9",
								"borderTop": true,
								"borderTopColor": "f9f9f9",
								"borderBottom": true,
								"borderBottomColor": "f9f9f9",
								"bold": true,
								"fontSize": 11,
								"color": "5a5e61",
								"fillForegroundColor": "f9f9f9",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellEmpty",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "ffffff",
								"borderBottom": true,
								"borderBottomColor": "ffffff",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellDates",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": false,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "d4d4d4",
								"bold": false,
								"fontSize": 11,
								"color": "5a5e61",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleColm",
								"borderRight": true,
								"borderRightColor": "fdfdfd",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": true,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleColmLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": true,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleColmRigth",
								"borderRight": true,
								"borderRightColor": "fdfdfd",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": true,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColm",
								"borderRight": true,
								"borderRightColor": "fdfdfd",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColmLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColmRigth",
								"borderRight": true,
								"borderRightColor": "fdfdfd",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColmLeftRed",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColmLeftGreen",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"13",
							"14",
							"14",
							"14",
							"14",
							"3"
						],
						senderMail: []
					};

					data.rows.push({
						"cell": [
							{
								"val": "",
								"type": "cellEmpty"
							}
						]
					}, {
						"cell": [
							{
								"val": "",
								"type": "cellEmpty"
							}
						]
					}, {
						"cell": [
							{
								"val": "",
								"type": "cellEmpty"
							}
						]
					}, {
						"cell": [
							{
								"val": "",
								"type": "cellEmpty"
							}
						]
					}, {
						"cell": [
							{
								"val": "תאריך",
								"type": "cellBoldTitle"
							}
						]
					});

					$(scope.appData.tazrimMeuhad).each(function (i, val) {
						var rows = {
							"cell": [
								{
									"val": val.day_id,
									"type": "cellDates"
								}
							]
						};
						data.rows.push(rows);
					});

					data.rows[0].cell.push({
						"val": "כל הבנקים",
						"type": "cellBoldTitle"
					}, {
						"val": "",
						"type": "cellBoldTitle"
					}, {
						"val": "",
						"type": "cellBoldTitle"
					}, {
						"val": "",
						"type": "cellBoldTitle"
					}, {
						"val": "",
						"type": "cellEmpty"
					});
					data.mergeCells.push("B1:E1");
					data.rows[1].cell.push({
						"val": "יתרת פתיחה",
						"type": "cellBoldTitleRight"
					}, {
						"val": "",
						"type": "cellBoldTitleRight"
					}, {
						"val": scope.round2Fixed(scope.appData.selectedCompany.accounts.total_opening_balance),
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellEmpty"
					});
					data.mergeCells.push("B2:C2");
					data.mergeCells.push("D2:E2");

					data.rows[2].cell.push({
						"val": "מסגרת אשראי",
						"type": "cellBoldTitleRight"
					}, {
						"val": "",
						"type": "cellBoldTitleRight"
					}, {
						"val": scope.round2Fixed(scope.appData.selectedCompany.accounts.total_credit_facility),
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellEmpty"
					});
					data.mergeCells.push("B3:C3");
					data.mergeCells.push("D3:E3");

					data.rows[3].cell.push({
						"val": "",
						"type": "cellBoldTitleRight"
					}, {
						"val": "",
						"type": "cellBoldTitleRight"
					}, {
						"val": "",
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellEmpty"
					});
					data.mergeCells.push("B4:E4");

					data.rows[4].cell.push({
						"val": "הכנסה",
						"type": "cellBoldTitleColmRigth"
					}, {
						"val": "הוצאה",
						"type": "cellBoldTitleColm"
					}, {
						"val": "יתרה",
						"type": "cellBoldTitleColm"
					}, {
						"val": "יתרה לשימוש",
						"type": "cellBoldTitleColmLeft"
					}, {
						"val": "",
						"type": "cellEmpty"
					});

					$(scope.appData.tazrimMeuhad).each(function (i, val) {
						$(val.rows).each(function (ind, v) {
							if (v.company_account_id == null) {
								var color = 'cellColmLeft';
								if (v.hariga > 0) {
									color = 'cellColmLeftGreen';
								}
								if (v.hariga < 0) {
									color = 'cellColmLeftRed';
								}
								data.rows[5 + i].cell.push({
									"val": scope.round2Fixed(v.total_hacnasot.content),
									"type": "cellColmRigth"
								}, {
									"val": scope.round2Fixed(v.total_hozaot.content),
									"type": "cellColm"
								}, {
									"val": scope.round2Fixed(v.total_itra),
									"type": "cellColm"
								}, {
									"val": scope.round2Fixed(v.hariga),
									"type": color
								}, {
									"val": "",
									"type": "cellEmpty"
								});
							}
						});
					});

					if (scope.appData.selectedCompany.accounts.bank_account_list) {
						$(scope.appData.selectedCompany.accounts.bank_account_list).each(function (indx, values) {
							if (values.isExists) {
								data.rows[0].cell.push({
									"val": values.company_account_nickname,
									"type": "cellBoldTitle"
								}, {
									"val": "",
									"type": "cellBoldTitle"
								}, {
									"val": "",
									"type": "cellBoldTitle"
								}, {
									"val": "",
									"type": "cellBoldTitle"
								}, {
									"val": "",
									"type": "cellEmpty"
								});
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[0].cell.length - 4) + "1:" + scope.accoConversions.getABCCell(data.rows[0].cell.length - 1) + "1");

								data.rows[1].cell.push({
									"val": "יתרת פתיחה",
									"type": "cellBoldTitleRight"
								}, {
									"val": "",
									"type": "cellBoldTitleRight"
								}, {
									"val": scope.round2Fixed(values.opening_balance),
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellEmpty"
								});
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[1].cell.length - 4) + "2:" + scope.accoConversions.getABCCell(data.rows[1].cell.length - 3) + "2");
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[1].cell.length - 2) + "2:" + scope.accoConversions.getABCCell(data.rows[1].cell.length - 1) + "2");

								data.rows[2].cell.push({
									"val": "מסגרת אשראי",
									"type": "cellBoldTitleRight"
								}, {
									"val": "",
									"type": "cellBoldTitleRight"
								}, {
									"val": scope.round2Fixed(values.credit_facility),
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellEmpty"
								});
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[2].cell.length - 4) + "3:" + scope.accoConversions.getABCCell(data.rows[2].cell.length - 3) + "3");
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[2].cell.length - 2) + "3:" + scope.accoConversions.getABCCell(data.rows[2].cell.length - 1) + "3");

								data.rows[3].cell.push({
									"val": "",
									"type": "cellBoldTitleRight"
								}, {
									"val": "",
									"type": "cellBoldTitleRight"
								}, {
									"val": "",
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellEmpty"
								});
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[3].cell.length - 4) + "4:" + scope.accoConversions.getABCCell(data.rows[3].cell.length - 1) + "4");

								data.rows[4].cell.push({
									"val": "הכנסה",
									"type": "cellBoldTitleColmRigth"
								}, {
									"val": "הוצאה",
									"type": "cellBoldTitleColm"
								}, {
									"val": "יתרה",
									"type": "cellBoldTitleColm"
								}, {
									"val": "יתרה לשימוש",
									"type": "cellBoldTitleColmLeft"
								}, {
									"val": "",
									"type": "cellEmpty"
								});

								$(scope.appData.tazrimMeuhad).each(function (i, val) {
									$(val.rows).each(function (ind, v) {
										if (v.company_account_id == values.company_account_id) {
											var color = 'cellColmLeft';
											if (v.hariga > 0) {
												color = 'cellColmLeftGreen';
											}
											if (v.hariga < 0) {
												color = 'cellColmLeftRed';
											}

											data.rows[5 + i].cell.push({
												"val": scope.round2Fixed(v.total_hacnasot.content),
												"type": "cellColmRigth"
											}, {
												"val": scope.round2Fixed(v.total_hozaot.content),
												"type": "cellColm"
											}, {
												"val": scope.round2Fixed(v.total_itra),
												"type": "cellColm"
											}, {
												"val": scope.round2Fixed(v.hariga),
												"type": color
											}, {
												"val": "",
												"type": "cellEmpty"
											});
										}
									});
								});

								data.widthCells.push(
									"14",
									"14",
									"14",
									"14",
									"3")
							}
						});
					}

					data.rows.push({
						"cell": [
							{
								"val": getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
								"type": "cellTitleAll"
							}
						]
					});
					data.mergeCells.push("A" + data.rows.length + ":F" + data.rows.length);

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailMehuad(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = 'תזרים מאוחד - ' + scope.appData.selectedCompany.companyName + ' ';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [],
						styles: [
							{
								"type": "cellBoldTitle",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": false,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 11,
								"color": "5a5e61",
								"fillForegroundColor": "f9f9f9",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellTitleAll",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 13,
								"color": "5a5e61",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleRight",
								"borderRight": true,
								"borderRightColor": "f9f9f9",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "f9f9f9",
								"borderBottom": true,
								"borderBottomColor": "f9f9f9",
								"bold": true,
								"fontSize": 11,
								"color": "5a5e61",
								"fillForegroundColor": "f9f9f9",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "f9f9f9",
								"borderTop": true,
								"borderTopColor": "f9f9f9",
								"borderBottom": true,
								"borderBottomColor": "f9f9f9",
								"bold": true,
								"fontSize": 11,
								"color": "5a5e61",
								"fillForegroundColor": "f9f9f9",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellEmpty",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "ffffff",
								"borderBottom": true,
								"borderBottomColor": "ffffff",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellDates",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": false,
								"borderTopColor": "c6c6c6",
								"borderBottom": true,
								"borderBottomColor": "d4d4d4",
								"bold": false,
								"fontSize": 11,
								"color": "5a5e61",
								"fillForegroundColor": "ffffff",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleColm",
								"borderRight": true,
								"borderRightColor": "fdfdfd",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": true,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleColmLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": true,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldTitleColmRigth",
								"borderRight": true,
								"borderRightColor": "fdfdfd",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": true,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColm",
								"borderRight": true,
								"borderRightColor": "fdfdfd",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColmLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColmRigth",
								"borderRight": true,
								"borderRightColor": "fdfdfd",
								"borderLeft": true,
								"borderLeftColor": "c6c6c6",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "576066",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColmLeftRed",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellColmLeftGreen",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fdfdfd",
								"borderTop": true,
								"borderTopColor": "fdfdfd",
								"borderBottom": true,
								"borderBottomColor": "f0f0f0",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "fdfdfd",
								"alignment": "center",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"13",
							"14",
							"14",
							"14",
							"14",
							"3"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};

					data.rows.push({
						"cell": [
							{
								"val": "",
								"type": "cellEmpty"
							}
						]
					}, {
						"cell": [
							{
								"val": "",
								"type": "cellEmpty"
							}
						]
					}, {
						"cell": [
							{
								"val": "",
								"type": "cellEmpty"
							}
						]
					}, {
						"cell": [
							{
								"val": "",
								"type": "cellEmpty"
							}
						]
					}, {
						"cell": [
							{
								"val": "תאריך",
								"type": "cellBoldTitle"
							}
						]
					});

					$(scope.appData.tazrimMeuhad).each(function (i, val) {
						var rows = {
							"cell": [
								{
									"val": val.day_id,
									"type": "cellDates"
								}
							]
						};
						data.rows.push(rows);
					});

					data.rows[0].cell.push({
						"val": "כל הבנקים",
						"type": "cellBoldTitle"
					}, {
						"val": "",
						"type": "cellBoldTitle"
					}, {
						"val": "",
						"type": "cellBoldTitle"
					}, {
						"val": "",
						"type": "cellBoldTitle"
					}, {
						"val": "",
						"type": "cellEmpty"
					});
					data.mergeCells.push("B1:E1");
					data.rows[1].cell.push({
						"val": "יתרת פתיחה",
						"type": "cellBoldTitleRight"
					}, {
						"val": "",
						"type": "cellBoldTitleRight"
					}, {
						"val": scope.round2Fixed(scope.appData.selectedCompany.accounts.total_opening_balance),
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellEmpty"
					});
					data.mergeCells.push("B2:C2");
					data.mergeCells.push("D2:E2");

					data.rows[2].cell.push({
						"val": "מסגרת אשראי",
						"type": "cellBoldTitleRight"
					}, {
						"val": "",
						"type": "cellBoldTitleRight"
					}, {
						"val": scope.round2Fixed(scope.appData.selectedCompany.accounts.total_credit_facility),
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellEmpty"
					});
					data.mergeCells.push("B3:C3");
					data.mergeCells.push("D3:E3");

					data.rows[3].cell.push({
						"val": "",
						"type": "cellBoldTitleRight"
					}, {
						"val": "",
						"type": "cellBoldTitleRight"
					}, {
						"val": "",
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellBoldTitleLeft"
					}, {
						"val": "",
						"type": "cellEmpty"
					});
					data.mergeCells.push("B4:E4");

					data.rows[4].cell.push({
						"val": "הכנסה",
						"type": "cellBoldTitleColmRigth"
					}, {
						"val": "הוצאה",
						"type": "cellBoldTitleColm"
					}, {
						"val": "יתרה",
						"type": "cellBoldTitleColm"
					}, {
						"val": "יתרה לשימוש",
						"type": "cellBoldTitleColmLeft"
					}, {
						"val": "",
						"type": "cellEmpty"
					});

					$(scope.appData.tazrimMeuhad).each(function (i, val) {
						$(val.rows).each(function (ind, v) {
							if (v.company_account_id == null) {
								var color = 'cellColmLeft';
								if (v.hariga > 0) {
									color = 'cellColmLeftGreen';
								}
								if (v.hariga < 0) {
									color = 'cellColmLeftRed';
								}
								data.rows[5 + i].cell.push({
									"val": scope.round2Fixed(v.total_hacnasot.content),
									"type": "cellColmRigth"
								}, {
									"val": scope.round2Fixed(v.total_hozaot.content),
									"type": "cellColm"
								}, {
									"val": scope.round2Fixed(v.total_itra),
									"type": "cellColm"
								}, {
									"val": scope.round2Fixed(v.hariga),
									"type": color
								}, {
									"val": "",
									"type": "cellEmpty"
								});
							}
						});
					});

					if (scope.appData.selectedCompany.accounts.bank_account_list) {
						$(scope.appData.selectedCompany.accounts.bank_account_list).each(function (indx, values) {
							if (values.isExists) {
								data.rows[0].cell.push({
									"val": values.company_account_nickname,
									"type": "cellBoldTitle"
								}, {
									"val": "",
									"type": "cellBoldTitle"
								}, {
									"val": "",
									"type": "cellBoldTitle"
								}, {
									"val": "",
									"type": "cellBoldTitle"
								}, {
									"val": "",
									"type": "cellEmpty"
								});
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[0].cell.length - 4) + "1:" + scope.accoConversions.getABCCell(data.rows[0].cell.length - 1) + "1");

								data.rows[1].cell.push({
									"val": "יתרת פתיחה",
									"type": "cellBoldTitleRight"
								}, {
									"val": "",
									"type": "cellBoldTitleRight"
								}, {
									"val": scope.round2Fixed(values.opening_balance),
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellEmpty"
								});
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[1].cell.length - 4) + "2:" + scope.accoConversions.getABCCell(data.rows[1].cell.length - 3) + "2");
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[1].cell.length - 2) + "2:" + scope.accoConversions.getABCCell(data.rows[1].cell.length - 1) + "2");

								data.rows[2].cell.push({
									"val": "מסגרת אשראי",
									"type": "cellBoldTitleRight"
								}, {
									"val": "",
									"type": "cellBoldTitleRight"
								}, {
									"val": scope.round2Fixed(values.credit_facility),
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellEmpty"
								});
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[2].cell.length - 4) + "3:" + scope.accoConversions.getABCCell(data.rows[2].cell.length - 3) + "3");
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[2].cell.length - 2) + "3:" + scope.accoConversions.getABCCell(data.rows[2].cell.length - 1) + "3");

								data.rows[3].cell.push({
									"val": "",
									"type": "cellBoldTitleRight"
								}, {
									"val": "",
									"type": "cellBoldTitleRight"
								}, {
									"val": "",
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellBoldTitleLeft"
								}, {
									"val": "",
									"type": "cellEmpty"
								});
								data.mergeCells.push(scope.accoConversions.getABCCell(data.rows[3].cell.length - 4) + "4:" + scope.accoConversions.getABCCell(data.rows[3].cell.length - 1) + "4");

								data.rows[4].cell.push({
									"val": "הכנסה",
									"type": "cellBoldTitleColmRigth"
								}, {
									"val": "הוצאה",
									"type": "cellBoldTitleColm"
								}, {
									"val": "יתרה",
									"type": "cellBoldTitleColm"
								}, {
									"val": "יתרה לשימוש",
									"type": "cellBoldTitleColmLeft"
								}, {
									"val": "",
									"type": "cellEmpty"
								});

								$(scope.appData.tazrimMeuhad).each(function (i, val) {
									$(val.rows).each(function (ind, v) {
										if (v.company_account_id == values.company_account_id) {
											var color = 'cellColmLeft';
											if (v.hariga > 0) {
												color = 'cellColmLeftGreen';
											}
											if (v.hariga < 0) {
												color = 'cellColmLeftRed';
											}

											data.rows[5 + i].cell.push({
												"val": scope.round2Fixed(v.total_hacnasot.content),
												"type": "cellColmRigth"
											}, {
												"val": scope.round2Fixed(v.total_hozaot.content),
												"type": "cellColm"
											}, {
												"val": scope.round2Fixed(v.total_itra),
												"type": "cellColm"
											}, {
												"val": scope.round2Fixed(v.hariga),
												"type": color
											}, {
												"val": "",
												"type": "cellEmpty"
											});
										}
									});
								});

								data.widthCells.push(
									"14",
									"14",
									"14",
									"14",
									"3")
							}
						});
					}

					data.rows.push({
						"cell": [
							{
								"val": getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
								"type": "cellTitleAll"
							}
						]
					});
					data.mergeCells.push("A" + data.rows.length + ":F" + data.rows.length);
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}


	function exportsPrintRegularOp() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">שם הפעולה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סוג פעולה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סכום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">אמצעי תשלום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תדירות</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סוג עדכון</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.peulotKvuot).each(function (i, val) {
						var searchkey = '&nbsp;', ind_hova = 'הוצאה', avg_total = '&nbsp;', space = '&nbsp;',
							frequency = '&nbsp;';
						if (val.searchkey !== null) {
							searchkey = val.searchkey;
						}
						if (val.ind_hova == false) {
							ind_hova = 'הכנסה';
						}
						if (val.avg_total !== null) {
							avg_total = scope.getTotalComma(val.avg_total)
						}
						if (val.frequency !== null) {
							frequency = scope.accoConversions.getFrequency(val.frequency)
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' +
							searchkey
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							ind_hova
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							avg_total
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							space
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							frequency
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							space
							+ '</td>';
						table += '</tr>';
					});
					$(scope.appData.transkvuotHtmlGetlist).each(function (i, val) {
						var trans_name = '&nbsp;', ind_expense = 'הוצאה', next_total = '&nbsp;',
							payment_type_id = '&nbsp;', trans_frequency_id = '&nbsp;';
						if (val.trans_name !== null) {
							trans_name = val.trans_name;
						}
						if (val.ind_expense == 0) {
							ind_expense = 'הכנסה';
						}
						if (val.next_total !== null) {
							next_total = scope.getTotalComma(val.next_total)
						}
						if (val.payment_type_id !== null) {
							payment_type_id = scope.accoConversions.getClasification(val.payment_type_id)
						}
						if (val.trans_frequency_id !== null) {
							trans_frequency_id = scope.accoConversions.getFrequency(val.trans_frequency_id)
						}
						var auto_update_type = "";
						if (val.auto_update_type == 1) {
							auto_update_type += "ממוצע ";
						}
						auto_update_type += scope.accoConversions.getFrequencyAndUpdate(val.trans_frequency_id, val.auto_update_type);
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' +
							trans_name
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							ind_expense
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							next_total
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							payment_type_id
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							trans_frequency_id
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							auto_update_type
							+ '</td>';
						table += '</tr>';
					});

					table += '</tbody></table>';

					var name_doch = "דו״ח פעולות קבועות  - " + scope.appData.selectedCompany.companyName + ", חשבון: " + scope.appData.selectedItem.company_account_nickname;

					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';

					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelRegularOp() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = "דו״ח פעולות קבועות  - " + scope.appData.selectedCompany.companyName + ", חשבון: " + scope.appData.selectedItem.company_account_nickname;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								"cell": [
									{
										"val": "שם הפעולה",
										"type": "header"
									},
									{
										"val": "סוג פעולה",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "אמצעי תשלום",
										"type": "header"
									},
									{
										"val": "תדירות",
										"type": "header"
									},
									{
										"val": "סוג עדכון",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"12",
							"12",
							"18",
							"12",
							"16"
						],
						senderMail: []
					};
					data.mergeCells.push("A1:F1");
					$(scope.appData.peulotKvuot).each(function (i, val) {
						var searchkey = '', ind_hova = 'הוצאה', avg_total = '', space = '', frequency = '';
						if (val.searchkey !== null) {
							searchkey = val.searchkey;
						}
						if (val.ind_hova == false) {
							ind_hova = 'הכנסה';
						}
						if (val.avg_total !== null) {
							avg_total = scope.getTotalComma(val.avg_total)
						}
						if (val.frequency !== null) {
							frequency = scope.accoConversions.getFrequency(val.frequency)
						}

						var rows = {
							"cell": [
								{
									val: getStringJson(searchkey),
									type: "cellBold"
								},
								{
									val: getStringJson(ind_hova),
									type: "cellBold"
								},
								{
									val: avg_total,
									type: "cellBold"
								},
								{
									val: space,
									type: "cellBold"
								},
								{
									val: frequency,
									type: "cellBold"
								},
								{
									val: space,
									type: "cellBoldBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});
					$(scope.appData.transkvuotHtmlGetlist).each(function (i, val) {
						var trans_name = '', ind_expense = 'הוצאה', next_total = '', payment_type_id = '',
							trans_frequency_id = '';
						if (val.trans_name !== null) {
							trans_name = val.trans_name;
						}
						if (val.ind_expense == 0) {
							ind_expense = 'הכנסה';
						}
						if (val.next_total !== null) {
							next_total = scope.getTotalComma(val.next_total)
						}
						if (val.payment_type_id !== null) {
							payment_type_id = scope.accoConversions.getClasification(val.payment_type_id)
						}
						if (val.trans_frequency_id !== null) {
							trans_frequency_id = scope.accoConversions.getFrequency(val.trans_frequency_id)
						}
						var auto_update_type = "";
						if (val.auto_update_type == 1) {
							auto_update_type += "ממוצע ";
						}
						auto_update_type += scope.accoConversions.getFrequencyAndUpdate(val.trans_frequency_id, val.auto_update_type);


						var rows = {
							"cell": [
								{
									val: getStringJson(trans_name),
									type: "cell"
								},
								{
									val: getStringJson(ind_expense),
									type: "cell"
								},
								{
									val: next_total.toString(),
									type: "cell"
								},
								{
									val: payment_type_id,
									type: "cell"
								},
								{
									val: getStringJson(trans_frequency_id),
									type: "cell"
								},
								{
									val: auto_update_type,
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});
					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailRegularOp(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = " פעולות קבועות  - " + scope.appData.selectedCompany.companyName + ", חשבון: " + scope.appData.selectedItem.company_account_nickname;
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.mail == scope.appData.selectedCompany.mail) {
						name_company = scope.appData.selectedCompany.full_name;
					}
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								"cell": [
									{
										"val": "שם הפעולה",
										"type": "header"
									},
									{
										"val": "סוג פעולה",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "אמצעי תשלום",
										"type": "header"
									},
									{
										"val": "תדירות",
										"type": "header"
									},
									{
										"val": "סוג עדכון",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "151313",
								"borderBottom": true,
								"borderBottomColor": "151313",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							"20",
							"12",
							"12",
							"18",
							"12",
							"16"
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};

					data.mergeCells.push("A1:F1");
					$(scope.appData.peulotKvuot).each(function (i, val) {
						var searchkey = '', ind_hova = 'הוצאה', avg_total = '', space = '', frequency = '';
						if (val.searchkey !== null) {
							searchkey = val.searchkey;
						}
						if (val.ind_hova == false) {
							ind_hova = 'הכנסה';
						}
						if (val.avg_total !== null) {
							avg_total = scope.getTotalComma(val.avg_total)
						}
						if (val.frequency !== null) {
							frequency = scope.accoConversions.getFrequency(val.frequency)
						}

						var rows = {
							"cell": [
								{
									val: getStringJson(searchkey),
									type: "cellBold"
								},
								{
									val: getStringJson(ind_hova),
									type: "cellBold"
								},
								{
									val: avg_total,
									type: "cellBold"
								},
								{
									val: space,
									type: "cellBold"
								},
								{
									val: frequency,
									type: "cellBold"
								},
								{
									val: space,
									type: "cellBoldBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});
					$(scope.appData.transkvuotHtmlGetlist).each(function (i, val) {
						var trans_name = '', ind_expense = 'הוצאה', next_total = '', payment_type_id = '',
							trans_frequency_id = '';
						if (val.trans_name !== null) {
							trans_name = val.trans_name;
						}
						if (val.ind_expense == 0) {
							ind_expense = 'הכנסה';
						}
						if (val.next_total !== null) {
							next_total = scope.getTotalComma(val.next_total)
						}
						if (val.payment_type_id !== null) {
							payment_type_id = scope.accoConversions.getClasification(val.payment_type_id)
						}
						if (val.trans_frequency_id !== null) {
							trans_frequency_id = scope.accoConversions.getFrequency(val.trans_frequency_id)
						}
						var auto_update_type = "";
						if (val.auto_update_type == 1) {
							auto_update_type += "ממוצע ";
						}
						auto_update_type += scope.accoConversions.getFrequencyAndUpdate(val.trans_frequency_id, val.auto_update_type);


						var rows = {
							"cell": [
								{
									val: getStringJson(trans_name),
									type: "cell"
								},
								{
									val: getStringJson(ind_expense),
									type: "cell"
								},
								{
									val: next_total,
									type: "cell"
								},
								{
									val: payment_type_id,
									type: "cell"
								},
								{
									val: getStringJson(trans_frequency_id),
									type: "cell"
								},
								{
									val: auto_update_type,
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}


	function exportsPrintAccBill() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); "> שם חברה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">ח.פ.</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תאריך חיוב</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">כרטיס</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); "> סוג תשלום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); "> סכום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סטטוס</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.itemsAllBill).each(function (i, val) {
						var BILLING_ACCOUNT_COMPANY_NAME = '&nbsp;',
							BILLING_ACCOUNT_HP = '&nbsp;',
							PAYMENT_DATE = '&nbsp;',
							PAYMENT_TYPE_ID = '&nbsp;',
							EXTSP_CARDNUMBER5 = '&nbsp;',
							STATUS_DESC = '&nbsp;',
							SUMTOBILL = '&nbsp;';

						if (val.BILLING_ACCOUNT_COMPANY_NAME !== null) {
							BILLING_ACCOUNT_COMPANY_NAME = val.BILLING_ACCOUNT_COMPANY_NAME;
						}
						if (val.BILLING_ACCOUNT_HP !== null) {
							BILLING_ACCOUNT_HP = val.BILLING_ACCOUNT_HP;
						}
						if (val.PAYMENT_DATE !== null) {
							PAYMENT_DATE = val.PAYMENT_DATE;
						}
						if (val.EXTSP_CARDNUMBER5 !== null) {
							EXTSP_CARDNUMBER5 = val.EXTSP_CARDNUMBER5;
						}
						if (val.PAYMENT_TYPE_ID !== null) {
							PAYMENT_TYPE_ID = scope.accoConversions.getTypePaymentBiling(val.PAYMENT_TYPE_ID)
						}
						if (val.SUMTOBILL !== null) {
							SUMTOBILL = val.SUMTOBILL;
						}
						if (val.STATUS_DESC !== null) {
							STATUS_DESC = val.STATUS_DESC;
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' + BILLING_ACCOUNT_COMPANY_NAME + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							BILLING_ACCOUNT_HP
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							PAYMENT_DATE
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							EXTSP_CARDNUMBER5
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							PAYMENT_TYPE_ID
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							SUMTOBILL
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							STATUS_DESC
							+ '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח בילינג שוטף -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';

					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelAccBill() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'דו״ח בילינג שוטף -';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "ח.פ.",
										"type": "header"
									},
									{
										"val": "תאריך חיוב",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "סוג תשלום",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "סטטוס",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [],
						senderMail: []
					};
					data.mergeCells.push("A1:H1");

					$(scope.appData.itemsAllBill).each(function (i, val) {
						var BILLING_ACCOUNT_COMPANY_NAME = '',
							BILLING_ACCOUNT_HP = '',
							PAYMENT_DATE = '',
							PAYMENT_TYPE_ID = '',
							EXTSP_CARDNUMBER5 = '',
							STATUS_DESC = '',
							SUMTOBILL = '';

						if (val.BILLING_ACCOUNT_COMPANY_NAME !== null) {
							BILLING_ACCOUNT_COMPANY_NAME = val.BILLING_ACCOUNT_COMPANY_NAME;
						}
						if (val.BILLING_ACCOUNT_HP !== null) {
							BILLING_ACCOUNT_HP = val.BILLING_ACCOUNT_HP;
						}
						if (val.PAYMENT_DATE !== null) {
							PAYMENT_DATE = val.PAYMENT_DATE;
						}
						if (val.EXTSP_CARDNUMBER5 !== null) {
							EXTSP_CARDNUMBER5 = val.EXTSP_CARDNUMBER5;
						}
						if (val.PAYMENT_TYPE_ID !== null) {
							PAYMENT_TYPE_ID = scope.accoConversions.getTypePaymentBiling(val.PAYMENT_TYPE_ID)
						}
						if (val.SUMTOBILL !== null) {
							SUMTOBILL = val.SUMTOBILL;
						}
						if (val.STATUS_DESC !== null) {
							STATUS_DESC = val.STATUS_DESC;
						}
						var rows = {
							"cell": [
								{
									val: getStringJson(BILLING_ACCOUNT_COMPANY_NAME),
									type: "cell"
								},
								{
									val: getStringJson(BILLING_ACCOUNT_HP),
									type: "cell"
								},
								{
									val: getStringJson(PAYMENT_DATE),
									type: "cell"
								},
								{
									val: getStringJson(EXTSP_CARDNUMBER5),
									type: "cell"
								},
								{
									val: getStringJson(PAYMENT_TYPE_ID),
									type: "cell"
								},
								{
									val: getStringJson(SUMTOBILL),
									type: "cell"
								},
								{
									val: getStringJson(STATUS_DESC),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailerAccBill(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = 'דו״ח בילינג שוטף -';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								"cell": [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "ח.פ.",
										"type": "header"
									},
									{
										"val": "תאריך חיוב",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "סוג תשלום",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "סטטוס",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:H1");

					$(scope.appData.itemsAllBill).each(function (i, val) {
						var BILLING_ACCOUNT_COMPANY_NAME = '',
							BILLING_ACCOUNT_HP = '',
							PAYMENT_DATE = '',
							PAYMENT_TYPE_ID = '',
							EXTSP_CARDNUMBER5 = '',
							STATUS_DESC = '',
							SUMTOBILL = '';

						if (val.BILLING_ACCOUNT_COMPANY_NAME !== null) {
							BILLING_ACCOUNT_COMPANY_NAME = val.BILLING_ACCOUNT_COMPANY_NAME;
						}
						if (val.BILLING_ACCOUNT_HP !== null) {
							BILLING_ACCOUNT_HP = val.BILLING_ACCOUNT_HP;
						}
						if (val.PAYMENT_DATE !== null) {
							PAYMENT_DATE = val.PAYMENT_DATE;
						}
						if (val.EXTSP_CARDNUMBER5 !== null) {
							EXTSP_CARDNUMBER5 = val.EXTSP_CARDNUMBER5;
						}
						if (val.PAYMENT_TYPE_ID !== null) {
							PAYMENT_TYPE_ID = scope.accoConversions.getTypePaymentBiling(val.PAYMENT_TYPE_ID)
						}
						if (val.SUMTOBILL !== null) {
							SUMTOBILL = val.SUMTOBILL;
						}
						if (val.STATUS_DESC !== null) {
							STATUS_DESC = val.STATUS_DESC;
						}
						var rows = {
							"cell": [
								{
									val: getStringJson(BILLING_ACCOUNT_COMPANY_NAME),
									type: "cell"
								},
								{
									val: getStringJson(BILLING_ACCOUNT_HP),
									type: "cell"
								},
								{
									val: getStringJson(PAYMENT_DATE),
									type: "cell"
								},
								{
									val: getStringJson(EXTSP_CARDNUMBER5),
									type: "cell"
								},
								{
									val: getStringJson(PAYMENT_TYPE_ID),
									type: "cell"
								},
								{
									val: getStringJson(SUMTOBILL),
									type: "cell"
								},
								{
									val: getStringJson(STATUS_DESC),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}


	function exportsPrintAccBill2() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); "> שם חברה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">ח.פ.</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); "> טלפון</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תאריך חיוב מקורי</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">  כרטיס</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); "> סוג תשלום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">  סכום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סטטוס</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.itemsAllBill2).each(function (i, val) {
						var BILLING_ACCOUNT_COMPANY_NAME = '&nbsp;',
							BILLING_ACCOUNT_HP = '&nbsp;',
							BILLING_ACCOUNT_PHONE = '&nbsp;',
							PAYMENT_DATE = '&nbsp;',
							EXTSP_CARDNUMBER5 = '&nbsp;',
							PAYMENT_TYPE_ID = '&nbsp;',
							STATUS_DESC = '&nbsp;',
							SUMTOBILL = '&nbsp;';

						if (val.BILLING_ACCOUNT_COMPANY_NAME !== null) {
							BILLING_ACCOUNT_COMPANY_NAME = val.BILLING_ACCOUNT_COMPANY_NAME;
						}
						if (val.BILLING_ACCOUNT_HP !== null) {
							BILLING_ACCOUNT_HP = val.BILLING_ACCOUNT_HP;
						}
						if (val.BILLING_ACCOUNT_PHONE !== null) {
							BILLING_ACCOUNT_PHONE = val.BILLING_ACCOUNT_PHONE;
						}
						if (val.PAYMENT_DATE !== null) {
							PAYMENT_DATE = val.PAYMENT_DATE;
						}
						if (val.HOV_DAYS !== null) {
							PAYMENT_DATE += " | " + val.HOV_DAYS;
						}
						if (val.EXTSP_CARDNUMBER5 !== null) {
							EXTSP_CARDNUMBER5 = val.EXTSP_CARDNUMBER5;
						}
						if (val.PAYMENT_TYPE_ID !== null) {
							PAYMENT_TYPE_ID = scope.accoConversions.getTypePaymentBiling(val.PAYMENT_TYPE_ID)
						}
						if (val.SUMTOBILL !== null) {
							SUMTOBILL = val.SUMTOBILL;
						}
						if (val.STATUS_DESC !== null) {
							STATUS_DESC = val.STATUS_DESC;
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' + BILLING_ACCOUNT_COMPANY_NAME + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							BILLING_ACCOUNT_HP
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							BILLING_ACCOUNT_PHONE
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							PAYMENT_DATE
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							EXTSP_CARDNUMBER5
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							PAYMENT_TYPE_ID
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							SUMTOBILL
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							STATUS_DESC
							+ '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח בילינג חייבים -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';

					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelAccBill2() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {

					var name_doch = 'דו״ח בילינג חייבים -';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "ח.פ.",
										"type": "header"
									},
									{
										"val": "טלפון",
										"type": "header"
									},
									{
										"val": "תאריך חיוב מקורי",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "סוג תשלום",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "סטטוס",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [],
						senderMail: []
					};
					data.mergeCells.push("A1:H1");

					$(scope.appData.itemsAllBill2).each(function (i, val) {
						var BILLING_ACCOUNT_COMPANY_NAME = '',
							BILLING_ACCOUNT_HP = '',
							PAYMENT_DATE = '',
							PAYMENT_TYPE_ID = '',
							EXTSP_CARDNUMBER5 = '',
							BILLING_ACCOUNT_PHONE = '',
							STATUS_DESC = '',
							SUMTOBILL = '';

						if (val.BILLING_ACCOUNT_COMPANY_NAME !== null) {
							BILLING_ACCOUNT_COMPANY_NAME = val.BILLING_ACCOUNT_COMPANY_NAME;
						}
						if (val.BILLING_ACCOUNT_HP !== null) {
							BILLING_ACCOUNT_HP = val.BILLING_ACCOUNT_HP;
						}
						if (val.BILLING_ACCOUNT_PHONE !== null) {
							BILLING_ACCOUNT_PHONE = val.BILLING_ACCOUNT_PHONE;
						}
						if (val.PAYMENT_DATE !== null) {
							PAYMENT_DATE = val.PAYMENT_DATE;
						}
						if (val.HOV_DAYS !== null) {
							PAYMENT_DATE += " | " + val.HOV_DAYS;
						}
						if (val.EXTSP_CARDNUMBER5 !== null) {
							EXTSP_CARDNUMBER5 = val.EXTSP_CARDNUMBER5;
						}
						if (val.PAYMENT_TYPE_ID !== null) {
							PAYMENT_TYPE_ID = scope.accoConversions.getTypePaymentBiling(val.PAYMENT_TYPE_ID)
						}
						if (val.SUMTOBILL !== null) {
							SUMTOBILL = val.SUMTOBILL;
						}
						if (val.STATUS_DESC !== null) {
							STATUS_DESC = val.STATUS_DESC;
						}
						var rows = {
							"cell": [
								{
									val: getStringJson(BILLING_ACCOUNT_COMPANY_NAME),
									type: "cell"
								},
								{
									val: getStringJson(BILLING_ACCOUNT_HP),
									type: "cell"
								},
								{
									val: getStringJson(BILLING_ACCOUNT_PHONE),
									type: "cell"
								},
								{
									val: getStringJson(PAYMENT_DATE),
									type: "cell"
								},
								{
									val: getStringJson(EXTSP_CARDNUMBER5),
									type: "cell"
								},
								{
									val: getStringJson(PAYMENT_TYPE_ID),
									type: "cell"
								},
								{
									val: getStringJson(SUMTOBILL),
									type: "cell"
								},
								{
									val: getStringJson(STATUS_DESC),
									type: "cellBorderLeft"
								}
							]
						};

						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailerAccBill2(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;


					var name_doch = 'דו״ח בילינג חייבים -';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								"cell": [
									{
										"val": "שם חברה",
										"type": "header"
									},
									{
										"val": "ח.פ.",
										"type": "header"
									},
									{
										"val": "טלפון",
										"type": "header"
									},
									{
										"val": "תאריך חיוב מקורי",
										"type": "header"
									},
									{
										"val": "כרטיס",
										"type": "header"
									},
									{
										"val": "סוג תשלום",
										"type": "header"
									},
									{
										"val": "סכום",
										"type": "header"
									},
									{
										"val": "סטטוס",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					};
					data.mergeCells.push("A1:H1");

					$(scope.appData.itemsAllBill2).each(function (i, val) {
						var BILLING_ACCOUNT_COMPANY_NAME = '',
							BILLING_ACCOUNT_HP = '',
							PAYMENT_DATE = '',
							PAYMENT_TYPE_ID = '',
							EXTSP_CARDNUMBER5 = '',
							BILLING_ACCOUNT_PHONE = '',
							STATUS_DESC = '',
							SUMTOBILL = '';

						if (val.BILLING_ACCOUNT_COMPANY_NAME !== null) {
							BILLING_ACCOUNT_COMPANY_NAME = val.BILLING_ACCOUNT_COMPANY_NAME;
						}
						if (val.BILLING_ACCOUNT_HP !== null) {
							BILLING_ACCOUNT_HP = val.BILLING_ACCOUNT_HP;
						}
						if (val.BILLING_ACCOUNT_PHONE !== null) {
							BILLING_ACCOUNT_PHONE = val.BILLING_ACCOUNT_PHONE;
						}
						if (val.PAYMENT_DATE !== null) {
							PAYMENT_DATE = val.PAYMENT_DATE;
						}
						if (val.HOV_DAYS !== null) {
							PAYMENT_DATE += " | " + val.HOV_DAYS;
						}
						if (val.EXTSP_CARDNUMBER5 !== null) {
							EXTSP_CARDNUMBER5 = val.EXTSP_CARDNUMBER5;
						}
						if (val.PAYMENT_TYPE_ID !== null) {
							PAYMENT_TYPE_ID = scope.accoConversions.getTypePaymentBiling(val.PAYMENT_TYPE_ID)
						}
						if (val.SUMTOBILL !== null) {
							SUMTOBILL = val.SUMTOBILL;
						}
						if (val.STATUS_DESC !== null) {
							STATUS_DESC = val.STATUS_DESC;
						}
						var rows = {
							"cell": [
								{
									val: getStringJson(BILLING_ACCOUNT_COMPANY_NAME),
									type: "cell"
								},
								{
									val: getStringJson(BILLING_ACCOUNT_HP),
									type: "cell"
								},
								{
									val: getStringJson(BILLING_ACCOUNT_PHONE),
									type: "cell"
								},
								{
									val: getStringJson(PAYMENT_DATE),
									type: "cell"
								},
								{
									val: getStringJson(EXTSP_CARDNUMBER5),
									type: "cell"
								},
								{
									val: getStringJson(PAYMENT_TYPE_ID),
									type: "cell"
								},
								{
									val: getStringJson(SUMTOBILL),
									type: "cell"
								},
								{
									val: getStringJson(STATUS_DESC),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});
					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}


	function exportsPrintAccPays() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var YETZU = "";
					if (!scope.appData.billing_report_4company_sum.YETZU_BANK && !scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK) {
						YETZU += "-";
					}
					else {
						if (scope.appData.billing_report_4company_sum.YETZU_BANK) {
							YETZU += scope.appData.billing_report_4company_sum.YETZU_BANK;
						}
						if (scope.appData.billing_report_4company_sum.YETZU_BANK && scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK) {
							YETZU += " | ";
						}
						if (scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK) {
							YETZU += scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK);
						}
					}
					var YETZU_CCARD = "";
					if (!scope.appData.billing_report_4company_sum.YETZU_CCARD && !scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD) {
						YETZU_CCARD += "-";
					}
					else {
						if (scope.appData.billing_report_4company_sum.YETZU_CCARD) {
							YETZU_CCARD += scope.appData.billing_report_4company_sum.YETZU_CCARD;
						}
						if (scope.appData.billing_report_4company_sum.YETZU_CCARD && scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD) {
							YETZU_CCARD += " | ";
						}
						if (scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD) {
							YETZU_CCARD += scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD);
						}
					}
					var DISCOUNT = "";
					if (!scope.appData.billing_report_4company_sum.DISCOUNT && !scope.appData.billing_report_4company_sum.DISCOUNT_EXP) {
						DISCOUNT += "-";
					}
					else {
						if (scope.appData.billing_report_4company_sum.DISCOUNT) {
							DISCOUNT += scope.roundNum(scope.appData.billing_report_4company_sum.DISCOUNT);
						}
						if (scope.appData.billing_report_4company_sum.DISCOUNT && scope.appData.billing_report_4company_sum.DISCOUNT_EXP) {
							DISCOUNT += " | ";
						}
						if (scope.appData.billing_report_4company_sum.DISCOUNT_EXP) {
							DISCOUNT += scope.appData.billing_report_4company_sum.DISCOUNT_EXP;
						}
					}
					var COMPANY_CNT = "-";
					if (scope.appData.billing_report_4company_sum.COMPANY_CNT) {
						COMPANY_CNT = scope.appData.billing_report_4company_sum.COMPANY_CNT;
					}
					var TOTAL_PAYMENT = "-";
					if (scope.appData.billing_report_4company_sum.TOTAL_PAYMENT) {
						TOTAL_PAYMENT = scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_PAYMENT);
					}


					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); "> סה״כ חברות</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); "> ייצוא דפי בנק</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">ייצוא כ.אשראי </th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); "> הנחה למסמך </th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); "> סה"כ לתשלום</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					table += '<tr>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' +
						COMPANY_CNT
						+ '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
						YETZU
						+ '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
						YETZU_CCARD
						+ '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
						DISCOUNT
						+ '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
						TOTAL_PAYMENT
						+ '</td>';
					table += '</tr>';
					table += '</tbody></table>';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">חברה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סוג חיוב</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">ייצוא דפי בנק</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">הנחה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">  סכום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">  ייצוא כ. אשראי</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">הנחה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">  סכום</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">  סה"כ לתשלום</th>'
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.billing_report_4company).each(function (i, val) {
						var COMPANY_NAME = '&nbsp;',
							YETZU_BANK = '&nbsp;',
							SUG_HIUV = '&nbsp;',
							SUG_LAKOACH_BANK = '&nbsp;',
							DISCOUNT_BANK = '&nbsp;',
							TOTAL_YETZU_BANK = '&nbsp;',
							YETZU_CCARD = '&nbsp;',
							SUG_LAKOACH_CCARD = '&nbsp;',
							DISCOUNT_CCARD = '&nbsp;',
							TOTAL_YETZU_CCARD = '&nbsp;',
							ITEM_PRICE_PER_OTHER_ITEMS_DIS = '&nbsp;',
							TOTAL_PAYMENT = '&nbsp;';

						if (val.COMPANY_NAME !== null) {
							COMPANY_NAME = val.COMPANY_NAME;
						}
						if (val.YETZU_BANK !== null) {
							YETZU_BANK = val.YETZU_BANK;
						}
						if (val.SUG_LAKOACH_BANK !== null) {
							SUG_LAKOACH_BANK = val.SUG_LAKOACH_BANK;
						}
						if (val.DISCOUNT_BANK !== null) {
							DISCOUNT_BANK = val.DISCOUNT_BANK;
						}
						if (val.TOTAL_YETZU_BANK !== null) {
							TOTAL_YETZU_BANK = val.TOTAL_YETZU_BANK;
						}
						if (val.YETZU_CCARD !== null) {
							YETZU_CCARD = val.YETZU_CCARD;
						}
						if (val.SUG_LAKOACH_CCARD !== null) {
							SUG_LAKOACH_CCARD = val.SUG_LAKOACH_CCARD;
						}
						if (val.DISCOUNT_CCARD !== null) {
							DISCOUNT_CCARD = val.DISCOUNT_CCARD;
						}
						if (val.TOTAL_YETZU_CCARD !== null) {
							TOTAL_YETZU_CCARD = val.TOTAL_YETZU_CCARD;
						}
						if (val.ITEM_PRICE_PER_OTHER_ITEMS_DIS !== null) {
							ITEM_PRICE_PER_OTHER_ITEMS_DIS = val.ITEM_PRICE_PER_OTHER_ITEMS_DIS;
						}
						if (val.TOTAL_PAYMENT !== null) {
							TOTAL_PAYMENT = val.TOTAL_PAYMENT;
						}
						if (val.SUG_HIUV !== null) {
							SUG_HIUV = scope.accoConversions.getTypeHiuv(val.SUG_HIUV);
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">' + COMPANY_NAME + '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							SUG_HIUV
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							YETZU_BANK
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							DISCOUNT_BANK
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TOTAL_YETZU_BANK
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							YETZU_CCARD
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							DISCOUNT_CCARD
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TOTAL_YETZU_CCARD
							+ '</td>';

						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TOTAL_PAYMENT
							+ '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';
					var nameAcc = "";
					if (scope.appData.userAccNameUsers || scope.appData.userAccName) {
						nameAcc = ' | ' + scope.appData.userAccName + ' ' + scope.appData.userAccNameUsers
					}
					var name_doch = 'דו״ח חיובים -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + nameAcc + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';

					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelAccPays() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var YETZU = "";
					if (!scope.appData.billing_report_4company_sum.YETZU_BANK && !scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK) {
						YETZU += "-";
					}
					else {
						if (scope.appData.billing_report_4company_sum.YETZU_BANK) {
							YETZU += scope.appData.billing_report_4company_sum.YETZU_BANK;
						}
						if (scope.appData.billing_report_4company_sum.YETZU_BANK && scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK) {
							YETZU += " | ";
						}
						if (scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK) {
							YETZU += scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK);
						}
					}
					var YETZU_CCARD = "";
					if (!scope.appData.billing_report_4company_sum.YETZU_CCARD && !scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD) {
						YETZU_CCARD += "-";
					}
					else {
						if (scope.appData.billing_report_4company_sum.YETZU_CCARD) {
							YETZU_CCARD += scope.appData.billing_report_4company_sum.YETZU_CCARD;
						}
						if (scope.appData.billing_report_4company_sum.YETZU_CCARD && scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD) {
							YETZU_CCARD += " | ";
						}
						if (scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD) {
							YETZU_CCARD += scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD);
						}
					}
					var DISCOUNT = "";
					if (!scope.appData.billing_report_4company_sum.DISCOUNT && !scope.appData.billing_report_4company_sum.DISCOUNT_EXP) {
						DISCOUNT += "-";
					}
					else {
						if (scope.appData.billing_report_4company_sum.DISCOUNT) {
							DISCOUNT += scope.roundNum(scope.appData.billing_report_4company_sum.DISCOUNT);
						}
						if (scope.appData.billing_report_4company_sum.DISCOUNT && scope.appData.billing_report_4company_sum.DISCOUNT_EXP) {
							DISCOUNT += " | ";
						}
						if (scope.appData.billing_report_4company_sum.DISCOUNT_EXP) {
							DISCOUNT += scope.appData.billing_report_4company_sum.DISCOUNT_EXP;
						}
					}
					var nameAcc = "";
					if (scope.appData.userAccNameUsers || scope.appData.userAccName) {
						nameAcc = ' | ' + scope.appData.userAccName + ' ' + scope.appData.userAccNameUsers
					}
					var name_doch = 'דו״ח חיובים';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name + nameAcc;
					var sumTotal = '-';
					if (!scope.appData.sums_existing_billing.length || scope.appData.sums_existing_billing.length === 2) {
						if (scope.appData.billing_report_4company_sum.TOTAL_PAYMENT) {
							sumTotal = scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_PAYMENT)
						}
					} else if (scope.appData.sums_existing_billing.length && scope.appData.sums_existing_billing.length > 2) {
						sumTotal = scope.roundNum(scope.appData.sums_existing_billing[2] + scope.appData.sums_existing_billing[4])
					}

					var data = {
						rows: [
							// {
							// 	"cell": [
							// 		{
							// 			val: "סה״כ חברות",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "ייצוא דפי בנק",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "ייצוא כ.אשראי",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "הנחה למסמך",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "סה\"כ לתשלום",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "header"
							// 		}
							// 	]
							// },
							// {
							// 	"cell": [
							// 		{
							// 			val: (scope.appData.billing_report_4company_sum.COMPANY_CNT) ? scope.appData.billing_report_4company_sum.COMPANY_CNT : "-",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: YETZU,
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: YETZU_CCARD,
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: DISCOUNT,
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: (scope.appData.billing_report_4company_sum.TOTAL_PAYMENT) ? scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_PAYMENT) : "-",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "cellBoldBorderLeft"
							// 		}
							// 	]
							// },
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.userAccName + "" + scope.appData.userAccNameUsers),
										type: "cellBold"
									},
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "סה״כ לחיוב כולל מע\"מ",
										"type": "cellBold"
									},
									{
										"val": sumTotal,
										"type": "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "חברה",
										"type": "header"
									},
									// {
									// 	"val": "סוג חיוב",
									// 	"type": "header"
									// },
									// {
									// 	"val": "ייצוא דפי בנק",
									// 	"type": "header"
									// },
									// {
									// 	"val": "הנחה",
									// 	"type": "header"
									// },
									// {
									// 	"val": "סכום",
									// 	"type": "header"
									// },
									// {
									// 	"val": "ייצוא כ. אשראי",
									// 	"type": "header"
									// },
									// {
									// 	"val": "הנחה",
									// 	"type": "header"
									// },
									// {
									// 	"val": "סכום",
									// 	"type": "header"
									// },
									{
										"val": "סה\"כ לתשלום",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellNumber",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftNum",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							'40',
							// '15',
							// '15',
							// '15',
							// '15',
							// '15',
							// '15',
							// '15',
							'15'
						],
						senderMail: []
					};
					data.mergeCells.push("A1:B1");

					$(scope.appData.billing_report_4company).each(function (i, val) {
						var COMPANY_NAME = '',
							YETZU_BANK = '',
							SUG_HIUV = '',
							SUG_LAKOACH_BANK = '',
							DISCOUNT_BANK = '',
							TOTAL_YETZU_BANK = '',
							YETZU_CCARD = '',
							SUG_LAKOACH_CCARD = '',
							DISCOUNT_CCARD = '',
							TOTAL_YETZU_CCARD = '',
							ITEM_PRICE_PER_OTHER_ITEMS_DIS = '',
							TOTAL_PAYMENT = '';

						if (val.COMPANY_NAME !== null) {
							COMPANY_NAME = val.COMPANY_NAME;
						}
						if (val.SUG_HIUV !== null) {
							SUG_HIUV = scope.accoConversions.getTypeHiuv(val.SUG_HIUV);
						}
						if (val.YETZU_BANK !== null) {
							YETZU_BANK = val.YETZU_BANK;
						}
						if (val.SUG_LAKOACH_BANK !== null) {
							SUG_LAKOACH_BANK = val.SUG_LAKOACH_BANK;
						}
						if (val.DISCOUNT_BANK !== null) {
							DISCOUNT_BANK = val.DISCOUNT_BANK;
						}
						if (val.TOTAL_YETZU_BANK !== null) {
							TOTAL_YETZU_BANK = val.TOTAL_YETZU_BANK;
						}
						if (val.YETZU_CCARD !== null) {
							YETZU_CCARD = val.YETZU_CCARD;
						}
						if (val.SUG_LAKOACH_CCARD !== null) {
							SUG_LAKOACH_CCARD = val.SUG_LAKOACH_CCARD;
						}
						if (val.DISCOUNT_CCARD !== null) {
							DISCOUNT_CCARD = val.DISCOUNT_CCARD;
						}
						if (val.TOTAL_YETZU_CCARD !== null) {
							TOTAL_YETZU_CCARD = val.TOTAL_YETZU_CCARD;
						}
						if (val.ITEM_PRICE_PER_OTHER_ITEMS_DIS !== null) {
							ITEM_PRICE_PER_OTHER_ITEMS_DIS = val.ITEM_PRICE_PER_OTHER_ITEMS_DIS;
						}
						if (val.TOTAL_PAYMENT !== null) {
							TOTAL_PAYMENT = val.TOTAL_PAYMENT;
						}
						var rows = {
							"cell": [
								{
									val: getStringJson(COMPANY_NAME),
									type: "cell"
								},
								// {
								// 	val: getStringJson(SUG_HIUV),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(YETZU_BANK),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(DISCOUNT_BANK),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(TOTAL_YETZU_BANK),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(YETZU_CCARD),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(DISCOUNT_CCARD),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(TOTAL_YETZU_CCARD),
								// 	type: "cellNumber"
								// },
								{
									val: getStringJson(TOTAL_PAYMENT),
									type: "cellBorderLeftNum"
								}
							]
						};
						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailerAccPays(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;

					var YETZU = "";
					if (!scope.appData.billing_report_4company_sum.YETZU_BANK && !scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK) {
						YETZU += "-";
					} else {
						if (scope.appData.billing_report_4company_sum.YETZU_BANK) {
							YETZU += scope.appData.billing_report_4company_sum.YETZU_BANK;
						}
						if (scope.appData.billing_report_4company_sum.YETZU_BANK && scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK) {
							YETZU += " | ";
						}
						if (scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK) {
							YETZU += scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_YETZU_BANK);
						}
					}
					var YETZU_CCARD = "";
					if (!scope.appData.billing_report_4company_sum.YETZU_CCARD && !scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD) {
						YETZU_CCARD += "-";
					} else {
						if (scope.appData.billing_report_4company_sum.YETZU_CCARD) {
							YETZU_CCARD += scope.appData.billing_report_4company_sum.YETZU_CCARD;
						}
						if (scope.appData.billing_report_4company_sum.YETZU_CCARD && scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD) {
							YETZU_CCARD += " | ";
						}
						if (scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD) {
							YETZU_CCARD += scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_YETZU_CCARD);
						}
					}
					var DISCOUNT = "";
					if (!scope.appData.billing_report_4company_sum.DISCOUNT && !scope.appData.billing_report_4company_sum.DISCOUNT_EXP) {
						DISCOUNT += "-";
					} else {
						if (scope.appData.billing_report_4company_sum.DISCOUNT) {
							DISCOUNT += scope.roundNum(scope.appData.billing_report_4company_sum.DISCOUNT);
						}
						if (scope.appData.billing_report_4company_sum.DISCOUNT && scope.appData.billing_report_4company_sum.DISCOUNT_EXP) {
							DISCOUNT += " | ";
						}
						if (scope.appData.billing_report_4company_sum.DISCOUNT_EXP) {
							DISCOUNT += scope.appData.billing_report_4company_sum.DISCOUNT_EXP;
						}
					}

					var name_doch = ' חיובים';
					var name_roh, name_company = '';
					var nameAcc = "";
					if (scope.appData.userAccNameUsers || scope.appData.userAccName) {
						nameAcc = ' | ' + scope.appData.userAccName + ' ' + scope.appData.userAccNameUsers
					}
					name_roh = scope.appData.defMonth.full_name + nameAcc;
					var sumTotal = '-';
					if (!scope.appData.sums_existing_billing.length || scope.appData.sums_existing_billing.length === 2) {
						if (scope.appData.billing_report_4company_sum.TOTAL_PAYMENT) {
							sumTotal = scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_PAYMENT)
						}
					} else if (scope.appData.sums_existing_billing.length && scope.appData.sums_existing_billing.length > 2) {
						sumTotal = scope.roundNum(scope.appData.sums_existing_billing[2] + scope.appData.sums_existing_billing[4])
					}
					var data = {
						rows: [
							// {
							// 	"cell": [
							// 		{
							// 			val: "סה״כ חברות",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "ייצוא דפי בנק",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "ייצוא כ.אשראי",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "הנחה למסמך",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "סה\"כ לתשלום",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "header"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "header"
							// 		}
							// 	]
							// },
							// {
							// 	"cell": [
							// 		{
							// 			val: (scope.appData.billing_report_4company_sum.COMPANY_CNT) ? scope.appData.billing_report_4company_sum.COMPANY_CNT : "-",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: YETZU,
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: YETZU_CCARD,
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: DISCOUNT,
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: (scope.appData.billing_report_4company_sum.TOTAL_PAYMENT) ? scope.roundNum(scope.appData.billing_report_4company_sum.TOTAL_PAYMENT) : "-",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "cellBold"
							// 		},
							// 		{
							// 			val: "",
							// 			type: "cellBoldBorderLeft"
							// 		}
							// 	]
							// },
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.userAccName + "" + scope.appData.userAccNameUsers),
										type: "cellBold"
									},
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									// {
									// 	val: "",
									// 	type: "cellBold"
									// },
									{
										val: "",
										type: "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "סה״כ לחיוב כולל מע\"מ",
										"type": "cellBold"
									},
									{
										"val": sumTotal,
										"type": "cellBoldBorderLeft"
									}
								]
							},
							{
								cell: [
									{
										"val": "חברה",
										"type": "header"
									},
									// {
									// 	"val": "סוג חיוב",
									// 	"type": "header"
									// },
									// {
									// 	"val": "ייצוא דפי בנק",
									// 	"type": "header"
									// },
									// {
									// 	"val": "הנחה",
									// 	"type": "header"
									// },
									// {
									// 	"val": "סכום",
									// 	"type": "header"
									// },
									// {
									// 	"val": "ייצוא כ. אשראי",
									// 	"type": "header"
									// },
									// {
									// 	"val": "הנחה",
									// 	"type": "header"
									// },
									// {
									// 	"val": "סכום",
									// 	"type": "header"
									// },
									{
										"val": "סה\"כ לתשלום",
										"type": "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellNumber",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeftNum",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": true
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							'40',
							// '15',
							// '15',
							// '15',
							// '15',
							// '15',
							// '15',
							// '15',
							'15'
						],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.mail,
							'name_roh': '',
							'name_doch': name_doch,
							'name_company': ''
						}]
					};
					data.mergeCells.push("A1:B1");

					$(scope.appData.billing_report_4company).each(function (i, val) {
						var COMPANY_NAME = '',
							YETZU_BANK = '',
							SUG_HIUV = '',
							SUG_LAKOACH_BANK = '',
							DISCOUNT_BANK = '',
							TOTAL_YETZU_BANK = '',
							YETZU_CCARD = '',
							SUG_LAKOACH_CCARD = '',
							DISCOUNT_CCARD = '',
							TOTAL_YETZU_CCARD = '',
							ITEM_PRICE_PER_OTHER_ITEMS_DIS = '',
							TOTAL_PAYMENT = '';

						if (val.COMPANY_NAME !== null) {
							COMPANY_NAME = val.COMPANY_NAME;
						}
						if (val.SUG_HIUV !== null) {
							SUG_HIUV = scope.accoConversions.getTypeHiuv(val.SUG_HIUV);
						}
						if (val.YETZU_BANK !== null) {
							YETZU_BANK = val.YETZU_BANK;
						}
						if (val.SUG_LAKOACH_BANK !== null) {
							SUG_LAKOACH_BANK = val.SUG_LAKOACH_BANK;
						}
						if (val.DISCOUNT_BANK !== null) {
							DISCOUNT_BANK = val.DISCOUNT_BANK;
						}
						if (val.TOTAL_YETZU_BANK !== null) {
							TOTAL_YETZU_BANK = val.TOTAL_YETZU_BANK;
						}
						if (val.YETZU_CCARD !== null) {
							YETZU_CCARD = val.YETZU_CCARD;
						}
						if (val.SUG_LAKOACH_CCARD !== null) {
							SUG_LAKOACH_CCARD = val.SUG_LAKOACH_CCARD;
						}
						if (val.DISCOUNT_CCARD !== null) {
							DISCOUNT_CCARD = val.DISCOUNT_CCARD;
						}
						if (val.TOTAL_YETZU_CCARD !== null) {
							TOTAL_YETZU_CCARD = val.TOTAL_YETZU_CCARD;
						}
						if (val.ITEM_PRICE_PER_OTHER_ITEMS_DIS !== null) {
							ITEM_PRICE_PER_OTHER_ITEMS_DIS = val.ITEM_PRICE_PER_OTHER_ITEMS_DIS;
						}
						if (val.TOTAL_PAYMENT !== null) {
							TOTAL_PAYMENT = val.TOTAL_PAYMENT;
						}
						var rows = {
							"cell": [
								{
									val: getStringJson(COMPANY_NAME),
									type: "cell"
								},
								// {
								// 	val: getStringJson(SUG_HIUV),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(YETZU_BANK),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(DISCOUNT_BANK),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(TOTAL_YETZU_BANK),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(YETZU_CCARD),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(DISCOUNT_CCARD),
								// 	type: "cellNumber"
								// },
								// {
								// 	val: getStringJson(TOTAL_YETZU_CCARD),
								// 	type: "cellNumber"
								// },
								{
									val: getStringJson(TOTAL_PAYMENT),
									type: "cellBorderLeftNum"
								}
							]
						};
						data.rows.push(rows);
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}

	}


	function exportsPrintQa() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					for (var k in scope.appData.tableQa.title) {
						if (scope.appData.tableQa.title.hasOwnProperty(k)) {
							var vals = scope.appData.tableQa.title[k];
							if (vals !== null && vals.toString().indexOf('object:') === -1) {
								if (!vals) {
									vals = '&nbsp;';
								}
								table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">' + vals + '</th>';
							}
						}
					}
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.tableQa.rows).each(function (i, val) {
						table += '<tr>';
						for (var k in val) {
							if (val.hasOwnProperty(k)) {
								var vals = val[k];
								if (vals !== null && vals.toString().indexOf('object:') === -1) {
									if (!vals) {
										vals = '&nbsp;';
									}
									table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
										vals
										+ '</td>';
								}
							}
						}
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח ' + scope.appData.cubeReportsQa.report_name + ' -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.userAccName + "" + scope.appData.userAccNameUsers + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';

					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelQa() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var name_doch = 'דו״ח ' + scope.appData.cubeReportsQa.report_name + ' -';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									}
								]
							},
							{
								"cell": []
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [],
						senderMail: []
					}
					for (var i = 0; i < Object.keys(scope.appData.tableQa.title).length - 1; i++) {
						var type = "cellBold";
						if (i === Object.keys(scope.appData.tableQa.title).length - 1) {
							type = "cellBoldBorderLeft";
						}
						data.rows[0].cell.push({
							val: "",
							type: type
						});
					}
					for (var k in scope.appData.tableQa.title) {
						if (scope.appData.tableQa.title.hasOwnProperty(k)) {
							var vals = scope.appData.tableQa.title[k];
							if (vals !== null && vals.toString().indexOf('object:') === -1) {
								if (!vals) {
									vals = '';
								}
								data.rows[1].cell.push({
									"val": vals.toString(),
									"type": "header"
								});
							}
						}
					}
					$(scope.appData.tableQa.rows).each(function (i, val) {
						var len = Object.keys(val).length - 1, count = 0;
						var rows = {
							"cell": []
						};
						for (var k in val) {
							if (val.hasOwnProperty(k)) {
								var vals = val[k];
								if (vals !== null && vals.toString().indexOf('object:') === -1) {
									count++;
									if (!vals) {
										vals = '';
									}
									var type = "cell";
									if (count === len) {
										type = "cellBorderLeft";
									}
									rows.cell.push({
										val: vals.toString(),
										type: type
									});
								}
							}
						}
						data.rows.push(rows);
					});
					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}


	function exportsPrintPopTransfer() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center;border-collapse: collapse; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th colspan="2" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">פרטי העברה</th>';
					table += '<th colspan="2" style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); ">פרטים נוספים</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					table += '<tr>';
					table += '<td style="border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					if (scope.appData.bankdetail.IND_HOVA == 0) {
						table += "מבצע ההעברה";
					}
					else {
						table += "שם המוטב";

					}
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += scope.appData.bankdetail.NAMEPAYERTRANSFER;
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += "מהות ההעברה";

					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += scope.appData.bankdetail.DETAILSTRANSFER;

					table += '</td>';
					table += '</tr>';


					table += '<tr>';
					table += '<td style="border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51);text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += "בנק";
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += scope.appData.bankdetail.BANKTRANSFERNUMBER + " - " + scope.accoConversions.getBankName(scope.appData.bankdetail.BANKTRANSFERNUMBER);
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += "תאריך ביצוע";
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += scope.appData.bankdetail.DEPOSITETRANSFERDATE;

					table += '</td>';
					table += '</tr>';


					table += '<tr>';
					table += '<td style="border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51);text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += "סניף";
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += scope.appData.bankdetail.BRANCHTRANSFERNUMBER;
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += "&nbsp;";
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += "&nbsp;";
					table += '</td>';
					table += '</tr>';


					table += '<tr>';
					table += '<td style="border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51);text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += "חשבון";
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += scope.appData.bankdetail.ACCOUNTTRANSFERNUMBER;
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += "&nbsp;";
					table += '</td>';
					table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">';
					table += "&nbsp;";
					table += '</td>';
					table += '</tr>';
					table += '</tbody></table>';

					var name_doch = 'דו״ח ' + 'פירוט העברות בנקאיות -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.userAccName + "" + scope.appData.userAccNameUsers + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';

					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));
				})
			}
		}
	}

	function exportsExcelPopTransfer() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var name_doch = 'דו״ח ' + 'פירוט העברות בנקאיות -';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									}
								]
							},
							{
								"cell": [
									{
										val: "פרטי העברה",
										type: "header"
									}, {
										val: "",
										type: "header"
									}, {
										val: "פרטים נוספים",
										type: "header"
									}, {
										val: "",
										type: "header"
									}
								]
							},
							{
								"cell": [
									{
										val: (scope.appData.bankdetail.IND_HOVA == 0) ? "מבצע ההעברה" : "שם המוטב",
										type: "cell"
									},
									{
										val: getStringJson(scope.appData.bankdetail.NAMEPAYERTRANSFER),
										type: "cell"
									},
									{
										val: "מהות ההעברה",
										type: "cell"
									},
									{
										val: getStringJson(scope.appData.bankdetail.DETAILSTRANSFER),
										type: "cellBorderLeft"
									}
								]
							},
							{
								"cell": [
									{
										val: "בנק",
										type: "cell"
									},
									{
										val: getStringJson(scope.appData.bankdetail.BANKTRANSFERNUMBER + " - " + scope.accoConversions.getBankName(scope.appData.bankdetail.BANKTRANSFERNUMBER)),
										type: "cell"
									},
									{
										val: "תאריך ביצוע",
										type: "cell"
									},
									{
										val: getStringJson(scope.appData.bankdetail.DEPOSITETRANSFERDATE),
										type: "cellBorderLeft"
									}
								]
							}, {
								"cell": [
									{
										val: "סניף",
										type: "cell"
									},
									{
										val: getStringJson(scope.appData.bankdetail.BRANCHTRANSFERNUMBER),
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cellBorderLeft"
									}
								]
							},
							{
								"cell": [
									{
										val: "חשבון",
										type: "cell"
									},
									{
										val: getStringJson(scope.appData.bankdetail.ACCOUNTTRANSFERNUMBER),
										type: "cell"
									},
									{
										val: "",
										type: "cell"
									},
									{
										val: "",
										type: "cellBorderLeft"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							'20',
							'20',
							'20',
							'20'
						],
						senderMail: []
					}
					data.mergeCells.push("A1:D1");
					data.mergeCells.push("A2:B2");
					data.mergeCells.push("C2:D2");

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsExcelPopDtlPays() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var name_doch = 'דו״ח ' + ' -' + scope.appData.titleDtlsPay;
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									}
								]
							},
							{
								"cell": [
									{
										val: "חברה",
										type: "header"
									}, {
										val: "פריט",
										type: "header"
									}, {
										val: "סכום ללא מע״מ",
										type: "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [
							'25',
							'15',
							'10'
						],
						senderMail: []
					}
					data.mergeCells.push("A1:C1");

					$(scope.appData.billing_payment_get_items_dtls).each(function (i, val) {
						var rows = {
							"cell": [
								{
									val: getStringJson(val.COMPANY_NAME),
									type: "cell"
								},
								{
									val: getStringJson(val.DESCRIPTION),
									type: "cell"
								},
								{
									val: getStringJson(val.DISCOUNT),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailPopDtlPays(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;

					var name_doch = ' חיובים';
					var name_roh = 'נציג ביזיבוקס ';

					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson('דו״ח ' + name_doch + ' ' + scope.appData.titleDtlsPay),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									}
								]
							},
							{
								"cell": [
									{
										val: "חברה",
										type: "header"
									}, {
										val: "פריט",
										type: "header"
									}, {
										val: "סכום ללא מע״מ",
										type: "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
						],
						mergeCells: [],
						widthCells: [
							'30',
							'20',
							'15'
						],
						senderMail: [{
							'title':  'דו״ח ' + name_doch,
							'toAddressMail': scope.mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': ''
						}]
					}
					data.mergeCells.push("A1:C1");

					$(scope.appData.billing_payment_get_items_dtls).each(function (i, val) {
						var rows = {
							"cell": [
								{
									val: getStringJson(val.COMPANY_NAME),
									type: "cell"
								},
								{
									val: getStringJson(val.DESCRIPTION),
									type: "cell"
								},
								{
									val: getStringJson(val.DISCOUNT),
									type: "cellBorderLeft"
								}
							]
						};
						data.rows.push(rows);
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}

	function exportsPrintSettingsDetailsClients() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); "> חברה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סוג חיוב</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); "> תאריך הקמה</th>';
					if (!scope.appData.remove) {
						table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">חשבונות בנק</th>';
						table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">  כרטיסי אשראי</th>';
					}

					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">  שורות בנק חודש קודם</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">  שורות כ.אשראי חודש קודם</th>';

					if (!scope.appData.remove) {
						table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תשלום קיים</th>';
					}


					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תשלום בנקים חדש</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">תשלום אשראי חדש</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">סה"כ תשלום חדש</th>';

					if (!scope.appData.remove) {
						table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">פער בנקים</th>';
						table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">פער אשראי</th>';
						table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">פער לחברה</th>';
					}

					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.existing_company_calc).each(function (i, val) {
						var COMPANY_NAME = '&nbsp;',
							SUG_HIUV = '&nbsp;',
							DATE_CREATED = '&nbsp;',
							TASHLUM_KAVUA_BANKIM = '&nbsp;',
							TASHLUM_KAVUA_ASHRAI = '&nbsp;',
							BANK_ROWS_HODESH_KODEM = '&nbsp;',
							ASHRAI_ROWS_HODESH_KODEM = '&nbsp;',
							TASHLUM_KAVUA_TOTAL = '&nbsp;',
							TASHLUM_PERROW_BANKIM = '&nbsp;',
							TASHLUM_PERROW_ASHRAI = '&nbsp;',
							TASHLUM_PERROW_TOTAL = '&nbsp;',
							PAAR_BANKIM = '&nbsp;',
							PAAR_ASHRAI = '&nbsp;',
							PAAR_TOTAL = '&nbsp;';

						if (val.COMPANY_NAME !== null) {
							COMPANY_NAME = getStringJson(val.COMPANY_NAME);
						}
						if (val.SUG_HIUV !== null) {
							SUG_HIUV = getStringJson(scope.accoConversions.getTypeHiuv(val.SUG_HIUV));
						}
						if (val.DATE_CREATED !== null) {
							DATE_CREATED = val.DATE_CREATED;
						}
						if (val.TASHLUM_KAVUA_BANKIM !== null) {
							TASHLUM_KAVUA_BANKIM = val.TASHLUM_KAVUA_BANKIM;
						}
						if (val.TASHLUM_KAVUA_ASHRAI !== null) {
							TASHLUM_KAVUA_ASHRAI = val.TASHLUM_KAVUA_ASHRAI;
						}
						if (val.BANK_ROWS_HODESH_KODEM !== null) {
							BANK_ROWS_HODESH_KODEM = val.BANK_ROWS_HODESH_KODEM;
						}
						if (val.ASHRAI_ROWS_HODESH_KODEM !== null) {
							ASHRAI_ROWS_HODESH_KODEM = val.ASHRAI_ROWS_HODESH_KODEM;
						}
						if (val.TASHLUM_KAVUA_TOTAL !== null) {
							TASHLUM_KAVUA_TOTAL = val.TASHLUM_KAVUA_TOTAL;
						}
						if (val.TASHLUM_PERROW_BANKIM !== null) {
							TASHLUM_PERROW_BANKIM = val.TASHLUM_PERROW_BANKIM;
						}
						if (val.TASHLUM_PERROW_ASHRAI !== null) {
							TASHLUM_PERROW_ASHRAI = val.TASHLUM_PERROW_ASHRAI;
						}
						if (val.TASHLUM_PERROW_TOTAL !== null) {
							TASHLUM_PERROW_TOTAL = val.TASHLUM_PERROW_TOTAL;
						}

						if (val.PAAR_BANKIM !== null) {
							PAAR_BANKIM = val.PAAR_BANKIM;
						}
						if (val.PAAR_ASHRAI !== null) {
							PAAR_ASHRAI = val.PAAR_ASHRAI;
						}
						if (val.PAAR_TOTAL !== null) {
							PAAR_TOTAL = val.PAAR_TOTAL;
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">'
							+ COMPANY_NAME +
							'</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							SUG_HIUV
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							DATE_CREATED
							+ '</td>';
						if (!scope.appData.remove) {

							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								TASHLUM_KAVUA_BANKIM
								+ '</td>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								TASHLUM_KAVUA_ASHRAI
								+ '</td>';
						}

						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							BANK_ROWS_HODESH_KODEM
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							ASHRAI_ROWS_HODESH_KODEM
							+ '</td>';
						if (!scope.appData.remove) {
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								TASHLUM_KAVUA_TOTAL
								+ '</td>';
						}
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TASHLUM_PERROW_BANKIM
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TASHLUM_PERROW_ASHRAI
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							TASHLUM_PERROW_TOTAL
							+ '</td>';
						if (!scope.appData.remove) {
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								PAAR_BANKIM
								+ '</td>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								PAAR_ASHRAI
								+ '</td>';
							table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
								PAAR_TOTAL
								+ '</td>';
						}

						table += '</tr>';
					});
					table += '</tbody></table>';
					var nameAcc = "";
					if (scope.appData.userAccNameUsers || scope.appData.userAccName) {
						nameAcc = '- | ' + scope.appData.userAccName + ' ' + scope.appData.userAccNameUsers
					}
					var name_doch = 'דו״ח לקוחות קיימים ';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + nameAcc + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';

					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelSettingsDetailsClients() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var name_doch = 'דו״ח לקוחות קיימים' + ' ';
					var nameAcc = "";
					if (scope.appData.userAccNameUsers || scope.appData.userAccName) {
						nameAcc = '- | ' + scope.appData.userAccName + ' ' + scope.appData.userAccNameUsers
					}
					if (scope.appData.remove) {
						var data = {
							rows: [
								{
									"cell": [
										{
											val: getStringJson(name_doch + ' ' + nameAcc),
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}
									]
								},
								{
									"cell": [
										{
											val: "חברה",
											type: "header"
										}, {
											val: "סוג חיוב",
											type: "header"
										}, {
											val: "תאריך הקמה",
											type: "header"
										}, {
											val: "שורות בנק חודש קודם",
											type: "header"
										}, {
											val: "שורות כ.אשראי חודש קודם",
											type: "header"
										}, {
											val: "תשלום בנקים חדש",
											type: "header"
										}, {
											val: "תשלום אשראי חדש",
											type: "header"
										},
										{
											val: "סה\"כ תשלום חדש",
											type: "header"
										}
									]
								}
							],
							styles: [
								{
									"type": "header",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": true,
									"fontSize": 12,
									"color": "ffffff",
									"fillForegroundColor": "1387a9",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cell",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellGreen",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "62b03f",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellRed",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "ec3c66",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBold",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "d3eaf1",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBolder",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "E0E0E0",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBoldBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "d3eaf1",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBolderBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "E0E0E0",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								}
							],
							mergeCells: [],
							widthCells: [100],
							senderMail: []
						}
					} else {
						var data = {
							rows: [
								{
									"cell": [
										{
											val: getStringJson(name_doch + ' ' + nameAcc),
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}
									]
								},
								{
									"cell": [
										{
											val: "חברה",
											type: "header"
										}, {
											val: "סוג חיוב",
											type: "header"
										}, {
											val: "תאריך הקמה",
											type: "header"
										}, {
											val: "חשבונות בנק",
											type: "header"
										}, {
											val: "כרטיסי אשראי",
											type: "header"
										}, {
											val: "שורות בנק חודש קודם",
											type: "header"
										}, {
											val: "שורות כ.אשראי חודש קודם",
											type: "header"
										},
										{
											val: "תשלום קיים",
											type: "header"
										},
										{
											val: "תשלום בנקים חדש",
											type: "header"
										},
										{
											val: "תשלום אשראי חדש",
											type: "header"
										},
										{
											val: "סה\"כ תשלום חדש",
											type: "header"
										},
										{
											val: "פער בנקים",
											type: "header"
										},
										{
											val: "פער אשראי",
											type: "header"
										},
										{
											val: "פער לחברה",
											type: "header"
										}
									]
								}
							],
							styles: [
								{
									"type": "header",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": true,
									"fontSize": 12,
									"color": "ffffff",
									"fillForegroundColor": "1387a9",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cell",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellGreen",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "62b03f",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},

								{
									"type": "cellRed",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "ec3c66",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},

								{
									"type": "cellBold",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "d3eaf1",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBolder",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "E0E0E0",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBoldBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "d3eaf1",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBolderBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "E0E0E0",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								}
							],
							mergeCells: [],
							widthCells: [100],
							senderMail: []
						}
					}

					data.mergeCells.push("A1:C1");

					$(scope.appData.existing_company_calc).each(function (i, val) {
						if (scope.appData.remove) {
							var rows = {
								"cell": [
									{
										val: getStringJson(val.COMPANY_NAME),
										type: "cell"
									},
									{
										val: getStringJson(scope.accoConversions.getTypeHiuv(val.SUG_HIUV)),
										type: "cell"
									},
									{
										val: getStringJson(val.DATE_CREATED),
										type: "cell"
									},
									{
										val: getStringJson(val.BANK_ROWS_HODESH_KODEM),
										type: "cell"
									},
									{
										val: getStringJson(val.ASHRAI_ROWS_HODESH_KODEM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_BANKIM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_ASHRAI),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_TOTAL),
										type: "cell"
									}
								]
							};
						} else {
							var rows = {
								"cell": [
									{
										val: getStringJson(val.COMPANY_NAME),
										type: "cell"
									},
									{
										val: getStringJson(scope.accoConversions.getTypeHiuv(val.SUG_HIUV)),
										type: "cell"
									},
									{
										val: getStringJson(val.DATE_CREATED),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_KAVUA_BANKIM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_KAVUA_ASHRAI),
										type: "cell"
									},
									{
										val: getStringJson(val.BANK_ROWS_HODESH_KODEM),
										type: "cell"
									},
									{
										val: getStringJson(val.ASHRAI_ROWS_HODESH_KODEM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_KAVUA_TOTAL),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_BANKIM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_ASHRAI),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_TOTAL),
										type: "cell"
									},
									{
										val: getStringJson(val.PAAR_BANKIM),
										type: "cell"
									}, {
										val: getStringJson(val.PAAR_ASHRAI),
										type: "cell"
									},
									{
										val: getStringJson(val.PAAR_TOTAL),
										type: "cellBorderLeft"
									}
								]
							};
						}

						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailerSettingsDetailsClients(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;

					var nameAcc = "";
					if (scope.appData.userAccNameUsers || scope.appData.userAccName) {
						nameAcc = '- | ' + scope.appData.userAccName + ' ' + scope.appData.userAccNameUsers
					}
					var name_doch = 'דו״ח לקוחות קיימים' + ' ';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name;
					if (scope.appData.remove) {
						var data = {
							rows: [
								{
									"cell": [
										{
											val: getStringJson(name_doch + ' ' + nameAcc),
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}
									]
								},
								{
									"cell": [
										{
											val: "חברה",
											type: "header"
										}, {
											val: "סוג חיוב",
											type: "header"
										}, {
											val: "תאריך הקמה",
											type: "header"
										}, {
											val: "שורות בנק חודש קודם",
											type: "header"
										}, {
											val: "שורות כ.אשראי חודש קודם",
											type: "header"
										}, {
											val: "תשלום בנקים חדש",
											type: "header"
										}, {
											val: "תשלום אשראי חדש",
											type: "header"
										},
										{
											val: "סה\"כ תשלום חדש",
											type: "header"
										}
									]
								}
							],
							styles: [
								{
									"type": "header",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": true,
									"fontSize": 12,
									"color": "ffffff",
									"fillForegroundColor": "1387a9",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cell",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellGreen",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "62b03f",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},

								{
									"type": "cellRed",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "ec3c66",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},

								{
									"type": "cellBold",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "d3eaf1",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBolder",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "E0E0E0",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBoldBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "d3eaf1",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBolderBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "E0E0E0",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								}
							],
							mergeCells: [],
							widthCells: [100],
							senderMail: [{
								'title': name_doch,
								'toAddressMail': scope.appData.existing_company_calc_mail,
								'name_roh': name_roh,
								'name_doch': name_doch,
								'name_company': name_company
							}]
						}
					} else {
						var data = {
							rows: [
								{
									"cell": [
										{
											val: getStringJson(name_doch + ' ' + nameAcc),
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										},
										{
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}, {
											val: "",
											type: "cellBold"
										}
									]
								},
								{
									"cell": [
										{
											val: "חברה",
											type: "header"
										}, {
											val: "סוג חיוב",
											type: "header"
										}, {
											val: "תאריך הקמה",
											type: "header"
										}, {
											val: "חשבונות בנק",
											type: "header"
										}, {
											val: "כרטיסי אשראי",
											type: "header"
										}, {
											val: "שורות בנק חודש קודם",
											type: "header"
										}, {
											val: "שורות כ.אשראי חודש קודם",
											type: "header"
										},
										{
											val: "תשלום קיים",
											type: "header"
										},
										{
											val: "תשלום בנקים חדש",
											type: "header"
										},
										{
											val: "תשלום אשראי חדש",
											type: "header"
										},
										{
											val: "סה\"כ תשלום חדש",
											type: "header"
										},
										{
											val: "פער בנקים",
											type: "header"
										},
										{
											val: "פער אשראי",
											type: "header"
										},
										{
											val: "פער לחברה",
											type: "header"
										}
									]
								}
							],
							styles: [
								{
									"type": "header",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": true,
									"fontSize": 12,
									"color": "ffffff",
									"fillForegroundColor": "1387a9",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cell",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellGreen",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "62b03f",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},

								{
									"type": "cellRed",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "ec3c66",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},

								{
									"type": "cellBold",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "d3eaf1",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBolder",
									"borderRight": true,
									"borderRightColor": "fafafa",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "E0E0E0",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": false,
									"borderTopColor": "e80101",
									"borderBottom": true,
									"borderBottomColor": "c6c6c6",
									"bold": false,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "ffffff",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBoldBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "d3eaf1",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								},
								{
									"type": "cellBolderBorderLeft",
									"borderRight": true,
									"borderRightColor": "c6c6c6",
									"borderLeft": true,
									"borderLeftColor": "fafafa",
									"borderTop": true,
									"borderTopColor": "d3eaf1",
									"borderBottom": true,
									"borderBottomColor": "d3eaf1",
									"bold": true,
									"fontSize": 11,
									"color": "151313",
									"fillForegroundColor": "E0E0E0",
									"alignment": "right",
									"verticalAlignment": "center",
									"fontItalic": false,
									"typesCellNumber": false
								}
							],
							mergeCells: [],
							widthCells: [100],
							senderMail: [{
								'title': name_doch,
								'toAddressMail': scope.appData.existing_company_calc_mail,
								'name_roh': name_roh,
								'name_doch': name_doch,
								'name_company': name_company
							}]
						}
					}

					data.mergeCells.push("A1:C1");

					$(scope.appData.existing_company_calc).each(function (i, val) {
						if (scope.appData.remove) {
							var rows = {
								"cell": [
									{
										val: getStringJson(val.COMPANY_NAME),
										type: "cell"
									},
									{
										val: getStringJson(scope.accoConversions.getTypeHiuv(val.SUG_HIUV)),
										type: "cell"
									},
									{
										val: getStringJson(val.DATE_CREATED),
										type: "cell"
									},
									{
										val: getStringJson(val.BANK_ROWS_HODESH_KODEM),
										type: "cell"
									},
									{
										val: getStringJson(val.ASHRAI_ROWS_HODESH_KODEM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_BANKIM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_ASHRAI),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_TOTAL),
										type: "cell"
									}
								]
							};
						} else {
							var rows = {
								"cell": [
									{
										val: getStringJson(val.COMPANY_NAME),
										type: "cell"
									},
									{
										val: getStringJson(scope.accoConversions.getTypeHiuv(val.SUG_HIUV)),
										type: "cell"
									},
									{
										val: getStringJson(val.DATE_CREATED),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_KAVUA_BANKIM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_KAVUA_ASHRAI),
										type: "cell"
									},
									{
										val: getStringJson(val.BANK_ROWS_HODESH_KODEM),
										type: "cell"
									},
									{
										val: getStringJson(val.ASHRAI_ROWS_HODESH_KODEM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_KAVUA_TOTAL),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_BANKIM),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_ASHRAI),
										type: "cell"
									},
									{
										val: getStringJson(val.TASHLUM_PERROW_TOTAL),
										type: "cell"
									},
									{
										val: getStringJson(val.PAAR_BANKIM),
										type: "cell"
									}, {
										val: getStringJson(val.PAAR_ASHRAI),
										type: "cell"
									},
									{
										val: getStringJson(val.PAAR_TOTAL),
										type: "cellBorderLeft"
									}
								]
							};
						}

						data.rows.push(rows);
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}


	function exportsPrintSettingsDetailsClientsPoten() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var nameAcc = "";
					if (scope.appData.userAccNameUsers || scope.appData.userAccName) {
						nameAcc = ' | ' + scope.appData.userAccName + ' ' + scope.appData.userAccNameUsers
					}
					var table = '';
					table += '<table style="width:100%;direction:rtl; text-align:center; "><thead><tr style="color: #666;font: bold 12px arial;">';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); "> חברה</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); ">ממוצע שורות</th>';
					table += '<th style="border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); "> תשלום בנקים משוער</th>';
					table += '</tr></thead>';
					table += '<tbody>';
					$(scope.appData.get_potential_companies).each(function (i, val) {
						var COMPANY_NAME = '&nbsp;',
							AVG_ROWS = '&nbsp;',
							ITEM_PRICE_BEFORE_VAT = '&nbsp;';

						if (val.COMPANY_NAME !== null) {
							COMPANY_NAME = getStringJson(val.COMPANY_NAME);
						}
						if (val.AVG_ROWS !== null) {
							AVG_ROWS = val.AVG_ROWS;
						}
						if (val.ITEM_PRICE_BEFORE_VAT !== null) {
							ITEM_PRICE_BEFORE_VAT = val.ITEM_PRICE_BEFORE_VAT;
						}
						table += '<tr>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); border-right-width: 1px; border-right-style: solid; border-right-color: rgb(51, 51, 51); border-bottom:1px solid rgb(214, 205, 205);font-weight: normal;">'
							+ COMPANY_NAME +
							'</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							AVG_ROWS
							+ '</td>';
						table += '<td style="text-align: center; font-style: normal; font-variant: normal; font-stretch: normal; font-size: 13px; line-height: normal; font-family: arial; vertical-align: bottom; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(214, 205, 205); border-left-width: 1px; border-left-style: solid; border-left-color: rgb(51, 51, 51); font-weight: normal;border-bottom:1px solid rgb(214, 205, 205);">' +
							ITEM_PRICE_BEFORE_VAT
							+ '</td>';
						table += '</tr>';
					});
					table += '</tbody></table>';

					var name_doch = 'דו״ח לקוחות פוטנציאלים -';
					var title = '<table style="width: 100%;direction: rtl; text-align:right;"><td colspan="3" style="font: bold 20px/25px Arial;direction: rtl; text-align:right;">' + name_doch + ' ' + scope.appData.defMonth.full_name + nameAcc + '</td>';
					var dataArr1 = '<html><body style="background-color: transparent !important;background-image: none !important;"><div>' + title + '</div>' + '<div style="border-collapse: collapse;border-spacing: 0;text-align: right;direction: rtl;width: 100%;border-radius: 4px;font-family:arial;">' + table.replace(/<a\/?[^>]+>/gi, '').replace(/'/gi, '&#39;') + '</div>' + '</body></html>';

					var strFrameName = ("printer-" + (new Date()).getTime());
					var jFrame = $("<iframe name='" + strFrameName + "'>");
					jFrame.appendTo($("body:first"));
					var objFrame = window.frames[strFrameName];
					var objDoc = objFrame.document;
					objDoc.open();
					objDoc.write('<!DOCTYPE html><html><head><style>@media print{  @page {size: landscape;-webkit-transform: rotate(-90deg); -moz-transform:rotate(-90deg);filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=3);}  }</style></head><body>' + dataArr1 + '</body></html>');
					objDoc.close();
					objFrame.focus();
					objFrame.print();
					setTimeout(function () {
						jFrame.remove();
					}, (1000));

				});
			}
		}
	}

	function exportsExcelSettingsDetailsClientsPoten() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					var nameAcc = "";
					if (scope.appData.userAccNameUsers || scope.appData.userAccName) {
						nameAcc = ' | ' + scope.appData.userAccName + ' ' + scope.appData.userAccNameUsers
					}
					var name_doch = 'דו״ח לקוחות פוטנציאלים' + ' -';
					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name + nameAcc),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									}
								]
							},
							{
								"cell": [
									{
										val: "חברה",
										type: "header"
									}, {
										val: "ממוצע שורות",
										type: "header"
									}, {
										val: "תשלום בנקים משוער",
										type: "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [100],
						senderMail: []
					}

					data.mergeCells.push("A1:C1");

					$(scope.appData.get_potential_companies).each(function (i, val) {
						var rows = {
							"cell": [
								{
									val: getStringJson(val.COMPANY_NAME),
									type: "cell"
								},
								{
									val: getStringJson(val.AVG_ROWS),
									type: "cell"
								},
								{
									val: getStringJson(val.ITEM_PRICE_BEFORE_VAT),
									type: "cellBorderLeft"
								}
							]
						};

						data.rows.push(rows);
					});

					$('#ReportTableData').remove();
					$('body').prepend("<form method='post' action='" + hostnameWsPhp + "' style='display:none' id='ReportTableData'><textarea name='data'>" + JSON.stringify(data) + "</textarea></form>");
					$('#ReportTableData').submit().remove();
					return false;
				});
			}
		}
	}

	function exportsMailerSettingsDetailsClientsPoten(serverConnection) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).on('click', function () {
					scope.appData.errorSenderMailerExcel = "";
					scope.appData.loaderMailerPop = true;

					var nameAcc = "";
					if (scope.appData.userAccNameUsers || scope.appData.userAccName) {
						nameAcc = ' | ' + scope.appData.userAccName + ' ' + scope.appData.userAccNameUsers
					}
					var name_doch = 'דו״ח לקוחות פוטנציאלים' + ' -';
					var name_roh, name_company = '';
					name_roh = scope.appData.defMonth.full_name + nameAcc;

					var data = {
						rows: [
							{
								"cell": [
									{
										val: getStringJson(name_doch + ' ' + scope.appData.defMonth.full_name),
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									},
									{
										val: "",
										type: "cellBold"
									}
								]
							},
							{
								"cell": [
									{
										val: "חברה",
										type: "header"
									}, {
										val: "ממוצע שורות",
										type: "header"
									}, {
										val: "תשלום בנקים משוער",
										type: "header"
									}
								]
							}
						],
						styles: [
							{
								"type": "header",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": true,
								"fontSize": 12,
								"color": "ffffff",
								"fillForegroundColor": "1387a9",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cell",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellGreen",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "62b03f",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellRed",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "ec3c66",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},

							{
								"type": "cellBold",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolder",
								"borderRight": true,
								"borderRightColor": "fafafa",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": false,
								"borderTopColor": "e80101",
								"borderBottom": true,
								"borderBottomColor": "c6c6c6",
								"bold": false,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "ffffff",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBoldBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "d3eaf1",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							},
							{
								"type": "cellBolderBorderLeft",
								"borderRight": true,
								"borderRightColor": "c6c6c6",
								"borderLeft": true,
								"borderLeftColor": "fafafa",
								"borderTop": true,
								"borderTopColor": "d3eaf1",
								"borderBottom": true,
								"borderBottomColor": "d3eaf1",
								"bold": true,
								"fontSize": 11,
								"color": "151313",
								"fillForegroundColor": "E0E0E0",
								"alignment": "right",
								"verticalAlignment": "center",
								"fontItalic": false,
								"typesCellNumber": false
							}
						],
						mergeCells: [],
						widthCells: [100],
						senderMail: [{
							'title': name_doch,
							'toAddressMail': scope.appData.existing_company_calc_mail,
							'name_roh': name_roh,
							'name_doch': name_doch,
							'name_company': name_company
						}]
					}


					data.mergeCells.push("A1:C1");

					$(scope.appData.get_potential_companies).each(function (i, val) {
						var rows = {
							"cell": [
								{
									val: getStringJson(val.COMPANY_NAME),
									type: "cell"
								},
								{
									val: getStringJson(val.AVG_ROWS),
									type: "cell"
								},
								{
									val: getStringJson(val.ITEM_PRICE_BEFORE_VAT),
									type: "cellBorderLeft"
								}
							]
						};

						data.rows.push(rows);
					});

					serverConnection.sendMailer(JSON.stringify(data)).then(function (res) {
						scope.appData.loaderMailerPop = false;
						if (res == "true") {
							scope.appData.errorSenderMailerExcel = 'המייל נשלח בהצלחה';
							scope.hidePopup();
						}
						else {
							scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
						}
					}, function (error) {
						scope.appData.loaderMailerPop = false;
						scope.appData.errorSenderMailerExcel = 'המייל לא נשלח בהצלחה';
					});
				});
			}
		}
	}


	angular.module('directives').directive({
		'exportsExcelPriority': exportsExcelPriority,
		'exportsExcel': exportsExcel,
		'exportsPrint': exportsPrint,
		'exportsMailer': ['serverConnection', exportsMailer],
		'exportsText': exportsText,
		'exportsTextRiv': exportsTextRiv,
		'exportsPrintCard': exportsPrintCard,
		'exportsExcelCardsPriority': exportsExcelCardsPriority,
		'exportsExcelCards': exportsExcelCards,
		'exportsMailerCards': ['serverConnection', exportsMailerCards],
		'exportsPrintSlika': exportsPrintSlika,
		'exportsExcelSlika': exportsExcelSlika,
		'exportsMailerSlika': ['serverConnection', exportsMailerSlika],
		'exportsPrintTazrim': exportsPrintTazrim,
		'exportsExcelTazrim': exportsExcelTazrim,
		'exportsMailerTazrim': ['serverConnection', exportsMailerTazrim],
		'exportsPrintAnalisis': exportsPrintAnalisis,
		'exportsExcelAnalisis': exportsExcelAnalisis,
		'exportsMailerAnalisis': ['serverConnection', exportsMailerAnalisis],
		'exportsPrintTrial': exportsPrintTrial,
		'exportsExcelTrial': exportsExcelTrial,
		'exportsMailerTrial': ['serverConnection', exportsMailerTrial],
		'exportsExcelHashPage': exportsExcelHashPage,
		'exportsExcelHashPageCards': exportsExcelHashPageCards,
		'exportsExcelCompanys': exportsExcelCompanys,
		'exportsPrintRevah': exportsPrintRevah,
		'exportsExcelRevah': exportsExcelRevah,
		'exportsMailerRevah': ['serverConnection', exportsMailerRevah],
		'exportsExcelHash': exportsExcelHash,
		'exportsMailerHash': ['serverConnection', exportsMailerHash],
		'exportsPrintHash': exportsPrintHash,
		'exportsPrintChecks': exportsPrintChecks,
		'exportsExcelChecks': exportsExcelChecks,
		'exportsMailerChecks': ['serverConnection', exportsMailerChecks],
		'exportsPrintMainAcc': exportsPrintMainAcc,
		'exportsExcelMainAcc': exportsExcelMainAcc,
		'exportsMailerMainAcc': ['serverConnection', exportsMailerMainAcc],
		'exportsPrintAccCards': exportsPrintAccCards,
		'exportsExcelAccCards': exportsExcelAccCards,
		'exportsMailerAccCards': ['serverConnection', exportsMailerAccCards],
		'printAllChecks': printAllChecks,
		'exportsPrintExpMissingReportTable': exportsPrintExpMissingReportTable,
		'exportsExcelExpMissingReportTable': exportsExcelExpMissingReportTable,
		'exportsMailExpMissingReportTable': ['serverConnection', exportsMailExpMissingReportTable],
		'exportsPrintChangeExRepo': exportsPrintChangeExRepo,
		'exportsExcelChangeExRepo': exportsExcelChangeExRepo,
		'exportsMailChangeExRepo': ['serverConnection', exportsMailChangeExRepo],
		'exportsPrintTypereport': exportsPrintTypereport,
		'exportsExcelTypereport': exportsExcelTypereport,
		'exportsMailTypereport': ['serverConnection', exportsMailTypereport],
		'exportsPrintDohMatch': exportsPrintDohMatch,
		'exportsExcelDohMatch': exportsExcelDohMatch,
		'exportsMailDohMatch': ['serverConnection', exportsMailDohMatch],
		'exportsPrintTasks': exportsPrintTasks,
		'exportsExcelTasks': exportsExcelTasks,
		'exportsMailTasks': exportsMailTasks,
		'exportsPrintQaitrot': exportsPrintQaitrot,
		'exportsExcelQaitrot': exportsExcelQaitrot,
		'exportsMailQaitrot': exportsMailQaitrot,
		'exportsPrintMehuad': exportsPrintMehuad,
		'exportsExcelMehuad': exportsExcelMehuad,
		'exportsMailMehuad': ['serverConnection', exportsMailMehuad],
		'exportsPrintRegularOp': exportsPrintRegularOp,
		'exportsExcelRegularOp': exportsExcelRegularOp,
		'exportsMailRegularOp': ['serverConnection', exportsMailRegularOp],
		'exportsPrintAccBill': exportsPrintAccBill,
		'exportsExcelAccBill': exportsExcelAccBill,
		'exportsMailerAccBill': ['serverConnection', exportsMailerAccBill],
		'exportsPrintAccBill2': exportsPrintAccBill2,
		'exportsExcelAccBill2': exportsExcelAccBill2,
		'exportsMailerAccBill2': ['serverConnection', exportsMailerAccBill2],
		'exportsPrintAccPays': exportsPrintAccPays,
		'exportsExcelAccPays': exportsExcelAccPays,
		'exportsMailerAccPays': ['serverConnection', exportsMailerAccPays],
		'exportsPrintQa': exportsPrintQa,
		'exportsExcelQa': exportsExcelQa,
		'exportsPrintPopTransfer': exportsPrintPopTransfer,
		'exportsExcelPopTransfer': exportsExcelPopTransfer,
		'exportsExcelPopDtlPays': exportsExcelPopDtlPays,
		'exportsMailPopDtlPays': ['serverConnection', exportsMailPopDtlPays],
		'exportsPrintSettingsDetailsClients': exportsPrintSettingsDetailsClients,
		'exportsExcelSettingsDetailsClients': exportsExcelSettingsDetailsClients,
		'exportsMailerSettingsDetailsClients': ['serverConnection', exportsMailerSettingsDetailsClients],
		'exportsPrintSettingsDetailsClientsPoten': exportsPrintSettingsDetailsClientsPoten,
		'exportsExcelSettingsDetailsClientsPoten': exportsExcelSettingsDetailsClientsPoten,
		'exportsMailerSettingsDetailsClientsPoten': ['serverConnection', exportsMailerSettingsDetailsClientsPoten]
	});
}());
