
import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {APP_CONFIG} from '../config/config';
var headers = new Headers({ 'Content-Type': 'application/json' });
var options = new RequestOptions({ headers: headers });

@Injectable()
export class DataService {
    http: Http;
    constructor(http: Http) {
        this.http = http;
    }

}
