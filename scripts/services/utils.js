(function () {
    function utils() {

        return {
            setLocalizationService: function (service) {
                this.localize = service;
            },

            isNumber: function (evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                return true;
            },

            encode64: function (str) {
                var keyStr = "ABCDEFGHIJKLMNOP" +
                    "QRSTUVWXYZabcdef" +
                    "ghijklmnopqrstuv" +
                    "wxyz0123456789+/" +
                    "=";
                var input = escape(str);
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode64: function (str) {
                var keyStr = "ABCDEFGHIJKLMNOP" +
                    "QRSTUVWXYZabcdef" +
                    "ghijklmnopqrstuv" +
                    "wxyz0123456789+/" +
                    "=";

                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(str)) {
                    alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
                }
                var input = str.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return unescape(output);
            },

            validateEmail: function (email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },

            getOSName: function () {
                if (navigator.appVersion.indexOf("Win") != -1) return "Windows";
                if (navigator.appVersion.indexOf("Mac") != -1) return "Mac";
                if (navigator.appVersion.indexOf("X11") != -1) return "UNIX";
                if (navigator.appVersion.indexOf("Linux") != -1) return "Linux";
                return "Unknown OS";
            },

            isMobile: function () {
                var check = false;
                (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            },

            mdc: function (o) {
                if (!o.length)
                    return 0;
                for (var r, a, i = o.length - 1, b = o[i]; i;)
                    for (a = o[--i]; r = a % b; a = b, b = r);
                return b;
            },

            pcx: function ($scope) {
                window.lastWidth = jQuery(window).width();
                window.lastHeight = jQuery(window).height();
                function pollZoomFireEvent() {
                    var widthNow = jQuery(window).width();
                    var heightNow = jQuery(window).height();
                    if (window.lastWidth == widthNow && window.lastHeight == heightNow) return;
                    window.lastWidth = widthNow;
                    window.lastHeight = heightNow;
                    $scope.$broadcast('widthChanged');
                }
                if ($scope.online != navigator.onLine) {
                    $scope.online = navigator.onLine;
                    $scope.showErrorDialog = !$scope.online;
                    $scope.errorType = "offline"
                    $scope.$apply();
                };
                setInterval(pollZoomFireEvent, 100);
            },

            weekDays: function () {
                return ([
                    {
                        //name: localize.getLocalizedString('_sunday_'),
                        //shortName: localize.getLocalizedString('_sunday_mid_'),
                        init: this.localize.getLocalizedString('_sunday_short_'),
                        index: 1
                    },
                    {
                        //name: localize.getLocalizedString('_monday_'),
                        //shortName: localize.getLocalizedString('_monday_mid'),
                        init: this.localize.getLocalizedString('_monday_short_'),
                        index: 2
                    },
                    {
                        //name: localize.getLocalizedString('tuesday'),
                        //shortName: localize.getLocalizedString('tuesday_mid'),
                        init: this.localize.getLocalizedString('_tuesday_short_'),
                        index: 3
                    },
                    {
                        //name: localize.getLocalizedString('wednesday'),
                        //shortName: localize.getLocalizedString('wednesday_mid'),
                        init: this.localize.getLocalizedString('_wednesday_short_'),
                        index: 5
                    },
                    {
                        //name: localize.getLocalizedString('thursday'),
                        //shortName: localize.getLocalizedString('thursday_mid'),
                        init: this.localize.getLocalizedString('_thursday_short_'),
                        index: 4
                    },
                    {
                        //name: localize.getLocalizedString('friday'),
                        //shortName: localize.getLocalizedString('friday_mid'),
                        init: this.localize.getLocalizedString('_friday_short_'),
                        index: 6
                    },
                    {
                        //name: localize.getLocalizedString('saturday'),
                        //shortName: localize.getLocalizedString('saturday_mid'),
                        init: this.localize.getLocalizedString('_saturday_short_'),
                        index: 7
                    }
                ])
            },

            monthNames: function () {
                return ([
                    'ינואר',
                    'פברואר',
                    'מרץ',
                    'אפריל',
                    'מאי',
                    'יוני',
                    'יולי',
                    'אוגוסט',
                    'ספטמבר',
                    'אוקטובר',
                    'נובמבר',
                    'דצמבר'
                ])
            },


            //years: function (num) {
            //    var y = [];
            //    var current = new Date().getFullYear() + 10;
            //    for (var i = 0; i < (num + 10); i++)
            //        y.push(current - i);
            //    return y;
            //},
            years: function (num) {
                var y = [];
                var current = new Date().getFullYear();
                for (var i = 0; i < (num + 1); i++)
                    y.push(current - i);
                return y;
            },

            yearsKsafim: function (num) {
                var y = [];
                var current = new Date().getFullYear() + 1;
                for (var i = 0; i < (num + 2); i++)
                    y.push(current - i);
                return y;
            },
            yearsTazrim: function (num) {
                var y = [];
                var current = new Date().getFullYear() + 5;
                for (var i = 0; i < (num + 5); i++)
                    y.push(current - i);
                return y;
            },

            createGUID: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            isNumber: function(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    return false;
                }
                return true;
            }
        };

    }
    angular.module('services')
        .factory('utils', utils);
}());

