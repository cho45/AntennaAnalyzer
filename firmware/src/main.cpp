#include "mbed.h"
#include <CircularBuffer.h>
#include <stdint.h>
#include <inttypes.h>
#include "ad9851.hpp"

Serial serial(USBTX, USBRX);
AnalogIn battery(dp13);

AnalogIn adc(dp9);
DigitalOut sw_p_1(dp2);
DigitalOut sw_p_2(dp4);
DigitalOut sw_m_1(dp10);
DigitalOut sw_m_2(dp6);

struct measure_task_t {
	bool completed = 1;
	bool interrupted = 0;
	uint32_t start;
	uint32_t end;
	uint32_t step;
	uint8_t  avg_count;
};
volatile measure_task_t measure_task;

void process_serial();

// RFC = INM
// RF1 = BLN
// RF2 = GND
// V1 = SW-M-2
// V2 = SW-M-1
// V1=0 / V2=1 RF1
// V1=1 / V2=0 RF2
// SW-M-2=0 / SW-M-1=1 BLN
// SW-M-2=1 / SW-M-1=0 GND
inline void inm_bln() {
	sw_m_1 = 1;
	sw_m_2 = 0;
}

inline void inm_gnd() {
	sw_m_1 = 0;
	sw_m_2 = 1;
}

// RFC = INP
// RF1 = ANT
// RF2 = GND
// V1 = SW-P-2
// V2 = SW-P-1
// V1=0 / V2=1 RF1
// V1=1 / V2=0 RF2
inline void inp_ant() {
	sw_p_1 = 1;
	sw_p_2 = 0;
}

inline void inp_gnd() {
	sw_p_1 = 0;
	sw_p_2 = 1;
}

inline void switch_to_eref() {
	inp_gnd();
	inm_bln();
}
inline void switch_to_load() {
	inp_ant();
	inm_gnd();
}
inline void switch_to_diff() {
	inp_ant();
	inm_bln();
}


AD9851<30000000, true> ad9851(/*data*/dp26, /*fq_ud*/dp1, /*w_clk*/dp28, /*reset*/dp25);
CircularBuffer<char, 80> serial_buffer;

//constexpr const static double Z_0 = 50.0;
//void calculate_complex_impedance(
//	double ref_dB,
//	double load_dB,
//	double diff_dB,
//
//	double& r,
//	double& x,
//	double& z,
//	double& vswr
//) {
//
//	// normalize
//	load_dB = load_dB - ref_dB;
//	diff_dB = diff_dB - ref_dB;
//
//	// antilog
//	double load = pow(10, load_dB / 10);
//	double diff = pow(10, diff_dB / 10);
//
//	// normalized diff is refrection coefficiant
//	vswr = (1 + diff) / (1 - diff);
//
//	double f = (2-load+2*diff);
//	r = ((1-diff)*Z_0) / f;
//	z = sqrt(load)*Z_0/sqrt(f);
//	x = sqrt(z * z - r * r);
//}

constexpr uint16_t SETTLING_TIME = 500;
void measure() {
	uint32_t start    = measure_task.start;
	uint32_t end      = measure_task.end;
	uint32_t step     = measure_task.step;
	uint8_t avg_count = measure_task.avg_count;
	measure_task.interrupted = 0;

	// power on ad9851
	ad9851.reset();
	for (uint32_t freq = start; freq <= end; freq += step) {
		uint32_t e_ref = 0, e_load = 0, e_diff = 0;

		ad9851.set_frequency(freq);

		switch_to_eref();
		wait_us(SETTLING_TIME);
		for (int i = 0; i < avg_count; i++)
			e_ref += adc.read_u16();

		switch_to_load();
		wait_us(SETTLING_TIME);
		for (int i = 0; i < avg_count; i++)
			e_load += adc.read_u16();

		switch_to_diff();
		wait_us(SETTLING_TIME);
		for (int i = 0; i < avg_count; i++)
			e_diff += adc.read_u16();

		serial.printf("<MEAS>,%d,%d,%d,%d\n", freq, e_ref / avg_count, e_load / avg_count, e_diff / avg_count);
		if (measure_task.interrupted) break;
	}
	serial.printf("<MEAS>,END\n");
	ad9851.powerdown();
}

void process_serial() {
	while (serial.readable()) {
		char c = serial.getc();
		serial.putc(c);
		if (c == 0x0D) continue; // ignore CR
		if (c == 0x0A) { // treat LF as line end
			static char line[80];
			int i = 0;
			for (char c; serial_buffer.pop(c); i++) {
				line[i] = c;
			}
			line[i] = '\0';
			serial_buffer.reset();

			serial.printf("COMMAND: %s\n", line);

			char* tokens[10];
			tokens[0] = line;
			for (size_t i = 0, t = 0, len = strlen(line); i < len; i++) {
				if (line[i] == ',') {
					line[i] = 0;
					tokens[++t] = line + i + 1;
					if (t < 10) {
						continue;
					} else {
						break;
					}
				}
			}

			if (strcmp(tokens[0], "MEAS") == 0) {
				if (strcmp(tokens[1], "END") == 0) {
					measure_task.interrupted = 1;
					return;
				}
				if (!measure_task.completed) {
					serial.printf("ALREADY RUNNING MEASURE\n");
					return;
				}

				uint32_t start     = std::atoi(tokens[1]);
				uint32_t end       = std::atoi(tokens[2]);
				uint32_t step      = std::atoi(tokens[3]);
				uint8_t  avg_count = std::atoi(tokens[4]);
				if (avg_count <= 0) {
					avg_count = 1;
				}
				if (start < end && step > 0) {
					measure_task.start = start;
					measure_task.end = end;
					measure_task.step = step;
					measure_task.avg_count = avg_count;
					measure_task.completed = 0;
				} else {
					serial.printf("INVALID ARGUMENT start=%s end=%s step=%s\n", tokens[1], tokens[2], tokens[3]);
				}
			} else
			if (strcmp(tokens[0], "OSC") == 0) {
				if (strcmp(tokens[1], "ON") == 0) {
					ad9851.reset();
					uint32_t freq = std::atoi(tokens[2]);
					if (freq > 0) {
						serial.printf("<OSC>,ON,%d\n", freq);
						ad9851.set_frequency(freq);
					} else {
						serial.printf("INVALID ARGUMENT freq=%d\n", freq);
					}
				} else {
					serial.printf("<OSC>,OFF\n");
					ad9851.powerdown();
				}
			} else {
				serial.printf("UNKOWN COMMAND %s\n", tokens[0]);
			}
			continue;
		}
		serial_buffer.push(c);
	}
}



int main() {
	serial.baud(115200);

	ad9851.reset();
	ad9851.powerdown();

	serial.printf("init\n");
	serial.attach( []() {
		process_serial();
	});

	for (;;) {
		if (!measure_task.completed) {
			measure();
		}
		sleep();

//		uint16_t bat = static_cast<uint16_t>(battery.read() * 5000);
//		serial.printf("bat = %d\n", bat);
//
//		uint32_t start = 7000000;
//		uint32_t end   = 7300000;
//		uint32_t step  = (end - start) / 100;
//		measure(start, end, step);
	}
}

