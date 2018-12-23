<template>
    <div style="position:relative;">
        <input type="text" v-bind:id="inputId" class="form-control form-control-sm" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" v-bind:disabled="disable">
        <ul class="my-select" v-show="show">
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
        border: 1px solid rgba(50, 50, 250, 0.45);
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
    }

    .my-select li:hover {
        background-color: rgba(50, 50, 250, 0.45);
        color: white;
    }

    .my-select li.active {
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
            init:false,
            filteredOptions:[]
        }
    },
    props: ['disable','value', 'options'],
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
                this.activeIndex = 0; //findIndex === -1 ? 0 : findIndex;
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
        }
    },
    mounted () {
        var self = this;
        var inputCtr = document.getElementById(self.inputId);
        document.addEventListener('click', function (e) {
            var target = e.target;
            if (self.show) {
                if (target.tagName === 'LI' && target.parentNode && target.parentNode.classList.contains('my-select')) {
                    var selectedOption = target.getAttribute('data');
                    self.setSelected(selectedOption);
                    self.$emit('input', selectedOption);
                }
                else {
                    self.setSelected(self.filteredOptions[self.activeIndex||0].data);
                    self.$emit('input', self.filteredOptions[self.activeIndex||0].data);
                }
               
                self.show = false;
            }
        }, false);

        document.addEventListener('keydown', function (e) {
            if (e && self.show) {
                switch (e.keyCode) {
                    case 38:
                        inputCtr.blur();
                        self.activeIndex = self.activeIndex - 1;
                        self.activeIndex = (self.activeIndex >= 0 ? self.activeIndex : 0);
                        break;
                    case 40:
                        inputCtr.blur();
                        self.activeIndex = self.activeIndex + 1;
                        self.activeIndex = (self.activeIndex >= self.filteredOptions.length ? self.filteredOptions.length - 1 : self.activeIndex);
                        break;
                    case 13:
                        self.setSelected(self.filteredOptions[self.activeIndex].data);
                        self.$emit('input', self.filteredOptions[self.activeIndex].data);
                        self.show = false;
                        inputCtr.focus();
                        break;
                }
            }
        }, false);
    }
}
</script>

