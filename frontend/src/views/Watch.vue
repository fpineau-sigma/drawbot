<template>
  <div class="view">
    <main v-if="image" @click="startDraw">
      <div id="preview">
        <img ref="image" :src="image" @load="startDraw" />
        <canvas ref="preview"></canvas>
        <canvas ref="crosshair"></canvas>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Watch",
  data: () => ({
    image: null,
    width: 0,
    height: 0
  }),
  computed: {
    ...mapState(["file"]),
    preview: function() {
      return this.$refs.preview.getContext("2d");
    },
    crosshair: function() {
      return this.$refs.crosshair.getContext("2d");
    }
  },
  sockets: {
    moveTo({ x, y }) {
      this.preview.moveTo(x, y);
      this.drawCrossHair(x, y);
    },
    lineTo({ x, y }) {
      this.preview.lineTo(x, y);
      this.preview.stroke();
      this.drawCrossHair(x, y);
    }
  },
  methods: {
    drawCrossHair(x, y) {
      x = ~~x + 0.5;
      y = ~~y + 0.5;
      this.crosshair.clearRect(0, 0, this.width, this.height);
      this.crosshair.beginPath();
      this.crosshair.strokeStyle = "#333";
      this.crosshair.lineWidth = "3";
      this.crosshair.moveTo(x - 20, y);
      this.crosshair.lineTo(x + 20, y);
      this.crosshair.stroke();
      this.crosshair.beginPath();
      this.crosshair.moveTo(x, y - 20);
      this.crosshair.lineTo(x, y + 20);
      this.crosshair.stroke();
    },
    startDraw() {
      this.width = this.$refs.preview.width = this.$refs.crosshair.width = this.$refs.image.naturalWidth;
      this.height = this.$refs.preview.height = this.$refs.crosshair.height = this.$refs.image.naturalHeight;

      this.preview.beginPath();
      this.preview.lineWidth = "3";
      this.preview.strokeStyle = "#FF0000";

      const reader = new FileReader();
      reader.onload = ({ target: { result: svg } }) => {
        const svgDoc = new DOMParser().parseFromString(svg, "image/svg+xml");
        const singlePath = [...svgDoc.querySelectorAll("path")]
          .map(path => path.getAttribute("d").replace(/\s+/g, " "))
          .join(" ")
          .trim();
        this.$socket.client.emit("drawSvgPath", singlePath);
      };
      reader.readAsText(this.file);
    }
  },
  watch: {
    file(file) {
      this.image = URL.createObjectURL(file);
    }
  }
};
</script>

<style>
#preview {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
}
#preview img,
#preview canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
