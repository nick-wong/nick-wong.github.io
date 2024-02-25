import Phaser from "phaser";

// https://phaser.discourse.group/t/grayscale-in-phaser3/6369/3
export const GrayscalePipeline = new Phaser.Class({
  Extends: Phaser.Renderer.WebGL.Pipelines.MultiPipeline,
  initialize: function GrayscalePipeline(game) {
    Phaser.Renderer.WebGL.Pipelines.MultiPipeline.call(this, {
      game: game,
      renderer: game.renderer,
      fragShader: `
          precision mediump float;
          uniform sampler2D uMainSampler;
          varying vec2 outTexCoord;
          void main(void) {
          vec4 color = texture2D(uMainSampler, outTexCoord);
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          gl_FragColor = vec4(vec3(gray), color.a);
          }`,
    });
  },
});
