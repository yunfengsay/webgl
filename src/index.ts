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
 
  const vertexShader = createShader(gl, VSHADER_SOURCE_CODE, gl.VERTEX_SHADER)

  const fragmentShader = createShader(gl, FSHADER_SOURCE_CODE, gl.FRAGMENT_SHADER)
  const program = gl.createProgram()

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)
  gl.useProgram(program)
  gl.program = program
  // 获取顶点的数量
  const n = initVertexBuffers(gl)

  // 指定设置清空颜色缓冲区时的颜色值。
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // 绘制
  function draw() {
      // 清空上一次的绘制，因为是逐帧绘制，所以每一次绘制都要清除上次绘制的内容。
      gl.clear(gl.COLOR_BUFFER_BIT)
      // 绘制传入的图元
      // 第一个参数就是图元的类型，上面有说到
      // 第二个参数是指定从哪个顶点开始
      // 第三个参数则是顶点的数量
      gl.drawArrays(gl.TRIANGLES, 0, n)
  }
  draw()
  document.addEventListener("DOMContentLoaded", function () {
	if(typeof dom  === 'bject') {
		dom.appendChild(canvas);
		return
	}
	document.querySelector(dom).appendChild(canvas)
  });
};

function createShader(gl, sourceCode, type) {
	const shader = gl.createShader(type)
	gl.shaderSource(shader, sourceCode)
	gl.compileShader(shader)
	return shader
}

const VSHADER_SOURCE_CODE = `
	attribute vec4 a_Position;
	void main() {
		gl_Position = a_Position;
	}
`
const FSHADER_SOURCE_CODE = `
	void main() {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`
function initVertexBuffers(gl) {
    // 定义顶点坐标，格式是Float32Array 类型数组
    const vertices = new Float32Array([
        -1, 1,
        -1, -1,
         1, -1
    ])
    // 创建缓冲区，缓冲区我的理解是js将数据存在里面，着色器才可以拿的到数据
    const vertexBuffer = gl.createBuffer()
    // 绑定缓存区到当前webgl渲染上下文
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 将坐标值传入缓冲区
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    // 获取a_Position在缓冲区的地址，目的是确定传入的坐标应用到顶点着色器中的哪一个变量
    const a_position = gl.getAttribLocation(gl.program, 'a_Position')
    // 给a_position传递坐标值
    // vertexAttribPointer第一个参数就是接收坐标值的变量位置。
    // 第二个参数告诉每次取几个坐标
    // 第三个参数是用于确定数据的格式
    // 第四个参数 指定当被访问时，固定点数据值是否应该被归一化（GL_TRUE）或者直接转换为固定点值（GL_FALSE）；
    // 第五个参数说明数据存储的方式，单位是字节。0表示一个属性的数据是连续存放的，非0则表示同一个属性在数据中的间隔大小。也就是一个顶点的数据占用了多少字节。
    // 第六个参数属性在缓冲区的偏移值，单位是字节。0表示从头开始读取。

    // 第四，五，六个参数，我暂时还不能理解是干嘛的。。。
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0)

    // 让顶点着色器的a_position可以从缓冲区中拿数据
    gl.enableVertexAttribArray(a_position)

    // 这里返回的3是为了指定有多少个顶点
    return 3
}
