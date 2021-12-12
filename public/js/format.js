try{
    const toolbar = document.getElementById("toolbar-container")
    const width = document.getElementById("editor-container").getBoundingClientRect().width
    toolbar.style.width = `${width}px`
    document.getElementById("editor-container").addEventListener("keydown", (function(e) {
        quill.disable()
        quill.enable()
        return false;
     }))
     document.getElementById("editor-container").addEventListener("click", (function(e) {
        quill.disable()
        quill.enable()
        return false;
     }))

}
    catch(error){
        console.log("Quill editor not on this page")
    }
try{
    const search_form = document.getElementById("search-form")

    const search_icon = document.getElementById("search-icon")
    search_icon.addEventListener("click", (e) => {
        search_form.submit()
    })
}
    catch(error){
        console.log("Search box not on this page")
    }
