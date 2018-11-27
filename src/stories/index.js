import Vue from 'vue';

import { storiesOf } from '@storybook/vue';

import autoComplete from '../components/autoComplete.vue';
import testData from '../assets/testData.json';
import pagination from '../components/pagination.vue';
import testImg from '../assets/Penguins.jpg';
import imageCropper from '../components/imageCropper.vue';
storiesOf('AutoComplete', module)
  .add('test autoComplete component', () => ({
    data(){
        return{
            value:'',
            search:function(val,cb){
                if(val){
                    var rs = testData.autoCompleteComponentTestData.filter(x=>x.name.includes(val));
                    cb(rs);
                }
            },
            selectItem:'',
            warning:'not find!'
        }
    },
    methods: {
        onSelect:function(item){
            this.selectItem = JSON.stringify(item);
        }
    },
    components: { 'auto-complete':autoComplete },
    template: `
    <div style='margin:20px auto;width:200px;'>
        <auto-complete v-on:selected="onSelect" v-model="value" v-bind:search-function="search">
            <span slot="warning">{{warning}}</span>
        </auto-complete>
        <div><span>选中：</span><span>{{selectItem}}</span></div>
    </div>`
  }));

storiesOf('Pagination', module).add('test pagination component',()=>({
    data(){
        return{
            pageSizeSet:[10,25,50],
            total:500
        }
    },
    components:{
        'pagination':pagination
    },
    template:`<div><pagination v-bind:page-size-set="pageSizeSet" v-bind:total="total"></pagination></div>`

}));

storiesOf('ImageCropper',module).add('test imageCropper component',()=>({
    data(){
        return{
            img:testImg
        }
    },
    components: {
        'image-cropper':imageCropper
    },
    template:`<div style="width:500px;height:500px;"><image-cropper v-bind:img-src="img"></image-cropper></div>`
}));