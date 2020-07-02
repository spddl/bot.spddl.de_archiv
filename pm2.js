const pm2 = require('pm2')

// pm2 stop     <app_name|id|all>
// pm2 restart  <app_name|id|all>
// pm2 delete   <app_name|id|all>
// pm2 reload all           		# Reload all apps in 0s manner
// pm2 reset <app_name|id|all>    	# Reset meta data (restarted time...)
// pm2 list
// pm2 describe 0 					# To have more details on a specific process
// pm2 monit 						# Monitoring all processes launched
// pm2 logs
// pm2 logs --raw
// pm2 logs big-api
// pm2 flush          				# Clear all the logs

// https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#json-app-declaration
// http://pm2.keymetrics.io/docs/usage/log-management/
pm2.connect(function () {
  pm2.start({
    apps: [{
      name: 'bot.spddl.de',
      script: './bot.js',
      log_date_format: 'DD-MM HH:mm:ss.SSS',
      args: ['--color'],
      env: { 'NODE_ENV': 'production' }/*,
      instances : 2 */
    }]
  }, function (err, apps) {
    if (err) console.warn(err)
    pm2.disconnect()
  })
})
