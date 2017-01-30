/**
 * This source code is the intellectual property of Appcelerator, Inc.
 * Copyright (c) 2014-2015 Appcelerator, Inc. All Rights Reserved.
 * See the LICENSE file distributed with this package for
 * license restrictions and information about usage and distribution.
 */

/**
 * make a request to AppC platform for analytics
 */
var AppC = require('./index'),
	Auth = require('./auth'),
	request = require('request'),
	uuid = require('uuid-v4'),
	fs = require('fs'),
	path = require('path'),
	crypto = require('crypto'),
	os = require('os'),
	debug = require('debug')('appc:sdk:analytics'),
	analyticsDir = path.join(os.homedir && os.homedir() || process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE || '/tmp', '.appc-analytics'),
	timer,
	sending,
	sequence = 1;

module.exports = Analytics;

/**
 * Analytics object
 */
function Analytics () {
}

/**
 * default location of the analytics cache
 */
Analytics.analyticsDir = analyticsDir;

/**
 * URL for sending data
 */
Analytics.url = 'https://api.appcelerator.net/p/v2/partner-track';

/**
 * the interval in MS to send analytics. If set to 0, always send immediately
 */
Analytics.flushInterval = 10000;

/**
 * store an event in the internal store ready to be sent
 * @private
 */
Analytics.storeEvent = function (obj) {
	!fs.existsSync(Analytics.analyticsDir) && fs.mkdirSync(Analytics.analyticsDir);
	var fn = path.join(Analytics.analyticsDir, Math.floor(Date.now()) + '-' + obj.seq + '-' + obj.id + '.json');
	debug('store event', obj, fn);
	fs.writeFileSync(fn, JSON.stringify(obj));
};

/**
 * flush pending events to analytics
 * @private
 */
Analytics.flushEvents = function (callback) {
	debug('flushEvents', fs.existsSync(Analytics.analyticsDir), 'sending', sending);
	if (fs.existsSync(Analytics.analyticsDir) && !sending) {
		var files = fs.readdirSync(Analytics.analyticsDir);
		if (files.length) {
			sending = true;
			// sort them in timestamp order
			files.sort();
			var data = files.map(function (fn) {
				var buf = fs.readFileSync(path.join(Analytics.analyticsDir, fn));
				return JSON.parse(buf);
			});
			var opts = {
				url: Analytics.url,
				method: 'POST',
				json: data,
				timeout: 30000
			};
			debug('flushEvents sending', opts);
			return request(opts, function (err, resp, body) {
				sending = false;
				debug('flushEvents response', err, resp && resp.statusCode, body);
				// if the server accepted the events, delete them
				if (!err && body && body.length) {
					body.forEach(function (status, i) {
						// delete the files the server accepted
						if (status === 204) {
							var fn = path.join(Analytics.analyticsDir, files[i]);
							fs.existsSync(fn) && fs.unlinkSync(fn);
						}
					});
					// pause the event timer if we have no pending events, will
					// restart automatically when a new event is queued
					if (timer && fs.readdirSync(Analytics.analyticsDir).length === 0) {
						Analytics.stopSendingEvents();
					}
				}
				callback && callback(err, data, true);
			});
		}
	}
	callback && callback();
};

/**
 * called to start sending events
 * @private
 */
Analytics.startSendingEvents = function () {
	debug('startSendingEvents', Analytics.flushInterval);
	if (!timer && Analytics.flushInterval) {
		timer = setInterval(Analytics.flushEvents, Analytics.flushInterval);
		// don't allow the process to hold because of the timer if we are ready to exit
		timer.unref();
	}
};

/**
 * called to stop sending events
 * @private
 */
Analytics.stopSendingEvents = function () {
	debug('stopSendingEvents');
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
};

/**
 * Session class
 * @private
 */
function Session (guid, mid, sid, deploytype, platform) {
	this.guid = guid;
	this.mid = mid;
	this.sid = sid;
	this.deploytype = deploytype;
	this.platform = platform;
}

/**
 * send a session event
 */
Session.prototype.send = function (eventdata, event) {
	Analytics.sendEvent(this.guid, this.mid, eventdata, event, this.deploytype, this.sid, this.platform);
};

/**
 * send an end session event
 */
Session.prototype.end = function (data) {
	Analytics.sendEvent(this.guid, this.mid, data, 'ti.end', this.deploytype, this.sid, this.platform);
};

/**
 * create an analytics Session and send the session start event (ti.start) and then return a session object
 * which `end` should be called when the session is completed.
 */
Analytics.createSession = function sendEvent (guid, mid, eventdata, deploytype, platform) {
	var sid = uuid();
	Analytics.sendEvent(guid, mid, eventdata, 'ti.start', deploytype, sid, platform);
	return new Session(guid, mid, sid, deploytype, platform);
};

/**
 * send an analytics event to the Analytics API
 */
Analytics.sendEvent = function sendEvent (guid, mid, eventdata, event, deploytype, sid, platform, immediate, callback) {
	if (mid && typeof(mid) === 'function') {
		callback = mid;
		mid = eventdata = event = deploytype = sid = platform = immediate = undefined;
	}
	if (eventdata && typeof(eventdata) === 'function') {
		callback = eventdata;
		eventdata = event = deploytype = sid = platform = immediate = undefined;
	}
	if (event && typeof(event) === 'function') {
		callback = event;
		event = deploytype = sid = platform = immediate = undefined;
	}
	if (deploytype && typeof(deploytype) === 'function') {
		callback = deploytype;
		deploytype = sid = platform = immediate = undefined;
	}
	if (sid && typeof(sid) === 'function') {
		callback = sid;
		sid = platform = immediate = undefined;
	}
	if (platform && typeof(platform) === 'function') {
		callback = platform;
		platform = immediate = undefined;
	}
	if (immediate && typeof(immediate) === 'function') {
		callback = immediate;
		immediate = undefined;
	}
	if (!guid) {
		var error = new Error('missing required guid');
		if (callback) {
			return callback(error);
		} else {
			throw error;
		}
	}
	if (!mid) {
		// get the unique machine id
		return Auth.getUniqueMachineID(function (err, id) {
			Analytics.sendEvent(guid, id, eventdata, event, deploytype, sid, platform, immediate, callback);
		});
	} else {
		sid = sid || uuid();
		platform = platform || AppC.userAgent;
		deploytype = deploytype || 'production';
		event = event || 'app.feature';
		eventdata = eventdata || {};
		var data = {
			id: uuid(),
			sid: sid,
			aguid: guid,
			mid: mid,
			deploytype: deploytype,
			platform: platform,
			ts: new Date().toISOString(),
			event: event,
			data: eventdata,
			ver: '3',
			seq: sequence++
		};
		Analytics.storeEvent(data);
		if (immediate || callback) {
			// immediately send the event if we are immediate or if we have a callback
			Analytics.flushEvents(callback);
		} else {
			// start sending events (if not already running)
			Analytics.startSendingEvents();
			callback && callback(null, data, false);
		}
	}
};

// on shutdown, try and send any events if possible
process.once('exit', Analytics.flushEvents);
