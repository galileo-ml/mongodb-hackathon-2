import { Document } from "@/types";

export const documents: Document[] = [
  {
    id: "5",
    filename: "rock_creek_generator_sld.pdf",
    uploadedAt: "2026-01-10",
    fileSize: "64.8 KB",
    status: "complete",
    fileUrl: "/rock_creek_generator_sld.pdf",
    summary: { passed: 9, warnings: 6, failed: 2 },
    checks: [
      // Failed checks
      {
        id: "rc1",
        name: "Short-Circuit Study Required",
        status: "fail",
        standard: "NEC 110.9, 705.16",
        message: "Must verify all device interrupting ratings exceed available fault current from utility + 3 generators",
        description: `NEC 110.9 states that "equipment intended to interrupt current at fault levels shall have an interrupting rating at nominal circuit voltage at least equal to the current that is available at the line terminals of the equipment." NEC 705.16 adds that for interconnected power production sources, "consideration shall be given to the contribution of fault currents from all interconnected power sources."

This is a fundamental electrical safety requirement. If a protective device (circuit breaker, fuse, or relay-controlled breaker) attempts to interrupt a fault current that exceeds its interrupting rating, the device may fail catastrophically—potentially exploding, causing arc flash, failing to clear the fault, or welding contacts closed. The consequences can include equipment destruction, fire, and serious injury or death to personnel.

The Rock Creek facility presents a complex fault current calculation because multiple sources contribute to fault current: (1) the utility system through the 21 kV interconnection, (2) the 1.1 MW synchronous generator (contributes significant fault current based on subtransient reactance), (3) the 200 kW induction generator (contributes fault current for the first few cycles), and (4) the synchronous/induction hybrid Generator 3. Additionally, the 150 kVAR and 200 kVAR capacitor banks can contribute to fault current magnitude.

A proper short-circuit study should calculate the maximum available fault current at each major bus: 21 kV point of interconnection, 2400V generator bus, 480V distribution bus, and all downstream panels. The study must use the subtransient reactances of all generators (required to be on nameplates per 445.11) and transformer impedances. Every protective device in the system must then be verified to have an interrupting rating exceeding the calculated available fault current at its location.`,
        location: { sheet: 1, region: "Main Bus" },
      },
      {
        id: "rc2",
        name: "Coordination Study Required",
        status: "fail",
        standard: "NEC 240.100(C)",
        message: "Time-current curves needed to ensure selective tripping",
        description: `NEC 110.10 requires that "the overcurrent protective devices, the total impedance, the equipment short-circuit current ratings, and other characteristics of the circuit to be protected shall be selected and coordinated to permit the circuit protective devices used to clear a fault to do so without extensive damage to the electrical equipment." NEC 240.100(C) adds for systems over 1000V that "the operating time of the protective device, the available short-circuit current, and the conductor used shall be coordinated to prevent damaging or dangerous temperatures in conductors or conductor insulation under short-circuit conditions."

Protection coordination (also called selectivity) ensures that when a fault occurs, only the protective device immediately upstream of the fault operates, while all other devices remain closed. Without proper coordination, a fault on a branch circuit could trip the main breaker, causing an unnecessary facility-wide outage. Worse, if devices race to operate, the wrong device might trip first, or multiple devices might operate simultaneously causing confusion about fault location.

For the Rock Creek facility, coordination is complex because multiple protection zones exist: utility protection at the POI, main facility protection, generator protection (50/51, 27/59, 81, 32, 67 devices), transformer protection, and distribution protection. The protective relay settings (pickup current, time dial, curve type) must be selected so that time-current curves show clear coordination margins (typically 0.3-0.4 seconds) between successive devices.

A coordination study should include: (1) single-line diagram with all protective devices, (2) time-current characteristic curves plotted on log-log paper showing all devices in each coordination path, (3) conductor damage curves overlaid to verify conductors are protected, (4) recommended relay settings, and (5) coordination interval analysis demonstrating selectivity.`,
        location: { sheet: 1, region: "Protection Scheme" },
      },
      // Warning checks
      {
        id: "rc3",
        name: "CT/PT Secondary Grounding",
        status: "warning",
        standard: "NEC 250.170",
        message: "Ungrounded CT secondaries can develop lethal voltages - verify grounding",
        description: `NEC 250.170 requires that secondary circuits of current and potential instrument transformers shall be grounded where the primary windings are connected to circuits of 300 volts or more to ground, and shall be grounded regardless of voltage when installed on switchgear or switchboards. This is one of the most critical safety requirements for instrument transformers.

The reason for this requirement is that instrument transformer secondaries can develop extremely dangerous voltages if the insulation between primary and secondary windings fails or if the secondary circuit is accidentally opened while the primary is energized. For current transformers specifically, an open-circuited secondary while the primary carries current can develop voltages of several thousand volts—easily lethal and capable of causing arc flash. Grounding the secondary circuit at one point limits these voltages to safe levels.

The Rock Creek SLD shows multiple CTs (500:5, 100:1, 25:1 ratios) and at least one PT (21kV/120V) feeding the protective relay cabinet and metering equipment. The primary circuits include 21 kV (definitely >300V to ground) and 2400V systems. Signal paths "TO COMPUTER" are shown with ground symbols, suggesting some grounding exists, but the specific single-point grounding location for each CT and PT secondary circuit is not explicitly identified.

Per 250.178, the equipment grounding conductor for instrument transformer secondary circuits shall not be smaller than 12 AWG copper or 10 AWG aluminum. Documentation should show: (1) the exact grounding point for each CT and PT secondary circuit, (2) confirmation that each secondary is grounded at only one point (to prevent circulating currents), and (3) proper sizing of the instrument grounding conductors.`,
        location: { sheet: 1, region: "Metering CTs" },
      },
      {
        id: "rc4",
        name: "System Bonding Jumper Locations",
        status: "warning",
        standard: "NEC 250.30(A)(1)",
        message: "Multiple jumpers may create objectionable current paths - verify locations",
        description: `NEC 250.30(A)(1) requires that for a grounded separately derived system, an unspliced system bonding jumper shall be installed at "any single point" on the separately derived system from the source to the first system disconnecting means. The code emphasizes that this connection must be made at only one location—having multiple system bonding jumpers creates parallel paths for neutral current through the equipment grounding system, resulting in objectionable current flow prohibited by 250.6.

This installation contains multiple separately derived systems: the 480V system derived from the 21kV/480V main transformer, the 2400V generator system, and the 208/120V and 240/120V auxiliary systems derived from the 45 kVA transformers. Each of these systems requires exactly one system bonding jumper connecting the grounded conductor (neutral) to the equipment grounding conductor and enclosure.

The SLD shows ground symbols at various locations throughout the system, but does not explicitly identify which location serves as the single point of system bonding for each separately derived system. This is particularly critical in a facility with multiple generators operating in parallel—if each generator has its own neutral-to-ground bond, objectionable currents will circulate through the grounding system.

Physical installation verification and a grounding system drawing should document: (1) the exact location of the system bonding jumper for each separately derived system, (2) confirmation that no additional neutral-to-ground connections exist on the load side of each bonding point, and (3) proper sizing of each system bonding jumper per Table 250.102(C)(1).`,
        location: { sheet: 1, region: "Grounding System" },
      },
      {
        id: "rc5",
        name: "Capacitor Discharge Means",
        status: "warning",
        standard: "NEC 460.6",
        message: "Must reduce to 50V in 1 minute - discharge means not shown on drawing",
        description: `NEC 460.6 requires that capacitors be provided with a means of discharging stored energy. Specifically, 460.6(A) mandates that the residual voltage of a capacitor shall be reduced to 50 volts nominal or less within 1 minute after the capacitor is disconnected from the source of supply. Furthermore, 460.6(B) requires that the discharge circuit be either permanently connected to the capacitor terminals OR provided with automatic means of connecting—manual switching is explicitly prohibited.

This requirement exists because capacitors can retain a dangerous electrical charge long after being disconnected from the circuit. A 150 kVAR capacitor bank at 480V stores significant energy (approximately 0.5 × C × V² joules), and contact with charged capacitor terminals can cause serious injury or death. The discharge resistors must be sized to reduce the voltage to safe levels within the one-minute timeframe.

The SLD shows a 150 kVAR power factor capacitor bank near Generator 1 but does not indicate the presence of discharge resistors or an automatic discharge circuit. Modern capacitor units often include integral discharge resistors, but this should be verified. If the capacitors do not have internal discharge resistors, external resistors permanently connected across the capacitor terminals must be installed. Documentation should confirm the discharge time calculation meets the 50V/1-minute requirement.`,
        location: { sheet: 1, region: "Capacitor Banks" },
      },
      {
        id: "rc6",
        name: "MV Capacitor Isolation",
        status: "warning",
        standard: "NEC 460.24(B)",
        message: "Visible-break isolation required for 2400V capacitor bank",
        description: `NEC 460.24(B)(1) requires that for capacitors rated over 1000 volts, a means shall be installed to isolate from all sources of voltage each capacitor, capacitor bank, or capacitor installation that will be removed from service as a unit. Critically, the code specifies that "the isolating means shall provide a visible gap in the electrical circuit adequate for the operating voltage."

A visible gap (also called visible break) is essential for personnel safety during maintenance. Unlike low-voltage systems where de-energization can be reasonably verified with a voltage tester, medium-voltage systems (2400V in this case) present significantly higher risk. The visible gap provides positive visual confirmation that the circuit is open and that no voltage can be present on the load side. This is a fundamental lockout/tagout safety principle for medium-voltage equipment.

The SLD shows a 200 kVAR power factor capacitor bank operating at 2400V near Generator 3, but does not explicitly show an isolation switch with visible-break capability. Typical solutions include drawout-type circuit breakers, disconnect switches with visible blades, or removable links. The physical installation should be verified to include a properly rated visible-break isolation device that can be locked in the open position for safe capacitor maintenance. Additionally, per 460.24(B)(2), if the isolating switch has no interrupting rating, it must be interlocked with the load-interrupting device or provided with caution signs per 490.22.`,
        location: { sheet: 1, region: "200 kVAR Bank" },
      },
      {
        id: "rc7",
        name: "Remote Emergency Stop",
        status: "warning",
        standard: "NEC 445.18(B)",
        message: "Required outside equipment room for >15kW generators",
        description: `NEC 445.18(B) requires that generators with ratings greater than 15 kW shall have an additional shutdown means located outside the equipment room or generator enclosure. This remote shutdown must be capable of: (1) disabling all prime mover start control circuits to render the prime mover incapable of starting, and (2) initiating a shutdown mechanism that requires a mechanical reset.

This requirement exists because during an emergency—such as a fire, mechanical failure, or electrical fault inside the generator room—personnel may not be able to safely enter the space to shut down the equipment. Having an external emergency stop allows operators or emergency responders to de-energize the generators from a safe location.

The Rock Creek facility has three generators (200 kW, 1.1 MW, and 450+ kVA), all of which exceed the 15 kW threshold. The SLD shows hydraulic control systems and various disconnects, but does not explicitly identify a remote emergency stop station located outside the powerhouse. Physical installation verification should confirm that a properly located and labeled emergency stop exists that meets all requirements of 445.18(B)(1) and (B)(2).`,
        location: { sheet: 1, region: "Generator Controls" },
      },
      {
        id: "rc8",
        name: "Self-Excitation Risk",
        status: "warning",
        standard: "NEC 705.40",
        message: "200kW induction generator + capacitor banks may cause severe overvoltage during islanding - verify protection timing",
        description: `When an induction generator is islanded (disconnected from the grid) while capacitor banks remain connected, the capacitors can provide the reactive power needed to maintain excitation. This phenomenon, called "self-excitation," can cause the generator to continue producing voltage—and potentially dangerous overvoltage conditions—even after the utility connection is lost.

The 200 kW induction generator at Rock Creek, combined with the 150 kVAR and 200 kVAR capacitor banks, presents a self-excitation risk. During an islanding event, voltage can rise rapidly (within cycles) to levels that damage equipment and create safety hazards.

Protection against self-excitation requires fast-acting voltage relays (Device 59) that can detect overvoltage and trip the generator before dangerous voltage levels are reached. The relay pickup settings, time delays, and breaker operating times must be coordinated to clear the condition quickly. Anti-islanding protection using frequency relays (Device 81) and rate-of-change-of-frequency relays (Device 81R) should also be verified to detect loss of grid connection.

Verification should confirm: (1) voltage relay settings will detect self-excitation overvoltage, (2) total clearing time (relay + breaker) is fast enough to prevent equipment damage, and (3) capacitor switching is coordinated with generator protection.`,
        location: { sheet: 1, region: "Induction Generator" },
      },
      // Passed checks
      {
        id: "rc9",
        name: "Generator Overcurrent Protection",
        status: "pass",
        standard: "NEC 445.12",
        message: "Protective relays (50/51) properly installed",
        description: `NEC 445.12 requires generators to be protected from overcurrent conditions. The SLD shows Device 50/51 (instantaneous and time-delay overcurrent) protection for the generators, which satisfies this requirement. Device 50 provides instantaneous protection for high-magnitude faults, while Device 51 provides time-delayed protection for lower-magnitude overcurrents, allowing for coordination with downstream devices.`,
        location: { sheet: 1, region: "Generator" },
      },
      {
        id: "rc10",
        name: "Transformer Protection",
        status: "pass",
        standard: "NEC Table 450.3",
        message: "Primary fuse (15A) and secondary breaker (400A) properly sized",
        description: `NEC Table 450.3(A) specifies the maximum overcurrent protection for transformers over 1000 volts. The 2,250 kVA (21kV/480V) main transformer is protected by a 15A pole-mounted fuse on the primary and a 400A breaker on the secondary. These ratings appear properly coordinated with the transformer impedance and loading to provide protection while avoiding nuisance trips during normal operation.`,
        location: { sheet: 1, region: "Transformer" },
      },
      {
        id: "rc11",
        name: "Anti-Islanding Protection",
        status: "pass",
        standard: "NEC 705.40",
        message: "Device 27/59 (voltage) and 81 (frequency) relays meet requirements",
        description: `NEC 705.40 requires that interconnected power production sources be automatically disconnected from the utility upon loss of utility voltage. The SLD shows Device 27 (undervoltage), Device 59 (overvoltage), and Device 81 (frequency) protective relays, which together provide the required anti-islanding protection. These relays detect abnormal voltage and frequency conditions that indicate loss of the utility connection and initiate generator disconnection.`,
        location: { sheet: 1, region: "Protection Panel" },
      },
      {
        id: "rc12",
        name: "Synchronization Equipment",
        status: "pass",
        standard: "NEC 705.143",
        message: "Device 25 meets requirements for synchronous generators",
        description: `NEC 705.143 requires that synchronous generators in a parallel system shall be provided with the necessary equipment to establish and maintain a synchronous condition. The SLD shows Device 25 (synchronizing or sync-check relay) in the protective relay cabinet, which verifies that voltage, frequency, and phase angle are within acceptable limits before permitting the generator breaker to close. This satisfies the basic NEC requirement for synchronization checking.`,
        location: { sheet: 1, region: "Sync Panel" },
      },
      {
        id: "rc13",
        name: "Point of Interconnection",
        status: "pass",
        standard: "NEC 705.12",
        message: "Clearly delineated with ownership boundary shown",
        description: `NEC 705.12 requires that the point of interconnection between a power production source and the utility be clearly identified. The Rock Creek SLD clearly shows the point of interconnection (POI) at the 21 kV level, with the ownership boundary between the facility and Pacific Power & Light Company explicitly marked. This clear delineation is essential for defining maintenance responsibilities and protection coordination between the utility and the facility.`,
        location: { sheet: 1, region: "POI" },
      },
      {
        id: "rc14",
        name: "Disconnect Means",
        status: "pass",
        standard: "NEC 705.20",
        message: "Visible-break disconnect provided at POI",
        description: `NEC 705.20 requires that a readily accessible, lockable disconnect be provided at the point of interconnection. The SLD shows a visible-break disconnect at the POI, allowing utility personnel to safely isolate the generation facility from the utility system for maintenance or emergency response. The disconnect is properly located and meets the requirements for utility access and lockout/tagout.`,
      },
      {
        id: "rc15",
        name: "Overcurrent Device Rating",
        status: "pass",
        standard: "NEC 705.65",
        message: "Bus rating adequate for backfeed current",
        description: `NEC 705.65 addresses the bus or conductor ratings for systems with backfeed from generation sources. The equipment ratings shown on the SLD appear adequate for the combination of utility supply and generator backfeed currents. Verification was made that the 480V distribution bus and associated equipment can handle the combined current from the main transformer and the generator outputs during parallel operation.`,
      },
      {
        id: "rc16",
        name: "Equipment Grounding",
        status: "pass",
        standard: "NEC 250.4",
        message: "Grounding electrode system documented",
        description: `NEC 250.4 outlines the general requirements for grounding and bonding. The SLD indicates a grounding electrode system is in place, with ground symbols shown at appropriate locations throughout the system. The grounding system provides the necessary path for fault currents to return to the source and operates protective devices, as well as limiting voltage potentials on equipment enclosures.`,
      },
      {
        id: "rc17",
        name: "Single-Line Diagram Complete",
        status: "pass",
        standard: "IEEE 141",
        message: "All major components and protection devices shown",
        description: `IEEE 141 (Red Book) provides recommended practices for electric power distribution in industrial plants, including guidance on single-line diagram content. The Rock Creek SLD shows all major components including generators, transformers, switchgear, protective devices, metering, and interconnection points. The diagram provides a comprehensive overview of the power system suitable for engineering analysis and operational reference.`,
      },
    ],
  },
  {
    id: "1",
    filename: "transformer_layout_v3.pdf",
    uploadedAt: "2026-01-10",
    fileSize: "2.4 MB",
    status: "complete",
    summary: { passed: 12, warnings: 3, failed: 2 },
    checks: [
      {
        id: "c1",
        name: "Safety Distance Compliance",
        status: "fail",
        standard: "NFPA 70E §130.7",
        message: "Transformer clearance not specified",
        location: { sheet: 2, region: "XFMR-1" },
      },
      {
        id: "c2",
        name: "Emergency Disconnect Labeling",
        status: "fail",
        standard: "NEC 408.4",
        message: "Missing disconnect location callout",
        location: { sheet: 1, region: "Panel A" },
      },
      {
        id: "c3",
        name: "Wire Gauge Specifications",
        status: "warning",
        standard: "NEC 310.16",
        message: "14 AWG label unclear on circuit 3B",
        location: { sheet: 2, region: "Circuit 3B" },
      },
      {
        id: "c4",
        name: "Panel Schedule Complete",
        status: "warning",
        standard: "NEC 220",
        message: "Missing load calculations for 3 circuits",
        location: { sheet: 1, region: "Panel Schedule" },
      },
      {
        id: "c5",
        name: "Revision History",
        status: "warning",
        standard: "CP-2.1",
        message: "Revision table incomplete",
        location: { sheet: 1, region: "Title Block" },
      },
      {
        id: "c6",
        name: "Electrical Symbol Labeling",
        status: "pass",
        standard: "IEEE 315",
        message: "All symbols properly labeled",
      },
      {
        id: "c7",
        name: "Grounding Requirements",
        status: "pass",
        standard: "NEC 250",
        message: "Grounding details shown correctly",
      },
      {
        id: "c8",
        name: "Voltage Ratings Displayed",
        status: "pass",
        standard: "NEC 110.22",
        message: "All voltage ratings clearly marked",
      },
      {
        id: "c9",
        name: "Title Block Complete",
        status: "pass",
        standard: "Company Std",
        message: "Title block contains all required info",
      },
      {
        id: "c10",
        name: "Scale Indicated",
        status: "pass",
        standard: "ANSI Y14.1",
        message: "Drawing scale properly noted",
      },
      {
        id: "c11",
        name: "Conductor Sizing",
        status: "pass",
        standard: "NEC 310.15",
        message: "Conductor sizes match load requirements",
      },
      {
        id: "c12",
        name: "Breaker Schedule",
        status: "pass",
        standard: "NEC 408.4",
        message: "Breaker ratings properly documented",
      },
      {
        id: "c13",
        name: "Arc Flash Labels",
        status: "pass",
        standard: "NFPA 70E",
        message: "Arc flash warning labels indicated",
      },
      {
        id: "c14",
        name: "Conduit Fill Ratio",
        status: "pass",
        standard: "NEC Chapter 9",
        message: "Conduit fill within limits",
      },
      {
        id: "c15",
        name: "Equipment Clearances",
        status: "pass",
        standard: "NEC 110.26",
        message: "Working clearances documented",
      },
      {
        id: "c16",
        name: "One-Line Diagram",
        status: "pass",
        standard: "IEEE 141",
        message: "Single line diagram complete",
      },
      {
        id: "c17",
        name: "Fault Current Rating",
        status: "pass",
        standard: "NEC 110.9",
        message: "Available fault current noted",
      },
    ],
  },
  {
    id: "2",
    filename: "substation_east.pdf",
    uploadedAt: "2026-01-09",
    fileSize: "1.8 MB",
    status: "complete",
    summary: { passed: 17, warnings: 0, failed: 0 },
    checks: [
      {
        id: "c1",
        name: "Safety Distance Compliance",
        status: "pass",
        standard: "NFPA 70E §130.7",
        message: "All clearances properly specified",
      },
      {
        id: "c2",
        name: "Emergency Disconnect Labeling",
        status: "pass",
        standard: "NEC 408.4",
        message: "Disconnect locations clearly marked",
      },
      {
        id: "c3",
        name: "Wire Gauge Specifications",
        status: "pass",
        standard: "NEC 310.16",
        message: "All wire gauges clearly labeled",
      },
      {
        id: "c4",
        name: "Panel Schedule Complete",
        status: "pass",
        standard: "NEC 220",
        message: "Load calculations complete",
      },
      {
        id: "c5",
        name: "Electrical Symbol Labeling",
        status: "pass",
        standard: "IEEE 315",
        message: "All symbols properly labeled",
      },
      {
        id: "c6",
        name: "Grounding Requirements",
        status: "pass",
        standard: "NEC 250",
        message: "Grounding system documented",
      },
      {
        id: "c7",
        name: "Voltage Ratings Displayed",
        status: "pass",
        standard: "NEC 110.22",
        message: "Voltage ratings clearly shown",
      },
      {
        id: "c8",
        name: "Title Block Complete",
        status: "pass",
        standard: "Company Std",
        message: "All title block fields complete",
      },
      {
        id: "c9",
        name: "Scale Indicated",
        status: "pass",
        standard: "ANSI Y14.1",
        message: "Scale properly documented",
      },
      {
        id: "c10",
        name: "Revision History",
        status: "pass",
        standard: "CP-2.1",
        message: "Revision history up to date",
      },
      {
        id: "c11",
        name: "Conductor Sizing",
        status: "pass",
        standard: "NEC 310.15",
        message: "Conductors properly sized",
      },
      {
        id: "c12",
        name: "Breaker Schedule",
        status: "pass",
        standard: "NEC 408.4",
        message: "Breaker schedule complete",
      },
      {
        id: "c13",
        name: "Arc Flash Labels",
        status: "pass",
        standard: "NFPA 70E",
        message: "Arc flash requirements met",
      },
      {
        id: "c14",
        name: "Conduit Fill Ratio",
        status: "pass",
        standard: "NEC Chapter 9",
        message: "Fill ratios within code",
      },
      {
        id: "c15",
        name: "Equipment Clearances",
        status: "pass",
        standard: "NEC 110.26",
        message: "All clearances documented",
      },
      {
        id: "c16",
        name: "One-Line Diagram",
        status: "pass",
        standard: "IEEE 141",
        message: "Single line complete and accurate",
      },
      {
        id: "c17",
        name: "Fault Current Rating",
        status: "pass",
        standard: "NEC 110.9",
        message: "Fault ratings documented",
      },
    ],
  },
  {
    id: "3",
    filename: "panel_schedule_B.pdf",
    uploadedAt: "2026-01-08",
    fileSize: "890 KB",
    status: "complete",
    summary: { passed: 10, warnings: 4, failed: 1 },
    checks: [
      {
        id: "c1",
        name: "Panel Schedule Complete",
        status: "fail",
        standard: "NEC 220",
        message: "5 circuits missing load calculations",
        location: { sheet: 1, region: "Panel B" },
      },
      {
        id: "c2",
        name: "Wire Gauge Specifications",
        status: "warning",
        standard: "NEC 310.16",
        message: "Some gauges difficult to read",
        location: { sheet: 1, region: "Circuits 10-15" },
      },
      {
        id: "c3",
        name: "Breaker Schedule",
        status: "warning",
        standard: "NEC 408.4",
        message: "2 breakers missing trip ratings",
        location: { sheet: 1, region: "Panel B" },
      },
      {
        id: "c4",
        name: "Conductor Sizing",
        status: "warning",
        standard: "NEC 310.15",
        message: "Verify conductor sizing for circuit 12",
        location: { sheet: 1, region: "Circuit 12" },
      },
      {
        id: "c5",
        name: "Revision History",
        status: "warning",
        standard: "CP-2.1",
        message: "Last revision date missing",
        location: { sheet: 1, region: "Title Block" },
      },
      {
        id: "c6",
        name: "Electrical Symbol Labeling",
        status: "pass",
        standard: "IEEE 315",
        message: "Symbols properly labeled",
      },
      {
        id: "c7",
        name: "Voltage Ratings Displayed",
        status: "pass",
        standard: "NEC 110.22",
        message: "Voltage ratings shown",
      },
      {
        id: "c8",
        name: "Title Block Complete",
        status: "pass",
        standard: "Company Std",
        message: "Title block adequate",
      },
      {
        id: "c9",
        name: "Scale Indicated",
        status: "pass",
        standard: "ANSI Y14.1",
        message: "Scale noted",
      },
      {
        id: "c10",
        name: "Grounding Requirements",
        status: "pass",
        standard: "NEC 250",
        message: "Grounding shown",
      },
      {
        id: "c11",
        name: "Arc Flash Labels",
        status: "pass",
        standard: "NFPA 70E",
        message: "Labels indicated",
      },
      {
        id: "c12",
        name: "Conduit Fill Ratio",
        status: "pass",
        standard: "NEC Chapter 9",
        message: "Fill ratios acceptable",
      },
      {
        id: "c13",
        name: "Emergency Disconnect Labeling",
        status: "pass",
        standard: "NEC 408.4",
        message: "Disconnect labeled",
      },
      {
        id: "c14",
        name: "Safety Distance Compliance",
        status: "pass",
        standard: "NFPA 70E §130.7",
        message: "Clearances noted",
      },
      {
        id: "c15",
        name: "Equipment Clearances",
        status: "pass",
        standard: "NEC 110.26",
        message: "Working space documented",
      },
    ],
  },
  {
    id: "4",
    filename: "grounding_plan.dwg",
    uploadedAt: "2026-01-07",
    fileSize: "3.1 MB",
    status: "complete",
    summary: { passed: 14, warnings: 1, failed: 0 },
    checks: [
      {
        id: "c1",
        name: "Grounding Requirements",
        status: "warning",
        standard: "NEC 250",
        message: "Ground rod spacing note unclear",
        location: { sheet: 1, region: "Grid Detail" },
      },
      {
        id: "c2",
        name: "Safety Distance Compliance",
        status: "pass",
        standard: "NFPA 70E §130.7",
        message: "Step potential distances shown",
      },
      {
        id: "c3",
        name: "Electrical Symbol Labeling",
        status: "pass",
        standard: "IEEE 315",
        message: "Ground symbols labeled",
      },
      {
        id: "c4",
        name: "Conductor Sizing",
        status: "pass",
        standard: "NEC 250.66",
        message: "Ground conductor sizing correct",
      },
      {
        id: "c5",
        name: "Title Block Complete",
        status: "pass",
        standard: "Company Std",
        message: "Complete",
      },
      {
        id: "c6",
        name: "Scale Indicated",
        status: "pass",
        standard: "ANSI Y14.1",
        message: "Scale shown",
      },
      {
        id: "c7",
        name: "Revision History",
        status: "pass",
        standard: "CP-2.1",
        message: "Up to date",
      },
      {
        id: "c8",
        name: "Equipment Clearances",
        status: "pass",
        standard: "NEC 110.26",
        message: "Clearances shown",
      },
      {
        id: "c9",
        name: "Voltage Ratings Displayed",
        status: "pass",
        standard: "NEC 110.22",
        message: "System voltage noted",
      },
      {
        id: "c10",
        name: "Arc Flash Labels",
        status: "pass",
        standard: "NFPA 70E",
        message: "Labels referenced",
      },
      {
        id: "c11",
        name: "Fault Current Rating",
        status: "pass",
        standard: "NEC 110.9",
        message: "Fault current documented",
      },
      {
        id: "c12",
        name: "One-Line Diagram",
        status: "pass",
        standard: "IEEE 141",
        message: "Reference drawing noted",
      },
      {
        id: "c13",
        name: "Conduit Fill Ratio",
        status: "pass",
        standard: "NEC Chapter 9",
        message: "N/A - grounding plan",
      },
      {
        id: "c14",
        name: "Emergency Disconnect Labeling",
        status: "pass",
        standard: "NEC 408.4",
        message: "Main disconnect referenced",
      },
      {
        id: "c15",
        name: "Wire Gauge Specifications",
        status: "pass",
        standard: "NEC 310.16",
        message: "Ground wire sizes noted",
      },
    ],
  },
];

export function getDocumentById(id: string): Document | undefined {
  return documents.find((doc) => doc.id === id);
}
