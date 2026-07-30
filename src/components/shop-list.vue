
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
  <q-btn style="margin-left: 20px" color="primary" icon="las la-clipboard-check" @click="loadConfirmation()">
  <q-tooltip>
          Bestellbestätigung.
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
<div class="noprint row items-center q-gutter-sm">
  <span><q-checkbox v-model="data.only_added" />Nur bestellte Produkte anzeigen.</span>
  <q-input
    style="width: 260px"
    outlined
    dense
    clearable
    clear-icon="las la-times"
    v-model="data.product_filter"
    label="Filter"
    placeholder="Produktname"
    :color="filterText ? 'primary' : 'grey-7'"
  />
  <q-badge v-if="filterText" color="amber-6" text-color="black">Filter aktiv</q-badge>
</div>
<!--<q-btn style="margin-left: 20px" color="primary" icon="las la-sign-out-alt" @click="debug()"/>-->
<div v-if="typeof data.selected_user === 'undefined'">{{data.selected_user.name}}</div>

<span v-if="data.is_active && !data.only_added" >
  <span v-for="(supplier, i) in data.supplier" :key="i">
    <q-expansion-item
        icon="perm_identity"
        :label="supplier.name"
        :model-value="filterText ? supplierHasMatch(supplier) : undefined"
      >
        <q-card>
          <q-card-section>
    <span clickable v-for="(product, i) in supplier.product" :key="i" >
      <q-item v-if="matchesFilter(product) && (!data.only_added || product.order_product.oquantity>0) && ((product.available && (product.availableq==0 || product.quantity>0)) || (product.order_product.oquantity>0 && !data.is_active)) " >
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
      <q-item v-if="matchesFilter(product) && (!data.only_added || product.order_product.oquantity>0) && (product.available || (product.order_product.oquantity>0 && !data.is_active)) " >

        <div style="width: 240px; margin-top: 15px" class=" q-mr-lg">{{product.name}} :</div>
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

<q-dialog v-model="data.confirmation_open">
  <q-card style="min-width: 320px; width: 80vw; max-width: 900px">
    <q-card-section class="row items-center">
      <q-icon name="las la-clipboard-check" class="q-mr-sm" />
      <div class="text-h6">Bestellbestätigung</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div v-if="data.confirmation_loading">Lade Bestellbestätigung...</div>
      <div v-else-if="data.confirmation_supplier.length===0">Keine bestellten Produkte gefunden.</div>
      <div v-else>
        <div v-for="(supplier, i) in data.confirmation_supplier" :key="i" class="q-mb-md">
          <div class="text-subtitle1">{{supplier.name}}</div>
          <q-list dense>
            <q-item v-for="(product, j) in supplier.product" :key="j">
              <q-item-section>
                <q-item-label>{{product.name}}</q-item-label>
                <q-item-label caption>{{product.unit}} - CHF {{datian.round(product.price)}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label>{{product.order_product.quantity}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Schliessen" color="primary" v-close-popup />
    </q-card-actions>
  </q-card>
</q-dialog>

  </template>
<script setup>
import { Cookies } from 'quasar';
import { api, datian} from "boot/axios";
import { onMounted, onBeforeMount, reactive, computed } from "vue";
import axios from "axios";

const data = reactive({
  selected_user: {id: null, is_admin: 1},
  selected_order: {id: null},
  supplier: [],
  supplier_list: [],
  user: [],
  order: [],
  show_all:true,
  is_active: false,
  only_added: false,
  confirmation_open: false,
  confirmation_supplier: [],
  confirmation_loading: false,
  product_filter: "",
});

const filterText = computed(() => (data.product_filter || "").trim().toLowerCase());

const matchesFilter = (product) => {
  const query = filterText.value;
  if (!query) {
    return true;
  }
  return (product.name || "").toLowerCase().includes(query);
};

const supplierHasMatch = (supplier) => {
  const products = supplier && supplier.product ? supplier.product : [];
  return products.some((product) => matchesFilter(product));
};

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
  Cookies.remove('token');
  datian.setToken('');
  location.reload();
};

onMounted(() => {

});

const normalizeSuppliers = (suppliers) => {
  suppliers.forEach((supplier) => {
    supplier.product.forEach((product) =>
    {
      if (!product.order_product || !product.order_product.length){
        product.order_product = {quantity: 0, product:{id: product.id}, user: data.selected_user, order: data.selected_order};
      }
      else{
        product.order_product = product.order_product[0];
        product.order_product.oquantity = product.order_product.quantity;
      }
    })
  });
  return suppliers;
};

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
  const suppliers = (result && result.data && result.data.data && Array.isArray(result.data.data.supplier))
    ? result.data.data.supplier
    : [];
  data.supplier = normalizeSuppliers(suppliers);
  console.log(data.supplier);
  //foreach supplier if !order_product: order_product = {quantity = 0, product, order)
});
   api.get("supplier", {headers: { 'Authorization': datian.token }}).then((res) => {
      data.supplier_list = (res && res.data && res.data.data && Array.isArray(res.data.data.supplier))
        ? res.data.data.supplier
        : [];
      data.supplier_list.push({name: "", address: "", city: "", phone: "", email: "", });
    });
    }

const loadConfirmation = () => {
  data.confirmation_open = true;
  data.confirmation_loading = true;
  data.confirmation_supplier = [];
  const is_active = active();
  axios.request({
	"method": "GET",
	"url": datian.baseURL+"sproduct//"+data.selected_order.id+'/'+data.selected_user.id+'?active='+is_active, //add user and order
	"headers": {
		"Content-Type": "application/json; charset=utf-8",
    'Authorization': datian.token
	}
}).then( (result) => {
  const suppliers = (result && result.data && result.data.data && Array.isArray(result.data.data.supplier))
    ? result.data.data.supplier
    : [];
  const normalized = normalizeSuppliers(suppliers);
  const filtered = normalized
    .map((supplier) => {
      const products = supplier.product.filter((product) =>
        product.order_product && product.order_product.quantity > 0
      );
      return {...supplier, product: products};
    })
    .filter((supplier) => supplier.product.length > 0);
  data.confirmation_supplier = filtered;
}).catch((error) => {
  console.log(error);
  data.confirmation_supplier = [];
}).finally(() => {
  data.confirmation_loading = false;
});
};
</script>
