export interface IGlobalMap {
	canvasInstance: HTMLCanvasElement,
	canvasCtx:CanvasRenderingContext2D,
}

export const GlobalMap: IGlobalMap = {
	
}

GlobalMap.set = (key, value) => GlobalMap[key] = value; 
GlobalMap.get = key => GlobalMap[key]

export const DataChanger = {
	setCanvasInstace: data => GlobalMap.set('canvasInstance', data),
	setCanvasCtx: data => GlobalMap.set('canvasCtx', data),
}
