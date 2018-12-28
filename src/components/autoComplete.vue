<template>
    <div style="position:relative;">
        <input type="text" v-bind:id="inputId" class="form-control form-control-sm" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" v-bind="$attrs">
        <ul class="my-select" v-show="show" @click="onOptionListClick">
            <li v-for="(option, index) in filteredOptions" v-bind:key="index" v-bind:class="{'active':index === activeIndex}" v-html="option.display" v-bind:data="option.data"></li>
        </ul>
        <div class="warning" v-show="showWarning">
            <slot name="warning">提示信息</slot>
        </div>
    </div>
</template>
<style scoped>
    .my-select {
        list-style: none;
        padding: 0px;
        margin: 0px;
        border: 1px solid #96c2efee;
        position:absolute;
        left:0;
        top:34px;
        z-index:999;
        background-color:#fff;
        width:100%;
    }

    .my-select li {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        padding-right:10px;
        white-space:nowrap;   
        overflow:hidden;         
        text-overflow: ellipsis;
        font-weight: bold;
        color: #7d7d7d;  
    }

    .my-select li:hover {
        background-color:#cccccc8a;
    }

    .my-select li.active {
        background-color:#96c2ef8a;
    }
    .warning{
        background-color:#f2dede;color:red;
        padding: 5px 5px;
    }
</style>
<script>
export default {
    inheritAttrs:false,
    data: function () {
        return {
            show: false,
            select: false,
            activeIndex: 0,
            showWarning: false,
            inputId: 'input-' + new Date().getTime(),
            init:false,
            filteredOptions:[]
        }
    },
    props: ['value', 'options'],
    watch: {
        value:{
            handler:function(val){
                this.showWarning = false;
                if(!this.init){
                    this.select = val ? true : false;
                    this.init = true;
                }
                if (val) {
                    if (this.select) {
                        this.select = false;
                        return;
                    }
                    var self = this;
                    this.onSearch(val);

                } else {
                    this.select = false;
                    this.show = false;
                }
            },
            immediate:true
        }
    },
    methods: {
        onSearch: function (val) {
            var findResult = this.options.filter(x=>x.includes(val));
            if (findResult && findResult.length > 0) {
                findResult = findResult.map(x=>{
                    return {
                        display:`${x.replace(new RegExp('('+val+')','g'),'<span style="color:red;">$1</span>')}`,
                        data:x
                    };
                })
                this.show = true;
                this.activeIndex = 0;
                this.filteredOptions.splice(0, this.filteredOptions.length, ...findResult);
            } else {
                this.show = false;
                this.activeIndex = 0;
                this.filteredOptions.splice(0, this.filteredOptions.length);
                this.showWarning = true;
            }
        },
        setSelected: function (val) {
            if (val === this.value) {
                this.select = false;
            } else {
                this.select = true;
            }
        },
        onOptionListClick:function(e) {
            var target = e.target;
            if (this.show) {
                if (target.tagName === 'LI' || target.tagName === 'SPAN') {
                    var selectedOption = target.getAttribute('data');
                    this.setSelected(selectedOption);
                    this.$emit('input', selectedOption);
                }
                else {
                    this.setSelected(this.filteredOptions[this.activeIndex||0].data);
                    this.$emit('input', this.filteredOptions[this.activeIndex||0].data);
                }
                this.show = false;
            }
        },
        onKeyDown:function(e) {
            if (e && this.show) {
                switch (e.keyCode) {
                    case 38:
                        this.activeIndex = this.activeIndex - 1;
                        this.activeIndex = (this.activeIndex >= 0 ? this.activeIndex : 0);
                        break;
                    case 40:
                        this.activeIndex = this.activeIndex + 1;
                        this.activeIndex = (this.activeIndex >= this.filteredOptions.length ? this.filteredOptions.length - 1 : this.activeIndex);
                        break;
                    case 13:
                        this.setSelected(this.filteredOptions[this.activeIndex].data);
                        this.$emit('input', this.filteredOptions[this.activeIndex].data);
                        this.show = false;
                        break;
                }
            }
        }
    },
    mounted () {
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    },
    destroyed(){
        console.log("onDestory");
        document.removeEventListener('keydown',this.onKeyDown);
    }
}
</script>

