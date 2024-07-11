import { HttpMethod } from "./utils";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../../environment";

const realm = 'fintatech';

export const route = `/identity/realms/${realm}/protocol/openid-connect/token`;
export const method = 'POST' satisfies HttpMethod;

const body = new HttpParams()
  .set('grant_type', 'password')
  .set('client_id', 'app-cli')
  .set('username', environment.USERNAME)
  .set('password', environment.PASSWORD)

const headers = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
})

export const options = { body: body.toString(), headers }

export type Resp = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy': number,
  session_state: string;
  scope: string;
}
