
<template>
  Hier können Produkte bestellt werden: Wählen Sie die gewünschte Lieferung und drücken sie auf Suchen. Danach können Sie die gewünschte Anzahl der Produkte eingeben und speichern.
  <div style="display:inline-flex">
  <q-select v-if="typeof props.user === 'undefined'" style="width: 250px;" outlined v-model="data.selected_user.id" option-value="id" option-label="name" :options="data.user" label="Kunde" emit-value map-options/>
  <div v-else-if="props.user && props.user.id>0"></div>
  <q-select style="width: 250px;" outlined v-model="data.selected_order.id" option-value="id" option-label="name" :options="data.order" label="Bestellung" emit-value map-options/>
  <q-btn style="margin-left: 20px" color="primary" icon="las la-search" @click="load()"/>
  <q-btn style="margin-left: 20px" color="primary" icon="las la-print" @click="print()"/>
  <q-btn style="margin-left: 20px" color="primary" icon="las la-sync" @click="load()"/>
  <q-btn style="margin-left: 20px" color="primary" icon="las la-sign-out-alt" @click="logout()"/>

</div>

<div v-if="typeof props.user === 'undefined'">
</div>
<div v-else>

</div>

<h3>Total: CHF {{datian.round(total())}}</h3>
<h3 v-if="typeof props.user !== 'undefined' && props.user.is_member>0">Rabatt: ET {{datian.round(total(true))}}</h3>


<div v-if="typeof data.selected_user === 'undefined'">{{data.selected_user.name}}</div>

<div clickable v-for="(supplier, i) in data.supplier" :key="i">

  <div class="text-h5">{{supplier.name}}</div>
    <q-item clickable v-for="(product, i) in supplier.product" :key="i">
      <div style="width: 240px; margin-top: 15px" class=" q-mr-lg">{{product.name}}:</div>
      <div style="text-align: right; width: 150px; margin-top: 15px" class=" q-mr-lg">{{product.unit}} = CHF {{datian.round(product.price)}}{{(product.split>0) ? '*' : ''}}</div><div v-if="typeof props.user !== 'undefined' && props.user.is_member>0" style="margin-right: 15px; text-align: right; width: 40px; margin-top: 15px; ">({{product.discount}}%)</div>
      <q-input v-if="product.split>0" step="0.01"  style="width: 80px" :dense="true" outlined v-model="product.order_product.quantity" type="number" label="quantity" />
      <q-input v-else  style="width: 80px" :dense="true" outlined v-model="product.order_product.quantity" type="number" label="quantity" />

      <q-btn :dense="true" style="margin-left: 20px" color="primary" icon="edit" @click="datian.update(product.order_product, 'order_product')" v-if="product.order_product.id">Speichern</q-btn>
      <q-btn :dense="true" style="margin-left: 20px" color="primary" icon="add" @click="datian.create(product.order_product, 'order_product');" v-else >Speichern</q-btn>
      <div style="text-align: right; width: 100px; margin-top: 15px" class=" q-mr-lg">CHF {{(product.price*product.order_product.quantity).toFixed(2)}}</div>
    </q-item>
  </div>
<h3>Total: CHF {{datian.round(total())}}</h3>
<h3 v-if="typeof props.user !== 'undefined' && props.user.is_member>0">Rabatt: ET {{datian.round(total(true))}}</h3>

  </template>
<script setup>
import { Cookies } from 'quasar';
import { api, datian} from "boot/axios";
import { onMounted, onBeforeMount, reactive } from "vue";
import axios from "axios";

//data and props
const data = reactive({
  selected_user: {id: null, is_admin: 1},
  selected_order: {id: null},
  supplier: {},
});
const props = defineProps(['user']);

//calls print command
const print = () => {
  window.print();
};

//deletes token and credentials from cookies and reloads the page
const logout = () => {
  Cookies.set('mail', '');
  Cookies.set('password', '');
  datian.token = '';
  location.reload();
};

//calculates the total of the ordered products
function total(eulach=false){
  var sum=0;
  for (let i=0; i<data.supplier.length; i++){
  for (let j=0; j<data.supplier[i].product.length; j++){
    if (data.supplier[i].product[j].order_product){
    if (eulach){
      sum+=data.supplier[i].product[j].order_product.quantity*data.supplier[i].product[j].price*data.supplier[i].product[j].discount/100;
    }
    else{
      sum+=data.supplier[i].product[j].order_product.quantity*data.supplier[i].product[j].price;
    }
    }
  }}
  return sum;
};

//
onBeforeMount(()=>
{
  if (typeof props.user !== 'undefined' && !parseInt(props.user.is_admin)>0){
    data.selected_user = props.user;
  }
  else{
    data.selected_user= {id: null, is_admin: 1};
  }
  api.get('da_user', {headers: { 'Authorization': datian.token }}).then((res) => {
      data.user=res.data.data.da_user;
    });
    api.get('order').then((res) => {
      data.order=res.data.data.order;
    });
});



//
onMounted(() => {
 if (props.user && props.user.id>0){
  api.get("order//latest").then((res) => {
    data.selected_order = res.data.data.order;
      //data.supplier.push({name: "", address: "", city: "", phone: "", email: "", });
    });
    }
    console.log('props');
    console.log(props);
    data.selected_user = props.user;
  load();
 }
);

const load = () => {
 console.log(data);

  axios.request({
	"method": "GET",
	"url": datian.baseURL+"sproduct//"+data.selected_order.id+'/'+data.selected_user.id, //add user and order
	"headers": {
		"Content-Type": "application/json; charset=utf-8",
    'Authorization': datian.token
	}
}).then( (result) => {
  data.supplier = result.data.data.supplier;
  data.supplier.forEach((supplier) => {
    supplier.product.forEach((product) =>
    {
      if (!product.order_product.length){
        product.order_product = {quantity: 0, product:{id: product.id}, user: data.selected_user, order: data.selected_order};
      }
      else{
        product.order_product = product.order_product[0];
      }
    })
  });

});
   api.get("supplier").then((res) => {
      data.supplier = res.data.data.supplier;
      data.supplier.push({name: "", address: "", city: "", phone: "", email: "", });
    });
    }
</script>
