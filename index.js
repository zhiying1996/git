/*
 * @Author: your name
 * @Date: 2020-09-18 16:50:29
 * @LastEditTime: 2020-09-19 10:54:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \新建文件夹\index.js
 */
const http = require('http'),
	fs = require('fs'),
	url = require('url'),
	path = require('path'),
	proxy = require('http-proxy')
const port = process.env.PORT || 3000
let proxyServer = proxy.createProxyServer()
const server = http.createServer((req, res) => {
	// 获取解析后的url对象
	res.setHeader('access-control-allow-origin', '*')
	res.setHeader('access-control-allow-headers', '*')
	res.setHeader('access-control-allow-methods', '*')
	try {
		const pathObj = url.parse(req.url, true)
		// 后台api
		console.log(pathObj, 'pathObj')
		if (/^\/api/.test(pathObj.pathname)) {
			try {
				proxyServer.web(req, res, { target: 'http://10.2.1.50:8015' })
			} catch (err) {
				console.log(err)
			}
			return
		}
		// 资源路径
		if (pathObj.path === '/') {
			pathObj.path = '/index.html'
		}
		const filePath = path.join(__dirname, pathObj.path)
		console.log(filePath)
		fs.readFile(filePath, (err, file) => {
			if (err) {
				console.error('404', err)
				res.end('<h1>404 not found</h1>')
			} else {
				console.log('success')
				// 二进制
				res.write(file, 'binary')
				res.end()
			}
		})
	} catch (err) {
		console.log(err)
	}
})

server.listen(port)
console.log(`server start on: http://127.0.0.1:${port}`)
