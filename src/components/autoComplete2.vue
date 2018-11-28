<template>
    <div style="position:relative;">
        <input type="text" v-bind:id="inputId" class="form-control form-control-sm" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" v-bind:disabled="disable">
        <ul class="my-select" v-show="show">
            <!-- <li v-for="(item, index) in options" v-bind:key="index" v-bind:class="[liStyle,{'item-selected':index === activeIndex}]">{{item.name}}</li> -->
            <li v-for="(option,index) in options" v-bind:key="index" v-bind:class="{'active':index === activeIndex}">
                <slot name="option" :option="option"></slot>
            </li>
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
        border: 1px solid rgba(50, 50, 250, 0.45);
        position:absolute;
        left:0;
        top:34px;
        z-index:999;
        background-color:#fff;
        width:100%;
    }

    .my-select .item {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        padding-right:10px;
        white-space:nowrap;   
        overflow:hidden;         
        text-overflow: ellipsis;  
    }

    .my-select .item:hover {
        background-color: rgba(50, 50, 250, 0.45);
        color: white;
    }

    .my-select .item-selected {
        background-color: rgba(50, 50, 250, 0.705);
        color: white;
    }
    .warning{
        background-color:#f2dede;color:red;
        padding: 5px 5px;
    }
</style>
<script>
export default {
    data: function () {
        return {
            show: false,
            select: false,
            activeIndex: 0,
            showWarning: false,
            inputId: 'input-' + new Date().getTime(),
            init:false
        }
    },
    props:{
        disable:{
            type:Boolean,
            default:false
        },
        options:{
            type:Array,
            required:true
        },
        value:{
            type:String,
            required:true
        }
    },
    watch: {
        select: function (val) {
            if (val && this.options.length > 0 && this.activeIndex < this.options.length) {
                this.$emit('selected', this.options[this.activeIndex]);
            }
        },
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
                    if (!this.wait) {
                        this.searchFunction(val, this.onSearch);
                        this.wait = true;
                        setTimeout(function () {
                            self.wait = false;
                        }, 300);
                    }

                } else {
                    console.log("not selected!");
                    this.select = false;
                    this.$emit('selected', null);
                    this.show = false;
                }
            },
            immediate:true
        }
    },
    methods: {
        onSearch: function (findResult) {
            if (findResult && findResult.length > 0 && this.value) {
                var findIndex = 0;
                if (Array.prototype.findIndex) {
                    findIndex = findResult.findIndex(x=>x.name === this.value);
                }
                this.show = true;
                this.activeIndex = findIndex === -1 ? 0 : findIndex;
                this.options.splice(0, this.options.length, ...findResult);
            } else {
                this.show = false;
                this.activeIndex = 0;
                this.options.splice(0, this.options.length);
                this.showWarning = true;
                this.$emit('selected', null);
            }
        },
        setSelected: function (val) {
            if (val === this.value) {
                this.select = false;
            } else {
                this.select = true;
            }
        }
    },
    mounted () {
        var self = this;
        var inputCtr = document.getElementById(self.inputId);
        document.addEventListener('click', function (e) {
            var target = e.target;
            if (self.show) {
                if (target.tagName === 'LI' && target.classList.contains('item')) {
                    var index = -1;
                    self.options.forEach(function (x, idx) {
                        if (x.name === target.textContent) {
                            index = idx;
                            return;
                        }
                    });
                    if (index !== -1) {
                        self.activeIndex = index;
                        self.setSelected(target.textContent);
                        self.$emit('input', target.textContent);
                    }
                }
                else {
                    self.activeIndex = 0;
                    self.setSelected(self.options[0].name);
                    self.$emit('input', self.options[0].name);
                }
                self.show = false;
            }
        }, false);

        document.addEventListener('keydown', function (e) {
            if (e && self.show) {
                switch (e.keyCode) {
                    case 38:
                        //$("#" + self.inputId).blur();
                        inputCtr.blur();
                        self.activeIndex = self.activeIndex - 1;
                        self.activeIndex = (self.activeIndex >= 0 ? self.activeIndex : 0);
                        break;
                    case 40:
                        inputCtr.blur();
                        self.activeIndex = self.activeIndex + 1;
                        self.activeIndex = (self.activeIndex >= self.options.length ? self.options.length - 1 : self.activeIndex);
                        break;
                    case 13:
                        self.setSelected(self.options[self.activeIndex].name);
                        self.$emit('input', self.options[self.activeIndex].name);
                        self.show = false;
                        inputCtr.focus();
                        break;
                }
            }
        }, false);
    }
}
</script>

