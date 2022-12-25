(function () {
	function accoConversions() {
		return {
			getDayName: function (date) {
				var d = new Date(parseInt(date.split('/')[2]), parseInt(date.split('/')[1]), parseInt(date.split('/')[0]));
				var str = '';
				switch (d.getDay()) {
					case 0:
						str = 'ראשון';
						break;
					case 1:
						str = 'שני';
						break;
					case 2:
						str = 'שלישי';
						break;
					case 3:
						str = 'רביעי';
						break;
					case 4:
						str = 'חמישי';
						break;
					case 5:
						str = 'שישי';
						break;
					case 6:
						str = 'שבת';
						break;
				}
				return str;
			},
			getStatusCompany: function (num) {
				if (num == 0) {
					return 'תקין';
				}
				if (num == 1) {
					return ' לא נקלט בחשבשבת';
				}

			},
			getStatusCompanyEx: function (num, izu_source_program_id) {
				if (izu_source_program_id == 111 && num == 1) {
					return "לא נקלט ברווחית";
				}
				else {
					switch (num) {
						case 0:
							return "ייצוא תקין";
							break;
						case 1:
							return "לא נקלט בתכנת הניהול";
							break;
						case 2:
							return "בבדיקה";
							break;
						case 3:
							return "הוזנו נתונים ממקור אחר";
							break;
						case 4:
							return "קיימת בעיה טכנית";
							break;
						case 7:
							return "הוקלדה פעולת עבר";
							break;
						case 8:
							return "מחכה לייצוא"
							break;
						case 99:
							return "בעיות לפני יצוא"
							break;
						case 55:
							return "נמצא שיוך לכרטיס"
							break;
						case 56:
							return "מעדכן המלצות שיוך..."
							break;
						case 57:
							return "השיוך נכשל"
							break;
						case null:
							return ""
							break;
					}
				}
			},
			getStatusListDD: function (num) {
				switch (num) {
					case 0:
						return "ייצוא תקין";
						break;
					case 1:
						return "לא נקלט בחשבשבת";
						break;
					case 2:
						return "בבדיקה";
						break;
					case 3:
						return "הוזנו נתונים ממקור אחר";
						break;
					case 4:
						return "קיימת בעיה טכנית";
						break;
					case 7:
						return "הוקלדה פעולת עבר";
						break;
					case 8:
						return "מחכה לייצוא"
						break;
					case 99:
						return "בעיות לפני יצוא"
						break;
					case 55:
						return "נמצא שיוך לכרטיס"
						break;
					case 56:
						return "מעדכן המלצות שיוך..."
						break;
					case 57:
						return "השיוך נכשל"
						break;
					case null:
						return "תקין"
						break;
				}
			},
			getDateMonth: function (date) {
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
			},
			getDayMonth: function (date) {
				if (date) {
					var day = parseInt(date.split('/')[0]);
					var month;
					switch (date.split('/')[1]) {
						case '01':
							month = "ינו"
							break;
						case '02':
							month = "פבר"
							break;
						case '03':
							month = "מרץ";
							break;
						case '04':
							month = "אפר"
							break;
						case '05':
							month = "מאי";
							break;
						case '06':
							month = "יוני";
							break;
						case '07':
							month = "יולי";
							break;
						case '08':
							month = 'אוג';
							break;
						case '09':
							month = "ספט";
							break;
						case '10':
							month = "אוק";
							break;
						case '11':
							month = "נוב";
							break;
						case '12':
							month = "דצמ";
							break;
					}
					return day + ' ב' + month;
				}
			},
			getDayMonthGraph: function (dates) {
				if (dates == 'שם חברה' || dates == 'סה״כ') {
					return dates;
				}
				var x;
				var date = dates.toString().substr(4, 2);
				switch (date) {
					case '01':
						x = "ינו'";
						break;
					case '02':
						x = "פבר'";
						break;
					case '03':
						x = "מרץ";
						break;
					case '04':
						x = "אפר'";
						break;
					case '05':
						x = "מאי";
						break;
					case '06':
						x = "יונ'";
						break;
					case '07':
						x = "יול'";
						break;
					case '08':
						x = "אוג'";
						break;
					case '09':
						x = "ספט׳";
						break;
					case '10':
						x = "אוק'";
						break;
					case '11':
						x = "נוב'";
						break;
					case '12':
						x = "דצמ'";
						break;
				}

				return x + ' ' + dates.toString().substr(0, 4);
			},
			getDayMonthNum: function (date) {
				var year = date.toString().substring(0, 4);
				var month;
				switch (date.toString().substring(4, 6)) {
					case '01':
						month = "ינו'";
						break;
					case '02':
						month = "פבר'";
						break;
					case '03':
						month = "מרץ";
						break;
					case '04':
						month = "אפר'";
						break;
					case '05':
						month = "מאי";
						break;
					case '06':
						month = "יוני";
						break;
					case '07':
						month = "יולי";
						break;
					case '08':
						month = "אוג'";
						break;
					case '09':
						month = "ספט'";
						break;
					case '10':
						month = "אוק'";
						break;
					case '11':
						month = "נוב'";
						break;
					case '12':
						month = "דצמ'";
						break;
				}
				return month + ' ' + year;
			},
			getYearMont: function (date) {
				var year = date.split('/')[2];
				var month;
				switch (date.split('/')[1]) {
					case '01':
						month = "ינו'";
						break;
					case '02':
						month = "פבר'";
						break;
					case '03':
						month = "מרץ";
						break;
					case '04':
						month = "אפר'";
						break;
					case '05':
						month = "מאי";
						break;
					case '06':
						month = "יוני";
						break;
					case '07':
						month = "יולי";
						break;
					case '08':
						month = "אוג'";
						break;
					case '09':
						month = "ספט'";
						break;
					case '10':
						month = "אוק'";
						break;
					case '11':
						month = "נוב'";
						break;
					case '12':
						month = "דצמ'";
						break;
				}
				return month + ' ' + year;
			},
			getParseInt: function (number) {
				return parseInt(number);
			},
			getParseComma: function (number) {
				return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			},
			getBankName: function (num) {
				switch (num) {
					// case 58:
					// 	return ("דיסקונט עסקים");
					// case 57:
					// 	return ("מרכנתיל עסקים");
					case 13:
						return ("איגוד");
					case 14:
						return ("אוצר החייל");
					case 11:
						return ("דיסקונט");
					case 68:
						return ("דקסיה");
					case 12:
						return ("הפועלים");
					case 54:
						return ("ירושלים");
					case 10:
						return ("לאומי");
					case 20:
						return ("מזרחי");
					case 46:
						return ("מסד");
					case 17:
						return ("מרכנתיל");
					case 34:
						return ("ערבי ישראלי");
					case 52:
						return ("אגודת ישראל");
					case 31:
						return ("הבינלאומי");
					case 26:
					case 126:
						return ("יובנק");
					case 4:
						return ("יהב");
					case 9:
						return ("הדואר");
					case 157:
						return ("מרכנתיל עסקים פלוס");
					case 158:
						return ("דיסקונט עסקים פלוס");
					case 999:
						return ("פועלים בעסקים");
				}
			},
			getBankNameDiscode: function (num) {
				switch (num) {
					case 157:
						return ("סיסמה");
					case 158:
						return ("סיסמה");
				}
			},
			getCardType: function (num) {
				switch (num) {
					case 21:
						return ("ויזה");
					case 22:
						return ("ישראכרט");
					case 23:
						return ("מאסטרקארד");
					case 24:
						return ("לאומיקארד");
					case 25:
						return ("אמריקן אקספרס");
					case 26:
						return ("דיינרס");
					case 30:
						return ("אחר");
				}
			},
			getSlika: function (num) {
				switch (num) {
					case 80:
						return ("לאומי קארד");
					case 81:
						return ("ויזה");
					case 82:
						return ("ישראכרט");
					case 83:
						return ("דיינרס");
					case 84:
						return ("אמריקן אקספרס");
					case 85:
						return ("פועלים אקספרס");
					case 86:
						return ("יורו קארד");
					case 87:
						return ("משולם");
					case 88:
						return ("מאסטר קארד");
					case 99:
						return ("אחר");
					case 89:
						return ("צמרת מימונים");
					case 90:
						return ("גמא");
					case 91:
						return ("יציל פיננסים");
				}
			},
			getStatus: function (num) {
				switch (num) {
					case 0:
						return ("תקין");
						break;
					case 1:
						return ("קיימת בעיה טכנית");
						break;
					case 2:
						return ("סיסמא שגויה");
						break;
					case 3:
						return ("חשבון חסום");
						break;

					case 4:
						return ("הסיסמא פגה");
						break;

					case 5:
						return ("סיסמא הולכת לפוג בבנק");
						break;

					case 6:
						return ("לא התקבל קוד");
						break;

					case 8:
						return ("תקין");
						break;

					case 9:
					case 99:
						return ("מתחבר...");
						break;

					case 10:
						return ("מתחבר לראשונה...");
						break;

					case 17:
						return ("נדרש הסכם שירות");
						break;

					case 444:
						return ("מבזק בנקאי");
						break;

					case 4444:
						return ("פועלים בעסקים");
						break;

					case 158:
						return ("עדכון סיסמה");
						break;

					case 157:
						return ("עדכון סיסמה");
						break;

					case 100:
						return ("מושך נתוני בנק");
						break;

					case 101:
						return ("מושך כ.אשראי");
						break;

					case 102:
						return ("מושך צקים ממשמרת");
						break;

					case 103:
						return ("מושך פקדונות");
						break;
					case 122:
						return ("עדכון OTP");
						break;
					case 104:
						return ("מושך הלוואות");
						break;

					case 105:
						return ("מושך הוראות קבע");
						break;

					case null:
						return ("תקין");
						break;
				}
			},
			getClasification: function (num) {
				switch (num) {
					case 1:
						return ("שיק");
						break;
					case 2:
						return ("מזומן");
						break;
					case 3:
						return ("אשראי");
						break;
					case 9:
						return ("העברה בנקאית");
						break;
					case 10:
						return ("אחר");
						break;
					case 40:
						return ("הוראת קבע");
						break;
					default:
						return "";
						break;
				}
			},
			getTypePayment: function (num) {
				switch (num) {
					case 1:
						return "שיק";
						break;
					case 2:
						return ("מזומן");
						break;
					case 3:
						return "אשראי";
						break;
					case 4:
						return "אשראי";
						break;
					case 9:
						return "העברה בנקאית";
						break;
					case 10:
						return "צפי";
						break;
					case 40:
						return "הוראת קבע";
						break;
				}
			},
			getAllBanks: function () {
				var banks = [
					{
						name: 'בנק הפועלים',
						val: '12',
						color: '#c00',
						inputs: [
							{
								name: 'קוד משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: '',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'פועלים בעסקים',
						val: '999',
						color: '#c00',
						inputs: [
							{
								name: 'סניף:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'חשבון:',
								placeholders: '',
								val: 'bank_auto',
								data: ''
							}
						]
					},
					{
						name: 'בנק דיסקונט',
						val: '11',
						color: '#5E7A4D',
						inputs: [
							{
								name: 'מספר תעודת זהות / מנוי:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''},
							{name: 'קוד מזהה:', placeholders: '', val: 'bank_auto', data: ''}
						]
					},
					{
						name: 'דיסקונט עסקים פלוס',
						val: '158',
						color: '#5E7A4D',
						inputs: [
							{
								name: 'מספר תעודת זהות:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: '',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'בנק לאומי לישראל',
						val: '10',
						color: '#77d5fb',
						inputs: [
							{
								name: 'זיהוי משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: '',
								regValid: 'lettresAndNumbers'
							},
							{
								name: 'סיסמה:',
								placeholders: '',
								val: 'bank_pass',
								data: '',
								regValid: 'pass'
							}
						]
					},
					{
						name: 'בנק מזרחי טפחות',
						val: '20',
						color: '#fb8217',
						inputs: [
							{
								name: 'מספר משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: '',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'הבנק הבינלאומי הראשון',
						val: '31',
						color: '#1bec89',
						inputs: [
							{
								name: 'קוד משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					},
					{
						name: 'בנק מרכנתיל דיסקונט',
						val: '17',
						color: '#5E7A4D',
						inputs: [
							{
								name: 'מספר תעודת זהות / מנוי:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''},
							{name: 'קוד מזהה:', placeholders: '', val: 'bank_auto', data: ''}
						]
					},
					{
						name: 'מרכנתיל עסקים פלוס',
						val: '157',
						color: '#5E7A4D',
						inputs: [
							{
								name: 'מספר תעודת זהות:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: '',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'בנק אוצר החייל',
						val: '14',
						color: '#1bec89',
						inputs: [
							{
								name: 'קוד משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					},
					{
						name: 'בנק איגוד',
						val: '13',
						color: '#b5744d',
						inputs: [
							{
								name: 'זיהוי משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					},
					{
						name: 'בנק יהב',
						val: '04',
						color: '#14336a',
						inputs: [
							{name: 'זיהוי משתמש:', placeholders: '', val: 'bank_user_name'},
							{name: 'מספר תעודת זהות:', placeholders: '', val: 'bank_auto'},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass'}
						]
					},
					{
						name: 'בנק מסד',
						val: '46',
						color: '#5E7A4D',
						inputs: [
							{
								name: 'קוד משתמש:', placeholders: '',
								val: 'bank_user_name', data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: '',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: ' בנק פאג"י',
						val: '52',
						color: '#295499',
						inputs: [
							{
								name: 'קוד משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					},
					{
						name: 'בנק ערבי ישראלי',
						val: '34',
						color: '#00adef',
						inputs: [
							{
								name: 'זיהוי משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					},
					{
						name: 'בנק הדואר',
						val: '9',
						color: '#c00',
						inputs: [
							{
								name: 'שם משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: '',
								val: 'bank_pass',
								data: ''
							},
							{
								name: 'מספר תעודת זהות:',
								placeholders: '',
								val: 'bank_auto',
								data: ''
							}
						]
					},
					{
						name: 'בנק ירושלים',
						val: '54',
						color: '#CA8853',
						inputs: [
							{
								name: 'שם משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					},
					{
						name: 'יו בנק',
						val: '126',
						color: '#1bec89',
						inputs: [
							{
								name: 'קוד משתמש:',
								placeholders: '',
								val: 'bank_user_name',
								data: ''
							},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					}
				];
				return banks;
			},
			getAllCards: function () {
				var cards = [
					{
						name: 'ויזה',
						val: '21',
						color: '#c00',
						inputs: [
							{
								name: 'קוד משתמש:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'ישרכארט',
						val: '22',
						color: '#c00',
						inputs: [
							{name: 'תעודת זהות:', placeholders: 'הקלד לפחות 8 ספרות', val: 'bank_user_name', data: ''},
							{
								name: '6 ספרות אחרונות:',
								placeholders: '6 ספרות אחרונות של כ.אשראי',
								val: 'bank_auto',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'מסטרכארד',
						val: '23',
						color: '#c00',
						inputs: [
							{name: 'תעודת זהות:', placeholders: 'הקלד לפחות 8 ספרות', val: 'bank_user_name', data: ''},
							{
								name: '6 ספרות אחרונות:',
								placeholders: '6 ספרות אחרונות של כ.אשראי',
								val: 'bank_auto',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'לאומי קארד',
						val: '24',
						color: '#c00',
						inputs: [
							{
								name: 'קוד משתמש:',
								placeholders: '5-55 תווים המכילים ספרות, סימנים ואותיות לועזיות‎',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'אמריקן אקספרס',
						val: '25',
						color: '#c00',
						inputs: [
							{name: 'תעודת זהות:', placeholders: 'הקלד לפחות 8 ספרות', val: 'bank_auto', data: ''},
							{
								name: '6 ספרות אחרונות:',
								placeholders: '6 ספרות אחרונות של כ.אשראי',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_pass',
								data: ''
							}
						]
					}
				];

				return cards;
			},
			getAllSlika: function () {
				// {
				// 	name: 'יורוקרד',
				// 		val: '86',
				// 	color: '#c00',
				// 	inputs: [
				// 	{
				// 		name: 'קוד משתמש:',
				// 		placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
				// 		val: 'bank_user_name',
				// 		data: ''
				// 	},
				// 	{
				// 		name: 'סיסמה:',
				// 		placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
				// 		val: 'bank_pass',
				// 		data: ''
				// 	}
				// ]
				// },
				var slika = [
					{
						name: 'ויזה',
						val: '81',
						color: '#c00',
						inputs: [
							{
								name: 'קוד משתמש:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'ישרכארט',
						val: '82',
						color: '#c00',
						inputs: [
							{
								name: 'מספר חשבון בנק:',
								placeholders: 'מספר חשבון הבנק שהוזן בתהליך הרישום, ללא רווחים או תווים מיוחדים.',
								val: 'bank_auto',
								data: ''
							},
							{name: 'שם משתמש:', placeholders: '', val: 'bank_user_name', data: ''},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					},
					{
						name: 'לאומי קארד',
						val: '80',
						color: '#c00',
						inputs: [
							{
								name: 'קוד משתמש:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_user_name',
								data: ''
							},
							{
								name: 'סיסמה:',
								placeholders: ' 6-14 תווים המכילים ספרות ואותיות לועזיות',
								val: 'bank_pass',
								data: ''
							}
						]
					},
					{
						name: 'צמרת ממונים',
						val: '89',
						color: '#c00',
						inputs: [
							{name: 'שם משתמש:', placeholders: '', val: 'bank_user_name', data: ''},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''},
							{name: 'קוד לקוח:', placeholders: '', val: 'bank_auto', data: ''}
						]
					},
					{
						name: 'גמא ',
						val: '90',
						color: '#c00',
						inputs: [
							{name: 'שם משתמש:', placeholders: '', val: 'bank_user_name', data: ''},
							{name: 'קוד משתמש:', placeholders: '', val: 'bank_auto', data: ''},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					},
					{
						name: 'יציל פיננסים',
						val: '91',
						color: '#c00',
						inputs: [
							{name: 'שם משתמש:', placeholders: '', val: 'bank_user_name', data: ''},
							{name: 'סיסמה:', placeholders: '', val: 'bank_pass', data: ''}
						]
					}
				];

				return slika;
			},
			getStatusName: function (num) {
				switch (num) {
					case '1000':
						return ("הכנסות");
					case '1022':
						return ("עלות המכירות");
					case '1011':
						return ("הוצאות הנהלה וכלליות");
					case 'golmi':
						return ("רווח גולמי");
					case 'naki':
						return ("רווח נקי");
					case '1033':
						return ("הוצאות מימון");
					case '1044':
						return ("הוצאות מכירה");
					case '1055':
						return ("הוצאות אחרות");
				}
			},
			getStatusNameExApply: function (program, num, val) {
				switch (num) {
					case 0:
						return "תקין";
						break;

					case 1:
						return " חסרות תנועות ב " + program + " שקיימות ב bizibox ";
						break;

					case 2:
						return "קיים פער בתנועות בין bizibox ל " + program;
						break;

					case 3:
						if (val === undefined) {
							return "אין פעולות לכרטיס זה ב" + program;
						}
						else {
							return "אין פעולות לכרטיס זה";
						}
						break;

					case 123:
						return ("לא ניתן לייצא - זוהתה בעיה ביתרות, בטיפול bizibox");
						break;

					case 4:
						if (val === undefined) {
							return ("אין מחזורי חיוב משותפים");
						}
						else {
							return ("אין רצף תנועות");
						}
						break;

					case  6:
						if (val == undefined) {
							return "לא נמצאו נתוני דפי בנק ב" + program;
						}
						else {
							return ("לא נמצאו נתוני דפי בנק ");
						}
						break;

					case 44:
						return ("נדרש להזין פעולות ב" + program + " עד תאריך");
						break;

					case 43:
						return ("הפעולות האחרונות ב" + program + " לא נמצאות בביזיבוקס");
						break;

					case 46:
						return ("חשבון לא נטען בביזיבוקס");
						break;

					case 47:
						return ("לא קיימות תנועות ב" + program + " ובביזבוקס");
						break;

					case 48:
						return ("לא נמצאו שורות סיכום בכרטיס זה ב" + program);
						break;
				}
			},
			getStatustokensalerts: function (num) {
				switch (num) {
					case 0:
						return ("תקין");
						break;
					case 1:
						return ("קיימת בעיה טכנית");
						break;
					case 2:
						return ("סיסמא שגויה");
						break;
					case 3:
						return ("חשבון חסום");
						break;
					case 4:
						return ("הסיסמא פגה");
						break;
					case 5:
						return ("סיסמא הולכת לפוג בבנק");
						break;
					case 6:
						return ("לא התקבל קוד");
						break;
					case 7:
						return ("אין מיניקי");
						break;
					case 8:
						return ("תקין");
						break;
					case 9:
						return ("מתחבר...");
						break;
					case 10:
						return ("מתחבר לראשונה...");
						break;
					case 444:
						return ("מבזק בנקאי");
						break;
					case 4444:
						return ("פועלים בעסקים");
						break;
					case 158:
						return ("עדכון סיסמה");
						break;
					case 157:
						return ("עדכון סיסמה");
						break;
					case 100:
						return ("מושך נתוני בנק");
						break;
					case 101:
						return ("מושך כ.אשראי");
						break;
					case 102:
						return ("מושך צקים ממשמרת");
						break;
					case 103:
						return ("מושך פקדונות");
						break;
					case 104:
						return ("מושך הלוואות");
						break;
					case 122:
						return ("עבור למסך פועלים");
						break;
					case 105:
						return ("מושך הוראות קבע");
						break;
					default:
						return num;
						break;
				}
			},
			getSourceProgramId: function (num) {
				if (num) {
					switch (num) {
						case 111:
							return "רווחית";
							break;
						case 333:
							return "חשבשבת";
							break;
						case 3331:
							return "תקבולית";
							break;
						case 3332:
							return "עצמאית";
							break;
						case 777:
							return "רווחית";
							break;
						case 999:
							return "אחר";
							break;
						case 8881:
							return "בנק";
							break;
						case 151:
							return 'עו"ש הבנק';
							break;
						case 150:
							return "אקסל";
							break;
						case 224:
							return "ארדני";
							break;
						default:
							return "אחר";
							break;
					}
				}
				else {
					return 'ידנית'
				}
			},
			getEsderMaam: function (num) {
				switch (num) {
					case 444:
						return "דו חודשי";
					case 555:
						return "חודשי";
					case 777:
						return "עוסק פטור";
				}
			},
			getTypeJobTitle: function (type) {
				switch (type) {
					case "f438b479-81cb-4be5-8152-38e1eb838af9":
						return "רואה חשבון";
					case "6e5291cd-0aab-4a11-a3ad-9991da5c0d24":
						return "מנהל חשבונות";
					case "e3280343-d30c-1d33-e040-a8c0e10a2b20":
						return "יועץ מס";
				}
			},
			getFrequency: function (num) {
				var frequency;
				switch (num) {
					case 1:
						frequency = "יומי";
						break;
					case 2:
						frequency = "שבועי";
						break;
					case 3:
						frequency = "חודשי";
						break;
					case 4:
						frequency = "דו-חודשי";
						break;
					case 5:
						frequency = "רבעוני";
						break;
					case 6:
						frequency = "שנתי";
						break;
					default:
						frequency = "";
						break;
				}
				return frequency;
			},
			getSlikaType: function (num) {
				var slikaType;
				switch (num) {
					case 1:
						slikaType = "סה״כ זיכוי בפועל";
						break;
					case 2:
						slikaType = "צפי שבועי";
						break;
					case 3:
						slikaType = "צפי חודשי כולל";
						break;
					case 4:
						slikaType = "צפי משתמש שבועי";
						break;
					case 5:
						slikaType = "צפי משתמש חודשי";
						break;
					case 6:
						slikaType = "לא ניתן לחשב צפי";
						break;
					default:
						slikaType = "";
						break;
				}
				return slikaType;
			},
			getFrequencyAndUpdate: function (f, u) {
				if (u == 1) {
					var frequency;
					switch (f) {
						case 1:
							frequency = "יומי";
							break;
						case 2:
							frequency = "שבועי";
							break;
						case 3:
							frequency = "חודשי";
							break;
						case 4:
							frequency = "דו-חודשי";
							break;
						case 5:
							frequency = "רבעוני";
							break;
						case 6:
							frequency = "שנתי";
							break;
						default:
							frequency = "";
							break;
					}
					return frequency;
				}
				else {
					if (u == 2) {
						return ("חיוב אחרון")
					}
					if (u == 3) {
						return ("צפי משתמש")
					}
					if (u == 4) {
						return ("חיוב זיכוי / קרוב")
					}
				}
			},
			statusInchequesSum: function (num) {
				switch (num) {
					case 13:
						return "שיק לביטחון";
						break;
					case 4:
						return "הועבר לספק";
						break;
					case 12:
						return "שיקים שנגרעו";
						break;
					case 1:
						return "שיקים בקופה";
						break;
					case 3:
						return "שיקים מותאמים";
						break;
					case 5:
						return "שיקים חוזרים";
						break;
					case 17:
						return "שיק מבוטל";
						break;
					case 10:
						return "שיקים בניכיון";
						break;
					case 2:
						return "שיקים במשמרת";
						break;
					case -1:
						return "שיקים נכנסים";
						break;
				}
			},
			getStatusMatchType: function (num) {
				if (num) {
					switch (num) {
						case 1:
							return ("זהירה");
						case 2:
							return ("מואצת");
					}
				}
			},
			indSelfMan: function (num) {
				if (num) {
					switch (num) {
						case 0:
							return (" לקוח רגיל מרואה חשבון");
						case 1:
							return (" לקוח רגיל");
						case 2:
							return (" רואה חשבון");
						case 3:
							return ("חברה ראשית רואה חשבון");
					}
				}
			},
			getStatusNameWindowManag: function (num) {
				switch (num) {
					case 0:
						return ("חדש");
					case 1:
						return ("בבדיקה");
					case 2:
						return ("תוקן");
					case 3:
						return ("לא נמצאה בעיה");
				}
			},
			getCurrency: function (num) {
				switch (num) {
					case 2:
						return "(חשבון $)";
						break;
					case 3:
						return "(חשבון £)";
						break;
					case 11:
						return "(חשבון €)";
						break;
					case 19:
						return "(חשבון kr)";
						break;
					case 7:
						return "(חשבון Fr)";
						break;
					default:
						return "";
						break
				}
			},
			getCurrencyId: function (num) {
				switch (num) {
					case 2:
						return "$";
						break;
					case 3:
						return "£";
						break;
					case 11:
						return "€";
						break;
					case 19:
						return " kr ";
						break;
					case 7:
						return " Fr ";
						break;
					default:
						return "₪";
						break
				}
			},
			getCurrencyIdName: function (num) {
				switch (num) {
					case 2:
						return "דולר";
						break;
					case 3:
						return "פאונד";
						break;
					case 11:
						return "יורו";
						break;
					case 19:
						return "כתר דני";
						break;
					case 7:
						return "פרנק שווייצרי";
						break;
					default:
						return "שקל";
						break
				}
			},
			getABCCell: function (num) {
				if (num) {
					var textABC = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
					var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
					abc.split("").forEach(function (val, ind) {
						textABC.push("A" + val);
					})
					abc.split("").forEach(function (val, ind) {
						textABC.push("B" + val);
					})
					return textABC[num - 1];
				}
			},
			getTypePaymentBiling: function (num) {
				switch (num) {
					case 1:
						return "מזומן";
						break;
					case 2:
						return "שיק";
						break;
					case 3:
						return "אשראי";
						break;
					case 4:
						return "העברה בנקאית";
						break;
				}
			},
			getTypeHiuv: function (num) {
				switch (num) {
					case 1:
						return "חברה";
						break;
					case 2:
						return "שורה";
						break;
				}
			},
			generateUUID: function () {
				var d = new Date().getTime();
				if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
					d += performance.now(); //use high-precision timer if available
				}
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
					var r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
				});
			}
		}
	}

	angular.module('services')
	.factory('accoConversions', accoConversions);
}());

