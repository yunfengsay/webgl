export interface IGlobalMap {
	canvasInstance: HTMLCanvasElement,
	canvasCtx:CanvasRenderingContext2D,
}

export const GlobalMap: IGlobalMap = new Proxy({}, {
	get: function(target, funcName: string) {
		if(funcName.startsWith('set')) {
			const keyname = funcName.split('set')[1]
			return () => GlobalMap[keyname] = arguments[0]
		}
		if(funcName.startsWith('get')) {
			const keyname = funcName.split('get')[1]
			return GlobalMap[keyname]	
		}
		return null 
	}
})
window.GlobalMap = GlobalMap


GlobalMap.set = (key, value) => GlobalMap[key] = value; 
GlobalMap.get = key => GlobalMap[key]

export const DataChanger = {
	setCanvasInstace: data => GlobalMap.set('canvasInstance', data),
	setCanvasCtx: data => GlobalMap.set('canvasCtx', data),
}

