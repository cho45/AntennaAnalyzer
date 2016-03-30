#!/usr/bin/env ruby

require 'serialport'

begin
	@port = SerialPort.new(
		"/dev/tty.usbserial-A500YQPG",
		# "/dev/tty.RNBT-68BF-RNI-SPP",
		115200,
		8,
		1,
		0
	)
rescue Errno::EBUSY
	sleep 1
	retry
end

if true
	@port.rts = 0
	@port.dtr = 0
	@port.dtr = 1
	@port.dtr = 0
	@port.sync = true

	warn "waiting init"
	# wait init
	@port.gets
end

if false
	@port << "OSC,ON,7100000\n"
	puts @port.readpartial(4096)
	exit
end

bands = {
	"1.9MHz" => [1810e3, 1912.5e3],
	"3.5MHz" => [3500e3, 3687e3],
	"3.8MHz" => [3702e3, 3805e3],
	"7MHz" => [7000e3, 7200e3],
	"10MHz" => [10100e3, 10150e3],
	"14MHz" => [14000e3, 14350e3],
	"18MHz" => [18068e3, 18168e3],
	"21MHz" => [21000e3, 21450e3],
	"24MHz" => [24890e3, 24990e3],
	"28MHz" => [28.00e6, 29.70e6],
	"50MHz" => [50.00e6, 54.00e6],
	"All"   => [10e3, 70e6],
}

band = bands["7MHz"]
start = band[0]
stop  = band[1]

#start = 6.5e6
#stop  = 7.5e6

#center = 19995e3
#start = center - 3000
#stop  = center + 3000

step  = (stop - start) / 128
avg_count = 10

command = "MEAS,%d,%d,%d,%d\n" % [start, stop, step, avg_count]
time = Time.now
@port << command
#sleep 2
#@port << "MEAS,END\n"

data = ""
while got = @port.gets
	warn got
	case got
	when /^<MEAS>,END/
		break
	when /^<MEAS>,/
		data << got
	end
end

elapsed = (Time.now - time) * 1000
warn "%d sec elapsed" % elapsed

def Math.pow(a, b)
	a ** b
end

# Z_0 = 45
Z_0 = 50
AVG = 1
measures = {
	ref: [],
	load: [],
	diff: [],
}
data.split(/\n/).each do |line|
	_, freq, ref_dB, load_dB, diff_dB = line.split(/,/).map {|i|
		i.to_f
	}
	measures[:ref]  << ref_dB
	measures[:load] << load_dB
	measures[:diff] << diff_dB
	ref_dB  = measures[:ref].last(AVG).instance_eval {|l| l.reduce {|r,i| r + i} / l.size }
	load_dB = measures[:load].last(AVG).instance_eval {|l| l.reduce {|r,i| r + i} / l.size }
	diff_dB = measures[:diff].last(AVG).instance_eval {|l| l.reduce {|r,i| r + i} / l.size }

	# ADC value to mV
	ref_dB   = ref_dB  / (1<<16) * 3300
	load_dB  = load_dB / (1<<16) * 3300
	diff_dB  = diff_dB / (1<<16) * 3300

	# 25mV/dB slope
	ref_dB   = ref_dB  / 25
	load_dB  = load_dB / 25
	diff_dB  = diff_dB / 25

	# normalize (load/diff dB is now relative to ref dB)
	load_dB = load_dB - ref_dB
	diff_dB = diff_dB - ref_dB

	# antilog
	load = Math.pow(10, load_dB / 10)
	diff = Math.pow(10, diff_dB / 10)

	# normalized diff is refrection coefficiant
	reco = Math.sqrt(diff.abs)
	vswr = (1 + reco) / (1 - reco) rescue Float::INFINITY

	f = (2 - load + 2 * diff).abs
	r = ((1 - diff) * Z_0) / f
	z = Math.sqrt(load) * Z_0 / Math.sqrt(f)
	x = Math.sqrt((z * z - r * r).abs)

	puts "#{{freq: freq, r: r.abs, x: x.abs, z: z, vswr: vswr}.values.join("\t")}"
end



