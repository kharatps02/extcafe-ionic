import {Page, NavController, NavParams, Events, Alert} from 'ionic-angular';
import {UserService} from '../../services/userService';
import {SignupPage} from '../user/signup';
@Page({
    templateUrl: 'build/pages/user/login.html'
    //providers: [UserService]
})

export class LoginPage {
    userService: any;
    nav: any;
    user: any;
    submitted: boolean;
    events: any;
    static get parameters() {
        return [[Events], [UserService], [NavController]];
    }

    constructor(events: Events, userService:UserService, nav) {
        this.user = {};
        this.userService = userService
        this.nav = nav;
        this.events = events;
        this.submitted = false;
    }
    onLogin(user) {
        var that = this;
        that.submitted = true;
        console.log('click on login button');
        that.userService.login(user).then(function(data) {
          console.log(data);
            if (data.status !== "ERROR") {
                that.userService.storeUserCredentials(data.user, function() {
                    that.events.publish('user:login');
                    // register device for notification
                    //that.userService.registerDeviceOnServer();
                });
            } else {
                Alert.create({
                    title: 'Error',
                    subTitle: data.message,
                    buttons: ['OK']
                });
            }

        });
    }
    onSignup() {
        this.nav.setRoot(SignupPage, { tabIndex: 1 });
    }

}
