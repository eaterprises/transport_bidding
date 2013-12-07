angular.module("transportBiddingApp")
        .controller("TransportCycleTableCtrl", ['$scope', '$http',
  function($s, http) {
    $s.sortReverse = {};
    $s.bidLatLonArray = [];
    $s.filterAddr = "";
    $s.isReverse = false;
    $s.filterCoordinator = function(item) {
      var isMatch = true;

      if (typeof $s.search_active != "undefined"
              && $s.search_active != "") {
        var regex = new RegExp($s.search_active, "i")
        isMatch = isMatch && regex.test(item.is_active);
      }
      if (typeof $s.search_transport_cycle != "undefined"
              && $s.search_transport_cycle != "") {
        var regex = new RegExp($s.search_transport_cycle, "i")
        isMatch = isMatch && regex.test(item.display_text);
      }
      if (typeof $s.search_start_date != "undefined"
              && $s.search_start_date != "") {
        var regex = new RegExp($s.search_start_date, "i")
        isMatch = isMatch && regex.test(item.start_date);
      }
      if (typeof $s.search_end_date != "undefined"
              && $s.search_end_date != "") {
        var regex = new RegExp($s.search_end_date, "i")
        isMatch = isMatch && regex.test(item.end_date);
      }
      if (typeof $s.search_coordinator != "undefined"
              && $s.search_coordinator != "") {
        var regex = new RegExp($s.search_coordinator, "i")
        isMatch = isMatch && regex.test(item.coordinator_text);
      }

      return isMatch;
    }

    $s.transportCycleData = [];

    $s.getTransportCycleData = function() {
      http.get("/api/transport_cycle/all").success(function(data) {
        $s.transportCycleData = data;
      });
    };

    $s.onRowClick = function(row) {
      showRowDetails(row);
    };

    var showRowDetails = function(row) {
      $s.transportCycleActive = row.is_active;
      $s.transportCycleId = row._id;
      $s.rowDetails = {
        display: [{
          desc: "Transport Cycle",
          val: row.display_text
        }, {
          desc: "Start Date",
          val: row.start_date
        }, {
          desc: "End Date",
          val: row.start_date
        }, {
          desc: "Coordinator",
          val: row.coordinator_text
        }]
      };
    };

    $s.isSortReverse = function(index) {
      return $s.sortReverse[index];
    };
    $s.setSortCol = function(index) {
      if (typeof $s.sortReverse[index] === 'undefined')
        $s.sortReverse[index] = false;
      else
        $s.sortReverse[index] = !$s.sortReverse[index];
      $s.sortCol = index;
    };

    $s.editTransportCycle = function() {
      var postData = {};
      postData.transport_cycle = {
  	    'id' : $s.transportCycleId
	    , 'active' : $s.transportCycleActive
      };
      http.post('/api/transport_cycle/edit', postData).success(function(data) {
        $s.getTransportCycleData();
      });
    };
  }]);
