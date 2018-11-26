<template>
     <div v-bind:id="containerId" class="container">
        <img id="source" v-bind:src="imgSrc">
        <canvas v-bind:id="canvasId" v-bind:width="canvasWidth" v-bind:height="canvasHeight"
            v-on:mousedown="onCanvasMouseDown" 
            v-on:mousemove="onCanvasMouseMove" 
            v-on:mouseup="onCanvasMouseUp"
            v-on:mouseout="onCanvasMouseOut"
            draggable="false"></canvas>
    </div>
</template>
<style scoped>
    .container{
        position: relative;
        padding: 0;
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
            clipHeight: 0
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
                    }
                    this.startX = this.startY = 0;
                    this.clear();
                }
            },
            onCanvasMouseOut:function(ev){
                if (ev) {
                    if (this.isMousePressed) {
                        this.isMousePressed = false;
                        //this.showOutput();
                        this.startX = this.startY = 0;
                        this.clear();
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
                if (this.ctx) {
                    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                }
            }
    }

}
</script>

