<template>
    <div style="position:relative;">
        <input type="text" v-bind:id="inputId" class="form-control input-sm" v-bind:value="value" v-on:input="$emit('input', $event.target.value)" v-bind:disabled="disable">
        <ul class="my-select" v-show="show" v-bind:id="selectId">
            <li v-for="(item, index) in items" v-bind:key="index" v-bind:class="[liStyle,{'item-selected':index === selectedIndex}]">{{item.name}}</li>
        </ul>
        <div class="format-err" v-show="showErr">{{warning}}</div>
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
    .format-err{
        background-color:#f2dede;color:red;
    }
</style>
<script>
export default {
    data: function () {
        return {
            items: [],
            selectId: new Date().getTime(),
            show: false,
            select: false,
            liStyle: 'item',
            selectedIndex: 0,
            wait: false,
            showErr: false,
            inputId: 'input-' + new Date().getTime(),
            init:false
        }
    },
    props: ['disable','value', 'searchFunction','warning'],
    watch: {
        select: function (val) {
            if (val && this.items.length > 0 && this.selectedIndex < this.items.length) {
                this.$emit('selected', this.items[this.selectedIndex]);
            }
        },
        value:{
            handler:function(val){
                this.showErr = false;
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
                this.selectedIndex = findIndex === -1 ? 0 : findIndex;
                this.items.splice(0, this.items.length, ...findResult);
            } else {
                this.show = false;
                this.selectedIndex = 0;
                this.items.splice(0, this.items.length);
                this.showErr = true;
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
                    self.items.forEach(function (x, idx) {
                        if (x.name === target.textContent) {
                            index = idx;
                            return;
                        }
                    });
                    if (index !== -1) {
                        self.selectedIndex = index;
                        self.setSelected(target.textContent);
                        self.$emit('input', target.textContent);
                    }
                }
                else {
                    self.selectedIndex = 0;
                    self.setSelected(self.items[0].name);
                    self.$emit('input', self.items[0].name);
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
                        self.selectedIndex = self.selectedIndex - 1;
                        self.selectedIndex = (self.selectedIndex >= 0 ? self.selectedIndex : 0);
                        break;
                    case 40:
                        inputCtr.blur();
                        self.selectedIndex = self.selectedIndex + 1;
                        self.selectedIndex = (self.selectedIndex >= self.items.length ? self.items.length - 1 : self.selectedIndex);
                        break;
                    case 13:
                        self.setSelected(self.items[self.selectedIndex].name);
                        self.$emit('input', self.items[self.selectedIndex].name);
                        self.show = false;
                        inputCtr.focus();
                        break;
                }
            }
        }, false);
    }
}
</script>

