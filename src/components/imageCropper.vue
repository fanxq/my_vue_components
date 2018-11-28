<template>
     <div v-bind:id="containerId" class="container">
        <img id="source" v-bind:src="imgSrc" draggable="false">
        <canvas v-bind:id="canvasId" v-bind:width="canvasWidth" 
            v-bind:height="canvasHeight"
            v-on:mousedown="onCanvasMouseDown" 
            v-on:mousemove="onCanvasMouseMove" 
            v-on:mouseup="onCanvasMouseUp"
            v-on:mouseout="onCanvasMouseOut"
            ></canvas>
        <div v-show="showBtns" style="position:absolute;" v-bind:style="{left:btnsLeft,top:btnsTop}">
            <button type="button" class="btn btn-sm btn-ok" v-on:click="save">&#x2714;</button>
            <button type="button" class="btn btn-sm btn-cancel" v-on:click="cancel">&#x2718;</button>
        </div>
    </div>
</template>
<style scoped>
    .container{
        position: relative;
        padding: 0;
        width: 100%;
        height: 100%;
    }
    .container img{
        width: 100%;
        height: 100%;
        margin: 0;
    }
    .container canvas{
        position: absolute;
        left: 0;
        top: 0;
        margin: 0;       
    }
    .container .btn{
        color: white;
    }
    .btn-ok{
        background-color: #23dc80;
        border-radius: 100%;
        opacity: 0.5;
    }
    .btn-ok:hover{
        background-color: #1ba560;
    }
    .btn-cancel{
        background-color: #de584e;
        border-radius: 100%;
        opacity: 0.5;
    }
    .btn-cancel:hover{
        background-color: #d33427;
    }
</style>
<script>
export default {
    data(){
        return {
            canvasWidth:500,
            canvasHeight:500,
            startX: 0,
            startY: 0,
            isMousePressed: false,
            scale: 1,//缩放比例
            imgLeft: 0,
            imgTop: 0,
            canvasId:`canvas-${new Date().getTime()}`,
            containerId:`container-${new Date().getTime()}`,
            clipWidth: 0,
            clipHeight: 0,
            showBtns:false,
            btnsLeft:0,
            btnsTop:0
        }
    },
    props:['imgSrc'],
    mounted(){
        var container = document.getElementById(this.containerId);
        this.canvasWidth = container.clientWidth;
        this.canvasHeight = container.clientHeight;
        var canvas = document.getElementById(this.canvasId);
        this.ctx = canvas.getContext('2d');
    },
    methods:{
        onCanvasMouseDown: function (ev) {
            if (ev) {
                this.isMousePressed = true;
                this.startX = ev.offsetX;
                this.startY = ev.offsetY;
            }
        },
        onCanvasMouseMove: function (ev) {
            if (this.isMousePressed && ev) {
                this.clipWidth = ev.offsetX - this.startX;
                this.clipHeight = ev.offsetY - this.startY;
                this.draw(this.clipWidth, this.clipHeight);
            }
        },
        onCanvasMouseUp:function(ev){
            if (ev) {
                this.isMousePressed = false;
                var deltaX = ev.offsetX - this.startX;
                var deltaY = ev.offsetY - this.startY;
                if (Math.abs(deltaX) > 0 && Math.abs(deltaY) > 0) {
                    //this.showOutput();
                    this.btnsLeft = `${Math.min(ev.offsetX, this.startX)}px`;
                    this.btnsTop = `${Math.max(ev.offsetY, this.startY) + 2}px`;
                    this.showBtns = true;
                   
                }else{
                    this.clear();
                }
                // this.startX = this.startY = 0;
                // this.clear();
            }
        },
        onCanvasMouseOut:function(ev){
            if (ev) {
                if (this.isMousePressed) {
                    this.isMousePressed = false;
                    this.showBtns = true;
                    //this.showOutput();
                    // this.startX = this.startY = 0;
                    // this.clear();
                }
            }
        },
        draw: function (rectW, rectH) {
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                this.ctx.fillStyle = "rgba(128,128,128,0.5)";
                this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                var originalStartX = this.startX;
                var originalStartY = this.startY;
                if (rectW < 0) {
                    this.startX = this.startX + rectW;
                    rectW = Math.abs(rectW);
                }
                if (rectH < 0) {
                    this.startY = this.startY + rectH;
                    rectH = Math.abs(rectH);
                }

                this.ctx.clearRect(this.startX, this.startY, rectW, rectH);
                this.ctx.strokeStyle = "red";
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(this.startX, this.startY, rectW, rectH);
                this.ctx.font = "12px Microsoft YaHei";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(`${rectW}×${rectH}`, this.startX, this.startY-2);
                this.startX = originalStartX;
                this.startY = originalStartY;
            }
        },
        clear: function () {
            this.startX = this.startY = 0;
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            }
            this.showBtns = false;
        },
        save:function() {
            
        },
        cancel:function(){
            this.clear();
        }
    }

}
</script>

