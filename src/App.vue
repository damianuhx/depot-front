<template>
  <router-view />
</template>

<script setup>

import { Notify } from "quasar";
import { onMounted } from "vue";

  const showNotification = (message, type) => {
    Notify.create({
      message,
      type,
      position: 'bottom',
      timeout: 20000, // Adjust the timeout as per your preference
      closeBtn:'Close'
    });
  };

  const updateOnlineStatus = () => {
    const internetStatus =  navigator.onLine;

    if (internetStatus) {
      showNotification('Connected to the internet', 'positive');
    } else {
      showNotification('You are offline', 'negative');
    }
  };
  onMounted(() => {
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('online', updateOnlineStatus);
});
</script>
