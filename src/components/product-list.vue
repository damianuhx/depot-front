
<template>
  Produkte: Hier können bestellbare Produkte geändert werden
  <q-list bordered separator class="q-ma-md">
  <q-item clickable v-for="(product, i) in data.product" :key="i">

          <q-item-section>
              <q-input outlined v-model="product.name" label="name" />
          </q-item-section>

          <q-item-section>
              <q-input outlined v-model="product.unit" label="unit" />
          </q-item-section>

          <q-item-section style="max-width: 100px">
              <q-input outlined v-model="product.quantity" type="number" label="quantity" />
          </q-item-section>

          <q-item-section style="max-width: 40px">
          teilbar
            <q-checkbox
            true-value="1"
            false-value="0"
            v-model="product.split" />
          </q-item-section>



          <q-item-section style="max-width: 100px">
              <q-input outlined v-model="product.price" type="number" label="price" />
          </q-item-section>

          <q-item-section style="max-width: 100px">
              <q-input outlined v-model="product.discount" type="number" label="discount" />
          </q-item-section>

          <q-item-section style="max-width: 40px">
          verfügbar
            <q-checkbox
            true-value="1"
            false-value="0"
            v-model="product.available" />
          </q-item-section>


          <q-item-section style="max-width: 40px">
          Lager
            <q-checkbox
            true-value="1"
            false-value="0"
            v-model="product.availableq" />
          </q-item-section>

        <q-item-section>
          <q-select outlined v-model="product.supplier.id" option-value="id" option-label="name" :options="data.supplier" label="supplier" emit-value map-options/>
        </q-item-section>
        <q-item-section>
          <q-select outlined v-model="product.category.id" option-value="id" option-label="name" :options="data.category" label="category" emit-value map-options/>
        </q-item-section><q-item-section side>
<q-btn color="primary" icon="edit" @click="datian.update(product, 'product')" v-if="product.id" />
<q-btn color="positive" icon="add" @click="datian.create(product, 'product', data.product)" v-else />

</q-item-section>
<q-item-section side>
<q-btn color="negative" icon="delete" @click="datian.delete(product, 'product', data.product, i)" v-if="product.id" />
</q-item-section></q-item>
  </q-list>
  </template>
<script setup>
import { api, datian} from "boot/axios";
import { onMounted, reactive} from "vue";
const data = reactive({});
onMounted(() => {
load();
});
const load = () => {
    api.get("supplier", {headers: { 'Authorization': datian.token }}).then((res) => {
      data.supplier = res.data.data.supplier;
    });
    api.get("category", {headers: { 'Authorization': datian.token }}).then((res) => {
      data.category = res.data.data.category;
    });
  api.get("product//bysupplier", {headers: { 'Authorization': datian.token }}).then((res) => {
  data.product = res.data.data.product;
  data.product.push({name: "", unit: "", quantity: "", split: 0, available: 0, price: "", discount: "", supplier: {}, category: {}, });
});}
</script>
