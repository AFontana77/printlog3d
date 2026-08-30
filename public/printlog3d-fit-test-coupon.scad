// PrintLog3D — stepped fit-test coupon
// https://www.printlog3d.com/workshop/3d-print-tolerance
//
// WHAT THIS IS
// A plate of holes around one nominal size, each a step larger than the last.
// Print it in the material and orientation you will use for the real part, push
// your actual hardware into each hole, and note which one fits the way you need.
// That number is your clearance, for your machine, in that material.
//
// WHY IT IS SOURCE AND NOT AN STL
// A clearance figure is a property of your printer, not of this file. Handing
// you a fixed mesh would hide the two parameters that matter behind geometry you
// cannot adjust. Change NOMINAL and STEP below and recompile.
//
// WHAT WE HAVE AND HAVE NOT DONE
// This is offered as a parametric recipe. We have NOT test-printed it, and this
// site does not publish measurements it did not take. The geometry is simple and
// inspectable on purpose, so you can read it before you print it.
//
// HOW TO USE
// 1. Open in OpenSCAD (free, openscad.org). Set NOMINAL to your feature size.
// 2. Render (F6) and export STL.
// 3. Print flat on the bed, in the real material, at your normal settings.
// 4. Try your hardware in each hole, smallest first.
// 5. The first hole that behaves the way you want is your clearance.
//    Read it off the label, or count holes from the left.
//
// Holes print undersized because a circle is approximated by straight segments.
// That is geometry rather than a calibration fault, so expect the usable hole to
// sit a step or two above nominal even on a well-tuned machine.

/* [Fit test] */

// Diameter of the feature you actually care about, in mm.
NOMINAL = 6.0;

// How much bigger each hole is than the one before it, in mm.
STEP = 0.10;

// How many holes to print.
COUNT = 6;

// Start this far below nominal. 0 means the first hole is nominal.
START_OFFSET = 0.0;

/* [Plate] */

// Plate thickness. Keep it shorter than your hardware so it seats fully.
THICKNESS = 4.0;

// Wall of material around each hole.
MARGIN = 4.0;

// Emboss the clearance value beside each hole.
LABELS = true;

// Depth of the embossed text.
LABEL_DEPTH = 0.6;

/* [Hidden] */
$fn = 96;

pitch = NOMINAL + STEP * COUNT + MARGIN * 2;
plate_w = pitch * COUNT;
plate_d = NOMINAL + MARGIN * 2 + (LABELS ? 6 : 0);

module coupon() {
    difference() {
        // Body
        translate([0, 0, 0])
            cube([plate_w, plate_d, THICKNESS]);

        // Holes, left to right, each one STEP larger than the last.
        for (i = [0 : COUNT - 1]) {
            d = NOMINAL + START_OFFSET + STEP * i;
            translate([pitch * (i + 0.5),
                       plate_d - MARGIN - NOMINAL / 2,
                       -1])
                cylinder(h = THICKNESS + 2, d = d);
        }

        // Labels: the clearance above nominal, in hundredths of a millimetre.
        // Printed as a plain integer so it stays readable at small sizes.
        if (LABELS) {
            for (i = [0 : COUNT - 1]) {
                clearance_hundredths = round((START_OFFSET + STEP * i) * 100);
                translate([pitch * (i + 0.5),
                           3.0,
                           THICKNESS - LABEL_DEPTH])
                    linear_extrude(height = LABEL_DEPTH + 1)
                        text(str(clearance_hundredths),
                             size = 4,
                             halign = "center",
                             valign = "baseline");
            }
        }
    }
}

coupon();

// A note on reading the labels: they are hundredths of a millimetre ABOVE
// nominal, not the hole diameter. A hole labelled 30 is NOMINAL + 0.30mm.
// The label is deliberately the number you are looking for, rather than a
// diameter you would have to subtract from.
