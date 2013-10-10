// ev.js

define(['backbone.wreqr'],function(Wreqr) {
  return {
    reqres: new Wreqr.RequestResponse(),
    commands: new Wreqr.Commands(),
    vent: new Wreqr.EventAggregator()
  };
});