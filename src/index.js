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

class MainViewModel {
	constructor() {
		this.title = wx.property("")
		this.panes = wx.list()
		this.panes.push({name: 'navi', klass: 'pane-sm'})
	}
}

wx.app.defaultExceptionHandler = new Rx.Subject()
wx.app.defaultExceptionHandler.subscribe((err) => {
	console.error(err)
})

let mainViewModel = new MainViewModel()

wx.applyBindings(mainViewModel)

