<template>
  <div class="view">
    <main>
      <div class="buttons">
        <Button :size="buttonSize" value="New Home" />
        <Button :size="buttonSize" value="Shutdown" />
        <Button
          :size="buttonSize"
          value="Reboot"
          @click="$socket.client.emit('reboot')"
        />
      </div>
    </main>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  name: "Cancel",
  components: { Button },
  data: () => ({
    buttonSize: 1.3
  }),
  activated: function() {
    this.$socket.client.emit("pause", 0);
  }
};
</script>

<style>
.buttons {
  display: flex;
  flex-direction: column;
}
</style>
