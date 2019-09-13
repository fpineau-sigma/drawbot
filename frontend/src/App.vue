<template>
  <div id="app">
    <header>DrawBot</header>
    <nav>
      <Button
        type="file"
        accept="image/svg+xml"
        @file="selectedFile"
        icon="folder"
      />
      <LinkButton to="/control" icon="cursor-move" />
      <LinkButton to="/watch" icon="note" />
      <LinkButton to="/setup" icon="speedometer" />
      <LinkButton to="/cancel" icon="ban" />
    </nav>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";
import LinkButton from "@/components/LinkButton.vue";

export default {
  name: "app",
  components: { Button, LinkButton },
  methods: {
    selectedFile(file) {
      this.$store.commit("SELECTED_FILE", file);
      if (this.$router.currentRoute.name !== "watch")
        this.$router.push({ name: "watch" });
    }
  }
};
</script>

<style>
:root {
  --screen-width: 320px;
  --screen-height: 240px;
  --title-height: 23px;
  --button-size: 35px;
  --margin: 3px;
  --primary: #00629f;
}

body {
  margin: 0;
}

#app {
  font: normal 20px/1 "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #222;
  color: #fff;
  width: var(--screen-width);
  height: var(--screen-height);
  display: grid;
  grid-template: var(--title-height) 1fr / min-content 1fr;
  grid-template-areas: "header header" "nav view";
}

header {
  grid-area: header;
  background: var(--primary);
  line-height: var(--title-height);
  font-size: calc(var(--title-height) * 0.55);
  text-align: center;
  font-style: italic;
}

nav {
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}
nav {
  grid-area: nav;
}
nav :last-child {
  margin-top: auto;
}
nav button {
  background: transparent;
  opacity: 0.4;
}
.view {
  display: grid;
  grid-template: 1fr / 1fr min-content;
  grid-template-areas: "main aside";
}
main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--margin);
}
aside {
  grid-area: aside;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: var(--margin);
}
</style>
