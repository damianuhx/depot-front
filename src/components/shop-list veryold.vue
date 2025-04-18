
<template>
  Shop
  <q-select outlined v-model="data.selected_user.id" option-value="id" option-label="name" :options="data.user" label="Kunde" emit-value map-options/>
  <q-select outlined v-model="data.selected_order.id" option-value="id" option-label="name" :options="data.order" label="Bestellung" emit-value map-options/>
  <q-btn color="positive" icon="add" @click="load()"/>

  <div clickable v-for="(supplier, i) in data.supplier" :key="i">

  <div class="text-h2">{{supplier.name}}</div>
    <q-item clickable v-for="(product, i) in supplier.product" :key="i">
      <div class="text-h3 q-mr-lg">{{product.name}} ({{product.unit}}): CHF {{product.price}}</div>
      <q-input outlined v-model="product.order_product.quantity" type="number" label="quantity" />
      <q-btn color="primary" icon="edit" @click="datian.update(product.order_product, 'order_product')" v-if="product.order_product.id" />
      <q-btn color="positive" icon="add" @click="datian.create(product.order_product, 'order_product')" v-else />
    </q-item>
  </div>
  </template>
<script setup>
import { api, datian} from "boot/axios";
import { onMounted, onBeforeMount, reactive } from "vue";
import axios from "axios";

const data = reactive({
  selected_user: {id: null},
  selected_order: {id: null}
});

onBeforeMount(()=>{
  api.get('da_user').then((res) => {
      data.user=res.data.data.da_user;
    });
    api.get('order').then((res) => {
      data.order=res.data.data.order;
    });
});

onMounted(() => {
//load();
});
const load = () => {
  axios.request({
	"method": "GET",
	"url": "https://bestellen-api.livingroom-winterthur.ch/sproduct//"+data.selected_order.id+'/'+data.selected_user.id, //add user and order
	"headers": {
		"Content-Type": "application/json; charset=utf-8"
	}
}).then( (result) => {
  console.log(result);
  data.supplier = result.data.data.supplier;
  data.supplier.forEach((supplier) => {
    supplier.product.forEach((product) =>
    {
      console.log(product);
      if (!product.order_product.length){
        product.order_product = {quantity: 0, product:{id: product.id}, user: data.selected_user, order: data.selected_order};
      }
      else{
        product.order_product = product.order_product[0];
      }
    })
  });
  //foreach supplier if !order_product: order_product = {quantity = 0, product, order)
});
    /*api.get("supplier").then((res) => {
      data.supplier = res.data.data.supplier;
      data.supplier.push({name: "", address: "", city: "", phone: "", email: "", });
    });*/
    }
</script>
