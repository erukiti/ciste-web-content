/*
Copyright 2016 SASAKI, Shunsuke. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

"use strict"

console.dir(location.hash)

// const assert = require('power-assert')
window.Rx = require('rx')
window.wx = require('webrx')

require('./index.scss')
require('../vendor/photon/sass/photon.scss')
require('../vendor/Font-Awesome/scss/font-awesome.scss')

const conf = require('../package.json')
console.dir(conf)

wx.app.component('navi', {
	viewModel: require('./component/navi.js'),
	template: require('./component/navi.html')
})
wx.app.component('ref', {
	viewModel: require('./component/ref.js'),
	template: require('./component/ref.html')
})

class MainViewModel {
	constructor() {
		this.title = wx.property("")
		this.panes = wx.list()
		this.panes.push({name: 'navi', klass: 'pane-sm'})
		wx.messageBus.listen('change').subscribe((hash) => {
			if (location.hash != hash) {
				location.hash = hash
			}
			this.hashDecode()
		})
	}

	hashDecode() {
		let ar = location.hash.substr(1).split('/')
		console.log(ar.length)
		if (ar.length == 1) {
			if (ar[0].length == 40) {
				this.replacePane('ref', {'ref': ar[0]})
			} else if (ar[0] == 'admin') {
				console.log('mode: admin')
			} else if (ar[0] == 'settings') {
				console.log('mode: settings')
			} else if (ar[0].length == 0) {
				console.log('mode: dash board')
			} else {
				console.log(`mode: user ${ar[0]}`)
			}
		} else {
			console.log("mode: other")
		}
	}

	replacePane(name, opt) {
		if (this.panes.length == 2) {
			this.panes.removeAt(2)
		}
		this.panes.push({name: name, klass: 'pane', opt: opt})
	}
}

wx.app.defaultExceptionHandler = new Rx.Subject()
wx.app.defaultExceptionHandler.subscribe((err) => {
	console.error(err)
})

let mainViewModel = new MainViewModel()

wx.applyBindings(mainViewModel)

wx.messageBus.sendMessage(location.hash, 'change')
