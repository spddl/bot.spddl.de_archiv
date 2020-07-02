const irc = require("tmi.js");

global.bot = {}
	

const Twitchclient = new irc.client({
  connection: { reconnect: true },
  channels: ['#spddl_bot','#gronkh','#gronkhtv','#xpandorya','#royalphunk','#tobinatorlp','#pietsmiet','#goobers515','#lirik','#ungespielt','#forsenlol']
});

Twitchclient.on('connected', function (address, port) {
  console.log('connected: '+address+':'+port);
});
Twitchclient.on('disconnected', function (reason) {
  console.warn('disconnected: '+reason);
});
Twitchclient.on('reconnect', function () {
  console.log('reconnect');
});
Twitchclient.on('subgift', function (chan, username, recipient, methods, userstate) {
	// channel, username, recipient, {plan, planName}, userstate
	try {
		let plan = methods_plan_check(methods.plan)
// 		subgift: #forsenlol, Averno_Valhalla, $4.99 bitardtyan_34

		console.log('subgift: '+chan+', '+username+', '+plan.v,recipient)
	} catch(e){
		console.warn(e)
	}

});

Twitchclient.connect();

function methods_plan_check(methods_plan){
  let m
  switch (methods_plan) {
    case 'Prime': m={v: 'Prime',n: 5}; break;
    case '1000': m={v: '$4.99',n: 5}; break;
    case '2000': m={v: '$9.99',n: 10}; break;
    case '3000': m={v: '$25.99',n: 25}; break;
  }
  return m
}