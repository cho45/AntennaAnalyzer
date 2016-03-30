
Polymer({
	is: "my-app",

	properties: {
		deviceready : {
			type: Boolean,
			value: false
		},

		status : {
			type: Object,
			value: {
				bluetooth: 'notconfigured',
				measure: 'ready'
			}
		},

		config : {
			type: Object,
			value: null
		},

		bluetoothList : {
			type: Array,
			value: []
		},

		selectedMenu: {
			type: String,
			value: "measure"
		},

		commandTab: {
			type: Number,
			value: 0
		},

		settingsTab: {
			type: Number,
			value: 0
		},

		resolution : {
			type: Number,
			value: 256
		},

		bands : {
			type: Array,
			value: [
				{ name : "1.9MHz", start: 1810e3, stop: 1912.5e3 },
				{ name: "3.5MHz", start: 3500e3, stop: 3687e3 },
				{ name: "3.8MHz", start: 3702e3, stop: 3805e3 },
				{ name: "7MHz", start: 7000e3, stop: 7200e3 },
				{ name: "10MHz", start: 10100e3, stop: 10150e3 },
				{ name: "14MHz", start: 14000e3, stop: 14350e3 },
				{ name: "18MHz", start: 18068e3, stop: 18168e3 },
				{ name: "21MHz", start: 21000e3, stop: 21450e3 },
				{ name: "24MHz", start: 24890e3, stop: 24990e3 },
				{ name: "28MHz", start: 28.00e6, stop: 29.70e6 },
				{ name: "50MHz", start: 50.00e6, stop: 54.00e6 },
				{ name: "All"  , start: 10e3, stop: 70e6 }
			]
		},

		currentRanges : {
			type: Array,
			value: [
			]
		},

		settings : {
			type: Object
		}
	},

	observers: [
		'_settingsChanged(settings.*)'
	],

	created: function () {
		document.addEventListener('deviceready', () => {
			console.log('deviceready');
		});
	},

	ready : function () {
		this.set('selectedMenu', location.hash.substring(1) || 'measure');
		this.$.mainMenu.addEventListener('iron-select', (e) => {
			console.log('iron-items.changed');
			this.$.drawerPanel.closeDrawer();
		});
		// this.openDialog(this.$.inputRange);
	},

	attached : function () {
		this.async(() => {
			this.updateBluetoothList();
			this.connectBluetooth();
		}, false);

		window.addEventListener('orientationchange', () => {
			console.log('orientationchange');
			for (var i = 0, it; (it = this.currentRanges[i]); i++) {
				this.redrawGraph(it);
			}
		});
	},

	updateBluetoothList : function () {
		bluetoothSerial.list( (list) => {
			console.log('bluetoothList', list);
			this.set('bluetoothList', list);
		}, (error) => {
			alert(error);
		});
	},

	connectBluetooth : function () {
		this.set('status.bluetooth', 'connecting');
		if (!this.settings.bluetooth.id) {
			console.log('bluetooth setting is nothing');
			this.set('status.bluetooth', 'notconfigured');
			this.set('selectedMenu', "settings");
			return;
		}
		console.log('connecting...');
		// bluetoothSerial.disconnect();
		bluetoothSerial.connect(this.settings.bluetooth.id, () => {
			console.log('connected');
			this.set('status.bluetooth', 'connected');

			this.push('currentRanges', {
				start : 6.5e6,
				stop  : 7.5e6,
				step  : 7812,
				lastData: [],
				canvas: this.$.canvas
			});

			// this.measureAllRanges();

		}, (error) => {
			this.set('status.bluetooth', 'error');
			this.set('status.bluetooth_error', error);
			console.log(error);
			alert(error);
			setTimeout(() => {
				this.connectBluetooth();
			}, 1000);
		});
	},

	measureAllRanges : function () {
		return this.currentRanges.reduce( (r, i) => {
			return r.then( () => {
				return this.measureRange(i);
			});
		}, Promise.resolve());
	},

	measureRange : function (range) {
		range.lastData = [];
		this.set('status.measure', 'start');
		this.set('status.measure_progress', '0%');
		return this._doScan(range.start, range.stop, range.step, (data) => {
			var percent = (data.freq - range.start) / (range.stop - range.start);
			this.set('status.measure', 'progress');
			this.set('status.measure_progress', (percent * 100).toFixed(0) + '%');
			range.lastData.push(data);
			this.redrawGraph(range);
		}).
		then( () => {
			this.set('status.measure', 'ready');
		});
	},

	redrawGraph : function (range) {
		var canvas = range.canvas;
		var start = range.start;
		var stop = range.stop;
		var step = range.step;

		canvas.width  = canvas.offsetWidth * window.devicePixelRatio;
		canvas.height = canvas.offsetHeight * window.devicePixelRatio;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

		var VSWR_MAX = 20;
		var IMP_MAX = 200;

		var width  = canvas.width / window.devicePixelRatio;
		var height = canvas.height / window.devicePixelRatio;

		var X = function (x) { return (x - start) / (stop - start) * width };
		var Y = function (y) { return y * height };

		var reco = function (vswr) { return (vswr - 1) / (vswr + 1) };
		var vswr = function (reco) { return (1 + reco) / (1 - reco) };
		var vswrY = function (data) {
			return Y(1 - data.RECO / reco(VSWR_MAX));
		};
		var impY = function (imp) {
			return Y(1 - imp / IMP_MAX);
		};

		ctx.font = "bold 15pt 'Roboto', 'Noto', sans-serif";

		ctx.fillStyle = "#ccc";
		ctx.textAlign = 'left';
		ctx.fillText(start / 1000, X(start) + 1, 20);
		ctx.textAlign = 'right';
		ctx.fillText(stop / 1000, X(stop) - 1, 20);
		var center = start + (stop - start) / 2;
		ctx.textAlign = 'center';
		ctx.fillText(center / 1000, X(center), 20);
		ctx.fillRect(X(center), 0, 1, height);

		ctx.textAlign = 'left';
		ctx.fillStyle = "#660B11";
		ctx.fillRect(X(start),  vswrY({ RECO : reco(1.5) }), width, 1);
		ctx.fillText("1.5", X(start) + 10, vswrY({ RECO : reco(1.5) }));
		ctx.fillRect(X(start),  vswrY({ RECO : reco(2) }), width, 1);
		ctx.fillText("2", X(start) + 10, vswrY({ RECO : reco(2) }));
		ctx.fillRect(X(start),  vswrY({ RECO : reco(3) }), width, 1);
		ctx.fillText("3", X(start) + 10, vswrY({ RECO : reco(3) }));
		ctx.fillRect(X(start),  vswrY({ RECO : reco(5) }), width, 1);
		ctx.fillText("5", X(start) + 10, vswrY({ RECO : reco(5) }));

		ctx.textAlign = 'right';
		ctx.fillStyle = "#473403";
		ctx.fillRect(X(start), impY(50), width, 1);
		ctx.fillText("50", X(stop) - 10, impY(50) );
		ctx.fillRect(X(start), impY(100), width, 1);
		ctx.fillText("100", X(stop) - 10, impY(100) );

		ctx.lineWidth = 3;

		var prev, curr;
		for (var i = 0, curr; (curr = range.lastData[i]); i++) {
			if (!prev) {
				prev = curr;
				continue;
			}

			ctx.strokeStyle = "#B32034";
			ctx.beginPath();
			ctx.moveTo(X(prev.freq), vswrY(prev));
			ctx.lineTo(X(curr.freq), vswrY(curr));
			ctx.stroke();

			ctx.strokeStyle = "#D59B0A";
			ctx.beginPath();
			ctx.moveTo(X(prev.freq), Y(1 - prev.R / IMP_MAX));
			ctx.lineTo(X(curr.freq), Y(1 - curr.R / IMP_MAX));
			ctx.stroke();

			ctx.strokeStyle = "#006EA5";
			ctx.beginPath();
			ctx.moveTo(X(prev.freq), Y(1 - prev.X / IMP_MAX));
			ctx.lineTo(X(curr.freq), Y(1 - curr.X / IMP_MAX));
			ctx.stroke();

			prev = curr;
		}
	},

	_doScan : function (start, stop, step, callback) {
		return new Promise( (resolve, reject) => {
			var command = ['MEAS', start.toFixed(0), stop.toFixed(0), step.toFixed(0), 3].join(',') + '\n';

			bluetoothSerial.clear(() => {}, () => {});
			bluetoothSerial.subscribe('\n', (data) => {
				console.log('recv', data);
				if (data.match(/^MEAS,/)) {
					var tokens = data.replace(/\n/, '').split(/,/);
					start = +tokens[1];
					stop  = +tokens[2];
					step  = +tokens[3];
				} else
				if (data.match(/^<MEAS>/)) {
					var tokens = data.replace(/\n/, '').split(/,/);
					if (tokens[1] === 'END') {
						bluetoothSerial.unsubscribe();
						resolve();
					}

					const Z_0 = 50;
					const ADC_RESOLUTION = 16; // bit
					const ADC_REFERENCE = 3300; // mV
					const AD8307_SLOPE = 25;

					var freq = +tokens[1];
					var ref_dB  = +tokens[2] / (1<<ADC_RESOLUTION) * ADC_REFERENCE / AD8307_SLOPE;
					var load_dB = +tokens[3] / (1<<ADC_RESOLUTION) * ADC_REFERENCE / AD8307_SLOPE;
					var diff_dB = +tokens[4] / (1<<ADC_RESOLUTION) * ADC_REFERENCE / AD8307_SLOPE;
					// console.log('dB', freq, ref_dB, load_dB, diff_dB);

					// normalize (load/diff dB is now relative to ref dB)
					load_dB = load_dB - ref_dB
					diff_dB = diff_dB - ref_dB

					// antilog
					var load = Math.pow(10, load_dB / 10)
					var diff = Math.pow(10, diff_dB / 10)

					// normalized diff is refrection coefficiant
					var reco = Math.sqrt(Math.abs(diff));
					var vswr = Infinity;
					try {
						vswr = (1 + reco) / (1 - reco);
					} catch (e) {
						// ignore zero division
					}

					var f = Math.abs(2 - load + 2 * diff)
					var r = ((1 - diff) * Z_0) / f
					var z = Math.sqrt(load) * Z_0 / Math.sqrt(f)
					var x = Math.sqrt(Math.abs(z * z - r * r))

					callback({
						freq: freq,
						R : r,
						X : x,
						Z : z,
						RECO : reco,
						VSWR : vswr
					});
				}
			}, (error) => {
				reject(error);
			});

			bluetoothSerial.write(command, () => {
				console.log('wrote');
			}, (error) => {
				reject(error);
			});
		});
	},

	_settingsChanged : function (change) {
		console.log('_settingsChanged', change);
		if (change.path.indexOf('settings.bluetooth') === 0) {
			console.log('bluetooth is changed reconnect');
			this.connectBluetooth();
		}
	},

	openDialog : function (dialog) {
		dialog.open();
		dialog.style.visibility = 'hidden';
		this.async( () => {
			dialog.refit();
			dialog.style.visibility = 'visible';
		}, 10);
	},

	initializeDefaultSettings : function () {
		this.settings = {
			bluetooth : {
				id: null,
				name: null
			}
		};
	},

	rangeWiden : function (e) {
		var rangeIndex = +this.getDataArgFromEvent(e, 'data-range-index');
		console.log(rangeIndex);

		var range = this.currentRanges[rangeIndex];

		var freqRange = range.stop - range.start;
		var center    = range.start + (freqRange / 2);
		var newRange  = freqRange * 2;

		var newStart = center - (newRange / 2);
		var newStop  = center + (newRange / 2);

		this.setRange(rangeIndex, newStart, newStop);
	},

	rangeNarrow : function (e) {
		var rangeIndex = +this.getDataArgFromEvent(e, 'data-range-index');
		console.log(rangeIndex);

		var range = this.currentRanges[rangeIndex];

		var freqRange = range.stop - range.start;
		var center    = range.start + (freqRange / 2);
		var newRange  = freqRange / 2;

		var newStart = center - (newRange / 2);
		var newStop  = center + (newRange / 2);

		this.setRange(rangeIndex, newStart, newStop);
	},

	setPreset : function (e) {
		var rangeIndex = +this.getDataArgFromEvent(e, 'data-range-index');
		var newStart = +this.getDataArgFromEvent(e, "data-start");
		var newStop  = +this.getDataArgFromEvent(e, "data-stop");
		this.setRange(rangeIndex, newStart, newStop);
	},

	okRanges : function (e) {
		this.set('selectedMenu', "measure");
		this.measureAllRanges();
	},

	setRange : function (rangeIndex, newStart, newStop, newStep) {
		if (newStart < 0) {
			newStart = 0;
		}
		if (newStop > 70e6) {
			newStop = 70e6;
		}

		var newRange = newStop - newStart;
		if (!newStep) {
			newStep  = newRange / this.resolution;
		}
		this.set('currentRanges.' + rangeIndex + '.start', newStart);
		this.set('currentRanges.' + rangeIndex + '.stop', newStop);
		this.set('currentRanges.' + rangeIndex + '.step', newStep);
	},

	setBluetoothDevice : function (e) {
		var id = this.getDataArgFromEvent(e, 'data-id');
		var name = this.getDataArgFromEvent(e, 'data-name');
		if (id && confirm("Connecting to " + name + "?")) {
			this.set('settings.bluetooth', {
				id : id,
				name: name
			});
			this.set('selectedMenu', "measure");
		}
		e.preventDefault();
	},

	getDataArgFromEvent : function (e, name) {
		var target = Polymer.dom(e).path.filter(function (i) {
			return i.getAttribute && i.getAttribute(name);
		})[0];
		if (!target) {
			return null;
		}
		return target.getAttribute(name);
	},

	bluetoothStatusIcon : function (status) {
		switch (status) {
		case 'connecting' : return 'device:bluetooth-searching';
		case 'notconfigured' : return 'device:bluetooth-disabled';
		case 'connected' : return 'device:bluetooth-connected';
		case 'error' : return 'device:bluetooth-disabled';
		default : return 'device:bluetooth-disabled';
		}
	},

	bind: function (id) { return id },
	equals: function (a, b) { return a === b },
	conditional: function (bool, a, b) { return bool ? a : b; }
});
