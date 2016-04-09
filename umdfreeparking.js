//Databases
Lots = new Mongo.Collection('lots');

if (Meteor.isClient) {
  Meteor.subscribe("lots");
  // counter starts at 0
  Session.setDefault('time', "10amTh");

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
      var hour = new Date().getHours();
      if (hour >= 16 || hour <= 7) {
        return true;
      } else {
        return false;
      }
    },
    specificLots: function(time){
      console.log("specificLots");
      var time = Session.get('time');
      if (isNaN(time[0])==false) { //checks if the first character is a number
        if (isNaN(time[1])==false) { //checks if the 2nd charcter is a number
          //if it is then it could be 10 11 12
          if (time[2] == "p") { //check if 2 digit time is pm/am
            if (time[1] != "2") { //if it isn't 12pm can park except if weekend in some lots
              if (time[4] == "S") { //if weekend
                return Lots.find({weekend: true});
              } else { //not weekend
                return Lots.find({time: { $gte: 16 }});
              }
            } else { //it's 12 pm you can't park anywhere except during weekend
              if (time[4] == "S") { //if weekend
                return Lots.find({weekend: true});
              } else { //not weekend
                return Lots.find({time: { $lt: 16 }}); //returns nothing
              }
            }
          } else { //2 digit time is am. if 12 am park anywhere if 10 am or 11 am park no where
            if (time[1] == "2") { //it's 12 am park anywhere
              return Lots.find({time: { $gte: 16 }});
            } else { //10 or 11 am park no where except on weekends
              if (time[4] == "S") { //if weekend
                return Lots.find({weekend: true});
              } else { //not weekend
                return Lots.find({time: { $lt: 16 }}); //returns nothing
              }
            }
          }
        } else if (time[1] == "p") { //if 2nd char isn't and it's pm then add 12 to number
          var hour = 12 + Number(time[0]);
          if (time[3] == "S") { //check if weekend
            return Lots.find({weekend: true});
          } else { //if not a weekend
              if (hour >= 16 || hour <= 7) {
                return Lots.find({time: { $gte: 16 }});
              }
          }
        } else { //2nd char is "am" not a number
            var hour = Number(time[0]);
            if (hour == 3 || hour == 4 || hour == 5) { //if 3/4/5 am
              if (time[3] == "S"){ //during weekend modres and student parking not allowed
                return Lots.find({status: "unres", student: false, weekend: true});
              } else { //not during weekend can't park during these hours in student parking
                return Lots.find({student: false, weekend: true});
              }
            } else {
                if (time[3] == "S") { //check if weekend
                  return Lots.find({weekend: true});
                } else { //if not a weekend
                    if (hour >= 16 || hour <= 7) {
                      return Lots.find({time: { $gte: 16 }});
                    }
                }
          }
        }
      } else { //first character wasn't a number
        alert("Improper Input Loh! Try Again");
        return Lots.find({time: { $lt: 16 }});
      }
    },
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      event.preventDefault();
      var time = document.getElementById("time").value;
      Session.set('time', time);
      //Meteor.call("returnTime", time);
    }
  });

  Template.lotsList.helpers({
    weekendCheck: function(weekend){
      var day = new Date().getDay();
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
