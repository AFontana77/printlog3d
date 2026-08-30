import type { GearSpec } from '@/components/GearAdvice';
import { MATERIAL_PROFILES } from '@/lib/materials';

/**
 * The workshop layer.
 *
 * PrintLog3D's core identity is filament settings. This is the surrounding
 * workflow: what you need before, during and after the print. It is deliberately
 * a second gateway rather than a replacement — the material index stays the
 * front door.
 *
 * The journey is a real sequence, not a taxonomy invented to hold pages:
 *
 *   CALIBRATE -> FIRST LAYER -> INSPECT -> CLEAN -> FINISH -> ASSEMBLE
 *                                                     (what happens to the part)
 *   STORE -> MAINTAIN                                  (what happens to the kit)
 *
 * Calibrate and first layer were added in M1.5 against measured demand: printer
 * calibration is 2,400/month and bed adhesion sums to roughly 1,100 across its
 * terms. They sit before inspect because that is where they sit in real life —
 * both are things you do before a part exists to measure.
 *
 * SOURCING, unchanged from the material layer: everything here is either
 * mechanical fact, manufacturer-published practice, or plainly-labelled
 * judgement. Nothing was tested by us. Where a number varies by hardware — insert
 * hole diameters above all — the page says so instead of publishing a magic
 * figure that will not fit somebody's insert.
 */

export type Stage =
  | 'calibrate'
  | 'adhesion'
  | 'inspect'
  | 'clean'
  | 'finish'
  | 'assemble'
  | 'store'
  | 'maintain';

export const STAGES: { id: Stage; label: string; verb: string; icon: string }[] = [
  { id: 'calibrate', label: 'Calibrate', verb: 'Make the machine print the size you asked for.', icon: 'calibration' },
  { id: 'adhesion', label: 'First layer', verb: 'Get it to stick, and stay stuck.', icon: 'bed-temperature' },
  { id: 'inspect', label: 'Inspect', verb: 'Did it come out the right size?', icon: 'search' },
  { id: 'clean', label: 'Clean up', verb: 'Get the supports and brim off without damage.', icon: 'support-removal' },
  { id: 'finish', label: 'Finish', verb: 'Take the layer lines down, then colour it.', icon: 'layer-adhesion' },
  { id: 'assemble', label: 'Assemble', verb: 'Threads and joints that survive being used.', icon: 'settings' },
  { id: 'store', label: 'Store filament', verb: 'Keep the next spool printable.', icon: 'drying' },
  { id: 'maintain', label: 'Maintain', verb: 'Keep the nozzle doing its job.', icon: 'nozzle-temperature' },
];

export type WorkshopResource = {
  slug: string;
  stage: Stage;
  title: string;
  /** Used as the h1. Should read as the reader's question, answered. */
  heading: string;
  metaTitle: string;
  metaDescription: string;
  /** Answer-first paragraph. The block an assistant should be able to quote. */
  lede: string;
  sections: { heading: string; body: string[] }[];
  gear: GearSpec[];
  faq: { question: string; answer: string }[];
  /** Material slugs this resource is especially relevant to. */
  relatedMaterials: string[];
  /**
   * Key into SEQUENCES. Present only where the order of operations is the
   * actual content -- a diagram on a page that is already a list of facts is
   * decoration, and M1.4 deferred these rather than ship that.
   */
  diagram?: 'heatSetInsert' | 'fitTest' | 'filamentStorage' | 'coldPull';
  /**
   * A file the reader can take away. Deliberately source or a worksheet
   * rather than a mesh: a clearance figure is a property of the reader's
   * printer, so a fixed STL would hide the two parameters that matter.
   */
  download?: { path: string; label: string; format: string; note: string };
};

export const WORKSHOP: WorkshopResource[] = [
  // ---------------------------------------------------------------- INSPECT
  {
    slug: '3d-print-tolerance',
    diagram: 'fitTest',
    download: {
      path: '/printlog3d-fit-test-coupon.scad',
      label: 'Stepped fit-test coupon',
      format: 'OpenSCAD source',
      note: 'Parametric source, not a mesh, so you can set the nominal size and the step to your own part. We have not test-printed it, and this site does not publish measurements it did not take.',
    },
    stage: 'inspect',
    title: 'Tolerance and measurement',
    heading: '3D print tolerance: what fits and what does not',
    metaTitle: '3D print tolerance and clearance: what actually fits',
    metaDescription:
      'Why a printed dimension differs from the CAD dimension, how much clearance a press fit or a sliding fit really needs, and how to measure a part to find out before you print the mating half.',
    lede:
      'A printed part is almost never the size the model says. FDM typically holds around plus or minus 0.5 percent with a practical floor near half a millimetre, so a 20mm feature landing at 20.15mm is normal rather than broken. Measure with digital calipers, measure the same feature in three places, and design clearance in rather than chasing the last tenth.',
    sections: [
      {
        heading: 'Measure the same feature three times',
        body: [
          'A single reading tells you almost nothing. Layer lines, seam placement and slight elephant-foot at the base all shift a measurement depending on exactly where the jaws land. Take three readings along a feature and use the spread, not the average, to judge whether the part is usable.',
          'If the three readings differ by more than about 0.1mm, the problem is the print rather than the measurement, and the usual causes are an unlevelled first layer, over-extrusion, or the part shifting slightly during printing.',
        ],
      },
      {
        heading: 'Holes come out undersized. Always.',
        body: [
          'A circular hole printed on its side is approximated by straight line segments, and those segments cut inside the true circle. The practical result is that a hole prints smaller than nominal, typically by 0.1 to 0.4mm depending on diameter, layer height and nozzle size.',
          'This is geometry, not calibration, so it does not go away when the printer is dialled in. Either oversize holes in CAD, or plan to drill or ream them afterwards. For anything that has to accept a bearing or a bolt, drilling to size is faster and more repeatable than tuning.',
        ],
      },
      {
        heading: 'How much clearance to design in',
        body: [
          'There is no universal clearance number, and any site that gives you one is guessing on your behalf. The figure depends on your printer, the material, the print orientation, how well extrusion is calibrated and the geometry itself, and those vary more between two machines than the number would suggest.',
          'What does transfer is the method. Print a test coupon with the same feature at several clearances, on the same machine, in the same material and orientation as the real part. A stepped fit-test print takes twenty minutes and gives you a number that is true for your setup rather than for somebody else\'s.',
          'As a starting point for that test rather than as an answer: a sliding fit generally needs noticeably more clearance than people expect, and a press fit needs less material removed than a printed hole already loses to segmentation. Start the coupon around a couple of tenths of a millimetre either side of nominal and bracket from there.',
        ],
      },
      {
        heading: 'The coupon, if you would rather model it yourself',
        body: [
          'The geometry is deliberately trivial, and you do not need our file to build it. A flat plate, a row of holes around your nominal size, each one a fixed step larger than the last, and a number beside each hole saying how far above nominal it sits.',
          'Six holes at 0.10mm steps covers the range most fits land in. Make the plate a little thinner than the hardware you are testing, so a bolt or a rod seats all the way through, and leave about 4mm of material around each hole so a thin wall is not what fails.',
          'Print it flat, in the real material, at the settings you will use for the real part. A coupon printed in PLA tells you very little about a PETG fit, and one printed on its side tells you very little about a hole printed flat.',
        ],
      },
      {
        heading: 'What calipers actually need to do',
        body: [
          'Any digital caliper reading to 0.01mm is enough for printed parts. The precision is not the limiting factor; the print is. What matters more is that the jaws are flat and the zero holds when you close them, because a caliper that drifts makes every reading a guess.',
          'Do not treat a workshop caliper as metrology. It is repeatable enough to tell you whether a part will fit, which is the question you actually have.',
        ],
      },
    ],
    gear: [
      {
        category: 'Digital calipers',
        requirement: 'Reads to 0.01mm, holds zero when closed',
        why: 'The one tool that turns "it looks about right" into a number. Resolution beyond 0.01mm buys nothing on a printed part, because the print varies more than the instrument does.',
        searchTerms: 'digital calipers 6 inch',
      },
    ],
    faq: [
      {
        question: 'How accurate are 3D printed parts?',
        answer:
          'FDM typically holds about plus or minus 0.5 percent of the dimension, with a practical floor near half a millimetre. That means a 100mm part can be half a millimetre out and still be a normal print.',
      },
      {
        question: 'Why is my printed hole too small?',
        answer:
          'Circular holes are approximated by straight segments that cut inside the true circle, so they print undersized by roughly 0.1 to 0.4mm. It is geometry rather than a calibration fault, so oversize the hole in CAD or drill it to size afterwards.',
      },
      {
        question: 'What tolerance can a 3D printer hold?',
        answer:
          'Roughly plus or minus 0.5 percent of the dimension, with a practical floor near half a millimetre on FDM. That is typical rather than guaranteed, and it varies with machine, material and orientation.',
      },
      {
        question: 'How much clearance for a press fit in a 3D print?',
        answer:
          'There is no universal number, because it depends on your printer, material, orientation and extrusion calibration. Print a stepped fit-test coupon in the same material and orientation as the real part and read the answer off that; it takes twenty minutes and the number is true for your setup.',
      },
      {
        question: 'Do I need expensive calipers for 3D printing?',
        answer:
          'No. Any digital caliper reading to 0.01mm is more precise than the print it is measuring. Flat jaws and a stable zero matter more than the price.',
      },
    ],
    relatedMaterials: ['pla', 'petg', 'abs'],
  },

  // ------------------------------------------------------------------ CLEAN
  {
    slug: 'removing-supports-and-deburring',
    stage: 'clean',
    title: 'Supports and deburring',
    heading: 'Removing supports and cleaning up a print',
    metaTitle: 'Removing supports and deburring 3D prints without damaging them',
    metaDescription:
      'How to get supports, brim and elephant foot off a printed part cleanly, which tools do it without gouging, and when to fix the problem in the slicer instead.',
    lede:
      'Most support damage happens because the part is cold and the tool is wrong. Cut supports away with flush cutters rather than pulling them, work from the outside in, and deburr the first-layer edge with a rotating deburring tool rather than a knife. If supports are consistently hard to remove, the fix is slicer settings, not force.',
    sections: [
      {
        heading: 'Cut, do not pull',
        body: [
          'Pulling a support tears it away along whatever path is weakest, which is frequently through the part surface rather than the interface layer. Flush cutters let you sever the support where it meets the part and then lift it away with no tension on the surface.',
          'Work from the outermost supports inward. Removing the outside first gives the remaining structure somewhere to flex, which lowers the chance of levering against a thin wall.',
        ],
      },
      {
        heading: 'Elephant foot and the first-layer edge',
        body: [
          'The bottom edge of a print is usually slightly wider than the rest, because the first layer is squashed into the plate. That lip stops flat parts sitting flush and stops parts mating properly.',
          'A rotating deburring tool takes it off in one pass and follows the edge without digging in, which is exactly what a knife does not do. It is also the right tool for the inside of printed holes, where a chamfer helps a bolt start straight.',
        ],
      },
      {
        heading: 'When to fix it in the slicer instead',
        body: [
          'If supports fuse to the part, raise the support Z distance so the interface is not welded on. If they snap off leaving stubs, they were too sparse. If they mark the surface badly on a part that matters, print it in a different orientation so the surface faces up.',
          'A part that needs twenty minutes of cleanup every time is a slicing problem wearing a post-processing costume.',
        ],
      },
    ],
    gear: [
      {
        category: 'Flush cutters',
        requirement: 'Genuinely flush jaws, sprung, small enough to reach in',
        why: 'The difference between severing a support and tearing it off the surface. Ordinary side cutters leave a stub because the jaws do not close flat.',
        searchTerms: 'flush cutters 3d printing',
      },
      {
        category: 'Deburring tool',
        requirement: 'Rotating blade head that swivels',
        why: 'Takes the elephant-foot lip off a first-layer edge and chamfers printed holes in one pass. A swivelling head follows the edge instead of gouging across it, which is why a hobby knife is the wrong tool here.',
        searchTerms: 'deburring tool set',
      },
    ],
    faq: [
      {
        question: 'How do you remove supports without damaging the print?',
        answer:
          'Cut them with flush cutters rather than pulling, and work from the outermost supports inward so the remaining structure can flex. If they are fused to the surface, increase the support Z distance in the slicer rather than pulling harder.',
      },
      {
        question: 'What is elephant foot on a 3D print?',
        answer:
          'The slightly wider lip around the bottom edge, caused by the first layer being squashed into the build plate. A rotating deburring tool removes it cleanly, and lowering the first-layer squash or enabling elephant-foot compensation prevents it.',
      },
    ],
    relatedMaterials: ['pla', 'petg', 'abs', 'tpu'],
  },

  // ----------------------------------------------------------------- FINISH
  {
    slug: 'sanding-and-finishing-3d-prints',
    stage: 'finish',
    title: 'Sanding and finishing',
    heading: 'Sanding and finishing a 3D print',
    metaTitle: 'Sanding 3D prints: grits, wet sanding and what each material allows',
    metaDescription:
      'How to sand layer lines out of a printed part, which grit sequence actually works, why PLA and PETG behave differently under abrasive, and which materials smooth chemically instead.',
    lede:
      'Sanding a print is a grit sequence, not an act of force. Start around 120 to knock the layer lines down, then step through roughly 220, 400 and 800, never skipping more than one step. Sand wet where the material allows it, because dry sanding generates heat and heat is what turns PLA gummy.',
    sections: [
      {
        heading: 'Heat is the enemy, not the grit',
        body: [
          'PLA softens around 60C, and a power sander or an aggressive hand pass on dry paper gets there easily. The surface goes from matte to smeared and no finer grit will recover it.',
          'Wet sanding carries the heat away and stops the paper loading with melted plastic. A bowl of water and a drop of dish soap is the whole technique.',
        ],
      },
      {
        heading: 'The grit sequence',
        body: [
          'Each grit removes the scratches left by the one before it, so skipping steps means the final polish sits on top of visible 120-grit tracks. 120, 220, 400, 800 is enough for a part that will be painted. Continue to 1500 and beyond only if the part is meant to be glossy in its own right.',
          'Change direction ninety degrees at each step. When you can no longer see scratches running the previous way, that grit is finished.',
        ],
      },
      {
        heading: 'Materials that smooth chemically instead',
        body: [
          'ABS smooths in acetone vapour, which melts the outer surface into a gloss without touching the geometry underneath. PVB does the same in isopropyl alcohol, which is far less hazardous and needs no vapour setup.',
          'PLA has no practical solvent, and PETG resists nearly everything convenient, so both are mechanical-only. That is a real reason to choose ABS or PVB for a part whose finish matters more than its convenience.',
        ],
      },
    ],
    gear: [
      {
        category: 'Wet/dry sanding assortment',
        requirement: 'Roughly 120 through 1000 grit, wet/dry rated',
        why: 'The sequence matters more than any single sheet, so buy the range rather than a single grade. Wet/dry backing survives the water that stops PLA gumming up.',
        searchTerms: 'wet dry sandpaper assortment 120 to 1000 grit',
      },
      {
        category: 'Needle file set',
        requirement: 'Assorted profiles, fine cut',
        why: 'Sandpaper cannot reach inside a small hole or a tight internal corner. A round and a flat needle file do the work sandpaper cannot get to.',
        searchTerms: 'needle file set',
      },
    ],
    faq: [
      {
        question: 'What grit should I use to sand a 3D print?',
        answer:
          'Start around 120 to remove layer lines, then work through 220, 400 and 800. Do not skip more than one step, because each grit exists to remove the scratches left by the previous one.',
      },
      {
        question: 'Can you wet sand PLA?',
        answer:
          'Yes, and you should. PLA softens around 60C and dry sanding generates enough heat to smear the surface. Water keeps the temperature down and stops the paper clogging.',
      },
      {
        question: 'Which filaments can be smoothed with chemicals?',
        answer:
          'ABS smooths in acetone vapour and PVB smooths in isopropyl alcohol. PLA and PETG have no practical solvent finish and must be sanded mechanically.',
      },
    ],
    relatedMaterials: ['pla', 'abs', 'pvb', 'petg'],
  },

  // --------------------------------------------------------------- ASSEMBLE
  {
    slug: 'heat-set-inserts',
    diagram: 'heatSetInsert',
    stage: 'assemble',
    title: 'Heat-set inserts',
    heading: 'Heat-set threaded inserts in 3D printed parts',
    metaTitle: 'Heat-set inserts for 3D prints: hole size, installation and what goes wrong',
    metaDescription:
      'How brass heat-set inserts work in printed parts, how to find the right hole diameter for your specific insert, why the wall bulges, and what changes between PLA and PETG.',
    lede:
      'A printed thread strips. A brass heat-set insert melts into the plastic and gives you a metal thread that survives being undone repeatedly, which is the difference between a prototype and a part. The hole diameter is the whole job, and it comes from your insert manufacturer rather than from a universal number, because insert geometry varies enough that a figure copied from elsewhere will either fall out or split the wall.',
    sections: [
      {
        heading: 'The hole diameter comes from your insert',
        body: [
          'Heat-set inserts are knurled, tapered and dimensioned differently between manufacturers, and the recommended hole is a property of that specific insert rather than of the thread size. A number that works perfectly for one brand of M3 insert will be loose or splitting in another.',
          'Find the figure in your insert supplier datasheet and use it. If none is published, test on a scrap coupon printed in the same material and orientation before committing to the real part. This site does not publish a universal hole table, because there is no honest one to publish.',
        ],
      },
      {
        heading: 'Temperature, and going slowly',
        body: [
          'Set the iron well above the material glass transition but well below its decomposition point. For PLA that generally means somewhere around 200 to 230C, and for PETG a little higher; the exact figure matters less than going slowly enough for the heat to conduct into the plastic instead of pooling at the tip.',
          'Let the insert sink under the weight of the iron plus light pressure. Pushing hard forces molten plastic sideways rather than letting it flow around the knurling, which is where the holding strength comes from.',
        ],
      },
      {
        heading: 'Why the wall bulges, and how to stop it',
        body: [
          'Displaced plastic has to go somewhere. If the boss wall is thin, it goes outward and you get a visible bulge or a split. Give the boss at least about 1.5 to 2mm of wall around the insert, and more in a brittle material.',
          'Setting the insert flush or very slightly below the surface, rather than proud, also helps: the last fraction of a millimetre is where most of the displaced material ends up.',
        ],
      },
      {
        heading: 'PLA against PETG',
        body: [
          'PLA is stiffer and more brittle, so it holds a crisp knurl impression but splits more readily if the hole is undersized. PETG is more ductile and tolerates a slightly tight hole, but it is stringier when molten and tends to web around the insert.',
          'Neither is a problem if the hole is right. Both become a problem if you use a number you found for the other one.',
        ],
      },
    ],
    gear: [
      {
        category: 'Brass heat-set inserts',
        requirement: 'Knurled, with a published recommended hole diameter',
        why: 'The published hole figure is the reason to prefer a documented brand. An unlabelled bag of inserts leaves you testing coupons to discover a number the manufacturer already knows.',
        searchTerms: 'threaded inserts m3 brass',
      },
      {
        category: 'Soldering iron with insert tips',
        requirement: 'Temperature controlled, with tips sized to your inserts',
        why: 'A flat soldering tip fights you: it slips off the insert and heats unevenly. A matching insert tip sits in the bore and drives it in square, which is most of what stops a crooked insert.',
        searchTerms: 'heat set insert tool soldering',
      },
    ],
    faq: [
      {
        question: 'What size hole for a heat-set insert?',
        answer:
          'Use the diameter your insert manufacturer publishes for that specific insert. Heat-set inserts differ in knurl and taper between brands, so a figure taken from another manufacturer will either be loose or split the boss. If no figure is published, test on a scrap coupon in the same material and orientation.',
      },
      {
        question: 'What temperature for heat-set inserts in PLA?',
        answer:
          'Generally around 200 to 230C, above the glass transition and below decomposition. Going slowly matters more than the exact number, because the heat needs time to conduct into the plastic rather than pooling at the tip.',
      },
      {
        question: 'Why did the wall bulge when I installed an insert?',
        answer:
          'Displaced plastic had nowhere to go. Give the boss at least 1.5 to 2mm of wall around the insert, set it flush rather than proud, and let it sink under light pressure instead of forcing it.',
      },
    ],
    relatedMaterials: ['pla', 'petg', 'abs', 'pla-cf'],
  },

  // ------------------------------------------------------------------ STORE
  {
    slug: 'filament-storage',
    diagram: 'filamentStorage',
    stage: 'store',
    title: 'Filament storage',
    heading: 'How to store 3D printer filament',
    metaTitle: 'Filament storage: dry boxes, desiccant and which materials actually need it',
    metaDescription:
      'How to store filament so it stays printable, the difference between storage and active drying, and which materials genuinely absorb moisture fast enough to care about.',
    lede:
      'Storage and drying are different jobs. Drying removes moisture a spool has already absorbed; storage stops it coming back. A sealed container with indicating desiccant handles storage for almost everything, and the materials that genuinely need more are nylon, PVA and polycarbonate, which absorb fast enough to matter within days rather than months.',
    sections: [
      {
        heading: 'Not every filament needs the same care',
        body: [
          'PLA is mildly hygroscopic and will sit on an open shelf for months in a normal room without becoming unprintable. Treating it like nylon wastes money and shelf space.',
          'Nylon, PVA and polycarbonate are at the other end: they take up enough water from ordinary room air within days to change how they print. Those belong in a sealed box between prints, and PVA belongs in one from the moment it arrives.',
        ],
      },
      {
        heading: 'What a storage setup actually needs',
        body: [
          'An airtight container, indicating desiccant, and a way to read the humidity. Under about 20 percent relative humidity inside the box, the filament is fine. Without a hygrometer you are guessing, and the guess is usually optimistic.',
          'Indicating silica gel changes colour when it is spent and recharges in an oven at around 120C, so it is a one-off purchase rather than a consumable. Vacuum bags do the same job for spools you will not touch for months, at the cost of being awkward to open and reseal.',
        ],
      },
      {
        heading: 'Printing from the box',
        body: [
          'For the thirstiest materials, storage between prints is not enough, because a long print gives the filament hours of exposure while it feeds. A dry box that feeds the printer directly solves that, and it is the normal setup for nylon.',
          'If a nylon print starts clean and degrades over several hours, that is the mechanism, and no amount of pre-drying fixes it on its own.',
        ],
      },
    ],
    gear: [
      {
        category: 'Airtight storage with rechargeable desiccant',
        requirement: 'Sealed container plus indicating silica gel',
        why: 'Indicating gel tells you when it is spent and recharges at about 120C, so it is bought once. Storage without an indicator is storage you cannot verify.',
        searchTerms: 'airtight filament storage container rechargeable desiccant',
      },
      {
        category: 'Hygrometer',
        requirement: 'Small digital unit that fits inside the box',
        why: 'The only way to know whether the box is working. Under about 20 percent relative humidity you can skip a drying cycle you would otherwise run on a hunch.',
        searchTerms: 'mini digital hygrometer',
      },
      {
        category: 'Vacuum storage bags',
        requirement: 'Valve type, sized for a 1 kg spool',
        why: 'For spools going away for months. Removing the air outright beats desiccant alone for long-term nylon and TPU.',
        searchTerms: 'vacuum storage bags filament spool',
      },
    ],
    faq: [
      {
        question: 'Do I need to store PLA in a dry box?',
        answer:
          'Usually not. PLA is only mildly hygroscopic and keeps for months on an open shelf in a normal room. Nylon, PVA and polycarbonate are the materials that genuinely need sealed storage between prints.',
      },
      {
        question: 'What is the difference between drying and storing filament?',
        answer:
          'Drying removes moisture the spool has already absorbed and needs heat. Storage stops moisture returning and needs a seal and desiccant. Doing one without the other wastes the effort.',
      },
      {
        question: 'What humidity should filament be stored at?',
        answer:
          'Under about 20 percent relative humidity inside the container. A small hygrometer in the box is the only way to know, and rechargeable indicating desiccant is what gets you there.',
      },
    ],
    relatedMaterials: ['nylon-pa6', 'nylon-pa12', 'pva', 'pc', 'petg'],
  },

  // --------------------------------------------------------------- MAINTAIN
  {
    slug: 'nozzle-maintenance',
    diagram: 'coldPull',
    stage: 'maintain',
    title: 'Nozzle maintenance',
    heading: 'Cleaning and replacing a 3D printer nozzle',
    metaTitle: 'Nozzle cleaning, cold pulls and when to replace a 3D printer nozzle',
    metaDescription:
      'How to clear a partial clog with a cold pull, when a nozzle is worn rather than blocked, and why abrasive filaments need hardened steel from the first print.',
    lede:
      'Most nozzle problems are one of two things: a partial clog, which a cold pull clears, or wear, which nothing clears. Underextrusion that appears gradually and gets worse over weeks is wear. Underextrusion that appears suddenly mid-print is a clog. Abrasive filaments cause the first kind, and a brass nozzle running carbon fibre can widen enough to matter within a single spool.',
    sections: [
      {
        heading: 'The cold pull',
        body: [
          'Heat the nozzle so the filament inside softens, push a little through by hand, then let it cool to the point where the plastic is firm but still slightly pliable and pull it out in one motion. Debris embedded in the nozzle comes out attached to the plug.',
          'Nylon and dedicated cleaning filament work better than PLA for this, because they stay coherent at the temperature where the plug needs to release. Repeat until the tip of the removed plug is clean and shows the nozzle profile.',
        ],
      },
      {
        heading: 'Clog or wear?',
        body: [
          'Timing is the tell. A clog is abrupt: the print was fine, then extrusion dropped. Wear is gradual: prints have been getting slightly worse for weeks, walls are thinner than they should be, and the first layer needs more squash than it used to.',
          'The other check is the hole. A worn nozzle bore is visibly wider and no longer circular. Once it is worn, cleaning does nothing and replacing is a few minutes and a small amount of money.',
        ],
      },
      {
        heading: 'Brass, hardened steel, and when each belongs',
        body: [
          'Brass conducts heat better and is the right default for PLA, PETG, ABS and other unfilled materials. It is also soft, which is exactly why it is wrong for anything abrasive.',
          'Carbon and glass filled filaments, and glow-in-the-dark and metal-filled compounds, all contain hard particles that widen a brass bore quickly. Fit hardened steel before the first print of those materials, not after the symptoms show, because by then the print quality has already been drifting.',
          'One caution: nozzles are not universally interchangeable. Thread, length and overall geometry vary between hot ends, so match the nozzle to your specific hot end rather than assuming an MK8 fits everything.',
        ],
      },
    ],
    gear: [
      {
        category: 'Nozzle cleaning kit',
        requirement: 'Needles sized to your nozzle diameter',
        why: 'Clears a partial blockage without a teardown. Needles thinner than the bore, so a 0.4mm nozzle wants 0.35mm needles rather than something that will score the inside.',
        searchTerms: 'nozzle cleaning kit 3d printer needles',
      },
      {
        category: 'Hardened steel nozzle',
        requirement: 'Matching your hot end thread and geometry, not just the size',
        why: 'Required for anything carbon filled, glass filled, glow-in-the-dark or metal filled. Check it fits your specific hot end: MK8 is a common pattern but not a universal one.',
        searchTerms: 'hardened steel nozzle 3d printer',
      },
      {
        category: 'Spare brass nozzles',
        requirement: 'Matching your hot end, 0.4mm unless you have a reason',
        why: 'Brass conducts heat better and is right for unfilled materials. Having a spare turns a worn nozzle from a lost evening into a five-minute swap.',
        searchTerms: 'MK8 nozzle assortment',
      },
    ],
    faq: [
      {
        question: 'How do you do a cold pull on a 3D printer?',
        answer:
          'Heat the nozzle so the filament softens, extrude a little by hand, then cool until the plastic is firm but still slightly pliable and pull it out in one motion. Debris comes out stuck to the plug. Nylon or dedicated cleaning filament works better than PLA.',
      },
      {
        question: 'How do I know if my nozzle is worn or clogged?',
        answer:
          'A clog is sudden: extrusion drops mid-print. Wear is gradual: prints degrade over weeks and walls come out thin. A worn bore is also visibly wider and no longer round. Cleaning fixes a clog and does nothing for wear.',
      },
      {
        question: 'Do I need a hardened nozzle for carbon fibre filament?',
        answer:
          'Yes, and fit it before the first print. Carbon and glass filled filaments, plus glow-in-the-dark and metal-filled compounds, widen a brass bore quickly enough to affect quality within a spool.',
      },
    ],
    relatedMaterials: ['pa-cf', 'petg-cf', 'pla-cf', 'glow-pla', 'magnetic-pla'],
  },
  // -------------------------------------------------------------- CALIBRATE
  {
    slug: 'printer-calibration',
    stage: 'calibrate',
    title: 'Calibration',
    heading: '3D printer calibration: what to do, and in what order',
    metaTitle: '3D printer calibration: the order that actually matters',
    metaDescription:
      'What calibration means on an FDM printer, the order to work through it, what a calibration cube does and does not tell you, and why elephant foot is a first-layer setting rather than a fault.',
    lede:
      'Calibration is four separate jobs, and doing them out of order wastes an afternoon. Get the first layer right, then extrusion, then flow, then temperature. Each one is measured against something physical, and a step tuned before the step beneath it will simply be tuned again.',
    sections: [
      {
        heading: 'The order, and why it is that order',
        body: [
          'Nozzle height first, because every measurement afterwards is taken from a part sitting on the plate. Then extrusion, so the printer pushes the length of filament it thinks it does. Then flow, so the amount landing in a wall matches the model. Temperature last, because it changes how the plastic behaves and would invalidate anything tuned before it.',
          'Work upwards and each step stays true. Start with temperature and you will retune it after the first layer moves.',
        ],
      },
      {
        heading: 'What a calibration cube actually tells you',
        body: [
          'A 20mm cube is a measuring reference, not a quality test. Print it, measure X, Y and Z with calipers, and compare against 20mm. It reports whether the machine is putting material where it says, and nothing else.',
          'It will not tell you about overhangs, bridging, retraction or surface finish, and a cube that measures perfectly can still print a poor part. Treat a good cube as a licence to move on rather than as a result.',
          'A cube reading consistently oversized usually means over-extrusion or a squashed first layer lifting the whole measurement, not a machine that needs its steps changed.',
        ],
      },
      {
        heading: 'Extrusion and flow are different problems',
        body: [
          'Extrusion calibration, often called e-steps, asks whether the extruder moves the length of filament it was told to. Mark the filament, ask for 100mm, measure what was actually pulled in. It is a mechanical count and it is either right or it is not.',
          'Flow, sometimes called extrusion multiplier, asks whether the volume landing in a wall matches the slicer. Print a single-wall object, measure the wall with calipers, and compare against the nozzle width the slicer used. A wall consistently thicker than asked for is over-extrusion.',
          'Doing flow before e-steps means correcting a volume error with a multiplier that is hiding a mechanical one, and the error comes back the moment a different material goes in.',
        ],
      },
      {
        heading: 'Elephant foot is a setting, not a fault',
        body: [
          'The first layer or two splaying outwards is elephant foot. It happens because the first layer is deliberately squashed into the plate and the plastic has nowhere to go but sideways, and it is worse when the plate is hot and the nozzle is low.',
          'Most slicers carry a first-layer horizontal compensation or elephant-foot setting that shrinks the bottom layers to cancel it. That is the correct fix. Raising the nozzle to make it go away trades a cosmetic problem for an adhesion problem, and adhesion is the harder of the two to live with.',
          'It matters more than it looks: a base flared by a couple of tenths is exactly the amount that stops a part sitting flat in an assembly.',
        ],
      },
    ],
    gear: [
      {
        category: 'Digital calipers',
        requirement: 'Reads to 0.01mm, holds zero when closed',
        why: 'Every step here is measured rather than judged by eye. Without calipers, calibration is guessing with extra steps.',
        searchTerms: 'digital calipers 6 inch',
      },
    ],
    faq: [
      {
        question: 'What order should I calibrate a 3D printer in?',
        answer:
          'First layer and nozzle height, then extrusion (e-steps), then flow, then temperature. Each step is measured from the one before it, so tuning out of order means tuning twice.',
      },
      {
        question: 'What does a calibration cube tell you?',
        answer:
          'Whether the printer produces the dimensions it was asked for. Print a 20mm cube, measure all three axes with calipers, compare against 20mm. It says nothing about overhangs, retraction or surface finish.',
      },
      {
        question: 'How do I fix elephant foot?',
        answer:
          'Use the first-layer horizontal compensation or elephant-foot setting in your slicer, which shrinks the bottom layers to cancel the squash. Raising the nozzle also removes it but costs you first-layer adhesion.',
      },
      {
        question: 'What is the difference between e-steps and flow rate?',
        answer:
          'E-steps ask whether the extruder moves the length of filament it was told to, measured by marking and pulling 100mm. Flow asks whether the volume in a printed wall matches the slicer, measured with calipers on a single-wall print.',
      },
    ],
    relatedMaterials: ['pla', 'petg', 'abs'],
  },

  // --------------------------------------------------------------- ADHESION
  {
    slug: 'bed-adhesion-and-first-layer',
    stage: 'adhesion',
    title: 'Bed adhesion and the first layer',
    heading: 'Why your print is not sticking to the bed',
    metaTitle: '3D print not sticking to the bed: causes, in order of likelihood',
    metaDescription:
      'The usual reason a print will not stick is a plate with skin oil on it. Then nozzle height, then bed temperature, then a material that was always going to lift. How to work through them in that order.',
    lede:
      'Start with the plate, not the settings. Skin oil from handling a part off the bed is the most common cause of a print that will not stick, and it is invisible. Wash the plate, then check nozzle height, then bed temperature, and only then consider whether the material itself is the problem.',
    sections: [
      {
        heading: 'Clean the plate first, every time',
        body: [
          'Fingerprints leave a film that plastic will not key into, and it builds up exactly where you grip the plate to flex a part off. Washing with warm water and dish soap, then drying fully, resets a plate more reliably than wiping it.',
          'Isopropyl alcohol is the quick version between prints and it is worth keeping to hand, though it moves grease around more than it removes it. Use alcohol for a touch-up and soap and water when adhesion has genuinely dropped off.',
          'Textured PEI keeps working long after it looks past it. A smooth PEI sheet that has gone glassy in one patch has usually lost its texture there permanently, and that patch will keep failing.',
        ],
      },
      {
        heading: 'Nozzle height: squashed, not placed',
        body: [
          'A first layer should be pressed into the plate so the extrusions spread and fuse into a continuous sheet, with no gaps between neighbouring lines. A first layer that looks like tidy round strings sitting on the surface is too high, and it will lift.',
          'Too low is its own failure: the nozzle ploughs, the extruder skips, and you get a translucent smear rather than a layer. The window between the two is smaller than most people expect, which is why the height is worth setting properly rather than nudging.',
        ],
      },
      {
        heading: 'Bed temperature does one job',
        body: [
          'The heated bed keeps the plastic near the plate soft enough to stay bonded while the layers above it cool and pull. Too cold and the corners win. Hotter is not automatically better, though: an over-hot plate softens the base enough to deform it, which is elephant foot arriving by a different route.',
          'Each material has a range for this, and the range is on its page here rather than repeated as one number that would be wrong for most of them.',
        ],
      },
      {
        heading: 'Warping is shrinkage, and some materials always do it',
        body: [
          'A part that sticks and then peels a corner is not an adhesion problem, it is a shrinkage problem. The plastic contracts as it cools, the contraction pulls the corners inwards and upwards, and the bond gives way at the weakest point.',
          'This is a material property. ABS, ASA and the nylons shrink enough that a draught across the printer is sufficient to lift a corner, which is why they want an enclosure rather than more glue. PLA and PETG shrink little enough that a clean plate is usually the whole answer.',
          'A brim buys you more bonded area at the corners and costs a moment with the cutters afterwards. It is the cheapest thing to try, and on a tall part with a small footprint it is often the only thing that works.',
        ],
      },
    ],
    gear: [
      {
        category: 'Isopropyl alcohol',
        requirement: '90% or higher, for between-print cleaning',
        why: 'The quick reset between prints. Keep soap and water for when adhesion has genuinely dropped off, because alcohol moves grease as much as it lifts it.',
        searchTerms: 'isopropyl alcohol 99 percent',
      },
      {
        category: 'Glue stick',
        requirement: 'Washable solid stick, nothing scented or glittered',
        why: 'A release layer as much as an adhesive. On glass and smooth PEI it also stops PETG bonding so well that it takes a divot out of the plate.',
        searchTerms: 'glue stick 3d printing bed adhesion',
      },
    ],
    faq: [
      {
        question: 'Why is my 3D print not sticking to the bed?',
        answer:
          'Most often the plate has skin oil on it from handling. Wash it with warm water and dish soap and dry it fully. If that does not fix it, check the nozzle is low enough that the first layer is squashed into a continuous sheet, then check the bed temperature for your material.',
      },
      {
        question: 'How do I clean a 3D printer build plate?',
        answer:
          'Warm water and dish soap, then dry completely. Isopropyl alcohol is fine as a quick clean between prints but it redistributes grease more than it removes it.',
      },
      {
        question: 'Why does my print warp at the corners?',
        answer:
          'Warping is the plastic shrinking as it cools and pulling the corners up. It is a material property rather than an adhesion fault. ABS, ASA and the nylons need an enclosure to control it; PLA and PETG rarely warp on a clean plate.',
      },
      {
        question: 'Should the first layer be squashed?',
        answer:
          'Yes. The extrusions should spread and fuse into a continuous sheet with no gaps between lines. A first layer that looks like round strings sitting on the plate is too high and will lift.',
      },
    ],
    relatedMaterials: ['abs', 'asa', 'nylon-pa6', 'nylon-pa12', 'petg', 'pc'],
  },

  // ----------------------------------------------------------------- FINISH
  {
    slug: 'painting-3d-prints',
    stage: 'finish',
    title: 'Painting',
    heading: 'How to paint a 3D print so the finish lasts',
    metaTitle: 'Painting 3D prints: preparation, primer and paint that sticks',
    metaDescription:
      'Paint does not stick to a printed surface, it sticks to a prepared one. Sanding, filler primer, which paints work on PLA, PETG and ABS, and why a fingerprint ruins the job before you start.',
    lede:
      'Almost every bad paint job on a 3D print is a preparation problem rather than a paint problem. Sand the layer lines back, wash the part, spray a filler primer to fill what is left, sand that, and only then paint. Primer is the step people skip and the step that decides the result.',
    sections: [
      {
        heading: 'Wash the part before you touch it with anything',
        body: [
          'Handling a printed part puts skin oil into the surface texture, and paint will not key through it. Warm water and dish soap, then dry fully, and handle it by an edge or with gloves afterwards.',
          'This costs two minutes and it is the difference between a finish that survives handling and one that lifts in sheets the first time it is picked up.',
        ],
      },
      {
        heading: 'Filler primer does the work sanding cannot',
        body: [
          'Sanding takes the peaks off the layer lines but it will not fill the valleys, and paint is far too thin to bridge them. Filler primer, sometimes sold as high-build or sandable primer, is thick enough to sit in those valleys and give you a surface to flatten.',
          'The sequence that works is sand, prime, sand the primer, prime again if lines still show. Each pass is faster than the one before it because there is less left to remove. On a part with visible layer lines, expect two primer coats.',
          'Primer also gives paint a consistent colour to sit on, which matters more than it sounds. Spraying a light colour straight onto a dark print costs several extra coats and buries detail.',
        ],
      },
      {
        heading: 'Which paint on which plastic',
        body: [
          'Once a part is primed, the primer is the surface and the paint no longer has to bond to the plastic at all. That is the point of it, and it is why the same acrylic works over PLA, PETG and ABS alike.',
          'Unprimed is a different question. Acrylics will sit on PLA reasonably well. PETG is a poor host for paint without primer, and ABS is chemically vulnerable to solvent-based paints, which can soften and craze the surface. If you are painting straight onto plastic, test on a scrap piece from the same spool first.',
          'Spray in thin coats and let each flash off. A heavy coat runs, and a run on a textured print cannot be sanded out without going back to bare plastic.',
        ],
      },
      {
        heading: 'Heat, again',
        body: [
          'PLA softens at temperatures a dark part reaches in sunlight, and it will certainly soften if a heat gun is used to speed drying. Let paint cure at room temperature.',
          'This is the same constraint that governs sanding PLA. The material is not being awkward, it simply has a low glass transition, and every finishing step has to respect it.',
        ],
      },
    ],
    gear: [
      {
        category: 'Filler primer',
        requirement: 'Sandable and high-build, rated for plastic on the can',
        why: 'Fills the valleys between layer lines that sanding cannot reach. Check the can lists plastic: much filler primer is solvent-based automotive product, and solvent can craze ABS and soften PLA.',
        searchTerms: 'filler primer spray sandable plastic',
      },
      {
        category: 'Wet/dry sanding assortment',
        requirement: 'A grit sequence, not one sheet',
        why: 'Layer lines come off with coarse grit and primer is flattened with fine. Jumping straight to fine paper polishes the peaks and leaves the valleys.',
        searchTerms: 'wet dry sandpaper assortment 400 3000',
      },
    ],
    faq: [
      {
        question: 'Do you need to prime a 3D print before painting?',
        answer:
          'Yes, if you want the layer lines gone. Sanding removes the peaks but not the valleys, and paint is too thin to fill them. A sandable filler primer sits in the valleys and gives you a surface to flatten.',
      },
      {
        question: 'What paint works on 3D prints?',
        answer:
          'Over primer, ordinary acrylic spray or brush paint works on PLA, PETG and ABS alike, because the primer is the surface the paint bonds to. Straight onto bare plastic, acrylics are the safer choice; solvent-based paints can craze ABS.',
      },
      {
        question: 'How do you get rid of layer lines before painting?',
        answer:
          'Sand with coarse grit to take the peaks down, spray a filler primer to fill the valleys, then sand the primer back. Repeat the primer step if lines still show. Two coats is normal on a visibly ridged print.',
      },
      {
        question: 'Should I wash a 3D print before painting it?',
        answer:
          'Yes. Skin oil from handling sits in the surface texture and stops paint keying to it. Warm water and dish soap, dried fully, then handle it by an edge.',
      },
    ],
    relatedMaterials: ['pla', 'petg', 'abs', 'asa', 'pla-matte'],
  },

  // --------------------------------------------------------------- ASSEMBLE
  {
    slug: 'gluing-3d-printed-parts',
    stage: 'assemble',
    title: 'Gluing and joining',
    heading: 'The best glue for 3D printed parts, by material',
    metaTitle: 'Best glue for 3D prints: what actually bonds PLA, PETG and ABS',
    metaDescription:
      'Cyanoacrylate for most jobs, epoxy where the joint carries load or needs filling, and solvent welding for ABS and ASA only. Which adhesive suits which plastic, and how to prepare a printed face so it holds.',
    lede:
      'Cyanoacrylate handles most printed joints, epoxy is the choice where the joint carries load or the faces do not meet cleanly, and solvent welding genuinely fuses ABS and ASA rather than gluing them. The plastic decides which of the three you reach for, and the surface preparation decides whether it holds.',
    sections: [
      {
        heading: 'Match the adhesive to the plastic',
        body: [
          'Cyanoacrylate, plain superglue, bonds PLA, ABS, ASA and the composite variants of each without ceremony. It is fast, it is strong in shear, and it is brittle under impact. For most brackets, figures and repairs it is the right answer.',
          'PETG is a poorer host. It has a smoother, lower-energy surface than PLA and cyanoacrylate can sit on it rather than grip. Keying the faces with sandpaper first makes more difference on PETG than on anything else, and epoxy is the more reliable choice when the joint matters.',
          'TPU and the flexibles need an adhesive that stays flexible. A rigid bond on a part designed to bend simply moves the failure to the edge of the glue line, and it will fail there on the first flex.',
        ],
      },
      {
        heading: 'Epoxy where the joint has a job to do',
        body: [
          'Two-part epoxy is slower and messier and it is what you want when the joint is structural, when the faces do not meet perfectly, or when you need working time to align parts. It fills gaps that cyanoacrylate cannot bridge, and it stays tougher under impact.',
          'Printed faces are rarely as flat as they look, particularly on a face that was against supports. Epoxy is forgiving of that in a way a thin adhesive is not.',
        ],
      },
      {
        heading: 'Solvent welding is a different thing entirely',
        body: [
          'Acetone dissolves ABS and ASA. Applied to two mating faces it softens both, and as it evaporates the plastic re-forms as one piece. That is a weld, not a bond, and it is stronger than any adhesive joint you will make in those materials.',
          'It only works on plastics the solvent attacks. PLA, PETG and the nylons do not solvent weld with acetone, and attempting it produces a wet part and nothing else. Do not extrapolate the technique across materials.',
          'Acetone is flammable and its vapour needs ventilation. This is a job for open air or an extracted space, not a closed room.',
        ],
      },
      {
        heading: 'Prepare the faces, and design the joint',
        body: [
          'Key both faces with sandpaper and clean off the dust. A printed surface looks rough but its ridges run in one direction, and adhesive keys far better into a randomly scratched face than into parallel layer lines.',
          'Where you control the model, give the joint some help: a lip, a peg, a recess, anything that locates the parts and adds bonded area. Adhesive is much better in shear than in peel, and a flat butt joint between two printed faces is the weakest arrangement available.',
        ],
      },
    ],
    gear: [
      {
        category: 'Cyanoacrylate adhesive',
        requirement: 'Thin or medium viscosity, with an accelerator',
        why: 'The default for printed joints. An accelerator matters on PETG and on large faces, where the glue would otherwise skin before it grips.',
        searchTerms: 'cyanoacrylate super glue accelerator kit',
      },
      {
        category: 'Two-part epoxy',
        requirement: 'Five-minute or slower, gap filling',
        why: 'For joints that carry load or faces that do not meet cleanly. The slower cure buys alignment time that superglue does not give you.',
        searchTerms: 'two part epoxy adhesive syringe',
      },
    ],
    faq: [
      {
        question: 'What is the best glue for 3D printed parts?',
        answer:
          'Cyanoacrylate for most joints in PLA, ABS and ASA. Two-part epoxy where the joint carries load or the faces do not meet cleanly. For ABS and ASA specifically, acetone solvent welding is stronger than either.',
      },
      {
        question: 'How do you glue PLA?',
        answer:
          'Cyanoacrylate bonds PLA well. Key both faces with sandpaper, clean off the dust, and use epoxy instead if the joint is structural. PLA does not solvent weld with acetone.',
      },
      {
        question: 'Can you glue PETG?',
        answer:
          'Yes, but it is harder than PLA because the surface is smoother and lower energy. Sand both faces first, use an accelerator with cyanoacrylate, or choose epoxy where the joint matters.',
      },
      {
        question: 'Does acetone weld 3D printed parts?',
        answer:
          'On ABS and ASA, yes. It dissolves the surface of both faces so they re-form as one piece, which is stronger than an adhesive joint. It does nothing useful on PLA, PETG or nylon.',
      },
    ],
    relatedMaterials: ['pla', 'petg', 'abs', 'asa', 'tpu'],
  },
];

export function resourceBySlug(slug: string): WorkshopResource | undefined {
  return WORKSHOP.find((r) => r.slug === slug);
}

export function resourcesForStage(stage: Stage): WorkshopResource[] {
  return WORKSHOP.filter((r) => r.stage === stage);
}

/**
 * Workshop resources especially relevant to a material, for cross-linking.
 *
 * Curated `relatedMaterials` first. Where a material has none, the steps are
 * derived from its own properties rather than left empty.
 *
 * The reason is an M1.6 audit: 15 of 31 profiles appeared in no resource's list,
 * so their "after the print" block rendered nothing and the only onward route
 * was the generic workshop hub. That is exactly the "related articles dump where
 * a specific next action exists" that the journey rules forbid — and it was not
 * an authoring oversight so much as an inevitability, since every new material
 * starts life in nobody's list.
 *
 * Deriving it means a material added tomorrow is never orphaned.
 */
export function workshopForMaterial(materialSlug: string): WorkshopResource[] {
  const curated = WORKSHOP.filter((r) => r.relatedMaterials.includes(materialSlug));
  if (curated.length) return curated;

  const m = MATERIAL_PROFILES.find((p) => p.slug === materialSlug);
  if (!m) return [];

  const pick = new Set<string>();

  // Every printed part gets measured before anyone trusts it.
  pick.add('3d-print-tolerance');

  // Hygroscopic materials live or die on how they were stored.
  if (m.needsDrying) pick.add('filament-storage');

  // Filled and loaded compounds chew through a brass nozzle.
  const abrasive =
    /-(CF|GF)$/.test(m.category) ||
    /Glow|Metal|Wood/.test(m.category) ||
    m.avoidFor.some((a) => a.toLowerCase().includes('brass'));
  if (abrasive) pick.add('nozzle-maintenance');

  // Anything that needs a chamber is a warping and adhesion problem first.
  if (m.enclosure === 'Required') pick.add('bed-adhesion-and-first-layer');

  // Soluble supports exist to be removed.
  if (/PVA|HIPS/.test(m.category)) pick.add('removing-supports-and-deburring');

  return WORKSHOP.filter((r) => pick.has(r.slug));
}
