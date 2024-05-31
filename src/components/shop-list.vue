
<template>
  <div style="display:inline-flex">
  <q-select v-if="typeof props.user === 'undefined'" style="width: 250px;" outlined v-model="data.selected_user.id" option-value="id" option-label="name" :options="data.user" label="Kunde" emit-value map-options/>
  <div v-else-if="props.user && props.user.id>0"></div>
  <q-select style="width: 250px;" outlined v-model="data.selected_order.id" option-value="id" option-label="name" :options="data.order" label="Bestellung" emit-value map-options/>
  <q-btn style="margin-left: 20px" color="primary" icon="las la-search" @click="load()">
  <q-tooltip>
          Lade oder aktualisiere die gewählte Bestellliste.
        </q-tooltip>
      </q-btn>
  <q-btn style="margin-left: 20px" color="primary" icon="las la-print" @click="print()">
  <q-tooltip>
          Drucken.
        </q-tooltip>
      </q-btn>
  <q-btn style="margin-left: 20px" color="primary" icon="las la-sign-out-alt" @click="logout()">
  <q-tooltip>
          Auslogen. Logindaten werden vom Browser gelöscht. Nur nötig falls du den Computer mit anderen Personen teilst.
        </q-tooltip>
      </q-btn>
</div>

<div v-if="typeof props.user === 'undefined'">
</div>

<div v-else>

</div>
<span class="noprint"><q-checkbox v-model="data.only_added" />Nur bestellte Produkte anzeigen.</span>
<!--<q-btn style="margin-left: 20px" color="primary" icon="las la-sign-out-alt" @click="debug()"/>-->
<div v-if="typeof data.selected_user === 'undefined'">{{data.selected_user.name}}</div>

<span v-if="data.is_active && !data.only_added" >
  <span v-for="(supplier, i) in data.supplier" :key="i">
    <q-expansion-item
        icon="perm_identity"
        :label="supplier.name"
      >
        <q-card>
          <q-card-section>
    <span clickable v-for="(product, i) in supplier.product" :key="i" >
      <q-item v-if="(!data.only_added || product.order_product.oquantity>0) && ((product.available && (product.availableq==0 || product.quantity>0)) || (product.order_product.oquantity>0 && !data.is_active)) " >
{{product.availableq}}
        <div style="width: 240px; margin-top: 15px" class=" q-mr-lg">{{product.name}}:</div>
        <div style="text-align: right; width: 150px; margin-top: 15px" class=" q-mr-lg">{{product.unit}} = CHF {{datian.round(product.price)}}{{(product.split>0) ? '*' : ''}}</div><div v-if="typeof props.user !== 'undefined' && props.user.is_member>0" style="margin-right: 15px; text-align: right; width: 40px; margin-top: 15px; ">({{product.discount}}%)</div>
        <div style="font-size: 24px; padding: 5px;" v-if="!data.is_active">{{product.order_product.quantity}}</div>
        <q-input v-else-if="product.split>0" step="0.1"  style="width: 80px" :dense="true" outlined v-model="product.order_product.quantity" min="0" type="number" label="quantity" />
        <q-input v-else  style="width: 80px" :dense="true" outlined v-model="product.order_product.quantity" type="number" min="0" label="quantity" />
  <span v-if="data.is_active">
        <q-btn :dense="true" style="margin-left: 20px" color="primary" icon="edit" @click="datian.update(product.order_product, 'order_product')" v-if="product.order_product.id">Bestellen</q-btn>
        <q-btn :dense="true" style="margin-left: 20px" color="primary" icon="add" @click="datian.create(product.order_product, 'order_product');" v-else >Bestellen</q-btn>
  </span>
        <div style="text-align: right; width: 100px; margin-top: 15px" class=" q-mr-lg">CHF {{(product.price*product.order_product.quantity).toFixed(2)}}</div>
        <div v-if="data.is_active" style="text-align: right; width: 100px; margin-top: 15px" class=" q-mr-lg">{{product.category.name}}</div>
      </q-item>
    </span>
  </q-card-section>
        </q-card>
      </q-expansion-item>
  </span>
</span>

<span v-else >
  <span v-for="(supplier, i) in data.supplier" :key="i">
    <h6 style="margin:0">{{supplier.name}}</h6>

    <span clickable v-for="(product, i) in supplier.product" :key="i" >
      <q-item v-if="(!data.only_added || product.order_product.oquantity>0) && (product.available || (product.order_product.oquantity>0 && !data.is_active)) " >

        <div style="width: 240px; margin-top: 15px" class=" q-mr-lg">{{product.name}}:</div>
        <div style="text-align: right; width: 150px; margin-top: 15px" class=" q-mr-lg">{{product.unit}} = CHF {{datian.round(product.price)}}{{(product.split>0) ? '*' : ''}}</div><div v-if="typeof props.user !== 'undefined' && props.user.is_member>0" style="margin-right: 15px; text-align: right; width: 40px; margin-top: 15px; ">({{product.discount}}%)</div>
        <div style="font-size: 24px; padding: 5px;" v-if="!data.is_active">{{product.order_product.quantity}}</div>
        <q-input v-else-if="product.split>0" step="0.01"  style="width: 80px" :dense="true" outlined v-model="product.order_product.quantity" type="number" label="quantity" />
        <q-input v-else  style="width: 80px" :dense="true" outlined v-model="product.order_product.quantity" type="number" label="quantity" />
  <span v-if="data.is_active">
        <q-btn :dense="true" style="margin-left: 20px" color="primary" icon="edit" @click="datian.update(product.order_product, 'order_product')" v-if="product.order_product.id">Bestellen</q-btn>
        <q-btn :dense="true" style="margin-left: 20px" color="primary" icon="add" @click="datian.create(product.order_product, 'order_product');" v-else >Bestellen</q-btn>
  </span>
        <div style="text-align: right; width: 100px; margin-top: 15px" class=" q-mr-lg">CHF {{(product.price*product.order_product.quantity).toFixed(2)}}</div>
        <div v-if="data.is_active" style="text-align: right; width: 100px; margin-top: 15px" class=" q-mr-lg">{{product.category.name}}</div>
      </q-item>
    </span>
  </span>
</span>



<h3>Total: CHF {{datian.round(total())}}</h3>
<h3 v-if="(typeof props.user !== 'undefined' && props.user.is_member>0) || is_admin()>0">Rabatt: ET {{datian.round(total(true))}}</h3>

  </template>
<script setup>
import { Cookies } from 'quasar';
import { api, datian} from "boot/axios";
import { onMounted, onBeforeMount, reactive } from "vue";
import axios from "axios";

const data = reactive({
  selected_user: {id: null, is_admin: 1},
  selected_order: {id: null},
  supplier: {},
  show_all:true,
  is_active: false,
  only_added: false,
});

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

onBeforeMount(()=>
{
  if (typeof props.user !== 'undefined' && !parseInt(props.user.is_admin)>0){
    data.selected_user = props.user;
  }
  else{
    data.selected_user= {id: null, is_admin: 1, is_member: 1};
  }

  api.get('da_user', {headers: { 'Authorization': datian.token }}).then((res) => {
      data.user=res.data.data.da_user;
    });
    api.get('order', {headers: { 'Authorization': datian.token }}).then((res) => {
      data.order=res.data.data.order;
      data.order.forEach((entry)=>{
        data.selected_order.id=entry.id;

        if (!!data.selected_user.is_admin>0){
          console.log('YES');
          load();
        }
      });
    });
});

const is_admin = () => {
  if (data.user){
    let returnvalue=false;
  data.user.forEach( (entry) => {
    if (entry.id == data.selected_user.id){
      console.log (entry.is_member);
      returnvalue = entry.is_member;
    }
  });
  return returnvalue;
}
};

const props = defineProps(['user']);

const print = () => {
  window.print();
};

const active = () => {
  let active = false;
  data.order.forEach((entry)=>{
    if (entry.id==data.selected_order.id){
      if (entry.active>0){
        active = true;
      }
      else{
        active = false;
      }
    }
  });
  return active;
};

const logout = () => {
  Cookies.set('mail', '');
  Cookies.set('password', '');
  datian.token = '';
  location.reload();
};

onMounted(() => {

});

const load = () => {
  data.is_active=active();
  console.log(datian.baseURL+"sproduct//"+data.selected_order.id+'/'+data.selected_user.id+'?active='+data.is_active);
  axios.request({
	"method": "GET",
	"url": datian.baseURL+"sproduct//"+data.selected_order.id+'/'+data.selected_user.id+'?active='+data.is_active, //add user and order
	"headers": {
		"Content-Type": "application/json; charset=utf-8",
    'Authorization': datian.token
	}
}).then( (result) => {
  data.supplier = result.data.data.supplier;
  console.log(data.supplier);
  data.supplier.forEach((supplier) => {
    supplier.product.forEach((product) =>
    {
      if (!product.order_product.length){
        product.order_product = {quantity: 0, product:{id: product.id}, user: data.selected_user, order: data.selected_order};
      }
      else{
        product.order_product = product.order_product[0];
        product.order_product.oquantity = product.order_product.quantity;
      }
    })
  });
  //foreach supplier if !order_product: order_product = {quantity = 0, product, order)
});
   api.get("supplier", {headers: { 'Authorization': datian.token }}).then((res) => {
      data.supplier = res.data.data.supplier;
      data.supplier.push({name: "", address: "", city: "", phone: "", email: "", });
    });
    }
</script>
