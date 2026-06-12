# IDEA9103 Group 4 — The Starry Night (Interactive)

## Inspiration

Our project is based on Vincent van Gogh's *The Starry Night* (1889). We were drawn to the painting's sense of movement — the swirling sky, restless ocean, and the contrast between the glowing celestial bodies and the dark landscape below. Rather than recreating the painting statically, we wanted to capture its emotional progression: from the calm of early evening (Reality), into the dreamlike distortion of night (Dream), through a cosmic expansion (Galaxy), and finally back to a gentle dawn (Awakening). The four phases reflect how van Gogh's brushwork itself seems to shift in intensity — from quiet to turbulent to transcendent.
<img src="Vangoah.png"width="600">

---

## Techniques

The project is built in p5.js and combines five distinct generative mechanics:

- **Time-based progression**: A `millis()`-driven timeline cycles through four phases over 70 seconds. Each phase triggers visual events at specific timestamps using an array of `{ time, event }` objects. The sun and moon animate using `lerp()` and a cubic easing function to move smoothly across the sky.
- **Wave horizon**: The ocean is drawn as a `beginShape()` polygon whose top edge follows a `sin()` wave — the horizon line itself is the wave, with no flat boundary between sky and ocean. Wave amplitude and frequency vary per phase.
- **Perlin noise & randomness**: Organic distortion and natural-looking fish/whale movement using `noise()` to make the scene feel alive rather than mechanical.
- **User input**: The user's mouse position controls a balance mechanic — the boat tilts in response to cursor movement, and a score tracks stability. The cat character reacts to the tilt angle in real time.
- **Audio response**: A loaded audio track plays on mouse click. `p5.Amplitude` measures the volume level, which drives wave amplitude changes and boat tilt.

The sky and ocean gradients are drawn as stacked horizontal `line()` calls with `lerpColor()` for smooth colour blending. Phase transitions affect all visual parameters simultaneously.

### Time-based Mechanic Details (Xinyue Qiu)

The timeline is driven by `millis()` and a `timeOffset` variable. An array called `timeline` stores objects with `time` (milliseconds since phase start) and `event` (a string label). At each `draw()` call, the current time `t = millis() - timeOffset` is compared against the timeline to decide which phase and which event is active.

**Four phases:**

| Phase | Time range | Sky | Ocean | Sun/Moon |
|---|---|---|---|---|
| Reality | 0–15000 ms | Bright blue to deep blue | Calm waves, low amplitude | Sun rises from horizon, golden |
| Dream | 15000–35000 ms | Deep blue to purple | Medium waves | Sun sets, moon rises, stars appear |
| Galaxy | 35000–55000 ms | Purple to black | Chaotic waves, high amplitude | Moon glows bright, stars swirl |
| Awakening | 55000–70000 ms | Black to warm dawn | Calm returning | Moon fades, sun returns |

**Key functions:**
- `drawSky(stage)` — fills the entire canvas height with a vertical gradient using `lerpColor()`. The `stage` parameter selects which colour pair to use.
- `drawOcean(stage)` — draws a polygon using `beginShape()` and `vertex()`. The top edge is a `sin()` wave; the bottom edge is the canvas bottom. This makes the wave itself the horizon line.
- `drawSun(stage)` / `drawMoon(stage)` — use `easeOutCubic()` for smooth entry animation. The sun and moon positions are calculated with `lerp()` between start and end Y positions.
- `drawStars(stage)` — stars fade in during Dream phase and swirl (slight position drift) during Galaxy phase.
- `handleEvent(event)` — dispatches colour changes, wave parameter updates, and celestial transitions based on the current event string.
- `easeOutCubic(t)` — a cubic easing function: `1 - pow(1 - t, 3)`. Makes animations start fast and slow down at the end.

**Wave parameters per phase:**
- `waveAmplitude`: 15 (Reality) → 25 (Dream) → 40 (Galaxy) → 15 (Awakening)
- `waveFreq`: 0.02 (Reality) → 0.03 (Dream) → 0.05 (Galaxy) → 0.02 (Awakening)
- `waveSpeed`: controlled by `frameCount * 0.03` (Reality/Dream/Awakening) or `frameCount * 0.05` (Galaxy)

The phase transition is seamless — `drawSky()` and `drawOcean()` are called every frame, and the `stage` variable determines which colour scheme and wave parameters are active.

### Audio-Reactive Ocean Details (Anusha Jaiswal)

Sound was always in the painting, I just needed to find it. The ocean does not sit flat, it churns and rolls, restless in a way that always felt like it had a rhythm underneath. I wanted to make that rhythm audible, and then let it work the other way: let sound become the ocean.

The mechanic uses p5.sound's `Amplitude` analyser to read the live volume of a looping audio track every frame. That single number — how loud the music is right now — gets mapped onto everything that moves in the water. When the track swells, the waves surge upward, their amplitude multiplying with the sound. When it quiets, they settle back. The ocean breathes with the music.

It does not stop at the water. The boat feels it too. Loud moments push extra tilt into the hull, so the cat on deck has to fight the music as well as its own weight. The cat's tail responds independently, curling tighter and higher as the volume climbs, relaxed and loose when things are calm. It is a small detail but it makes the animal feel present, aware of something the viewer can hear.

The audio starts on the first click anywhere on the canvas. A small prompt at the bottom edge guides the viewer in. After that it loops and the painting stays in motion, the ocean never quite the same shape twice.

---

## Mechanic Ownership

**Xinyue Qiu — Time-based mechanic**
A 70-second timeline (`millis()` + `timeOffset`) cycles through four phases: **Reality** (bright, sun rises), **Dream** (purple, moon rises, stars appear), **Galaxy** (dark, chaotic waves, stars swirl), **Awakening** (dawn returns, sun reappears). A `timeline` array of `{ time, event }` objects triggers parameter changes at specific timestamps. `drawSky(stage)` fills the full canvas with a `lerpColor` vertical gradient. `drawOcean(stage)` draws a `beginShape()` polygon where the top edge is a `sin()` wave (the horizon is the wave itself). `drawSun()` and `drawMoon()` use `easeOutCubic()` for smooth entry animation. `drawStars()` handles star fade-in and swirl. Wave amplitude, frequency, and speed vary per phase.

**Danlin Liu — User input**
The user's mouse position controls a balance mechanic on a wooden boat. The boat tilts in real time in response to cursor movement, and a balance score tracks stability. A cat character on the deck reacts to the tilt angle with changing facial expressions and tail movement.

The mechanic uses three layered variables updated every frame. naturalRock generates a slow sinusoidal sway (sin(frameCount * 0.025) * 0.14) that simulates wave motion. personX maps the mouse X position to a normalised range (-1 to 1) and is smoothed with lerp() for gradual movement. boatTilt is the sum of naturalRock and the person's offset scaled by 0.28, also lerp()-smoothped. The balanceScore is derived from boatTilt using constrain() and lerp(), decreasing as the boat tilts further from centre.

Key functions:

drawBoat(stage) — draws the wooden boat hull using bezierVertex() for the curved shape, with plank lines and bench seats as detail. Applies push()/translate()/rotate(boatTilt)/pop() to tilt the entire boat around its centre. Calls drawCat() and drawBalanceBar() at the end.
drawCat(px, py) — draws a sitting cat with triangular ears, whiskers, and a curling tail using ellipse(), triangle(), and sin() for tail animation. The cat's facial expression changes with boatTilt: a smile when balanced (abs(boatTilt) < 0.05), a neutral line when slightly tilted, and a worried open mouth with a sweat drop when severely tilted (abs(boatTilt) > 0.15).
drawBalanceBar() — draws a horizontal progress bar at the top of the canvas. The fill colour transitions from green to yellow to red as balanceScore drops, using lerpColor() logic with threshold checks (> 70, > 40, < 40).
handleEvent(event) — the user input mechanic responds to phase changes triggered by the timeline. During the Galaxy phase (35000–55000 ms), waveAmplitude increases, which amplifies naturalRock and makes balancing harder.
The cat is always drawn at width/2 + personX * 28, so the visual position matches the balance logic. The boat rotation pivot is the boat centre, so the cat stays correctly on deck as the boat tilts.

**Yichen Yao — Perlin noise & randomness**
#### Fish school (Fish class). `random()` sets each fish's size, body shape,
position, speed, and colour, so one class produces a varied school. Each fish
picks its colour from a four-colour palette drawn from the four phase
backgrounds, so the school always matches the current phase. A `random()` depth
value (z-axis) scales size, colour, and speed — near fish are large, vivid, and
fast; far fish small, faded, and slow — and the school is sorted by depth for a
front-to-back sense of space. Motion comes from `noise()`, which slowly drifts
each fish's swim lane up and down, plus a `sin()` bob and a delayed-phase `sin()`
tail sway that bends the body into a soft S-shape.

#### Whale (Whale class). random() is checked against a low probability each
frame, so the whale breaches only rarely. It follows a parabolic `arc (4t(1−t))`
whose speed depends on height — fast leaving the water, slow at the apex, fast on
the way down. The body is built from flat polygon facets shaded in brightness
bands, with no outline.

**Anna (Yujing Zhang)**
I create visual effects driven by sound frequency, with three distinct scenes designed as follows:
##Seagulls: The higher the sound frequency, the farther the seagulls move in the opposite direction, and the faster their wings flap in the daytime.
##Rainy night: When it rains at night, higher sound frequency makes the rainfall intensify and fall faster.
##Clear night (no rain): On rainless clear nights, more meteors appear as the sound frequency rises.
Nush and I use the same audio source, yet our resulting visual presentations are completely different.


**Anusha Jaiswal — Audio mechanic**
Uses `p5.Amplitude` to read live volume from a looping audio track. The volume value drives wave amplitude (louder = bigger waves) and adds extra tilt to the boat. The cat's tail curls tighter as volume climbs. Audio starts on first canvas click.

---

## AI Acknowledgement

**Xinyue Qiu (Time-based mechanic)**: AI assistance was used for: (1) refining the `timeline` array architecture and event-triggering logic; (2) implementing the `easeOutCubic()` easing function for smooth sun/moon animation; (3) developing the wave-as-horizon approach (`beginShape()` polygon instead of a rectangle). All generated code was read, understood, and commented in `sketch.js` before submission.

**Danlin Liu — user input**

AI assistance was used for: (1) designing the three-variable balance physics architecture (naturalRock, personX, boatTilt) and tuning the lerp() smoothing parameters for natural feeling movement; (2) implementing the cat character's reactive facial expressions and tail animation using sin() and conditional drawing based on boatTilt thresholds; (3) debugging a while loop issue in the timeline event system where loopToReality caused all remaining events to trigger in a single frame — the fix involved adding a shouldBreak flag to exit the loop after a phase reset. All generated code was read, understood, and commented in sketch.js before submission.


**Yichen Yao — Perlin noise & randomness**
I used Claude as a coding and design partner — to discuss ideas, draft and
iterate on code, and check that every function stayed within what was taught in
class. All design decisions, tuning, and final code were reviewed and decided by
me.

**Yu jing Zhang - voice frequency part**
I utilized AI tools for two key aspects of development: (1) generating initial code snippets relevant to sound frequency-driven visual interactions (including seagull movement, rainfall intensity, and meteor appearance dynamics); (2) seeking guidance on debugging and resolving technical bugs encountered during implementation. All AI-generated code was thoroughly read, understood, modified to align with the project’s interactive logic, and integrated into the final submission. Additionally, all design decisions, parameter tuning (e.g., frequency-response sensitivity, animation speed), and functional validation were independently reviewed and finalized by myself.

---

## External References

- Van Gogh, V. (1889). *The Starry Night* [Oil on canvas]. Museum of Modern Art, New York. — visual and conceptual source for all four phases.
- p5.js reference documentation: [https://p5js.org/reference/](https://p5js.org/reference/) — used throughout for `beginShape()`, `lerpColor()`, `map()`, `noise()`, and `millis()`.

---

## Interaction Instructions

1. **Open** `index.html` in a browser (or run via a local server).
2. **Click anywhere** on the canvas to start the background audio.
3. The animation starts automatically and cycles through four phases over 70 seconds, then loops.
4. **Move your mouse left and right** to control the boat's balance. Moving the cursor to the edges tilts the boat further; keeping it centred maintains balance.
5. Watch the **Balance bar** at the top — if the boat tilts too far, the score drops and the cat reacts.
6. The louder the audio, the bigger the waves — try turning up your volume.
