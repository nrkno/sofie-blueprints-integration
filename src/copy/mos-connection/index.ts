// Notes: This file contains types copied from mos-connection@0.6.2

import { MosString128 } from './mosString128'
import { MosDuration } from './mosDuration'
import { IMOSExternalMetaData } from './mosExternalMetaData'
import { MosTime } from './mosTime'

export {
	MosString128,
	MosDuration,
	IMOSExternalMetaData,
	MosTime
}

// api.ts:  -------------------------------------------------------------------
export interface IMOSROAction {
	RunningOrderID: MosString128
}
export interface IMOSStoryAction extends IMOSROAction {
	StoryID: MosString128
}
export interface IMOSItemAction extends IMOSStoryAction {
	ItemID: MosString128
}
export interface IMOSROReadyToAir {
	ID: MosString128
	Status: IMOSObjectAirStatus
}
export interface IMOSRunningOrderStatus {
	ID: MosString128
	Status: IMOSObjectStatus
	Time: MosTime
}
export interface IMOSStoryStatus {
	RunningOrderId: MosString128
	ID: MosString128
	Status: IMOSObjectStatus
	Time: MosTime
}
export interface IMOSItemStatus {
	RunningOrderId: MosString128
	StoryId: MosString128
	ID: MosString128
	Status: IMOSObjectStatus
	Time: MosTime
	ObjectId?: MosString128
	Channel?: MosString128
}
export interface IMOSRunningOrderBase {
	ID: MosString128
	Slug: MosString128
	DefaultChannel?: MosString128
	EditorialStart?: MosTime
	EditorialDuration?: MosDuration
	Trigger?: MosString128
	MacroIn?: MosString128
	MacroOut?: MosString128
	MosExternalMetaData?: Array<IMOSExternalMetaData>
}
export interface IMOSRunningOrder extends IMOSRunningOrderBase {
	Stories: Array<IMOSROStory>
}
export interface IMOSStory {
	ID: MosString128
	Slug?: MosString128
	Number?: MosString128
	MosExternalMetaData?: Array<IMOSExternalMetaData>
}
export interface IMOSROStory extends IMOSStory {
	Items: Array<IMOSItem>
}
export interface IMOSROFullStory extends IMOSStory {
	RunningOrderId: MosString128
	Body: Array<IMOSROFullStoryBodyItem>
}
export interface IMOSROFullStoryBodyItem {
	Type: string
	Content: any | IMOSItem
}
export interface IMOSItem {
	ID: MosString128
	Slug?: MosString128
	ObjectSlug?: MosString128
	ObjectID: MosString128
	MOSID: string
	mosAbstract?: string
	Paths?: Array<IMOSObjectPath>
	Channel?: MosString128
	EditorialStart?: number
	EditorialDuration?: number
	Duration?: number
	TimeBase?: number
	UserTimingDuration?: number
	Trigger?: any
	MacroIn?: MosString128
	MacroOut?: MosString128
	MosExternalMetaData?: Array<IMOSExternalMetaData>
	MosObjects?: Array<IMOSObject>
}
// export declare type MosDuration = MosDuration
export interface IMOSAck {
	ID: MosString128
	Revision: Number
	Status: IMOSAckStatus
	Description: MosString128
}
export interface IMOSROAck {
	ID: MosString128
	Status: MosString128
	Stories: Array<IMOSROAckStory>
}
export interface IMOSROAckStory {
	ID: MosString128
	Items: Array<IMOSROAckItem>
}
export interface IMOSROAckItem {
	ID: MosString128
	Channel: MosString128
	Objects: Array<IMOSROAckObject>
}
export interface IMOSROAckObject {
	Status: IMOSObjectStatus
}
export interface IMOSConnectionStatus {
	PrimaryConnected: boolean
	PrimaryStatus: string
	SecondaryConnected: boolean
	SecondaryStatus: string
}
export interface IMOSDeviceConnectionOptions {
	/** Connection options for the Primary NCS-server */
	primary: {
		/** Name (NCS ID) of the NCS-server */
		id: string
		/** Host address (IP-address) of the NCS-server  */
		host: string
		/** (Optional): Custom ports for communication */
		ports?: {
			upper: number
			lower: number
			query: number
		}
		/** (Optional) Timeout for commands (ms) */
		timeout?: number
	}
	/** Connection options for the Secondary (Buddy) NCS-server */
	secondary?: {
		/** Name (NCS ID) of the Buddy NCS-server */
		id: string
		/** Host address (IP-address) of the NCS-server  */
		host: string
		/** (Optional): Custom ports for communication */
		ports?: {
			upper: number
			lower: number
			query: number
		}
		/** (Optional) Timeout for commands (ms) */
		timeout?: number
	}
}
export interface IMOSObject {
	ID: MosString128
	Slug: MosString128
	MosAbstract?: string
	Group?: string
	Type: IMOSObjectType
	TimeBase: number
	Revision?: number
	Duration: number
	Status?: IMOSObjectStatus
	AirStatus?: IMOSObjectAirStatus
	Paths: Array<IMOSObjectPath>
	CreatedBy?: MosString128
	Created?: MosTime
	ChangedBy?: MosString128
	Changed?: MosTime
	Description?: any
	MosExternalMetaData?: Array<IMOSExternalMetaData>
	MosItemEditorProgID?: MosString128
}
export declare enum IMOSObjectType {
	STILL = 'STILL',
	AUDIO = 'AUDIO',
	VIDEO = 'VIDEO',
	OTHER = 'OTHER'
}
export declare enum IMOSObjectStatus {
	NEW = 'NEW',
	UPDATED = 'UPDATED',
	MOVED = 'MOVED',
	BUSY = 'BUSY',
	DELETED = 'DELETED',
	NCS_CTRL = 'NCS CTRL',
	MANUAL_CTRL = 'MANUAL CTRL',
	READY = 'READY',
	NOT_READY = 'NOT READY',
	PLAY = 'PLAY',
	STOP = 'STOP'
}
export declare enum IMOSAckStatus {
	ACK = 'ACK',
	NACK = 'NACK'
}
export declare enum IMOSObjectAirStatus {
	READY = 'READY',
	NOT_READY = 'NOT READY'
}
export interface IMOSObjectPath {
	Type: IMOSObjectPathType
	Description: string
	Target: string
}
export declare enum IMOSObjectPathType {
	PATH = 'PATH',
	PROXY_PATH = 'PROXY PATH',
	METADATA_PATH = 'METADATA PATH'
}
