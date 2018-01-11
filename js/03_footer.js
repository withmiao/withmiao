/**
 * 页面尾部加载
 */
(()=>{
    ajax("get","03_footer.html","","text")
        .then(html=> {
            document.getElementById("footer")
                .innerHTML = html;
            //console.log(html);
        })
})();