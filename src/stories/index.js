import Vue from 'vue';

import {
    storiesOf
} from '@storybook/vue';

import autoComplete from '../components/autoComplete.vue';
import {
    records,
    randomTexts
} from '../assets/testData.js';
import pagination from '../components/pagination.vue';
import testImg from '../assets/Penguins.jpg';
import imageCropper from '../components/imageCropper.vue';

storiesOf('AutoComplete', module)
    .add('test autoComplete component', () => ({
        data() {
            return {
                value: '',
                options: randomTexts,
                warning: 'not find!'
            }
        },
        components: {
            'auto-complete': autoComplete
        },
        template: `
    <div style='margin:20px auto;width:200px;'>
        <auto-complete v-model="value" v-bind:options="options" placeholder="请输入任意字母">
            <span slot="warning">{{warning}}</span>
        </auto-complete>
    </div>`
    }));

storiesOf('Pagination', module).add('test pagination component', () => ({
    data() {
        return {
            pageSizeSet: [10, 25, 50],
            total: 500
        }
    },
    components: {
        'pagination': pagination
    },
    template: `<div><pagination v-bind:page-size-set="pageSizeSet" v-bind:total="total"></pagination></div>`

})).add('test pagination with table', () => ({
    data() {
        return {
            rows: records.slice(0, 10),
            total: records.length,
            pageSizeSet: [10, 25, 50],
            theads: ['Index', 'Name', 'Age', 'Scores', 'Class', 'Description']
        }
    },
    components: {
        'pagination': pagination
    },
    methods: {
        onPageChanged: function (pageInfo) {
            var startIndex = (pageInfo.pageIndex - 1) * pageInfo.pageSize;
            var endIndex = pageInfo.pageIndex * pageInfo.pageSize;
            this.rows.splice(0, this.rows.length, ...records.slice(startIndex, endIndex));
        }
    },
    template: `<div style="width:900px;height:600px;">
        <table class="table">
            <thead>
                <th v-for="thead in theads">{{thead}}</th>
            </thead>
            <tbody>
                <tr v-for="row in rows">
                    <td>{{row.index}}</td>
                    <td>{{row.name}}</td>
                    <td>{{row.age}}</td>
                    <td>{{row.scores}}</td>
                    <td>{{row.class}}</td>
                    <td>{{row.description}}</td>
                </tr>
            </tbody>
        </table>
        <pagination v-bind:page-size-set="pageSizeSet" v-bind:total="total" v-on:changed="onPageChanged"></pagination>
    </div>`
}));

storiesOf('ImageCropper', module).add('test imageCropper component', () => ({
    data() {
        return {
            img: testImg
        }
    },
    components: {
        'image-cropper': imageCropper
    },
    methods: {
        showOutPut: function (src) {
            if (src) {
                document.getElementById('output').innerHTML = `<img src="${src}">`;
            }
        }
    },
    template: `
    <div>
        <div style="width:900px;height:650px;">
            <image-cropper v-bind:img-src="img" v-on:output="showOutPut"></image-cropper>
        </div>
        <div style="margin-top:10px;">
            <h4>Output</h4>
            <div id="output">
            </div>
        </div>
        
    </div>`
}));