
## Part 1: Project direction

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


### 4. User input — Vortex disturbance
**Owner: Danlin Liu**

The user input mechanic turns the viewer into someone who can actually touch the sky. By default, the particles on screen drift along the same kind of swirling paths you see in Van Gogh's brushstrokes. Nothing happens until you move the mouse.

When you drag the mouse across the canvas, a new vortex centre appears at the cursor. Nearby particles get pulled toward it and start orbiting in spirals, like a small version of the big swirl in the upper-right corner of the original painting. You can create several of these at once, so the night sky ends up with multiple focal points layered on top of each other. When you stop dragging, the vortex slowly loses energy and dissolves back into the regular flow.

If you press and hold the mouse without moving, something different happens. Energy builds up at that spot, and when you release, it bursts outward in a ring of light, the same way Van Gogh's stars seem to radiate brightness into the surrounding sky.

This ties back to the project vision because the whole point is to make the painting something you can reach into rather than just look at. The viewer is not watching the night sky. They are pushing it around.




## Part 3. Putting It Together

The four mechanics coexist on the same canvas without interfering with each other, tied together by the particle system and the shared Starry Night palette. Audio shapes colour and speed, Perlin noise keeps the baseline movement organic, user interaction adds vortex disruptions, and time controls the overall mood arc of the whole piece. On their own they are fine, but together they create something that feels complete, a sky that responds to sound and touch and time, shifting whether you interact with it or not.
