(function () {
	function companySelector($timeout) {
		return {
			restrict: 'A',
			scope: {
				companies: '=',
				onSelect: '&',
				selectedIndex: '='
			},
			link: function postLink(scope, element, attrs) {
				$(element).on('focus', 'input', function (event) {
					$timeout(function () {
						scope.$parent.showList = true;
						scope.$apply();
						$timeout(function () {
							$(document).on('click', scope.closeList);
						}, 50);
					}, 0);
				});

				$(element).on('keydown', 'input', function (event) {
					if (event.keyCode == 40) { // down
						scope.selected = 1;
						$(element).find('.company-list-cnt ul li:nth-child(' + scope.selected + ')').focus();
						setTimeout(function () {
							$(element).find('.company-list-cnt ul').scrollTop(0);
						}, 1);
					}
				});

				$(element).on('keydown', 'li', function (event) {
					if (event.keyCode == 13 && scope.selected != -1) {
						scope.selectCompany(scope.$parent.filteredItems[scope.selected - 1]);
					}
					else if (event.keyCode == 38) { // up
						scope.selected--;
						if (scope.selected == 0)
							scope.selected = 1;
						$(element).find('.company-list-cnt ul li:nth-child(' + scope.selected + ')').focus();
					}
					else if (event.keyCode == 40) { // down
						scope.selected++;
						if (scope.selected > scope.companies.length)
							scope.selected = scope.companies.length;
						$(element).find('.company-list-cnt ul li:nth-child(' + scope.selected + ')').focus();
					}
				});

				scope.closeList = function (event) {
					var lengtcompany = $(event.target).closest('.company-selector-cnt').length;
					if (lengtcompany == 0 || event.target.className == "add_company_butt") {
						scope.$parent.showList = false;
						$(document).off('click', scope.closeList);
					}
				};

				scope.$parent.selectCompany = function (company) {
					scope.onSelect({company: company});
					scope.$parent.showList = false;
					scope.$parent.companySearch = company.companyName;
				};

				scope.$watch('selectedIndex', function (newVal, oldVal) {
					if (newVal != undefined) {
						scope.$parent.selectCompany(scope.companies[newVal]);
					}
				}, true);
			}
		};
	}

	function cubeHtml() {
		return {
			restrict: 'A',
			templateUrl: 'views/templates/cubeHTML.html?ver=3.74',
			scope: {
				action: '=',
				onShowTable: '&'

			},
			link: function postLink(scope, element, attrs) {

				scope.setGraph = function () {
					var maxHeight = 20;
					var max = Math.max(Math.abs(scope.action.memuza_hodesh1), Math.abs(scope.action.memuza_hodesh2), Math.abs(scope.action.memuza_hodesh3));
					scope.m1H = Math.floor((maxHeight * Math.abs(scope.action.memuza_hodesh1) / max) ? maxHeight * Math.abs(scope.action.memuza_hodesh1) / max : 0);
					scope.m2H = Math.floor((maxHeight * Math.abs(scope.action.memuza_hodesh2) / max) ? maxHeight * Math.abs(scope.action.memuza_hodesh2) / max : 0);
					scope.m3H = Math.floor((maxHeight * Math.abs(scope.action.memuza_hodesh3) / max) ? maxHeight * Math.abs(scope.action.memuza_hodesh3) / max : 0);
				};

				scope.getMonth = function (str) {
					if (str != 'null')
						return str.substring(4, 6) + "/" + str.substring(2, 4);
					else
						return '';
				};

				scope.getTotal = function (num) {
					var s = '' + num;
					return s.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				};

				scope.openTable = function () {
					//scope.onShowTable({element: element, action: scope.action});
					scope.showTable = !scope.showTable;
					if (scope.showTable)
						$(element).height($(element).find(".cubeHTML").height() + 200);
					else
						$(element).height($(element).find(".cubeHTML").height());
				};

				scope.$watch('action', function (newVal, oldVal) {
					scope.setGraph();
				});
			}
		};

	}

	function cubeHtmlTable() {
		return {
			restrict: 'A',
			templateUrl: 'views/templates/cubeHTMLTable.html?ver=3.74',
			link: function postLink(scope, element, attrs) {

				scope.setGraph = function () {
					var maxHeight = 20;
					var max = Math.max(Math.abs(scope.action.memuza_hodesh1), Math.abs(scope.action.memuza_hodesh2), Math.abs(scope.action.memuza_hodesh3));
					scope.m1H = Math.floor((maxHeight * Math.abs(scope.action.memuza_hodesh1) / max) ? maxHeight * Math.abs(scope.action.memuza_hodesh1) / max : 0);
					scope.m2H = Math.floor((maxHeight * Math.abs(scope.action.memuza_hodesh2) / max) ? maxHeight * Math.abs(scope.action.memuza_hodesh2) / max : 0);
					scope.m3H = Math.floor((maxHeight * Math.abs(scope.action.memuza_hodesh3) / max) ? maxHeight * Math.abs(scope.action.memuza_hodesh3) / max : 0);
				};

				scope.getMonth = function (str) {
					if (str != 'null')
						return str.substring(4, 6) + "/" + str.substring(2, 4);
					else
						return '';
				};

				scope.getTotal = function (num) {
					var s = '' + num;
					return s.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				};

				scope.openTable = function () {
					//scope.onShowTable({element: element, action: scope.action});
					scope.showTable = !scope.showTable;
					if (scope.showTable)
						$(element).height($(element).find(".cubeHTML").height() + 200);
					else
						$(element).height($(element).find(".cubeHTML").height());
				};

				scope.$watch('action', function (newVal, oldVal) {
					scope.setGraph();
				});
			}
		};

	}

	function transactionDropdown() {
		return {
			restrict: 'A',
			templateUrl: 'views/templates/transactionDropdown.html?ver=3.74',
			scope: {
				selectedTransaction: '=',
				onSelectedChanged: '&',
				showList: '='
			},
			link: function postLink(scope, element, attrs) {

				$(document).on('click', function (event) {

					if (event.target.nextElementSibling == element[0])
						return;
					scope.$parent[element[0].dataset.ngShow.split('.')[0]][element[0].dataset.ngShow.split('.')[1]] = false;
				});

				scope.hideDropdown = function () {

					scope.$parent[element[0].dataset.ngShow.split('.')[0]][element[0].dataset.ngShow.split('.')[1]] = false;
					//scope.$parent.$parent.filteredTransactions[element[0].dataset.ngShow.split('.')[0].split('[')[1].split(']')[0]][element[0].dataset.ngShow.split('.')[1]] = false;
				};

				scope.selectTransaction = function (t) {
					scope.hideDropdown();
					scope.onSelectedChanged({t: scope.selectedTransaction, trans_type_name: t});
				};

				scope.$watch('selectedTransaction', function (newVal, oldVal) {
					if (newVal && newVal != oldVal) {
					}
				});

			}
		};

	}

	angular.module('directives')
	.directive({
		'companySelector': ['$timeout', companySelector],
		'cubeHtml': cubeHtml,
		'cubeHtmlTable': cubeHtmlTable,
		'transactionDropdown': transactionDropdown
	});
}());
