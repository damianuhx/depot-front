
<template>
  Bestellungen: Hier kann definiert werden an welchen Daten Bestellungen getätigt werden
  <q-list bordered separator class="q-ma-md">
  <q-item clickable v-for="(order, i) in data.order" :key="i">

          <q-item-section>
              <q-input outlined v-model="order.name" label="name" />
          </q-item-section>

          <q-item-section style="max-width: 40px">
            <q-checkbox
            true-value="1"
            false-value="0"
            v-model="order.active" />
            <q-btn color="primary" icon="las la-paper-plane" @click="sendmails(order.id);" v-if="order.id" />
          </q-item-section><q-item-section>order_date
            <q-date
            v-model="order.order_date"
            mask="YYYY-MM-DD"
            minimal
            />
          </q-item-section><q-item-section>collect_date
            <q-date
            v-model="order.collect_date"
            mask="YYYY-MM-DD"
            minimal
            />
          </q-item-section><q-item-section side>

            <!--http://localhost:8888/depot/mail//3-->

<q-btn color="primary" icon="edit" @click="datian.update(order, 'order')" v-if="order.id" />
<q-btn color="positive" icon="add" @click="datian.create(order, 'order', data.order)" v-else />

</q-item-section>
<q-item-section side>
<q-btn color="negative" icon="delete" @click="datian.delete(order, 'order', data.order, i)" v-if="order.id" />
</q-item-section></q-item>
  </q-list>


  <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">You are currently not connected to any network.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Turn on Wifi" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </template>
<script setup>
import { api, datian} from "boot/axios";
import { onMounted, reactive, ref } from "vue";
const data = reactive({
  confirm: ref(false),
});



onMounted(() => {
load();
});
const load = () => {
  api.get("order", {headers: { 'Authorization': datian.token }}).then((res) => {
  data.order = res.data.data.order;
  data.order.push({name: "", active: "", order_date: "", collect_date: "", });
});}

const sendmails = (id) => {
  if (window.confirm("Hiermit wird an jeden Besteller ein Bestätigungsmail für diese Bestellung gesendet. Möchtest du das tun?")){
    api.get("mail//"+id, {headers: { 'Authorization': datian.token }}).then((res) => {
    window.alert('Gesendete Mails: '+res.data.data.sentmails);
});}}

</script>
