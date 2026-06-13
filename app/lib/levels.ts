/**
 * The level structure of the experience. Section DOM ids, HUD labels and
 * camera keyframes all index off this list, so the world and the page
 * can never drift out of sync.
 */

export interface Level {
  id: string;
  num: string;
  title: string;
}

export const LEVELS: Level[] = [
  { id: "hero", num: "00", title: "ORIGIN" },
  { id: "about", num: "01", title: "THE PILOT" },
  { id: "projects", num: "02", title: "MISSIONS" },
  { id: "skills", num: "03", title: "SKILL TREE" },
  { id: "education", num: "04", title: "ARCHIVE" },
  { id: "credits", num: "05", title: "CREDITS" },
];

/**
 * Camera keyframes, one per level. Positions trace a single dolly path
 * deeper into the network (-z), then pull up and back for the credits
 * reveal. FOV 42 ≈ a 50mm lens — product-shot framing, no fisheye drift.
 */
export const CAMERA_PATH: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [-0.6, 0.5, 9.5], look: [0.9, 0.3, 0] }, // 00 ORIGIN — core right of frame, type left
  { pos: [-4.2, 1.4, 1.5], look: [-1.5, 0.6, -7] }, // 01 PILOT — drifting left through the field
  { pos: [0, 1.8, -8.5], look: [0, 1.0, -16] }, // 02 MISSIONS — approaching the monuments
  { pos: [5.2, 4.0, -22.5], look: [0.4, 3.6, -30] }, // 03 SKILL TREE — orbiting the constellation
  { pos: [-2.2, 1.2, -37], look: [0, 1.2, -46] }, // 04 ARCHIVE — into the ring corridor
  { pos: [0, 11, -10], look: [0, 0, -22] }, // 05 CREDITS — pull back, reveal the network
];
