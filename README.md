

## Part 1: Project direction HIIIII

### Chosen path

We are reinterpreting **Vincent van Gogh's *The Starry Night*** (1889).

![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg)
*Vincent van Gogh, The Starry Night, 1889. Oil on canvas, 73.7 x 92.1 cm. Museum of Modern Art, New York.*

### Our vision 

We are building an interactive version of *The Starry Night* where the sky moves. The painting already feels like it is in motion. The swirls, the stars, the rolling dark shapes, they look like something caught mid-storm. We want to make that motion real, using p5.js to turn Van Gogh's brushstrokes into a particle system the audience can actually reach into and change.

There are four mechanics running at once: audio drives colour and speed, timers shift the scene through different phases, Perlin noise shapes the natural drift of particles, and mouse input lets viewers create their own vortex centres and starbursts. The result should feel less like looking at a painting and more like standing inside one.

### Inspiration

**1. Vincent van Gogh, *The Starry Night* (1889)**

This is the base image. What draws us to it is the movement already baked into the composition. The sky does not sit still. We want to unpack that implied motion and hand control of it to the viewer.

![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg)

**2. Refik Anadol, *Machine Hallucinations* series (2023)**

Anadol turns large datasets into flowing, room-scale visual installations. We saw his work at the Art Gallery of New South Wales and it got us thinking about how particle fields can carry both structure and chaos at the same time. Our approach borrows from his method of mapping data values (in our case, audio frequencies, noise fields, and user gestures) onto the movement of thousands of small points in space.

![](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800)
*Refik Anadol's data sculptures, where machine-learning outputs become immersive visual environments.*


## Part 2  Mechanics


### 1. Audio - Louder sound → faster swirling motion
**Owner：Yujing Zhang**

This audio interaction mechanism is inspired by Vincent van Gogh’s The Starry Night. The system uses a microphone to capture the user’s voice and transform sound volume into visual movement. When the user speaks louder, the swirling patterns in the sky rotate faster and the scene becomes more dynamic. When the environment becomes quiet, the movement gradually slows down and returns to a calm state.

The visual design uses particles, dots, and flowing curves to recreate the emotional brushstroke style of The Starry Night. Users can interact with the artwork by speaking, clapping, or singing, allowing their sound to directly influence the digital sky.


### 2. Time-Based Mechanic
**Owner: Xinyue Qiu**

The sky does not wait for you to look at it. That was the idea I kept coming back to when I started working on this part. The whole painting already feels alive in Van Gogh's original, all those swirling strokes frozen mid-motion. So I wanted to push that further, let the sky shift and breathe on its own, cycling through different moods without anyone touching it.

The early phase is quiet. Particles drift slow and loose in deep blues and indigos, like the sky has not quite woken up yet. There is no rush here. Everything just hangs there, patient.

Then things start to shift. Slowly, almost imperceptibly, the motion picks up. Stars brighten. The palette warms into teals and electric violets. I think of it as the sky gathering energy, building toward something.

By the peak phase, it is almost chaotic. Swirls everywhere, particles moving fast and unpredictable, like the whole sky is restless. This felt right to me. Van Gogh did not paint a calm sky, after all. His sky is turbulent, emotional. That is the whole point.

And then it settles. Colours fade back, motion slows, the cycle resets. I set timers across five dimensions so the whole system transitions together, palette and speed and brightness all shifting smoothly over a few minutes. The idea is not that anyone clocks the changes consciously, just that they feel the whole thing breathing, alive, changing in the background while everything else is happening.

### 3. Perlin Noise & Randomness
**Owner: Yichen Yao** File: Perlinnoise.js
#### Concept
My mechanic is Perlin noise and randomness, realised as the living marine
life of the group's ocean scene: a school of fish and an occasional
whale. The aim is for randomness to look calm and alive rather than chaotic —
every fish follows the same rules, yet no two move alike, and the scene never
plays out the same way twice.
#### What I built
Fish school (Fish class). random() sets each fish's size, body shape,
position, speed, and colour, so one class produces a varied school. Each fish
picks its colour from a four-colour palette drawn from the four phase
backgrounds, so the school always matches the current phase. A random() depth
value (z-axis) scales size, colour, and speed — near fish are large, vivid, and
fast; far fish small, faded, and slow — and the school is sorted by depth for a
front-to-back sense of space. Motion comes from noise(), which slowly drifts
each fish's swim lane up and down, plus a sin() bob and a delayed-phase sin()
tail sway that bends the body into a soft S-shape.
Whale (Whale class). random() is checked against a low probability each
frame, so the whale breaches only rarely. It follows a parabolic arc (4t(1−t))
whose speed depends on height — fast leaving the water, slow at the apex, fast on
the way down. The body is built from flat polygon facets shaded in brightness
bands, with no outline.
Wave layers. Two phase-shifted sin() wave bands, one behind
and one in front of the fish, make the school look like it is inside the water.



### 4. User input -Mouse-Controlled Balance System
**Owner: Danlin Liu**

This sketch introduces a mouse-driven balance mechanic centred on a wooden boat navigating a dreamlike seascape. A small cat character stands aboard the vessel, and the player's horizontal mouse position determines where the cat stands on the deck — moving the cursor left shifts the cat to the left side of the boat, while moving right does the opposite.

The boat responds physically to this weight displacement: the further the cat stands from the centre, the more the hull tilts. A natural wave oscillation is layered on top, meaning the player must constantly make subtle adjustments to counteract both their own movement and the sea's rhythm.

A Balance Bar at the top of the canvas provides real-time feedback, shifting from green to yellow to red as the tilt increases. The cat's body language reinforces this — whiskers steady and expression calm when balanced, paws spread wide and eyes wide with alarm when the boat leans dangerously.

The interaction invites a meditative quality: there is no winning or losing, only the ongoing negotiation between stillness and motion.






## Part 3. Putting It Together

The four mechanics coexist on the same canvas without interfering with each other, tied together by the particle system and the shared Starry Night palette. Audio shapes colour and speed, Perlin noise keeps the baseline movement organic, user interaction adds vortex disruptions, and time controls the overall mood arc of the whole piece. On their own they are fine, but together they create something that feels complete, a sky that responds to sound and touch and time, shifting whether you interact with it or not.
