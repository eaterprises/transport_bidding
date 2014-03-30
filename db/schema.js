var mongo = require('mongoose'),
  autoIncrement = require('mongoose-auto-increment');
var dbconf = require('../conf/dbconf.js');
var bcrypt = require('bcrypt-nodejs');

console.log('mongodb://' + dbconf.mongoUrl);
mongo.connect('mongodb://' + dbconf.mongoUrl);

autoIncrement.initialize(mongo);

var LatLon = {
  lat: Number,
  lon: Number
};

var Package = new mongo.Schema({
  timestamp: {type: Date, default: Date.now},
  supplier_name: String,
  supplier_suburb: String,
  supplier_postcode: String,
  supplier_address: String,
  distributor_name: String,
  distributor_suburb: String,
  distributor_postcode: String,
  distributor_address: String,
  product_name: String,
  variant: String,
  variant_weight: Number,
  quantity: Number,
  reserve: Number,
  supply_address: String,
  delivery_address: String,
  shipping_instructions: String,
  supply_lat_lon: LatLon,
  delivery_lat_lon: LatLon,
  is_active: { type: Boolean, default: true }
});

var TransportCycle = new mongo.Schema({
  transport_cycle_coordinator_id: String,
  start_date: Date,
  end_date: Date,
  package_list: [Package],
  is_active: { type: Boolean, default: true }
});

var Bid = new mongo.Schema({
  package_id: String,
  bidder_name: String,
  bidder_email: String,
  bidder_mobile: String,
  comments: String,
  value: Number,
  ts: { type: Date, default: Date.now },
  bid_status: { type: Number, default: 0 }
});

var Coordinator = new mongo.Schema({
  organisation: String,
  first_name: String,
  last_name: String,
  email: String,
  mobile: String,
  landline: String,
  email_address: String,
  address_street: String,
  address_suburb: String,
  address_postcode: String,
  address_address: String
});

var User = new mongo.Schema({
  first_name: String,
  last_name: String,
  username: String,
  role: String,
  _id: String,
  password: String
});

var userSchema = new mongo.Schema({

    local            : {
        email        : String,
        password     : String,
        role         : String,
        first_name   : String,
        last_name    : String,
    }
});
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


TransportCycle.plugin(autoIncrement.plugin, { model: "transport_cycle",
  field: "tc_num" });

exports.TransportCycle = mongo.model("transport_cycle", TransportCycle);
exports.Package = mongo.model("package", Package);
exports.Bid = mongo.model("bid", Bid);
exports.Coordinator = mongo.model("coordinator", Coordinator);
exports.UserOld = mongo.model("userOld", User);
exports.User = mongo.model("user", userSchema);
