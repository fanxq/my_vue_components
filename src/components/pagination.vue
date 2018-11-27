<template>
    <div class="pagination-container">
            <div class="pagination-detail">
                <span>{{paginationInfo}}</span>
                <span>每页显示 
                    <span>
                        <select v-model="pageSize"><option v-for="item in pageSizeSet" v-bind:key="item" v-bind:value="item">{{item}}</option></select>
                    </span> 条记录
                </span>
            </div>
            <div class="pagination-bar">
                <ul class="pagination" v-on:click="onPageNumSelected">
                    <li class="page-pre"><a href="#">‹</a></li>
                    <li v-for="(item,index) in pageNumList" v-bind:key="index" v-bind:class="{active: item.isActive,disabled:item.isDisabled}">
                        <a href="#">{{item.num}}</a>
                    </li>
                    <li class="page-next"><a href="#">›</a></li>
                </ul>
            </div>
        </div>
</template>
<style scoped>
    .pagination-container .pagination-bar,
    .pagination-container .pagination-detail {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .pagination-container .pagination-detail{
        float: left !important;
    }
    .pagination-container .pagination-bar{
        float: right !important;
    }
    .pagination-container .pagination-bar .pagination {
        margin: 0;
    }

    .pagination-container .pagination a {
        padding: 6px 12px;
        line-height: 1.428571429;
    }
    
    .pagination-container .pagination a{
        background-color: #eff0f4;
        border: 1px solid #ffffff;
        color: black;
        cursor: default;
        text-decoration: none;
    }
    .pagination-container .pagination a:hover{
        background-color: #65cea7;
        color: white;
    }

    .pagination-container li.active a{
        background-color: #34a57a;
        color: white;
    }
    .pagination-container li.disabled a {
        pointer-events: none;
        cursor: default;
        background-color: #e8e9f0;
    }

    .pagination-container:after {
        content: "";
        display: block;
        clear: both;
    }
</style>
<script>
    export default {
        data(){
            return {
                pageIndex:1,
                pageCount:1,
                pageNumList: [],
                pageSize:this.pageSizeSet[0]
            }
        },
        props:{
            total:{
                require:true,
                type:Number
            },
            pageSizeSet:{
                type:Array,
                default:[10, 20, 25],
                validator:function(value){
                    if(!value || value.length === 0){
                        return false;
                    }
                    return true;
                }
            }
        },
        computed: {
            paginationInfo: function () {
                var count = this.pageIndex * this.pageSize;
                if (count > this.total) {
                    count = this.total;
                }
                return `显示第 ${(this.pageIndex - 1) * this.pageSize + 1} 到第 ${count} 条记录，总共 ${this.total} 条记录`;
            }
        },
        watch:{
            total:{
                handler:function(val){
                    this.pageCount = parseInt(val / this.pageSize) + (val % this.pageSize ? 1 : 0);
                    this.renderPageNumList(this.pageIndex);
                },
                immediate:true
            },
            pageSize: function (val, oldVal) {
                if (val) {
                    var cnt = this.pageIndex * oldVal;
                    var allCnt = cnt > this.total ? this.total : cnt;
                    var diff = parseInt(allCnt / val);
                    var diff1 = (allCnt) % val ? 1 : 0;
                    var oldPageIndex = JSON.parse(JSON.stringify(this.pageIndex));
                    this.pageIndex = diff + diff1;
                    this.pageCount = parseInt(this.total / val) + (this.total % val ? 1 : 0);
                    if (this.pageIndex === oldPageIndex) {
                        this.renderPageNumList(this.pageIndex);
                        this.emitChangedEvent();
                    }
                }        
            },
            pageIndex: {
                handler: function (val) {
                    this.renderPageNumList(val);
                    this.emitChangedEvent();
                },
                immediate: true
            }
        },
        methods:{
            emitChangedEvent:function(){
                this.$emit('changed',{pageIndex:this.pageIndex, pageSize:this.pageSize});
            },
            createPageNum:function(i){
                var temp = {};
                temp.num = i;
                temp.isActive = (i === this.pageIndex ? true : false);
                temp.isDisabled = (i === '...' ? true : false);
                return temp;
            },
            onPageNumSelected: function (ev) {
                if (ev) {
                    var t = ev.target;
                    if (t.tagName === 'A') {
                        if (t.textContent === '‹') {
                            var diff = this.pageIndex - 1;
                            if (diff < 1) {
                                this.pageIndex = this.pageCount;
                            } else {
                                this.pageIndex = diff;
                            }
                        }
                        if (t.textContent === '›') {
                            var diff = this.pageIndex + 1;
                            if (diff > this.pageCount) {
                                this.pageIndex = 1;
                            } else {
                                this.pageIndex = diff;
                            }
                        }
                        if (t.textContent !== '...' && t.textContent !== '‹' && t.textContent !== '›') {
                            this.pageIndex = Number(t.textContent);
                        }
                    }
                }
            },
            renderPageNumList: function (val) {
                if (this.pageCount < 8) {
                    var pageNoList = [];
                    for (var i = 1; i <= this.pageCount; i++) {
                        pageNoList.push(this.createPageNum(i));
                    }
                    this.pageNumList.splice(0, this.pageNumList.length, ...pageNoList);
                } else {
                    var pageNoList = [];
                    if (val === 1) {
                        for (var i = 1; i <= 5; i++) {
                            pageNoList.push(this.createPageNum(i));
                        }
                        pageNoList.push(this.createPageNum('...'));
                        pageNoList.push(this.createPageNum(this.pageCount));
                    } else if (val === this.pageCount) {
                        pageNoList.push(this.createPageNum(1));
                        pageNoList.push(this.createPageNum('...'));
                        for (var i = val - 5; i <= val; i++) {
                            pageNoList.push(this.createPageNum(i));
                        }
                    } else {
                        var leftDistance = val - 1;
                        var rightDistance = this.pageCount - val;
                        if (leftDistance + rightDistance >= 7) {
                            if (leftDistance >= rightDistance) {
                                pageNoList.push(this.createPageNum(1));
                                pageNoList.push(this.createPageNum('...'));
                                if (rightDistance >= 4) {
                                    pageNoList.push(this.createPageNum(val - 1));
                                    pageNoList.push(this.createPageNum(val));
                                    pageNoList.push(this.createPageNum(val + 1));
                                    pageNoList.push(this.createPageNum('...'));
                                    pageNoList.push(this.createPageNum(this.pageCount));
                                } else {
                                    for (var i = this.pageCount - 5; i <= this.pageCount; i++) {
                                        pageNoList.push(this.createPageNum(i));
                                    }
                                }
                            } else {
                                if (leftDistance >= 4) {
                                    pageNoList.push(this.createPageNum(1));
                                    pageNoList.push(this.createPageNum('...'));
                                    pageNoList.push(this.createPageNum(val - 1));
                                    pageNoList.push(this.createPageNum(val));
                                    pageNoList.push(this.createPageNum(val + 1));
                                } else {
                                    for (var i = 1; i <= 5; i++) {
                                        pageNoList.push(this.createPageNum(i));
                                    }
                                }
                                pageNoList.push(this.createPageNum('...'));
                                pageNoList.push(this.createPageNum(this.pageCount));
                            }
                        }
                    }
                    this.pageNumList.splice(0, this.pageNumList.length, ...pageNoList);
                }
            }
        }
    }
</script>