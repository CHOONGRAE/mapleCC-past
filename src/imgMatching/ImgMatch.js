export default class ImgMatch {

    constructor(src, coreImgs, i, _getResult) {
        this.src = src
        this.coreImgs = coreImgs
        this.index = i
        this._getResult = _getResult
    }

    run = async () => {
        this.src = await this.loadImg(this.src)
        let canvas = new OffscreenCanvas(0, 0)
        let gl = canvas.getContext('webgl2')

        let glInfo = this.initial(gl)

        let area = await this.getArea(gl, glInfo)

        let corrects = {}

        for (let core of this.coreImgs) {
            let result = this.matching(gl, [area, core[1]], glInfo)
            if (result.length) {
                for (let point of result) {
                    if (corrects[`${point.y},${point.x}`]) {
                        if (corrects[`${point.y},${point.x}`].value < point.v) {
                            corrects[`${point.y},${point.x}`] = {
                                core: core[0],
                                value: point.v
                            }
                        }
                    } else {
                        corrects[`${point.y},${point.x}`] = {
                            core: core[0],
                            value: point.v
                        }
                    }
                    this._getResult(this.index, corrects)
                }
            }
            await new Promise(resolve => setTimeout(resolve, 0))
        }

        console.log(corrects)
    }

    writeShader = () => {
        const vertex =
            `#version 300 es

            in vec2 a_position;
            in vec2 a_texCoord;

            uniform vec2 u_resolution;

            out vec2 v_texCoord;

            void main() {
                gl_Position = vec4((a_position * 2.0 / u_resolution - 1.0), 0, 1);
                v_texCoord = a_texCoord;
            }`

        const fragment =
            `#version 300 es

            precision highp float;

            uniform sampler2D u_tex0;
            uniform sampler2D u_tex1;

            uniform ivec2 u_wh;
            uniform vec2 u_res0;
            uniform vec2 u_res1;

            in vec2 v_texCoord;
            
            out vec4 outColor;

            vec4 encode32(float f){
                float F = abs(f);
                if(F == 0.0) return vec4(0);

                float Sign = step(0.0,-f);
                float Exponent = floor(log2(F));
                float Mantissa = F/exp2(Exponent);

                if(Mantissa < 1.0) Exponent -= 1.0;
                Exponent += 127.0;

                float R = floor(exp2(23.0)*mod(Mantissa,exp2(-15.0)));
                float G = floor(mod(floor(Mantissa*exp(23.0-8.0)),exp2(8.0)));
                float B = 128.0 * mod(Exponent,2.0) + mod(floor(Mantissa*128.0),128.0);
                float A = 128.0*Sign + floor(Exponent*exp2(-1.0));

                return vec4(R,G,B,A);
            }
            
            void main() {

                vec3 ST_sum = vec3(float(0));
                vec3 S_sum = vec3(float(0));
                vec3 S_sqsum = vec3(float(0));
                vec3 T_sum = vec3(float(0));
                vec3 T_sqsum = vec3(float(0));

                float area = 0.0;

                for(int y=0; y<=u_wh.t; y++){
                    for(int x=0; x<=u_wh.s; x++){
                        vec2 Td = vec2(float(x),float(y)) * u_res1;
                        vec4 T = texture(u_tex1, Td);

                        if(T.a != 0.0){
                            area += 1.0;
                            vec2 Sd = vec2(float(x),float(y)) * u_res0;
                            vec4 S = texture(u_tex0, v_texCoord + Sd);
    
                            ST_sum += S.rgb * T.rgb;
                            S_sum += S.rgb;
                            S_sqsum += S.rgb * S.rgb;
                            T_sum += T.rgb;
                            T_sqsum += T.rgb * T.rgb;                            
                        }
                    }
                }

                // float area = float(u_wh.s * u_wh.t);
                vec3 result = (ST_sum * area - S_sum * T_sum) / sqrt((T_sqsum * area - T_sum * T_sum) * (S_sqsum * area - S_sum * S_sum));
                vec3 y = vec3(0.29889531,0.58662247,0.11448223);
                float toy = dot(result, y);

                outColor = encode32(toy) / 255.;
            }`

        return { vertex, fragment }
    }

    initial = (gl) => {
        const { vertex, fragment } = this.writeShader()

        let vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertex)
        let fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragment)

        let program = this.createProgram(gl, vertexShader, fragmentShader)

        gl.useProgram(program)

        let a_position = gl.getAttribLocation(program, 'a_position')
        let a_texCoord = gl.getAttribLocation(program, 'a_texCoord')

        let u_resolution = gl.getUniformLocation(program, 'u_resolution')
        let u_wh = gl.getUniformLocation(program, 'u_wh')
        let u_texs = []
        for (let i = 0; i < 2; i++) {
            let u_tex = gl.getUniformLocation(program, `u_tex${i}`)
            u_texs.push(u_tex)
        }
        let u_ress = []
        for (let i = 0; i < 2; i++) {
            let u_res = gl.getUniformLocation(program, `u_res${i}`)
            u_ress.push(u_res)
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

        return { u_resolution, u_wh, u_texs, u_ress, positionBuffer }
    }

    matching = (gl, imgs, glInfo) => {
        gl.canvas.width = imgs[0].width
        gl.canvas.height = imgs[0].height

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.uniform2f(glInfo.u_resolution, gl.canvas.width, gl.canvas.height)
        gl.uniform2i(glInfo.u_wh, imgs[1].width, imgs[1].height)
        for (let i = 0; i < 2; i++) {
            gl.uniform1i(glInfo.u_texs[i], i)
        }
        for (let i = 0; i < 2; i++) {
            gl.uniform2f(glInfo.u_ress[i], 1.0 / imgs[i].width, 1.0 / imgs[i].height)
        }

        for (let i = 0; i < 2; i++) {
            let texture = gl.createTexture()
            gl.activeTexture(gl.TEXTURE0 + i)
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, imgs[i].width, imgs[i].height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imgs[i])
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

        return this.getPoint(gl, imgs)
    }

    getPoint = (gl, imgs) => {
        let pixels = new Uint8Array(imgs[0].width * imgs[0].height * 4)
        gl.readPixels(0, 0, imgs[0].width, imgs[0].height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

        pixels = new Float32Array(pixels.buffer)

        let points = []

        for (let i = 0; i < pixels.length; i++) {
            if (pixels[i] >= 0.95) {
                let y = Math.floor(i / imgs[0].width)
                let x = i - y * imgs[0].width
                points[points.length] = {
                    x, y,
                    v: pixels[i]
                }
            }
        }

        points.sort((a, b) => b.v - a.v)

        return points
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

    getArea = async (gl, glInfo) => {
        let imgs = [this.src, await this.loadImg(require('../datas/targetArea.png').default)]

        let points = this.matching(gl, imgs, glInfo)
        if (points.length) {
            let point = points[0]
            console.log(point)
            let canvas = new OffscreenCanvas(imgs[0].width, imgs[0].height)
            let context = canvas.getContext('2d')
            context.putImageData(this.src, 0, 0)
            let data = context.getImageData(point.x + 35, point.y + 65, 385, 385)
            return data
        }

        return false
    }

    loadImg = (source) => new Promise(async res => {
        let img = await fetch(source)
            .then(res => res.blob())
            .then(blob => createImageBitmap(blob))
        let canvas = new OffscreenCanvas(img.width, img.height)
        let context = canvas.getContext('2d')
        context.drawImage(img, 0, 0, img.width, img.height)
        let data = context.getImageData(0, 0, img.width, img.height)
        res(data)
    })
}