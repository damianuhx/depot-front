import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";

const api = axios.create({
  baseURL: "https://urlofthebackend.org/", //change the url to your backend here
});

const datian={
//baseURL: "http://localhost:8888/depot/",
baseURL: "https://bestellen-api.livingroom-winterthur.ch/",
token: 'yehFFdo78LopIBZJvjIHsYu2tvc5mhKu3eCZ0rVvXMBXvhpmeW',

update: function (object, path) {
  //update
  console.log('CREATE');
    console.log(path);
    console.log(object);
  api.patch(path, object, {headers: { 'Authorization': this.token } }
  ).then(res => {
    api.get(path+'//'+object.id).then((res) => {
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
