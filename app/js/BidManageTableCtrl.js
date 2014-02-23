angular.module("transportBiddingApp")
        .controller("BidManageTableCtrl", ['$scope', '$http',
  function($s, http) {
    $s.sortReverse = {};
    $s.bidLatLonArray = [];
    $s.filterAddr = "";
    $s.isReverse = false;
    $s.showAccepted = false;

    $s.noBidUser =   {
          "bidder_name": "No bid",
          "bidder_email": "",
          "bidder_mobile": ""
        };
        
    $s.showNoBids = function(){
      $s.bidderList[0].isSelected = true;
      $s.getSelectedBidders($s.bidderList);
    }
    $s.updateBidders = function(tc_id) {
      http.get("/api/bidders/" + tc_id).success(function(data) {
        data.unshift($s.noBidUser);
        $s.bidderList = data;
      }); 
    };

    $s.getSelectedBidders = function(bidderList) {
      return $s.bidderList.filter(function(e) {
        return e.isSelected == true;
      });
    };

    http.get("/api/transport_cycle").success(function(data) {
      $s.transportCycleList = data;
      $s.transportCycle = data[0];
      $s.getProductData(); 
      $s.updateBidders($s.transportCycle._id); 
    });
    //make more generic @todo
    $s.filterProducts = function(item) {
      var isMatch = true;

      if (typeof $s.search_product != "undefined"
              && $s.search_product != "") {
        var regex = new RegExp($s.search_product, "i")
        isMatch = isMatch && regex.test(item.product_name);
      }
      if (typeof $s.search_bidder_name != "undefined"
              && $s.search_bidder_name != "") {
        var regex = new RegExp($s.search_bidder_name, "i")
        isMatch = isMatch && regex.test(item.bidder_name);
      }
      if (typeof $s.search_bidder_email != "undefined"
              && $s.search_bidder_email != "") {
        var regex = new RegExp($s.search_bidder_email, "i")
        isMatch = isMatch && regex.test(item.bidder_email);
      }

      if (typeof $s.search_src != "undefined"
              && $s.search_src != "") {
        var regex = new RegExp($s.search_src, "i")

        isMatch = isMatch && regex.test(item.supplier_suburb);
      }

      if (typeof $s.search_dest != "undefined"
              && $s.search_dest != "") {
        var regex = new RegExp($s.search_dest, "i")

        isMatch = isMatch && regex.test(item.distributor_suburb);
      }

      return isMatch;
    }
    $s.filterAccepted = function(item){
      if($s.showAccepted)
        return (item && item.bid_status && item.bid_status == 1);
      return true;
    }
    $s.filterBidder = function(item){
      // $s.bidders      
      if($s.bidders.length == 0) return true;
      for(var i = 0; i < $s.bidders.length; i++){
         if(item.bidder_name == $s.bidders[i].bidder_name
                  && item.bidder_mobile == $s.bidders[i].bidder_mobile
                  && item.bidder_email == $s.bidders[i].bidder_email
                  ) {
                  return true; 
                  break;
                }
              }      
      return false;
    }


    $s.setBidStatus = function(bidId, packageId, status) {
      http.post("/api/bids/" + bidId + "/package/" + packageId + "/status/" + status)
        .success(function(data) {
        $s.getProductData();
      })
    };

    $s.filterAddress = function(item) {
      if ($s.filterAddr !== "") {
        return item.supply_address === $s.filterAddr
                || item.delivery_address === $s.filterAddr;
      }

      return true;
    }

    $s.rowDetails = [];
    $s.productData = {};
    $s.bidders = [];
    $s.number_no_bid_items = 0;
    $s.getPackagesWithNoBids = function(){
      http.get("/api/transport_cycle/no_bids/" + $s.transportCycle._id).success(function(data) {
        $s.number_no_bid_items = data.length;
        for(var j = 0; j < data.length; j++){
          var bid = data[j];
          ["bidder_name","bidder_email","bidder_mobile"].forEach(function(item){
            bid[item] = $s.noBidUser[item];
          });
          bid.nobid = true;

          var addArr = [];
          for (var row in data) {
            var src = data[row].supply_address;
            var dest = data[row].delivery_address;
            var srcLatLon = data[row].supply_lat_lon;
            var destLatLon = data[row].delivery_lat_lon;
            $s.addressArray.push({src: src, dest: dest, srcLatLon: srcLatLon,
              destLatLon: destLatLon});
          }
          $s.productData.push(bid);
        }
      });
    }
    $s.getSelectedBidders = function(bidderList){
      $s.bidders = [];
      for(var i = 0; i < bidderList.length; i++){
        var bidder = bidderList[i];
        if(bidder.isSelected){
          $s.bidders.push(bidder);
        }
      }
      // $s.getProductData();
    }
    $s.getProductData = function() {
      http.get("/api/bids/" + $s.transportCycle._id).success(function(data) {
        $s.productData = [];
        $s.addressArray = [];
        for(var j = 0; j < data.length; j++){
          var bid = data[j];
          var addArr = [];
          for (var row in data) {
            var src = data[row].supply_address;
            var dest = data[row].delivery_address;
            var srcLatLon = data[row].supply_lat_lon;
            var destLatLon = data[row].delivery_lat_lon;
            $s.addressArray.push({src: src, dest: dest, srcLatLon: srcLatLon,
              destLatLon: destLatLon});
          }
          $s.productData.push(bid);
        }
        $s.getPackagesWithNoBids();
      });
    };

    $s.setSortCol = function(index) {
      if (typeof $s.sortReverse[index] === 'undefined')
        $s.sortReverse[index] = false;
      else
        $s.sortReverse[index] = !$s.sortReverse[index];
      $s.sortCol = index;
    };

    $s.onRowClick = function(row) {
      showRowDetails(row);
      $s.visibleLineLineLatLon = [row.supply_lat_lon, row.delivery_lat_lon];
    };

    var showRowDetails = function(row) {
      $s.rowDetails = [{
          desc: "Shipping Instruction",
          val: row.shipping_instructions
        }, {
          desc: "Destination Address",
          val: row.delivery_address
        }, {
          desc: "Source Address",
          val: row.supply_address
        }, {
          desc: "Quantity",
          val: row.quantity
        }, {
          desc: "Weight",
          val: row.variant_weight
        }, {
          desc: "Variant",
          val: row.variant
        }, {
          desc: "Product Name",
          val: row.product_name
        }];
    };

    $s.getBids = function() {
      var retval = $s.productData.filter(function(e) {
        return e.hasBid;
      });
      return retval;
    }

    $s.updateBidValue = function(row) {
      var path = [row.supply_lat_lon, row.delivery_lat_lon];
      if (row.hasBid) {
        row.bidValue = row.reserve;
        $s.bidLatLonArray.push(path);
      } else {
        row.bidValue = "";
        $s.bidLatLonArray.forEach(function(e, idx) {
          if (JSON.stringify(e) === JSON.stringify(path)) {
            $s.bidLatLonArray.splice(idx, 1);
            return;
          }
        });
      }
    };

    $s.resetFilters = function() {
      $s.search_product = $s.search_bidder_name = $s.search_bidder_email = $s.search_src = $s.search_dest = "";
      $s.clearSelectedBidders();
      $s.showAccepted = false;
      $s.filterAddr = "";
      delete $s.visibleLineLineLatLon;
      $s.getProductData();
    };
    $s.clearSelectedBidders = function(){
      $s.bidders = [];
      $s.bidderList.forEach(function(e) {
        e.isSelected = false;
      });
    }
    $s.clearBids = function() {
      $s.bidLatLonArray = [];

      $s.productData.forEach(function(e) {
        if (e.hasBid) {
          e.hasBid = false;
        }
      });
    };

    $s.placeBid = function() {
      var postData = [];
      var bids = $s.getBids();
      bids.forEach(function(e) {
        postData.push({
          package_id: e._id,
          bidder_name: $s.bidName,
          bidder_email: $s.bidEmail,
          bidder_mobile: $s.bidMobile,
          comments: $s.bidComments,
          value: e.bidValue
        });
      });

      http.post('/api/bid', postData).success(function(data) {
        alert("Bids successfully placed.");
      });
    };

    /* $s.sendEmail = function() {
      var postData = {};
      postData.customer = {name: $s.customerName,
        email: $s.customerEmail};
      postData.headers = $s.csvData.header;
      postData.data = $s.getBids();
      postData.numCols = $s.numCols;

      http.post('/api/sendemail', postData).success(function(data) {
        $s.emailOpen = true;
        $s.emailData = data;
      });
    }; */

    $s.isSortReverse = function(index) {
      return $s.sortReverse[index];
    };
  }]);
