# NEC Compliance Verification Checklist
## Rock Creek 1.5 MW Hydroelectric Generation Facility (SLD RC-2)

This document provides detailed explanations for each compliance verification item identified in the NEC 2017 analysis. Each item includes the issue, applicable code reference, and a detailed explanation of why it matters and what documentation or verification is needed.

---

## HIGH PRIORITY ITEMS

These items represent critical safety or code compliance issues that should be addressed first.

---

### Item #4: Remote Emergency Stop Location Not Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not show the location of remote emergency shutdown means for generators exceeding 15 kW |
| **Code Reference** | NEC 445.18(B) |
| **Priority** | HIGH |

**Detailed Explanation:**

NEC 445.18(B) requires that generators with ratings greater than 15 kW shall have an additional shutdown means located **outside the equipment room or generator enclosure**. This remote shutdown must be capable of: (1) disabling all prime mover start control circuits to render the prime mover incapable of starting, and (2) initiating a shutdown mechanism that requires a mechanical reset.

This requirement exists because during an emergency—such as a fire, mechanical failure, or electrical fault inside the generator room—personnel may not be able to safely enter the space to shut down the equipment. Having an external emergency stop allows operators or emergency responders to de-energize the generators from a safe location.

The Rock Creek facility has three generators (200 kW, 1.1 MW, and 450+ kVA), all of which exceed the 15 kW threshold. The SLD shows hydraulic control systems and various disconnects, but does not explicitly identify a remote emergency stop station located outside the powerhouse. Physical installation verification should confirm that a properly located and labeled emergency stop exists that meets all requirements of 445.18(B)(1) and (B)(2).

---

### Item #9: 480V Capacitor Discharge Means Not Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not show discharge resistors or automatic discharge provisions for the 150 kVAR, 480V capacitor bank |
| **Code Reference** | NEC 460.6(A) and 460.6(B) |
| **Priority** | HIGH |

**Detailed Explanation:**

NEC 460.6 requires that capacitors be provided with a means of discharging stored energy. Specifically, 460.6(A) mandates that the residual voltage of a capacitor shall be reduced to 50 volts nominal or less within 1 minute after the capacitor is disconnected from the source of supply. Furthermore, 460.6(B) requires that the discharge circuit be either permanently connected to the capacitor terminals OR provided with automatic means of connecting—manual switching is explicitly prohibited.

This requirement exists because capacitors can retain a dangerous electrical charge long after being disconnected from the circuit. A 150 kVAR capacitor bank at 480V stores significant energy (approximately 0.5 × C × V² joules), and contact with charged capacitor terminals can cause serious injury or death. The discharge resistors must be sized to reduce the voltage to safe levels within the one-minute timeframe.

The SLD shows a 150 kVAR power factor capacitor bank near Generator 1 but does not indicate the presence of discharge resistors or an automatic discharge circuit. Modern capacitor units often include integral discharge resistors, but this should be verified. If the capacitors do not have internal discharge resistors, external resistors permanently connected across the capacitor terminals must be installed. Documentation should confirm the discharge time calculation meets the 50V/1-minute requirement.

---

### Item #15: Medium-Voltage Capacitor Visible-Break Isolation Not Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not show a visible-break isolation means for the 200 kVAR, 2400V capacitor bank |
| **Code Reference** | NEC 460.24(B)(1) |
| **Priority** | HIGH |

**Detailed Explanation:**

NEC 460.24(B)(1) requires that for capacitors rated over 1000 volts, a means shall be installed to isolate from all sources of voltage each capacitor, capacitor bank, or capacitor installation that will be removed from service as a unit. Critically, the code specifies that "the isolating means shall provide a **visible gap** in the electrical circuit adequate for the operating voltage."

A visible gap (also called visible break) is essential for personnel safety during maintenance. Unlike low-voltage systems where de-energization can be reasonably verified with a voltage tester, medium-voltage systems (2400V in this case) present significantly higher risk. The visible gap provides positive visual confirmation that the circuit is open and that no voltage can be present on the load side. This is a fundamental lockout/tagout safety principle for medium-voltage equipment.

The SLD shows a 200 kVAR power factor capacitor bank operating at 2400V near Generator 3, but does not explicitly show an isolation switch with visible-break capability. Typical solutions include drawout-type circuit breakers, disconnect switches with visible blades, or removable links. The physical installation should be verified to include a properly rated visible-break isolation device that can be locked in the open position for safe capacitor maintenance. Additionally, per 460.24(B)(2), if the isolating switch has no interrupting rating, it must be interlocked with the load-interrupting device or provided with caution signs per 490.22.

---

### Item #18: System Bonding Jumper Locations Not Explicitly Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not clearly identify the single point of system bonding jumper connection for each separately derived system |
| **Code Reference** | NEC 250.30(A)(1) and 250.6 |
| **Priority** | HIGH |

**Detailed Explanation:**

NEC 250.30(A)(1) requires that for a grounded separately derived system, an unspliced system bonding jumper shall be installed at "any **single point**" on the separately derived system from the source to the first system disconnecting means. The code emphasizes that this connection must be made at only one location—having multiple system bonding jumpers creates parallel paths for neutral current through the equipment grounding system, resulting in objectionable current flow prohibited by 250.6.

This installation contains multiple separately derived systems: the 480V system derived from the 21kV/480V main transformer, the 2400V generator system, and the 208/120V and 240/120V auxiliary systems derived from the 45 kVA transformers. Each of these systems requires exactly one system bonding jumper connecting the grounded conductor (neutral) to the equipment grounding conductor and enclosure.

The SLD shows ground symbols at various locations throughout the system, but does not explicitly identify which location serves as the single point of system bonding for each separately derived system. This is particularly critical in a facility with multiple generators operating in parallel—if each generator has its own neutral-to-ground bond, objectionable currents will circulate through the grounding system.

Physical installation verification and a grounding system drawing should document: (1) the exact location of the system bonding jumper for each separately derived system, (2) confirmation that no additional neutral-to-ground connections exist on the load side of each bonding point, and (3) proper sizing of each system bonding jumper per Table 250.102(C)(1).

---

### Item #21: CT/PT Secondary Grounding Points Not Explicitly Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not clearly show the grounding points for current transformer (CT) and potential transformer (PT) secondary circuits |
| **Code Reference** | NEC 250.170, 250.172, and 250.178 |
| **Priority** | HIGH |

**Detailed Explanation:**

NEC 250.170 requires that secondary circuits of current and potential instrument transformers shall be grounded where the primary windings are connected to circuits of 300 volts or more to ground, and shall be grounded regardless of voltage when installed on switchgear or switchboards. This is one of the most critical safety requirements for instrument transformers.

The reason for this requirement is that instrument transformer secondaries can develop extremely dangerous voltages if the insulation between primary and secondary windings fails or if the secondary circuit is accidentally opened while the primary is energized. For current transformers specifically, an open-circuited secondary while the primary carries current can develop voltages of several thousand volts—easily lethal and capable of causing arc flash. Grounding the secondary circuit at one point limits these voltages to safe levels.

The Rock Creek SLD shows multiple CTs (500:5, 100:1, 25:1 ratios) and at least one PT (21kV/120V) feeding the protective relay cabinet and metering equipment. The primary circuits include 21 kV (definitely >300V to ground) and 2400V systems. Signal paths "TO COMPUTER" are shown with ground symbols, suggesting some grounding exists, but the specific single-point grounding location for each CT and PT secondary circuit is not explicitly identified.

Per 250.178, the equipment grounding conductor for instrument transformer secondary circuits shall not be smaller than 12 AWG copper or 10 AWG aluminum. Documentation should show: (1) the exact grounding point for each CT and PT secondary circuit, (2) confirmation that each secondary is grounded at only one point (to prevent circulating currents), and (3) proper sizing of the instrument grounding conductors.

---

### Item #27: Short-Circuit Study Required

| Field | Details |
|-------|---------|
| **Issue** | A short-circuit current study is required to verify that all protective device interrupting ratings exceed available fault current |
| **Code Reference** | NEC 110.9, 110.10, and 705.16 |
| **Priority** | HIGH |

**Detailed Explanation:**

NEC 110.9 states that "equipment intended to interrupt current at fault levels shall have an interrupting rating at nominal circuit voltage **at least equal to the current that is available** at the line terminals of the equipment." NEC 705.16 adds that for interconnected power production sources, "consideration shall be given to the contribution of fault currents from **all interconnected power sources**."

This is a fundamental electrical safety requirement. If a protective device (circuit breaker, fuse, or relay-controlled breaker) attempts to interrupt a fault current that exceeds its interrupting rating, the device may fail catastrophically—potentially exploding, causing arc flash, failing to clear the fault, or welding contacts closed. The consequences can include equipment destruction, fire, and serious injury or death to personnel.

The Rock Creek facility presents a complex fault current calculation because multiple sources contribute to fault current: (1) the utility system through the 21 kV interconnection, (2) the 1.1 MW synchronous generator (contributes significant fault current based on subtransient reactance), (3) the 200 kW induction generator (contributes fault current for the first few cycles), and (4) the synchronous/induction hybrid Generator 3. Additionally, the 150 kVAR and 200 kVAR capacitor banks can contribute to fault current magnitude.

A proper short-circuit study should calculate the maximum available fault current at each major bus: 21 kV point of interconnection, 2400V generator bus, 480V distribution bus, and all downstream panels. The study must use the subtransient reactances of all generators (required to be on nameplates per 445.11) and transformer impedances. Every protective device in the system must then be verified to have an interrupting rating exceeding the calculated available fault current at its location.

---

### Item #34: Device Interrupting Ratings vs. Fault Current Verification

| Field | Details |
|-------|---------|
| **Issue** | All protective devices must be verified to have interrupting ratings that exceed the available fault current at their installed locations |
| **Code Reference** | NEC 240.100(B) and 110.9 |
| **Priority** | HIGH |

**Detailed Explanation:**

NEC 240.100(B) requires that for systems over 1000 volts, "the protective device(s) shall be capable of detecting and interrupting all values of current, in excess of its trip setting or melting point, that can occur at its location." This works in conjunction with 110.9's general requirement that equipment have adequate interrupting rating.

This requirement is directly related to Item #27 (short-circuit study) but focuses on the verification step. Once fault currents are calculated, each protective device must be checked. The SLD shows numerous protective devices including: the 15A pole-mounted fuse on the 21 kV line, circuit breakers in the protective relay cabinet, the 400A main breaker on the 480V panel, vacuum switches with shunt trips, and various distribution breakers.

For medium-voltage equipment (21 kV and 2400V in this installation), interrupting ratings are typically expressed in MVA or symmetrical RMS amperes. Common medium-voltage breaker interrupting ratings range from 250 MVA to 1000 MVA or higher. The verification must confirm that each device's rating exceeds the calculated available fault current.

Documentation should include a table showing: (1) each protective device location and description, (2) the device's interrupting rating (from nameplate or manufacturer data), (3) the calculated available fault current at that location, and (4) confirmation that the rating exceeds the available fault current with appropriate margin.

---

### Item #35: Protection Coordination Study Required

| Field | Details |
|-------|---------|
| **Issue** | A time-current coordination study is required to ensure proper selective operation of protective devices |
| **Code Reference** | NEC 110.10 and 240.100(C) |
| **Priority** | HIGH |

**Detailed Explanation:**

NEC 110.10 requires that "the overcurrent protective devices, the total impedance, the equipment short-circuit current ratings, and other characteristics of the circuit to be protected shall be selected and coordinated to permit the circuit protective devices used to clear a fault to do so without extensive damage to the electrical equipment." NEC 240.100(C) adds for systems over 1000V that "the operating time of the protective device, the available short-circuit current, and the conductor used shall be coordinated to prevent damaging or dangerous temperatures in conductors or conductor insulation under short-circuit conditions."

Protection coordination (also called selectivity) ensures that when a fault occurs, only the protective device immediately upstream of the fault operates, while all other devices remain closed. Without proper coordination, a fault on a branch circuit could trip the main breaker, causing an unnecessary facility-wide outage. Worse, if devices race to operate, the wrong device might trip first, or multiple devices might operate simultaneously causing confusion about fault location.

For the Rock Creek facility, coordination is complex because multiple protection zones exist: utility protection at the POI, main facility protection, generator protection (50/51, 27/59, 81, 32, 67 devices), transformer protection, and distribution protection. The protective relay settings (pickup current, time dial, curve type) must be selected so that time-current curves show clear coordination margins (typically 0.3-0.4 seconds) between successive devices.

A coordination study should include: (1) single-line diagram with all protective devices, (2) time-current characteristic curves plotted on log-log paper showing all devices in each coordination path, (3) conductor damage curves overlaid to verify conductors are protected, (4) recommended relay settings, and (5) coordination interval analysis demonstrating selectivity.

---

## MEDIUM PRIORITY ITEMS

These items represent important documentation or verification requirements that should be addressed but are less likely to present immediate safety hazards.

---

### Item #1: Generator Nameplate Information Incomplete on SLD

| Field | Details |
|-------|---------|
| **Issue** | The SLD shows only partial generator nameplate information; several required data points are not displayed |
| **Code Reference** | NEC 445.11 |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 445.11 requires that each generator nameplate include: manufacturer's name, rated frequency, number of phases (if AC), rating in kW or kVA, power factor, normal volts and amperes corresponding to the rating, rated ambient temperature, and rated temperature rise. For generators rated more than 15 kW (which includes all three generators in this facility), additional information is required: subtransient, transient, synchronous, and zero sequence reactances; power rating category; insulation system class; indication if protected against overload; and maximum short-circuit current for inverter-based generators.

The SLD shows the basic power ratings (200 kW/250 kVA, 1.1 MW/1.25 MVA, 450+ kVA) and voltages (480V, 2400V) for each generator, but does not include frequency (assumed 60 Hz), power factor, full-load amperes, temperature ratings, or the critically important reactance values. The reactance values are essential for the short-circuit study discussed in Item #27—without knowing the subtransient reactance of each generator, fault current contributions cannot be accurately calculated.

While it is common practice not to include all nameplate data on a single-line diagram (which would make it cluttered), this information must exist in supporting documentation such as equipment schedules, nameplate data sheets, or generator specification sheets. Verification should confirm that complete 445.11 data is available for all three generators.

---

### Item #3: Generator Conductor Ampacity (115%) Not Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not show conductor sizes between generators and their first overcurrent devices, preventing verification of the 115% ampacity requirement |
| **Code Reference** | NEC 445.13(A) |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 445.13(A) requires that the ampacity of conductors from generator output terminals to the first distribution device containing overcurrent protection shall not be less than **115 percent** of the nameplate current rating of the generator. This 15% additional capacity accounts for the fact that generators may operate slightly above nameplate rating under certain conditions and provides margin for voltage regulation and power factor variations.

For the Rock Creek generators, the required conductor ampacities would be:
- Generator 1 (250 kVA, 480V): Full-load current = 301A, Required ampacity = 346A minimum
- Generator 2 (1,250 kVA, 2400V): Full-load current = 301A, Required ampacity = 346A minimum  
- Generator 3 (450 kVA, 2400V): Full-load current = 108A, Required ampacity = 124A minimum

The SLD does not indicate conductor sizes for these generator output circuits. While single-line diagrams often omit conductor sizing details (which appear on cable schedules or wiring diagrams), verification should confirm that installed conductor ampacities meet or exceed these calculated minimums. For medium-voltage conductors (2400V), this would typically reference NEC Table 310.60(C)(69) through Table 310.60(C)(86) for appropriate ampacity values based on conductor type and installation method.

---

### Item #7: PT Primary Fusing Not Explicitly Shown

| Field | Details |
|-------|---------|
| **Issue** | The single-line diagram does not explicitly show primary fuses for the 21 kV/120V potential transformer |
| **Code Reference** | NEC 450.3(C) |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 450.3(C) states that "voltage (potential) transformers installed indoors or enclosed shall be protected with primary fuses." This requirement ensures that a fault within the PT or its secondary circuit does not draw excessive current from the primary system, which could cause damage, fire, or affect the primary system protection coordination.

The SLD shows a 0.1 kVA potential transformer connected to the 21 kV system, providing 120V output for metering and protective relay voltage sensing. The PT is shown within the protective relay cabinet area. While the 21 kV system has a 15A pole-mounted fuse upstream, this fuse is sized for the main 2,250 kVA transformer and would not provide appropriate protection for the small PT.

PT primary fuses are typically very small—for a 0.1 kVA PT at 21 kV, the primary current is only about 0.005A (5 mA). PT fuses are specially designed for this low-current, high-voltage application and are often of the current-limiting type to minimize arc energy during a fault. Common PT fuse ratings are in the range of 0.5A to 3A, sized primarily to protect against secondary short circuits rather than PT overload.

The physical installation should be verified to include appropriate PT primary fuses, typically located in a fused disconnect or fuse cutout at the PT primary terminals.

---

### Item #8: Transformer Case Grounding Not Explicitly Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not clearly show equipment grounding connections for all transformer enclosures |
| **Code Reference** | NEC 450.10 |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 450.10 requires that exposed non-current-carrying metal parts of transformer installations, including fences, guards, and transformer housings/enclosures, shall be connected to the equipment grounding conductor. This bonding ensures that if a fault occurs between a transformer winding and the case, the fault current has a low-impedance path back to the source, allowing overcurrent protective devices to operate and clear the fault.

The Rock Creek facility includes multiple transformers: the main 2,250 kVA (21kV/480V) transformer, the 1,500+ kVA generator step-up transformer (2400V/21kV), the 0.1 kVA PT, and two 45 kVA auxiliary transformers. Each of these transformer enclosures must be bonded to the equipment grounding system.

While the SLD shows ground symbols at various locations throughout the system, explicit transformer case grounding connections are not specifically identified. For outdoor pole-mounted or pad-mounted transformers, grounding typically consists of a conductor from the transformer tank to a ground rod and/or the system grounding electrode. For indoor transformers, the case is typically bonded to the building's equipment grounding system.

Physical verification should confirm that all transformer cases are properly bonded with appropriately sized equipment grounding conductors per NEC 250.122 or Table 250.122.

---

### Item #10: Capacitor Conductor Ampacity Not Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not show conductor sizes for capacitor circuits, preventing verification of the 135% ampacity requirement |
| **Code Reference** | NEC 460.8(A) |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 460.8(A) requires that the ampacity of capacitor circuit conductors shall not be less than **135 percent** of the rated current of the capacitor. This additional capacity beyond 100% is required because capacitors draw harmonic currents in addition to fundamental frequency current, and because capacitor current increases if system voltage rises above nominal. The 35% margin provides safe operation under these conditions.

For the Rock Creek capacitor banks:
- 150 kVAR at 480V, 3-phase: Rated current = 180.4A, Required conductor ampacity = 243.5A minimum
- 200 kVAR at 2400V, 3-phase: Rated current = 48.1A, Required conductor ampacity = 64.9A minimum

Additionally, 460.8(A) states that conductors connecting a capacitor to motor terminals or motor circuit conductors shall have ampacity not less than one-third the motor circuit conductor ampacity, and in no case less than 135% of capacitor rated current.

The SLD does not indicate conductor sizes for either capacitor bank. Verification should confirm that installed conductor ampacities meet or exceed the calculated minimums. For the 2400V capacitor bank, medium-voltage cable ampacity tables would apply.

---

### Item #11: Capacitor Overcurrent Protection Not Explicitly Shown

| Field | Details |
|-------|---------|
| **Issue** | Dedicated overcurrent protection for the 480V capacitor bank is not explicitly shown on the SLD |
| **Code Reference** | NEC 460.8(B) |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 460.8(B) requires that "an overcurrent device shall be provided in each ungrounded conductor for each capacitor bank" and that "the rating or setting of the overcurrent device shall be as low as practicable." The exception allows omitting a separate overcurrent device for a capacitor connected on the load side of a motor overload protective device.

Capacitor overcurrent protection serves multiple purposes: it protects the capacitor circuit conductors, provides backup protection if capacitor units fail, and isolates a faulted capacitor bank from the system. The requirement that the device rating be "as low as practicable" recognizes that capacitor inrush current during energization can be very high (potentially 20-25 times rated current), so the device must be sized to allow normal switching while still providing meaningful protection.

Typical capacitor fuse sizing allows for inrush current, often resulting in fuses rated at 165% to 250% of capacitor rated current. For the 150 kVAR bank (180.4A rated current), fuses in the range of 300-450A might be appropriate depending on specific inrush characteristics.

The SLD shows the 150 kVAR capacitor bank near Generator 1 but does not explicitly show a dedicated capacitor fuse or breaker. The bank may be protected by upstream devices (such as the distribution panel breaker), or fuses may be integral to the capacitor assembly. Physical verification should confirm appropriate overcurrent protection exists.

---

### Item #12: Capacitor Disconnect Not Explicitly Shown

| Field | Details |
|-------|---------|
| **Issue** | A dedicated disconnecting means for the 480V capacitor bank is not explicitly shown on the SLD |
| **Code Reference** | NEC 460.8(C) |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 460.8(C) requires that "a disconnecting means shall be provided in each ungrounded conductor for each capacitor bank" with the following requirements: (1) the disconnecting means shall open all ungrounded conductors simultaneously, (2) it shall be permitted to disconnect the capacitor from the line as a regular operating procedure, and (3) the rating shall not be less than 135% of rated capacitor current.

For the 150 kVAR capacitor bank with 180.4A rated current, the disconnect must be rated at least 243.5A. The simultaneous opening requirement ensures that single-phasing of the capacitor bank is prevented, which could cause overvoltage on the remaining phases.

The exception allows omitting a separate disconnect where the capacitor is connected on the load side of a motor controller. However, this exception would not typically apply to a power factor correction bank serving general loads.

The SLD does not explicitly show a capacitor disconnect switch. In practice, the overcurrent device (if present) may also serve as the disconnect, or a separate switch may be installed. Physical verification should confirm that an appropriately rated disconnect exists that opens all three phases simultaneously.

---

### Item #13: 480V Capacitor Case Grounding Not Shown

| Field | Details |
|-------|---------|
| **Issue** | Equipment grounding for the 150 kVAR, 480V capacitor bank case is not explicitly shown |
| **Code Reference** | NEC 460.10 |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 460.10 requires that "capacitor cases shall be connected to the equipment grounding conductor." The exception permits omitting this connection where capacitor units are supported on a structure designed to operate at other than ground potential (such as on an energized bus in a substation), but this exception would not apply to typical industrial installations.

Capacitor case grounding is essential because capacitor failure modes can include internal short circuits that energize the case. Without proper grounding, a person touching an energized capacitor case could receive a severe or fatal shock. The grounding connection provides a fault current path that allows protective devices to operate.

The SLD shows the 150 kVAR capacitor bank but does not explicitly show a grounding connection to the case. Physical verification should confirm that the capacitor bank enclosure is bonded to the equipment grounding system with a conductor sized per NEC 250.122, or that the capacitor rack is bonded to a grounded structural steel support.

---

### Item #14: Medium-Voltage Capacitor Switching Equipment Not Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not show the switching equipment specifications for the 200 kVAR, 2400V capacitor bank |
| **Code Reference** | NEC 460.24(A) |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 460.24(A) specifies that for capacitors over 1000V, "group-operated switches shall be used for capacitor switching" and these switches must be capable of: (1) carrying continuously not less than 135% of the rated current of the capacitor installation, (2) interrupting the maximum continuous load current of each capacitor or bank that will be switched as a unit, (3) withstanding the maximum inrush current including contributions from adjacent capacitor installations, and (4) carrying currents due to faults on the capacitor side of the switch.

Medium-voltage capacitor switching is more demanding than low-voltage switching because of the phenomenon of voltage escalation during restrike. If a switch opens but then the arc restrikes (re-ignites), the capacitor voltage can nearly double with each restrike, potentially causing catastrophic failure. Switches rated for capacitor duty must be capable of interrupting capacitive current without restrike.

For the 200 kVAR bank at 2400V (48.1A rated current), the switch must be rated at least 64.9A continuous (135%) and must have a capacitor switching rating appropriate for the installation. The inrush current withstand requirement is particularly important because back-to-back capacitor switching (when another capacitor bank is already energized nearby) creates very high inrush currents.

The SLD does not show the capacitor switching device or its ratings. Physical verification should confirm that an appropriately rated capacitor switch is installed, and that its ratings meet all four requirements of 460.24(A).

---

### Item #16: Medium-Voltage Capacitor Fusing Not Shown

| Field | Details |
|-------|---------|
| **Issue** | Overcurrent protection (fusing) for the 200 kVAR, 2400V capacitor bank is not shown on the SLD |
| **Code Reference** | NEC 460.25 |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 460.25(A) requires that for capacitors over 1000V, "a means shall be provided to detect and interrupt fault current likely to cause dangerous pressure within an individual capacitor." This protection is critical because medium-voltage capacitor failure can be violent—internal faults can cause case rupture, expulsion of dielectric fluid, and fire.

NEC 460.25(C) permits capacitors to be protected individually or in groups. Individual capacitor fusing (called "unit fuses" or "element fuses") provides the most selective protection—a failed capacitor is isolated without affecting the rest of the bank. Group fusing protects multiple capacitors with one fuse, which is less expensive but removes the entire group for a single unit failure.

NEC 460.25(D) requires that protective devices be rated or adjusted to operate within the limits of the "safe zone" for individual capacitors. If devices are rated to operate within Zone 1 or Zone 2 limits (as defined in ANSI/IEEE 18), the capacitors must be enclosed or isolated. The protective device rating shall never exceed the maximum limit of Zone 2.

For the 200 kVAR, 2400V bank, appropriate fusing typically involves current-limiting fuses specifically rated for capacitor protection. These fuses must be capable of interrupting the available fault current at the installation location.

The SLD does not show capacitor fusing details. Physical verification should confirm that appropriate medium-voltage capacitor fuses are installed and that their ratings comply with 460.25 and the capacitor manufacturer's recommendations.

---

### Item #17: Medium-Voltage Capacitor Grounding Not Shown

| Field | Details |
|-------|---------|
| **Issue** | Equipment grounding for the 200 kVAR, 2400V capacitor bank is not explicitly shown |
| **Code Reference** | NEC 460.27 |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 460.27 requires that for capacitors over 1000V, "capacitor cases shall be connected to the equipment grounding conductor." Additionally, if the capacitor neutral point is connected to a grounding electrode conductor, this connection must be made in accordance with Part III of Article 250.

Medium-voltage capacitor grounding is particularly important due to the higher voltages and energies involved. A fault that energizes the capacitor case at 2400V presents extreme danger to personnel. The grounding connection ensures rapid operation of protective devices to clear such faults.

For capacitor banks with grounded neutral (wye-connected banks with the neutral grounded), the grounding arrangement becomes more complex and must comply with Article 250 Part III requirements for grounding electrode systems and grounding electrode conductors.

The SLD shows the 200 kVAR capacitor bank but does not indicate the capacitor configuration (delta vs. wye), whether the neutral is grounded (if wye), or the equipment grounding connection for the capacitor cases. Physical verification should confirm proper grounding arrangements for both the capacitor cases and any neutral grounding.

---

### Item #19: Grounding Electrode Conductor Sizing Not Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not show grounding electrode conductor sizes for the separately derived systems |
| **Code Reference** | NEC 250.30(A)(5) and 250.66 |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 250.30(A)(5) requires that a grounding electrode conductor for a single separately derived system shall be sized in accordance with 250.66 based on the size of the derived ungrounded (phase) conductors. This grounding electrode conductor connects the grounded conductor (neutral) of the derived system to the grounding electrode and must be installed at the same point where the system bonding jumper is connected.

Table 250.66 provides the sizing requirements. For example, if the 480V system has 500 kcmil copper phase conductors, the grounding electrode conductor must be at least 1/0 AWG copper. For the 2400V generator system with potentially larger conductors, the grounding electrode conductor would be proportionally larger.

The grounding electrode conductor is distinct from the equipment grounding conductor. The grounding electrode conductor connects the system to earth (via electrodes like ground rods, water pipes, or concrete-encased electrodes), while equipment grounding conductors bond equipment cases to the system. Both are essential, but they serve different purposes.

The Rock Creek facility has multiple separately derived systems, each requiring its own grounding electrode conductor (or connection to a common grounding electrode conductor per 250.30(A)(6)). The SLD does not show these conductors or their sizes. A grounding system drawing or specification should document the grounding electrode conductor for each separately derived system, showing size, routing, and connection points.

---

### Item #20: 2400V System Neutral Conductor Sizing Not Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not specify neutral conductor sizing for the 2400V generator system |
| **Code Reference** | NEC 250.184(A)(2) |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 250.184(A)(2) addresses neutral conductor sizing for solidly grounded neutral systems over 1000V. It requires that "the neutral conductor shall be of sufficient ampacity for the load imposed on the conductor but not less than **33⅓ percent** of the ampacity of the phase conductors." An exception for industrial and commercial premises under engineering supervision permits sizing the neutral at not less than 20% of phase conductor ampacity.

The Rock Creek 2400V system appears to be a solidly grounded neutral system based on the transformer configurations shown. The neutral conductor carries unbalanced current between phases plus any harmonic currents. Even in a well-balanced three-phase system, the neutral must be sized to handle potential unbalanced conditions and fault currents.

For example, if the 2400V phase conductors are rated for 400A, the neutral conductor must have ampacity of at least 133A (33⅓%) under the general rule, or 80A (20%) under the engineering supervision exception.

The SLD does not show neutral conductor sizes for the 2400V system. Design documentation should confirm that neutral conductors are appropriately sized per 250.184(A)(2), taking into account expected load unbalance and harmonic content.

---

### Item #22: Equipment Listing for Interconnection Not Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not indicate whether equipment is listed and labeled for interconnection service |
| **Code Reference** | NEC 705.6 |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 705.6 requires that "all equipment shall be approved for the intended use" and specifically states that "interactive inverters for interconnection to systems interactive equipment intended to operate in parallel with the electric power system including, but not limited to, interactive inverters, engine generators, energy storage equipment, and wind turbines shall be listed and/or field labeled for the intended use of interconnection service."

While this facility predates modern interconnection standards (the SLD is dated 2001), the principle remains that equipment used for utility interconnection should be approved for that purpose. This approval may come from product listing (such as UL listing) or from field evaluation by a qualified testing laboratory.

For generators specifically, listing to UL 2200 (Stationary Engine Generator Assemblies) would typically be expected. Protective relays should be listed to applicable standards (UL 508, IEEE C37 series). The synchronous generators and induction generators shown on this SLD should have documentation demonstrating their suitability for parallel operation with the utility system.

The SLD does not indicate listing marks or certifications for the equipment. Documentation should include equipment submittals or nameplates confirming appropriate listings or field evaluations for all equipment involved in the utility interconnection.

---

### Item #24: Directory/Plaque Requirements

| Field | Details |
|-------|---------|
| **Issue** | The SLD cannot verify that required directory placards identifying power source disconnect locations are installed |
| **Code Reference** | NEC 705.10 |
| **Priority** | LOW |

**Detailed Explanation:**

NEC 705.10 requires that "a permanent plaque or directory denoting the location of all electric power source disconnecting means on or in the premises shall be installed at each service equipment location and at the location(s) of the system disconnect(s) for all electric power production sources capable of being interconnected." The marking must comply with 110.21(B) durability requirements.

This requirement exists to ensure that utility workers, electricians, and emergency responders can identify and locate all sources of electrical power in a facility. For a generation facility like Rock Creek that exports power to the utility grid, it is critical that utility personnel responding to a line fault or performing maintenance can quickly identify where to disconnect the customer's generation equipment.

The directory should list: (1) the service disconnecting means location, (2) the location of each generator disconnect, (3) the location of the utility interconnection disconnect, and (4) any other power source disconnects. The placards must be permanent and durable enough to withstand the environment where installed.

This requirement cannot be verified from the SLD as it pertains to physical signage at the installation. The exception in 705.10 permits installations with large numbers of power production sources to be designated by groups, but this would still require some form of directory or plaque.

---

### Item #30: Single-Phasing Protection Not Explicitly Shown

| Field | Details |
|-------|---------|
| **Issue** | The SLD does not explicitly show protection against loss of one phase of the three-phase primary source |
| **Code Reference** | NEC 705.42 |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 705.42 requires that "a 3-phase electric power production source shall be automatically disconnected from all ungrounded conductors of the interconnected systems when one of the phases of that source opens." This protection is critical because single-phasing creates severe voltage unbalance that can damage motors and other three-phase loads, and can cause dangerous operating conditions for generators.

When one phase of a three-phase system is lost (due to a blown fuse, open conductor, or other fault), the remaining two phases experience voltage fluctuations. Induction generators can experience severe heating and potential failure. Synchronous generators can experience shaft stresses and oscillations. Three-phase motors throughout the facility will overheat.

Protection against single-phasing is typically provided by: negative sequence voltage relay (Device 47), negative sequence overcurrent relay (Device 46), phase unbalance relay (Device 60), or voltage relay monitoring all three phases (three Device 27 elements with logic).

The SLD shows Device 67 (directional overcurrent) and Device 27/59 (voltage), which could potentially detect single-phasing depending on their configuration, but explicit negative sequence or phase unbalance protection is not shown. Modern interconnection requirements (such as IEEE 1547) typically require specific single-phasing protection.

Verification should confirm that the protective relay scheme includes adequate single-phasing detection that will disconnect all three generators automatically upon loss of any phase.

---

### Item #32: Complete Synchronizing System Not Fully Shown

| Field | Details |
|-------|---------|
| **Issue** | While Device 25 (sync check) is shown, the complete synchronizing system components are not fully depicted |
| **Code Reference** | NEC 705.143 |
| **Priority** | LOW |

**Detailed Explanation:**

NEC 705.143 requires that "synchronous generators in a parallel system shall be provided with the necessary equipment to establish and maintain a synchronous condition." This includes equipment to bring the generator into synchronization before connecting to the system (matching voltage magnitude, frequency, and phase angle) and equipment to maintain synchronization during operation (voltage regulator and governor).

The SLD shows Device 25 (synchronizing or sync-check relay) in the protective relay cabinet, which satisfies the explicit NEC requirement for synchronization checking. Device 25 verifies that voltage, frequency, and phase angle are within acceptable limits before permitting the generator breaker to close.

However, a complete synchronizing system typically also includes:
- Synchroscope or synchronizing lights for manual synchronizing
- Automatic synchronizer controller for automatic paralleling
- Voltage matching controls (adjusting generator field excitation)
- Frequency matching controls (adjusting governor setpoint)
- Speed matching relay for coarse speed adjustment before fine synchronizing

For the 1.1 MW synchronous generator (Generator 2) and the synchronous portion of Generator 3, these auxiliary synchronizing components are essential for reliable parallel operation. The SLD shows the synchronizing relay but does not detail the complete synchronizing system.

This is listed as LOW priority because the SLD does show Device 25, meeting the basic NEC requirement. The additional components would typically be shown on control schematics rather than the power single-line diagram. Verification should confirm that complete synchronizing provisions exist for all synchronous generators.

---

### Item #36: Medium-Voltage Conductor Ampacity vs. Overcurrent Device Settings

| Field | Details |
|-------|---------|
| **Issue** | The relationship between medium-voltage conductor ampacity and overcurrent device settings cannot be verified |
| **Code Reference** | NEC 240.101(A) |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 240.101(A) establishes maximum overcurrent device settings for feeders over 1000V based on conductor ampacity: "The continuous ampere rating of a fuse shall not exceed **three times** the ampacity of the conductors. The long-time trip element setting of a breaker or the minimum trip setting of an electronically actuated fuse shall not exceed **six times** the ampacity of the conductor."

These multipliers (3× for fuses, 6× for breakers) are much higher than for low-voltage systems because medium-voltage systems have different fault characteristics, longer clearing times are acceptable for high-impedance faults, and the systems are typically supervised by qualified personnel.

For the Rock Creek facility, this applies to the 21 kV and 2400V circuits. For example:
- If a 21 kV circuit has conductors rated 100A, fuse rating must not exceed 300A, breaker long-time pickup must not exceed 600A
- If a 2400V generator feeder has conductors rated 350A, fuse rating must not exceed 1050A, breaker long-time pickup must not exceed 2100A

The SLD does not show conductor sizes for the medium-voltage circuits, so verification of compliance with 240.101(A) is not possible from the drawing alone. Design documentation should include a conductor schedule or cable schedule showing all medium-voltage conductor sizes, and verification that associated overcurrent device ratings comply with the 3× or 6× limits.

---

### Item #38: Arc Flash and Hazard Markings

| Field | Details |
|-------|---------|
| **Issue** | Arc flash warning labels and hazard markings cannot be verified from the SLD |
| **Code Reference** | NEC 110.16 and 110.21(B) |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 110.16 requires that electrical equipment such as switchboards, switchgear, panelboards, industrial control panels, meter socket enclosures, and motor control centers that are in other than dwelling units, and are likely to require examination, adjustment, servicing, or maintenance while energized, shall be field-marked to warn qualified persons of potential electric arc flash hazards. The marking shall be located so as to be clearly visible to qualified persons before examination, adjustment, servicing, or maintenance of the equipment.

NEC 110.21(B) specifies requirements for field-applied hazard markings, including that they must be adequately durable, provide effective warnings using words and/or colors/symbols, and comply with applicable codes.

Arc flash labeling is particularly critical for this installation because of the high fault current availability from multiple sources (utility plus three generators) and the presence of medium-voltage (21 kV and 2400V) equipment. Arc flash energy increases dramatically at higher voltages and with higher available fault current.

An arc flash study (per IEEE 1584 or similar methodology) should calculate incident energy levels at each major piece of equipment. Labels should indicate: (1) nominal system voltage, (2) arc flash boundary, (3) available incident energy or hazard/risk category (HRC), and (4) required personal protective equipment (PPE).

This requirement cannot be verified from the SLD. Physical verification should confirm that appropriate arc flash warning labels are installed at all required locations.

---

### Item #39: Available Fault Current Documentation

| Field | Details |
|-------|---------|
| **Issue** | Field marking of available fault current at service equipment cannot be verified from the SLD |
| **Code Reference** | NEC 110.24 |
| **Priority** | MEDIUM |

**Detailed Explanation:**

NEC 110.24(A) requires that service equipment in other than dwelling units shall be legibly marked in the field with the maximum available fault current, including the date the fault current calculation was performed, and be of sufficient durability to withstand the environment involved. When modifications to the electrical installation occur that affect the maximum available fault current, the marking must be updated.

This requirement ensures that anyone working on or inspecting the electrical system can quickly determine whether equipment ratings are adequate for the available fault current. It also provides a record that a fault current calculation was performed.

For the Rock Creek facility, the available fault current at the service equipment (21 kV point of interconnection and/or 480V main distribution) would include contributions from the utility source plus all three generators. This value is needed for the equipment ratings verification discussed in Items #27 and #34.

The marking should include:
- Maximum available fault current in amperes or kA
- Date of calculation
- (Optionally) Source of calculation (engineering firm, study reference)

This requirement cannot be verified from the SLD. Physical verification should confirm that the required marking is present at the service equipment, and that the marked value is consistent with the short-circuit study.

---

## SUMMARY TABLE

| Item # | Issue | NEC Reference | Priority | Category |
|--------|-------|---------------|----------|----------|
| 4 | Remote emergency stop location | 445.18(B) | HIGH | Generators |
| 9 | 480V capacitor discharge means | 460.6 | HIGH | Capacitors |
| 15 | MV capacitor visible-break isolation | 460.24(B)(1) | HIGH | Capacitors |
| 18 | System bonding jumper locations | 250.30(A)(1), 250.6 | HIGH | Grounding |
| 21 | CT/PT secondary grounding | 250.170-178 | HIGH | Grounding |
| 27 | Short-circuit study required | 110.9, 705.16 | HIGH | Protection |
| 34 | Device interrupting ratings | 240.100(B), 110.9 | HIGH | Protection |
| 35 | Coordination study required | 110.10, 240.100(C) | HIGH | Protection |
| 1 | Generator nameplate data | 445.11 | MEDIUM | Generators |
| 3 | Generator conductor ampacity | 445.13(A) | MEDIUM | Generators |
| 7 | PT primary fusing | 450.3(C) | MEDIUM | Transformers |
| 8 | Transformer case grounding | 450.10 | MEDIUM | Transformers |
| 10 | Capacitor conductor ampacity | 460.8(A) | MEDIUM | Capacitors |
| 11 | Capacitor overcurrent protection | 460.8(B) | MEDIUM | Capacitors |
| 12 | Capacitor disconnect | 460.8(C) | MEDIUM | Capacitors |
| 13 | 480V capacitor grounding | 460.10 | MEDIUM | Capacitors |
| 14 | MV capacitor switching equipment | 460.24(A) | MEDIUM | Capacitors |
| 16 | MV capacitor fusing | 460.25 | MEDIUM | Capacitors |
| 17 | MV capacitor grounding | 460.27 | MEDIUM | Capacitors |
| 19 | Grounding electrode conductor sizing | 250.30(A)(5), 250.66 | MEDIUM | Grounding |
| 20 | 2400V neutral conductor sizing | 250.184(A)(2) | MEDIUM | Grounding |
| 22 | Equipment listing | 705.6 | MEDIUM | Interconnection |
| 30 | Single-phasing protection | 705.42 | MEDIUM | Interconnection |
| 36 | MV conductor vs. OC settings | 240.101(A) | MEDIUM | Protection |
| 38 | Arc flash labels | 110.16, 110.21(B) | MEDIUM | Safety |
| 39 | Fault current marking | 110.24 | MEDIUM | Documentation |
| 24 | Directory placards | 705.10 | LOW | Documentation |
| 32 | Complete synchronizing system | 705.143 | LOW | Generators |

---

*This checklist is intended as a comprehensive reference for NEC compliance verification. Each item should be individually verified against actual installation conditions and supporting engineering documentation.*
