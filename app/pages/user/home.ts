import {Page} from 'ionic-angular';
import {LoginPage} from '../user/login';
import {SignupPage} from '../user/signup';


@Page({
  templateUrl: 'build/pages/user/home.html'
})
export class HomePage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  loginRoot: any = LoginPage;
  SignupRoot: any = SignupPage;
}
