
<template>
  Hier werden alle registrierten Nutzer angezeigt. Bitte Häkchen setzen für gewünschte Berechtigungen.
  <q-list bordered separator class="q-ma-md">
  <q-item clickable v-for="(da_user, i) in data.da_user" :key="i">

          <q-item-section>
              <q-input outlined v-model="da_user.name" label="name" />
          </q-item-section>
          <q-item-section style="max-width: 40px">
            Überprüft
            <q-checkbox
            true-value="1"
            false-value="0"
            v-model="da_user.is_validated" />
          </q-item-section>
          <q-item-section style="max-width: 40px">
            Mitglied
            <q-checkbox
            true-value="1"
            false-value="0"
            v-model="da_user.is_member" />
          </q-item-section>
          <q-item-section style="max-width: 40px">
          Administrator
            <q-checkbox
            true-value="1"
            false-value="0"
            v-model="da_user.is_admin" />
          </q-item-section>
          <q-item-section>
              <q-input outlined v-model="da_user.address" label="address" />
          </q-item-section>

          <q-item-section>
              <q-input outlined v-model="da_user.city" label="city" />
          </q-item-section>

          <q-item-section>
              <q-input outlined v-model="da_user.mail" label="mail" />
          </q-item-section>
          <q-item-section side>
<q-btn color="primary" icon="edit" @click="datian.update(da_user, 'da_user')" v-if="da_user.id" />
<q-btn color="positive" icon="add" @click="datian.create(da_user, 'da_user', data.da_user)" v-else />

</q-item-section>
<q-item-section side>
<q-btn color="negative" icon="delete" @click="datian.delete(da_user, 'da_user', data.da_user, i)" v-if="da_user.id" />
</q-item-section></q-item>
  </q-list>
  </template>
<script setup>
import { api, datian} from "boot/axios";
import { onMounted, reactive, ref } from "vue";
const data = reactive({});
onMounted(() => {
load();
});
const load = () => {
  api.get("da_user", {headers: { 'Authorization': datian.token }}).then((res) => {
  data.da_user = res.data.data.da_user;
  //data.da_user.push({name: "", password: "", token: "", is_validated: "", is_admin: "", address: "", city: "", mail: "", });
});}
</script>
