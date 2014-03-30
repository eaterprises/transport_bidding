angular.module("transportBiddingApp")
        .controller("UploadCtrl", ['$scope', '$http',
  function($s, http) {
    http.get("/api/coordinators").success(function(data) {
      $s.coordinatorList = data;
    });
  }]);
angular.module("transportBiddingApp")
        .controller("UserCtrl", ['$scope', '$http',
  function($s, http) {
    $s.sortReverse = {};
    $s.bidLatLonArray = [];
    $s.filterAddr = "";
    $s.isReverse = false;
    //make more generic @todo
    $s.filter = function(item) {
      var isMatch = true;

      if (typeof $s.search_first_name != "undefined"
              && $s.search_first_name != "") {
        var regex = new RegExp($s.search_first_name, "i")
        isMatch = isMatch && regex.test(item.local.first_name);
      }
      if (typeof $s.search_last_name != "undefined"
              && $s.search_last_name != "") {
        var regex = new RegExp($s.search_last_name, "i")
        isMatch = isMatch && regex.test(item.local.last_name);
      }
      if (typeof $s.search_role != "undefined"
              && $s.search_role != "") {
        var regex = new RegExp($s.search_role, "i")
        isMatch = isMatch && regex.test(item.local.role);
      }
      if (typeof $s.search_email != "undefined"
              && $s.search_email != "") {
        var regex = new RegExp($s.search_email, "i")
        isMatch = isMatch && regex.test(item.local.email);
      }


      return isMatch;
    }



    $s.rowDetails = [];
    $s.data = {};

    $s.getData = function() {
      http.get("/api/user").success(function(data) {
        $s.data = data;
      });
    };

    $s.setSortCol = function(index) {
      if (typeof $s.sortReverse[index] === 'undefined')
        $s.sortReverse[index] = false;
      else
        $s.sortReverse[index] = !$s.sortReverse[index];
      $s.sortCol = index;
    };


    $s.resetFilters = function() {
      $s.filterAddr = "";
      delete $s.visibleLineLineLatLon;
    };

    $s.login = function(){
      var postData = {};
      postData = {
	    'email' : $s.userEmail
	    , 'password' : $s.userPassword
      };
	  $s.message = ("Logging in...");
      http.post('/api/login', postData)
      	.success(function(data) {
	        if(data.status == "ok")
	        	$s.message = ("User logged in");
			else      		
      			$s.message = ("Error: " + data.message);
      	})
      	.error(function(data) {
      		$s.message = ("Invalid credentials");
      	})
      ;
  	}
    $s.add = function(){
      var postData = {};
      postData = {
	    'email' : $s.userEmail
	    , 'password' : $s.userPassword
	    , 'role' : $s.userRole
	    , 'first_name' : $s.userFirstName
	    , 'last_name' : $s.userLastName
      };
      console.log(postData);
      $s.message = ("Adding user...");
      http.post('/api/user/add', postData).success(function(data) {
        if(data.status == 'ok'){
        	$s.message = ("User added");
	        $s.getData();
    	}
    	else{
  			$s.message = ("Error: " + data.message);
    	}
      }).error(function(data) {
    	$s.message = ("Nope");
      });
  	}

    $s.add2 = function() {
      var postData = {};
      postData.user = {
	    'username' : $s.userUsername
	    , 'first_name' : $s.userFirstName
	    , 'last_name' : $s.userLastName
	    , 'email' : $s.userEmail
	    , 'role' : $s.userRole
	    , 'password' : $s.userPassword
      };

      http.post('/api/user/new', postData).success(function(data) {
        // console.log(data);
        if(data.status == 'ok'){
        	alert("User added");
	        $s.getData();
    	}
    	else{
    		alert("User could not be added: " + data.message);
    	}

      });
    };

    $s.isSortReverse = function(index) {
      return $s.sortReverse[index];
    };
  }]);
