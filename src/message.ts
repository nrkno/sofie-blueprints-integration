
export interface IBlueprintExternalMessageQueueObj {
	/** Type of message */
	type: IBlueprintExternalMessageQueueType
	/** Receiver details */
	receiver: any
	/** Messate details */
	message: any
}
export enum IBlueprintExternalMessageQueueType {
	SOAP = 'soap',
	SLACK = 'slack',
	RABBIT_MQ = 'rabbitmq'
}
export interface ExternalMessageQueueObjSOAP extends IBlueprintExternalMessageQueueObj {
	type: IBlueprintExternalMessageQueueType.SOAP
	receiver: {
		url: string
	}
	message: {
		fcn: string, // which soap function to execute
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

export interface ExternalMessageQueueObjSlack extends IBlueprintExternalMessageQueueObj {
	type: IBlueprintExternalMessageQueueType.SLACK
	receiver: string // slack webhook URL

	message: string
}

export interface ExternalMessageQueueObjRabbitMQ extends IBlueprintExternalMessageQueueObj {
	type: IBlueprintExternalMessageQueueType.RABBIT_MQ
	receiver: {
		host: string,
		topic: string
	}

	message: {
		routingKey: string
		message: string
	}
}
