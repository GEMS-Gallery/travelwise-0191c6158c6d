import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Recommendation {
  'accommodation' : string,
  'place' : string,
  'activity' : string,
}
export type Recommendations = Array<Recommendation>;
export type Result = { 'ok' : TravelInfo } |
  { 'err' : string };
export type Result_1 = { 'ok' : Recommendations } |
  { 'err' : string };
export type Result_2 = { 'ok' : null } |
  { 'err' : string };
export interface TravelInfo {
  'climate' : string,
  'bestTimeToVisit' : string,
  'description' : string,
}
export interface _SERVICE {
  'addTravelInfo' : ActorMethod<[string, TravelInfo], Result_2>,
  'getRecommendations' : ActorMethod<[string], Result_1>,
  'getTravelInfo' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
