<template>
  <q-page v-if="data.user.is_admin>0" class="">
    <q-tabs v-model="tab" narrow-indicator dense align="justify">
      <q-tab class="text-blue" name="Products" icon="las la-apple-alt" label="Produkte" />
      <q-tab class="text-blue" name="Orders" icon="las la-shopping-cart" label="Bestellungen" />
      <q-tab class="text-blue" name="Customers" icon="las la-user" label="Kunden" />
      <q-tab class="text-blue" name="Suppliers" icon="las la-truck" label="Lieferanten" />
      <q-tab class="text-blue" name="Categories" icon="las la-archive" label="Kategorien" />
      <q-tab class="text-blue" name="Shop" icon="las la-store" label="Shop" />
      <q-tab class="text-blue" name="List" icon="las la-list" label="Listen" />
      <!--
        <q-tab class="text-blue" name="List" icon="las la-store-alt" label="Lokal" />
        <q-tab class="text-blue" name="List" icon="las la-clipboard-list" label="Zusammenfassung" />
      -->
    </q-tabs>
 <q-tab-panels v-model="tab" animated>
     <q-tab-panel name="Products">
        <tab-product/>
     </q-tab-panel>
      <q-tab-panel name="Orders">
        <tab-order/>
     </q-tab-panel>
      <q-tab-panel name="Customers">
        <tab-customer/>
      </q-tab-panel>
      <q-tab-panel name="Suppliers">
        <tab-supplier/>
     </q-tab-panel>
     <q-tab-panel name="Categories">
        <tab-category/>
     </q-tab-panel>
     <q-tab-panel name="Shop">
        <tab-shop/>
     </q-tab-panel>
     <q-tab-panel name="List">
        <tab-list/>
     </q-tab-panel>
     <q-tab-panel name="Location">
        <location-list/>
     </q-tab-panel>
     <q-tab-panel name="Summary">
        <summary-list/>
     </q-tab-panel>
</q-tab-panels>



  </q-page>


  <q-page v-else-if="!data.user.valid" class="">


    <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="mails" label="Einloggen" />
          <q-tab name="alarms" label="Registrieren" />
        </q-tabs>

        <q-separator />


        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails">
            <q-input outlined v-model="data.user.mail" label="E-Mail" />
            <q-input outlined v-model="data.user.password" label="Password" />
            <q-btn color="primary" icon="las la-sign-in-alt" @click="login()" />
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Registrieren</div>
            <q-input outlined v-model="data.user.name" label="Name" />
            <q-input outlined v-model="data.user.password" label="Password" />
            <q-input outlined v-model="data.user.mail" label="E-Mail" />
            <q-input outlined v-model="data.user.phone" label="Telefon" />
            <q-btn color="primary" icon="las la-user-plus" @click="register()" />
          </q-tab-panel>
        </q-tab-panels>

        <div style="text-align: center; padding: 50px;">
    Willkommen beim Lebensmittel Depot Winterthur!<br/>
    <br/>
Toll, dass Du mitbestellst bei dieser Runde.<br/>
<br/>
Wenn Du Dich einmal registriert hast, mit Name, E-Mail-Adresse, Password und Telefonnr., kannst Du Dich später ganz leicht einloggen.<br/>
<br/>
Deine Bestellung kannst Du bis Ende der Bestellfrist ergänzen/verändern. Ist die Bestellfrist abgelaufen, bekommst Du eine Bestätigung für Deine Bestellung.<br/>
<br/>
Sollte es Probleme mit dieser Software geben, kannst Du alternativ eine <a :href="printlistUrl">druckbare Liste aller Produkte hier </a>. Schicke diese Liste dann ausgefüllt (als PDF oder ausgedruckt) an depot@livingroom-winterthur.ch<br/>
<br/>
Wir wünschen Dir viel Vergnügen an unseren Produkten und freuen uns, Dich bei uns im Depot begrüssen zu dürfen!<br/>
<br/>
Das Projektteam</div>
  </q-page>

  <q-page v-else class="">
    <TabShop :user="data.user"/>
  </q-page>





</template>
<script setup>
//if !user: show login/register
//else if !is_admin: show shop-list with user_id from token
//else: show current site.

//onMount: user=user by token
import { Cookies } from 'quasar';
import { onMounted, reactive } from "vue";
import { api, datian} from "boot/axios";

const data = reactive({
  user:{},
});

const load = () => {
  //
}

const setSessionToken = (token) => {
  datian.setToken(token);
  if (token){
    Cookies.set('token', token);
  }
  else{
    Cookies.remove('token');
  }
};

const login = () => {
  const mail = (data.user.mail || '').trim();
  const password = data.user.password || '';
  Cookies.set('mail', mail);
  Cookies.set('password', password);
  api.post("user/login", { mail: mail, password: password }).then((res) => {
    const user = res.data?.data?.user || {};
    if (user && user.token){
      data.user = user;
      setSessionToken(user.token);
    }
    else{
      data.user = { mail: mail, password: password, valid: false };
      setSessionToken('');
    }
  });
}

const register = () => {
  api.post("user/register", data.user).then(() => {
    login();
});
}

const debug = () => {
  console.log(data);
}
const runtimeConfig =
  typeof window !== "undefined" && window.__APP_CONFIG__
    ? window.__APP_CONFIG__
    : {};
const printlistUrl =
  runtimeConfig.PRINTLIST_URL ||
  import.meta.env.VITE_PRINTLIST_URL ||
  "http://localhost:8860/printlist";
onMounted(() => {
  const mail = Cookies.get('mail');
  const password = Cookies.get('password');
  if (typeof mail === 'string'){
    data.user.mail = mail;
  }
  if (typeof password === 'string'){
    data.user.password = password;
  }

  const token = Cookies.get('token');
  if (typeof token === 'string' && token.length){
    datian.setToken(token);
    api.get("user/me", {headers: { 'Authorization': token }}).then((res) => {
      data.user = res.data?.data?.user || {};
      if (!data.user.token){
        setSessionToken('');
      }
    }).catch(() => {
      setSessionToken('');
      data.user = { mail: mail || '', password: password || '', valid: false };
    });
  }
  load();
});

import { ref } from "vue";

import TabProduct from 'src/components/product-list.vue'
import TabSummary from 'src/components/summary-list.vue'
import TabLocation from 'src/components/location-list.vue'
import TabOrder from 'src/components/order-list.vue'
import TabCustomer from 'src/components/customer-list.vue'
import TabSupplier from 'src/components/supplier-list.vue'
import TabCategory from 'src/components/category-list.vue'
import TabShop from 'src/components/shop-list.vue'
import TabList from 'src/components/send-list.vue'

const tab = ref("Tab")
</script>
