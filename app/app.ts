import {App, Platform, Events, MenuController, Nav, Alert} from 'ionic-angular';
import {StatusBar, Splashscreen, Push} from 'ionic-native';
import {ViewChild} from '@angular/core';
import {DataService} from './services/dataService';
import {UserService} from './services/userService';
import {APP_CONFIG} from './config/config';
import {LoginPage} from './pages/user/login';
import {SignupPage} from './pages/user/signup';
import {HomePage} from './pages/user/home';
import {CafeHome} from './pages/cafe/cafe-home';


@App({
    templateUrl: 'build/app.html',
    // http://ionicframework.com/docs/v2/api/config/Config/
    providers: [UserService, DataService],
    config: { tabbarPlacement: "bottom" },
    queries: {
        nav: new ViewChild('content')
    }
})
export class MyApp {
    static get parameters() {
        return [
            [Platform], [MenuController], [Events], [UserService]
        ]
    }
    // make HelloIonicPage the root (or first) page
    rootPage: any = HomePage;
    platform: any;
    menu: any;
    events: any;
    nav: any;
    userService: any;
    appPages: Array<{ title: string, component: any, icon: string, index: number }>;
    loggedInPages: Array<{ title: string, component: any, icon: string }>;
    loggedOutPages: Array<{ title: string, component: any, icon: string }>;

    constructor(platform, menu, events, userService) {
        this.platform = platform;
        this.menu = menu;
        this.events = events;
        this.initializeApp();
        this.userService = userService;


        this.appPages = [
            { title: 'About Cafe', component: CafeHome, icon: 'ios-information-circle-outline', index: 2 },
            { title: 'Help', component: CafeHome, icon: 'ios-help-circle-outline', index: 4 }
        ];

        this.loggedInPages = [
            { title: 'Logout', component: LoginPage, icon: 'log-out' }
        ];

        this.loggedOutPages = [
            { title: 'Login', component: LoginPage, icon: 'log-in' },
            { title: 'Signup', component: SignupPage, icon: 'person-add' }
        ];
        // decide which menu items should be hidden by current login status stored in local storage
        userService.hasLoggedIn().then((hasLoggedIn) => {
            this.enableMenu(hasLoggedIn == 'true');
            this.nav.setRoot(CafeHome);
        });
        this.listenToLoginEvents();
    }

    initializeApp() {
        var that = this;
        that.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
            that.inItPush();
        });
    }

    openPage(page) {
        // find the nav component and set what the root page should be
        // reset the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        console.log("In openPage title:" + page.title);
        if (page.index) {
            this.nav.setRoot(page.component, { tabIndex: page.index });
        } else {
            this.nav.setRoot(page.component);
        }

        // close the menu when clicking a link from the menu
        this.menu.close();

        if (page.title === 'Logout') {
            // Give the menu time to close before changing to logged out
            console.log('calling Logout api...')
            setTimeout(() => {
                // logout api call
                this.userService.logout();

            }, 1000);
        }
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', () => {
            this.enableMenu(true);
            setTimeout(() => {
                this.nav.setRoot(CafeHome);
            }, 1000);
        });

        this.events.subscribe('user:signup', () => {
            this.enableMenu(true);
            setTimeout(() => {
                this.nav.setRoot(CafeHome);
            }, 1000);
        });

        this.events.subscribe('user:logout', () => {
            this.enableMenu(false);
            this.nav.setRoot(HomePage);
        });
    }

    enableMenu(loggedIn) {
        console.log('In enableMenu loggedIn ' + loggedIn);
        this.menu.enable(loggedIn, "loggedInMenu");
        this.menu.enable(!loggedIn, "loggedOutMenu");
    }

    // Register push notification
    inItPush() {
        var that = this;
        var push = Push.init({
            android: {
                senderID: APP_CONFIG.GCM_SENDER_ID
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });

        push.on('registration', function(data) {
            console.log('In registration');
            console.log(data.registrationId);
            //alert('Token: ' + data.registrationId + ' isAndroid-' + that.platform.is('android') + ' isIOS-' + that.platform.is('ios'));
            // data.registrationId
            that.userService.storeDeviceToken(data.registrationId);
        });

        push.on('notification', function(data) {
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
            console.log('[ push notification ]');
            console.log(JSON.stringify(data));
        });

        push.on('error', function(e) {
            console.log('Error in registration');
            console.log(e.message);
            // e.message
            Alert.create({
                title: 'Notification',
                subTitle: "Device registration falied,please try after some time",
                buttons: ['OK']
            });
        });
    }
}
