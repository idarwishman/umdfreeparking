//Databases
Lots = new Mongo.Collection('lots');

if (Meteor.isClient) {
  Meteor.subscribe("lots");
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    time: function () {
      var art = Lots.find({name: "myTime" });
      var time = art.map(function (piece) {
            return piece.time;
      });
      console.log(time);
      return time;
    },
    lots: function(){
      console.log("hello");
      return Lots.find({time: { $gte: 16 }});
    },
    noLots: function(){
      return "No Lots are avaliable at this time. Check back at 4 pm";
    },
    timeCheck: function(){
      var hour = 17;//new Date().getHours();
      if ((hour >= 16 || hour <= 7) && (hour != 3) && (hour != 4) && (hour != 5)) {
        return true;
      } else {
        return false;
      }
    },
    lotsNow: function(){
      return "Lots avaliable now are (click lot for directions):"
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      event.preventDefault();
      var time = document.getElementById("time").value;
      Meteor.call("returnTime", time);
    }
  });

  Template.lotsList.helpers({
    weekendCheck: function(weekend){
      var day = 3;//new Date().getDay();
      if (day == 6 || day == 0) { //if it's the weekend
        if (weekend) { //and the lot is avaliable during the weekend
          return true;
        } else {
          return false;
        }
      } else { //if it's not the weekend that is the standard so continue as usual
        return true;
      }
    },
    unresStatus: function(status){
      if (status == "unres") {
        return true;
      } else {
        return false;
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("lots", function(){
    return Lots.find({});
  });
}
