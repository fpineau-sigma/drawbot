<template>
  <div class="view">
    <main>
      <Button
        :size="60"
        value="Restart?"
        @click="$socket.client.emit('reboot')"
      />
    </main>
  </div>
</template>

<script>
import Button from "@/components/Button.vue";

export default {
  name: "Cancel",
  components: { Button },
  activated: function() {
    this.$socket.client.emit("pause", 0);
  }
};
</script>
