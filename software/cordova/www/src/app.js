
if (bluetoothSerial.register) bluetoothSerial.register(function (buf) {
	if (!buf) return;
	if (!buf.input) return;
	console.log("Received: " + buf.input);
	if (buf.input.match(/MEAS/)) {
		buf.output = 
		'MEAS,6500000,7500000,7812,10\n' + 
		'GOT: MEAS,6500000,7500000,7812,10\n' + 
		'<MEAS>,6500000,36964,39462,36246\n' + 
		'<MEAS>,6507812,37130,39462,36271\n' + 
		'<MEAS>,6515624,37092,39462,36271\n' + 
		'<MEAS>,6523436,37104,39462,36259\n' + 
		'<MEAS>,6531248,37111,39423,36252\n' + 
		'<MEAS>,6539060,37111,39430,36252\n' + 
		'<MEAS>,6546872,37092,39417,36227\n' + 
		'<MEAS>,6554684,37092,39398,36227\n' + 
		'<MEAS>,6562496,37092,39398,36252\n' + 
		'<MEAS>,6570308,37092,39385,36233\n' + 
		'<MEAS>,6578120,37092,39398,36239\n' + 
		'<MEAS>,6585932,37092,39372,36227\n' + 
		'<MEAS>,6593744,37098,39353,36214\n' + 
		'<MEAS>,6601556,37092,39334,36220\n' + 
		'<MEAS>,6609368,37092,39334,36195\n' + 
		'<MEAS>,6617180,37092,39302,36207\n' + 
		'<MEAS>,6624992,37092,39276,36195\n' + 
		'<MEAS>,6632804,37092,39289,36182\n' + 
		'<MEAS>,6640616,37085,39270,36175\n' + 
		'<MEAS>,6648428,37079,39270,36156\n' + 
		'<MEAS>,6656240,37092,39263,36163\n' + 
		'<MEAS>,6664052,37060,39238,36182\n' + 
		'<MEAS>,6671864,37092,39225,36163\n' + 
		'<MEAS>,6679676,37066,39186,36143\n' + 
		'<MEAS>,6687488,37047,39180,36131\n' + 
		'<MEAS>,6695300,37053,39142,36131\n' + 
		'<MEAS>,6703112,37047,39142,36118\n' + 
		'<MEAS>,6710924,37034,39142,36099\n' + 
		'<MEAS>,6718736,37053,39078,36079\n' + 
		'<MEAS>,6726548,37040,39097,36092\n' + 
		'<MEAS>,6734360,37034,39078,36079\n' + 
		'<MEAS>,6742172,37060,39052,36060\n' + 
		'<MEAS>,6749984,37021,39007,36079\n' + 
		'<MEAS>,6757796,37028,39014,36060\n' + 
		'<MEAS>,6765608,37028,38994,36028\n' + 
		'<MEAS>,6773420,37008,38975,36015\n' + 
		'<MEAS>,6781232,37015,38950,36003\n' + 
		'<MEAS>,6789044,37008,38950,35983\n' + 
		'<MEAS>,6796856,37002,38885,35971\n' + 
		'<MEAS>,6804668,36983,38885,35958\n' + 
		'<MEAS>,6812480,36970,38821,35945\n' + 
		'<MEAS>,6820292,36976,38821,35945\n' + 
		'<MEAS>,6828104,36964,38757,35894\n' + 
		'<MEAS>,6835916,36964,38712,35881\n' + 
		'<MEAS>,6843728,36957,38693,35842\n' + 
		'<MEAS>,6851540,36964,38629,35823\n' + 
		'<MEAS>,6859352,36964,38584,35797\n' + 
		'<MEAS>,6867164,36944,38565,35752\n' + 
		'<MEAS>,6874976,36951,38501,35739\n' + 
		'<MEAS>,6882788,36906,38443,35682\n' + 
		'<MEAS>,6890600,36925,38373,35624\n' + 
		'<MEAS>,6898412,36900,38321,35566\n' + 
		'<MEAS>,6906224,36893,38245,35502\n' + 
		'<MEAS>,6914036,36900,38168,35451\n' + 
		'<MEAS>,6921848,36887,38059,35349\n' + 
		'<MEAS>,6929660,36900,37989,35266\n' + 
		'<MEAS>,6937472,36867,37873,35157\n' + 
		'<MEAS>,6945284,36848,37776,35016\n' + 
		'<MEAS>,6953096,36835,37616,34843\n' + 
		'<MEAS>,6960908,36815,37476,34637\n' + 
		'<MEAS>,6968720,36828,37309,34413\n' + 
		'<MEAS>,6976532,36771,37143,34093\n' + 
		'<MEAS>,6984344,36783,36970,33715\n' + 
		'<MEAS>,6992156,36771,36771,33190\n' + 
		'<MEAS>,6999968,36764,36623,32530\n' + 
		'<MEAS>,7007780,36764,36521,31614\n' + 
		'<MEAS>,7015592,36745,36521,30409\n' + 
		'<MEAS>,7023404,36764,36630,28609\n' + 
		'<MEAS>,7031216,36719,36828,25823\n' + 
		'<MEAS>,7039028,36758,37117,25746\n' + 
		'<MEAS>,7046840,36783,37418,28622\n' + 
		'<MEAS>,7054652,36835,37732,30531\n' + 
		'<MEAS>,7062464,36887,38053,31813\n' + 
		'<MEAS>,7070276,36900,38302,32761\n' + 
		'<MEAS>,7078088,36964,38501,33510\n' + 
		'<MEAS>,7085900,36964,38680,34049\n' + 
		'<MEAS>,7093712,36970,38814,34503\n' + 
		'<MEAS>,7101524,37015,38950,34817\n' + 
		'<MEAS>,7109336,37021,39014,35074\n' + 
		'<MEAS>,7117148,37028,39078,35266\n' + 
		'<MEAS>,7124960,37028,39142,35451\n' + 
		'<MEAS>,7132772,37034,39142,35579\n' + 
		'<MEAS>,7140584,37028,39148,35694\n' + 
		'<MEAS>,7148396,37028,39180,35778\n' + 
		'<MEAS>,7156208,37028,39186,35849\n' + 
		'<MEAS>,7164020,37028,39142,35894\n' + 
		'<MEAS>,7171832,37028,39154,35926\n' + 
		'<MEAS>,7179644,37028,39142,35964\n' + 
		'<MEAS>,7187456,37028,39174,36022\n' + 
		'<MEAS>,7195268,37028,39142,36022\n' + 
		'<MEAS>,7203080,37015,39110,36047\n' + 
		'<MEAS>,7210892,36989,39078,36079\n' + 
		'<MEAS>,7218704,36976,39071,36073\n' + 
		'<MEAS>,7226516,36964,39078,36086\n' + 
		'<MEAS>,7234328,36964,39014,36086\n' + 
		'<MEAS>,7242140,36989,39014,36105\n' + 
		'<MEAS>,7249952,36964,39014,36099\n' + 
		'<MEAS>,7257764,36976,38975,36137\n' + 
		'<MEAS>,7265576,36964,38950,36137\n' + 
		'<MEAS>,7273388,36964,38911,36099\n' + 
		'<MEAS>,7281200,36964,38904,36099\n' + 
		'<MEAS>,7289012,36951,38885,36092\n' + 
		'<MEAS>,7296824,36957,38846,36111\n' + 
		'<MEAS>,7304636,36932,38821,36099\n' + 
		'<MEAS>,7312448,36964,38821,36086\n' + 
		'<MEAS>,7320260,36938,38795,36105\n' + 
		'<MEAS>,7328072,36906,38757,36086\n' + 
		'<MEAS>,7335884,36912,38757,36092\n' + 
		'<MEAS>,7343696,36900,38744,36086\n' + 
		'<MEAS>,7351508,36912,38693,36099\n' + 
		'<MEAS>,7359320,36900,38693,36079\n' + 
		'<MEAS>,7367132,36900,38648,36073\n' + 
		'<MEAS>,7374944,36899,38629,36092\n' + 
		'<MEAS>,7382756,36887,38629,36079\n' + 
		'<MEAS>,7390568,36900,38597,36073\n' + 
		'<MEAS>,7398380,36874,38565,36067\n' + 
		'<MEAS>,7406192,36900,38552,36067\n' + 
		'<MEAS>,7414004,36899,38539,36079\n' + 
		'<MEAS>,7421816,36867,38507,36054\n' + 
		'<MEAS>,7429628,36900,38481,36067\n' + 
		'<MEAS>,7437440,36887,38443,36041\n' + 
		'<MEAS>,7445252,36887,38449,36041\n' + 
		'<MEAS>,7453064,36861,38424,36041\n' + 
		'<MEAS>,7460876,36861,38424,36022\n' + 
		'<MEAS>,7468688,36848,38373,36035\n' + 
		'<MEAS>,7476500,36835,38373,36028\n' + 
		'<MEAS>,7484312,36841,38309,36035\n' + 
		'<MEAS>,7492124,36835,38309,36028\n' + 
		'<MEAS>,7499936,36796,38289,35996\n' + 
		'<MEAS>,END\n';
	}
	buf.input = ""; // clear input
});

Polymer({
	is: "my-app",

	properties: {
		deviceready : {
			type: Boolean,
			value: false
		},

		config : {
			type: Object,
			value: null
		},

		isConnected: {
			type: Boolean,
			value: false
		},

		selectedMenu: {
			type: Number,
			value: 0
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
	},

	attached : function () {
		this.async(() => {
			bluetoothSerial.list( (list) => {
				console.log(list);
			}, (error) => {
				console.log(error);
			});

			console.log('connecting...');
			bluetoothSerial.connect("00:06:66:6C:68:BF", () => {
				console.log('connected');
				this.set('isConnected', true);

				var start = 6.5e6;
				var stop  = 7.5e6;
				var step  = 7812;
				this.measure(start, stop, step);

			}, (error) => {
				console.log(error);
			});
		}, false);
	},

	doScan : function (start, stop, step, callback) {
		var command = ['MEAS', start.toFixed(0), stop.toFixed(0), step.toFixed(0), 3].join(',') + '\n';

		bluetoothSerial.clear(() => {}, () => {});
		bluetoothSerial.subscribe('\n', (data) => {
			console.log('recv', data);
			if (data.match(/^<MEAS>/)) {
				var tokens = data.replace(/\n/, '').split(/,/);
				if (tokens[1] === 'END') {
					bluetoothSerial.unsubscribe();
					return;
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
			console.log(error);
		});

		bluetoothSerial.write(command, () => {
			console.log('wrote');
		}, (error) => {
			console.log(error);
		});
	},

	measure : function (start, stop, step) {
		console.log('measure', start, stop, step);
		var canvas = this.$.canvas;
		canvas.width  = canvas.offsetWidth * window.devicePixelRatio;
		canvas.height = canvas.offsetHeight * window.devicePixelRatio;
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

		var width  = canvas.width / window.devicePixelRatio;
		var height = canvas.height / window.devicePixelRatio;

		var X = function (x) { return (x - start) / (stop - start) * width };
		var Y = function (y) { return y * height };

		var reco = function (vswr) { return (vswr - 1) / (vswr + 1) };
		var vswr = function (reco) { return (1 + reco) / (1 - reco) };
		var vswrY = function (data) {
			return Y(1 - data.RECO / reco(VSWR_MAX));
		};

		var VSWR_MAX = 10;
		var IMP_MAX = 200;

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

		ctx.fillStyle = "#333";
		ctx.fillRect(X(start), Y(1 - 50 / IMP_MAX), width, 1);
		ctx.fillText("50", X(start) + 10, Y(1 - 50 / IMP_MAX) );

		ctx.fillStyle = "#666";
		ctx.fillRect(X(start),  vswrY({ RECO : reco(1.2) }), width, 1);
		ctx.fillText("1.2", X(stop) - 50, vswrY({ RECO : reco(1.2) }));
		ctx.fillRect(X(start),  vswrY({ RECO : reco(1.5) }), width, 1);
		ctx.fillText("1.5", X(stop) - 50, vswrY({ RECO : reco(1.5) }));
		ctx.fillRect(X(start),  vswrY({ RECO : reco(2) }), width, 1);
		ctx.fillText("2", X(stop) - 50, vswrY({ RECO : reco(2) }));
		ctx.fillRect(X(start),  vswrY({ RECO : reco(3) }), width, 1);
		ctx.fillText("3", X(stop) - 50, vswrY({ RECO : reco(3) }));
		ctx.fillRect(X(start),  vswrY({ RECO : reco(5) }), width, 1);
		ctx.fillText("5", X(stop) - 50, vswrY({ RECO : reco(5) }));

		ctx.lineWidth = 3;
		var prev;
		this.doScan(start, stop, step, (data) => {
			console.log(data);
			if (!prev) {
				prev = data;
				return;
			}

			ctx.strokeStyle = "#B32034";
			ctx.beginPath();
			ctx.moveTo(X(prev.freq), vswrY(prev));
			ctx.lineTo(X(data.freq), vswrY(data));
			ctx.stroke();

			ctx.strokeStyle = "#D59B0A";
			ctx.beginPath();
			ctx.moveTo(X(prev.freq), Y(1 - prev.R / IMP_MAX));
			ctx.lineTo(X(data.freq), Y(1 - data.R / IMP_MAX));
			ctx.stroke();

			ctx.strokeStyle = "#006EA5";
			ctx.beginPath();
			ctx.moveTo(X(prev.freq), Y(1 - prev.X / IMP_MAX));
			ctx.lineTo(X(data.freq), Y(1 - data.X / IMP_MAX));
			ctx.stroke();

			prev = data;
		});
	},

	_settingsChanged : function (change) {
		var self = this;
		// console.log('_settingsChanged', change);
		if (change.path.indexOf('settings.grblServer') === 0) {
			console.log('settings.grblServer is changed. close and reconnect');
			self.connection.close();
		}
	},

	bandSelect : function (e) {
		var target = Polymer.dom(e).path.filter(function (i) {
			return i.getAttribute && i.getAttribute('data-start');
		})[0];
		var start = +target.getAttribute('data-start');
		var stop = +target.getAttribute('data-stop');
		var step = (stop - start) / this.resolution;
		this.measure(start, stop, step);

	},

	bind: function (id) { return id },
	equals: function (a, b) { return a === b },
	conditional: function (bool, a, b) { return bool ? a : b; }
});
