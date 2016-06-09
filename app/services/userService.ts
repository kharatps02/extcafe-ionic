import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {APP_CONFIG} from '../config/config';
import {Storage, LocalStorage, Events} from 'ionic-angular';

var headers = new Headers({ 'Content-Type': 'application/json' });
var options = new RequestOptions({ headers: headers });

@Injectable()
export class UserService {
    http: any;
    storage: any;
    events: any;
    user: any;

    constructor(events: Events, http: Http) {
        var that = this;
        that.events = events;
        that.http = http;
        that.storage = new Storage(LocalStorage);
        that.user = Object;
        console.log('[ In UserService ]');
        // load user info if it is already exist and set to user object .
        that.hasLoggedIn().then(function(hasLoggedIn) {
            if (hasLoggedIn) {
                console.log("[ In UserService, hasLoggedIn :" + hasLoggedIn + " ]");
                that.storage.get(APP_CONFIG.LOCAL_TOKEN_KEY).then(function(userInfo) {
                    console.log("[ In UserService, user :" + JSON.stringify(userInfo) + " ]");
                    that.user = JSON.parse(userInfo);
                });
            }
        }).catch(function(e) {
            console.log(e);
        });
    }


    login(user) {
        console.log('In AuthService, login ');
        console.log(user);
        var that = this;
        var url = APP_CONFIG.baseUrl + '/api/login';
        return new Promise(resolve => {
            this.http.post(url, JSON.stringify(user), options).map(res => res.json())
                .subscribe(data => {
                    console.log(data);
                    resolve(data);
                });
        });
    }

    register(user) {
        console.log('In AuthService, register ');
        console.log(user);
        var that = this;
        var url = APP_CONFIG.baseUrl + '/api/register';
        return new Promise(resolve => {
            that.http.post(url, JSON.stringify(user), options).map(res => res.json())
                .subscribe(data => {
                    console.log(data);
                    resolve(data);

                });
        });
    }

    logout() {
        this.storage.remove(APP_CONFIG.LOCAL_TOKEN_KEY);
        this.storage.remove(APP_CONFIG.HAS_LOGGED_IN);
        this.events.publish('user:logout');
    }

    // return a promise
    hasLoggedIn() {
        return this.storage.get(APP_CONFIG.HAS_LOGGED_IN).then((value) => {
            return value;
        });
    }

    storeUserCredentials(userInfo, storeUserCredentialsCB) {
        var that = this;
        var user = {
            _id: userInfo._id,
            email: userInfo.email,
            username: userInfo.username
        };
        that.storage.set(APP_CONFIG.LOCAL_TOKEN_KEY, JSON.stringify(user)).then(function() {
            that.storage.set(APP_CONFIG.HAS_LOGGED_IN, true).then(function() {
                console.log('In storeUserCredentials storage [' + APP_CONFIG.LOCAL_TOKEN_KEY + '-' + user + ']');
                that.user = user;
                if (storeUserCredentialsCB) storeUserCredentialsCB(user);
            });
        });
    }

    storeDeviceToken(token) {
        this.storage.set(APP_CONFIG.DEVICE_TOKEN_KEY, token).then(function() {
            console.log('In storeDeviceToken, DeviceId is stored into LocalStorage');
        })
    }

    registerDeviceOnServer() {
        var that = this;
        var params = {};
        that.storage.get(APP_CONFIG.DEVICE_TOKEN_KEY).then(function(deviceId) {
            if (!deviceId) return;

            params = {
                'deviceToken': deviceId,
                'userId': that.user._id
            };

            console.log('In registerDeviceOnServer request obj ');
            console.log(params);
            var url = APP_CONFIG.baseUrl + '/api/registerDevice';
            that.http.post(url, JSON.stringify(params), options).map(res => res.json())
                .subscribe(data => {
                    console.log(data);
                });
        });
    }
}
