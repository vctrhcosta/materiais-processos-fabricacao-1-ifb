# Deep Research: Pigment Milling as Mechanical Shear and Comminution versus Conventional Machining in Paint-Industry Equipment Manufacture

> Documento de referência — pesquisa completa salva para consulta acadêmica
> Data: 2026-03-31

---

## Executive Summary

Pigment "milling" in coatings is best understood as a *particle-scale comminution and dispersion* operation driven by repeated stress events—dominated by combinations of shear (cisalhamento), impact (impacto) and attrition/friction (atrito)—whose performance is commonly rationalised through *specific energy* and stress-intensity/stress-number frameworks developed for stirred-media mills.

Conventional machining, by contrast, is a *workpiece-scale material-removal* paradigm in which chip (cavaco) formation, cutting forces, heat generation and surface integrity are central; abrasive machining (e.g., grinding) occupies an intermediate position where innumerable abrasive grains produce micro-cutting, ploughing and rubbing, generating small chips while delivering fine tolerances and surface finishes.

The two domains intersect industrially because paint-industry unit operations (bead mills, three-roll mills, high-speed dispersers, extruders, reactors) depend on *machined components*—shafts, rotors, rolls, screws, barrel bores, seal faces—whose geometry, tolerance, and surface texture strongly condition flow, stress transmission, heat generation, wear, contamination risk and therefore dispersion outcomes and energy efficiency.

---

## 1. Conceptual Framing and Definitions

### 1.1 Definitions and Boundary Conditions

**Pigment milling (wet grinding / dispersion)** in coatings refers to operations that:
- (i) wet pigment agglomerates/aggregates with a binder/solvent medium
- (ii) apply mechanical stresses to *deagglomerate* and, depending on pigment chemistry and target, sometimes *deaggregate* (break down aggregates toward primary particles)

Industrial practice distinguishes "dispersion" objectives (breaking agglomerates, stabilising surfaces) from "true comminution" (creating substantial new surface by fracture), and this distinction matters because coatings often seek *controlled PSD and stability* rather than indiscriminate fracture.

**Conventional machining** (turning, milling, drilling, threading) is a class of manufacturing processes where a tool removes material from a *solid workpiece* to create specified geometry; **grinding** and related abrasive processes are material-removal operations in which abrasive grains act as many cutting points, with mechanics described at grain scale by cutting–ploughing–rubbing regimes.

### 1.2 Literature Base and Source Hierarchy

For an academically defensible comparison, the most reliable foundations come from:
- Peer-reviewed stirred-media mill theory and stress models (e.g., frameworks relating product fineness/PSD to specific energy and stress intensity/number)
- Coatings/pigment-processing texts positioning bead mills, three-roll mills and dispersers in millbase production workflows
- Peer-reviewed machining and abrasive mechanics (chip formation in cutting; micro-mechanisms in grinding)
- Standards for measurement and reporting (particle sizing; fineness-of-grind; rheology; surface texture)
- Manufacturer/application notes for practice-oriented, operating ranges and contamination/wear considerations

---

## 2. Governing Physics and Mechanics

### 2.1 Pigment Milling as Shear–Impact–Attrition Comminution

#### 2.1.1 Stress Events, Stress Intensity, Stress Number, and Specific Energy

In stirred-media mills (e.g., bead mills), comminution is often modelled as a *statistical sequence of stress events* in which beads collide with beads and particles in high-gradient flow regions. The controlling variables are:

- **Stress intensity**: an event-level energy measure (linked to bead size, bead density, stirrer tip speed, elastic properties) that characterises the energy transferred per stressing event
- **Stress number**: how many stressing events a particle experiences (or distribution thereof) during residence
- **Specific energy** (energy per unit mass of product), used both as a performance correlate and as a scale-up variable

A key empirical–mechanistic observation is that for a given stress intensity, a relationship exists between product fineness and specific energy, but operating parameters can shift that relationship by altering intensity and stressing conditions.

#### 2.1.2 Fracture Mechanics and Energy Partitioning

At the particle level, breakage is constrained by fracture energetics: creating new surfaces requires energy, and much input energy in comminution is not consumed as fracture surface energy (lost instead to heat, viscous dissipation, sound, plastic deformation, etc.).

Classical comminution "laws" (Kick, Rittinger, Bond) are historically empirical ways to relate energy to size reduction across different size regimes; modern practice treats them as approximations and supplements them with stressing models and population balances.

A coatings-relevant example is TiO₂: optical scattering considerations motivate targeting submicron size/PSD control; studies note optimum scattering for TiO₂ around 0.2–0.4 μm, with stirred-media milling designed to hit a median near 0.3 μm with narrow PSD.

### 2.2 Conventional Machining Mechanics and Abrasive Cutting

#### 2.2.1 Chip Formation and the Cutting-Energy View

In orthogonal cutting theory, chip formation arises from intense shear deformation along a primary shear zone, with tool–chip friction and energy partitioning governing forces, temperatures and chip morphology. Contemporary studies continue to analyse chip formation under different cutting geometries and conditions, reflecting the ongoing relevance of chip morphology (continuous vs segmented), shear angle, and specific cutting energy to machinability and surface outcomes.

#### 2.2.2 Grinding as Many-Grain Micro-Cutting

Abrasive machining differs in that cutting edges are geometrically undefined, distributed, and transient. At the grain scale, material removal is commonly described as a mixture of **cutting, ploughing and rubbing**, whose proportions depend on undeformed chip thickness relative to edge radius, grain protrusion, and local conditions.

### 2.3 Rigorous Comparison of Mechanisms

A crucial academic boundary: **pigment milling does not produce chips in the machining sense** because there is no defined workpiece geometry being cut; the "product" is a *PSD and dispersion state*. Conventional machining, conversely, treats chip formation, chip evacuation, and chip morphometrics as intrinsic process characteristics.

---

## 3. Scale Differences, Measurable Outputs, and Typical Values

### 3.1 Comparative Table

| Process | Dominant Mechanism | Characteristic Scale | Primary Measurable Outputs | Indicative Values |
|---|---|---|---|---|
| Bead mill | Statistical stress events; shear/impact/attrition | 10⁻⁷–10⁻⁵ m particles; mm beads | PSD (D10/D50/D90); specific energy; wear contamination | TiO₂ target ~0.3 μm median |
| Three-roll mill | High shear in narrow nip; deagglomeration | 10⁻⁶–10⁻³ m film thickness; roll gap μm–100 μm | Dispersion quality; agglomerate break-down | CNT length reduction from ~10 μm to ~1–4 μm |
| High-speed disperser | Turbulent high-shear zone near blade | mm-scale blade; local high gradients | Pre-dispersion quality; viscosity evolution | Tip speed ~4.000–6.000 ft/min |
| Turning (lathe) | Shear-plane cutting; continuous/segmented chip | mm–m workpiece | Diameter, roundness, runout; Ra | Ra ~0.1–0.4 μm achievable |
| Milling (CNC) | Intermittent cutting; varying chip thickness | mm–m workpiece | Flatness, perpendicularity; Ra | Ra ~1.6–3.2 μm (finishing) |
| Grinding | Multi-grain micro-cutting + ploughing + rubbing | μm-scale grain engagement | Tight tolerances; Ra/Rz | Ra ~0.1–1.6 μm |
| Drilling/threading | Chip formation in confined geometry | mm-scale holes | Hole size, position; thread quality | Fits H7/h6 standardised |

---

## 4. Equipment Examples and the Machining–Performance Linkage

### 4.1 Bead Mills (Stirred-Media Mills)

Key machined parts:
- **Rotor/agitator shaft** (turned and often ground for runout and seal compatibility)
- **Rotor/stator or disc elements** (machined profiles influencing local shear fields)
- **Grinding chamber bore** (machined and sometimes lined)
- **Screens/separators** and **nozzles** (precision features)

### 4.2 Three-Roll Mills

Key machined parts:
- **Rolls/cylinders**: typically ground to establish roundness, straightness and a controlled surface texture
- **Bearing seats and housings**: turned/milled for alignment
- **Scraper knives**: machined edges

### 4.3 Cowles-Type High-Speed Dispersers

Key machined parts:
- **Shaft** (turning; runout control to reduce vibration)
- **Sawtooth blade/impeller** (machined teeth geometry)
- **Tank interfaces / baffles**

### 4.4 Twin-Screw Extruders (for powder coatings)

Key machined parts:
- **Screws** (complex machining and grinding; wear-resistant materials/coatings)
- **Barrels** (honed/ground bores; tight clearances)
- **Die plates** (machined flow geometries)

### 4.5 Reactors (Resin Synthesis)

Key machined parts:
- **Agitator shaft; impeller; nozzles; seal faces**
- Turning + grinding (shafts); milling (impellers); drilling/threading (nozzles)

### 4.6 Mapping Table: Equipment → Machined Component → Machining Process → Performance Impact

| Equipment | Machined component | Typical machining processes | Common materials | Performance linkage |
|---|---|---|---|---|
| Bead mill | Rotor shaft; rotor discs; chamber bore/liners; media separator | Turning + cylindrical grinding; milling; precision drilling | Stainless steels; wear-resistant internals; ceramic options | Runout/alignment affects vibration → changes stressing distributions; surface wear → contamination |
| Three-roll mill | Rolls; bearing seats; scraper knives | Grinding (roll diameter/roundness/finish); turning (journals); milling (housings) | Hardened/chrome-plated steel or ceramics | Roll surface and gap uniformity determine shear uniformity and heat transfer |
| Cowles disperser | Shaft; blade teeth; tank-mounted interfaces | Turning (shaft); milling/finishing (blade); drilling/threading (mounts) | 316 stainless options; hard coatings | Impeller geometry and surface condition influence local turbulence/shear |
| Twin-screw extruder | Screws; barrel bores; die plates | Turning/milling + grinding (screws); honing/grinding (barrels) | Wear-resistant steels/coatings; modular designs | Clearance control affects shear heating, residence time distribution |
| Reactor (resin) | Agitator shaft; impeller; nozzles; seal faces | Turning + grinding (shafts); milling (impellers); drilling/threading (nozzles) | Stainless steels for corrosion/thermal resistance | Mechanical integrity and surface finish influence mixing, fouling, cleanability |

---

## 5. Instrumentation and Methods

### 5.1 Pigment Milling Characterisation
- **Laser diffraction PSD** (ISO 13320): applicability window ~0.1 μm–3 mm
- **SEM/TEM**: identify morphology changes
- **Hegman fineness-of-grind** (ASTM D1210): fast production control
- **Rheometry** (ASTM D2196): apparent viscosity and non-Newtonian behaviour

### 5.2 Machining Characterisation
- **Surface texture**: stylus profilometry (profile parameters Ra/Rz; areal texture frameworks)
- **Dimensional verification**: CMM, micrometers, bore gauges, roundness/cylindricity
- **Dynamometry**: piezoelectric dynamometers for multi-axis cutting forces

---

## 6. Research Gaps at the Milling–Machining Interface

- **Quantified linkage between machined surface texture of internals and effective stressing distributions** in bead mills
- **Unified contamination models** coupling wear particle generation (from rolls/media/liners) to dispersion chemistry
- **Energy partitioning in real formulations** (high-solids, viscoelastic binders)

---

## 7. Selected Bibliography

1. Kwade, A. (1999). Wet comminution in stirred media mills — research and its practical application. *Powder Technology*.
2. Kwade, A.; Schwedes, J. (2001). Stress intensity in stirred media mills and its effect on specific energy requirement. *International Journal of Mineral Processing*.
3. Ohenoja, K. et al. (2013). Effect of operational parameters and stress energies on the particle size and width of PSD of pigment TiO₂ in stirred media milling.
4. Krzosa, R. et al. (2025). Titanium dioxide breakage in a bead mill: experimental and modelling study. *Powder Technology*.
5. Ernst, H.; Merchant, E. (1945). Mechanics of the metal cutting process / chip formation and friction foundations. *Journal of Applied Physics*.
6. Werchfeni, A. et al. (2025). Micro-scale abrasive material removal via cutting, ploughing, and rubbing mechanisms. *Wear (Elsevier)*.
7. ISO 13320 (2020). Particle size analysis — Laser diffraction methods.
8. ASTM D1210 (reapproved 2022). Fineness of Dispersion of Pigment-Vehicle Systems by Hegman-Type Gage.
9. ASTM D2196 (current). Rheological properties of non-Newtonian materials by rotational viscometer.
10. EXAKT Advanced Technologies GmbH. Three-roll mill: roll material options and contamination control considerations.
