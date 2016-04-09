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
      return Lots.find({status: "unres", time: { $gte: 16 }});
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("lots", function(){
    return Lots.find({});
  });
}
