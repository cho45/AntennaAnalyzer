template <uint32_t CLKIN, bool MULTIPLIER>
class AD9851 {
	static constexpr double PHASE_FACTOR = 0x100000000 / (double)(CLKIN * (MULTIPLIER ? 6 : 1));

	DigitalOut PIN_DATA;
	DigitalOut PIN_FQ_UD;
	DigitalOut PIN_W_CLK;
	DigitalOut PIN_RESET;

	void serial_write(uint32_t freq, uint8_t phase, bool powerdown) {
		// freq (delta phase)
		for (int i = 0; i < 32; i++) {
			PIN_DATA = (freq>>i & 1);
			PIN_W_CLK = 1; wait_us(4);
			PIN_W_CLK = 0; wait_us(4);
		}

		// control bits
		PIN_DATA = MULTIPLIER ? 1 : 0;
		PIN_W_CLK = 1; wait_us(4);
		PIN_W_CLK = 0; wait_us(4);
		PIN_DATA = 0;
		PIN_W_CLK = 1; wait_us(4);
		PIN_W_CLK = 0; wait_us(4);

		// powerdown
		PIN_DATA = powerdown ? 1 : 0;
		PIN_W_CLK = 1; wait_us(4);
		PIN_W_CLK = 0; wait_us(4);

		// phase
		for (int i = 0; i < 5; i++) {
			PIN_DATA = (phase>>i & 1);
			PIN_W_CLK = 1; wait_us(4);
			PIN_W_CLK = 0; wait_us(4);
		}

		PIN_FQ_UD = 1; wait_us(4);
		PIN_FQ_UD = 0; wait_us(4);
	}

public:
	AD9851(
			PinName data,
			PinName fq_ud,
			PinName w_clk,
			PinName reset
		) :
			PIN_DATA(DigitalOut(data)),
			PIN_FQ_UD(DigitalOut(fq_ud)),
			PIN_W_CLK(DigitalOut(w_clk)),
			PIN_RESET(DigitalOut(reset))
	{
		PIN_DATA = 0;
		PIN_FQ_UD = 0;
		PIN_W_CLK = 0;
		PIN_RESET = 0;
	}

	/**
	 * W0 ... W31  -> Freq (LSB first)
	 * W32, W33    -> Control (for factory test)
	 * W34         -> Power-Down
	 * W35 ... W39 -> Phase (LSB first)
	 */

	void reset() {
		// ensure low
		PIN_DATA = 0;
		PIN_FQ_UD = 0;
		PIN_W_CLK = 0;

		// reset
		PIN_RESET = 1; wait(1);
		PIN_RESET = 0; wait(1);

		// reset to serial mode
		// Pins of D0, D1 = 1, D2 = 0 for serial mode
		PIN_W_CLK = 1; wait_us(4);
		PIN_W_CLK = 0; wait_us(4);

		PIN_FQ_UD = 1; wait_us(4);
		PIN_FQ_UD = 0; wait_us(4);
	}

	void set_frequency(uint32_t frequency) {
		set_frequency(frequency, 0);
	}

	void set_frequency(uint32_t frequency, uint8_t phase) {
		uint32_t deltaPhase = PHASE_FACTOR * frequency;
		serial_write(deltaPhase, phase, 0);
	}

	void powerdown() {
		serial_write(0, 0, 1);
	}
};
