(function () {
	function provide($provide) {
		$provide.decorator('orderByFilter', [
			'$delegate',
			function ($delegate) {
				var previousState;
				return function (arr, predicate, reverse, ignore) {
					if (!!ignore) {
						return previousState || arr;
					}
					var order = $delegate.apply(null, arguments);
					previousState = order;
					return order;
				}
			}
		]);
	}

	angular.module('main')
	.config(['$provide', provide])
}());