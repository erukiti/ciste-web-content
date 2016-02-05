"use strict"

Rx = require('rx')
wx = require('webrx')

const ajax = require('ajax-promise')

class NaviViewModel {
	constructor(params) {
		console.dir(params)
		this.ref = wx.property(params.opt['ref'])
		this.output = wx.property('')
		this.successStatus = wx.property(0)

		this.successText = wx.whenAny(this.successStatus, (successStatus) => {
			switch (successStatus) {
			case 0:
				return "running..."
			case 1:
				return "success."
			case 2:
				return "failed."
			}
		}).toProperty()



		ajax.get(`http://localhost:3000/api/v1/box/${this.ref()}/status`)
			.then((status) => {
				if (status.success) {
					this.successStatus(1)
				} else {
					this.successStatus(2)
				}
			})
			.catch((err) => {
				console.dir(err)
			})

		ajax.get(`http://localhost:3000/api/v1/box/${this.ref()}/output`)
			.then((output) => {
				this.output(output.Output)
			})
			.catch((err) => {
				console.dir(err)
			})
	}
}

module.exports = NaviViewModel
