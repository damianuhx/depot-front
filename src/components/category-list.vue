
<template>
  Kategorien: Hier können Kategorien eingetragen werden nach denen die Produkte gruppiert werden können (noch nicht im Einsatz)
  <q-list bordered separator class="q-ma-md">
  <q-item clickable v-for="(category, i) in data.category" :key="i">

          <q-item-section>
              <q-input outlined v-model="category.name" label="name" />
          </q-item-section>
          <q-item-section side>
<q-btn color="primary" icon="edit" @click="datian.update(category, 'category')" v-if="category.id" />
<q-btn color="positive" icon="add" @click="datian.create(category, 'category', data.category)" v-else />

</q-item-section>
<q-item-section side>
<q-btn color="negative" icon="delete" @click="datian.delete(category, 'category', data.category, i)" v-if="category.id" />
</q-item-section></q-item>
  </q-list>
  </template>
<script setup>
import { api, datian} from "boot/axios";
import { onMounted, reactive } from "vue";
const data = reactive({});
onMounted(() => {
load();
});
const load = () => {
  api.get("category", {headers: { 'Authorization': datian.token }}).then((res) => {
  data.category = res.data.data.category;
  data.category.push({name: "", });
});}
</script>
