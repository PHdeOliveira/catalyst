//Beta Branch
// Scripts for New Post Event Site
//Masonry Initialize
function twitterCall(){setTimeout(function(){document.querySelector(".twitter-container").hidden=!1;var e=document.getElementsByClassName("sm-twitter"),t=document.getElementById("twitter-widget-0"),n=t.contentDocument.firstChild.children[1].children[0].children[2],r=n.firstElementChild,i=r.children,s,o,u=document.getElementsByClassName("twitter-container"),a=[];for(var f=0;f<i.length;f++){e[f].firstElementChild.style.display="none";s=i[f];o=s.children[2];s.children[1].hidden=!0;s.children[3].hidden=!0;s.style.height="156px";s.style.position="relative";s.style.boxSizing="border-box";s.firstElementChild.style.position="absolute";s.firstElementChild.style.right="30px";s.firstElementChild.style.bottom="20px";s.firstElementChild.setAttribute("class","sm-date");o.style.padding="25px 30px 26px";o.firstElementChild.style.color="#fcfbf4";o.firstElementChild.style.fontSize="11px";o.firstElementChild.style.lineHeight="13px";o.firstElementChild.style.fontFamily="Avenir, helvetica, arial, sans-serif";o.firstElementChild.style.fontWeight=500;o.firstElementChild.style.margin=0;a.push(s)}for(var l=0;l<u.length;l++){a[l].setAttribute("class","h-entry with-expansion  customisable-border");u[l].replaceChild(a[l],u[l].firstElementChild)}},700);clearTimeout()}function vimeoLoad(){var e=document.getElementById("vimeo-container"),t=document.createElement("iframe");t.src="//player.vimeo.com/video/65696417";t.width=564;t.height=312;t.frameborder=0;t.webkitallowfullscreen=!0;t.mozallowfullscreen=!0;t.allowfullscreen=!0;e.appendChild(t)}function load(){twitterCall();vimeoLoad()}var container=document.querySelector(".masonry"),msnry=new Masonry(container,{itemSelector:".item",columnWidth:280,gutter:4});document.querySelector(".twitter-container").hidden=!0;window.onload=load;