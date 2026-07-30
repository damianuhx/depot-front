import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";

const runtimeConfig =
  typeof window !== "undefined" && window.__APP_CONFIG__
    ? window.__APP_CONFIG__
    : {};
const baseURL =
  runtimeConfig.API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8860/";

const api = axios.create({
  baseURL: baseURL,
});

const datian={
baseURL: baseURL,
token: '',

setToken: function (token) {
  this.token = token || '';
  if (this.token) {
    api.defaults.headers.common.Authorization = this.token;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
},

update: function (object, path) {
  //update
  api.patch(path, object, {headers: { 'Authorization': this.token } }
  ).then(res => {
    api.get(path+'//'+object.id, {headers: { 'Authorization': this.token }}).then((res) => {
      object = res.data.data;
    });
  })},

  delete: function (object, path, remove, index) {
    console.log(this.token);
    api.delete(path, {headers: { 'Authorization': this.token}, data: object}).then((res) => {
      console.log(res);
      remove.splice(index,1);
  })},

  create: function (object, path, append=null) {
    //update
    //console.log(object);
    api.post(path, object, {headers: { 'Authorization': this.token }}).then(res => {
      let id = res.data.data.id;
      console.log(path+'//'+id);
      api.get(path+'//'+id, {headers: { 'Authorization': this.token }}).then((res) => {
        console.log(res.data);
        if (append==null){ //replaces the current entry
          object=res.data.data;
        }
        else{ //adds returned element to the array
          append.splice(-1, 0, res.data.data);
        }
        return res.data.data;
      });
    })},

    read:null,
    all:null,

    round: function (number){
      return (Math.round(number * 100) / 100).toFixed(2);
    },

    find: function (array, id){
      return( array.find((object) => object.id == id));
    },

  }

  //call read
  //replace object with return

export default boot(({ app }) => {

api.interceptors.response.use((response)=>{
  if (response.config.method !== 'get') {
    Notify.create({
      type: "positive",
      timeout:2000,
      message: response.config.method=="post"?"Created": response.config.method=="patch"?"Edited":"Deleted",
    });
  }
  return response;

})
});

export { api, datian };
