export default class ImgMatch {

    constructor(src, coreImgs){
        this.src = src
        this.coreImgs = coreImgs
    }

    run = async () => {
        // let canvas = new OffscreenCanvas(32, 32)
        let canvas = document.createElement('canvas')
        this.src = await this.loadSrc(this.src)
        let imgs = [this.src,await this.loadSrc(require('../datas/targetArea.png').default)]
        document.querySelector('#maple').appendChild(canvas)
        let gl = canvas.getContext('webgl2')
        
        const { vertex, fragment } = this.writeShader()

        let vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertex)
        let fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragment)

        let program = this.createProgram(gl, vertexShader, fragmentShader)

        let a_position = gl.getAttribLocation(program, 'a_position')
        let a_texCoord = gl.getAttribLocation(program, 'a_texCoord')

        let u_resolution = gl.getUniformLocation(program, 'u_resolution')
        let u_texs = []
        for (let i = 0; i < 2; i++) {
            let u_tex = gl.getUniformLocation(program, `u_tex${i}`)
            u_texs.push(u_tex)
        }
        let u_ress = []
        for(let i=0; i<2; i++){
            let u_res = gl.getUniformLocation(program, `u_res${i}`)
            u_ress.push(u_res)
        }

        let vao = gl.createVertexArray()
        gl.bindVertexArray(vao)

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

        gl.canvas.width = imgs[0].width
        gl.canvas.height = imgs[0].height

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.useProgram(program)
        gl.bindVertexArray(vao)
        gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height)
        for (let i = 0; i < 2; i++) {
            gl.uniform1i(u_texs[i], i)
        }
        for(let i=0; i<2;i++){
            gl.uniform2f(u_ress[i],1.0 / imgs[i].width,1.0/imgs[i].height)
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            0, 0,
            imgs[0].width, 0,
            0, imgs[0].height,
            0, imgs[0].height,
            imgs[0].width, 0,
            imgs[0].width, imgs[0].height
        ]), gl.STATIC_DRAW)

        gl.drawArrays(gl.TRIANGLES, 0, 6)

        console.log(this.getResult(gl,imgs[0]))

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

            uniform vec2 u_res0;
            uniform vec2 u_res1;

            in vec2 v_texCoord;
            
            out vec4 outColor;
            
            void main() {

                vec3 ST_sum = vec3(float(0));
                vec3 S_sum = vec3(float(0));
                vec3 S_sqsum = vec3(float(0));
                vec3 T_sum = vec3(float(0));
                vec3 T_sqsum = vec3(float(0));

                for(int y=0; y<=29; y++){
                    for(int x=0; x<=111; x++){
                        vec2 Td = vec2(float(x),float(y)) * u_res1;
                        vec4 T = texture(u_tex1, Td);
                        vec2 Sd = vec2(float(x),float(y)) * u_res0;
                        vec4 S = texture(u_tex0, v_texCoord + Sd);

                        ST_sum += S.rgb * T.rgb;
                        S_sum += S.rgb;
                        S_sqsum += S.rgb * S.rgb;
                        T_sum += T.rgb;
                        T_sqsum += T.rgb * T.rgb;
                    }
                }

                float area = 29.0 * 111.0;
                vec3 result = (ST_sum * area - S_sum * T_sum) / sqrt((T_sqsum * area - T_sum * T_sum) * (S_sqsum * area - S_sum * S_sum));
                vec3 y = vec3(0.29889531,0.58662247,0.11448223);
                vec3 i = vec3(0.59597799,0.27417610,0.32180189);
                vec3 q = vec3(0.21147017,0.52261711,0.31114694);
                float toy = result.r*y.r + result.g*y.g + result.b*y.b;
                float toi = result.r*i.r + result.g*i.g + result.b*i.b;
                float toq = result.r*q.r + result.g*q.g + result.b*q.b;

                outColor = vec4(vec3((toy + toi + toq) / 3.0),1);
            }`

        return {vertex,fragment}
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

    loadSrc = (src) => new Promise(async res => {
        let img = await fetch(src)
            .then(res => res.blob())
            .then(blob => createImageBitmap(blob))
        let canvas = new OffscreenCanvas(img.width, img.height)
        let context = canvas.getContext('2d')
        context.drawImage(img, 0, 0, img.width, img.height)
        let data = context.getImageData(0, 0, img.width, img.height)
        res(data)
    })

    getResult = (gl,img) => {
        let canvas = new OffscreenCanvas(img.width, img.height)
        canvas.width = img.width
        canvas.height = img.height
        let context = canvas.getContext('2d')
        context.drawImage(gl.canvas, 0, 0, img.width, img.height)
        let data = context.getImageData(0, 0, img.width, img.height)
        return data
    }
}