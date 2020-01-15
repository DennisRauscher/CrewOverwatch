var app;

$(function() {

  app = new Vue({
    el: '#app',
    data: {
      user: {},
      selfID: "",
      crew: {settings:{destination: "Berlin"}} //destination, mates{id, name, poition}
    },
    computed:
    {
      getDistanceToDest: function(userData)
      {
        return "HELLO";
      }
    }
  });

});
