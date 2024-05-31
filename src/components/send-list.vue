
<template>
  Bestellliste:
  <div style="display:inline-flex; margin-bottom: 30px">
  <q-select style="width: 250px;" outlined v-model="data.selected_supplier.id" option-value="id" option-label="name" :options="data.suppliers" label="Lieferant" emit-value map-options/>
  <q-select style="width: 250px;" outlined v-model="data.selected_order.id" option-value="id" option-label="name" :options="data.order" label="Bestellung" emit-value map-options/>
  <q-btn color="primary" icon="las la-search" @click="load()"/>
  </div>
  <div clickable v-for="(supplier, i) in data.supplier" :key="i">

  <span v-for="(product, i) in supplier.product" :key="i">
    <q-item class="no-border" clickable v-if="product.quantity" >

      <div style="width: 500px; margin-top: 15px" class="no-border q-mr-lg">{{product.name}}</div>
      <div style="width: 180px; margin-top: 15px" class="no-border q-mr-lg">{{product.unit}} = {{datian.round(product.price)}}</div>
      <div class="no-border" style="font-size: 18px;">{{product.quantity}}</div>
      <div style="text-align: right; width: 150px; margin-top: 15px" class="no-border q-mr-lg">CHF {{datian.round(product.quantity*product.price)}}</div>
   </q-item>
  </span>
  </div>
  <h5>Total: CHF {{datian.round(data.sum)}}</h5>
  </template>
<script setup>
import { api, datian} from "boot/axios";
import { onMounted, onBeforeMount, reactive } from "vue";
import axios from "axios";

const data = reactive({
  selected_supplier: {id: null},
  selected_order: {id: null},
  supplier: {},
  suppliers: {},
});



onBeforeMount(()=>{
  api.get('supplier', {headers: { 'Authorization': datian.token }}).then((res) => {
      data.suppliers=res.data.data.supplier;
    });
    api.get('order', {headers: { 'Authorization': datian.token }}).then((res) => {
      data.order=res.data.data.order;
    });
});

/*function total(){
  console.log('LOOP');

  var sum=0;
  for (let i=0; i<data.supplier.length; i++){
    console.log(data.supplier[i]);
    for (let j=0; j<data.supplier[i].product.length; j++){
      //console.log(data.supplier[i].product[j]);

      }
  }
  return sum;
};*/

onMounted(() => {
//load();
});
const load = () => {
  axios.request({
	"method": "GET",
	"url": "https://bestellen-api.livingroom-winterthur.ch/ssupplier//"+data.selected_order.id+'/'+data.selected_supplier.id, //add user and order
	"headers": {
		"Content-Type": "application/json; charset=utf-8"
	}
}).then( (result) => {

  data.supplier = result.data.data.supplier;
  data.sum=0;
  for (let i=0; i<data.supplier.length; i++){
    console.log(data.supplier[i]);
    for (let j=0; j<data.supplier[i].product.length; j++){
        data.sum+=/*(100-data.supplier[i].product[j].discount)*0.01*/data.supplier[i].product[j].price*data.supplier[i].product[j].quantity;
      }
  }
  //foreach supplier if !order_product: order_product = {quantity = 0, product, order)
});
    /*api.get("supplier").then((res) => {
      data.supplier = res.data.data.supplier;
      data.supplier.push({name: "", address: "", city: "", phone: "", email: "", });
    });*/
    }
</script>
