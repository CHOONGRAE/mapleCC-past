export default class ImgFetch {

    constructor(skillList, skillData) {
        this.skillList = skillList
        this.skillData = skillData
    }

    fetch = async () => {
        let canvas = new OffscreenCanvas(32, 32)
        let gl = canvas.getContext('webgl2')

        let glInfo = this.initial(gl)
        
        let list = {}
        for (let skill of this.skillList) {
            list[skill + 0] = await this.loadImg(this.skillData[skill].core1)
            list[skill + 1] = await this.loadImg(this.skillData[skill].core2)
            list[skill + 2] = await this.loadImg(this.skillData[skill].img)
        }

        let frame = await this.loadImg(require('../datas/iconFrame.frame3.png').default)

        let result = []
        for (let f = 0; f < this.skillList.length; f++) {
            for (let s = 0; s < this.skillList.length; s++) {
                if (f != s) {
                    for (let t = 0; t < this.skillList.length; t++) {
                        if (f != t && s != t) {
                            let coreimg = this.manipulate(gl, [
                                list[this.skillList[f] + 0],
                                list[this.skillList[s] + 1],
                                list[this.skillList[t] + 2],
                                frame
                            ],glInfo)
                            result[result.length] = [[f,s,t],coreimg]
                            await new Promise(resolve => setTimeout(resolve, 0))
                        }
                    }
                }
            }
        }
        return result
    }

    writeShader = () => {
        const vertex =
            `#version 300 es

            in vec2 a_position;
            in vec2 a_texCoord;

            uniform vec2 u_resolution;

            out vec2 v_texCoord;

            void main() {
                gl_Position = vec4((a_position * 2.0 / u_resolution - 1.0)*vec2(1,-1), 0, 1);
                v_texCoord = a_texCoord;
            }`

        const fragment = 
            `#version 300 es

            precision highp float;

            uniform sampler2D u_tex0;
            uniform sampler2D u_tex1;
            uniform sampler2D u_tex2;
            uniform sampler2D u_tex3;

            in vec2 v_texCoord;
            
            out vec4 outColor;
            
            void main() {
                vec4 color0 = texture(u_tex0, v_texCoord);
                vec4 color1 = texture(u_tex1, v_texCoord);
                vec4 color2 = texture(u_tex2, v_texCoord);
                vec4 color3 = texture(u_tex3, v_texCoord);

                float a0 = color0.a;
                float a1 = color1.a;
                float a2 = color2.a;
                float a3 = color3.a;
                float a20 = (1.0 - (1.0 - a0) * (1.0 - a2));
                float a201 = (1.0 - (1.0 - a1) * (1.0 - a20));
                float a = (1.0 - (1.0 - a3) * (1.0 - a201));

                vec3 rgb0 = color0.rgb;
                vec3 rgb1 = color1.rgb;
                vec3 rgb2 = color2.rgb;
                vec3 rgb3 = color3.rgb;
                vec3 rgb20 = a0 * rgb0 + a2 * rgb2 * (1.0 - a0);
                vec3 rgb201 = a1 * rgb1 + a20 * rgb20 * (1.0 - a1);
                vec3 rgb = a3 * rgb3 + a201 * rgb201 * (1.0 - a3);

                outColor = vec4(rgb,a);
            }`

        return {vertex,fragment}
    }

    initial = (gl) => {
        const {vertex, fragment} = this.writeShader()

        let vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertex)
        let fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragment)

        let program = this.createProgram(gl, vertexShader, fragmentShader)

        gl.useProgram(program)

        let a_position = gl.getAttribLocation(program, 'a_position')
        let a_texCoord = gl.getAttribLocation(program, 'a_texCoord')

        let u_resolution = gl.getUniformLocation(program, 'u_resolution')
        let u_texs = []
        for (let i = 0; i < 4; i++) {
            let u_tex = gl.getUniformLocation(program, `u_tex${i}`)
            u_texs.push(u_tex)
        }

        let positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.enableVertexAttribArray(a_position)

        gl.vertexAttribPointer(
            a_position, 2, gl.FLOAT, false, 0, 0
        )

        let texCoordBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ]), gl.STATIC_DRAW)

        gl.enableVertexAttribArray(a_texCoord)

        gl.vertexAttribPointer(
            a_texCoord, 2, gl.FLOAT, false, 0, 0
        )

        return { u_resolution, u_texs, positionBuffer }
    }

    manipulate = (gl, imgs, glInfo) => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.uniform2f(glInfo.u_resolution, gl.canvas.width, gl.canvas.height)
        for (let i = 0; i < 4; i++) {
            gl.uniform1i(glInfo.u_texs[i], i)
        }

        for (let i = 0; i < 4; i++) {
            let texture = gl.createTexture()
            gl.activeTexture(gl.TEXTURE0 + i)
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, gl.UNSIGNED_BYTE, imgs[i])
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, glInfo.positionBuffer)

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            imgs[0].width, 0,
            0, imgs[0].height,
            0, imgs[0].height,
            imgs[0].width, 0,
            imgs[0].width, imgs[0].height
        ]), gl.STATIC_DRAW)

        gl.drawArrays(gl.TRIANGLES, 0, 6)

        return this.getResult(gl)
    }

    createShader = (gl, type, source) => {
        let shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (success) return shader

        console.log(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
    }

    createProgram = (gl, vertex, fragment) => {
        let program = gl.createProgram()
        gl.attachShader(program, vertex)
        gl.attachShader(program, fragment)
        gl.linkProgram(program)
        let success = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (success) return program

        console.log(gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
    }

    getResult = (gl) => {
        let canvas = new OffscreenCanvas(32, 32)
        let context = canvas.getContext('2d')
        context.drawImage(gl.canvas, 0, 0, 32, 32)
        let data = context.getImageData(0, 0, 32, 32)
        return data
    }

    loadImg = (imgData) => new Promise(async res => {
        let canvas = new OffscreenCanvas(32, 32)
        let context = canvas.getContext('2d')
        let img = await fetch(imgData)
            .then(res => res.blob())
            .then(blob => createImageBitmap(blob))
        context.drawImage(img, 0, 0, 32, 32)
        let data = context.getImageData(0, 0, 32, 32)
        res(data)
    })
}