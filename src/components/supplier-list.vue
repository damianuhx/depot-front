
<template>
  Lieferanten: Hier werden alle Lieferanten eingetragen, nach denen die Produkte sortiert werden
  <q-list bordered separator class="q-ma-md">
  <q-item clickable v-for="(supplier, i) in data.supplier" :key="i">

          <q-item-section>
              <q-input outlined v-model="supplier.name" label="name" />
          </q-item-section>

          <q-item-section>
              <q-input outlined v-model="supplier.address" label="address" />
          </q-item-section>

          <q-item-section>
              <q-input outlined v-model="supplier.city" label="city" />
          </q-item-section>

          <q-item-section>
              <q-input outlined v-model="supplier.phone" label="phone" />
          </q-item-section>

          <q-item-section>
              <q-input outlined v-model="supplier.email" label="email" />
          </q-item-section>
          <q-item-section side>
<q-btn color="primary" icon="edit" @click="datian.update(supplier, 'supplier')" v-if="supplier.id" />
<q-btn color="positive" icon="add" @click="datian.create(supplier, 'supplier', data.supplier)" v-else />

</q-item-section>
<q-item-section side>
<q-btn color="negative" icon="delete" @click="datian.delete(supplier, 'supplier', data.supplier, i)" v-if="supplier.id" />
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
    api.get("supplier", {headers: { 'Authorization': datian.token }}).then((res) => {
      data.supplier = res.data.data.supplier;
      data.supplier.push({name: "", address: "", city: "", phone: "", email: "", });
    });}
</script>
