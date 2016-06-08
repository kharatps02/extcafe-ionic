import {Page, NavController, NavParams, Events, Alert} from 'ionic-angular';
import {UserService} from '../../services/userService';

@Page({
    templateUrl: 'build/pages/user/signup.html',
  //  providers: [UserService]
})

export class SignupPage {
    user: {
        username: string,
        password: string,
        email: string
    };
    userService: any;
    events: any;
    submitted: boolean;

    static get parameters() {
        return [[UserService], [Events]];
    }

    constructor(userService:UserService, events) {
        this.userService = userService
        this.user = {
            username: '',
            password: '',
            email: ''
        }
        this.submitted = false;
        this.events = events;
    }
    onSignup(user) {
        var that = this;
        that.submitted = true;
        console.log('click on login button');
        console.log(user);
        that.userService.register(user).then(function(data) {
            if (data.status !== "ERROR") {
                that.userService.storeUserCredentials(data.user, function() {
                    that.events.publish('user:signup');

                    // register device for notification
                //    that.userService.registerDeviceOnServer();
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
}
