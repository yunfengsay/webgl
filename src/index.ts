import { GlobalMap } from "./globalMap";

export const Render = (dom, props) => {
  const canvas = document.createElement("canvas");
  canvas.style = props.style;
  GlobalMap.setCanvasInstace(canvas);
  const gl = canvas.getContext("webgl");
  // 确认WebGL支持性
  if (!gl) {
    alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
    return;
  }
  GlobalMap.setCanvasInstace(gl);

  // 使用完全不透明的黑色清除所有图像
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 用上面指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);
  document.addEventListener("DOMContentLoaded", function () {
	if(typeof dom  === 'bject') {
		dom.appendChild(canvas);
		return
	}
	document.querySelector(dom).appendChild(canvas)
  });
};
