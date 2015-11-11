angular.module('transportBiddingApp', [
  'ngSanitize',
  'ui.bootstrap'
]);

angular.module('transportBiddingApp').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', { templateUrl: 'partials/food_table.html', 
      controller: 'BidTableCtrl' })
    $routeProvider.when('/coordinators', { templateUrl: 'partials/coordinator_table.html', 
      controller: 'CoordinatorTableCtrl' })
    $routeProvider.when('/admin', { templateUrl: 'partials/admin.html',  controller: '' })
    $routeProvider.when('/users', { templateUrl: 'partials/users.html', controller: 'UserCtrl' })
    $routeProvider.when('/login', { templateUrl: 'partials/login.html', controller: 'UserCtrl' })
    $routeProvider.when('/upload', { templateUrl: 'partials/upload.html',
    	controller: 'UploadCtrl' })
    $routeProvider.when('/transport_cycles', { templateUrl: 'partials/transport_cycle_table.html',
      controller: 'TransportCycleTableCtrl' })
    $routeProvider.when('/packages/:id', { templateUrl: 'partials/package_table.html',
      controller: 'PackageTableCtrl' })
    $routeProvider.when('/bid_management', { templateUrl: 'partials/bid_manage_table.html',
      controller: 'BidManageTableCtrl' })

    $routeProvider.otherwise({redirectTo: '/'});
  }]);
