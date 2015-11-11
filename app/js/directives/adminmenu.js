angular.module("transportBiddingApp").directive('adminmenu',
        function() {
			  return {
			    restrict: 'E',
			    scope : {
			      title : '@'
			    },
			    templateUrl : '/partials/adminmenu.html',
			    transclude : true
			  };
          }
        );