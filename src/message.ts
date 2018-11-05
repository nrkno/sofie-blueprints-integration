export interface IBlueprintExternalMessageQueueObj {
	/** Type of message */
	type: 'soap' | 'slack'
	/** Receiver details */
	receiver: any
	/** Messate details */
	message: any
}
export interface ExternalMessageQueueObjSOAP extends IBlueprintExternalMessageQueueObj {
	type: 'soap'
	receiver: {
		url: string
	}
	message: {
		fcn: string, // soap function to execute
		clip_key: ExternalMessageQueueObjSOAPMessageAttrOrFcn
		clip: ExternalMessageQueueObjSOAPMessageAttrOrFcn
	}
}
export type ExternalMessageQueueObjSOAPMessageAttrOrFcn = ExternalMessageQueueObjSOAPMessageAttrFcn | any
export interface ExternalMessageQueueObjSOAPMessageAttr {
	[attr: string]: ExternalMessageQueueObjSOAPMessageAttrOrFcn
}
export interface ExternalMessageQueueObjSOAPMessageAttrFcn {
	_fcn: {
		soapFetchFrom?: {
			fcn: string
			attrs: any[]
		}
		xmlEncode?: {
			value: any
		}
	}
}
