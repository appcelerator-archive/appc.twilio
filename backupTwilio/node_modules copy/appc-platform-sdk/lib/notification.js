/**
 * This source code is the intellectual property of Appcelerator, Inc.
 * Copyright (c) 2014-2015 Appcelerator, Inc. All Rights Reserved.
 * See the LICENSE file distributed with this package for
 * license restrictions and information about usage and distribution.
 */
/**
 * make a request to AppC platform for fetching notifications
 */
var AppC = require('./index');

module.exports = Notification;

/**
 * Notification object
 */
function Notification() {

}

/**
 * find all the notifications for the logged in user
 */
Notification.findAll = function (session, callback) {
	AppC.createRequest(session, '/api/v1/notification', callback);
};
