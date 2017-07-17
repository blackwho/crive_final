"use strict";

function Config()
{
    this.port = '3000';
    // this.dbUrl = 'mongodb://blackwho:letschatdbadmin@ds151242.mlab.com:51242/letschatdb';
    this.dbUrl = 'mongodb://blackwho:criveappdbadmin@ds155192.mlab.com:55192/criveapp'
    this.redisStore = {
        host: 'redis-18463.c8.us-east-1-4.ec2.cloud.redislabs.com',
        port: '18463',
        secret: 'vikiredis'
    };
    this.mailConfig ={
		service: 'Gmail',
    	auth: {
        	user: 'royvishal442@gmail.com',
        	pass: 'xxxxxxxx'
    	}
	};
}

module.exports = new Config();