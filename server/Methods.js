Meteor.methods({
  returnTime: function(time){
    Lots.update({name: "myTime" }, {$set:{time: time}});
	},
});
