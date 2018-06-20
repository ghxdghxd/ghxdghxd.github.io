
var langtmp = [];
var langds = [];
function inisedifr(code){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            var nds = code+1;
            if(isNaN(code) === false){
                var sdxd = JSON.parse(this.responseText);
                langtmp.push(sdxd['translation']);
                if(code === 4){
                    localStorage.setItem('dulang',langtmp.toString());
                }else{
                    inisedifr(nds);
                }
            }else{
                listengerdata(this.responseText,1,code);
            }
        }
    };

    if(code === 0 || code === 1 || code === 2 || code === 3 || code === 4){
        var ln = window.navigator.language||navigator.browserLanguage;
        var t = ['Descargar video','Video y Audio','Solo Video','Solo Audio','Descargar en '];
        if(langds.length == 0){
            langds.push(t);
        }
        xhttp.open("GET", '//statickidz.com/scripts/traductor/index.php?source=es&target='+ln+'&q='+encodeURIComponent(t[code]), true);
    }else{
        xhttp.open("GET", '//you2go.me/api/youtube/ins.php?v='+code, true);
    }
    xhttp.send();
}
if(typeof(localStorage) !== "undefined"){
    if(localStorage.getItem('dulang')){
        var lang = localStorage.getItem('dulang').split(',');
    }else{
        inisedifr(0);
        var lang = langds[0];
    }
} else {
    var lang = ['DOWNLOAD VIDEO','VIDEO AND AUDIO','VIDEO WITHOUT AUDIO','AUDIO WITHOUT VIDEO','DOWNLOAD IN'];
}
function hidesend(cd,code){
    if(cd===0){
        var idv = document.getElementById('dukaroyoo');
        if(idv){
            idv.setAttribute('style', 'display:none');
        }
    }else{
        var idv = document.getElementById('dukaroyoo'+code);
        if(idv){
            idv.setAttribute('style', 'display:none');
        }
    }
}
function deleteifram(){
    document.getElementById('likeextension').setAttribute('style','display:none');
    localStorage.setItem('extelinke','1');
}
//desactivado por acelerar descarga
function downloaderio(){
    if(typeof(localStorage) !== "undefined"){
        if(localStorage.getItem('extelinke')){
            var lang = localStorage.getItem('extelinke');
        }else{
            if(!document.getElementById('likeextension')){
                var ifr = '<div class="fiexdaddaasd" id="likeextension"><div class="conatinerifrmaser"><a class="delertinkna" onclick="deleteifram()">X</a><iframe class="sdxiframelike" src="//titanshost.com/ads/like.php"></iframe></div></div>'
                document.getElementsByTagName('body')[0].insertAdjacentHTML("beforeend",ifr);
            }
        }
    }
}
function listengerdata(data,cd,code){
    if(document.getElementById('btndukaroyoo').getAttribute('down')=='false'){
        var ns = [];
        if(data!=='0'){
            var datauk = JSON.parse(data);
            var datauk = datauk['data']['dir'];
            for(var i = 0;i<datauk.length;i++){
                if(datauk[i]['itagInfo']){
                    if(datauk[i]['itagInfo']['withVideo'] == true && datauk[i]['itagInfo']['withAudio'] == true){
                        var ifd = document.getElementById('dukaaudiovideo');
                    }else if(datauk[i]['itagInfo']['withVideo'] == true || datauk[i]['itagInfo']['withAudio'] == false){
                        var ifd = document.getElementById('dukavideo');
                    }else if(datauk[i]['itagInfo']['withVideo'] == false || datauk[i]['itagInfo']['withAudio'] == true){
                        var ifd = document.getElementById('dukaaudio');
                        if(/m4a/i.test(datauk[i]['itagInfo']['format'])){
                            ns.push(datauk[i]['youtubeItag']);
                        }
                    }
                    if(i % 2 == 0) { var otherclass=  "par"; } else {var otherclass= "impar";}
                    var ifr = '<li class="listulli '+otherclass+'" ><a href="'+datauk[i]['url']+'" class="aullist" download><span class="fnt">'+datauk[i]['itagInfo']['format']+'</span><span class="fnt">'+datauk[i]['itagInfo']['quality']+'</span><span class="fnt">'+datauk[i]['itagInfo']['version']+'</span><span class="fnt">'+datauk[i]['fileSizeHuman']+'</span></a></li>';
                    ifd.insertAdjacentHTML("beforeend",ifr);
                }
            }
            if(ns[0]){
                var mp3 = 'http://you2go.me/api/youtube/download.php?v='+code+'|'+ns[0]+'&mp3=true';
                var ifr = '<li class="listulli audiodownload"><a href="'+mp3+'" class="aullist" target="_blank"><span class="fnt">'+lang[4]+' MP3</sapn></a></li>';
                document.getElementById('dukaaudio').insertAdjacentHTML("beforeend",ifr);
            }
            document.getElementById('btndukaroyoo').setAttribute('down','true');
            document.getElementById('dukaloading').setAttribute('style','block');
        }
    }
}
function iniciar(code){
    var sdv = document.getElementById('contanerdbt');
    if(sdv){
        var cartDiv = "<div class='dataintshow' id='btndukaroyoo"+code+"'><span id='btndukaroyoo' down=\"false\" class='btnopendata'><img class=\"btnplayimg\" src=\"https://titanshost.com/cloud/media/btn.png\"/></span><div id='dukaroyoo' class='conatinerdatadukaro' style='display:none'><div class='containerlistup'><div id=\"dukaloading\" style=\"display:none\"><ul class='ullist' id='dukaaudiovideo'><li class=\"listulli audiovideo\">"+lang[1]+"</li></ul><ul class='ullist' id='dukavideo'><li class=\"listulli noaudio\">"+lang[2]+"</li></ul><ul class='ullist' id='dukaaudio'><li class=\"listulli novideo\">"+lang[3]+"</li></ul></div></div></div></div>";
        sdv.insertAdjacentHTML("beforeend",cartDiv);
        document.getElementById('btndukaroyoo').addEventListener('click',function(){
            var sedsdc = document.getElementById('dukaroyoo');
            if(/none/i.test(sedsdc.getAttribute('style'))){
                sedsdc.setAttribute('style','display:block');
            }else{
                sedsdc.setAttribute('style','display:none');
            }
            if(this.getAttribute('down')=='false'){
                inisedifr(code);
            }
        });
    }
}
(function(){
    "use strict";
    setInterval(function(){
        var URLyou = window.location.href;
        if(/youtube\.com/i.test(URLyou) && /watch/i.test(URLyou)){
            var bd = document.getElementsByTagName('body')[0];
            bd.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="//titanshost.com/require/youtune/youtune.css" /><div id="contanerdbt"></div>');
            var idf = document.getElementById('contanerdbt');
                var dcds = window.location.href;
                if(/.com\/watch\?v/i.test(dcds)){
                    var dxd = dcds.split('?v=');
                    var dcv = dxd[1].split('=');
                    if(!document.getElementById('btndukaroyoo'+dcv[0])){
                        idf.innerHTML = '';
                        iniciar(dcv[0]);
                    }
                }
        }
    },1000);
})();